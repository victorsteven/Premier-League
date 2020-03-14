import chai from 'chai'
import sinon from 'sinon'
import TeamController from './team.controller'
import TeamService from '../services/team.service'
import AdminService from '../services/admin.service'
import UserService from '../services/user.service'
import faker from 'faker'
import { ObjectID } from 'mongodb';
import validate from '../utils/validate'


const { expect } = chai;


//WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER

describe("TeamController", () => {

  describe("createTeam", () => {

    let status, json, res, teamController, adminService, userService, teamService

    let sandbox = null

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore()
    })


    //we wont get reach the validation, no need to mock it
    it("should return unauthorized if no token is provided", async () => {

      const req = {
        body: { name: faker.name.findName() },
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.createTeam(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });


    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it("should return error(s) when validation fails", async () => {

      const req = {
        body: { name: "" },
        tokenMetadata: { _id: faker.random.uuid() } 
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { "name": "a valid team name is required" },
      ]

      const errorStub = sandbox.stub(validate, "teamValidate").returns(errors);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.createTeam(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].errors).to.equal(errors);

    });

    it("should create a team successfully", async () => {
      const req = {
        body: { name: faker.name.findName() },
        tokenMetadata: { _id: faker.random.uuid() } //since we have mocked the admin, this can be anything
      };

      const stubValue = {
        name: faker.name.findName(),
      };
      const stubAdmin = {
        _id: faker.random.uuid(),
        name: faker.name.findName()
        
      }
      const errorStub = sandbox.stub(validate, "teamValidate").returns([]); //empty error

      const adminStub = sandbox.stub(adminService, "getAdmin").returns(stubAdmin);
      const stub = sandbox.stub(teamService, "createTeam").returns(stubValue);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.createTeam(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(adminStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(201);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue);
    });
  });

  describe("updateTeam", () => {

    let status, json, res, teamController, adminService, userService, teamService

    let sandbox = null

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      sandbox = sinon.createSandbox()
    });

    afterEach(() => {
      sandbox.restore()
    })

    //we wont get reach the validation, no need to mock it
    it("should return unauthorized if no token is provided", async () => {
      const req = {
        body: { name: faker.name.findName() },
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });

   
    //we wont get reach the request body validation, no need to mock it. We are checking the request param
    it("should return error when invalid team id param is used", async () => {
      const req = {
        body: { name: faker.name.findName() },

        tokenMetadata: { _id: faker.random.uuid() }, 

        params: { id: "sjdfisdjflksdfshdiufs"} //invalid team id
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("team id is not valid");

    });


    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it("should return error(s) when validation fails", async () => {

      const req = {
        body: { name: "" },
        tokenMetadata: { _id: faker.random.uuid() },

        //the id here should be valid, we are interested in validating only the request body, not the request param
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} 
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { "id": "team id is not valid" },
        { "name": "a valid team name is required" },
      ]

      const errorStub = sandbox.stub(validate, "teamValidate").returns(errors);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].errors).to.equal(errors);

    });

    it("should not update a team by unauthorized admin", async () => {
      const req = {
        body: { name: faker.name.findName() },

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" }, 

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      const formerTeam = {
        _id: faker.random.uuid(),
        name: "former team",
        admin: {
          _id: new ObjectID("5e678d2255ae90c6a097b72f"), //not the same as the looged in admin
        }
      }

      const errorStub = sandbox.stub(validate, "teamValidate").returns([]); //no input errors

      const formerStub = sandbox.stub(teamService, "adminGetTeam").returns(formerTeam);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(formerStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized: you are not the owner");
    });


    it("should update a team successfully", async () => {
      const req = {
        body: { name: faker.name.findName() },

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" }, 

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      const stubValue = {
        name: faker.name.findName(),
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerTeam = {
        _id: faker.random.uuid(),
        name: "former team",
        admin: {
          _id: new ObjectID("5e678b4527b990c36ff39dda"), //this id is same as the one in the tokenMetada
        }
      }
      const errorStub = sandbox.stub(validate, "teamValidate").returns([]); //no input errors
      const formerStub = sandbox.stub(teamService, "adminGetTeam").returns(formerTeam);
      const stub = sandbox.stub(teamService, "updateTeam").returns(stubValue);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(formerStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue);
    });
  });

  describe("deleteTeam", () => {

    let status, json, res, teamController, adminService, userService, teamService

    let sandbox = null

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      sandbox = sinon.createSandbox()
    });

    afterEach(() => {
      sandbox.restore()
    })

    //we wont get reach the validation, no need to mock it
    it("should return unauthorized if no token is provided", async () => {

      const req = {
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });

    //return error when the team id is not valid
    it("should return error when invalid team id param is used", async () => {
      const req = {

        tokenMetadata: { _id: faker.random.uuid() }, 

        params: { id: "sjdfisdjflksdfshdiufs"} //invalid team id
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("team id is not valid");

    });

    it("should not delete a team by unauthorized admin", async () => {
      const req = {

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" }, 

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      //the id of the admin provided here is different from the one that wants to update the team, so it will be unauthorized
      const formerTeam = {
        _id: faker.random.uuid(),
        name: "former team",
        admin: {
          _id: new ObjectID("5e678d2255ae90c6a097b72f"), //not the same as the looged in admin
        }
      }

      const formerStub = sandbox.stub(teamService, "adminGetTeam").returns(formerTeam);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(formerStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized: you are not the owner");
    });


    it("should delete a team successfully", async () => {

      const req = {
        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" }, 

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerTeam = {
        _id: faker.random.uuid(),
        name: "former team",
        admin: {
          _id: new ObjectID("5e678b4527b990c36ff39dda"), //this id is same as the one in the tokenMetada
        }
      }

      const stubValue = {
        data: "team deleted"
      }

      const formerStub = sandbox.stub(teamService, "adminGetTeam").returns(formerTeam);
      const stub = sandbox.stub(teamService, "deleteTeam").returns(stubValue);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(formerStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue.data);
    });
  });

  describe("getTeam", () => {

    let status, json, res, teamController, adminService, userService, teamService

    let sandbox = null

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      sandbox = sinon.createSandbox()
    });

    afterEach(() => {
      sandbox.restore()
    })

    //we wont get reach the validation, no need to mock it
    it("should return unauthorized if no token is provided", async () => {

      const req = {
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeam(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });

    //return error when the team id is not valid
    it("should return error when invalid team id param is used", async () => {
      const req = {

        tokenMetadata: { _id: faker.random.uuid() }, 

        params: { id: "sjdfisdjflksdfshdiufs"} //invalid team id
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeam(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("team id is not valid");

    });


    it("should get a team successfully", async () => {

      const req = {

        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" }, 

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const team = {
        _id: faker.random.uuid(),
        name: "the team",
      }

      const userStub = sandbox.stub(userService, "getUser").returns(user); //this user can either be an admin or normal user
      const stub = sandbox.stub(teamService, "getTeam").returns(team);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeam(req, res);

      expect(userStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(team);
    });
  });


  describe("getTeams", () => {

    let status, json, res, teamController, adminService, userService, teamService

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
    });


    it("should return unauthorized if no token is provided", async () => {

      const req = {};

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeams(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });


    it("should get all teams successfully", async () => {

      const req = {
        tokenMetadata: { _id: faker.random.uuid() },  
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName()
        ,
      }

      const teams = [
        {
          _id: faker.random.uuid(),
          name: "first team",
        },
        {
          _id: faker.random.uuid(),
          name: "second team",
        }
      ]

      const userStub = sinon.stub(userService, "getUser").returns(user); //this user can either be an admin or normal user
      const stub = sinon.stub(teamService, "getTeams").returns(teams);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeams(req, res);

      expect(userStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(teams);
    });
  });
});