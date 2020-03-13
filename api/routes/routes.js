import { Router } from 'express'
import UserController from '../controllers/user.controller'
import AdminController from '../controllers/admin.controller'
import LoginController from '../controllers/login.controller'
import TeamController from '../controllers/team.controller';
import FixtureController from '../controllers/fixture.controller';
import UserService from '../services/user.service'
import LoginService from '../services/login.service'
import AdminService from '../services/admin.service'
import TeamService from '../services/team.service'
import FixtureService from '../services/fixture.service'
import Password from '../utils/password'
import { auth, adminAuth } from '../middlewares/middlewares'


const pass = new Password()
const userService = new UserService(pass)
const adminService = new AdminService(pass)
const loginService = new LoginService(pass)
const teamService = new TeamService()
const fixtureService = new FixtureService()


const userController = new UserController(userService)
const adminController = new AdminController(adminService)
const loginController = new LoginController(loginService)
const teamController = new TeamController(userService, adminService, teamService, fixtureService)
const fixtureController = new FixtureController(userService, adminService, teamService, fixtureService)


const router = Router();

//User routes
router.post('/users', (req, res) => userController.createUser(req, res))

//Admin routes
router.post('/admin',  (req, res) => adminController.createAdmin(req, res))

//auth
router.post('/login', (req, res) => loginController.login(req, res))

//teams
router.post('/teams', adminAuth, (req, res) => teamController.createTeam(req, res))
router.put('/teams/:id', adminAuth, (req, res) => teamController.updateTeam(req, res))
router.delete('/teams/:id', adminAuth, (req, res) => teamController.deleteTeam(req, res))
router.get('/teams/:id', auth, (req, res) => teamController.getTeam(req, res))
router.get('/teams', auth, (req, res) => teamController.getTeams(req, res))

//fixtures
router.post('/fixtures', adminAuth, (req, res) => fixtureController.createFixture(req, res))
router.put('/fixtures/:id', adminAuth, (req, res) => fixtureController.updateFixture(req, res))
router.delete('/fixtures/:id', adminAuth, (req, res) => fixtureController.deleteFixture(req, res))
router.get('/fixtures/:id', auth, (req, res) => fixtureController.getFixture(req, res))
router.get('/fixtures', auth, (req, res) => fixtureController.getFixtures(req, res))


export default router