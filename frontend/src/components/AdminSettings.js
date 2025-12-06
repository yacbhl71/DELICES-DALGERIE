import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { Save, Settings as SettingsIcon, Globe, Clock, DollarSign, Mail } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettings = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_title: { fr: '', ar: '', en: '' },
    site_description: { fr: '', ar: '', en: '' },
    contact_email: '',
    support_email: '',
    contact_email_2: '',
    contact_email_3: '',
    phone: '',
    phone_2: '',
    phone_3: '',
    address: { fr: '', ar: '', en: '' },
    address_2: { fr: '', ar: '', en: '' },
    address_3: { fr: '', ar: '', en: '' },
    show_phone_2: false,
    show_phone_3: false,
    show_email_2: false,
    show_email_3: false,
    show_address_2: false,
    show_address_3: false,
    timezone: 'Europe/Paris',
    currency: 'EUR',
    currency_symbol: '€',
    date_format: 'DD/MM/YYYY',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: ''
  });

  const timezones = [
    'Europe/Paris',
    'Africa/Algiers',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Dubai',
    'UTC'
  ];

  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'DZD', symbol: 'دج', name: 'Algerian Dinar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  const dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD'
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/settings`);
      if (response.data) {
        setSettings({ ...settings, ...response.data });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/settings`, settings);
      alert(language === 'ar' ? 'تم الحفظ بنجاح!' : language === 'en' ? 'Saved successfully!' : 'Sauvegarde réussie!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(language === 'ar' ? 'خطأ في الحفظ' : language === 'en' ? 'Save error' : 'Erreur de sauvegarde');
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'الإعدادات العامة' : language === 'en' ? 'General Settings' : 'Paramètres Généraux'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'تكوين إعدادات الموقع الأساسية' : language === 'en' ? 'Configure basic site settings' : 'Configurez les paramètres de base du site'}
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center">
          <Save size={20} className="mr-2" />
          {saving ? (language === 'ar' ? 'جاري الحفظ...' : language === 'en' ? 'Saving...' : 'Sauvegarde...') :
                   (language === 'ar' ? 'حفظ' : language === 'en' ? 'Save' : 'Enregistrer')}
        </button>
      </div>

      {/* Site Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Globe className="mr-2" size={24} />
          {language === 'ar' ? 'معلومات الموقع' : language === 'en' ? 'Site Information' : 'Informations du site'}
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang}>
                <label className="form-label">
                  {language === 'ar' ? 'عنوان الموقع' : language === 'en' ? 'Site Title' : 'Titre du site'} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={settings.site_title[lang]}
                  onChange={(e) => handleInputChange('site_title', lang, e.target.value)}
                  className="form-input"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang}>
                <label className="form-label">
                  {language === 'ar' ? 'وصف الموقع' : language === 'en' ? 'Site Description' : 'Description'} ({lang.toUpperCase()})
                </label>
                <textarea
                  value={settings.site_description[lang]}
                  onChange={(e) => handleInputChange('site_description', lang, e.target.value)}
                  className="form-input min-h-24"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Mail className="mr-2" size={24} />
          {language === 'ar' ? 'معلومات الاتصال' : language === 'en' ? 'Contact Information' : 'Informations de contact'}
        </h2>

        <div className="space-y-6">
          {/* Emails */}
          <div>
            <label className="form-label">
              {language === 'ar' ? 'البريد الإلكتروني للاتصال' : language === 'en' ? 'Contact Email 1' : 'Email de contact 1'}
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => handleInputChange('contact_email', null, e.target.value)}
              className="form-input"
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
              <label className="form-label mb-0">
                {language === 'ar' ? 'إظهار البريد الإلكتروني 2' : language === 'en' ? 'Show Email 2' : 'Afficher Email 2'}
              </label>
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
              <label className="form-label mb-0">
                {language === 'ar' ? 'إظهار البريد الإلكتروني 3' : language === 'en' ? 'Show Email 3' : 'Afficher Email 3'}
              </label>
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
            <label className="form-label">
              {language === 'ar' ? 'بريد الدعم' : language === 'en' ? 'Support Email' : 'Email de support'}
            </label>
            <input
              type="email"
              value={settings.support_email}
              onChange={(e) => handleInputChange('support_email', null, e.target.value)}
              className="form-input"
            />
          </div>

          {/* Phones */}
          <div>
            <label className="form-label">
              {language === 'ar' ? 'الهاتف 1' : language === 'en' ? 'Phone 1' : 'Téléphone 1'}
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleInputChange('phone', null, e.target.value)}
              className="form-input"
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
              <label className="form-label mb-0">
                {language === 'ar' ? 'إظهار الهاتف 2' : language === 'en' ? 'Show Phone 2' : 'Afficher Téléphone 2'}
              </label>
            </div>
            {settings.show_phone_2 && (
              <input
                type="tel"
                value={settings.phone_2}
                onChange={(e) => handleInputChange('phone_2', null, e.target.value)}
                className="form-input"
                placeholder={language === 'ar' ? 'الهاتف 2' : language === 'en' ? 'Phone 2' : 'Téléphone 2'}
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
              <label className="form-label mb-0">
                {language === 'ar' ? 'إظهار الهاتف 3' : language === 'en' ? 'Show Phone 3' : 'Afficher Téléphone 3'}
              </label>
            </div>
            {settings.show_phone_3 && (
              <input
                type="tel"
                value={settings.phone_3}
                onChange={(e) => handleInputChange('phone_3', null, e.target.value)}
                className="form-input"
                placeholder={language === 'ar' ? 'الهاتف 3' : language === 'en' ? 'Phone 3' : 'Téléphone 3'}
              />
            )}
          </div>
        </div>

        <div className="space-y-6 mt-6">
          {/* Address 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang}>
                <label className="form-label">
                  {language === 'ar' ? 'العنوان 1' : language === 'en' ? 'Address 1' : 'Adresse 1'} ({lang.toUpperCase()})
                </label>
                <textarea
                  value={settings.address[lang]}
                  onChange={(e) => handleInputChange('address', lang, e.target.value)}
                  className="form-input min-h-20"
                />
              </div>
            ))}
          </div>

          {/* Address 2 */}
          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={settings.show_address_2}
                onChange={(e) => handleInputChange('show_address_2', null, e.target.checked)}
                className="mr-2"
              />
              <label className="form-label mb-0">
                {language === 'ar' ? 'إظهار العنوان 2' : language === 'en' ? 'Show Address 2' : 'Afficher Adresse 2'}
              </label>
            </div>
            {settings.show_address_2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['fr', 'ar', 'en'].map(lang => (
                  <div key={lang}>
                    <label className="form-label">
                      {language === 'ar' ? 'العنوان 2' : language === 'en' ? 'Address 2' : 'Adresse 2'} ({lang.toUpperCase()})
                    </label>
                    <textarea
                      value={settings.address_2[lang]}
                      onChange={(e) => handleInputChange('address_2', lang, e.target.value)}
                      className="form-input min-h-20"
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
              <label className="form-label mb-0">
                {language === 'ar' ? 'إظهار العنوان 3' : language === 'en' ? 'Show Address 3' : 'Afficher Adresse 3'}
              </label>
            </div>
            {settings.show_address_3 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['fr', 'ar', 'en'].map(lang => (
                  <div key={lang}>
                    <label className="form-label">
                      {language === 'ar' ? 'العنوان 3' : language === 'en' ? 'Address 3' : 'Adresse 3'} ({lang.toUpperCase()})
                    </label>
                    <textarea
                      value={settings.address_3[lang]}
                      onChange={(e) => handleInputChange('address_3', lang, e.target.value)}
                      className="form-input min-h-20"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Clock className="mr-2" size={24} />
          {language === 'ar' ? 'الإعدادات الإقليمية' : language === 'en' ? 'Regional Settings' : 'Paramètres régionaux'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="form-label">
              {language === 'ar' ? 'المنطقة الزمنية' : language === 'en' ? 'Timezone' : 'Fuseau horaire'}
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleInputChange('timezone', null, e.target.value)}
              className="form-input"
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">
              {language === 'ar' ? 'العملة' : language === 'en' ? 'Currency' : 'Devise'}
            </label>
            <select
              value={settings.currency}
              onChange={(e) => {
                const currency = currencies.find(c => c.code === e.target.value);
                handleInputChange('currency', null, e.target.value);
                handleInputChange('currency_symbol', null, currency?.symbol || '');
              }}
              className="form-input"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>{curr.code} - {curr.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">
              {language === 'ar' ? 'رمز العملة' : language === 'en' ? 'Currency Symbol' : 'Symbole de devise'}
            </label>
            <input
              type="text"
              value={settings.currency_symbol}
              onChange={(e) => handleInputChange('currency_symbol', null, e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">
              {language === 'ar' ? 'تنسيق التاريخ' : language === 'en' ? 'Date Format' : 'Format de date'}
            </label>
            <select
              value={settings.date_format}
              onChange={(e) => handleInputChange('date_format', null, e.target.value)}
              className="form-input"
            >
              {dateFormats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {language === 'ar' ? 'وسائل التواصل الاجتماعي' : language === 'en' ? 'Social Media' : 'Réseaux sociaux'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Facebook URL</label>
            <input
              type="url"
              value={settings.facebook_url}
              onChange={(e) => handleInputChange('facebook_url', null, e.target.value)}
              className="form-input"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label className="form-label">Instagram URL</label>
            <input
              type="url"
              value={settings.instagram_url}
              onChange={(e) => handleInputChange('instagram_url', null, e.target.value)}
              className="form-input"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="form-label">Twitter URL</label>
            <input
              type="url"
              value={settings.twitter_url}
              onChange={(e) => handleInputChange('twitter_url', null, e.target.value)}
              className="form-input"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label className="form-label">LinkedIn URL</label>
            <input
              type="url"
              value={settings.linkedin_url}
              onChange={(e) => handleInputChange('linkedin_url', null, e.target.value)}
              className="form-input"
              placeholder="https://linkedin.com/..."
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center px-8 py-3">
          <Save size={20} className="mr-2" />
          {saving ? (language === 'ar' ? 'جاري الحفظ...' : language === 'en' ? 'Saving...' : 'Sauvegarde...') :
                   (language === 'ar' ? 'حفظ التغييرات' : language === 'en' ? 'Save Changes' : 'Enregistrer les modifications')}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;