import React, { useState } from 'react';
import { Search as SearchIcon, Filter, MapPin, DollarSign } from 'lucide-react';
import ListingFilter from '../components/listing/ListingFilter';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Mock data for demonstration
  const mockListings = [
    {
      id: '1',
      title: 'Casa em condomínio fechado',
      description: 'Linda casa com 3 quartos, 2 banheiros, garagem para 2 carros',
      price: 450000,
      location: 'São Paulo, SP',
      category: 'casa',
      images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg']
    },
    {
      id: '2',
      title: 'Carro usado em ótimo estado',
      description: 'Honda Civic 2018, completo, único dono',
      price: 85000,
      location: 'Rio de Janeiro, RJ',
      category: 'carro',
      images: ['https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg']
    },
    {
      id: '3',
      title: 'Terreno para construção',
      description: 'Terreno de 500m², plano, com documentação em dia',
      price: 180000,
      location: 'Belo Horizonte, MG',
      category: 'terreno',
      images: ['https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg']
    },
    {
      id: '4',
      title: 'Loja comercial',
      description: 'Loja de 80m² em local movimentado, ideal para comércio',
      price: 320000,
      location: 'Curitiba, PR',
      category: 'comercio',
      images: ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg']
    }
  ];

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Buscar Anúncios</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título, descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter size={20} className="mr-2" />
                Filtros
              </h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as categorias</option>
                  <option value="casa">Casas</option>
                  <option value="carro">Carros</option>
                  <option value="terreno">Terrenos</option>
                  <option value="comercio">Comércios</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de Preço
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Preço mínimo"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Preço máximo"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  placeholder="Cidade, estado..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredListings.length} anúncio{filteredListings.length !== 1 ? 's' : ''} encontrado{filteredListings.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-700">
                        R$ {listing.price.toLocaleString()}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={16} className="mr-1" />
                        {listing.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum anúncio encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;