import _ from 'lodash'
import { ObjectID } from 'mongodb';
import Fixture from '../models/fixture';
import validate from '../utils/validate'


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
    
    const errors = validate.fixtureValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    //No errors, proceed
    const { home, away, matchday, matchtime } = req.body

    try {
      
      let adminId = tokenMetadata._id

      //verify that the admin sending this request exist:
      const admin = await this.adminService.getAdmin(adminId)
      
      //check if the home and away teams exists, if any error, it will handled in the catch block
      await this.teamService.checkTeams(home, away)

      const fixture = new Fixture({
        home: home,
        away: away,
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

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
      return res.status(400).json({
        status: 400,
        error: "fixture id is not valid"
      })
    }

    const errors = validate.fixtureValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    //No errors, proceed
    const { home, away, matchday, matchtime } = req.body

    try {
      
      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const fixture = await this.fixtureService.adminGetFixture(id)
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

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
      return res.status(400).json({
        status: 400,
        error: "fixture id is not valid"
      })
    }

    try {

      let adminId = tokenMetadata._id

      //check if the fixture exist and if the owner is legit, before updating it:
      const fixture = await this.fixtureService.adminGetFixture(id)
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

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
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
        const fixture = await this.fixtureService.getFixture(id)
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