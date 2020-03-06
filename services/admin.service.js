import User from '../models/user'
import { hashPassword } from '../utils/password';
import { ObjectID } from 'mongodb'


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
        _id: createdAdmin._id.toHexString(),
        firstname,
        lastname,
        role
      }

      return publicAdmin

    } catch(error) {
      throw error;
    }
  }

  static async getAdmin(adminId) {

    try {

      let adminObjID = new ObjectID(adminId)
      
      const gottenAdmin = await User.findOne({ _id: adminObjID })
      if (!gottenAdmin || gottenAdmin.role !== 'admin') {
        throw new Error('admin does not exist');
      }
      const { firstname, lastname, role } = gottenAdmin;

      //return admin details except email and password:
      const publicAdmin = {
        _id: adminId, 
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