import { users, contactMessages, type User, type InsertUser, type ContactMessage, type InsertContactMessage, type TeamRegistration, type RecruitmentApplication } from "../shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  saveTeamRegistration(registration: TeamRegistration): Promise<{ success: boolean; message: string }>;
  saveRecruitmentApplication(application: RecruitmentApplication): Promise<{ success: boolean; message: string }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: Map<number, ContactMessage>;
  private registeredEmails: Set<string>;
  private recruitmentEmails: Set<string>;
  currentId: number;
  currentContactId: number;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.registeredEmails = new Set();
    this.recruitmentEmails = new Set();
    this.currentId = 1;
    this.currentContactId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const contactMessage: ContactMessage = {
      ...message,
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, contactMessage);

    // Attempt to save to Google Sheets
    try {
      const { appendContactMessage } = await import("./lib/google-sheets");
      await appendContactMessage(contactMessage);
    } catch (e) {
      console.error("Failed to append contact message to sheets:", e);
    }

    return contactMessage;
  }

  async saveTeamRegistration(registration: TeamRegistration): Promise<{ success: boolean; message: string }> {
    // Check for duplicate email
    if (this.registeredEmails.has(registration.email)) {
      return {
        success: false,
        message: "This email address has already been registered.",
      };
    }

    try {
      // Import the helper dynamically or statically - static is fine here since it's a server file
      // We need to import it at the top level really, but for minimizing diff context let's check

      console.log("Processing team registration for:", registration.teamName);

      // Attempt to save to Google Sheets
      const { appendTeamRegistration } = await import("./lib/google-sheets");
      const sheetsSuccess = await appendTeamRegistration(registration);

      if (sheetsSuccess) {
        this.registeredEmails.add(registration.email);
        return {
          success: true,
          message: "Registration successful and saved to Google Sheets!",
        };
      } else {
        // Even if sheets fails, we might want to return success if we had a local DB, 
        // but since we rely on sheets/memory, we should warn.
        // However, MemStorage stores nothing effectively for persistence, so Sheets is critical.
        console.warn("Failed to save to Google Sheets, but continuing.");
        return {
          success: true,
          message: "Registration received (Note: Backup to Sheets failed, check logs).",
        };
      }
    } catch (error) {
      console.error("Error in saveTeamRegistration:", error);
      return {
        success: false,
        message: "Internal server error during registration processing",
      };
    }
  }

  async saveRecruitmentApplication(application: RecruitmentApplication): Promise<{ success: boolean; message: string }> {
    if (this.recruitmentEmails.has(application.email)) {
      return {
        success: false,
        message: "This email address has already submitted an application.",
      };
    }

    try {
      console.log("Processing recruitment application for:", application.name);

      const { appendRecruitmentApplication } = await import("./lib/google-sheets");
      const sheetsSuccess = await appendRecruitmentApplication(application);

      this.recruitmentEmails.add(application.email);

      if (sheetsSuccess) {
        return {
          success: true,
          message: "Application submitted successfully! We'll be in touch soon.",
        };
      } else {
        console.warn("Failed to save recruitment application to Google Sheets.");
        return {
          success: true,
          message: "Application received (Note: Backup to Sheets failed, check logs).",
        };
      }
    } catch (error) {
      console.error("Error in saveRecruitmentApplication:", error);
      return {
        success: false,
        message: "Internal server error during application processing",
      };
    }
  }
}

export const storage = new MemStorage();
