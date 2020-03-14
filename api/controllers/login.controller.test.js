import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'

import LoginController from './login.controller'
import LoginService from '../services/login.service'
import validate from '../utils/validate'



const { expect } = chai;

describe("LoginController", () => {

  describe("loginUser", () => {
    let status, json, res, loginController, loginService;

    let sandbox = null

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      loginService = new LoginService();
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore()
    })


    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it("should return error(s) when validation fails", async () => {
      const req = {
        body: { email: "email.com", password: faker.internet.password() } //invalid email
      };
     
      //this is a mock response, it can be anything you want
      const errors = [
        { "email": "a valid email is required" },
      ]
      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = sandbox.stub(validate, "loginValidate").returns(errors);

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].errors).to.equal(errors);

    });


    it("should login a user successfully", async () => {
      const req = {
        body: { email: faker.internet.email(), password: faker.internet.password() }
      };
      const stubValue = {
        token: "random-token",
      };

      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = sandbox.stub(validate, "loginValidate").returns([]); //no input error

      const stub = sandbox.stub(loginService, "login").returns(stubValue);

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].token).to.equal(stubValue);
    });
  });
});