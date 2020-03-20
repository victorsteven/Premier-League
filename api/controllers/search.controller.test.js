import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import SearchController from './search.controller'
import SearchService from '../services/search.service'
import validate from '../utils/validate'

chai.use(require('chai-as-promised'))
chai.use(sinonChai)

const { expect } = chai


const mockResponse = () => {
  const res = {};
  res.status = sinon.stub()
  res.json = sinon.stub()
  res.status.returns(res);
  return res;
};

//WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER

describe('SearchController', () => {

  let res, searchService, searchController, sandbox = null

  beforeEach(() => {
    res = mockResponse()
    sandbox = sinon.createSandbox()
    searchService = new SearchService();
  });

  afterEach(() => {
    sandbox.restore()
  })

  describe('searchTeam', () => {

    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      //If at all the client should search fixtures, his query must be validated
      const req = {
        query: { 
          name: '', //this is invalid, cannot send empty tean'
        },
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'name': 'a valid team name is required, atleast 3 characters' },
      ]

      const stub = sandbox.stub(validate, 'teamSearchValidate').returns(errors);

      searchController = new SearchController(searchService);

      await searchController.searchTeam(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ 'status': 400, 'errors': errors});

    });

    //A db error can occur in the services, lets test for that
    it('should not search for team(s) when db error occurs', async () => {

      const req = {
        query: { 
          name: 'Chelsea'
        },
      };

      const stubErr = sandbox.stub(validate, 'teamSearchValidate').returns([]); //no validation error
      const stub = sandbox.stub(searchService, 'searchTeam').throws(new Error('database error'));

      searchController = new SearchController(searchService);

      await searchController.searchTeam(req, res);

      expect(stubErr.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({ 'status': 500, 'error': 'database error' });

    });

    it('should search and get team(s)', async () => {

      const req = {
        query: { 
          name: 'Chelsea'
        },
      };

      const teamValue = {
          '_id': '5e69748a6e72a1a0793956eb',
          'name': 'Chelsea'
        }

      const stubErr = sandbox.stub(validate, 'teamSearchValidate').returns([]);
      const stub = sandbox.stub(searchService, 'searchTeam').returns(teamValue);

      searchController = new SearchController(searchService);

      await searchController.searchTeam(req, res);

      expect(stubErr.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ 'status': 200, 'data': teamValue });

    });
  });


  describe('searchFixture', () => {

    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      //If at all the client should search fixtures, his query must be validated
      const req = {
        query: { 
          home: '', //this is invalid, cannot send empty home tean
          away: 'Chelsea',
          matchday: '12-12-1998', //this date is in the past
          matchtime: '10:30'
        },
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'home': 'a valid home team is required, atleast 3 characters' },
        { 'matchday': 'can\'t search a fixture in the past'}
      ]

      const stub = sandbox.stub(validate, 'fixtureSearchValidate').returns(errors);

      searchController = new SearchController(searchService);

      await searchController.searchFixture(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ 'status': 400, 'errors': errors });

    });

    //A DB error can occur
    it('should search and get fixture(s)', async () => {

      const req = {
        query: { 
          home: 'Chelsea', 
          away: 'Newcastle United',
          matchday: '12-11-2050', 
          matchtime: '10:30'
        },
      };


      const stubErr = sandbox.stub(validate, 'fixtureSearchValidate').returns([]); //no input error

      const stub = sandbox.stub(searchService, 'searchFixture').throws(new Error('database error'));

      searchController = new SearchController(searchService);

      await searchController.searchFixture(req, res);

      expect(stubErr.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({ 'status': 500, 'error': 'database error' });

    });

    it('should search and get fixture(s)', async () => {

      const req = {
        query: { 
          home: 'Chelsea', 
          away: 'Newcastle United',
          matchday: '12-11-2050', 
          matchtime: '10:30'
        },
      };

      const fixtureValue = {
        '_id': '5e6976e61ec9d7a2d58662a8',
        'home': {
            '_id': '5e69748a6e72a1a0793956eb',
            'name': 'Chelsea'
        },
        'away': {
            '_id': '5e69739d96bdb99f784df32e',
            'name': 'Newcastle United'
        },
        'matchday': '12-11-2050',
        'matchtime': '10:30'
      }

      const stubErr = sandbox.stub(validate, 'fixtureSearchValidate').returns([]);

      const stub = sandbox.stub(searchService, 'searchFixture').returns(fixtureValue);

      searchController = new SearchController(searchService);

      await searchController.searchFixture(req, res);

      expect(stubErr.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ 'status': 200, 'data': fixtureValue });

    });

    it('should search and get fixture(s) based on wildcard', async () => {

      const req = {
        query: { 
          home: 'Manchester', 
          away: 'Newcastle United',
          matchday: '12-11-2050', 
          matchtime: '10:30'
        },
      };

      const fixtureValues = [{
        '_id': '5e6976e61ec9d7a2d58662a8',
        'home': {
            '_id': '5e69748a6e72a1a0793956eb',
            'name': 'Manchester United'
        },
        'away': {
            '_id': '5e69739d96bdb99f784df32e',
            'name': 'Newcastle United'
        },
        'matchday': '12-11-2050',
        'matchtime': '10:30'
        },
        {
          '_id': '5e6d168ce43d8272913a7d98',
          'home': {
              '_id': '5e69748a6e72a1a0793956eb',
              'name': 'Manchester City'
          },
          'away': {
              '_id': '5e69739d96bdb99f784df32e',
              'name': 'Newcastle United'
          },
          'matchday': '15-04-2050',
          'matchtime': '02:15'
        }
      ]

      const stubErr = sandbox.stub(validate, 'fixtureSearchValidate').returns([]);

      const stub = sandbox.stub(searchService, 'searchFixture').returns(fixtureValues);

      searchController = new SearchController(searchService);

      await searchController.searchFixture(req, res);

      expect(stubErr.calledOnce).to.be.true;
      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({ 'status': 200, 'data': fixtureValues });

    });
  });
});