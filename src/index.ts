import dotenv from 'dotenv';
import { startServer } from './server';

// Load environment variables from .env file
dotenv.config();

// Start the server
startServer();
