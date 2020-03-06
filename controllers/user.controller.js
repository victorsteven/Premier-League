import UserService from '../services/user.service';

class UserController {

  static async createUser(req, res) {
    const user = req.body
    if (!user.firstname) {
      return res.status(400).json({
        status: 400,
        error: "First name is required"
      })
    }
    if (!user.lastname) {
      return res.status(400).json({
        status: 400,
        error: "Last name is required"
      })
    }
    if (!user.email) {
      return res.status(400).json({
        status: 400,
        error: "email is required"
      })
    }
    if (!user.password) {
      return res.status(400).json({
        status: 400,
        error: "password is required"
      })
    }

    try {
      const createUser = await UserService.createUser(user)
      if(createUser) {
        return res.status(201).json({
          status: 201,
          data: createUser
        })
      }
    }catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
}

export default UserController