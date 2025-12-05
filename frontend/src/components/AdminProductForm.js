import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import { 
  Save, 
  X, 
  Plus, 
  Minus, 
  Upload,
  Image as ImageIcon,
  Euro,
  Package,
  MapPin
} from 'lucide-react';
import axios from 'axios';
import ImageUpload from './ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    name: { fr: '', ar: '', en: '' },
    description: { fr: '', ar: '', en: '' },
    category: 'epices',
    price: 0,
    image_urls: [''],
    origin: { fr: '', ar: '', en: '' },
    in_stock: true
  });

  const categories = [
    { value: 'epices', labelFr: 'Épices', labelAr: 'بهارات', labelEn: 'Spices', icon: '🌶️' },
    { value: 'thes', labelFr: 'Thés', labelAr: 'شاي', labelEn: 'Teas', icon: '🍃' },
    { value: 'robes-kabyles', labelFr: 'Robes Kabyles', labelAr: 'فساتين قبائلية', labelEn: 'Kabyle Dresses', icon: '👗' },
    { value: 'bijoux-kabyles', labelFr: 'Bijoux Kabyles', labelAr: 'مجوهرات قبائلية', labelEn: 'Kabyle Jewelry', icon: '💎' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, lang, value) => {
    if (lang) {
      setProduct(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setProduct(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...product.image_urls];
    newImages[index] = value;
    setProduct(prev => ({ ...prev, image_urls: newImages }));
  };

  const addImage = () => {
    setProduct(prev => ({
      ...prev,
      image_urls: [...prev.image_urls, '']
    }));
  };

  const removeImage = (index) => {
    if (product.image_urls.length > 1) {
      setProduct(prev => ({
        ...prev,
        image_urls: prev.image_urls.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name: product.name,
        description: product.description,
        category: product.category,
        price: parseFloat(product.price),
        image_urls: product.image_urls.filter(url => url.trim() !== ''),
        origin: product.origin,
        in_stock: product.in_stock
      };

      if (isEdit) {
        await axios.put(`${API}/products/${id}`, productData);
      } else {
        await axios.post(`${API}/products`, productData);
      }

      alert(isEdit ? 'Produit mis à jour avec succès!' : 'Produit créé avec succès!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erreur lors de la sauvegarde du produit');
    } finally {
      setSaving(false);
    }
  };

  const getLocalizedLabel = (item) => {
    return item[`label${language.charAt(0).toUpperCase() + language.slice(1)}`] || item.labelFr;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 
              (language === 'ar' ? 'تحرير المنتج' : language === 'en' ? 'Edit Product' : 'Modifier le Produit') :
              (language === 'ar' ? 'إضافة منتج جديد' : language === 'en' ? 'Add New Product' : 'Ajouter un Nouveau Produit')
            }
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'املأ النموذج لإنشاء أو تحديث منتج' :
             language === 'en' ? 'Fill out the form to create or update a product' :
             'Remplissez le formulaire pour créer ou mettre à jour un produit'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X size={20} className="mr-2" />
          {language === 'ar' ? 'إلغاء' : language === 'en' ? 'Cancel' : 'Annuler'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Package className="mr-2" size={24} />
            {language === 'ar' ? 'معلومات أساسية' : language === 'en' ? 'Basic Information' : 'Informations de Base'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Names */}
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang} className="space-y-2">
                <label className="form-label">
                  {language === 'ar' ? 'اسم المنتج' : language === 'en' ? 'Product Name' : 'Nom du Produit'} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={product.name[lang]}
                  onChange={(e) => handleInputChange('name', lang, e.target.value)}
                  className="form-input"
                  required
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Descriptions */}
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang} className="space-y-2">
                <label className="form-label">
                  {language === 'ar' ? 'وصف المنتج' : language === 'en' ? 'Product Description' : 'Description du Produit'} ({lang.toUpperCase()})
                </label>
                <textarea
                  value={product.description[lang]}
                  onChange={(e) => handleInputChange('description', lang, e.target.value)}
                  className="form-input min-h-24"
                  required
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Origins */}
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang} className="space-y-2">
                <label className="form-label flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {language === 'ar' ? 'المنشأ' : language === 'en' ? 'Origin' : 'Origine'} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={product.origin[lang]}
                  onChange={(e) => handleInputChange('origin', lang, e.target.value)}
                  className="form-input"
                  required
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  placeholder={language === 'ar' ? 'مثال: الجزائر، منطقة القبائل' :
                              language === 'en' ? 'e.g: Algeria, Kabylie region' :
                              'ex: Algérie, région de Kabylie'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Category and Price */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Euro className="mr-2" size={24} />
            {language === 'ar' ? 'الفئة والسعر' : language === 'en' ? 'Category and Price' : 'Catégorie et Prix'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="form-label">
                {language === 'ar' ? 'فئة المنتج' : language === 'en' ? 'Product Category' : 'Catégorie du Produit'}
              </label>
              <select
                value={product.category}
                onChange={(e) => handleInputChange('category', null, e.target.value)}
                className="form-input"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {getLocalizedLabel(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="form-label flex items-center">
                <Euro size={16} className="mr-1" />
                {language === 'ar' ? 'السعر (يورو)' : language === 'en' ? 'Price (EUR)' : 'Prix (EUR)'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={product.price}
                onChange={(e) => handleInputChange('price', null, e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="form-label">
                {language === 'ar' ? 'حالة المخزون' : language === 'en' ? 'Stock Status' : 'État du Stock'}
              </label>
              <select
                value={product.in_stock}
                onChange={(e) => handleInputChange('in_stock', null, e.target.value === 'true')}
                className="form-input"
              >
                <option value={true}>
                  {language === 'ar' ? 'متوفر' : language === 'en' ? 'In Stock' : 'En stock'}
                </option>
                <option value={false}>
                  {language === 'ar' ? 'غير متوفر' : language === 'en' ? 'Out of Stock' : 'Rupture de stock'}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ImageIcon className="mr-2" size={24} />
            {language === 'ar' ? 'صور المنتج' : language === 'en' ? 'Product Images' : 'Images du Produit'}
          </h2>

          <div className="space-y-6">
            {/* Image Upload Component */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {language === 'ar' ? 'تحميل الصور' : language === 'en' ? 'Upload Images' : 'Télécharger des images'}
              </h3>
              <ImageUpload
                label={language === 'ar' ? 'صور المنتج' : language === 'en' ? 'Product Images' : 'Images du Produit'}
                maxImages={5}
                existingImages={product.image_urls.filter(url => url.trim() !== '')}
                onUploadComplete={(images) => {
                  setProduct(prev => ({ ...prev, image_urls: images.length > 0 ? images : [''] }));
                }}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {language === 'ar' ? 'أو' : language === 'en' ? 'OR' : 'OU'}
                </span>
              </div>
            </div>

            {/* Manual URL Input */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {language === 'ar' ? 'إضافة روابط الصور' : language === 'en' ? 'Add Image URLs' : 'Ajouter des URLs d\'images'}
              </h3>
              <div className="space-y-3">
                {product.image_urls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={language === 'ar' ? 'https://exemple.com/image.jpg' : 'https://example.com/image.jpg'}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                    />
                    {product.image_urls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="flex items-center space-x-2 px-4 py-2 text-[#6B8E23] border border-[#6B8E23] rounded-lg hover:bg-[#6B8E23] hover:text-white transition"
                >
                  <Plus size={20} />
                  <span>
                    {language === 'ar' ? 'إضافة رابط' : language === 'en' ? 'Add URL' : 'Ajouter une URL'}
                  </span>
                </button>
              </div>

              {/* Preview */}
              {product.image_urls.some(url => url.trim() !== '') && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'معاينة' : language === 'en' ? 'Preview' : 'Aperçu'}
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {product.image_urls
                      .filter(url => url.trim() !== '')
                      .map((url, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300?text=Invalid+URL';
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 bg-white rounded-xl shadow-lg p-6">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {language === 'ar' ? 'إلغاء' : language === 'en' ? 'Cancel' : 'Annuler'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center px-6 py-3 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save size={20} className="mr-2" />
            )}
            {saving ? 
              (language === 'ar' ? 'جاري الحفظ...' : language === 'en' ? 'Saving...' : 'Sauvegarde...') :
              (isEdit ? 
                (language === 'ar' ? 'تحديث المنتج' : language === 'en' ? 'Update Product' : 'Mettre à jour') :
                (language === 'ar' ? 'إنشاء المنتج' : language === 'en' ? 'Create Product' : 'Créer le produit')
              )
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;