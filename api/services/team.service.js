import Team from '../models/team'
import { ObjectID } from 'mongodb';


class TeamService {
  constructor() {
    this.team = Team
  }

  async createTeam(team) {

    try {

      //check if the team already exist
      const record = await this.team.findOne({ name: team.name })
      if (record) {
        throw new Error('record already exist');
      } 

      const createdTeam = await this.team.create(team);

      return createdTeam

    } catch(error) {
      throw error;
    }
  }


  //we will need to confirm if the admin to update or delete a team or fixture exist
   async adminGetTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      const gottenTeam = await this.team.findOne({ _id: teamIdObj })
      if (!gottenTeam) {
        throw new Error('no record found');
      }
      return gottenTeam

    } catch(error) {
      throw error;
    }
  }

  //Both the admin and the authenticated user can view this team
   async getTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      const gottenTeam = await this.team.findOne({ _id: teamIdObj }, { admin: 0}).select('-__v').exec()
      if (!gottenTeam) {
        throw new Error('no record found');
      }
      return gottenTeam

    } catch(error) {
      throw error;
    }
  }

   async getTeams() {

    try {

      const gottenTeams = await this.team.find().select('-admin').select('-__v').exec()
      if (!gottenTeams) {
        throw new Error('no record found');
      }
      return gottenTeams

    } catch(error) {
      throw error;
    }
  }

   async updateTeam(team) {

    try {

      //Lets make sure that we dont have duplicate team name
      const record = await this.team.findOne({ team: team.name })
      if (record) {
        throw new Error('record already exist');
      }

      const updatedTeam = await this.team.findOneAndUpdate(
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

   async deleteTeam(teamId) {

    try {

      let teamIdObj = new ObjectID(teamId)

      const deleted = await this.team.deleteOne({ _id: teamIdObj })
      if (!deleted) {
        throw new Error('no record found');
      }
      return deleted

    } catch(error) {
      throw error;
    }
  }

  //use to confirm if the teams exist before a fixture can be created
  async checkTeams(homeId, awayId) {

    try {

      const ids = [
        new ObjectID(homeId),
        new ObjectID(awayId)
      ];

      let records = await this.team.find().where('_id').in(ids).exec();

      if(records.length !== 2) { //the record must be two
        throw new Error('make sure that both teams exist');
      }

      return records

    } catch(error) {
      throw error;
    }
  }
}

export default TeamService