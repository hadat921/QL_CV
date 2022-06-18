import express from "express";
import {
    Users
} from "../models"
const {
    Sequelize,
    ARRAY
} = require('sequelize')
const router = express.Router()
const verifyToken = require('../middleware/auth');
const XlsxPopulate = require('xlsx-populate');
//@getAllUser


router.get('/getAll', verifyToken, async (req, res) => {
    try {


        let user = await Users.findAll({
            attributes: [
                'id', 'userName', 'realName', 'email', 'avatar', 'phoneNumber', 'createdAt', 'updatedAt'
            ]
        })

        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                // Modify the workbook.
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value("userName");
                workbook.sheet("Sheet1").cell("C1").value("realName");
                workbook.sheet("Sheet1").cell("D1").value("email");
                workbook.sheet("Sheet1").cell("E1").value("avtar");
                workbook.sheet("Sheet1").cell("F1").value("phoneNumber");
                workbook.sheet("Sheet1").cell("G1").value("createdAt");
                workbook.sheet("Sheet1").cell("H1").value("updatedAt");

                let start_row = 2
                for (let i = 1; i <= user.length; i++) {


                    workbook.sheet("Sheet1").cell("A" + start_row).value(`${user[i-1].id}`);
                    workbook.sheet("Sheet1").cell("B" + start_row).value(`${user[i-1].userName}`);
                    workbook.sheet("Sheet1").cell("C" + start_row).value(`${user[i-1].realName}`);
                    workbook.sheet("Sheet1").cell("D" + start_row).value(`${user[i-1].email}`);
                    workbook.sheet("Sheet1").cell("E" + start_row).value(`${user[i-1].avatar}`);
                    workbook.sheet("Sheet1").cell("F" + start_row).value(`${user[i-1].phoneNumber}`);
                    workbook.sheet("Sheet1").cell("G" + start_row).value(`${user[i-1].createdAt}`);
                    workbook.sheet("Sheet1").cell("H" + start_row).value(`${user[i-1].updatedAt}`);
                    start_row++;

                }



                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/Test/src/excel/User.xlsx");
            });

        res.json({
            success: true,
            user
        })
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
        // Load a new blank workbook
        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                // Modify the workbook.
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value("userName");
                workbook.sheet("Sheet1").cell("C1").value("realName");
                workbook.sheet("Sheet1").cell("D1").value("email");
                workbook.sheet("Sheet1").cell("E1").value("avtar");
                workbook.sheet("Sheet1").cell("F1").value("phoneNumber");
                workbook.sheet("Sheet1").cell("G1").value("createdAt");
                workbook.sheet("Sheet1").cell("H1").value("updatedAt");

                workbook.sheet("Sheet1").cell("A2").value(`${user.dataValues.id}`);
                workbook.sheet("Sheet1").cell("B2").value(`${user.dataValues.userName}`);
                workbook.sheet("Sheet1").cell("C2").value(`${user.dataValues.realName}`);
                workbook.sheet("Sheet1").cell("D2").value(`${user.dataValues.email}`);
                workbook.sheet("Sheet1").cell("E2").value(`${user.avatar}`);
                workbook.sheet("Sheet1").cell("F2").value(`${user.phoneNumber}`);
                workbook.sheet("Sheet1").cell("G2").value(`${user.createdAt}`);
                workbook.sheet("Sheet1").cell("H2").value(`${user.updatedAt}`);


                // Write to file.
                return workbook.toFileAsync("//home/ha/Desktop/Test/User.xlsx");
            });

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