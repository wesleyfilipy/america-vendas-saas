import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
}

const Payment: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchListing();
  }, [listingId, user, navigate]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Erro ao carregar anúncio');
      navigate('/meus-anuncios');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishFree = async () => {
    if (!listing) return;

    setIsProcessing(true);
    
    try {
      // Calcular data de expiração (1 dia grátis)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);

      const { error } = await supabase
        .from('listings')
        .update({
          status: 'published',
          expires_at: expiresAt.toISOString(),
          is_paid: false
        })
        .eq('id', listing.id)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      toast.success('Anúncio publicado gratuitamente por 1 dia!');
      navigate('/meus-anuncios');
    } catch (error) {
      console.error('Error publishing listing:', error);
      toast.error('Erro ao publicar anúncio');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishPremium = async () => {
    toast.error('Funcionalidade de pagamento premium em desenvolvimento. Use a opção gratuita por enquanto.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Anúncio não encontrado</h2>
          <Button onClick={() => navigate('/meus-anuncios')}>
            Voltar aos Meus Anúncios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Finalizar Publicação</h1>

          {/* Resumo do Anúncio */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo do Anúncio</h2>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Título:</span>
                <p className="text-gray-900">{listing.title}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Preço:</span>
                <p className="text-gray-900">R$ {listing.price.toLocaleString()}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Categoria:</span>
                <p className="text-gray-900">{listing.category}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Localização:</span>
                <p className="text-gray-900">
                  {listing.city && listing.state ? `${listing.city}, ${listing.state}` : 'Não informada'}
                </p>
              </div>
            </div>
          </div>

          {/* Opções de Publicação */}
          <div className="space-y-4">
            {/* Opção Gratuita */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Publicação Gratuita</h3>
                  <p className="text-gray-600">Ideal para testar a plataforma</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">Grátis</p>
                  <p className="text-sm text-gray-500">1 dia de exposição</p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Publicação imediata
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Visibilidade básica
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Suporte por email
                </li>
              </ul>
              
              <Button
                onClick={handlePublishFree}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Publicando...' : 'Publicar Gratuitamente'}
              </Button>
            </div>

            {/* Opção Premium */}
            <div className="border border-gray-200 rounded-lg p-6 opacity-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Publicação Premium</h3>
                  <p className="text-gray-600">Máxima exposição e recursos avançados</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">R$ 9,90</p>
                  <p className="text-sm text-gray-500">30 dias de exposição</p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Destaque na busca
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Estatísticas detalhadas
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Suporte prioritário
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Renovação automática
                </li>
              </ul>
              
              <Button
                onClick={handlePublishPremium}
                disabled={true}
                className="w-full bg-gray-400 cursor-not-allowed"
              >
                Em Breve
              </Button>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Dica</h4>
            <p className="text-sm text-blue-800">
              Comece com a publicação gratuita para testar a plataforma. 
              Você pode sempre fazer upgrade para premium depois!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 