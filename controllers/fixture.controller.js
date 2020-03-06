import FixtureService from '../services/fixture.service';
import _ from 'lodash'
import jwt, { decode }  from 'jsonwebtoken'
import  { jwtDecode }  from '../utils/jwtHelper'
import AdminService from '../services/admin.service';
import { ObjectID } from 'mongodb';
import UserService from '../services/user.service';
import TeamService from '../services/team.service';




class FixtureController {

  static async createFixture(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized, no userInfo"
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: error.message
      })
    }
    const fixture =  _.pick(req.body, ['homeId', 'awayId']) 
    
    if(!ObjectID.isValid(fixture.homeId)){
      return res.status(400).json({
        status: 400,
        error: "A valid home team id is required"
      })
    }
    if(!ObjectID.isValid(fixture.awayId)){
      return res.status(400).json({
        status: 400,
        error: "A valid away team id is required"
      })
    }

    try {
      
      let adminId = tokenMetadata._id

      //verify that the admin sending this request exist:
      const admin = await AdminService.getAdmin(adminId)
      if(admin) {
        fixture.adminId = admin._id
      }
      //check if the home and away teams exists:
      const homeTeam = await TeamService.getTeam(fixture.homeId)
      if(!homeTeam){
        return res.status(401).json({
          status: 401,
          error: "home team is not"
        })
      }
      const awayTeam = await TeamService.getTeam(fixture.awayId)
      if(!awayTeam){
        return res.status(401).json({
          status: 401,
          error: "away team is not"
        })
      }

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

  static async updateTeam(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized, no userInfo"
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: error.message
      })
    }

    var teamId = req.params.id;
    if(!ObjectID.isValid(teamId)){
      return res.status(400).json({
        status: 400,
        error: "Team id is not valid"
      })
    }
    const request =  _.pick(req.body, ['name', 'coach']) 
    if (!request.name) {
      return res.status(400).json({
        status: 400,
        error: "Team name is required"
      })
    }
    if (!request.coach) {
      return res.status(400).json({
        status: 400,
        error: "Team coach is required"
      })
    }

    try {

      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const team = await TeamService.adminGetTeam(teamId)
      if (team.adminId !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      team.name = request.name
      team.coach = request.coach
      
      const updateTeam = await TeamService.updateTeam(team)
      if(updateTeam) {
        return res.status(200).json({
          status: 200,
          data: updateTeam
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  static async deleteTeam(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized, no userInfo"
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: error.message
      })
    }

    var teamId = req.params.id;
    if(!ObjectID.isValid(teamId)){
      return res.status(400).json({
        status: 400,
        error: "Team id is not valid"
      })
    }

    try {

      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const team = await TeamService.adminGetTeam(teamId)
      if (team.adminId !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      //Delete the team
      const status = await TeamService.deleteTeam(teamId)
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

  static async getTeam(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized, no userInfo"
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: error.message
      })
    }

    var teamId = req.params.id;
    if(!ObjectID.isValid(teamId)){
      return res.status(400).json({
        status: 400,
        error: "Team id is not valid"
      })
    }

    try {

      let authId = tokenMetadata._id

      //verify if the account that want to view this team exists(weather admin or normal user) 
      const user = await UserService.getUser(authId)
      if(user) {
        const team = await TeamService.getTeam(teamId)
        if (team) {
          return res.status(200).json({
            status: 200,
            data: team
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

  static async getTeams(req, res) {

    let tokenMetadata

    //Check, validate and get valid token metadata, or send an error 
    try {
      tokenMetadata = jwtDecode(req)
      if(!tokenMetadata) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized, no userInfo"
        })
      }
    } catch(error) {
        return res.status(401).json({
        status: 401,
        error: error.message
      })
    }


    try {

      let authId = tokenMetadata._id

      //verify if the account that want to view this team exists(weather admin or normal user) 
      const user = await UserService.getUser(authId)
      if (user) {
        const teams = await TeamService.getTeams()
        if (teams) {
          return res.status(200).json({
            status: 200,
            data: teams
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