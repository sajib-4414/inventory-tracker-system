import mongoose from "mongoose";
import { PermissionDoc } from "./Permission";

interface AbilityDoc extends mongoose.Document{
    name: string;
    permissions: PermissionDoc[];
}

const AbilitySchema = new mongoose.Schema<AbilityDoc>({
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    permissions:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
})

const Ability = mongoose.model<AbilityDoc>('Ability', AbilitySchema);

export{AbilityDoc, Ability}