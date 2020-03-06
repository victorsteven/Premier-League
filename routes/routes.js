import { Router } from 'express'
import UserController from '../controllers/user.controller'
import AdminController from '../controllers/admin.controller'
import LoginController from '../controllers/login.controller'
import TeamController from '../controllers/team.controller';
import FixtureController from '../controllers/fixture.controller';


const router = Router();

//User routes
router.post('/users', UserController.createUser)

//Admin routes
router.post('/admin', AdminController.createAdmin)

//auth
router.post('/login', LoginController.login)

//team
router.post('/teams', TeamController.createTeam)
router.put('/teams/:id', TeamController.updateTeam)
router.delete('/teams/:id', TeamController.deleteTeam)
router.get('/teams/:id', TeamController.getTeam)
router.get('/teams', TeamController.getTeams)


//fixtures
router.post('/fixtures', FixtureController.createFixture)
router.put('/fixtures/:id', FixtureController.updateFixture)


export default router