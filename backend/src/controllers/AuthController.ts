import { NextFunction, Request, Response } from "express"
import { User, UserDoc, UserType } from "../models/User";
import { validationResult } from "express-validator";
import { BadRequestError } from "../utils/RequestUtilities";
import { Ability } from "../models/Ability";


//Get token from model, create cookie and send response
const sendTokenResponse = (user:UserDoc, statusCode:number, res:Response)=>{

    //create token
    const token:string = user.getSignedJWTToken()
    const jwtCookieExpire = process.env.JWT_COOKIE_EXPIRE;
    if (!jwtCookieExpire) {
        // Handling the case where JWT_COOKIE_EXPIRE is not defined
        throw new Error('JWT_COOKIE_EXPIRE is not defined');
    }
    
    //setting cookie with expiration time in the browser.
    const options:any = {
        expires: new Date(Date.now() + Number(jwtCookieExpire)*24*60*60*1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }
    

    res.status(statusCode)
    .cookie('token',token, options) //setting token in the cookie
    .json({
        success: true,
        token,
        data:user
    })
}

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, type } = req.body;
    try {
        let abilities: string[] = [];

        switch (type) {
            case UserType.Painter:
                abilities = ["PaintViewAndUpateStockForPainter", "TaskViewUpdateForOwn", "RegularAuthAbilities"];
                break;
            case UserType.Supervisor:
                abilities = ["PaintViewOnly", "TaskManagementAndAssign","RegularAuthAbilities"];
                break;
            case UserType.SupplyCoordinator:
                abilities = ["PaintManagement","RegularAuthAbilities"];
                break;
            case UserType.Admin:
                abilities = ["PaintManagement", "TaskManagementAndAssign", "UserAndRoleManagement","RegularAuthAbilities"];
                break;
            default:
                throw new BadRequestError('Invalid user type');
        }

        // Fetch ability IDs based on ability names
        const abilityIds: string[] = await Promise.all(abilities.map(async (abilityName: string) => {
            const ability = await Ability.findOne({ name: abilityName });
            if (!ability) {
                throw new BadRequestError(`Ability ${abilityName} not found`);
            }
            return ability.id;
        }));

        // Create user
        const user: UserDoc = await User.create({
            name,
            email,
            password,
            type,
            abilities: abilityIds // Assign ability IDs to the user
        });
        await user.populate('abilities')

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.log(err);
        throw new BadRequestError('Form validation error');
    }
};


// @desc Register user
// @route POST /api/v1/auth/login
// @access Public

const login = async (req:Request, res: Response, next: NextFunction)=>{
    const {email, password} = req.body;
    //Validate email and password
    if(!email || !password){
        throw new BadRequestError('Please provide and email and password');
    }
    try{
         //check for user and explicitly retrieving password to match below
        const user:UserDoc = await User.findOne({email}).select('+password')
        await user.populate('abilities')

        if(!user){
            throw new BadRequestError('Invalid Credentials');
        }

        //check if password matches
        const isMatch = await user.matchPassword(password)

    if(!isMatch){
        throw new BadRequestError('Invalid Credentials');
    }
        sendTokenResponse(user, 200, res)
    }catch(err){
        console.log(err)
        return next(new BadRequestError('Check credentials again'));
    }
    
   
}


// @desc Get current logged in user
// @route POST /api/v1/auth/me
// @access Private

const getMe = async (req:any, res:Response, next:NextFunction)=>{
    const user:UserDoc|null = await User.findById(req.user.id).populate({
        path: 'abilities',
        populate: { path: 'permissions' }
    })
    res.status(200).json({
        success: true,
        data:user
    })

}


// @desc Log out user/clear cookie
// @route GET /api/v1/auth/logout
// @access Private

const logout = async (req:any, res:Response, next:NextFunction)=>{

    res.cookie('token','none',{
        expires: new Date(Date.now()+10*1000),
        httpOnly: true
    })
    
    res.status(200).json({
        success: true,
        data:{}
    })
}

// @desc Update user details
// @route PUT /api/v1/auth/updatedetails
// @access Private

const updateDetails = async (req:any, res:Response, next:NextFunction)=>{
    //only allowing name to be updated.
    const fields = {
        name: req.body.name
    }
    const user:UserDoc|null = await User.findByIdAndUpdate(req.user.id, fields, {
        new: true,
        runValidators:true
    })
    res.status(200).json({
        success: true,
        data:user
    })
}

// @desc Update password
// @route PUT /api/v1/auth/updatepassword
// @access Private

const updatePassword = async (req:any, res:Response, next:NextFunction)=>{
    const user:UserDoc = await User.findById(req.user.id).select('+password')

    //check current password
    if(!await user.matchPassword(req.body.currentPassword)){
        throw new BadRequestError("Username or password is incorrect")
    }

    user.password = req.body.newPassword

    await user.save()

    sendTokenResponse(user,200,res)
   
}

export{updateDetails, updatePassword, registerUser as register, login, logout, getMe}