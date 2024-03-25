import express from 'express';
import { authenticatedRoute, checkPermission } from '../middlewares/AuthMiddleware';
import { createUser, deleteUser, enableDisableUsers, getUsers, updateUser } from '../controllers/UserController';
import { registerValidationChain } from './auth-routes';
import { validateRequest } from '../utils/RequestUtilities';
const router = express.Router();


router.get('', authenticatedRoute, checkPermission('allow_user_management_and_ability_management'), getUsers) //gets all users, to specified type of users
router.post('', authenticatedRoute,registerValidationChain, validateRequest,checkPermission('allow_user_management_and_ability_management'), createUser) //create a user on behalf of people
router.post('/setenabled/:userId', authenticatedRoute,checkPermission('allow_user_management_and_ability_management'), enableDisableUsers) //sets the is_enabled property.
router.delete('/:userId', authenticatedRoute,checkPermission('allow_user_management_and_ability_management'), deleteUser) //delete a user and his tasks.
router.put('/:userId', authenticatedRoute,checkPermission('allow_user_management_and_ability_management'),updateUser) //delete a user and his tasks.
export {router as userRoutes}