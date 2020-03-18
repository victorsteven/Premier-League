import User from '../models/user'
import password from '../utils/password'


class AdminService {
  constructor() {
    this.user = User
  }

  async createAdmin(admin) {

    try {

      //check if the admin already exist
      const record = await this.user.findOne({ email: admin.email })
      if (record) {
        throw new Error('record already exists')
      }

      //hash the admin password
      admin.password = password.hashPassword(admin.password)

      //The admin have the role of admin
      admin.role = "admin"

      const createdAdmin = await this.user.create(admin);

      const { _id, name, role } = createdAdmin;

      //return admin details except email and password:
      const publicAdmin = { 
        _id,
        name,
        role
      }

      return publicAdmin

    } catch(error) {
      throw error;
    }
  }

  async getAdmin(adminId) {

    try {

      // let adminObjID = new ObjectID(adminId)
      
      const gottenAdmin = await this.user.findOne({ _id: adminId })

      if (!gottenAdmin || gottenAdmin.role !== 'admin') {
        throw new Error('no record found');
      }
      
      return gottenAdmin

    } catch(error) {
      throw error;
    }
  }
}

export default AdminService