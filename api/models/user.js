import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String, required: true, max: 100
  },
  email: {
    type: String, 
    required: true, 
    max: 100, 
    unique: true
  },
  password: {
    type: String, required: true, max: 255
  },
  role: {
    type: String, required: true, max: 100
  },
});

export default mongoose.model('User', UserSchema)