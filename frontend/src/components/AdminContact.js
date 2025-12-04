import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Trash2, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminContact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, new, read, replied

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/contact-messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API}/admin/contact-messages/${messageId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ));
      
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/contact-messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMessages(messages.filter(msg => msg.id !== messageId));
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Erreur lors de la suppression du message');
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <Clock className="text-blue-500" size={16} />;
      case 'read':
        return <Eye className="text-yellow-500" size={16} />;
      case 'replied':
        return <CheckCircle className="text-green-500" size={16} />;
      default:
        return <XCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new':
        return 'Nouveau';
      case 'read':
        return 'Lu';
      case 'replied':
        return 'Répondu';
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages de Contact</h1>
        <p className="text-gray-600">Gérez les demandes de contact des clients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <Mail className="text-gray-400" size={32} />
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Nouveaux</p>
              <p className="text-2xl font-bold text-blue-900">{messages.filter(m => m.status === 'new').length}</p>
            </div>
            <Clock className="text-blue-400" size={32} />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Lus</p>
              <p className="text-2xl font-bold text-yellow-900">{messages.filter(m => m.status === 'read').length}</p>
            </div>
            <Eye className="text-yellow-400" size={32} />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Répondus</p>
              <p className="text-2xl font-bold text-green-900">{messages.filter(m => m.status === 'replied').length}</p>
            </div>
            <CheckCircle className="text-green-400" size={32} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        {['all', 'new', 'read', 'replied'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              filter === filterOption
                ? 'border-[#6B8E23] text-[#6B8E23]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {filterOption === 'all' ? 'Tous' : getStatusText(filterOption)}
            <span className="ml-2 text-sm">
              ({filterOption === 'all' ? messages.length : messages.filter(m => m.status === filterOption).length})
            </span>
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Cards */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Mail className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">Aucun message dans cette catégorie</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedMessage?.id === message.id ? 'ring-2 ring-[#6B8E23]' : ''
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (message.status === 'new') {
                    updateMessageStatus(message.id, 'read');
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeClass(message.status)}`}>
                    {getStatusIcon(message.status)}
                    {getStatusText(message.status)}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">{message.subject}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(message.created_at).toLocaleString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:sticky lg:top-6">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Détails du message</h2>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom</label>
                  <p className="text-gray-900">{selectedMessage.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">
                    <a href={`mailto:${selectedMessage.email}`} className="text-[#6B8E23] hover:underline">
                      {selectedMessage.email}
                    </a>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Sujet</label>
                  <p className="text-gray-900">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Message</label>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {selectedMessage.message}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Date de réception</label>
                  <p className="text-gray-900">
                    {new Date(selectedMessage.created_at).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Statut</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'new')}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedMessage.status === 'new'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Nouveau
                    </button>
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedMessage.status === 'read'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Lu
                    </button>
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedMessage.status === 'replied'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Répondu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Mail className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-600">Sélectionnez un message pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
