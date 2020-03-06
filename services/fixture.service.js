import Fixture from '../models/fixture'
import { ObjectID } from 'mongodb';


class FixtureService {

  static async createFixture(fixture) {

    try {

      const record = await Fixture.findOne({
        $and: [
          { homeId: fixture.homeId }, { awayId: fixture.awayId }
        ]
      })
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

  //this is only used by the admin when he want to do things like update or delete
  static async adminGetFixture(fixtureId) {

    try {

      let fixtureIdObj = new ObjectID(fixtureId)

      //check if the fixture already exist
      const gottenFixture = await Fixture.findOne({ _id: fixtureIdObj })
      if (!gottenFixture) {
        throw new Error('no record found');
      }

      const { homeId, awayId, adminId } = gottenFixture

      const fixture = { 
        _id: fixtureId,
        homeId,
        awayId,
        adminId
      }

      return fixture

    } catch(error) {
      throw error;
    }
  }

  static async updateFixture(fixture) {

    try {

      const record = await Fixture.findOne({
        $and: [
          { homeId: fixture.homeId }, { awayId: fixture.awayId }
        ]
      })

      //If the same record is passed to be updated for a particular given fixture id, allow it, else throw already exist error
      if (record._id.toHexString() !== fixture._id) {
        throw new Error('fixture already exist');
      }

      const updatedFixture = await Fixture.findOneAndUpdate(
        { _id: fixture._id}, 
        { $set: fixture },
        { "new": true},
      );

      const { homeId, awayId } = updatedFixture

      const publicFixture = { 
        _id: updatedFixture._id.toHexString(),
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