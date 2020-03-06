import AdminService from '../services/admin.service';
// import Response  from '../utils/response' 
// const response = new Response();

class AdminController {

  static async createAdmin(req, res) {
    const admin = req.body
    if (!admin.firstname) {
      return res.status(400).json({
        status: 400,
        error: "First name is required"
      })
    }
    if (!admin.lastname) {
      return res.status(400).json({
        status: 400,
        error: "Last name is required"
      })
    }
    if (!admin.email) {
      return res.status(400).json({
        status: 400,
        error: "email is required"
      })
    }
    if (!admin.password) {
      return res.status(400).json({
        status: 400,
        error: "password is required"
      })
    }

    try {
      const createAdmin = await AdminService.createAdmin(admin)
      if(createAdmin) {
        return res.status(201).json({
          status: 201,
          data: createAdmin
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

export default AdminController