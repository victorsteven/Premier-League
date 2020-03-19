import faker from 'faker'
import LoginController from './login.controller'
import LoginService from '../services/login.service'
import validate from '../utils/validate'



const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('LoginController', () => {

  let res, loginService, loginController

  beforeEach(() => {

    res = mockResponse()

    loginService = new LoginService();

  });

  afterEach(() => {    
    jest.clearAllMocks();
  });


  describe('loginUser', () => {

    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {
      const req = {
        body: { email: 'email.com', password: faker.internet.password() } //invalid email
      };
     
      //this is a mock response, it can be anything you want
      const errors = [
        { 'email': 'a valid email is required' },
      ]
      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = jest.spyOn(validate, 'loginValidate').mockReturnValue(errors);

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors});
    });


    //Maybe when the email address inputed is not found, or the password is not correct
    it('should not login a user due to error from the service', async () => {
      const req = {
        body: { email: faker.internet.email(), password: faker.internet.password() }
      };

      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = jest.spyOn(validate, 'loginValidate').mockReturnValue([]); //no input error

      const stub = jest.spyOn(loginService, 'login').mockImplementation(() => {
        throw new Error('email/password is not correct')
      });

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(stub).toHaveBeenCalledTimes(1);
      expect(errorStub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'email/password is not correct' });

    });

    it('should login a user successfully', async () => {
      const req = {
        body: { email: faker.internet.email(), password: faker.internet.password() }
      };
      const stubValue = {
        token: 'random-token',
      };

      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = jest.spyOn(validate, 'loginValidate').mockReturnValue([]); //no input error

      const stub = jest.spyOn(loginService, 'login').mockReturnValue(stubValue);

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(stub).toHaveBeenCalledTimes(1);
      expect(errorStub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'token': stubValue });

    });
  });
});