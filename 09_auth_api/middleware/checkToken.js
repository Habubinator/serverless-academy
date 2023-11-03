const jwt = require("jsonwebtoken")
const {JWT_SECRET_KEY} = require("../config/config").getEnv()

function checkToken(req, res, next){
    const { authorization } = req.headers;
    if(authorization && authorization.startsWith('Bearer ')){
        const accessToken = authorization.split(' ')[1];    
        jwt.verify(accessToken, JWT_SECRET_KEY, function(err, decoded) {
            if(err){
                if(err.name == "TokenExpiredError"){
                    res.locals.isExpired = true;
                }else{
                    res.status(400).json({
                        "success": false,
                        "message": "Invalid token provided. Please login again to obtain a new one."
                    })
                }
            }
            res.locals.isExpired = false;
            res.locals.decoded = decoded;
            next()
        });
    }else{
        next()
    }
}

module.exports = checkToken