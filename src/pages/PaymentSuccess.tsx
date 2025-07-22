import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (sessionId) {
      verifyPayment();
    } else {
      setIsLoading(false);
    }
  }, [sessionId, user, navigate]);

  const verifyPayment = async () => {
    try {
      // Verificar se o pagamento foi processado
      const { data: payment, error } = await supabase
        .from('listing_payments')
        .select('*, listings(*)')
        .eq('stripe_session_id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching payment:', error);
        toast.error('Erro ao verificar pagamento');
        return;
      }

      setPaymentDetails(payment);
      toast.success('Pagamento confirmado! Seu anúncio está ativo.');
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Erro ao verificar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Seu anúncio premium foi ativado com sucesso e está agora visível para todos os visitantes.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pagamento</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Anúncio:</span>
                  <span className="font-medium">{paymentDetails.listings?.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium">US$ 9,90</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Pago</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">Ilimitada</span>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Benefícios Premium Ativos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-blue-800">Exposição ilimitada</span>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-blue-800">Destaque nos resultados</span>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-blue-800">Estatísticas detalhadas</span>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-blue-800">Suporte prioritário</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home size={20} />
              Voltar ao Início
            </Button>
            
            <Button
              onClick={() => navigate('/meus-anuncios')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User size={20} />
              Meus Anúncios
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Próximos Passos</h4>
            <p className="text-sm text-green-700">
              Seu anúncio está agora visível para todos os visitantes. 
              Você pode gerenciá-lo através da seção "Meus Anúncios" no seu perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 