import faker from 'faker'
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb'
import User from '../models/user'
import  password from '../utils/password';
import LoginService from './login.service'
import { seedUser } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'


let seededUser
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  seededUser = await seedUser()
});

/**
* Clear all test data after every test.
*/
afterEach(async () => {
  await clearDatabase();
});

/**
* Remove and close the db and server.
*/
afterAll(async () => {
  await closeDatabase();
});


describe('LoginService', () => {

  describe('login', () => {

    it('should not login a user if the user does not exist', async () => {

      const email = 'email@example.com' //this user is not found in our in-memory db
      const pass = 'password'

      const loginService = new LoginService();

      await expect(loginService.login(email, pass)).rejects.toThrow('record not found');
    });

    it('should not login a user if password does not match with hash', async () => {

      const email = seededUser.email
      const pass = 'non-password' //this password will not match

      //we need to mock external dependencies to achieve unit test
      const passStub = jest.spyOn(password, 'validPassword').mockReturnValue(false)  //return that the passwords do not match

      const loginService = new LoginService();

      await expect(loginService.login(email, pass)).rejects.toThrow('Invalid user credentials');

      expect(passStub).toHaveBeenCalled();

    });

    it('should login a user successfully', async () => {

      //this can either be an admin or a normal user
      const email = seededUser.email
      const pass = "password"

      let stubToken = "jkndndfnskdjnfskjdnfjksdnf"

      const passStub = jest.spyOn(password, 'validPassword').mockReturnValue(true) //the passwords match

      const jwtStub = jest.spyOn(jwt, 'sign').mockReturnValue(stubToken); //our fake token

      const loginService = new LoginService();
      const token = await loginService.login(email, pass);

      expect(passStub).toHaveBeenCalled();
      expect(jwtStub).toHaveBeenCalled();
      expect(token).not.toBeNull();
      expect(token.length).toBeGreaterThan(0)
      expect(token).toBe(stubToken);
    });
  });
});

