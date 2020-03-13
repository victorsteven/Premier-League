import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'
import { ObjectID } from 'mongodb'
import TeamService from './team.service'
import Team from '../models/team'


chai.use(require('chai-as-promised'))
const { expect } = chai


describe('TeamService', () => {

  let sandbox = null

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore()
  })

  describe('createTeam', () => {

    it('should not create a new team if record already exists', async () => {

      const record = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      };

      const checkStub = sandbox.stub(Team, 'findOne').returns(record);
  
      const teamService = new TeamService();

      await expect(teamService.createTeam(record)).to.be.rejectedWith(Error, "record already exist")

      expect(checkStub.calledOnce).to.be.true;

    });

    it('should create a new team successfully', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      };

      const checkStub = sandbox.stub(Team, 'findOne').returns(false);

      const createStub = sandbox.stub(Team, 'create').returns(stubValue);

      const teamService = new TeamService();
      const team = await teamService.createTeam(stubValue);

      expect(checkStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(team._id).to.equal(stubValue._id);
      expect(team.name).to.equal(stubValue.name);

    });
  });

  describe('adminGetTeam', () => {

    it('should not get a admin team if record does not exists', async () => {

      //any id, fields that the service accepts is assumed to have been  checkedin the controller. That is, only valid data can find there way here. So the "teamId" must be valid
      let teamObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      const getStub = sandbox.stub(Team, 'findOne').returns(false);

      const teamService = new TeamService();

      await expect(teamService.adminGetTeam(teamObjID)).to.be.rejectedWith(Error, "no record found")

      expect(getStub.calledOnce).to.be.true;
     
    });

    it('should get an admin team', async () => {

      const stubValue = {
        _id: "5e682d0d580b5a6fb795b842",
        name: faker.name.findName(),
      };

      let teamObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      const teamStub = sandbox.stub(Team, 'findOne').returns(stubValue);

      const teamService = new TeamService();
      const team = await teamService.adminGetTeam(teamObjID);

      expect(teamStub.calledOnce).to.be.true;
      expect(team._id).to.equal(stubValue._id);
      expect(team.name).to.equal(stubValue.name);
    });
  });

  describe('getTeam', () => {

    it('should not get a team if record does not exists', async () => {

      //any id, fields that the service accepts is assumed to have been  checkedin the controller. That is, only valid data can find there way here. So the "teamId" must be valid
      let teamObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      var mockFindOne = {
        select() {
          return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const getStub = sandbox.stub(Team, 'findOne').returns(mockFindOne);

      const teamService = new TeamService();

      await expect(teamService.getTeam(teamObjID)).to.be.rejectedWith(Error, "no record found")

      expect(getStub.calledOnce).to.be.true;
     
    });

    it('should get a team', async () => {

      const stubValue = {
        _id: "5e682d0d580b5a6fb795b842",
        name: faker.name.findName(),
      };

      let teamObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      var mockFindOne = {
        select() {
          return this;
        },
        exec() {
          return Promise.resolve(stubValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'findOne').returns(mockFindOne);

      const teamService = new TeamService();
      const team = await teamService.getTeam(teamObjID);

      expect(teamStub.calledOnce).to.be.true;
      expect(team._id).to.equal(stubValue._id);
      expect(team.name).to.equal(stubValue.name);
    });
  });


  describe('getTeams', () => {

    it('should not get a team if record does not exists', async () => {

      var mockFind = {
        select() {
          return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const getStubs = sandbox.stub(Team, 'find').returns(mockFind);

      const teamService = new TeamService();

      await expect(teamService.getTeams()).to.be.rejectedWith(Error, "no record found")

      expect(getStubs.calledOnce).to.be.true;
     
    });

    it('should get teams', async () => {

      const stubValues = [ 
        {
          _id: "5e682d0d580b5a6fb795b842",
          name: faker.name.findName(),
        },
        {
          _id: "5e6976e61ec9d7a2d58662a8",
          name: faker.name.findName(),
        }
      ]

      var mockFind = {
        select() {
          return this;
        },
        exec() {
          return Promise.resolve(stubValues);
        }
      };

      const teamStubs = sandbox.stub(Team, 'find').returns(mockFind);

      const teamService = new TeamService();
      const teams = await teamService.getTeams();

      expect(teamStubs.calledOnce).to.be.true;
      expect(teams).to.equal(stubValues);
      expect(teams.length).to.equal(2);
    });
  });

  describe('updateTeam', () => {

    it('should not update a new team if record already exists, to avoid duplicate', async () => {

      const record = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      };

      const checkStub = sandbox.stub(Team, 'findOne').returns(record);
  
      const teamService = new TeamService();

      await expect(teamService.updateTeam(record)).to.be.rejectedWith(Error, "record already exist")

      expect(checkStub.calledOnce).to.be.true;

    });

    it('should update a team successfully', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      };

      const checkStub = sandbox.stub(Team, 'findOne').returns(false);

      const createStub = sandbox.stub(Team, 'findOneAndUpdate').returns(stubValue);

      const teamService = new TeamService();
      const team = await teamService.updateTeam(stubValue);

      expect(checkStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(team._id).to.equal(stubValue._id);
      expect(team.name).to.equal(stubValue.name);

    });
  });

  describe('deleteTeam', () => {

    it('should return no record found if the team does not exist', async () => {

      //any id, fields that the service accepts is assumed to have been  checkedin the controller. That is, only valid data can find there way here. So the "teamId" must be valid
      let teamObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      const deleteStub = sandbox.stub(Team, 'deleteOne').returns(false);

      const teamService = new TeamService();

      await expect(teamService.deleteTeam(teamObjID)).to.be.rejectedWith(Error, "no record found")

      expect(deleteStub.calledOnce).to.be.true;
     
    });

    it('should delete a team successfully', async () => {

      const deleted = { n: 1, ok: 1, deletedCount: 1 }

      let teamObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      const teamStub = sandbox.stub(Team, 'deleteOne').returns(deleted);

      const teamService = new TeamService();
      const deletedData = await teamService.deleteTeam(teamObjID);

      expect(teamStub.calledOnce).to.be.true;
      expect(deletedData).to.equal(deleted);
    });
  });

  describe('checkTeams', () => {

    it('should check that both teams dont exist', async () => {

      //any id, fields that the service accepts is assumed to have been checked in the controller. That is, only valid data can find there way here.
      let homeObjID = new ObjectID("5e682d0d580b5a6fb795b842")
      let awayObjID = new ObjectID("5e69739d96bdb99f784df32e")

      var mockFind = {
        where() {
          return this;
        },
        in() {
          return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const checkStubs = sandbox.stub(Team, 'find').returns(mockFind);

      const teamService = new TeamService();

      await expect(teamService.checkTeams(homeObjID, awayObjID)).to.be.rejectedWith(Error, "make sure that both teams exist")

      expect(checkStubs.calledOnce).to.be.true;
     
    });

    it('should check that both teams exist', async () => {

      //any id, fields that the service accepts is assumed to have been checked in the controller. That is, only valid data can find there way here.
      let homeObjID = new ObjectID("5e682d0d580b5a6fb795b842")
      let awayObjID = new ObjectID("5e69739d96bdb99f784df32e")

      const stubValues = [ 
        { _id: "5e682d0d580b5a6fb795b842",
          name: "Manchester United",
        },
        { _id: "5e69739d96bdb99f784df32e",
          name: "Newcastle United",
        } 
      ]

      var mockFind = {
        where() {
          return this;
        },
        in() {
          return this;
        },
        exec() {
          return Promise.resolve(stubValues);
        }
      };

      const checkStubs = sandbox.stub(Team, 'find').returns(mockFind);

      const teamService = new TeamService();

      const gottenTeams = await teamService.checkTeams(homeObjID, awayObjID)

      expect(checkStubs.calledOnce).to.be.true;
      expect(gottenTeams.length).to.equal(2);
     
    });
  });
});
