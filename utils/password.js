import bcrypt from 'bcryptjs'

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(15);
  password = bcrypt.hashSync(password, salt)

  return password
};

export default hashPassword;