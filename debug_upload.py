#!/usr/bin/env python3
"""
Debug script to test file size validation
"""

import requests
import io
from PIL import Image

def create_large_image(target_size_mb=11):
    """Create a large image for testing"""
    # Create a large image that should exceed 10MB
    # RGB images use 3 bytes per pixel
    target_bytes = target_size_mb * 1024 * 1024
    pixels_needed = target_bytes // 3
    side_length = int(pixels_needed ** 0.5)
    
    print(f"Creating {side_length}x{side_length} image (target: {target_size_mb}MB)")
    
    img = Image.new('RGB', (side_length, side_length), color='blue')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG', quality=95)
    img_bytes.seek(0)
    
    actual_size = len(img_bytes.getvalue())
    print(f"Actual image size: {actual_size / (1024*1024):.2f}MB")
    
    return img_bytes, actual_size

def test_upload():
    # Login first
    admin_credentials = {
        "email": "admin.soumam@gmail.com",
        "password": "soumam2024"
    }
    
    login_response = requests.post(
        "https://soumam-valley.preview.emergentagent.com/api/auth/login",
        json=admin_credentials
    )
    
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        return
    
    token = login_response.json()['access_token']
    print(f"Login successful, token: {token[:20]}...")
    
    # Create large image
    large_image, size = create_large_image(11)
    
    # Test upload
    files = {'file': ('large_test.jpg', large_image, 'image/jpeg')}
    headers = {'Authorization': f'Bearer {token}'}
    
    print("Uploading large image...")
    response = requests.post(
        "https://soumam-valley.preview.emergentagent.com/api/upload",
        files=files,
        headers=headers,
        timeout=60
    )
    
    print(f"Upload response: {response.status_code}")
    print(f"Response body: {response.text}")

if __name__ == "__main__":
    test_upload()