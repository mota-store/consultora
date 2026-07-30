import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getConsultoraByEmail, getDb } from "../db";
import { consultoras } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

// Função simples de hash (em produção, usar bcrypt)
function hashPassword(password: string): string {
  // Para desenvolvimento, usar um hash simples
  // Em produção, SEMPRE usar bcrypt ou argon2
  return Buffer.from(password).toString("base64");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export const consultoraRouter = router({
  // Login da consultora
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        senha: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const consultora = await getConsultoraByEmail(input.email);
      
      if (!consultora) {
        throw new Error("Consultora não encontrada");
      }

      if (!verifyPassword(input.senha, consultora.senha)) {
        throw new Error("Senha incorreta");
      }

      // Retornar dados da consultora (sem a senha)
      return {
        id: consultora.id,
        nome: consultora.nome,
        email: consultora.email,
        telefone: consultora.telefone,
        whatsapp: consultora.whatsapp,
      };
    }),

  // Criar nova consultora (apenas para setup inicial)
  create: publicProcedure
    .input(
      z.object({
        nome: z.string(),
        email: z.string().email(),
        senha: z.string(),
        telefone: z.string(),
        whatsapp: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existente = await getConsultoraByEmail(input.email);
      if (existente) {
        throw new Error("Email já cadastrado");
      }

      const senhaHash = hashPassword(input.senha);

      await db.insert(consultoras).values({
        nome: input.nome,
        email: input.email,
        senha: senhaHash,
        telefone: input.telefone,
        whatsapp: input.whatsapp,
      });

      return { success: true };
    }),

  // Obter dados da consultora por ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(consultoras)
        .where(eq(consultoras.id, input.id))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const consultora = result[0];
      return {
        id: consultora.id,
        nome: consultora.nome,
        email: consultora.email,
        telefone: consultora.telefone,
        whatsapp: consultora.whatsapp,
      };
    }),
});
