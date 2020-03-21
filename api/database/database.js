import mongoose from 'mongoose'
import { dbconn } from './config';

//mongoose uses callback by default. but we want the javascript global promise
mongoose.Promise = global.Promise;

// const conn = 'mongodb://mongo:27017/premier-league' //using docker
const conn = dbconn()

const mongoDB = process.env.MONGODB_URI || conn;

// mongoose.connect(mongoDB, {poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true,useUnifiedTopology: true});

mongoose.connect(mongoDB, {useNewUrlParser: true});

export default mongoose