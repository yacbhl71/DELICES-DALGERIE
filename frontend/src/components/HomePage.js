import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { ChefHat, ShoppingBag, BookOpen, ArrowRight, Star, Users, Award } from 'lucide-react';
import HeroSlider from './HeroSlider';

const HomePage = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: ChefHat,
      titleKey: 'recipes',
      descriptionFr: 'Découvrez les recettes traditionnelles algériennes transmises de génération en génération',
      descriptionAr: 'اكتشف الوصفات الجزائرية التقليدية المتوارثة عبر الأجيال',
      descriptionEn: 'Discover traditional Algerian recipes passed down through generations',
      link: '/recipes',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: ShoppingBag,
      titleKey: 'shop',
      descriptionFr: 'Explorez notre collection d\'épices, thés, robes kabyles et bijoux authentiques',
      descriptionAr: 'استكشف مجموعتنا من البهارات والشاي والفساتين القبائلية والمجوهرات الأصيلة',
      descriptionEn: 'Explore our collection of spices, teas, Kabyle dresses and authentic jewelry',
      link: '/shop',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: BookOpen,
      titleKey: 'history',
      descriptionFr: 'Plongez dans l\'histoire riche de l\'Algérie, de la Kabylie et de la vallée de Soumam',
      descriptionAr: 'اغوص في التاريخ الغني للجزائر وقبائل والوادي سومام',
      descriptionEn: 'Dive into the rich history of Algeria, Kabylie and the Soumam valley',
      link: '/history',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const stats = [
    { number: '50+', labelFr: 'Recettes Authentiques', labelAr: 'وصفة أصيلة', labelEn: 'Authentic Recipes' },
    { number: '200+', labelFr: 'Produits Traditionnels', labelAr: 'منتج تقليدي', labelEn: 'Traditional Products' },
    { number: '1000+', labelFr: 'Clients Satisfaits', labelAr: 'عميل راض', labelEn: 'Happy Customers' },
    { number: '100%', labelFr: 'Authenticité Garantie', labelAr: 'أصالة مضمونة', labelEn: 'Authenticity Guaranteed' }
  ];

  const getDescription = (feature) => {
    switch (language) {
      case 'ar': return feature.descriptionAr;
      case 'en': return feature.descriptionEn;
      default: return feature.descriptionFr;
    }
  };

  const getStatLabel = (stat) => {
    switch (language) {
      case 'ar': return stat.labelAr;
      case 'en': return stat.labelEn;
      default: return stat.labelFr;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Original Hero Section can be kept as fallback or removed */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-gradient">Soumam</span>
              {' '}
              <span className="text-gradient">Heritage</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              {t('discover')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/recipes" className="btn-primary inline-flex items-center">
                {t('exploreRecipes')}
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/shop" className="btn-secondary inline-flex items-center">
                {t('visitShop')}
                <ShoppingBag className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Cultural Pattern Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 cultural-pattern opacity-60"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'اكتشف تراثنا الغني' : 
               language === 'en' ? 'Discover Our Rich Heritage' : 
               'Découvrez Notre Riche Patrimoine'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ar' ? 'رحلة عبر النكهات والتقاليد والتاريخ الجزائري الأصيل' :
               language === 'en' ? 'A journey through authentic Algerian flavors, traditions and history' :
               'Un voyage à travers les saveurs, traditions et histoire authentiques algériennes'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card group cursor-pointer animate-fadeInUp" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {getDescription(feature)}
                    </p>
                    <Link
                      to={feature.link}
                      className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold group-hover:translate-x-2 transition-transform duration-300"
                    >
                      {language === 'ar' ? 'اكتشف المزيد' : 
                       language === 'en' ? 'Learn More' : 
                       'Découvrir'}
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-amber-100 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 font-medium">
                  {getStatLabel(stat)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Heritage Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1716823141581-12b24feb01ea" 
            alt="Kabyle culture"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'تراث قبائلي أصيل' :
                 language === 'en' ? 'Authentic Kabyle Heritage' :
                 'Patrimoine Kabyle Authentique'}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {language === 'ar' ? 'من منطقة أث ملكيتش وتازملت في وادي الصومام، نقدم لكم أجمل التقاليد والنكهات القبائلية الأصيلة.' :
                 language === 'en' ? 'From the region of Ath M\'lickech and Tazmalt in the Soumam valley, we bring you the most beautiful Kabyle traditions and authentic flavors.' :
                 'De la région d\'Ath M\'lickech et Tazmalt dans la vallée de Soumam, nous vous apportons les plus belles traditions et saveurs kabyles authentiques.'}
              </p>
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center">
                  <Star className="text-amber-500 mr-2" size={24} />
                  <span className="text-gray-700 font-medium">
                    {language === 'ar' ? 'جودة مضمونة' :
                     language === 'en' ? 'Quality Guaranteed' :
                     'Qualité Garantie'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="text-amber-500 mr-2" size={24} />
                  <span className="text-gray-700 font-medium">
                    {language === 'ar' ? 'تقاليد أصيلة' :
                     language === 'en' ? 'Authentic Traditions' :
                     'Traditions Authentiques'}
                  </span>
                </div>
              </div>
              <Link to="/history" className="btn-primary inline-flex items-center">
                {t('learnHistory')}
                <BookOpen className="ml-2" size={20} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <img 
                src="https://images.unsplash.com/photo-1713007009692-c055a4a5e2df"
                alt="Traditional Kabyle dress"
                className="w-full h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <img 
                src="https://images.unsplash.com/photo-1720718517204-a66cc17a1052"
                alt="Amazigh traditional dress"
                className="w-full h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'ar' ? 'انضم إلى عائلة سومام هيريتاج' :
             language === 'en' ? 'Join the Soumam Heritage Family' :
             'Rejoignez la Famille Soumam Heritage'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {language === 'ar' ? 'اكتشف أجمل النكهات والتقاليد الجزائرية الأصيلة' :
             language === 'en' ? 'Discover the most beautiful flavors and authentic Algerian traditions' :
             'Découvrez les plus belles saveurs et traditions algériennes authentiques'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth"
              className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
            >
              <Users className="mr-2" size={20} />
              {language === 'ar' ? 'إنشاء حساب' :
               language === 'en' ? 'Create Account' :
               'Créer un Compte'}
            </Link>
            <Link 
              to="/recipes"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors duration-200 inline-flex items-center justify-center"
            >
              <ChefHat className="mr-2" size={20} />
              {language === 'ar' ? 'تصفح الوصفات' :
               language === 'en' ? 'Browse Recipes' :
               'Parcourir les Recettes'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;