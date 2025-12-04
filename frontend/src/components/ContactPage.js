import React, { useState } from 'react';
import { useLanguage } from '../App';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Submit to actual API
      await axios.post(`${API}/contact`, {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Demande de contact',
        message: formData.message
      });
      
      setSubmitted(true);
      setLoading(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 3000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'اتصل بنا' : language === 'en' ? 'Contact Us' : 'Contactez-nous'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'ar' ?
              'نحن هنا للإجابة على جميع أسئلتك حول منتجاتنا' :
              language === 'en' ?
              'We\'re here to answer all your questions about our products' :
              'Nous sommes là pour répondre à toutes vos questions sur nos produits'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'أرسل لنا رسالة' : language === 'en' ? 'Send us a message' : 'Envoyez-nous un message'}
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="text-green-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'شكراً لك!' : language === 'en' ? 'Thank you!' : 'Merci !'}
                </h3>
                <p className="text-gray-600 text-center">
                  {language === 'ar' ?
                    'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً' :
                    language === 'en' ?
                    'Your message has been sent successfully. We will contact you soon' :
                    'Votre message a été envoyé avec succès. Nous vous contacterons bientôt'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم' : language === 'en' ? 'Name' : 'Nom'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent transition-all"
                    placeholder={language === 'ar' ? 'اسمك الكامل' : language === 'en' ? 'Your full name' : 'Votre nom complet'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'البريد الإلكتروني' : language === 'en' ? 'Email' : 'Email'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent transition-all"
                    placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الهاتف' : language === 'en' ? 'Phone' : 'Téléphone'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent transition-all"
                    placeholder={language === 'ar' ? '+213...' : '+213...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الموضوع' : language === 'en' ? 'Subject' : 'Sujet'}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent transition-all"
                  >
                    <option value="">
                      {language === 'ar' ? 'اختر موضوعاً' : language === 'en' ? 'Select a subject' : 'Sélectionnez un sujet'}
                    </option>
                    <option value="order">
                      {language === 'ar' ? 'طلب منتج' : language === 'en' ? 'Product Order' : 'Commande de produit'}
                    </option>
                    <option value="info">
                      {language === 'ar' ? 'معلومات عن المنتجات' : language === 'en' ? 'Product Information' : 'Information sur les produits'}
                    </option>
                    <option value="wholesale">
                      {language === 'ar' ? 'طلب بالجملة' : language === 'en' ? 'Wholesale Order' : 'Commande en gros'}
                    </option>
                    <option value="other">
                      {language === 'ar' ? 'أخرى' : language === 'en' ? 'Other' : 'Autre'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الرسالة' : language === 'en' ? 'Message' : 'Message'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent transition-all resize-none"
                    placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : language === 'en' ? 'Write your message here...' : 'Écrivez votre message ici...'}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-olive to-green-700 text-white font-bold py-4 rounded-lg hover:from-green-700 hover:to-olive transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      {language === 'ar' ? 'إرسال الرسالة' : language === 'en' ? 'Send Message' : 'Envoyer le message'}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-olive to-green-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {language === 'ar' ? 'البريد الإلكتروني' : language === 'en' ? 'Email' : 'Email'}
                    </h3>
                    <p className="text-gray-600">contact@delices-algerie.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {language === 'ar' ? 'الهاتف' : language === 'en' ? 'Phone' : 'Téléphone'}
                    </h3>
                    <p className="text-gray-600">+213 XX XX XX XX</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-brown to-amber-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {language === 'ar' ? 'العنوان' : language === 'en' ? 'Address' : 'Adresse'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'ar' ? 'الجزائر' : language === 'en' ? 'Algeria' : 'Algérie'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-gradient-to-br from-olive via-green-700 to-brown text-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                {language === 'ar' ? 'ساعات العمل' : language === 'en' ? 'Opening Hours' : 'Horaires d\'ouverture'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'الأحد - الخميس' : language === 'en' ? 'Sunday - Thursday' : 'Dimanche - Jeudi'}</span>
                  <span className="font-bold">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'الجمعة' : language === 'en' ? 'Friday' : 'Vendredi'}</span>
                  <span className="font-bold">{language === 'ar' ? 'مغلق' : language === 'en' ? 'Closed' : 'Fermé'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'السبت' : language === 'en' ? 'Saturday' : 'Samedi'}</span>
                  <span className="font-bold">10:00 - 16:00</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-amber-50 border-2 border-gold rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'وقت الاستجابة' : language === 'en' ? 'Response Time' : 'Temps de réponse'}
              </h3>
              <p className="text-gray-700">
                {language === 'ar' ?
                  'نعد بالرد على جميع الاستفسارات خلال 24 ساعة' :
                  language === 'en' ?
                  'We promise to respond to all inquiries within 24 hours' :
                  'Nous promettons de répondre à toutes les demandes dans les 24 heures'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
