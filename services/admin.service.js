import User from '../models/user'
import hashPassword from '../utils/password';


class AdminService {

  static async createAdmin(admin) {

    try {

      //check if the admin already exist
      const record = await User.findOne({ email: admin.email })
      if (record) {
        throw new Error('record already exist');
      }
      //proceed with the admin
      admin.password = hashPassword(admin.password)

      //The admin have the role of admin
      admin.role = "admin"

      const createdAdmin = await User.create(admin);

      const { firstname, lastname, role } = createdAdmin;

      //return admin details except email and password:
      const publicAdmin = { 
        firstname,
        lastname,
        role
      }

      return publicAdmin

    } catch(error) {
      throw error;
    }
  }
}

export default AdminService