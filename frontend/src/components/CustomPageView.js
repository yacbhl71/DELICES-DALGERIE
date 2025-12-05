import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CustomPageView() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const response = await axios.get(`${API}/pages/${slug}`);
      setPage(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching page:', error);
      setError('Page non trouvée');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600">Page non trouvée</p>
        </div>
      </div>
    );
  }

  const title = page.title[language] || page.title.fr;
  const content = page.content[language] || page.content.fr;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#6B8E23] to-[#8B7355] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">{title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              lineHeight: '1.8'
            }}
          />
        </div>
      </div>
      
      <style jsx global>{`
        .prose h2 {
          color: #6B8E23;
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose h3 {
          color: #374151;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          color: #4B5563;
          margin-bottom: 1rem;
        }
        .prose ul, .prose ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose li {
          color: #4B5563;
          margin-bottom: 0.5rem;
        }
        .prose a {
          color: #6B8E23;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #5a7a1d;
        }
        .prose strong {
          color: #1F2937;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}