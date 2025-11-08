import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../App';
import { 
  Users, 
  ChefHat, 
  ShoppingBag, 
  BookOpen, 
  TrendingUp,
  ArrowUp,
  Plus,
  Sparkles,
  Clock,
  Activity,
  Eye,
  Heart
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboardNew = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      title: language === 'ar' ? 'المستخدمين' : language === 'en' ? 'Users' : 'Utilisateurs',
      value: stats?.total_users || 0,
      recent: stats?.recent_users || 0,
      icon: Users,
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      percentage: '+12%'
    },
    {
      title: language === 'ar' ? 'الوصفات' : language === 'en' ? 'Recipes' : 'Recettes',
      value: stats?.total_recipes || 0,
      recent: stats?.recent_recipes || 0,
      icon: ChefHat,
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      bgGradient: 'from-amber-50 to-orange-100',
      textColor: 'text-orange-600',
      percentage: '+8%'
    },
    {
      title: language === 'ar' ? 'المنتجات' : language === 'en' ? 'Products' : 'Produits',
      value: stats?.total_products || 0,
      recent: stats?.recent_products || 0,
      icon: ShoppingBag,
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      bgGradient: 'from-green-50 to-emerald-100',
      textColor: 'text-green-600',
      percentage: '+15%'
    },
    {
      title: language === 'ar' ? 'التاريخ' : language === 'en' ? 'History' : 'Histoire',
      value: stats?.total_historical_content || 0,
      recent: 0,
      icon: BookOpen,
      gradient: 'from-purple-400 via-violet-500 to-indigo-600',
      bgGradient: 'from-purple-50 to-violet-100',
      textColor: 'text-purple-600',
      percentage: '+5%'
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'إضافة وصفة' : language === 'en' ? 'Add Recipe' : 'Ajouter Recette',
      icon: ChefHat,
      gradient: 'from-amber-400 to-orange-600',
      path: '/admin/recipes/new'
    },
    {
      title: language === 'ar' ? 'إضافة منتج' : language === 'en' ? 'Add Product' : 'Ajouter Produit',
      icon: ShoppingBag,
      gradient: 'from-green-400 to-emerald-600',
      path: '/admin/products/new'
    },
    {
      title: language === 'ar' ? 'إضافة تاريخ' : language === 'en' ? 'Add History' : 'Ajouter Histoire',
      icon: BookOpen,
      gradient: 'from-purple-400 to-violet-600',
      path: '/admin/history/new'
    },
    {
      title: language === 'ar' ? 'المستخدمين' : language === 'en' ? 'Manage Users' : 'Gérer Utilisateurs',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-600',
      path: '/admin/users'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-amber-600"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-600 animate-pulse" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(251, 146, 60, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(251, 146, 60, 0.6);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .stat-card {
          opacity: 0;
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .gradient-border {
          position: relative;
          background: white;
          border-radius: 1rem;
          padding: 1px;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 2px;
          background: linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `}</style>

      {/* Animated Header */}
      <div className="mb-8 animate-slide-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2 flex items-center">
              {getGreeting()}, {user?.full_name?.split(' ')[0]} 
              <span className="ml-3 animate-float inline-block">👋</span>
            </h1>
            <p className="text-gray-600 text-lg flex items-center">
              <Sparkles size={18} className="mr-2 text-amber-500" />
              {language === 'ar' ? 'لوحة التحكم الخاصة بك' :
               language === 'en' ? 'Your command center' :
               'Votre centre de commande'}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg border border-amber-100">
              <div className="flex items-center space-x-2">
                <Clock size={20} className="text-amber-600" />
                <span className="text-gray-700 font-medium">
                  {new Date().toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'en' ? 'en-US' : 'fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards with Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const percentage = card.recent > 0 ? ((card.recent / card.value) * 100).toFixed(1) : 0;
          
          return (
            <div key={index} className="stat-card hover-lift">
              <div className={`relative bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 overflow-hidden shadow-xl`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    {card.recent > 0 && (
                      <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full animate-pulse">
                        <ArrowUp size={14} className="text-green-600" />
                        <span className="text-green-700 font-bold text-sm">{percentage}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-gray-900">
                      {card.value.toLocaleString()}
                    </h3>
                    <p className={`${card.textColor} font-medium text-sm uppercase tracking-wide`}>
                      {card.title}
                    </p>
                    {card.recent > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <TrendingUp size={12} />
                        <span>+{card.recent} {language === 'ar' ? 'جديد' : language === 'en' ? 'new' : 'nouveau'}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8 animate-slide-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-3 text-amber-600" size={28} />
            {language === 'ar' ? 'إجراءات سريعة' : language === 'en' ? 'Quick Actions' : 'Actions Rapides'}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-gray-900 font-semibold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all duration-300">
                    {action.title}
                  </h3>
                  <div className={`w-8 h-8 bg-gradient-to-br ${action.gradient} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <Plus size={20} className="text-white" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl p-6 hover-lift">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="mr-2 text-amber-600" size={24} />
            {language === 'ar' ? 'النشاط الأخير' : language === 'en' ? 'Recent Activity' : 'Activité Récente'}
          </h3>
          
          <div className="space-y-4">
            {stats?.recent_recipes > 0 && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ChefHat size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">
                    {stats.recent_recipes} {language === 'ar' ? 'وصفات جديدة' : language === 'en' ? 'new recipes' : 'nouvelles recettes'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {language === 'ar' ? 'آخر 30 يوم' : language === 'en' ? 'Last 30 days' : 'Derniers 30 jours'}
                  </p>
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
            )}
            
            {stats?.recent_users > 0 && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">
                    {stats.recent_users} {language === 'ar' ? 'مستخدمين جدد' : language === 'en' ? 'new users' : 'nouveaux utilisateurs'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {language === 'ar' ? 'آخر 30 يوم' : language === 'en' ? 'Last 30 days' : 'Derniers 30 jours'}
                  </p>
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
            )}
            
            {stats?.recent_products > 0 && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">
                    {stats.recent_products} {language === 'ar' ? 'منتجات جديدة' : language === 'en' ? 'new products' : 'nouveaux produits'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {language === 'ar' ? 'آخر 30 يوم' : language === 'en' ? 'Last 30 days' : 'Derniers 30 jours'}
                  </p>
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
            )}
            
            {(!stats?.recent_recipes && !stats?.recent_users && !stats?.recent_products) && (
              <div className="text-center py-8">
                <Eye className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">
                  {language === 'ar' ? 'لا يوجد نشاط حديث' : language === 'en' ? 'No recent activity' : 'Aucune activité récente'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Message / Tips */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white hover-lift relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Sparkles className="mr-3 animate-pulse" size={32} />
              <h3 className="text-2xl font-bold">
                {language === 'ar' ? 'نصائح مفيدة' : language === 'en' ? 'Helpful Tips' : 'Conseils Utiles'}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-30 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <Heart className="flex-shrink-0 mt-1" size={20} />
                  <p className="text-sm leading-relaxed">
                    {language === 'ar' ? 
                      'أضف صوراً عالية الجودة لجذب المزيد من الزوار' :
                      language === 'en' ?
                      'Add high-quality images to attract more visitors' :
                      'Ajoutez des images de haute qualité pour attirer plus de visiteurs'}
                  </p>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-30 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <ChefHat className="flex-shrink-0 mt-1" size={20} />
                  <p className="text-sm leading-relaxed">
                    {language === 'ar' ?
                      'الوصفات المفصلة تحصل على تفاعل أكبر' :
                      language === 'en' ?
                      'Detailed recipes get more engagement' :
                      'Les recettes détaillées obtiennent plus d\'engagement'}
                  </p>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-30 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <Activity className="flex-shrink-0 mt-1" size={20} />
                  <p className="text-sm leading-relaxed">
                    {language === 'ar' ?
                      'تحقق من الإحصائيات بانتظام لفهم جمهورك' :
                      language === 'en' ?
                      'Check statistics regularly to understand your audience' :
                      'Vérifiez régulièrement les statistiques pour comprendre votre public'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardNew;
