import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb'
import User from '../models/user'
import  password from '../utils/password';
import LoginService from './login.service'

chai.use(require('chai-as-promised'))
const { expect } = chai


describe('LoginService', () => {

  let sandbox = null

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore()
  })

  describe('login', () => {

    it('should not login a user if the user does not exist', async () => {

      const email = "email@example.com"
      const pass = "password"

      const checkStub = sandbox.stub(User, 'findOne').returns(false);

      const loginService = new LoginService();

      await expect(loginService.login(email, pass)).to.be.rejectedWith(Error, "record not found")
      
      expect(checkStub.calledOnce).to.be.true;

    });

    it('should not login a user if password does not match with hash', async () => {

      const email = "email@example.com"
      const pass = "password"

      const record = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      };

      const checkStub = sandbox.stub(User, 'findOne').returns(record);
      const passStub = sandbox.stub(password, 'validPassword').returns(false); //return that the passwords do not match

      const loginService = new LoginService();

      await expect(loginService.login(email, pass)).to.be.rejectedWith(Error, "Invalid user credentials")
      
      expect(passStub.calledOnce).to.be.true;
      expect(checkStub.calledOnce).to.be.true;
      
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

      const checkStub = sandbox.stub(User, 'findOne').returns(stubValue); //the have the user
      const passStub = sandbox.stub(password, 'validPassword').returns(true); //the passwords match
      const jwtStub = sandbox.stub(jwt, 'sign').returns(stubToken); //our fake token

      const loginService = new LoginService();
      const token = await loginService.login(email, pass);

      expect(passStub.calledOnce).to.be.true;
      expect(checkStub.calledOnce).to.be.true;
      expect(jwtStub.calledOnce).to.be.true;

      expect(token).to.not.be.null;
      expect(token).to.have.length.greaterThan(0);
      expect(token).to.equal(stubToken);
    });
  });
});

