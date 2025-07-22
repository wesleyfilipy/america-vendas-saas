import React, { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';
import Button from '../ui/Button';

interface FilterOptions {
  category: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  sortBy: string;
}

interface ListingFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const ListingFilter: React.FC<ListingFilterProps> = ({ onFilterChange, onClearFilters }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'newest'
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'newest');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter size={20} className="mr-2" />
          Filtros
        </h2>
        
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <X size={16} className="mr-1" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faixa de Preço
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Máximo"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          <input
            type="text"
            placeholder="Cidade, estado..."
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtros Rápidos
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('category', 'casa')}
              className={`px-3 py-1 text-sm rounded-full border ${
                filters.category === 'casa'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Casas
            </button>
            <button
              onClick={() => handleFilterChange('category', 'carro')}
              className={`px-3 py-1 text-sm rounded-full border ${
                filters.category === 'carro'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Carros
            </button>
            <button
              onClick={() => handleFilterChange('category', 'terreno')}
              className={`px-3 py-1 text-sm rounded-full border ${
                filters.category === 'terreno'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Terrenos
            </button>
            <button
              onClick={() => handleFilterChange('category', 'comercio')}
              className={`px-3 py-1 text-sm rounded-full border ${
                filters.category === 'comercio'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Comércios
            </button>
          </div>
        </div>

        {/* Price Ranges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Faixas de Preço
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                handleFilterChange('minPrice', '0');
                handleFilterChange('maxPrice', '50000');
              }}
              className="px-3 py-1 text-sm rounded-full border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            >
              Até R$ 50k
            </button>
            <button
              onClick={() => {
                handleFilterChange('minPrice', '50000');
                handleFilterChange('maxPrice', '200000');
              }}
              className="px-3 py-1 text-sm rounded-full border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            >
              R$ 50k - 200k
            </button>
            <button
              onClick={() => {
                handleFilterChange('minPrice', '200000');
                handleFilterChange('maxPrice', '500000');
              }}
              className="px-3 py-1 text-sm rounded-full border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            >
              R$ 200k - 500k
            </button>
            <button
              onClick={() => {
                handleFilterChange('minPrice', '500000');
                handleFilterChange('maxPrice', '');
              }}
              className="px-3 py-1 text-sm rounded-full border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            >
              Acima de R$ 500k
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingFilter;