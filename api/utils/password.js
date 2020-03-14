import bcrypt from 'bcryptjs'


const password = {

  hashPassword(password) {
    const salt = bcrypt.genSaltSync(15);
    password = bcrypt.hashSync(password, salt)
    return password
  },

  validPassword(password, userPassword){
    const isValid = bcrypt.compareSync(password, userPassword);
    return isValid;
  }
}

export default password


