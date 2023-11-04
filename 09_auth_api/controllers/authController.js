const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {JWT_SECRET_KEY, JWT_TTL} = require("../config/config").getEnv()
const db = require("../database/dbController")

class authController {
    async registration(req, res){
        try {
            const {email,password} = req.body
            if(!email || !password){
                return res.status(404).json({"success": false, "error": "Can't find body params needed"})
            }
            const candidate = await db.findUsers(email)
            if (candidate.length){
                return res.status(409).json({"success": false, "error": "User already exists"})
            }
            const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            const refreshToken = jwt.sign(require('crypto').randomBytes(32).toString('hex'), JWT_SECRET_KEY)
            const newPerson = await db.createUser(email, hashPassword, refreshToken);
            const accessToken = generateAccessToken(newPerson._id, newPerson.email);
            res.json(
                {
                "success": true,
                "data": {
                  "id": newPerson._id,
                  "accessToken": accessToken,
                  "refreshToken": refreshToken
                }
              }
            )
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Registration error"})
        }
    }

    async login(req, res){
        try {
            const {email,password} = req.body
            if(!email || !password){
                return res.status(400).json({"success": false, "error": "Can't find body params needed"})
            }
            const candidate = await db.findUsers(email)
            if (!candidate.length){
                return res.status(404).json({"success": false, "error": "Can't find user"})
            }
            if(bcrypt.compareSync(password, candidate[0].password)){
                const accessToken = generateAccessToken(candidate[0]._id, candidate[0].email);
                const refreshToken = jwt.sign(require('crypto').randomBytes(32).toString('hex'), JWT_SECRET_KEY)
                await db.rewokeToken(refreshToken, email)
                return res.json({
                    "success": true, 
                    "data": {
                        "id": candidate._id,
                        "accessToken": accessToken,
                        "refreshToken": refreshToken
                    }
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Login error"})
        }
    }
}

function generateAccessToken(id, email){
    const payload = {
        id,
        email
    }
    return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: JWT_TTL})
}

module.exports = new authController()