import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, ExternalLink, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useLanguage } from '../App';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminNavigation() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: { fr: '', en: '', ar: '' },
    url: '',
    is_external: false,
    is_active: true,
    icon: '',
    order: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/navigation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les items du menu',
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
      
      if (editingItem) {
        // Update existing item
        await axios.put(
          `${API}/admin/navigation/${editingItem.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Succès',
          description: 'Item mis à jour',
        });
      } else {
        // Create new item
        await axios.post(
          `${API}/admin/navigation`,
          { ...formData, order: items.length },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Succès',
          description: 'Item créé',
        });
      }

      resetForm();
      fetchItems();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Opération échouée',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      url: item.url,
      is_external: item.is_external,
      is_active: item.is_active,
      icon: item.icon || '',
      order: item.order
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet item ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/navigation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({
        title: 'Succès',
        description: 'Item supprimé',
      });
      fetchItems();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'item',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/navigation/${item.id}`,
        { is_active: !item.is_active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchItems();
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
    
    const newItems = [...items];
    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    
    await reorderItems(newItems);
  };

  const handleMoveDown = async (index) => {
    if (index === items.length - 1) return;
    
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    
    await reorderItems(newItems);
  };

  const reorderItems = async (newItems) => {
    const itemsOrder = newItems.map((item, idx) => ({
      id: item.id,
      order: idx
    }));

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/admin/navigation/reorder`,
        itemsOrder,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(newItems);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de réorganiser les items',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      label: { fr: '', en: '', ar: '' },
      url: '',
      is_external: false,
      is_active: true,
      icon: '',
      order: 0
    });
    setEditingItem(null);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu de Navigation</h1>
          <p className="text-gray-600">Gérez les liens du menu principal</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-6 py-3 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1d] transition"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm ? 'Annuler' : 'Ajouter un lien'}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingItem ? 'Modifier le lien' : 'Nouveau lien'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label (Français) *
                </label>
                <input
                  type="text"
                  value={formData.label.fr}
                  onChange={(e) => setFormData({
                    ...formData,
                    label: { ...formData.label, fr: e.target.value }
                  })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label (English) *
                </label>
                <input
                  type="text"
                  value={formData.label.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    label: { ...formData.label, en: e.target.value }
                  })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label (العربية) *
                </label>
                <input
                  type="text"
                  value={formData.label.ar}
                  onChange={(e) => setFormData({
                    ...formData,
                    label: { ...formData.label, ar: e.target.value }
                  })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/shop ou https://exemple.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icône (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🏠 ou Home"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_external}
                  onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
                  className="w-4 h-4 text-[#6B8E23] rounded focus:ring-[#6B8E23]"
                />
                <span className="text-sm font-medium text-gray-700">Lien externe</span>
              </label>
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
                <span>{editingItem ? 'Mettre à jour' : 'Créer'}</span>
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

      {/* Items List */}
      <div className="bg-white rounded-lg shadow">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">Aucun item dans le menu. Ajoutez-en un !</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`p-6 flex items-center justify-between ${
                  !item.is_active ? 'bg-gray-50 opacity-60' : ''
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
                      disabled={index === items.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {item.icon && <span className="text-xl">{item.icon}</span>}
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.label.fr} / {item.label.en} / {item.label.ar}
                      </h3>
                      {item.is_external && (
                        <ExternalLink size={16} className="text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{item.url}</p>
                    <p className="text-xs text-gray-400 mt-1">Ordre: {item.order}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`p-2 rounded-lg transition ${
                      item.is_active
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    title={item.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {item.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
