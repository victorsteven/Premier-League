import User from '../models/user'
import validate from '../utils/validate'



class AdminController {
  constructor(adminService) {
    this.adminService = adminService
  }

  async createAdmin(req, res) {

    const errors = validate.registerValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    const { name, email, password } = req.body

    let admin = new User({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    })

    try {
      const createAdmin = await this.adminService.createAdmin(admin)
      
      return res.status(201).json({
        status: 201,
        data: createAdmin
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
}

export default AdminController