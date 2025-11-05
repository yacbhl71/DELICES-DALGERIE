#!/usr/bin/env python3
"""
Script pour mettre à jour le rôle administrateur
"""
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

async def update_admin_role():
    try:
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        print('🔄 Mise à jour du rôle admin...')
        
        # Mettre à jour le rôle
        result = await db.users.update_one(
            {'email': 'propriétaire@soumam.com'},
            {'$set': {'role': 'admin'}}
        )
        
        if result.modified_count > 0:
            print('✅ Rôle admin mis à jour!')
            
            # Vérifier la mise à jour
            user = await db.users.find_one({'email': 'propriétaire@soumam.com'})
            print(f'👤 Utilisateur: {user["full_name"]}')
            print(f'📧 Email: {user["email"]}')
            print(f'👔 Rôle: {user["role"]}')
            return True
        else:
            print('⚠️ Aucune modification')
            return False
            
    except Exception as e:
        print(f'❌ Erreur: {str(e)}')
        return False
    finally:
        client.close()

async def main():
    await update_admin_role()

if __name__ == "__main__":
    asyncio.run(main())
