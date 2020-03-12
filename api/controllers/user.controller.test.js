import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'

import UserController from './user.controller'
import UserService from '../services/user.service'

 
const { expect } = chai;

describe("UserController", () => {

  describe("createUser", () => {
    let status, json, res, userController, userService;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      userService = new UserService();
    });

    it("should not create a user with incorrect details", async () => {
      const req = {
        body: { name: 123, email: faker.internet.email(), password: faker.internet.password() } //the name is invalid
      };

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("ensure that correct details are sent");

    });

    it("should not create a user when the email is invalid", async () => {
      const req = {
        body: { name: "mike", email: "invalidgmail.com", password: faker.internet.password() }
      };
      
      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("invalid email");

    });


    it("should create a user successfully", async () => {
      const req = {
        body: { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }
      };
      const stubValue = {
        name: faker.name.findName(),
      };

      const stub = sinon.stub(userService, "createUser").returns(stubValue);

      userController = new UserController(userService);

      await userController.createUser(req, res);

      console.log("the res: ", json.args[0][0])

      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(201);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue);
    });
  });
});