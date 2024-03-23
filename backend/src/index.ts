import mongoose from 'mongoose';
import { app } from './app';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });
const start = async() =>{
  console.log('Starting auth');
  if(! process.env.JWT_SECRET){
    throw new Error('JWT_KEY Must be defined')
  }
  if(! process.env.MONGO_URI){
    throw new Error('MONGO_URI Must be defined')
  }
  try{
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to Mongodb server')
  }catch(error){
    console.log(error)
  }
  app.listen(3001, () => {
    console.log('Listening on port 3001!!!!!!!!');
  });
}

start();