import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

interface MockListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  status: 'active' | 'pending' | 'expired';
  created_at: string;
  images: string[];
}

const UserListings: React.FC = () => {
  const [listings, setListings] = useState<MockListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchUserListings = async () => {
      setLoading(true);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockListings: MockListing[] = [
        {
          id: '1',
          title: 'Casa em condomínio fechado',
          description: 'Linda casa com 3 quartos, 2 banheiros, garagem para 2 carros',
          price: 450000,
          location: 'São Paulo, SP',
          category: 'casa',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg']
        },
        {
          id: '2',
          title: 'Carro usado em ótimo estado',
          description: 'Honda Civic 2018, completo, único dono',
          price: 85000,
          location: 'Rio de Janeiro, RJ',
          category: 'carro',
          status: 'active',
          created_at: '2024-01-14T15:20:00Z',
          images: ['https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg']
        },
        {
          id: '3',
          title: 'Terreno para construção',
          description: 'Terreno de 500m², plano, com documentação em dia',
          price: 180000,
          location: 'Belo Horizonte, MG',
          category: 'terreno',
          status: 'pending',
          created_at: '2024-01-13T09:15:00Z',
          images: ['https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg']
        }
      ];
      
      setListings(mockListings);
      setLoading(false);
    };

    fetchUserListings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'expired': return 'Expirado';
      default: return 'Desconhecido';
    }
  };

  const handleDeleteListing = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
      setListings(listings.filter(listing => listing.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seus anúncios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800">
              <ArrowLeft size={20} className="mr-2" />
              Voltar ao início
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Meus Anúncios</h1>
            <Link to="/criar-anuncio">
              <Button className="flex items-center">
                <Plus size={16} className="mr-2" />
                Novo Anúncio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 font-semibold">{listings.length}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Anúncios</p>
                  <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-green-600 font-semibold">
                    {listings.filter(l => l.status === 'active').length}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Anúncios Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {listings.filter(l => l.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-yellow-600 font-semibold">
                    {listings.filter(l => l.status === 'pending').length}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {listings.filter(l => l.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Você ainda não tem anúncios
              </h3>
              <p className="text-gray-500 mb-6">
                Comece criando seu primeiro anúncio para vender ou alugar.
              </p>
              <Link to="/criar-anuncio">
                <Button>
                  <Plus size={16} className="mr-2" />
                  Criar Primeiro Anúncio
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  
                  {/* Status badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                      {getStatusLabel(listing.status)}
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

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-blue-700">
                      R$ {listing.price.toLocaleString()}
                    </span>
                    
                    <span className="text-sm text-gray-500">
                      {new Date(listing.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/anuncio/${listing.id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                    >
                      <Eye size={16} className="mr-1" />
                      Ver
                    </Link>
                    
                    <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md">
                      <Edit size={16} className="mr-1" />
                      Editar
                    </button>
                    
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demonstração:</h3>
            <p className="text-sm text-blue-700">
              Esta é uma página de demonstração. Os dados são simulados para fins de apresentação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListings;