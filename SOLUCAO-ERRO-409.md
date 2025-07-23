# 🔧 Solução Completa - Anúncios e Imagens

## 🚨 **Problemas Identificados:**

1. **Anúncios não aparecem no dashboard** - Página de busca usando dados mock
2. **Fotos não aparecem nos anúncios** - Storage do Supabase não configurado
3. **Anúncios não são exibidos para visitantes** - Status não configurado corretamente

## ✅ **Solução Completa:**

### **1. Execute o Script de Diagnóstico**

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em **SQL Editor**
4. Cole e execute o script do arquivo `supabase/diagnose-409-error.sql`

### **2. O Script vai corrigir:**

- ✅ **Campo status** - Adicionar se não existir
- ✅ **Políticas de listings** - Corrigir permissões
- ✅ **Storage de imagens** - Configurar bucket e políticas
- ✅ **Sincronização de usuários** - Garantir que usuários existem
- ✅ **Anúncios existentes** - Atualizar status para 'published'

### **3. Verificar Configuração**

Após executar o script, você deve ver:

```
✅ DIAGNÓSTICO CONCLUÍDO!
🎯 Problemas corrigidos:
   - Campo status adicionado
   - Políticas de listings corrigidas
   - Storage configurado
   - Usuários sincronizados
   - Anúncios existentes atualizados
```

### **4. Teste a Aplicação**

1. **Criar novo anúncio:**
   - Faça login
   - Vá para "Criar Anúncio"
   - Preencha os dados
   - **Adicione imagens** (agora deve funcionar)
   - Publique o anúncio

2. **Verificar no dashboard:**
   - Vá para "Meus Anúncios"
   - O anúncio deve aparecer com status "Ativo"
   - As imagens devem carregar

3. **Verificar para visitantes:**
   - Vá para "Buscar Anúncios"
   - O anúncio deve aparecer na lista
   - As imagens devem ser exibidas

## 🔍 **Se ainda houver problemas:**

### **Verificar Storage Manualmente:**

Execute no SQL Editor:
```sql
-- Verificar bucket de imagens
SELECT * FROM storage.buckets WHERE id = 'images';

-- Verificar políticas de storage
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

### **Verificar Anúncios:**

```sql
-- Verificar anúncios publicados
SELECT 
    id,
    title,
    status,
    images,
    created_at
FROM public.listings 
WHERE status = 'published'
ORDER BY created_at DESC;
```

### **Teste de Upload Manual:**

```sql
-- Teste de inserção manual
INSERT INTO public.listings (
    title,
    description,
    price,
    user_id,
    expires_at,
    category,
    status,
    is_paid
) VALUES (
    'Teste de Anúncio',
    'Descrição de teste',
    100.00,
    auth.uid(),
    NOW() + INTERVAL '1 day',
    'outro',
    'published',
    false
) RETURNING id, title, status;
```

## 🎯 **Resultado Esperado:**

Após executar o script:

1. ✅ **Anúncios aparecem** no dashboard
2. ✅ **Imagens carregam** corretamente
3. ✅ **Visitantes podem ver** os anúncios
4. ✅ **Upload de imagens** funciona
5. ✅ **Status dos anúncios** está correto

## 📞 **Suporte:**

Se algum problema persistir:

1. Verifique se o script foi executado completamente
2. Confirme se todas as políticas foram criadas
3. Teste com um anúncio simples primeiro
4. Verifique os logs do console do navegador

**Execute o script e teste novamente!** 🚀 