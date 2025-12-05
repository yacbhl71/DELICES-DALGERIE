import React from 'react';
import { useLanguage } from '../App';
import TestimonialForm from './TestimonialForm';
import TestimonialsSection from './TestimonialsSection';

export default function TestimonialsPage() {
  const { language } = useLanguage();

  const translations = {
    fr: {
      heroTitle: 'Témoignages Clients',
      heroSubtitle: 'Découvrez ce que nos clients pensent de nos produits',
    },
    en: {
      heroTitle: 'Customer Testimonials',
      heroSubtitle: 'Discover what our customers think about our products',
    },
    ar: {
      heroTitle: 'شهادات العملاء',
      heroSubtitle: 'اكتشف ما يعتقده عملاؤنا حول منتجاتنا',
    }
  };

  const t = translations[language] || translations.fr;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#6B8E23] to-[#8B7355] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t.heroTitle}</h1>
          <p className="text-xl opacity-90">{t.heroSubtitle}</p>
        </div>
      </div>

      {/* Testimonials Display */}
      <TestimonialsSection />

      {/* Submit Form */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <TestimonialForm />
        </div>
      </div>
    </div>
  );
}
