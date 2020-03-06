import LoginService from '../services/login.service'
import _ from 'lodash'

class LoginController {

  static async login(req, res) {

    //take only what we need
    const request = _.pick(req.body, ['email', 'password'])

    if (!request.email) {
      return res.status(400).json({
        status: 400,
        error: "Email is required"
      })
    }
    if (!request.password) {
      return res.status(400).json({
        status: 400,
        error: "Password is required"
      })
    }
    try {
      const token = await LoginService.login(request)
      if(!token) {
        return res.status(400).json({
          status: 401,
          error: "unauthorized"
        })
      }
      return res.status(200).json({
        status: 200,
        token
      })
    } catch (error) {
      return res.status(401).json({
        status: 401,
        error:  error
      })
    }
  }
}

export default LoginController