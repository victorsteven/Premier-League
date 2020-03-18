import { ObjectID } from 'mongodb'
import AdminService from './admin.service'
import  password from '../utils/password';
import { seedAdmin } from '../testsetup/index'
import  { connect, clearDatabase, closeDatabase  }  from '../testsetup/test-db'



let seededAdmin
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  seededAdmin = await seedAdmin()
});

/**
* Clear all test data after every test.
*/
afterEach(async () => {
  await clearDatabase();
});

/**
* Remove and close the db and server.
*/
afterAll(async () => {
  await closeDatabase();
});


describe('AdminService', () => {

  describe('createAdmin', () => {

    it('should not create a new admin if record already exists', async () => {

      try {

        let admin = {
          name: 'frank',
          email: seededAdmin.email,
          password: 'password',
        }
  
        const adminService = new AdminService();
  
        await adminService.createAdmin(admin)

      } catch (e) {
        expect(e.message).toMatch('record already exists');
      }
    });

    it('should create a new admin', async () => {

      let adminNew = {
        name: 'kate',
        email: 'kate@example.com',
        password: 'password',
      }

      //'hashPassword' is a  dependency, so we mock it
      const hashPass = jest.spyOn(password, 'hashPassword').mockReturnValue('ksjndfklsndflksdmlfksdf')

      const adminService = new AdminService();

      const admin = await adminService.createAdmin(adminNew);

      expect(hashPass).toHaveBeenCalled();
      expect(admin._id).toBeDefined();
      expect(admin.name).toBe(adminNew.name);
      expect(admin.role).toBe(adminNew.role);
    });
  });


  describe('getAdmin', () => {

    it('should not get an admin if record does not exists', async () => {

      try {
        
        //This admin does not exist
        let adminObjID = new ObjectID("5e682d0d580b5a6fb795b842")

        const adminService = new AdminService();

        await adminService.getAdmin(adminObjID)

      } catch (e) {
        expect(e.message).toMatch('no record found');
      }
    });

    it('should get an admin', async () => {

      const adminService = new AdminService();
      const admin = await adminService.getAdmin(seededAdmin._id);

      expect(admin._id).toEqual(seededAdmin._id);
      expect(admin.name).toBe(seededAdmin.name);
      expect(admin.role).toBe(seededAdmin.role);

    });
  });
});
