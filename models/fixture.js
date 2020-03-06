import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var FixtureSchema = new Schema({
  home: {
   type: String, required: true, max: 255
  },
  away: {
   type: String, required: true, max: 255
  },
  adminId: {
   type: String, required: true, max: 100
  }
});

export default mongoose.model('Fixture', FixtureSchema)