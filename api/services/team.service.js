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

      return createdTeam

    } catch(error) {
      throw error;
    }
  }


  //we will need to confirm if the admin to update or delete a team or fixture exist
  static async adminGetTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      const gottenTeam = await Team.findOne({ _id: teamIdObj })
      if (!gottenTeam) {
        throw new Error('no record found');
      }
      return gottenTeam

    } catch(error) {
      throw error;
    }
  }

  //Both the admin and the authenticated user can view this team
  static async getTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      const gottenTeam = await Team.findOne({ _id: teamIdObj }, { admin: 0}).select('-__v')
      if (!gottenTeam) {
        throw new Error('no record found');
      }
      return gottenTeam

    } catch(error) {
      throw error;
    }
  }

  static async getTeams() {

    try {

      const gottenTeams = await Team.find().select('-admin').select('-__v')
      if (!gottenTeams) {
        throw new Error('no record found');
      }
      return gottenTeams

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

      return updatedTeam

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