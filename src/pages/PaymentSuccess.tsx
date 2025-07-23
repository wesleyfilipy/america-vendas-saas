import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PaymentDetails {
  listingId: string;
  plan: string;
  amount: number;
  status: string;
}

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        // Buscar detalhes do anúncio baseado na sessão
        const { data: listing, error } = await supabase
          .from('listings')
          .select('*')
          .eq('payment_session_id', sessionId)
          .single();

        if (error || !listing) {
          console.error('Error fetching listing:', error);
          setIsLoading(false);
          return;
        }

        setPaymentDetails({
          listingId: listing.id,
          plan: listing.plan_type || 'unknown',
          amount: listing.price || 0,
          status: listing.payment_status || 'completed'
        });

      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Plano Básico';
      case 'premium': return 'Plano Premium';
      case 'free': return 'Plano Gratuito';
      default: return 'Plano';
    }
  };

  const getPlanDuration = (plan: string) => {
    switch (plan) {
      case 'basic': return '30 dias';
      case 'premium': return '1 ano';
      case 'free': return '5 dias';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Seu anúncio foi publicado com sucesso e está agora visível para todos os visitantes.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Detalhes do Pagamento
              </h2>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plano:</span>
                  <span className="font-medium">{getPlanName(paymentDetails.plan)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{getPlanDuration(paymentDetails.plan)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">
                    {paymentDetails.status}
                  </span>
                </div>
                
                {paymentDetails.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-medium">
                      R$ {(paymentDetails.amount / 100).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Próximos Passos
            </h3>
            <ul className="text-left space-y-2 text-blue-800">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Seu anúncio está visível na página inicial
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Receba notificações de interessados
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Gerencie seu anúncio no painel do usuário
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Ir para Página Inicial
              </Button>
            </Link>
            
            <Link to="/meus-anuncios">
              <Button variant="secondary" className="w-full sm:w-auto">
                <User className="h-4 w-4 mr-2" />
                Meus Anúncios
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Recebemos seu pagamento com sucesso. Em caso de dúvidas, entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 