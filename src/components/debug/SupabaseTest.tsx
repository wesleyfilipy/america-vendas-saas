import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { config } from '../../config/env';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testando...');
  const [error, setError] = useState<string>('');
  const [credentials, setCredentials] = useState<any>({});
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('Testando conexão...');
      setError('');

      // Verificar configurações
      const currentConfig = {
        url: config.supabase.url,
        key: config.supabase.anonKey,
        hasUrl: !!config.supabase.url,
        hasKey: !!config.supabase.anonKey,
        keyLength: config.supabase.anonKey?.length || 0,
        keyStartsWith: config.supabase.anonKey?.substring(0, 20) || 'N/A'
      };

      setCredentials(currentConfig);

      // Testar conexão básica
      const { data, error } = await supabase.from('users').select('count').limit(1);

      if (error) {
        throw error;
      }

      setStatus('✅ Conexão com Supabase funcionando!');
      setTestResults(prev => ({ ...prev, connection: 'success' }));
    } catch (err: any) {
      console.error('Erro de conexão:', err);
      setError(err.message || 'Erro desconhecido');
      setStatus('❌ Erro de conexão');
      setTestResults(prev => ({ ...prev, connection: 'error', errorDetails: err }));
    }
  };

  const testAuth = async () => {
    try {
      setStatus('Testando autenticação...');
      setError('');

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      setStatus('✅ Autenticação funcionando!');
      setTestResults(prev => ({ ...prev, auth: 'success' }));
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setError(err.message || 'Erro desconhecido');
      setStatus('❌ Erro de autenticação');
      setTestResults(prev => ({ ...prev, auth: 'error', authErrorDetails: err }));
    }
  };

  const testSignUp = async () => {
    try {
      setStatus('Testando cadastro...');
      setError('');

      const testEmail = `test-${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          data: {
            name: 'Test User',
            phone: '123456789'
          }
        }
      });

      if (error) {
        throw error;
      }

      setStatus('✅ Cadastro funcionando!');
      setTestResults(prev => ({ ...prev, signup: 'success' }));
    } catch (err: any) {
      console.error('Erro de cadastro:', err);
      setError(err.message || 'Erro desconhecido');
      setStatus('❌ Erro de cadastro');
      setTestResults(prev => ({ ...prev, signup: 'error', signupErrorDetails: err }));
    }
  };

  const showEnvironmentInfo = () => {
    console.log('Environment Info:', {
      NODE_ENV: import.meta.env.NODE_ENV,
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      config: config
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔧 Teste de Conexão Supabase</h2>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Status:</h3>
          <p className="text-lg">{status}</p>
          {error && (
            <p className="text-red-600 mt-2 text-sm">{error}</p>
          )}
        </div>

        {/* Credenciais */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Configurações:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>URL:</strong> {credentials.hasUrl ? '✅ Configurada' : '❌ Não configurada'}</p>
            <p><strong>Chave:</strong> {credentials.hasKey ? '✅ Configurada' : '❌ Não configurada'}</p>
            <p><strong>Tamanho da chave:</strong> {credentials.keyLength} caracteres</p>
            <p><strong>Início da chave:</strong> <code className="bg-gray-200 px-1 rounded">{credentials.keyStartsWith}</code></p>
            {credentials.url && (
              <p><strong>URL atual:</strong> <code className="bg-gray-200 px-1 rounded">{credentials.url}</code></p>
            )}
          </div>
        </div>

        {/* Resultados dos Testes */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Resultados dos Testes:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Conexão:</strong> {testResults.connection === 'success' ? '✅ Sucesso' : testResults.connection === 'error' ? '❌ Erro' : '⏳ Não testado'}</p>
            <p><strong>Autenticação:</strong> {testResults.auth === 'success' ? '✅ Sucesso' : testResults.auth === 'error' ? '❌ Erro' : '⏳ Não testado'}</p>
            <p><strong>Cadastro:</strong> {testResults.signup === 'success' ? '✅ Sucesso' : testResults.signup === 'error' ? '❌ Erro' : '⏳ Não testado'}</p>
          </div>
        </div>

        {/* Botões de teste */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Testar Conexão
          </button>
          <button
            onClick={testAuth}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Testar Autenticação
          </button>
          <button
            onClick={testSignUp}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Testar Cadastro
          </button>
          <button
            onClick={showEnvironmentInfo}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Ver Info no Console
          </button>
        </div>

        {/* Instruções */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-yellow-800">📋 Instruções:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
            <li>Verifique se as credenciais estão configuradas no Vercel</li>
            <li>Certifique-se de que o projeto Supabase está ativo</li>
            <li>Execute o SQL de configuração no Supabase</li>
            <li>Faça redeploy no Vercel após configurar as variáveis</li>
            <li>Clique em "Ver Info no Console" e verifique os logs</li>
          </ol>
        </div>

        {/* Debug Info */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-red-800">🐛 Debug Info:</h3>
          <div className="text-sm text-red-700">
            <p><strong>NODE_ENV:</strong> {import.meta.env.NODE_ENV}</p>
            <p><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada'}</p>
            <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest; 