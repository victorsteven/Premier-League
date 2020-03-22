import chai from 'chai'
import chatHttp from 'chai-http';
import app from '../app/app'
import { seedTeamsAndFixtures, seedAdmin } from '../test-setup/seed'
import  { clearDatabase }  from '../test-setup/db-config'


chai.use(chatHttp);
const { expect } = chai


describe('Fixture E2E', () => {

  let seededAdmin, seededTeamsAndFixtures

  beforeEach(async () => {
    seededAdmin = await seedAdmin()
    seededTeamsAndFixtures = await seedTeamsAndFixtures()
  });

  /**
  * Clear all test data after every test.
  */
  afterEach(async () => {
    await clearDatabase();
  });

  describe('POST /fixture', () => {

    it('should not create a fixture if not authorized', async () => {

      let fixture = {
        home:  seededTeamsAndFixtures[0].home._id,
        away:  seededTeamsAndFixtures[1].away._id
      }
      const res = await chai.request(app)
                        .post('/api/v1/fixtures')
                        .set('Accept', 'application/json')
                        .send(fixture)

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized: you are not an admin');
    });


    it('should not create a fixture if input is invalid', async () => {

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let fixture = {
        home: '', 
        away: ''
      }
      const res = await chai.request(app)
                        .post('/api/v1/fixtures')
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(fixture)
      const errors = [
        { home: 'a valid home team is required'},
        { away: 'a valid away team is required'},
        { matchday: 'a valid matchday is required'},
        { matchtime: 'a valid matchtime is required'}
      ]
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);
    });

    it('should not create a fixture if the matchday and match time are not formatted correctly', async () => {

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let fixture = {
        home: seededTeamsAndFixtures[0].home._id,
        away:  seededTeamsAndFixtures[1].away._id,
        matchday: '1-2-2050', //wrong
        matchtime: '5:00' //wrong
      }
      const res = await chai.request(app)
                        .post('/api/v1/fixtures')
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(fixture)
      const errors = [
        {matchday: "matchday must be of the format: 'dd-mm-yyyy'"}, 
        {matchtime: "matchtime must be of the format: '10:30 or 07:00'"},
      ]
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);
    });


    it('should not create a fixture when the record already exist', async () => {

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`
      
      let fixture = {
        home:  seededTeamsAndFixtures[0].home._id,
        away:  seededTeamsAndFixtures[0].away._id,
        matchday: '10-02-2050',
        matchtime: '05:00' 
      }
      const res = await chai.request(app)
                        .post('/api/v1/fixtures')
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(fixture)

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('record already exists');
    });


    it('should create a fixture', async () => {

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let fixture = {
        home: seededTeamsAndFixtures[0].home._id,
        away:  seededTeamsAndFixtures[1].away._id,
        matchday: '10-02-2050',
        matchtime: '05:00' 
      }
      const res = await chai.request(app)
                        .post('/api/v1/fixtures')
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(fixture)


      const { _id, home, away, matchday, matchtime } = res.body.data
      expect(res.status).to.equal(201);
      expect(_id).not.to.be.undefined
      expect(home).not.to.be.undefined
      expect(away).not.to.be.undefined
      expect(matchday).to.equal(fixture.matchday);
      expect(matchtime).to.equal(fixture.matchtime);
    });
  });


  describe('UPDATE /fixture/:id', () => {

    it('should not update a fixture if not authorized', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      let fixture = {
        home:  seededTeamsAndFixtures[0].home,
        away:  seededTeamsAndFixtures[1].away
      }
      const res = await chai.request(app)
                        .put(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .send(fixture)

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized: you are not an admin');
    });


    it('should not update a fixture if input is invalid', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let fixture = {
        home: '', 
        away: ''
      }
      const res = await chai.request(app)
                        .put(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(fixture)
      const errors = [
        { home: 'a valid home team is required'},
        { away: 'a valid away team is required'},
        { matchday: 'a valid matchday is required'},
        { matchtime: 'a valid matchtime is required'}
      ]
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);
    });

    it('should not update a fixture if the matchday and match time are not formatted correctly', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let fixture = {
        home: seededTeamsAndFixtures[0].home._id,
        away:  seededTeamsAndFixtures[1].away._id,
        matchday: '1-2-2050', 
        matchtime: '5:00' 
      }
      const res = await chai.request(app)
                        .put(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(fixture)
      const errors = [
        {matchday: "matchday must be of the format: 'dd-mm-yyyy'"}, 
        {matchtime: "matchtime must be of the format: '10:30 or 07:00'"},
      ]
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);
    });



    it('should not update a fixture when the record already exist', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`
      
      let fixture = {
        home:  seededTeamsAndFixtures[1].home._id,
        away:  seededTeamsAndFixtures[1].away._id,
        matchday: '10-02-2050',
        matchtime: '05:00' 
      }
      const res = await chai.request(app)
                        .put(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(fixture)

      expect(res.status).to.equal(500);
      expect(res.body.error).to.equal('record already exists');
    });


    it('should update a fixture', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      let fixture = {
        home: seededTeamsAndFixtures[0].home._id,
        away:  seededTeamsAndFixtures[1].away._id,
        matchday: '30-07-2052',
        matchtime: '10:15' 
      }
      const res = await chai.request(app)
                        .put(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)
                        .send(fixture)


      const { _id, home, away, matchday, matchtime } = res.body.data
      expect(res.status).to.equal(200);
      expect(_id).not.to.be.undefined
      expect(home).not.to.be.undefined
      expect(away).not.to.be.undefined
      expect(matchday).to.equal(fixture.matchday);
      expect(matchtime).to.equal(fixture.matchtime);
    });
  });

  //This application is wired such that only authenticated user/admin can get a fixture
  //since the admin is also a user, we will use his jwt, if you want, you can login a normal user and use the user's jwt instead.
  describe('GET /fixture/:id', () => {

    it('should not get a fixture if not authorized', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      const res = await chai.request(app)
                        .get(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized, you need to be unauthenticated');
    });


    it('should not get a fixture if id is invalid', async () => {

      const fixtureId = 'sdkjnskjdflsdjkfsdlfksjdfsdf' //this is an invalid id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .get(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('fixture id is not valid');
    });

    it('should get a fixture', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .get(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      const { _id, home, away, matchday, matchtime } = res.body.data
      expect(res.status).to.equal(200);
      expect(_id).not.to.be.undefined
      expect(home).not.to.be.undefined
      expect(away).not.to.be.undefined
      expect(matchday).to.equal(seededTeamsAndFixtures[0].matchday);
      expect(matchtime).to.equal(seededTeamsAndFixtures[0].matchtime);
    });
  });

  //This application is wired such that only authenticated user/admin can get fixtures, let's still use the admin
  describe('GET /fixtures', () => {

    it('should not get fixtures if not authorized', async () => {

      const res = await chai.request(app)
                        .get('/api/v1/fixtures')
                        .set('Accept', 'application/json')

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized, you need to be unauthenticated');
    });

    it('should get fixtures', async () => {

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'

      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .get('/api/v1/fixtures')
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.equal(2); //we seeded two fixtures
    });
  });


  //only an admin can delete the fixture he created
  describe('DELETE /fixture/:id', () => {

    it('should not delete a fixture if not authorized', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      const res = await chai.request(app)
                        .delete(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')

      expect(res.status).to.equal(401);
      expect(res.body.error).to.equal('unauthorized: you are not an admin');
    });


    it('should not delete a fixture if id is invalid', async () => {

      const fixtureId = 'sdkjnskjdflsdjkfsdlfksjdfsdf' //this is an invalid id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .delete(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal('fixture id is not valid');
    });


    it('should delete a fixture', async () => {

      const fixtureId = seededTeamsAndFixtures[0]._id

      //this is a jwt that lives for ever, created when the seededAdmin logged in(ie, expiry date was removed when this token was created)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZiMTM4MDlmODZjZTYwZTkyZmYxMWMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1ODQ3ODk1MTl9.DQShCsjw6rvVbvT3DCdENyBeyY5XEWfiF1V8NfLNxI8'
      const authToken = `Bearer ${token}`

      const res = await chai.request(app)
                        .delete(`/api/v1/fixtures/${fixtureId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', authToken)

      expect(res.status).to.equal(200);
      expect(res.body.data).to.equal('fixture deleted');
    });
  });
})