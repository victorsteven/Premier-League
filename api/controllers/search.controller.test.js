import chai from 'chai'
import sinon from 'sinon'
import SearchController from './search.controller'
import SearchService from '../services/search.service'

import faker from 'faker'
import validate from '../utils/validate'


const { expect } = chai;

describe("SearchController", () => {

  //WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER


  describe("searchTeam", () => {

    let status, json, res, searchController, searchService

    let sandbox = null

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      searchService = new SearchService();
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore()
    })


    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it("should return error(s) when validation fails", async () => {

      //If at all the client should search fixtures, his query must be validated
      const req = {
        query: { 
          name: "", //this is invalid, cannot send empty tean
        },
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { "name": "a valid team name is required, atleast 3 characters" },
      ]

      const stub = sandbox.stub(validate, "teamSearchValidate").returns(errors);

      searchController = new SearchController(searchService);

      await searchController.searchTeam(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].errors).to.equal(errors);

    });

    it("should search and get team(s)", async () => {

      const req = {
        query: { 
          name: "Chelsea"
        },
      };

      const teamValue = {
          "_id": "5e69748a6e72a1a0793956eb",
          "name": "Chelsea"
        }

      const stub = sandbox.stub(searchService, "searchTeam").returns(teamValue);

      searchController = new SearchController(searchService);

      await searchController.searchTeam(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(teamValue);
    });
  });


  describe("searchFixture", () => {

    let status, json, res, searchController, searchService

    let sandbox = null

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      searchService = new SearchService();
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore()
    })


    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it("should return error(s) when validation fails", async () => {

      //If at all the client should search fixtures, his query must be validated
      const req = {
        query: { 
          home: "", //this is invalid, cannot send empty home tean
          away: "Chelsea",
          matchday: "12-12-1998", //this date is in the past
          matchtime: "10:30"
        },
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { "home": "a valid home team is required, atleast 3 characters" },
        { "matchday": "can't search a fixture in the past"}
      ]

      const stub = sandbox.stub(validate, "fixtureSearchValidate").returns(errors);

      searchController = new SearchController(searchService);

      await searchController.searchFixture(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].errors).to.equal(errors);

    });

    it("should search and get fixture(s)", async () => {

      const req = {
        query: { 
          home: "Chelsea", 
          away: "Newcastle United",
          matchday: "12-11-2050", 
          matchtime: "10:30"
        },
      };

      const fixtureValue = {
        "_id": "5e6976e61ec9d7a2d58662a8",
        "home": {
            "_id": "5e69748a6e72a1a0793956eb",
            "name": "Chelsea"
        },
        "away": {
            "_id": "5e69739d96bdb99f784df32e",
            "name": "Newcastle United"
        },
        "matchday": "12-11-2050",
        "matchtime": "10:30"
      }

      const stub = sandbox.stub(searchService, "searchFixture").returns(fixtureValue);

      searchController = new SearchController(searchService);

      await searchController.searchFixture(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(fixtureValue);
    });

    it("should search and get fixture(s) based on wildcard", async () => {

      const req = {
        query: { 
          home: "Manchester", 
          away: "Newcastle United",
          matchday: "12-11-2050", 
          matchtime: "10:30"
        },
      };

      const fixtureValues = [
      {
        "_id": "5e6976e61ec9d7a2d58662a8",
        "home": {
            "_id": "5e69748a6e72a1a0793956eb",
            "name": "Manchester United"
        },
        "away": {
            "_id": "5e69739d96bdb99f784df32e",
            "name": "Newcastle United"
        },
        "matchday": "12-11-2050",
        "matchtime": "10:30"
      },
      {
        "_id": "5e6d168ce43d8272913a7d98",
        "home": {
            "_id": "5e69748a6e72a1a0793956eb",
            "name": "Manchester City"
        },
        "away": {
            "_id": "5e69739d96bdb99f784df32e",
            "name": "Newcastle United"
        },
        "matchday": "15-04-2050",
        "matchtime": "02:15"
      }
    ]

      const stub = sandbox.stub(searchService, "searchFixture").returns(fixtureValues);

      searchController = new SearchController(searchService);

      await searchController.searchFixture(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(fixtureValues);
    });
  });
});