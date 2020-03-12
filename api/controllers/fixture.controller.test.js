import chai from 'chai'
import sinon from 'sinon'
import FixtureController from './fixture.controller'
import TeamService from '../services/team.service'
import AdminService from '../services/admin.service'
import UserService from '../services/user.service'
import FixtureService from '../services/fixture.service'
import faker from 'faker'
import { ObjectID } from 'mongodb';


const { expect } = chai;

describe("FixtureController", () => {

  describe("createFixture", () => {

    let status, json, res, fixtureController, adminService, userService, teamService, fixtureService;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      fixtureService = new FixtureService();
    });


    it("should return unauthorized if no token is provided", async () => {
      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89",
          matchday: "12-12-2020",
          matchtime: "10:30"
        },
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });


    it("should not create a fixture with empty details", async () => {

      const req = {
        body: { 
          home: "",
          away: "",
          matchday: "",
          matchtime: ""
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("ensure that correct details are sent");
    });

    it("should not create a fixture with invalid home team", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92XXXX",
          away: "5e6435c01386fbcaba160b89",
          matchday: "20-12-2020",
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("home id is not valid");
    });

    it("should not create a fixture with invalid away team", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89XXXX",
          matchday: "20-12-2020",
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("away id is not valid");
    });


    it("should not create a fixture with same team", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e67f24197392c3415b5cf92",
          matchday: "15-12-2020",
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("You can't create a fixture with the same team");
    });

    it("should not create a fixture with invalid matchday", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89",
          matchday: "20-14-2020", //the month is invalid (format used: dd-mm-yyyy)
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };
      
      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("matchday must be of the format: 'dd-mm-yyyy'");
    });


    it("should not create a fixture with invalid matchtime", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89",
          matchday: "20-06-2020", 
          matchtime: "7:pm" //the time is invalid (format used: 10:30 or 07:00)
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("matchtime must be of the format: '10:30 or 07:00'");
    });


    it("should create a fixture successfully", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89",
          matchday: "20-12-2020",
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      const stubAdmin = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const gottenTeams = {
        home: {
          _id: "5e67f24197392c3415b5cf92",
          name: faker.name.findName(),
        },
        away: {
          _id: "5e6435c01386fbcaba160b89",
          name: faker.name.findName(),
        }
      }
    
      const stubValue = {
        home: "5e67f24197392c3415b5cf92",
        away: "5e6435c01386fbcaba160b89",
        matchday: "20-12-2020",
        matchtime: "10:30"
      }

      const adminStub = sinon.stub(adminService, "getAdmin").returns(stubAdmin);
      const checkTeamStub = sinon.stub(teamService, "checkTeams").returns(gottenTeams);
      const stub = sinon.stub(fixtureService, "createFixture").returns(stubValue);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(adminStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(checkTeamStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(201);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue);
    });
  });


  describe("updateFixture", () => {

    let status, json, res, fixtureController, adminService, userService, teamService, fixtureService;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      fixtureService = new FixtureService();
    });


    it("should return unauthorized if no token is provided", async () => {
      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89",
          matchday: "12-12-2020",
          matchtime: "10:30",
        },
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });

    it("should not update a fixture when an invalid id is provided", async () => {
      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89",
          matchday: "12-12-2020",
          matchtime: "10:30",
        },
        tokenMetadata: { _id: faker.random.uuid() },

        params: { id: "sjknjskdjfkjsdfksdfl"} //invalid fixture id
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("fixture id is not valid");
    });


    it("should not update a fixture with empty details", async () => {

      const req = {
        body: { 
          home: "",
          away: "",
          matchday: "",
          matchtime: ""
        },
        tokenMetadata: { _id: faker.random.uuid() },

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("ensure that correct details are sent");
    });

    it("should not update a fixture with invalid home team", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92xxxx",
          away: "5e6435c01386fbcaba160b89",
          matchday: "20-12-2020",
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() },

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("home id is not valid");
    });

    it("should not update a fixture with invalid away team", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89xxxx",
          matchday: "20-12-2020",
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() },

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("away id is not valid");
    });


    it("should not update a fixture with same team", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92", //the home is the same as the away
          away: "5e67f24197392c3415b5cf92",
          matchday: "12-12-2020",
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() },
        
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid

      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("You can't update a fixture with the same team");
    });

    it("should not update a fixture with invalid matchday", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89",
          matchday: "20-14-2020", //the month is invalid (format used: dd-mm-yyyy)
          matchtime: "10:30"
        },
        tokenMetadata: { _id: faker.random.uuid() },
        
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };
      
      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("matchday must be of the format: 'dd-mm-yyyy'");
    });


    it("should not update a fixture with invalid matchtime", async () => {

      const req = {
        body: { 
          home: "5e67f24197392c3415b5cf92",
          away: "5e6435c01386fbcaba160b89",
          matchday: "20-06-2020", 
          matchtime: "7:pm" //the time is invalid (format used: 10:30 or 07:00)
        },
        tokenMetadata: { _id: faker.random.uuid() },
        
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("matchtime must be of the format: '10:30 or 07:00'");
    });

    it("should not update a fixture with unauthorized admin", async () => {

      const req = {
        body: { 
          home: "5e642cbbf0833bc1c47429d4",
          away: "5e642be7f0833bc1c47429d1",
          matchday: "20-03-2020",
          matchtime: "03:30"
        },
        //we need to make sure that the id matches with the one from the fixture
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" },
        
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      const formerFixture = {
        _id: faker.random.uuid(),
        home: "5e67f24197392c3415b5cf92",
        home: "5e6435c01386fbcaba160b89",
        admin: {
          _id: new ObjectID("5e678d2255ae90c6a097b72f"), //not the same as the looged in admin
        }
      }

      const adminStub = sinon.stub(fixtureService, "adminGetFixture").returns(formerFixture);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(adminStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized: you are not the owner");
    });

    it("should update a fixture successfully", async () => {

      const req = {
        body: { 
          home: "5e642cbbf0833bc1c47429d4",
          away: "5e642be7f0833bc1c47429d1",
          matchday: "20-03-2020",
          matchtime: "03:30"
        },
        //we need to make sure that the id matches with the one from the fixture
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" },
        
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      const gottenTeams = {
        home: {
          _id: "5e642cbbf0833bc1c47429d4",
          name: faker.name.findName(),
        },
        away: {
          _id: "5e642be7f0833bc1c47429d1",
          name: faker.name.findName(),
        }
      }

      const formerFixture = {
        _id: faker.random.uuid(),
        home: "5e67f24197392c3415b5cf92",
        home: "5e6435c01386fbcaba160b89",
        admin: {
          _id: new ObjectID("5e678b4527b990c36ff39dda"), //this id is same as the one in the tokenMetada
        }
      }
    
      const stubValue = {
        home: "5e642be7f0833bc1c47429d1",
        away: "5e642be7f0833bc1c47429d1",
        matchday: "20-03-2020",
        matchtime: "03:30"
      }

      const formerStub = sinon.stub(fixtureService, "adminGetFixture").returns(formerFixture);
      const checkTeamStub = sinon.stub(teamService, "checkTeams").returns(gottenTeams);
      const stub = sinon.stub(fixtureService, "updateFixture").returns(stubValue);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(formerStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(checkTeamStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue);
    });
  });


  describe("deleteFixture", () => {

    let status, json, res, fixtureController, adminService, userService, teamService, fixtureService;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      fixtureService = new FixtureService();
    });


    it("should return unauthorized if no token is provided", async () => {

      const req = {
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });


    it("should not delete a fixture whose id is invalid", async () => {
      const req = {
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" },
        params: { id: "dsnfsdnfnsdfkjnsdjfn"} //this is an invalid id
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("fixture id is not valid");
    });


    it("should not delete a fixture by unauthorized admin", async () => {
      const req = {

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" }, 

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      //the id of the admin provided here is different from the one that wants to update the team, so it will be unauthorized
      const formerFixture = {
        _id: faker.random.uuid(),
        home: "5e642be7f0833bc1c47429d1",
        away: "5e642be7f0833bc1c47429d1",
        admin: {
          _id: new ObjectID("5e678d2255ae90c6a097b72f"), //not the same as the looged in admin
        }
      }

      const formerStub = sinon.stub(fixtureService, "adminGetFixture").returns(formerFixture);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      expect(formerStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized: you are not the owner");
    });


    it("should delete a fixture successfully", async () => {

      const req = {

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: "5e678b4527b990c36ff39dda" }, 

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerFixture = {
        _id: "5e6403c9e4ca0f9fce20b1b3",
        home: "5e642be7f0833bc1c47429d1",
        away: "5e642be7f0833bc1c47429d1",
        admin: {
          _id: new ObjectID("5e678b4527b990c36ff39dda"), //this id is same as the one in the tokenMetada
        }
      }

      const stubValue = {
        data: "fixture deleted"
      }

      const formerStub = sinon.stub(fixtureService, "adminGetFixture").returns(formerFixture);
      const stub = sinon.stub(fixtureService, "deleteFixture").returns(stubValue);


      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      console.log("the one: ", json.args[0][0])

      expect(formerStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue.data);
    });
  });

  describe("getFixture", () => {

    let status, json, res, fixtureController, adminService, userService, teamService, fixtureService;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      fixtureService = new FixtureService();
    });


    it("should return unauthorized if no token is provided", async () => {

      const req = {
        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });


    it("should not get a fixture whose id is invalid", async () => {
      const req = {
        tokenMetadata: { _id: faker.random.uuid() }, //since we will mock the authenticated user we are checking against

        params: { id: "dsnfsdnfnsdfkjnsdjfn"} //this is an invalid id
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixture(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("fixture id is not valid");
    });


    it("should get a fixture successfully", async () => {

      const req = {

        tokenMetadata: { _id: faker.random.uuid() }, //since we will mock the authenticated user/admin we are checking against

        params: { id: "5e6403c9e4ca0f9fce20b1b3"} //this id is valid
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const fixture = {
        _id: faker.random.uuid(),
        home: faker.random.uuid(),
        away: faker.random.uuid(),
      }

      const userStub = sinon.stub(userService, "getUser").returns(user); //this user can either be an admin or normal user
      const stub = sinon.stub(fixtureService, "getFixture").returns(fixture);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixture(req, res);

      expect(userStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(fixture);
    });
  });


  describe("getFixtures", () => {

    let status, json, res, fixtureController, adminService, userService, teamService, fixtureService;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      adminService = new AdminService();
      teamService = new TeamService();
      userService = new UserService();
      fixtureService = new FixtureService();
    });


    it("should return unauthorized if no token is provided", async () => {

      const req = {};

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixtures(req, res);

      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(401);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].error).to.equal("unauthorized");
    });


    it("should get all fixtures successfully", async () => {

      const req = {
        tokenMetadata: { _id: faker.random.uuid(), }
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const fixtures = [
        {
          _id: faker.random.uuid(),
          home: faker.random.uuid(),
          away: faker.random.uuid(),
        },
        {
          _id: faker.random.uuid(),
          home: faker.random.uuid(),
          away: faker.random.uuid(),
        }
      ]

      const userStub = sinon.stub(userService, "getUser").returns(user); //this user can either be an admin or normal user
      const stub = sinon.stub(fixtureService, "getFixtures").returns(fixtures);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixtures(req, res);

      expect(userStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(fixtures);
    });
  });
});