import { Router } from 'express'
import UserController from '../controllers/user.controller'
import AdminController from '../controllers/admin.controller'
import LoginController from '../controllers/login.controller'
import TeamController from '../controllers/team.controller';
import FixtureController from '../controllers/fixture.controller';
import { auth, adminAuth } from '../middlewares/middlewares'


const router = Router();

//User routes
router.post('/users', UserController.createUser)

//Admin routes
router.post('/admin', AdminController.createAdmin)

//auth
router.post('/login', LoginController.login)

//teams
router.post('/teams', adminAuth, TeamController.createTeam)
router.put('/teams/:id', adminAuth, TeamController.updateTeam)
router.delete('/teams/:id', adminAuth, TeamController.deleteTeam)
router.get('/teams/:id', auth, TeamController.getTeam)
router.get('/teams', auth, TeamController.getTeams)


//fixtures
router.post('/fixtures', adminAuth, FixtureController.createFixture)
router.put('/fixtures/:id', adminAuth, FixtureController.updateFixture)
router.delete('/fixtures/:id', adminAuth, FixtureController.deleteFixture)
router.get('/fixtures/:id', auth, FixtureController.getFixture)
router.get('/fixtures', auth, FixtureController.getFixtures)


export default router