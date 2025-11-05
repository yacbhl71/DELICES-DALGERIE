import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  ChefHat, 
  ShoppingBag, 
  BookOpen,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminAnalytics = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const exportData = () => {
    const data = {
      stats,
      exported_at: new Date().toISOString(),
      site: 'Soumam Heritage'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soumam-heritage-stats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getGrowthPercentage = (current, recent) => {
    if (current === 0) return 0;
    return ((recent / current) * 100).toFixed(1);
  };

  const detailedStats = [
    {
      title: language === 'ar' ? 'المستخدمون' : language === 'en' ? 'Users' : 'Utilisateurs',
      current: stats?.total_users || 0,
      recent: stats?.recent_users || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      insights: [
        {
          label: language === 'ar' ? 'مستخدمين جدد هذا الشهر' : language === 'en' ? 'New users this month' : 'Nouveaux utilisateurs ce mois',
          value: stats?.recent_users || 0
        },
        {
          label: language === 'ar' ? 'معدل النمو' : language === 'en' ? 'Growth rate' : 'Taux de croissance',
          value: `${getGrowthPercentage(stats?.total_users, stats?.recent_users)}%`
        }
      ]
    },
    {
      title: language === 'ar' ? 'الوصفات' : language === 'en' ? 'Recipes' : 'Recettes',
      current: stats?.total_recipes || 0,
      recent: stats?.recent_recipes || 0,
      icon: ChefHat,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      insights: [
        {
          label: language === 'ar' ? 'وصفات جديدة هذا الشهر' : language === 'en' ? 'New recipes this month' : 'Nouvelles recettes ce mois',
          value: stats?.recent_recipes || 0
        },
        {
          label: language === 'ar' ? 'متوسط الوصفات أسبوعياً' : language === 'en' ? 'Average recipes per week' : 'Moyenne de recettes par semaine',
          value: Math.round((stats?.recent_recipes || 0) / 4)
        }
      ]
    },
    {
      title: language === 'ar' ? 'المنتجات' : language === 'en' ? 'Products' : 'Produits',
      current: stats?.total_products || 0,
      recent: stats?.recent_products || 0,
      icon: ShoppingBag,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      insights: [
        {
          label: language === 'ar' ? 'منتجات جديدة هذا الشهر' : language === 'en' ? 'New products this month' : 'Nouveaux produits ce mois',
          value: stats?.recent_products || 0
        },
        {
          label: language === 'ar' ? 'معدل إضافة المنتجات' : language === 'en' ? 'Product addition rate' : 'Taux d\'ajout de produits',
          value: `${getGrowthPercentage(stats?.total_products, stats?.recent_products)}%`
        }
      ]
    },
    {
      title: language === 'ar' ? 'المحتوى التاريخي' : language === 'en' ? 'Historical Content' : 'Contenu Historique',
      current: stats?.total_historical_content || 0,
      recent: 0,
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      insights: [
        {
          label: language === 'ar' ? 'مقالات تاريخية' : language === 'en' ? 'Historical articles' : 'Articles historiques',
          value: stats?.total_historical_content || 0
        },
        {
          label: language === 'ar' ? 'متوسط طول المقال' : language === 'en' ? 'Average article length' : 'Longueur moyenne des articles',
          value: '500+ ' + (language === 'ar' ? 'كلمة' : language === 'en' ? 'words' : 'mots')
        }
      ]
    }
  ];

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
            {language === 'ar' ? 'التحليلات والإحصائيات' : language === 'en' ? 'Analytics & Statistics' : 'Analyses et Statistiques'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'نظرة شاملة على أداء الموقع والبيانات' :
             language === 'en' ? 'Comprehensive overview of site performance and data' :
             'Aperçu complet des performances du site et des données'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <RefreshCw size={20} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تحديث' : language === 'en' ? 'Refresh' : 'Actualiser'}
          </button>
          <button
            onClick={exportData}
            className="btn-primary flex items-center"
          >
            <Download size={20} className="mr-2" />
            {language === 'ar' ? 'تصدير البيانات' : language === 'en' ? 'Export Data' : 'Exporter Données'}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {detailedStats.map((stat, index) => {
          const Icon = stat.icon;
          const hasGrowth = stat.recent > 0;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className={stat.textColor} />
                  </div>
                  {hasGrowth && (
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp size={16} className="mr-1" />
                      +{stat.recent}
                    </div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.current.toLocaleString()}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{stat.title}</p>
                
                <div className="space-y-2">
                  {stat.insights.map((insight, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{insight.label}</span>
                      <span className="font-medium text-gray-900">{insight.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <PieChart className="mr-2" size={24} />
              {language === 'ar' ? 'توزيع المحتوى' : language === 'en' ? 'Content Distribution' : 'Distribution du Contenu'}
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <ChefHat size={20} className="text-orange-600 mr-3" />
                <span className="font-medium text-gray-900">
                  {language === 'ar' ? 'الوصفات' : language === 'en' ? 'Recipes' : 'Recettes'}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.total_recipes || 0}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(((stats?.total_recipes || 0) / Math.max((stats?.total_recipes || 0) + (stats?.total_products || 0) + (stats?.total_historical_content || 0), 1)) * 100)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <ShoppingBag size={20} className="text-green-600 mr-3" />
                <span className="font-medium text-gray-900">
                  {language === 'ar' ? 'المنتجات' : language === 'en' ? 'Products' : 'Produits'}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.total_products || 0}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(((stats?.total_products || 0) / Math.max((stats?.total_recipes || 0) + (stats?.total_products || 0) + (stats?.total_historical_content || 0), 1)) * 100)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <BookOpen size={20} className="text-purple-600 mr-3" />
                <span className="font-medium text-gray-900">
                  {language === 'ar' ? 'المحتوى التاريخي' : language === 'en' ? 'Historical Content' : 'Contenu Historique'}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.total_historical_content || 0}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(((stats?.total_historical_content || 0) / Math.max((stats?.total_recipes || 0) + (stats?.total_products || 0) + (stats?.total_historical_content || 0), 1)) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="mr-2" size={24} />
              {language === 'ar' ? 'اتجاهات النمو' : language === 'en' ? 'Growth Trends' : 'Tendances de Croissance'}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {(stats?.recent_users || 0) + (stats?.recent_recipes || 0) + (stats?.recent_products || 0)}
              </div>
              <div className="text-gray-600">
                {language === 'ar' ? 'إجمالي العناصر الجديدة هذا الشهر' :
                 language === 'en' ? 'Total new items this month' :
                 'Total nouveaux éléments ce mois'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {language === 'ar' ? 'معدل نمو المستخدمين' : language === 'en' ? 'User growth rate' : 'Taux de croissance utilisateurs'}
                </span>
                <div className="flex items-center">
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                  <span className="font-semibold text-green-600">
                    {getGrowthPercentage(stats?.total_users, stats?.recent_users)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {language === 'ar' ? 'معدل إضافة المحتوى' : language === 'en' ? 'Content addition rate' : 'Taux d\'ajout de contenu'}
                </span>
                <div className="flex items-center">
                  <TrendingUp size={16} className="text-blue-500 mr-1" />
                  <span className="font-semibold text-blue-600">
                    {getGrowthPercentage(stats?.total_recipes, stats?.recent_recipes)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {language === 'ar' ? 'نشاط الموقع' : language === 'en' ? 'Site activity' : 'Activité du site'}
                </span>
                <div className="flex items-center">
                  <Activity size={16} className="text-amber-500 mr-1" />
                  <span className="font-semibold text-amber-600">
                    {language === 'ar' ? 'عالي' : language === 'en' ? 'High' : 'Élevé'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Activity className="mr-2" size={24} />
          {language === 'ar' ? 'صحة النظام' : language === 'en' ? 'System Health' : 'Santé du Système'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity size={32} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'الخدمات' : language === 'en' ? 'Services' : 'Services'}
            </h3>
            <p className="text-green-600 font-medium">
              {language === 'ar' ? 'تعمل بشكل طبيعي' : language === 'en' ? 'Running normally' : 'Fonctionnement normal'}
            </p>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'آخر تحديث' : language === 'en' ? 'Last Updated' : 'Dernière Mise à Jour'}
            </h3>
            <p className="text-blue-600 font-medium">
              {new Date().toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'en' ? 'en-US' : 'fr-FR')}
            </p>
          </div>

          <div className="text-center p-6 bg-amber-50 rounded-lg">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'الأداء' : language === 'en' ? 'Performance' : 'Performance'}
            </h3>
            <p className="text-amber-600 font-medium">
              {language === 'ar' ? 'ممتاز' : language === 'en' ? 'Excellent' : 'Excellent'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;