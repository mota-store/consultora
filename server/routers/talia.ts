import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { faqItems, getOperadoraInfo, getOperadoraRules, getFAQResponse, operadorasInfo } from "../knowledge-base";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface TaliaMessage {
  role: "user" | "assistant";
  content: string;
}

export const taliaRouter = router({
  // Enviar mensagem para Tália e obter resposta
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
        context: z.object({
          step: z.number(),
          totalSteps: z.number(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Sistema prompt para a Tália
        // Construir sistema prompt com base de conhecimento
        const operadorasContext = Object.entries(operadorasInfo)
          .map(([_, op]) => `- ${op.nome}: ${op.descricao}`)
          .join("\n");

        const systemPrompt = `Você é Tália, uma assistente IA humanizada e amigável que trabalha para Talita Motta, consultora especializada em planos de saúde. 

Características:
- Use emojis apropriados para ser mais humanizada
- Seja breve e direto nas respostas
- NUNCA cite preços de planos
- NUNCA prometa aceitação de doenças pré-existentes
- Sempre seja empático e profissional
- Responda em português brasileiro

Operadoras parceiras:
${operadorasContext}

Se o cliente perguntar sobre:
- Carência: Explique que é o período de espera entre contratação e cobertura
- Coparticipação: Explique que é a porcentagem que o cliente paga
- Tipos de plano: Mencione individual, familiar e coletivo
- Doenças pré-existentes: Diga que pode contratar, mas pode haver carência específ ica

Você está na etapa ${input.context.step + 1} de ${input.context.totalSteps}.`;

        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://consultora-talita-motta.com",
            "X-Title": "Talita Motta - Consultoria de Planos de Saúde",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              ...input.messages,
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("OpenRouter error:", error);
          throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0]?.message?.content || "";

        return {
          success: true,
          message: assistantMessage,
          usage: data.usage,
        };
      } catch (error) {
        console.error("Erro ao chamar OpenRouter:", error);
        throw new Error("Erro ao processar mensagem com Tália");
      }
    }),

  // Validar informação coletada
  validate: publicProcedure
    .input(
      z.object({
        field: z.string(),
        value: z.string(),
      })
    )
    .query(async ({ input }) => {
      // Validações simples
      switch (input.field) {
        case "telefone":
          // Validar formato de telefone brasileiro
          const phoneRegex = /^\(?[1-9]{2}\)?[\s9]?[0-9]{4}-?[0-9]{4}$/;
          return {
            valid: phoneRegex.test(input.value),
            message: phoneRegex.test(input.value)
              ? "Telefone válido ✅"
              : "Telefone inválido. Use formato: (11) 99999-9999",
          };

        case "idade":
          const age = parseInt(input.value);
          return {
            valid: age >= 0 && age <= 120,
            message:
              age >= 0 && age <= 120
                ? "Idade válida ✅"
                : "Idade deve estar entre 0 e 120 anos",
          };

        case "operadora":
          const validOperadoras = [
            "hapvida",
            "bradesco",
            "hospital amazônia",
            "hospital adventista",
          ];
          const isValid = validOperadoras.some((op) =>
            input.value.toLowerCase().includes(op)
          );
          return {
            valid: isValid,
            message: isValid
              ? "Operadora reconhecida ✅"
              : "Operadora não reconhecida. Opções: Hapvida, Bradesco, Hospital Amazônia, Hospital Adventista",
          };

        default:
          return {
            valid: input.value.length > 0,
            message: input.value.length > 0 ? "Válido ✅" : "Campo não pode estar vazio",
          };
      }
    }),

  // Obter resposta de FAQ
  getFAQ: publicProcedure
    .input(
      z.object({
        pergunta: z.string(),
      })
    )
    .query(async ({ input }) => {
      const resposta = getFAQResponse(input.pergunta);
      return {
        encontrado: resposta !== null,
        resposta: resposta || "Desculpe, não encontrei uma resposta para essa pergunta. Fale com a Talita no WhatsApp!",
      };
    }),

  // Obter informações de operadora
  getOperadora: publicProcedure
    .input(
      z.object({
        nome: z.string(),
      })
    )
    .query(async ({ input }) => {
      const operadora = getOperadoraInfo(input.nome);
      const regras = getOperadoraRules(input.nome);
      return {
        encontrado: operadora !== null,
        operadora,
        regras,
      };
    }),
});
