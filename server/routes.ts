import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactMessageSchema, teamRegistrationSchema } from "../shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { fetchEventImages, fetchDriveImageStream } from "./lib/google-drive";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/events/:event/images
  app.get("/api/events/:event/images", async (req, res) => {
    try {
      const eventSlug = req.params.event;
      if (!eventSlug) {
        return res.status(400).json({ success: false, message: "Event parameter is required" });
      }

      const images = await fetchEventImages(eventSlug);

      res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
      res.json({
        success: true,
        event: eventSlug,
        count: images.length,
        images,
      });
    } catch (error) {
      console.error("Error retrieving event images:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event images",
        images: [],
      });
    }
  });

  // GET /api/drive/image/:fileId - stream converted JPEG image media directly from server
  app.get("/api/drive/image/:fileId", async (req, res) => {
    try {
      const fileId = req.params.fileId;
      if (!fileId) {
        return res.status(400).send("File ID required");
      }

      const imageStream = await fetchDriveImageStream(fileId);
      if (!imageStream) {
        return res.status(404).send("Image not found");
      }

      res.setHeader("Content-Type", imageStream.mimeType || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400, immutable");

      imageStream.stream.pipe(res);
    } catch (error) {
      console.error("Error serving Drive image file:", error);
      if (!res.headersSent) {
        res.status(500).send("Error serving file");
      }
    }
  });

  // prefix all routes with /api
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactMessageSchema.parse(req.body);
      const savedMessage = await storage.saveContactMessage(validatedData);

      res.status(201).json({
        success: true,
        message: "Contact message received successfully",
        data: savedMessage
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: "An error occurred while processing your request"
        });
      }
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = teamRegistrationSchema.parse(req.body);
      console.log("Registration request received:", {
        teamName: validatedData.teamName,
        college: validatedData.college,
        email: validatedData.email,
      });

      const result = await storage.saveTeamRegistration(validatedData);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: validatedData
        });
      } else {
        console.error("Registration failed:", result.message);
        res.status(500).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error("Registration error:", error instanceof Error ? error.message : String(error));
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : "An error occurred while processing your request"
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

