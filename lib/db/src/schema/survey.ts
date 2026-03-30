import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const surveyResponsesTable = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  gpa: text("gpa").notNull(),
  state: text("state").notNull(),
  sports: text("sports").array().notNull(),
  restaurants: text("restaurants").array().notNull(),
  otherRestaurant: text("other_restaurant"),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponsesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponsesTable.$inferSelect;
