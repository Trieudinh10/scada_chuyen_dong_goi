const express = require('express');
const app = express();
const connection = require('../../config/database');
const {fn_tag, valuesReady, obj_tag_value} = require('./fn_tag');
fn_tag();
valuesReady();

let old_DATA_19 = "";
function plc_tag() {
    const sqltable_Name = "plc_data";
    // Lấy thời gian hiện tại
    var toffset = (new Date()).getTimezoneOffset() * 60000; // Vùng Việt Nam GMT+7
    var temp_datenow = new Date();
    var timeNow = (new Date(temp_datenow - toffset)).toISOString().slice(0, -1).replace("T", " ");
    var timeNow_toSQL = "'" + timeNow + "',";

    // Dữ liệu đọc từ các tag
    let DATA = "'" + obj_tag_value["DATA"] + "',";
    let DATA_1 = "'" + obj_tag_value["DATA_1"] + "',";
    let DATA_2 = "'" + obj_tag_value["DATA_2"] + "',";
    let DATA_3 = "'" + obj_tag_value["DATA_3"] + "',";
    let DATA_4 = "'" + obj_tag_value["DATA_4"] + "',";
    let DATA_5 = "'" + obj_tag_value["DATA_5"] + "',";
    let DATA_6 = "'" + obj_tag_value["DATA_6"] + "',";
    let DATA_7 = "'" + obj_tag_value["DATA_7"] + "',";
    let DATA_8 = "'" + obj_tag_value["DATA_8"] + "',";
    let DATA_9 = "'" + obj_tag_value["DATA_9"] + "',";
    let DATA_10 = "'" + obj_tag_value["DATA_10"] + "',";
    let DATA_11 = "'" + obj_tag_value["DATA_11"] + "',";
    let DATA_12 = "'" + obj_tag_value["DATA_12"] + "',";
    let DATA_13 = "'" + obj_tag_value["DATA_13"] + "',";
    let DATA_14 = "'" + obj_tag_value["DATA_14"] + "',";
    let DATA_15 = "'" + obj_tag_value["DATA_15"] + "',";
    let DATA_16 = "'" + obj_tag_value["DATA_16"] + "',";
    let DATA_17 = "'" + obj_tag_value["DATA_17"] + "',";
    let DATA_18 = "'" + obj_tag_value["DATA_18"] + "',";
    let DATA_19 = "'" + obj_tag_value["DATA_19"] + "',";
    let Trig_Data = "'" + obj_tag_value["Trig_Data"] + "',";
    let Response_data = "'" + obj_tag_value["Response_data"] + "',";
    let com_data = "'" + obj_tag_value["com_data"] + "'";

    if (DATA_19 !== old_DATA_19) {
        // Chèn dữ liệu vào SQLs
        var str1 = "INSERT INTO " + sqltable_Name + "(date_time, DATA, DATA_1, DATA_2, DATA_3, DATA_4, DATA_5, DATA_6, DATA_7, DATA_8, DATA_9, DATA_10, DATA_11, DATA_12, DATA_13, DATA_14, DATA_15, DATA_16, DATA_17, DATA_18, DATA_19, Trig_Data, Response_data,com_data) VALUES (";
        var str2 = timeNow_toSQL
            + DATA
            + DATA_1
            + DATA_2
            + DATA_3
            + DATA_4
            + DATA_5
            + DATA_6
            + DATA_7
            + DATA_8
            + DATA_9
            + DATA_10
            + DATA_11
            + DATA_12
            + DATA_13
            + DATA_14
            + DATA_15
            + DATA_16
            + DATA_17
            + DATA_18
            + DATA_19
            + Trig_Data
            + Response_data
            + com_data
            ;
 

        var str = str1 + str2 + ");";
        console.log(str); // Kiểm tra câu lệnh SQL

        // Ghi dữ liệu vào SQL
        connection.query(str, function(err, result) {
            if (err) {
                console.log('SQL Error:', err);
            } else {
                console.log('SQL Result:', result);
            }
        });

        old_DATA_19 = DATA_19;
    }
}

module.exports = {
    plc_tag
}