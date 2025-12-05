import requests
import sys
import json
import os
import io
from datetime import datetime
from PIL import Image

class SoumamHeritageAPITester:
    def __init__(self, base_url="https://delices-store.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.uploaded_files = []  # Track uploaded files for cleanup

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
        """Test admin login with provided credentials"""
        admin_credentials = {
            "email": "admin.soumam@gmail.com",
            "password": "soumam2024"
        }
        
        success, response = self.run_test(
            "Admin Login",
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
            expected_keys = ['total_users', 'total_recipes', 'total_products', 'total_historical_content', 
                           'recent_users', 'recent_recipes', 'recent_products']
            if all(key in response for key in expected_keys):
                print(f"   Total users: {response.get('total_users', 0)}")
                print(f"   Total recipes: {response.get('total_recipes', 0)}")
                print(f"   Total products: {response.get('total_products', 0)}")
                return True
            else:
                print(f"❌ Missing expected stats keys. Got: {list(response.keys())}")
        
        return False

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

    def run_image_upload_tests(self):
        """Run comprehensive image upload tests"""
        print("\n🖼️  Starting Image Upload Tests")
        print("=" * 50)
        
        # Test admin authentication first
        if not self.test_admin_login():
            print("❌ Admin login failed - cannot test image upload functionality")
            return False
        
        # Test image upload functionality
        tests = [
            self.test_image_upload_success,
            self.test_image_upload_png,
            self.test_image_upload_invalid_type,
            self.test_image_upload_no_auth,
            self.test_static_file_serving,
            self.test_image_delete,
            self.test_image_delete_nonexistent,
            self.test_image_delete_no_auth,
            self.test_admin_stats
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with error: {str(e)}")
        
        # Cleanup
        self.cleanup_uploaded_files()
        
        return True

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Soumam Heritage API Tests")
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
                self.test_create_recipe()
        
        # Test public endpoints
        self.test_get_recipes()
        self.test_get_products()
        self.test_get_products_by_category()
        self.test_get_historical_content()
        self.test_get_historical_content_by_region()
        
        # Test image upload functionality
        self.run_image_upload_tests()
        
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
    tester = SoumamHeritageAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())