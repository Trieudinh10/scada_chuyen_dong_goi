module.exports.fn_main_search_import = function (socket) {
    socket.on("msg_plc_data_ByTime", function (data) {
    
        // Quy đổi thời gian ra định dạng cua MySQL
        var sqltable_Name = "import_excel"; // Tên bảng
        var dt_col_Name = "Case_No"; // Tên cột thời gian
        var value_search ='A99'
        var Query1 =
          "SELECT * FROM " +
          sqltable_Name +
          " WHERE " +
          dt_col_Name 
        ;
        var Query = Query1 + value_search + ";";
        connection.query(Query, function (err, results, fields) {
          if (err) {
            console.log(err);
          } else {
            const objectifyRawPacket = (row) => ({ ...row });
            const convertedResponse = results.map(objectifyRawPacket);
            socket.emit("import_ByTime", convertedResponse);
           
          }
        });
      
    });
  
  
  };