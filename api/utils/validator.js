import { body, param, validationResult } from 'express-validator'
import { ObjectID } from 'mongodb';


export const rules = (method) => {

  switch (method) {

    case 'createAdmin':
    case 'createUser': {
      return [
        body('firstname', 'a valid firstname is required').isString().notEmpty(),
        body('lastname', 'a valid lastname is required').isString().notEmpty(),
        body('email', 'a valid email is required').isEmail(),
        body('password').notEmpty().withMessage("password is required").isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
      ]
    }
    case 'login': {
      return [
        body('email', 'a valid email is required').isEmail(),
        body('password', 'password should atleast be 6 characters').notEmpty().isLength({ min: 6 }),
      ]
    }
    case 'createTeam': 
    case 'updateTeam': {
      return [
        body('name', 'a valid team name is required').isString().notEmpty(),
      ]
    }
    case 'createFixture': 
    case 'updateFixture': {
      return [
        body('home', 'a valid home team is required').isString().notEmpty(),
        body('away', 'a valid away team is required').isString().notEmpty(),
        body('matchday', 'a valid matchday is required').isString().notEmpty(),
        body('home', 'a valid matchtime is required').isString().notEmpty(),
      ]
    }
    case 'getTeam': 
    case 'getFixture':
    case 'deleteTeam':
    case 'deleteFixture': {
      return [
        param('id').custom(value => {
          if (!ObjectID.isValid(value)) {
            throw new Error('a valid fixture id is required')
          } 
          return true
        }),
      ]
    }
  }
}


export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(400).json({
    status: 400,
    errors: extractedErrors,
  })
}
