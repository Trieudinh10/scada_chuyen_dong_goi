// --------------------------------------------------------------------DEV Q ---------------------------------------------------------------//
// <!-- ---------------------------------------SELECT OPTION -------------------------->
 
// Yêu cầu dữ liệu bảng
var currentPage_ = 1;
var itemsPerPage_ = 100;
var totalPages_ = 0;
var data_full_ = [];

function updatePagination_() {
    var totalItems = data_full_.length;
    totalPages_ = Math.ceil(totalItems / itemsPerPage_);
    $("#pageNumberInput_").val(currentPage_ + " / " + totalPages_);
    $("#totalPages_").text(totalPages_);
}

// Khi nút "Trang trước" được nhấp
function funcprev_() {
    if (currentPage_ > 1) {
        currentPage_--;
        fn_table_master_full_(data_full_, currentPage_, itemsPerPage_);
        updatePagination_();
    }
}

// Khi nút "Trang sau" được nhấp
function funcfor_() {
    if (currentPage_ < Math.ceil(data_full_.length / itemsPerPage_)) {
        currentPage_++;
        fn_table_master_full_(data_full_, currentPage_, itemsPerPage_);
        updatePagination_();
    }
}
function funcsearch_() {
    var inputPage = parseInt($("#pageNumberInput_").val());
    if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= Math.ceil(data_full_.length / itemsPerPage_)) {
        currentPage_ = inputPage;
        fn_table_master_full_(data_full_, currentPage_, itemsPerPage_);
        updatePagination_();
    }
    if (!isNaN(inputPage) && inputPage > totalPages_) {
       
        alert("Vui lòng chọn lại số trang nhỏ hơn tổng số trang!");
    }
}

function fn_table_master_single_(data) {
    $("#pagination_box_").css("display", "none"); // Ẩn phần tử có id là "goToPage"
    
    if (data) {
        $("#table_import tbody").remove();
        var len = data.length;
        var txt = "<tbody>";
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                txt += "<tr><td>" + data[i].Case_No
                    + "</td><td>" + data[i].C_B
                    + "</td><td>" + data[i].SL_Box
                    + "</td><td>" + data[i].SL_Real
                    + "</td></tr>";
            }
            txt += "</tbody>";
            $("#table_import").append(txt);
        }
    }
}
function fn_table_master_full_(data, currentPage_, itemsPerPage_) {
    if (data) {
        $("#pagination_box_").css("display", "flex");
        $("#table_import tbody").remove();
        var len = data.length;
        var startIdx = (currentPage_ - 1) * itemsPerPage_;
        var endIdx = Math.min(startIdx + itemsPerPage_, len);
        var txt = "<tbody>";
        for (var i = startIdx; i < endIdx; i++) {
            txt += "<tr><td>" + data[i].Case_No
            + "</td><td>" + data[i].C_B
            + "</td><td>" + data[i].SL_Box
            + "</td><td>" + data[i].SL_Real
            + "</td></tr>";
        }
            txt += "</tbody>";
            $("#table_import").append(txt);
            
    }

}
    // Chương trình con đọc dữ liệu SQL
    function fn_import_Show() {
        currentPage_ = 1;
        socket.emit("msg_import_Show", "true");
        var loadingImage_ = document.getElementById('loadingImage_');
        if (loadingImage_) {loadingImage_.style.display = 'block';}
        document.getElementById('import').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
    }
    function fn_import_Show_() { 
        socket.on('import_Show', function (data) {
            fn_table_master_single_(data); // Hiển thị dữ liệu bảng
            $("#pageNumberInput_").val(1);
            $("#totalPages_").text(1);
             document.getElementById('caseNoSelector').value = ""; // Gán giá trị mặc định
            currentPage_ = 1;
            totalPages_ = 0;
            data_full_ = [];
            console.log('29');
            document.getElementById('loadingImage_').style.display = 'none';
            document.getElementById('import').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
        });
    }
 
    function fn_import_By_Time() {
        var caseNoSelector = document.getElementById('caseNoSelector');
        var searchValue = caseNoSelector.value; // Lấy giá trị từ selector
        socket.emit('msg_import_ByTime', searchValue);
        var loadingImage_ = document.getElementById('loadingImage_');
        if (loadingImage_) {
            loadingImage_.style.display = 'block';
        }
        document.getElementById('import').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
    }
    
    // Lấy dữ liệu từ phía server gửi qua
    function fn_import_By_Time_display() {
        socket.on('import_ByTime', function (receivedData) {
            data_full_ = []; // Làm rỗng data_full_ trước khi nhận dữ liệu mới
            data_full_ = data_full_.concat(receivedData);
            fn_table_master_full_(data_full_, currentPage_, itemsPerPage_);
            updatePagination_();
            document.getElementById('loadingImage_').style.display = 'none';
            document.getElementById('import').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
        });
    }
    

    function case_no(){
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
   
    