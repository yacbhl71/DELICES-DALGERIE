#!/usr/bin/env python3
"""
Créer des produits pour Délices et Trésors d'Algérie
"""
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

async def create_products():
    try:
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Supprimer les anciens produits
        await db.products.delete_many({})
        print('🗑️ Anciens produits supprimés\n')
        
        products = [
            # Dattes Deglet Nour
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Dattes Deglet Nour - 500g',
                    'ar': 'تمور دقلة نور - 500 غرام',
                    'en': 'Deglet Nour Dates - 500g'
                },
                'description': {
                    'fr': 'Les fameuses dattes Deglet Nour d\'Algérie, connues comme "les doigts de lumière". Sucrées naturellement, avec une texture semi-molle et une saveur délicate de miel. Parfaites pour la consommation directe ou en pâtisserie.',
                    'ar': 'تمور دقلة نور الشهيرة من الجزائر، المعروفة بـ "أصابع النور". حلوة بشكل طبيعي، بقوام شبه طري ونكهة عسل رقيقة. مثالية للاستهلاك المباشر أو في الحلويات.',
                    'en': 'The famous Deglet Nour dates from Algeria, known as "fingers of light". Naturally sweet, with a semi-soft texture and delicate honey flavor. Perfect for direct consumption or in pastries.'
                },
                'price': 8.99,
                'category': 'dates',
                'stock': 100,
                'image_urls': [
                    'https://images.unsplash.com/photo-1577003833154-a2c9f9b51c06?w=800',
                    'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800'
                ],
                'origin': {
                    'fr': 'Biskra, Algérie',
                    'ar': 'بسكرة، الجزائر',
                    'en': 'Biskra, Algeria'
                },
                'weight': '500g',
                'featured': True,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Dattes Deglet Nour - 1kg',
                    'ar': 'تمور دقلة نور - 1 كيلو',
                    'en': 'Deglet Nour Dates - 1kg'
                },
                'description': {
                    'fr': 'Format familial de nos délicieuses dattes Deglet Nour. Idéal pour les familles et les amateurs de dattes. Conservées dans des conditions optimales pour préserver leur fraîcheur et leur goût authentique.',
                    'ar': 'عبوة عائلية من تمور دقلة نور اللذيذة. مثالية للعائلات وعشاق التمور. محفوظة في ظروف مثالية للحفاظ على نضارتها وطعمها الأصيل.',
                    'en': 'Family format of our delicious Deglet Nour dates. Ideal for families and date lovers. Stored in optimal conditions to preserve their freshness and authentic taste.'
                },
                'price': 15.99,
                'category': 'dates',
                'stock': 75,
                'image_urls': [
                    'https://images.unsplash.com/photo-1577003833154-a2c9f9b51c06?w=800'
                ],
                'origin': {
                    'fr': 'Biskra, Algérie',
                    'ar': 'بسكرة، الجزائر',
                    'en': 'Biskra, Algeria'
                },
                'weight': '1kg',
                'featured': True,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Dattes Deglet Nour Premium - 5kg',
                    'ar': 'تمور دقلة نور الفاخرة - 5 كيلو',
                    'en': 'Deglet Nour Dates Premium - 5kg'
                },
                'description': {
                    'fr': 'Notre format économique pour les grands consommateurs. Dattes soigneusement sélectionnées de première qualité. Emballage hermétique pour une conservation longue durée. Parfait pour les événements et les familles nombreuses.',
                    'ar': 'حجمنا الاقتصادي للمستهلكين الكبار. تمور منتقاة بعناية من الدرجة الأولى. تغليف محكم للحفظ طويل الأمد. مثالي للمناسبات والعائلات الكبيرة.',
                    'en': 'Our economical format for large consumers. Carefully selected premium quality dates. Airtight packaging for long-term storage. Perfect for events and large families.'
                },
                'price': 69.99,
                'category': 'dates',
                'stock': 30,
                'image_urls': [
                    'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800'
                ],
                'origin': {
                    'fr': 'Biskra, Algérie',
                    'ar': 'بسكرة، الجزائر',
                    'en': 'Biskra, Algeria'
                },
                'weight': '5kg',
                'featured': False,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            
            # Huile d'Olive Chemlal
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Huile d\'Olive Chemlal - 250ml',
                    'ar': 'زيت الزيتون الشملال - 250 مل',
                    'en': 'Chemlal Olive Oil - 250ml'
                },
                'description': {
                    'fr': 'Huile d\'olive extra vierge de variété Chemlal, cultivée dans les montagnes de Kabylie. Première pression à froid. Goût fruité avec une légère amertume caractéristique. Riche en antioxydants et polyphénols.',
                    'ar': 'زيت زيتون بكر ممتاز من صنف الشملال، يزرع في جبال القبائل. عصرة أولى على البارد. طعم فاكهي مع مرارة خفيفة مميزة. غني بمضادات الأكسدة والبوليفينول.',
                    'en': 'Extra virgin olive oil from Chemlal variety, grown in the Kabylia mountains. First cold pressing. Fruity taste with a characteristic slight bitterness. Rich in antioxidants and polyphenols.'
                },
                'price': 12.99,
                'category': 'huile-olive',
                'stock': 80,
                'image_urls': [
                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'
                ],
                'origin': {
                    'fr': 'Kabylie, Algérie',
                    'ar': 'القبائل، الجزائر',
                    'en': 'Kabylia, Algeria'
                },
                'volume': '250ml',
                'featured': True,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Huile d\'Olive Chemlal - 500ml',
                    'ar': 'زيت الزيتون الشملال - 500 مل',
                    'en': 'Chemlal Olive Oil - 500ml'
                },
                'description': {
                    'fr': 'Notre format standard d\'huile d\'olive Chemlal. Production artisanale respectueuse des traditions ancestrales. Acidité inférieure à 0.5%. Idéale pour les salades, cuisson douce et finition de plats.',
                    'ar': 'حجمنا القياسي من زيت الزيتون الشملال. إنتاج حرفي يحترم التقاليد القديمة. حموضة أقل من 0.5٪. مثالي للسلطات والطهي اللطيف وإنهاء الأطباق.',
                    'en': 'Our standard format of Chemlal olive oil. Artisanal production respecting ancestral traditions. Acidity below 0.5%. Ideal for salads, gentle cooking and finishing dishes.'
                },
                'price': 22.99,
                'category': 'huile-olive',
                'stock': 60,
                'image_urls': [
                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'
                ],
                'origin': {
                    'fr': 'Kabylie, Algérie',
                    'ar': 'القبائل، الجزائر',
                    'en': 'Kabylia, Algeria'
                },
                'volume': '500ml',
                'featured': True,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Huile d\'Olive Chemlal - 1L',
                    'ar': 'زيت الزيتون الشملال - 1 لتر',
                    'en': 'Chemlal Olive Oil - 1L'
                },
                'description': {
                    'fr': 'Format économique pour une utilisation quotidienne. Huile d\'olive extra vierge de qualité supérieure. Bouteille en verre foncé pour protéger les qualités organoleptiques. Production certifiée et traçable.',
                    'ar': 'حجم اقتصادي للاستخدام اليومي. زيت زيتون بكر ممتاز من الدرجة الأولى. زجاجة داكنة لحماية الخصائص الحسية. إنتاج معتمد وقابل للتتبع.',
                    'en': 'Economical format for daily use. Superior quality extra virgin olive oil. Dark glass bottle to protect organoleptic qualities. Certified and traceable production.'
                },
                'price': 39.99,
                'category': 'huile-olive',
                'stock': 45,
                'image_urls': [
                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'
                ],
                'origin': {
                    'fr': 'Kabylie, Algérie',
                    'ar': 'القبائل، الجزائر',
                    'en': 'Kabylia, Algeria'
                },
                'volume': '1L',
                'featured': False,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            
            # Huile d'Olive de Kabylie
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Huile d\'Olive de Kabylie - 250ml',
                    'ar': 'زيت الزيتون القبائلي - 250 مل',
                    'en': 'Kabylia Olive Oil - 250ml'
                },
                'description': {
                    'fr': 'Huile d\'olive traditionnelle de Kabylie, assemblage harmonieux de variétés locales. Récoltée à la main et pressée dans les 24 heures. Saveur intense et arômes complexes d\'herbes fraîches et de fruits verts.',
                    'ar': 'زيت زيتون تقليدي من القبائل، مزيج متناغم من الأصناف المحلية. محصود يدويًا ومعصور في غضون 24 ساعة. نكهة قوية وروائح معقدة من الأعشاب الطازجة والفواكه الخضراء.',
                    'en': 'Traditional Kabylia olive oil, harmonious blend of local varieties. Hand-harvested and pressed within 24 hours. Intense flavor and complex aromas of fresh herbs and green fruits.'
                },
                'price': 14.99,
                'category': 'huile-olive',
                'stock': 50,
                'image_urls': [
                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'
                ],
                'origin': {
                    'fr': 'Kabylie, Algérie',
                    'ar': 'القبائل، الجزائر',
                    'en': 'Kabylia, Algeria'
                },
                'volume': '250ml',
                'featured': True,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Huile d\'Olive de Kabylie - 500ml',
                    'ar': 'زيت الزيتون القبائلي - 500 مل',
                    'en': 'Kabylia Olive Oil - 500ml'
                },
                'description': {
                    'fr': 'Le trésor liquide des montagnes kabyles. Production limitée issue d\'oliviers centenaires. Méthode d\'extraction douce préservant tous les bienfaits. Notes poivrées en finale. Médaillée dans plusieurs concours internationaux.',
                    'ar': 'الكنز السائل من جبال القبائل. إنتاج محدود من أشجار زيتون عمرها قرون. طريقة استخراج لطيفة تحافظ على جميع الفوائد. نكهة فلفلية في النهاية. حائز على جوائز في عدة مسابقات دولية.',
                    'en': 'The liquid treasure of Kabyle mountains. Limited production from century-old olive trees. Gentle extraction method preserving all benefits. Peppery notes on finish. Award-winning in several international competitions.'
                },
                'price': 24.99,
                'category': 'huile-olive',
                'stock': 40,
                'image_urls': [
                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'
                ],
                'origin': {
                    'fr': 'Kabylie, Algérie',
                    'ar': 'القبائل، الجزائر',
                    'en': 'Kabylia, Algeria'
                },
                'volume': '500ml',
                'featured': True,
                'created_at': datetime.now(timezone.utc).isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'name': {
                    'fr': 'Huile d\'Olive de Kabylie Premium - 1L',
                    'ar': 'زيت الزيتون القبائلي الفاخر - 1 لتر',
                    'en': 'Kabylia Premium Olive Oil - 1L'
                },
                'description': {
                    'fr': 'Notre cuvée prestige en format généreux. Sélection rigoureuse des meilleures olives. Traçabilité complète de l\'arbre à la bouteille. Certificat d\'authenticité inclus. Un cadeau exceptionnel pour les connaisseurs.',
                    'ar': 'إصدارنا الفخم بحجم سخي. اختيار صارم لأفضل الزيتون. تتبع كامل من الشجرة إلى الزجاجة. شهادة أصالة مدرجة. هدية استثنائية للخبراء.',
                    'en': 'Our prestige vintage in generous format. Rigorous selection of the best olives. Complete traceability from tree to bottle. Certificate of authenticity included. An exceptional gift for connoisseurs.'
                },
                'price': 44.99,
                'category': 'huile-olive',
                'stock': 25,
                'image_urls': [
                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'
                ],
                'origin': {
                    'fr': 'Kabylie, Algérie',
                    'ar': 'القبائل، الجزائر',
                    'en': 'Kabylia, Algeria'
                },
                'volume': '1L',
                'featured': True,
                'created_at': datetime.now(timezone.utc).isoformat()
            }
        ]
        
        print('📦 Création des produits...\n')
        
        for product in products:
            await db.products.insert_one(product)
            print(f'✅ {product["name"]["fr"]}')
            print(f'   Prix: {product["price"]}€')
            print(f'   Stock: {product["stock"]}')
            print(f'   Catégorie: {product["category"]}')
            print()
        
        print(f'\n🎉 {len(products)} produits créés avec succès!')
        print(f'📊 Dattes: 3 produits')
        print(f'📊 Huiles d\'olive: 6 produits')
        
    except Exception as e:
        print(f'❌ Erreur: {str(e)}')
    finally:
        client.close()

async def main():
    await create_products()

if __name__ == "__main__":
    asyncio.run(main())
