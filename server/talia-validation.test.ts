import { describe, it, expect } from "vitest";

// Testes para validação de dados do chatbot
describe("Validação de Dados do Chatbot", () => {
  // Validação de telefone
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(?[1-9]{2}\)?[\s]?9?[0-9]{4}-?[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  it("deve validar telefone com formato correto (11) 99999-9999", () => {
    expect(validatePhone("(11) 99999-9999")).toBe(true);
  });

  it("deve validar telefone com formato 11999999999", () => {
    expect(validatePhone("11999999999")).toBe(true);
  });

  it("deve rejeitar telefone com formato inválido", () => {
    expect(validatePhone("123")).toBe(false);
  });

  it("deve rejeitar telefone com DDD inválido (01)", () => {
    expect(validatePhone("(01) 99999-9999")).toBe(false);
  });

  // Validação de idade
  const validateAge = (age: string): boolean => {
    const num = parseInt(age);
    return num >= 0 && num <= 120;
  };

  it("deve validar idade válida (25)", () => {
    expect(validateAge("25")).toBe(true);
  });

  it("deve validar idade mínima (0)", () => {
    expect(validateAge("0")).toBe(true);
  });

  it("deve validar idade máxima (120)", () => {
    expect(validateAge("120")).toBe(true);
  });

  it("deve rejeitar idade negativa (-1)", () => {
    expect(validateAge("-1")).toBe(false);
  });

  it("deve rejeitar idade acima de 120 (150)", () => {
    expect(validateAge("150")).toBe(false);
  });

  // Validação de operadora
  const validateOperadora = (operadora: string): boolean => {
    const validOperadoras = [
      "hapvida",
      "bradesco",
      "hospital amazônia",
      "hospital adventista",
    ];
    return validOperadoras.some((op) =>
      operadora.toLowerCase().includes(op)
    );
  };

  it("deve validar operadora Hapvida", () => {
    expect(validateOperadora("Hapvida")).toBe(true);
  });

  it("deve validar operadora Bradesco", () => {
    expect(validateOperadora("Bradesco")).toBe(true);
  });

  it("deve validar operadora Hospital Amazônia", () => {
    expect(validateOperadora("Hospital Amazônia")).toBe(true);
  });

  it("deve rejeitar operadora inválida", () => {
    expect(validateOperadora("Unimed")).toBe(false);
  });

  // Validação de mensagem WhatsApp
  const buildWhatsappMessage = (data: {
    nome: string;
    telefone: string;
    intencaoTroca: string;
    beneficiario: string;
    idades: string;
    motivoBusca: string;
    preferenciasOperadora: string;
    condicoesPre: string;
    abrangencia: string;
    redeAmpla: string;
    criterioPreco: string;
  }): string => {
    return `Olá Talita! Sou ${data.nome}. Gostaria de mais informações sobre planos de saúde. Meus dados:
- Telefone: ${data.telefone}
- Intenção: ${data.intencaoTroca}
- Beneficiário: ${data.beneficiario}
- Idades: ${data.idades}
- Motivo: ${data.motivoBusca}
- Preferência: ${data.preferenciasOperadora}
- Condições: ${data.condicoesPre}
- Abrangência: ${data.abrangencia}
- Rede ampla: ${data.redeAmpla}
- Preço importante: ${data.criterioPreco}`;
  };

  it("deve construir mensagem WhatsApp com todos os dados", () => {
    const testData = {
      nome: "João Silva",
      telefone: "(91) 98765-4321",
      intencaoTroca: "Sim",
      beneficiario: "Família",
      idades: "35, 32, 8",
      motivoBusca: "Melhor cobertura",
      preferenciasOperadora: "Hapvida",
      condicoesPre: "Nenhuma",
      abrangencia: "Nacional",
      redeAmpla: "Sim",
      criterioPreco: "Não",
    };

    const message = buildWhatsappMessage(testData);

    expect(message).toContain("João Silva");
    expect(message).toContain("(91) 98765-4321");
    expect(message).toContain("Hapvida");
    expect(message).toContain("Família");
    expect(message).toContain("35, 32, 8");
  });

  it("deve incluir todos os campos na mensagem WhatsApp", () => {
    const testData = {
      nome: "Maria",
      telefone: "(11) 99999-9999",
      intencaoTroca: "Sim",
      beneficiario: "Individual",
      idades: "45",
      motivoBusca: "Segurança",
      preferenciasOperadora: "Bradesco",
      condicoesPre: "Hipertensão",
      abrangencia: "Regional",
      redeAmpla: "Sim",
      criterioPreco: "Sim",
    };

    const message = buildWhatsappMessage(testData);

    expect(message).toContain("Telefone:");
    expect(message).toContain("Intenção:");
    expect(message).toContain("Beneficiário:");
    expect(message).toContain("Idades:");
    expect(message).toContain("Motivo:");
    expect(message).toContain("Preferência:");
    expect(message).toContain("Condições:");
    expect(message).toContain("Abrangência:");
    expect(message).toContain("Rede ampla:");
    expect(message).toContain("Preço importante:");
  });
});
