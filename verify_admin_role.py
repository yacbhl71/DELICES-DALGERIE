#!/usr/bin/env python3
"""
Vérifier le rôle admin et le corriger si nécessaire
"""
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

async def verify_and_fix_admin():
    try:
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        print('🔍 Vérification des comptes admin...\n')
        
        # Vérifier admin.soumam@gmail.com
        user1 = await db.users.find_one({'email': 'admin.soumam@gmail.com'})
        if user1:
            print(f'👤 Email: admin.soumam@gmail.com')
            print(f'   Nom: {user1.get("full_name")}')
            print(f'   Rôle actuel: {user1.get("role")}')
            
            if user1.get("role") != "admin":
                print('   ⚠️ PROBLÈME: Rôle incorrect!')
                print('   🔧 Correction en cours...')
                await db.users.update_one(
                    {'email': 'admin.soumam@gmail.com'},
                    {'$set': {'role': 'admin'}}
                )
                print('   ✅ Rôle corrigé en "admin"')
            else:
                print('   ✅ Rôle correct')
        else:
            print('❌ Compte admin.soumam@gmail.com non trouvé!')
            
        print('\n' + '='*60 + '\n')
        
        # Vérifier propriétaire@soumam.com
        user2 = await db.users.find_one({'email': 'propriétaire@soumam.com'})
        if user2:
            print(f'👤 Email: propriétaire@soumam.com')
            print(f'   Nom: {user2.get("full_name")}')
            print(f'   Rôle actuel: {user2.get("role")}')
            
            if user2.get("role") != "admin":
                print('   ⚠️ PROBLÈME: Rôle incorrect!')
                print('   🔧 Correction en cours...')
                await db.users.update_one(
                    {'email': 'propriétaire@soumam.com'},
                    {'$set': {'role': 'admin'}}
                )
                print('   ✅ Rôle corrigé en "admin"')
            else:
                print('   ✅ Rôle correct')
        else:
            print('❌ Compte propriétaire@soumam.com non trouvé!')
            
        print('\n' + '='*60 + '\n')
        print('✅ Vérification terminée!')
            
    except Exception as e:
        print(f'❌ Erreur: {str(e)}')
    finally:
        client.close()

async def main():
    await verify_and_fix_admin()

if __name__ == "__main__":
    asyncio.run(main())
