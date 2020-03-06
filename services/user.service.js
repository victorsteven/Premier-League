import User from '../models/user'
import { hashPassword } from '../utils/password';


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

      const createdUser = await User.create(user);

      const { firstname, lastname, role } = createdUser;

      //return user details except email and password:
      const publicUser = { 
        _id: createdUser._id.toHexString(),
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