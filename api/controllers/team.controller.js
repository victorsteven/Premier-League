import TeamService from '../services/team.service';
import _ from 'lodash'
import  { jwtDecode }  from '../utils/jwtHelper'
import AdminService from '../services/admin.service';
import { ObjectID } from 'mongodb';
import UserService from '../services/user.service';
import Team from '../models/team'
import Validator from '../utils/inputValidator';




class TeamController {

  static async createTeam(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata

    const request =  _.pick(req.body, 'name') 

    const validator = new Validator();
    validator.validate(request, 'required|string');
    if (validator.hasErrors) {
      return res.status(400).json({
        status: 400,
        messages: validator.getErrors(),
      });
    }

    try {

      let adminId = tokenMetadata._id

      //verify that the admin sending this request exist:
      const admin = await AdminService.getAdmin(adminId)
      
      const team = new Team({
        name: request.name.trim(),
        admin:  admin._id
      })

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

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata

    var teamId = req.params.id;
    if(!ObjectID.isValid(teamId)){
      return res.status(400).json({
        status: 400,
        error: "Team id is not valid"
      })
    }
    const request =  _.pick(req.body, 'name') 

    const validator = new Validator();
    validator.validate(request, 'required|string');

    if (validator.hasErrors) {
      return res.status(400).json({
        status: 400,
        messages: validator.getErrors(),
      });
    }

    try {

      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const team = await TeamService.adminGetTeam(teamId)
      if (team.admin._id.toHexString() !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      team.name = request.name
      
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

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata

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
      if (team.admin._id.toHexString() !== adminId) {
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

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata

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
      //if an error, it will be handled in the catch block
      await UserService.getUser(authId)
      
      try {
        const gottenTeam = await TeamService.getTeam(teamId)
        if (gottenTeam) {
          return res.status(200).json({
            status: 200,
            data: gottenTeam
          })
        }
      } catch(error) {
        throw error;
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  static async getTeams(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata

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