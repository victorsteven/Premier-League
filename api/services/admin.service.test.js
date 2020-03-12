import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'
import { ObjectID } from 'mongodb'
import AdminService from './admin.service'
import User from '../models/user'
import  Password from '../utils/password';

chai.use(require('chai-as-promised'))
const { expect } = chai


describe('AdminService', () => {

  let sandbox = null

  let passService

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    passService = new Password()
  });

  afterEach(() => {
    sandbox.restore()
  })

  describe('createAdmin', () => {

    it('should not create a new admin if record already exists', async () => {

      const record = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'admin',
      };

      const checkStub = sandbox.stub(User, 'findOne').returns(record);
  
      const adminService = new AdminService(passService);

      await expect(adminService.createAdmin(record)).to.be.rejectedWith(Error, "record already exist")
      expect(checkStub.calledOnce).to.be.true;

    });

    it('should create a new admin', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'admin',
      };

      const hash = 'jksdnfkjsdnfskdnfklsdjfkjdsf'

      const checkStub = sandbox.stub(User, 'findOne').returns(false);

      const passStub = sandbox.stub(passService, 'hashPassword').returns(hash);
      const createStub = sandbox.stub(User, 'create').returns(stubValue);

      const adminService = new AdminService(passService);
      const admin = await adminService.createAdmin(stubValue);

      expect(passStub.calledOnce).to.be.true;
      expect(checkStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(admin._id).to.equal(stubValue._id);
      expect(admin.name).to.equal(stubValue.name);
      expect(admin.role).to.equal(stubValue.role);

    });
  });


  describe('getAdmin', () => {

    it('should not get a new admin if record does not exists', async () => {

      //any id, fields that the service accepts is assumed to have been  checkedin the controller. That is, only valid data can find there way here. So the "adminId" must be valid
      let adminObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      const getStub = sandbox.stub(User, 'findOne').returns(false);
      const adminService = new AdminService(passService);

      await expect(adminService.getAdmin(adminObjID)).to.be.rejectedWith(Error, "admin does not exist")
      expect(getStub.calledOnce).to.be.true;
     
    });

    it('should get an admin', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        role: 'admin',
      };

      let adminObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      const adminStub = sandbox.stub(User, 'findOne').returns(stubValue);

      const adminService = new AdminService(passService);
      const admin = await adminService.getAdmin(adminObjID);

      expect(adminStub.calledOnce).to.be.true;
      expect(admin._id).to.equal(stubValue._id);
      expect(admin.name).to.equal(stubValue.name);
      expect(admin.role).to.equal(stubValue.role);

    });
  });
});
