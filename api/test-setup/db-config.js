import mongoose from 'mongoose'


//Connect to the in-memory database. This is used for unit testing.
//ie, none of the e2e test uses this. Our e2e tests uses a real test db, which is defined in ../database/config file
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