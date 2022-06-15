const XlsxPopulate = require('xlsx-populate');


function Populating() {
    XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            // Modify the workbook.
            workbook.sheet("Sheet1").cell("A1").value("This is neat!");

            // Write to file.
            return workbook.toFileAsync("./Card.xlsx");
        });

}

Populating()