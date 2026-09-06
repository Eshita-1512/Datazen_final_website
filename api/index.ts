import express from "express";
import { registerRoutes } from "../server/routes";

// Crucial for Vercel + Multer: We must disable Vercel's default body parser
// so that Multer can process the raw multipart/form-data stream itself.
export const config = {
  api: {
    bodyParser: false,
  },
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all Express routes defined in server/routes.ts
// This keeps the Vercel serverless function perfectly in sync with local development
registerRoutes(app);

export default app;
