import mongoose from "mongoose";
import  brcypt  from "bcryptjs";
import jwt from 'jsonwebtoken'
import { Ability, AbilityDoc } from "./Ability";

enum UserType {
    Admin = "admin",
    Painter = "painter",
    Supervisor = "supervisor",
    SupplyCoordinator = "supply_coordinator"
}

interface UserDoc extends mongoose.Document {
    name: string;
    email: string;
    type: UserType;
    is_enabled: boolean;
    abilities: AbilityDoc[];
    password: string;
    // Add the method to the interface
    getSignedJWTToken: () => string;
    matchPassword: (password:string) => boolean;
}

const userSchema = new mongoose.Schema<UserDoc>({
    name:{
        type: String,
        required: [true, 'Please add a name']
    },
    is_enabled:{
        type: Boolean,
        default: true
    },
    email:{
        type: String, 
        match:[
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ],
        required: [true, 'Please add an email'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'please add a password'],
        minlength:6,
        select: false //dont show when retrieving a user.
    },
    abilities:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Ability' }],
    type: {
        type: String,
        enum: Object.values(UserType), // Ensure type field value is one of UserType enum values
        required: [true, 'Please select a user type']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: false }
})

//Encrypt password using brcypt
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }
    //hashing the password before saving
    const salt = await brcypt.genSalt(10)
    this.password = await brcypt.hash(this.password,salt)
})


//this will be a method on the document, not the schema
//sign JWT and return
userSchema.methods.getSignedJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRE!
    })
    
}

// userSchema.virtual('permissions').get(function(this: UserDoc): Promise<string[]> {
//     return Ability.find({ _id: { $in: this.abilities } })
//         .populate('permissions')
//         .then((abilities: AbilityDoc[]) => {
//             const permissions: string[] = [];
//             abilities.forEach((ability: AbilityDoc) => {
//                 ability.permissions.forEach((permission) => {
//                     permissions.push(permission.name);
//                 });
//             });
//             return permissions;
//         });
// });


userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

//match user entered password to authenticate
userSchema.methods.matchPassword = async function(enteredPassword:string){
    return await brcypt.compare(enteredPassword, this.password)
    
}

interface UserModelInterface extends mongoose.Model<UserDoc>{
    //We can add static method here in future here.
}
const User = mongoose.model<UserDoc, UserModelInterface>('User', userSchema);

export {User, UserType, UserDoc}