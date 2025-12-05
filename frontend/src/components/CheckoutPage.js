import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, CheckCircle, CreditCard, Banknote, Building2 } from 'lucide-react';
import PaymentInfo from './PaymentInfo';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'bank_transfer', 'paypal'
  const [cartLoaded, setCartLoaded] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    notes: ''
  });

  // Wait for cart to load before checking if it's empty
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCartLoaded(true);
    }, 1000); // Give cart context time to load from localStorage
    return () => clearTimeout(timer);
  }, []);

  if (cartLoaded && cartItems.length === 0 && !orderComplete) {
    navigate('/shop');
    return null;
  }

  if (!cartLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setPromoLoading(true);
    try {
      const response = await axios.post(`${API}/promo-codes/validate`, {
        code: promoCode,
        order_amount: getCartTotal()
      });
      setPromoApplied(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || 'Code promo invalide');
      setPromoApplied(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoApplied(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: typeof item.name === 'object' ? item.name : { fr: item.name, en: item.name, ar: item.name },
          quantity: item.quantity,
          price: item.price,
          image_url: item.image_urls?.[0]
        })),
        promo_code: promoApplied?.promo_code || null,
        payment_method: paymentMethod
      };

      const response = await axios.post(`${API}/orders`, orderData);
      setOrderId(response.data.order_number);
      setOrderComplete(true);
      clearCart();
      setPromoApplied(null);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.detail || 'Erreur lors de la commande. Veuillez réessayer.');
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
              
              {/* Payment Method Selection */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Méthode de Paiement</h3>
                <div className="space-y-3">
                  {/* Cash Payment */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'cash' ? 'border-[#6B8E23] bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Banknote className="text-[#6B8E23] mr-2" size={24} />
                    <div>
                      <div className="font-semibold">Paiement à la livraison</div>
                      <div className="text-xs text-gray-600">Payez en espèces au livreur</div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'bank_transfer' ? 'border-[#6B8E23] bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Building2 className="text-[#6B8E23] mr-2" size={24} />
                    <div>
                      <div className="font-semibold">Virement bancaire</div>
                      <div className="text-xs text-gray-600">Paiement par virement</div>
                    </div>
                  </label>

                  {/* PayPal */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === 'paypal' ? 'border-[#6B8E23] bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="text-[#6B8E23] mr-2" size={24} />
                    <div>
                      <div className="font-semibold">PayPal</div>
                      <div className="text-xs text-gray-600">Paiement sécurisé en ligne</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Info Display */}
              <PaymentInfo paymentMethod={paymentMethod} />
              
              <button type="submit" disabled={loading}
                className="w-full bg-[#6B8E23] text-white py-3 rounded-lg font-semibold hover:bg-[#5a7a1d] transition disabled:opacity-50">
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            <div className="space-y-3 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{typeof item.name === 'object' ? item.name.fr || item.name.en || item.name : item.name} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} EUR</span>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="border-t pt-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Promo
              </label>
              {!promoApplied ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="ENTRER LE CODE"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg uppercase"
                    disabled={promoLoading}
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoLoading || !promoCode.trim()}
                    className="px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1d] transition disabled:opacity-50"
                  >
                    {promoLoading ? 'Vérification...' : 'Appliquer'}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-green-700">{promoApplied.promo_code}</span>
                      <p className="text-xs text-green-600 mt-1">
                        -{promoApplied.discount_amount.toFixed(2)} EUR
                      </p>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-red-500 hover:text-red-700 text-sm underline"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{getCartTotal().toFixed(2)} EUR</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Réduction</span>
                  <span>-{promoApplied.discount_amount.toFixed(2)} EUR</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#6B8E23]">
                  {promoApplied
                    ? promoApplied.final_amount.toFixed(2)
                    : getCartTotal().toFixed(2)} EUR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}