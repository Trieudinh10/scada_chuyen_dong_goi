const func_main = require("./fn_main");
const path = require("path");
const connection = require("../../config/database");
var SQL_Excel_plc_data = [];

var io = require("../../index");
// TÌM KIẾM BÁO CÁO  Ở INDEX
module.exports.func_main_index = function (socket) {
  //Hàm show data plc
  func_main.fn_main_show(
    socket,
    "msg_plc_data_Show",
    "plc_data",
    "plc_data_Show"
  );

  //Hàm show import
  func_main.fn_main_show(
    socket,
    "msg_import_Show",
    "import_excel",
    "import_Show"
  );

  //------------------------Tìm kiếm kiểu date
  func_main.fn_main_search_plc_data(socket, SQL_Excel_plc_data);

  //------------------------Tìm kiếm kiểu slector option
  func_main.fn_main_search_import1(socket);
};

 //------------------------Tìm kiếm kiểu Real PLC
module.exports.fn_main_search_import = function (io,obj_tag_value) {
let value_search = obj_tag_value["com_data_case"];
// console.log("Giá trị zzzzzzzzzzz-----------------------------------------------",value_search);
var sqltable_Name = "import_excel"; // Tên bảng
var dt_col_Name = "Case_No"; // Tên cột tìm kiếm

var Query = "SELECT * FROM " + sqltable_Name + " WHERE " + dt_col_Name + " = ?;";
connection.query(Query, [value_search], function (err, results, fields) {
  if (err) {
    console.log(err);
  } else {
    const objectifyRawPacket = (row) => ({ ...row });
    const convertedResponse = results.map(objectifyRawPacket);
    io.sockets.emit("import_ByTime", convertedResponse);
// console.log("-------------------ok------------------------------------------------");
  }
});

}

//------------------------So sánh
module.exports.fn_main_compare = function (io, obj_tag_value) {
  var value_partno = obj_tag_value["com_data"];
  var value_caseno = obj_tag_value["com_data_case"];
  // console.log("Giá trị xxxxxxxxxxxxxxx-----------------------------------------------", value_partno);
  // console.log("Giá trị yyyyyyyyyyyyyyy-----------------------------------------------", value_caseno);
  var sqltable_Name = "import_excel"; // Tên bảng
  var dt_col_Name = "C_B"; // Tên cột tìm kiếm
  var dt_col_Name1 = "Case_No"; // Tên cột tìm kiếm
  var fields = ["SL_Box", "SL_Real"]; // Các trường cần lấy
  
  // Corrected query with two conditions
  var Query = "SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?";

  connection.query(Query, [fields, sqltable_Name, dt_col_Name, value_partno, dt_col_Name1, value_caseno], function (err, results, fields) {
    if (err) {
      console.log(err);
    } else {
      let compareResults = results.map(row => {
        const slBox = parseInt(row.SL_Box, 10);
        const slReal = parseInt(row.SL_Real, 10);

        let comparison;
        if (slBox === slReal) {
          // Đủ
          comparison = 'full';
        } else if (slBox > slReal) {
          // Thiếu
          comparison = 'shortage';
        } else {
          // Dư
          comparison = 'over';
        }

        return {
          compareResult: comparison,
          slBox: slBox,
          slReal: slReal
        };
      });

      io.sockets.emit("compare_response", compareResults);

      // Log each comparison result
      compareResults.forEach(result => {
        // console.log(`Kết quả so sánh: ${result.compareResult}, SL_Box: ${result.slBox}, SL_Real: ${result.slReal}`);
      });
    }
  });
};
