#!/usr/bin/env python3
"""
Script pour corriger le rôle de l'administrateur dans MongoDB
"""
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

async def fix_admin_role():
    """Corriger le rôle admin dans MongoDB"""
    try:
        # Se connecter à MongoDB
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        print("🔄 Connexion à MongoDB...")
        
        # Chercher l'utilisateur admin
        admin_user = await db.users.find_one({"email": "admin@soumam.com"})
        
        if admin_user:
            print(f"👤 Utilisateur trouvé: {admin_user['full_name']}")
            print(f"📧 Email: {admin_user['email']}")
            print(f"👔 Rôle actuel: {admin_user.get('role', 'user')}")
            
            # Mettre à jour le rôle
            result = await db.users.update_one(
                {"email": "admin@soumam.com"},
                {"$set": {"role": "admin"}}
            )
            
            if result.modified_count > 0:
                print("✅ Rôle mis à jour avec succès!")
                
                # Vérifier la mise à jour
                updated_user = await db.users.find_one({"email": "admin@soumam.com"})
                print(f"✅ Nouveau rôle: {updated_user['role']}")
                
                return True
            else:
                print("⚠️  Aucune modification effectuée")
                return False
        else:
            print("❌ Utilisateur admin non trouvé")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False
    finally:
        client.close()

async def main():
    """Fonction principale"""
    print("🚀 Correction du rôle administrateur")
    print("=" * 50)
    
    success = await fix_admin_role()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Admin role corrigé! Vous pouvez maintenant accéder au panel admin.")
        print("🌐 URL: https://delices-store.preview.emergentagent.com/admin")
        print("📧 Email: admin@soumam.com")
        print("🔑 Mot de passe: admin123")
    else:
        print("❌ Échec de la correction du rôle admin")

if __name__ == "__main__":
    asyncio.run(main())