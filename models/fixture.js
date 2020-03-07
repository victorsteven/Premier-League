import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var FixtureSchema = new Schema({

  home: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Team' 
  },
  away: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Team' 
  },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User' 
  },
});

export default mongoose.model('Fixture', FixtureSchema)