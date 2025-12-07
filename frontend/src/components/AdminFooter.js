import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { useLanguage } from '../App';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminFooter() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [footerData, setFooterData] = useState({
    about_text: { fr: '', en: '', ar: '' },
    social_links: [],
    footer_links: [],
    copyright_text: { fr: '', en: '', ar: '' },
    contact_info: {
      email: '',
      phone: '',
      address: { fr: '', en: '', ar: '' }
    },
    use_settings_contact: true // Utiliser les contacts de AdminSettings par défaut
  });
  const [settingsData, setSettingsData] = useState(null);

  // Helper function to safely get nested properties
  const safeGet = (obj, path, defaultValue = '') => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultValue;
  };

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/footer`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure all nested objects are properly initialized
      const data = response.data;
      setFooterData({
        about_text: data.about_text || { fr: '', en: '', ar: '' },
        social_links: data.social_links || [],
        footer_links: data.footer_links || [],
        copyright_text: data.copyright_text || { fr: '', en: '', ar: '' },
        contact_info: {
          email: data.contact_info?.email || '',
          phone: data.contact_info?.phone || '',
          address: data.contact_info?.address || { fr: '', en: '', ar: '' }
        }
      });
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/admin/footer`, footerData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({
        title: 'Succès',
        description: 'Footer mis à jour avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le footer',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setFooterData(prev => ({
      ...prev,
      social_links: [...prev.social_links, { name: '', url: '', icon: 'facebook' }]
    }));
  };

  const removeSocialLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setFooterData(prev => ({
      ...prev,
      social_links: prev.social_links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addFooterColumn = () => {
    setFooterData(prev => ({
      ...prev,
      footer_links: [
        ...prev.footer_links,
        {
          title: { fr: '', en: '', ar: '' },
          links: []
        }
      ]
    }));
  };

  const removeFooterColumn = (colIndex) => {
    setFooterData(prev => ({
      ...prev,
      footer_links: prev.footer_links.filter((_, i) => i !== colIndex)
    }));
  };

  const addLinkToColumn = (colIndex) => {
    setFooterData(prev => ({
      ...prev,
      footer_links: prev.footer_links.map((col, i) =>
        i === colIndex
          ? { ...col, links: [...col.links, { label: { fr: '', en: '', ar: '' }, url: '' }] }
          : col
      )
    }));
  };

  const removeLinkFromColumn = (colIndex, linkIndex) => {
    setFooterData(prev => ({
      ...prev,
      footer_links: prev.footer_links.map((col, i) =>
        i === colIndex
          ? { ...col, links: col.links.filter((_, li) => li !== linkIndex) }
          : col
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Footer Personnalisable</h1>
          <p className="text-gray-600">Gérez le contenu du footer de votre site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5a7a1d] transition disabled:opacity-50"
        >
          <Save size={20} />
          <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* About Text */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Texte À Propos</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Français</label>
              <textarea
                value={footerData.about_text.fr}
                onChange={(e) => setFooterData(prev => ({
                  ...prev,
                  about_text: { ...prev.about_text, fr: e.target.value }
                }))}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
              <textarea
                value={footerData.about_text.en}
                onChange={(e) => setFooterData(prev => ({
                  ...prev,
                  about_text: { ...prev.about_text, en: e.target.value }
                }))}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العربية</label>
              <textarea
                value={footerData.about_text.ar}
                onChange={(e) => setFooterData(prev => ({
                  ...prev,
                  about_text: { ...prev.about_text, ar: e.target.value }
                }))}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Réseaux Sociaux</h2>
            <button
              onClick={addSocialLink}
              className="flex items-center space-x-2 px-4 py-2 border border-[#6B8E23] text-[#6B8E23] rounded-lg hover:bg-[#6B8E23] hover:text-white transition"
            >
              <Plus size={18} />
              <span>Ajouter</span>
            </button>
          </div>
          <div className="space-y-4">
            {footerData.social_links.map((social, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={social.name}
                  onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                  placeholder="Nom (ex: Facebook)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
                <input
                  type="url"
                  value={social.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
                <select
                  value={social.icon}
                  onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                </select>
                <button
                  onClick={() => removeSocialLink(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informations de Contact</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={footerData.contact_info.email}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contact_info: { ...prev.contact_info, email: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={footerData.contact_info.phone}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contact_info: { ...prev.contact_info, phone: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse (FR)</label>
                <input
                  type="text"
                  value={footerData.contact_info.address.fr}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      address: { ...prev.contact_info.address, fr: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address (EN)</label>
                <input
                  type="text"
                  value={footerData.contact_info.address.en}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      address: { ...prev.contact_info.address, en: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان (AR)</label>
                <input
                  type="text"
                  value={footerData.contact_info.address.ar}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contact_info: {
                      ...prev.contact_info,
                      address: { ...prev.contact_info.address, ar: e.target.value }
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Texte Copyright</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Français</label>
              <input
                type="text"
                value={footerData.copyright_text.fr}
                onChange={(e) => setFooterData(prev => ({
                  ...prev,
                  copyright_text: { ...prev.copyright_text, fr: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
              <input
                type="text"
                value={footerData.copyright_text.en}
                onChange={(e) => setFooterData(prev => ({
                  ...prev,
                  copyright_text: { ...prev.copyright_text, en: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العربية</label>
              <input
                type="text"
                value={footerData.copyright_text.ar}
                onChange={(e) => setFooterData(prev => ({
                  ...prev,
                  copyright_text: { ...prev.copyright_text, ar: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B8E23]"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
