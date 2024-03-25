import express from 'express';
const router = express.Router();
import { ValidationChain, body, validationResult } from 'express-validator';
import { authenticatedRoute, checkPermission } from '../middlewares/AuthMiddleware';
import { createPaint, deletePaint, getAllPaints, updatePaintColor, updateStockAll, updateStockAssigned } from '../controllers/PaintController';
import { validateRequest } from '../utils/RequestUtilities';
import mongoose from 'mongoose';


const isValidObjectId = (value: string) => {
    return mongoose.Types.ObjectId.isValid(value);
};

//using express validator
const paintCreation: ValidationChain[] = [
    body('color').notEmpty()
    .withMessage('You must supply a paint color'),
    body('quantity')
    .notEmpty()
    .withMessage('You must supply non zero quantity')
    .isNumeric().withMessage('Quantity must be a number')
    .custom((value, { req }) => {
        if (parseInt(value) <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        return true;
    })
]

const paintStockUpdateValidation: ValidationChain[] = [
    body('paintId').notEmpty()
    .withMessage('You must supply a paint id')
    .custom((value: string) => isValidObjectId(value))
    .withMessage('Paint id must be a valid MongoDB ObjectId'),

    body('newQuantity')
    .notEmpty()
    .withMessage('You must supply non zero quantity')
    .isNumeric().withMessage('Quantity must be a number')
    .custom((value, { req }) => {
        if (parseInt(value) <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        return true;
    })
]


router.post('', paintCreation, validateRequest, authenticatedRoute, checkPermission('allow_create_paint'), createPaint) //creates paint
router.get('', authenticatedRoute, checkPermission('allow_get_all_paints'), getAllPaints) //get all paints
router.post('/update-stock-all', authenticatedRoute,paintStockUpdateValidation, validateRequest, checkPermission('allow_update_stock_all'), updateStockAll) //update the stock of any paint
router.post('/update-stock-assigned', authenticatedRoute,paintStockUpdateValidation, validateRequest, checkPermission('allow_update_stock_assigned'), updateStockAssigned) //update the stock of paint of assigned color
router.put('/:paintId', authenticatedRoute, checkPermission('allow_update_paint_color'), updatePaintColor) //update a paint color
router.delete('/:paintId', authenticatedRoute,checkPermission('allow_delete_paint'), deletePaint) //delete a paint, also deletes the stock associated with the paint

export {router as paintRoutes}