import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { ShoppingBag, BookOpen, Sparkles, Award, Leaf, Heart } from 'lucide-react';
import HeroSlider from './HeroSlider';

const HomePageNew = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: ShoppingBag,
      titleFr: 'Dattes Deglet Nour',
      titleAr: 'تمور دقلة نور',
      titleEn: 'Deglet Nour Dates',
      descFr: 'Les meilleures dattes d\'Algérie, sucrées et naturelles',
      descAr: 'أفضل التمور من الجزائر، حلوة وطبيعية',
      descEn: 'The finest dates from Algeria, sweet and natural',
      link: '/shop',
      gradient: 'from-amber-500 via-yellow-600 to-orange-600',
      image: 'https://images.unsplash.com/photo-1577003833154-a2c9f9b51c06?w=800'
    },
    {
      icon: Leaf,
      titleFr: 'Huile d\'Olive',
      titleAr: 'زيت الزيتون',
      titleEn: 'Olive Oil',
      descFr: 'Huiles d\'olive premium de Kabylie - Chemlal et traditionnelles',
      descAr: 'زيوت زيتون ممتازة من القبائل',
      descEn: 'Premium olive oils from Kabylia - Chemlal and traditional',
      link: '/shop',
      gradient: 'from-green-600 via-olive to-emerald-700',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'
    },
    {
      icon: BookOpen,
      titleFr: 'Notre Histoire',
      titleAr: 'تاريخنا',
      titleEn: 'Our Story',
      descFr: 'Découvrez l\'histoire des dattes et huiles d\'olive algériennes',
      descAr: 'اكتشف تاريخ التمور وزيت الزيتون الجزائري',
      descEn: 'Discover the history of Algerian dates and olive oils',
      link: '/history',
      gradient: 'from-brown via-amber-700 to-yellow-800',
      image: 'https://images.unsplash.com/photo-1509428051548-31f2c70f31eb?w=800'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slider - Dynamic banners from admin panel */}
      <HeroSlider />

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 
                'منتجاتنا المميزة' :
                language === 'en' ?
                'Our Premium Products' :
                'Nos Produits d\'Exception'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ar' ?
                'اكتشف أجود المنتجات الجزائرية الطبيعية' :
                language === 'en' ?
                'Discover the finest natural Algerian products' :
                'Découvrez les meilleurs produits naturels algériens'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const title = language === 'ar' ? feature.titleAr : language === 'en' ? feature.titleEn : feature.titleFr;
              const desc = language === 'ar' ? feature.descAr : language === 'en' ? feature.descEn : feature.descFr;

              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Image Background */}
                  <div className="absolute inset-0">
                    <img
                      src={feature.image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 h-80 flex flex-col justify-end text-white">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Icon size={32} />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-3 group-hover:text-gold transition-colors duration-300">
                      {title}
                    </h3>
                    
                    <p className="text-lg text-white text-opacity-90 mb-4">
                      {desc}
                    </p>
                    
                    <div className="flex items-center text-white font-semibold group-hover:text-gold transition-colors duration-300">
                      <span className="mr-2">
                        {language === 'ar' ? 'اكتشف المزيد' : language === 'en' ? 'Learn More' : 'En savoir plus'}
                      </span>
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-olive-light via-green-100 to-gold-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 
                'لماذا تختارنا' :
                language === 'en' ?
                'Why Choose Us' :
                'Pourquoi Nous Choisir'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-olive to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {language === 'ar' ? 'جودة ممتازة' : language === 'en' ? 'Premium Quality' : 'Qualité Premium'}
              </h3>
              <p className="text-gray-600 text-center">
                {language === 'ar' ?
                  'منتجات مختارة بعناية من أفضل المزارعين' :
                  language === 'en' ?
                  'Carefully selected products from the best farmers' :
                  'Produits soigneusement sélectionnés des meilleurs producteurs'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Leaf className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {language === 'ar' ? '100٪ طبيعي' : language === 'en' ? '100% Natural' : '100% Naturel'}
              </h3>
              <p className="text-gray-600 text-center">
                {language === 'ar' ?
                  'بدون إضافات أو مواد حافظة اصطناعية' :
                  language === 'en' ?
                  'No additives or artificial preservatives' :
                  'Sans additifs ni conservateurs artificiels'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-brown to-amber-800 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {language === 'ar' ? 'تراث أصيل' : language === 'en' ? 'Authentic Heritage' : 'Héritage Authentique'}
              </h3>
              <p className="text-gray-600 text-center">
                {language === 'ar' ?
                  'تقاليد عريقة تعود لقرون من الزمن' :
                  language === 'en' ?
                  'Centuries-old traditions and heritage' :
                  'Traditions séculaires et héritage authentique'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-olive via-green-700 to-brown text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gold rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {language === 'ar' ?
              'ابدأ رحلتك مع منتجاتنا الأصيلة' :
              language === 'en' ?
              'Start Your Journey with Our Authentic Products' :
              'Commencez Votre Voyage avec Nos Produits Authentiques'}
          </h2>
          
          <p className="text-xl mb-8 text-white text-opacity-90">
            {language === 'ar' ?
              'اطلب الآن واستمتع بأفضل المنتجات الجزائرية' :
              language === 'en' ?
              'Order now and enjoy the finest Algerian products' :
              'Commandez maintenant et profitez des meilleurs produits algériens'}
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center px-10 py-5 bg-white text-olive font-bold rounded-full hover:bg-gold hover:text-white transition-all duration-300 text-lg shadow-2xl transform hover:scale-105"
          >
            <ShoppingBag className="mr-3" size={28} />
            {language === 'ar' ? 'تسوق الآن' : language === 'en' ? 'Shop Now' : 'Commander Maintenant'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePageNew;
