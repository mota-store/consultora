# Consultoria Talita Motta - SaaS de Planos de Saúde

Sistema completo de captação e gestão de leads para consultoria de planos de saúde, com Landing Page profissional, Chatbot IA "Tália" e Dashboard administrativo.

## 🎯 Funcionalidades

### Landing Page
- ✅ Design profissional em azul marinho (Clube do Remo) e branco
- ✅ Seção Hero com apresentação da Talita Motta
- ✅ Operadoras parceiras: Hapvida, Bradesco, Hospital Amazônia, Hospital Adventista
- ✅ Seção de depoimentos de clientes
- ✅ Responsividade mobile completa

### Chatbot IA "Tália"
- ✅ Integração com OpenRouter (GPT-3.5-turbo)
- ✅ Coleta progressiva de informações do cliente
- ✅ Persona humanizada com emojis
- ✅ Fluxo de perguntas estruturado:
  1. Nome
  2. Telefone
  3. Intenção de troca
  4. Beneficiário
  5. Idades
  6. Motivo da busca
  7. Preferência de operadora
  8. Condições pré-existentes
  9. Abrangência (nacional/regional)
  10. Preferência por rede ampla
  11. Critério de preço

- ✅ Validação de dados (nunca cita preços, nunca promete aceitação de pré-existentes)
- ✅ Armazenamento de conversas no banco de dados
- ✅ Redirecionamento automático para WhatsApp com dados pré-preenchidos

### Dashboard Administrativo
- ✅ Login seguro com autenticação bcryptjs
- ✅ Lista de leads com filtros e busca
- ✅ Status de leads: Novo, Em Negociação, Fechado, Em Acompanhamento
- ✅ Visualização de detalhes do lead
- ✅ Acesso rápido ao WhatsApp do cliente
- ✅ Estatísticas de leads

## 🛠️ Stack Técnico

- **Frontend:** React 19 + Tailwind CSS 4 + TypeScript
- **Backend:** Express 4 + tRPC 11
- **Banco de Dados:** MySQL (TiDB Cloud)
- **IA:** OpenRouter API (GPT-3.5-turbo)
- **Autenticação:** bcryptjs + JWT
- **Deploy:** Render (recomendado)

## 📋 Pré-requisitos

- Node.js 22+
- pnpm 10+
- Conta TiDB Cloud (banco de dados)
- Chave OpenRouter API
- Conta Render (para deploy)

## 🚀 Setup Local

### 1. Clonar o repositório
```bash
git clone https://github.com/mota-store/consultora.git
cd consultora
```

### 2. Instalar dependências
```bash
pnpm install
```

### 3. Configurar variáveis de ambiente
Criar arquivo `.env` na raiz do projeto:

```env
# Database - TiDB Cloud
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE?ssl=true

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-...

# JWT Secret
JWT_SECRET=sua_chave_secreta_super_segura

# Owner Info
OWNER_NAME=Talita Motta
OWNER_OPEN_ID=seu_open_id

# Node Environment
NODE_ENV=development
```

### 4. Executar migrations
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 5. Iniciar servidor de desenvolvimento
```bash
pnpm dev
```

O site estará disponível em `http://localhost:3000`

## 📊 Banco de Dados

### Tabelas principais

#### `leads`
- `id` (int, PK)
- `nome` (varchar)
- `telefone` (varchar)
- `email` (varchar)
- `status` (enum: novo, negociacao, fechado, acompanhamento)
- `intencaoTroca` (text)
- `beneficiario` (text)
- `idades` (text)
- `motivoBusca` (text)
- `preferenciasOperadora` (text)
- `condicoesPre` (text)
- `abrangencia` (text)
- `redeAmpla` (text)
- `criterioPreco` (text)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

#### `conversas`
- `id` (int, PK)
- `leadId` (int, FK)
- `mensagem` (text)
- `remetente` (enum: usuario, talia)
- `createdAt` (timestamp)

#### `consultoras`
- `id` (int, PK)
- `nome` (varchar)
- `email` (varchar, UNIQUE)
- `senha` (varchar, hashed)
- `telefone` (varchar)
- `whatsapp` (varchar)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🔐 Autenticação

### Dashboard
- Acesso exclusivo para a consultora
- Email e senha (hash com bcryptjs)
- Sessão via JWT

### Criar primeira consultora
```bash
# Via API (POST /api/trpc/consultora.create)
{
  "nome": "Talita Motta",
  "email": "talita@example.com",
  "senha": "sua_senha_segura",
  "telefone": "5591987654321",
  "whatsapp": "5591987654321"
}
```

## 🌐 Deploy no Render

### 1. Conectar repositório GitHub
- Ir para [Render.com](https://render.com)
- Criar novo Web Service
- Conectar repositório GitHub

### 2. Configurar variáveis de ambiente
No painel Render, adicionar:
```
DATABASE_URL=mysql://...
OPENROUTER_API_KEY=sk-or-v1-...
JWT_SECRET=...
OWNER_NAME=Talita Motta
OWNER_OPEN_ID=...
NODE_ENV=production
```

### 3. Build Command
```bash
pnpm install && pnpm build
```

### 4. Start Command
```bash
pnpm start
```

### 5. Deploy
Clicar em "Deploy" e aguardar conclusão

## 📱 Endpoints da API

### Leads
- `POST /api/trpc/leads.create` - Criar novo lead
- `GET /api/trpc/leads.list` - Listar todos os leads
- `GET /api/trpc/leads.getById` - Obter lead por ID
- `POST /api/trpc/leads.updateStatus` - Atualizar status
- `POST /api/trpc/leads.update` - Atualizar dados
- `POST /api/trpc/leads.addMessage` - Adicionar mensagem à conversa
- `GET /api/trpc/leads.getConversa` - Obter histórico de conversa

### Consultora
- `POST /api/trpc/consultora.login` - Login
- `POST /api/trpc/consultora.create` - Criar consultora
- `GET /api/trpc/consultora.getById` - Obter dados

### Tália (IA)
- `POST /api/trpc/talia.chat` - Enviar mensagem para IA
- `GET /api/trpc/talia.validate` - Validar informação

## 🎨 Customização

### Cores
Editar `client/src/index.css` para alterar paleta de cores (azul marinho é o padrão)

### Operadoras
Adicionar/remover operadoras em:
- `client/src/pages/Home.tsx` (seção de operadoras)
- `server/routers/talia.ts` (validação)

### Número WhatsApp
Atualizar em `client/src/components/ChatInterface.tsx`:
```typescript
const whatsappUrl = `https://wa.me/SEU_NUMERO_AQUI?text=...`;
```

## 📞 Suporte

Para dúvidas ou problemas:
- Email: talita@consultora.com
- WhatsApp: (91) 98765-4321

## 📄 Licença

Propriedade de Talita Motta Consultoria de Planos de Saúde

---

**Desenvolvido com ❤️ para Talita Motta**
