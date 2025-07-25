# 🧪 Guia de Teste - Após Correção do Banco de Dados

## ✅ **Script Executado com Sucesso!**

Agora vamos testar se tudo está funcionando corretamente.

## 🎯 **Teste 1: Verificar Estrutura da Tabela**

Execute este comando no SQL Editor do Supabase para verificar se o campo `status` foi adicionado:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'status';
```

**Resultado esperado:**
```
column_name | data_type | is_nullable | column_default
------------|-----------|-------------|----------------
status      | text      | YES         | 'draft'::text
```

## 🎯 **Teste 2: Criar Anúncio de Teste**

1. Acesse sua aplicação
2. Faça login
3. Vá para "Criar Anúncio"
4. Preencha os campos obrigatórios:
   - **Título:** "Teste de Anúncio"
   - **Descrição:** "Descrição de teste"
   - **Preço:** 100.00
   - **Categoria:** "outro"
   - **Cidade:** "São Paulo"
   - **Estado:** "SP"

5. Clique em "Criar Anúncio"

**Resultado esperado:**
- ✅ Anúncio criado com sucesso
- ✅ Sem erro 400
- ✅ Redirecionamento para "Meus Anúncios"

## 🎯 **Teste 3: Verificar no Banco de Dados**

Execute este comando para verificar se o anúncio foi criado:

```sql
SELECT 
    id,
    title,
    status,
    is_paid,
    created_at,
    expires_at
FROM public.listings 
ORDER BY created_at DESC 
LIMIT 5;
```

**Resultado esperado:**
- ✅ Anúncio aparece na lista
- ✅ Campo `status` preenchido
- ✅ `expires_at` definido para 1 dia no futuro

## 🎯 **Teste 4: Verificar na Interface**

1. Vá para "Meus Anúncios"
2. Verifique se o anúncio aparece na lista
3. Clique no anúncio para ver os detalhes

**Resultado esperado:**
- ✅ Anúncio aparece na lista
- ✅ Detalhes carregam corretamente
- ✅ Opção de pagamento disponível

## 🎯 **Teste 5: Verificar na Página Inicial**

1. Vá para a página inicial
2. Verifique se o anúncio aparece na lista pública

**Resultado esperado:**
- ✅ Anúncio aparece na lista pública
- ✅ Informações básicas visíveis

## 🚨 **Se Algum Teste Falhar:**

### **Problema 1: Ainda erro 400**
```sql
-- Verificar se o campo status existe
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'status';
```

### **Problema 2: Anúncio não aparece**
```sql
-- Verificar se há registros
SELECT COUNT(*) FROM public.listings;
```

### **Problema 3: Erro de permissão**
```sql
-- Verificar políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'listings';
```

## 🎉 **Sucesso!**

Se todos os testes passarem:
- ✅ Banco de dados configurado corretamente
- ✅ Campo `status` adicionado
- ✅ Políticas de segurança funcionando
- ✅ Aplicação pronta para uso

## 📞 **Próximos Passos:**

1. Teste o sistema de pagamento
2. Configure o webhook do Stripe
3. Teste o upload de imagens
4. Configure as variáveis de ambiente no Vercel

**Agora você pode criar anúncios sem problemas!** 🚀 