from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import json
import shutil
import aiofiles
from email_service import email_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI(title="Soumam Heritage API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Setup upload directory
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files for serving uploaded images
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# --- Models ---

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    role: str = "user"  # "user" or "admin"
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "user"

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Category Models
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Dict[str, str]  # {"fr": "Dattes", "en": "Dates", "ar": "تمور"}
    slug: str  # URL-friendly name
    description: Optional[Dict[str, str]] = None
    icon: Optional[str] = "🛍️"  # Emoji or icon name
    image_url: Optional[str] = None
    order: int = 0  # For sorting
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CategoryCreate(BaseModel):
    name: Dict[str, str]
    slug: str
    description: Optional[Dict[str, str]] = None
    icon: Optional[str] = "🛍️"
    image_url: Optional[str] = None
    order: Optional[int] = 0
    is_active: Optional[bool] = True

class CategoryUpdate(BaseModel):
    name: Optional[Dict[str, str]] = None
    slug: Optional[str] = None
    description: Optional[Dict[str, str]] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Dict[str, str]
    description: Dict[str, str]
    category: str  # "epices", "thes", "robes-kabyles", "bijoux-kabyles"
    price: float
    currency: str = "EUR"
    image_urls: List[str]
    in_stock: bool = True
    origin: Dict[str, str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: Optional[str] = None

class ProductCreate(BaseModel):
    name: Dict[str, str]
    description: Dict[str, str]
    category: str
    price: float
    image_urls: List[str]
    origin: Dict[str, str]
    in_stock: bool = True

class ProductUpdate(BaseModel):
    name: Optional[Dict[str, str]] = None
    description: Optional[Dict[str, str]] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image_urls: Optional[List[str]] = None
    origin: Optional[Dict[str, str]] = None
    in_stock: Optional[bool] = None

# Historical Content Models
class HistoricalContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Dict[str, str]
    content: Dict[str, str]
    region: str  # "algerie", "kabylie", "vallee-soumam"
    image_urls: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: Optional[str] = None

class HistoricalContentCreate(BaseModel):
    title: Dict[str, str]
    content: Dict[str, str]
    region: str
    image_urls: List[str]

class HistoricalContentUpdate(BaseModel):
    title: Optional[Dict[str, str]] = None
    content: Optional[Dict[str, str]] = None
    region: Optional[str] = None
    image_urls: Optional[List[str]] = None

# Admin Statistics Model
class AdminStats(BaseModel):
    total_users: int
    total_products: int
    total_historical_content: int
    total_contact_messages: int
    recent_users: int
    recent_products: int
    recent_contact_messages: int

# Settings Model
class Settings(BaseModel):
    id: str = Field(default="site_settings")
    general: Optional[Dict[str, Any]] = None
    configuration: Optional[Dict[str, Any]] = None
    appearance: Optional[Dict[str, Any]] = None
    seo: Optional[Dict[str, Any]] = None
    notifications: Optional[Dict[str, Any]] = None
    security: Optional[Dict[str, Any]] = None
    media: Optional[Dict[str, Any]] = None
    backup: Optional[Dict[str, Any]] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Customization Model
class SiteCustomization(BaseModel):
    id: str = Field(default="site_customization")
    # Brand Identity
    site_name: str = "Délices et Trésors d'Algérie"
    site_slogan: Dict[str, str] = {
        "fr": "Découvrez nos trésors : dattes Deglet Nour et huile d'olive kabyle authentique",
        "en": "Discover our treasures: Deglet Nour dates and authentic Kabyle olive oil",
        "ar": "اكتشف كنوزنا: تمور دقلة نور وزيت الزيتون القبائلي الأصيل"
    }
    logo_url: Optional[str] = None
    
    # Colors
    primary_color: str = "#6B8E23"  # Olive green
    secondary_color: str = "#8B7355"  # Golden brown
    accent_color: str = "#F59E0B"  # Amber
    
    # Contact Info
    contact_email: str = "contact@delices-algerie.com"
    contact_phone: Optional[str] = None
    contact_address: Dict[str, str] = {
        "fr": "Algérie",
        "en": "Algeria",
        "ar": "الجزائر"
    }
    
    # Page Texts
    home_title: Dict[str, str] = {
        "fr": "Délices et Trésors d'Algérie",
        "en": "Delights and Treasures of Algeria",
        "ar": "لذائذ وكنوز الجزائر"
    }
    home_subtitle: Dict[str, str] = {
        "fr": "Découvrez l'authenticité du terroir algérien",
        "en": "Discover the authenticity of Algerian terroir",
        "ar": "اكتشف أصالة التراب الجزائري"
    }
    
    shop_title: Dict[str, str] = {
        "fr": "Boutique Délices et Trésors d'Algérie",
        "en": "Délices et Trésors d'Algérie Shop",
        "ar": "متجر لذائذ وكنوز الجزائر"
    }
    shop_description: Dict[str, str] = {
        "fr": "Découvrez nos trésors : dattes Deglet Nour et huile d'olive kabyle authentique",
        "en": "Discover our treasures: Deglet Nour dates and authentic Kabyle olive oil",
        "ar": "اكتشف كنوزنا: تمور دقلة نور وزيت الزيتون القبائلي الأصيل"
    }
    
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomizationUpdate(BaseModel):
    site_name: Optional[str] = None
    site_slogan: Optional[Dict[str, str]] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[Dict[str, str]] = None
    home_title: Optional[Dict[str, str]] = None
    home_subtitle: Optional[Dict[str, str]] = None
    shop_title: Optional[Dict[str, str]] = None
    shop_description: Optional[Dict[str, str]] = None

# Contact Models
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    status: str = "new"  # "new", "read", "replied"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactMessageUpdate(BaseModel):
    status: Optional[str] = None

# --- Authentication Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# --- Authentication Routes ---
@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    del user_dict["password"]
    user_dict["hashed_password"] = hashed_password
    
    new_user = User(**user_dict)
    # Insert the full user dict with hashed_password to database
    user_dict_with_id = new_user.dict()
    user_dict_with_id["hashed_password"] = hashed_password
    await db.users.insert_one(user_dict_with_id)
    return new_user

@api_router.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    user = await db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- User Profile Routes ---
@api_router.put("/users/me", response_model=User)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update current user's profile"""
    update_data = {}
    
    if user_update.full_name is not None:
        update_data["full_name"] = user_update.full_name
    
    if update_data:
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": update_data}
        )
        
        # Fetch updated user
        updated_user = await db.users.find_one({"id": current_user.id})
        return User(**updated_user)
    
    return current_user

@api_router.put("/users/me/password")
async def change_password(
    password_data: Dict[str, str],
    current_user: User = Depends(get_current_user)
):
    """Change current user's password"""
    current_password = password_data.get("current_password")
    new_password = password_data.get("new_password")
    
    if not current_password or not new_password:
        raise HTTPException(
            status_code=400,
            detail="Both current and new passwords are required"
        )
    
    # Verify current password
    user_with_password = await db.users.find_one({"id": current_user.id})
    if not verify_password(current_password, user_with_password.get("hashed_password")):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )
    
    # Update password
    hashed_password = get_password_hash(new_password)
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    return {"message": "Password changed successfully"}

# --- Category Routes ---
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all active categories (public)"""
    categories = await db.categories.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return [Category(**cat) for cat in categories]

@api_router.get("/admin/categories", response_model=List[Category])
async def get_all_categories_admin(admin: User = Depends(get_admin_user)):
    """Get all categories including inactive (admin only)"""
    categories = await db.categories.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return [Category(**cat) for cat in categories]

@api_router.post("/admin/categories", response_model=Category)
async def create_category(category_data: CategoryCreate, admin: User = Depends(get_admin_user)):
    """Create a new category (admin only)"""
    category = Category(**category_data.model_dump())
    await db.categories.insert_one(category.model_dump())
    return category

@api_router.get("/admin/categories/{category_id}", response_model=Category)
async def get_category_admin(category_id: str, admin: User = Depends(get_admin_user)):
    """Get a specific category (admin only)"""
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return Category(**category)

@api_router.put("/admin/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category_data: CategoryUpdate, admin: User = Depends(get_admin_user)):
    """Update a category (admin only)"""
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = {k: v for k, v in category_data.model_dump().items() if v is not None}
    if update_data:
        await db.categories.update_one({"id": category_id}, {"$set": update_data})
        category.update(update_data)
    
    return Category(**category)

@api_router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: str, admin: User = Depends(get_admin_user)):
    """Delete a category (admin only)"""
    # Check if any products use this category
    products_count = await db.products.count_documents({"category": category_id})
    if products_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete category. {products_count} product(s) are using this category."
        )
    
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}

# --- Product Routes ---
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    query = {"category": category} if category else {}
    products = await db.products.find(query).to_list(1000)
    return [Product(**product) for product in products]

@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate, current_user: User = Depends(get_current_user)):
    product_dict = product_data.dict()
    product_dict["created_by"] = current_user.id
    product = Product(**product_dict)
    await db.products.insert_one(product.dict())
    return product

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_data: ProductUpdate, admin_user: User = Depends(get_admin_user)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product_data.dict().items() if v is not None}
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin_user: User = Depends(get_admin_user)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.products.delete_one({"id": product_id})
    return {"message": "Product deleted successfully"}

# --- Historical Content Routes ---
@api_router.get("/historical-content", response_model=List[HistoricalContent])
async def get_historical_content(region: Optional[str] = None):
    query = {"region": region} if region else {}
    content = await db.historical_content.find(query).to_list(1000)
    return [HistoricalContent(**item) for item in content]

@api_router.post("/historical-content", response_model=HistoricalContent)
async def create_historical_content(content_data: HistoricalContentCreate, admin_user: User = Depends(get_admin_user)):
    content_dict = content_data.dict()
    content_dict["created_by"] = admin_user.id
    content = HistoricalContent(**content_dict)
    await db.historical_content.insert_one(content.dict())
    return content

@api_router.put("/historical-content/{content_id}", response_model=HistoricalContent)
async def update_historical_content(content_id: str, content_data: HistoricalContentUpdate, admin_user: User = Depends(get_admin_user)):
    content = await db.historical_content.find_one({"id": content_id})
    if not content:
        raise HTTPException(status_code=404, detail="Historical content not found")
    
    update_data = {k: v for k, v in content_data.dict().items() if v is not None}
    if update_data:
        await db.historical_content.update_one({"id": content_id}, {"$set": update_data})
    
    updated_content = await db.historical_content.find_one({"id": content_id})
    return HistoricalContent(**updated_content)

@api_router.delete("/historical-content/{content_id}")
async def delete_historical_content(content_id: str, admin_user: User = Depends(get_admin_user)):
    content = await db.historical_content.find_one({"id": content_id})
    if not content:
        raise HTTPException(status_code=404, detail="Historical content not found")
    
    await db.historical_content.delete_one({"id": content_id})
    return {"message": "Historical content deleted successfully"}

# --- Admin Routes ---
@api_router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(admin_user: User = Depends(get_admin_user)):
    # Calculate statistics
    total_users = await db.users.count_documents({})
    total_products = await db.products.count_documents({})
    total_historical_content = await db.historical_content.count_documents({})
    total_contact_messages = await db.contact_messages.count_documents({})
    
    # Recent items (last 30 days)
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    recent_users = await db.users.count_documents({"created_at": {"$gte": thirty_days_ago}})
    recent_products = await db.products.count_documents({"created_at": {"$gte": thirty_days_ago}})
    recent_contact_messages = await db.contact_messages.count_documents({"created_at": {"$gte": thirty_days_ago}})
    
    return AdminStats(
        total_users=total_users,
        total_products=total_products,
        total_historical_content=total_historical_content,
        total_contact_messages=total_contact_messages,
        recent_users=recent_users,
        recent_products=recent_products,
        recent_contact_messages=recent_contact_messages
    )

@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(admin_user: User = Depends(get_admin_user)):
    users = await db.users.find().to_list(1000)
    return [User(**user) for user in users]

@api_router.put("/admin/users/{user_id}", response_model=User)
async def update_user_admin(user_id: str, user_data: UserUpdate, admin_user: User = Depends(get_admin_user)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {k: v for k, v in user_data.dict().items() if v is not None}
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"id": user_id})
    return User(**updated_user)

@api_router.delete("/admin/users/{user_id}")
async def delete_user_admin(user_id: str, admin_user: User = Depends(get_admin_user)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if user_id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    await db.users.delete_one({"id": user_id})
    return {"message": "User deleted successfully"}

# --- Settings Routes ---
@api_router.get("/admin/settings")
async def get_settings(admin_user: User = Depends(get_admin_user)):
    """Get site settings (admin only)"""
    settings = await db.settings.find_one({"id": "site_settings"})
    
    if not settings:
        # Return default settings if none exist
        return {}
    
    # Remove MongoDB _id field
    if "_id" in settings:
        del settings["_id"]
    
    return settings

@api_router.put("/admin/settings")
async def update_settings(
    settings_update: Dict[str, Any],
    admin_user: User = Depends(get_admin_user)
):
    """Update site settings (admin only)"""
    try:
        # Get existing settings or create new
        existing_settings = await db.settings.find_one({"id": "site_settings"})
        
        if existing_settings:
            # Update existing settings
            update_data = {
                **existing_settings,
                **settings_update,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            
            await db.settings.update_one(
                {"id": "site_settings"},
                {"$set": update_data}
            )
        else:
            # Create new settings document
            new_settings = {
                "id": "site_settings",
                **settings_update,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.settings.insert_one(new_settings)
        
        return {"success": True, "message": "Settings updated successfully"}
        
    except Exception as e:
        logger.error(f"Error updating settings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating settings: {str(e)}")

# --- Image Upload Routes ---
@api_router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    admin_user: User = Depends(get_admin_user)
):
    """Upload an image file (admin only)"""
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_types)}"
            )
        
        # Validate file size (max 10MB)
        file_size = 0
        chunk_size = 1024 * 1024  # 1MB chunks
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file in chunks
        async with aiofiles.open(file_path, 'wb') as f:
            while True:
                chunk = await file.read(chunk_size)
                if not chunk:
                    break
                file_size += len(chunk)
                
                # Check size limit (10MB)
                if file_size > 10 * 1024 * 1024:
                    # Delete the file if it exceeds the limit
                    if file_path.exists():
                        file_path.unlink()
                    raise HTTPException(
                        status_code=400,
                        detail="File size exceeds 10MB limit"
                    )
                
                await f.write(chunk)
        
        # Return the URL (through API)
        file_url = f"/api/uploads/{unique_filename}"
        
        return {
            "success": True,
            "filename": unique_filename,
            "url": file_url,
            "size": file_size
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@api_router.delete("/upload/{filename}")
async def delete_image(
    filename: str,
    admin_user: User = Depends(get_admin_user)
):
    """Delete an uploaded image (admin only)"""
    try:
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        file_path.unlink()
        
        return {"success": True, "message": "File deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")

# --- File Serving Route ---
@api_router.get("/uploads/{filename}")
async def serve_uploaded_file(filename: str):
    """Serve uploaded files through API"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)

# --- Contact Routes ---
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(contact_data: ContactMessageCreate, background_tasks: BackgroundTasks):
    """Submit a contact form message"""
    # Create contact message
    contact_dict = contact_data.model_dump()
    contact_message = ContactMessage(**contact_dict)
    
    # Save to database
    await db.contact_messages.insert_one(contact_message.model_dump())
    
    # Send email notification in background
    background_tasks.add_task(
        email_service.send_contact_notification,
        contact_dict
    )
    
    return contact_message

@api_router.get("/admin/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages(admin: User = Depends(get_admin_user)):
    """Get all contact messages (admin only)"""
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [ContactMessage(**msg) for msg in messages]

@api_router.get("/admin/contact-messages/{message_id}", response_model=ContactMessage)
async def get_contact_message(message_id: str, admin: User = Depends(get_admin_user)):
    """Get a specific contact message (admin only)"""
    message = await db.contact_messages.find_one({"id": message_id}, {"_id": 0})
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    return ContactMessage(**message)

@api_router.put("/admin/contact-messages/{message_id}", response_model=ContactMessage)
async def update_contact_message(message_id: str, update_data: ContactMessageUpdate, admin: User = Depends(get_admin_user)):
    """Update contact message status (admin only)"""
    message = await db.contact_messages.find_one({"id": message_id}, {"_id": 0})
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if update_dict:
        await db.contact_messages.update_one(
            {"id": message_id},
            {"$set": update_dict}
        )
        message.update(update_dict)
    
    return ContactMessage(**message)

@api_router.delete("/admin/contact-messages/{message_id}")
async def delete_contact_message(message_id: str, admin: User = Depends(get_admin_user)):
    """Delete a contact message (admin only)"""
    result = await db.contact_messages.delete_one({"id": message_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact message not found")
    
    return {"message": "Contact message deleted successfully"}

# --- Customization Routes ---
@api_router.get("/customization", response_model=SiteCustomization)
async def get_customization():
    """Get site customization settings (public)"""
    customization = await db.customization.find_one({"id": "site_customization"}, {"_id": 0})
    
    if not customization:
        # Return default values if not found
        default_customization = SiteCustomization()
        await db.customization.insert_one(default_customization.model_dump())
        return default_customization
    
    return SiteCustomization(**customization)

@api_router.put("/admin/customization", response_model=SiteCustomization)
async def update_customization(
    customization_data: CustomizationUpdate,
    admin: User = Depends(get_admin_user)
):
    """Update site customization (admin only)"""
    # Get existing customization or create default
    existing = await db.customization.find_one({"id": "site_customization"}, {"_id": 0})
    
    if not existing:
        existing = SiteCustomization().model_dump()
        await db.customization.insert_one(existing)
    
    # Update with new data
    update_data = {k: v for k, v in customization_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    if update_data:
        await db.customization.update_one(
            {"id": "site_customization"},
            {"$set": update_data}
        )
    
    # Return updated customization
    updated = await db.customization.find_one({"id": "site_customization"}, {"_id": 0})
    return SiteCustomization(**updated)

# --- Basic Routes ---
@api_router.get("/")
async def root():
    return {"message": "Soumam Heritage API", "version": "1.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()