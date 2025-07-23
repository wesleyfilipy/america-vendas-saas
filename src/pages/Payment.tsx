import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/env';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(config.stripe.publishableKey);

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

interface UserFreeUsage {
  freeListingsCount: number;
  canUseFree: boolean;
}

const Payment: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userFreeUsage, setUserFreeUsage] = useState<UserFreeUsage>({
    freeListingsCount: 0,
    canUseFree: true
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchListing();
    fetchUserFreeUsage();
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

  const fetchUserFreeUsage = async () => {
    try {
      const { data: freeListings, error } = await supabase
        .from('listings')
        .select('id')
        .eq('user_id', user?.id)
        .eq('is_paid', false)
        .eq('status', 'published');

      if (error) {
        console.error('Error fetching free usage:', error);
        return;
      }

      const freeListingsCount = freeListings?.length || 0;
      const canUseFree = freeListingsCount < 5;

      setUserFreeUsage({
        freeListingsCount,
        canUseFree
      });
    } catch (error) {
      console.error('Error fetching user free usage:', error);
    }
  };

  const handlePlanSelection = async (plan: 'free' | 'basic' | 'premium') => {
    if (!listing || !user) return;

    setIsProcessing(true);

    try {
      // Verificar se pode usar plano gratuito
      if (plan === 'free' && !userFreeUsage.canUseFree) {
        toast.error('Você já usou seus 5 dias gratuitos. Escolha um plano pago.');
        return;
      }

      if (plan === 'free') {
        // Ativar plano gratuito
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 5); // 5 dias

        const { error } = await supabase
          .from('listings')
          .update({
            status: 'published',
            expires_at: expiresAt.toISOString(),
            is_paid: false
          })
          .eq('id', listing.id)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        toast.success('Anúncio publicado gratuitamente por 5 dias!');
        navigate('/meus-anuncios');
        return;
      }

      // Para planos pagos, criar sessão do Stripe
      const response = await fetch('/functions/v1/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.supabase.anonKey}`
        },
        body: JSON.stringify({
          listingId: listing.id,
          userId: user.id,
          plan: plan
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar sessão de pagamento');
      }

      if (result.success && result.url) {
        // Redirecionar para Stripe Checkout
        window.location.href = result.url;
      } else {
        throw new Error('Erro ao processar pagamento');
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Escolha seu Plano</h1>

          {/* Resumo do Anúncio */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
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

          {/* Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plano Gratuito */}
            <div className={`border-2 rounded-lg p-6 ${userFreeUsage.canUseFree ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 opacity-75'}`}>
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Gratuito</h3>
                <p className="text-3xl font-bold text-green-600">R$ 0</p>
                <p className="text-sm text-gray-500">5 dias de exposição</p>
              </div>
              
              <ul className="space-y-2 mb-6">
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
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {userFreeUsage.freeListingsCount}/5 usados
                </li>
              </ul>
              
              <Button
                onClick={() => handlePlanSelection('free')}
                disabled={!userFreeUsage.canUseFree || isProcessing}
                className={`w-full ${userFreeUsage.canUseFree ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {isProcessing ? 'Processando...' : userFreeUsage.canUseFree ? 'Publicar Gratuitamente' : 'Limite Atingido'}
              </Button>
            </div>

            {/* Plano Básico */}
            <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Básico</h3>
                <p className="text-3xl font-bold text-blue-600">R$ 19,90</p>
                <p className="text-sm text-gray-500">30 dias de exposição</p>
              </div>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Destaque na busca
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Estatísticas básicas
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Suporte prioritário
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Renovação manual
                </li>
              </ul>
              
              <Button
                onClick={() => handlePlanSelection('basic')}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? 'Processando...' : 'Escolher Básico'}
              </Button>
            </div>

            {/* Plano Premium */}
            <div className="border-2 border-purple-500 rounded-lg p-6 bg-purple-50">
              <div className="text-center mb-4">
                <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mb-2 inline-block">
                  MAIS POPULAR
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Premium</h3>
                <p className="text-3xl font-bold text-purple-600">R$ 49,90</p>
                <p className="text-sm text-gray-500">1 ano de exposição</p>
              </div>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Destaque máximo
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Estatísticas avançadas
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Suporte VIP
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Renovação automática
                </li>
              </ul>
              
              <Button
                onClick={() => handlePlanSelection('premium')}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? 'Processando...' : 'Escolher Premium'}
              </Button>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Informações Importantes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Você pode usar até 5 anúncios gratuitos</li>
              <li>• Planos pagos incluem destaque e estatísticas</li>
              <li>• Pagamentos processados com segurança pelo Stripe</li>
              <li>• Renovação automática disponível no plano Premium</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 