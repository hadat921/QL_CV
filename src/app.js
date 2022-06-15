require('dotenv').config()
import express from "express"
import morgan from 'morgan'
const {
    Sequelize
} = require('sequelize')
const authRouter = require('./router/auth')
import userRouter from "./router/user"
import cardsRouter from "./router/card"
import columnsRouter from "./router/column"






const app = express()
app.use(express.json())
app.use(morgan("dev"))

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/card', cardsRouter)
app.use('/columns', columnsRouter)



const PORT = process.env.PORT || 6789

app.listen(PORT, () => console.log("server chay tren cong hi:" + PORT))