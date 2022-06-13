require('dotenv').config()
const express = require('express')
const { Sequelize } = require('sequelize')
const authRouter = require('./router/auth')


// const sequelize = new Sequelize('test', 'root', 'root', {
//   host: 'localhost',
//   dialect: 'postgres'
// });



const app = express()
app.use(express.json())


app.use('/api/auth', authRouter)




const PORT = process.env.port || 8080

app.listen(PORT, () => console.log("server chay tren cong hi:" + PORT))