import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
    create: publicProcedure
      .input(z.object({
        nome: z.string(),
        telefone: z.string(),
        email: z.string(),
      }))
      .mutation(async ({ input }) => {
        // TODO: Save to database
        return { insertId: Math.random() };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        data: z.any(),
      }))
      .mutation(async ({ input }) => {
        // TODO: Update in database
        return { success: true };
      }),
    addMessage: publicProcedure
      .input(z.object({
        leadId: z.number(),
        mensagem: z.string(),
        remetente: z.string(),
      }))
      .mutation(async ({ input }) => {
        // TODO: Save message to database
        return { success: true };
      }),
  }),

  talia: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        context: z.object({
          step: z.number(),
          totalSteps: z.number(),
        }),
      }))
      .mutation(async ({ input }) => {
        try {
          // Get OpenRouter API key from environment
          const apiKey = process.env.OPENROUTER_API_KEY;
          if (!apiKey) {
            throw new Error("OpenRouter API key not configured");
          }

          // Create a dynamic system prompt for emergent narrative
          const systemPrompt = `Você é a Tália, assistente virtual da Talita Motta, especialista em consultoria de planos de saúde.

Seu objetivo é coletar informações sobre o cliente de forma NATURAL e CONVERSACIONAL:
- Nome completo
- Telefone com WhatsApp
- Idade
- Se já tem plano de saúde
- Se quer comprar ou trocar de plano
- Dúvidas ou necessidades específicas

IMPORTANTE:
- Seja amigável, use emojis naturalmente
- Não repita informações já coletadas
- Faça perguntas de forma natural e conversacional
- Adapte suas respostas baseado no contexto
- Se o usuário não tiver plano, não pergunte sobre trocar
- Quando tiver todas as informações, confirme e finalize
- Gere uma narrativa EMERGENTE, não um script rígido
- Seja genuína e conversável, como uma pessoa real`;

          // Call OpenRouter API with emergent narrative approach
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
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
              temperature: 0.8,
              max_tokens: 250,
            }),
          });

          if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
          }

          const data = await response.json();
          const message = data.choices?.[0]?.message?.content || "Como posso ajudá-lo com planos de saúde?";

          return { message };
        } catch (error) {
          console.error("Talia chat error:", error);
          throw error;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
