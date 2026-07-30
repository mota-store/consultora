import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabela de Leads
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  status: mysqlEnum("status", ["novo", "negociacao", "fechado", "acompanhamento"]).default("novo").notNull(),
  // Dados coletados pela Tália
  intencaoTroca: varchar("intencaoTroca", { length: 255 }), // sim/não
  beneficiario: varchar("beneficiario", { length: 255 }), // próprio/outra pessoa/empresa
  idades: text("idades"), // JSON array de idades
  motivoBusca: varchar("motivoBusca", { length: 255 }), // tratamento específico/segurança
  preferenciasOperadora: varchar("preferenciasOperadora", { length: 255 }), // Hapvida/Bradesco/etc
  condicoesPre: text("condicoesPre"), // condições pré-existentes
  abrangencia: varchar("abrangencia", { length: 50 }), // nacional/regional
  redeAmpla: varchar("redeAmpla", { length: 50 }), // sim/não
  criterioPreco: varchar("criterioPreco", { length: 50 }), // sim/não
  dataConversa: timestamp("dataConversa").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// Tabela de Conversas com Tália
export const conversas = mysqlTable("conversas", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull().references(() => leads.id, { onDelete: "cascade" }),
  mensagem: text("mensagem").notNull(),
  remetente: mysqlEnum("remetente", ["usuario", "talia"]).notNull(), // quem enviou
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Conversa = typeof conversas.$inferSelect;
export type InsertConversa = typeof conversas.$inferInsert;

// Tabela de Consultora (para login)
export const consultoras = mysqlTable("consultoras", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  senha: varchar("senha", { length: 255 }).notNull(), // hash da senha
  telefone: varchar("telefone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(), // número para redirecionamento
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Consultora = typeof consultoras.$inferSelect;
export type InsertConsultora = typeof consultoras.$inferInsert;