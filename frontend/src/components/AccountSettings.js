import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '../App';
import { 
  Save,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AccountSettings = () => {
  const { user, setUser } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Simple toast replacement
  const toast = (options) => {
    const title = options.title || '';
    const description = options.description || '';
    if (options.variant === 'destructive') {
      alert(`❌ ${title}\n${description}`);
    } else {
      alert(`✅ ${title}\n${description}`);
    }
  };

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Update profile info
      const updateData = {
        full_name: formData.full_name
      };

      await axios.put(
        `${API}/users/me`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update user context
      setUser(prev => ({ ...prev, full_name: formData.full_name }));

      toast({
        title: language === 'ar' ? 'تم التحديث' : language === 'en' ? 'Updated' : 'Mis à jour',
        description: language === 'ar' ? 'تم تحديث ملفك الشخصي بنجاح' : language === 'en' ? 'Your profile has been updated successfully' : 'Votre profil a été mis à jour avec succès',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : language === 'en' ? 'Error' : 'Erreur',
        description: language === 'ar' ? 'فشل تحديث الملف الشخصي' : language === 'en' ? 'Failed to update profile' : 'Échec de la mise à jour du profil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (formData.new_password !== formData.confirm_password) {
      toast({
        title: language === 'ar' ? 'خطأ' : language === 'en' ? 'Error' : 'Erreur',
        description: language === 'ar' ? 'كلمات المرور غير متطابقة' : language === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }

    if (formData.new_password.length < 6) {
      toast({
        title: language === 'ar' ? 'خطأ' : language === 'en' ? 'Error' : 'Erreur',
        description: language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : language === 'en' ? 'Password must be at least 6 characters' : 'Le mot de passe doit contenir au moins 6 caractères',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${API}/users/me/password`,
        {
          current_password: formData.current_password,
          new_password: formData.new_password
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));

      toast({
        title: language === 'ar' ? 'تم التحديث' : language === 'en' ? 'Updated' : 'Mis à jour',
        description: language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : language === 'en' ? 'Your password has been changed successfully' : 'Votre mot de passe a été changé avec succès',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : language === 'en' ? 'Error' : 'Erreur',
        description: error.response?.data?.detail || (language === 'ar' ? 'فشل تغيير كلمة المرور' : language === 'en' ? 'Failed to change password' : 'Échec du changement de mot de passe'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center text-gray-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {language === 'ar' ? 'العودة إلى الملف الشخصي' : language === 'en' ? 'Back to Profile' : 'Retour au Profil'}
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <User className="mr-3 text-amber-600" size={32} />
            {language === 'ar' ? 'إعدادات الحساب' : language === 'en' ? 'Account Settings' : 'Paramètres du compte'}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'ar' ? 
              'إدارة معلومات حسابك وكلمة المرور' : 
              language === 'en' ? 
              'Manage your account information and password' : 
              'Gérez vos informations de compte et votre mot de passe'}
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User size={24} className="mr-2 text-amber-600" />
            {language === 'ar' ? 'معلومات الملف الشخصي' : language === 'en' ? 'Profile Information' : 'Informations du profil'}
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم الكامل' : language === 'en' ? 'Full Name' : 'Nom complet'}
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                {language === 'ar' ? 'البريد الإلكتروني' : language === 'en' ? 'Email' : 'Email'}
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">
                {language === 'ar' ? 'لا يمكن تغيير البريد الإلكتروني' : language === 'en' ? 'Email cannot be changed' : 'L\'email ne peut pas être modifié'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الدور' : language === 'en' ? 'Role' : 'Rôle'}
              </label>
              <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role === 'admin' 
                    ? (language === 'ar' ? 'مسؤول' : language === 'en' ? 'Admin' : 'Administrateur')
                    : (language === 'ar' ? 'مستخدم' : language === 'en' ? 'User' : 'Utilisateur')
                  }
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  {language === 'ar' ? 'حفظ التغييرات' : language === 'en' ? 'Save Changes' : 'Enregistrer les modifications'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Lock size={24} className="mr-2 text-amber-600" />
            {language === 'ar' ? 'تغيير كلمة المرور' : language === 'en' ? 'Change Password' : 'Changer le mot de passe'}
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'كلمة المرور الحالية' : language === 'en' ? 'Current Password' : 'Mot de passe actuel'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => handleInputChange('current_password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'كلمة المرور الجديدة' : language === 'en' ? 'New Password' : 'Nouveau mot de passe'}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.new_password}
                  onChange={(e) => handleInputChange('new_password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'تأكيد كلمة المرور' : language === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-12"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                {language === 'ar' ? 
                  '• كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل' :
                  language === 'en' ?
                  '• Password must be at least 6 characters long' :
                  '• Le mot de passe doit contenir au moins 6 caractères'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Lock size={20} className="mr-2" />
                  {language === 'ar' ? 'تغيير كلمة المرور' : language === 'en' ? 'Change Password' : 'Changer le mot de passe'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
