import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Calendar, DollarSign, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
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
  is_paid: boolean;
  created_at: string;
  expires_at: string;
  images: string[];
}

const UserListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchListings();
  }, [user, navigate]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user?.id)
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

  const handleDelete = async (listingId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
      return;
    }

    setIsDeleting(listingId);

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) {
        throw error;
      }

      toast.success('Anúncio excluído com sucesso!');
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Erro ao excluir anúncio');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleRenew = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          status: 'pending_payment'
        })
        .eq('id', listingId);

      if (error) {
        throw error;
      }

      navigate(`/payment/${listingId}`);
    } catch (error) {
      console.error('Error renewing listing:', error);
      toast.error('Erro ao renovar anúncio');
    }
  };

  const getStatusBadge = (status: string, isPaid: boolean, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (isExpired) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expirado</span>;
    }
    
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Ativo</span>;
      case 'pending_payment':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Aguardando Pagamento</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Rascunho</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Expirado';
    } else if (diffDays === 1) {
      return '1 dia restante';
    } else {
      return `${diffDays} dias restantes`;
    }
  };

  const getStats = () => {
    const total = listings.length;
    const active = listings.filter(l => l.status === 'published' && new Date(l.expires_at) > new Date()).length;
    const pending = listings.filter(l => l.status === 'pending_payment').length;
    const expired = listings.filter(l => new Date(l.expires_at) <= new Date()).length;

    return { total, active, pending, expired };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Meus Anúncios</h1>
            <Link to="/criar-anuncio">
              <Button className="flex items-center gap-2">
                <Plus size={20} />
                Novo Anúncio
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Expirados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum anúncio encontrado</h3>
            <p className="text-gray-600 mb-6">Comece criando seu primeiro anúncio!</p>
            <Link to="/criar-anuncio">
              <Button>Criar Primeiro Anúncio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(listing.status, listing.is_paid, listing.expires_at)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">
                      R$ {listing.price.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {listing.category}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    <p>{listing.city}, {listing.state}</p>
                    <p>{getDaysRemaining(listing.expires_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/anuncio/${listing.id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={16} className="mr-1" />
                      Ver
                    </Link>

                    <Link
                      to={`/editar-anuncio/${listing.id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                      <Edit size={16} className="mr-1" />
                      Editar
                    </Link>

                    {listing.status === 'published' && !listing.is_paid && (
                      <button
                        onClick={() => handleRenew(listing.id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-800"
                      >
                        <DollarSign size={16} className="mr-1" />
                        Renovar
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={isDeleting === listing.id}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 size={16} className="mr-1" />
                      {isDeleting === listing.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListings;