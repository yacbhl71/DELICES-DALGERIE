#!/usr/bin/env python3
"""
🔧 OUTILS D'ADMINISTRATION - Délices et Trésors d'Algérie
=========================================================

Ce script permet de gérer les utilisateurs et administrateurs
directement depuis la ligne de commande.

Usage:
    python admin_tools.py [commande] [options]

Commandes disponibles:
    list_users          - Affiche tous les utilisateurs
    list_admins         - Affiche tous les administrateurs
    create_admin        - Crée un nouvel administrateur
    promote_to_admin    - Promouvoit un utilisateur en admin
    demote_to_user      - Rétrograde un admin en utilisateur
    change_password     - Change le mot de passe d'un utilisateur
    delete_user         - Supprime un utilisateur
    toggle_active       - Active/désactive un utilisateur
"""

import asyncio
import sys
import os
import secrets
import string
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Configuration
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'delices_algerie')
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_password(length=16):
    """Génère un mot de passe sécurisé"""
    alphabet = string.ascii_letters + string.digits + '!@#$%&*'
    return ''.join(secrets.choice(alphabet) for _ in range(length))


async def get_db():
    """Obtient la connexion à la base de données"""
    client = AsyncIOMotorClient(MONGO_URL)
    return client, client[DB_NAME]


async def list_users():
    """Affiche tous les utilisateurs"""
    client, db = await get_db()
    users = await db.users.find({}, {"_id": 0, "hashed_password": 0}).to_list(1000)
    
    print("\n📋 LISTE DES UTILISATEURS")
    print("=" * 70)
    
    for user in users:
        status = "🟢" if user.get('is_active', True) else "🔴"
        role_icon = "👑" if user.get('role') == 'admin' else "👤"
        print(f"{status} {role_icon} {user['email']}")
        print(f"      Nom: {user.get('full_name', 'N/A')}")
        print(f"      Rôle: {user.get('role', 'user')}")
        print(f"      ID: {user.get('id', 'N/A')}")
        print("-" * 70)
    
    print(f"\nTotal: {len(users)} utilisateur(s)")
    client.close()


async def list_admins():
    """Affiche tous les administrateurs"""
    client, db = await get_db()
    admins = await db.users.find({"role": "admin"}, {"_id": 0, "hashed_password": 0}).to_list(100)
    
    print("\n👑 LISTE DES ADMINISTRATEURS")
    print("=" * 70)
    
    for admin in admins:
        status = "🟢 Actif" if admin.get('is_active', True) else "🔴 Inactif"
        print(f"📧 {admin['email']}")
        print(f"   Nom: {admin.get('full_name', 'N/A')}")
        print(f"   Status: {status}")
        print(f"   ID: {admin.get('id', 'N/A')}")
        print("-" * 70)
    
    print(f"\nTotal: {len(admins)} administrateur(s)")
    client.close()


async def create_admin(email: str, full_name: str, password: str = None):
    """Crée un nouvel administrateur"""
    client, db = await get_db()
    
    # Vérifier si l'utilisateur existe
    existing = await db.users.find_one({"email": email})
    if existing:
        print(f"❌ L'email {email} est déjà utilisé!")
        client.close()
        return None
    
    # Générer un mot de passe si non fourni
    if not password:
        password = generate_password()
    
    # Créer l'utilisateur
    hashed_password = pwd_context.hash(password)
    
    new_user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "full_name": full_name,
        "role": "admin",
        "is_active": True,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.users.insert_one(new_user)
    
    print(f"\n✅ ADMINISTRATEUR CRÉÉ AVEC SUCCÈS!")
    print("=" * 70)
    print(f"📧 Email: {email}")
    print(f"👤 Nom: {full_name}")
    print(f"🔑 Mot de passe: {password}")
    print("=" * 70)
    print("⚠️  Conservez ce mot de passe en lieu sûr!")
    
    client.close()
    return password


async def promote_to_admin(email: str):
    """Promouvoit un utilisateur en administrateur"""
    client, db = await get_db()
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"role": "admin"}}
    )
    
    if result.modified_count > 0:
        print(f"✅ {email} est maintenant administrateur!")
    else:
        print(f"❌ Utilisateur non trouvé ou déjà admin: {email}")
    
    client.close()


async def demote_to_user(email: str):
    """Rétrograde un administrateur en utilisateur simple"""
    client, db = await get_db()
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"role": "user"}}
    )
    
    if result.modified_count > 0:
        print(f"✅ {email} est maintenant un utilisateur simple.")
    else:
        print(f"❌ Utilisateur non trouvé ou déjà utilisateur: {email}")
    
    client.close()


async def change_password(email: str, new_password: str = None):
    """Change le mot de passe d'un utilisateur"""
    client, db = await get_db()
    
    # Vérifier que l'utilisateur existe
    user = await db.users.find_one({"email": email})
    if not user:
        print(f"❌ Utilisateur non trouvé: {email}")
        client.close()
        return None
    
    # Générer un mot de passe si non fourni
    if not new_password:
        new_password = generate_password()
    
    hashed_password = pwd_context.hash(new_password)
    
    await db.users.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    print(f"\n✅ MOT DE PASSE MODIFIÉ!")
    print("=" * 70)
    print(f"📧 Email: {email}")
    print(f"🔑 Nouveau mot de passe: {new_password}")
    print("=" * 70)
    
    client.close()
    return new_password


async def delete_user(email: str):
    """Supprime un utilisateur"""
    client, db = await get_db()
    
    result = await db.users.delete_one({"email": email})
    
    if result.deleted_count > 0:
        print(f"✅ Utilisateur {email} supprimé.")
    else:
        print(f"❌ Utilisateur non trouvé: {email}")
    
    client.close()


async def toggle_active(email: str):
    """Active ou désactive un utilisateur"""
    client, db = await get_db()
    
    user = await db.users.find_one({"email": email})
    if not user:
        print(f"❌ Utilisateur non trouvé: {email}")
        client.close()
        return
    
    new_status = not user.get('is_active', True)
    
    await db.users.update_one(
        {"email": email},
        {"$set": {"is_active": new_status}}
    )
    
    status_text = "activé" if new_status else "désactivé"
    print(f"✅ Utilisateur {email} {status_text}.")
    
    client.close()


def show_help():
    """Affiche l'aide"""
    print(__doc__)
    print("\nExemples d'utilisation:")
    print("-" * 70)
    print("  python admin_tools.py list_users")
    print("  python admin_tools.py list_admins")
    print("  python admin_tools.py create_admin email@example.com 'Nom Complet'")
    print("  python admin_tools.py create_admin email@example.com 'Nom' 'motdepasse123'")
    print("  python admin_tools.py promote_to_admin email@example.com")
    print("  python admin_tools.py demote_to_user email@example.com")
    print("  python admin_tools.py change_password email@example.com")
    print("  python admin_tools.py change_password email@example.com 'nouveaumotdepasse'")
    print("  python admin_tools.py delete_user email@example.com")
    print("  python admin_tools.py toggle_active email@example.com")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        show_help()
        sys.exit(0)
    
    command = sys.argv[1].lower()
    
    if command == "list_users":
        asyncio.run(list_users())
    
    elif command == "list_admins":
        asyncio.run(list_admins())
    
    elif command == "create_admin":
        if len(sys.argv) < 4:
            print("Usage: python admin_tools.py create_admin <email> <nom_complet> [mot_de_passe]")
            sys.exit(1)
        email = sys.argv[2]
        full_name = sys.argv[3]
        password = sys.argv[4] if len(sys.argv) > 4 else None
        asyncio.run(create_admin(email, full_name, password))
    
    elif command == "promote_to_admin":
        if len(sys.argv) < 3:
            print("Usage: python admin_tools.py promote_to_admin <email>")
            sys.exit(1)
        asyncio.run(promote_to_admin(sys.argv[2]))
    
    elif command == "demote_to_user":
        if len(sys.argv) < 3:
            print("Usage: python admin_tools.py demote_to_user <email>")
            sys.exit(1)
        asyncio.run(demote_to_user(sys.argv[2]))
    
    elif command == "change_password":
        if len(sys.argv) < 3:
            print("Usage: python admin_tools.py change_password <email> [nouveau_mot_de_passe]")
            sys.exit(1)
        email = sys.argv[2]
        password = sys.argv[3] if len(sys.argv) > 3 else None
        asyncio.run(change_password(email, password))
    
    elif command == "delete_user":
        if len(sys.argv) < 3:
            print("Usage: python admin_tools.py delete_user <email>")
            sys.exit(1)
        asyncio.run(delete_user(sys.argv[2]))
    
    elif command == "toggle_active":
        if len(sys.argv) < 3:
            print("Usage: python admin_tools.py toggle_active <email>")
            sys.exit(1)
        asyncio.run(toggle_active(sys.argv[2]))
    
    elif command in ["help", "-h", "--help"]:
        show_help()
    
    else:
        print(f"❌ Commande inconnue: {command}")
        show_help()
        sys.exit(1)
