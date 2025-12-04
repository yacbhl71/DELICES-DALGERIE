import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage, useAuth } from '../App';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const navigate = useNavigate();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇩🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);

  return (
    <header className="header">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-olive to-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DT</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 
                'لذائذ وكنوز الجزائر' :
                language === 'en' ?
                'Delights & Treasures' :
                'Délices et Trésors'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-olive font-medium transition-colors duration-200"
            >
              {t('home')}
            </Link>
            {/* Recipes removed - focusing on dates and olive oil */}
            <Link 
              to="/shop" 
              className="text-gray-700 hover:text-olive font-medium transition-colors duration-200"
            >
              {t('shop')}
            </Link>
            <Link 
              to="/history" 
              className="text-gray-700 hover:text-olive font-medium transition-colors duration-200"
            >
              {t('history')}
            </Link>
          </div>

          {/* Right Side - Language Selector & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-olive transition-colors duration-200"
              >
                <Globe size={20} />
                <span className="text-sm">
                  {languages.find(lang => lang.code === language)?.flag}
                </span>
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-olive-light transition-colors duration-200 flex items-center space-x-3 ${
                        language === lang.code ? 'bg-olive-light text-olive' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-olive transition-colors duration-200"
                >
                  <User size={20} />
                  <span className="text-sm">{user.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut size={20} />
                  <span className="text-sm">{t('logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary text-sm"
              >
                {t('login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-olive transition-colors duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-olive hover:bg-olive-light rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                to="/recipes"
                className="block px-3 py-2 text-gray-700 hover:text-olive hover:bg-olive-light rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('recipes')}
              </Link>
              <Link
                to="/shop"
                className="block px-3 py-2 text-gray-700 hover:text-olive hover:bg-olive-light rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('shop')}
              </Link>
              <Link
                to="/history"
                className="block px-3 py-2 text-gray-700 hover:text-olive hover:bg-olive-light rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('history')}
              </Link>
              
              <div className="border-t border-gray-200 pt-4">
                {/* Mobile Language Selector */}
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900 mb-2">Langue / Language</p>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors duration-200 ${
                          language === lang.code ? 'bg-olive-light text-olive' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Auth */}
                <div className="px-3 py-2 border-t border-gray-200 mt-4">
                  {user ? (
                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-olive hover:bg-olive-light rounded-md transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t('profile')} - {user.full_name}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      className="block w-full text-center btn-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('login')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;