import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongod = new MongoMemoryServer();

//in-memory db for unit test
export const connect = async () => {
  const uri = await mongod.getConnectionString();
    const mongooseOpts = {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    };

  await mongoose.connect(uri, mongooseOpts);

};

//works perfectly for unit test
export const closeDatabase = async () => {
    await mongoose.connection.dropDatabase(); 
    await mongoose.connection.close();
};


//Remove all the data for all db collections. 
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
  }
};