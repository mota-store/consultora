# TODO - SaaS Consultoria de Planos de Saúde Talita Motta

## Landing Page
- [ ] Estrutura HTML/CSS com cores azul marinho e branco (Clube do Remo)
- [ ] Seção Hero com apresentação da Talita Motta
- [ ] Seção de operadoras parceiras (Hapvida, Bradesco, Hospital Amazônia, Hospital Adventista)
- [ ] Seção de depoimentos de clientes
- [ ] Botão CTA para iniciar conversa com Tália
- [ ] Responsividade mobile

## Chatbot IA "Tália"
- [ ] Integração com OpenRouter API (chave fornecida)
- [ ] Sistema de coleta progressiva de informações
- [ ] Persona humanizada com emojis
- [ ] Fluxo de perguntas: nome → telefone → intenção → beneficiário → idades → motivo → operadora → pré-existentes → abrangência → rede → preço
- [ ] Base de conhecimento sobre operadoras (Bradesco: CNPJ 6 meses + 3 vidas mín, etc)
- [ ] Respostas a dúvidas frequentes (carência, coparticipação, tipos de plano)
- [ ] Validação: nunca citar preços, nunca garantir aceitação de pré-existentes
- [ ] Armazenamento de conversas no banco de dados
- [ ] Redirecionamento automático para WhatsApp com mensagem pré-preenchida

## Dashboard Administrativo
- [ ] Página de login (consultora)
- [ ] Autenticação simples (usuário/senha)
- [ ] Lista de leads com status (Novo Contato, Em Negociação, Fechado, Em Acompanhamento)
- [ ] Visualização de detalhes da conversa por lead
- [ ] Botão de acesso rápido ao WhatsApp do cliente
- [ ] Filtros por status
- [ ] Busca por nome/telefone
- [ ] Edição de status do lead
- [ ] Notificação em tempo real de novo lead

## Banco de Dados
- [ ] Tabela de leads (nome, telefone, email, status, dados coletados)
- [ ] Tabela de conversas (histórico de mensagens com Tália)
- [ ] Tabela de usuários (consultora - login)
- [ ] Migrations SQL

## Notificações
- [ ] Sistema de notificação para novo lead (webhook ou polling)
- [ ] Integração com WhatsApp Business API (opcional: notificação automática)

## Testes
- [ ] Testes unitários para lógica de coleta de dados
- [ ] Testes de integração com OpenRouter
- [ ] Testes do fluxo de redirecionamento WhatsApp

## Deploy
- [ ] Configuração de variáveis de ambiente
- [ ] Commit inicial no GitHub
- [ ] Documentação README.md
- [ ] Instruções de setup local
