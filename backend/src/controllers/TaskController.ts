import { NextFunction, Request, Response } from "express";
import { Task } from "../models/Task";
import { NotFoundError } from "../utils/RequestUtilities";

//only admin and assigned persons can create task
const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { houseAddress, paintColor, userId,title } = req.body;

        // Create a new task
        const task = await Task.create({ houseAddress, paintColor, user: userId, title });
        await task.populate('user')

        res.status(201).json({ success: true, message: 'Task created successfully', data: task });
    } catch (error) {
        next(error);
    }
};

//only assigned persons can see all tasks of everyone
const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve all tasks from the database
        const tasks = await Task.find().populate('user');

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

//assigned person can get their tasks list only
const getMyTasks = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id; // Assuming authenticated user's ID is available in req.user._id

        // Retrieve tasks of the authenticated user
        const tasks = await Task.find({ user: userId });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

//only managers, admin can update anything of any task
const updateTaskAny = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId, houseAddress, paintColor,title,status } = req.body;

        // Find the task by ID
        const task = await Task.findById(taskId);

        if (!task) {
            throw new NotFoundError(`Task not found with id ${taskId}`)
        }

        // Update task attributes if task is found
        if (houseAddress) {
            task.houseAddress = houseAddress;
        }
        if (paintColor) {
            task.paintColor = paintColor;
        }
        if (title) {
            task.title = title;
        }
        if (status) {
            task.status = status;
        }

        // saving before returning
        await task.save();

        res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
    } catch (error) {
        next(error);
    }
};

//only assigned person can update the status only of his own task
const updateAssignedTaskStatus = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { taskId, status } = req.body;
        const userId = req.user._id; 
        console.log("user id is,,,,",userId)

        // Find the task by ID
        const task = await Task.findById(taskId);

        if (!task) {
            throw new NotFoundError(`Task not found with id ${taskId}`)
        }

        // Check if the task belongs to the authenticated user if not show error
        console.log("owner id is",task.user.toString())
        if (task.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'You are not authorized to update this task' });
        }

        // if there is no problem, update the task status
        task.status = status;

        // Save 
        await task.save();

        res.status(200).json({ success: true, message: 'Task status updated successfully', data: task });
    } catch (error) {
        next(error);
    }
};

//delete task, only special persons can delete a task
const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;

        // finding and deleting by id
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

//asign a task, only special persons can do it.
const assignTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId, userId } = req.body;

        // Find the task by ID
        const task = await Task.findById(taskId);

        if (!task) {
            throw new NotFoundError(`Task not found with id ${taskId}`)
        }

        // Update the task's user to assign it
        task.user = userId;

        // Saving the task now
        await task.save();

        await task.populate('user');

        res.status(200).json({ success: true, message: 'Task assigned successfully', data: task });
    } catch (error) {
        next(error);
    }
};

export {assignTask, deleteTask, updateAssignedTaskStatus, updateTaskAny, getMyTasks, getAllTasks, createTask}