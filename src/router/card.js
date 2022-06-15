import express from "express";
import {
    Users
} from "../models/user"
import {
    Columns
} from "../models/columns"
const {
    Sequelize,
    DATE
} = require("sequelize");
import {
    Cards
} from "../models"
const router = express.Router()
const jwt = require('jsonwebtoken')

const verifyToken = require('../middleware/auth');
//@create card
router.post('/', verifyToken, async (req, res) => {
    const {
        cardName,
        description,
        // dueDate,
        idColumn,

    } = req.body
    console.log(req.body)
    console.log(DATE.now)
    if (!cardName)
        return res.status(400).json({
            success: false,
            message: "cardName in correct"

        })
    try {
        console.log(req.userId);
        const newCard = await Cards.create({
            cardName: cardName,
            description: description,
            createBy: req.userId,
            // dueDate: dueDate,
            idColumn: idColumn



        })

        return res.status(200).json({
            success: true,
            message: "Done",
            data: newCard,
        })

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            success: false,
            message: 'Card fails'
        })

    }

})
//@ update card
router.put('/:id', verifyToken, async (req, res) => {
    const {
        cardName,
        description,
        // dueDate,
    } = req.body
    if (!cardName)
        return res.status(400).json({
            success: false,
            message: 'Cards is require'
        })
    try {
        const updatedCard = await Cards.findByPk(req.params.id)

        if (!updatedCard)
            return res.status(401).json({
                success: false,
                message: 'Post k tim thay hoac user not authorrised'
            })

        await updatedCard.update({
            cardName: cardName,
            description: description,
            // dueDate: dueDate,
        })

        console.log(Date.now())
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
///@delete card

router.delete('/:id', verifyToken, async (req, res) => {
    try {

        const deletedCards = await Cards.findByPk(req.params.id)



        //User not authorised or post not found 
        if (!deletedCards)
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy Cards'
            })

        await deletedCards.destroy();
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