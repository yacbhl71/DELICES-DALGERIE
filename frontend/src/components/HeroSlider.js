import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function HeroSlider() {
  const { language } = useLanguage();
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API}/banners`);
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (textObj) => {
    if (!textObj) return '';
    return textObj[language] || textObj.fr || textObj.en || '';
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentSlide];

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={banner.image_url}
                alt={getLocalizedText(banner.title)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                {banner.subtitle && getLocalizedText(banner.subtitle) && (
                  <p className="text-lg md:text-xl font-medium mb-4 text-[#D4AF37] animate-fade-in">
                    {getLocalizedText(banner.subtitle)}
                  </p>
                )}
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-slide-up">
                  {getLocalizedText(banner.title)}
                </h1>

                {banner.description && getLocalizedText(banner.description) && (
                  <p className="text-lg md:text-xl mb-8 text-gray-200 animate-fade-in-delay">
                    {getLocalizedText(banner.description)}
                  </p>
                )}

                {banner.cta_text && getLocalizedText(banner.cta_text) && banner.cta_link && (
                  <Link
                    to={banner.cta_link}
                    className="inline-block px-8 py-4 bg-[#6B8E23] text-white font-semibold rounded-lg hover:bg-[#5a7a1d] transform hover:scale-105 transition-all duration-300 shadow-lg animate-fade-in-delay-2"
                  >
                    {getLocalizedText(banner.cta_text)}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeft size={32} className="text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRight size={32} className="text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-12 h-3 bg-[#D4AF37]'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
