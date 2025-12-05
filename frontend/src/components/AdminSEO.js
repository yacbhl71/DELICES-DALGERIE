import React, { useState, useEffect } from 'react';
import { Globe, Search, FileText, Image as ImageIcon, Save } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminSEO() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoSettings, setSeoSettings] = useState({
    site_title: { fr: '', en: '', ar: '' },
    site_description: { fr: '', en: '', ar: '' },
    site_keywords: { fr: '', en: '', ar: '' },
    og_image: '',
    twitter_handle: '',
    google_analytics_id: '',
    google_site_verification: '',
    robots_txt: 'User-agent: *\nAllow: /',
    canonical_url: '',
    structured_data_enabled: true
  });

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/seo-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setSeoSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      // If no settings exist yet, keep defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/seo-settings`,
        seoSettings,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Succès',
        description: 'Paramètres SEO enregistrés avec succès'
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.detail || 'Erreur lors de la sauvegarde',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres SEO</h1>
        <p className="text-gray-600">Optimisez le référencement de votre site</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Meta Tags de base */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FileText className="text-[#6B8E23] mr-2" size={24} />
            <h2 className="text-xl font-bold">Meta Tags de Base</h2>
          </div>

          <div className="space-y-4">
            {/* Site Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du Site (Français)
              </label>
              <input
                type="text"
                value={seoSettings.site_title.fr}
                onChange={(e) => setSeoSettings({
                  ...seoSettings,
                  site_title: { ...seoSettings.site_title, fr: e.target.value }
                })}
                placeholder="Délices et Trésors d'Algérie - Produits Authentiques"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Max 60 caractères recommandé</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre (English)
                </label>
                <input
                  type="text"
                  value={seoSettings.site_title.en}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    site_title: { ...seoSettings.site_title, en: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre (العربية)
                </label>
                <input
                  type="text"
                  value={seoSettings.site_title.ar}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    site_title: { ...seoSettings.site_title, ar: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Site Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du Site (Français)
              </label>
              <textarea
                value={seoSettings.site_description.fr}
                onChange={(e) => setSeoSettings({
                  ...seoSettings,
                  site_description: { ...seoSettings.site_description, fr: e.target.value }
                })}
                rows="3"
                placeholder="Découvrez nos dattes Deglet Nour, huile d'olive et produits artisanaux d'Algérie..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Max 160 caractères recommandé</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (English)
                </label>
                <textarea
                  value={seoSettings.site_description.en}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    site_description: { ...seoSettings.site_description, en: e.target.value }
                  })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (العربية)
                </label>
                <textarea
                  value={seoSettings.site_description.ar}
                  onChange={(e) => setSeoSettings({
                    ...seoSettings,
                    site_description: { ...seoSettings.site_description, ar: e.target.value }
                  })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mots-clés (Français, séparés par des virgules)
              </label>
              <input
                type="text"
                value={seoSettings.site_keywords.fr}
                onChange={(e) => setSeoSettings({
                  ...seoSettings,
                  site_keywords: { ...seoSettings.site_keywords, fr: e.target.value }
                })}
                placeholder="dattes algériennes, huile d'olive, produits algériens"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Open Graph & Social Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Globe className="text-[#6B8E23] mr-2" size={24} />
            <h2 className="text-xl font-bold">Réseaux Sociaux (Open Graph)</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Open Graph (URL)
              </label>
              <input
                type="url"
                value={seoSettings.og_image}
                onChange={(e) => setSeoSettings({ ...seoSettings, og_image: e.target.value })}
                placeholder="https://example.com/og-image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommandé : 1200x630px pour Facebook/LinkedIn
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Handle
              </label>
              <input
                type="text"
                value={seoSettings.twitter_handle}
                onChange={(e) => setSeoSettings({ ...seoSettings, twitter_handle: e.target.value })}
                placeholder="@VotreCompte"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Analytics & Verification */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Search className="text-[#6B8E23] mr-2" size={24} />
            <h2 className="text-xl font-bold">Analytics & Vérification</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={seoSettings.google_analytics_id}
                onChange={(e) => setSeoSettings({ ...seoSettings, google_analytics_id: e.target.value })}
                placeholder="G-XXXXXXXXXX ou UA-XXXXXXXXX-X"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Site Verification Code
              </label>
              <input
                type="text"
                value={seoSettings.google_site_verification}
                onChange={(e) => setSeoSettings({ ...seoSettings, google_site_verification: e.target.value })}
                placeholder="Collez le code de vérification"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Canonique
              </label>
              <input
                type="url"
                value={seoSettings.canonical_url}
                onChange={(e) => setSeoSettings({ ...seoSettings, canonical_url: e.target.value })}
                placeholder="https://delices-algerie.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Robots.txt */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Robots.txt</h2>
          <textarea
            value={seoSettings.robots_txt}
            onChange={(e) => setSeoSettings({ ...seoSettings, robots_txt: e.target.value })}
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Contrôle l'indexation de votre site par les moteurs de recherche
          </p>
        </div>

        {/* Structured Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Données Structurées (Schema.org)</h2>
              <p className="text-sm text-gray-600">
                Active l'ajout automatique de données structurées pour les produits
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seoSettings.structured_data_enabled}
                onChange={(e) => setSeoSettings({ ...seoSettings, structured_data_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6B8E23]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B8E23]"></div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#6B8E23] text-white px-8 py-3 rounded-lg hover:bg-[#5a7a1d] transition flex items-center disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </button>
        </div>
      </form>
    </div>
  );
}
