const express = require('express');
const app = express();
const connection = require('../../config/database');
const {fn_tag, valuesReady, obj_tag_value} = require('./fn_tag');
fn_tag();
valuesReady();

let old_com_data = "";
function plc_tag() {
    const sqltable_name = "sql_plc";
    // lay thoi gian hien tai
    var toffset = (new Date()).getTimezoneOffset()*60000; //vung viet nam gmt7+
    var temp_datenow = new Date();
    var timeNow = (new Date(temp_datenow - toffset)).toISOString().slice(0,-1).replace("T", " ");-0
    var timeNow_toSQL = "'" + timeNow + "',";

// du lieu doc tu cac tag
    DATA = "'" + obj_tag_value["DATA"] + "',";
    DATA_1 = "'" + obj_tag_value["DATA_1"] + "',";
    DATA_2 = "'" + obj_tag_value["DATA_2"] + "',";
    DATA_3 = "'" + obj_tag_value["DATA_3"] + "',";
    DATA_4 = "'" + obj_tag_value["DATA_4"] + "',";
    DATA_5 = "'" + obj_tag_value["DATA_5"] + "',";
    DATA_6 = "'" + obj_tag_value["DATA_6"] + "',";
    DATA_7 = "'" + obj_tag_value["DATA_7"] + "',";
    DATA_8 = "'" + obj_tag_value["DATA_8"] + "',";
    DATA_9 = "'" + obj_tag_value["DATA_9"] + "',";
    DATA_10 = "'" + obj_tag_value["DATA_10"] + "',";
    DATA_11 = "'" + obj_tag_value["DATA_11"] + "',";
    DATA_12 = "'" + obj_tag_value["DATA_12"] + "',";
    DATA_13 = "'" + obj_tag_value["DATA_13"] + "',";
    DATA_14 = "'" + obj_tag_value["DATA_14"] + "',";
    DATA_15 = "'" + obj_tag_value["DATA_15"] + "',";
    DATA_16 = "'" + obj_tag_value["DATA_16"] + "',";
    DATA_17 = "'" + obj_tag_value["DATA_17"] + "',";
    DATA_18 = "'" + obj_tag_value["DATA_18"] + "',";
    DATA_19 = "'" + obj_tag_value["DATA_19"] + "',";
    Trig_Data = "'" + obj_tag_value["Trig_Data"] + "',";
    Response_data = "'" + obj_tag_value["Response_data"] + "',";
    com_data = "'" + obj_tag_value["com_data"] + "',";

    if(com_data !== old_com_data) {
        //chen du liêu vao dql
        var str1 = "INSERT INTO" + sqltable_name + "(date_time, DATA, DATA_1, DATA_2, DATA_3, DATA_4, DATA_5, DATA_6, DATA_7, DATA_8, DATA_9, DATA_10, DATA_11, DATA_12, DATA_13, DATA_14, DATA_15, DATA_16, DATA_17, DATA_18, DATA_19, Trig_Data, Response_data, com_data) VALUES (";
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
            // ghi du lieu canh bao vao sql
            connection.query(str, function(err, result){
                if (err){
                    console.log(err);
                } else {}
            });
            old_com_data = com_data
    }
}

module.exports = {
    plc_tag
}