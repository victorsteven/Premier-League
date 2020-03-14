import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'
import { ObjectID } from 'mongodb'
import UserService from './user.service'
import User from '../models/user'
import password from '../utils/password';

chai.use(require('chai-as-promised'))
const { expect } = chai


describe('UserService', () => {

  let sandbox = null

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore()
  })

  describe('createUser', () => {

    it('should not create a new user if record already exists', async () => {

      const record = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'user',
      };

      const checkStub = sandbox.stub(User, 'findOne').returns(record);
  
      const userService = new UserService();

      await expect(userService.createUser(record)).to.be.rejectedWith(Error, "record already exist")
      expect(checkStub.calledOnce).to.be.true;

    });
    

    it('should create a new user', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'user',
      };

      const hash = 'jksdnfkjsdnfskdnfklsdjfkjdsf'

      const checkStub = sandbox.stub(User, 'findOne').returns(false);
      const passStub = sandbox.stub(password, 'hashPassword').returns(hash);
      const createStub = sandbox.stub(User, 'create').returns(stubValue);

      const userService = new UserService();
      const user = await userService.createUser(stubValue);

      expect(passStub.calledOnce).to.be.true;
      expect(checkStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(user._id).to.equal(stubValue._id);
      expect(user.name).to.equal(stubValue.name);
      expect(user.role).to.equal(stubValue.role);

    });
  });


  describe('getUser', () => {

    it('should not get a user if record does not exists', async () => {

      //any id, fields that the service accepts is assumed to have been  checkedin the controller. That is, only valid data can find there way here. So the "userId" must be valid
      let userObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      const getStub = sandbox.stub(User, 'findOne').returns(false);
      const userService = new UserService();

      await expect(userService.getUser(userObjID)).to.be.rejectedWith(Error, "no record found, you are not authenticated")
      expect(getStub.calledOnce).to.be.true;

    });

    it('should get an user', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'user',
      };

      let userObjID = new ObjectID("5e682d0d580b5a6fb795b842")

        const userStub = sandbox.stub(User, 'findOne').returns(stubValue);

        const userService = new UserService();
        const user = await userService.getUser(userObjID);

        expect(userStub.calledOnce).to.be.true;
        expect(user._id).to.equal(stubValue._id);
        expect(user.name).to.equal(stubValue.name);
        expect(user.role).to.equal(stubValue.role);
    });
  });
});
