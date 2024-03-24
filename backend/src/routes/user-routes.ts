import express from 'express';
import { authenticatedRoute } from '../middlewares/AuthMiddleware';
import { deleteUser, enableDisableUsers, getUsers } from '../controllers/UserController';
const router = express.Router();


router.get('', authenticatedRoute,getUsers) //gets all users, to specified type of users
router.post('/setenabled/:userId', authenticatedRoute,enableDisableUsers) //sets the is_enabled property.
router.delete('/:userId', authenticatedRoute,deleteUser) //delete a user and his tasks.
export {router as userRoutes}