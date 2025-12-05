import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function NewsletterSection() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const translations = {
    fr: {
      title: 'Restez informé',
      subtitle: 'Abonnez-vous à notre newsletter pour recevoir nos offres exclusives',
      placeholder: 'Votre adresse email',
      button: 'S\'abonner',
      success: 'Merci ! Vous êtes maintenant abonné.',
      alreadySubscribed: 'Cet email est déjà abonné',
      error: 'Une erreur est survenue'
    },
    en: {
      title: 'Stay informed',
      subtitle: 'Subscribe to our newsletter to receive our exclusive offers',
      placeholder: 'Your email address',
      button: 'Subscribe',
      success: 'Thank you! You are now subscribed.',
      alreadySubscribed: 'This email is already subscribed',
      error: 'An error occurred'
    },
    ar: {
      title: 'ابق على اطلاع',
      subtitle: 'اشترك في نشرتنا الإخبارية لتلقي عروضنا الحصرية',
      placeholder: 'عنوان بريدك الإلكتروني',
      button: 'اشترك',
      success: 'شكراً! أنت الآن مشترك.',
      alreadySubscribed: 'هذا البريد الإلكتروني مشترك بالفعل',
      error: 'حدث خطأ'
    }
  };

  const t = translations[language] || translations.fr;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/newsletter/subscribe`, { email });
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(t.alreadySubscribed);
      } else {
        setError(t.error);
      }
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#6B8E23] to-[#5a7a1d] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="mx-auto text-white mb-4" size={48} />
          <h2 className="text-3xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-white text-lg mb-8 opacity-90">{t.subtitle}</p>

          {success ? (
            <div className="flex items-center justify-center space-x-2 bg-white rounded-lg py-4 px-6">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-green-600 font-semibold">{t.success}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                required
                className="flex-1 w-full sm:w-auto px-6 py-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white text-[#6B8E23] font-semibold rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6B8E23]"></div>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{t.button}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {error && (
            <p className="mt-4 text-red-200 font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
