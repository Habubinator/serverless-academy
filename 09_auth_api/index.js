const express = require("express");
const PORT = require("./config/config").getEnv().SERVER_PORT || 5000
const authRouter = require("./routers/authRouter.js")
const meRouter = require("./routers/meRouter.js")
const validateToken = require("./middleware/checkToken.js")
const app = express();

app.use(express.json())
app.use(validateToken)
app.use("/auth", authRouter)
app.use("/me", meRouter)

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log("Server works on port " + PORT)
        })
    } catch (error) {
        console.log(error)
    }
}
start()