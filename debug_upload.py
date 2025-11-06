#!/usr/bin/env python3
"""
Debug script to test file size validation
"""

import requests
import io
from PIL import Image

def create_large_image(target_size_mb=11):
    """Create a large image for testing"""
    # Create a large uncompressed image
    # Use a very large dimension with random colors to prevent compression
    import random
    
    # Start with a large dimension
    side_length = 4000  # 4000x4000 = 16M pixels = ~48MB uncompressed
    
    print(f"Creating {side_length}x{side_length} image with random colors")
    
    # Create image with random pixels to prevent compression
    pixels = []
    for i in range(side_length * side_length):
        pixels.append((
            random.randint(0, 255),
            random.randint(0, 255), 
            random.randint(0, 255)
        ))
    
    img = Image.new('RGB', (side_length, side_length))
    img.putdata(pixels)
    
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')  # PNG for less compression
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