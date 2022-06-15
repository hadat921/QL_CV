import express from "express";
import {
    Users
} from "../models/user"
import {
    Columns
} from "../models"
const {
    Sequelize
} = require("sequelize");
import {
    Cards
} from "../models"
const router = express.Router()
const jwt = require('jsonwebtoken')

const verifyToken = require('../middleware/auth');

router.post('/', async (req, res) => {

    const {
        columnName,
        description
    } = req.body
    console.log(req.body)
    if (!columnName)
        return res.status(400).json({
            success: false,
            message: "colums fail"
        })
    try {
        const newColumns = await Columns.create({
            columnName: columnName,
            description: description
        })
        return res.status(200).json({
            success: true,
            message: "Done Columns",
            data: newColumns
        })

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            success: false,
            message: "Columns fails----"
        })

    }


})
router.put('/:id', verifyToken, async (req, res) => {
    const {
        columnName,
        description
    } = req.body
    if (!columnName)
        return res.status(400).json({
            success: false,
            message: 'Columns is require'
        })
    try {
        const updatedColumns = await Columns.findByPk(req.params.id)

        if (!updatedColumns)
            return res.status(401).json({
                success: false,
                message: 'Post k tim thay hoac user not authorrised'
            })

        updatedColumns.update({
            columnName: columnName,
            description: description
        })
        return res.status(200).json({
            success: true,
            message: "Update thanh cong"
        })



    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
})

//@Delete

router.delete('/:id', verifyToken, async (req, res) => {
    try {

        const deletedColumns = await Columns.findByPk(req.params.id)



        //User not authorised or post not found 
        if (!deletedColumns)
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy Columns'
            })

        deletedColumns.destroy();
        res.json({
            success: true,
            message: "Xóa thành công Columns"

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