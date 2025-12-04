import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import ImageUpload from './ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: { fr: '', en: '', ar: '' },
    slug: '',
    description: { fr: '', en: '', ar: '' },
    icon: '🛍️',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les catégories',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        name: { fr: '', en: '', ar: '' },
        slug: '',
        description: { fr: '', en: '', ar: '' },
        icon: '🛍️',
        order: categories.length,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (editingCategory) {
        // Update
        await axios.put(
          `${API}/admin/categories/${editingCategory.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Succès',
          description: 'Catégorie mise à jour'
        });
      } else {
        // Create
        await axios.post(
          `${API}/admin/categories`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Succès',
          description: 'Catégorie créée'
        });
      }
      
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Impossible de sauvegarder la catégorie',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: 'Succès',
        description: 'Catégorie supprimée'
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Impossible de supprimer la catégorie',
        variant: 'destructive'
      });
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      name: { ...prev.name, [lang]: value },
      ...(lang === 'fr' && !editingCategory ? { slug: generateSlug(value) } : {})
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catégories de Produits</h1>
          <p className="text-gray-600">Gérez les catégories pour organiser vos produits</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-[#6B8E23] text-white px-6 py-3 rounded-lg hover:bg-[#5a7a1d] transition"
        >
          <Plus size={20} />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`bg-white rounded-lg shadow p-6 ${!category.is_active ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{category.name.fr}</h3>
                  <p className="text-sm text-gray-500">/{category.slug}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            {category.description?.fr && (
              <p className="text-sm text-gray-600 mb-3">{category.description.fr}</p>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <span className={`px-2 py-1 rounded ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {category.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-gray-500">Ordre: {category.order}</span>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucune catégorie. Créez-en une pour commencer !</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name - Multilingual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nom de la Catégorie *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Français</label>
                    <input
                      type="text"
                      required
                      value={formData.name.fr}
                      onChange={(e) => handleNameChange('fr', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      placeholder="Dattes"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">English</label>
                    <input
                      type="text"
                      required
                      value={formData.name.en}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: { ...prev.name, en: e.target.value } }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      placeholder="Dates"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">العربية</label>
                    <input
                      type="text"
                      required
                      value={formData.name.ar}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: { ...prev.name, ar: e.target.value } }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                      placeholder="تمور"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  placeholder="dattes"
                />
                <p className="text-xs text-gray-500 mt-1">Utilisé dans l'URL (ex: /shop/dattes)</p>
              </div>

              {/* Icon & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icône (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent text-2xl"
                    placeholder="🌴"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre d'Affichage
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de la Catégorie (optionnel)
                </label>
                <ImageUpload
                  existingImages={formData.image_url ? [formData.image_url] : []}
                  maxImages={1}
                  onUploadComplete={(urls) => setFormData(prev => ({ ...prev, image_url: urls[0] || null }))}
                  label="Image de catégorie"
                />
                {formData.image_url && (
                  <div className="mt-3">
                    <img 
                      src={formData.image_url} 
                      alt="Aperçu" 
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Description - Multilingual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Description (optionnel)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <textarea
                    value={formData.description.fr}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, fr: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                    rows="3"
                    placeholder="Description en français"
                  />
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                    rows="3"
                    placeholder="English description"
                  />
                  <textarea
                    value={formData.description.ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: { ...prev.description, ar: e.target.value } }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                    rows="3"
                    placeholder="الوصف بالعربية"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-[#6B8E23] border-gray-300 rounded focus:ring-[#6B8E23]"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Catégorie active (visible sur le site)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 bg-[#6B8E23] text-white px-6 py-3 rounded-lg hover:bg-[#5a7a1d] transition"
                >
                  <Save size={20} />
                  <span>Sauvegarder</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
