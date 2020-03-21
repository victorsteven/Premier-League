import User from '../models/user'
import jwt from 'jsonwebtoken';
import config from 'dotenv'
import password from '../utils/password'


config.config()


class LoginService {
  constructor() {
    this.user = User
  }

  async login(email, pass) {

    try {

      const user = await this.user.findOne({ email: email });
      if(!user) {
        throw new Error('record not found');
      }
      const correctPass = password.validPassword(pass, user.password);
      if (correctPass) {
        let userCred = {
          _id: user._id.toHexString(),
          role: user.role
        }

       const token = jwt.sign(userCred, process.env.JWT_SECRET).toString();

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