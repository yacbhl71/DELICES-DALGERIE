import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../App';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function TestimonialForm({ onSuccess }) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const translations = {
    fr: {
      title: 'Partagez votre expérience',
      subtitle: 'Votre avis nous aide à améliorer nos services',
      name: 'Votre nom',
      email: 'Votre email',
      rating: 'Note',
      comment: 'Votre témoignage',
      commentPlaceholder: 'Partagez votre expérience avec nos produits...',
      submit: 'Envoyer mon témoignage',
      submitting: 'Envoi en cours...',
      successTitle: 'Merci pour votre témoignage !',
      successMessage: 'Votre avis a été soumis et sera publié après modération.',
      required: 'Ce champ est requis',
      invalidEmail: 'Email invalide'
    },
    en: {
      title: 'Share Your Experience',
      subtitle: 'Your feedback helps us improve our services',
      name: 'Your name',
      email: 'Your email',
      rating: 'Rating',
      comment: 'Your testimonial',
      commentPlaceholder: 'Share your experience with our products...',
      submit: 'Submit Testimonial',
      submitting: 'Submitting...',
      successTitle: 'Thank you for your testimonial!',
      successMessage: 'Your review has been submitted and will be published after moderation.',
      required: 'This field is required',
      invalidEmail: 'Invalid email'
    },
    ar: {
      title: 'شارك تجربتك',
      subtitle: 'رأيك يساعدنا على تحسين خدماتنا',
      name: 'اسمك',
      email: 'بريدك الإلكتروني',
      rating: 'التقييم',
      comment: 'شهادتك',
      commentPlaceholder: 'شارك تجربتك مع منتجاتنا...',
      submit: 'إرسال الشهادة',
      submitting: 'جاري الإرسال...',
      successTitle: 'شكراً لشهادتك!',
      successMessage: 'تم إرسال مراجعتك وسيتم نشرها بعد المراجعة.',
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'بريد إلكتروني غير صالح'
    }
  };

  const t = translations[language] || translations.fr;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/testimonials`, formData);
      
      toast({
        title: t.successTitle,
        description: t.successMessage,
      });

      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          customer_name: '',
          customer_email: '',
          rating: 5,
          comment: ''
        });
        setSubmitted(false);
        if (onSuccess) onSuccess();
      }, 3000);

    } catch (error) {
      toast({
        title: language === 'ar' ? 'خطأ' : language === 'en' ? 'Error' : 'Erreur',
        description: error.response?.data?.detail || 
                    (language === 'ar' ? 'فشل إرسال الشهادة' : 
                     language === 'en' ? 'Failed to submit testimonial' : 
                     'Échec de l\'envoi du témoignage'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.successTitle}</h3>
        <p className="text-gray-600">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.name} *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.email} *
            </label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.rating} *
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              </button>
            ))}
            <span className="ml-4 text-lg font-semibold text-gray-700">
              {formData.rating}/5
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.comment} *
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows="5"
            placeholder={t.commentPlaceholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6B8E23] text-white py-4 rounded-lg font-semibold hover:bg-[#5a7a1d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{t.submitting}</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>{t.submit}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
