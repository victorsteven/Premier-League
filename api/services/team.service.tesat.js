import { ObjectID } from 'mongodb'
import TeamService from './team.service'
import { seedTeams } from '../testsetup/index'
import  { connect, clearDatabase, closeDatabase  }  from '../testsetup/test-db'



//Define the variable to hold our seeded data
let seededTeams
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  seededTeams = await seedTeams()
});

/**
* Clear all test data after every test.
*/
afterEach(async () => {
  await clearDatabase();
  jest.clearAllMocks();
});

/**
* Remove and close the db and server.
*/
afterAll(async () => {
  await closeDatabase();
});


describe('TeamService', () => {

  describe('createTeam', () => {

    it('should not create a new team if record already exists', async () => {

      try {

        const firstTeam = seededTeams[0]
  
        const record = {
          name: firstTeam.name, 
          admin: new ObjectID('5e6b13809f86ce60e92ff11c')
        };
    
        const teamService = new TeamService();

        await teamService.createTeam(record)

      } catch (e) {
        expect(e.message).toMatch('record already exists');
      }
    });

    it('should create a new team successfully', async () => {

      const newTeam = {
        name: 'Chelsea',
        admin: new ObjectID('5e6b13809f86ce60e92ff11c'), //our seeded admin
      };

      const teamService = new TeamService();

      const team = await teamService.createTeam(newTeam);

      expect(team._id).toBeDefined();
      expect(team.name).toBe(newTeam.name);
      expect(team.admin).toEqual(newTeam.admin);

    });
  });

  describe('adminGetTeam', () => {

    it('should not get a admin team if record does not exists', async () => {

      try {

        let teamObjID = new ObjectID('5e682d0d580b5a6fb795b842') //the id does not match any of the seeded team

        const teamService = new TeamService();

        await teamService.adminGetTeam(teamObjID)
      } catch (e) {
        expect(e.message).toMatch('no record found');
      }
    });

    it('should get an admin team', async () => {

      const firstTeam = seededTeams[0]

      const teamService = new TeamService();
      const team = await teamService.adminGetTeam(firstTeam._id);

      expect(team._id).toBeDefined()
      expect(team._id).toEqual(firstTeam._id);
      expect(team.name).toBe(firstTeam.name);
      expect(team.admin).toEqual(firstTeam.admin);
    });
  });

  describe('getTeam', () => {

    it('should not get a team if record does not exists', async () => {

      try {

        let teamObjID = new ObjectID('5e682d0d580b5a6fb795b842') //the id does not match any of the seeded team

        const teamService = new TeamService();

        await teamService.getTeam(teamObjID)
      } catch (e) {
        expect(e.message).toMatch('no record found');
      }
    });

    it('should get a team', async () => {

      const secondTeam = seededTeams[1]

      const teamService = new TeamService();
      const team = await teamService.getTeam(secondTeam._id);

      expect(team._id).toBeDefined()
      expect(team._id).toEqual(secondTeam._id);
      expect(team.name).toBe(secondTeam.name);
    });
  });


  describe('getTeams', () => {

    it('should get teams', async () => {

      const teamService = new TeamService();

      const teams = await teamService.getTeams()

      expect(teams.length).toEqual(2); //we have two teams in our seeded db
    });
  });

  describe('updateTeam', () => {

    it('should not update a new team if record already exists, to avoid duplicate', async () => {

      try {

        const firstTeam = seededTeams[0]
        const secondTeam = seededTeams[1]

        const update = {
          _id: firstTeam._id,
          name: secondTeam.name,
        };

        const teamService = new TeamService();

        await teamService.updateTeam(update)
      } catch (e) {
        expect(e.message).toMatch('record already exist');
      }
    });

    it('should update a team successfully', async () => {

      const firstTeam = seededTeams[0]

      const update = {
        _id: firstTeam._id,
        name: 'Manchester United',
      };

      const teamService = new TeamService();

      const updated = await teamService.updateTeam(update)

      expect(updated._id).toBeDefined()
      expect(updated._id).toEqual(update._id);
      expect(updated.name).toBe(update.name);
    });
  });

  describe('deleteTeam', () => {

    it('should return no record found if the team does not exist', async () => {

      try {

        let teamObjID = new ObjectID('5e682d0d580b5a6fb795b842')

        const teamService = new TeamService();

        await teamService.deleteTeam(teamObjID)
      } catch (e) {
        expect(e.message).toMatch('something went wrong');
      }
    });

    it('should delete a team successfully', async () => {

      const firstTeam = seededTeams[0]

      const deleted = { n: 1, ok: 1, deletedCount: 1 }

      const teamService = new TeamService();
      const deletedData = await teamService.deleteTeam(firstTeam._id);

      expect(deletedData).toEqual(deleted);
    });
  });

  describe('checkTeams', () => {

    it('should check that both teams dont exist', async () => {

      try {

        let homeObjID = new ObjectID('5e682d0d580b5a6fb795b842')
        let awayObjID = new ObjectID('5e69739d96bdb99f784df32e')

        const teamService = new TeamService();

        await teamService.checkTeams(homeObjID, awayObjID)

      } catch (e) {
        expect(e.message).toMatch('make sure that both teams exist');
      }
    });

    it('should check that both teams exist', async () => {

      const firstTeam = seededTeams[0]
      const secondTeam = seededTeams[1]

      const teamService = new TeamService();

      const gottenTeams = await teamService.checkTeams(firstTeam._id, secondTeam._id)

      expect(gottenTeams.length).toEqual(2);
    });
  });
});
