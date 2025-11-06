from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
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

# Recipe Models
class Recipe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Dict[str, str]  # {"fr": "Couscous", "ar": "كسكس", "en": "Couscous"}
    description: Dict[str, str]
    ingredients: Dict[str, List[str]]
    instructions: Dict[str, List[str]]
    image_url: str
    prep_time: int  # minutes
    cook_time: int  # minutes
    servings: int
    difficulty: str  # "facile", "moyen", "difficile"
    category: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: Optional[str] = None

class RecipeCreate(BaseModel):
    title: Dict[str, str]
    description: Dict[str, str]
    ingredients: Dict[str, List[str]]
    instructions: Dict[str, List[str]]
    image_url: str
    prep_time: int
    cook_time: int
    servings: int
    difficulty: str
    category: str

class RecipeUpdate(BaseModel):
    title: Optional[Dict[str, str]] = None
    description: Optional[Dict[str, str]] = None
    ingredients: Optional[Dict[str, List[str]]] = None
    instructions: Optional[Dict[str, List[str]]] = None
    image_url: Optional[str] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None

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
    total_recipes: int
    total_products: int
    total_historical_content: int
    recent_users: int
    recent_recipes: int
    recent_products: int

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

# --- Recipe Routes ---
@api_router.get("/recipes", response_model=List[Recipe])
async def get_recipes():
    recipes = await db.recipes.find().to_list(1000)
    return [Recipe(**recipe) for recipe in recipes]

@api_router.post("/recipes", response_model=Recipe)
async def create_recipe(recipe_data: RecipeCreate, current_user: User = Depends(get_current_user)):
    recipe_dict = recipe_data.dict()
    recipe_dict["created_by"] = current_user.id
    recipe = Recipe(**recipe_dict)
    await db.recipes.insert_one(recipe.dict())
    return recipe

@api_router.get("/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: str):
    recipe = await db.recipes.find_one({"id": recipe_id})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return Recipe(**recipe)

@api_router.put("/recipes/{recipe_id}", response_model=Recipe)
async def update_recipe(recipe_id: str, recipe_data: RecipeUpdate, current_user: User = Depends(get_current_user)):
    recipe = await db.recipes.find_one({"id": recipe_id})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Check if user is admin or recipe creator
    if current_user.role != "admin" and recipe.get("created_by") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this recipe")
    
    update_data = {k: v for k, v in recipe_data.dict().items() if v is not None}
    if update_data:
        await db.recipes.update_one({"id": recipe_id}, {"$set": update_data})
    
    updated_recipe = await db.recipes.find_one({"id": recipe_id})
    return Recipe(**updated_recipe)

@api_router.delete("/recipes/{recipe_id}")
async def delete_recipe(recipe_id: str, current_user: User = Depends(get_current_user)):
    recipe = await db.recipes.find_one({"id": recipe_id})
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Check if user is admin or recipe creator
    if current_user.role != "admin" and recipe.get("created_by") != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this recipe")
    
    await db.recipes.delete_one({"id": recipe_id})
    return {"message": "Recipe deleted successfully"}

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
    total_recipes = await db.recipes.count_documents({})
    total_products = await db.products.count_documents({})
    total_historical_content = await db.historical_content.count_documents({})
    
    # Recent items (last 30 days)
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    recent_users = await db.users.count_documents({"created_at": {"$gte": thirty_days_ago}})
    recent_recipes = await db.recipes.count_documents({"created_at": {"$gte": thirty_days_ago}})
    recent_products = await db.products.count_documents({"created_at": {"$gte": thirty_days_ago}})
    
    return AdminStats(
        total_users=total_users,
        total_recipes=total_recipes,
        total_products=total_products,
        total_historical_content=total_historical_content,
        recent_users=recent_users,
        recent_recipes=recent_recipes,
        recent_products=recent_products
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
        
        # Return the URL
        file_url = f"/uploads/{unique_filename}"
        
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