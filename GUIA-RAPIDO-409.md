# 🚀 Guia Rápido - Resolver Erro 409

## 🎯 **Problema:**
Erro 409 (Conflict) ao criar anúncios - usuário não existe na tabela `users`

## ✅ **Solução Rápida:**

### **1. Execute este Script Único:**
```sql
-- Execute no SQL Editor do Supabase
-- Arquivo: supabase/final-fix-409.sql
```

### **2. O Script vai:**
- ✅ Adicionar campo `status` se faltar
- ✅ Sincronizar usuários do auth com a tabela users
- ✅ Verificar estrutura das tabelas
- ✅ Verificar políticas de segurança
- ✅ Mostrar se você existe na tabela users

### **3. Teste Imediatamente:**
1. Execute o script
2. Vá para sua aplicação
3. Tente criar um anúncio
4. O erro 409 deve desaparecer

## 🔍 **Verificação Rápida:**

Após executar o script, você deve ver:

```
VERIFICANDO USUÁRIO ATUAL:
user_status
-------------------
Usuário existe na tabela users
```

## 🎯 **Se Ainda Houver Problema:**

Execute este comando para verificar manualmente:

```sql
-- Verificar se você existe na tabela users
SELECT 
    id, 
    email, 
    name, 
    phone 
FROM public.users 
WHERE id = auth.uid();
```

## 📞 **Resultado Esperado:**

- ✅ Usuário sincronizado na tabela users
- ✅ Campo status adicionado à tabela listings
- ✅ Políticas de segurança funcionando
- ✅ Erro 409 resolvido
- ✅ Criação de anúncios funcionando

**Execute o script `supabase/final-fix-409.sql` e teste!** 🚀 