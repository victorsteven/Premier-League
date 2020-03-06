import jwt from "jsonwebtoken"
// const config = require("config");


const auth = (req, res, next) => {

  //get the token from the header if present
  const token = req.headers["authorization"];
  
  if (!token) return res.status(401).send("unauthorized");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    //if invalid token
    res.status(400).send("unauthorized" + err);
  }
}

export default auth