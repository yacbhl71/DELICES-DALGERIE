import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { 
  Users, 
  ChefHat, 
  ShoppingBag, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Activity,
  Eye
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === 'ar' ? 'صباح الخير' :
             language === 'en' ? 'Good morning' :
             'Bonjour';
    } else if (hour < 17) {
      return language === 'ar' ? 'مساء الخير' :
             language === 'en' ? 'Good afternoon' :
             'Bon après-midi';
    } else {
      return language === 'ar' ? 'مساء الخير' :
             language === 'en' ? 'Good evening' :
             'Bonsoir';
    }
  };

  const statCards = [
    {
      title: language === 'ar' ? 'إجمالي المستخدمين' : language === 'en' ? 'Total Users' : 'Total Utilisateurs',
      value: stats?.total_users || 0,
      recent: stats?.recent_users || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: language === 'ar' ? 'إجمالي الوصفات' : language === 'en' ? 'Total Recipes' : 'Total Recettes',
      value: stats?.total_recipes || 0,
      recent: stats?.recent_recipes || 0,
      icon: ChefHat,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: language === 'ar' ? 'إجمالي المنتجات' : language === 'en' ? 'Total Products' : 'Total Produits',
      value: stats?.total_products || 0,
      recent: stats?.recent_products || 0,
      icon: ShoppingBag,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: language === 'ar' ? 'محتوى تاريخي' : language === 'en' ? 'Historical Content' : 'Contenu Historique',
      value: stats?.total_historical_content || 0,
      recent: 0,
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'إضافة وصفة جديدة' : language === 'en' ? 'Add New Recipe' : 'Ajouter une Recette',
      description: language === 'ar' ? 'إنشاء وصفة جديدة للموقع' : language === 'en' ? 'Create a new recipe for the site' : 'Créer une nouvelle recette pour le site',
      icon: ChefHat,
      color: 'from-orange-500 to-red-500',
      href: '/admin/recipes/new'
    },
    {
      title: language === 'ar' ? 'إضافة منتج جديد' : language === 'en' ? 'Add New Product' : 'Ajouter un Produit',
      description: language === 'ar' ? 'إضافة منتج جديد للمتجر' : language === 'en' ? 'Add a new product to the store' : 'Ajouter un nouveau produit au magasin',
      icon: ShoppingBag,
      color: 'from-green-500 to-green-600',
      href: '/admin/products/new'
    },
    {
      title: language === 'ar' ? 'إدارة المستخدمين' : language === 'en' ? 'Manage Users' : 'Gérer les Utilisateurs',
      description: language === 'ar' ? 'عرض وإدارة حسابات المستخدمين' : language === 'en' ? 'View and manage user accounts' : 'Voir et gérer les comptes utilisateurs',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/users'
    },
    {
      title: language === 'ar' ? 'محتوى تاريخي' : language === 'en' ? 'Historical Content' : 'Contenu Historique',
      description: language === 'ar' ? 'إدارة المحتوى التاريخي والثقافي' : language === 'en' ? 'Manage historical and cultural content' : 'Gérer le contenu historique et culturel',
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/history'
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}! 👋
        </h1>
        <p className="text-gray-600">
          {language === 'ar' ? 'مرحباً بك في لوحة تحكم سومام هيريتاج' :
           language === 'en' ? 'Welcome to the Soumam Heritage admin dashboard' :
           'Bienvenue dans le tableau de bord admin de Soumam Heritage'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className={card.textColor} />
                  </div>
                  {card.recent > 0 && (
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp size={16} className="mr-1" />
                      +{card.recent}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value.toLocaleString()}
                </h3>
                <p className="text-gray-600 text-sm">{card.title}</p>
                {card.recent > 0 && (
                  <p className="text-green-600 text-xs mt-2">
                    +{card.recent} {language === 'ar' ? 'هذا الشهر' : language === 'en' ? 'this month' : 'ce mois-ci'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-2" size={24} />
            {language === 'ar' ? 'إجراءات سريعة' : language === 'en' ? 'Quick Actions' : 'Actions Rapides'}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <a
                  key={index}
                  href={action.href}
                  className="block p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-amber-50 hover:to-orange-50 transition-all duration-300 hover:shadow-md group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-700">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-2" size={24} />
            {language === 'ar' ? 'النشاط الأخير' : language === 'en' ? 'Recent Activity' : 'Activité Récente'}
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ChefHat size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {stats?.recent_recipes || 0} {language === 'ar' ? 'وصفات جديدة أضيفت' : language === 'en' ? 'new recipes added' : 'nouvelles recettes ajoutées'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'ar' ? 'خلال الـ 30 يوماً الماضية' : language === 'en' ? 'in the last 30 days' : 'dans les 30 derniers jours'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {stats?.recent_users || 0} {language === 'ar' ? 'مستخدمين جدد انضموا' : language === 'en' ? 'new users joined' : 'nouveaux utilisateurs inscrits'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'ar' ? 'خلال الـ 30 يوماً الماضية' : language === 'en' ? 'in the last 30 days' : 'dans les 30 derniers jours'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye size={16} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {language === 'ar' ? 'النظام يعمل بشكل طبيعي' : language === 'en' ? 'System running normally' : 'Système fonctionnel'}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'ar' ? 'جميع الخدمات متاحة' : language === 'en' ? 'All services available' : 'Tous les services disponibles'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;