import express, { Express } from 'express';
import accountRoutes from './modules/account/account.routes';

export function createApp(): Express {
  const app = express();

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Register account routes
  app.use(accountRoutes);

  return app;
}
