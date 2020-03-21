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

  async searchFixture({ home, away, matchday, matchtime }) {

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
    else {
      return []
    }
  }


  async searchMatchDayAndMatchTimeFixture(matchDay, matchTime){

      const awayMatchTimeFixtures = await this.fixture.find({ matchday: matchDay, matchtime: matchTime })
                                                      .select('-admin')
                                                      .select('-__v')
                                                      .populate('home', '_id name')
                                                      .populate('away', '_id name')
                                                      .exec()

      return awayMatchTimeFixtures
  }

  async searchAwayMatchDayAndMatchTimeFixture(awayTeam, matchDay, matchTime){

    const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i'  + '.*' }})

    if(aways.length > 0) {
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
  }

  async searchAwayAndMatchTimeFixture(awayTeam, matchTime){

    const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i'  + '.*' }})

    if(aways.length > 0) {
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
  }

  async searchAwayAndMatchDayFixture(awayTeam, matchDay){

    const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i'  + '.*' }})

    if(aways.length > 0) {

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
  }


  async searchHomeMatchDayAndMatchTimeFixture(homeTeam, matchDay, matchTime){

    const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i'  + '.*' }})

    if (homes.length > 0) {
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
  }


  async searchHomeAwayAndMatchTimeFixture(homeTeam, awayTeam, matchTime){

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
  }


  async searchHomeAwayAndMatchDayFixture(homeTeam, awayTeam, matchDay){


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
  }

  async searchHomeAndMatchTimeFixture(homeTeam, matchTime){


    const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i'  + '.*' }})

    if(homes.length > 0) {

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
  }

  async searchHomeAndMatchDayFixture(homeTeam, matchDay){

    const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i'  + '.*' }})

    if(homes.length > 0){

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
  }


  async searchMatchDayFixture(matchday){

    const matchDays = await this.fixture.find({ matchday: matchday })
                                        .select('-admin')
                                        .select('-__v')
                                        .populate('home', '_id name')
                                        .populate('away', '_id name')
                                        .exec()

    return matchDays
  }

  async searchMatchTimeFixture(matchtime){

    const matchTimes = await this.fixture.find({ matchtime: matchtime })
                                          .select('-admin')
                                          .select('-__v')
                                          .populate('home', '_id name')
                                          .populate('away', '_id name')
                                          .exec()

    return matchTimes
  }

  async searchHomeFixture(homeTeam){

    const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i'  + '.*' }})

    if (homes.length > 0) {

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
  }


  async searchAwayFixture(awayTeam){


    const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i' + '.*' }})

    if(aways.length > 0) {
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
  } 


  async searchHomeAndAwayFixture(homeTeam, awayTeam) {

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
  }

  async searchHomeAwayMatchDayAndMatchTimeFixture(homeTeam, awayTeam, matchDay, matchTime) {

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
  }

  async getHomeIds(homeTeam) {

    const homes = await this.team.find({'name': { $regex: '.*' + homeTeam, $options:'i' + '.*' }})

    if(homes.length > 0) {

      const homeIds = []

      homes.map(team => homeIds.push(team._id))

      return homeIds
    }
  }

  async getAwayIds(awayTeam) {

    const aways = await this.team.find({'name': { $regex: '.*' + awayTeam, $options:'i' + '.*' }})

    if(aways.length > 0) {

      const awayIds = []

      aways.map(team => awayIds.push(team._id))

      return awayIds
    }
  }
}

export default SearchService