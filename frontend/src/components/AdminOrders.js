import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Eye, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({ title: 'Erreur', description: 'Impossible de charger les commandes', variant: 'destructive' });
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: 'Succès', description: 'Statut mis à jour' });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'confirmed': return <CheckCircle className="text-blue-500" size={20} />;
      case 'processing': return <Package className="text-purple-500" size={20} />;
      case 'shipped': return <Truck className="text-green-500" size={20} />;
      case 'delivered': return <CheckCircle className="text-green-700" size={20} />;
      case 'cancelled': return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Commandes</h1>
        <p className="text-gray-600">{orders.length} commande(s) au total</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-900">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <Clock className="text-yellow-400" size={32} />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Confirmées</p>
              <p className="text-2xl font-bold text-blue-900">{orders.filter(o => o.status === 'confirmed').length}</p>
            </div>
            <CheckCircle className="text-blue-400" size={32} />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Expédiées</p>
              <p className="text-2xl font-bold text-green-900">{orders.filter(o => o.status === 'shipped').length}</p>
            </div>
            <Truck className="text-green-400" size={32} />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Total</p>
              <p className="text-2xl font-bold text-purple-900">{orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)} EUR</p>
            </div>
            <Package className="text-purple-400" size={32} />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Commandes récentes</h2>
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`bg-white rounded-lg shadow p-4 cursor-pointer transition hover:shadow-lg ${
                selectedOrder?.id === order.id ? 'ring-2 ring-[#6B8E23]' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">#{order.order_number}</h3>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium">{getStatusLabel(order.status)}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{order.items.length} article(s)</span>
                <span className="font-bold text-[#6B8E23]">{order.total.toFixed(2)} EUR</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          ))}
        </div>

        {/* Order Details */}
        <div className="lg:sticky lg:top-6">
          {selectedOrder ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Détails de la commande</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Numéro</label>
                  <p className="text-lg font-bold">#{selectedOrder.order_number}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Client</label>
                  <p>{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer_email}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Adresse de livraison</label>
                  <p>{selectedOrder.shipping_address}</p>
                  <p>{selectedOrder.shipping_city}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Articles</label>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b">
                      <span>{item.product_name} x{item.quantity}</span>
                      <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} EUR</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#6B8E23]">{selectedOrder.total.toFixed(2)} EUR</span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Changer le statut</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedOrder.id, status)}
                        className={`px-3 py-2 rounded text-sm font-medium transition ${
                          selectedOrder.status === status
                            ? 'bg-[#6B8E23] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {getStatusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-600">Sélectionnez une commande pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
