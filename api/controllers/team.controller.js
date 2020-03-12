import { ObjectID } from 'mongodb';
import Team from '../models/team'



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
    const { name } = req.body

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "a valid team name is required"
      });
    }

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

    var teamId = req.params.id;
    if(!ObjectID.isValid(teamId)){
      return res.status(400).json({
        status: 400,
        error: "team id is not valid"
      })
    }

    const { name } = req.body

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "a valid team name is required"
      });
    }

    try {

      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const team = await this.teamService.adminGetTeam(teamId)

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

    var teamId = req.params.id;
    if(!ObjectID.isValid(teamId)){
      return res.status(400).json({
        status: 400,
        error: "team id is not valid"
      })
    }

    try {

      let adminId = tokenMetadata._id

      //check if the team exist and if the owner is legit, before updating it:
      const team = await this.teamService.adminGetTeam(teamId)
      if (team.admin._id.toHexString() !== adminId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      //Delete the team
      const status = await this.teamService.deleteTeam(teamId)
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

    var teamId = req.params.id;
    if(!ObjectID.isValid(teamId)){
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
        const gottenTeam = await this.teamService.getTeam(teamId)
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