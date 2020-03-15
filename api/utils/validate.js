import validator from  "email-validator"
import { ObjectID } from 'mongodb';

const validate = {

  registerValidate(req) {
    
    const { name, email, password } =  req.body

    const errors = []
  
    if(!name || typeof name !== 'string'){
      errors.push({'name': 'a valid name is required'})
    }
    if(!email || typeof email !== 'string' || !validator.validate(email)){
      errors.push({'email': 'a valid email is required'})
    }
    if(!password || typeof password !== 'string' || password.length < 5){
      errors.push({'password': 'a valid password with atleast 6 characters is required'})
    }
    return errors
  },

  loginValidate(req) {
    
    const { email, password } =  req.body

    const errors = []
  
    if(!email || typeof email !== 'string' || !validator.validate(email)){
      errors.push({'email': 'a valid email is required'})
    }
    if(!password || typeof password !== 'string' || password.length < 5){
      errors.push({'password': 'a valid password with atleast 6 characters is required'})
    }
    return errors
  },

  teamValidate(req) {
    
    const { name } =  req.body

    const errors = []
  
    if(!name || typeof name !== 'string'){
      errors.push({'name': 'a valid team name is required'})
    }

    return errors
  },


  fixtureValidate(req) {

    const { home, away, matchday, matchtime } = req.body

    const errors = []

    if(!home || typeof home !== 'string' || !ObjectID.isValid(home)){
      errors.push({'home': 'a valid home team is required'})
    }
    if(!away || typeof away !== 'string' || !ObjectID.isValid(away)){
      errors.push({'away': 'a valid away team is required'})
    }

    let day = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
    if(!day.test(matchday)){
      errors.push({'matchday': `matchday must be of the format: 'dd-mm-yyyy'`})
    }

    let date = new Date();
    let matchdate = matchday.split("-")[2] + "-" + matchday.split("-")[1] + "-" + matchday.split("-")[0] + ":" + matchtime
    let matchd = new Date(matchdate)
    if (matchd !== date && matchd < date ){
      errors.push({'matchday': `can't create a fixture in the past`})
    }

    let time = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/
    if(!time.test(matchtime)){
      errors.push({'matchtime': `matchtime must be of the format: '10:30 or 07:00'`})
    }

    if(home && away && (home === away)){
      errors.push({'duplicate': 'you can\'t create a fixture with the same team'})
    }
    return errors
  },


  teamSearchValidate(req){

    const { name } = req.query

    const errors = []

    if(name !== undefined && name.length < 3){
      errors.push({'name': 'a valid team name is required, atleastt 3 characters'})
    } 
    return errors
  },


  fixtureSearchValidate(req){

    const { home, away, matchday, matchtime } = req.query

    const errors = []

    if(home !== undefined && home.length < 3){
      errors.push({'home': 'a valid home team is required, atleastt 3 characters'})
    } 
    if(away !== undefined && away.length < 3){
      errors.push({'away': 'a valid away team is required, atleastt 3 characters'})
    } 
    if(matchday !== undefined){
      let day = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
      if(!day.test(matchday)){
      errors.push({'matchday': `matchday must be of the format: 'dd-mm-yyyy'`})
      } 
    } 
    if(matchtime !== undefined){
      let time = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/
      if(!time.test(matchtime)){
        errors.push({'matchtime': `matchtime must be of the format: '10:30 or 07:00'`})
      }
    }
    return errors
  }
}

export default validate