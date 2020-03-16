import Fixture from '../models/fixture'
import { ObjectID } from 'mongodb';


class FixtureService {

  constructor() {
    this.fixture = Fixture;
  }

   async createFixture(fixture) {

    try {

      const record = await this.fixture.findOne({
        $and: [
          { home: fixture.home }, { away: fixture.away }
        ]
      })
      if (record) {
        throw new Error('record already exist');
      }

      const createdFixture = await this.fixture.create(fixture);

      return createdFixture

    } catch(error) {
      throw error;
    }
  }

  //this is only used by the admin when he want to do things like update or delete
   async adminGetFixture(fixtureId) {

    try {

      let fixtureIdObj = new ObjectID(fixtureId)

      const gottenFixture = await this.fixture.findOne({ _id: fixtureIdObj })
      if (!gottenFixture) {
        throw new Error('no record found');
      }

      return gottenFixture

    } catch(error) {
      throw error;
    }
  }

  //This fixture can both be seen by the user and the admin
   async getFixture(fixtureId) {

    try {

      let fixtureIdObj = new ObjectID(fixtureId)

      const gottenFixture = await this.fixture.findOne({ _id: fixtureIdObj }, { admin: 0 })
                                          .select('-__v')
                                          .populate('home', '_id name')
                                          .populate('away', '_id name')
                                          .exec()
      if (!gottenFixture) {
        throw new Error('no record found');
      }
      return gottenFixture

    } catch(error) {
      throw error;
    }
  }

   async updateFixture(fixture) {

    try {

      const record = await this.fixture.findOne({
        $and: [
          { home: fixture.home }, { away: fixture.away }
        ]
      })

      //If the same record is passed to be updated for a particular given fixture id, allow it, else throw already exist error
      if (record && (record._id.toHexString() !== fixture._id.toHexString())) {
        throw new Error('record already exist');
      } 
      
      const updatedFixture = await this.fixture.findOneAndUpdate(
        { _id: fixture._id}, 
        { $set: fixture },
        { "new": true},
      );

      return updatedFixture

    } catch(error) {
      throw error;
    }
  }

   async getFixtures() {

    try {

      const gottenFixtures = await this.fixture.find()
                                                .select('-admin')
                                                .select('-__v')
                                                .populate('home', '_id name')
                                                .populate('away', '_id name')
                                                .sort('matchday')
                                                .exec()

      if (!gottenFixtures) {
        throw new Error('no record found');
      }
      return gottenFixtures

    } catch(error) {
      throw error;
    }
  }

   async deleteFixture(fixtureId) {

    try {

      const deleted = await this.fixture.deleteOne({ _id: fixtureId })
      if (!deleted) {
        throw new Error('no record found');
      }
      return deleted

    } catch(error) {
      throw error;
    }
  }
}

export default FixtureService