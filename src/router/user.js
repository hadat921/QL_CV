import express from "express";
import {
    Users
} from "../models"
const {
    Sequelize
} = require('sequelize')
const router = express.Router()
const verifyToken = require('../middleware/auth');
const XlsxPopulate = require('xlsx-populate');
//@getAllUser


router.get('/getAll', verifyToken, async (req, res) => {
    try {
        //download 
        const download = req.query
        const user = await Users.findAll({
            attributes: [
                'id', 'userName', 'realName', 'email', 'avatar', 'phoneNumber', 'createdAt', 'updatedAt'
            ]
        })

        //if download = true
        if (download = true) {


            XlsxPopulate.fromFileAsync("/home/ha/Desktop/Test/User.xlsx")
                .then(workbook => {
                    // Modify the workbook.
                    workbook.sheet("Sheet1").cell("A2").value(Users.id);
                    workbook.sheet("Sheet1").cell("B2").value(Users.createdAt);
                    workbook.sheet("Sheet1").cell("C2").value(Users.updatedAt);
                    workbook.sheet("Sheet1").cell("D2").value(Users.password);
                    workbook.sheet("Sheet1").cell("E2").value(Users.avatar);
                    workbook.sheet("Sheet1").cell("F2").value(Users.email);
                    workbook.sheet("Sheet1").cell("G2").value(Users.accessToken);
                    workbook.sheet("Sheet1").cell("H2").value(Users.phoneNumber);
                    workbook.sheet("Sheet1").cell("I2").value(Users.realName);
                    workbook.sheet("Sheet1").cell("J2").value(Users.userName);

                    // Log the value.
                    console.log(value);
                })
        } else {
            res.json({
                success: true,
                user
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal error server 11 hehe'
        })
    }

})
//@getUserbyId
router.get('/:id', verifyToken, async (req, res) => {

    try {

        console.log(req.userId)
        const user = await Users.findByPk(req.params.id, {
            attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]

        })
        console.log(user);
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
// router.get('/', verifyToken, async (req, res) => {

//     try {

//         const user = await Users.findAll();
//         console.log(user);
//         if (!user)
//             return res.status(400).json({
//                 success: false,
//                 message: 'dont find user'
//             })
//         res.json({
//             success: true,
//             user
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         })
//     }
// })
//@updateUser
router.put('/:id', verifyToken, async (req, res) => {
    const {
        realName,
        email,
        avatar,


    } = req.body
    try {
        const updatedUser = await Users.findByPk(req.userId)

        if (!updatedUser)
            return res.status(401).json({
                success: false,
                message: 'Khong tim thay user'
            })

        await updatedUser.update({
            realName: realName,
            email: email,
            avatar: avatar,
        })
        return res.status(200).json({
            success: true,
            message: "Update thanh cong user"
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