import _ from 'lodash'
import { ObjectID } from 'mongodb';
import Fixture from '../models/fixture';



class FixtureController {

  constructor(userService, adminService, teamService, fixtureService){
    this.adminService = adminService
    this.userService = userService
    this.teamService = teamService
    this.fixtureService = fixtureService
  }

  async createFixture(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }
    
    const { home, away, matchday, matchtime } = req.body

    if (
      (!home || typeof home !== "string") || (!away || typeof away !== "string") ||
      (!matchday || typeof matchday !== "string") || (!matchtime || typeof matchtime !== "string")
    ) {
      return res.status(400).json({
        error: "ensure that correct details are sent"
      });
    }
    if(!ObjectID.isValid(home)){
      return res.status(400).json({
        status: 400,
        error: "home id is not valid"
      })
    }
    if(!ObjectID.isValid(away)){
      return res.status(400).json({
        status: 400,
        error: "away id is not valid"
      })
    }

    let day = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
    if(!day.test(matchday)){
      return res.status(400).json({
        status: 400,
        error: `matchday must be of the format: 'dd-mm-yyyy'`
      })
    }
    let time = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/
    if(!time.test(matchtime)){
      return res.status(400).json({
        status: 400,
        error: `matchtime must be of the format: '10:30 or 07:00'`
      })
    }

    let d = new Date();
    let now = ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '-' +  ((d.getMonth() > 9) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '-' + d.getFullYear();

    console.log("match day: ", matchday)
    console.log("now day: ", now)

    if(matchday !== now && matchday < now || (matchday.split("-")[2] < now.split("-")[2])){
      return res.status(400).json({
        status: 400,
        error: "cannot create a fixture with a past date"
      })
    } 
    //the teams must be different
    if(home === away){
      return res.status(400).json({
        status: 400,
        error: "You can't create a fixture with the same team"
      })
    }

    try {
      
      let adminId = tokenMetadata._id

      //verify that the admin sending this request exist:
      const admin = await this.adminService.getAdmin(adminId)
      
      //check if the home and away teams exists:
      const gottenTeams = await this.teamService.checkTeams(home, away)

      const fixture = new Fixture({
        home: gottenTeams.home._id,
        away: gottenTeams.away._id,
        admin: admin._id,
        matchday: matchday,
        matchtime: matchtime,
      })

      const createFixture = await this.fixtureService.createFixture(fixture)
      if(createFixture) {
        return res.status(201).json({
          status: 201,
          data: createFixture
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async updateFixture(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    //check if the id passed to edit is valid
    var requestId = req.params.id;
    if(!ObjectID.isValid(requestId)){
      return res.status(400).json({
        status: 400,
        error: "fixture id is not valid"
      })
    }

    const { home, away, matchday, matchtime } = req.body

    if (
      (!home || typeof home !== "string") || (!away || typeof away !== "string") ||
      (!matchday || typeof matchday !== "string") || (!matchtime || typeof matchtime !== "string")
    ) {
      return res.status(400).json({
        error: "ensure that correct details are sent"
      });
    }
    if(!ObjectID.isValid(home)){
      return res.status(400).json({
        status: 400,
        error: "home id is not valid"
      })
    }
    if(!ObjectID.isValid(away)){
      return res.status(400).json({
        status: 400,
        error: "away id is not valid"
      })
    }
    let day = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
    if(!day.test(matchday)){
      return res.status(400).json({
        status: 400,
        error: `matchday must be of the format: 'dd-mm-yyyy'`
      })
    }
    let time = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/
    if(!time.test(matchtime)){
      return res.status(400).json({
        status: 400,
        error: `matchtime must be of the format: '10:30 or 07:00'`
      })
    }
    let d = new Date();
    let now = ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '-' +  ((d.getMonth() > 9) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '-' + d.getFullYear();
    if(matchday !== now && matchday < now || (matchday.split("-")[2] < now.split("-")[2])){
      return res.status(400).json({
        status: 400,
        error: "cannot update a fixture with a past date"
      })
    } 
    //the teams must be different
    if(home === away){
      return res.status(400).json({
        status: 400,
        error: "You can't update a fixture with the same team"
      })
    }

    try {
      
      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const fixture = await this.fixtureService.adminGetFixture(requestId)
      if (fixture.admin._id.toHexString() !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }
      //check if the home and away teams exists, any error will be handled in the catch block
      await this.teamService.checkTeams(home, away)
      
      //update the fixtures
      fixture.home = home
      fixture.away = away
      fixture.matchday = matchday
      fixture.matchtime = matchtime

      const updateFixture = await this.fixtureService.updateFixture(fixture)
      if(updateFixture) {
        return res.status(200).json({
          status: 200,
          data: updateFixture
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }


  async deleteFixture(req, res) {

     //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    var requestId = req.params.id;
    if(!ObjectID.isValid(requestId)){
      return res.status(400).json({
        status: 400,
        error: "fixture id is not valid"
      })
    }

    try {

      let adminId = tokenMetadata._id

      //check if the fixture exist and if the owner is legit, before updating it:
      const fixture = await this.fixtureService.adminGetFixture(requestId)
      if (fixture.admin._id.toHexString() !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      //Delete the fixture
      const status = await this.fixtureService.deleteFixture(fixture._id)
      if (status) {
        return res.status(200).json({
          status: 200,
          data: "fixture deleted"
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async getFixture(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    var requestId = req.params.id;
    if(!ObjectID.isValid(requestId)){
      return res.status(400).json({
        status: 400,
        error: "fixture id is not valid"
      })
    }

    try {

      let authId = tokenMetadata._id

      //verify if the account that want to view this fixture exists(weather admin or normal user) 
      const user = await this.userService.getUser(authId)
      if(user) {
        const fixture = await this.fixtureService.getFixture(requestId)
        if (fixture) {
          return res.status(200).json({
            status: 200,
            data: fixture
          })
        }
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async getFixtures(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    try {

      let authId = tokenMetadata._id

      //verify if the account that want to view this fixture exists(weather admin or normal user) 
      const user = await this.userService.getUser(authId)
      if (user) {
        const fixtures = await this.fixtureService.getFixtures()
        if (fixtures) {
          return res.status(200).json({
            status: 200,
            data: fixtures
          })
        }
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
}

export default FixtureController