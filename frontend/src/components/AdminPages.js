import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, Eye, FileText } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminPages() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: { fr: '', en: '', ar: '' },
    slug: '',
    content: { fr: '', en: '', ar: '' },
    meta_description: { fr: '', en: '', ar: '' },
    is_published: true,
    show_in_menu: false,
    menu_order: 0
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/pages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({ title: 'Erreur', description: 'Impossible de charger les pages', variant: 'destructive' });
      setLoading(false);
    }
  };

  const handleOpenModal = (page = null) => {
    if (page) {
      setEditingPage(page);
      setFormData(page);
    } else {
      setEditingPage(null);
      setFormData({
        title: { fr: '', en: '', ar: '' },
        slug: '',
        content: { fr: '', en: '', ar: '' },
        meta_description: { fr: '', en: '', ar: '' },
        is_published: true,
        show_in_menu: false,
        menu_order: pages.length
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingPage) {
        await axios.put(`${API}/admin/pages/${editingPage.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast({ title: 'Succès', description: 'Page mise à jour' });
      } else {
        await axios.post(`${API}/admin/pages`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast({ title: 'Succès', description: 'Page créée' });
      }
      handleCloseModal();
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder la page', variant: 'destructive' });
    }
  };

  const handleDelete = async (pageId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/pages/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Succès', description: 'Page supprimée' });
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({ title: 'Erreur', description: 'Impossible de supprimer la page', variant: 'destructive' });
    }
  };

  const generateSlug = (text) => {
    return text.toLowerCase()
      .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pages Personnalisées</h1>
          <p className="text-gray-600">Créez des pages comme CGV, Mentions légales, À propos, etc.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-[#6B8E23] text-white px-6 py-3 rounded-lg hover:bg-[#5a7a1d] transition"
        >
          <Plus size={20} />
          <span>Nouvelle Page</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div key={page.id} className={`bg-white rounded-lg shadow p-6 ${!page.is_published ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <FileText className="text-[#6B8E23] mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{page.title.fr}</h3>
                  <p className="text-sm text-gray-500">/{page.slug}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => navigate(`/page/${page.slug}`)} className="text-green-600 hover:text-green-800">
                  <Eye size={18} />
                </button>
                <button onClick={() => handleOpenModal(page)} className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`px-2 py-1 rounded ${page.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {page.is_published ? 'Publiée' : 'Brouillon'}
              </span>
              {page.show_in_menu && <span className="text-[#6B8E23]">📌 Menu</span>}
            </div>
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 mb-4">Aucune page. Créez-en une pour commencer !</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingPage ? 'Modifier la Page' : 'Nouvelle Page'}</h2>
              <button onClick={handleCloseModal}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <input type="text" required placeholder="Titre (FR)" value={formData.title.fr}
                  onChange={(e) => { setFormData(p => ({ ...p, title: { ...p.title, fr: e.target.value }, slug: !editingPage ? generateSlug(e.target.value) : p.slug })); }}
                  className="px-4 py-2 border rounded-lg" />
                <input type="text" required placeholder="Title (EN)" value={formData.title.en}
                  onChange={(e) => setFormData(p => ({ ...p, title: { ...p.title, en: e.target.value } }))}
                  className="px-4 py-2 border rounded-lg" />
                <input type="text" required placeholder="العنوان (AR)" value={formData.title.ar} dir="rtl"
                  onChange={(e) => setFormData(p => ({ ...p, title: { ...p.title, ar: e.target.value } }))}
                  className="px-4 py-2 border rounded-lg" />
              </div>
              <input type="text" required placeholder="slug" value={formData.slug}
                onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg" />
              <div className="grid grid-cols-3 gap-4">
                <textarea rows="8" required placeholder="Contenu (FR)" value={formData.content.fr}
                  onChange={(e) => setFormData(p => ({ ...p, content: { ...p.content, fr: e.target.value } }))}
                  className="px-4 py-2 border rounded-lg" />
                <textarea rows="8" required placeholder="Content (EN)" value={formData.content.en}
                  onChange={(e) => setFormData(p => ({ ...p, content: { ...p.content, en: e.target.value } }))}
                  className="px-4 py-2 border rounded-lg" />
                <textarea rows="8" required placeholder="المحتوى (AR)" value={formData.content.ar} dir="rtl"
                  onChange={(e) => setFormData(p => ({ ...p, content: { ...p.content, ar: e.target.value } }))}
                  className="px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.is_published}
                    onChange={(e) => setFormData(p => ({ ...p, is_published: e.target.checked }))}
                    className="mr-2" />
                  Publier
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={formData.show_in_menu}
                    onChange={(e) => setFormData(p => ({ ...p, show_in_menu: e.target.checked }))}
                    className="mr-2" />
                  Afficher dans le menu
                </label>
              </div>
              <div className="flex space-x-4 pt-4 border-t">
                <button type="submit" className="flex-1 bg-[#6B8E23] text-white px-6 py-3 rounded-lg hover:bg-[#5a7a1d]">
                  <Save size={20} className="inline mr-2" />Sauvegarder
                </button>
                <button type="button" onClick={handleCloseModal} className="px-6 py-3 border rounded-lg">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}