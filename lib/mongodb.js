import { MongoClient } from 'mongodb';

let clientPromise = globalThis._mongoClientPromise;

export async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
  }

  if (!dbName) {
    throw new Error('MONGODB_DB is not defined in the environment variables.');
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
    globalThis._mongoClientPromise = clientPromise;
  }

  const client = await clientPromise;
  return client.db(dbName);
}

export async function getCollection(name) {
  const db = await getDatabase();
  return db.collection(name);
}
