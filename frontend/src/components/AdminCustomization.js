import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Palette, Type, Mail, Phone, MapPin, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import ImageUpload from './ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminCustomization() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customization, setCustomization] = useState(null);

  useEffect(() => {
    fetchCustomization();
  }, []);

  const fetchCustomization = async () => {
    try {
      const response = await axios.get(`${API}/customization`);
      setCustomization(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customization:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les paramètres de personnalisation',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/customization`,
        customization,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: 'Sauvegardé',
        description: 'Les paramètres ont été enregistrés avec succès'
      });

      // Reload the page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error saving customization:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMultilingualField = (field, language, value) => {
    setCustomization(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personnalisation du Site</h1>
        <p className="text-gray-600">Personnalisez l'apparence et le contenu de votre site</p>
      </div>

      {/* Save Button - Fixed at top */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-[#6B8E23] text-white px-6 py-3 rounded-lg hover:bg-[#5a7a1d] transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              <span>Sauvegarde...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Sauvegarder les modifications</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Brand Identity Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Type className="text-[#6B8E23] mr-2" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Identité de la Marque</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Site
              </label>
              <input
                type="text"
                value={customization.site_name}
                onChange={(e) => updateField('site_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                placeholder="Délices et Trésors d'Algérie"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan (Français)
              </label>
              <textarea
                value={customization.site_slogan.fr}
                onChange={(e) => updateMultilingualField('site_slogan', 'fr', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan (English)
              </label>
              <textarea
                value={customization.site_slogan.en}
                onChange={(e) => updateMultilingualField('site_slogan', 'en', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan (العربية)
              </label>
              <textarea
                value={customization.site_slogan.ar}
                onChange={(e) => updateMultilingualField('site_slogan', 'ar', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                rows="2"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <ImageUpload
                existingImages={customization.logo_url ? [customization.logo_url] : []}
                maxImages={1}
                onUploadComplete={(urls) => updateField('logo_url', urls[0])}
                label="Logo du site"
              />
              {customization.logo_url && (
                <div className="mt-2">
                  <img src={customization.logo_url} alt="Logo" className="h-16 object-contain" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Palette className="text-[#6B8E23] mr-2" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Couleurs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur Primaire (Olive)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customization.primary_color}
                  onChange={(e) => updateField('primary_color', e.target.value)}
                  className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.primary_color}
                  onChange={(e) => updateField('primary_color', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  placeholder="#6B8E23"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur Secondaire (Doré)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customization.secondary_color}
                  onChange={(e) => updateField('secondary_color', e.target.value)}
                  className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.secondary_color}
                  onChange={(e) => updateField('secondary_color', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  placeholder="#8B7355"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur d'Accent
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customization.accent_color}
                  onChange={(e) => updateField('accent_color', e.target.value)}
                  className="h-12 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.accent_color}
                  onChange={(e) => updateField('accent_color', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  placeholder="#F59E0B"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              <strong>Aperçu :</strong> Les couleurs seront appliquées après sauvegarde et rechargement de la page.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: customization.primary_color }}
                ></div>
                <span className="text-sm">Primaire</span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: customization.secondary_color }}
                ></div>
                <span className="text-sm">Secondaire</span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: customization.accent_color }}
                ></div>
                <span className="text-sm">Accent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Mail className="text-[#6B8E23] mr-2" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Informations de Contact</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail size={16} className="mr-2" />
                Email de Contact
              </label>
              <input
                type="email"
                value={customization.contact_email}
                onChange={(e) => updateField('contact_email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Phone size={16} className="mr-2" />
                Téléphone (optionnel)
              </label>
              <input
                type="tel"
                value={customization.contact_phone || ''}
                onChange={(e) => updateField('contact_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                placeholder="+213 XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin size={16} className="mr-2" />
                Adresse (Français)
              </label>
              <input
                type="text"
                value={customization.contact_address.fr}
                onChange={(e) => updateMultilingualField('contact_address', 'fr', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Page Texts Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Type className="text-[#6B8E23] mr-2" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Textes des Pages</h2>
          </div>

          <div className="space-y-6">
            {/* Home Page */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-4">Page d'Accueil</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre Principal (Français)
                  </label>
                  <input
                    type="text"
                    value={customization.home_title.fr}
                    onChange={(e) => updateMultilingualField('home_title', 'fr', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre (Français)
                  </label>
                  <textarea
                    value={customization.home_subtitle.fr}
                    onChange={(e) => updateMultilingualField('home_subtitle', 'fr', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            {/* Shop Page */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Page Boutique</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre (Français)
                  </label>
                  <input
                    type="text"
                    value={customization.shop_title.fr}
                    onChange={(e) => updateMultilingualField('shop_title', 'fr', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Français)
                  </label>
                  <textarea
                    value={customization.shop_description.fr}
                    onChange={(e) => updateMultilingualField('shop_description', 'fr', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                    rows="2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button - Also at bottom */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-[#6B8E23] text-white px-6 py-3 rounded-lg hover:bg-[#5a7a1d] transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              <span>Sauvegarde...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Sauvegarder les modifications</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
