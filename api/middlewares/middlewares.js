import jwt from 'jsonwebtoken'
import config from 'dotenv'


config.config()

export const auth = (req, res, next) => {

  try {

    const bearToken = req.headers['authorization'];
    if(!bearToken) {
      res.status(401).json({
        status: 401,
        error: 'unauthorized, you need to be unauthenticated'
      })
    }
    //split the bearToken and get the token
    const token = bearToken.split(' ', 2)[1]
    if (!token) {
      res.status(401).json({
        status: 401,
        error: 'unauthorized: you need to be unauthenticated'
      })
    }
    let tokenMetadata = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenMetadata && (tokenMetadata.role === 'user' || 'admin')){
      req.tokenMetadata = tokenMetadata
      next()
    } else {
      res.status(401).json({
        status: 401,
        error: 'unauthorized: you need to be unauthenticated'
      })
    }
  } catch(error) {
    res.status(401).json({
      status: 401,
      error: `unauthorized ${error.message}`
    })
  }
}

export const adminAuth = (req, res, next) => {

  try {

    const bearToken = req.headers['authorization'];
    if(!bearToken) {
      res.status(401).json({
        status: 401,
        error: 'unauthorized: you are not an admin'
      })
    }
    //split the bearToken and get the token
    const token = bearToken.split(' ', 2)[1]
    if (!token) {
      res.status(401).json({
        status: 401,
        error: 'unauthorized: you are not an admin'
      })
    }
    let tokenMetadata = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenMetadata && (tokenMetadata.role === 'admin')){
      req.tokenMetadata = tokenMetadata
      next()
    } else {
      res.status(401).json({
        status: 401,
        error: 'unauthorized: you are not an admin'
      })
    }
  } catch(error) {
    res.status(401).json({
      status: 401,
      error: `unauthorized: ${error.message}`
    })
  }
}
