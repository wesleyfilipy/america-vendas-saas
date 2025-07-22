# 🚀 Correção Rápida - Erro 400 na Criação de Anúncios

## 🎯 **Problema Identificado:**

A tabela `listings` está faltando o campo `status` que é obrigatório no código.

## ✅ **Solução Rápida:**

### **1. Execute este Script SQL no Supabase:**

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para o seu projeto
3. Clique em **SQL Editor**
4. Cole e execute o script do arquivo `supabase/add-status-field.sql`

### **2. O Script vai:**
- ✅ Adicionar o campo `status` à tabela `listings`
- ✅ Definir valor padrão como `'draft'`
- ✅ Atualizar registros existentes
- ✅ Verificar se tudo está correto

### **3. Teste Imediatamente:**
Após executar o script:
1. Tente criar um anúncio
2. O erro 400 deve desaparecer
3. O anúncio deve ser criado com sucesso

## 🔍 **Verificação:**

Após executar o script, você deve ver algo assim:

```
column_name | data_type | is_nullable | column_default
------------|-----------|-------------|----------------
status      | text      | YES         | 'draft'::text
```

## 🎯 **Se ainda houver problemas:**

Execute este comando para verificar a estrutura completa:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
ORDER BY ordinal_position;
```

## 📞 **Suporte:**

Se o problema persistir:
1. Verifique se o script foi executado com sucesso
2. Confirme se o campo `status` foi adicionado
3. Teste com um anúncio simples

**Execute o script e teste novamente!** 🚀 