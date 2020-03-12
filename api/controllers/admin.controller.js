import validator from  "email-validator"
import User from '../models/user'



class AdminController {
  constructor(adminService) {
    this.adminService = adminService
  }

  async createAdmin(req, res) {

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
        status: 400,
        error: "invalid email"
      })
    }
    
    let admin = new User({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    })

    try {
      const createAdmin = await this.adminService.createAdmin(admin)
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