const path = require("path");
 
const connection = require("../../config/database");
const plc_data_excel = require("../../public/js/fn_excel");
const Excel_plc_data = require("exceljs");
 

// /Hàm tìm kiếm ở bảng lỗi
module.exports.fn_main_search_plc_data = function (socket, SQL_Excel_plc_data) {
  socket.on("msg_plc_data_ByTime", function (data) {
    // console.log('1');
    var tzoffset = new Date().getTimezoneOffset() * 60000; //offset time Việt Nam (GMT7+)
    // Lấy thời gian tìm kiếm từ date time piker
    var timeS = new Date(data[0]); // Thời gian bắt đầu
    var timeE = new Date(data[1]); // Thời gian kết thúc
    if (timeS == "Invalid Date" || timeE == "Invalid Date") {
    } else {
      // Quy đổi thời gian ra định dạng cua MySQL
      var timeS1 =
        "'" +
        new Date(timeS - tzoffset)
          .toISOString()
          .slice(0, -1)
          .replace("T", " ") +
        "'";
      var timeE1 =
        "'" +
        new Date(timeE - tzoffset)
          .toISOString()
          .slice(0, -1)
          .replace("T", " ") +
        "'";
      var timeR = timeS1 + "AND" + timeE1; // Khoảng thời gian tìm kiếm (Time Range)
      var sqltable_Name = "plc_data"; // Tên bảng
      var dt_col_Name = "date_time"; // Tên cột thời gian
      var Query1 =
        "SELECT * FROM " +
        sqltable_Name +
        " WHERE " +
        dt_col_Name +
        " BETWEEN ";
      var Query = Query1 + timeR + ";";
      connection.query(Query, function (err, results, fields) {
        if (err) {
          console.log(err);
        } else {
          const objectifyRawPacket = (row) => ({ ...row });
          const convertedResponse = results.map(objectifyRawPacket);
          socket.emit("plc_data_ByTime", convertedResponse);
          SQL_Excel_plc_data = convertedResponse; // Xuất báo cáo Excel
        }
      });
    }
  });

  socket.on("msg_Excel_Report_plc_data", () => {
    plc_data_excel.fn_excelExport_plc_data(
      Excel_plc_data,
      "CHECKLIST DỮ LIỆU HÀNG HOÁ NHÀ MÁY ĐÓNG GÓI",
      SQL_Excel_plc_data,
      "Packing_list",
      "send_Excel_Report_plc_data",
      socket
    );
  });
};

module.exports.fn_main_search_import = function (socket) {
  socket.on("msg_import_ByTime", function (value_search) {
      // Quy đổi thời gian ra định dạng của MySQL
      var sqltable_Name = "import_excel"; // Tên bảng
      var dt_col_Name = "Case_No"; // Tên cột tìm kiếm

      var Query = "SELECT * FROM " + sqltable_Name + " WHERE " + dt_col_Name + " = ?;";
      connection.query(Query, [value_search], function (err, results, fields) {
        if (err) {
          console.log(err);
        } else {
          const objectifyRawPacket = (row) => ({ ...row });
          const convertedResponse = results.map(objectifyRawPacket);
          socket.emit("import_ByTime", convertedResponse);
        }
      });
  });
}


// Show sql lên màn hình
module.exports.fn_main_show = function (
  socket,
  socket_on,
  sql_table,
  socket_emit
) {
  socket.on(socket_on, function (data) {
    var sqltable_Name = sql_table;
    var query = "SELECT * FROM " + sqltable_Name + ";";
    
      connection.query(query, function (err, results, fields) {
        const objectifyRawPacket = (row) => ({ ...row });
        try {
          const convertedResponse = results.map(objectifyRawPacket);
          socket.emit(socket_emit, convertedResponse);
        } catch (error) {
          
        }
       
      });
    
  });
};

 