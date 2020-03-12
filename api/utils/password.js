import bcrypt from 'bcryptjs'


class Password {

  validPassword(password, userPassword){
    const isValid = bcrypt.compareSync(password, userPassword);
    return isValid;
  };

  hashPassword(password) {
    const salt = bcrypt.genSaltSync(15);
    password = bcrypt.hashSync(password, salt)
    return password
  };
}

export default Password

// export const hashPassword = (password) => {
//   const salt = bcrypt.genSaltSync(15);
//   password = bcrypt.hashSync(password, salt)

//   return password
// };


