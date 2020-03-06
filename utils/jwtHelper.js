import jwt, { decode } from 'jsonwebtoken';
import config from 'dotenv'

config.config()

const secret = process.env.JWT_SECRET

export const jwtSign = payload => jwt.sign(payload, secret, { expiresIn: '24h' }).toString();

export const jwtDecode = req => {

  try {

    const bearToken = req.headers["authorization"];

    if(!bearToken) {
      throw new Error('unathorized: no token')
    }

    //split the bearToken and get the token
    const token = bearToken.split(' ', 2)[1]

    if (!token) {
      throw new Error('unathorized: no token')
    }

    let tokenMetadata = jwt.verify(token, secret);

    return tokenMetadata

  } catch(error) {
    throw error
  }
}
