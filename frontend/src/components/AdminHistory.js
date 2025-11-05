import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye,
  MapPin,
  Calendar,
  BookOpen
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminHistory = () => {
  const { language } = useLanguage();
  const [historicalContent, setHistoricalContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = [
    { value: 'all', labelFr: 'Toutes les régions', labelAr: 'جميع المناطق', labelEn: 'All regions' },
    { value: 'algerie', labelFr: 'Algérie', labelAr: 'الجزائر', labelEn: 'Algeria' },
    { value: 'kabylie', labelFr: 'Kabylie', labelAr: 'القبائل', labelEn: 'Kabylie' },
    { value: 'vallee-soumam', labelFr: 'Vallée de Soumam', labelAr: 'وادي الصومام', labelEn: 'Soumam Valley' }
  ];

  useEffect(() => {
    fetchHistoricalContent();
  }, []);

  const fetchHistoricalContent = async () => {
    try {
      const response = await axios.get(`${API}/historical-content`);
      setHistoricalContent(response.data);
    } catch (error) {
      console.error('Error fetching historical content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المحتوى؟' :
                      language === 'en' ? 'Are you sure you want to delete this content?' :
                      'Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      try {
        await axios.delete(`${API}/historical-content/${contentId}`);
        setHistoricalContent(historicalContent.filter(content => content.id !== contentId));
      } catch (error) {
        console.error('Error deleting historical content:', error);
        alert(language === 'ar' ? 'خطأ في حذف المحتوى' :
              language === 'en' ? 'Error deleting content' :
              'Erreur lors de la suppression du contenu');
      }
    }
  };

  const getLocalizedText = (textObj) => {
    return textObj?.[language] || textObj?.fr || '';
  };

  const getRegionLabel = (region) => {
    const reg = regions.find(r => r.value === region);
    return reg ? getLocalizedText(reg) : region;
  };

  const getRegionColor = (region) => {
    switch (region) {
      case 'algerie': return 'text-green-600 bg-green-100';
      case 'kabylie': return 'text-blue-600 bg-blue-100';
      case 'vallee-soumam': return 'text-amber-600 bg-amber-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    
    switch (language) {
      case 'ar':
        return date.toLocaleDateString('ar-DZ', options);
      case 'en':
        return date.toLocaleDateString('en-US', options);
      default:
        return date.toLocaleDateString('fr-FR', options);
    }
  };

  const filteredContent = historicalContent.filter(content => {
    const title = getLocalizedText(content.title).toLowerCase();
    const contentText = getLocalizedText(content.content).toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || contentText.includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || content.region === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'إدارة المحتوى التاريخي' : language === 'en' ? 'Historical Content Management' : 'Gestion du Contenu Historique'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'إدارة المحتوى التاريخي والثقافي لمناطق الجزائر' :
             language === 'en' ? 'Manage historical and cultural content for Algerian regions' :
             'Gérer le contenu historique et culturel des régions algériennes'}
          </p>
        </div>
        <a
          href="/admin/history/new"
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {language === 'ar' ? 'إضافة محتوى' : language === 'en' ? 'Add Content' : 'Ajouter Contenu'}
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث في المحتوى...' :
                          language === 'en' ? 'Search content...' :
                          'Rechercher dans le contenu...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {regions.map(region => (
                <option key={region.value} value={region.value}>
                  {getRegionLabel(region.value)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {language === 'ar' ? `${filteredContent.length} محتوى موجود` :
           language === 'en' ? `${filteredContent.length} content found` :
           `${filteredContent.length} contenus trouvés`}
        </p>
      </div>

      {/* Content List */}
      <div className="space-y-6">
        {filteredContent.map((content) => (
          <div key={content.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Image */}
              <div className="lg:col-span-1">
                <img
                  src={content.image_urls[0]}
                  alt={getLocalizedText(content.title)}
                  className="w-full h-64 lg:h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="lg:col-span-2 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRegionColor(content.region)}`}>
                        <MapPin size={12} className="inline mr-1" />
                        {getRegionLabel(content.region)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {getLocalizedText(content.title)}
                    </h2>
                  </div>
                </div>
                
                <div className="prose prose-lg text-gray-600 mb-6">
                  <p className="line-clamp-3">
                    {getLocalizedText(content.content)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    {language === 'ar' ? 'تم الإنشاء في' : language === 'en' ? 'Created on' : 'Créé le'} {formatDate(content.created_at)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <a
                      href={`/history/${content.id}`}
                      className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      <Eye size={16} className="mr-2" />
                      {language === 'ar' ? 'عرض' : language === 'en' ? 'View' : 'Voir'}
                    </a>
                    <a
                      href={`/admin/history/edit/${content.id}`}
                      className="flex items-center px-3 py-2 text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors duration-200"
                    >
                      <Edit3 size={16} className="mr-2" />
                      {language === 'ar' ? 'تحرير' : language === 'en' ? 'Edit' : 'Modifier'}
                    </a>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'لا يوجد محتوى' :
             language === 'en' ? 'No content found' :
             'Aucun contenu trouvé'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'ar' ? 'جرب تغيير معايير البحث أو أضف محتوى جديد' :
             language === 'en' ? 'Try changing your search criteria or add new content' :
             'Essayez de modifier vos critères de recherche ou ajoutez du nouveau contenu'}
          </p>
          <a
            href="/admin/history/new"
            className="btn-primary inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            {language === 'ar' ? 'إضافة محتوى جديد' : language === 'en' ? 'Add New Content' : 'Ajouter du Nouveau Contenu'}
          </a>
        </div>
      )}
    </div>
  );
};

export default AdminHistory;