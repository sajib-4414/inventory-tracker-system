import mongoose from "mongoose";


interface PermissionDoc extends mongoose.Document{
    name: string;
    description: string;
    code: string;
}

const PermissionSchema = new mongoose.Schema<PermissionDoc>({
    name:{
        type: String,
        required: [true, 'Please add a Permission name']
    },
    code:{
        type: String,
        required: [true, 'Please add a Permission Code']
    },
    description:{
        type: String,
        required: [true, 'Please add a Permission description']
    },
})


const Permission = mongoose.model<PermissionDoc>('Permission', PermissionSchema);


interface AbilityDoc extends mongoose.Document{
    name: string;
    description: string;
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

export{AbilityDoc, Ability,Permission, PermissionDoc}