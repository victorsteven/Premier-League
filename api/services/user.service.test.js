import chai from 'chai'
import sinon from 'sinon'
import UserService from './user.service'

const expect = chai.expect;

// describe("UserService", function() {
//   describe("createUser", function() {
//     it("should create a user", function() {

//       sinon.spy(UserService, 'createUser')
//       UserService.createUser({ 'firstname': 'mike', 'lastname': 'magu', 'email': 'magu@gmail.com', 'password': 'password'})

//       console.log(UserService.createUser)
//       expect(UserService.createUser.calledOnce).to.be.true

//     });
//   });
// });