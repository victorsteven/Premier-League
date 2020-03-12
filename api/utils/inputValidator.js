import validator from  "email-validator"
import { ObjectID } from 'mongodb';


class Validator {
  constructor() {
    this.errors = [];
    this.hasErrors = false;
  }

  validate(value, rules) {
    this.validateRules(value, rules);
  }

  validateRules(value, rules) {
    const self = this;
    for (const key in value) {
		 	if (value.hasOwnProperty(key)) {
		 		const rule = rules.split('|');

			 	for (let i = 0; i < rule.length; i++) {
			 	self[rule[i]](value[key], key);
        }
		 	}
    }
  }

  string(value, key) {
    if (typeof value !== 'string') {
      this.hasErrors = true;
      this.errors.push(`${key} must be a string`);
    }
  }

  required(value, key) {
    if (value === '' || value === null || typeof value === 'undefined') {
      this.hasErrors = true;
      this.errors.push(`${key} is required`);
    }
  }

  email(value, key) {
   if(key === 'email'){
      if (!validator.validate(value)){
        this.hasErrors = true;
        this.errors.push(`${key} is invalid`);
      }
    }
  }

  objectid(value, key){
    if (key == "home" || key === "away"){
      if(!ObjectID.isValid(value)){
        this.hasErrors = true;
        this.errors.push(`${key} id is invalid`);
      }
    }
  }


  matchday(value, key) {

    // let day = /^(0?[1-9]|[12][0-9]|3[01])[\-](0?[1-9]|1[012])[\-]\d{4}$/
    let day = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/

    if(key === 'matchday'){
      if (!day.test(value)){
        console.log(value)
        this.hasErrors = true;
        this.errors.push(`${key} must be of the format: "mm-dd-yyyy"`);
      }
    }
  }

   matchtime(value, key) {

    let time = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/

    if(key === 'matchtime'){
      if (!time.test(value)){
        this.hasErrors = true;
        this.errors.push(`${key} must be of the format: "10:30 or 07:00"`);
      }
    }
  }
 
  getErrors() {
    return this.errors;
  }
}

export default Validator;
