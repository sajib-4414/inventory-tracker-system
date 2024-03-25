import express from 'express';
const router = express.Router();
import { authenticatedRoute, checkPermission } from '../middlewares/AuthMiddleware';
import { getMe, login, logout, register, updateDetails, updatePassword } from '../controllers/AuthController';
import { ValidationChain, body, validationResult } from 'express-validator';
import {  validateRequest } from '../utils/RequestUtilities';
import { createPermission, deletePermission, getAllPermissions, updatePermission } from '../controllers/PermissionController';
import { createAbility, deleteAbility, getAllAbilities, updateAbility } from '../controllers/AbilityController';


//using express validator
const loginValidationChain: ValidationChain[] = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
]

export const registerValidationChain: ValidationChain[] = [
    body('name').notEmpty().withMessage('You must supply a name'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('type').notEmpty().withMessage('You must supply type'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
]

router.post('/register', registerValidationChain, validateRequest, register)
router.post('/login', loginValidationChain, validateRequest, login)
router.get('/logout', logout)
router.get('/me', authenticatedRoute, checkPermission('allow_get_me'), getMe)
router.put('/updatedetails', authenticatedRoute, checkPermission('allow_update_details'), updateDetails)
router.put('/updatepassword', authenticatedRoute, checkPermission('allow_update_password'),updatePassword)

router.post('/permissions', authenticatedRoute ,checkPermission('allow_user_management_and_ability_management'),createPermission) //creates permission
router.get('/permissions', authenticatedRoute ,checkPermission('allow_user_management_and_ability_management'), getAllPermissions) //get all permission
router.put('/permissions/:permissionId', authenticatedRoute ,checkPermission('allow_user_management_and_ability_management'), updatePermission) //update permission
router.delete('/permissions/:permissionId', authenticatedRoute ,checkPermission('allow_user_management_and_ability_management'),deletePermission) //delete a permission

router.post('/abilities', authenticatedRoute,checkPermission('allow_user_management_and_ability_management'),createAbility) //creates permission
router.get('/abilities', authenticatedRoute ,checkPermission('allow_user_management_and_ability_management'), getAllAbilities) //get all permission
router.put('/abilities/:abilityId', authenticatedRoute ,checkPermission('allow_user_management_and_ability_management'), updateAbility) //update permission
router.delete('/abilities/:abilityId', authenticatedRoute ,checkPermission('allow_user_management_and_ability_management'),deleteAbility) //delete a permission

export {router as authRoutes}