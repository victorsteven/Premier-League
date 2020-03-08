import bcrypt from 'bcryptjs'

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(15);
  password = bcrypt.hashSync(password, salt)

  return password
};

export const validPassword = (password, userPassword) => {
  const isValid = bcrypt.compareSync(password, userPassword);
  return isValid;
};
