const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../db")
const {JWT_SECRET_KEY, JWT_TTL} = require("../config/config").getEnv()

class authController {
    async registration(req, res){
        try {
            const {email,password} = req.body
            if(!email || !password){
                return res.status(404).json({"success": false, "error": "Can't find body params needed"})
            }
            const candidate = await db.query(`SELECT * FROM person WHERE email = '${email}';`)
            if (candidate.rowCount){
                return res.status(409).json({"success": false, "error": "User already exists"})
            }
            const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            const refreshToken = jwt.sign(require('crypto').randomBytes(32).toString('hex'), JWT_SECRET_KEY)
            const newPerson = (await db.query(
                'INSERT INTO person (email, password, refreshToken) VALUES ($1, $2, $3) RETURNING *',
                [email, hashPassword, refreshToken]
              )).rows[0];
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
            const candidate = (await db.query(`SELECT * FROM person WHERE email = '${email}';`)).rows[0]
            if (!candidate){
                return res.status(404).json({"success": false, "error": "Can't find user"})
            }
            if(bcrypt.compareSync(password, candidate.password)){
                const accessToken = generateAccessToken(candidate._id, candidate.email);
                const refreshToken = jwt.sign(require('crypto').randomBytes(32).toString('hex'), JWT_SECRET_KEY)
                await db.query(
                    'UPDATE person SET refreshToken = $1 WHERE email = $2 RETURNING *',
                    [refreshToken, email]
                  ).catch(err =>{
                    throw err
                  });
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