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
const XlsxPopulate = require('xlsx-populate');

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
        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                // Modify the workbook.
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value("cardName");
                workbook.sheet("Sheet1").cell("C1").value("dueDate");
                workbook.sheet("Sheet1").cell("D1").value("description");
                workbook.sheet("Sheet1").cell("E1").value("attachment");
                workbook.sheet("Sheet1").cell("F1").value("comment");
                workbook.sheet("Sheet1").cell("G1").value("createdAt");
                workbook.sheet("Sheet1").cell("H1").value("updatedAt");
                workbook.sheet("Sheet1").cell("I1").value("createBy");
                workbook.sheet("Sheet1").cell("J1").value("idColumn");

                let start_row = 2
                for (let i = 1; i <= card.length; i++) {


                    workbook.sheet("Sheet1").cell("A" + start_row).value(`${card[i-1].id}`);
                    workbook.sheet("Sheet1").cell("B" + start_row).value(`${card[i-1].cardName}`);
                    workbook.sheet("Sheet1").cell("C" + start_row).value(`${card[i-1].dueDate}`);
                    workbook.sheet("Sheet1").cell("D" + start_row).value(`${card[i-1].description}`);
                    workbook.sheet("Sheet1").cell("E" + start_row).value(`${card[i-1].attachment}`);
                    workbook.sheet("Sheet1").cell("F" + start_row).value(`${card[i-1].comment}`);
                    workbook.sheet("Sheet1").cell("G" + start_row).value(`${card[i-1].createdAt}`);
                    workbook.sheet("Sheet1").cell("H" + start_row).value(`${card[i-1].updatedAt}`);
                    workbook.sheet("Sheet1").cell("I" + start_row).value(`${card[i-1].createBy}`);
                    workbook.sheet("Sheet1").cell("J" + start_row).value(`${card[i-1].idColumn}`);
                    start_row++;

                }



                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/Test/src/excel/CardAll.xlsx");
            });
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

        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value("cardName");
                workbook.sheet("Sheet1").cell("C1").value("dueDate");
                workbook.sheet("Sheet1").cell("D1").value("description");
                workbook.sheet("Sheet1").cell("E1").value("attachment");
                workbook.sheet("Sheet1").cell("F1").value("comment");
                workbook.sheet("Sheet1").cell("G1").value("createdAt");
                workbook.sheet("Sheet1").cell("H1").value("updatedAt");
                workbook.sheet("Sheet1").cell("I1").value("createBy");
                workbook.sheet("Sheet1").cell("J1").value("idColumn");


                workbook.sheet("Sheet1").cell("A2").value(`${card.id}`);
                workbook.sheet("Sheet1").cell("B2").value(`${card.cardName}`);
                workbook.sheet("Sheet1").cell("C2").value(`${card.dueDate}`);
                workbook.sheet("Sheet1").cell("D2").value(`${card.description}`);
                workbook.sheet("Sheet1").cell("E2").value(`${card.attachment}`);
                workbook.sheet("Sheet1").cell("F2").value(`${card.comment}`);
                workbook.sheet("Sheet1").cell("G2").value(`${card.createdAt}`);
                workbook.sheet("Sheet1").cell("H2").value(`${card.updatedAt}`);
                workbook.sheet("Sheet1").cell("I2").value(`${card.createBy}`);
                workbook.sheet("Sheet1").cell("J2").value(`${card.idColumn}`);




                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/Test/src/excel/CardById.xlsx");
            });


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
            message: "Tạo thẻ công việc thành công",
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
        dueDate,
        idColumn,
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
            dueDate: dueDate ? moment(dueDate).format("YYYY-MM-DD") : null,
            idColumn: idColumn
        })

        console.log(Date.now())
        return res.status(200).json({
            success: true,
            message: "Update thanh cong",
            updatedCard,


        })



    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
})
//#region add to card
router.put('/update-card-id/:id', verifyToken, async (req, res) => {
    const {
        idColumn,
    } = req.body
    try {
        const updatedCard = await Cards.findByPk(req.params.id)

        if (!updatedCard)
            return res.status(401).json({
                success: false,
                message: 'Post k tim thay hoac user not authorrised'
            })

        await updatedCard.update({
            idColumn: idColumn
        })

        console.log(Date.now())
        return res.status(200).json({
            success: true,
            message: "Add card vào cột thành công"
        })



    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
})
//#endregion
///@delete card

router.delete('/delete-byId/:id', verifyToken, async (req, res) => {
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
            message: "Xóa thành công Card"

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

        await Cards.destroy({
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