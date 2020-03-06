import Team from '../models/team'
import { ObjectID } from 'mongodb';


class TeamService {

  static async createTeam(team) {

    try {

      //check if the team already exist
      const record = await Team.findOne({ name: team.name })
      if (record) {
        throw new Error('record already exist');
      } 

      const createdTeam = await Team.create(team);

      const { name, coach, adminId } = createdTeam

      const publicTeam = { 
        _id: createdTeam._id.toHexString(),
        name,
        coach,
        adminId
      }

      return publicTeam

    } catch(error) {
      throw error;
    }
  }


  //this is only used by the admin when he want to do things like update or delete
  static async adminGetTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      //check if the team already exist
      const gottenTeam = await Team.findOne({ _id: teamIdObj })
      if (!gottenTeam) {
        throw new Error('no record found');
      }

      const { name, coach, adminId } = gottenTeam

      const team = { 
        _id: teamId,
        name,
        coach,
        adminId
      }

      return team

    } catch(error) {
      throw error;
    }
  }

  //Both the admin and the authenticated user can view this team
  static async getTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      //check if the team already exist
      const gottenTeam = await Team.findOne({ _id: teamIdObj })
      if (!gottenTeam) {
        throw new Error('no record found');
      }

      const { name, coach } = gottenTeam

      const publicTeam = { 
        _id: teamId,
        name,
        coach,
      }

      return publicTeam

    } catch(error) {
      throw error;
    }
  }

  static async getTeams() {

    try {

      //check if the team already exist
      const gottenTeams = await Team.find({})
      if (!gottenTeams) {
        throw new Error('no record found');
      }
      let publicTeams = []

      gottenTeams.map(team => {
        const { name, coach } = team
        publicTeams.push({ _id: team._id.toHexString(), name, coach })
      })

      return publicTeams

    } catch(error) {
      throw error;
    }
  }

  static async updateTeam(team) {

    try {

      //Lets make sure that we dont have duplicate team name
      const record = await Team.findOne({ team: team.name })
      if (record) {
        throw new Error('record already exist');
      }

      const updatedTeam = await Team.findOneAndUpdate(
        { _id: team._id}, 
        { $set: team },
        { "new": true},
      );
      const { name, coach, adminId } = updatedTeam

      const publicTeam = { 
        _id: updatedTeam._id.toHexString(),
        name,
        coach,
        adminId
      }

      return publicTeam

    } catch(error) {
      if(error.message.includes("duplicate")){
        throw new Error("team name already exist")
      }
      throw error;
    }
  }

  static async deleteTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      //check if the team already exist
      const deletedTeam = await Team.deleteOne({ _id: teamIdObj })
      if (!deletedTeam) {
        throw new Error('no record found');
      }
      return deletedTeam

    } catch(error) {
      throw error;
    }
  }
}

export default TeamService