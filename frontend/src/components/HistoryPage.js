import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { BookOpen, MapPin, Calendar, Users, Mountain } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HistoryPage = () => {
  const { t, language } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('algerie');
  const [historicalContent, setHistoricalContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample historical content - adapted for Délices et Trésors d'Algérie
  const sampleContent = [
    {
      id: '1',
      title: {
        fr: 'Les Trésors Gastronomiques d\'Algérie',
        ar: 'كنوز الجزائر الغذائية',
        en: 'Algeria\'s Gastronomic Treasures'
      },
      content: {
        fr: 'L\'Algérie, terre bénie par un climat méditerranéen et un soleil généreux, produit depuis des millénaires des trésors gastronomiques reconnus mondialement. Les dattes Deglet Nour, surnommées "les doigts de lumière", et les huiles d\'olive de Kabylie incarnent la richesse agricole et le savoir-faire ancestral algérien. Ces produits d\'exception, cultivés avec passion et respect des traditions, sont le fruit d\'un terroir unique et d\'une histoire millénaire.',
        ar: 'الجزائر، أرض مباركة بمناخ متوسطي وشمس سخية، تنتج منذ آلاف السنين كنوزاً غذائية معترف بها عالمياً. تمور دقلة نور، الملقبة بـ "أصابع النور"، وزيوت الزيتون القبائلية تجسد الثراء الزراعي والخبرة التقليدية الجزائرية. هذه المنتجات الاستثنائية، المزروعة بشغف واحترام للتقاليد، هي ثمرة تربة فريدة وتاريخ ألفي.',
        en: 'Algeria, blessed with a Mediterranean climate and generous sunshine, has produced world-renowned gastronomic treasures for millennia. Deglet Nour dates, nicknamed "fingers of light", and Kabyle olive oils embody Algerian agricultural wealth and ancestral know-how. These exceptional products, cultivated with passion and respect for traditions, are the fruit of a unique terroir and thousand-year history.'
      },
      region: 'algerie',
      image_urls: ['https://images.unsplash.com/photo-1646486087126-20435bad3b76']
    },
    {
      id: '2',
      title: {
        fr: 'L\'Or Liquide de Kabylie : L\'Huile d\'Olive',
        ar: 'الذهب السائل للقبائل: زيت الزيتون',
        en: 'Kabylie\'s Liquid Gold: Olive Oil'
      },
      content: {
        fr: 'La Kabylie, région montagneuse du nord de l\'Algérie, est réputée depuis l\'Antiquité pour ses oliveraies millénaires. L\'huile d\'olive kabyle, notamment la variété Chemlal, est un trésor de la gastronomie algérienne. Produite selon des méthodes traditionnelles transmises de génération en génération, cette huile d\'exception au goût fruité et équilibré est reconnue pour ses qualités nutritionnelles exceptionnelles. Chaque goutte raconte l\'histoire des villages berbères perchés sur les collines, où le respect de la nature et du savoir-faire ancestral préserve l\'authenticité du produit.',
        ar: 'القبائل، المنطقة الجبلية في شمال الجزائر، مشهورة منذ العصور القديمة بأشجار الزيتون الألفية. زيت الزيتون القبائلي، وخاصة صنف الشملال، هو كنز من فنون الطهي الجزائرية. يتم إنتاج هذا الزيت الاستثنائي ذو المذاق الفاكهي المتوازن وفقاً لأساليب تقليدية منقولة من جيل إلى جيل، ومعترف به بخصائصه الغذائية الاستثنائية. كل قطرة تروي قصة القرى البربرية المطلة على التلال، حيث يحافظ احترام الطبيعة والمهارة التقليدية على أصالة المنتج.',
        en: 'Kabylie, the mountainous region of northern Algeria, has been renowned since Antiquity for its thousand-year-old olive groves. Kabyle olive oil, notably the Chemlal variety, is a treasure of Algerian gastronomy. Produced according to traditional methods passed down from generation to generation, this exceptional oil with its fruity and balanced taste is recognized for its exceptional nutritional qualities. Each drop tells the story of Berber villages perched on hills, where respect for nature and ancestral know-how preserve the authenticity of the product.'
      },
      region: 'kabylie',
      image_urls: ['https://images.unsplash.com/photo-1716823141581-12b24feb01ea']
    },
    {
      id: '3',
      title: {
        fr: 'Les Dattes Deglet Nour : Reine du Désert',
        ar: 'تمور دقلة نور: ملكة الصحراء',
        en: 'Deglet Nour Dates: Queen of the Desert'
      },
      content: {
        fr: 'Les dattes Deglet Nour, cultivées dans les oasis du Sahara algérien, sont considérées comme les meilleures dattes au monde. Leur nom signifie "doigt de lumière" en arabe, faisant référence à leur couleur translucide dorée lorsqu\'elles sont mûres. Ces dattes semi-molles, à la texture fondante et au goût délicatement sucré, sont le résultat de millénaires de culture phoenicicole dans les palmeraies du Sud algérien. Riches en fibres, vitamines et minéraux, les dattes Deglet Nour sont un symbole de générosité du désert et incarnent l\'hospitalité algérienne. Chaque datte est récoltée à la main avec soin, perpétuant un savoir-faire ancestral qui fait la fierté du terroir algérien.',
        ar: 'تمور دقلة نور، المزروعة في واحات الصحراء الجزائرية، تعتبر من أفضل التمور في العالم. يعني اسمها "إصبع النور" بالعربية، في إشارة إلى لونها الذهبي الشفاف عندما تنضج. هذه التمور شبه الطرية، ذات القوام الذائب والمذاق الحلو الرقيق، هي نتيجة آلاف السنين من زراعة النخيل في واحات جنوب الجزائر. غنية بالألياف والفيتامينات والمعادن، تمور دقلة نور هي رمز لكرم الصحراء وتجسد الضيافة الجزائرية. يتم قطف كل تمرة يدوياً بعناية، مما يديم المهارة التقليدية التي تفخر بها التربة الجزائرية.',
        en: 'Deglet Nour dates, grown in the oases of the Algerian Sahara, are considered the finest dates in the world. Their name means "finger of light" in Arabic, referring to their translucent golden color when ripe. These semi-soft dates, with their melting texture and delicately sweet taste, are the result of millennia of date palm cultivation in the palm groves of southern Algeria. Rich in fiber, vitamins and minerals, Deglet Nour dates are a symbol of the desert\'s generosity and embody Algerian hospitality. Each date is carefully hand-picked, perpetuating ancestral know-how that is the pride of the Algerian terroir.'
      },
      region: 'vallee-soumam',
      image_urls: ['https://images.pexels.com/photos/21847351/pexels-photo-21847351.jpeg']
    }
  ];

  const regions = [
    {
      value: 'algerie',
      labelFr: 'Algérie',
      labelAr: 'الجزائر',
      labelEn: 'Algeria',
      icon: MapPin,
      color: 'from-green-500 to-red-500'
    },
    {
      value: 'kabylie',
      labelFr: 'Kabylie',
      labelAr: 'القبائل',
      labelEn: 'Kabylie',
      icon: Mountain,
      color: 'from-blue-500 to-green-500'
    },
    {
      value: 'vallee-soumam',
      labelFr: 'Vallée de Soumam',
      labelAr: 'وادي الصومام',
      labelEn: 'Soumam Valley',
      icon: Users,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  useEffect(() => {
    fetchHistoricalContent();
  }, [selectedRegion]);

  const fetchHistoricalContent = async () => {
    try {
      const response = await axios.get(`${API}/historical-content`, {
        params: { region: selectedRegion !== 'all' ? selectedRegion : undefined }
      });
      if (response.data.length === 0) {
        setHistoricalContent(sampleContent.filter(item => item.region === selectedRegion));
      } else {
        setHistoricalContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching historical content:', error);
      setHistoricalContent(sampleContent.filter(item => item.region === selectedRegion));
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (textObj) => {
    return textObj[language] || textObj.fr || '';
  };

  const getRegionLabel = (region) => {
    // Handle both string values and objects with value property
    const regValue = typeof region === 'string' ? region : region?.value;
    const reg = regions.find(r => r.value === regValue);
    if (!reg) return regValue || '';
    return getLocalizedText(reg);
  };

  const getCurrentRegion = () => regions.find(r => r.value === selectedRegion);

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
              {language === 'ar' ? 'تاريخ وتراث الجزائر' :
               language === 'en' ? 'History and Heritage of Algeria' :
               'Histoire et Patrimoine de l\'Algérie'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ar' ? 'اكتشف التاريخ الغني للجزائر والقبائل ووادي الصومام' :
               language === 'en' ? 'Discover the rich history of Algeria, Kabylie and the Soumam valley' :
               'Découvrez l\'histoire riche de l\'Algérie, la Kabylie et la vallée de Soumam'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Region Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {regions.map((region, index) => {
            const Icon = region.icon;
            const isSelected = selectedRegion === region.value;
            
            return (
              <button
                key={region.value}
                onClick={() => setSelectedRegion(region.value)}
                className={`p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 animate-fadeInUp ${
                  isSelected
                    ? `bg-gradient-to-r ${region.color} text-white shadow-xl`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon size={48} className={`mx-auto mb-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                <h3 className="text-xl font-bold mb-2">
                  {getLocalizedText(region)}
                </h3>
                {isSelected && (
                  <p className="text-sm opacity-90">
                    {language === 'ar' ? 'المحدد حالياً' :
                     language === 'en' ? 'Currently selected' :
                     'Actuellement sélectionné'}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Display */}
        <div className="space-y-8">
          {historicalContent.map((content, index) => (
            <div
              key={content.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeInUp"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  {content.image_urls && content.image_urls[0] && (
                    <img
                      src={content.image_urls[0]}
                      alt={getLocalizedText(content.title)}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>
                
                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-amber-600 font-medium text-sm uppercase tracking-wide">
                      {getRegionLabel(content.region)}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {getLocalizedText(content.title)}
                  </h2>
                  
                  <div className="prose prose-lg text-gray-600 leading-relaxed">
                    <p>{getLocalizedText(content.content)}</p>
                  </div>

                  <div className="flex items-center mt-8 pt-6 border-t border-gray-200">
                    <Calendar size={20} className="text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">
                      {language === 'ar' ? 'تاريخ عريق' :
                       language === 'en' ? 'Ancient history' :
                       'Histoire millénaire'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {historicalContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'قريباً محتوى جديد' :
               language === 'en' ? 'More content coming soon' :
               'Contenu à venir bientôt'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' ? 'نعمل على إضافة المزيد من المحتوى التاريخي' :
               language === 'en' ? 'We are working on adding more historical content' :
               'Nous travaillons sur l\'ajout de plus de contenu historique'}
            </p>
          </div>
        )}

        {/* Cultural Heritage Section */}
        <div className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-8 lg:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {language === 'ar' ? 'تراث ثقافي غني' :
                 language === 'en' ? 'Rich Cultural Heritage' :
                 'Riche Patrimoine Culturel'}
              </h2>
              <p className="text-lg mb-6 opacity-90">
                {language === 'ar' ? 'من التقاليد الأمازيغية القديمة إلى الفنون والحرف المعاصرة، يحتفظ تراثنا بروح الأجداد وحكمة الأجيال.' :
                 language === 'en' ? 'From ancient Amazigh traditions to contemporary arts and crafts, our heritage preserves the spirit of ancestors and the wisdom of generations.' :
                 'Des traditions amazighes anciennes aux arts et métiers contemporains, notre patrimoine préserve l\'esprit des ancêtres et la sagesse des générations.'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">2000+</div>
                  <div className="text-sm opacity-80">
                    {language === 'ar' ? 'سنة من التاريخ' :
                     language === 'en' ? 'Years of History' :
                     'Années d\'Histoire'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm opacity-80">
                    {language === 'ar' ? 'تقليد محفوظ' :
                     language === 'en' ? 'Preserved Traditions' :
                     'Traditions Préservées'}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1713007009692-c055a4a5e2df"
                alt="Traditional dress"
                className="w-full h-40 object-cover rounded-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1720718517204-a66cc17a1052"
                alt="Jewelry"
                className="w-full h-40 object-cover rounded-xl mt-8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;