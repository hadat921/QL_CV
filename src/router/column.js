import express from "express";
import {
    Users
} from "../models"
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
const XlsxPopulate = require('xlsx-populate');

//@get columns by ID
router.get('/:id', verifyToken, async (req, res) => {

    try {


        const columns = await Columns.findByPk(req.params.id)
        console.log(columns);
        if (!columns)
            return res.status(400).json({
                success: false,
                message: 'dont find user'
            })
        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                // Modify the workbook.
                workbook.sheet("Sheet1").cell("A1").value("id");
                workbook.sheet("Sheet1").cell("B1").value(`columnName`);
                workbook.sheet("Sheet1").cell("C1").value(`createColumnBy`);
                workbook.sheet("Sheet1").cell("D1").value(`description`);
                workbook.sheet("Sheet1").cell("E1").value(`createdAt`);
                workbook.sheet("Sheet1").cell("F1").value(`updatedAt`);

                workbook.sheet("Sheet1").cell("A2").value(`${columns.id}`);
                workbook.sheet("Sheet1").cell("B2").value(`${columns.columnName}`);
                workbook.sheet("Sheet1").cell("C2").value(`${columns.createColumnBy}`);
                workbook.sheet("Sheet1").cell("D2").value(`${columns.description}`);
                workbook.sheet("Sheet1").cell("E2").value(`${columns.createdAt}`);
                workbook.sheet("Sheet1").cell("F2").value(`${columns.updatedAt}`);


                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/Test/src/excel/ColumnById.xlsx");
            });
        res.json({
            success: true,
            columns
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

//@get All colums
router.get('', verifyToken, async (req, res) => {
    try {
        const columns = await Columns.findAll({
            include: [{
                    model: Cards,
                    as: "cards"
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
                workbook.sheet("Sheet1").cell("B1").value(`columnName`);
                workbook.sheet("Sheet1").cell("C1").value(`createColumnBy`);
                workbook.sheet("Sheet1").cell("D1").value(`description`);
                workbook.sheet("Sheet1").cell("E1").value(`createdAt`);
                workbook.sheet("Sheet1").cell("F1").value(`updatedAt`);


                let start_row = 2
                for (let i = 1; i <= columns.length; i++) {


                    workbook.sheet("Sheet1").cell("A" + start_row).value(`${colums[i-1].id}`);
                    workbook.sheet("Sheet1").cell("B" + start_row).value(`${colums[i-1].columnName}`);
                    workbook.sheet("Sheet1").cell("C" + start_row).value(`${colums[i-1].createColumnBy}`);
                    workbook.sheet("Sheet1").cell("D" + start_row).value(`${colums[i-1].description}`);


                    workbook.sheet("Sheet1").cell("E" + start_row).value(`${colums[i-1].createdAt}`);
                    workbook.sheet("Sheet1").cell("F" + start_row).value(`${colums[i-1].updatedAt}`);
                    start_row++;

                }



                // Write to file.
                return workbook.toFileAsync("/home/ha/Desktop/Test/src/excel/ColumnsAll.xlsx");
            });
        res.json({
            success: true,
            columns
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal error server 11 hehe'
        })
    }

})

//@create columns
router.post('', verifyToken, async (req, res) => {

    const {
        columnName,
        description,


    } = req.body
    console.log(req.body)
    if (!columnName)
        return res.status(400).json({
            success: false,
            message: "colums fail"
        })
    try {
        const newColumns = await Columns.create({
            createColumnBy: req.userId,
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
//@update columns
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
            message: "Update thành công"
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