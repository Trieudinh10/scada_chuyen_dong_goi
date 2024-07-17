// --------------------------------------------------------------------DEV Q ---------------------------------------------------------------//
// <!-- ---------------------------------------SELECT OPTION -------------------------->
 
// Yêu cầu dữ liệu bảng
var currentPage__ = 1;
var itemsPerPage__ = 1000;
var totalPages__ = 0;
var data_full__ = [];

function updatePagination__() {
    var totalItems = data_full__.length;
    totalPages__ = Math.ceil(totalItems / itemsPerPage__);
    $("#pageNumberInput__").val(currentPage__ + " / " + totalPages__);
    $("#totalPages__").text(totalPages__);
}

// Khi nút "Trang trước" được nhấp
function funcprev__() {
    if (currentPage__ > 1) {
        currentPage__--;
        fn_table_master_full__(data_full__, currentPage__, itemsPerPage__);
        updatePagination__();
    }
}

// Khi nút "Trang sau" được nhấp
function funcfor__() {
    if (currentPage__ < Math.ceil(data_full__.length / itemsPerPage__)) {
        currentPage__++;
        fn_table_master_full__(data_full__, currentPage__, itemsPerPage__);
        updatePagination__();
    }
}
function funcsearch__() {
    var inputPage = parseInt($("#pageNumberInput__").val());
    if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= Math.ceil(data_full__.length / itemsPerPage__)) {
        currentPage__ = inputPage;
        fn_table_master_full__(data_full__, currentPage__, itemsPerPage__);
        updatePagination__();
    }
    if (!isNaN(inputPage) && inputPage > totalPages__) {
       
        alert("Vui lòng chọn lại số trang nhỏ hơn tổng số trang!");
    }
}

function fn_table_master_single__(data) {
    $("#pagination_box__").css("display", "none"); // Ẩn phần tử có id là "goToPage"
    if (data) {
        $("#table_import_selector tbody").remove();
        var len = data.length;
        var txt = "<tbody>";
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var resultClass = "";
            if (data[i].result === 'Đủ') {
                resultClass = "green_background";
            } else if (data[i].result === 'Thiếu') {
                resultClass = "red_background";
            } else if (data[i].result === 'Dư') {
                resultClass = "yellow_background";
            }
            txt += "<tr><td>" + data[i].Case_No
            + "</td><td>" + data[i].C_B
            + "</td><td>" + data[i].SL_Box
            + "</td><td>" + data[i].SL_Real
            + "</td><td class='" + resultClass + "'>" + data[i].result
            + "</td></tr>";
            }
           
                txt += "</tbody>";
                $("#table_import_selector").append(txt);
            
        }
    }
}

 
function fn_table_master_full__(data, currentPage__, itemsPerPage__) {
    if (data) {
        $("#pagination_box__").css("display", "flex");
        $("#table_import_selector tbody").remove();
        var len = data.length;
        var startIdx = (currentPage__ - 1) * itemsPerPage__;
        var endIdx = Math.min(startIdx + itemsPerPage__, len);
        var txt = "<tbody>";
        for (var i = startIdx; i < endIdx; i++) {
            var resultClass = "";
            if (data[i].result === 'Đủ') {
                resultClass = "green_background";
            } else if (data[i].result === 'Thiếu') {
                resultClass = "red_background";
            } else if (data[i].result === 'Dư') {
                resultClass = "yellow_background";
            }
            txt += "<tr><td>" + data[i].Case_No
            + "</td><td>" + data[i].C_B
            + "</td><td>" + data[i].SL_Box
            + "</td><td>" + data[i].SL_Real
            + "</td><td class='" + resultClass + "'>" + data[i].result
            + "</td></tr>";
        }
        txt += "</tbody>";
        $("#table_import_selector").append(txt);
    }
}
    // Chương trình con đọc dữ liệu SQL
    function fn_import_selector_Show() {
        currentPage__ = 1;
        socket.emit("msg_import_selector_Show", "true");
        var loadingImage__ = document.getElementById('loadingImage__');
        if (loadingImage__) {loadingImage__.style.display = 'block';}
        document.getElementById('import_selector').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
    }
    function fn_import_selector_Show_() { 
        socket.on('import_selector_Show', function (data) {
            fn_table_master_single__(data); // Hiển thị dữ liệu bảng
            $("#pageNumberInput__").val(1);
            $("#totalPages__").text(1);
             document.getElementById('caseNoSelector').value = ""; // Gán giá trị mặc định
             document.getElementById('resultSelector').value = ""; // Gán giá trị mặc định
            currentPage__ = 1;
            totalPages__ = 0;
            data_full__ = [];
            console.log('30');
            document.getElementById('loadingImage__').style.display = 'none';
            document.getElementById('import_selector').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
        });
    }
 
    function fn_import_selector_By_Time() {
        var caseNoSelector = document.getElementById('caseNoSelector');
        var resultSelector = document.getElementById('resultSelector');
        var searchValueCaseNo = caseNoSelector.value; // Lấy giá trị từ selector Case No
        var searchValueResult = resultSelector.value; // Lấy giá trị từ selector Result
    
        socket.emit('msg_import_ByTime_selector', { caseNo: searchValueCaseNo, result: searchValueResult });
    
        var loadingImage__ = document.getElementById('loadingImage__');
        if (loadingImage__) {
            loadingImage__.style.display = 'block';
        }
        document.getElementById('import_selector').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
    }
    
    
    // Lấy dữ liệu từ phía server gửi qua
    function fn_import_selector_By_Time_display() {
        socket.on('import_ByTime_selector', function (receivedData) {
            data_full__ = []; // Làm rỗng data_full__ trước khi nhận dữ liệu mới
            data_full__ = data_full__.concat(receivedData);
            fn_table_master_full__(data_full__, currentPage__, itemsPerPage__);
            updatePagination__();
            document.getElementById('loadingImage__').style.display = 'none';
            document.getElementById('import_selector').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
        });
    }
    

    function fn_case_no(){
    // Yêu cầu server gửi danh sách các giá trị Case_No không lặp lại
    socket.emit('get_case_no_options');
    // Nhận danh sách các giá trị Case_No từ server và cập nhật selector
    socket.on('case_no_options', function(caseNoOptions) {
        var caseNoSelector = document.getElementById('caseNoSelector');
        caseNoOptions.forEach(function(optionValue) {
            var option = document.createElement('option');
            option.value = optionValue;
            option.text = optionValue;
            caseNoSelector.add(option);
         });
        });
    }
    function fn_result_options(){
        // Yêu cầu server gửi danh sách các giá trị result không lặp lại
        socket.emit('get_result_options');
        // Nhận danh sách các giá trị result từ server và cập nhật selector
        socket.on('result_options', function(resultOptions) {
          var resultSelector = document.getElementById('resultSelector');
          resultOptions.forEach(function(optionValue) {
            var option = document.createElement('option');
            option.value = optionValue;
            option.text = optionValue;
            resultSelector.add(option);
          });
        });
      }


    // setInterval(fn_import_selector_Show, 500);