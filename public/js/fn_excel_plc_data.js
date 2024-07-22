

// --------------------------------------------plc data----------------------------------------
/////////////////// Excel bảng plc_data dùng lưu trữ dữ liệu//////////////
function fn_excel_plc_data() {
    socket.emit("msg_Excel_Report_plc_data", true);
    var loadingImage = document.getElementById('loadingImage');
    if (loadingImage) {loadingImage.style.display = 'block';}
    document.getElementById('plc_data').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột
}

function fn_excel_display_plc_data() {
    socket.on('send_Excel_Report_plc_data', (buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "Packing_list.xlsx";
        link.click();
        document.getElementById('loadingImage').style.display = 'none';
        document.getElementById('plc_data').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
    })
    console.log('15');
}
 
 