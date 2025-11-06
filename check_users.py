#!/usr/bin/env python3
"""
Script pour vérifier les utilisateurs dans la base de données
"""
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

async def check_users():
    try:
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        print('🔍 Utilisateurs dans la base de données:')
        print('=' * 60)
        
        users = await db.users.find().to_list(length=None)
        
        if not users:
            print('⚠️ Aucun utilisateur trouvé')
        else:
            for user in users:
                print(f'\n👤 Nom: {user.get("full_name", "N/A")}')
                print(f'📧 Email: {user.get("email", "N/A")}')
                print(f'👔 Rôle: {user.get("role", "N/A")}')
                print(f'🆔 ID: {user.get("id", "N/A")}')
                print('-' * 60)
            
    except Exception as e:
        print(f'❌ Erreur: {str(e)}')
    finally:
        client.close()

async def main():
    await check_users()

if __name__ == "__main__":
    asyncio.run(main())
