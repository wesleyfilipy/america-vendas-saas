# Guia de Deploy - America Vendas

Este guia fornece instruções detalhadas para fazer deploy da aplicação America Vendas em diferentes plataformas.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase configurada
- Conta no Stripe configurada
- Repositório Git configurado

## 🔧 Configuração Inicial

1. **Clone o repositório e instale as dependências:**
```bash
git clone <seu-repositorio>
cd america-vendas/project
npm install
```

2. **Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto:
```env
# Supabase Configuration
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_do_stripe
STRIPE_SECRET_KEY=sua_chave_secreta_do_stripe
STRIPE_WEBHOOK_SECRET=seu_webhook_secret_do_stripe

# Server Configuration
PORT=3000
FRONTEND_URL=https://seu-dominio.com
```

3. **Configure o banco de dados:**
Execute as migrações SQL no painel do Supabase:
```sql
-- Execute os arquivos em supabase/migrations/
```

## 🚀 Deploy no Vercel (Recomendado)

### Passo 1: Preparação
```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça login no Vercel
vercel login
```

### Passo 2: Configure as variáveis de ambiente
```bash
# No painel do Vercel ou via CLI
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add FRONTEND_URL
```

### Passo 3: Deploy
```bash
# Deploy inicial
vercel

# Deploy para produção
vercel --prod
```

### Passo 4: Configure o webhook do Stripe
1. Acesse o painel do Stripe
2. Vá em Webhooks
3. Adicione o endpoint: `https://seu-dominio.vercel.app/api/webhook`
4. Selecione os eventos: `checkout.session.completed`, `checkout.session.expired`

## 🌐 Deploy no Netlify

### Passo 1: Preparação
```bash
# Instale o Netlify CLI
npm i -g netlify-cli

# Faça login no Netlify
netlify login
```

### Passo 2: Configure as variáveis de ambiente
```bash
netlify env:set VITE_SUPABASE_URL sua_url_do_supabase
netlify env:set VITE_SUPABASE_ANON_KEY sua_chave_anonima_do_supabase
netlify env:set VITE_STRIPE_PUBLISHABLE_KEY sua_chave_publica_do_stripe
netlify env:set STRIPE_SECRET_KEY sua_chave_secreta_do_stripe
netlify env:set STRIPE_WEBHOOK_SECRET seu_webhook_secret_do_stripe
netlify env:set FRONTEND_URL https://seu-dominio.netlify.app
```

### Passo 3: Deploy
```bash
# Deploy inicial
netlify deploy

# Deploy para produção
netlify deploy --prod
```

### Passo 4: Configure o webhook do Stripe
1. Acesse o painel do Stripe
2. Vá em Webhooks
3. Adicione o endpoint: `https://seu-dominio.netlify.app/.netlify/functions/webhook`
4. Selecione os eventos: `checkout.session.completed`, `checkout.session.expired`

## ☁️ Deploy no Cloudflare Pages

### Passo 1: Preparação
1. Acesse o painel do Cloudflare Pages
2. Conecte seu repositório Git

### Passo 2: Configure o build
- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `project`

### Passo 3: Configure as variáveis de ambiente
No painel do Cloudflare Pages, adicione:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_do_stripe
STRIPE_SECRET_KEY=sua_chave_secreta_do_stripe
STRIPE_WEBHOOK_SECRET=seu_webhook_secret_do_stripe
FRONTEND_URL=https://seu-dominio.pages.dev
```

### Passo 4: Deploy
1. Clique em "Deploy site"
2. Aguarde o build ser concluído

### Passo 5: Configure o webhook do Stripe
1. Acesse o painel do Stripe
2. Vá em Webhooks
3. Adicione o endpoint: `https://seu-dominio.pages.dev/api/webhook`
4. Selecione os eventos: `checkout.session.completed`, `checkout.session.expired`

## 🔍 Verificação Pós-Deploy

### 1. Teste a aplicação
- Acesse a URL de deploy
- Verifique se a página carrega corretamente
- Teste o cadastro de usuário
- Teste a criação de anúncios

### 2. Teste os pagamentos
- Crie um anúncio
- Tente fazer um pagamento de teste
- Verifique se o webhook está funcionando

### 3. Verifique os logs
- Vercel: Painel do projeto > Functions > Logs
- Netlify: Painel do projeto > Functions > Logs
- Cloudflare: Painel do projeto > Workers > Logs

## 🐛 Solução de Problemas Comuns

### Erro 522 (Cloudflare)
- Verifique se as variáveis de ambiente estão configuradas
- Verifique se o banco de dados está acessível
- Verifique se as URLs estão corretas

### Problemas de CORS
- Verifique se o domínio está na lista de permissões do Supabase
- Verifique se as configurações de CORS estão corretas

### Problemas de Build
- Execute `npm run type-check` localmente
- Verifique se todas as dependências estão instaladas
- Verifique se não há erros de TypeScript

### Problemas de Webhook
- Verifique se a URL do webhook está correta
- Verifique se o secret está configurado
- Teste o webhook no painel do Stripe

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs da plataforma
2. Verifique as variáveis de ambiente
3. Teste localmente primeiro
4. Consulte a documentação da plataforma

## 🔄 Atualizações

Para atualizar a aplicação:
1. Faça as alterações no código
2. Commit e push para o repositório
3. A plataforma fará o deploy automaticamente
4. Verifique se tudo está funcionando 