import { Request, Response } from 'express';
import { Ability, AbilityDoc } from '../models/Ability';


const createAbility = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    try {
        // Check if an ability with the same name already exists
        const existingAbility: AbilityDoc | null = await Ability.findOne({ name });
        if (existingAbility) {
            return res.status(400).json({ success: false, message: 'Ability with the same name already exists' });
        }

        // Create a new ability
        const newAbility: AbilityDoc = await Ability.create({ name, description });
        res.status(201).json({ success: true, data: newAbility });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// Get all abilities
const getAllAbilities = async (req: Request, res: Response) => {
    try {
        const abilities: AbilityDoc[] = await Ability.find().populate('permissions');
        res.status(200).json({ success: true, data: abilities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get a single ability by ID
const getAbilityById = async (req: Request, res: Response)=> {
    const { id } = req.params;
    try {
        const ability: AbilityDoc | null = await Ability.findById(id);
        if (!ability) {
            res.status(404).json({ success: false, message: 'Ability not found' });
            return;
        }
        res.status(200).json({ success: true, data: ability });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update an ability
const updateAbility = async (req: Request, res: Response) => {
    const { abilityId } = req.params;
    const { name, description } = req.body;
    try {
        let ability: AbilityDoc | null = await Ability.findById(abilityId);
        if (!ability) {
            res.status(404).json({ success: false, message: 'Ability not found' });
            return;
        }
        ability.name = name;
        ability.description = description;
        await ability.save();
        await ability.populate('permissions')
        res.status(200).json({ success: true, data: ability });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete an ability
const deleteAbility = async (req: Request, res: Response) => {
    const { abilityId } = req.params;
    try {
        const ability: AbilityDoc | null = await Ability.findById(abilityId);
        if (!ability) {
            res.status(404).json({ success: false, message: 'Ability not found' });
            return;
        }
        await ability.deleteOne();
        res.status(204).json({ success: true, message: 'Ability deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export { createAbility, getAllAbilities, getAbilityById, updateAbility, deleteAbility };
