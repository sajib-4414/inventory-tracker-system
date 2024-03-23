import mongoose from "mongoose";

interface PermissionDoc extends mongoose.Document{
    name: string;
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
})


const Permission = mongoose.model<PermissionDoc>('Permission', PermissionSchema);

export{PermissionDoc, Permission}