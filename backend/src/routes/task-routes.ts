import express from 'express';
const router = express.Router();
import { ValidationChain, body, validationResult } from 'express-validator';
import { authenticatedRoute, checkPermission } from '../middlewares/AuthMiddleware';
import { validateRequest } from '../utils/RequestUtilities';
import mongoose from 'mongoose';
import { createTask, deleteTask, getAllTasks, getMyTasks, updateAssignedTaskStatus, updateTaskAny } from '../controllers/TaskController';
import { TaskStatus } from '../models/Task';


const isValidObjectId = (value: string) => {
    return mongoose.Types.ObjectId.isValid(value);
};

//using express validator
const taskCreationValidation: ValidationChain[] = [
    body('houseAddress').notEmpty()
    .withMessage('You must supply a houseAddress'),
    body('title').notEmpty()
    .withMessage('You must supply a title'),
    body('paintColor').notEmpty()
    .withMessage('You must supply a paintColor'),
    body('userId')
    .notEmpty()
    .withMessage('You must userId')
    .custom((value: string) => isValidObjectId(value))
    .withMessage('user id must be a valid MongoDB ObjectId'),
]

const taskUpdateValidation: ValidationChain[] = [
    body('taskId').notEmpty().withMessage('Task ID is required'),
    body('taskId').custom((value: string) => isValidObjectId(value)).withMessage('Task ID must be a valid MongoDB ObjectId'),
    body('houseAddress').optional().isString().withMessage('House address must be a string'),
    body('paintColor').optional().isString().withMessage('Paint color must be a string'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('status').optional().isString().withMessage('status must be a string'),
];

const taskStatusUpdateValidation: ValidationChain[] = [
    body('taskId').notEmpty().withMessage('Task ID is required'),
    body('taskId').custom((value: string) => isValidObjectId(value)).withMessage('Task ID must be a valid MongoDB ObjectId'),
    body('status').notEmpty().withMessage('Status is required'),
    body('status').isIn(Object.values(TaskStatus)).withMessage('Status must be one of ' + Object.values(TaskStatus).join(', ')),
];


router.post('', taskCreationValidation, validateRequest, authenticatedRoute,checkPermission('allow_create_task'),createTask) //creates task
router.get('', authenticatedRoute, checkPermission('allow_get_all_tasks'), getAllTasks) //get all tasks
router.get('/mytasks', authenticatedRoute, checkPermission('allow_get_my_tasks'), getMyTasks) //get my tasks
router.put('/updateanytask', authenticatedRoute,taskUpdateValidation, validateRequest, checkPermission('allow_update_any_task'), updateTaskAny) //update the task
router.put('/updatemytask', authenticatedRoute, taskStatusUpdateValidation, validateRequest, checkPermission('allow_update_my_task_status'), updateAssignedTaskStatus) //update the assigned task,only status
router.delete('/:taskId', authenticatedRoute,checkPermission('allow_delete_task'),deleteTask) //delete a task

export {router as taskRoutes}