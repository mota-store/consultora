# TODO - SaaS Consultoria de Planos de Saúde Talita Motta

## Landing Page
- [x] Estrutura HTML/CSS com cores azul marinho e branco (Clube do Remo)
- [x] Seção Hero com apresentação da Talita Motta
- [x] Seção de operadoras parceiras (Hapvida, Bradesco, Hospital Amazônia, Hospital Adventista)
- [x] Seção de depoimentos de clientes
- [x] Botão CTA para iniciar conversa com Tália
- [x] Responsividade mobile

## Chatbot IA "Tália"
- [x] Integração com OpenRouter API (chave fornecida)
- [x] Sistema de coleta progressiva de informações
- [x] Persona humanizada com emojis
- [x] Fluxo de perguntas: nome → telefone → intenção → beneficiário → idades → motivo → operadora → pré-existentes → abrangência → rede → preço
- [x] Base de conhecimento sobre operadoras (Bradesco: CNPJ 6 meses + 3 vidas mín, etc)
- [x] Respostas a dúvidas frequentes (carência, coparticipação, tipos de plano)
- [x] Validação: nunca citar preços, nunca garantir aceitação de pré-existentes
- [x] Armazenamento de conversas no banco de dados
- [x] Redirecionamento automático para WhatsApp com mensagem pré-preenchida
- [x] Endpoints de FAQ e informações de operadora

## Dashboard Administrativo
- [x] Página de login (consultora)
- [x] Autenticação segura com bcryptjs (usuário/senha)
- [x] Lista de leads com status (Novo Contato, Em Negociação, Fechado, Em Acompanhamento)
- [x] Visualização de detalhes da conversa por lead
- [x] Botão de acesso rápido ao WhatsApp do cliente
- [x] Filtros por status
- [x] Busca por nome/telefone
- [x] Edição de status do lead
- [ ] Notificação em tempo real de novo lead

## Banco de Dados
- [x] Tabela de leads (nome, telefone, email, status, dados coletados)
- [x] Tabela de conversas (histórico de mensagens com Tália)
- [x] Tabela de usuários (consultora - login)
- [x] Migrations SQL

## Notificações
- [ ] Sistema de notificação para novo lead (webhook ou polling)
- [ ] Integração com WhatsApp Business API (opcional: notificação automática)

## Testes
- [x] Testes unitários para lógica de coleta de dados (18 testes passando)
- [x] Testes de integração com OpenRouter
- [x] Testes do fluxo de redirecionamento WhatsApp

## Deploy
- [x] Configuração de variáveis de ambiente
- [x] Commit inicial no GitHub
- [x] Documentação README.md
- [x] Instruções de setup local e Render
