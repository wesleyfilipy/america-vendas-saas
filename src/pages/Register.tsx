import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate registration process
      console.log('Registration attempt:', data);
      
      // For demo purposes, accept any valid data
      if (data.name && data.email && data.phone && data.password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login page with success message
      navigate('/login', { 
          state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
        });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Por favor, preencha todos os campos corretamente'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Erro ao criar conta. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
          Criar conta gratuita
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link to="/login" className="font-medium text-blue-700 hover:text-blue-800">
            faça login se já tem uma conta
            </Link>
          </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
              </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register('name', {
                    required: 'Nome é obrigatório',
                  minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres'
                    }
                  })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

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

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={20} className="text-gray-400" />
                </div>
                <input
                  id="phone"
              type="tel"
                  autoComplete="tel"
                  {...register('phone', {
                    required: 'Telefone é obrigatório',
                  pattern: {
                      value: /^[\d\s\-\(\)\+]+$/,
                      message: 'Telefone inválido'
                    }
                  })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: value => value === password || 'Senhas não coincidem'
                  })}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
              {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </div>
            </form>

          {/* Terms */}
          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link to="/terms" className="text-blue-700 hover:text-blue-800">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link to="/privacy" className="text-blue-700 hover:text-blue-800">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;