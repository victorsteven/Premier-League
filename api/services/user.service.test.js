import chai from 'chai'
import sinon from 'sinon'
import { ObjectID } from 'mongodb'
import UserService from './user.service'
import  password from '../utils/password';
import { seedUser } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'

chai.use(require('chai-as-promised'))
const { expect } = chai




describe('UserService', () => {

  let seededUser, sandbox = null
  /**
   * Connect to a new in-memory database before running any tests.
   */
  before(async () => {
    await connect();
  });

  beforeEach(async () => {
    seededUser = await seedUser()
    sandbox = sinon.createSandbox()
  });

  /**
  * Clear all test data after every test.
  */
  afterEach(async () => {
    await clearDatabase();
    sandbox.restore()
  });

  /**
  * Remove and close the db and server.
  */
  after(async () => {
    await closeDatabase();
  });

  describe('createUser', () => {

    it('should not create a new user if record already exists', async () => {

      let user = {
        name: 'frank',
        email: seededUser.email,
        password: 'password',
      }

      const userService = new UserService();

      await expect(userService.createUser(user)).to.be.rejectedWith(Error, 'record already exists')

    });

    it('should create a new user', async () => {

      let userNew = {
        name: 'kate',
        email: 'kate@example.com',
        password: 'password',
      }

      //'hashPassword' is a  dependency, so we mock it
      const hashPass = sandbox.stub(password, 'hashPassword').returns('ksjndfklsndflksdmlfksdf')

      const userService = new UserService();

      const user = await userService.createUser(userNew);

      expect(hashPass.calledOnce).to.be.true;
      expect(user._id).to.not.be.undefined
      expect(user.name).to.equal(userNew.name);
      expect(user.role).to.equal(userNew.role);
    });
  });


  describe('getUser', () => {

    it('should not get an user if record does not exists', async () => {

      //This user does not exist
      let userObjID = new ObjectID("5e682d0d580b5a6fb795b842")

      const userService = new UserService();

      await expect(userService.getUser(userObjID)).to.be.rejectedWith(Error, 'no record found')

    });

    it('should get an user', async () => {

      const userService = new UserService();
      const user = await userService.getUser(seededUser._id);

      expect(user._id).to.not.be.undefined
      expect(user._id).to.deep.equal(seededUser._id);
      expect(user.name).to.equal(seededUser.name);
      expect(user.role).to.equal(seededUser.role);

    });
  });
});

