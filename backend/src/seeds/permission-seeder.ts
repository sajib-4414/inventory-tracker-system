import fs from 'fs';
import mongoose from 'mongoose';

import * as dotenv from "dotenv";
import { Ability, Permission } from '../models/Ability';

dotenv.config({ path: __dirname+'/../../.env' });
mongoose.connect(process.env.MONGO_URI!)

/*
How to run this file?
ts-node seeder argument.
Example, ts-node seeder -i, this will import
-i for import
-d for delete
this -i or -d is captured as argv[2]
*/
const permissions = JSON.parse(fs.readFileSync(`${__dirname}/permissions.json`,'utf-8'))
const abilities = JSON.parse(fs.readFileSync(`${__dirname}/abilities.json`,'utf-8'))

const importData = async()=>{
    try{
        console.log("Creating Permissions....")
        await Permission.create(permissions);
        await Ability.create(abilities);
        process.exit()
    }catch(err){
        console.error("error in importing,error=",err)
    }
}

const deleteData = async()=>{
    try{
        await Permission.deleteMany()
        await Ability.deleteMany()

        console.log("All Deletion completed successfully.");
        process.exit();
    }catch(err){
        console.error("Deletion failed:", err);
    }
}   


if(process.argv[2]=== '-i'){
    importData()
}
else if(process.argv[2] === '-d'){
    deleteData()
}