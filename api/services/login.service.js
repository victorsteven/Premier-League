import User from '../models/user'
import jwt from 'jsonwebtoken';
import config from 'dotenv'

config.config()


class LoginService {
  constructor(password) {
    this.user = User
    this.pass = password
  }

  async login(email, password) {

    try {

      const user = await this.user.findOne({ email: email });
      if(!user) {
        throw new Error('record not found');
      }
      const correctPass = this.pass.validPassword(password, user.password);
      if (correctPass) {
        let userCred = {
          _id: user._id.toHexString(),
          role: user.role
        }

       const token = jwt.sign(userCred, process.env.JWT_SECRET, { expiresIn: '24h' }).toString();

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