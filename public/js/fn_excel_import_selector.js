/////////////////// Excel bảng import dùng lưu trữ dữ liệu//////////////
// -----------------Xuất theo kết quả tìm kiếm----------------------//
function fn_excel_import_selector_detail() {
    socket.emit("msg_Excel_Report_import_selector_detail", true);
    var loadingImage = document.getElementById('loadingImage__');
if (loadingImage) {loadingImage.style.display = 'block';}
document.getElementById('import_selector').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột

}
function fn_excel_display_import_selector_detail() {
    socket.on('send_Excel_Report_import_selector_detail', (buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        
        // Retrieve the values of case_no and result
        const case_no = document.getElementById('caseNoSelector').value;
        const part_no = document.getElementById('partNoSelector').value;
        const result = document.getElementById('resultSelector').value;
        
        // Set the download attribute dynamically
        link.download = `Packing_list_${case_no}_${part_no}_${result}.xlsx`;
        link.click();
        
        // Hide the loading image and re-enable pointer events
        document.getElementById('loadingImage__').style.display = 'none';
        document.getElementById('import_selector').style.pointerEvents = 'auto'; // Enable pointer events
    });
    console.log('15');
}



// -----------------Xuất theo tổng file----------------------//
function fn_excel_import_selector() {
    socket.emit("msg_Excel_Report_import_selector", true);
    var loadingImage = document.getElementById('loadingImage__');
if (loadingImage) {loadingImage.style.display = 'block';}
document.getElementById('import_selector').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột

}
function fn_excel_display_import_selector() {
    socket.on('send_Excel_Report_import_selector', (buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "Packing_list_all.xlsx";
        link.click();
        document.getElementById('loadingImage__').style.display = 'none';
        document.getElementById('import_selector').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
         
    })
    console.log('16');
}
 
 
 
 
