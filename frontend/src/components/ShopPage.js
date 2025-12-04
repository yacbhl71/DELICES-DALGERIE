import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { ShoppingBag, Star, Search, Filter, Heart, Eye } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ShopPage = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample products for initial display
  const sampleProducts = [
    {
      id: '1',
      name: {
        fr: 'Mélange d\'épices Ras el Hanout',
        ar: 'خليط بهارات راس الحانوت',
        en: 'Ras el Hanout Spice Mix'
      },
      description: {
        fr: 'Mélange traditionnel d\'épices algériennes, parfait pour le couscous et les tajines',
        ar: 'خليط تقليدي من البهارات الجزائرية، مثالي للكسكس والطواجن',
        en: 'Traditional Algerian spice blend, perfect for couscous and tagines'
      },
      category: 'epices',
      price: 12.99,
      currency: 'EUR',
      image_urls: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d'],
      in_stock: true,
      origin: {
        fr: 'Algérie, région de Kabylie',
        ar: 'الجزائر، منطقة القبائل',
        en: 'Algeria, Kabylie region'
      }
    },
    {
      id: '2',
      name: {
        fr: 'Thé à la menthe Premium',
        ar: 'شاي النعناع الممتاز',
        en: 'Premium Mint Tea'
      },
      description: {
        fr: 'Thé vert de qualité supérieure avec menthe fraîche séchée de Kabylie',
        ar: 'شاي أخضر عالي الجودة مع نعناع طازج مجفف من القبائل',
        en: 'Superior quality green tea with dried fresh mint from Kabylie'
      },
      category: 'thes',
      price: 15.50,
      currency: 'EUR',
      image_urls: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574'],
      in_stock: true,
      origin: {
        fr: 'Algérie, vallée de Soumam',
        ar: 'الجزائر، وادي الصومام',
        en: 'Algeria, Soumam valley'
      }
    },
    {
      id: '3',
      name: {
        fr: 'Robe Kabyle Traditionnelle',
        ar: 'فستان قبائلي تقليدي',
        en: 'Traditional Kabyle Dress'
      },
      description: {
        fr: 'Magnifique robe kabyle brodée à la main avec motifs berbères authentiques',
        ar: 'فستان قبائلي رائع مطرز يدوياً بزخارف بربرية أصيلة',
        en: 'Beautiful hand-embroidered Kabyle dress with authentic Berber patterns'
      },
      category: 'robes-kabyles',
      price: 180.00,
      currency: 'EUR',
      image_urls: ['https://images.unsplash.com/photo-1713007009692-c055a4a5e2df'],
      in_stock: true,
      origin: {
        fr: 'Algérie, Ath M\'lickech',
        ar: 'الجزائر، آث مليكش',
        en: 'Algeria, Ath M\'lickech'
      }
    },
    {
      id: '4',
      name: {
        fr: 'Bijoux Kabyles en Argent',
        ar: 'مجوهرات قبائلية فضية',
        en: 'Silver Kabyle Jewelry'
      },
      description: {
        fr: 'Ensemble de bijoux kabyles en argent massif avec motifs traditionnels berbères',
        ar: 'طقم مجوهرات قبائلية من الفضة الخالصة بزخارف بربرية تقليدية',
        en: 'Set of solid silver Kabyle jewelry with traditional Berber motifs'
      },
      category: 'bijoux-kabyles',
      price: 250.00,
      currency: 'EUR',
      image_urls: ['https://images.unsplash.com/photo-1720718517204-a66cc17a1052'],
      in_stock: true,
      origin: {
        fr: 'Algérie, Tazmalt',
        ar: 'الجزائر، تازمالت',
        en: 'Algeria, Tazmalt'
      }
    }
  ];

  const categories = [
    { value: 'all', labelFr: 'Tous produits', labelAr: 'جميع المنتجات', labelEn: 'All products' },
    { value: 'dates', labelFr: 'Dattes', labelAr: 'تمور', labelEn: 'Dates' },
    { value: 'olive-oil', labelFr: 'Huiles d\'Olive', labelAr: 'زيت الزيتون', labelEn: 'Olive Oils' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      if (response.data.length === 0) {
        setProducts(sampleProducts);
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (textObj) => {
    return textObj[language] || textObj.fr || '';
  };

  const getCategoryLabel = (category) => {
    // Handle both string values and objects with value property
    const catValue = typeof category === 'string' ? category : category?.value;
    const cat = categories.find(c => c.value === catValue);
    if (!cat) return catValue || '';
    return getLocalizedText(cat);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'dates': return '🌴';
      case 'olive-oil': return '🫒';
      default: return '🛍️';
    }
  };

  const filteredProducts = products.filter(product => {
    const name = getLocalizedText(product.name).toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'متجر سومام هيريتاج' :
               language === 'en' ? 'Soumam Heritage Shop' :
               'Boutique Soumam Heritage'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ar' ? 'اكتشف منتجاتنا الأصيلة من البهارات والشاي والملابس والمجوهرات القبائلية' :
               language === 'en' ? 'Discover our authentic products: spices, teas, clothing and Kabyle jewelry' :
               'Découvrez nos produits authentiques : épices, thés, vêtements et bijoux kabyles'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث عن منتج...' :
                            language === 'en' ? 'Search for a product...' :
                            'Rechercher un produit...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {getCategoryIcon(category.value)} {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.slice(1).map((category, index) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-amber-50'
              }`}
            >
              <div className="text-3xl mb-2">{getCategoryIcon(category.value)}</div>
              <h3 className="font-semibold text-sm">{getCategoryLabel(category)}</h3>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {language === 'ar' ? `${filteredProducts.length} منتج موجود` :
             language === 'en' ? `${filteredProducts.length} products found` :
             `${filteredProducts.length} produits trouvés`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="card group animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image_urls[0]}
                  alt={getLocalizedText(product.name)}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
                    {getCategoryIcon(product.category)} {getCategoryLabel({ value: product.category })}
                  </span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                    <Heart size={18} className="text-gray-600" />
                  </button>
                </div>
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                      {language === 'ar' ? 'غير متوفر' :
                       language === 'en' ? 'Out of Stock' :
                       'Rupture de stock'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getLocalizedText(product.name)}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {getLocalizedText(product.description)}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">4.9 (127)</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {getLocalizedText(product.origin)}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-gray-900">
                    {product.price.toFixed(2)} {product.currency}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {language === 'ar' ? 'شحن مجاني' :
                     language === 'en' ? 'Free shipping' :
                     'Livraison gratuite'}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    className="flex-1 btn-primary flex items-center justify-center"
                    disabled={!product.in_stock}
                  >
                    <ShoppingBag className="mr-2" size={18} />
                    {language === 'ar' ? 'اتصل للطلب' :
                     language === 'en' ? 'Contact to Order' :
                     'Contacter pour commander'}
                  </button>
                  <button className="bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    <Eye size={18} />
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    {language === 'ar' ? 'الدفع عند الاستلام متاح قريباً' :
                     language === 'en' ? 'Online payment coming soon' :
                     'Paiement en ligne bientôt disponible'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد منتجات' :
               language === 'en' ? 'No products found' :
               'Aucun produit trouvé'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' ? 'جرب تغيير معايير البحث' :
               language === 'en' ? 'Try changing your search criteria' :
               'Essayez de modifier vos critères de recherche'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;