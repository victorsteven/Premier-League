import User from '../models/user'
import Team from '../models/team'
import Fixture from '../models/fixture'

import { ObjectID } from 'mongodb'


export async function seedAdmin () {
  let admin = {
    name: 'steven',
    email: 'steven@example.com',
    password: 'password',
    role: 'admin'
  }
  const seededAdmin = await User.create(admin)

  return seededAdmin
}

export async function seedUser () {
  let user = {
    name: 'ken',
    email: 'ken@example.com',
    password: 'password',
    role: 'user'
  }
  const seededUser = await User.create(user)

  return seededUser
}

export async function seedTeams () {
  let teams = [
    {
      name: 'Watford',
      admin: new ObjectID('5e6b13809f86ce60e92ff11c')
    },
    {
      name: 'Everton',
      admin: new ObjectID('5e6b13809f86ce60e92ff11c')
    },
  ]
  const seededTeams = await Team.insertMany(teams)

  return seededTeams
}

export async function seedFixtures () {
  let fixtures = [
    {
      home: new ObjectID('5e642cfff0833bc1c47429d6'),
      away: new ObjectID('5e69758b274e95a16159c2bc'),
      admin: new ObjectID('5e6b13809f86ce60e92ff11c'),
      matchday: '20-10-2050',
      matchtime: '10:30'
    },
    {
      home: new ObjectID('5e6b1037a5f14e5f1ca9ec35'),
      away: new ObjectID('5e63b73697d8054fe455f769'),
      admin: new ObjectID('5e6b13809f86ce60e92ff11c'),
      matchday: '25-06-2050',
      matchtime: '07:30'
    },
  ]
  const seededFixtures = await Fixture.insertMany(fixtures)

  return seededFixtures
}


export async function seedTeamsAndFixtures () {

  const home1 = {
    name: 'Liverpool',
    admin: new ObjectID('5e6b13809f86ce60e92ff11c')
  }
  const seededHome1 = await Team.create(home1)

  const away1 = {
    name: 'Arsenal',
    admin: new ObjectID('5e6b13809f86ce60e92ff11c')
  }
  const seededAway1 = await Team.create(away1)

  const home2 = {
    name: 'West Ham',
    admin: new ObjectID('5e6b13809f86ce60e92ff11c')
  }
  const seededHome2 = await Team.create(home2)

  const away2 = {
    name: 'Manchester City',
    admin: new ObjectID('5e6b13809f86ce60e92ff11c')
  }
  const seededAway2 = await Team.create(away2)


  if(seededHome1 && seededAway1 && seededHome2 && seededAway2) {

    let fixtures = [{
        home: seededHome1._id,
        away: seededAway1._id,
        admin: new ObjectID('5e6b13809f86ce60e92ff11c'),
        matchday: '20-10-2050',
        matchtime: '10:30'
      },{
        home: seededHome2._id,
        away: seededAway2._id,
        admin: new ObjectID('5e6b13809f86ce60e92ff11c'),
        matchday: '25-06-2050',
        matchtime: '07:30'
      },
    ]

    const seededTeamFixtures = await Fixture.insertMany(fixtures)

    if(seededTeamFixtures) {

      const gottenFixtures = await Fixture.find()
                                                .select('-admin')
                                                .select('-__v')
                                                .populate('home', '_id name')
                                                .populate('away', '_id name')
                                                .exec()


      if(gottenFixtures) {

        return gottenFixtures
      }
    }
  }
}
