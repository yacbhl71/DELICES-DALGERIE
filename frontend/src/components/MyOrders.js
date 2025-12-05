import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Eye, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useAuth, useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MyOrders() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
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
      fr: {
        pending: 'En attente',
        confirmed: 'Confirmée',
        processing: 'En préparation',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée'
      },
      en: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      },
      ar: {
        pending: 'قيد الانتظار',
        confirmed: 'تم التأكيد',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        delivered: 'تم التسليم',
        cancelled: 'ملغى'
      }
    };
    return labels[language]?.[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {language === 'ar' ? 'طلباتي' : language === 'en' ? 'My Orders' : 'Mes Commandes'}
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد طلبات' : language === 'en' ? 'No orders yet' : 'Aucune commande'}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === 'ar' ? 'ابدأ التسوق الآن!' : language === 'en' ? 'Start shopping now!' : 'Commencez vos achats maintenant !'}
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-[#6B8E23] text-white px-8 py-3 rounded-lg hover:bg-[#5a7a1d] transition"
            >
              {language === 'ar' ? 'تسوق الآن' : language === 'en' ? 'Shop Now' : 'Voir la boutique'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition hover:shadow-lg ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-[#6B8E23]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">#{order.order_number}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'en' ? 'en-US' : 'fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-medium">{getStatusLabel(order.status)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {order.items.length} {language === 'ar' ? 'منتج' : language === 'en' ? 'item(s)' : 'article(s)'}
                    </span>
                    <span className="font-bold text-[#6B8E23] text-lg">{order.total.toFixed(2)} EUR</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                    className="mt-4 w-full text-center text-sm text-[#6B8E23] hover:underline"
                  >
                    {language === 'ar' ? 'عرض التفاصيل' : language === 'en' ? 'View Details' : 'Voir les détails'}
                  </button>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="lg:sticky lg:top-6">
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {language === 'ar' ? 'تفاصيل الطلب' : language === 'en' ? 'Order Details' : 'Détails de la commande'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="font-semibold">{getStatusLabel(selectedOrder.status)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'رقم الطلب' : language === 'en' ? 'Order Number' : 'Numéro'}
                      </label>
                      <p className="text-lg font-bold">#{selectedOrder.order_number}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'التاريخ' : language === 'en' ? 'Date' : 'Date'}
                      </label>
                      <p>
                        {new Date(selectedOrder.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'en' ? 'en-US' : 'fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {language === 'ar' ? 'عنوان التسليم' : language === 'en' ? 'Delivery Address' : 'Adresse de livraison'}
                      </label>
                      <p>{selectedOrder.shipping_address}</p>
                      <p>{selectedOrder.shipping_city}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-2">
                        {language === 'ar' ? 'المنتجات' : language === 'en' ? 'Products' : 'Articles'}
                      </label>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-3 border-b pb-3">
                            {item.image_url && (
                              <img src={item.image_url} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold">{item.product_name}</p>
                              <p className="text-sm text-gray-600">
                                {language === 'ar' ? 'الكمية' : language === 'en' ? 'Qty' : 'Qté'}: {item.quantity} × {item.price.toFixed(2)} EUR
                              </p>
                            </div>
                            <p className="font-bold">{(item.price * item.quantity).toFixed(2)} EUR</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between py-3 font-bold text-lg border-t mt-3">
                        <span>{language === 'ar' ? 'المجموع' : language === 'en' ? 'Total' : 'Total'}</span>
                        <span className="text-[#6B8E23]">{selectedOrder.total.toFixed(2)} EUR</span>
                      </div>
                    </div>

                    {selectedOrder.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {language === 'ar' ? 'ملاحظات' : language === 'en' ? 'Notes' : 'Notes'}
                        </label>
                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <Eye className="mx-auto text-gray-400 mb-4" size={64} />
                  <p className="text-gray-600">
                    {language === 'ar' ? 'حدد طلبًا لعرض التفاصيل' : language === 'en' ? 'Select an order to view details' : 'Sélectionnez une commande pour voir les détails'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
