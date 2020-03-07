import AdminService from '../services/admin.service';
import _ from 'lodash'
import User from '../models/user'
import Validator from '../utils/inputValidator';



class AdminController {

  static async createAdmin(req, res) {

    const request =  _.pick(req.body, ['firstname', 'lastname', 'email', 'password'])
    
    const validator = new Validator();
    validator.validate(request, 'required|string|email');
    if (validator.hasErrors) {
      return res.status(400).json({
        status: 400,
        messages: validator.getErrors(),
      });
    }

    let admin = new User({
      firstname: request.firstname.trim(),
      lastname: request.lastname.trim(),
      email: request.email.trim(),
      password: request.password.trim(),
    })


    try {
      const createAdmin = await AdminService.createAdmin(admin)
      if(createAdmin) {
        return res.status(201).json({
          status: 201,
          data: createAdmin
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

export default AdminController