import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'

import LoginController from './login.controller'
import LoginService from '../services/login.service'


const { expect } = chai;

describe("LoginController", () => {

  describe("loginUser", () => {
    let status, json, res, loginController, loginService;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      loginService = new LoginService();
    });

    it("should not login a user with empty password and empty email", async () => {
      const req = {
        body: { email: "", password: "" }
      };

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("ensure that correct details are sent");
    });


    it("should not login a user with invalid email", async () => {
      const req = {
        body: { email: "email.com", password: faker.internet.password() }
      };
     
      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("invalid email");
    });


    it("should login a user successfully", async () => {
      const req = {
        body: { email: faker.internet.email(), password: faker.internet.password() }
      };
      const stubValue = {
        token: "random-token",
      };

      const stub = sinon.stub(loginService, "login").returns(stubValue);

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].token).to.equal(stubValue);
    });
  });
});