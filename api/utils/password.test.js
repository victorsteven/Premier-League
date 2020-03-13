import chai from 'chai'
import faker from 'faker'
import Password from './password'
import User from '../models/user'
import bcrypt from 'bcryptjs'
import sinon from 'sinon'


chai.use(require('chai-as-promised'))
const { expect } = chai


describe('Password', () => {

  describe('hashPassword', () => {

    it('should hash a password', () => {

      let password = "password"

      //hashing a password can take a lot of time, so we will mock the methods:
      const salt = sinon.stub(bcrypt, 'genSaltSync').returns("dkhfksdjf");
      const hash = sinon.stub(bcrypt, 'hashSync').returns("sjdfkjshdfkjsdfjskjdfsdfsdfsdf");

      const pass = new Password();

      let hashed = pass.hashPassword(password)

      expect(salt.calledOnce).to.be.true;
      expect(hash.calledOnce).to.be.true;
      expect(hashed).to.not.be.null
      expect(hashed.length).to.be.greaterThan(0)

    });
  });

  describe('validPassword', () => {

    it('should verify a password with hash', () => {

      let password = "password"
      let hashed = "skjndfjksndfjnsdjkfnskjdnfjsndf"

      //faking the verification
      const verify = sinon.stub(bcrypt, 'compareSync').returns(true);

      const pass = new Password();

      let correct = pass.validPassword(password, hashed)

      expect(verify.calledOnce).to.be.true;
      expect(correct).to.be.true
    });
  });
});
