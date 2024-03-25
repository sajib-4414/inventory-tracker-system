import { NextFunction, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../models/User'
import { NotAuthorizedError, NotPermittedError } from '../utils/RequestUtilities';


//protect routes
export const authenticatedRoute = async (req:any, res: Response, next: NextFunction) =>{
    let token:any;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer '))
        { 
            //set tokenn from beater token in header
            token = req.headers.authorization.split(' ')[1];
        }
        //set token from cookie
    else if(req.cookies && req.cookies.token){
        token = req.cookies.token
    }

    //Make sure token exists
    if(token=== undefined || !token){
        throw new NotAuthorizedError()
    }

    try{
        //verify token
        const decoded:JwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        console.log(decoded)
        req.user = await User.findById(decoded.id)
        next()
    }catch(err){
        console.log(err)
        throw new NotAuthorizedError()
    }
}

// Middleware to check if the user has a specific permission
export const checkPermission = (permissionCode:string) => async (req:any, res: Response, next: NextFunction)  => {
    
        // Get the user's permissions
        const user = await User.findById(req.user._id);
        const permissions = await user!.getPermissions();
        console.log('permissions are',permissions)

        // Check if the user has the specified permission code
        const hasPermission = permissions.some(permission => permission.code === permissionCode);

        if (!hasPermission) {
            throw new NotPermittedError();
        }

        // If the user has the permission, continue to the next middleware
        next();
    
};