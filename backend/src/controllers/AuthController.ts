import { NextFunction, Request, Response } from "express"
import { User, UserDoc, UserType } from "../models/User";
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

// Register a new user
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, type } = req.body;
    try {
        // getting abilities based on the user type
        let abilities: string[] = [];

        switch (type) {
            case UserType.Painter:
                abilities = ["PaintViewAndUpateStockForPainter", "TaskViewUpdateForOwn", "RegularAuthAbilities"];
                break;
            case UserType.Supervisor:
                abilities = ["PaintViewOnlyAndGetAllUsers", "TaskManagementAndAssign","RegularAuthAbilities"];
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

        // Create the user with assigned abilities
        const user: UserDoc = await User.create({
            name,
            email,
            password,
            type,
            abilities: abilityIds
        });
        await user.populate('abilities')

        // Send response with token
        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.log(err);
        throw new BadRequestError('Form validation error');
    }
};

// Log in a user
const login = async (req: Request, res: Response, next: NextFunction) => {
    // Extract email and password from the request body
    const {email, password} = req.body;
    // Validate email and password
    if(!email || !password){
        throw new BadRequestError('Please provide and email and password');
    }
    try{
        // Check if the user exists and retrieve their abilities
        const user:UserDoc = await User.findOne({email}).select('+password')
        await user.populate('abilities')

        if(!user){
            throw new BadRequestError('Invalid Credentials');
        }

        // Check if the password matches
        const isMatch = await user.matchPassword(password)

        if(!isMatch){
            throw new BadRequestError('Invalid Credentials');
        }
        // Send response with token
        sendTokenResponse(user, 200, res)
    }catch(err){
        console.log(err)
        return next(new BadRequestError('Check credentials again'));
    }
};

// Get the current logged in user
const getMe = async (req: any, res: Response, next: NextFunction) => {
    // Find the current user by ID and populate their abilities
    const user:UserDoc|null = await User.findById(req.user.id).populate({
        path: 'abilities',
        populate: { path: 'permissions' }
    })
    // Send response with user data
    res.status(200).json({
        success: true,
        data: user
    })
};

// Log out a user and clear the cookie
const logout = async (req: any, res: Response, next: NextFunction) => {
    // Clear the token cookie
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    // Send success response
    res.status(200).json({
        success: true,
        data: {}
    })
};

// Update user details
const updateDetails = async (req: any, res: Response, next: NextFunction) => {
    // Extract the updated name from the request body
    const fields = {
        name: req.body.name
    }
    // Find the user by ID and update their details
    const user: UserDoc | null = await User.findByIdAndUpdate(req.user.id, fields, {
        new: true,
        runValidators: true
    })
    // Send response with updated user data
    res.status(200).json({
        success: true,
        data: user
    })
};

// Update user password
const updatePassword = async (req: any, res: Response, next: NextFunction) => {
    // Find the user by ID and select their password
    const user: UserDoc = await User.findById(req.user.id).select('+password')

    // Check if the current password matches
    if (!await user.matchPassword(req.body.currentPassword)) {
        throw new BadRequestError("Username or password is incorrect")
    }

    // Update the password and save the user
    user.password = req.body.newPassword
    await user.save()

    // Send response with updated token
    sendTokenResponse(user, 200, res)
};

export { updateDetails, updatePassword, registerUser as register, login, logout, getMe }
