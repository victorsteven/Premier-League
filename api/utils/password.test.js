import password from './password'
import bcrypt from 'bcryptjs'



describe('Password', () => {

  describe('hashPassword', () => {

    it('should hash a password', () => {

      //hashing a password can take a lot of time, so we will mock the methods:
      const salt = jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue("dkhfksdjf");
      const hash = jest.spyOn(bcrypt, 'hashSync').mockReturnValue("sjdfkjshdfkjsdfjskjdfsdfsdfsdf");

      let hashed = password.hashPassword("password")

      expect(salt).toHaveBeenCalledTimes(1)
      expect(hash).toHaveBeenCalledTimes(1)
      expect(hashed).toBe('sjdfkjshdfkjsdfjskjdfsdfsdfsdf')
      expect(hashed.length).toBeGreaterThan(0)

    });
  });

  describe('validPassword', () => {

    it('should verify a password with hash', () => {

      let pass = "password"
      let hashed = "skjndfjksndfjnsdjkfnskjdnfjsndf"

      //faking the verification
      const verify = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      let correct = password.validPassword(pass, hashed)

      expect(verify).toHaveBeenCalledTimes(1)
      expect(correct).toBeTruthy()
    });
  });
});
