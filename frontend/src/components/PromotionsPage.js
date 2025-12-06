import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { Tag, Copy, Check, Calendar, Percent, Euro } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PromotionsPage = () => {
  const { language } = useLanguage();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/promo-codes/active`);
      setPromoCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#6B8E23] to-[#8B7355] rounded-full mb-6">
            <Tag size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'العروض الترويجية' : 
             language === 'en' ? 'Promotions' : 
             'Nos Promotions'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'ar' ? 'استمتع بأفضل العروض على منتجاتنا' :
             language === 'en' ? 'Enjoy the best offers on our products' :
             'Profitez de nos meilleures offres sur nos produits authentiques'}
          </p>
        </div>

        {/* Promo Codes Grid */}
        {promoCodes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Tag size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {language === 'ar' ? 'لا توجد عروض متاحة حالياً' :
               language === 'en' ? 'No promotions available' :
               'Aucune promotion disponible pour le moment'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' ? 'تحقق مرة أخرى قريبًا للحصول على عروض جديدة' :
               language === 'en' ? 'Check back soon for new offers' :
               'Revenez bientôt pour découvrir de nouvelles offres'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {promoCodes.map((promo, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Type Badge */}
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3"
                           style={{
                             backgroundColor: promo.discount_type === 'percentage' ? '#FEF3C7' : '#DBEAFE',
                             color: promo.discount_type === 'percentage' ? '#92400E' : '#1E40AF'
                           }}>
                        {promo.discount_type === 'percentage' ? (
                          <>
                            <Percent size={14} className="mr-1" />
                            {language === 'ar' ? 'نسبة مئوية' : language === 'en' ? 'Percentage' : 'Pourcentage'}
                          </>
                        ) : (
                          <>
                            <Euro size={14} className="mr-1" />
                            {language === 'ar' ? 'مبلغ ثابت' : language === 'en' ? 'Fixed amount' : 'Montant fixe'}
                          </>
                        )}
                      </div>
                      
                      {/* Description */}
                      {promo.description && (
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {promo.description}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Code Display */}
                  <div className="bg-gradient-to-r from-green-50 to-amber-50 border-2 border-dashed border-[#6B8E23] rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === 'ar' ? 'كود الخصم' : language === 'en' ? 'Promo Code' : 'Code Promo'}
                        </p>
                        <p className="text-3xl font-mono font-bold text-[#6B8E23]">
                          {promo.code}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(promo.code)}
                        className="flex items-center space-x-2 px-6 py-3 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1d] transition-colors duration-200"
                      >
                        {copiedCode === promo.code ? (
                          <>
                            <Check size={20} />
                            <span>{language === 'ar' ? 'تم النسخ' : language === 'en' ? 'Copied' : 'Copié'}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={20} />
                            <span>{language === 'ar' ? 'نسخ' : language === 'en' ? 'Copy' : 'Copier'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  {promo.valid_until && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      <span>
                        {language === 'ar' ? 'صالح حتى' : language === 'en' ? 'Valid until' : 'Valable jusqu\'au'}{' '}
                        <span className="font-semibold">{formatDate(promo.valid_until)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How to Use Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'ar' ? 'كيفية الاستخدام' : 
             language === 'en' ? 'How to Use' : 
             'Comment utiliser vos codes promo'}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-[#6B8E23] text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <p className="text-gray-700">
                  {language === 'ar' ? 'أضف المنتجات إلى سلة التسوق' :
                   language === 'en' ? 'Add products to your cart' :
                   'Ajoutez des produits à votre panier'}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-[#6B8E23] text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <p className="text-gray-700">
                  {language === 'ar' ? 'انتقل إلى صفحة الدفع' :
                   language === 'en' ? 'Go to checkout page' :
                   'Rendez-vous sur la page de paiement'}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-[#6B8E23] text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <p className="text-gray-700">
                  {language === 'ar' ? 'أدخل رمز الترويج واستمتع بالخصم' :
                   language === 'en' ? 'Enter the promo code and enjoy your discount' :
                   'Entrez le code promo et profitez de votre réduction'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
