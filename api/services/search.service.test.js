import SearchService from './search.service'
import { seedTeamsAndFixtures } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/unit-test-db'


//Define the variable to hold our seeded data
let seededTeamsFixtures

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  seededTeamsFixtures = await seedTeamsAndFixtures()
});

/**
* Clear all test data after every test.
*/
afterEach(async () => {
  await clearDatabase();
});

/**
* Remove and close the db and server.
*/
afterAll(async () => {
  await closeDatabase();
});



describe('SearchTeamService', () => {

  describe('searchTeam', () => {

    it('should return empty if search result is not found', async () => {

      let teamInput = 'Chelsea'

      const searchService = new SearchService();

      const teams = await searchService.searchTeam(teamInput)

      expect(teams.length).toBe(0)
     
    });

    it('should search and get team(s)', async () => {

      let teamInput = 'Arsenal'

      const searchService = new SearchService();

      const teams = await searchService.searchTeam(teamInput);

      //this record can be greater than zero
      expect(teams.length).toBeGreaterThan(0)

    });
  });
});



describe('SearchFixtureService', () => {


  describe('searchFixture', () => {

    it('should get fixture based on searchHomeFixture', async () => {

      let query = {
        home: 'Liverpool',
      }

      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchAwayFixture', async () => {

      let query = {
        away: 'Arsenal',
      }
      
      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchMatchDayFixture', async () => {

      let query = {
        matchday: '20-10-2050',
      }
      
      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchMatchTimeFixture', async () => {

      let query = {
        matchtime: '07:30',
      }
      
      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchHomeAndAwayFixture', async () => {

      let query = {
        home: 'Liverpool',
        away: 'Arsenal'
      }
      
      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchHomeAndMatchDayFixture', async () => {

      let query = {
        home: 'Liverpool',
        matchday: '20-10-2050',
      }
      
      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchHomeAndMatchTimeFixture', async () => {

      let query = {
        home: 'Liverpool',
        matchtime: '10:30'
      }
    
      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchHomeAwayAndMatchDayFixture', async () => {

      let query = {
        home: 'West Ham',
        away: 'Manchester City',
        matchday: '25-06-2050',
      }

      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)

    })

    it('should get fixture(s) based on searchHomeAwayAndMatchTimeFixture', async () => {

      let query = {
        home: 'West Ham',
        away: 'Manchester City',
        matchtime: '07:30'
      }
      
      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchHomeMatchDayAndMatchTimeFixture', async () => {

      let query = {
        home: 'Liverpool',
        matchday: '20-10-2050',
        matchtime: '10:30'
      }
      
      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchAwayAndMatchDayFixture', async () => {

      let query = {
        away: 'Arsenal',
        matchday: '20-10-2050',
      }

      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchAwayAndMatchTimeFixture', async () => {

      let query = {
        away: 'Arsenal',
        matchtime: '10:30'
      }

      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchAwayMatchDayAndMatchTimeFixture', async () => {

      let query = {
        away: 'Arsenal',
        matchday: '20-10-2050',
        matchtime: '10:30'
      }
      

      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchMatchDayAndMatchTimeFixture', async () => {

      let query = {
        matchday: '20-10-2050',
        matchtime: '10:30'
      }

      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get fixture(s) based on searchHomeAwayMatchDayAndMatchTimeFixture', async () => {

      let query = {
        home: 'Liverpool',
        away: 'Arsenal',
        matchday: '20-10-2050',
        matchtime: '10:30'
      }

      const searchService = new SearchService();

      const result =  await searchService.searchFixture(query)

      expect(result.length).toBe(1)
    })

    it('should get return nothing if no criteria is provided', async () => {

      let query = {}

      const searchService = new SearchService();

      const result = await searchService.searchFixture(query)

      expect(result.length).toBe(0)
    })
  });


  describe('searchHomeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let homeTeam = 'Chelsea' //this is not in our in-memory db

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchHomeFixture(homeTeam)).resolves.toBeUndefined()

    });

    it('should search and get fixture based on a home team', async () => {

      let homeTeam = 'Liverpool' //this record exist in our in-memory db

      const searchService = new SearchService();

      const fixture =  await searchService.searchHomeFixture(homeTeam)

      expect(fixture.length).toBe(1)

    });
  });

  describe('searchAwayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let awayTeam = 'Real Madrid' 

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchAwayFixture(awayTeam)).resolves.toBeUndefined()

    });


    it('should search and get fixture based on an away team', async () => {

      const awayTeam = 'Arsenal'

      const searchService = new SearchService();

      const fixture =  await searchService.searchAwayFixture(awayTeam)

      expect(fixture.length).toBe(1)

    });
  });


  describe('searchMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let matchtime = '15:30' //this matchtime does not exist

      const searchService = new SearchService();

      const fixture = await searchService.searchMatchTimeFixture(matchtime)

      expect(fixture.length).toBe(0)

    });

    it('should search and a get a fixture based on matchtime', async () => {

      let matchtime = '10:30' //this matchtime exists

      const searchService = new SearchService();

      const fixture =  await searchService.searchMatchTimeFixture(matchtime)

      expect(fixture.length).toBe(1)

    });
  });


  describe('searchMatchDayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let matchday = '30-10-2050' //this day does not exist

      const searchService = new SearchService();

      const fixture = await searchService.searchMatchDayFixture(matchday)

      expect(fixture.length).toBe(0)
    });

    it('should search and a get a fixture based on matchday', async () => {

      let matchday = '20-10-2050'

      const searchService = new SearchService();

      const fixture =  await searchService.searchMatchDayFixture(matchday)

      expect(fixture.length).toBe(1)
    });
  });

  describe('searchHomeAndMatchDayFixture', () => {

    it('should return empty if search result is not found', async () => {

      //Both parameters must be found to output the result
      let home = 'Chelsea'  //not found
      let matchday = '20-10-2050' //found

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchHomeAndMatchDayFixture(home, matchday)).resolves.toBeUndefined()

    });


    it('should search and a get a fixture based on home and matchday', async () => {

      let home = 'Liverpool' //found
      let matchday = '20-10-2050' //found

      const searchService = new SearchService();

      const fixture =  await searchService.searchHomeAndMatchDayFixture(home, matchday)

      expect(fixture.length).toBe(1)

    });
  });


  describe('searchHomeAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {
 
      let home = 'Chelsea' //not found
      let matchtime = '10:30' //found

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchHomeAndMatchTimeFixture(home, matchtime)).resolves.toBeUndefined()

    });


    it('should search and a get a fixture based on home and matchtime', async () => {

      let home = 'Liverpool' //found
      let matchtime = '10:30' //found

      const searchService = new SearchService();

      const fixture =  await searchService.searchHomeAndMatchTimeFixture(home, matchtime)

      expect(fixture.length).toBe(1)

    });
  });


  describe('searchHomeMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = 'Chelsea' //not found
      let matchday = '20-10-2050' //found
      let matchtime = '10:30' //found

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchHomeMatchDayAndMatchTimeFixture(home, matchday, matchtime)).resolves.toBeUndefined()

    });

    it('should search and a get a fixture based on home, matchday and matchtime', async () => {

      let home = 'Liverpool' //found
      let matchday = '20-10-2050' //found
      let matchtime = '10:30' //found

      const searchService = new SearchService();

      const fixture =  await searchService.searchHomeMatchDayAndMatchTimeFixture(home, matchday, matchtime)

      expect(fixture.length).toBe(1)

    });
  });

  describe('searchAwayAndMatchDayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let away = 'Everton' //not found
      let matchday = '20-10-2050' //found

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
       await expect(searchService.searchAwayAndMatchDayFixture(away, matchday)).resolves.toBeUndefined()

    });

    it('should search and a get a fixture based on away and matchday', async () => {

        let away = 'Manchester City' //found
        let matchday = '25-06-2050' //found

        const searchService = new SearchService();

        const fixture = await searchService.searchAwayAndMatchDayFixture(away, matchday);

        expect(fixture.length).toBe(1)

    });
  });


  describe('searchAwayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let away = 'Everton'  //not found
      let matchtime = '10:30' //found

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchAwayAndMatchTimeFixture(away, matchtime)).resolves.toBeUndefined()

    });

    it('should search and a get a fixture based on away and matchtime', async () => {

      let away = 'Arsenal'
      let matchtime = '10:30'

      const searchService = new SearchService();

      const fixture = await searchService.searchAwayAndMatchTimeFixture(away, matchtime);

      expect(fixture.length).toBe(1)

    });
  });

  describe('searchAwayMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let away = 'Everton' //not found
      let matchday = '20-10-2050' //found
      let matchtime = '10:30' //found

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchAwayMatchDayAndMatchTimeFixture(away, matchday, matchtime)).resolves.toBeUndefined()

    });

    it('should search and a get a fixture based on away, matchday and matchtime', async () => {

      let away = 'Arsenal' //found
      let matchday = '20-10-2050' //found
      let matchtime = '10:30' //found

      const searchService = new SearchService();

      const fixture = await searchService.searchAwayMatchDayAndMatchTimeFixture(away, matchday, matchtime);

      expect(fixture.length).toBe(1)

    });
  });


  describe('getHomeIds', () => {

    it('should retrieve home id(s), based on a given home input', async () => {

      let home = 'Liverpool'

      const searchService = new SearchService();

      const homeIds = await searchService.getHomeIds(home);

      expect(homeIds.length).toBeGreaterThan(0)

    });
  });


  describe('getAwayIds', () => {

    it('should retrieve away id(s), based on a given away input', async () => {

      let away = 'Manchester City'

      const searchService = new SearchService();

      const awayIds = await searchService.getAwayIds(away);

      expect(awayIds.length).toBeGreaterThan(0)

    });
  });

  describe('searchHomeAndAwayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = 'Boton'
      let away = 'Arsenal'

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchHomeAndAwayFixture(home, away)).resolves.toBeUndefined()

    });

    it('should search and a get a fixture based on home, away', async () => {

      let home = 'Liverpool'
      let away = 'Arsenal'

      const searchService = new SearchService();

       const fixture = await searchService.searchHomeAndAwayFixture(home, away)

      expect(fixture.length).toBe(1)

    });
  });

  describe('searchHomeAwayAndMatchDayFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = 'Chelsea'
      let away = 'Everton'
      let matchday = '20-10-2050'

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchHomeAwayAndMatchDayFixture(home, away, matchday)).resolves.toBeUndefined()

    });

    it('should search and a get a fixture based on home, away and matchday', async () => {

      let home = 'Liverpool'
      let away = 'Arsenal'
      let matchday = '20-10-2050'

      const searchService = new SearchService();

      const fixture = await searchService.searchHomeAwayAndMatchDayFixture(home, away, matchday);

      expect(fixture.length).toBe(1)

    });
  });


  describe('searchHomeAwayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = 'Chelsea'
      let away = 'Everton'
      let matchtime = '03:20'

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchHomeAwayAndMatchTimeFixture(home, away, matchtime)).resolves.toBeUndefined()

    });

    it('should search and a get a fixture based on home, away and matchtime', async () => {

      let home = 'Liverpool'
      let away = 'Arsenal'
      let matchtime = '10:30'
      
      const searchService = new SearchService();

      const fixture = await searchService.searchHomeAwayAndMatchTimeFixture(home, away, matchtime);

      expect(fixture.length).toBe(1)

    });
  });



  describe('searchHomeAwayMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let home = 'FullHam'
      let away = 'Manchester City'
      let matchday = '25-06-2050'
      let matchtime = '07:30'

      const searchService = new SearchService();

      //the team table must be searched first, if record not found, it start failing
      await expect(searchService.searchHomeAwayMatchDayAndMatchTimeFixture(home, away, matchday, matchtime)).resolves.toBeUndefined()

    });

    it('should search and a get a fixture based on home, away, matchday and matchtime', async () => {

      let home = 'West Ham'
      let away = 'Manchester City'
      let matchday = '25-06-2050'
      let matchtime = '07:30'

      const searchService = new SearchService();

      const fixture = await searchService.searchHomeAwayMatchDayAndMatchTimeFixture(home, away, matchday, matchtime);

      expect(fixture.length).toBe(1)

    });
  });


  describe('searchMatchDayAndMatchTimeFixture', () => {

    it('should return empty if search result is not found', async () => {

      let matchday = '04-10-2050'
      let matchtime = '10:30'

      const searchService = new SearchService();

      const fixture = await searchService.searchMatchDayAndMatchTimeFixture(matchday, matchtime)

      expect(fixture.length).toBe(0)

    });

    it('should search and a get a fixture based on matchday and matchtime', async () => {

      let matchday = '20-10-2050'
      let matchtime = '10:30'

      const searchService = new SearchService();

      const fixture = await searchService.searchMatchDayAndMatchTimeFixture(matchday, matchtime);

      expect(fixture.length).toBe(1)

    });
  });


  // describe('Wildcard Fixtures', () => {

  //   it('should search and a get a fixture based on home team and matchtime using a wildcard', async () => {

  //     let home = 'Manchester'
  //     let matchtime = '10:30'

  //     const searchService = new SearchService();

  //     const fixtures = await searchService.searchHomeAndMatchTimeFixture(home, matchtime);

  //   });
  // });
});
