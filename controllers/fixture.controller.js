import FixtureService from '../services/fixture.service';
import _ from 'lodash'
import  { jwtDecode }  from '../utils/jwtHelper'
import AdminService from '../services/admin.service';
import { ObjectID } from 'mongodb';
import UserService from '../services/user.service';
import TeamService from '../services/team.service';
import Fixture from '../models/fixture';
import Validator from '../utils/inputValidator';



class FixtureController {

  static async createFixture(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: error.message
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: `unauthorized: ${error.message}`
      })
    }
    const request =  _.pick(req.body, ['home', 'away', 'matchday', 'matchtime']) 

    const validator = new Validator();
    validator.validate(request, 'required|objectid|string|matchday|matchtime');
    if (validator.hasErrors) {
      return res.status(400).json({
        status: 400,
        messages: validator.getErrors(),
      });
    }
    
    // if(!ObjectID.isValid(request.home)){
    //   return res.status(400).json({
    //     status: 400,
    //     error: "A valid home team id is required"
    //   })
    // }    
    // if(!ObjectID.isValid(request.away)){
    //   return res.status(400).json({
    //     status: 400,
    //     error: "A valid away team id is required"
    //   })
    // }
    //the teams must be different
    if(request.home === request.away){
      return res.status(400).json({
        status: 400,
        error: "You can't create a fixture with the same team"
      })
    }

    try {
      
      let adminId = tokenMetadata._id

      //verify that the admin sending this request exist:
      const admin = await AdminService.getAdmin(adminId)
      
      //check if the home and away teams exists:
      const homeTeam = await TeamService.getTeam(request.home)
      const awayTeam = await TeamService.getTeam(request.away)
      
      const fixture = new Fixture({
        home: homeTeam._id,
        away: awayTeam._id,
        admin: admin._id,
        matchday: request.matchday,
        matchtime: request.matchtime,
      })

      const createFixture = await FixtureService.createFixture(fixture)
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

  static async updateFixture(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: error.message
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: `unauthorized: ${error.message}`
      })
    }
    //check if the id passed to edit is valid
    var requestId = req.params.id;
    if(!ObjectID.isValid(requestId)){
      return res.status(400).json({
        status: 400,
        error: "Fixture id is not valid"
      })
    }
    const request = _.pick(req.body, ['home', 'away', 'matchday', 'matchtime']) 

    const validator = new Validator();
    validator.validate(request, 'required|string|objectid|matchday|matchtime');
    if (validator.hasErrors) {
      return res.status(400).json({
        status: 400,
        messages: validator.getErrors(),
      });
    }
    // if(!ObjectID.isValid(request.home)){
    //   return res.status(400).json({
    //     status: 400,
    //     error: "A valid home team id is required"
    //   })
    // }
    // if(!ObjectID.isValid(request.away)){
    //   return res.status(400).json({
    //     status: 400,
    //     error: "A valid away team id is required"
    //   })
    // }
    //the teams must be different
    if(request.home === request.away){
      return res.status(400).json({
        status: 400,
        error: "You can't update a fixture with the same team"
      })
    }

    try {
      
      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const fixture = await FixtureService.adminGetFixture(requestId)
      if (fixture.admin._id.toHexString() !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }
      //check if the home and away teams exists, any error will be handled in the catch block
      await TeamService.getTeam(request.home)
      await TeamService.getTeam(request.away)
      
      //update the fixtures
      fixture.home = request.home
      fixture.away = request.away
      fixture.matchday = request.matchday
      fixture.matchtime = request.matchtime

      const updateFixture = await FixtureService.updateFixture(fixture)
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


  static async deleteFixture(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: error.message
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: `unauthorized: ${error.message}`
      })
    }

    var requestId = req.params.id;
    if(!ObjectID.isValid(requestId)){
      return res.status(400).json({
        status: 400,
        error: "Team id is not valid"
      })
    }

    try {

      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const fixture = await FixtureService.adminGetFixture(requestId)
      if (fixture.admin._id.toHexString() !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      //Delete the team
      const status = await FixtureService.deleteFixture(fixture._id)
      if (status) {
        return res.status(200).json({
          status: 200,
          data: "Team deleted"
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  static async getFixture(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: error.message
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: `unauthorized: ${error.message}`
      })
    }

    var requestId = req.params.id;
    if(!ObjectID.isValid(requestId)){
      return res.status(400).json({
        status: 400,
        error: "Feature id is not valid"
      })
    }

    try {

      let authId = tokenMetadata._id

      //verify if the account that want to view this team exists(weather admin or normal user) 
      const user = await UserService.getUser(authId)
      if(user) {
        const fixture = await FixtureService.getFixture(requestId)
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

  static async getFixtures(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: error.message
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: `unauthorized: ${error.message}`
      })
    }

    try {

      let authId = tokenMetadata._id

      //verify if the account that want to view this team exists(weather admin or normal user) 
      const user = await UserService.getUser(authId)
      if (user) {
        const fixtures = await FixtureService.getFixtures()
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