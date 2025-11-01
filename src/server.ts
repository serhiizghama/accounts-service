import { MongoClient, Db } from 'mongodb';
import { createApp } from './app';

let db: Db;
let client: MongoClient;

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

export async function connectToDatabase(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  client = new MongoClient(mongoUri);
  await client.connect();

  // Extract database name from URI or use default
  const dbName = new URL(mongoUri).pathname.slice(1) || 'accounts-service';
  db = client.db(dbName);

  console.log('Connected to MongoDB');
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

export async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB first
    await connectToDatabase();

    // Create Express app
    const app = createApp();

    // Get port from environment or use default
    const port = process.env.PORT || 3000;

    // Start listening
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      server.close(async () => {
        console.log('HTTP server closed');
        await closeDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
