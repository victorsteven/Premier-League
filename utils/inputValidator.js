import validator from  "email-validator"



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

  getErrors() {
    return this.errors;
  }
}

export default Validator;
