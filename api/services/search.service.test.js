import chai from 'chai'
import sinon from 'sinon'
import Fixture from '../models/fixture'
import Team from '../models/team'
import SearchService from './search.service'


chai.use(require('chai-as-promised'))
const { expect } = chai


//Note any value that comes to this layer of the app is correctly checked and formatted, using our validators. so, only correct data come here.


describe('SearchTeamService', () => {

  let sandbox = null

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore()
  })


  describe('searchTeam', () => {

    it('should return empty if search result is not found', async () => {

      let team = "Chelsea"

      var mockFind = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(mockFind);

      const searchService = new SearchService();

      await expect(searchService.searchTeam(team)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and get team', async () => {

      let teamInput = "Chelsea"

      const teamValue = {
        "_id": "5e69748a6e72a1a0793956eb",
        "name": "Chelsea"
      }

      var mockFind = {
        select() {
          return this;
        },
        exec() {
          return Promise.resolve(teamValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(mockFind);

      const searchService = new SearchService();

      const team = await searchService.searchTeam(teamInput);

      expect(teamStub.calledOnce).to.be.true;
      expect(team._id).to.equal(teamValue._id);
      expect(team._id).to.equal(teamValue._id);
    });

    it('should search and get team that matches a wildcard', async () => {

      let teamInput = "Manchester"

      //The input can match the teams below
      const teamsValue = [
        {
          "_id": "5e69748a6e72a1a0793956eb",
          "name": "Manchester United"
        },
        {
          "_id": "5e6d168ce43d8272913a7d98",
          "name": "Manchester City"
        },
      ]

      var mockFind = {
        select() {
          return this;
        },
        exec() {
          return Promise.resolve(teamsValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(mockFind);

      const searchService = new SearchService();

      const teams = await searchService.searchTeam(teamInput);

      expect(teamStub.calledOnce).to.be.true;
      expect(teams.length).to.be.equal(2);
    });
  });
})



describe('SearchFixtureService', () => {

  let sandbox = null

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore()
  })


  describe('searchHomeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let homeTeam = "Chelsea"

      var mockFind = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(mockFind);

      const searchService = new SearchService();

      await expect(searchService.searchHomeFixture(homeTeam)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and get fixture based on a home team', async () => {

      let home = "Chelsea"

      const teamsValue = [{
        "_id": "5e69748a6e72a1a0793956eb",
        "name": "Chelsea"
      }]

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

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(teamsValue);
      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();
      const fixture = await searchService.searchHomeFixture(home);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });

  describe('searchAwayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let awayTeam = "Everton"

      var mockFind = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(mockFind);

      const searchService = new SearchService();

      await expect(searchService.searchAwayFixture(awayTeam)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });


    it('should search and get fixture based on an away team', async () => {

      const away = "Everton"

      const teamsValue = [{
        "_id": "5e69739d96bdb99f784df32e",
        "name": "Newcastle United"
      }]

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

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(teamsValue);
      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();
      const fixture = await searchService.searchAwayFixture(away);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('searchMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let matchtime = "10:30"

      var mockFind = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFind);

      const searchService = new SearchService();

      await expect(searchService.searchMatchTimeFixture(matchtime)).to.be.empty

      expect(fixtureStub.calledOnce).to.be.true;
     
    });


    it('should search and a get a fixture based on matchtime', async () => {

      let matchtime = "10:30"

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
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchMatchTimeFixture(matchtime);

      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('searchMatchDayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let matchday = "20-10-2050"

      var mockFind = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFind);

      const searchService = new SearchService();

      await expect(searchService.searchMatchTimeFixture(matchday)).to.be.empty

      expect(fixtureStub.calledOnce).to.be.true;
     
    });


    it('should search and a get a fixture based on matchday', async () => {

      let matchday = "20-10-2050"

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
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchMatchDayFixture(matchday);

      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });

  describe('searchHomeAndMatchDayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = "Chelsea"
      let matchday = "20-10-2050"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchHomeAndMatchDayFixture(home, matchday)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });


    it('should search and a get a fixture based on home and matchday', async () => {

      let home = "Chelsea"
      let matchday = "20-10-2050"

      const homeTeam =  [{
            "_id": "5e69748a6e72a1a0793956eb",
            "name": "Chelsea"
          }]

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
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(homeTeam);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchHomeAndMatchDayFixture(home, matchday);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('searchHomeAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = "Chelsea"
      let matchtime = "10:30"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchHomeAndMatchTimeFixture(home, matchtime)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });


    it('should search and a get a fixture based on home and matchtime', async () => {

      let home = "Chelsea"
      let matchtime = "10:30"

      const homeTeam =  [{
            "_id": "5e69748a6e72a1a0793956eb",
            "name": "Chelsea"
          }]

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
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(homeTeam);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchHomeAndMatchTimeFixture(home, matchtime);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('searchHomeMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = "Chelsea"
      let matchday = "20-10-2050"
      let matchtime = "10:30"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchHomeAndMatchTimeFixture(home, matchday, matchtime)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on home, matchday and matchtime', async () => {

      let home = "Chelsea"
      let matchday = "20-10-2050"
      let matchtime = "10:30"

      const homeTeam =  [{
            "_id": "5e69748a6e72a1a0793956eb",
            "name": "Chelsea"
          }]

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
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(homeTeam);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchHomeMatchDayAndMatchTimeFixture(home, matchday, matchtime);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });

  describe('searchAwayAndMatchDayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let away = "Everton"
      let matchday = "20-10-2050"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchAwayAndMatchDayFixture(away, matchday)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on away and matchday', async () => {

      let away = "Everton"
      let matchday = "20-10-2050"

      const awayTeams =  [{
            "_id": "5e69737e96bdb99f784df32d",
            "name": "Everton"
          }]

      const fixtureValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Everton"
            },
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(awayTeams);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchAwayAndMatchDayFixture(away, matchday);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('searchAwayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let away = "Everton"
      let matchtime = "10:30"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchAwayAndMatchTimeFixture(away, matchtime)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on away and matchtime', async () => {

      let away = "Everton"
      let matchtime = "10:30"

      const awayTeams =  [{
            "_id": "5e69737e96bdb99f784df32d",
            "name": "Everton"
          }]

      const fixtureValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Everton"
            },
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(awayTeams);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchAwayAndMatchTimeFixture(away, matchtime);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home._id).to.equal(fixtureValue.home._id);
      expect(fixture.away._id).to.equal(fixtureValue.away._id);
      expect(fixture.home.name).to.equal(fixtureValue.home.name);
      expect(fixture.away.name).to.equal(fixtureValue.away.name);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });

  describe('searchAwayMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let away = "Everton"
      let matchday = "20-10-2050"
      let matchtime = "10:30"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchAwayMatchDayAndMatchTimeFixture(away, matchday, matchtime)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on away, matchday and matchtime', async () => {

      let away = "Everton"
      let matchday = "20-10-2050"
      let matchtime = "10:30"

      const awayTeams =  [{
            "_id": "5e69737e96bdb99f784df32d",
            "name": "Everton"
          }]

      const fixtureValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Everton"
            },
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(awayTeams);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchAwayMatchDayAndMatchTimeFixture(away, matchday, matchtime);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home._id).to.equal(fixtureValue.home._id);
      expect(fixture.away._id).to.equal(fixtureValue.away._id);
      expect(fixture.home.name).to.equal(fixtureValue.home.name);
      expect(fixture.away.name).to.equal(fixtureValue.away.name);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('getHomeIds', () => {

    it('should retrieve home id(s), based on a given home input', async () => {

      let home = "Chelsea"

      //it can be more than one, depending on the wildcard used
      const homes = [{
        "_id": "5e69739d96bdb99f784df32e",
        "name": "Chelsea"
      }]

      const homeIdsValue =  ["5e69739d96bdb99f784df32e"] 

      const teamStub = sandbox.stub(Team, 'find').returns(homes);

      const searchService = new SearchService();

      const homeIds = await searchService.getHomeIds(home);

      expect(teamStub.calledOnce).to.be.true;
      expect(homeIds).to.deep.equal(homeIdsValue);
    });
  });


  describe('getAwayIds', () => {

    it('should retrieve away id(s), based on a given away input', async () => {

      let away = "Everton"

      //it can be more than one, depending on the wildcard used
      const aways = [{
        "_id": "5e69737e96bdb99f784df32d",
        "name": "Everton"
      }]

      const awayIdsValue =  ["5e69737e96bdb99f784df32d"] 

      const teamStub = sandbox.stub(Team, 'find').returns(aways);

      const searchService = new SearchService();

      const awayIds = await searchService.getAwayIds(away);

      expect(teamStub.calledOnce).to.be.true;
      expect(awayIds).to.deep.equal(awayIdsValue);
    });
  });

  describe('searchHomeAndAwayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = "Chelsea"
      let away = "Everton"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchHomeAndAwayFixture(home, away)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on home, away', async () => {

      let home = "Chelsea"
      let away = "Everton"

      const homeIds =  ["5e69739d96bdb99f784df32e"]
      const awayIds =  ["5e69737e96bdb99f784df32d"]

      const fixtureValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Everton"
            },
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const homeIdsStub = sandbox.stub(searchService, 'getHomeIds').returns(homeIds);
      const awayIdsStub = sandbox.stub(searchService, 'getAwayIds').returns(awayIds);

      const fixture = await searchService.searchHomeAndAwayFixture(home, away);

      expect(homeIdsStub.calledOnce).to.be.true;
      expect(awayIdsStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home._id).to.equal(fixtureValue.home._id);
      expect(fixture.away._id).to.equal(fixtureValue.away._id);
      expect(fixture.home.name).to.equal(fixtureValue.home.name);
      expect(fixture.away.name).to.equal(fixtureValue.away.name);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });

  describe('searchHomeAwayAndMatchDayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = "Chelsea"
      let away = "Everton"
      let matchday = "20-10-2050"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchHomeAwayAndMatchDayFixture(home, away, matchday)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on home, away and matchday', async () => {

      let home = "Chelsea"
      let away = "Everton"
      let matchday = "20-10-2050"

      const homeIds =  ["5e69739d96bdb99f784df32e"]
      const awayIds =  ["5e69737e96bdb99f784df32d"]

      const fixtureValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Everton"
            },
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const homeIdsStub = sandbox.stub(searchService, 'getHomeIds').returns(homeIds);
      const awayIdsStub = sandbox.stub(searchService, 'getAwayIds').returns(awayIds);

      const fixture = await searchService.searchHomeAwayAndMatchDayFixture(home, away, matchday);

      expect(homeIdsStub.calledOnce).to.be.true;
      expect(awayIdsStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home._id).to.equal(fixtureValue.home._id);
      expect(fixture.away._id).to.equal(fixtureValue.away._id);
      expect(fixture.home.name).to.equal(fixtureValue.home.name);
      expect(fixture.away.name).to.equal(fixtureValue.away.name);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('searchHomeAwayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = "Chelsea"
      let away = "Everton"
      let matchtime = "03:20"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchHomeAwayAndMatchTimeFixture(home, away, matchtime)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on home, away and matchtime', async () => {

      let home = "Chelsea"
      let away = "Everton"
      let matchtime = "03:20"

      const homeIds =  ["5e69739d96bdb99f784df32e"]
      const awayIds =  ["5e69737e96bdb99f784df32d"]

      const fixtureValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Everton"
            },
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const homeIdsStub = sandbox.stub(searchService, 'getHomeIds').returns(homeIds);
      const awayIdsStub = sandbox.stub(searchService, 'getAwayIds').returns(awayIds);

      const fixture = await searchService.searchHomeAwayAndMatchTimeFixture(home, away, matchtime);

      expect(homeIdsStub.calledOnce).to.be.true;
      expect(awayIdsStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home._id).to.equal(fixtureValue.home._id);
      expect(fixture.away._id).to.equal(fixtureValue.away._id);
      expect(fixture.home.name).to.equal(fixtureValue.home.name);
      expect(fixture.away.name).to.equal(fixtureValue.away.name);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });



  describe('searchHomeAwayMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = "Chelsea"
      let away = "Everton"
      let matchday = "20-10-2050"
      let matchtime = "10:30"

      //We wont get to the fixture since the team is not found, so we mock only the team
      const teamStub = sandbox.stub(Team, 'find').returns(false);

      const searchService = new SearchService();

      await expect(searchService.searchHomeAwayMatchDayAndMatchTimeFixture(home, away, matchday, matchtime)).to.be.empty

      expect(teamStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on home, away, matchday and matchtime', async () => {

      let home = "Chelsea"
      let away = "Everton"
      let matchday = "20-10-2050"
      let matchtime = "10:30"

      const homeIds =  ["5e69739d96bdb99f784df32e"]
      const awayIds =  ["5e69737e96bdb99f784df32d"]

      const fixtureValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Everton"
            },
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const homeIdsStub = sandbox.stub(searchService, 'getHomeIds').returns(homeIds);
      const awayIdsStub = sandbox.stub(searchService, 'getAwayIds').returns(awayIds);

      const fixture = await searchService.searchHomeAwayMatchDayAndMatchTimeFixture(home, away, matchday, matchtime);

      expect(homeIdsStub.calledOnce).to.be.true;
      expect(awayIdsStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home._id).to.equal(fixtureValue.home._id);
      expect(fixture.away._id).to.equal(fixtureValue.away._id);
      expect(fixture.home.name).to.equal(fixtureValue.home.name);
      expect(fixture.away.name).to.equal(fixtureValue.away.name);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('searchMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let matchday = "20-10-2050"
      let matchtime = "10:30"

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(false);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      await expect(searchService.searchMatchDayAndMatchTimeFixture(matchday, matchtime)).to.be.empty

      expect(fixtureStub.calledOnce).to.be.true;
     
    });

    it('should search and a get a fixture based on matchday and matchtime', async () => {

      let matchday = "20-10-2050"
      let matchtime = "10:30"

      const fixtureValue = {
            "_id": "5e6976e61ec9d7a2d58662a8",
            "home": {
                "_id": "5e69737e96bdb99f784df32d",
                "name": "Chelsea"
            },
            "away": {
                "_id": "5e69739d96bdb99f784df32e",
                "name": "Newcastle United"
            },
            "matchday": "20-10-2050",
            "matchtime": "10:30"
        }
      
      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValue);
        }
      };

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchMatchDayAndMatchTimeFixture(matchday, matchtime);

      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });


  describe('Wildcard Fixtures', () => {

    it('should search and a get a fixture based on home team and matchtime using a wildcard', async () => {

      let home = "Manchester"
      let matchtime = "10:30"

      const homeTeams =  [
        {
          "_id": "5e69748a6e72a1a0793956eb",
          "name": "Manchester United"
        },
        {
          "_id": "5e6d1673e43d8272913a7d97",
          "name": "Manchester City"
        }
      ]

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
              "_id": "5e6d1673e43d8272913a7d97",
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

      var mockFixture = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(fixtureValues);
        }
      };

      const teamStub = sandbox.stub(Team, 'find').returns(homeTeams);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixtures = await searchService.searchHomeAndMatchTimeFixture(home, matchtime);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixtures.length).to.be.equal(2);
    });
  });
});
