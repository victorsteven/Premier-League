import chai from 'chai'
import chatHttp from 'chai-http';
import app from '../app/app'
import { seedTeams, seedTeamsAndFixtures } from '../test-setup/seed'
import  { clearDatabase }  from '../test-setup/db-config'
// import mongoose from '../database/database' //this isimportant to connect to our test db 

chai.use(chatHttp);
const { expect } = chai


describe('Search E2E', () => {

  beforeEach(async () => {
    await seedTeams()
    await seedTeamsAndFixtures()
  });
  
  /**
  * Clear all test data after every test.
  */
  afterEach(async () => {
    await clearDatabase();
  });

  describe('SeachTeam /search/team', () => {

    it('should search a team and get result', async () => {

      let team = 'Watford'

      const res = await chai.request(app)
                        .get(`/api/v1/search/team?name=${team}`)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.be.greaterThan(0);

    });

    it('should search a team using wildcard and get result', async () => {

      let team = 'Ars' //search for anything team that have 'Ars' like Arsenal

      const res = await chai.request(app)
                        .get(`/api/v1/search/team?name=${team}`)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.be.greaterThan(0);

    });

    it('should not search for a team if the query name is less than 3 characters', async () => {

      let team = 'Wa'

      const res = await chai.request(app)
                        .get(`/api/v1/search/team?name=${team}`)
      
      const errors = [
        {name: 'a valid team name is required, atleast 3 characters'}
      ]                  
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);

    });

    it('should not search for a team if the query name is empty', async () => {

      let team = ''

      const res = await chai.request(app)
                        .get(`/api/v1/search/team?name=${team}`)
      
      const errors = [
        {name: 'a valid team name is required, atleast 3 characters'}
      ]                  
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);

    });

    it('should search a team and not get if not found', async () => {

      let team = 'Reading'

      const res = await chai.request(app)
                        .get(`/api/v1/search/team?name=${team}`)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.equal(0);

    });
  });

  //In no particular order we will test with some query
  describe('SeachFixture /search/fixture', () => {

    it('should search a fixture and get result when all query params are provided', async () => {

      //we have a seed that matches the below
      let home = 'Liverpool'
      let away = 'Arsenal'
      let matchday = '20-10-2050'
      let matchtime = '10:30'

      const res = await chai.request(app)
                        .get(`/api/v1/search/fixture?home=${home}&away=${away}&matchday=${matchday}&matchtime=${matchtime}`)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.be.greaterThan(0);
    });

    it('should search a fixture and get result when one query param is provided', async () => {

      //we have a seed that matches the below
      let home = 'Liverpool'

      const res = await chai.request(app)
                        .get(`/api/v1/search/fixture?home=${home}`)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.be.greaterThan(0);
    });

    it('should search a fixture and get result when two query params are provided', async () => {

      //we have a seed that matches the below
      let away = 'Arsenal'
      let matchtime = '10:30'

      const res = await chai.request(app)
                        .get(`/api/v1/search/fixture?away=${away}&matchtime=${matchtime}`)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.be.greaterThan(0);
    });


    it('should not search a fixture when invalid data is provided', async () => {

      //if any of the query is typed in the url, it needs to have a value
      let home = '' 
      let away = 'Ar' //atlest 3 characters are required
      let matchday = '0-1-2050' //invalid date
      let matchtime = '0:3' //invalid time

      const res = await chai.request(app)
                        .get(`/api/v1/search/fixture?home=${home}&away=${away}&matchday=${matchday}&matchtime=${matchtime}`)

      const errors =  [ 
        {"home": "a valid home team is required, atleast 3 characters"},
        {"away": "a valid away team is required, atleast 3 characters"},
        {"matchday": "matchday must be of the format: 'dd-mm-yyyy'"},
        {"matchtime": "matchtime must be of the format: '10:30 or 07:00'"},
      ]
      
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.deep.equal(errors);
    });


    it('should search and not get a fixture if not found', async () => {

      //we have a seed that matches the below
      let home = 'Barcelona'
      let away = 'Juventus'
      let matchday = '20-10-2050'
      let matchtime = '10:30'

      const res = await chai.request(app)
                        .get(`/api/v1/search/fixture?home=${home}&away=${away}&matchday=${matchday}&matchtime=${matchtime}`)

      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.equal(0);
    });
  });
});