import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import axios from 'axios';
import NewsletterSection from './NewsletterSection';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Footer = () => {
  const { language } = useLanguage();
  const [footerSettings, setFooterSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await axios.get(`${API}/footer`);
      setFooterSettings(response.data);
    } catch (error) {
      console.error('Error fetching footer settings:', error);
      // Use default footer if API fails
      setFooterSettings({
        about_text: {
          fr: 'Découvrez l\'authenticité des produits algériens : dattes, huile d\'olive, épices et bien plus.',
          en: 'Discover the authenticity of Algerian products: dates, olive oil, spices and more.',
          ar: 'اكتشف أصالة المنتجات الجزائرية: التمور، زيت الزيتون، البهارات والمزيد.'
        },
        social_links: [
          { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
          { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' }
        ],
        footer_links: [
          {
            title: { fr: 'Liens rapides', en: 'Quick Links', ar: 'روابط سريعة' },
            links: [
              { label: { fr: 'Boutique', en: 'Shop', ar: 'المتجر' }, url: '/shop' },
              { label: { fr: 'À propos', en: 'About', ar: 'حول' }, url: '/history' },
              { label: { fr: 'Contact', en: 'Contact', ar: 'اتصل' }, url: '/contact' }
            ]
          }
        ],
        copyright_text: {
          fr: '© 2024 Délices et Trésors d\'Algérie. Tous droits réservés.',
          en: '© 2024 Délices et Trésors d\'Algérie. All rights reserved.',
          ar: '© 2024 لذائذ وكنوز الجزائر. جميع الحقوق محفوظة.'
        },
        contact_info: {
          email: 'contact@delices-algerie.com',
          phone: '+213 XX XX XX XX',
          address: { fr: 'Algérie', en: 'Algeria', ar: 'الجزائر' }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (textObj) => {
    if (!textObj) return '';
    return textObj[language] || textObj.fr || textObj.en || '';
  };

  const getSocialIcon = (iconName) => {
    const icons = {
      facebook: <Facebook size={20} />,
      instagram: <Instagram size={20} />,
      twitter: <Twitter size={20} />
    };
    return icons[iconName.toLowerCase()] || <ExternalLink size={20} />;
  };

  if (loading || !footerSettings) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Newsletter Section */}
      <NewsletterSection />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-bold text-[#D4AF37] hover:text-[#c9a135] transition-colors cursor-pointer">
                Délices et Trésors
              </h3>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              {getLocalizedText(footerSettings.about_text)}
            </p>
            
            {/* Social Links */}
            {footerSettings.social_links && footerSettings.social_links.length > 0 && (
              <div className="flex items-center space-x-4 pt-4">
                {footerSettings.social_links.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#6B8E23] flex items-center justify-center hover:bg-[#5a7a1d] transition-colors duration-200"
                    aria-label={social.name}
                  >
                    {getSocialIcon(social.icon)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer Links Columns */}
          {footerSettings.footer_links && footerSettings.footer_links.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              <h4 className="text-lg font-semibold text-[#D4AF37]">
                {getLocalizedText(column.title)}
              </h4>
              <ul className="space-y-2">
                {column.links && column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.url.startsWith('http') ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-200 text-sm flex items-center"
                      >
                        {getLocalizedText(link.label)}
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    ) : (
                      <Link
                        to={link.url}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-200 text-sm"
                      >
                        {getLocalizedText(link.label)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          {footerSettings.contact_info && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#D4AF37]">
                {language === 'ar' ? 'اتصل بنا' : language === 'en' ? 'Contact Us' : 'Contactez-nous'}
              </h4>
              <ul className="space-y-3">
                {footerSettings.contact_info.email && (
                  <li className="flex items-center space-x-3 text-gray-300 text-sm">
                    <Mail size={18} className="text-[#6B8E23]" />
                    <a href={`mailto:${footerSettings.contact_info.email}`} className="hover:text-[#D4AF37]">
                      {footerSettings.contact_info.email}
                    </a>
                  </li>
                )}
                {footerSettings.contact_info.phone && (
                  <li className="flex items-center space-x-3 text-gray-300 text-sm">
                    <Phone size={18} className="text-[#6B8E23]" />
                    <a href={`tel:${footerSettings.contact_info.phone}`} className="hover:text-[#D4AF37]">
                      {footerSettings.contact_info.phone}
                    </a>
                  </li>
                )}
                {footerSettings.contact_info.address && (
                  <li className="flex items-center space-x-3 text-gray-300 text-sm">
                    <MapPin size={18} className="text-[#6B8E23]" />
                    <span>{getLocalizedText(footerSettings.contact_info.address)}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {getLocalizedText(footerSettings.copyright_text)}
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/page/privacy" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                {language === 'ar' ? 'سياسة الخصوصية' : language === 'en' ? 'Privacy Policy' : 'Politique de confidentialité'}
              </Link>
              <Link to="/page/terms" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                {language === 'ar' ? 'شروط الاستخدام' : language === 'en' ? 'Terms of Use' : 'Conditions d\'utilisation'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
