import UserService from '../services/user.service';
import User from '../models/user'
import _ from 'lodash'
import Validator from '../utils/inputValidator';



class UserController {

  static async createUser(req, res) {

    const request =  _.pick(req.body, ['firstname', 'lastname', 'email', 'password']) 

    const validator = new Validator();
    validator.validate(request, 'required|string|email');
    if (validator.hasErrors) {
      return res.status(400).json({
        status: 400,
        messages: validator.getErrors(),
      });
    }

    let user = new User({
      firstname: request.firstname.trim(),
      lastname: request.lastname.trim(),
      email: request.email.trim(),
      password: request.password.trim(),
    })

    try {
      const createUser = await UserService.createUser(user)
      if(createUser) {
        return res.status(201).json({
          status: 201,
          data: createUser
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
}

export default UserController