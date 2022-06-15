import express from "express";
const {
    Sequelize,
    DATE
} = require("sequelize");
import {
    Cards,
    Columns,
    Users
} from "../models"
import moment from 'moment'
const router = express.Router()
const jwt = require('jsonwebtoken')

const verifyToken = require('../middleware/auth');

//@getall
router.get('/getAll', verifyToken, async (req, res) => {
    try {
        const card = await Cards.findAll({
            // attributes: [""],
            include: [{
                    model: Columns,
                    as: "column_info"
                },

                {
                    model: Users,
                    as: "user_info",
                    attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
                }
            ]


        })
        console.log(card)
        res.json({
            success: true,
            card
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal error server 11 hehe'
        })
    }

})


//@getCardbyId

router.get('/:id', verifyToken, async (req, res) => {

    try {

        console.log(req.userId)
        const card = await Cards.findByPk(req.params.id, {
            include: [{
                    model: Columns,
                    as: "column_info"
                },

                {
                    model: Users,
                    as: "user_info",
                    attributes: ["id", "userName", "realName", "email", "avatar", "phoneNumber", "createdAt", "updatedAt"]
                }
            ]


        })
        console.log(card);
        if (!card)
            return res.status(400).json({
                success: false,
                message: 'dont find user'
            })
        res.json({
            success: true,
            card
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

//@create card
router.post('/', verifyToken, async (req, res) => {
    const {
        cardName,
        description,
        dueDate,
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
            dueDate: dueDate ? moment(dueDate).format("YYYY-MM-DD") : null,
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
//@delete All
router.delete('/', verifyToken, async (req, res) => {
    try {

        const deletedCards = await Cards.destroy({
            truncate: true

        })

        res.json({
            success: true,
            message: "Xóa tat ca thanh cong"

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