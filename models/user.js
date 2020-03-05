import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: {
   type: String, required: true, max: 100
  },
  lastName: {
   type: String, required: true, max: 100
  },
  email: {
   type: String, required: true, max: 100
  },
  password: {
   type: String, required: true, max: 100
  },
});

export default UserSchema