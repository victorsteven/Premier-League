import User from '../models/user'
import { validPassword } from '../utils/password'
import  { jwtSign }  from '../utils/jwtHelper'

class LoginService {

  static async login(login) {

    try {
      const user = await User.findOne({ email: login.email });

      if(!user) {
        throw new Error('record not found');
      }
      const correctPass = await validPassword(login.password, user.password);
      if (correctPass) {
        let userCred = {
          _id: user._id.toHexString(),
          role: user.role
        }
        const token = jwtSign(userCred);

        return token;
      } else {
        throw new Error('Invalid user credentials');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default LoginService