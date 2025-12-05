import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Calendar, Users, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminPromoCodes() {
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: { fr: '', en: '', ar: '' },
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: null,
    max_discount_amount: null,
    usage_limit: null,
    user_usage_limit: null,
    valid_from: null,
    valid_until: null,
    is_active: true
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/promo-codes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPromoCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les codes promo',
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
      const endpoint = editingCode
        ? `${API}/admin/promo-codes/${editingCode.id}`
        : `${API}/admin/promo-codes`;
      
      const method = editingCode ? 'put' : 'post';
      
      await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: 'Succès',
        description: editingCode ? 'Code promo mis à jour' : 'Code promo créé'
      });

      setShowForm(false);
      setEditingCode(null);
      resetForm();
      fetchPromoCodes();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Une erreur est survenue',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (code) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      description: code.description || { fr: '', en: '', ar: '' },
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      min_order_amount: code.min_order_amount,
      max_discount_amount: code.max_discount_amount,
      usage_limit: code.usage_limit,
      user_usage_limit: code.user_usage_limit,
      valid_from: code.valid_from ? code.valid_from.split('T')[0] : null,
      valid_until: code.valid_until ? code.valid_until.split('T')[0] : null,
      is_active: code.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/promo-codes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: 'Succès',
        description: 'Code promo supprimé'
      });

      fetchPromoCodes();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le code promo',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: { fr: '', en: '', ar: '' },
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: null,
      max_discount_amount: null,
      usage_limit: null,
      user_usage_limit: null,
      valid_from: null,
      valid_until: null,
      is_active: true
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Codes Promo</h1>
          <p className="text-gray-600">Gérez vos codes de réduction</p>
        </div>
        <button
          onClick={() => {
            setEditingCode(null);
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-[#6B8E23] text-white px-6 py-3 rounded-lg hover:bg-[#5a7a1d] transition"
        >
          <Plus size={20} />
          <span>Nouveau Code</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingCode ? 'Modifier le Code Promo' : 'Nouveau Code Promo'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] uppercase"
                  disabled={editingCode}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de Réduction *
                </label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                >
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed">Montant Fixe (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valeur de Réduction *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                  placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant Minimum de Commande
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.min_order_amount || ''}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="50.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>

              {formData.discount_type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Réduction Maximum (EUR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.max_discount_amount || ''}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="100.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limite d'Utilisation Totale
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.usage_limit || ''}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Début
                </label>
                <input
                  type="date"
                  value={formData.valid_from || ''}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'Expiration
                </label>
                <input
                  type="date"
                  value={formData.valid_until || ''}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Français)
              </label>
              <textarea
                value={formData.description.fr}
                onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                placeholder="Offre spéciale été 2025"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-[#6B8E23] focus:ring-[#6B8E23] border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Actif
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-[#6B8E23] text-white px-6 py-2 rounded-lg hover:bg-[#5a7a1d] transition"
              >
                {editingCode ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCode(null);
                  resetForm();
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réduction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisations</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promoCodes.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Aucun code promo. Créez-en un pour commencer !
                </td>
              </tr>
            ) : (
              promoCodes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag size={16} className="text-[#6B8E23] mr-2" />
                      <span className="font-mono font-bold text-gray-900">{code.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {code.discount_type === 'percentage' ? 'Pourcentage' : 'Fixe'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#6B8E23]">
                    {code.discount_type === 'percentage'
                      ? `${code.discount_value}%`
                      : `${code.discount_value.toFixed(2)} EUR`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {code.usage_count} / {code.usage_limit || '∞'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span>Du {formatDate(code.valid_from)}</span>
                      <span>Au {formatDate(code.valid_until)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      code.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {code.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(code)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
