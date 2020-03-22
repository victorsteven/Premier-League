import chai from 'chai'
import chatHttp from 'chai-http';
import app from '../app/app'
import { seedTeams, seedAdmin } from '../test-setup/seed'
import  { clearDatabase }  from '../test-setup/db-config'
// import mongoose from '../database/database' //this isimportant to connect to our test db 

chai.use(chatHttp);
const { expect } = chai


describe('Team E2E', () => {

  let seededTeams, seededAdmin

  beforeEach(async () => {
    seededTeams = await seedTeams()
    seededAdmin = await seedAdmin()
  });

  /**
  * Clear all test data after every test.
  */
  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /team', () => {

    it('should not create a team if not authorized', async () => {

      let team = {
        name: 'FullHam',
      }
      const res = await chai.request(app)
                        .post('/api/v1/teams')
                        .set('Accept', 'application/json')
                        .send(team)

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized: you are not an admin');
    });


    it('should not create a team if input is invalid', async () => {

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let team = {
        name: '', //the name is required
      }
      const res = await chai.request(app)
                        .post('/api/v1/teams')
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(team)
      const errors = [
        { name: 'a valid team name is required'}
      ]
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);
    });


    it('should not create a team when the record already exist', async () => {

    //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
    const authToken = `Bearer ${token}`

      let team = {
        name: seededTeams[0].name,
      }
      const res = await chai.request(app)
                        .post('/api/v1/teams')
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(team)

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('record already exists');
    });


    it('should create a team', async () => {

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let team = {
        name: 'FullHam',
      }
      const res = await chai.request(app)
                        .post('/api/v1/teams')
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(team)

      const { _id, name } = res.body.data

      expect(res.status).to.equal(201);
      expect(_id).not.to.be.undefined
      expect(name).to.equal(team.name);
    });
  });


  describe('UPDATE /teams/:id', () => {

    it('should not update a team if not authorized', async () => {

      const teamId = seededTeams[0]._id

      let team = {
        name:  'Aston Villa'
      }
      const res = await chai.request(app)
                        .put(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')
                        .send(team)

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized: you are not an admin');
    });


    it('should not update a team if input is invalid', async () => {

      const teamId = seededTeams[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let team = {
        name: '', 
      }
      const res = await chai.request(app)
                        .put(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(team)
      const errors = [
        { name: 'a valid team name is required'},
      ]
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);
    });

    it('should not update a team when the record already exist', async () => {

      const teamId = seededTeams[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`
      
      let team = {
        name:  seededTeams[1].name
      }
      const res = await chai.request(app)
                        .put(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(team)

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('record already exists');
    });


    it('should update a team', async () => {

      const teamId = seededTeams[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let team = {
        name: 'Aston Villa',
      }
      const res = await chai.request(app)
                        .put(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(team)


      const { _id, name } = res.body.data
      expect(res.status).to.equal(200);
      expect(_id).not.to.be.undefined
      expect(name).to.equal(team.name);
    });
  });

  //This application is wired such that only authenticated user/admin can get a team
  //since the admin is also a user, we will use his jwt, if you want, you can login a normal user and use the user's jwt instead.
  describe('GET /teams/:id', () => {

    it('should not get a team if not authorized', async () => {

      const teamId = seededTeams[0]._id

      const res = await chai.request(app)
                        .get(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized, you need to be unauthenticated');
    });


    it('should not get a team if id is invalid', async () => {

      const teamId = 'sdkjnskjdflsdjkfsdlfksjdfsdf' //this is an invalid id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .get(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('team id is not valid');
    });


    it('should get a team', async () => {

      const teamId = seededTeams[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .get(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      const { _id, name } = res.body.data

      expect(res.status).to.equal(200);
      expect(_id).not.to.be.undefined
      expect(name).to.equal(seededTeams[0].name);
    });
  });


  //This application is wired such that only authenticated user/admin can get teams
  //here, we will login the seeded user(not the admin), and use his token, just to demonstrate that we can use the normal user's token
  describe('GET /teams', () => {

    it('should not get teams if not authorized', async () => {

      const res = await chai.request(app)
                        .get(`/api/v1/teams`)
                        .set('Accept', 'application/json')

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized, you need to be unauthenticated');
    });

    it('should get teams', async () => {

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'

      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .get(`/api/v1/teams`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.equal(2); //we seeded two teams
    });
  });


  //only an admin can delete the team he created
  describe('DELETE /team/:id', () => {

    it('should not delete a team if not authorized', async () => {

      const teamId = seededTeams[0]._id

      const res = await chai.request(app)
                        .delete(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized: you are not an admin');
    });


    it('should not delete a team if id is invalid', async () => {

      const teamId = 'sdkjnskjdflsdjkfsdlfksjdfsdf' //this is an invalid id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .delete(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('team id is not valid');
    });


    it('should delete a team', async () => {

      const teamId = seededTeams[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .delete(`/api/v1/teams/${teamId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      expect(res.status).to.equal(200);
      expect(res.body.data).to.equal('team deleted');
    });
  });
});