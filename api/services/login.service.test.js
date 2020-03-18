import faker from 'faker'
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb'
import User from '../models/user'
import  password from '../utils/password';
import LoginService from './login.service'



describe('LoginService', () => {

  describe('login', () => {

    it('should not login a user if the user does not exist', async () => {

      const email = 'email@example.com'
      const pass = 'password'

      const checkStub = jest.spyOn(User, 'findOne').mockReturnValue(false)

      const loginService = new LoginService();

      await expect(loginService.login(email, pass)).rejects.toThrow('record not found');

      expect(checkStub).toHaveBeenCalled();

    });

    it('should not login a user if password does not match with hash', async () => {

      const email = 'email@example.com'
      const pass = 'password'

      const record = {
        _id:  new ObjectID("5e69748a6e72a1a0793956eb"), //this id is valid
        name: faker.name.findName(),
      };

      const checkStub = jest.spyOn(User, 'findOne').mockReturnValue(record)

      const passStub = jest.spyOn(password, 'validPassword').mockReturnValue(false)  //return that the passwords do not match

      const loginService = new LoginService();

      await expect(loginService.login(email, pass)).rejects.toThrow('Invalid user credentials');

      expect(checkStub).toHaveBeenCalled();
      expect(passStub).toHaveBeenCalled();

    });

    it('should login a user successfully', async () => {

      //this can either be an admin or a normal user
      const email = "email@example.com"
      const pass = "password"

      const stubValue = {
        _id:  new ObjectID("5e682d0d580b5a6fb795b842"), //we need to make sure this is valid
        name: faker.name.findName(),
      };
      let stubToken = "jkndndfnskdjnfskjdnfjksdnf"

      const checkStub = jest.spyOn(User, 'findOne').mockReturnValue(stubValue)

      const passStub = jest.spyOn(password, 'validPassword').mockReturnValue(true) //the passwords match

      const jwtStub = jest.spyOn(jwt, 'sign').mockReturnValue(stubToken); //our fake token

      const loginService = new LoginService();
      const token = await loginService.login(email, pass);

      expect(checkStub).toHaveBeenCalled();
      expect(passStub).toHaveBeenCalled();
      expect(jwtStub).toHaveBeenCalled();
      expect(token).not.toBeNull();
      expect(token.length).toBeGreaterThan(0)
      expect(token).toBe(stubToken);
    });
  });
});

