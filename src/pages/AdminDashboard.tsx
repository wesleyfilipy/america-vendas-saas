import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, DollarSign, TrendingUp, ArrowLeft, Eye, Trash2, Edit } from 'lucide-react';
import Button from '../components/ui/Button';

interface MockListing {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'pending' | 'expired';
  created_at: string;
  user: {
    name: string;
    email: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [listings, setListings] = useState<MockListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockListings: MockListing[] = [
        {
          id: '1',
          title: 'Casa em condomínio fechado',
          price: 450000,
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          user: { name: 'João Silva', email: 'joao@email.com' }
        },
        {
          id: '2',
          title: 'Carro usado em ótimo estado',
          price: 85000,
          status: 'active',
          created_at: '2024-01-14T15:20:00Z',
          user: { name: 'Maria Santos', email: 'maria@email.com' }
        },
        {
          id: '3',
          title: 'Terreno para construção',
          price: 180000,
          status: 'pending',
          created_at: '2024-01-13T09:15:00Z',
          user: { name: 'Pedro Costa', email: 'pedro@email.com' }
        },
        {
          id: '4',
          title: 'Loja comercial',
          price: 320000,
          status: 'expired',
          created_at: '2024-01-10T14:45:00Z',
          user: { name: 'Ana Oliveira', email: 'ana@email.com' }
        }
      ];
      
      setListings(mockListings);
      
      // Calculate stats
      setStats({
        totalListings: mockListings.length,
        activeListings: mockListings.filter(l => l.status === 'active').length,
        pendingListings: mockListings.filter(l => l.status === 'pending').length,
        totalRevenue: mockListings.reduce((sum, l) => sum + (l.status === 'active' ? 5 : 0), 0) // R$5 per active listing
      });
      
      setLoading(false);
    };

    fetchData();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
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
              Voltar ao site
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Anúncios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Anúncios Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingListings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Gerenciar Anúncios</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anúncio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {listing.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {listing.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {listing.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {listing.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {listing.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                        {getStatusLabel(listing.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(listing.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demonstração:</h3>
            <p className="text-sm text-blue-700">
              Este é um painel administrativo de demonstração. Os dados são simulados para fins de apresentação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;