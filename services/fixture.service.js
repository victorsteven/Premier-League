import Team from '../models/team'
import { ObjectID } from 'mongodb';


class TeamService {

  static async createTeam(team) {

    try {

      //check if the team already exist
      const record = await Team.findOne({ team: team.name })
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

  static async getTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      //check if the team already exist
      const gottenTeam = await Team.findOne({ _id: teamIdObj })
      if (!gottenTeam) {
        throw new Error('no record found');
      }

      const { name, coach, adminId } = gottenTeam

      const publicTeam = { 
        _id: teamId,
        name,
        coach,
        adminId
      }

      return publicTeam

    } catch(error) {
      throw error;
    }
  }

  static async updateTeam(team) {

    try {

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