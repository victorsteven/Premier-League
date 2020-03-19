import TeamController from './team.controller'
import TeamService from '../services/team.service'
import AdminService from '../services/admin.service'
import UserService from '../services/user.service'
import faker from 'faker'
import { ObjectID } from 'mongodb';
import validate from '../utils/validate'



//WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('TeamController', () => {

  let res, teamController, adminService, userService, teamService

  beforeEach(() => {

    res = mockResponse()
    adminService = new AdminService();
    teamService = new TeamService();
    userService = new UserService();
  });

  afterEach(() => {    
    jest.clearAllMocks();
  });


  describe('createTeam', () => {

    //we wont get reach the validation, no need to mock it
    it('should return unauthorized if no token is provided', async () => {

      const req = {
        body: { name: faker.name.findName() },
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.createTeam(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized'});

    });


    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      const req = {
        body: { name: '' },
        tokenMetadata: { _id: faker.random.uuid() } 
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'name': 'a valid team name is required' },
      ]

      const errorStub = jest.spyOn(validate, 'teamValidate').mockReturnValue(errors);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.createTeam(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors });

    });

    //DB Error, when a duplicate record tried to be created
    it('should return error is a request has a name that already exist', async () => {

      const req = {
        body: { name: 'Manchester United' }, //we assume that Manchester already exist
        tokenMetadata: { _id: faker.random.uuid() } 
      };

      const stubAdmin = {
        _id: faker.random.uuid(),
        name: faker.name.findName()
      }

      const errorStub = jest.spyOn(validate, 'teamValidate').mockReturnValue([]); //empty error

      const adminStub = jest.spyOn(adminService, 'getAdmin').mockReturnValue(stubAdmin);
      const stub = jest.spyOn(teamService, 'createTeam').mockImplementation(() => {
        throw new Error('record already exists');
      })

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.createTeam(req, res);

      expect(adminStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'record already exists' });

    });


    it('should create a team successfully', async () => {
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

      const errorStub = jest.spyOn(validate, 'teamValidate').mockReturnValue([]); //empty error

      const adminStub = jest.spyOn(adminService, 'getAdmin').mockReturnValue(stubAdmin);
      const stub = jest.spyOn(teamService, 'createTeam').mockReturnValue(stubValue);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.createTeam(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(adminStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': stubValue });
    })
  });

  describe('updateTeam', () => {

    //we wont get reach the validation, no need to mock it
    it('should return unauthorized if no token is provided', async () => {
      const req = {
        body: { name: faker.name.findName() },
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);


      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized'});
    });

   
    //we wont get reach the request body validation, no need to mock it. We are checking the request param
    it('should return error when invalid team id param is used', async () => {
      const req = {
        body: { name: faker.name.findName() },

        tokenMetadata: { _id: faker.random.uuid() }, 

        params: { id: 'sjdfisdjflksdfshdiufs'} //invalid team id
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'team id is not valid'});

    });


    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      const req = {
        body: { name: '' },
        tokenMetadata: { _id: faker.random.uuid() },

        //the id here should be valid, we are interested in validating only the request body, not the request param
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} 
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'id': 'team id is not valid' },
        { 'name': 'a valid team name is required' },
      ]

      const errorStub = jest.spyOn(validate, 'teamValidate').mockReturnValue(errors);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors });
    });


    it('should not update a team by unauthorized admin', async () => {
      const req = {
        body: { name: faker.name.findName() },

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const formerTeam = {
        _id: faker.random.uuid(),
        name: 'former team',
        admin: {
          _id: new ObjectID('5e678d2255ae90c6a097b72f'), //not the same as the looged in admin
        }
      }

      const errorStub = jest.spyOn(validate, 'teamValidate').mockReturnValue([]); //no input errors

      const formerStub = jest.spyOn(teamService, 'adminGetTeam').mockReturnValue(formerTeam);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized: you are not the owner' });
    });

    //DB Error
    it('should not update a team if another team already exist with that team name', async () => {
      const req = {
        body: { name: 'Manchester United' }, //we assume that this team exist

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerTeam = {
        _id: faker.random.uuid(),
        name: 'former team',
        admin: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }
      const errorStub = jest.spyOn(validate, 'teamValidate').mockReturnValue([]); //no input errors
      const formerStub = jest.spyOn(teamService, 'adminGetTeam').mockReturnValue(formerTeam);
      const stub = jest.spyOn(teamService, 'updateTeam').mockImplementation(() => {
        throw new Error('record already exists');
      })

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'record already exists' });
    });


    it('should update a team successfully', async () => {
      const req = {
        body: { name: faker.name.findName() },

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const stubValue = {
        name: faker.name.findName(),
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerTeam = {
        _id: faker.random.uuid(),
        name: 'former team',
        admin: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }
      const errorStub = jest.spyOn(validate, 'teamValidate').mockReturnValue([]); //no input errors
      const formerStub = jest.spyOn(teamService, 'adminGetTeam').mockReturnValue(formerTeam);
      const stub = jest.spyOn(teamService, 'updateTeam').mockReturnValue(stubValue);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.updateTeam(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': stubValue });
    });
  });

  describe('deleteTeam', () => {

    //we wont get reach the validation, no need to mock it
    it('should return unauthorized if no token is provided', async () => {

      const req = {
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized' });

    });

    //return error when the team id is not valid
    it('should return error when invalid team id param is used', async () => {
      const req = {

        tokenMetadata: { _id: faker.random.uuid() }, 

        params: { id: 'sjdfisdjflksdfshdiufs'} //invalid team id
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'team id is not valid' });

    });

    it('should not delete a team by unauthorized admin', async () => {
      const req = {

        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      //the id of the admin provided here is different from the one that wants to update the team, so it will be unauthorized
      const formerTeam = {
        _id: faker.random.uuid(),
        name: 'former team',
        admin: {
          _id: new ObjectID('5e678d2255ae90c6a097b72f'), //not the same as the looged in admin
        }
      }

      const formerStub = jest.spyOn(teamService, 'adminGetTeam').mockReturnValue(formerTeam);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized: you are not the owner' });
    });


    //DB error. Error returned from the service
    it('should fail deleting a team', async () => {

      const req = {
        //make sure the id here, matches the admin id from the team we wishes to delete
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerTeam = {
        _id: faker.random.uuid(),
        name: 'former team',
        admin: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }

      const adminStub = jest.spyOn(teamService, 'adminGetTeam').mockReturnValue(formerTeam);
      const stub = jest.spyOn(teamService, 'deleteTeam').mockImplementation(() => {
        throw new Error('something went wrong');
      })

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(adminStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'something went wrong' });
    });


    it('should delete a team successfully', async () => {

      const req = {
        //make sure the id here, matches the admin id from the team we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      //our concern is making sure that we supply a valid to the admin that created the Team:
      const formerTeam = {
        _id: faker.random.uuid(),
        name: 'former team',
        admin: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }

      const stubValue = {
        data: 'team deleted'
      }

      const formerStub = jest.spyOn(teamService, 'adminGetTeam').mockReturnValue(formerTeam);
      const stub = jest.spyOn(teamService, 'deleteTeam').mockReturnValue(stubValue);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.deleteTeam(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': stubValue.data });

    });
  });

  describe('getTeam', () => {

    //we wont get reach the validation, no need to mock it
    it('should return unauthorized if no token is provided', async () => {

      const req = {
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeam(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized' });

    });

    // return error when the team id is not valid
    it('should return error when invalid team id param is used', async () => {
      const req = {

        tokenMetadata: { _id: faker.random.uuid() }, 

        params: { id: 'sjdfisdjflksdfshdiufs'} //invalid team id
      };

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeam(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'team id is not valid' });

    });


    //DB Error, error thrown from the service
    it('should not get a team if when error occurs', async () => {

      const req = {

        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(user); //this user can either be an admin or normal user
      const stub = jest.spyOn(teamService, 'getTeam').mockImplementation(() => {
        throw new Error('record not found')
      });

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeam(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'record not found' });

    });


    it('should get a team successfully', async () => {

      const req = {

        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName(),
      }

      const team = {
        _id: faker.random.uuid(),
        name: 'the team',
      }

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(user); //this user can either be an admin or normal user
      const stub = jest.spyOn(teamService, 'getTeam').mockReturnValue(team);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeam(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': team });

    });
  });


  describe('getTeams', () => {

    it('should return unauthorized if no token is provided', async () => {

      const req = {};

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeams(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized' });

    });


    //DB Error
    it('should not get all teams when db error occurs', async () => {

      const req = {
        tokenMetadata: { _id: faker.random.uuid() },  
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName()
      }

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(user); //this user can either be an admin or normal user
      const stub = jest.spyOn(teamService, 'getTeams').mockImplementation(() => {
        throw new Error('database error') //this can be anything
      });

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeams(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });


    it('should get all teams successfully', async () => {

      const req = {
        tokenMetadata: { _id: faker.random.uuid() },  
      };

      const user = {
        _id: faker.random.uuid(),
        name: faker.name.findName()
      }

      //fake team with ids
      const teams = [
        {
          _id: faker.random.uuid(),
          name: 'first team',
        },
        {
          _id: faker.random.uuid(),
          name: 'second team',
        }
      ]

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(user); //this user can either be an admin or normal user
      const stub = jest.spyOn(teamService, 'getTeams').mockReturnValue(teams);

      teamController = new TeamController(userService, adminService, teamService);

      await teamController.getTeams(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': teams });
    });
  });
});