import faker from 'faker'
import validate from '../utils/validate'

import UserController from './user.controller'
import UserService from '../services/user.service'


//WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('UserController', () => {


  describe('createUser', () => {
    let userController, userService, res;

    beforeEach(() => {
      
      res = mockResponse()

      userService = new UserService();

    });


     //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
     it('should return error(s) when validation fails', async () => {
      const req = {
        body: { name: 123, email: faker.internet.email(), password: 'sdf' } //the name  and password are invalid
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'name': 'a valid name is required' },
        { 'password': 'a valid password with atleast 6 characters is required'}
      ]
      //since validate is foreign, we have to mock it to achieve unit test, we are only mocking the 'registerValidate' function
      const stub = jest.spyOn(validate, 'registerValidate').mockReturnValue(errors)

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors});
    });

    //DB Error
    it('should not create an user, due to db error', async () => {

      const req = {
        body: { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }
      };

      //since validate is foreign, we have to mock it to achieve unit test. We are only mocking the 'registerValidate' function
      const errorStub = jest.spyOn(validate, 'registerValidate').mockReturnValue([]); //no input error

      const stub = jest.spyOn(userService, 'createUser').mockImplementation(() => {
        throw new Error('database error')
      });

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(errorStub).toHaveBeenCalled()
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error'});
    });

    it('should create a user successfully', async () => {

      const req = {
        body: { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }
      };

      //since validate is foreign, we have to mock it to achieve unit test. We are only mocking the 'registerValidate' function
      const errorStub = jest.spyOn(validate, 'registerValidate').mockReturnValue([]); //no input error

      const stubValue = {
        name: faker.name.findName(),
      };

      const stub = jest.spyOn(userService, 'createUser').mockReturnValue(stubValue);

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(errorStub).toHaveBeenCalled()
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': stubValue});
    });
  });
});