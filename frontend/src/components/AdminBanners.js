import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../App';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminBanners() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: { fr: '', en: '', ar: '' },
    subtitle: { fr: '', en: '', ar: '' },
    description: { fr: '', en: '', ar: '' },
    image_url: '',
    cta_text: { fr: '', en: '', ar: '' },
    cta_link: '',
    order: 0,
    is_active: true,
    background_color: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/banners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les bannières',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      
      if (editingBanner) {
        await axios.put(
          `${API}/admin/banners/${editingBanner.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Succès',
          description: 'Bannière mise à jour',
        });
      } else {
        await axios.post(
          `${API}/admin/banners`,
          { ...formData, order: banners.length },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Succès',
          description: 'Bannière créée',
        });
      }

      resetForm();
      fetchBanners();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Opération échouée',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || { fr: '', en: '', ar: '' },
      description: banner.description || { fr: '', en: '', ar: '' },
      image_url: banner.image_url,
      cta_text: banner.cta_text || { fr: '', en: '', ar: '' },
      cta_link: banner.cta_link || '',
      order: banner.order,
      is_active: banner.is_active,
      background_color: banner.background_color || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({
        title: 'Succès',
        description: 'Bannière supprimée',
      });
      fetchBanners();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la bannière',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/banners/${banner.id}`,
        { is_active: !banner.is_active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBanners();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
        variant: 'destructive'
      });
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    const newBanners = [...banners];
    [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
    
    await reorderBanners(newBanners);
  };

  const handleMoveDown = async (index) => {
    if (index === banners.length - 1) return;
    
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    
    await reorderBanners(newBanners);
  };

  const reorderBanners = async (newBanners) => {
    const bannersOrder = newBanners.map((banner, idx) => ({
      id: banner.id,
      order: idx
    }));

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/admin/banners/reorder`,
        bannersOrder,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBanners(newBanners);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de réorganiser les bannières',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: { fr: '', en: '', ar: '' },
      subtitle: { fr: '', en: '', ar: '' },
      description: { fr: '', en: '', ar: '' },
      image_url: '',
      cta_text: { fr: '', en: '', ar: '' },
      cta_link: '',
      order: 0,
      is_active: true,
      background_color: ''
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bannières Homepage</h1>
          <p className="text-gray-600">Gérez les sliders de la page d'accueil</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-6 py-3 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1d] transition"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm ? 'Annuler' : 'Ajouter une bannière'}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre * (multilingue)
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={formData.title.fr}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, fr: e.target.value }
                  })}
                  placeholder="Français"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, en: e.target.value }
                  })}
                  placeholder="English"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
                <input
                  type="text"
                  value={formData.title.ar}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, ar: e.target.value }
                  })}
                  placeholder="العربية"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sous-titre (optionnel)
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={formData.subtitle.fr}
                  onChange={(e) => setFormData({
                    ...formData,
                    subtitle: { ...formData.subtitle, fr: e.target.value }
                  })}
                  placeholder="Français"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
                <input
                  type="text"
                  value={formData.subtitle.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    subtitle: { ...formData.subtitle, en: e.target.value }
                  })}
                  placeholder="English"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
                <input
                  type="text"
                  value={formData.subtitle.ar}
                  onChange={(e) => setFormData({
                    ...formData,
                    subtitle: { ...formData.subtitle, ar: e.target.value }
                  })}
                  placeholder="العربية"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image *
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
              />
              {formData.image_url && (
                <div className="mt-3">
                  <img
                    src={formData.image_url}
                    alt="Aperçu"
                    className="h-40 w-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte du bouton (FR)
                </label>
                <input
                  type="text"
                  value={formData.cta_text.fr}
                  onChange={(e) => setFormData({
                    ...formData,
                    cta_text: { ...formData.cta_text, fr: e.target.value }
                  })}
                  placeholder="Ex: Découvrir"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lien du bouton
                </label>
                <input
                  type="text"
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="/shop"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
            </div>

            {/* Active checkbox */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#6B8E23] rounded focus:ring-[#6B8E23]"
                />
                <span className="text-sm font-medium text-gray-700">Actif</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1d] transition"
              >
                <Save size={20} />
                <span>{editingBanner ? 'Mettre à jour' : 'Créer'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="bg-white rounded-lg shadow">
        {banners.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600">Aucune bannière. Ajoutez-en une !</p>
          </div>
        ) : (
          <div className="divide-y">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`p-6 flex items-center justify-between ${
                  !banner.is_active ? 'bg-gray-50 opacity-60' : ''
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === banners.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>

                  <img
                    src={banner.image_url}
                    alt={banner.title.fr}
                    className="w-32 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image';
                    }}
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {banner.title.fr}
                    </h3>
                    {banner.subtitle?.fr && (
                      <p className="text-sm text-gray-600">{banner.subtitle.fr}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Ordre: {banner.order}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`p-2 rounded-lg transition ${
                      banner.is_active
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title={banner.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {banner.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
