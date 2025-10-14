import { MongoClient } from 'mongodb';

const DEFAULT_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://hoslpn:UXvrN9rRqVYMuay6@cluster0.aop4hd6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DEFAULT_DB = process.env.MONGODB_DB || 'thaigov_portal';

if (!DEFAULT_URI) {
  throw new Error('Missing MongoDB connection string. Set MONGODB_URI in your environment.');
}

let cached = globalThis.__mongoClientPromise;

if (!cached) {
  const client = new MongoClient(DEFAULT_URI);
  cached = client.connect();
  globalThis.__mongoClientPromise = cached;
}

export function getMongoClient() {
  return cached;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(DEFAULT_DB);
}
