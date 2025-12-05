import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Eye, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../App';
import axios from 'axios';
import { useToast } from './ui/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminTestimonials() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/testimonials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les témoignages',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/testimonials/${id}`,
        { is_approved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Succès',
        description: 'Témoignage approuvé',
      });

      fetchTestimonials();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'approuver le témoignage',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/testimonials/${id}`,
        { is_approved: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Succès',
        description: 'Témoignage rejeté',
      });

      fetchTestimonials();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de rejeter le témoignage',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: 'Succès',
        description: 'Témoignage supprimé',
      });

      fetchTestimonials();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le témoignage',
        variant: 'destructive'
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'pending') return !t.is_approved;
    if (filter === 'approved') return t.is_approved;
    return true;
  });

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => !t.is_approved).length,
    approved: testimonials.filter(t => t.is_approved).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Témoignages</h1>
        <p className="text-gray-600">Modérez et gérez les avis de vos clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Eye className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-500" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approuvés</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'all'
              ? 'bg-[#6B8E23] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Tous ({stats.total})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          En attente ({stats.pending})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            filter === 'approved'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Approuvés ({stats.approved})
        </button>
      </div>

      {/* Testimonials List */}
      {filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Eye className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-600">Aucun témoignage dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-lg shadow p-6 ${
                !testimonial.is_approved ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{testimonial.customer_name}</h3>
                    {renderStars(testimonial.rating)}
                    <span className="text-sm font-semibold text-gray-600">{testimonial.rating}/5</span>
                  </div>
                  <p className="text-sm text-gray-600">{testimonial.customer_email}</p>
                  <p className="text-xs text-gray-500 mt-1">Soumis le {formatDate(testimonial.created_at)}</p>
                  {testimonial.is_approved && testimonial.approved_at && (
                    <p className="text-xs text-green-600 mt-1">
                      Approuvé le {formatDate(testimonial.approved_at)}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {testimonial.is_approved ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Approuvé
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      En attente
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 italic">"{testimonial.comment}"</p>
              </div>

              <div className="flex items-center space-x-3">
                {!testimonial.is_approved ? (
                  <button
                    onClick={() => handleApprove(testimonial.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <Check size={18} />
                    <span>Approuver</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleReject(testimonial.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    <X size={18} />
                    <span>Rejeter</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <Trash2 size={18} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
