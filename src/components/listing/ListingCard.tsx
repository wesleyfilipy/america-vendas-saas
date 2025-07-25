import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  created_at: string;
  images: string[];
}

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const categoryLabels: Record<string, string> = {
    'carro': 'Carro',
    'casa': 'Casa',
    'terreno': 'Terreno',
    'comercio': 'Comércio'
  };

  const categoryColors: Record<string, string> = {
    'carro': 'bg-blue-100 text-blue-800',
    'casa': 'bg-green-100 text-green-800',
    'terreno': 'bg-yellow-100 text-yellow-800',
    'comercio': 'bg-purple-100 text-purple-800'
  };

  return (
    <Link to={`/anuncio/${listing.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="h-48 bg-gray-200 relative">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Sem imagem</span>
            </div>
          )}
          
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[listing.category] || 'bg-gray-100 text-gray-800'}`}>
              {categoryLabels[listing.category] || listing.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {listing.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {listing.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-blue-700">
              R$ {listing.price.toLocaleString()}
            </span>
            
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={16} className="mr-1" />
              {listing.location}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {new Date(listing.created_at).toLocaleDateString('pt-BR')}
            </div>
            
            <div className="flex items-center text-blue-600 hover:text-blue-800">
              <Eye size={16} className="mr-1" />
              Ver detalhes
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;