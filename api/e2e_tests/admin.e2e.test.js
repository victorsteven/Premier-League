import supertest from 'supertest'
import app from '../app/app'
import http from 'http'
import User from '../models/user'
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




describe('Admin E2E', () => {
  describe('POST /admin', () => {
    it('should create a user', async () => {
      let admin = {
        name: 'victor',
        email: 'victor@example.com',
        password: 'password'
      }
      const res = await request
                        .post('/api/v1/admin')
                        .send(admin)

      const { _id, name, role } = res.body.data

      //we didnt return email and password, so we wont assert for them
      expect(res.status).toEqual(201);
      expect(_id).toBeDefined();
      expect(name).toEqual(admin.name);
      expect(role).toEqual('admin');

      //we can query the db to confirm the record
      const createdAdmin = await User.findOne({email: admin.email })
      expect(createdAdmin).toBeDefined()
      expect(createdAdmin.email).toEqual(admin.email);
      //since our password is hashed:
      expect(createdAdmin.password).not.toEqual(admin.password);
    });

    it('should not create a user if the record already exist.', async () => {
      let admin = {
        name: 'chikodi',
        email: seededAdmin.email, //a record that already exist
        password: 'password'
      }
      const res = await request
                        .post('/api/v1/admin')
                        .send(admin)

      expect(res.status).toEqual(500);
      expect(res.body.error).toEqual('record already exists');
    });


    it('should not create a user if validation fails', async () => {
      let admin = {
        name: '', //the name is required
        email: 'victorexample.com', //invalid email
        password: 'pass' //the password should be atleast 6 characters
      }
      const res = await request
                        .post('/api/v1/admin')
                        .send(admin)

      const errors =  [ 
        { name: 'a valid name is required' },
        {email: 'a valid email is required'},
        { password: 'a valid password with atleast 6 characters is required' } 
      ]                  
      expect(res.status).toEqual(400);
      expect(res.body.errors).toEqual(errors);

    });
  });
});