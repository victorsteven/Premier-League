import User from '../models/user'
import hashPassword from '../utils/password';


class UserService {

  static async createUser(user) {
    // console.log("we entered the store house with; ", user)
    try {

      //check if the user already exist
      const isUser = await User.findOne({ email: user.email })
      if (isUser) {
        throw new Error('user already exist');
      }
      //proceed with the user
      user.password = hashPassword(user.password)

      const createdUser = await User.create(user);

      const { firstname, lastname } = createdUser;

      //return user details except email and password:
      const publicUser = { 
        firstname,
        lastname
      }

      return publicUser

    } catch(error) {
      throw error;
    }
  }
}

export default UserService