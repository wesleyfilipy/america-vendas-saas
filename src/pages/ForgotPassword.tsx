import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate password reset process
      console.log('Password reset request for:', data.email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, always succeed
      setIsSuccess(true);
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Erro ao enviar email de recuperação. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800">
              <ArrowLeft size={20} className="mr-2" />
              Voltar ao início
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Email enviado!
            </h2>
            <p className="text-gray-600 mb-8">
              Enviamos um link de recuperação para seu email. Verifique sua caixa de entrada e siga as instruções.
            </p>
            
            <div className="space-y-4">
              <Link to="/login">
                <Button className="w-full">
                  Voltar ao login
                </Button>
              </Link>
              
              <p className="text-sm text-gray-500">
                Não recebeu o email?{' '}
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-blue-700 hover:text-blue-800 font-medium"
                >
                  Tentar novamente
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800">
            <ArrowLeft size={20} className="mr-2" />
            Voltar ao início
          </Link>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Recuperar senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-blue-700 hover:text-blue-800">
              Lembrou sua senha? Faça login
            </Link>
          </div>

          {/* Demo Info */}
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Demonstração:</h3>
              <p className="text-sm text-blue-700">
                Este é um formulário de demonstração. Qualquer email válido será aceito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 