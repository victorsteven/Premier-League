import chai from 'chai'
import chatHttp from 'chai-http';
import app from '../app/app'
import { seedAdmin } from '../test-setup/seed'
import  { clearDatabase }  from '../test-setup/db-config'
// import mongoose from '../database/database' //this isimportant to connect to our test db 

chai.use(chatHttp);
const { expect } = chai



describe('Authenticate E2E', () => {

  let seededAdmin

  beforeEach(async () => {
      seededAdmin = await seedAdmin()
  });

  /**
  * Clear all test data after every test.
  */
  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /login', () => {

    it('should login an admin', async () => {

      let details = {
        email: 'steven@example.com',
        password: 'password'
      }
      const res = await chai.request(app)
                        .post('/api/v1/login')
                        .send(details)

      expect(res.status).to.equal(200);
      expect(res.body.token.length).to.be.greaterThan(0);

    });

    it('should not create a user if the record don\'t exist.', async () => {

      let details = {
        email: 'corona@example.com',
        password: 'password'
      }
      const res = await chai.request(app)
                        .post('/api/v1/login')
                        .send(details)

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('record not found');

    });

    it('should not create a user if the password is not correct.', async () => {

      let details = {
        email: 'steven@example.com',
        password: 'sdnfjksnfd' //incorrect
      }
      const res = await chai.request(app)
                        .post('/api/v1/login')
                        .send(details)

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('Invalid user credentials');

    });


    it('should not create a user if validation fails', async () => {

      let details = {
        email: 'example.com', //invalid email
        password: '' //empty password
      }
      const res = await chai.request(app)
                        .post('/api/v1/login')
                        .send(details)

      const errors =  [ 
        { email: 'a valid email is required'},
        { password: 'a valid password with atleast 6 characters is required' } 
      ]  

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);

    });
  });
});