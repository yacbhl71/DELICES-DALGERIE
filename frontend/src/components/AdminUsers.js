import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { 
  Users, 
  Search, 
  Edit3, 
  Trash2, 
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminUsers = () => {
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);

  const roles = [
    { value: 'all', labelFr: 'Tous', labelAr: 'الكل', labelEn: 'All' },
    { value: 'user', labelFr: 'Utilisateur', labelAr: 'مستخدم', labelEn: 'User' },
    { value: 'admin', labelFr: 'Administrateur', labelAr: 'مدير', labelEn: 'Admin' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`${API}/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(language === 'ar' ? 'خطأ في تحديث دور المستخدم' :
            language === 'en' ? 'Error updating user role' :
            'Erreur lors de la mise à jour du rôle');
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      await axios.put(`${API}/admin/users/${userId}`, { is_active: isActive });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: isActive } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(language === 'ar' ? 'خطأ في تحديث حالة المستخدم' :
            language === 'en' ? 'Error updating user status' :
            'Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' :
                      language === 'en' ? 'Are you sure you want to delete this user?' :
                      'Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`${API}/admin/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(language === 'ar' ? 'خطأ في حذف المستخدم' :
              language === 'en' ? 'Error deleting user' :
              'Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const getRoleLabel = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj[`label${language.charAt(0).toUpperCase() + language.slice(1)}`] || roleObj.labelFr : role;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    
    switch (language) {
      case 'ar':
        return date.toLocaleDateString('ar-DZ', options);
      case 'en':
        return date.toLocaleDateString('en-US', options);
      default:
        return date.toLocaleDateString('fr-FR', options);
    }
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

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
            {language === 'ar' ? 'إدارة المستخدمين' : language === 'en' ? 'User Management' : 'Gestion des Utilisateurs'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'إدارة حسابات المستخدمين والأدوار' :
             language === 'en' ? 'Manage user accounts and roles' :
             'Gérer les comptes utilisateurs et les rôles'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث عن مستخدم...' :
                          language === 'en' ? 'Search for a user...' :
                          'Rechercher un utilisateur...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {getRoleLabel(role.value)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {language === 'ar' ? `${filteredUsers.length} مستخدم موجود` :
           language === 'en' ? `${filteredUsers.length} users found` :
           `${filteredUsers.length} utilisateurs trouvés`}
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'المستخدم' : language === 'en' ? 'User' : 'Utilisateur'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'الدور' : language === 'en' ? 'Role' : 'Rôle'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'الحالة' : language === 'en' ? 'Status' : 'Statut'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'تاريخ الانضمام' : language === 'en' ? 'Join Date' : 'Date d\'inscription'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'ar' ? 'الإجراءات' : language === 'en' ? 'Actions' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {user.full_name}
                          {user.role === 'admin' && (
                            <Crown size={16} className="ml-2 text-amber-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail size={14} className="mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="user">{getRoleLabel('user')}</option>
                        <option value="admin">{getRoleLabel('admin')}</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                        onClick={() => setEditingUser(user.id)}
                      >
                        <Shield size={12} className="mr-1" />
                        {getRoleLabel(user.role)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(user.id, !user.is_active)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <CheckCircle size={12} className="mr-1" />
                          {language === 'ar' ? 'نشط' : language === 'en' ? 'Active' : 'Actif'}
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="mr-1" />
                          {language === 'ar' ? 'غير نشط' : language === 'en' ? 'Inactive' : 'Inactif'}
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(user.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                        className="text-amber-600 hover:text-amber-900 p-1 rounded-lg hover:bg-amber-50"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'لا يوجد مستخدمون' :
             language === 'en' ? 'No users found' :
             'Aucun utilisateur trouvé'}
          </h3>
          <p className="text-gray-500">
            {language === 'ar' ? 'جرب تغيير معايير البحث' :
             language === 'en' ? 'Try changing your search criteria' :
             'Essayez de modifier vos critères de recherche'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;