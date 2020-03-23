import FixtureController from './fixture.controller'
import TeamService from '../services/team.service'
import AdminService from '../services/admin.service'
import UserService from '../services/user.service'
import FixtureService from '../services/fixture.service'
import faker from 'faker'
import { ObjectID } from 'mongodb';
import validate from '../utils/validate'


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

 //WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER

describe('FixtureController', () => {

  let res, fixtureController, adminService, userService, teamService, fixtureService

  beforeEach(() => {

    res = mockResponse()
    adminService = new AdminService();
    teamService = new TeamService();
    userService = new UserService();
    fixtureService = new FixtureService();
  });

  afterEach(() => {    
    jest.clearAllMocks();
  });


  describe('createFixture', () => {

    it('should return unauthorized if no token is provided', async () => {
      const req = {
        body: { 
          home: '5e67f24197392c3415b5cf92',
          away: '5e6435c01386fbcaba160b89',
          matchday: '12-12-2050',
          matchtime: '10:30'
        },
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized'});

    });

    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      const req = {
        body: { 
          home: '5e67f24197392c3415b5cf92XX', //this is invalid
          away: '5e6435c01386fbcaba160b89',
          matchday: '12-12-1998', //this date is in the past
          matchtime: '10:30'
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'home': 'a valid home team is required' },
        { 'matchday': 'can\'t create a fixture in the past'}
      ]

      const stub = jest.spyOn(validate, 'fixtureValidate').mockReturnValue(errors);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors });

    });


    //DB Error
    it('should not create a fixture when db error occurs', async () => {

      const req = {
        body: { 
          home: '5e67f24197392c3415b5cf92',
          away: '5e6435c01386fbcaba160b89',
          matchday: '20-12-2050',
          matchtime: '10:30'
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      const stubAdmin = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const gottenTeams = {
        home: {
          _id: '5e67f24197392c3415b5cf92',
          name: faker.name.findName(),
        },
        away: {
          _id: '5e6435c01386fbcaba160b89',
          name: faker.name.findName(),
        }
      }
    
      //the error is empty. We have tested validation in the validate.test.js file, so we will only mock the response to be empty
      const errorStub = jest.spyOn(validate, 'fixtureValidate').mockReturnValue([]);

      const adminStub = jest.spyOn(adminService, 'getAdmin').mockReturnValue(stubAdmin);
      const checkTeamStub = jest.spyOn(teamService, 'checkTeams').mockReturnValue(gottenTeams);
      const stub = jest.spyOn(fixtureService, 'createFixture').mockImplementation(() => {
        throw new Error('database error') //this error can be anything
      });

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(checkTeamStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(adminStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });


    it('should create a fixture successfully', async () => {

      const req = {
        body: { 
          home: '5e67f24197392c3415b5cf92',
          away: '5e6435c01386fbcaba160b89',
          matchday: '20-12-2050',
          matchtime: '10:30'
        },
        tokenMetadata: { _id: faker.random.uuid() }
      };

      const stubAdmin = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const gottenTeams = {
        home: {
          _id: '5e67f24197392c3415b5cf92',
          name: faker.name.findName(),
        },
        away: {
          _id: '5e6435c01386fbcaba160b89',
          name: faker.name.findName(),
        }
      }
    
      const stubValue = {
        home: '5e67f24197392c3415b5cf92',
        away: '5e6435c01386fbcaba160b89',
        matchday: '20-12-2050',
        matchtime: '10:30'
      }

      //the error is empty. We have tested validation in the validate.test.js file, so we will only mock the response to be empty
      const errorStub = jest.spyOn(validate, 'fixtureValidate').mockReturnValue([]);

      const adminStub = jest.spyOn(adminService, 'getAdmin').mockReturnValue(stubAdmin);
      const checkTeamStub = jest.spyOn(teamService, 'checkTeams').mockReturnValue(gottenTeams);
      const stub = jest.spyOn(fixtureService, 'createFixture').mockReturnValue(stubValue);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.createFixture(req, res);

      expect(checkTeamStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(adminStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': stubValue });
    });
  });


  describe('updateFixture', () => {

    it('should return unauthorized if no token is provided', async () => {
      const req = {
        body: { 
          home: '5e67f24197392c3415b5cf92',
          away: '5e6435c01386fbcaba160b89',
          matchday: '12-12-2050',
          matchtime: '10:30',
        },
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized' });

    });


    //Validate the request param. We wont get to the request body validation. so no need to mock it
    it('should return error if the fixture id is invalid', async () => {

      const req = {
        body: { 
          home: '5e67f24197392c3415b5cf92',
          away: '5e6435c01386fbcaba160b89',
          matchday: '12-12-2050', 
          matchtime: '10:30'
        },
        tokenMetadata: { _id: faker.random.uuid() },

        params: { id: 'dkshfsdhfoisdhfoisdf'} //invalid id
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'fixture id is not valid' });

    });

    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      const req = {
        body: { 
          home: '5e67f24197392c3415b5cf92XX', //this is invalid
          away: '5e6435c01386fbcaba160b89',
          matchday: '12-12-1998', //this date is in the past
          matchtime: '10:30'
        },
        tokenMetadata: { _id: faker.random.uuid() },

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid

      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'home': 'a valid home team is required' },
        { 'matchday': 'can\'t update a fixture in the past'}
      ]

      const stub = jest.spyOn(validate, 'fixtureValidate').mockReturnValue(errors);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors });

    });


    it('should not update a fixture with unauthorized admin', async () => {

      const req = {
        body: { 
          home: '5e642cbbf0833bc1c47429d4',
          away: '5e642be7f0833bc1c47429d1',
          matchday: '20-03-2050',
          matchtime: '03:30'
        },
        //we need to make sure that the id matches with the one from the fixture
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' },
        
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const formerFixture = {
        _id: faker.random.uuid(),
        home: '5e67f24197392c3415b5cf92',
        away: '5e6435c01386fbcaba160b89',
        admin: {
          _id: new ObjectID('5e678d2255ae90c6a097b72f'), //not the same as the looged in admin
        }
      }

      //the error is empty. We have tested validation in the validate.test.js file, so we will only mock the response to be empty
      const errorStub = jest.spyOn(validate, 'fixtureValidate').mockReturnValue([]);

      const adminStub = jest.spyOn(fixtureService, 'adminGetFixture').mockReturnValue(formerFixture);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(adminStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized: you are not the owner' });
    });

    //The DB Error can range from record already exist, etc
    it('should not update a fixture when db error occurs', async () => {

      const req = {
        body: { 
          home: '5e642cbbf0833bc1c47429d4',
          away: '5e642be7f0833bc1c47429d1',
          matchday: '20-03-2050',
          matchtime: '03:30'
        },
        //we need to make sure that the id matches with the one from the fixture
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' },
        
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const gottenTeams = {
        home: {
          _id: '5e642cbbf0833bc1c47429d4',
          name: faker.name.findName(),
        },
        away: {
          _id: '5e642be7f0833bc1c47429d1',
          name: faker.name.findName(),
        }
      }

      const formerFixture = {
        _id: faker.random.uuid(),
        home: '5e67f24197392c3415b5cf92',
        away: '5e6435c01386fbcaba160b89',
        admin: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }
    
      const errorStub = jest.spyOn(validate, 'fixtureValidate').mockReturnValue([]);
      const formerStub = jest.spyOn(fixtureService, 'adminGetFixture').mockReturnValue(formerFixture);
      const checkTeamStub = jest.spyOn(teamService, 'checkTeams').mockReturnValue(gottenTeams);
      const stub = jest.spyOn(fixtureService, 'updateFixture').mockImplementation(() => {
        throw new Error('database error') //this can be anything
      });

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(checkTeamStub).toHaveBeenCalledTimes(1)
      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });

    it('should update a fixture successfully', async () => {

      const req = {
        body: { 
          home: '5e642cbbf0833bc1c47429d4',
          away: '5e642be7f0833bc1c47429d1',
          matchday: '20-03-2050',
          matchtime: '03:30'
        },
        //we need to make sure that the id matches with the one from the fixture
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' },
        
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const gottenTeams = {
        home: {
          _id: '5e642cbbf0833bc1c47429d4',
          name: faker.name.findName(),
        },
        away: {
          _id: '5e642be7f0833bc1c47429d1',
          name: faker.name.findName(),
        }
      }

      const formerFixture = {
        _id: faker.random.uuid(),
        home: '5e67f24197392c3415b5cf92',
        away: '5e6435c01386fbcaba160b89',
        admin: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }
    
      const stubValue = {
        home: '5e642be7f0833bc1c47429d1',
        away: '5e642be7f0833bc1c47429d1',
        matchday: '20-03-2050',
        matchtime: '03:30'
      }

      const errorStub = jest.spyOn(validate, 'fixtureValidate').mockReturnValue([]);
      const formerStub = jest.spyOn(fixtureService, 'adminGetFixture').mockReturnValue(formerFixture);
      const checkTeamStub = jest.spyOn(teamService, 'checkTeams').mockReturnValue(gottenTeams);
      const stub = jest.spyOn(fixtureService, 'updateFixture').mockReturnValue(stubValue);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.updateFixture(req, res);

      expect(checkTeamStub).toHaveBeenCalledTimes(1)
      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': stubValue });
    });
  });


  describe('deleteFixture', () => {

    //we wont hit validation here, so no need to mock it
    it('should return unauthorized if no token is provided', async () => {

      const req = {
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized' });
    });


    //Validate the request param. 
    it('should return error if the fixture id is invalid', async () => {

      const req = {

        tokenMetadata: { _id: faker.random.uuid() },

        params: { id: 'dkshfsdhfoisdhfoisdf'} //invalid id
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'fixture id is not valid' });
    });


    it('should not delete a fixture by unauthorized admin', async () => {
      const req = {

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      //the id of the admin provided here is different from the one that wants to update the team, so it will be unauthorized
      const formerFixture = {
        _id: faker.random.uuid(),
        home: '5e642be7f0833bc1c47429d1',
        away: '5e642be7f0833bc1c47429d1',
        admin: {
          _id: new ObjectID('5e678d2255ae90c6a097b72f'), //not the same as the looged in admin
        }
      }

      const formerStub = jest.spyOn(fixtureService, 'adminGetFixture').mockReturnValue(formerFixture);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized: you are not the owner' });
    });

    //DB Error, an error can occur in the db
    it('should not delete a fixture when db error occurs', async () => {

      const req = {
        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerFixture = {
        _id: '5e6403c9e4ca0f9fce20b1b3',
        home: '5e642be7f0833bc1c47429d1',
        away: '5e642be7f0833bc1c47429d1',
        admin: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }

      const formerStub = jest.spyOn(fixtureService, 'adminGetFixture').mockReturnValue(formerFixture);
      const stub = jest.spyOn(fixtureService, 'deleteFixture').mockImplementation(() => {
        throw new Error('database error')
      });

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });


    it('should delete a fixture successfully', async () => {

      const req = {
        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerFixture = {
        _id: '5e6403c9e4ca0f9fce20b1b3',
        home: '5e642be7f0833bc1c47429d1',
        away: '5e642be7f0833bc1c47429d1',
        admin: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }

      const stubValue = {
        data: 'fixture deleted'
      }

      const formerStub = jest.spyOn(fixtureService, 'adminGetFixture').mockReturnValue(formerFixture);
      const stub = jest.spyOn(fixtureService, 'deleteFixture').mockReturnValue(stubValue);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.deleteFixture(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': stubValue.data });
    });
  });

  describe('getFixture', () => {

    //we wont hit input validation here, so no need to mock it
    it('should return unauthorized if no token is provided', async () => {

      const req = {
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixture(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized' });
    });

    //Validate the request param. 
    it('should return error if the fixture id is invalid', async () => {

      const req = {

        tokenMetadata: { _id: faker.random.uuid() },

        params: { id: 'dkshfsdhfoisdhfoisdf'} //invalid id
      };

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixture(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'fixture id is not valid' });

    });

    //DB Error
    it('should not get a fixture if db error occurs', async () => {

      const req = {

        tokenMetadata: { _id: faker.random.uuid() }, //since we will mock the authenticated user/admin we are checking against

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(user); //this user can either be an admin or normal user
      const stub = jest.spyOn(fixtureService, 'getFixture').mockImplementation(() => {
        throw new Error('database error') //this can be anything
      });

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixture(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });

    it('should get a fixture successfully', async () => {

      const req = {

        tokenMetadata: { _id: faker.random.uuid() }, //since we will mock the authenticated user/admin we are checking against

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
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

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(user); //this user can either be an admin or normal user
      const stub = jest.spyOn(fixtureService, 'getFixture').mockReturnValue(fixture);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixture(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': fixture });
    });
  });


  describe('getFixtures', () => {

    it('should return unauthorized if no token is provided', async () => {

      const req = {};

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixtures(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized' });

    });


    it('should not get all fixtures if db error occurs', async () => {

      const req = {
        tokenMetadata: { _id: faker.random.uuid(), }
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(user); //this user can either be an admin or normal user
      const stub = jest.spyOn(fixtureService, 'getFixtures').mockImplementation(() => {
        throw new Error('database error')
      });

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixtures(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });

    });


    it('should get all fixtures successfully', async () => {

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

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(user); //this user can either be an admin or normal user
      const stub = jest.spyOn(fixtureService, 'getFixtures').mockReturnValue(fixtures);

      fixtureController = new FixtureController(userService, adminService, teamService, fixtureService);

      await fixtureController.getFixtures(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': fixtures });

    });
  });
});