import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye,
  Clock,
  Users,
  Star,
  Filter
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminRecipes = () => {
  const { language } = useLanguage();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { value: 'all', labelFr: 'Toutes', labelAr: 'الكل', labelEn: 'All' },
    { value: 'plats-principaux', labelFr: 'Plats principaux', labelAr: 'أطباق رئيسية', labelEn: 'Main dishes' },
    { value: 'soupes', labelFr: 'Soupes', labelAr: 'حساء', labelEn: 'Soups' },
    { value: 'desserts', labelFr: 'Desserts', labelAr: 'حلويات', labelEn: 'Desserts' },
    { value: 'entrees', labelFr: 'Entrées', labelAr: 'مقبلات', labelEn: 'Appetizers' }
  ];

  const difficulties = [
    { value: 'all', labelFr: 'Toutes', labelAr: 'الكل', labelEn: 'All' },
    { value: 'facile', labelFr: 'Facile', labelAr: 'سهل', labelEn: 'Easy' },
    { value: 'moyen', labelFr: 'Moyen', labelAr: 'متوسط', labelEn: 'Medium' },
    { value: 'difficile', labelFr: 'Difficile', labelAr: 'صعب', labelEn: 'Hard' }
  ];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الوصفة؟' :
                      language === 'en' ? 'Are you sure you want to delete this recipe?' :
                      'Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      try {
        await axios.delete(`${API}/recipes/${recipeId}`);
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert(language === 'ar' ? 'خطأ في حذف الوصفة' :
              language === 'en' ? 'Error deleting recipe' :
              'Erreur lors de la suppression de la recette');
      }
    }
  };

  const getLocalizedText = (textObj) => {
    return textObj?.[language] || textObj?.fr || '';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? getLocalizedText(cat) : category;
  };

  const getDifficultyLabel = (difficulty) => {
    const diff = difficulties.find(d => d.value === difficulty);
    return diff ? getLocalizedText(diff) : difficulty;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'facile': return 'text-green-600 bg-green-100';
      case 'moyen': return 'text-yellow-600 bg-yellow-100';
      case 'difficile': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const title = getLocalizedText(recipe.title).toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
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
            {language === 'ar' ? 'إدارة الوصفات' : language === 'en' ? 'Recipe Management' : 'Gestion des Recettes'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'إدارة وتعديل وصفات الطبخ الجزائري' :
             language === 'en' ? 'Manage and edit Algerian cooking recipes' :
             'Gérer et modifier les recettes de cuisine algérienne'}
          </p>
        </div>
        <a
          href="/admin/recipes/new"
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {language === 'ar' ? 'إضافة وصفة' : language === 'en' ? 'Add Recipe' : 'Ajouter Recette'}
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث عن وصفة...' :
                          language === 'en' ? 'Search for a recipe...' :
                          'Rechercher une recette...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {getCategoryLabel(category.value)}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {getDifficultyLabel(difficulty.value)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {language === 'ar' ? `${filteredRecipes.length} وصفة موجودة` :
           language === 'en' ? `${filteredRecipes.length} recipes found` :
           `${filteredRecipes.length} recettes trouvées`}
        </p>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img
                src={recipe.image_url}
                alt={getLocalizedText(recipe.title)}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546548970-71785318a17b';
                }}
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {getLocalizedText(recipe.title)}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {getLocalizedText(recipe.description)}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{recipe.prep_time + recipe.cook_time} min</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  <span>{recipe.servings} {language === 'ar' ? 'أشخاص' : language === 'en' ? 'people' : 'pers.'}</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-1 text-yellow-500" />
                  <span>4.8</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  {language === 'ar' ? 'الفئة:' : language === 'en' ? 'Category:' : 'Catégorie:'} 
                </span>
                <span className="text-sm font-medium text-gray-700 ml-2">
                  {getCategoryLabel(recipe.category)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <a
                  href={`/recipes/${recipe.id}`}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <Eye size={16} className="mr-2" />
                  {language === 'ar' ? 'عرض' : language === 'en' ? 'View' : 'Voir'}
                </a>
                <a
                  href={`/admin/recipes/edit/${recipe.id}`}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors duration-200"
                >
                  <Edit3 size={16} className="mr-2" />
                  {language === 'ar' ? 'تحرير' : language === 'en' ? 'Edit' : 'Modifier'}
                </a>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'لا توجد وصفات' :
             language === 'en' ? 'No recipes found' :
             'Aucune recette trouvée'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'ar' ? 'جرب تغيير معايير البحث أو أضف وصفة جديدة' :
             language === 'en' ? 'Try changing your search criteria or add a new recipe' :
             'Essayez de modifier vos critères de recherche ou ajoutez une nouvelle recette'}
          </p>
          <a
            href="/admin/recipes/new"
            className="btn-primary inline-flex items-center"
          >
            <Plus size={20} className="mr-2" />
            {language === 'ar' ? 'إضافة وصفة جديدة' : language === 'en' ? 'Add New Recipe' : 'Ajouter une Nouvelle Recette'}
          </a>
        </div>
      )}
    </div>
  );
};

export default AdminRecipes;