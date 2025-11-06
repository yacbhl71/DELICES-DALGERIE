import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../App';
import { 
  LayoutDashboard, 
  ChefHat, 
  ShoppingBag, 
  BookOpen, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const menuItems = [
    {
      name: language === 'ar' ? 'لوحة التحكم' : language === 'en' ? 'Dashboard' : 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      name: language === 'ar' ? 'الوصفات' : language === 'en' ? 'Recipes' : 'Recettes',
      href: '/admin/recipes',
      icon: ChefHat
    },
    {
      name: language === 'ar' ? 'المنتجات' : language === 'en' ? 'Products' : 'Produits',
      href: '/admin/products',
      icon: ShoppingBag
    },
    {
      name: language === 'ar' ? 'المحتوى التاريخي' : language === 'en' ? 'Historical Content' : 'Contenu Historique',
      href: '/admin/history',
      icon: BookOpen
    },
    {
      name: language === 'ar' ? 'المستخدمون' : language === 'en' ? 'Users' : 'Utilisateurs',
      href: '/admin/users',
      icon: Users
    },
    {
      name: language === 'ar' ? 'التحليلات' : language === 'en' ? 'Analytics' : 'Analyses',
      href: '/admin/analytics',
      icon: BarChart3
    },
    {
      name: language === 'ar' ? 'الإعدادات' : language === 'en' ? 'Settings' : 'Paramètres',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-100 to-orange-50 text-amber-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600 hover:shadow-sm'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} className="mr-3 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {user.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate" title={user.full_name}>
                {user.full_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role === 'admin' 
                  ? (language === 'ar' ? 'مسؤول' : language === 'en' ? 'Admin' : 'Administrateur')
                  : (language === 'ar' ? 'مستخدم' : language === 'en' ? 'User' : 'Utilisateur')
                }
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-amber-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <Home size={16} className="mr-2" />
              {language === 'ar' ? 'الموقع' : language === 'en' ? 'Website' : 'Site Web'}
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut size={16} className="mr-2" />
              {language === 'ar' ? 'خروج' : language === 'en' ? 'Logout' : 'Déconnexion'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {language === 'ar' ? 'مرحباً' : language === 'en' ? 'Welcome' : 'Bienvenue'}, {user.full_name}
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;