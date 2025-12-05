import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { ShoppingBag, Star, Search, Filter, Heart, Eye, ShoppingCart, Truck } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ShopPage = () => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getLocalizedText = (textObj) => {
    if (!textObj) return '';
    return textObj[language] || textObj.fr || textObj.en || '';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = getLocalizedText(product.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (categorySlug) => {
    const categoryLabels = {
      'epices': { fr: 'Épices', en: 'Spices', ar: 'البهارات' },
      'thes': { fr: 'Thés', en: 'Teas', ar: 'الشاي' },
      'robes-kabyles': { fr: 'Robes Kabyles', en: 'Kabyle Dresses', ar: 'الفساتين القبائلية' },
      'bijoux-kabyles': { fr: 'Bijoux Kabyles', en: 'Kabyle Jewelry', ar: 'المجوهرات القبائلية' },
      'dattes': { fr: 'Dattes', en: 'Dates', ar: 'التمور' },
      'huile-olive': { fr: 'Huile d\'Olive', en: 'Olive Oil', ar: 'زيت الزيتون' }
    };
    return categoryLabels[categorySlug]?.[language] || categorySlug;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#6B8E23] to-[#8B7355] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            {language === 'ar' ? 'متجر لذائذ وكنوز الجزائر' : 
             language === 'en' ? 'Délices et Trésors d\'Algérie Shop' : 
             'Boutique Délices et Trésors d\'Algérie'}
          </h1>
          <p className="text-xl opacity-90">
            {language === 'ar' ? 'اكتشف كنوزنا: تمور دقلة نور وزيت الزيتون القبائلي الأصيل' :
             language === 'en' ? 'Discover our treasures: Deglet Nour dates and authentic Kabyle olive oil' :
             'Découvrez nos trésors : dattes Deglet Nour et huile d\'olive kabyle authentique'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={
                language === 'ar' ? 'ابحث عن منتج...' :
                language === 'en' ? 'Search for a product...' :
                'Rechercher un produit...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Icons */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* All categories button */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                  selectedCategory === 'all'
                    ? 'border-[#6B8E23] bg-[#6B8E23] bg-opacity-10 shadow-lg'
                    : 'border-gray-200 hover:border-[#6B8E23] hover:shadow-md'
                }`}
              >
                <span className="text-4xl mb-2">🛍️</span>
                <span className="text-sm font-medium text-gray-700">
                  {language === 'ar' ? 'الكل' : language === 'en' ? 'All' : 'Tous'}
                </span>
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                    selectedCategory === category.slug
                      ? 'border-[#6B8E23] bg-[#6B8E23] bg-opacity-10 shadow-lg'
                      : 'border-gray-200 hover:border-[#6B8E23] hover:shadow-md'
                  }`}
                >
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={getLocalizedText(category.name)}
                      className="w-12 h-12 object-cover rounded-full mb-2"
                    />
                  ) : (
                    <span className="text-4xl mb-2">{category.icon || '📦'}</span>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {getLocalizedText(category.name)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} {language === 'ar' ? 'منتجات' : language === 'en' ? 'products found' : 'produits trouvés'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Category Tag */}
              <div className="relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#6B8E23] shadow-md">
                    <ShoppingBag size={14} className="mr-1" />
                    {getCategoryLabel(product.category)}
                  </span>
                </div>
                
                {/* Stock Badge */}
                {product.track_inventory && (
                  <div className="absolute top-14 left-3 z-10">
                    {product.stock_quantity === 0 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white shadow-md">
                        {language === 'ar' ? 'نفذت الكمية' : language === 'en' ? 'Out of stock' : 'Rupture de stock'}
                      </span>
                    ) : product.stock_quantity <= product.low_stock_threshold ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-md">
                        {language === 'ar' ? `${product.stock_quantity} متبقي` : 
                         language === 'en' ? `Only ${product.stock_quantity} left` : 
                         `Plus que ${product.stock_quantity}`}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-md">
                        {language === 'ar' ? 'متوفر' : language === 'en' ? 'In stock' : 'En stock'}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Wishlist Icon */}
                <button className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
                  <Heart size={18} className="text-gray-600" />
                </button>

                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image_urls?.[0] || 'https://via.placeholder.com/300'}
                    alt={getLocalizedText(product.name)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {getLocalizedText(product.name)}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {getLocalizedText(product.description)}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    4.9 (127)
                  </span>
                </div>

                {/* Origin */}
                <p className="text-xs text-gray-500 mb-4">
                  📍 {getLocalizedText(product.origin)}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-[#6B8E23]">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-600 ml-1">{product.currency}</span>
                </div>

                {/* Free Shipping Badge */}
                <div className="flex items-center text-green-600 text-sm mb-4">
                  <Truck size={16} className="mr-1" />
                  <span className="font-medium">
                    {language === 'ar' ? 'شحن مجاني' : 
                     language === 'en' ? 'Free shipping' : 
                     'Livraison gratuite'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.track_inventory && product.stock_quantity === 0 && !product.allow_backorder}
                    className={`flex-1 py-3 rounded-lg transition flex items-center justify-center font-semibold ${
                      product.track_inventory && product.stock_quantity === 0 && !product.allow_backorder
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#6B8E23] text-white hover:bg-[#5a7a1d]'
                    }`}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    {product.track_inventory && product.stock_quantity === 0 && !product.allow_backorder
                      ? (language === 'ar' ? 'غير متوفر' : language === 'en' ? 'Unavailable' : 'Indisponible')
                      : (language === 'ar' ? 'أضف للسلة' : language === 'en' ? 'Add to cart' : 'Ajouter au panier')
                    }
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <Eye size={18} className="text-gray-600" />
                  </button>
                </div>

                {/* Payment Info */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  {language === 'ar' ? 'الدفع عبر الإنترنت متاح قريباً' :
                   language === 'en' ? 'Online payment coming soon' :
                   'Paiement en ligne bientôt disponible'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'لم يتم العثور على منتجات' :
               language === 'en' ? 'No products found' :
               'Aucun produit trouvé'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar' ? 'جرب بحثاً مختلفاً أو تصفح جميع الفئات' :
               language === 'en' ? 'Try a different search or browse all categories' :
               'Essayez une recherche différente ou parcourez toutes les catégories'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;