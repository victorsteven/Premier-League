import { ObjectID } from 'mongodb'
import Team from '../models/team'
import Fixture from '../models/fixture'


class SearchService {
  constructor() {
    this.team = Team
    this.fixture = Fixture

  }


  async searchTeam(name){

    try {
      //a wildcard might get more than one team
      const teams = await this.team.find({'name': { $regex: '.*' + name, $options:'i'  + '.*' }})
                                    .select('-admin')
                                    .select('-__v')
                                    .exec()
      return teams

    } catch(error) {
      throw error;
    }
  }

  async searchFixture(query) {

    const { home, away, matchday, matchtime } = query

    try {

      if(home && !away && !matchday && !matchtime) {
        return await this.searchHomeFixture(home)
      } 
      else if (!home && away && !matchday && !matchtime) {
        return await this.searchAwayFixture(away)
      }
      else if (!home && !away && matchday && !matchtime) {
        return await this.searchMatchDayFixture(matchday)
      }
      else if (!home && !away && !matchday && matchtime) {
        return await this.searchMatchTimeFixture(matchtime)
      }
      else if (home && away && !matchday && !matchtime) {
        return await this.searchHomeAndAwayFixture(home, away)
      }
      else if (home && !away && matchday && !matchtime) {
        return await this.searchHomeAndMatchDayFixture(home, matchday)
      }
      else if (home && !away && !matchday && matchtime) {
        return await this.searchHomeAndMatchTimeFixture(home, matchtime)
      }
      else if (home && away && matchday && !matchtime) {
        return await this.searchHomeAwayAndMatchDayFixture(home, away, matchday)
      }
      else if (home && away && !matchday && matchtime) {
        return await this.searchHomeAwayAndMatchTimeFixture(home, away, matchtime)
      }
      else if (home && !away && matchday && matchtime) {
        return await this.searchHomeMatchDayAndMatchTimeFixture(home, matchday, matchtime)
      }
      else if (!home && away && matchday && !matchtime) {
        return await this.searchAwayAndMatchDayFixture(away, matchday)
      }
      else if (!home && away && !matchday && matchtime) {
        return await this.searchAwayAndMatchTimeFixture(away, matchtime)
      }
      else if (!home && away && matchday && matchtime) {
        return await this.searchAwayMatchDayAndMatchTimeFixture(away, matchday, matchtime)
      }
      else if (!home && !away && matchday && matchtime) {
        return await this.searchMatchDayAndMatchTimeFixture(matchday, matchtime)
      }
      else if (home && away && matchday && matchtime) {
        return await this.searchHomeAwayMatchDayAndMatchTimeFixture(home, away, matchday, matchtime)
      }

    } catch(error) {
      throw error;
    }
  }


  async searchMatchDayAndMatchTimeFixture(matchDay, matchTime){

    try {

      const awayMatchTimeFixtures = await this.fixture.find({ matchday: matchDay, matchtime: matchTime })
                                                      .select('-admin')
                                                      .select('-__v')
                                                      .populate('home', '_id name')
                                                      .populate('away', '_id name')
                                                      .exec()

      return awayMatchTimeFixtures

    } catch(error) {
      throw error;
    }
  }

  async searchAwayMatchDayAndMatchTimeFixture(awayTeam, matchDay, matchTime){

    try {

      const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i'  + '.*' }})

      if(aways) {
        const awayIds = []

        aways.map(team => awayIds.push(team._id))

        const awayMatchDayMatchTimeFixtures = await this.fixture.find({ away: { $in: awayIds }, matchday: matchDay, matchtime: matchTime })
                                                              .select('-admin')
                                                              .select('-__v')
                                                              .populate('home', '_id name')
                                                              .populate('away', '_id name')
                                                              .exec()

      return awayMatchDayMatchTimeFixtures

      } 

    } catch(error) {
      throw error;
    }
  }

  async searchAwayAndMatchTimeFixture(awayTeam, matchTime){

    try {

      const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i'  + '.*' }})

      if(aways) {
        const awayIds = []

        aways.map(team => awayIds.push(team._id))

        const awayMatchTimeFixtures = await this.fixture.find({ away: { $in: awayIds }, matchtime: matchTime })
                                                      .select('-admin')
                                                      .select('-__v')
                                                      .populate('home', '_id name')
                                                      .populate('away', '_id name')
                                                      .exec()

        return awayMatchTimeFixtures

      }

    } catch(error) {
      throw error;
    }
  }

  async searchAwayAndMatchDayFixture(awayTeam, matchDay){

    try {

      const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i'  + '.*' }})

      if(aways) {

        const awayIds = []

        aways.map(team => awayIds.push(team._id))

        const awayMatchDayFixtures = await this.fixture.find({ away: { $in: awayIds }, matchday: matchDay })
                                                      .select('-admin')
                                                      .select('-__v')
                                                      .populate('home', '_id name')
                                                      .populate('away', '_id name')
                                                      .exec()

        return awayMatchDayFixtures
      }

    } catch(error) {
      throw error;
    }
  }


  async searchHomeMatchDayAndMatchTimeFixture(homeTeam, matchDay, matchTime){

    try {

      const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i'  + '.*' }})

      if (homes) {
        const homeIds = []

        homes.map(team => homeIds.push(team._id))
  
        const homeMatchDayMatchTimeFixtures = await this.fixture.find({ home: { $in: homeIds }, matchday: matchDay, matchtime: matchTime })
                                                                .select('-admin')
                                                                .select('-__v')
                                                                .populate('home', '_id name')
                                                                .populate('away', '_id name')
                                                                .exec()
  
        return homeMatchDayMatchTimeFixtures
      }

    } catch(error) {
      throw error;
    }
  }


  async searchHomeAwayAndMatchTimeFixture(homeTeam, awayTeam, matchTime){

    try {

      const homeIds = await this.getHomeIds(homeTeam)
      const awayIds = await this.getAwayIds(awayTeam)

      if(homeIds && awayIds) {

        const homeAwayMatchTimeFixtures = await this.fixture.find({ home: { $in: homeIds }, away: { $in: awayIds }, matchtime: matchTime })
                                                          .select('-admin')
                                                          .select('-__v')
                                                          .populate('home', '_id name')
                                                          .populate('away', '_id name')
                                                          .exec()

      return homeAwayMatchTimeFixtures

    }

    } catch(error) {
      throw error;
    }
  }


  async searchHomeAwayAndMatchDayFixture(homeTeam, awayTeam, matchDay){

    try {

      const homeIds = await this.getHomeIds(homeTeam)
      const awayIds = await this.getAwayIds(awayTeam)

      if(homeIds && awayIds) {

        const homeAwayMatchDayFixtures = await this.fixture.find({ home: { $in: homeIds }, away: { $in: awayIds }, matchday: matchDay })
                                                          .select('-admin')
                                                          .select('-__v')
                                                          .populate('home', '_id name')
                                                          .populate('away', '_id name')
                                                          .exec()

        return homeAwayMatchDayFixtures

      }

    } catch(error) {
      throw error;
    }
  }

  async searchHomeAndMatchTimeFixture(homeTeam, matchTime){

    try {

      const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i'  + '.*' }})

      if(homes) {

        const homeIds = []

        homes.map(team => homeIds.push(team._id))

        const homeMatchDayFixtures = await this.fixture.find({ home: { $in: homeIds },  matchtime: matchTime })
                                                      .select('-admin')
                                                      .select('-__v')
                                                      .populate('home', '_id name')
                                                      .populate('away', '_id name')
                                                      .exec()
        return homeMatchDayFixtures

      }

    } catch(error) {
      throw error;
    }
  }

  async searchHomeAndMatchDayFixture(homeTeam, matchDay){

    try {

      const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i'  + '.*' }})

      if(homes){

        const homeIds = []

        homes.map(team => homeIds.push(team._id))

        const homeMatchDayFixtures = await this.fixture.find({ home: { $in: homeIds }, matchday: matchDay })
                                                      .select('-admin')
                                                      .select('-__v')
                                                      .populate('home', '_id name')
                                                      .populate('away', '_id name')
                                                      .exec()

        return homeMatchDayFixtures
      }

    } catch(error) {
      throw error;
    }
  }


  async searchMatchDayFixture(matchday){

    try {

      const matchDays = await this.fixture.find({ matchday: matchday })
                                          .select('-admin')
                                          .select('-__v')
                                          .populate('home', '_id name')
                                          .populate('away', '_id name')
                                          .exec()

      return matchDays

    } catch(error) {
      throw error;
    }
  }

  async searchMatchTimeFixture(matchtime){

    try {

      const matchTimes = await this.fixture.find({ matchtime: matchtime })
                                            .select('-admin')
                                            .select('-__v')
                                            .populate('home', '_id name')
                                            .populate('away', '_id name')
                                            .exec()

      return matchTimes

    } catch(error) {
      throw error;
    }
  }

  async searchHomeFixture(homeTeam){

    try {

      const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i'  + '.*' }})

      if (homes) {

        const homeIds = []

        homes.map(team => homeIds.push(team._id))

        const homeFixtures = await this.fixture.find({ home: { $in: homeIds } })
                                                .select('-admin')
                                                .select('-__v')
                                                .populate('home', '_id name')
                                                .populate('away', '_id name')
                                                .exec()

        return homeFixtures
      }

    } catch(error) {
      throw error;
    }
  }


  async searchAwayFixture(awayTeam){

    try {

      const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i' + '.*' }})

      if(aways) {
        const awayIds = []

        aways.map(team => awayIds.push(team._id))

        const awayFixtures = await this.fixture.find({ away: { $in: awayIds } })
                                              .select('-admin')
                                              .select('-__v')
                                              .populate('home', '_id name')
                                              .populate('away', '_id name')
                                              .exec()

        return awayFixtures
      }

    } catch(error) {
      throw error;
    }
  }


  async searchHomeAndAwayFixture(homeTeam, awayTeam) {

    try {

      const homeIds = await this.getHomeIds(homeTeam)
      const awayIds = await this.getAwayIds(awayTeam)

      if(homeIds && awayIds) {

        const fixtures = await this.fixture.find({ home: { $in: homeIds }, away: { $in: awayIds }  })
                                            .select('-admin')
                                            .select('-__v')
                                            .populate('home', '_id name')
                                            .populate('away', '_id name')
                                            .exec()

        return fixtures

      }
    }  catch(error) {
      throw error;
    }
  }

  async searchHomeAwayMatchDayAndMatchTimeFixture(homeTeam, awayTeam, matchDay, matchTime) {

    try {
  
      const homeIds = await this.getHomeIds(homeTeam)
      const awayIds = await this.getAwayIds(awayTeam)

      if(homeIds && awayIds) {

        const fixtures = await this.fixture.find({ home: { $in: homeIds }, away: { $in: awayIds }, matchday: matchDay, matchtime: matchTime })
                                            .select('-admin')
                                            .select('-__v')
                                            .populate('home', '_id name')
                                            .populate('away', '_id name')
                                            .exec()
  
        return fixtures

      }
  
    }  catch(error) {
      throw error;
    }
  }

  async getHomeIds(homeTeam) {

    try {

      const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i' + '.*' }})

      console.log("the homes: ", homes)

      if(homes) {

        const homeIds = []

        homes.map(team => homeIds.push(team._id))

        return homeIds
      }

    }  catch(error) {
      throw error;
    }
  }

  async getAwayIds(awayTeam) {

    try {

      const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i' + '.*' }})

      if(aways) {

        const awayIds = []

        aways.map(team => awayIds.push(team._id))

        return awayIds
      }

    }  catch(error) {
      throw error;
    }
  }
}

export default SearchService