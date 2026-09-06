import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all Express routes defined in server/routes.ts
// This keeps the Vercel serverless function perfectly in sync with local development
registerRoutes(app);

export default app;
