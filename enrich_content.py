#!/usr/bin/env python3
"""
Script pour enrichir le contenu culturel et historique de Soumam Heritage
"""
import requests
import json

# Configuration
API_BASE = "https://algerian-shop-2.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@soumam.com"
ADMIN_PASSWORD = "admin123"

def get_auth_token():
    """Obtenir un token d'authentification admin"""
    login_data = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    response = requests.post(f"{API_BASE}/auth/login", json=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception(f"Échec de l'authentification: {response.text}")

def add_historical_content(token, content_data):
    """Ajouter du contenu historique"""
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.post(f"{API_BASE}/historical-content", json=content_data, headers=headers)
    if response.status_code == 200:
        print(f"✅ Contenu ajouté: {content_data['title']['fr']}")
        return True
    else:
        print(f"❌ Erreur pour {content_data['title']['fr']}: {response.text}")
        return False

# Contenu culturel enrichi
CULTURAL_CONTENT = [
    {
        "title": {
            "fr": "Les Traditions Culinaires de Kabylie",
            "ar": "التقاليد الطهوية في القبائل",
            "en": "Culinary Traditions of Kabylie"
        },
        "content": {
            "fr": "La cuisine kabyle puise ses racines dans une tradition millénaire amazighe. Les femmes kabyles, gardiennes de ces savoirs ancestraux, transmettent de mère en fille les secrets des recettes traditionnelles. Le couscous, préparé chaque vendredi, constitue le plat emblématique de cette culture. Les épices utilisées proviennent des jardins familiaux : coriandre, menthe, persil frais. La préparation du pain traditionnel, cuit dans le four en terre, rythme la vie quotidienne des villages.",
            "ar": "تستمد المأكولات القبائلية جذورها من تقاليد أمازيغية عريقة. النساء القبائليات، حارسات هذه المعارف الأجدادية، ينقلن من الأم إلى البنت أسرار الوصفات التقليدية. الكسكس، المحضر كل يوم جمعة، يشكل الطبق الرمزي لهذه الثقافة.",
            "en": "Kabyle cuisine draws its roots from an ancient Amazigh tradition. Kabyle women, guardians of this ancestral knowledge, pass down the secrets of traditional recipes from mother to daughter. Couscous, prepared every Friday, is the emblematic dish of this culture."
        },
        "region": "kabylie",
        "image_urls": ["https://images.unsplash.com/photo-1716823141581-12b24feb01ea"]
    },
    {
        "title": {
            "fr": "Ath M'lickech : Village Ancestral",
            "ar": "آث مليكش: قرية أجدادية",
            "en": "Ath M'lickech: Ancestral Village"
        },
        "content": {
            "fr": "Ath M'lickech, dont le nom signifie 'les enfants de Mlickech' en berbère, est un village emblématique de la vallée de Soumam. Niché sur les contreforts des montagnes kabyles, ce village a préservé son authenticité architecturale avec ses maisons en pierre traditionnelles. Les ruelles pavées serpentent entre les habitations séculaires, témoins d'un mode de vie ancestral.",
            "ar": "آث مليكش، الذي يعني 'أبناء مليكش' بالبربرية، قرية رمزية في وادي الصومام. متربع على سفوح الجبال القبائلية، حافظ هذا القرية على أصالته المعمارية ببيوته الحجرية التقليدية.",
            "en": "Ath M'lickech, whose name means 'the children of Mlickech' in Berber, is an emblematic village of the Soumam valley. Nestled on the foothills of the Kabyle mountains, this village has preserved its architectural authenticity."
        },
        "region": "vallee-soumam",
        "image_urls": ["https://images.pexels.com/photos/21847351/pexels-photo-21847351.jpeg"]
    },
    {
        "title": {
            "fr": "Tazmalt : Carrefour Commercial",
            "ar": "تازمالت: ملتقى تجاري",
            "en": "Tazmalt: Commercial Crossroads"
        },
        "content": {
            "fr": "Tazmalt occupe une position stratégique dans la vallée de Soumam, ayant servi de carrefour commercial depuis l'époque romaine. Son nom berbère évoque 'l'endroit des échanges', reflétant sa vocation marchande ancestrale. La ville a conservé des vestiges de son passé prestigieux : anciennes fondouks, marchés traditionnels et architectures ottomanes.",
            "ar": "تحتل تازمالت موقعاً استراتيجياً في وادي الصومام، خدمت كملتقى تجاري منذ العهد الروماني. اسمها البربري يشير إلى 'مكان التبادل'، مما يعكس دعوتها التجارية الأجدادية.",
            "en": "Tazmalt occupies a strategic position in the Soumam valley, having served as a commercial crossroads since Roman times. Its Berber name evokes 'the place of exchanges', reflecting its ancestral merchant vocation."
        },
        "region": "vallee-soumam",
        "image_urls": ["https://images.unsplash.com/photo-1720718517204-a66cc17a1052"]
    },
    {
        "title": {
            "fr": "Les Femmes Kabyles : Gardiennes du Patrimoine",
            "ar": "النساء القبائليات: حارسات التراث",
            "en": "Kabyle Women: Guardians of Heritage"
        },
        "content": {
            "fr": "Les femmes kabyles jouent un rôle central dans la préservation du patrimoine culturel amazigh. Détentrices des savoirs ancestraux, elles transmettent la langue tamazight, les chants traditionnels et l'art culinaire. Leurs robes traditionnelles, ornées de motifs géométriques et de bijoux en argent, sont des œuvres d'art vivantes.",
            "ar": "تلعب النساء القبائليات دوراً محورياً في حفظ التراث الثقافي الأمازيغي. حاملات المعارف الأجدادية، ينقلن اللغة التامازيغت والأغاني التقليدية وفن الطبخ.",
            "en": "Kabyle women play a central role in preserving Amazigh cultural heritage. Holders of ancestral knowledge, they transmit the Tamazight language, traditional songs and culinary art."
        },
        "region": "kabylie",
        "image_urls": ["https://images.unsplash.com/photo-1713007009692-c055a4a5e2df"]
    }
]

def main():
    """Fonction principale d'enrichissement culturel"""
    print("🚀 Enrichissement du contenu culturel de Soumam Heritage")
    print("=" * 60)
    
    try:
        print("🔐 Connexion à l'API...")
        token = get_auth_token()
        print(f"✅ Authentification réussie")
        
        success_count = 0
        failed_count = 0
        
        for i, content in enumerate(CULTURAL_CONTENT, 1):
            print(f"\n📖 Ajout du contenu {i}/{len(CULTURAL_CONTENT)}...")
            if add_historical_content(token, content):
                success_count += 1
            else:
                failed_count += 1
        
        print("\n" + "=" * 60)
        print(f"📊 RÉSUMÉ:")
        print(f"✅ Contenus ajoutés: {success_count}")
        print(f"❌ Échecs: {failed_count}")
        
        if success_count > 0:
            print(f"\n🎉 {success_count} nouveaux contenus culturels ajoutés!")
            print("Visibles sur: https://algerian-shop-2.preview.emergentagent.com/history")
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    main()
