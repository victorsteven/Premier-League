import TeamService from '../services/team.service';
import _ from 'lodash'
import jwt, { decode }  from 'jsonwebtoken'
import  { jwtDecode }  from '../utils/jwtHelper'
import UserService from '../services/user.service';
import AdminService from '../services/admin.service';



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
      
      team.adminId = admin.adminId

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
}

export default TeamController