import User from '../models/user'
import { validPassword } from '../utils/password'
import  { jwtSign }  from '../utils/jwtHelper'

class LoginService {
  constructor() {
    this.user = User
  }

  async login(email, password) {

    try {
      const user = await this.user.findOne({ email: email });

      if(!user) {
        throw new Error('record not found');
      }
      const correctPass = await validPassword(password, user.password);
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