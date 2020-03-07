import mongoose from 'mongoose'
import validator from 'validator'
// import Joi from 'joi'


var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstname: {
    type: String, required: true, max: 100
  },
  lastname: {
    type: String, required: true, max: 100
  },
  email: {
    type: String, 
    required: true, 
    max: 100, 
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'please provide a valid email'
    }
  },
  password: {
    type: String, required: true, max: 255
  },
  role: {
    type: String, required: true, max: 100
  },
});

// export function validateUser(user) {
//   const schema = {
//     firstname: Joi.string().max(100).required(),
//     lastname: Joi.string().max(100).required(),
//     email: Joi.string().max(255).required().email(),
//     password: Joi.string().max(255).required()
//   };

//   return Joi.validate(user, schema);
// }

export default mongoose.model('User', UserSchema)