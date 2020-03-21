import supertest from 'supertest'
import app from '../app/app'
import http from 'http'
import { seedAdmin } from '../test-setup/seed'
import  { clearDatabase, closeDatabase  }  from '../test-setup/db-config'
import mongoose from '../database/database' //this isimportant to connect to our test db 



let server, request, seededAdmin

beforeAll(async () => {
  server = http.createServer(app);
  await server.listen();
  request = supertest(server);
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
* Remove and close the test db and server.
*/
afterAll(async () => {
  await server.close();
  await closeDatabase();
});




describe('Authenticate E2E', () => {

  describe('POST /login', () => {

    it('should login an admin', async () => {

      let details = {
        email: 'steven@example.com',
        password: 'password'
      }
      const res = await request
                        .post('/api/v1/login')
                        .send(details)

      expect(res.status).toEqual(200);
      expect(res.body.token.length).toBeGreaterThan(0);

    });

    it('should not create a user if the record don\'t exist.', async () => {

      let details = {
        email: 'corona@example.com',
        password: 'password'
      }
      const res = await request
                        .post('/api/v1/login')
                        .send(details)

      expect(res.status).toEqual(500);
      expect(res.body.error).toBe('record not found');

    });

    it('should not create a user if the password is not correct.', async () => {

      let details = {
        email: 'steven@example.com',
        password: 'sdnfjksnfd' //incorrect
      }
      const res = await request
                        .post('/api/v1/login')
                        .send(details)

      expect(res.status).toEqual(500);
      expect(res.body.error).toBe('Invalid user credentials');

    });


    it('should not create a user if validation fails', async () => {

      let details = {
        email: 'example.com', //invalid email
        password: '' //empty password
      }
      const res = await request
                        .post('/api/v1/login')
                        .send(details)

      const errors =  [ 
        { email: 'a valid email is required'},
        { password: 'a valid password with atleast 6 characters is required' } 
      ]  

      expect(res.status).toEqual(400);
      expect(res.body.errors).toEqual(errors);

    });
  });
});