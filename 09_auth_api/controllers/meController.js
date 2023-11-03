class meController {
    async getMe(req, res){
        try {
            if(res.locals.isExpired){
                return res.json({
                    "success": false,
                    "data": null
                  })
            }
            var user = res.locals.decoded
            console.log(res.locals)
            return res.json({
                "success": true,
                "data": {
                    "id": user.id,
                    "email": user.email
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Error"})
        }
    }
}

module.exports = new meController()