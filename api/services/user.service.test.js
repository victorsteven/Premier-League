import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'
import { ObjectID } from 'mongodb'
import UserService from './user.service'
import User from '../models/user'
import  Password from '../utils/password';

chai.use(require('chai-as-promised'))
const { expect } = chai


describe('UserService', () => {

  let passService

  beforeEach(() => {
    passService = new Password()
  });

  describe('createUser', () => {

    it('should not create a new user if record already exists', async () => {

      const record = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'user',
      };

      let sandbox = sinon.createSandbox();

      before( async () => {

        const checkStub = sandbox.stub(User, 'findOne').returns(record);
    
        const userService = new UserService(passService);

        await expect(userService.createUser(record)).to.be.rejectedWith(Error, "record already exist")
        expect(checkStub.calledOnce).to.be.true;

      });
      after(() => {
        sandbox.restore();
      })
    });

    it('should create a new user', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'user',
      };

      const hash = 'jksdnfkjsdnfskdnfklsdjfkjdsf'

      let sandbox = sinon.createSandbox();

      before( async () => {

        const checkStub = sandbox.stub(User, 'findOne').returns(false);

        const passStub = sinon.stub(passService, 'hashPassword').returns(hash);
        const createStub = sinon.stub(User, 'create').returns(stubValue);

        const userService = new UserService(passService);
        const user = await userService.createUser(stubValue);

        expect(passStub.calledOnce).to.be.true;
        expect(checkStub.calledOnce).to.be.true;
        expect(createStub.calledOnce).to.be.true;
        expect(user._id).to.equal(stubValue._id);
        expect(user.name).to.equal(stubValue.name);
        expect(user.role).to.equal(stubValue.role);
      })
      after(() => {
        sandbox.restore();
      })
    });
  });


  describe('getuser', () => {

    it('should not get a new user if record does not exists', async () => {

      //any id, fields that the service accepts is assumed to have been  checkedin the controller. That is, only valid data can find there way here. So the "userId" must be valid
      let userObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      let sandbox = sinon.createSandbox();

      before( async () => {

      const getStub = sandbox.stub(User, 'findOne').returns(false);
      const userService = new UserService(passService);

      await expect(userService.getUser(userObjID)).to.be.rejectedWith(Error, "user does not exist")
      expect(getStub.calledOnce).to.be.true;

      })

      after(() => {
        sandbox.restore();
      })
    });

    it('should get an user', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'user',
      };

      let userObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      let sandbox = sinon.createSandbox();

      before( async () => {

        const userStub = sandbox.stub(User, 'findOne').returns(stubValue);

        const userService = new UserService(passService);
        const user = await userService.getUser(userObjID);

        expect(userStub.calledOnce).to.be.true;
        expect(user._id).to.equal(stubValue._id);
        expect(user.name).to.equal(stubValue.name);
        expect(user.role).to.equal(stubValue.role);

      });

      after(() => {
        sandbox.restore();
      });
    });
  });
});
