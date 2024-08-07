const path = require("path");
const connection = require("../../config/database");
const form_excel = require("../../public/js/fn_file_excel");
const Excel_plc_data = require("exceljs");
const Excel_import_selector = require("exceljs");
var io = require("../../index");
// /Hàm tìm kiếm ở bảng lỗi
//------------------------Tìm kiếm kiểu date
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
    form_excel.fn_excelExport_plc_data(
      Excel_plc_data,
      "CHECKLIST DỮ LIỆU HÀNG HOÁ NHÀ MÁY ĐÓNG GÓI",
      SQL_Excel_plc_data,
      "Packing_list",
      "send_Excel_Report_plc_data",
      socket
    );
  });
};

//------------------------Tìm kiếm kiểu slector option
module.exports.fn_main_search_import_selector = function (socket,SQL_Excel_import_selector) {
  // Lấy các giá trị không lặp lại từ trường Case_No
  socket.on("get_case_no_options", function () {
    var sqltable_Name = "import_excel"; // Tên bảng
    var dt_col_Name = "Case_No"; // Tên cột

    var Query = "SELECT DISTINCT " + dt_col_Name + " FROM " + sqltable_Name + ";";
    connection.query(Query, function (err, results, fields) {
      if (err) {
        console.log(err);
      } else {
        const caseNoOptions = results.map(row => row[dt_col_Name]);
        socket.emit("case_no_options", caseNoOptions);
      }
    });
  });

// Lấy các giá trị không lặp lại từ trường Part_No
  socket.on("get_part_no_options", function () {
    var sqltable_Name = "import_excel"; // Tên bảng
    var dt_col_Name = "C_B"; // Tên cột

    var Query = "SELECT DISTINCT " + dt_col_Name + " FROM " + sqltable_Name + ";";
    connection.query(Query, function (err, results, fields) {
      if (err) {
        console.log(err);
      } else {
        const partNoOptions = results.map(row => row[dt_col_Name]);
        socket.emit("part_no_options", partNoOptions);
      }
    });
  });

  // Lấy các giá trị không lặp lại từ trường result
  socket.on("get_result_options", function () {
    var sqltable_Name = "import_excel"; // Tên bảng
    var dt_col_Name = "result"; // Tên cột

    var Query = "SELECT DISTINCT " + dt_col_Name + " FROM " + sqltable_Name + ";";
    connection.query(Query, function (err, results, fields) {
      if (err) {
        console.log(err);
      } else {
        const resultOptions = results.map(row => row[dt_col_Name]);
        socket.emit("result_options", resultOptions);
      }
    });
  });

  // Xử lý yêu cầu tìm kiếm theo giá trị Case_No và result
  socket.on("msg_import_ByTime_selector", function (searchValues) {
    var sqltable_Name = "import_excel"; // Tên bảng
    var caseNo = searchValues.caseNo;
    var partNo = searchValues.partNo;
    var result = searchValues.result;

    var Query = "SELECT * FROM " + sqltable_Name + " WHERE 1=1";
    var queryParams = [];

    if (caseNo) {
      Query += " AND Case_No = ?";
      queryParams.push(caseNo);
    }

    if (partNo) {
      Query += " AND C_B = ?";
      queryParams.push(partNo);
    }

    if (result) {
      Query += " AND result = ?";
      queryParams.push(result);
    }

    
    connection.query(Query, queryParams, function (err, results, fields) {
      if (err) {
        console.log(err);
      } else {
        const objectifyRawPacket = (row) => ({ ...row });
        const convertedResponse = results.map(objectifyRawPacket);
        socket.emit("import_ByTime_selector", convertedResponse);
        SQL_Excel_import_selector = convertedResponse; // Xuất báo cáo Excel
      }
    });
  });

  socket.on("msg_Excel_Report_import_selector_detail", () => {
    form_excel.fn_excelExport_import_selector(
      Excel_import_selector,
      "CHECKLIST DỮ LIỆU HÀNG HOÁ NHÀ MÁY ĐÓNG GÓI",
      SQL_Excel_import_selector,
      "Packing_list",
      "send_Excel_Report_import_selector_detail",
      socket
    );
  });
}

 
// Show sql lên màn hình common
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

module.exports.fn_main_slector_show = function (
  socket,
  socket_on,
  sql_table,
  socket_emit,
  SQL_Excel_import_selector
) {
  socket.on(socket_on, function (data) {
    var sqltable_Name = sql_table;
    var query = "SELECT * FROM " + sqltable_Name + ";";
    
      connection.query(query, function (err, results, fields) {
        const objectifyRawPacket = (row) => ({ ...row });
        try {
          const convertedResponse = results.map(objectifyRawPacket);
          socket.emit(socket_emit, convertedResponse);
          SQL_Excel_import_selector = convertedResponse; // Xuất báo cáo Excel
        } catch (error) {
          
        }
       
      });
    
  });
  socket.on("msg_Excel_Report_import_selector", () => {
    form_excel.fn_excelExport_import_selector(
      Excel_import_selector,
      "CHECKLIST DỮ LIỆU HÀNG HOÁ NHÀ MÁY ĐÓNG GÓI",
      SQL_Excel_import_selector,
      "Packing_list",
      "send_Excel_Report_import_selector",
      socket
    );
  });
};