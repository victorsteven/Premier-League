import chai from 'chai'
import { ObjectID } from 'mongodb'
import FixtureService from './fixture.service'
import { seedFixtures } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'


chai.use(require('chai-as-promised'))
const { expect } = chai


describe('FixtureService', () => {

  let seededFixtures

  //Connect to a new in-memory database before running any tests.
  before(async () => {
    await connect();
  });

  //Seed in-memory db before each test
  beforeEach(async () => {
    seededFixtures = await seedFixtures()
  });

  //Clear all test data after every test.
  afterEach(async () => {
    await clearDatabase();
  });

  //Remove and close the db and server.
  after(async () => {
    await closeDatabase();
  });


  describe('createFixture', () => {

    it('should not create a new fixture if record already exists', async () => {

      try {

        const firstFixture = seededFixtures[0]

        const record = {
          home: firstFixture.home,
          away: firstFixture.away,
          admin: firstFixture.admin,
          matchday: '20-12-2020',
          matchtime: '15:00',
        };

        const fixtureService = new FixtureService();

        await fixtureService.createFixture(record)

    } catch (e) {
      expect(e.message).to.equal('record already exists');
      }
    });

    it('should create a new fixture successfully', async () => {

      const stubValue = {
        home: new ObjectID('5e6d169de43d8272913a7d99'),
        away: new ObjectID('5e6d1639e43d8272913a7d93'),
        matchday: '20-12-2020',
        matchtime: '15:00',
        admin: new ObjectID('5e6d1745e43d8272913a7d9d'),
      };

      const fixtureService = new FixtureService();

      const fixture = await fixtureService.createFixture(stubValue);

      expect(fixture.home).to.equal(stubValue.home);
      expect(fixture.away).to.equal(stubValue.away);
      expect(fixture.admin).to.equal(stubValue.admin);

    });
  });


  describe('adminGetFixture', () => {

    it('should not get a fixture by an admin if record does not exists', async () => {

      try {

        let fixtureObjID = new ObjectID('5e682d0d580b5a6fb795b842')

        const fixtureService = new FixtureService();

        await fixtureService.adminGetFixture(fixtureObjID)

      } catch (e) {
        expect(e.message).to.equal('no record found');
      }
    });

    it('should get a fixture by an admin', async () => {

      const firstFixture = seededFixtures[0]

      const fixtureService = new FixtureService();

      const fixture = await fixtureService.adminGetFixture(firstFixture._id);

      expect(fixture._id).to.deep.equal(firstFixture._id);
      expect(fixture.matchday).to.equal(firstFixture.matchday);
      expect(fixture.matchtime).to.equal(firstFixture.matchtime);
      expect(fixture.admin).to.deep.equal(firstFixture.admin);
    });
  });


  describe('getFixture', () => {

    it('should not get a fixture if record does not exists', async () => {

      try {

        //This fixture does not exist
        let fixtureObjID = new ObjectID('5e682d0d580b5a6fb795b842')

        const fixtureService = new FixtureService();

        await fixtureService.getFixture(fixtureObjID)

      } catch (e) {
        expect(e.message).to.equal('no record found');
      }
    });

    it('should get a fixture', async () => {

      const firstFixture = seededFixtures[0]

      const fixtureService = new FixtureService();

      const fixture = await fixtureService.getFixture(firstFixture._id);

      expect(fixture._id).to.deep.equal(firstFixture._id);
      expect(fixture.matchday).to.equal(firstFixture.matchday);
      expect(fixture.matchtime).to.equal(firstFixture.matchtime);
    });
  });


  describe('updateFixture', () => {

    it('should not update a fixture if record already exists', async () => {

      try {

        const firstFixture = seededFixtures[0]
        const secondFixture = seededFixtures[1]

        const stubValue = {
          _id:  firstFixture._id,
          home: secondFixture.home, 
          away: secondFixture.away, 
          admin: firstFixture.admin,
          matchday: firstFixture.matchday,
          matchtime: firstFixture.matchtime,
        };
    
        const fixtureService = new FixtureService();
  
        await fixtureService.updateFixture(stubValue)

      } catch (e) {
        expect(e.message).to.equal('record already exists');
      }
    });

    it('should update a fixture successfully', async () => {

      const firstFixture = seededFixtures[0]

      const stubValue = {
        _id:  firstFixture._id,
        home: new ObjectID('5e6b16bcaf5e1565923d0ac2'),
        away: new ObjectID('5e69737e96bdb99f784df32d'),
        matchday: '30-02-2031',
        matchtime: '09:30'
      };

      const fixtureService = new FixtureService();

      const fixture = await fixtureService.updateFixture(stubValue);

      expect(fixture.home).to.deep.equal(stubValue.home)
      expect(fixture.away).to.deep.equal(stubValue.away)
      expect(fixture.matchday).to.equal(stubValue.matchday)
      expect(fixture.matchtime).to.equal(stubValue.matchtime)

    });
  });

  describe('deleteFixture', () => {

    it('should return no record found if the fixture does not exist', async () => {

      try {

        let fixtureObjID = new ObjectID('5e682d0d580b5a6fb795b842')

        const fixtureService = new FixtureService();

        await fixtureService.deleteFixture(fixtureObjID)

      } catch (e) {
        expect(e.message).to.equal('something went wrong');
      }
    });

    it('should delete a fixture successfully', async () => {

      const firstFixture = seededFixtures[0]

      const deleted = { n: 1, ok: 1, deletedCount: 1 }

      const fixtureService = new FixtureService();
      const deletedData = await fixtureService.deleteFixture(firstFixture._id);

      expect(deletedData).to.deep.equal(deleted);
      
     });
  });


  describe('getFixtures', () => {

    it('should get fixtures', async () => {

      const fixtureService = new FixtureService();
      const fixtures = await fixtureService.getFixtures(); //fixtures coming from our in-memory db

      expect(fixtures.length).to.equal(2);

    });
  });
});
