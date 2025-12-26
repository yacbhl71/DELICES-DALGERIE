import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Info } from 'lucide-react';
import { useLanguage } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminContactInfo() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Informations de contact sauvegardées !');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, lang, value) => {
    if (lang) {
      setSettings(prev => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'معلومات الاتصال' : language === 'en' ? 'Contact Information' : 'Informations de Contact'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'إدارة معلومات الاتصال المعروضة على موقعك' : 
             language === 'en' ? 'Manage contact information displayed on your site' : 
             'Gérez les informations de contact affichées sur votre site'}
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center">
          <Save size={20} className="mr-2" />
          {saving ? 'Sauvegarde...' : 'Enregistrer'}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Ces informations sont affichées sur :</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>La page Contact</li>
              <li>Le Footer du site</li>
              <li>Les emails automatiques</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emails */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Mail className="mr-2" size={24} />
          Emails
        </h2>

        <div className="space-y-6">
          <div>
            <label className="form-label">Email de contact principal *</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => handleInputChange('contact_email', null, e.target.value)}
              className="form-input"
              placeholder="contact@delices-algerie.com"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={settings.show_email_2}
                onChange={(e) => handleInputChange('show_email_2', null, e.target.checked)}
                className="mr-2"
              />
              <label className="form-label mb-0">Afficher un 2ème email</label>
            </div>
            {settings.show_email_2 && (
              <input
                type="email"
                value={settings.contact_email_2}
                onChange={(e) => handleInputChange('contact_email_2', null, e.target.value)}
                className="form-input"
                placeholder="Email 2"
              />
            )}
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={settings.show_email_3}
                onChange={(e) => handleInputChange('show_email_3', null, e.target.checked)}
                className="mr-2"
              />
              <label className="form-label mb-0">Afficher un 3ème email</label>
            </div>
            {settings.show_email_3 && (
              <input
                type="email"
                value={settings.contact_email_3}
                onChange={(e) => handleInputChange('contact_email_3', null, e.target.value)}
                className="form-input"
                placeholder="Email 3"
              />
            )}
          </div>

          <div>
            <label className="form-label">Email de support</label>
            <input
              type="email"
              value={settings.support_email}
              onChange={(e) => handleInputChange('support_email', null, e.target.value)}
              className="form-input"
              placeholder="support@delices-algerie.com"
            />
          </div>
        </div>
      </div>

      {/* Téléphones */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Phone className="mr-2" size={24} />
          Téléphones
        </h2>

        <div className="space-y-6">
          <div>
            <label className="form-label">Téléphone principal *</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleInputChange('phone', null, e.target.value)}
              className="form-input"
              placeholder="+33 1 23 45 67 89"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={settings.show_phone_2}
                onChange={(e) => handleInputChange('show_phone_2', null, e.target.checked)}
                className="mr-2"
              />
              <label className="form-label mb-0">Afficher un 2ème téléphone</label>
            </div>
            {settings.show_phone_2 && (
              <input
                type="tel"
                value={settings.phone_2}
                onChange={(e) => handleInputChange('phone_2', null, e.target.value)}
                className="form-input"
                placeholder="Téléphone 2"
              />
            )}
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={settings.show_phone_3}
                onChange={(e) => handleInputChange('show_phone_3', null, e.target.checked)}
                className="mr-2"
              />
              <label className="form-label mb-0">Afficher un 3ème téléphone</label>
            </div>
            {settings.show_phone_3 && (
              <input
                type="tel"
                value={settings.phone_3}
                onChange={(e) => handleInputChange('phone_3', null, e.target.value)}
                className="form-input"
                placeholder="Téléphone 3"
              />
            )}
          </div>
        </div>
      </div>

      {/* Adresses */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <MapPin className="mr-2" size={24} />
          Adresses
        </h2>

        {/* Address 1 */}
        <div className="mb-6">
          <label className="form-label mb-3">Adresse principale (multilingue) *</label>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang}>
                <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}</label>
                <textarea
                  value={settings.address[lang]}
                  onChange={(e) => handleInputChange('address', lang, e.target.value)}
                  className="form-input min-h-20"
                  placeholder={lang === 'fr' ? '123 Rue de Paris, 75001 Paris, France' : 'Address'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address 2 */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={settings.show_address_2}
              onChange={(e) => handleInputChange('show_address_2', null, e.target.checked)}
              className="mr-2"
            />
            <label className="form-label mb-0">Afficher une 2ème adresse</label>
          </div>
          {settings.show_address_2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
              {['fr', 'ar', 'en'].map(lang => (
                <div key={lang}>
                  <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}</label>
                  <textarea
                    value={settings.address_2[lang]}
                    onChange={(e) => handleInputChange('address_2', lang, e.target.value)}
                    className="form-input min-h-20"
                    placeholder="Adresse 2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Address 3 */}
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={settings.show_address_3}
              onChange={(e) => handleInputChange('show_address_3', null, e.target.checked)}
              className="mr-2"
            />
            <label className="form-label mb-0">Afficher une 3ème adresse</label>
          </div>
          {settings.show_address_3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
              {['fr', 'ar', 'en'].map(lang => (
                <div key={lang}>
                  <label className="text-xs text-gray-500 mb-1 block">{lang.toUpperCase()}</label>
                  <textarea
                    value={settings.address_3[lang]}
                    onChange={(e) => handleInputChange('address_3', lang, e.target.value)}
                    className="form-input min-h-20"
                    placeholder="Adresse 3"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center px-8 py-3">
          <Save size={20} className="mr-2" />
          {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
