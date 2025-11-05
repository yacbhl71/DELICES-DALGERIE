import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye,
  Euro,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProducts = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', labelFr: 'Tous produits', labelAr: 'جميع المنتجات', labelEn: 'All products' },
    { value: 'epices', labelFr: 'Épices', labelAr: 'بهارات', labelEn: 'Spices' },
    { value: 'thes', labelFr: 'Thés', labelAr: 'شاي', labelEn: 'Teas' },
    { value: 'robes-kabyles', labelFr: 'Robes Kabyles', labelAr: 'فساتين قبائلية', labelEn: 'Kabyle Dresses' },
    { value: 'bijoux-kabyles', labelFr: 'Bijoux Kabyles', labelAr: 'مجوهرات قبائلية', labelEn: 'Kabyle Jewelry' }
  ];

  useEffect(() => {
    fetchProducts();
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

  const handleDelete = async (productId) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' :
                      language === 'en' ? 'Are you sure you want to delete this product?' :
                      'Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`${API}/products/${productId}`);
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(language === 'ar' ? 'خطأ في حذف المنتج' :
              language === 'en' ? 'Error deleting product' :
              'Erreur lors de la suppression du produit');
      }
    }
  };

  const toggleStock = async (productId, currentStock) => {
    try {
      await axios.put(`${API}/products/${productId}`, { in_stock: !currentStock });
      setProducts(products.map(product => 
        product.id === productId ? { ...product, in_stock: !currentStock } : product
      ));
    } catch (error) {
      console.error('Error updating product stock:', error);
      alert(language === 'ar' ? 'خطأ في تحديث حالة المخزون' :
            language === 'en' ? 'Error updating stock status' :
            'Erreur lors de la mise à jour du stock');
    }
  };

  const getLocalizedText = (textObj) => {
    return textObj?.[language] || textObj?.fr || '';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? getLocalizedText(cat) : category;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'epices': return '🌶️';
      case 'thes': return '🍃';
      case 'robes-kabyles': return '👗';
      case 'bijoux-kabyles': return '💎';
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
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'إدارة المنتجات' : language === 'en' ? 'Product Management' : 'Gestion des Produits'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'إدارة منتجات المتجر والمخزون' :
             language === 'en' ? 'Manage store products and inventory' :
             'Gérer les produits du magasin et l\'inventaire'}
          </p>
        </div>
        <a
          href="/admin/products/new"
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {language === 'ar' ? 'إضافة منتج' : language === 'en' ? 'Add Product' : 'Ajouter Produit'}
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {getCategoryIcon(category.value)} {getCategoryLabel(category.value)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {language === 'ar' ? `${filteredProducts.length} منتج موجود` :
           language === 'en' ? `${filteredProducts.length} products found` :
           `${filteredProducts.length} produits trouvés`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img
                src={product.image_urls[0]}
                alt={getLocalizedText(product.name)}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
                  {getCategoryIcon(product.category)} {getCategoryLabel(product.category)}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleStock(product.id, product.in_stock)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.in_stock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.in_stock ? (
                    <>
                      <CheckCircle size={12} className="inline mr-1" />
                      {language === 'ar' ? 'متوفر' : language === 'en' ? 'In Stock' : 'En stock'}
                    </>
                  ) : (
                    <>
                      <XCircle size={12} className="inline mr-1" />
                      {language === 'ar' ? 'غير متوفر' : language === 'en' ? 'Out of Stock' : 'Rupture'}
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {getLocalizedText(product.name)}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {getLocalizedText(product.description)}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-gray-900 flex items-center">
                  <Euro size={20} className="mr-1" />
                  {product.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  <Package size={16} className="inline mr-1" />
                  {getLocalizedText(product.origin)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <a
                  href={`/shop/${product.id}`}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <Eye size={16} className="mr-2" />
                  {language === 'ar' ? 'عرض' : language === 'en' ? 'View' : 'Voir'}
                </a>
                <a
                  href={`/admin/products/edit/${product.id}`}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors duration-200"
                >
                  <Edit3 size={16} className="mr-2" />
                  {language === 'ar' ? 'تحرير' : language === 'en' ? 'Edit' : 'Modifier'}
                </a>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'لا توجد منتجات' :
             language === 'en' ? 'No products found' :
             'Aucun produit trouvé'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'ar' ? 'جرب تغيير معايير البحث أو أضف منتج جديد' :
             language === 'en' ? 'Try changing your search criteria or add a new product' :
             'Essayez de modifier vos critères de recherche ou ajoutez un nouveau produit'}
          </p>
          <a
            href="/admin/products/new"
            className="btn-primary inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            {language === 'ar' ? 'إضافة منتج جديد' : language === 'en' ? 'Add New Product' : 'Ajouter un Nouveau Produit'}
          </a>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;