import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import { 
  Save, 
  X, 
  Plus, 
  Minus, 
  Upload,
  Image as ImageIcon,
  Clock,
  Users,
  ChefHat
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminRecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recipe, setRecipe] = useState({
    title: { fr: '', ar: '', en: '' },
    description: { fr: '', ar: '', en: '' },
    ingredients: { fr: [''], ar: [''], en: [''] },
    instructions: { fr: [''], ar: [''], en: [''] },
    image_url: '',
    prep_time: 15,
    cook_time: 30,
    servings: 4,
    difficulty: 'facile',
    category: 'plats-principaux'
  });

  const categories = [
    { value: 'plats-principaux', labelFr: 'Plats principaux', labelAr: 'أطباق رئيسية', labelEn: 'Main dishes' },
    { value: 'soupes', labelFr: 'Soupes', labelAr: 'حساء', labelEn: 'Soups' },
    { value: 'desserts', labelFr: 'Desserts', labelAr: 'حلويات', labelEn: 'Desserts' },
    { value: 'entrees', labelFr: 'Entrées', labelAr: 'مقبلات', labelEn: 'Appetizers' }
  ];

  const difficulties = [
    { value: 'facile', labelFr: 'Facile', labelAr: 'سهل', labelEn: 'Easy' },
    { value: 'moyen', labelFr: 'Moyen', labelAr: 'متوسط', labelEn: 'Medium' },
    { value: 'difficile', labelFr: 'Difficile', labelAr: 'صعب', labelEn: 'Hard' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchRecipe();
    }
  }, [id, isEdit]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      alert('Erreur lors du chargement de la recette');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, lang, value) => {
    if (lang) {
      setRecipe(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setRecipe(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayChange = (field, lang, index, value) => {
    setRecipe(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: prev[field][lang].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addArrayItem = (field, lang) => {
    setRecipe(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: [...prev[field][lang], '']
      }
    }));
  };

  const removeArrayItem = (field, lang, index) => {
    if (recipe[field][lang].length > 1) {
      setRecipe(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: prev[field][lang].filter((_, i) => i !== index)
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const recipeData = {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image_url: recipe.image_url || 'https://images.unsplash.com/photo-1546548970-71785318a17b',
        prep_time: parseInt(recipe.prep_time),
        cook_time: parseInt(recipe.cook_time),
        servings: parseInt(recipe.servings),
        difficulty: recipe.difficulty,
        category: recipe.category
      };

      if (isEdit) {
        await axios.put(`${API}/recipes/${id}`, recipeData);
      } else {
        await axios.post(`${API}/recipes`, recipeData);
      }

      alert(isEdit ? 'Recette mise à jour avec succès!' : 'Recette créée avec succès!');
      navigate('/admin/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Erreur lors de la sauvegarde de la recette');
    } finally {
      setSaving(false);
    }
  };

  const getLocalizedLabel = (item) => {
    return item[`label${language.charAt(0).toUpperCase() + language.slice(1)}`] || item.labelFr;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 
              (language === 'ar' ? 'تحرير الوصفة' : language === 'en' ? 'Edit Recipe' : 'Modifier la Recette') :
              (language === 'ar' ? 'إضافة وصفة جديدة' : language === 'en' ? 'Add New Recipe' : 'Ajouter une Nouvelle Recette')
            }
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar' ? 'املأ النموذج لإنشاء أو تحديث وصفة' :
             language === 'en' ? 'Fill out the form to create or update a recipe' :
             'Remplissez le formulaire pour créer ou mettre à jour une recette'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/recipes')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X size={20} className="mr-2" />
          {language === 'ar' ? 'إلغاء' : language === 'en' ? 'Cancel' : 'Annuler'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ChefHat className="mr-2" size={24} />
            {language === 'ar' ? 'معلومات أساسية' : language === 'en' ? 'Basic Information' : 'Informations de Base'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Titles */}
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang} className="space-y-2">
                <label className="form-label">
                  {language === 'ar' ? 'العنوان' : language === 'en' ? 'Title' : 'Titre'} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={recipe.title[lang]}
                  onChange={(e) => handleInputChange('title', lang, e.target.value)}
                  className="form-input"
                  required
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Descriptions */}
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang} className="space-y-2">
                <label className="form-label">
                  {language === 'ar' ? 'الوصف' : language === 'en' ? 'Description' : 'Description'} ({lang.toUpperCase()})
                </label>
                <textarea
                  value={recipe.description[lang]}
                  onChange={(e) => handleInputChange('description', lang, e.target.value)}
                  className="form-input min-h-24"
                  required
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image and Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ImageIcon className="mr-2" size={24} />
            {language === 'ar' ? 'الصورة والتفاصيل' : language === 'en' ? 'Image and Details' : 'Image et Détails'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image URL */}
            <div className="space-y-2">
              <label className="form-label">
                {language === 'ar' ? 'رابط الصورة' : language === 'en' ? 'Image URL' : 'URL de l\'image'}
              </label>
              <input
                type="url"
                value={recipe.image_url}
                onChange={(e) => handleInputChange('image_url', null, e.target.value)}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg mt-2"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546548970-71785318a17b';
                  }}
                />
              )}
            </div>

            {/* Recipe Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="form-label flex items-center">
                  <Clock size={16} className="mr-1" />
                  {language === 'ar' ? 'وقت التحضير (دقيقة)' : language === 'en' ? 'Prep Time (min)' : 'Temps de préparation (min)'}
                </label>
                <input
                  type="number"
                  value={recipe.prep_time}
                  onChange={(e) => handleInputChange('prep_time', null, e.target.value)}
                  className="form-input"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="form-label flex items-center">
                  <Clock size={16} className="mr-1" />
                  {language === 'ar' ? 'وقت الطبخ (دقيقة)' : language === 'en' ? 'Cook Time (min)' : 'Temps de cuisson (min)'}
                </label>
                <input
                  type="number"
                  value={recipe.cook_time}
                  onChange={(e) => handleInputChange('cook_time', null, e.target.value)}
                  className="form-input"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="form-label flex items-center">
                  <Users size={16} className="mr-1" />
                  {language === 'ar' ? 'عدد الأشخاص' : language === 'en' ? 'Servings' : 'Portions'}
                </label>
                <input
                  type="number"
                  value={recipe.servings}
                  onChange={(e) => handleInputChange('servings', null, e.target.value)}
                  className="form-input"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="form-label">
                  {language === 'ar' ? 'الصعوبة' : language === 'en' ? 'Difficulty' : 'Difficulté'}
                </label>
                <select
                  value={recipe.difficulty}
                  onChange={(e) => handleInputChange('difficulty', null, e.target.value)}
                  className="form-input"
                  required
                >
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value}>
                      {getLocalizedLabel(diff)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="form-label">
              {language === 'ar' ? 'الفئة' : language === 'en' ? 'Category' : 'Catégorie'}
            </label>
            <select
              value={recipe.category}
              onChange={(e) => handleInputChange('category', null, e.target.value)}
              className="form-input max-w-xs"
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {getLocalizedLabel(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {language === 'ar' ? 'المكونات' : language === 'en' ? 'Ingredients' : 'Ingrédients'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang} className="space-y-4">
                <h3 className="font-medium text-gray-700">
                  {language === 'ar' ? 'المكونات' : language === 'en' ? 'Ingredients' : 'Ingrédients'} ({lang.toUpperCase()})
                </h3>
                {recipe.ingredients[lang].map((ingredient, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleArrayChange('ingredients', lang, index, e.target.value)}
                      className="form-input flex-1"
                      placeholder={`${language === 'ar' ? 'مكون' : language === 'en' ? 'Ingredient' : 'Ingrédient'} ${index + 1}`}
                      required
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', lang, index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      disabled={recipe.ingredients[lang].length === 1}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients', lang)}
                  className="w-full flex items-center justify-center py-2 text-amber-600 hover:bg-amber-50 rounded-lg border-2 border-dashed border-amber-300"
                >
                  <Plus size={16} className="mr-2" />
                  {language === 'ar' ? 'إضافة مكون' : language === 'en' ? 'Add Ingredient' : 'Ajouter Ingrédient'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {language === 'ar' ? 'التعليمات' : language === 'en' ? 'Instructions' : 'Instructions'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['fr', 'ar', 'en'].map(lang => (
              <div key={lang} className="space-y-4">
                <h3 className="font-medium text-gray-700">
                  {language === 'ar' ? 'التعليمات' : language === 'en' ? 'Instructions' : 'Instructions'} ({lang.toUpperCase()})
                </h3>
                {recipe.instructions[lang].map((instruction, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm text-gray-600">
                      {language === 'ar' ? 'الخطوة' : language === 'en' ? 'Step' : 'Étape'} {index + 1}
                    </label>
                    <div className="flex space-x-2">
                      <textarea
                        value={instruction}
                        onChange={(e) => handleArrayChange('instructions', lang, index, e.target.value)}
                        className="form-input min-h-20 flex-1"
                        placeholder={`${language === 'ar' ? 'الخطوة' : language === 'en' ? 'Step' : 'Étape'} ${index + 1}`}
                        required
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('instructions', lang, index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg self-start"
                        disabled={recipe.instructions[lang].length === 1}
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('instructions', lang)}
                  className="w-full flex items-center justify-center py-2 text-amber-600 hover:bg-amber-50 rounded-lg border-2 border-dashed border-amber-300"
                >
                  <Plus size={16} className="mr-2" />
                  {language === 'ar' ? 'إضافة خطوة' : language === 'en' ? 'Add Step' : 'Ajouter Étape'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 bg-white rounded-xl shadow-lg p-6">
          <button
            type="button"
            onClick={() => navigate('/admin/recipes')}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {language === 'ar' ? 'إلغاء' : language === 'en' ? 'Cancel' : 'Annuler'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center px-6 py-3 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save size={20} className="mr-2" />
            )}
            {saving ? 
              (language === 'ar' ? 'جاري الحفظ...' : language === 'en' ? 'Saving...' : 'Sauvegarde...') :
              (isEdit ? 
                (language === 'ar' ? 'تحديث الوصفة' : language === 'en' ? 'Update Recipe' : 'Mettre à jour') :
                (language === 'ar' ? 'إنشاء الوصفة' : language === 'en' ? 'Create Recipe' : 'Créer la recette')
              )
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRecipeForm;