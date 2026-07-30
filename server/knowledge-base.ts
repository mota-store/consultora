// Base de conhecimento estruturada para a Tália
// Contém informações sobre operadoras, carências, coparticipação e tipos de planos

export const operadorasInfo = {
  hapvida: {
    nome: "Hapvida",
    descricao: "Cobertura nacional com excelente rede de hospitais e clínicas",
    aceitaMenuores: true,
    requerCNPJ: false,
    requerMinVidas: 0,
    carenciaMedia: "30 dias",
    tiposPlano: ["Individual", "Familiar", "Coletivo"],
    coparticipacao: "Varia de 10% a 30% conforme plano",
    regras: [
      "Aceita menores de 18 anos",
      "Planos individuais e coletivos",
      "Cobertura em todo o Brasil",
    ],
  },
  bradesco: {
    nome: "Bradesco Saúde",
    descricao: "Planos empresariais e individuais de qualidade",
    aceitaMenuores: true,
    requerCNPJ: true,
    requerMinVidas: 3,
    cnpjIdadeMinima: "6 meses",
    carenciaMedia: "30 dias",
    tiposPlano: ["Empresarial", "Individual"],
    coparticipacao: "Varia de 15% a 40% conforme plano",
    regras: [
      "Planos empresariais exigem CNPJ ativo há pelo menos 6 meses",
      "Mínimo de 3 vidas para planos coletivos",
      "Aceita menores de 18 anos",
      "Cobertura nacional",
    ],
  },
  hospitalAmazonia: {
    nome: "Hospital Amazônia",
    descricao: "Referência em Belém com atendimento de qualidade",
    aceitaMenuores: true,
    requerCNPJ: false,
    requerMinVidas: 0,
    carenciaMedia: "30 dias",
    tiposPlano: ["Individual", "Familiar"],
    coparticipacao: "Varia de 10% a 25% conforme plano",
    regras: [
      "Cobertura regional em Belém e região",
      "Atendimento humanizado",
      "Aceita menores de 18 anos",
    ],
  },
  hospitalAdventista: {
    nome: "Hospital Adventista",
    descricao: "Qualidade e confiabilidade em atendimento à saúde",
    aceitaMenuores: true,
    requerCNPJ: false,
    requerMinVidas: 0,
    carenciaMedia: "30 dias",
    tiposPlano: ["Individual", "Familiar"],
    coparticipacao: "Varia de 10% a 30% conforme plano",
    regras: [
      "Cobertura regional",
      "Rede de hospitais e clínicas parceiras",
      "Aceita menores de 18 anos",
    ],
  },
};

export const faqItems = [
  {
    pergunta: "O que é carência?",
    resposta: `Carência é o período de espera entre a contratação do plano de saúde e o início da cobertura para determinados procedimentos. 

Tipos de carência:
- **Carência geral**: Geralmente 30 dias. Aplica-se a consultas, exames e procedimentos em geral
- **Carência para parto**: Normalmente 300 dias (10 meses)
- **Carência para cirurgias**: Pode variar de 30 a 120 dias
- **Sem carência**: Alguns planos oferecem cobertura imediata para emergências

Importante: Você não pode ser atendido antes do término da carência, exceto em casos de emergência.`,
  },
  {
    pergunta: "O que é coparticipação?",
    resposta: `Coparticipação é a porcentagem do valor da consulta, exame ou procedimento que você paga diretamente ao prestador de saúde.

Exemplos:
- Se uma consulta custa R$ 100 e você tem 20% de coparticipação, você paga R$ 20
- O plano paga os outros R$ 80

Tipos:
- **Percentual**: Você paga uma porcentagem (10%, 20%, 30%)
- **Valor fixo**: Você paga um valor fixo por procedimento

Dica: Planos com menor coparticipação são mais caros, mas você gasta menos em cada atendimento.`,
  },
  {
    pergunta: "Qual é a diferença entre plano individual e familiar?",
    resposta: `**Plano Individual:**
- Cobre apenas uma pessoa
- Mensalidade mais baixa
- Ideal para quem é solteiro ou quer cobertura só para si

**Plano Familiar:**
- Cobre toda a família (cônjuge e filhos)
- Mensalidade mais alta, mas mais econômico por pessoa
- Geralmente tem limite de idade para filhos (até 21 ou 25 anos)
- Todos compartilham a mesma cobertura

Dica: Plano familiar é mais barato quando você tem 2 ou mais pessoas para cobrir.`,
  },
  {
    pergunta: "Como funciona o plano coletivo empresarial?",
    resposta: `**Plano Coletivo Empresarial:**
- Contratado pela empresa para seus funcionários
- A empresa geralmente paga uma parte ou toda a mensalidade
- Exige CNPJ ativo e mínimo de vidas (geralmente 3 pessoas)

Vantagens:
- Preço mais baixo que plano individual
- Contribuição da empresa
- Cobertura para toda a família do funcionário

Requisitos:
- CNPJ ativo há pelo menos 6 meses
- Mínimo de 3 vidas (pode variar)
- Documentação da empresa

Dica: Se sua empresa oferece plano de saúde, aproveite! É uma ótima vantagem.`,
  },
  {
    pergunta: "Posso contratar um plano se tenho doença pré-existente?",
    resposta: `Sim! Você pode contratar um plano mesmo tendo doenças pré-existentes (diabetes, hipertensão, etc).

Importante saber:
- **Carência**: Pode haver carência específica para sua condição pré-existente
- **Cobertura**: Seu tratamento será coberto após o término da carência
- **Transparência**: Você deve informar suas condições ao contratar

Dica: Converse com a Talita sobre sua situação específica. Ela pode ajudar a encontrar o melhor plano para você.`,
  },
  {
    pergunta: "Qual é a diferença entre plano nacional e regional?",
    resposta: `**Plano Nacional:**
- Cobertura em todo o Brasil
- Rede maior de hospitais e clínicas
- Mensalidade geralmente mais cara
- Ideal se você viaja ou se muda frequentemente

**Plano Regional:**
- Cobertura apenas em uma região ou estado
- Rede menor, mas mais especializada
- Mensalidade mais barata
- Ideal se você fica sempre na mesma região

Dica: Se você mora em Belém e não viaja, um plano regional pode ser mais econômico.`,
  },
];

export const getOperadoraInfo = (nomeOperadora: string) => {
  const key = nomeOperadora.toLowerCase().replace(/\s+/g, "");
  const operadora = Object.entries(operadorasInfo).find(([k]) =>
    key.includes(k) || k.includes(key)
  );
  return operadora ? operadora[1] : null;
};

export const getFAQResponse = (pergunta: string) => {
  const faq = faqItems.find((item) =>
    item.pergunta.toLowerCase().includes(pergunta.toLowerCase()) ||
    pergunta.toLowerCase().includes(item.pergunta.toLowerCase())
  );
  return faq?.resposta || null;
};

export const getOperadoraRules = (nomeOperadora: string) => {
  const operadora = getOperadoraInfo(nomeOperadora);
  if (!operadora) return null;

  const rules = [];
  if (operadora.requerCNPJ) {
    const cnpjAge = (operadora as any).cnpjIdadeMinima || "6 meses";
    rules.push(`Requer CNPJ ativo há pelo menos ${cnpjAge}`);
  }
  if (operadora.requerMinVidas > 0) {
    rules.push(`Mínimo de ${operadora.requerMinVidas} vidas`);
  }
  rules.push(...operadora.regras);
  return rules;
};
