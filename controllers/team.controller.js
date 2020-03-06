import TeamService from '../services/team.service';
import _ from 'lodash'
import jwt, { decode }  from 'jsonwebtoken'
import  { jwtDecode }  from '../utils/jwtHelper'
import AdminService from '../services/admin.service';
import { ObjectID } from 'mongodb';
import UserService from '../services/user.service';




class TeamController {

  static async createTeam(req, res) {

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
    const team =  _.pick(req.body, ['name', 'coach']) 
    if (!team.name) {
      return res.status(400).json({
        status: 400,
        error: "Team name is required"
      })
    }
    if (!team.coach) {
      return res.status(400).json({
        status: 400,
        error: "Team coach is required"
      })
    }

    try {

      let adminId = tokenMetadata._id

      //verify that the admin sending this request exist:
      const admin = await AdminService.getAdmin(adminId)
      
      team.adminId = admin._id

      const createTeam = await TeamService.createTeam(team)
      if(createTeam) {
        return res.status(201).json({
          status: 201,
          data: createTeam
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

      //verify that the admin sending this request exist:
      const admin = await AdminService.getAdmin(adminId)

      //check if the admin is the creator of the team he wants to delete:
      if (admin._id !== adminId) {
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

export default TeamController