import express from 'express';
import { authenticatedRoute } from '../middlewares/AuthMiddleware';
import { createUser, deleteUser, enableDisableUsers, getUsers, updateUser } from '../controllers/UserController';
import { registerValidationChain } from './auth-routes';
import { validateRequest } from '../utils/RequestUtilities';
const router = express.Router();


router.get('', authenticatedRoute,getUsers) //gets all users, to specified type of users
router.post('', authenticatedRoute,registerValidationChain, validateRequest,createUser) //create a user on behalf of people
router.post('/setenabled/:userId', authenticatedRoute,enableDisableUsers) //sets the is_enabled property.
router.delete('/:userId', authenticatedRoute,deleteUser) //delete a user and his tasks.
router.put('/:userId', authenticatedRoute,updateUser) //delete a user and his tasks.
export {router as userRoutes}