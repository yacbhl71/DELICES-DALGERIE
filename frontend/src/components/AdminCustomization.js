import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { useCustomization } from '../contexts/CustomizationContext';
import { Save, Upload, Palette, Type, Image as ImageIcon, Eye } from 'lucide-react';
import axios from 'axios';
import ImageUpload from './ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCustomization = () => {
  const { language } = useLanguage();
  const { refreshCustomization, applyStyles } = useCustomization();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState({
    site_name: { fr: '', ar: '', en: '' },
    tagline: { fr: '', ar: '', en: '' },
    logo_url: '',
    favicon_url: '',
    primary_color: '#6B8E23',
    secondary_color: '#8B7355',
    accent_color: '#F59E0B',
    font_heading: 'Inter',
    font_body: 'Inter'
  });

  const colorPresets = [
    { name: 'Olive Green', primary: '#6B8E23', secondary: '#8B7355', accent: '#F59E0B' },
    { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#3B82F6', accent: '#F59E0B' },
    { name: 'Royal Purple', primary: '#9333EA', secondary: '#A855F7', accent: '#F59E0B' },
    { name: 'Rose Gold', primary: '#EC4899', secondary: '#F472B6', accent: '#FCD34D' },
    { name: 'Forest', primary: '#059669', secondary: '#10B981', accent: '#FCD34D' }
  ];

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Merriweather'
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/customization`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
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
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/customization`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the global customization context
      await refreshCustomization();
      alert(language === 'ar' ? 'تم الحفظ بنجاح!' : language === 'en' ? 'Saved successfully!' : 'Sauvegarde réussie!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(language === 'ar' ? 'خطأ في الحفظ' : language === 'en' ? 'Save error' : 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // Apply styles temporarily for preview
    applyStyles(settings);
    setShowPreview(true);
    setTimeout(() => setShowPreview(false), 3000);
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

  const applyColorPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent
    }));
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
            {language === 'ar' ? 'التخصيص' : language === 'en' ? 'Customization' : 'Personnalisation'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'خصص مظهر موقعك' : language === 'en' ? 'Customize your site appearance' : 'Personnalisez l\'apparence de votre site'}
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center">
          <Save size={20} className="mr-2" />
          {saving ? (language === 'ar' ? 'جاري الحفظ...' : language === 'en' ? 'Saving...' : 'Sauvegarde...') :
                   (language === 'ar' ? 'حفظ' : language === 'en' ? 'Save' : 'Enregistrer')}
        </button>
      </div>

      {/* Branding Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <ImageIcon className="mr-2" size={24} />
          {language === 'ar' ? 'العلامة التجارية' : language === 'en' ? 'Branding' : 'Image de marque'}
        </h2>

        <div className="space-y-6">
          {/* Site Name */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang}>
                <label className="form-label">
                  {language === 'ar' ? 'اسم الموقع' : language === 'en' ? 'Site Name' : 'Nom du site'} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={settings.site_name[lang]}
                  onChange={(e) => handleInputChange('site_name', lang, e.target.value)}
                  className="form-input"
                  placeholder="Délices et Trésors"
                />
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang}>
                <label className="form-label">
                  {language === 'ar' ? 'الشعار' : language === 'en' ? 'Tagline' : 'Slogan'} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={settings.tagline[lang]}
                  onChange={(e) => handleInputChange('tagline', lang, e.target.value)}
                  className="form-input"
                  placeholder="Saveurs authentiques d'Algérie"
                />
              </div>
            ))}
          </div>

          {/* Logo */}
          <div>
            <label className="form-label mb-3">
              {language === 'ar' ? 'الشعار' : language === 'en' ? 'Logo' : 'Logo'}
            </label>
            <ImageUpload
              label="Logo"
              maxImages={1}
              existingImages={settings.logo_url ? [settings.logo_url] : []}
              onUploadComplete={(images) => {
                setSettings(prev => ({ ...prev, logo_url: images[0] || '' }));
              }}
            />
          </div>

          {/* Favicon */}
          <div>
            <label className="form-label mb-3">
              {language === 'ar' ? 'أيقونة المفضلة' : language === 'en' ? 'Favicon' : 'Favicon'}
            </label>
            <ImageUpload
              label="Favicon"
              maxImages={1}
              existingImages={settings.favicon_url ? [settings.favicon_url] : []}
              onUploadComplete={(images) => {
                setSettings(prev => ({ ...prev, favicon_url: images[0] || '' }));
              }}
            />
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Palette className="mr-2" size={24} />
          {language === 'ar' ? 'الألوان' : language === 'en' ? 'Colors' : 'Couleurs'}
        </h2>

        {/* Color Presets */}
        <div className="mb-6">
          <label className="form-label mb-3">
            {language === 'ar' ? 'المجموعات الجاهزة' : language === 'en' ? 'Color Presets' : 'Préréglages de couleurs'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colorPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyColorPreset(preset)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-amber-500 transition-colors"
              >
                <div className="flex space-x-2 mb-2">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: preset.primary }}></div>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: preset.secondary }}></div>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: preset.accent }}></div>
                </div>
                <p className="text-sm font-medium text-gray-700">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="form-label">
              {language === 'ar' ? 'اللون الأساسي' : language === 'en' ? 'Primary Color' : 'Couleur primaire'}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.primary_color}
                onChange={(e) => handleInputChange('primary_color', null, e.target.value)}
                className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.primary_color}
                onChange={(e) => handleInputChange('primary_color', null, e.target.value)}
                className="form-input flex-1"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              {language === 'ar' ? 'اللون الثانوي' : language === 'en' ? 'Secondary Color' : 'Couleur secondaire'}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.secondary_color}
                onChange={(e) => handleInputChange('secondary_color', null, e.target.value)}
                className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondary_color}
                onChange={(e) => handleInputChange('secondary_color', null, e.target.value)}
                className="form-input flex-1"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              {language === 'ar' ? 'لون التمييز' : language === 'en' ? 'Accent Color' : 'Couleur d\'accent'}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.accent_color}
                onChange={(e) => handleInputChange('accent_color', null, e.target.value)}
                className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.accent_color}
                onChange={(e) => handleInputChange('accent_color', null, e.target.value)}
                className="form-input flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Type className="mr-2" size={24} />
          {language === 'ar' ? 'الخطوط' : language === 'en' ? 'Typography' : 'Typographie'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">
              {language === 'ar' ? 'خط العناوين' : language === 'en' ? 'Heading Font' : 'Police des titres'}
            </label>
            <select
              value={settings.font_heading}
              onChange={(e) => handleInputChange('font_heading', null, e.target.value)}
              className="form-input"
            >
              {fontOptions.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
              ))}
            </select>
            <p className="mt-2 text-2xl font-bold" style={{ fontFamily: settings.font_heading }}>
              {language === 'ar' ? 'نموذج العنوان' : language === 'en' ? 'Heading Example' : 'Exemple de titre'}
            </p>
          </div>

          <div>
            <label className="form-label">
              {language === 'ar' ? 'خط النص' : language === 'en' ? 'Body Font' : 'Police du corps'}
            </label>
            <select
              value={settings.font_body}
              onChange={(e) => handleInputChange('font_body', null, e.target.value)}
              className="form-input"
            >
              {fontOptions.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
              ))}
            </select>
            <p className="mt-2" style={{ fontFamily: settings.font_body }}>
              {language === 'ar' ? 'نموذج النص الأساسي' : language === 'en' ? 'Body text example' : 'Exemple de texte'}
            </p>
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

export default AdminCustomization;