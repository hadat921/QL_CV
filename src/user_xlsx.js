// const XlsxPopulate = require('xlsx-populate');
// import Users from "./models"


// function Populating() {
//     XlsxPopulate.fromBlankAsync()
//         .then(workbook => {
//             // Modify the workbook.
//             workbook.sheet("Sheet1").cell("A2").value(Users.id);
//             workbook.sheet("Sheet1").cell("B2").value(Users.createdAt);
//             workbook.sheet("Sheet1").cell("C2").value(Users.updatedAt);
//             workbook.sheet("Sheet1").cell("D2").value(Users.password);
//             workbook.sheet("Sheet1").cell("E2").value(Users.avatar);
//             workbook.sheet("Sheet1").cell("F2").value(Users.email);
//             workbook.sheet("Sheet1").cell("G2").value(Users.accessToken);
//             workbook.sheet("Sheet1").cell("H2").value(Users.phoneNumber);
//             workbook.sheet("Sheet1").cell("I2").value(Users.realName);
//             workbook.sheet("Sheet1").cell("J2").value(Users.userName);





//             // Write to file.
//             return workbook.toFileAsync("./excel/User.xlsx");
//         });

// }

// Populating()