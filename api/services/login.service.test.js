import chai from 'chai'
import sinon from 'sinon'
import { ObjectID } from 'mongodb'
import jwt from 'jsonwebtoken';
import  password from '../utils/password';
import LoginService from './login.service'
import { seedUser } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'


chai.use(require('chai-as-promised'))
const { expect } = chai

describe('LoginService', () => {

  let seededUser, sandbox = null
  /**
   * Connect to a new in-memory database before running any tests.
   */
  before(async () => {
    await connect();
  });

  beforeEach(async () => {
    seededUser = await seedUser()
    sandbox = sinon.createSandbox()
  });

  /**
  * Clear all test data after every test.
  */
  afterEach(async () => {
    await clearDatabase();
    sandbox.restore()
  });

  /**
  * Remove and close the db and server.
  */
  after(async () => {
    await closeDatabase();
  });

  describe('login', () => {

    it('should not login a user if the user does not exist', async () => {

      const email = 'email@example.com' //this user is not found in our in-memory db
      const pass = 'password'

      const loginService = new LoginService();

      await expect(loginService.login(email, pass)).to.be.rejectedWith(Error, "record not found")

    });

    it('should not login a user if password does not match with hash', async () => {

      const email = seededUser.email
      const pass = 'non-password' //this password will not match

      //we need to mock external dependencies to achieve unit test
      const passStub = sandbox.stub(password, 'validPassword').returns(false)  //return that the passwords do not match

      const loginService = new LoginService();

      await expect(loginService.login(email, pass)).to.be.rejectedWith(Error, "Invalid user credentials")

      expect(passStub.calledOnce).to.be.true;
      
    });

    it('should login a user successfully', async () => {

      //this can either be an admin or a normal user
      const email = seededUser.email
      const pass = "password"

      let stubToken = "jkndndfnskdjnfskjdnfjksdnf"

      const passStub = sandbox.stub(password, 'validPassword').returns(true) //the passwords match

      const jwtStub = sandbox.stub(jwt, 'sign').returns(stubToken); //our fake token

      const loginService = new LoginService();
      const token = await loginService.login(email, pass);

      expect(passStub.calledOnce).to.be.true;
      expect(jwtStub.calledOnce).to.be.true;
      expect(token).not.to.be.null;
      expect(token.length).to.be.greaterThan(0)
      expect(token).to.equal(stubToken);
    });
  });
});

