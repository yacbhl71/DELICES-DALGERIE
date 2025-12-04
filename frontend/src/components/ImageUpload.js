import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ImageUpload = ({ 
  onUploadComplete, 
  existingImages = [], 
  maxImages = 5,
  label = "Images"
}) => {
  const [images, setImages] = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(`${API}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return `${BACKEND_URL}${response.data.url}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleFileSelect = async (files) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: "Limite dépassée",
        description: `Vous ne pouvez télécharger que ${maxImages} images maximum`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      
      if (onUploadComplete) {
        onUploadComplete(newImages);
      }

      toast({
        title: "Succès",
        description: `${uploadedUrls.length} image(s) téléchargée(s) avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec du téléchargement de l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    if (onUploadComplete) {
      onUploadComplete(newImages);
    }

    toast({
      title: "Image supprimée",
      description: "L'image a été retirée de la liste",
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({images.length}/{maxImages})
      </label>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
            <p className="text-gray-600">Téléchargement en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Glissez-déposez des images ici ou cliquez pour sélectionner
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, WEBP jusqu'à 10MB
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucune image téléchargée</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
