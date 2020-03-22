import chai from 'chai'
import chatHttp from 'chai-http';
import app from '../app/app'
import http from 'http'
import User from '../models/user'
import { seedUser } from '../test-setup/seed'
import  { clearDatabase }  from '../test-setup/db-config'

chai.use(chatHttp);
const { expect } = chai


describe('User E2E', () => {

  let server, seededUser

  //create a fake server
  before(async () => {
    server = http.createServer(app);
    await server.listen();
  });

  beforeEach(async () => {
      seededUser = await seedUser()
  });

  /**
  * Clear all test data after every test.
  */
  afterEach(async () => {
    await clearDatabase();
  });

  after(async () => {
    await server.close();
  });


  describe('POST /user', () => {
    it('should create a user', async () => {
      let user = {
        name: 'victor',
        email: 'victor@example.com',
        password: 'password'
      }
      const res = await chai.request(server)
                        .post('/api/v1/users')
                        .send(user)

      const { _id, name, role } = res.body.data

      //we didnt return email and password, so we wont assert for them
      expect(res.status).to.equal(201);
      expect(_id).not.to.be.undefined
      expect(name).to.equal(user.name);
      expect(role).to.equal('user');

      //we can query the db to confirm the record
      const createdUser = await User.findOne({email: user.email })
      expect(createdUser.email).to.equal(user.email);
      //since our password is hashed:
      expect(createdUser.password).not.to.equal(user.password);
    });

    it('should not create a user if the record already exist.', async () => {
      let user = {
        name: 'chikodi',
        email: seededUser.email, //a record that already exist
        password: 'password'
      }
      const res = await chai.request(server)
                        .post('/api/v1/users')
                        .send(user)

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('record already exists');
    });


    it('should not create a user if validation fails', async () => {
      let user = {
        name: '', //the name is required
        email: 'victorexample.com', //invalid email
        password: 'pass' //the password should be atleast 6 characters
      }
      const res = await chai.request(server)
                        .post('/api/v1/users')
                        .send(user)

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