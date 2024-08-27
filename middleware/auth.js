const { UserModel } = require("../database");
const UserDto = require("../dto/user");
const JWTService = require("../services/JWTService");

const auth = async (req, res, next)=>{
    // try {
        const {accessToken, refreshToken} = req.cookies;
        if(!accessToken || !refreshToken){
            const error = {
                status: 401,
                message: 'Unauthorized!'
            }
            return next(error);
        }
        let id;
        try {
                id = JWTService.verifyAccessToken(accessToken);
            
        } catch (error) {
            return next(error,);
        }
        let user;
        try {

            user = await UserModel[0].findOne({where: {id: id.id}});
            
        } catch (error) {
            return next(error);
        }
        const userDto = new UserDto(user);
        req.user = userDto;
        next();
    // } catch (error) {
    //     return next(error);
    // }
};

module.exports = auth;