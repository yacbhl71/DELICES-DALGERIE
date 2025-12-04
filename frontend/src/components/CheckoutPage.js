import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    notes: ''
  });

  if (cartItems.length === 0 && !orderComplete) {
    navigate('/shop');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          image_url: item.image_urls?.[0]
        }))
      };

      const response = await axios.post(`${API}/orders`, orderData);
      setOrderId(response.data.order_number);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
          <p className="text-gray-600 mb-2">Numéro de commande :</p>
          <p className="text-2xl font-bold text-[#6B8E23] mb-6">{orderId}</p>
          <p className="text-gray-600 mb-6">Vous recevrez un email de confirmation à l'adresse indiquée.</p>
          <button onClick={() => navigate('/')} className="bg-[#6B8E23] text-white px-8 py-3 rounded-lg hover:bg-[#5a7a1d] transition">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Finaliser la commande</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Informations de livraison</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="Nom complet" value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg" />
              <input type="email" required placeholder="Email" value={formData.customer_email}
                onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg" />
              <input type="tel" required placeholder="Téléphone" value={formData.customer_phone}
                onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg" />
              <textarea required placeholder="Adresse complète" value={formData.shipping_address}
                onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg" rows="3" />
              <input type="text" required placeholder="Ville" value={formData.shipping_city}
                onChange={(e) => setFormData({...formData, shipping_city: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Code postal (optionnel)" value={formData.shipping_postal_code}
                onChange={(e) => setFormData({...formData, shipping_postal_code: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg" />
              <textarea placeholder="Notes (optionnel)" value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg" rows="2" />
              <button type="submit" disabled={loading}
                className="w-full bg-[#6B8E23] text-white py-3 rounded-lg font-semibold hover:bg-[#5a7a1d] transition disabled:opacity-50">
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} EUR</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#6B8E23]">{getCartTotal().toFixed(2)} EUR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}