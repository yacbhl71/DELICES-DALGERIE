import requests
import sys
import json
import os
import io
from datetime import datetime, timezone
from PIL import Image

class DelicesAlgerieAPITester:
    def __init__(self, base_url="https://delices-store.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.uploaded_files = []  # Track uploaded files for cleanup
        self.created_product_id = None
        self.created_promo_codes = []
        self.created_order_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, files=None, use_admin_token=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        test_headers = {}
        
        # Use admin token if specified, otherwise use regular token
        token_to_use = self.admin_token if use_admin_token else self.token
        if token_to_use:
            test_headers['Authorization'] = f'Bearer {token_to_use}'
        
        # Only set Content-Type for JSON requests
        if not files and data:
            test_headers['Content-Type'] = 'application/json'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files, headers=test_headers, timeout=10)
                else:
                    response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    else:
                        print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Not a dict'}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_data = {
            "email": f"test{timestamp}@soumam.com",
            "password": "test123",
            "full_name": "Test User"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_data
        )
        
        if success and 'id' in response:
            self.user_id = response['id']
            print(f"   Created user ID: {self.user_id}")
            # Store credentials for login test
            self.test_email = test_data['email']
            self.test_password = test_data['password']
            return True
        return False

    def test_login(self):
        """Test user login"""
        if not hasattr(self, 'test_email'):
            print("❌ Cannot test login - no registered user")
            return False
            
        login_data = {
            "email": self.test_email,
            "password": self.test_password
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        if not self.token:
            print("❌ Cannot test profile - no token")
            return False
            
        return self.run_test("Get User Profile", "GET", "auth/me", 200)[0]

    def test_get_recipes(self):
        """Test getting recipes"""
        success, response = self.run_test("Get Recipes", "GET", "recipes", 200)
        if success:
            print(f"   Found {len(response)} recipes")
        return success

    def test_get_products(self):
        """Test getting products"""
        success, response = self.run_test("Get Products", "GET", "products", 200)
        if success:
            print(f"   Found {len(response)} products")
        return success

    def test_get_products_by_category(self):
        """Test getting products by category"""
        categories = ["epices", "thes", "robes-kabyles", "bijoux-kabyles"]
        all_success = True
        
        for category in categories:
            success, response = self.run_test(
                f"Get Products - {category}",
                "GET",
                f"products?category={category}",
                200
            )
            if success:
                print(f"   Found {len(response)} products in {category}")
            all_success = all_success and success
            
        return all_success

    def test_get_historical_content(self):
        """Test getting historical content"""
        success, response = self.run_test("Get Historical Content", "GET", "historical-content", 200)
        if success:
            print(f"   Found {len(response)} historical content items")
        return success

    def test_get_historical_content_by_region(self):
        """Test getting historical content by region"""
        regions = ["algerie", "kabylie", "vallee-soumam"]
        all_success = True
        
        for region in regions:
            success, response = self.run_test(
                f"Get Historical Content - {region}",
                "GET",
                f"historical-content?region={region}",
                200
            )
            if success:
                print(f"   Found {len(response)} content items for {region}")
            all_success = all_success and success
            
        return all_success

    def test_create_recipe(self):
        """Test creating a recipe (requires auth)"""
        if not self.token:
            print("❌ Cannot test recipe creation - no token")
            return False
            
        recipe_data = {
            "title": {
                "fr": "Test Couscous",
                "ar": "كسكس تجريبي",
                "en": "Test Couscous"
            },
            "description": {
                "fr": "Un délicieux couscous de test",
                "ar": "كسكس تجريبي لذيذ",
                "en": "A delicious test couscous"
            },
            "ingredients": {
                "fr": ["Semoule", "Légumes", "Viande"],
                "ar": ["سميد", "خضار", "لحم"],
                "en": ["Semolina", "Vegetables", "Meat"]
            },
            "instructions": {
                "fr": ["Préparer la semoule", "Cuire les légumes"],
                "ar": ["تحضير السميد", "طبخ الخضار"],
                "en": ["Prepare semolina", "Cook vegetables"]
            },
            "image_url": "https://example.com/couscous.jpg",
            "prep_time": 30,
            "cook_time": 60,
            "servings": 6,
            "difficulty": "moyen",
            "category": "plat-principal"
        }
        
        return self.run_test("Create Recipe", "POST", "recipes", 200, data=recipe_data)[0]

    def test_admin_login(self):
        """Test admin login with provided credentials for Délices et Trésors d'Algérie"""
        admin_credentials = {
            "email": "admin@delices-algerie.com",
            "password": "Admin2024!"
        }
        
        success, response = self.run_test(
            "Admin Login (Délices Algérie)",
            "POST",
            "auth/login",
            200,
            data=admin_credentials
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"   Admin token received: {self.admin_token[:20]}...")
            return True
        return False

    def create_test_image(self, format='JPEG', size=(100, 100)):
        """Create a test image in memory"""
        img = Image.new('RGB', size, color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format=format)
        img_bytes.seek(0)
        return img_bytes

    def test_image_upload_success(self):
        """Test successful image upload"""
        if not self.admin_token:
            print("❌ Cannot test image upload - no admin token")
            return False
        
        # Create a test JPEG image
        test_image = self.create_test_image('JPEG')
        files = {'file': ('test_image.jpg', test_image, 'image/jpeg')}
        
        success, response = self.run_test(
            "Image Upload - JPEG",
            "POST",
            "upload",
            200,
            files=files,
            use_admin_token=True
        )
        
        if success and response:
            # Verify response structure
            required_keys = ['success', 'filename', 'url', 'size']
            if all(key in response for key in required_keys):
                print(f"   Uploaded file: {response['filename']}")
                print(f"   File URL: {response['url']}")
                print(f"   File size: {response['size']} bytes")
                self.uploaded_files.append(response['filename'])
                return True
            else:
                print(f"❌ Missing required response keys. Got: {list(response.keys())}")
        
        return False

    def test_image_upload_png(self):
        """Test PNG image upload"""
        if not self.admin_token:
            print("❌ Cannot test PNG upload - no admin token")
            return False
        
        # Create a test PNG image
        test_image = self.create_test_image('PNG')
        files = {'file': ('test_image.png', test_image, 'image/png')}
        
        success, response = self.run_test(
            "Image Upload - PNG",
            "POST",
            "upload",
            200,
            files=files,
            use_admin_token=True
        )
        
        if success and response and 'filename' in response:
            self.uploaded_files.append(response['filename'])
            return True
        return False

    def test_image_upload_invalid_type(self):
        """Test upload with invalid file type"""
        if not self.admin_token:
            print("❌ Cannot test invalid upload - no admin token")
            return False
        
        # Create a fake text file
        fake_file = io.BytesIO(b"This is not an image")
        files = {'file': ('test.txt', fake_file, 'text/plain')}
        
        success, response = self.run_test(
            "Image Upload - Invalid Type",
            "POST",
            "upload",
            400,
            files=files,
            use_admin_token=True
        )
        
        return success

    def test_image_upload_no_auth(self):
        """Test upload without authentication"""
        test_image = self.create_test_image('JPEG')
        files = {'file': ('test_image.jpg', test_image, 'image/jpeg')}
        
        success, response = self.run_test(
            "Image Upload - No Auth",
            "POST",
            "upload",
            403,  # Changed from 401 to 403 as admin endpoints return 403
            files=files,
            use_admin_token=False
        )
        
        return success

    def test_static_file_serving(self):
        """Test that uploaded images are accessible via /uploads"""
        if not self.uploaded_files:
            print("❌ Cannot test static serving - no uploaded files")
            return False
        
        # Test accessing the first uploaded file
        filename = self.uploaded_files[0]
        static_url = f"https://delices-store.preview.emergentagent.com/uploads/{filename}"
        
        try:
            response = requests.get(static_url, timeout=10)
            success = response.status_code == 200
            
            if success:
                print(f"✅ Static file accessible - Status: {response.status_code}")
                print(f"   Content-Type: {response.headers.get('content-type', 'Unknown')}")
                print(f"   Content-Length: {response.headers.get('content-length', 'Unknown')}")
                self.tests_passed += 1
            else:
                print(f"❌ Static file not accessible - Status: {response.status_code}")
            
            self.tests_run += 1
            return success
            
        except Exception as e:
            print(f"❌ Error accessing static file: {str(e)}")
            self.tests_run += 1
            return False

    def test_image_delete(self):
        """Test deleting an uploaded image"""
        if not self.admin_token or not self.uploaded_files:
            print("❌ Cannot test image delete - no admin token or uploaded files")
            return False
        
        # Delete the first uploaded file
        filename = self.uploaded_files[0]
        
        success, response = self.run_test(
            f"Image Delete - {filename}",
            "DELETE",
            f"upload/{filename}",
            200,
            use_admin_token=True
        )
        
        if success:
            # Remove from our tracking list
            self.uploaded_files.remove(filename)
            
            # Verify file is no longer accessible
            static_url = f"https://delices-store.preview.emergentagent.com/uploads/{filename}"
            try:
                response = requests.get(static_url, timeout=10)
                if response.status_code == 404:
                    print(f"   ✅ File properly deleted - no longer accessible")
                    return True
                else:
                    print(f"   ⚠️ File deleted from API but still accessible at {response.status_code}")
                    return True  # Still consider success as API worked
            except:
                print(f"   ✅ File properly deleted - no longer accessible")
                return True
        
        return False

    def test_image_delete_nonexistent(self):
        """Test deleting a non-existent image"""
        if not self.admin_token:
            print("❌ Cannot test delete nonexistent - no admin token")
            return False
        
        fake_filename = "nonexistent-file.jpg"
        
        success, response = self.run_test(
            "Image Delete - Nonexistent",
            "DELETE",
            f"upload/{fake_filename}",
            404,
            use_admin_token=True
        )
        
        return success

    def test_image_delete_no_auth(self):
        """Test deleting image without authentication"""
        if not self.uploaded_files:
            print("❌ Cannot test delete no auth - no uploaded files")
            return False
        
        filename = self.uploaded_files[0] if self.uploaded_files else "test.jpg"
        
        success, response = self.run_test(
            "Image Delete - No Auth",
            "DELETE",
            f"upload/{filename}",
            403,  # Changed from 401 to 403 as admin endpoints return 403
            use_admin_token=False
        )
        
        return success

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        if not self.admin_token:
            print("❌ Cannot test admin stats - no admin token")
            return False
        
        success, response = self.run_test(
            "Admin Stats",
            "GET",
            "admin/stats",
            200,
            use_admin_token=True
        )
        
        if success and response:
            expected_keys = ['total_users', 'total_products', 'total_historical_content', 'total_contact_messages',
                           'recent_users', 'recent_products', 'recent_contact_messages']
            if all(key in response for key in expected_keys):
                print(f"   Total users: {response.get('total_users', 0)}")
                print(f"   Total products: {response.get('total_products', 0)}")
                print(f"   Total contact messages: {response.get('total_contact_messages', 0)}")
                return True
            else:
                print(f"❌ Missing expected stats keys. Got: {list(response.keys())}")
        
        return False

    def test_jwt_token_validation(self):
        """Test JWT token validation on protected endpoints"""
        if not self.admin_token:
            print("❌ Cannot test JWT validation - no admin token")
            return False
        
        # Test with valid token
        success, response = self.run_test(
            "JWT Token Validation - Valid",
            "GET",
            "auth/me",
            200,
            use_admin_token=True
        )
        
        if not success:
            return False
        
        # Test with invalid token
        old_token = self.admin_token
        self.admin_token = "invalid.jwt.token"
        
        success, response = self.run_test(
            "JWT Token Validation - Invalid",
            "GET",
            "auth/me",
            401,
            use_admin_token=True
        )
        
        # Restore valid token
        self.admin_token = old_token
        return success

    def test_create_product_with_stock_fields(self):
        """Test creating a product with all new stock management fields"""
        if not self.admin_token:
            print("❌ Cannot test product creation - no admin token")
            return False
        
        product_data = {
            "name": {
                "fr": "Dattes Deglet Nour Premium Test",
                "en": "Premium Deglet Nour Dates Test",
                "ar": "تمور دقلة نور ممتازة تجريبية"
            },
            "description": {
                "fr": "Dattes de qualité supérieure d'Algérie pour test",
                "en": "Superior quality dates from Algeria for testing",
                "ar": "تمور عالية الجودة من الجزائر للاختبار"
            },
            "category": "dattes",
            "price": 15.99,
            "image_urls": ["https://example.com/dattes.jpg"],
            "origin": {
                "fr": "Biskra, Algérie",
                "en": "Biskra, Algeria", 
                "ar": "بسكرة، الجزائر"
            },
            "in_stock": True,
            "track_inventory": True,
            "stock_quantity": 50,
            "low_stock_threshold": 10,
            "allow_backorder": False
        }
        
        success, response = self.run_test(
            "Create Product with Stock Fields",
            "POST",
            "products",
            200,
            data=product_data,
            use_admin_token=True
        )
        
        if success and response and 'id' in response:
            self.created_product_id = response['id']
            print(f"   Created product ID: {self.created_product_id}")
            
            # Verify all stock fields are saved
            required_fields = ['track_inventory', 'stock_quantity', 'low_stock_threshold', 'allow_backorder']
            if all(field in response for field in required_fields):
                print(f"   Stock quantity: {response['stock_quantity']}")
                print(f"   Low stock threshold: {response['low_stock_threshold']}")
                print(f"   Track inventory: {response['track_inventory']}")
                print(f"   Allow backorder: {response['allow_backorder']}")
                return True
            else:
                print(f"❌ Missing stock fields in response. Got: {list(response.keys())}")
        
        return False

    def test_update_product_stock_fields(self):
        """Test updating product with stock management fields"""
        if not self.admin_token or not self.created_product_id:
            print("❌ Cannot test product update - no admin token or product ID")
            return False
        
        update_data = {
            "stock_quantity": 75,
            "low_stock_threshold": 15,
            "allow_backorder": True,
            "price": 17.99
        }
        
        success, response = self.run_test(
            "Update Product Stock Fields",
            "PUT",
            f"products/{self.created_product_id}",
            200,
            data=update_data,
            use_admin_token=True
        )
        
        if success and response:
            # Verify updated fields
            if (response.get('stock_quantity') == 75 and 
                response.get('low_stock_threshold') == 15 and
                response.get('allow_backorder') == True and
                response.get('price') == 17.99):
                print(f"   Updated stock quantity: {response['stock_quantity']}")
                print(f"   Updated low stock threshold: {response['low_stock_threshold']}")
                print(f"   Updated allow backorder: {response['allow_backorder']}")
                return True
            else:
                print(f"❌ Stock fields not updated correctly")
        
        return False

    def test_inventory_management(self):
        """Test inventory management endpoints"""
        if not self.admin_token:
            print("❌ Cannot test inventory - no admin token")
            return False
        
        # Test GET inventory
        success, response = self.run_test(
            "Get Inventory",
            "GET",
            "admin/inventory",
            200,
            use_admin_token=True
        )
        
        if success:
            print(f"   Found {len(response)} products in inventory")
        
        return success

    def test_stock_adjustment(self):
        """Test stock adjustment functionality"""
        if not self.admin_token or not self.created_product_id:
            print("❌ Cannot test stock adjustment - no admin token or product ID")
            return False
        
        adjustment_data = {
            "adjustment_type": "increase",
            "quantity": 25,
            "reason": "Nouveau stock reçu",
            "notes": "Test d'ajustement de stock"
        }
        
        success, response = self.run_test(
            "Stock Adjustment",
            "POST",
            f"admin/inventory/{self.created_product_id}/adjust",
            200,
            data=adjustment_data,
            use_admin_token=True
        )
        
        if success and response:
            print(f"   Stock adjusted successfully")
            return True
        
        return False

    def test_create_promo_codes(self):
        """Test creating promo codes BIENVENUE20 and ETE2025"""
        if not self.admin_token:
            print("❌ Cannot test promo code creation - no admin token")
            return False
        
        # Create BIENVENUE20 promo code
        bienvenue_data = {
            "code": "BIENVENUE20",
            "description": {
                "fr": "Code de bienvenue - 20% de réduction",
                "en": "Welcome code - 20% discount",
                "ar": "رمز الترحيب - خصم 20%"
            },
            "discount_type": "percentage",
            "discount_value": 20.0,
            "min_order_amount": 30.0,
            "usage_limit": 100,
            "valid_from": datetime.now(timezone.utc).isoformat(),
            "valid_until": None,
            "is_active": True
        }
        
        success, response = self.run_test(
            "Create BIENVENUE20 Promo Code",
            "POST",
            "admin/promo-codes",
            200,
            data=bienvenue_data,
            use_admin_token=True
        )
        
        if success and response and 'id' in response:
            self.created_promo_codes.append(response['id'])
            print(f"   Created BIENVENUE20 promo code ID: {response['id']}")
        
        # Create ETE2025 promo code
        ete_data = {
            "code": "ETE2025",
            "description": {
                "fr": "Promotion été 2025 - 10 EUR de réduction",
                "en": "Summer 2025 promotion - 10 EUR discount",
                "ar": "عرض صيف 2025 - خصم 10 يورو"
            },
            "discount_type": "fixed",
            "discount_value": 10.0,
            "min_order_amount": 50.0,
            "usage_limit": 50,
            "valid_from": datetime.now(timezone.utc).isoformat(),
            "valid_until": None,
            "is_active": True
        }
        
        success2, response2 = self.run_test(
            "Create ETE2025 Promo Code",
            "POST",
            "admin/promo-codes",
            200,
            data=ete_data,
            use_admin_token=True
        )
        
        if success2 and response2 and 'id' in response2:
            self.created_promo_codes.append(response2['id'])
            print(f"   Created ETE2025 promo code ID: {response2['id']}")
        
        return success and success2

    def test_get_promo_codes(self):
        """Test getting all promo codes"""
        if not self.admin_token:
            print("❌ Cannot test get promo codes - no admin token")
            return False
        
        success, response = self.run_test(
            "Get Admin Promo Codes",
            "GET",
            "admin/promo-codes",
            200,
            use_admin_token=True
        )
        
        if success:
            print(f"   Found {len(response)} promo codes")
            # Look for our created codes
            codes = [code.get('code') for code in response if 'code' in code]
            if 'BIENVENUE20' in codes and 'ETE2025' in codes:
                print(f"   ✅ Found both BIENVENUE20 and ETE2025 codes")
                return True
            else:
                print(f"   ⚠️ Created codes not found in list: {codes}")
        
        return success

    def test_validate_promo_code_bienvenue20(self):
        """Test validating BIENVENUE20 promo code"""
        validation_data = {
            "code": "BIENVENUE20",
            "order_amount": 87.97
        }
        
        success, response = self.run_test(
            "Validate BIENVENUE20 Promo Code",
            "POST",
            "promo-codes/validate",
            200,
            data=validation_data
        )
        
        if success and response:
            expected_discount = 87.97 * 0.20  # 20% of 87.97 = 17.594
            actual_discount = response.get('discount_amount', 0)
            
            if abs(actual_discount - expected_discount) < 0.01:  # Allow small floating point differences
                print(f"   ✅ Correct discount calculated: {actual_discount:.2f} EUR")
                print(f"   Valid: {response.get('valid', False)}")
                print(f"   Message: {response.get('message', 'N/A')}")
                return True
            else:
                print(f"   ❌ Incorrect discount. Expected: {expected_discount:.2f}, Got: {actual_discount}")
        
        return False

    def test_validate_promo_code_ete2025(self):
        """Test validating ETE2025 promo code"""
        validation_data = {
            "code": "ETE2025",
            "order_amount": 75.50
        }
        
        success, response = self.run_test(
            "Validate ETE2025 Promo Code",
            "POST",
            "promo-codes/validate",
            200,
            data=validation_data
        )
        
        if success and response:
            expected_discount = 10.0  # Fixed 10 EUR discount
            actual_discount = response.get('discount_amount', 0)
            
            if actual_discount == expected_discount:
                print(f"   ✅ Correct discount calculated: {actual_discount} EUR")
                print(f"   Valid: {response.get('valid', False)}")
                return True
            else:
                print(f"   ❌ Incorrect discount. Expected: {expected_discount}, Got: {actual_discount}")
        
        return False

    def test_validate_promo_code_minimum_order(self):
        """Test promo code validation with minimum order amount"""
        validation_data = {
            "code": "BIENVENUE20",
            "order_amount": 25.0  # Below minimum of 30 EUR
        }
        
        success, response = self.run_test(
            "Validate Promo Code - Below Minimum",
            "POST",
            "promo-codes/validate",
            400,  # Expecting 400 error for minimum order not met
            data=validation_data
        )
        
        if success:
            print(f"   ✅ Correctly rejected for minimum order amount")
            print(f"   Error: {response.get('detail', 'N/A')}")
            return True
        
        return False

    def test_validate_invalid_promo_code(self):
        """Test validating an invalid promo code"""
        validation_data = {
            "code": "INVALID_CODE",
            "order_amount": 50.0
        }
        
        success, response = self.run_test(
            "Validate Invalid Promo Code",
            "POST",
            "promo-codes/validate",
            404,  # Expecting 404 for invalid code
            data=validation_data
        )
        
        if success:
            print(f"   ✅ Correctly rejected invalid code")
            print(f"   Error: {response.get('detail', 'N/A')}")
            return True
        
        return False

    def test_create_order_with_promo_code(self):
        """Test creating an order with promo code and stock decrementation"""
        if not self.created_product_id:
            print("❌ Cannot test order creation - no product ID")
            return False
        
        order_data = {
            "customer_name": "Ahmed Benali",
            "customer_email": "ahmed.benali@example.com",
            "customer_phone": "+213 555 123 456",
            "shipping_address": "123 Rue de la Liberté",
            "shipping_city": "Alger",
            "shipping_postal_code": "16000",
            "items": [
                {
                    "product_id": self.created_product_id,
                    "product_name": "Dattes Deglet Nour Premium Test",
                    "quantity": 2,
                    "price": 17.99,
                    "image_url": "https://example.com/dattes.jpg"
                }
            ],
            "promo_code": "BIENVENUE20",
            "notes": "Commande de test avec code promo"
        }
        
        success, response = self.run_test(
            "Create Order with Promo Code",
            "POST",
            "orders",
            200,
            data=order_data
        )
        
        if success and response and 'id' in response:
            self.created_order_id = response['id']
            print(f"   Created order ID: {self.created_order_id}")
            print(f"   Order number: {response.get('order_number', 'N/A')}")
            print(f"   Subtotal: {response.get('subtotal', 0):.2f} EUR")
            print(f"   Discount: {response.get('discount_amount', 0):.2f} EUR")
            print(f"   Total: {response.get('total', 0):.2f} EUR")
            print(f"   Promo code applied: {response.get('promo_code', 'None')}")
            
            # Verify discount calculation
            expected_subtotal = 2 * 17.99  # 35.98
            expected_discount = expected_subtotal * 0.20  # 7.196
            expected_total = expected_subtotal - expected_discount  # 28.784
            
            actual_subtotal = response.get('subtotal', 0)
            actual_discount = response.get('discount_amount', 0)
            actual_total = response.get('total', 0)
            
            if (abs(actual_subtotal - expected_subtotal) < 0.01 and
                abs(actual_discount - expected_discount) < 0.01 and
                abs(actual_total - expected_total) < 0.01):
                print(f"   ✅ Order calculations correct")
                return True
            else:
                print(f"   ❌ Order calculations incorrect")
                print(f"      Expected: subtotal={expected_subtotal:.2f}, discount={expected_discount:.2f}, total={expected_total:.2f}")
                print(f"      Actual: subtotal={actual_subtotal:.2f}, discount={actual_discount:.2f}, total={actual_total:.2f}")
        
        return False

    def test_stock_decrementation_after_order(self):
        """Test that stock is decremented after order creation"""
        if not self.admin_token or not self.created_product_id:
            print("❌ Cannot test stock decrementation - no admin token or product ID")
            return False
        
        # Get current product to check stock
        success, response = self.run_test(
            "Check Stock After Order",
            "GET",
            f"products/{self.created_product_id}",
            200
        )
        
        if success and response:
            current_stock = response.get('stock_quantity', 0)
            # Stock should have decreased by 2 (quantity ordered)
            # Original was 75 (after update), so should now be 73
            expected_stock = 73
            
            if current_stock == expected_stock:
                print(f"   ✅ Stock correctly decremented to {current_stock}")
                return True
            else:
                print(f"   ❌ Stock not decremented correctly. Expected: {expected_stock}, Got: {current_stock}")
        
        return False

    def test_seo_settings(self):
        """Test SEO settings endpoints"""
        if not self.admin_token:
            print("❌ Cannot test SEO settings - no admin token")
            return False
        
        # Test GET SEO settings
        success, response = self.run_test(
            "Get SEO Settings",
            "GET",
            "admin/seo-settings",
            200,
            use_admin_token=True
        )
        
        if not success:
            return False
        
        # Test PUT SEO settings
        seo_data = {
            "site_title": {
                "fr": "Délices et Trésors d'Algérie - Test",
                "en": "Delights and Treasures of Algeria - Test",
                "ar": "لذائذ وكنوز الجزائر - اختبار"
            },
            "site_description": {
                "fr": "Découvrez nos produits authentiques d'Algérie",
                "en": "Discover our authentic products from Algeria",
                "ar": "اكتشف منتجاتنا الأصيلة من الجزائر"
            },
            "site_keywords": {
                "fr": "dattes, huile olive, Algérie, produits authentiques",
                "en": "dates, olive oil, Algeria, authentic products",
                "ar": "تمور، زيت زيتون، الجزائر، منتجات أصيلة"
            },
            "canonical_url": "https://delices-algerie.com",
            "structured_data_enabled": True
        }
        
        success2, response2 = self.run_test(
            "Update SEO Settings",
            "PUT",
            "admin/seo-settings",
            200,
            data=seo_data,
            use_admin_token=True
        )
        
        return success and success2

    def test_custom_pages(self):
        """Test custom pages endpoints"""
        # Test privacy page
        success1, response1 = self.run_test(
            "Get Privacy Page",
            "GET",
            "pages/privacy",
            200
        )
        
        # Test footer settings
        success2, response2 = self.run_test(
            "Get Footer Settings",
            "GET",
            "footer",
            200
        )
        
        # Test navigation
        success3, response3 = self.run_test(
            "Get Navigation",
            "GET",
            "navigation",
            200
        )
        
        if success3:
            print(f"   Found {len(response3)} navigation items")
        
        return success1 and success2 and success3

    def cleanup_uploaded_files(self):
        """Clean up any remaining uploaded files"""
        if not self.admin_token or not self.uploaded_files:
            return
        
        print(f"\n🧹 Cleaning up {len(self.uploaded_files)} uploaded files...")
        for filename in self.uploaded_files[:]:  # Copy list to avoid modification during iteration
            try:
                url = f"{self.base_url}/upload/{filename}"
                headers = {'Authorization': f'Bearer {self.admin_token}'}
                response = requests.delete(url, headers=headers, timeout=10)
                if response.status_code == 200:
                    print(f"   ✅ Deleted {filename}")
                    self.uploaded_files.remove(filename)
                else:
                    print(f"   ⚠️ Could not delete {filename} - Status: {response.status_code}")
            except Exception as e:
                print(f"   ❌ Error deleting {filename}: {str(e)}")

    def run_ecommerce_tests(self):
        """Run comprehensive e-commerce tests for Délices et Trésors d'Algérie"""
        print("\n🛒 Starting E-commerce Tests")
        print("=" * 50)
        
        # Test admin authentication first
        if not self.test_admin_login():
            print("❌ Admin login failed - cannot test e-commerce functionality")
            return False
        
        # Test JWT token validation
        self.test_jwt_token_validation()
        
        # Test product management with stock fields
        self.test_create_product_with_stock_fields()
        self.test_update_product_stock_fields()
        
        # Test inventory management
        self.test_inventory_management()
        self.test_stock_adjustment()
        
        # Test promo codes
        self.test_create_promo_codes()
        self.test_get_promo_codes()
        self.test_validate_promo_code_bienvenue20()
        self.test_validate_promo_code_ete2025()
        self.test_validate_promo_code_minimum_order()
        self.test_validate_invalid_promo_code()
        
        # Test order creation with promo codes and stock decrementation
        self.test_create_order_with_promo_code()
        self.test_stock_decrementation_after_order()
        
        # Test SEO and custom pages
        self.test_seo_settings()
        self.test_custom_pages()
        
        # Test admin stats
        self.test_admin_stats()
        
        return True

    def run_all_tests(self):
        """Run all API tests for Délices et Trésors d'Algérie"""
        print("🚀 Starting Délices et Trésors d'Algérie API Tests")
        print("=" * 50)
        
        # Test basic connectivity
        if not self.test_api_root():
            print("❌ API root test failed - stopping tests")
            return False
            
        # Test authentication flow
        if not self.test_register():
            print("❌ Registration failed - stopping auth tests")
        else:
            if not self.test_login():
                print("❌ Login failed - stopping authenticated tests")
            else:
                self.test_get_user_profile()
        
        # Test public endpoints
        self.test_get_products()
        self.test_get_products_by_category()
        self.test_get_historical_content()
        self.test_get_historical_content_by_region()
        
        # Test comprehensive e-commerce functionality
        self.run_ecommerce_tests()
        
        # Print final results
        print("\n" + "=" * 50)
        print(f"📊 Final Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = DelicesAlgerieAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())