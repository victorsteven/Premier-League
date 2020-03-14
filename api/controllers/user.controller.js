import User from '../models/user'
import validate from '../utils/validate'



class UserController {

  constructor(userService){
    this.userService = userService
  }

  async createUser(req, res) {

    const errors = validate.registerValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    const { name, email, password } =  req.body
    
    let user = new User({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    })

    try {
      const createUser = await this.userService.createUser(user)
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