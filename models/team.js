import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var TeamSchema = new Schema({
  name: {
   type: String, required: true, max: 255, unique: true,
  },
  coach: {
   type: String, required: true, max: 100
  },
  adminId: {
   type: String, required: true, max: 100
  }
});

export default mongoose.model('Team', TeamSchema)