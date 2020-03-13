import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'
import { ObjectID } from 'mongodb'
import FixtureService from './fixture.service'
import Fixture from '../models/fixture'

chai.use(require('chai-as-promised'))
const { expect } = chai


describe('FixtureService', () => {

  let sandbox = null

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore()
  })

  describe('createFixture', () => {

    it('should not create a new fixture if record already exists', async () => {

      const record = {
        _id: faker.random.uuid(),
        home: faker.random.uuid(),
        away: faker.random.uuid(),
      };

      const checkStub = sandbox.stub(Fixture, 'findOne').returns(record);
  
      const fixtureService = new FixtureService();

      await expect(fixtureService.createFixture(record)).to.be.rejectedWith(Error, "record already exist")

      expect(checkStub.calledOnce).to.be.true;

    });

    it('should create a new fixture successfully', async () => {

      const stubValue = {
        _id: faker.random.uuid(),
        home: faker.random.uuid(),
        away: faker.random.uuid(),
      };

      const checkStub = sandbox.stub(Fixture, 'findOne').returns(false); //the record does not exist

      const createStub = sandbox.stub(Fixture, 'create').returns(stubValue);

      const fixtureService = new FixtureService();
      const fixture = await fixtureService.createFixture(stubValue);

      expect(checkStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(stubValue._id);
      expect(fixture.home).to.equal(stubValue.home);
      expect(fixture.away).to.equal(stubValue.away);

    });
  });


  describe('getFixture', () => {

    it('should not get a fixture if record does not exists', async () => {

      //any id, fields that the service accepts is assumed to have been  checked in the controller. That is, only valid data can find there way here. So the "fixtureId" must be valid
      let fixtureObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      var mockFindOne = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const getStub = sandbox.stub(Fixture, 'findOne').returns(mockFindOne);

      const fixtureService = new FixtureService();

      await expect(fixtureService.getFixture(fixtureObjID)).to.be.rejectedWith(Error, "no record found")

      expect(getStub.calledOnce).to.be.true;
     
    });

    it('should get a fixture', async () => {

      const stubValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69748a6e72a1a0793956eb",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Newcastle United"
            },
            "matchday": "12-11-2016",
            "matchtime": "10:30"
        }

      let fixtureObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      var mockFindOne = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(stubValue);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'findOne').returns(mockFindOne);

      const fixtureService = new FixtureService();
      const fixture = await fixtureService.getFixture(fixtureObjID);

      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(stubValue._id);
      expect(fixture.home).to.equal(stubValue.home);
      expect(fixture.away).to.equal(stubValue.away);
      expect(fixture.matchday).to.equal(stubValue.matchday);
      expect(fixture.matchtime).to.equal(stubValue.matchtime);
    });
  });


  describe('updateFixture', () => {

    it('should not update a fixture if record already exists', async () => {

      //Note: extra check is required that's why we used valid objectids

      //This fixture home and away belongs to another fixture
      const stubValue = {
        _id:  new ObjectID("5e69737e96bdb99f784df32d"),
        home: new ObjectID("5e6b16bcaf5e1565923d0ac2"),
        away: new ObjectID("5e69758b274e95a16159c2bc"),
      };

      const record = {
        _id: new ObjectID("5e682d0d580b5a6fb795b842"),
        home: new ObjectID("5e6b16bcaf5e1565923d0ac2"),
        away: new ObjectID("5e69758b274e95a16159c2bc"),
      };

      const checkStub = sandbox.stub(Fixture, 'findOne').returns(record);
  
      const fixtureService = new FixtureService();

      await expect(fixtureService.updateFixture(stubValue)).to.be.rejectedWith(Error, "record already exist")

      expect(checkStub.calledOnce).to.be.true;

    });

    it('should update a new fixture successfully', async () => {

      //Note: extra check is required that's why we used valid objectids
      const stubValue = {
        _id:  new ObjectID("5e682d0d580b5a6fb795b842"),
        home: new ObjectID("5e6b16bcaf5e1565923d0ac2"),
        away: new ObjectID("5e69758b274e95a16159c2bc"),
      };

      const record = {
        _id: new ObjectID("5e682d0d580b5a6fb795b842"),
        home: new ObjectID("5e6b13809f86ce60e92ff11c"),
        away: new ObjectID("5e69737e96bdb99f784df32d"),
      };

      //the record exist, but the incoming id is same at the one found in the db. ie, it does not belong to another fixture, so, we can update it
      const checkStub = sandbox.stub(Fixture, 'findOne').returns(record); 

      const createStub = sandbox.stub(Fixture, 'findOneAndUpdate').returns(stubValue);

      const fixtureService = new FixtureService();
      const fixture = await fixtureService.updateFixture(stubValue);

      expect(checkStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(stubValue._id);
      expect(fixture.home).to.equal(stubValue.home);
      expect(fixture.away).to.equal(stubValue.away);

    });
  });


  describe('getFixtures', () => {

    it('should not get fixtures if record does not exists', async () => {

      var mockFind = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const getStubs = sandbox.stub(Fixture, 'find').returns(mockFind);

      const fixtureService = new FixtureService();

      await expect(fixtureService.getFixtures()).to.be.rejectedWith(Error, "no record found")

      expect(getStubs.calledOnce).to.be.true;
     
    });

    it('should get fixtures', async () => {

      const stubValues = [
        {
            "_id": "5e6973b196bdb99f784df32f",
            "home": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Manchester United"
            },
            "away": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Newcastle United"
            },
            "matchday": "12-11-2016",
            "matchtime": "10:30"
        },
        {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69748a6e72a1a0793956eb",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Newcastle United"
            },
            "matchday": "12-11-2016",
            "matchtime": "10:30"
        }
      ]

      var mockFind = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(stubValues);
        }
      };

      const fixturesStub = sandbox.stub(Fixture, 'find').returns(mockFind);

      const fixtureService = new FixtureService();
      const fixtures = await fixtureService.getFixtures();

      expect(fixturesStub.calledOnce).to.be.true;
      expect(fixtures).to.equal(stubValues);
      expect(fixtures.length).to.equal(2);
    });
  });
});
