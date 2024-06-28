const express = require('express');
const app = express();
const connection = require('../../config/database');
var server = require("http").Server(app);
var io = require("socket.io")(server);

// KHỞI TẠO KẾT NỐI PLC
var nodes7 = require('nodes7');
var conn_plc = new nodes7; // PLC1
// Tạo địa chỉ kết nối (slot = 2 nếu là 300/400, slot = 1 nếu là 1200/1500)
conn_plc.initiateConnection({port: 102, host: '10.14.85.26', rack: 0, slot: 1}, PLC_connected);

// Bảng tag trong Visual Studio Code
const tag = require('./tag');
const tags_list = tag.tags_list();

// GỬI DỮ LIỆu TAG CHO PLC
// Tag Name load
var taglodash = require('lodash'); // Chuyển variable sang array
var tag_Listarr = taglodash.keys(tags_list);
// GỬI DỮ LIỆu TAG CHO PLC
function PLC_connected(err) {
    if (typeof(err) !== "undefined") {
        console.log(err); // Hiển thị lỗi nếu không kết nối được với PLC
    }
    conn_plc.setTranslationCB(function(tag) { return tags_list[tag]; }); // Đưa giá trị đọc lên từ PLC và mảng
    conn_plc.addItems(tag_Listarr);
}

// Đọc dữ liệu từ PLC và đưa vào array tags
var arr_tag_value = []; // Tạo một mảng lưu giá trị tag đọc về
var obj_tag_value = {}; // Tạo một đối tượng lưu giá trị tag đọc về
function valuesReady(anythingBad, values) {
    if (anythingBad) { console.log("Lỗi khi đọc dữ liệu tag"); } // Cảnh báo lỗi
    var lodash = require('lodash'); // Chuyển variable sang array
    arr_tag_value = lodash.map(values, (item) => item);
    console.log("Data S1", arr_tag_value); // Hiển thị giá trị để kiểm tra
    obj_tag_value = values;
}

let com_data = [];

function fn_tag() {
    const data_keys = [
        "DATA", "DATA_1", "DATA_2", "DATA_3", "DATA_4", "DATA_5",
        "DATA_6", "DATA_7", "DATA_8", "DATA_9", "DATA_10",
        "DATA_11", "DATA_12", "DATA_13", "DATA_14", "DATA_15",
        "DATA_16", "DATA_17", "DATA_18", "DATA_19"
    ];
    
    const other_keys = ["Trig_Data"];
    
    // Kiểm tra obj_tag_value trước khi truy cập
    if (!obj_tag_value) {
        console.log("obj_tag_value is undefined");
        return;
    }

    // Tạo com_data từ các biến DATA đến DATA_19 bằng cách ghép chúng lại thành một chuỗi
    com_data = data_keys.map(key => obj_tag_value[key] !== undefined ? obj_tag_value[key] : "").join('');
    
    // In ra giá trị của com_data
    console.log("com_data", com_data);

    // Gửi com_data qua socket
    io.sockets.emit("com_data", com_data);

    // Gửi từng sự kiện qua socket cho các biến từ DATA đến DATA_19
    data_keys.forEach(event => {
        io.sockets.emit(event, obj_tag_value[event]);
    });

    // Gửi từng sự kiện qua socket cho các biến khác
    other_keys.forEach(event => {
        io.sockets.emit(event, obj_tag_value[event]);
    });
    obj_tag_value["com_data"] = com_data;
    io.sockets.emit("com_data", obj_tag_value["com_data"]);
}



let old_com_data = "";
let so_luong_box = "";


let oldTrigData = 0;

function plc_tag() {
    const sqltable_Name = "plc_data";
    // Lấy thời gian hiện tại
    var toffset = (new Date()).getTimezoneOffset() * 60000; // Vùng Việt Nam GMT+7
    var temp_datenow = new Date();
    var timeNow = (new Date(temp_datenow - toffset)).toISOString().slice(0, -1).replace("T", " ");
    var timeNow_toSQL = "'" + timeNow + "'";

    // Dữ liệu đọc từ các tag
    let so_luong_box = parseInt(obj_tag_value["so_luong_box"]) || 0;
    let com_data = obj_tag_value["com_data"];

    // Chèn dữ liệu mới khi com_data thay đổi
    if (com_data !== old_com_data) {
        var insertQuery = `INSERT INTO ${sqltable_Name} (date_time, so_luong_box, com_data) VALUES (${timeNow_toSQL}, '${so_luong_box}', '${com_data}');`;
        connection.query(insertQuery, function(err, result) {
            if (err) {
                console.log('SQL Error:', err);
            } else {
                console.log('SQL Insert Result:', result);
            }
        });
        old_com_data = com_data;
    }

    // Kiểm tra và cập nhật so_luong_box nếu Trig_Data chuyển từ 0 sang 1
    if (obj_tag_value["Trig_Data"] === 1 && oldTrigData === 0) {
        var updateQuery = `UPDATE ${sqltable_Name} SET so_luong_box = so_luong_box + 1 WHERE com_data = '${com_data}'`;
        connection.query(updateQuery, function(err, result) {
            if (err) {
                console.log('SQL Error:', err);
            } else {
                console.log('SQL Update Result:', result);
                // Cập nhật giá trị mới trong obj_tag_value sau khi cập nhật vào cơ sở dữ liệu
                obj_tag_value["so_luong_box"] = so_luong_box + 1;
                // Đặt lại giá trị Trig_Data về 0
                obj_tag_value["Trig_Data"] = 0;
                io.sockets.emit("Trig_Data", 0); // Gửi cập nhật qua socket nếu cần thiết
            }
        });
    }

    // Cập nhật oldTrigData để theo dõi trạng thái trước đó của Trig_Data
    oldTrigData = obj_tag_value["Trig_Data"];
}

// // HÀM GHI DỮ LIỆU XUỐNG PLC
// function valuesWritten(anythingBad) {
//     if (anythingBad) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
//     console.log("Done writing.");
// }

// // Nhận các bức điện được gửi từ trình duyệt
// io.on("connection", function(socket){
//     // Bật tắt động cơ M1
//         socket.on("Trig_Data", function(data){
//         conn_plc.writeItems('Trig_Data', data, valuesWritten);
// });
// });






// Hàm chức năng scan giá trị
function fn_read_data_scan() {
    conn_plc.readAllItems(valuesReady);
    fn_tag();
    plc_tag();
}

// Time cập nhật mỗi 1s
setInterval(
    () => fn_read_data_scan(),
    1000 // 1s = 1000ms
);

module.exports = {
    fn_tag,
    plc_tag
};