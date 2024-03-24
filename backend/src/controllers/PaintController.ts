import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain } from 'express-validator';
import { Paint, PaintDoc } from '../models/Paint';
import { BadRequestError, NotFoundError, UnhandledError } from '../utils/RequestUtilities';
import { Stock } from '../models/Stock';
import { Task } from '../models/Task';

//creating a new paint
const createPaint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { color, quantity } = req.body;
        
        // creating a new paint
        const paint = new Paint({ color });

        //create a stock for the paint
        const stock = new Stock({
            quantity,
            paintColor: color,
            paint: paint._id 
        });
        await stock.save();

        // Save the paint to the database
        await paint.save();

        res.status(201).json({ success: true, data: paint });
    } catch (error) {
        next(error);
    }
};


//getting paint listing
const getAllPaints = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all paints from the database
        const paints = await Paint.find().populate('quantity');

        res.status(200).json({ success: true, data: paints });
    } catch (error) {
        next(error);
    }
};


// to update a paint color
const updatePaintColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paintId } = req.params;
        const { newColor } = req.body; 

        // find paint by id
        let paint = await Paint.findById(paintId);

        if (!paint) {
            throw new NotFoundError(`Paint ${paintId} not found`)
        }

        // updating the color
        paint.color = newColor;
        
        // Saving the updated paint
        paint = await paint.save();

        res.status(200).json({ success: true, data: paint });
    } catch (error) {
        next(error);
    }
};

// delete a paint and associated stock
const deletePaint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { paintId } = req.params;

        // Finding the paint by ID
        const paint:PaintDoc|null = await Paint.findById(paintId);

        if (!paint) {
            throw new NotFoundError(`Paint ${paintId} not found`)
        }

        // Delete associated stock entries
        await Stock.deleteMany({ paint: paintId });

        // Deleting the paint
        await paint.deleteOne();

        res.status(200).json({ success: true, message: 'Paint deleted successfully' });
    } catch (error) {
        next(error);
    }
};


//  to update the stock of any paint, managers, and higher officials have this permission
const updateStockAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { paintId, newQuantity } = req.body;
    const stocks = await Stock.find({ paint: paintId });
    if (!stocks || stocks.length === 0) {
        throw new BadRequestError('No stock found for the given paint ID')
    }

    //updating all stock entries in a single promise, such that failing to update
    //any stock results in error to throw
    //it also covers the scenario if in future we have multiple stock object for a single paint.
    await Promise.all(stocks.map(async (stock) => {
        stock.quantity = newQuantity;
        await stock.save();
    }));
    const paint:PaintDoc|null = await Paint.findById(paintId).populate('quantity');
    res.status(200).json({ success: true, message: 'Stock quantity of paint successfully',data:paint });
    } 
    catch (error) {
        next(error);
    }

};

// update the stock of assigned paint color only
const updateStockAssigned = async (req: any, res: Response, next: NextFunction) => {
    
        const user  = req.user
        const { paintId, newQuantity } = req.body;

        // Check if the user has any tasks assigned
        const tasks = await Task.find({ 'user': user._id });

        if (!tasks || tasks.length === 0) {
            throw new BadRequestError('User has no tasks assigned');
        }
        const paint = await Paint.findById(paintId)
        // Find the task with the matching paint color
        const matchingTask = tasks.find(task => task.paintColor === paint?.color);

        if (!matchingTask) {
            throw new BadRequestError('User has no tasks assigned with the specified paint color');
        }


        //update stock
        const stock = await Stock.findOne({ paint: paintId });
        if (!stock) {
            throw new BadRequestError('Stock not found for the specified paintId');
        }
        // Update the quantity
        stock.quantity = newQuantity;
        await stock.save();
        const newPaint = await Paint.findById(paintId).populate('quantity')//refetch to show the updated quantity

        res.status(200).json({ success: true, message: 'Stock updated successfully',data:newPaint });
    
};

export {
    createPaint,
    getAllPaints,
    updateStockAll,
    updateStockAssigned,
    updatePaintColor,
    deletePaint
};