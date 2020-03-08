import LoginService from '../services/login.service'
import _ from 'lodash'
import Validator from '../utils/inputValidator';


class LoginController {

  static async login(req, res) {

    //take only what we need
    const request = _.pick(req.body, ['email', 'password'])

    const validator = new Validator();
    validator.validate(request, 'required|string|email');
    if (validator.hasErrors) {
      return res.status(400).json({
        status: 400,
        messages: validator.getErrors(),
      });
    }

    try {
      const token = await LoginService.login(request)
      if(!token) {
        return res.status(500).json({
          status: 500,
          error: "invalid user credentials"
        })
      }
      return res.status(200).json({
        status: 200,
        token
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error:  error.message
      })
    }
  }
}

export default LoginController