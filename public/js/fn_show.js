//------------------------------------------Tìm kiếm và phân trang bảng lỗi--------------------------------//
 
// Yêu cầu dữ liệu bảng
var currentPage = 1;
var itemsPerPage =  1000;
var totalPages = 0;
var data_full = [];

function updatePagination() {
    var totalItems = data_full.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    $("#pageNumberInput").val(currentPage + " / " + totalPages);
    $("#totalPages").text(totalPages);
}

// Khi nút "Trang trước" được nhấp
function funcprev() {
    if (currentPage > 1) {
        currentPage--;
        fn_table_master_full(data_full, currentPage, itemsPerPage);
        updatePagination();
    }
}

// Khi nút "Trang sau" được nhấp
function funcfor() {
    if (currentPage < Math.ceil(data_full.length / itemsPerPage)) {
        currentPage++;
        fn_table_master_full(data_full, currentPage, itemsPerPage);
        updatePagination();
    }
}
function funcsearch() {
    var inputPage = parseInt($("#pageNumberInput").val());
    if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= Math.ceil(data_full.length / itemsPerPage)) {
        currentPage = inputPage;
        fn_table_master_full(data_full, currentPage, itemsPerPage);
        updatePagination();
    }
    if (!isNaN(inputPage) && inputPage > totalPages) {
       
        alert("Vui lòng chọn lại số trang nhỏ hơn tổng số trang!");
    }
}

// Hiển thị dữ liệu ra bảng
function fn_table_master_single(data) {
    $("#pagination_box").css("display", "none"); // Ẩn phần tử có id là "goToPage"
       
    if (data) {
        $("#table_alarm_lr_monorail tbody").empty();
        var len = data.length;
        var txt = "<tbody>";
        var count = 0;
        if (len > 0) {
            // var startIndex = Math.max(len - 1000, 0); // Lấy index bắt đầu từ 10 phần tử cuối cùng hoặc ít hơn
            for (var i = len - 1; i >= 0 && count < 500; i--) {
                count++;
                txt += "<tr><td>" + data[i].date_time
                    + "</td><td>" + data[i].ID
                    + "</td><td>" + data[i].Status
                    + "</td><td>" + data[i].AlarmName
                    + "</td></tr>";
            }
            if (txt != "") {
                txt += "</tbody>";
                $("#table_alarm_lr_monorail").prepend(txt);
                
            }
        }
    }
     
}

function fn_table_master_full(data, currentPage, itemsPerPage) {
    if (data) {
        $("#pagination_box").css("display", "flex");
        $("#table_alarm_lr_monorail tbody").empty();
        var len = data.length;
        var startIdx = (currentPage - 1) * itemsPerPage;
        var endIdx = Math.min(startIdx + itemsPerPage, len);
        var txt = "<tbody>";

        for (var i = startIdx; i < endIdx; i++) {
            txt += "<tr><td>" + data[i].date_time
            + "</td><td>" + data[i].ID
            + "</td><td>" + data[i].Status
            + "</td><td>" + data[i].AlarmName
            + "</td></tr>";
        }
        if (txt != "") {
            txt += "</tbody>";
            $("#table_alarm_lr_monorail").prepend(txt);
            
        }
    }

}
    // Chương trình con đọc dữ liệu SQL
    function fn_Alarm_lr_monorail_Show() {
        currentPage = 1;
        socket.emit("msg_Alarm_lr_monorail_Show", "true");
        var loadingImage = document.getElementById('loadingImage');
        if (loadingImage) {loadingImage.style.display = 'block';}
        document.getElementById('alarm_lr_monorail').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
    }
    function fn_Alarm_lr_monorail_Show_() { 
        socket.on('Alarm_lr_monorail_Show', function (data) {
            fn_table_master_single(data); // Hiển thị dữ liệu bảng
            $("#pageNumberInput").val(1);
            $("#totalPages").text(1);
            document.getElementById('dtpk_Search_Start_lr_monorail').value = ""; // Gán giá trị mặc định
            document.getElementById('dtpk_Search_End_lr_monorail').value = ""; // Gán giá trị mặc định
            currentPage = 1;
            totalPages = 0;
            data_full = [];
            console.log('29');
            document.getElementById('loadingImage').style.display = 'none';
            document.getElementById('alarm_lr_monorail').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
        });
    }
 
    // Gửi yêu cầu xuất Excel qua index.js
    function fn_Alarm_lr_monorail_By_Time() {
        var startValue = document.getElementById('dtpk_Search_Start_lr_monorail').value;
        var endValue = document.getElementById('dtpk_Search_End_lr_monorail').value;
        if (startValue && endValue) { // Kiểm tra nếu cả hai giá trị đều có
            var val = [startValue, endValue];
            socket.emit('msg_Alarm_lr_monorail_ByTime', val);
            var loadingImage = document.getElementById('loadingImage');
            if (loadingImage) {loadingImage.style.display = 'block';}
            document.getElementById('alarm_lr_monorail').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
        } else {
            alert("Vui lòng chọn khoảng thời gian");
        }
    }
    
// lấy dữ liệu theo time từ phía server gửi qua
function fn_Alarm_lr_monorail_By_Time_display() {
    socket.on('Alarm_lr_monorail_ByTime', function (receivedData) {
        data_full = []; // Làm rỗng data_full trước khi nhận dữ liệu mới
        data_full = data_full.concat(receivedData);
        fn_table_master_full(data_full, currentPage, itemsPerPage);
        updatePagination();
        document.getElementById('loadingImage').style.display = 'none';
        document.getElementById('alarm_lr_monorail').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
    });
}
 