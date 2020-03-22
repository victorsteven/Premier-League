import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import faker from 'faker'
import LoginController from './login.controller'
import LoginService from '../services/login.service'
import validate from '../utils/validate'


const mockResponse = () => {
  const res = {};
  res.status = sinon.stub()
  res.json = sinon.stub()
  res.status.returns(res);
  return res;
};

chai.use(sinonChai)

const { expect } = chai


describe('LoginController', () => {

  let res, loginService, loginController, sandbox = null

  beforeEach(() => {
    res = mockResponse()
    sandbox = sinon.createSandbox()
    loginService = new LoginService();
  });

  afterEach(() => {
    sandbox.restore()
  })


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
      const errorStub = sandbox.stub(validate, 'loginValidate').returns(errors);

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({'status': 400, 'errors': errors});
    });


    //Maybe when the email address inputed is not found, or the password is not correct
    it('should not login a user due to error from the service', async () => {
      const req = {
        body: { email: faker.internet.email(), password: faker.internet.password() }
      };

      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = sandbox.stub(validate, 'loginValidate').returns([]); //no input error

      const stub = sandbox.stub(loginService, 'login').throws(new Error('email/password is not correct')); //the error can be anything

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(errorStub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({'status': 500, 'error': 'email/password is not correct' });

    });

    it('should login a user successfully', async () => {
      const req = {
        body: { email: faker.internet.email(), password: faker.internet.password() }
      };
      const stubValue = {
        token: 'random-token',
      };

      //since validate is foreign, we have to mock it to achieve unit test
      const errorStub = sandbox.stub(validate, 'loginValidate').returns([]); //no input error

      const stub = sandbox.stub(loginService, 'login').returns(stubValue);

      loginController = new LoginController(loginService);

      await loginController.login(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(errorStub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({'status': 200, 'token': stubValue });

    });
  });
});