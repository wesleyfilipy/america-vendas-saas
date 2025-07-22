import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { config } from '../../config/env';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testando...');
  const [error, setError] = useState<string>('');
  const [credentials, setCredentials] = useState<any>({});

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
        keyLength: config.supabase.anonKey?.length || 0
      };

      setCredentials(currentConfig);

      // Testar conexão básica
      const { data, error } = await supabase.from('users').select('count').limit(1);

      if (error) {
        throw error;
      }

      setStatus('✅ Conexão com Supabase funcionando!');
    } catch (err: any) {
      console.error('Erro de conexão:', err);
      setError(err.message || 'Erro desconhecido');
      setStatus('❌ Erro de conexão');
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
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setError(err.message || 'Erro desconhecido');
      setStatus('❌ Erro de autenticação');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
            {credentials.url && (
              <p><strong>URL atual:</strong> <code className="bg-gray-200 px-1 rounded">{credentials.url}</code></p>
            )}
          </div>
        </div>

        {/* Botões de teste */}
        <div className="flex space-x-4">
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
        </div>

        {/* Instruções */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-2 text-yellow-800">📋 Instruções:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
            <li>Verifique se as credenciais estão configuradas no Vercel</li>
            <li>Certifique-se de que o projeto Supabase está ativo</li>
            <li>Execute o SQL de configuração no Supabase</li>
            <li>Faça redeploy no Vercel após configurar as variáveis</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest; 