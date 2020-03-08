import Fixture from '../models/fixture'
import { ObjectID } from 'mongodb';


class FixtureService {

  static async createFixture(fixture) {

    try {

      const record = await Fixture.findOne({
        $and: [
          { home: fixture.home }, { away: fixture.away }
        ]
      })
      if (record) {
        throw new Error('fixture already exist');
      }

      const createdFixture = await Fixture.create(fixture);

      return createdFixture

    } catch(error) {
      throw error;
    }
  }

  //this is only used by the admin when he want to do things like update or delete
  static async adminGetFixture(fixtureId) {

    try {

      let fixtureIdObj = new ObjectID(fixtureId)

      const gottenFixture = await Fixture.findOne({ _id: fixtureIdObj })
      if (!gottenFixture) {
        throw new Error('no record found');
      }

      return gottenFixture

    } catch(error) {
      throw error;
    }
  }

  //This fixture can both be seen by the user and the admin
  static async getFixture(fixtureId) {

    try {

      let fixtureIdObj = new ObjectID(fixtureId)

      const gottenFixture = await Fixture.findOne({ _id: fixtureIdObj }, { admin: 0 })
                                          .select('-__v')
                                          .populate('home', '_id name')
                                          .populate('away', '_id name')
      if (!gottenFixture) {
        throw new Error('no record found');
      }
      return gottenFixture

    } catch(error) {
      throw error;
    }
  }

  static async updateFixture(fixture) {

    try {

      const record = await Fixture.findOne({
        $and: [
          { home: fixture.home }, { away: fixture.away }
        ]
      })
      //If the same record is passed to be updated for a particular given fixture id, allow it, else throw already exist error
      if (record && record._id.toHexString() !== fixture._id.toHexString()) {
        throw new Error('fixture already exist');
      } 
      const updatedFixture = await Fixture.findOneAndUpdate(
        { _id: fixture._id}, 
        { $set: fixture },
        { "new": true},
      );

      return updatedFixture

    } catch(error) {
      throw error;
    }
  }

  static async getFixtures() {

    try {

      const gottenFixtures = await Fixture.find()
                                          .select('-admin')
                                          .select('-__v')
                                          .populate('home', '_id name')
                                          .populate('away', '_id name')

      if (!gottenFixtures) {
        throw new Error('no record found');
      }
      return gottenFixtures

    } catch(error) {
      throw error;
    }
  }

  static async deleteFixture(fixtureId) {

    try {

      const deletedFixture = await Fixture.deleteOne({ _id: fixtureId })
      if (!deletedFixture) {
        throw new Error('no record found');
      }
      return deletedFixture

    } catch(error) {
      throw error;
    }
  }
}

export default FixtureService