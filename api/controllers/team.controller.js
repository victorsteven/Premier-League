import { ObjectID } from 'mongodb';
import Team from '../models/team'
import validate from '../utils/validate'


class TeamController {
  constructor(userService, adminService, teamService){
    this.adminService = adminService
    this.userService = userService
    this.teamService = teamService
  }

  async createTeam(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    const errors = validate.teamValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    const { name } = req.body

    try {

      let adminId = tokenMetadata._id

      //verify that the admin sending this request exist:
      const admin = await this.adminService.getAdmin(adminId)
      
      const team = new Team({
        name: name.trim(),
        admin:  admin._id
      })

      const createTeam = await this.teamService.createTeam(team)
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

  async updateTeam(req, res) {

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
        error: "team id is not valid"
      })
    }

    const errors = validate.teamValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    const { name } = req.body

    try {

      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const team = await this.teamService.adminGetTeam(id)

      if (team.admin._id.toHexString() !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      team.name = name
      
      const updateTeam = await this.teamService.updateTeam(team)
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

  async deleteTeam(req, res) {

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
        error: "team id is not valid"
      })
    }

    try {

      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const team = await this.teamService.adminGetTeam(id)
      if (team.admin._id.toHexString() !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      //Delete the team
      const status = await this.teamService.deleteTeam(id)
      if (status) {
        return res.status(200).json({
          status: 200,
          data: "team deleted"
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async getTeam(req, res) {

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
        error: "team id is not valid"
      })
    }

    try {

      let authId = tokenMetadata._id

      //verify if the account that want to view this team exists(weather admin or normal user) 
      //if an error, it will be handled in the catch block
      await this.userService.getUser(authId)
      
      try {
        const gottenTeam = await this.teamService.getTeam(id)
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


  async getTeams(req, res) {

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

      //verify if the account that want to view this team exists(weather admin or normal user) 
      const user = await this.userService.getUser(authId)
      if (user) {
        const teams = await this.teamService.getTeams()
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