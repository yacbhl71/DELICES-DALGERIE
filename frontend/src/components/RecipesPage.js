import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { Clock, Users, ChefHat, Star, Search, Filter } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const RecipesPage = () => {
  const { t, language } = useLanguage();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Sample data for initial display
  const sampleRecipes = [
    {
      id: '1',
      title: {
        fr: 'Couscous aux légumes',
        ar: 'كسكس بالخضار',
        en: 'Vegetable Couscous'
      },
      description: {
        fr: 'Le plat traditionnel algérien par excellence, préparé avec des légumes de saison',
        ar: 'الطبق الجزائري التقليدي الأصيل، محضر بخضار الموسم',
        en: 'The quintessential traditional Algerian dish, prepared with seasonal vegetables'
      },
      image_url: 'https://images.unsplash.com/photo-1739217744880-472f59559cc5',
      prep_time: 30,
      cook_time: 90,
      servings: 6,
      difficulty: 'moyen',
      category: 'plats-principaux',
      ingredients: {
        fr: ['500g de semoule de couscous', '2 courgettes', '2 carottes', '1 navet', '400g de pois chiches', 'Épices ras el hanout'],
        ar: ['500غ سميد كسكس', '2 كوسة', '2 جزر', '1 لفت', '400غ حمص', 'خليط بهارات راس الحانوت'],
        en: ['500g couscous semolina', '2 zucchini', '2 carrots', '1 turnip', '400g chickpeas', 'Ras el hanout spice mix']
      }
    },
    {
      id: '2',
      title: {
        fr: 'Tajine de poulet aux olives',
        ar: 'طاجين دجاج بالزيتون',
        en: 'Chicken Tagine with Olives'
      },
      description: {
        fr: 'Un plat savoureux mijoté avec des olives vertes et des épices traditionnelles',
        ar: 'طبق لذيذ مطبوخ مع الزيتون الأخضر والبهارات التقليدية',
        en: 'A flavorful dish simmered with green olives and traditional spices'
      },
      image_url: 'https://images.unsplash.com/photo-1689245780587-a9a6725718b1',
      prep_time: 20,
      cook_time: 60,
      servings: 4,
      difficulty: 'facile',
      category: 'plats-principaux'
    },
    {
      id: '3',
      title: {
        fr: 'Chorba algérienne',
        ar: 'شوربة جزائرية',
        en: 'Algerian Chorba'
      },
      description: {
        fr: 'Soupe traditionnelle riche en légumes, parfaite pour rompre le jeûne',
        ar: 'حساء تقليدي غني بالخضار، مثالي لكسر الصيام',
        en: 'Traditional vegetable-rich soup, perfect for breaking the fast'
      },
      image_url: 'https://images.unsplash.com/photo-1746274394124-141a1d1c5af3',
      prep_time: 15,
      cook_time: 45,
      servings: 6,
      difficulty: 'facile',
      category: 'soupes'
    }
  ];

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
      if (response.data.length === 0) {
        setRecipes(sampleRecipes);
      } else {
        setRecipes(response.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes(sampleRecipes);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (textObj) => {
    return textObj[language] || textObj.fr || '';
  };

  const getCategoryLabel = (category) => {
    // Handle both string values and objects with value property
    const catValue = typeof category === 'string' ? category : category?.value;
    const cat = categories.find(c => c.value === catValue);
    if (!cat) return catValue || '';
    return getLocalizedText(cat);
  };

  const getDifficultyLabel = (difficulty) => {
    // Handle both string values and objects with value property
    const diffValue = typeof difficulty === 'string' ? difficulty : difficulty?.value;
    const diff = difficulties.find(d => d.value === diffValue);
    if (!diff) return diffValue || '';
    return getLocalizedText(diff);
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'وصفات الطبخ الجزائري' :
               language === 'en' ? 'Algerian Cooking Recipes' :
               'Recettes de Cuisine Algérienne'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ar' ? 'اكتشف أشهى الأطباق التقليدية الجزائرية والقبائلية' :
               language === 'en' ? 'Discover the most delicious traditional Algerian and Kabyle dishes' :
               'Découvrez les plus délicieux plats traditionnels algériens et kabyles'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    {getCategoryLabel(category)}
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
                    {getDifficultyLabel(difficulty)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {language === 'ar' ? `${filteredRecipes.length} وصفة موجودة` :
             language === 'en' ? `${filteredRecipes.length} recipes found` :
             `${filteredRecipes.length} recettes trouvées`}
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className="recipe-card animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={recipe.image_url}
                  alt={getLocalizedText(recipe.title)}
                  className="recipe-image"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {getDifficultyLabel(recipe.difficulty)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
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

                {recipe.ingredients && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'ar' ? 'المكونات:' :
                       language === 'en' ? 'Ingredients:' :
                       'Ingrédients:'}
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {getLocalizedText(recipe.ingredients).slice(0, 3).map((ingredient, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          {ingredient}
                        </li>
                      ))}
                      {getLocalizedText(recipe.ingredients).length > 3 && (
                        <li className="text-amber-600 font-medium">
                          +{getLocalizedText(recipe.ingredients).length - 3} {language === 'ar' ? 'المزيد' : language === 'en' ? 'more' : 'autres'}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <button className="w-full btn-primary flex items-center justify-center">
                  <ChefHat className="mr-2" size={18} />
                  {language === 'ar' ? 'عرض الوصفة' :
                   language === 'en' ? 'View Recipe' :
                   'Voir la recette'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد وصفات' :
               language === 'en' ? 'No recipes found' :
               'Aucune recette trouvée'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' ? 'جرب تغيير معايير البحث' :
               language === 'en' ? 'Try changing your search criteria' :
               'Essayez de modifier vos critères de recherche'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;