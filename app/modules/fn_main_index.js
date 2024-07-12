const func_main = require("./fn_main");
 

var SQL_Excel_plc_data = [];

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

  //------------------------Tìm kiếm kiểu Real PLC
  func_main.fn_main_search_import(socket);

  //------------------------Tìm kiếm kiểu slector option
  func_main.fn_main_search_import1(socket);

  //------------------------So sánh
  // func_main.fn_main_compare();
  
};
