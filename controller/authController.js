const Joi = require('joi');
const { UserModel, TokenModel } = require('../database');
const bcrypt = require('bcrypt');
const UserDto = require('../dto/user');
const JWTService = require('../services/JWTService');

const authController = {
    async singup(req, res, next){
        let user = UserModel[0];
        const signupSchema = Joi.object({
            username: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.ref('password')
        });

        const {error} = signupSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {email, password, username} = req.body;
        try{
            const emailInUse = await user.findOne({where: {email: email}});
            if(emailInUse){
                const error = {
                    status: 409,
                    message: 'Email already exist!'
                }
                return next(error);
            }
        }catch(error){
            return next(error);
        }
        // password hash
        const passwordHash = await bcrypt.hash(password, 10);

        // save in db
        let accessToken;
        let refreshToken;
        let signupUser;
        try{
            const data = {
                username,
                email,
                password: passwordHash
            }
            signupUser = await user.create(data);
            accessToken = JWTService.signAccessToken({id: signupUser.id}, '30m');
            refreshToken = JWTService.signRefreshToken({id: signupUser.id}, '60m');
        }catch(error){
            return next(error);
        }
        await JWTService.storeRefreshToken(refreshToken, signupUser.id);
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })
        const userDto = new UserDto(signupUser);
        // return response
        return res.status(201).json({user: userDto, auth: true});
    },
    async login(req, res, next){
        let userModel = UserModel[0];
        const loginSchema = Joi.object({
            username: Joi.string().min(3).max(30).required(),
            password: Joi.string().required()
        });
        let {error} = loginSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {username, password} = req.body;
        let user;
        try{
            user = await userModel.findOne({where: {username: username}});
            if(!user){
                const error = {
                    status: 401,
                    message: 'Username not matched!'
                }
                return next(error);
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                const error = {
                    status: 401,
                    message: 'Password not matched!'
                }
                return next(error);
            }
        }catch(error){
            return next(error);
        }
        let accessToken = JWTService.signAccessToken({id: user.id}, '30m');
        let refreshToken = JWTService.signRefreshToken({id: user.id}, '60m');
        // update refresh token in db
        try {
            await TokenModel[0].upsert({userId: user.id, token: refreshToken});
        } catch (error) {
            return next(error);
        }
        // await JWTService.storeRefreshToken(refreshToken, user.id);
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        const userDto = new UserDto(user);
        return res.status(200).json({user: userDto, auth: true});
    },
    async logout(req, res, next){
        const {refreshToken} = req.cookies;
        console.log(refreshToken, '~~~~~~~~~~~~>>>>>>.--???');
        
        try {
            await TokenModel[0].destroy({where: {token: refreshToken}});
        } catch (error) {
            return next(error);
            
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return res.status(200).json({user: null, auth: false});
    },
    async refresh(req, res, next) {
        try {
            const originalRefreshToken = req.cookies.refreshToken;
    
            if (!originalRefreshToken) {
                return res.status(401).json({ message: 'No refresh token provided' });
            }
    
            let id;
            try {
                id = JWTService.verifyRefreshToken(originalRefreshToken).id;
            } catch {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
            console.log(id, originalRefreshToken, '-------> checking id');
            
            // Check if the refresh token matches
            const tokenRecord = await TokenModel[0].findOne({ where: { userId: id } });
            if (!tokenRecord) {
                return res.status(401).json({ message: 'Refresh token does not match' });
            }
    
            // Generate new tokens
            const accessToken = JWTService.signAccessToken({ id }, '30m');
            const refreshToken = JWTService.signRefreshToken({ id }, '30m');
    
            // Update the refresh token in the database
            await TokenModel[0].update({ token: refreshToken }, { where: { id } });
    
            // Set new cookies
            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                httpOnly: true
            });
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                httpOnly: true
            });
    
            // Retrieve the user and respond
            const user = await UserModel[0].findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const userDTO = new UserDto(user);
            res.status(200).json({ user: userDTO, auth: true });
    
        } catch (error) {
            console.error('Error during token refresh:', error);
            next(error); // Forward the error to the error handling middleware
        }
    }
    
}

module.exports = authController;