// import mongoose from "mongoose";

// type ConnectionObject = {
//     isConnected?: number;
// };

// const connection: ConnectionObject = {};

// async function dbConnect(): Promise<void> {
//     if (connection.isConnected) {
//         console.log('db is connected already');
//         return;
//     }

//     try {
//         if (!process.env.MONGO_URI) {
//             throw new Error("MONGO_URI not defined");
//         }

//         const db = await mongoose.connect( process.env.MONGO_URI );

//         connection.isConnected = db.connections[0].readyState;

//         console.log('Database connected successfully');
//     }
//     catch(error) {
//         console.error('Database connection error:', error);

//         process.exit(1);

//     }
// }

// export default dbConnect;


import mongoose from "mongoose";

declare global {

  // prevents multiple connections in dev (Next.js hot reload)
  var _mongoDb: any;
}

export default async function dbConnect() {
  if (global._mongoDb) {
    return global._mongoDb;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log("Database connected successfully");

  // BetterAuth needs native MongoDB Db instance
  
  global._mongoDb = mongoose.connection.db;

  return global._mongoDb;
}