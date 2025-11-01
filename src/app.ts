import express, { Express } from 'express';

export function createApp(): Express {
  const app = express();

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Routes will be added here in future phases
  // Example: app.use('/accounts', accountRoutes);

  return app;
}
