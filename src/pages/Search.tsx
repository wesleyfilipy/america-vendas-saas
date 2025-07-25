import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, MapPin, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  state: string;
  status: string;
  images: string[];
  created_at: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Erro ao carregar anúncios');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'imoveis': 'Imóveis',
      'veiculos': 'Veículos',
      'eletronicos': 'Eletrônicos',
      'servicos': 'Serviços',
      'outros': 'Outros'
    };
    return labels[category] || category;
  };

  const filteredListings = listings.filter(listing => {
    // Filtro por busca
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoria
    const matchesCategory = !selectedCategory || listing.category === selectedCategory;
    
    // Filtro por preço mínimo
    const matchesMinPrice = !minPrice || listing.price >= parseFloat(minPrice);
    
    // Filtro por preço máximo
    const matchesMaxPrice = !maxPrice || listing.price <= parseFloat(maxPrice);
    
    // Filtro por localização
    const matchesLocation = !location || 
      (listing.city && listing.city.toLowerCase().includes(location.toLowerCase())) ||
      (listing.state && listing.state.toLowerCase().includes(location.toLowerCase()));
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesLocation;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
  };

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter size={20} className="mr-2" />
                  Filtros
                </h2>
                {(selectedCategory || minPrice || maxPrice || location) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Limpar
                  </button>
                )}
              </div>
              
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
                  <option value="imoveis">Imóveis</option>
                  <option value="veiculos">Veículos</option>
                  <option value="eletronicos">Eletrônicos</option>
                  <option value="servicos">Serviços</option>
                  <option value="outros">Outros</option>
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
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Preço máximo"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {filteredListings.length} anúncio{filteredListings.length !== 1 ? 's' : ''} encontrado{filteredListings.length !== 1 ? 's' : ''}
              </p>
              {(selectedCategory || minPrice || maxPrice || location) && (
                <div className="text-sm text-gray-500">
                  Filtros ativos
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <Link 
                    key={listing.id} 
                    to={`/anuncio/${listing.id}`}
                    className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gray-200">
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
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {getCategoryLabel(listing.category)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(listing.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
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
                          {listing.city && listing.state ? `${listing.city}, ${listing.state}` : 'Localização não informada'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && filteredListings.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum anúncio encontrado
                </h3>
                <p className="text-gray-500 mb-4">
                  Tente ajustar os filtros ou termos de busca
                </p>
                {(selectedCategory || minPrice || maxPrice || location) && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Limpar todos os filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;