import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Minus, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminInventory() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterView, setFilterView] = useState('all'); // 'all', 'low-stock', 'out-of-stock'
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentData, setAdjustmentData] = useState({
    adjustment_type: 'increase',
    quantity: 0,
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchInventory();
    fetchLowStock();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger l\'inventaire',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/inventory/low-stock`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLowStockProducts(response.data);
    } catch (error) {
      console.error('Error fetching low stock:', error);
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/admin/inventory/${selectedProduct.id}/adjust`,
        adjustmentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Succès',
        description: 'Stock ajusté avec succès'
      });

      setShowAdjustModal(false);
      setAdjustmentData({ adjustment_type: 'increase', quantity: 0, reason: '', notes: '' });
      fetchInventory();
      fetchLowStock();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Erreur lors de l\'ajustement',
        variant: 'destructive'
      });
    }
  };

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setShowAdjustModal(true);
  };

  const getStockStatus = (product) => {
    if (!product.track_inventory) {
      return { label: 'Non suivi', color: 'bg-gray-100 text-gray-800' };
    }
    if (product.stock_quantity === 0) {
      return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    }
    if (product.stock_quantity <= product.low_stock_threshold) {
      return { label: 'Stock faible', color: 'bg-orange-100 text-orange-800' };
    }
    return { label: 'En stock', color: 'bg-green-100 text-green-800' };
  };

  const filteredProducts = products.filter(product => {
    if (filterView === 'low-stock') {
      return product.track_inventory && product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0;
    }
    if (filterView === 'out-of-stock') {
      return product.track_inventory && product.stock_quantity === 0;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Stocks</h1>
        <p className="text-gray-600">Gérez l'inventaire de vos produits</p>
      </div>

      {/* Alerts for Low Stock */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="text-orange-400 mr-3" size={24} />
            <div>
              <p className="font-semibold text-orange-800">
                {lowStockProducts.length} produit(s) en stock faible
              </p>
              <p className="text-orange-700 text-sm mt-1">
                Pensez à réapprovisionner ces produits
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilterView('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterView === 'all'
              ? 'bg-[#6B8E23] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous ({products.length})
        </button>
        <button
          onClick={() => setFilterView('low-stock')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterView === 'low-stock'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Stock faible ({lowStockProducts.filter(p => p.stock_quantity > 0).length})
        </button>
        <button
          onClick={() => setFilterView('out-of-stock')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filterView === 'out-of-stock'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rupture ({products.filter(p => p.track_inventory && p.stock_quantity === 0).length})
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock actuel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seuil bas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const status = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.image_urls && product.image_urls[0] ? (
                          <img
                            src={product.image_urls[0]}
                            alt={product.name.fr}
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                            <Package size={24} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name.fr}</p>
                          <p className="text-sm text-gray-500">{product.price.toFixed(2)} EUR</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${
                        product.stock_quantity === 0 ? 'text-red-600' :
                        product.stock_quantity <= product.low_stock_threshold ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {product.track_inventory ? product.stock_quantity : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.track_inventory ? product.low_stock_threshold : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openAdjustModal(product)}
                        className="text-[#6B8E23] hover:text-[#5a7a1d] font-medium text-sm"
                      >
                        <Edit2 size={18} className="inline mr-1" />
                        Ajuster
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Ajuster le Stock</h2>
            <p className="text-gray-600 mb-4">
              Produit: <strong>{selectedProduct.name.fr}</strong><br />
              Stock actuel: <strong>{selectedProduct.stock_quantity}</strong>
            </p>

            <form onSubmit={handleAdjustStock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'ajustement
                </label>
                <select
                  value={adjustmentData.adjustment_type}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, adjustment_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="increase">Augmenter (+)</option>
                  <option value="decrease">Diminuer (-)</option>
                  <option value="set">Définir la quantité exacte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustmentData.quantity}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison
                </label>
                <input
                  type="text"
                  value={adjustmentData.reason}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                  placeholder="Ex: Réapprovisionnement, Inventaire, Retour..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={adjustmentData.notes}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, notes: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#6B8E23] text-white px-4 py-2 rounded-lg hover:bg-[#5a7a1d] transition"
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setAdjustmentData({ adjustment_type: 'increase', quantity: 0, reason: '', notes: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
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
