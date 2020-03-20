import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import faker from 'faker'
import validate from '../utils/validate'
import UserController from './user.controller'
import UserService from '../services/user.service'

chai.use(require('chai-as-promised'))
chai.use(sinonChai)

const { expect } = chai


//WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub()
  res.json = sinon.stub()
  res.status.returns(res);
  return res;
};

describe('UserController', () => {

  let userController, userService, res, sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    res = mockResponse()
    userService = new UserService();
  });

  afterEach(() => {
    sandbox.restore()
  })

  describe('createUser', () => {

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
      const stub = sandbox.stub(validate, 'registerValidate').returns(errors)

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;;
      expect(res.json.calledOnce).to.be.true;;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({'status': 400, 'errors': errors});
    });

    //DB Error
    it('should not create an user, due to db error', async () => {

      const req = {
        body: { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }
      };

      //since validate is foreign, we have to mock it to achieve unit test. We are only mocking the 'registerValidate' function
      const errorStub = sandbox.stub(validate, 'registerValidate').returns([]); //no input error

      const stub = sandbox.stub(userService, 'createUser').throws(new Error('database error'));

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;;
      expect(res.json.calledOnce).to.be.true;;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({'status': 500, 'error': 'database error'});
    });

    it('should create a user successfully', async () => {

      const req = {
        body: { name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }
      };

      //since validate is foreign, we have to mock it to achieve unit test. We are only mocking the 'registerValidate' function
      const errorStub = sandbox.stub(validate, 'registerValidate').returns([]); //no input error

      const stubValue = {
        name: faker.name.findName(),
      };

      const stub = sandbox.stub(userService, 'createUser').returns(stubValue);

      userController = new UserController(userService);

      await userController.createUser(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;;
      expect(res.json.calledOnce).to.be.true;;
      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith({'status': 201, 'data': stubValue});

    });
  });
});