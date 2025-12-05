import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../App';
import { User, Mail, Calendar, Settings, Heart, ShoppingBag, BookOpen, Edit3, Save, X, Package } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || ''
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({
        full_name: user?.full_name || '',
        email: user?.email || ''
      });
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to update user data
    console.log('Saving user data:', editData);
    setIsEditing(false);
    // TODO: Implement user update API call
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const getWelcomeMessage = () => {
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

  const stats = [
    {
      icon: Heart,
      value: '12',
      labelFr: 'Recettes favorites',
      labelAr: 'وصفات مفضلة',
      labelEn: 'Favorite recipes',
      color: 'text-red-500 bg-red-100'
    },
    {
      icon: ShoppingBag,
      value: '5',
      labelFr: 'Commandes',
      labelAr: 'طلبات',
      labelEn: 'Orders',
      color: 'text-green-500 bg-green-100'
    },
    {
      icon: BookOpen,
      value: '8',
      labelFr: 'Articles lus',
      labelAr: 'مقالات مقروءة',
      labelEn: 'Articles read',
      color: 'text-blue-500 bg-blue-100'
    }
  ];

  const getStatLabel = (stat) => {
    switch (language) {
      case 'ar': return stat.labelAr;
      case 'en': return stat.labelEn;
      default: return stat.labelFr;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    switch (language) {
      case 'ar':
        return date.toLocaleDateString('ar-DZ', options);
      case 'en':
        return date.toLocaleDateString('en-US', options);
      default:
        return date.toLocaleDateString('fr-FR', options);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <User size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {language === 'ar' ? 'يرجى تسجيل الدخول للوصول إلى الملف الشخصي' :
             language === 'en' ? 'Please log in to access your profile' :
             'Veuillez vous connecter pour accéder à votre profil'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-12 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {getWelcomeMessage()}, {user.full_name}!
                  </h1>
                  <p className="text-lg opacity-90">
                    {language === 'ar' ? 'مرحباً بك في ملفك الشخصي' :
                     language === 'en' ? 'Welcome to your profile' :
                     'Bienvenue sur votre profil'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg transition-colors duration-200"
              >
                {isEditing ? <X size={24} /> : <Edit3 size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'ar' ? 'معلومات الملف الشخصي' :
                   language === 'en' ? 'Profile Information' :
                   'Informations du Profil'}
                </h2>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center"
                  >
                    <Save size={18} className="mr-2" />
                    {language === 'ar' ? 'حفظ' :
                     language === 'en' ? 'Save' :
                     'Sauvegarder'}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label flex items-center">
                      <User size={18} className="mr-2 text-gray-500" />
                      {language === 'ar' ? 'الاسم الكامل' :
                       language === 'en' ? 'Full Name' :
                       'Nom Complet'}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={editData.full_name}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-lg text-gray-800 mt-2">{user.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label flex items-center">
                      <Mail size={18} className="mr-2 text-gray-500" />
                      {language === 'ar' ? 'البريد الإلكتروني' :
                       language === 'en' ? 'Email' :
                       'Email'}
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-lg text-gray-800 mt-2">{user.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="form-label flex items-center">
                    <Calendar size={18} className="mr-2 text-gray-500" />
                    {language === 'ar' ? 'تاريخ الانضمام' :
                     language === 'en' ? 'Member Since' :
                     'Membre depuis'}
                  </label>
                  <p className="text-lg text-gray-800 mt-2">
                    {formatDate(user.created_at)}
                  </p>
                </div>

                <div>
                  <label className="form-label">
                    {language === 'ar' ? 'الحالة' :
                     language === 'en' ? 'Status' :
                     'Statut'}
                  </label>
                  <div className="flex items-center mt-2">
                    <div className={`w-3 h-3 rounded-full mr-3 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-lg font-medium ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {user.is_active ? 
                        (language === 'ar' ? 'نشط' :
                         language === 'en' ? 'Active' :
                         'Actif') :
                        (language === 'ar' ? 'غير نشط' :
                         language === 'en' ? 'Inactive' :
                         'Inactif')
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'النشاط الأخير' :
                 language === 'en' ? 'Recent Activity' :
                 'Activité Récente'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                    <BookOpen size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {language === 'ar' ? 'قرأت مقال "تاريخ الجزائر"' :
                       language === 'en' ? 'Read article "History of Algeria"' :
                       'Lu l\'article "Histoire de l\'Algérie"'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'ar' ? 'منذ يومين' :
                       language === 'en' ? '2 days ago' :
                       'Il y a 2 jours'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Heart size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {language === 'ar' ? 'أضفت وصفة "كسكس بالخضار" للمفضلة' :
                       language === 'en' ? 'Added recipe "Vegetable Couscous" to favorites' :
                       'Ajouté la recette "Couscous aux légumes" aux favoris'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'ar' ? 'منذ 3 أيام' :
                       language === 'en' ? '3 days ago' :
                       'Il y a 3 jours'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'إحصائياتك' :
                 language === 'en' ? 'Your Statistics' :
                 'Vos Statistiques'}
              </h3>
              <div className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${stat.color}`}>
                          <Icon size={20} />
                        </div>
                        <span className="text-gray-700">{getStatLabel(stat)}</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'إجراءات سريعة' :
                 language === 'en' ? 'Quick Actions' :
                 'Actions Rapides'}
              </h3>
              <div className="space-y-3">
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="w-full text-left p-3 hover:bg-olive-light rounded-lg transition-colors duration-200 flex items-center text-olive font-semibold"
                  >
                    <Settings size={20} className="mr-3" />
                    <span>
                      {language === 'ar' ? 'لوحة الإدارة' :
                       language === 'en' ? 'Admin Panel' :
                       'Panel Administrateur'}
                    </span>
                  </button>
                )}
                <button 
                  onClick={() => navigate('/account-settings')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Settings size={20} className="mr-3 text-gray-600" />
                  <span className="text-gray-700">
                    {language === 'ar' ? 'إعدادات الحساب' :
                     language === 'en' ? 'Account Settings' :
                     'Paramètres du compte'}
                  </span>
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center text-red-600"
                >
                  <User size={20} className="mr-3" />
                  <span>
                    {language === 'ar' ? 'تسجيل الخروج' :
                     language === 'en' ? 'Logout' :
                     'Se déconnecter'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;