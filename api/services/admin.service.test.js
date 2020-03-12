import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'
import User from '../models/user'
import  Password from '../utils/password';

const { expect} = chai

import AdminService from "./admin.service"


describe("AdminService", () => {

  let passService

  beforeEach(() => {
    // passService = new Password();
    // teamService = new TeamService();
    // userService = new UserService();
    passService = new Password()
  });

  describe("createAdmin", () => {
    it("should create a new admin", async () => {

      // const recordStub = null
      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
      };

      const hash = "jksdnfkjsdnfskdnfklsdjfkjdsf"

      const passStub = sinon.stub(passService, 'hashPassword').returns(hash);
      const checkStub = sinon.stub(User, "findOne").returns(false);
      const createStub = sinon.stub(User, "create").returns(stubValue);

      const adminService = new AdminService(passService);
      const admin = await adminService.createAdmin(stubValue);

      expect(passStub.calledOnce).to.be.true;
      expect(checkStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(admin._id).to.equal(stubValue._id);
      expect(admin.name).to.equal(stubValue.name);
      expect(admin.role).to.equal("admin"); //this was added as the method is been saved
    });
  });

  // describe("getUser", function() {
  //   it("should retrieve a user with specific id", async function() {
  //     const stub = sinon.stub(UserModel, "findOne").returns(stubValue);
  //     const userRepository = new UserRepository();
  //     const user = await userRepository.getUser(stubValue.id);

  //     expect(stub.calledOnce).to.be.true;
  //     expect(user.id).to.equal(stubValue.id);
  //     expect(user.name).to.equal(stubValue.name);
  //     expect(user.email).to.equal(stubValue.email);
  //     expect(user.createdAt).to.equal(stubValue.createdAt);
  //     expect(user.updatedAt).to.equal(stubValue.updatedAt);
  //   });
  // });
});
