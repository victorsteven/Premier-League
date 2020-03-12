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

      const gottenTeam = await this.team.findOne({ _id: teamIdObj }, { admin: 0}).select('-__v')
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

      const gottenTeams = await this.team.find().select('-admin').select('-__v')
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

      const deletedTeam = await this.team.deleteOne({ _id: teamIdObj })
      if (!deletedTeam) {
        throw new Error('no record found');
      }
      return deletedTeam

    } catch(error) {
      throw error;
    }
  }

  async checkTeams(homeId, awayId) {
    try {

      let homeIdObj = new ObjectID(homeId)
      let awayIdObj = new ObjectID(awayId)

      const homeTeam = await this.team.findOne({ _id: homeIdObj }, { admin: 0}).select('-__v')
      if (!homeTeam) {
        throw new Error('home team not found');
      }
      const awayTeam = await this.team.findOne({ _id: awayIdObj }, { admin: 0}).select('-__v')
      if (!awayTeam) {
        throw new Error('away team not found');
      }

      let gottenTeams = {
                home: homeTeam,
                away: awayTeam
              }

      return  gottenTeams

    } catch(error) {
      throw error;
    }
  }
}

export default TeamService