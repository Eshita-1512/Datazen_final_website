import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact message schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof contactMessageSchema>;

// Team registration schema for Google Sheets
export const teamRegistrationSchema = z.object({
  teamName: z.string().min(2, "Team name is required"),
  college: z.string().min(2, "College name is required"),
  year: z.string().min(1, "Year is required"),
  teamSize: z.string().min(1, "Team size is required"),
  leaderName: z.string().min(2, "Leader name is required"),
  leaderResume: z.string().url("Valid Resume URL required (include https://)"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  members: z.array(z.object({
    name: z.string().min(2, "Member name is required"),
    resume: z.string().url("Valid Resume URL required (include https://)")
  })).optional(),
});

export type TeamRegistration = z.infer<typeof teamRegistrationSchema>;

// First Year Recruitment schema
export const recruitmentApplicationSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address").refine(
    (val) => val.endsWith("@somaiya.edu") || val.endsWith("@djsce.ac.in") || val.includes("somaiya"),
    { message: "Please use your Somaiya email ID (e.g. name@somaiya.edu)" }
  ),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number too long"),
  college: z.string().min(2, "College / branch is required"),
  year: z.literal("First Year"),
  preference1: z.enum(["Tech", "Creative", "Operations", "PR", "Marketing"], {
    errorMap: () => ({ message: "Please select a domain preference" }),
  }),
  preference2: z.enum(["Tech", "Creative", "Operations", "PR", "Marketing"], {
    errorMap: () => ({ message: "Please select a domain preference" }),
  }),
  aboutSelf: z.string().min(20, "Please write at least 20 characters about yourself"),
  whyJoin: z.string().min(20, "Please write at least 20 characters about why you want to join"),
  resumeUrl: z.string().url().optional(),
}).refine((data) => data.preference1 !== data.preference2, {
  message: "Preference 1 and Preference 2 must be different domains",
  path: ["preference2"],
});

export type RecruitmentApplication = z.infer<typeof recruitmentApplicationSchema>;
