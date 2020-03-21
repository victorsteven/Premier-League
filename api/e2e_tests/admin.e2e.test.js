import chai from 'chai'
import supertest from 'supertest'
import app from '../app/app'
import http from 'http'
import User from '../models/user'
import { seedAdmin } from '../test-setup/seed'
import  { clearDatabase, closeDatabase  }  from '../test-setup/db-config'
import mongoose from '../database/database' //this isimportant to connect to our test db 

chai.use(require('chai-as-promised'))
const { expect } = chai



describe('Admin E2E', () => {

  let server, request, seededAdmin

  before(async () => {
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
  after(async () => {
    await server.close();
    await closeDatabase();
  });


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
      expect(res.status).to.equal(201);
      expect(_id).not.to.be.undefined;
      expect(name).to.equal(admin.name);
      expect(role).to.equal('admin');

      //we can query the db to confirm the record
      const createdAdmin = await User.findOne({email: admin.email })
      expect(createdAdmin).not.to.be.undefined
      expect(createdAdmin.email).to.equal(admin.email);
      //since our password is hashed:
      expect(createdAdmin.password).not.to.equal(admin.password);
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

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('record already exists');
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
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);

    });
  });
});