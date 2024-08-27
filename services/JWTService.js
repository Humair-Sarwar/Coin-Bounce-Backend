const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config');
const { TokenModel } = require('../database');
class JWTService{
    static signAccessToken(payload, expiryTime){
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: expiryTime});
    }
    static signRefreshToken(payload, expiryTime){
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: expiryTime});
    }
    static verifyAccessToken(token){
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    static verifyRefreshToken(token){
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }
    // store refresh token in db
    static async storeRefreshToken(token, userId){
        let refreshToken = TokenModel[0];
        let storeToken = {
            token,
            userId
        }
        try {
            
            let test = await refreshToken.create(storeToken);
            console.log(test, '@@@@@@@');
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = JWTService;