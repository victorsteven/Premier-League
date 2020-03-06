import Fixture from '../models/fixture'
import { ObjectID } from 'mongodb';


class FixtureService {

  static async createFixture(fixture) {

    try {

      const record = await Fixture.findOne({homeId: fixture.homeId }, { awayId: fixture.awayId })

      if (record) {
        throw new Error('fixture already exist');
      }

      const createdFixture = await Fixture.create(fixture);

      const { homeId, awayId } = createdFixture

      const publicFixture = { 
        _id: createdFixture._id.toHexString(),
        homeId,
        awayId,
      }

      return publicFixture

    } catch(error) {
      throw error;
    }
  }

  // static async getTeam(teamId) {

  //   console.log("this is the id passed: ", teamId)

  //   try {

  //     let teamIdObj = new ObjectID(teamId)

  //     console.log("this is the object passed: ", teamIdObj)


  //     //check if the team already exist
  //     const gottenTeam = await Team.findOne({ _id: teamIdObj })
  //     if (!gottenTeam) {
  //       throw new Error('no record found');
  //     }
  //     console.log("this is the gotten team: ", gottenTeam)

  //     const { name, coach, adminId } = gottenTeam

  //     const publicTeam = { 
  //       _id: teamId,
  //       name,
  //       coach,
  //       adminId
  //     }

  //     return publicTeam

  //   } catch(error) {
  //     console.log("this is here", error.message)
  //     throw error;
  //   }
  // }

  // static async updateTeam(team) {

  //   try {

  //     const updatedTeam = await Team.findOneAndUpdate(
  //       { _id: team._id}, 
  //       { $set: team },
  //       { "new": true},
  //     );
  //     const { name, coach, adminId } = updatedTeam

  //     const publicTeam = { 
  //       _id: updatedTeam._id.toHexString(),
  //       name,
  //       coach,
  //       adminId
  //     }

  //     return publicTeam

  //   } catch(error) {
  //     throw error;
  //   }
  // }

  // static async deleteTeam(teamId) {

  //   try {

  //     let teamIdObj = new ObjectID(teamId)

  //     //check if the team already exist
  //     const deletedTeam = await Team.deleteOne({ _id: teamIdObj })
  //     if (!deletedTeam) {
  //       throw new Error('no record found');
  //     }
  //     return deletedTeam

  //   } catch(error) {
  //     throw error;
  //   }
  // }
}

export default FixtureService