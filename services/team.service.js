import Team from '../models/team'


class TeamService {

  static async createTeam(team) {

    try {

      //check if the team already exist
      const record = await Team.findOne({ team: team.name })
      if (record) {
        throw new Error('record already exist');
      }

      const createdTeam = await Team.create(team);

      return createdTeam

    } catch(error) {
      throw error;
    }
  }
}

export default TeamService