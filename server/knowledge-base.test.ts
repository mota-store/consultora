import { describe, it, expect } from "vitest";
import {
  getOperadoraInfo,
  getFAQResponse,
  getOperadoraRules,
  operadorasInfo,
  faqItems,
} from "./knowledge-base";

describe("Knowledge Base - Operadoras", () => {
  it("deve retornar informações da Hapvida", () => {
    const operadora = getOperadoraInfo("hapvida");
    expect(operadora).toBeDefined();
    expect(operadora?.nome).toBe("Hapvida");
    expect(operadora?.aceitaMenuores).toBe(true);
  });

  it("deve retornar informações do Bradesco", () => {
    const operadora = getOperadoraInfo("bradesco");
    expect(operadora).toBeDefined();
    expect(operadora?.nome).toBe("Bradesco Saúde");
    expect(operadora?.requerCNPJ).toBe(true);
    expect(operadora?.requerMinVidas).toBe(3);
  });

  it("deve retornar null para operadora inexistente", () => {
    const operadora = getOperadoraInfo("operadora inexistente");
    expect(operadora).toBeNull();
  });

  it("deve retornar regras do Bradesco", () => {
    const regras = getOperadoraRules("bradesco");
    expect(regras).toBeDefined();
    expect(regras?.length).toBeGreaterThan(0);
    expect(regras?.some((r) => r.includes("CNPJ"))).toBe(true);
    expect(regras?.some((r) => r.includes("3 vidas"))).toBe(true);
  });

  it("deve retornar regras da Hapvida", () => {
    const regras = getOperadoraRules("hapvida");
    expect(regras).toBeDefined();
    expect(regras?.length).toBeGreaterThan(0);
  });
});

describe("Knowledge Base - FAQ", () => {
  it("deve retornar resposta sobre carência", () => {
    const resposta = getFAQResponse("carência");
    expect(resposta).toBeDefined();
    expect(resposta?.toLowerCase()).toContain("carência");
  });

  it("deve retornar resposta sobre coparticipação", () => {
    const resposta = getFAQResponse("coparticipação");
    expect(resposta).toBeDefined();
    expect(resposta?.toLowerCase()).toContain("coparticipação");
  });

  it("deve retornar resposta sobre plano familiar", () => {
    const resposta = getFAQResponse("familiar");
    expect(resposta).toBeDefined();
    expect(resposta?.toLowerCase()).toContain("familiar");
  });

  it("deve retornar resposta sobre doenças pré-existentes", () => {
    const resposta = getFAQResponse("pré-existente");
    expect(resposta).toBeDefined();
    expect(resposta?.toLowerCase()).toContain("pré-existente");
  });

  it("deve retornar null para pergunta não encontrada", () => {
    const resposta = getFAQResponse("pergunta aleatória que não existe");
    expect(resposta).toBeNull();
  });

  it("deve ter pelo menos 5 itens de FAQ", () => {
    expect(faqItems.length).toBeGreaterThanOrEqual(5);
  });

  it("cada item de FAQ deve ter pergunta e resposta", () => {
    faqItems.forEach((item) => {
      expect(item.pergunta).toBeDefined();
      expect(item.pergunta.length).toBeGreaterThan(0);
      expect(item.resposta).toBeDefined();
      expect(item.resposta.length).toBeGreaterThan(0);
    });
  });
});

describe("Knowledge Base - Validações", () => {
  it("Bradesco deve exigir CNPJ", () => {
    const operadora = getOperadoraInfo("bradesco");
    expect(operadora?.requerCNPJ).toBe(true);
  });

  it("Hapvida não deve exigir CNPJ", () => {
    const operadora = getOperadoraInfo("hapvida");
    expect(operadora?.requerCNPJ).toBe(false);
  });

  it("todas as operadoras devem aceitar menores", () => {
    Object.values(operadorasInfo).forEach((operadora) => {
      expect(operadora.aceitaMenuores).toBe(true);
    });
  });

  it("todas as operadoras devem ter descrição", () => {
    Object.values(operadorasInfo).forEach((operadora) => {
      expect(operadora.descricao).toBeDefined();
      expect(operadora.descricao.length).toBeGreaterThan(0);
    });
  });

  it("todas as operadoras devem ter tipos de plano", () => {
    Object.values(operadorasInfo).forEach((operadora) => {
      expect(operadora.tiposPlano).toBeDefined();
      expect(operadora.tiposPlano.length).toBeGreaterThan(0);
    });
  });
});
