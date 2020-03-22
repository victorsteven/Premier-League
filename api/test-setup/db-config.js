import mongoose from 'mongoose'


//in-memory db used only in unit testing
export const connect = async () => {
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };
  await mongoose.connect(global.__MONGO_URI__, mongooseOpts)
};

//Drop database, close the connection. 
//Used by both unit and e2e tests
export const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};


//Remove all the data for all db collections. 
//Used by both unit and e2e tests
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
  }
};