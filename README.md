# America Vendas - Plataforma de Anúncios

Uma plataforma moderna para anúncios de imóveis e veículos, construída com React, TypeScript, Vite, Supabase e Stripe.

## 🚀 Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Stripe (para pagamentos)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd america-vendas/project
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
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
FRONTEND_URL=http://localhost:5173
```

4. **Configure o banco de dados**
Execute as migrações do Supabase:
```bash
# No painel do Supabase, execute os arquivos SQL em supabase/migrations/
```

5. **Inicie o servidor de desenvolvimento**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (opcional para desenvolvimento local)
npm run server:dev
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Instale o Vercel CLI**
```bash
npm i -g vercel
```

2. **Configure as variáveis de ambiente no Vercel**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
```

3. **Deploy**
```bash
npm run deploy:vercel
```

### Netlify

1. **Instale o Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Configure as variáveis de ambiente**
```bash
netlify env:set VITE_SUPABASE_URL sua_url_do_supabase
netlify env:set VITE_SUPABASE_ANON_KEY sua_chave_anonima_do_supabase
netlify env:set VITE_STRIPE_PUBLISHABLE_KEY sua_chave_publica_do_stripe
```

3. **Deploy**
```bash
npm run deploy:netlify
```

### Cloudflare Pages

1. **Configure as variáveis de ambiente no painel do Cloudflare Pages**
2. **Conecte seu repositório**
3. **Configure o build command**: `npm run build`
4. **Configure o output directory**: `dist`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── listing/        # Listing components
│   └── ui/             # UI components
├── lib/                # Configurações (Supabase, Stripe)
├── pages/              # Páginas da aplicação
├── server/             # Servidor Express
│   └── api/            # API endpoints
├── store/              # Estado global (Zustand)
└── utils/              # Utilitários
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa o ESLint
- `npm run type-check` - Verifica tipos TypeScript
- `npm run format` - Formata o código com Prettier
- `npm run server` - Inicia o servidor backend
- `npm run server:dev` - Inicia o servidor backend em modo desenvolvimento

## 🔐 Configuração do Supabase

1. Crie um novo projeto no Supabase
2. Execute as migrações SQL em `supabase/migrations/`
3. Configure as políticas de segurança (RLS)
4. Configure o bucket de storage para imagens

## 💳 Configuração do Stripe

1. Crie uma conta no Stripe
2. Configure os webhooks para o endpoint `/api/webhook`
3. Adicione as chaves de API nas variáveis de ambiente

## 🐛 Solução de Problemas

### Erro 522 (Cloudflare)
- Verifique se o servidor backend está rodando
- Configure corretamente as variáveis de ambiente
- Verifique se as URLs estão corretas

### Problemas de CORS
- Configure o proxy no `vite.config.ts`
- Verifique as configurações de CORS no servidor

### Problemas de Build
- Execute `npm run type-check` para verificar erros de TypeScript
- Verifique se todas as dependências estão instaladas

## 📝 Licença

Este projeto está sob a licença MIT. 