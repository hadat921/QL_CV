import express from "express";
const {
    Sequelize
} = require("sequelize");
import {
    Users
} from "../models"
const router = express.Router()
import argon2 from "argon2"
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth');




//get api check

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await Users.findById(req.userId) //.select('-password')
        if (!user)
            return res.status(400).json({
                success: false,
                message: 'dont find user'
            })
        res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

//register

router.post('/register', async (req, res) => {
    const {
        password,
        userName,
        phoneNumber
    } = req.body
    console.log("req.body", req.body)
    if (!userName || !password || !phoneNumber)
        return res.status(400).json({
            success: false,
            message: " missing username, password or phonenumber"
        })
    try {


        const user = await Users.findOne({
            where: {
                userName: userName
            }
        })

        const checkData = await Users.findOne({
            where: {
                phoneNumber: phoneNumber
            }
        })

        if (user || checkData)

            return res
                .status(400)
                .json({
                    success: false,
                    message: 'Username already taken'
                })

        else {
            const hashedpassword = await argon2.hash(password)

            let dataInsert = {
                userName,
                password: hashedpassword,
                phoneNumber
            }
            console.log(dataInsert)
            const newUser = await Users.create(dataInsert)
            await newUser.save()

            const accessToken = jwt.sign({
                userId: newUser.id
            }, process.env.ACESS_TOKEN_SECRET)
            res.json({
                success: true,
                message: 'User created Success',
                accessToken
            })
        }





    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error'
        })

    }
})

module.exports = router;




//login
//logout