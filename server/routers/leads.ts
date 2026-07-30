import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createLead, getLeadById, getAllLeads, updateLeadStatus, createConversa, getConversasByLeadId, updateLead } from "../db";

export const leadsRouter = router({
  // Criar novo lead
  create: publicProcedure
    .input(
      z.object({
        nome: z.string(),
        telefone: z.string(),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createLead({
        nome: input.nome,
        telefone: input.telefone,
        email: input.email,
      });
      return result;
    }),

  // Obter lead por ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getLeadById(input.id);
    }),

  // Listar todos os leads
  list: publicProcedure.query(async () => {
    return await getAllLeads();
  }),

  // Atualizar status do lead
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["novo", "negociacao", "fechado", "acompanhamento"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateLeadStatus(input.id, input.status);
      return { success: true };
    }),

  // Atualizar dados do lead
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          intencaoTroca: z.string().optional(),
          beneficiario: z.string().optional(),
          idades: z.string().optional(),
          motivoBusca: z.string().optional(),
          preferenciasOperadora: z.string().optional(),
          condicoesPre: z.string().optional(),
          abrangencia: z.string().optional(),
          redeAmpla: z.string().optional(),
          criterioPreco: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      await updateLead(input.id, input.data);
      return { success: true };
    }),

  // Adicionar mensagem à conversa
  addMessage: publicProcedure
    .input(
      z.object({
        leadId: z.number(),
        mensagem: z.string(),
        remetente: z.enum(["usuario", "talia"]),
      })
    )
    .mutation(async ({ input }) => {
      await createConversa(input.leadId, input.mensagem, input.remetente);
      return { success: true };
    }),

  // Obter histórico de conversa
  getConversa: publicProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ input }) => {
      return await getConversasByLeadId(input.leadId);
    }),
});
