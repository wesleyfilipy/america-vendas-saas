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

  const handlePayment = async () => {
    if (!listing || !user) return;

    setIsProcessing(true);

    try {
      // Criar sessão de pagamento
      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          userId: user.id,
          amount: config.stripe.premiumAmount, // $9.90 em centavos
          title: listing.title,
          priceId: config.stripe.premiumPriceId
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar sessão de pagamento');
      }

      const { sessionId } = await response.json();

      // Redirecionar para Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe não carregado');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipPayment = async () => {
    if (!listing) return;

    try {
      // Atualizar anúncio para status grátis (1 dia)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);

      const { error } = await supabase
        .from('listings')
        .update({
          status: 'published',
          expires_at: expiresAt.toISOString(),
          is_paid: false
        })
        .eq('id', listing.id);

      if (error) {
        throw error;
      }

      toast.success('Anúncio publicado gratuitamente por 1 dia!');
      navigate('/meus-anuncios');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Erro ao atualizar anúncio');
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
                <span className="font-medium text-gray-700">Categoria:</span>
                <p className="text-gray-900 capitalize">{listing.category}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Localização:</span>
                <p className="text-gray-900">{listing.city}, {listing.state}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Preço:</span>
                <p className="text-gray-900">R$ {listing.price.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>

          {/* Opções de Pagamento */}
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Escolha sua opção:</h3>
              
              {/* Opção Premium */}
              <div className="border-2 border-blue-500 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">Publicação Premium</h4>
                    <p className="text-gray-600">Exposição ilimitada</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">US$ 9,90</p>
                    <p className="text-sm text-gray-500">Pagamento único</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Exposição ilimitada
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Destaque nos resultados
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Estatísticas detalhadas
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Suporte prioritário
                  </li>
                </ul>
                
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? 'Processando...' : 'Pagar US$ 9,90'}
                </Button>
              </div>

              {/* Opção Grátis */}
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">Publicação Grátis</h4>
                    <p className="text-gray-600">Exposição por 1 dia</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-600">Grátis</p>
                    <p className="text-sm text-gray-500">1 dia de exposição</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Exposição por 1 dia
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-gray-400 mr-2">✗</span>
                    Sem destaque
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-gray-400 mr-2">✗</span>
                    Sem estatísticas
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <span className="text-gray-400 mr-2">✗</span>
                    Suporte básico
                  </li>
                </ul>
                
                <Button
                  onClick={handleSkipPayment}
                  variant="outline"
                  className="w-full"
                >
                  Publicar Grátis
                </Button>
              </div>
            </div>
          </div>

          {/* Informações de Segurança */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Pagamento Seguro</h4>
            <p className="text-sm text-green-700">
              Seus dados de pagamento são protegidos com criptografia SSL. 
              Processamos pagamentos através do Stripe, líder mundial em segurança de pagamentos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 