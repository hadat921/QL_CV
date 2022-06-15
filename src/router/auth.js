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

            res.json({
                success: true,
                message: 'User created Success',
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

router.post('/login', async (req, res) => {
    const {
        password,
        userName,
    } = req.body
    if (!userName || !password)
        return res.status(400).json({
            success: false,
            message: 'Missing username or  password'
        })
    try {
        //check for existing user
        const user = await Users.findOne({

            where: {
                userName: userName.toLowerCase().toString()
            }
        })


        console.log(user);

        if (!user)
            return res.status(400).json({
                success: false,
                message: 'Incorect user name'
            })


        //Username found columnName
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid)
            return res.status(400).json({
                success: false,
                message: 'Incorect  password'
            })


        //Pass valid 
        const accessToken = jwt.sign({
            payload: user.id
        }, process.env.ACESS_TOKEN_SECRET);

        await user.update({
            accessToken: accessToken

        })


        res.json({
            userName: userName,
            success: true,
            message: 'Login thanh cong',
            accessToken,


        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error11'
        })

    }
})
///@logout
router.put('/:id', verifyToken, async (req, res) => {
    const {
        accessToken = null,
    } = req.body

    try {
        const logoutUser = await Users.findByPk(req.params.id)

        console.log(logoutUser)

        //User not authorised or post not found 
        if (!logoutUser)
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy User'
            })

        await logoutUser.update({
                accessToken: accessToken
            }

        );
        res.json({
            success: true,
            message: "Logout thanh cong"

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
})

module.exports = router;