#!/usr/bin/env python3
"""
Script pour ajouter 30 recettes algériennes authentiques à la base de données Soumam Heritage
"""
import requests
import json
from datetime import datetime

# Configuration
API_BASE = "https://soumam-valley.preview.emergentagent.com/api"

# Données de connexion admin (vous pouvez créer un compte admin)
ADMIN_EMAIL = "admin@soumam.com"
ADMIN_PASSWORD = "admin123"
ADMIN_NAME = "Admin Soumam Heritage"

def get_auth_token():
    """Obtenir un token d'authentification"""
    # D'abord, essayer de s'inscrire (au cas où le compte n'existe pas)
    register_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "full_name": ADMIN_NAME
    }
    
    try:
        requests.post(f"{API_BASE}/auth/register", json=register_data)
    except:
        pass  # Le compte existe peut-être déjà
    
    # Se connecter
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    response = requests.post(f"{API_BASE}/auth/login", json=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception(f"Échec de l'authentification: {response.text}")

def add_recipe(token, recipe_data):
    """Ajouter une recette"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{API_BASE}/recipes", json=recipe_data, headers=headers)
    if response.status_code == 200:
        print(f"✅ Recette ajoutée: {recipe_data['title']['fr']}")
        return True
    else:
        print(f"❌ Erreur pour {recipe_data['title']['fr']}: {response.text}")
        return False

# 30 recettes algériennes authentiques
RECIPES = [
    {
        "title": {
            "fr": "Couscous au poulet et légumes",
            "ar": "كسكس بالدجاج والخضار",
            "en": "Chicken and Vegetable Couscous"
        },
        "description": {
            "fr": "Le plat national algérien par excellence, couscous traditionnel avec du poulet et des légumes de saison",
            "ar": "الطبق الوطني الجزائري الأصيل، كسكس تقليدي بالدجاج وخضار الموسم",
            "en": "The quintessential Algerian national dish, traditional couscous with chicken and seasonal vegetables"
        },
        "ingredients": {
            "fr": ["500g de semoule de couscous", "1 poulet entier", "2 courgettes", "2 carottes", "2 navets", "400g de pois chiches", "2 tomates", "1 oignon", "Ras el hanout", "Sel, poivre"],
            "ar": ["500غ سميد كسكس", "دجاجة كاملة", "2 كوسة", "2 جزر", "2 لفت", "400غ حمص", "2 طماطم", "بصلة", "راس الحانوت", "ملح، فلفل"],
            "en": ["500g couscous semolina", "1 whole chicken", "2 zucchini", "2 carrots", "2 turnips", "400g chickpeas", "2 tomatoes", "1 onion", "Ras el hanout", "Salt, pepper"]
        },
        "instructions": {
            "fr": ["Faire tremper les pois chiches", "Cuire le poulet avec les épices", "Préparer les légumes", "Cuire le couscous à la vapeur", "Servir chaud"],
            "ar": ["نقع الحمص", "طبخ الدجاج مع البهارات", "تحضير الخضار", "طبخ الكسكس بالبخار", "يقدم ساخناً"],
            "en": ["Soak chickpeas", "Cook chicken with spices", "Prepare vegetables", "Steam cook couscous", "Serve hot"]
        },
        "image_url": "https://images.unsplash.com/photo-1739217744880-472f59559cc5",
        "prep_time": 45,
        "cook_time": 90,
        "servings": 8,
        "difficulty": "moyen",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Tajine d'agneau aux pruneaux",
            "ar": "طاجين لحم الغنم بالبرقوق",
            "en": "Lamb Tagine with Prunes"
        },
        "description": {
            "fr": "Plat traditionnel mijoté avec de l'agneau tendre et des pruneaux sucrés, parfumé aux épices du Maghreb",
            "ar": "طبق تقليدي مطبوخ باللحم الطري والبرقوق الحلو، معطر ببهارات المغرب العربي",
            "en": "Traditional slow-cooked dish with tender lamb and sweet prunes, flavored with Maghreb spices"
        },
        "ingredients": {
            "fr": ["1kg d'agneau en morceaux", "200g de pruneaux", "2 oignons", "1 bâton de cannelle", "1 c.à.c de gingembre", "Safran", "Miel", "Amandes grillées"],
            "ar": ["1كغ لحم غنم مقطع", "200غ برقوق", "2 بصل", "عود قرفة", "م.ص زنجبيل", "زعفران", "عسل", "لوز محمص"],
            "en": ["1kg lamb pieces", "200g prunes", "2 onions", "1 cinnamon stick", "1 tsp ginger", "Saffron", "Honey", "Roasted almonds"]
        },
        "instructions": {
            "fr": ["Faire revenir l'agneau", "Ajouter les oignons et épices", "Laisser mijoter 1h30", "Ajouter les pruneaux", "Garnir d'amandes"],
            "ar": ["تحمير اللحم", "إضافة البصل والبهارات", "ترك ينضج ساعة ونصف", "إضافة البرقوق", "تزيين باللوز"],
            "en": ["Brown the lamb", "Add onions and spices", "Simmer for 1h30", "Add prunes", "Garnish with almonds"]
        },
        "image_url": "https://images.unsplash.com/photo-1689245780587-a9a6725718b1",
        "prep_time": 30,
        "cook_time": 120,
        "servings": 6,
        "difficulty": "moyen",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Chorba frik (Soupe d'orge concassée)",
            "ar": "شوربة فريك",
            "en": "Frik Chorba (Crushed Wheat Soup)"
        },
        "description": {
            "fr": "Soupe traditionnelle algérienne à base d'orge concassée, idéale pour rompre le jeûne du Ramadan",
            "ar": "حساء جزائري تقليدي بالفريك، مثالي لكسر صيام رمضان",
            "en": "Traditional Algerian soup made with crushed wheat, perfect for breaking Ramadan fast"
        },
        "ingredients": {
            "fr": ["200g de frik", "500g d'agneau", "2 tomates", "1 oignon", "Coriandre fraîche", "Menthe", "Pois chiches", "Épices"],
            "ar": ["200غ فريك", "500غ لحم غنم", "2 طماطم", "بصلة", "كزبرة طازجة", "نعناع", "حمص", "بهارات"],
            "en": ["200g frik", "500g lamb", "2 tomatoes", "1 onion", "Fresh coriander", "Mint", "Chickpeas", "Spices"]
        },
        "instructions": {
            "fr": ["Cuire la viande", "Ajouter le frik", "Incorporer les légumes", "Assaisonner", "Garnir d'herbes fraîches"],
            "ar": ["طبخ اللحم", "إضافة الفريك", "دمج الخضار", "التتبيل", "تزيين بالأعشاب الطازجة"],
            "en": ["Cook the meat", "Add frik", "Incorporate vegetables", "Season", "Garnish with fresh herbs"]
        },
        "image_url": "https://images.unsplash.com/photo-1746274394124-141a1d1c5af3",
        "prep_time": 20,
        "cook_time": 60,
        "servings": 6,
        "difficulty": "facile",
        "category": "soupes"
    },
    {
        "title": {
            "fr": "Makroudh aux dattes",
            "ar": "مقروض بالتمر",
            "en": "Date-filled Makroudh"
        },
        "description": {
            "fr": "Pâtisserie traditionnelle algérienne en forme de losange, farcie aux dattes et parfumée à la fleur d'oranger",
            "ar": "حلويات جزائرية تقليدية بشكل معين، محشوة بالتمر ومعطرة بماء الزهر",
            "en": "Traditional Algerian diamond-shaped pastry, stuffed with dates and scented with orange blossom"
        },
        "ingredients": {
            "fr": ["500g de semoule fine", "200g de beurre", "500g de dattes dénoyautées", "Eau de fleur d'oranger", "Miel pour l'enrobage"],
            "ar": ["500غ سميد ناعم", "200غ زبدة", "500غ تمر منزوع النوى", "ماء زهر", "عسل للتغليف"],
            "en": ["500g fine semolina", "200g butter", "500g pitted dates", "Orange blossom water", "Honey for coating"]
        },
        "instructions": {
            "fr": ["Préparer la pâte", "Cuire les dattes", "Former les makroudh", "Cuire au four", "Enrober de miel"],
            "ar": ["تحضير العجينة", "طبخ التمر", "تشكيل المقروض", "الخبز في الفرن", "تغليف بالعسل"],
            "en": ["Prepare dough", "Cook dates", "Shape makroudh", "Bake in oven", "Coat with honey"]
        },
        "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        "prep_time": 60,
        "cook_time": 45,
        "servings": 20,
        "difficulty": "difficile",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Chakhchoukha de Constantine",
            "ar": "شخشوخة قسنطينة",
            "en": "Constantine Chakhchoukha"
        },
        "description": {
            "fr": "Spécialité de Constantine à base de galettes de pain cassées et sauce épicée",
            "ar": "أكلة شعبية من قسنطينة بالخبز المكسور والصلصة الحارة",
            "en": "Constantine specialty made with broken bread cakes and spicy sauce"
        },
        "ingredients": {
            "fr": ["Galettes de pain", "Viande d'agneau", "Pois chiches", "Tomates", "Oignons", "Harissa", "Épices"],
            "ar": ["رقاق الخبز", "لحم غنم", "حمص", "طماطم", "بصل", "هريسة", "بهارات"],
            "en": ["Bread cakes", "Lamb meat", "Chickpeas", "Tomatoes", "Onions", "Harissa", "Spices"]
        },
        "instructions": {
            "fr": ["Casser les galettes", "Préparer la sauce", "Cuire la viande", "Mélanger le tout", "Servir chaud"],
            "ar": ["كسر الرقاق", "تحضير الصلصة", "طبخ اللحم", "خلط الكل", "يقدم ساخناً"],
            "en": ["Break the cakes", "Prepare sauce", "Cook meat", "Mix everything", "Serve hot"]
        },
        "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
        "prep_time": 30,
        "cook_time": 90,
        "servings": 6,
        "difficulty": "moyen",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Dolma aux feuilles de vigne",
            "ar": "دولمة بأوراق العنب",
            "en": "Vine Leaves Dolma"
        },
        "description": {
            "fr": "Feuilles de vigne farcies au riz et à la viande hachée, cuites dans un bouillon parfumé",
            "ar": "أوراق عنب محشوة بالأرز واللحم المفروم، مطبوخة في مرق معطر",
            "en": "Vine leaves stuffed with rice and minced meat, cooked in fragrant broth"
        },
        "ingredients": {
            "fr": ["Feuilles de vigne", "300g de riz", "300g de viande hachée", "Tomates", "Oignons", "Persil", "Menthe"],
            "ar": ["أوراق عنب", "300غ أرز", "300غ لحم مفروم", "طماطم", "بصل", "بقدونس", "نعناع"],
            "en": ["Vine leaves", "300g rice", "300g minced meat", "Tomatoes", "Onions", "Parsley", "Mint"]
        },
        "instructions": {
            "fr": ["Blanchir les feuilles", "Préparer la farce", "Rouler les dolmas", "Cuire en casserole", "Servir tiède"],
            "ar": ["سلق الأوراق", "تحضير الحشوة", "لف الدولمة", "الطبخ في الطنجرة", "يقدم دافئاً"],
            "en": ["Blanch leaves", "Prepare stuffing", "Roll dolmas", "Cook in pot", "Serve warm"]
        },
        "image_url": "https://images.unsplash.com/photo-1562059390-a761a084768e",
        "prep_time": 45,
        "cook_time": 60,
        "servings": 6,
        "difficulty": "moyen",
        "category": "entrees"
    },
    {
        "title": {
            "fr": "Baklava algérien aux amandes",
            "ar": "بقلاوة جزائرية باللوز",
            "en": "Algerian Almond Baklava"
        },
        "description": {
            "fr": "Pâtisserie feuilletée traditionnelle garnie d'amandes et nappée de miel parfumé",
            "ar": "حلويات مورقة تقليدية بحشوة اللوز ومغطاة بالعسل المعطر",
            "en": "Traditional flaky pastry filled with almonds and drizzled with scented honey"
        },
        "ingredients": {
            "fr": ["Pâte filo", "400g d'amandes moulues", "300g de beurre fondu", "Miel", "Eau de rose", "Cannelle"],
            "ar": ["عجينة رقيقة", "400غ لوز مطحون", "300غ زبدة ذائبة", "عسل", "ماء ورد", "قرفة"],
            "en": ["Filo pastry", "400g ground almonds", "300g melted butter", "Honey", "Rose water", "Cinnamon"]
        },
        "instructions": {
            "fr": ["Étaler la pâte", "Badigeonner de beurre", "Ajouter les amandes", "Cuire au four", "Arroser de miel"],
            "ar": ["فرد العجين", "دهن بالزبدة", "إضافة اللوز", "الخبز في الفرن", "سقي بالعسل"],
            "en": ["Roll out pastry", "Brush with butter", "Add almonds", "Bake in oven", "Drizzle with honey"]
        },
        "image_url": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
        "prep_time": 40,
        "cook_time": 35,
        "servings": 12,
        "difficulty": "difficile",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Rechta aux haricots verts",
            "ar": "رشتة بالفاصوليا الخضراء",
            "en": "Rechta with Green Beans"
        },
        "description": {
            "fr": "Pâtes algériennes traditionnelles servies avec des haricots verts et du poulet dans une sauce parfumée",
            "ar": "معكرونة جزائرية تقليدية تقدم مع الفاصوليا الخضراء والدجاج في صلصة معطرة",
            "en": "Traditional Algerian pasta served with green beans and chicken in a fragrant sauce"
        },
        "ingredients": {
            "fr": ["Pâtes rechta", "500g de haricots verts", "1 poulet", "Tomates", "Oignons", "Ail", "Épices"],
            "ar": ["رشتة", "500غ فاصوليا خضراء", "دجاجة", "طماطم", "بصل", "ثوم", "بهارات"],
            "en": ["Rechta pasta", "500g green beans", "1 chicken", "Tomatoes", "Onions", "Garlic", "Spices"]
        },
        "instructions": {
            "fr": ["Cuire le poulet", "Préparer les légumes", "Cuire les pâtes", "Mélanger avec la sauce", "Servir chaud"],
            "ar": ["طبخ الدجاج", "تحضير الخضار", "طبخ الرشتة", "خلط مع الصلصة", "يقدم ساخناً"],
            "en": ["Cook chicken", "Prepare vegetables", "Cook pasta", "Mix with sauce", "Serve hot"]
        },
        "image_url": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5",
        "prep_time": 25,
        "cook_time": 75,
        "servings": 6,
        "difficulty": "facile",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Harira algérienne",
            "ar": "الحريرة الجزائرية",
            "en": "Algerian Harira"
        },
        "description": {
            "fr": "Soupe traditionnelle riche et nutritive, parfaite pour le ftour de Ramadan",
            "ar": "حساء تقليدي غني ومغذي، مثالي لفطور رمضان",
            "en": "Rich and nutritious traditional soup, perfect for Ramadan iftar"
        },
        "ingredients": {
            "fr": ["Lentilles", "Pois chiches", "Viande d'agneau", "Tomates", "Coriandre", "Persil", "Farine", "Œufs"],
            "ar": ["عدس", "حمص", "لحم غنم", "طماطم", "كزبرة", "بقدونس", "دقيق", "بيض"],
            "en": ["Lentils", "Chickpeas", "Lamb meat", "Tomatoes", "Coriander", "Parsley", "Flour", "Eggs"]
        },
        "instructions": {
            "fr": ["Cuire les légumineuses", "Préparer la base", "Ajouter la viande", "Lier avec la farine", "Terminer avec les œufs"],
            "ar": ["طبخ البقوليات", "تحضير القاعدة", "إضافة اللحم", "الربط بالدقيق", "الإنهاء بالبيض"],
            "en": ["Cook legumes", "Prepare base", "Add meat", "Thicken with flour", "Finish with eggs"]
        },
        "image_url": "https://images.unsplash.com/photo-1547592166-23ac45744acd",
        "prep_time": 20,
        "cook_time": 90,
        "servings": 8,
        "difficulty": "moyen",
        "category": "soupes"
    },
    {
        "title": {
            "fr": "Trida aux légumes",
            "ar": "تريدة بالخضار",
            "en": "Vegetable Trida"
        },
        "description": {
            "fr": "Plat traditionnel à base de galettes de pain et légumes mijotés, spécialité de l'Est algérien",
            "ar": "طبق تقليدي بالرقاق والخضار المطبوخة، من تخصصات الشرق الجزائري",
            "en": "Traditional dish made with bread cakes and stewed vegetables, specialty of Eastern Algeria"
        },
        "ingredients": {
            "fr": ["Galettes trida", "Courgettes", "Aubergines", "Tomates", "Oignons", "Pois chiches", "Épices"],
            "ar": ["رقاق التريدة", "كوسة", "باذنجان", "طماطم", "بصل", "حمص", "بهارات"],
            "en": ["Trida cakes", "Zucchini", "Eggplants", "Tomatoes", "Onions", "Chickpeas", "Spices"]
        },
        "instructions": {
            "fr": ["Préparer les légumes", "Cuire les galettes", "Faire mijoter", "Assembler le plat", "Servir bien chaud"],
            "ar": ["تحضير الخضار", "طبخ الرقاق", "ترك ينضج", "تجميع الطبق", "يقدم ساخناً جداً"],
            "en": ["Prepare vegetables", "Cook cakes", "Simmer", "Assemble dish", "Serve very hot"]
        },
        "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
        "prep_time": 30,
        "cook_time": 60,
        "servings": 6,
        "difficulty": "moyen",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Chouarak (Brioche algérienne)",
            "ar": "الشوراك (بريوش جزائري)",
            "en": "Chouarak (Algerian Brioche)"
        },
        "description": {
            "fr": "Pain brioché traditionnel algérien, moelleux et parfumé à la fleur d'oranger, idéal pour le petit-déjeuner",
            "ar": "خبز بريوش جزائري تقليدي، طري ومعطر بماء الزهر، مثالي للفطور",
            "en": "Traditional Algerian brioche bread, soft and scented with orange blossom, perfect for breakfast"
        },
        "ingredients": {
            "fr": ["500g de farine", "3 œufs", "100g de beurre", "Lait tiède", "Levure", "Sucre", "Eau de fleur d'oranger"],
            "ar": ["500غ دقيق", "3 بيضات", "100غ زبدة", "حليب دافئ", "خميرة", "سكر", "ماء زهر"],
            "en": ["500g flour", "3 eggs", "100g butter", "Warm milk", "Yeast", "Sugar", "Orange blossom water"]
        },
        "instructions": {
            "fr": ["Activer la levure", "Pétrir la pâte", "Laisser lever", "Former les brioches", "Cuire au four"],
            "ar": ["تنشيط الخميرة", "عجن العجينة", "ترك تخمر", "تشكيل البريوش", "الخبز في الفرن"],
            "en": ["Activate yeast", "Knead dough", "Let rise", "Shape brioches", "Bake in oven"]
        },
        "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff",
        "prep_time": 180,
        "cook_time": 25,
        "servings": 8,
        "difficulty": "moyen",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Mderbel (Couscous sucré)",
            "ar": "مدربل (كسكس حلو)",
            "en": "Mderbel (Sweet Couscous)"
        },
        "description": {
            "fr": "Couscous sucré traditionnel aux raisins secs, amandes et cannelle, servi comme dessert",
            "ar": "كسكس حلو تقليدي بالزبيب واللوز والقرفة، يقدم كحلوى",
            "en": "Traditional sweet couscous with raisins, almonds and cinnamon, served as dessert"
        },
        "ingredients": {
            "fr": ["Couscous fin", "Lait", "Sucre", "Raisins secs", "Amandes effilées", "Cannelle", "Beurre"],
            "ar": ["كسكس ناعم", "حليب", "سكر", "زبيب", "لوز مقطع", "قرفة", "زبدة"],
            "en": ["Fine couscous", "Milk", "Sugar", "Raisins", "Sliced almonds", "Cinnamon", "Butter"]
        },
        "instructions": {
            "fr": ["Cuire le couscous", "Chauffer le lait", "Mélanger avec le sucre", "Ajouter les fruits secs", "Servir froid"],
            "ar": ["طبخ الكسكس", "تسخين الحليب", "خلط مع السكر", "إضافة الفواكه المجففة", "يقدم بارداً"],
            "en": ["Cook couscous", "Heat milk", "Mix with sugar", "Add dried fruits", "Serve cold"]
        },
        "image_url": "https://images.unsplash.com/photo-1551024506-0bccd828d307",
        "prep_time": 20,
        "cook_time": 30,
        "servings": 6,
        "difficulty": "facile",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Boureks aux épinards",
            "ar": "بوراك بالسبانخ",
            "en": "Spinach Boureks"
        },
        "description": {
            "fr": "Feuilletés croustillants farcis aux épinards et fromage, parfaits pour l'apéritif",
            "ar": "فطائر مقرمشة محشوة بالسبانخ والجبن، مثالية للمقبلات",
            "en": "Crispy puff pastries stuffed with spinach and cheese, perfect for appetizers"
        },
        "ingredients": {
            "fr": ["Pâte filo", "500g d'épinards", "200g de fromage blanc", "Œufs", "Oignons", "Huile d'olive"],
            "ar": ["عجينة رقيقة", "500غ سبانخ", "200غ جبن أبيض", "بيض", "بصل", "زيت زيتون"],
            "en": ["Filo pastry", "500g spinach", "200g white cheese", "Eggs", "Onions", "Olive oil"]
        },
        "instructions": {
            "fr": ["Faire revenir les épinards", "Préparer la farce", "Farcir les feuilles", "Rouler en triangles", "Frire jusqu'à dorure"],
            "ar": ["قلي السبانخ", "تحضير الحشوة", "حشو الأوراق", "لف على شكل مثلثات", "قلي حتى اللون الذهبي"],
            "en": ["Sauté spinach", "Prepare filling", "Stuff leaves", "Roll into triangles", "Fry until golden"]
        },
        "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
        "prep_time": 45,
        "cook_time": 20,
        "servings": 15,
        "difficulty": "moyen",
        "category": "entrees"
    },
    {
        "title": {
            "fr": "Qalb el louz",
            "ar": "قلب اللوز",
            "en": "Almond Hearts"
        },
        "description": {
            "fr": "Délicieuses pâtisseries algériennes en forme de cœur, à base d'amandes et parfumées à la rose",
            "ar": "حلويات جزائرية لذيذة على شكل قلب، من اللوز ومعطرة بالورد",
            "en": "Delicious Algerian heart-shaped pastries, made with almonds and rose-scented"
        },
        "ingredients": {
            "fr": ["Poudre d'amandes", "Sucre glace", "Blancs d'œufs", "Eau de rose", "Colorant alimentaire"],
            "ar": ["مسحوق اللوز", "سكر بودرة", "بياض البيض", "ماء ورد", "ملون غذائي"],
            "en": ["Almond powder", "Powdered sugar", "Egg whites", "Rose water", "Food coloring"]
        },
        "instructions": {
            "fr": ["Mélanger les ingrédients", "Former la pâte", "Découper en cœurs", "Cuire délicatement", "Décorer"],
            "ar": ["خلط المكونات", "تشكيل العجينة", "تقطيع على شكل قلوب", "الخبز بلطف", "التزيين"],
            "en": ["Mix ingredients", "Form dough", "Cut into hearts", "Bake gently", "Decorate"]
        },
        "image_url": "https://images.unsplash.com/photo-1486427944299-d1955d23e34d",
        "prep_time": 30,
        "cook_time": 15,
        "servings": 20,
        "difficulty": "moyen",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Mahshi (Légumes farcis)",
            "ar": "محاشي (خضار محشوة)",
            "en": "Mahshi (Stuffed Vegetables)"
        },
        "description": {
            "fr": "Assortiment de légumes farcis au riz et à la viande, cuits dans une sauce tomate parfumée",
            "ar": "تشكيلة من الخضار المحشوة بالأرز واللحم، مطبوخة في صلصة طماطم معطرة",
            "en": "Assorted vegetables stuffed with rice and meat, cooked in fragrant tomato sauce"
        },
        "ingredients": {
            "fr": ["Courgettes", "Aubergines", "Poivrons", "Riz", "Viande hachée", "Tomates", "Herbes fraîches"],
            "ar": ["كوسة", "باذنجان", "فلفل", "أرز", "لحم مفروم", "طماطم", "أعشاب طازجة"],
            "en": ["Zucchini", "Eggplants", "Peppers", "Rice", "Minced meat", "Tomatoes", "Fresh herbs"]
        },
        "instructions": {
            "fr": ["Évider les légumes", "Préparer la farce", "Farcir délicatement", "Cuire en sauce", "Servir chaud"],
            "ar": ["تفريغ الخضار", "تحضير الحشوة", "الحشو بعناية", "الطبخ في الصلصة", "يقدم ساخناً"],
            "en": ["Hollow vegetables", "Prepare stuffing", "Stuff carefully", "Cook in sauce", "Serve hot"]
        },
        "image_url": "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
        "prep_time": 60,
        "cook_time": 90,
        "servings": 8,
        "difficulty": "difficile",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Zlabiya (Beignets au miel)",
            "ar": "زلابية (دونتس بالعسل)",
            "en": "Zlabiya (Honey Fritters)"
        },
        "description": {
            "fr": "Beignets traditionnels algériens en forme de spirale, croustillants et nappés de miel parfumé",
            "ar": "دونتس جزائري تقليدي على شكل حلزوني، مقرمش ومغطى بالعسل المعطر",
            "en": "Traditional Algerian spiral-shaped fritters, crispy and drizzled with scented honey"
        },
        "ingredients": {
            "fr": ["Farine", "Œufs", "Levure", "Huile pour friture", "Miel", "Eau de fleur d'oranger"],
            "ar": ["دقيق", "بيض", "خميرة", "زيت للقلي", "عسل", "ماء زهر"],
            "en": ["Flour", "Eggs", "Yeast", "Oil for frying", "Honey", "Orange blossom water"]
        },
        "instructions": {
            "fr": ["Préparer la pâte", "Laisser reposer", "Former les spirales", "Frire jusqu'à dorure", "Napper de miel"],
            "ar": ["تحضير العجينة", "ترك تستريح", "تشكيل الحلزونات", "القلي حتى اللون الذهبي", "سقي بالعسل"],
            "en": ["Prepare batter", "Let rest", "Form spirals", "Fry until golden", "Drizzle with honey"]
        },
        "image_url": "https://images.unsplash.com/photo-1541544181051-e46607705491",
        "prep_time": 30,
        "cook_time": 20,
        "servings": 12,
        "difficulty": "moyen",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Loubia (Haricots blancs en sauce)",
            "ar": "لوبيا (فاصوليا بيضاء بالصلصة)",
            "en": "Loubia (White Beans in Sauce)"
        },
        "description": {
            "fr": "Plat traditionnel de haricots blancs mijotés dans une sauce tomate épicée avec de la viande",
            "ar": "طبق تقليدي من الفاصوليا البيضاء المطبوخة في صلصة طماطم حارة مع اللحم",
            "en": "Traditional dish of white beans simmered in spicy tomato sauce with meat"
        },
        "ingredients": {
            "fr": ["Haricots blancs", "Viande d'agneau", "Tomates", "Oignons", "Ail", "Persil", "Épices"],
            "ar": ["فاصوليا بيضاء", "لحم غنم", "طماطم", "بصل", "ثوم", "بقدونس", "بهارات"],
            "en": ["White beans", "Lamb meat", "Tomatoes", "Onions", "Garlic", "Parsley", "Spices"]
        },
        "instructions": {
            "fr": ["Tremper les haricots", "Cuire la viande", "Préparer la sauce", "Mijoter ensemble", "Garnir de persil"],
            "ar": ["نقع الفاصوليا", "طبخ اللحم", "تحضير الصلصة", "ترك ينضج معاً", "تزيين بالبقدونس"],
            "en": ["Soak beans", "Cook meat", "Prepare sauce", "Simmer together", "Garnish with parsley"]
        },
        "image_url": "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f",
        "prep_time": 20,
        "cook_time": 120,
        "servings": 6,
        "difficulty": "facile",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Samsa aux amandes",
            "ar": "سمسة باللوز",
            "en": "Almond Samsa"
        },
        "description": {
            "fr": "Petites pâtisseries triangulaires croustillantes, fourrées aux amandes et parfumées au miel",
            "ar": "معجنات صغيرة مثلثة مقرمشة، محشوة باللوز ومعطرة بالعسل",
            "en": "Small crispy triangular pastries, filled with almonds and honey-scented"
        },
        "ingredients": {
            "fr": ["Pâte à samsa", "Amandes moulues", "Sucre", "Eau de rose", "Miel", "Graines de sésame"],
            "ar": ["عجينة السمسة", "لوز مطحون", "سكر", "ماء ورد", "عسل", "سمسم"],
            "en": ["Samsa pastry", "Ground almonds", "Sugar", "Rose water", "Honey", "Sesame seeds"]
        },
        "instructions": {
            "fr": ["Préparer la farce", "Découper la pâte", "Farcir et plier", "Parsemer de sésame", "Cuire au four"],
            "ar": ["تحضير الحشوة", "تقطيع العجين", "الحشو والطي", "رش السمسم", "الخبز في الفرن"],
            "en": ["Prepare filling", "Cut pastry", "Fill and fold", "Sprinkle sesame", "Bake in oven"]
        },
        "image_url": "https://images.unsplash.com/photo-1558618666-fbd7c4347d56",
        "prep_time": 40,
        "cook_time": 25,
        "servings": 16,
        "difficulty": "moyen",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Kefta aux œufs (Boulettes de viande)",
            "ar": "كفتة بالبيض",
            "en": "Kefta with Eggs (Meatballs)"
        },
        "description": {
            "fr": "Boulettes de viande épicées cuites dans une sauce tomate avec des œufs, parfait avec du pain",
            "ar": "كرات لحم متبلة مطبوخة في صلصة طماطم مع البيض، مثالي مع الخبز",
            "en": "Spiced meatballs cooked in tomato sauce with eggs, perfect with bread"
        },
        "ingredients": {
            "fr": ["Viande hachée", "Œufs", "Oignons", "Persil", "Tomates", "Ail", "Épices diverses"],
            "ar": ["لحم مفروم", "بيض", "بصل", "بقدونس", "طماطم", "ثوم", "بهارات متنوعة"],
            "en": ["Minced meat", "Eggs", "Onions", "Parsley", "Tomatoes", "Garlic", "Various spices"]
        },
        "instructions": {
            "fr": ["Former les boulettes", "Préparer la sauce", "Cuire les keftas", "Ajouter les œufs", "Mijoter ensemble"],
            "ar": ["تشكيل الكرات", "تحضير الصلصة", "طبخ الكفتة", "إضافة البيض", "ترك ينضج معاً"],
            "en": ["Form meatballs", "Prepare sauce", "Cook keftas", "Add eggs", "Simmer together"]
        },
        "image_url": "https://images.unsplash.com/photo-1529042410759-befb1204b468",
        "prep_time": 25,
        "cook_time": 35,
        "servings": 6,
        "difficulty": "facile",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Tamr ou laben (Dattes au lait)",
            "ar": "تمر ولبن",
            "en": "Tamr ou Laben (Dates with Milk)"
        },
        "description": {
            "fr": "Dessert traditionnel simple et nutritif à base de dattes fraîches et de lait, idéal pour l'iftar",
            "ar": "حلوى تقليدية بسيطة ومغذية من التمر الطازج والحليب، مثالية للإفطار",
            "en": "Simple and nutritious traditional dessert made with fresh dates and milk, perfect for iftar"
        },
        "ingredients": {
            "fr": ["Dattes fraîches", "Lait frais", "Amandes concassées", "Eau de rose", "Miel (optionnel)"],
            "ar": ["تمر طازج", "حليب طازج", "لوز مجروش", "ماء ورد", "عسل (اختياري)"],
            "en": ["Fresh dates", "Fresh milk", "Crushed almonds", "Rose water", "Honey (optional)"]
        },
        "instructions": {
            "fr": ["Dénoyauter les dattes", "Chauffer le lait", "Mélanger délicatement", "Parfumer à la rose", "Garnir d'amandes"],
            "ar": ["إزالة نوى التمر", "تسخين الحليب", "خلط بلطف", "تعطير بالورد", "تزيين باللوز"],
            "en": ["Pit the dates", "Heat milk", "Mix gently", "Scent with rose", "Garnish with almonds"]
        },
        "image_url": "https://images.unsplash.com/photo-1559181567-c3190ca9959b",
        "prep_time": 10,
        "cook_time": 5,
        "servings": 4,
        "difficulty": "facile",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Chorba beida (Soupe blanche)",
            "ar": "شوربة بيضاء",
            "en": "Chorba Beida (White Soup)"
        },
        "description": {
            "fr": "Soupe traditionnelle algérienne crémeuse et réconfortante, parfaite pour les jours froids",
            "ar": "حساء جزائري تقليدي كريمي ومريح، مثالي للأيام الباردة",
            "en": "Traditional creamy and comforting Algerian soup, perfect for cold days"
        },
        "ingredients": {
            "fr": ["Poulet", "Vermicelles", "Œufs", "Citron", "Oignons", "Persil", "Épices douces"],
            "ar": ["دجاج", "شعيرية", "بيض", "ليمون", "بصل", "بقدونس", "بهارات خفيفة"],
            "en": ["Chicken", "Vermicelli", "Eggs", "Lemon", "Onions", "Parsley", "Mild spices"]
        },
        "instructions": {
            "fr": ["Cuire le poulet", "Ajouter les vermicelles", "Lier avec les œufs", "Aciduler au citron", "Garnir de persil"],
            "ar": ["طبخ الدجاج", "إضافة الشعيرية", "الربط بالبيض", "إضافة الحموضة بالليمون", "تزيين بالبقدونس"],
            "en": ["Cook chicken", "Add vermicelli", "Bind with eggs", "Add lemon tang", "Garnish with parsley"]
        },
        "image_url": "https://images.unsplash.com/photo-1547592180-85f173990554",
        "prep_time": 15,
        "cook_time": 45,
        "servings": 6,
        "difficulty": "facile",
        "category": "soupes"
    },
    {
        "title": {
            "fr": "Khoubz dar (Pain maison)",
            "ar": "خبز دار",
            "en": "Khoubz Dar (Homemade Bread)"
        },
        "description": {
            "fr": "Pain traditionnel algérien fait maison, moelleux à l'intérieur et croustillant à l'extérieur",
            "ar": "خبز جزائري تقليدي منزلي، طري من الداخل ومقرمش من الخارج",
            "en": "Traditional Algerian homemade bread, soft inside and crispy outside"
        },
        "ingredients": {
            "fr": ["Farine de blé", "Levure boulanger", "Sel", "Eau tiède", "Huile d'olive", "Graines de nigelle"],
            "ar": ["دقيق قمح", "خميرة خباز", "ملح", "ماء دافئ", "زيت زيتون", "حبة البركة"],
            "en": ["Wheat flour", "Baker's yeast", "Salt", "Warm water", "Olive oil", "Nigella seeds"]
        },
        "instructions": {
            "fr": ["Activer la levure", "Pétrir la pâte", "Première levée", "Former les pains", "Cuire au four"],
            "ar": ["تنشيط الخميرة", "عجن العجينة", "التخمير الأول", "تشكيل الخبز", "الخبز في الفرن"],
            "en": ["Activate yeast", "Knead dough", "First rise", "Shape breads", "Bake in oven"]
        },
        "image_url": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73",
        "prep_time": 120,
        "cook_time": 30,
        "servings": 4,
        "difficulty": "moyen",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Salade mechouia",
            "ar": "سلطة مشوية",
            "en": "Mechouia Salad"
        },
        "description": {
            "fr": "Salade traditionnelle de légumes grillés, relevée à l'harissa et parfumée à l'huile d'olive",
            "ar": "سلطة تقليدية من الخضار المشوية، متبلة بالهريسة ومعطرة بزيت الزيتون",
            "en": "Traditional grilled vegetable salad, spiced with harissa and scented with olive oil"
        },
        "ingredients": {
            "fr": ["Poivrons", "Tomates", "Oignons", "Ail", "Harissa", "Huile d'olive", "Citron", "Olives"],
            "ar": ["فلفل", "طماطم", "بصل", "ثوم", "هريسة", "زيت زيتون", "ليمون", "زيتون"],
            "en": ["Peppers", "Tomatoes", "Onions", "Garlic", "Harissa", "Olive oil", "Lemon", "Olives"]
        },
        "instructions": {
            "fr": ["Griller les légumes", "Éplucher et couper", "Assaisonner", "Ajouter l'harissa", "Décorer aux olives"],
            "ar": ["شوي الخضار", "تقشير وتقطيع", "التتبيل", "إضافة الهريسة", "تزيين بالزيتون"],
            "en": ["Grill vegetables", "Peel and chop", "Season", "Add harissa", "Decorate with olives"]
        },
        "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        "prep_time": 30,
        "cook_time": 20,
        "servings": 6,
        "difficulty": "facile",
        "category": "entrees"
    },
    {
        "title": {
            "fr": "Tcharak (Mendiants aux fruits secs)",
            "ar": "تشاراك (خليط الفواكه المجففة)",
            "en": "Tcharak (Mixed Dried Fruits)"
        },
        "description": {
            "fr": "Mélange traditionnel de fruits secs et noix, consommé pendant les fêtes et occasions spéciales",
            "ar": "خليط تقليدي من الفواكه المجففة والمكسرات، يُستهلك خلال الأعياد والمناسبات الخاصة",
            "en": "Traditional mix of dried fruits and nuts, consumed during holidays and special occasions"
        },
        "ingredients": {
            "fr": ["Dattes", "Figues sèches", "Abricots secs", "Amandes", "Noix", "Noisettes", "Raisins secs"],
            "ar": ["تمر", "تين مجفف", "مشمش مجفف", "لوز", "جوز", "بندق", "زبيب"],
            "en": ["Dates", "Dried figs", "Dried apricots", "Almonds", "Walnuts", "Hazelnuts", "Raisins"]
        },
        "instructions": {
            "fr": ["Sélectionner les fruits", "Nettoyer soigneusement", "Mélanger harmonieusement", "Conserver au sec", "Servir dans de jolis bols"],
            "ar": ["اختيار الفواكه", "تنظيف بعناية", "خلط بانسجام", "حفظ في مكان جاف", "تقديم في أوعية جميلة"],
            "en": ["Select fruits", "Clean carefully", "Mix harmoniously", "Store dry", "Serve in pretty bowls"]
        },
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        "prep_time": 15,
        "cook_time": 0,
        "servings": 10,
        "difficulty": "facile",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Aich el saraya (Pain du palais)",
            "ar": "عيش السرايا",
            "en": "Aich el Saraya (Palace Bread)"
        },
        "description": {
            "fr": "Dessert raffiné à base de biscuits, crème pâtissière et sirop parfumé, digne des palais royaux",
            "ar": "حلوى راقية من البسكويت والكريمة والشراب المعطر، جديرة بالقصور الملكية",
            "en": "Refined dessert made with biscuits, pastry cream and scented syrup, worthy of royal palaces"
        },
        "ingredients": {
            "fr": ["Biscuits secs", "Lait", "Sucre", "Œufs", "Crème fraîche", "Eau de rose", "Pistaches"],
            "ar": ["بسكويت جاف", "حليب", "سكر", "بيض", "كريمة طازجة", "ماء ورد", "فستق"],
            "en": ["Dry biscuits", "Milk", "Sugar", "Eggs", "Fresh cream", "Rose water", "Pistachios"]
        },
        "instructions": {
            "fr": ["Préparer la crème", "Imbiber les biscuits", "Monter en couches", "Laisser reposer", "Décorer de pistaches"],
            "ar": ["تحضير الكريمة", "تشريب البسكويت", "الترتيب طبقات", "ترك يستريح", "تزيين بالفستق"],
            "en": ["Prepare cream", "Soak biscuits", "Layer up", "Let rest", "Decorate with pistachios"]
        },
        "image_url": "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
        "prep_time": 45,
        "cook_time": 0,
        "servings": 8,
        "difficulty": "moyen",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Kabouya (Courgettes farcies)",
            "ar": "قابوية (كوسة محشوة)",
            "en": "Kabouya (Stuffed Zucchini)"
        },
        "description": {
            "fr": "Spécialité algérienne de courgettes évidées et farcies au riz et à la viande, cuites en sauce",
            "ar": "تخصص جزائري من الكوسة المفرغة والمحشوة بالأرز واللحم، مطبوخة بالصلصة",
            "en": "Algerian specialty of hollowed zucchini stuffed with rice and meat, cooked in sauce"
        },
        "ingredients": {
            "fr": ["Courgettes moyennes", "Riz", "Viande hachée", "Tomates", "Menthe", "Persil", "Épices"],
            "ar": ["كوسة متوسطة", "أرز", "لحم مفروم", "طماطم", "نعناع", "بقدونس", "بهارات"],
            "en": ["Medium zucchini", "Rice", "Minced meat", "Tomatoes", "Mint", "Parsley", "Spices"]
        },
        "instructions": {
            "fr": ["Évider les courgettes", "Préparer la farce", "Farcir délicatement", "Cuire en sauce tomate", "Servir bien chaud"],
            "ar": ["تفريغ الكوسة", "تحضير الحشوة", "الحشو بعناية", "الطبخ في صلصة الطماطم", "يقدم ساخناً جداً"],
            "en": ["Hollow zucchini", "Prepare stuffing", "Stuff carefully", "Cook in tomato sauce", "Serve very hot"]
        },
        "image_url": "https://images.unsplash.com/photo-1556909114-8a3f3c3e5c9e",
        "prep_time": 45,
        "cook_time": 60,
        "servings": 6,
        "difficulty": "moyen",
        "category": "plats-principaux"
    },
    {
        "title": {
            "fr": "Djouza (Confiture de noix)",
            "ar": "جوزة (مربى الجوز)",
            "en": "Djouza (Walnut Preserve)"
        },
        "description": {
            "fr": "Confiture traditionnelle algérienne aux noix vertes, parfumée au clou de girofle et cannelle",
            "ar": "مربى جزائري تقليدي بالجوز الأخضر، معطر بالقرنفل والقرفة",
            "en": "Traditional Algerian preserve made with green walnuts, scented with clove and cinnamon"
        },
        "ingredients": {
            "fr": ["Noix vertes", "Sucre", "Eau", "Clous de girofle", "Cannelle", "Citron"],
            "ar": ["جوز أخضر", "سكر", "ماء", "قرنفل", "قرفة", "ليمون"],
            "en": ["Green walnuts", "Sugar", "Water", "Cloves", "Cinnamon", "Lemon"]
        },
        "instructions": {
            "fr": ["Éplucher les noix", "Préparer le sirop", "Cuire lentement", "Parfumer aux épices", "Conserver en bocaux"],
            "ar": ["تقشير الجوز", "تحضير الشراب", "الطبخ ببطء", "تعطير بالبهارات", "حفظ في برطمانات"],
            "en": ["Peel walnuts", "Prepare syrup", "Cook slowly", "Scent with spices", "Preserve in jars"]
        },
        "image_url": "https://images.unsplash.com/photo-1571115764595-644a1f56a55c",
        "prep_time": 120,
        "cook_time": 180,
        "servings": 16,
        "difficulty": "difficile",
        "category": "desserts"
    },
    {
        "title": {
            "fr": "Ftayer aux épinards",
            "ar": "فطاير بالسبانخ",
            "en": "Spinach Ftayer"
        },
        "description": {
            "fr": "Petites tartelettes aux épinards et fromage, parfaites pour l'apéritif ou un repas léger",
            "ar": "فطائر صغيرة بالسبانخ والجبن، مثالية للمقبلات أو وجبة خفيفة",
            "en": "Small spinach and cheese tartlets, perfect for appetizers or a light meal"
        },
        "ingredients": {
            "fr": ["Pâte brisée", "Épinards", "Fromage blanc", "Œufs", "Oignons", "Huile d'olive", "Épices"],
            "ar": ["عجينة مكسرة", "سبانخ", "جبن أبيض", "بيض", "بصل", "زيت زيتون", "بهارات"],
            "en": ["Shortcrust pastry", "Spinach", "White cheese", "Eggs", "Onions", "Olive oil", "Spices"]
        },
        "instructions": {
            "fr": ["Étaler la pâte", "Préparer la garniture", "Garnir les moules", "Cuire au four", "Servir tiède"],
            "ar": ["فرد العجين", "تحضير الحشوة", "حشو القوالب", "الخبز في الفرن", "يقدم دافئاً"],
            "en": ["Roll out pastry", "Prepare filling", "Fill molds", "Bake in oven", "Serve warm"]
        },
        "image_url": "https://images.unsplash.com/photo-1551024506-0bccd828d307",
        "prep_time": 30,
        "cook_time": 25,
        "servings": 12,
        "difficulty": "facile",
        "category": "entrees"
    }
]

def main():
    """Fonction principale"""
    print("🚀 Ajout de 30 recettes algériennes authentiques à Soumam Heritage")
    print("=" * 70)
    
    try:
        # Obtenir le token d'authentification
        print("🔐 Connexion à l'API...")
        token = get_auth_token()
        print(f"✅ Authentification réussie")
        
        # Ajouter chaque recette
        success_count = 0
        failed_count = 0
        
        for i, recipe in enumerate(RECIPES, 1):
            print(f"\n📝 Ajout de la recette {i}/30...")
            if add_recipe(token, recipe):
                success_count += 1
            else:
                failed_count += 1
        
        # Résumé final
        print("\n" + "=" * 70)
        print(f"📊 RÉSUMÉ FINAL:")
        print(f"✅ Recettes ajoutées avec succès: {success_count}")
        print(f"❌ Échecs: {failed_count}")
        print(f"📈 Total: {len(RECIPES)} recettes traitées")
        
        if success_count > 0:
            print(f"\n🎉 {success_count} nouvelles recettes algériennes ont été ajoutées à votre site!")
            print("Vous pouvez maintenant les voir sur: https://soumam-valley.preview.emergentagent.com/recipes")
        
    except Exception as e:
        print(f"❌ Erreur générale: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    main()