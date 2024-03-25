import express from 'express';
const router = express.Router();
import { authenticatedRoute } from '../middlewares/AuthMiddleware';
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
router.get('/me', authenticatedRoute, getMe)
router.put('/updatedetails', authenticatedRoute, updateDetails)
router.put('/updatepassword', authenticatedRoute, updatePassword)

router.post('/permissions', authenticatedRoute,createPermission) //creates permission
router.get('/permissions', authenticatedRoute, getAllPermissions) //get all permission
router.put('/permissions/:permissionId', authenticatedRoute, updatePermission) //update permission
router.delete('/permissions/:permissionId', authenticatedRoute,deletePermission) //delete a permission

router.post('/abilities', authenticatedRoute,createAbility) //creates permission
router.get('/abilities', authenticatedRoute, getAllAbilities) //get all permission
router.put('/abilities/:abilityId', authenticatedRoute, updateAbility) //update permission
router.delete('/abilities/:abilityId', authenticatedRoute,deleteAbility) //delete a permission

export {router as authRoutes}