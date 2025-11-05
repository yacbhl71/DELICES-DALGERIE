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
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
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

        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 mb-1 ${
                  isActive
                    ? 'bg-amber-100 text-amber-700 border-r-2 border-amber-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-amber-600'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Users size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
              <p className="text-xs text-gray-500">Administrateur</p>
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