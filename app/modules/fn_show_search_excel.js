
const func_main = require("./fn_main");
  var SQL_Excel_plc_data = [];
  
  // TÌM KIẾM BÁO CÁO  Ở INDEX
  module.exports.func_show_search_excel = function (socket) {
    
    //Hàm show
    func_main.fn_main_show(
      socket,
      "msg_plc_data_Show",
      "plc_data",
      "plc_data_Show"
    );

    func_main.fn_main_show(
        socket,
        "msg_import_Show",
        "import_excel",
        "import_Show"
      );
    // Hàm tìm kiếm và xuất báo cáo
    func_main.fn_main_search_plc_data(socket, SQL_Excel_plc_data);
  
  };
  
  