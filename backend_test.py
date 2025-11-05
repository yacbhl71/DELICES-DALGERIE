import requests
import sys
import json
from datetime import datetime

class SoumamHeritageAPITester:
    def __init__(self, base_url="https://soumam-heritage.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
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