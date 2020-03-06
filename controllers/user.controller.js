import UserService from '../services/user.service';
// import Response  from '../utils/response' 
// const response = new Response();

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

  // static async createAdmin(req, res) {
  //   const user = req.body
  //   if (!user.firstname) {
  //     response.error(400, 'First name is required')
  //     return response.sendErr(res)
  //   }
  //   if (!user.lastname) {
  //     response.error(400, 'Last name is required')
  //     return response.send(res)
  //   }
  //   if (!user.email) {
  //     response.error(400, 'Email is required')
  //     return response.send(res)
  //   }
  //   if (!user.password) {
  //     response.error(400, 'Password is required')
  //     return response.send(res)
  //   }

  //   try {
  //     const createUser = await UserService.createUser(user)
  //     if(createUser) {
  //       response.setSuccess(201, createUser)
  //     }
  //     return response.send(res)
  //   }catch(err) {
  //     response.error(400, error.message)
  //     return response.send(res)
  //   }
  // }
}

export default UserController