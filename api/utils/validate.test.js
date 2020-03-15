import chai from 'chai'
import validate from './validate'

const { expect } = chai

describe('Validation', () => {

  describe('registerValidate', () => {

    it('invalid register inputs', () => {

      const req = {
         //the name,email and password are invalid
        body: { name: 123, email: "mail.com", password: "sdf" }
      };

      const errorsResponse =  [ 
        { name: 'a valid name is required' },
        {email: 'a valid email is required'},
        { password: 'a valid password with atleast 6 characters is required' } 
      ]

      let errors = validate.registerValidate(req)

      expect(errors.length).to.be.greaterThan(0)
      expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays
    });

    it('valid register inputs', () => {

      const req = {
        body: { name: "steven", email: "steven@example.com", password: "password" }
      };

      let errors = validate.registerValidate(req)

      expect(errors.length).to.equal(0)
      
    });
  });


  describe('loginValidate', () => {

    it('invalid login inputs', () => {

      const req = {
         //The email and password are invalid
        body: { email: "mail.com", password: "sdf" }
      };

      const errorsResponse =  [ 
        {email: 'a valid email is required'},
        { password: 'a valid password with atleast 6 characters is required' } 
      ]

      let errors = validate.loginValidate(req)

      expect(errors.length).to.be.greaterThan(0)
      expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays
    });

    it('valid login inputs', () => {

      const req = {
        body: { email: "steven@example.com", password: "password" }
      };

      let errors = validate.loginValidate(req)

      expect(errors.length).to.equal(0)
      
    });
  });


  describe('teamValidate', () => {

    it('invalid team name', () => {

      const req = {
         //The team name is invalid
        body: { name: 123 }
      };

      const errorsResponse =  [ 
        { name: 'a valid team name is required' }
      ]

      let errors = validate.teamValidate(req)

      expect(errors.length).to.be.greaterThan(0)
      expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays
    });

    it('valid team name', () => {

      const req = {
        body: { name: "Everton" }
      };

      let errors = validate.teamValidate(req)

      expect(errors.length).to.equal(0)
      
    });
  });


  describe('fixtureValidate', () => {

    it('invalid inputs for fixtures', () => {

      const req = {
        //The home, away are invalid. The matchday and the time is formated wrongly
       body: { home: "dsfkjnsfjnsdkjnfkjsdnfj", away: "kjsdnfkjsdkjfdsjkhfjsfdf", matchday: "12-14-2050", matchtime:"3:pm" }
     };

      const errorsResponse =  [ 
        {"home": "a valid home team is required"},
        {"away": "a valid away team is required"},
        {"matchday": "matchday must be of the format: 'dd-mm-yyyy'"}, //the month is more than 12
        {"matchtime": "matchtime must be of the format: '10:30 or 07:00'"},
      ]

     let errors = validate.fixtureValidate(req)

     expect(errors.length).to.be.greaterThan(0)
     expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays we use stringify
    });

    it('cannot create a fixture with past date', () => {

      const req = {
        //The matchday is in the past
       body: { home: "5e69758b274e95a16159c2bc", away: "5e6974996e72a1a0793956ed", matchday: "02-12-1998", matchtime:"15:00" }
     };

      const errorsResponse =  [ 
        {"matchday": "can't create a fixture in the past"},
      ]

     let errors = validate.fixtureValidate(req)

     expect(errors.length).to.be.greaterThan(0)
     expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays we use stringify
    });

    it('cannot create a fixture with the same home and away ids', () => {

      const req = {
        //the home, away are the same. A fixture is not possible
       body: { home: "5e69758b274e95a16159c2bc", away: "5e69758b274e95a16159c2bc", matchday: "02-12-2050", matchtime:"15:00" }
     };

      const errorsResponse =  [ 
        {"duplicate": "you can't create a fixture with the same team"},
      ]

     let errors = validate.fixtureValidate(req)

     expect(errors.length).to.be.greaterThan(0)
     expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays we use stringify
    });
  });



  describe('teamSearchValidate', () => {

    it('invalid team name', () => {

      const req = {
         //The team name is invalid
        query: { name: "" }
      };

      const errorsResponse =  [ 
        { name: 'a valid team name is required, atleast 3 characters' }
      ]

      let errors = validate.teamSearchValidate(req)

      expect(errors.length).to.be.greaterThan(0)
      expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays
    });

    it('valid team name', () => {

      const req = {
        query: { name: "Che" }
      };

      let errors = validate.teamSearchValidate(req)

      expect(errors.length).to.equal(0)
      
    });
  });


  describe('fixtureSearchValidate', () => {

    it('invalid inputs for fixtures', () => {

      const req = {
        //The home, away are invalid. The matchday and the time is formated wrongly
       query: { home: "", away: "ks", matchday: "12-14-2050", matchtime:"3:pm" }
     };

      const errorsResponse =  [ 
        {"home": "a valid home team is required, atleast 3 characters"},
        {"away": "a valid away team is required, atleast 3 characters"},
        {"matchday": "matchday must be of the format: 'dd-mm-yyyy'"}, //the month is more than 12
        {"matchtime": "matchtime must be of the format: '10:30 or 07:00'"},
      ]

     let errors = validate.fixtureSearchValidate(req)

     expect(errors.length).to.be.greaterThan(0)
     expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays we use stringify
    });

    it('cannot search a fixture with past date', () => {

      const req = {
        //The matchday is in the past
       query: { matchday: "02-12-1998" }
     };

      const errorsResponse =  [ 
        {"matchday": "can't search a fixture in the past"},
      ]

     let errors = validate.fixtureSearchValidate(req)

     expect(errors.length).to.be.greaterThan(0)
     expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays we use stringify
    });

    it('cannot search a fixture with invalid matchtime', () => {

      const req = {
       query: { matchtime: "3:00pm" } //invalid matchtime
     };

      const errorsResponse =  [ 
        {"matchtime": "matchtime must be of the format: '10:30 or 07:00'"},
      ]

     let errors = validate.fixtureSearchValidate(req)

     expect(errors.length).to.be.greaterThan(0)
     expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays we use stringify
    });

    it('cannot search a fixture with the same home and away name', () => {

      const req = {
        //the home, away are the same.
       query: { home: "Chelsea", away: "Chelsea" }
     };

      const errorsResponse =  [ 
        {"duplicate": "you can't search a fixture with the same team"},
      ]

     let errors = validate.fixtureSearchValidate(req)

     expect(errors.length).to.be.greaterThan(0)
     expect(JSON.stringify(errors)).to.equal(JSON.stringify(errorsResponse)) //since we are comparing the values of two arrays we use stringify
    });
  });
});
