# Guia de Contribuição

Obrigado por considerar contribuir para o America Vendas! Este documento fornece diretrizes para contribuir com o projeto.

## Como Contribuir

### 1. Fork e Clone

1. Faça um fork do repositório
2. Clone seu fork localmente:
```bash
git clone https://github.com/seu-usuario/america-vendas.git
cd america-vendas/project
```

### 2. Configuração do Ambiente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Execute as migrações do banco de dados (se necessário)

### 3. Desenvolvimento

1. Crie uma branch para sua feature:
```bash
git checkout -b feature/nova-funcionalidade
```

2. Faça suas alterações seguindo as diretrizes de código

3. Teste suas alterações:
```bash
npm run type-check
npm run lint
npm run build
```

4. Commit suas alterações:
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

### 4. Pull Request

1. Push para sua branch:
```bash
git push origin feature/nova-funcionalidade
```

2. Crie um Pull Request no GitHub
3. Preencha o template do PR
4. Aguarde a revisão

## Diretrizes de Código

### TypeScript
- Use TypeScript para todo o código
- Defina tipos explícitos quando necessário
- Evite `any` - use tipos específicos

### React
- Use componentes funcionais com hooks
- Mantenha componentes pequenos e focados
- Use props tipadas

### Estilo de Código
- Siga o ESLint configurado
- Use Prettier para formatação
- Mantenha linhas com no máximo 80 caracteres

### Commits
Use o padrão Conventional Commits:
- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para documentação
- `style:` para formatação
- `refactor:` para refatoração
- `test:` para testes
- `chore:` para tarefas de manutenção

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── layout/         # Componentes de layout
│   ├── listing/        # Componentes de anúncios
│   └── ui/             # Componentes de UI
├── lib/                # Configurações e utilitários
├── pages/              # Páginas da aplicação
├── server/             # Servidor Express
├── store/              # Estado global
└── utils/              # Utilitários
```

## Testes

- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes alta
- Execute testes antes de fazer PR

## Documentação

- Atualize a documentação quando necessário
- Adicione comentários em código complexo
- Mantenha o README atualizado

## Issues

### Reportando Bugs
- Use o template de bug report
- Inclua passos para reproduzir
- Adicione screenshots se relevante

### Sugerindo Features
- Use o template de feature request
- Explique o problema que resolve
- Descreva a solução proposta

## Comunicação

- Seja respeitoso e construtivo
- Use português ou inglês
- Mantenha discussões focadas no código

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

## Agradecimentos

Obrigado por contribuir para tornar o America Vendas melhor! 🚀 