const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const i18n = require("i18n");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const indexRouter = require('./routes/indexRouter');

const app = express();

//.ENV
dotenv.config();

app.use(express.static("public"));
app.use(express.json()); //phản hồi ở dạng json
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set("views", "./views");
app.set('views', path.resolve(__dirname, 'views'));
app.use(i18n.init);

var server = require("http").Server(app);
var io = require("socket.io")(server);

//CONECT SERVER
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});

//LANGUAGE
i18n.configure({
  locales:['en', 'vi'],
  directory: __dirname + '/locales',
 cookie: 'lang',
 });
app.use('/change-lang/:lang', (req, res) => { 
  res.cookie('lang', req.params.lang, { maxAge: 900000 });
  res.redirect('back');
});

//ROUTES
// app.use(authRouter);
app.use(indexRouter);

const {fn_tag} = require('./public/js/fn_tag.js');
fn_tag();
const {plc_tag} = require('./public/js/sql.js')
plc_tag();















// /////////////////////////////////////////////////////////////////////////////////////////////

// // KHỞI TẠO KẾT NỐI PLC
// var nodes7 = require('nodes7');
// var conn_plc = new nodes7; // PLC1
// // Tạo địa chỉ kết nối (slot = 2 nếu là 300/400, slot = 1 nếu là 1200/1500)
// conn_plc.initiateConnection({port: 102, host: '10.14.85.26', rack: 0, slot: 1}, PLC_connected);

// // Bảng tag trong Visual Studio Code
// const tag = require('./public/js/tag');
// const tags_list = tag.tags_list();

// // GỬI DỮ LIỆu TAG CHO PLC
// // Tag Name load
// var taglodash = require('lodash'); // Chuyển variable sang array
// var tag_Listarr = taglodash.keys(tags_list);
// // GỬI DỮ LIỆu TAG CHO PLC
// function PLC_connected(err) {
//     if (typeof(err) !== "undefined") {
//         console.log(err); // Hiển thị lỗi nếu không kết nối được với PLC
//     }
//     conn_plc.setTranslationCB(function(tag) { return tags_list[tag]; }); // Đưa giá trị đọc lên từ PLC và mảng
//     conn_plc.addItems(tag_Listarr);
// }

// // Đọc dữ liệu từ PLC và đưa vào array tags
// var arr_tag_value = []; // Tạo một mảng lưu giá trị tag đọc về
// var obj_tag_value = {}; // Tạo một đối tượng lưu giá trị tag đọc về
// function valuesReady(anythingBad, values) {
//     if (anythingBad) { console.log("Lỗi khi đọc dữ liệu tag"); } // Cảnh báo lỗi
//     var lodash = require('lodash'); // Chuyển variable sang array
//     arr_tag_value = lodash.map(values, (item) => item);
//     console.log("Data S1", arr_tag_value); // Hiển thị giá trị để kiểm tra
//     obj_tag_value = values;
// }

// let com_data = [];

// function fn_tag() {
//     const data_keys = [
//         "DATA", "DATA_1", "DATA_2", "DATA_3", "DATA_4", "DATA_5",
//         "DATA_6", "DATA_7", "DATA_8", "DATA_9", "DATA_10",
//         "DATA_11", "DATA_12", "DATA_13", "DATA_14", "DATA_15",
//         "DATA_16", "DATA_17", "DATA_18", "DATA_19"
//     ];
    
//     const other_keys = ["Trig_Data", "Response_data"];
    
//     // Tạo com_data từ các biến DATA đến DATA_19 bằng cách ghép chúng lại thành một chuỗi
//     com_data = data_keys.map(key => obj_tag_value[key] !== undefined ? obj_tag_value[key] : "").join('');
    
//     // In ra giá trị của com_data
//     console.log("com_data", com_data);

//     // Gửi com_data qua socket
//     io.sockets.emit("com_data", com_data);

//     // Gửi từng sự kiện qua socket cho các biến từ DATA đến DATA_19
//     data_keys.forEach(event => {
//         io.sockets.emit(event, obj_tag_value[event]);
//     });

//     // Gửi từng sự kiện qua socket cho các biến khác
//     other_keys.forEach(event => {
//         io.sockets.emit(event, obj_tag_value[event]);
//     });
//     obj_tag_value["com_data"] = com_data;
//     io.sockets.emit("com_data", obj_tag_value["com_data"]);
// }


// // Hàm chức năng scan giá trị
// function fn_read_data_scan() {
//     conn_plc.readAllItems(valuesReady);
//     fn_tag();
//     plc_tag();
// }

// // Time cập nhật mỗi 1s
// setInterval(
//     () => fn_read_data_scan(),
//     1000 // 1s = 1000ms
// );






















// // // Khởi tạo SQL
// // var mysql = require('mysql2');

// // var connection = mysql.createConnection({
// //   host: "localhost",
// //   user: "root",
// //   password: "123456",
// //   database: "sql_seaport",
// //   dateStrings:true // Hiển thị không có T và Z
// // });


// const connection = require('./config/database');

// let old_DATA_19 = "";
// function plc_tag() {
//     const sqltable_Name = "plc_data";
//     // Lấy thời gian hiện tại
//     var toffset = (new Date()).getTimezoneOffset() * 60000; // Vùng Việt Nam GMT+7
//     var temp_datenow = new Date();
//     var timeNow = (new Date(temp_datenow - toffset)).toISOString().slice(0, -1).replace("T", " ");
//     var timeNow_toSQL = "'" + timeNow + "',";

//     // Dữ liệu đọc từ các tag
//     let DATA = "'" + obj_tag_value["DATA"] + "',";
//     let DATA_1 = "'" + obj_tag_value["DATA_1"] + "',";
//     let DATA_2 = "'" + obj_tag_value["DATA_2"] + "',";
//     let DATA_3 = "'" + obj_tag_value["DATA_3"] + "',";
//     let DATA_4 = "'" + obj_tag_value["DATA_4"] + "',";
//     let DATA_5 = "'" + obj_tag_value["DATA_5"] + "',";
//     let DATA_6 = "'" + obj_tag_value["DATA_6"] + "',";
//     let DATA_7 = "'" + obj_tag_value["DATA_7"] + "',";
//     let DATA_8 = "'" + obj_tag_value["DATA_8"] + "',";
//     let DATA_9 = "'" + obj_tag_value["DATA_9"] + "',";
//     let DATA_10 = "'" + obj_tag_value["DATA_10"] + "',";
//     let DATA_11 = "'" + obj_tag_value["DATA_11"] + "',";
//     let DATA_12 = "'" + obj_tag_value["DATA_12"] + "',";
//     let DATA_13 = "'" + obj_tag_value["DATA_13"] + "',";
//     let DATA_14 = "'" + obj_tag_value["DATA_14"] + "',";
//     let DATA_15 = "'" + obj_tag_value["DATA_15"] + "',";
//     let DATA_16 = "'" + obj_tag_value["DATA_16"] + "',";
//     let DATA_17 = "'" + obj_tag_value["DATA_17"] + "',";
//     let DATA_18 = "'" + obj_tag_value["DATA_18"] + "',";
//     let DATA_19 = "'" + obj_tag_value["DATA_19"] + "',";
//     let Trig_Data = "'" + obj_tag_value["Trig_Data"] + "',";
//     let Response_data = "'" + obj_tag_value["Response_data"] + "',";
//     let com_data = "'" + obj_tag_value["com_data"] + "'";

//     if (DATA_19 !== old_DATA_19) {
//         // Chèn dữ liệu vào SQL
//         var str1 = "INSERT INTO " + sqltable_Name + "(date_time, DATA, DATA_1, DATA_2, DATA_3, DATA_4, DATA_5, DATA_6, DATA_7, DATA_8, DATA_9, DATA_10, DATA_11, DATA_12, DATA_13, DATA_14, DATA_15, DATA_16, DATA_17, DATA_18, DATA_19, Trig_Data, Response_data,com_data) VALUES (";
//         var str2 = timeNow_toSQL
//             + DATA
//             + DATA_1
//             + DATA_2
//             + DATA_3
//             + DATA_4
//             + DATA_5
//             + DATA_6
//             + DATA_7
//             + DATA_8
//             + DATA_9
//             + DATA_10
//             + DATA_11
//             + DATA_12
//             + DATA_13
//             + DATA_14
//             + DATA_15
//             + DATA_16
//             + DATA_17
//             + DATA_18
//             + DATA_19
//             + Trig_Data
//             + Response_data
//             + com_data
//             ;
 

//         var str = str1 + str2 + ");";
//         console.log(str); // Kiểm tra câu lệnh SQL

//         // Ghi dữ liệu vào SQL
//         connection.query(str, function(err, result) {
//             if (err) {
//                 console.log('SQL Error:', err);
//             } else {
//                 console.log('SQL Result:', result);
//             }
//         });

//         old_DATA_19 = DATA_19;
//     }
// }
