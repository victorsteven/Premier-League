import jwt from 'jsonwebtoken';

const jwtSign = payload => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }).toString();

export default jwtSign;
