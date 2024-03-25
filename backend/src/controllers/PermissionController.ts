import { Request, Response } from "express";
import { Permission } from "../models/Ability";
import { BadRequestError, NotFoundError, UnhandledError } from "../utils/RequestUtilities";

const getAllPermissions = async (req:Request, res:Response) => {
    try {
      const permissions = await Permission.find();
      res.status(200).json({ success: true, data: permissions });
    } catch (error) {
      console.error(error);
      throw new UnhandledError();
    }
};

const createPermission = async (req:Request, res:Response) => {
    const { name, code, description } = req.body;
  
    try {
      const newPermission = new Permission({
        name,
        code,
        description,
      });
  
      const savedPermission = await newPermission.save();
      res.status(201).json({ success: true, data: savedPermission });
    } catch (error) {
      console.error(error);
      throw new BadRequestError('Error creating permission')
    }
};

const updatePermission = async (req:Request, res:Response)  => {
    const { id } = req.params;
    const { name, code, description } = req.body;
  
    try {
      const updatedPermission = await Permission.findByIdAndUpdate(id, {
        name,
        code,
        description,
      }, { new: true });
  
      if (!updatedPermission) {
        throw new NotFoundError('Permission not found')
      }
  
      res.status(200).json({ success: true, data: updatedPermission });
    } catch (error) {
      console.error(error);
      throw new BadRequestError('Error updating permission')
    }
};

const deletePermission = async (req:Request, res:Response) => {
    const { id } = req.params;
  
    try {
      const permission = await Permission.findById(id);
      await permission?.deleteOne()
      console.log('delete successful.......')
      res.status(204).json({ success: true, message:'Permission deleted successfully' });
    } catch (error) {
      console.error(error);
      throw new NotFoundError('Permission not found')
    }
};

export {createPermission, getAllPermissions, updatePermission, deletePermission}