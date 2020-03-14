import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'

import UserController from './user.controller'
import UserService from '../services/user.service'
import validate from '../utils/validate'

 
const { expect } = chai;


//WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER

describe("UserController", () => {

  describe("createUser", () => {
    let status, json, res, userController, userService;

    let sandbox = null

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      userService = new UserService();
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore()
    })

    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it("should return error(s) when validation fails", async () => {
      const req = {
        body: { name: 123, email: faker.internet.email(), password: "sdf" } //the name  and password are invalid
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { "name": "a valid name is required" },
        { "password": "a valid password with atleast 6 characters is required"}
      ]
      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = sandbox.stub(validate, "registerValidate").returns(errors);

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].errors).to.equal(errors);

    });

    it("should create a user successfully", async () => {
      const req = {
        body: { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }
      };
      const stubValue = {
        name: faker.name.findName(),
      };

      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = sandbox.stub(validate, "registerValidate").returns([]); //no input error

      const stub = sandbox.stub(userService, "createUser").returns(stubValue);

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(201);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue);
    });
  });
});