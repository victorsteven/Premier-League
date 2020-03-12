import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'

import AdminController from './admin.controller'
import AdminService from '../services/admin.service'


const { expect } = chai;

describe("AdminController", () => {

  describe("createAdmin", () => {
    let status, json, res, adminController, adminService;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
    });

    it("should not create a admin with incorrect details", async () => {
      const req = {
        body: { name: 123, email: faker.internet.email(), password: faker.internet.password() } //the name is invalid
      };

      adminController = new AdminController(adminService);

      await adminController.createAdmin(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("ensure that correct details are sent");

    });

    it("should not create a admin when the email is invalid", async () => {
      const req = {
        body: { name: "mike", email: "invalidgmail.com", password: faker.internet.password() }
      };
      
      adminController = new AdminController(adminService);

      await adminController.createAdmin(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("invalid email");

    });


    it("should create a admin successfully", async () => {
      const req = {
        body: { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }
      };
      const stubValue = {
        name: faker.name.findName(),
      };

      const stub = sinon.stub(adminService, "createAdmin").returns(stubValue);

      adminController = new AdminController(adminService);

      await adminController.createAdmin(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(201);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue);
    });
  });
});