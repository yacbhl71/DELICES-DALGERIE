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
  BarChart3,
  Mail,
  Palette,
  Layers
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
    // Recipes removed - focusing on dates and olive oil products
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
      name: language === 'ar' ? 'رسائل الاتصال' : language === 'en' ? 'Contact Messages' : 'Messages de Contact',
      href: '/admin/contact',
      icon: Mail
    },
    {
      name: language === 'ar' ? 'التحليلات' : language === 'en' ? 'Analytics' : 'Analyses',
      href: '/admin/analytics',
      icon: BarChart3
    },
    {
      name: language === 'ar' ? 'التخصيص' : language === 'en' ? 'Customization' : 'Personnalisation',
      href: '/admin/customization',
      icon: Palette
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
            <div className="w-8 h-8 bg-gradient-to-r from-olive to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DT</span>
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
        {/* Animated Header Banner */}
        <div className="sticky top-0 z-10 relative overflow-hidden">
          <style>{`
            @keyframes float-shapes {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
            }
            @keyframes slide-gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-gradient {
              background-size: 200% 200%;
              animation: slide-gradient 8s ease infinite;
            }
            .float-shape {
              animation: float-shapes 6s ease-in-out infinite;
            }
          `}</style>
          
          {/* Gradient Background */}
          <div className="relative bg-gradient-to-r from-olive via-green-700 to-brown animate-gradient">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Large Circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl float-shape"></div>
              
              {/* Medium Circle */}
              <div className="absolute top-5 left-1/4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl float-shape" style={{ animationDelay: '1s' }}></div>
              
              {/* Small Circles */}
              <div className="absolute bottom-5 left-1/3 w-16 h-16 bg-white opacity-10 rounded-full blur-lg float-shape" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-8 right-1/3 w-20 h-20 bg-white opacity-10 rounded-full blur-lg float-shape" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Geometric Shapes */}
              <div className="absolute top-10 left-10 w-12 h-12 border-2 border-white opacity-20 rotate-45 float-shape" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-10 right-20 w-16 h-16 border-2 border-white opacity-20 rotate-12 float-shape" style={{ animationDelay: '2.5s' }}></div>
              
              {/* Dots Pattern */}
              <div className="absolute inset-0 opacity-10" style={{ 
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-between h-32 px-8">
              {/* Left side - Menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl hover:bg-opacity-30 transition-all duration-300 shadow-lg"
              >
                <Menu size={24} />
              </button>
              
              {/* Center - Decorative Text */}
              <div className="flex-1 flex items-center justify-center">
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-white font-bold text-lg tracking-wider">
                    DÉLICES ET TRÉSORS D'ALGÉRIE
                  </span>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Right side - User info */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white border-opacity-30 shadow-lg">
                  <div className="w-8 h-8 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm leading-tight">
                      {user.full_name?.split(' ')[0]}
                    </p>
                    <p className="text-white text-xs opacity-75">
                      {language === 'ar' ? 'مسؤول' : language === 'en' ? 'Admin' : 'Administrateur'}
                    </p>
                  </div>
                </div>
                
                {/* Notification Bell */}
                <button className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl hover:bg-opacity-30 transition-all duration-300 shadow-lg relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Notification Badge */}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    3
                  </span>
                </button>
              </div>
            </div>
            
            {/* Bottom Wave Border */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6">
                <path d="M0 48H1440V24C1440 24 1200 0 720 0C240 0 0 24 0 24V48Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 -mt-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;