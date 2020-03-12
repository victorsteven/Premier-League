import validator from  "email-validator"
import User from '../models/user'



class UserController {

  constructor(userService){
    this.userService = userService
  }

  async createUser(req, res) {

    const { name, email, password } =  req.body

    if (
      (!name || typeof name !== "string") ||
      (!email || typeof email !== "string") ||
      (!password || typeof password !== "string")
    ) {
      return res.status(400).json({
        status: 400,
        error: "ensure that correct details are sent"
      })
    }
    if (!validator.validate(email)){
      return res.status(400).json({
        error: "invalid email"
      });
    }
    
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