import { NextFunction, Request, Response } from 'express';
import { User, UserType, UserDoc } from '../models/User';
import { BadRequestError, NotFoundError, UnhandledError } from '../utils/RequestUtilities';
import { Task } from '../models/Task';


// GET all users of a specified type
const getUsers = async (req: Request, res: Response) => {
    try {
        const userType = req.query.type;
        let query = {};
        if (userType) {
            if (userType === 'admin') {
                query = { type: UserType.Admin };
            } else if (userType === 'painter') {
                query = { type: UserType.Painter };
            } else if (userType === 'supervisor') {
                query = { type: UserType.Supervisor };
            } else if (userType === 'supply_coordinator') {
                query = { type: UserType.SupplyCoordinator };
            } else {
                throw new BadRequestError(`Invalid user type`);
            }
        }

        const users = await User.find(query).populate({
            path: 'abilities',
            populate: { path: 'permissions' }
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        throw new UnhandledError();
    }
};


// Enable or disable a user
const enableDisableUsers = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('user not found')
        }
        user.is_enabled = !user.is_enabled;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.log(error)
        throw new UnhandledError();
    }
};

// Delete a user and associated tasks
const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('user not found')
        }
        
        //delete the user
        await user.deleteOne();

        // Delete associated tasks
        Task.deleteMany({ user: userId });
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.log(error)
        throw new UnhandledError();
    }
};


const createUser = async (req:Request, res: Response, next: NextFunction)=>{
    const {name, email, password, type} = req.body;
    try{
        //create user
        const user:UserDoc = await User.create({
            name, 
            email,
            password,
            type
        })
        res.status(200).json({ success: true, data:user });
    }catch(err){
        console.log(err)
        throw new BadRequestError('Form validation error');
    }
}


const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { name } = req.body;
    try {
        const user: UserDoc | null = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.name = name; // Update the user's name
        await user.save(); // Save the updated user
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error(err);
        next(new Error('Error updating user'));
    }
};


export { getUsers, enableDisableUsers, deleteUser , createUser, updateUser};
