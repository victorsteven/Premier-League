import chai from 'chai'
import sinon from 'sinon'
import faker from 'faker'
import { ObjectID } from 'mongodb'
import FixtureService from './fixture.service'
import Fixture from '../models/fixture'
import Team from '../models/team'
import SearchService from './search.service'


chai.use(require('chai-as-promised'))
const { expect } = chai


//Note any value that comes to this layer of the app is correctly checked and formatted, using our validators. so, only correct data come here.

describe.only('SearchFixtureService', () => {

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

      var mockTeam = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(teamsValue);
        }
      };

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

      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);
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

      var mockTeam = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(teamsValue);
        }
      };

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

      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);
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

      var mockTeam = {

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
      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {

        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(homeTeam);
        }
      };  

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

      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {
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
      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(homeTeam);
        }
      };  

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

      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {
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
      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(homeTeam);
        }
      };  

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

      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {

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
      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(awayTeams);
        }
      };  

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

      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {

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
      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(awayTeams);
        }
      };  

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

      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchAwayAndMatchTimeFixture(away, matchtime);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
      expect(fixture.matchday).to.equal(fixtureValue.matchday);
      expect(fixture.matchtime).to.equal(fixtureValue.matchtime);
    });
  });

  describe('searchAwayMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let away = "Everton"
      let matchday = "20-10-2050"
      let matchtime = "10:30"

      var mockTeam = {

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
      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

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

      var mockTeam = {
        select() {
          return this;
        },
        populate() {
            return this;
        },
        exec() {
          return Promise.resolve(awayTeams);
        }
      };  

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

      const teamStub = sandbox.stub(Team, 'find').returns(mockTeam);

      const fixtureStub = sandbox.stub(Fixture, 'find').returns(mockFixture);

      const searchService = new SearchService();

      const fixture = await searchService.searchAwayMatchDayAndMatchTimeFixture(away, matchday, matchtime);

      expect(teamStub.calledOnce).to.be.true;
      expect(fixtureStub.calledOnce).to.be.true;
      expect(fixture._id).to.equal(fixtureValue._id);
      expect(fixture.home).to.equal(fixtureValue.home);
      expect(fixture.away).to.equal(fixtureValue.away);
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
});
