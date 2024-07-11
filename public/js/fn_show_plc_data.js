// --------------------------------------------------------------------DEV Q ---------------------------------------------------------------//

//------------------------------------------Tìm kiếm và phân trang bảng lỗi--------------------------------//
 
// Yêu cầu dữ liệu bảng
var currentPage = 1;
var itemsPerPage = 100;
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

 

function fn_table_master_single(data) {
    // $("#pagination_box").css("display", "none");  
    if (data) {
        $("#table_plc_data tbody").empty();
        var len = data.length;
        var txt = "<tbody>";
        var count = 0;
        if (len > 0) {
            for (var i = len - 1; i >= 0 && count < 500; i--) {
                count++;
                var dateTime = new Date(data[i].date_time);
                var formattedDate = dateTime.getFullYear() + "-" 
                                    + ("0" + (dateTime.getMonth() + 1)).slice(-2) + "-" 
                                    + ("0" + dateTime.getDate()).slice(-2) + " " 
                                    + ("0" + dateTime.getHours()).slice(-2) + ":" 
                                    + ("0" + dateTime.getMinutes()).slice(-2) + ":" 
                                    + ("0" + dateTime.getSeconds()).slice(-2);
                txt += "<tr><td>" + formattedDate
                    + "</td><td>" + data[i].com_data
                    + "</td><td>" + data[i].so_luong_box
                    + "</td></tr>";
            }
            if (txt != "") {
                txt += "</tbody>";
                $("#table_plc_data").prepend(txt);
            }
        }
    }
}
function fn_table_master_full(data, currentPage, itemsPerPage) {
    if (data) {
        $("#pagination_box").css("display", "flex");
        $("#table_plc_data tbody").empty();
        var len = data.length;
        var startIdx = (currentPage - 1) * itemsPerPage;
        var endIdx = Math.min(startIdx + itemsPerPage, len);
        var txt = "<tbody>";

        for (var i = startIdx; i < endIdx; i++) {
            var dateTime = new Date(data[i].date_time);
            var formattedDate = dateTime.getFullYear() + "-" 
                                    + ("0" + (dateTime.getMonth() + 1)).slice(-2) + "-" 
                                    + ("0" + dateTime.getDate()).slice(-2) + " " 
                                    + ("0" + dateTime.getHours()).slice(-2) + ":" 
                                    + ("0" + dateTime.getMinutes()).slice(-2) + ":" 
                                    + ("0" + dateTime.getSeconds()).slice(-2);
                txt += "<tr><td>" + formattedDate
                    + "</td><td>" + data[i].com_data
                    + "</td><td>" + data[i].so_luong_box
                    + "</td></tr>";
        }
        if (txt != "") {
            txt += "</tbody>";
            $("#table_plc_data").prepend(txt);
            
        }
    }

}
    // Chương trình con đọc dữ liệu SQL
    function fn_plc_data_Show() {
        currentPage = 1;
        socket.emit("msg_plc_data_Show", "true");
        var loadingImage = document.getElementById('loadingImage');
        if (loadingImage) {loadingImage.style.display = 'block';}
        document.getElementById('plc_data').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
    }
    function fn_plc_data_Show_() { 
        socket.on('plc_data_Show', function (data) {
            fn_table_master_single(data); // Hiển thị dữ liệu bảng
            $("#pageNumberInput").val(1);
            $("#totalPages").text(1);
            document.getElementById('dtpk_Start_plc_data').value = ""; // Gán giá trị mặc định
            document.getElementById('dtpk_End_plc_data').value = ""; // Gán giá trị mặc định
            currentPage = 1;
            totalPages = 0;
            data_full = [];
            console.log('29');
            document.getElementById('loadingImage').style.display = 'none';
            document.getElementById('plc_data').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
        });
    }
 
    // Gửi yêu cầu xuất Excel qua index.js
    function fn_plc_data_By_Time() {
        var startValue = document.getElementById('dtpk_Start_plc_data').value;
        var endValue = document.getElementById('dtpk_End_plc_data').value;
        if (startValue && endValue) { // Kiểm tra nếu cả hai giá trị đều có
            var val = [startValue, endValue];
            socket.emit('msg_plc_data_ByTime', val);
            var loadingImage = document.getElementById('loadingImage');
            if (loadingImage) {loadingImage.style.display = 'block';}
            document.getElementById('plc_data').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
        } else {
            alert("Vui lòng chọn khoảng thời gian");
        }
    }
    
// lấy dữ liệu theo time từ phía server gửi qua
function fn_plc_data_By_Time_display() {
    socket.on('plc_data_ByTime', function (receivedData) {
        data_full = []; // Làm rỗng data_full trước khi nhận dữ liệu mới
        data_full = data_full.concat(receivedData);
        fn_table_master_full(data_full, currentPage, itemsPerPage);
        updatePagination();
        document.getElementById('loadingImage').style.display = 'none';
        document.getElementById('plc_data').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
    });
}
 