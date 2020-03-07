import User from '../models/user'
import { hashPassword } from '../utils/password';
import { ObjectID } from 'mongodb';


class UserService {

  static async createUser(user) {

    try {

      //check if the user already exist
      const record = await User.findOne({ email: user.email })
      if (record) {
        throw new Error('record already exist');
      }
      //proceed with the user
      user.password = hashPassword(user.password)

      //assign role:
      user.role = "user"

      //create the user
      const createdUser = await User.create(user);

      const { _id, firstname, lastname, role } = createdUser;

      //return user details except email and password:
      const publicUser = { 
        _id,
        firstname,
        lastname,
        role
      }

      return publicUser

    } catch(error) {
      throw error;
    }
  }

  //This user can either be an "admin" or a "normal user"
  //This function is used to check if a user is authenticated
  static async getUser(userId) {

    let userObjID = new ObjectID(userId)

    try {

      const gottenUser = await User.findOne({ _id: userObjID })
      if (!gottenUser) {
        throw new Error('no record found, you are not authenticated');
      }

      const { firstname, lastname, role } = gottenUser;

      //return user details except email and password:
      const publicUser = { 
        _id: gottenUser._id,
        firstname,
        lastname,
        role
      }

      return publicUser

    } catch(error) {
      throw error;
    }
  }
}

export default UserService