import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { 
  Save,
  Settings as SettingsIcon,
  Globe,
  Palette,
  Bell,
  Shield,
  Database,
  Search,
  Image as ImageIcon,
  Mail,
  Clock,
  DollarSign,
  Eye,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import ImageUpload from './ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettings = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Simple toast replacement
  const showToast = (title, description, variant = 'default') => {
    if (variant === 'destructive') {
      alert(`❌ ${title}\n${description}`);
    } else {
      alert(`✅ ${title}\n${description}`);
    }
  };

  const [settings, setSettings] = useState({
    general: {
      site_name: { fr: 'Soumam Heritage', ar: 'تراث سومام', en: 'Soumam Heritage' },
      site_description: { 
        fr: 'Découvrez les saveurs authentiques de l\'Algérie', 
        ar: 'اكتشف النكهات الأصيلة للجزائر',
        en: 'Discover the authentic flavors of Algeria'
      },
      logo_url: '',
      favicon_url: '',
      contact_email: 'contact@soumam-heritage.com',
      contact_phone: '+213 XX XX XX XX'
    },
    configuration: {
      default_language: 'fr',
      default_currency: 'EUR',
      timezone: 'Europe/Paris',
      items_per_page: 12,
      enable_registration: true,
      enable_comments: false
    },
    appearance: {
      primary_color: '#F97316',
      secondary_color: '#FFA500',
      accent_color: '#8B4513',
      theme_mode: 'light',
      custom_css: ''
    },
    seo: {
      meta_title: { fr: 'Soumam Heritage', ar: 'تراث سومام', en: 'Soumam Heritage' },
      meta_description: { 
        fr: 'Site e-commerce dédié à la cuisine algérienne et aux produits du terroir kabyle',
        ar: 'موقع تجارة إلكترونية مخصص للمطبخ الجزائري ومنتجات منطقة القبائل',
        en: 'E-commerce site dedicated to Algerian cuisine and Kabyle local products'
      },
      meta_keywords: { 
        fr: 'cuisine algérienne, recettes, épices, Kabylie, Soumam',
        ar: 'المطبخ الجزائري، وصفات، بهارات، القبائل، سومام',
        en: 'Algerian cuisine, recipes, spices, Kabylia, Soumam'
      },
      og_image: '',
      enable_sitemap: true,
      enable_robots: true
    },
    notifications: {
      enable_email_notifications: true,
      admin_email: 'admin@soumam-heritage.com',
      smtp_host: '',
      smtp_port: 587,
      smtp_user: '',
      smtp_password: '',
      new_user_notification: true,
      new_order_notification: true,
      low_stock_notification: true
    },
    security: {
      enable_2fa: false,
      session_timeout: 30,
      max_login_attempts: 5,
      password_min_length: 8,
      require_email_verification: false,
      enable_captcha: false
    },
    media: {
      max_upload_size: 10,
      allowed_image_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      image_quality: 85,
      enable_image_optimization: true,
      thumbnail_size: 300
    },
    backup: {
      enable_auto_backup: false,
      backup_frequency: 'weekly',
      backup_time: '02:00',
      backup_retention_days: 30
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Settings will use default values
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/settings`,
        { [section]: settings[section] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast(
        language === 'ar' ? 'تم الحفظ' : language === 'en' ? 'Saved' : 'Enregistré',
        language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : language === 'en' ? 'Settings saved successfully' : 'Paramètres enregistrés avec succès'
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast(
        language === 'ar' ? 'خطأ' : language === 'en' ? 'Error' : 'Erreur',
        language === 'ar' ? 'فشل حفظ الإعدادات' : language === 'en' ? 'Failed to save settings' : 'Échec de l\'enregistrement',
        'destructive'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleMultiLangChange = (section, field, lang, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          [lang]: value
        }
      }
    }));
  };

  const tabs = [
    { id: 'general', icon: Globe, label: { fr: 'Général', ar: 'عام', en: 'General' } },
    { id: 'configuration', icon: SettingsIcon, label: { fr: 'Configuration', ar: 'التكوين', en: 'Configuration' } },
    { id: 'appearance', icon: Palette, label: { fr: 'Apparence', ar: 'المظهر', en: 'Appearance' } },
    { id: 'seo', icon: Search, label: { fr: 'SEO', ar: 'تحسين محركات البحث', en: 'SEO' } },
    { id: 'notifications', icon: Bell, label: { fr: 'Notifications', ar: 'الإشعارات', en: 'Notifications' } },
    { id: 'security', icon: Shield, label: { fr: 'Sécurité', ar: 'الأمان', en: 'Security' } },
    { id: 'media', icon: ImageIcon, label: { fr: 'Médias', ar: 'الوسائط', en: 'Media' } },
    { id: 'backup', icon: Database, label: { fr: 'Sauvegarde', ar: 'النسخ الاحتياطي', en: 'Backup' } }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="mr-3" size={32} />
          {language === 'ar' ? 'الإعدادات' : language === 'en' ? 'Settings' : 'Paramètres'}
        </h1>
        <p className="text-gray-600 mt-2">
          {language === 'ar' ? 
            'إدارة إعدادات الموقع والتكوين' : 
            language === 'en' ? 
            'Manage your site settings and configuration' : 
            'Gérer les paramètres et la configuration de votre site'}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-1 p-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-amber-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className="mr-2" />
                  {tab.label[language]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'الإعدادات العامة' : language === 'en' ? 'General Settings' : 'Paramètres Généraux'}
              </h2>

              {/* Site Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اسم الموقع (FR)' : language === 'en' ? 'Site Name (FR)' : 'Nom du site (FR)'}
                  </label>
                  <input
                    type="text"
                    value={settings.general.site_name.fr}
                    onChange={(e) => handleMultiLangChange('general', 'site_name', 'fr', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اسم الموقع (AR)' : language === 'en' ? 'Site Name (AR)' : 'Nom du site (AR)'}
                  </label>
                  <input
                    type="text"
                    value={settings.general.site_name.ar}
                    onChange={(e) => handleMultiLangChange('general', 'site_name', 'ar', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اسم الموقع (EN)' : language === 'en' ? 'Site Name (EN)' : 'Nom du site (EN)'}
                  </label>
                  <input
                    type="text"
                    value={settings.general.site_name.en}
                    onChange={(e) => handleMultiLangChange('general', 'site_name', 'en', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Site Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وصف الموقع (FR)' : language === 'en' ? 'Site Description (FR)' : 'Description (FR)'}
                  </label>
                  <textarea
                    value={settings.general.site_description.fr}
                    onChange={(e) => handleMultiLangChange('general', 'site_description', 'fr', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وصف الموقع (AR)' : language === 'en' ? 'Site Description (AR)' : 'Description (AR)'}
                  </label>
                  <textarea
                    value={settings.general.site_description.ar}
                    onChange={(e) => handleMultiLangChange('general', 'site_description', 'ar', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وصف الموقع (EN)' : language === 'en' ? 'Site Description (EN)' : 'Description (EN)'}
                  </label>
                  <textarea
                    value={settings.general.site_description.en}
                    onChange={(e) => handleMultiLangChange('general', 'site_description', 'en', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شعار الموقع' : language === 'en' ? 'Site Logo' : 'Logo du site'}
                </label>
                <input
                  type="text"
                  value={settings.general.logo_url}
                  onChange={(e) => handleInputChange('general', 'logo_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline mr-2" size={16} />
                    {language === 'ar' ? 'البريد الإلكتروني للاتصال' : language === 'en' ? 'Contact Email' : 'Email de contact'}
                  </label>
                  <input
                    type="email"
                    value={settings.general.contact_email}
                    onChange={(e) => handleInputChange('general', 'contact_email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الهاتف' : language === 'en' ? 'Contact Phone' : 'Téléphone de contact'}
                  </label>
                  <input
                    type="tel"
                    value={settings.general.contact_phone}
                    onChange={(e) => handleInputChange('general', 'contact_phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={() => saveSettings('general')}
                disabled={saving}
                className="btn-primary flex items-center px-6 py-3"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {language === 'ar' ? 'حفظ الإعدادات' : language === 'en' ? 'Save Settings' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* Configuration Settings */}
          {activeTab === 'configuration' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'التكوين' : language === 'en' ? 'Configuration' : 'Configuration'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="inline mr-2" size={16} />
                    {language === 'ar' ? 'اللغة الافتراضية' : language === 'en' ? 'Default Language' : 'Langue par défaut'}
                  </label>
                  <select
                    value={settings.configuration.default_language}
                    onChange={(e) => handleInputChange('configuration', 'default_language', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline mr-2" size={16} />
                    {language === 'ar' ? 'العملة الافتراضية' : language === 'en' ? 'Default Currency' : 'Devise par défaut'}
                  </label>
                  <select
                    value={settings.configuration.default_currency}
                    onChange={(e) => handleInputChange('configuration', 'default_currency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="EUR">Euro (EUR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="DZD">Dinar Algérien (DZD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline mr-2" size={16} />
                    {language === 'ar' ? 'المنطقة الزمنية' : language === 'en' ? 'Timezone' : 'Fuseau horaire'}
                  </label>
                  <select
                    value={settings.configuration.timezone}
                    onChange={(e) => handleInputChange('configuration', 'timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Africa/Algiers">Africa/Algiers</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'عناصر لكل صفحة' : language === 'en' ? 'Items per page' : 'Éléments par page'}
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="50"
                    value={settings.configuration.items_per_page}
                    onChange={(e) => handleInputChange('configuration', 'items_per_page', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.configuration.enable_registration}
                    onChange={(e) => handleInputChange('configuration', 'enable_registration', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل التسجيل' : language === 'en' ? 'Enable Registration' : 'Activer l\'inscription'}
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.configuration.enable_comments}
                    onChange={(e) => handleInputChange('configuration', 'enable_comments', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل التعليقات' : language === 'en' ? 'Enable Comments' : 'Activer les commentaires'}
                  </span>
                </label>
              </div>

              <button
                onClick={() => saveSettings('configuration')}
                disabled={saving}
                className="btn-primary flex items-center px-6 py-3"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {language === 'ar' ? 'حفظ التكوين' : language === 'en' ? 'Save Configuration' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'المظهر' : language === 'en' ? 'Appearance' : 'Apparence'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اللون الأساسي' : language === 'en' ? 'Primary Color' : 'Couleur principale'}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.appearance.primary_color}
                      onChange={(e) => handleInputChange('appearance', 'primary_color', e.target.value)}
                      className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.appearance.primary_color}
                      onChange={(e) => handleInputChange('appearance', 'primary_color', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="#F97316"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'اللون الثانوي' : language === 'en' ? 'Secondary Color' : 'Couleur secondaire'}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.appearance.secondary_color}
                      onChange={(e) => handleInputChange('appearance', 'secondary_color', e.target.value)}
                      className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.appearance.secondary_color}
                      onChange={(e) => handleInputChange('appearance', 'secondary_color', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'لون التمييز' : language === 'en' ? 'Accent Color' : 'Couleur d\'accent'}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.appearance.accent_color}
                      onChange={(e) => handleInputChange('appearance', 'accent_color', e.target.value)}
                      className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.appearance.accent_color}
                      onChange={(e) => handleInputChange('appearance', 'accent_color', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'وضع السمة' : language === 'en' ? 'Theme Mode' : 'Mode thème'}
                </label>
                <select
                  value={settings.appearance.theme_mode}
                  onChange={(e) => handleInputChange('appearance', 'theme_mode', e.target.value)}
                  className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="light">
                    {language === 'ar' ? 'فاتح' : language === 'en' ? 'Light' : 'Clair'}
                  </option>
                  <option value="dark">
                    {language === 'ar' ? 'داكن' : language === 'en' ? 'Dark' : 'Sombre'}
                  </option>
                  <option value="auto">
                    {language === 'ar' ? 'تلقائي' : language === 'en' ? 'Auto' : 'Auto'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'CSS مخصص' : language === 'en' ? 'Custom CSS' : 'CSS personnalisé'}
                </label>
                <textarea
                  value={settings.appearance.custom_css}
                  onChange={(e) => handleInputChange('appearance', 'custom_css', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                  placeholder="/* Your custom CSS here */"
                />
              </div>

              <button
                onClick={() => saveSettings('appearance')}
                disabled={saving}
                className="btn-primary flex items-center px-6 py-3"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {language === 'ar' ? 'حفظ المظهر' : language === 'en' ? 'Save Appearance' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'تحسين محركات البحث' : language === 'en' ? 'SEO Settings' : 'Paramètres SEO'}
              </h2>

              {/* Meta Title */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'عنوان Meta (FR)' : language === 'en' ? 'Meta Title (FR)' : 'Titre Meta (FR)'}
                  </label>
                  <input
                    type="text"
                    value={settings.seo.meta_title.fr}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_title', 'fr', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    maxLength="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.seo.meta_title.fr.length}/60</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'عنوان Meta (AR)' : language === 'en' ? 'Meta Title (AR)' : 'Titre Meta (AR)'}
                  </label>
                  <input
                    type="text"
                    value={settings.seo.meta_title.ar}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_title', 'ar', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                    maxLength="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.seo.meta_title.ar.length}/60</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'عنوان Meta (EN)' : language === 'en' ? 'Meta Title (EN)' : 'Titre Meta (EN)'}
                  </label>
                  <input
                    type="text"
                    value={settings.seo.meta_title.en}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_title', 'en', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    maxLength="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.seo.meta_title.en.length}/60</p>
                </div>
              </div>

              {/* Meta Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وصف Meta (FR)' : language === 'en' ? 'Meta Description (FR)' : 'Description Meta (FR)'}
                  </label>
                  <textarea
                    value={settings.seo.meta_description.fr}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_description', 'fr', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.seo.meta_description.fr.length}/160</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وصف Meta (AR)' : language === 'en' ? 'Meta Description (AR)' : 'Description Meta (AR)'}
                  </label>
                  <textarea
                    value={settings.seo.meta_description.ar}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_description', 'ar', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.seo.meta_description.ar.length}/160</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وصف Meta (EN)' : language === 'en' ? 'Meta Description (EN)' : 'Description Meta (EN)'}
                  </label>
                  <textarea
                    value={settings.seo.meta_description.en}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_description', 'en', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 mt-1">{settings.seo.meta_description.en.length}/160</p>
                </div>
              </div>

              {/* Meta Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الكلمات المفتاحية (FR)' : language === 'en' ? 'Keywords (FR)' : 'Mots-clés (FR)'}
                  </label>
                  <input
                    type="text"
                    value={settings.seo.meta_keywords.fr}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_keywords', 'fr', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="mot1, mot2, mot3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الكلمات المفتاحية (AR)' : language === 'en' ? 'Keywords (AR)' : 'Mots-clés (AR)'}
                  </label>
                  <input
                    type="text"
                    value={settings.seo.meta_keywords.ar}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_keywords', 'ar', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الكلمات المفتاحية (EN)' : language === 'en' ? 'Keywords (EN)' : 'Mots-clés (EN)'}
                  </label>
                  <input
                    type="text"
                    value={settings.seo.meta_keywords.en}
                    onChange={(e) => handleMultiLangChange('seo', 'meta_keywords', 'en', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'صورة Open Graph' : language === 'en' ? 'Open Graph Image' : 'Image Open Graph'}
                </label>
                <input
                  type="text"
                  value={settings.seo.og_image}
                  onChange={(e) => handleInputChange('seo', 'og_image', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://example.com/og-image.png"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {language === 'ar' ? 'الحجم الموصى به: 1200x630 بكسل' : language === 'en' ? 'Recommended size: 1200x630 pixels' : 'Taille recommandée : 1200x630 pixels'}
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.seo.enable_sitemap}
                    onChange={(e) => handleInputChange('seo', 'enable_sitemap', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل خريطة الموقع' : language === 'en' ? 'Enable Sitemap' : 'Activer le Sitemap'}
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.seo.enable_robots}
                    onChange={(e) => handleInputChange('seo', 'enable_robots', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل Robots.txt' : language === 'en' ? 'Enable Robots.txt' : 'Activer Robots.txt'}
                  </span>
                </label>
              </div>

              <button
                onClick={() => saveSettings('seo')}
                disabled={saving}
                className="btn-primary flex items-center px-6 py-3"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {language === 'ar' ? 'حفظ SEO' : language === 'en' ? 'Save SEO' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'الإشعارات' : language === 'en' ? 'Notifications' : 'Notifications'}
              </h2>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.enable_email_notifications}
                    onChange={(e) => handleInputChange('notifications', 'enable_email_notifications', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل إشعارات البريد الإلكتروني' : language === 'en' ? 'Enable Email Notifications' : 'Activer les notifications par email'}
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'بريد المسؤول' : language === 'en' ? 'Admin Email' : 'Email administrateur'}
                </label>
                <input
                  type="email"
                  value={settings.notifications.admin_email}
                  onChange={(e) => handleInputChange('notifications', 'admin_email', e.target.value)}
                  className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ar' ? 'إعدادات SMTP' : language === 'en' ? 'SMTP Settings' : 'Paramètres SMTP'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'مضيف SMTP' : language === 'en' ? 'SMTP Host' : 'Hôte SMTP'}
                    </label>
                    <input
                      type="text"
                      value={settings.notifications.smtp_host}
                      onChange={(e) => handleInputChange('notifications', 'smtp_host', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="smtp.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'منفذ SMTP' : language === 'en' ? 'SMTP Port' : 'Port SMTP'}
                    </label>
                    <input
                      type="number"
                      value={settings.notifications.smtp_port}
                      onChange={(e) => handleInputChange('notifications', 'smtp_port', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'مستخدم SMTP' : language === 'en' ? 'SMTP User' : 'Utilisateur SMTP'}
                    </label>
                    <input
                      type="text"
                      value={settings.notifications.smtp_user}
                      onChange={(e) => handleInputChange('notifications', 'smtp_user', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'ar' ? 'كلمة مرور SMTP' : language === 'en' ? 'SMTP Password' : 'Mot de passe SMTP'}
                    </label>
                    <input
                      type="password"
                      value={settings.notifications.smtp_password}
                      onChange={(e) => handleInputChange('notifications', 'smtp_password', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ar' ? 'أنواع الإشعارات' : language === 'en' ? 'Notification Types' : 'Types de notifications'}
                </h3>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.notifications.new_user_notification}
                      onChange={(e) => handleInputChange('notifications', 'new_user_notification', e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-gray-700">
                      {language === 'ar' ? 'إشعار مستخدم جديد' : language === 'en' ? 'New User Notification' : 'Notification nouvel utilisateur'}
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.notifications.new_order_notification}
                      onChange={(e) => handleInputChange('notifications', 'new_order_notification', e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-gray-700">
                      {language === 'ar' ? 'إشعار طلب جديد' : language === 'en' ? 'New Order Notification' : 'Notification nouvelle commande'}
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.notifications.low_stock_notification}
                      onChange={(e) => handleInputChange('notifications', 'low_stock_notification', e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-gray-700">
                      {language === 'ar' ? 'إشعار انخفاض المخزون' : language === 'en' ? 'Low Stock Notification' : 'Notification stock bas'}
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => saveSettings('notifications')}
                disabled={saving}
                className="btn-primary flex items-center px-6 py-3"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {language === 'ar' ? 'حفظ الإشعارات' : language === 'en' ? 'Save Notifications' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'الأمان' : language === 'en' ? 'Security' : 'Sécurité'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'مهلة الجلسة (دقائق)' : language === 'en' ? 'Session Timeout (minutes)' : 'Délai de session (minutes)'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.security.session_timeout}
                    onChange={(e) => handleInputChange('security', 'session_timeout', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الحد الأقصى لمحاولات تسجيل الدخول' : language === 'en' ? 'Max Login Attempts' : 'Tentatives de connexion max'}
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.max_login_attempts}
                    onChange={(e) => handleInputChange('security', 'max_login_attempts', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الحد الأدنى لطول كلمة المرور' : language === 'en' ? 'Min Password Length' : 'Longueur min mot de passe'}
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="32"
                    value={settings.security.password_min_length}
                    onChange={(e) => handleInputChange('security', 'password_min_length', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.enable_2fa}
                    onChange={(e) => handleInputChange('security', 'enable_2fa', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل المصادقة الثنائية' : language === 'en' ? 'Enable Two-Factor Authentication' : 'Activer l\'authentification à deux facteurs'}
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.require_email_verification}
                    onChange={(e) => handleInputChange('security', 'require_email_verification', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'طلب التحقق من البريد الإلكتروني' : language === 'en' ? 'Require Email Verification' : 'Exiger la vérification email'}
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.enable_captcha}
                    onChange={(e) => handleInputChange('security', 'enable_captcha', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل CAPTCHA' : language === 'en' ? 'Enable CAPTCHA' : 'Activer CAPTCHA'}
                  </span>
                </label>
              </div>

              <button
                onClick={() => saveSettings('security')}
                disabled={saving}
                className="btn-primary flex items-center px-6 py-3"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {language === 'ar' ? 'حفظ الأمان' : language === 'en' ? 'Save Security' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* Media Settings */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'إعدادات الوسائط' : language === 'en' ? 'Media Settings' : 'Paramètres Médias'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الحد الأقصى لحجم التحميل (MB)' : language === 'en' ? 'Max Upload Size (MB)' : 'Taille max upload (MB)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.media.max_upload_size}
                    onChange={(e) => handleInputChange('media', 'max_upload_size', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'جودة الصورة (%)' : language === 'en' ? 'Image Quality (%)' : 'Qualité image (%)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.media.image_quality}
                    onChange={(e) => handleInputChange('media', 'image_quality', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'حجم الصورة المصغرة (px)' : language === 'en' ? 'Thumbnail Size (px)' : 'Taille miniature (px)'}
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="50"
                    value={settings.media.thumbnail_size}
                    onChange={(e) => handleInputChange('media', 'thumbnail_size', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'تنسيقات الصور المسموح بها' : language === 'en' ? 'Allowed Image Formats' : 'Formats d\'images autorisés'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].map((format) => (
                    <label key={format} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.media.allowed_image_formats.includes(format)}
                        onChange={(e) => {
                          const formats = e.target.checked
                            ? [...settings.media.allowed_image_formats, format]
                            : settings.media.allowed_image_formats.filter(f => f !== format);
                          handleInputChange('media', 'allowed_image_formats', formats);
                        }}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 uppercase">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.media.enable_image_optimization}
                    onChange={(e) => handleInputChange('media', 'enable_image_optimization', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل تحسين الصورة' : language === 'en' ? 'Enable Image Optimization' : 'Activer l\'optimisation d\'images'}
                  </span>
                </label>
              </div>

              <button
                onClick={() => saveSettings('media')}
                disabled={saving}
                className="btn-primary flex items-center px-6 py-3"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {language === 'ar' ? 'حفظ الوسائط' : language === 'en' ? 'Save Media' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'ar' ? 'النسخ الاحتياطي والتصدير' : language === 'en' ? 'Backup & Export' : 'Sauvegarde & Export'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'تكرار النسخ الاحتياطي' : language === 'en' ? 'Backup Frequency' : 'Fréquence de sauvegarde'}
                  </label>
                  <select
                    value={settings.backup.backup_frequency}
                    onChange={(e) => handleInputChange('backup', 'backup_frequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="daily">
                      {language === 'ar' ? 'يومي' : language === 'en' ? 'Daily' : 'Quotidien'}
                    </option>
                    <option value="weekly">
                      {language === 'ar' ? 'أسبوعي' : language === 'en' ? 'Weekly' : 'Hebdomadaire'}
                    </option>
                    <option value="monthly">
                      {language === 'ar' ? 'شهري' : language === 'en' ? 'Monthly' : 'Mensuel'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وقت النسخ الاحتياطي' : language === 'en' ? 'Backup Time' : 'Heure de sauvegarde'}
                  </label>
                  <input
                    type="time"
                    value={settings.backup.backup_time}
                    onChange={(e) => handleInputChange('backup', 'backup_time', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاحتفاظ بالنسخ (أيام)' : language === 'en' ? 'Retention Days' : 'Jours de rétention'}
                  </label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={settings.backup.backup_retention_days}
                    onChange={(e) => handleInputChange('backup', 'backup_retention_days', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.backup.enable_auto_backup}
                    onChange={(e) => handleInputChange('backup', 'enable_auto_backup', e.target.checked)}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'تفعيل النسخ الاحتياطي التلقائي' : language === 'en' ? 'Enable Auto Backup' : 'Activer la sauvegarde automatique'}
                  </span>
                </label>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === 'ar' ? 'تصدير البيانات' : language === 'en' ? 'Export Data' : 'Exporter les données'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'ar' ? 
                    'تصدير بياناتك في تنسيقات مختلفة للنسخ الاحتياطي أو الترحيل.' :
                    language === 'en' ?
                    'Export your data in various formats for backup or migration.' :
                    'Exportez vos données dans différents formats pour sauvegarde ou migration.'}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Database size={16} className="inline mr-2" />
                    {language === 'ar' ? 'تصدير المستخدمين' : language === 'en' ? 'Export Users' : 'Exporter Utilisateurs'}
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Database size={16} className="inline mr-2" />
                    {language === 'ar' ? 'تصدير الوصفات' : language === 'en' ? 'Export Recipes' : 'Exporter Recettes'}
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Database size={16} className="inline mr-2" />
                    {language === 'ar' ? 'تصدير المنتجات' : language === 'en' ? 'Export Products' : 'Exporter Produits'}
                  </button>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    <Database size={16} className="inline mr-2" />
                    {language === 'ar' ? 'تصدير الكل' : language === 'en' ? 'Export All' : 'Tout exporter'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => saveSettings('backup')}
                disabled={saving}
                className="btn-primary flex items-center px-6 py-3"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {language === 'ar' ? 'حفظ النسخ الاحتياطي' : language === 'en' ? 'Save Backup' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Indicator */}
      {!saving && (
        <div className="fixed bottom-6 right-6 flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-lg animate-pulse">
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800 font-medium">
            {language === 'ar' ? 'جاهز للحفظ' : language === 'en' ? 'Ready to save' : 'Prêt à enregistrer'}
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
