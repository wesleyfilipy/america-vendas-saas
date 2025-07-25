# America Vendas - Deploy para Cloudflare Pages

## 📋 Instruções de Deploy

### 1. Acesse o Cloudflare Dashboard
- Vá para [dash.cloudflare.com](https://dash.cloudflare.com)
- Faça login na sua conta

### 2. Crie um novo projeto no Cloudflare Pages
- Clique em "Pages" no menu lateral
- Clique em "Create a project"
- Escolha "Connect to Git" ou "Direct Upload"

### 3. Configurações do Projeto
- **Nome do projeto**: `america-vendas` (ou o nome que preferir)
- **Framework preset**: `None` (ou `Vite` se disponível)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (se estiver na raiz do projeto)

### 4. Variáveis de Ambiente
Configure as seguintes variáveis de ambiente no Cloudflare Pages:

```
VITE_SUPABASE_URL=https://whsvonphvsfopwjteqju.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoc3ZvbnBodnNmb3B3anRlcWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTA4MTksImV4cCI6MjA2NDEyNjgxOX0.4h8QukjZULbzitIeIwbAlQ-FrDV8ohCbJhJohA9S-AY
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_do_stripe
VITE_APP_URL=https://seu-dominio.pages.dev
```

### 5. Deploy
- Se conectou via Git: O deploy será automático a cada push
- Se fez upload direto: Clique em "Deploy site"

### 6. Configurações Adicionais

#### Domínio Personalizado (Opcional)
- Vá em "Custom domains"
- Adicione seu domínio personalizado
- Configure os registros DNS conforme necessário

#### Configurações de Cache
Os arquivos já estão configurados com:
- `_headers`: Configurações de segurança e cache
- `_redirects`: SPA routing para React Router

## 🚀 Funcionalidades do Site

### ✅ Implementado
- ✅ Sistema de autenticação com Supabase
- ✅ Criação de anúncios com fotos
- ✅ Upload de imagens para Supabase Storage
- ✅ Dashboard de anúncios do usuário
- ✅ Sistema de pagamento com Stripe
- ✅ Interface responsiva e moderna
- ✅ Filtros de busca
- ✅ Validação de formulários

### 📱 Tecnologias Utilizadas
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Pagamentos**: Stripe
- **Deploy**: Cloudflare Pages

## 🔧 Estrutura dos Arquivos

```
dist/
├── index.html              # Página principal
├── assets/
│   ├── index-Cq8R3sPw.css  # Estilos CSS
│   ├── index-DLrZkuXy.js   # JavaScript principal
│   └── browser-yTJ4uBNz.js # Polyfills
├── _headers                # Configurações de segurança
├── _redirects              # SPA routing
└── README.md               # Este arquivo
```

## 🐛 Solução de Problemas

### Erro 404 em rotas
- Verifique se o arquivo `_redirects` está presente
- Confirme se o Cloudflare Pages está configurado para SPA

### Imagens não carregam
- Verifique se o bucket do Supabase Storage está público
- Confirme se as políticas RLS estão configuradas corretamente

### Autenticação não funciona
- Verifique se as variáveis de ambiente do Supabase estão corretas
- Confirme se o domínio está na lista de URLs permitidas no Supabase

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o deploy, entre em contato através do email ou WhatsApp configurado no sistema. 