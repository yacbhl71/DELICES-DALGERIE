import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Header from './components/Header';
import HomePage from './components/HomePage';
// RecipesPage removed - focusing on dates and olive oil
import ShopPage from './components/ShopPage';
import HistoryPage from './components/HistoryPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';

// Admin Components
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboardNew';
import AdminRecipes from './components/AdminRecipes';
import AdminProducts from './components/AdminProducts';
import AdminUsers from './components/AdminUsers';
import AdminHistory from './components/AdminHistory';
import AdminRecipeForm from './components/AdminRecipeForm';
import AdminProductForm from './components/AdminProductForm';
import AdminHistoryForm from './components/AdminHistoryForm';
import AdminAnalytics from './components/AdminAnalytics';
import AdminSettings from './components/AdminSettings';
import AdminSettingsTest from './components/AdminSettingsTest';
import AccountSettings from './components/AccountSettings';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Language Context
const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

// Auth Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Translations
const translations = {
  fr: {
    welcome: 'Bienvenue chez Soumam Heritage',
    recipes: 'Recettes',
    shop: 'Boutique',
    history: 'Histoire',
    login: 'Connexion',
    profile: 'Profil',
    logout: 'Déconnexion',
    home: 'Accueil',
    discover: 'Découvrez les saveurs authentiques de l\'Algérie',
    exploreRecipes: 'Explorer les recettes',
    visitShop: 'Visiter la boutique',
    learnHistory: 'Apprendre l\'histoire'
  },
  ar: {
    welcome: 'مرحباً بكم في تراث سومام',
    recipes: 'الوصفات',
    shop: 'المتجر',
    history: 'التاريخ',
    login: 'تسجيل الدخول',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    home: 'الرئيسية',
    discover: 'اكتشف النكهات الأصيلة للجزائر',
    exploreRecipes: 'استكشاف الوصفات',
    visitShop: 'زيارة المتجر',
    learnHistory: 'تعلم التاريخ'
  },
  en: {
    welcome: 'Welcome to Soumam Heritage',
    recipes: 'Recipes',
    shop: 'Shop',
    history: 'History',
    login: 'Login',
    profile: 'Profile',
    logout: 'Logout',
    home: 'Home',
    discover: 'Discover the authentic flavors of Algeria',
    exploreRecipes: 'Explore recipes',
    visitShop: 'Visit shop',
    learnHistory: 'Learn history'
  }
};

function App() {
  const [language, setLanguage] = useState('fr');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth token on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (email, password, fullName) => {
    try {
      await axios.post(`${API}/auth/register`, {
        email,
        password,
        full_name: fullName
      });
      
      // Auto login after registration
      return await login(email, password);
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const t = (key) => translations[language][key] || key;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <AuthContext.Provider value={{ user, login, register, logout }}>
        <div className="App">
          <BrowserRouter>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/recipes" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminRecipes />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/products" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/users" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/history" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminHistory />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/analytics" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminAnalytics />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/settings" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              
              {/* Admin Form Routes */}
              <Route path="/admin/recipes/new" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminRecipeForm />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/recipes/edit/:id" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminRecipeForm />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/products/new" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminProductForm />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/products/edit/:id" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminProductForm />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/history/new" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminHistoryForm />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              <Route path="/admin/history/edit/:id" element={
                user?.role === 'admin' ? (
                  <AdminLayout>
                    <AdminHistoryForm />
                  </AdminLayout>
                ) : (
                  <Navigate to="/auth" />
                )
              } />
              
              {/* Public Routes */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/recipes" element={<RecipesPage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/history" element={<HistoryPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route 
                        path="/profile" 
                        element={user ? <ProfilePage /> : <Navigate to="/auth" />} 
                      />
                      <Route 
                        path="/account-settings" 
                        element={user ? <AccountSettings /> : <Navigate to="/auth" />} 
                      />
                    </Routes>
                  </main>
                </>
              } />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;