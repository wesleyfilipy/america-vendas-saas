# 🚀 Configuração Completa do Supabase

## 📋 Passos para Configurar

### 1. **Acesse seu Projeto Supabase**
- Vá em [supabase.com](https://supabase.com)
- Entre no seu projeto

### 2. **Execute o SQL Completo**
1. Vá em **SQL Editor**
2. Cole e execute o conteúdo do arquivo `supabase/complete-setup.sql`
3. Clique em **Run**

### 3. **Configure o Storage**
1. Vá em **Storage** no menu lateral
2. Clique em **Create a new bucket**
3. Configure:
   - **Name**: `images`
   - **Public bucket**: ✅ Marque como público
   - **File size limit**: `50MB`
   - **Allowed MIME types**: `image/*`

### 4. **Configure as Políticas do Storage**
No **SQL Editor**, execute:

```sql
-- Políticas para o bucket de imagens
CREATE POLICY "Allow public viewing of images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow users to delete their own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

### 5. **Configure Autenticação**
1. Vá em **Authentication > Settings**
2. Configure:
   - **Site URL**: `https://seu-dominio.vercel.app`
   - **Redirect URLs**: 
     - `https://seu-dominio.vercel.app/auth/callback`
     - `https://seu-dominio.vercel.app/login`
     - `https://seu-dominio.vercel.app/cadastro`

### 6. **Obtenha as Credenciais**
1. Vá em **Settings > API**
2. Copie:
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **anon public** key (começa com `eyJ...`)

### 7. **Configure no Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Entre no seu projeto `america-vendas`
3. Vá em **Settings > Environment Variables**
4. Adicione:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8. **Teste o Sistema**
1. Acesse seu site no Vercel
2. Tente criar uma conta
3. Tente fazer login
4. Verifique se está funcionando

## 🔧 Solução de Problemas

### **Erro de Autenticação**
- Verifique se as URLs de redirecionamento estão corretas
- Certifique-se de que o RLS está habilitado
- Verifique se as políticas estão ativas

### **Erro de Upload de Imagens**
- Verifique se o bucket `images` foi criado
- Certifique-se de que as políticas do storage estão corretas
- Verifique se o bucket é público

### **Erro de Permissões**
- Execute novamente o arquivo `complete-setup.sql`
- Verifique se todas as políticas foram criadas
- Certifique-se de que o RLS está habilitado em todas as tabelas

## 📊 Verificação Final

Execute esta query no SQL Editor para verificar se tudo está configurado:

```sql
-- Verificar tabelas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar políticas
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Verificar buckets de storage
SELECT name, public 
FROM storage.buckets;
```

## ✅ Checklist

- [ ] SQL executado com sucesso
- [ ] Bucket `images` criado
- [ ] Políticas do storage configuradas
- [ ] URLs de redirecionamento configuradas
- [ ] Variáveis de ambiente no Vercel
- [ ] Sistema testado e funcionando

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador
2. Verifique os logs no painel do Supabase
3. Execute as queries de verificação
4. Consulte a documentação do Supabase 