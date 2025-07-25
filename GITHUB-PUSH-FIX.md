# 🔧 Resolver Push Protection do GitHub

## 🚨 **Problema:**
O GitHub está bloqueando o push porque detectou chaves do Stripe em commits anteriores.

## ✅ **Solução:**

### **1. Desbloquear o Secret (Recomendado):**
Acesse esta URL para desbloquear o secret:
```
https://github.com/wesleyfilipy/america-vendas/security/secret-scanning/unblock-secret/30FXqE9o7HKDLjNgXSJF97rKRwB
```

### **2. Ou Remover o Commit Problemático:**
Se preferir remover o commit com a chave:

```bash
# Verificar o commit problemático
git log --oneline

# Resetar para o commit anterior
git reset --hard HEAD~1

# Fazer push forçado (CUIDADO!)
git push origin main --force
```

### **3. Ou Criar Novo Branch:**
```bash
# Criar novo branch limpo
git checkout -b main-clean

# Fazer push do novo branch
git push origin main-clean

# Fazer merge no GitHub
```

## 🎯 **Recomendação:**

**Use a URL de desbloquear** - é mais seguro e mantém o histórico.

## 📞 **Após Desbloquear:**

1. Execute: `git push origin main`
2. O push deve funcionar normalmente
3. Todas as correções serão enviadas para o GitHub

**Acesse a URL e desbloqueie o secret!** 🚀 