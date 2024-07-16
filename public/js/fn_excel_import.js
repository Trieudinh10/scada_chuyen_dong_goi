/////////////////// Excel bảng import dùng lưu trữ dữ liệu//////////////
function fn_excel_import() {
    socket.emit("msg_Excel_Report_import", true);
    var loadingImage = document.getElementById('loadingImage_');
if (loadingImage) {loadingImage.style.display = 'block';}
document.getElementById('import').style.pointerEvents = 'none'; // Không cho phép chọn bằng chuột

}
function fn_excel_display_import() {
    socket.on('send_Excel_Report_import', (buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "Packing_list.xlsx";
        link.click();
        document.getElementById('loadingImage_').style.display = 'none';
        document.getElementById('import').style.pointerEvents = 'auto'; // Cho phép chọn bằng chuột
         
    })
    console.log('15');
}
 

module.exports = {
    fn_excelExport_import: function (Excel_name, Name_tittle, SQL_excel, Name_report, socket_emit, socket) {
        // =====================CÁC THUỘC TÍNH CHUNG=====================
        // Lấy ngày tháng hiện tại
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let day = date_ob.getDay();
        var dayName = '';
        if (day == 0) { dayName = 'Chủ nhật,' }
        else if (day == 1) { dayName = 'Thứ hai,' }
        else if (day == 2) { dayName = 'Thứ ba,' }
        else if (day == 3) { dayName = 'Thứ tư,' }
        else if (day == 4) { dayName = 'Thứ năm,' }
        else if (day == 5) { dayName = 'Thứ sáu,' }
        else if (day == 6) { dayName = 'Thứ bảy,' }
        else { };
        // Tạo và khai báo Excel
        let workbook = new Excel_name.Workbook()
        let worksheet = workbook.addWorksheet('Packing list', {
            pageSetup: { paperSize: 9, orientation: 'landscape' },
            properties: { tabColor: { argb: 'FFC0000' } },
        });
        // Page setup (cài đặt trang)
        worksheet.properties.defaultRowHeight = 20;
        worksheet.pageSetup.margins = {
            left: 0.3, right: 0.25,
            top: 0.75, bottom: 0.75,
            header: 0.3, footer: 0.3
        };
        console.log('2');
        // =====================THẾT KẾ HEADER=====================
        // Logo công ty
        const imageId1 = workbook.addImage({
            filename: 'public/images/logo_agri.png',
            extension: 'png',
        });
        worksheet.addImage(imageId1, 'A1:B2');
        worksheet.mergeCells('A1:B2');
        // Thông tin công ty
        worksheet.getCell('C1').value = 'Công Ty TNHH Tập đoàn công nghiệp Trường Hải (THACO)';
        worksheet.getCell('C1').style = { font: { bold: true, size: 14 }, alignment: { vertical: 'middle' } };
        worksheet.getCell('C2').value = 'Địa chỉ: Tam Hiệp, Tam Kì, Núi Thành, Quảng Nam';
        worksheet.getCell('C3').value = 'Hotline: + 0904 701 605';
        // Tên báo cáo
        worksheet.getCell('A5').value = Name_tittle;
        worksheet.mergeCells('A5:F5');
        worksheet.getCell('A5').style = { font: { name: 'Times New Roman', bold: true, size: 16 }, alignment: { horizontal: 'center', vertical: 'middle' } };
        // Ngày in biểu
        worksheet.getCell('F6').value = "Ngày in biểu: " + dayName + " " + date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
        worksheet.getCell('F6').style = { font: { bold: false, italic: true }, alignment: { horizontal: 'right', vertical: 'bottom', wrapText: false } };
        // Tên nhãn các cột
        var rowpos = 7;
        var collumName = ["STT", "Case No", "C/B", "SL Box", "SL Box thực tế", "Kết quả"]
        worksheet.spliceRows(rowpos, 1, collumName);

        // =====================XUẤT DỮ LIỆU EXCEL SQL=====================
        console.log('3');
        // Dump all the data into Excel
        var rowIndex = 0;
        SQL_excel.forEach((e, index) => {
            // row 1 is the header.
            rowIndex = index + rowpos;
            // worksheet1 collum
            worksheet.columns = [
                { key: 'STT' },
                { key: 'Case_No' },
                { key: 'C_B' },
                { key: 'SL_Box' },
                { key: 'SL_Real' },
                { key: 'result' }
            ]
            worksheet.addRow({
                STT: index + 1,
                ...e
            })
        })

        // =====================STYLE CHO CÁC CỘT/HÀNG=====================
        // Style các cột nhãn
        const HeaderStyle = ['A', 'B', 'C', 'D', 'E', 'F'];
        HeaderStyle.forEach((v) => {
            worksheet.getCell(`${v}${rowpos}`).style = { font: { bold: true }, alignment: { horizontal: 'center', vertical: 'middle', wrapText: true } };
            worksheet.getCell(`${v}${rowpos}`).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        // Cài đặt độ rộng cột
        worksheet.columns.forEach((column, index) => {
            column.width = 20;
        });
        // Set width header
        worksheet.getColumn(1).width = 7;
        worksheet.getColumn(2).width = 20;
        // ++++++++++++Style cho các hàng dữ liệu++++++++++++
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            var datastartrow = rowpos;
            var rowindex = rowNumber + datastartrow;
            const rowlength = datastartrow + SQL_excel.length;
            if (rowindex >= rowlength) { rowindex = rowlength; }
            const insideColumns = ['A', 'B', 'C', 'D', 'E', 'F'];
            // Tạo border
            insideColumns.forEach((v) => {
                // Border
                worksheet.getCell(`${v}${rowindex}`).border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' }
                };
                // Alignment
                worksheet.getCell(`${v}${rowindex}`).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            });
        });

        // =====================THÊM ĐIỀU KIỆN ĐỊNH DẠNG CHO CỘT KẾT QUẢ=====================
        SQL_excel.forEach((e, index) => {
            let cell = worksheet.getCell(`F${index + rowpos + 1}`);
            if (e.result === 'Thiếu') {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF0000' }, // Màu đỏ
                };
            } else if (e.result === 'Dư') {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFF00' }, // Màu vàng
                };
            } else if (e.result === 'Đủ') {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF00FF00' }, // Màu xanh
                };
            }
        });

        // =====================THẾT KẾ FOOTER=====================
        const totalNumberOfRows = worksheet.rowCount;
        worksheet.getCell(`F${totalNumberOfRows + 2}`).value = 'Ngày …………tháng ……………năm 20………';
        worksheet.getCell(`F${totalNumberOfRows + 2}`).style = { font: { bold: true, italic: false }, alignment: { horizontal: 'right', vertical: 'middle', wrapText: false } };
        worksheet.getCell(`B${totalNumberOfRows + 3}`).value = 'Giám đốc';
        worksheet.getCell(`B${totalNumberOfRows + 4}`).value = '(Ký, ghi rõ họ tên)';
        worksheet.getCell(`B${totalNumberOfRows + 3}`).style = { font: { bold: true, italic: false }, alignment: { horizontal: 'center', vertical: 'bottom', wrapText: false } };
        worksheet.getCell(`B${totalNumberOfRows + 4}`).style = { font: { bold: false, italic: true }, alignment: { horizontal: 'center', vertical: 'top', wrapText: false } };
        worksheet.getCell(`D${totalNumberOfRows + 3}`).value = 'Trưởng ca';
        worksheet.getCell(`D${totalNumberOfRows + 4}`).value = '(Ký, ghi rõ họ tên)';
        worksheet.getCell(`D${totalNumberOfRows + 3}`).style = { font: { bold: true, italic: false }, alignment: { horizontal: 'center', vertical: 'bottom', wrapText: false } };
        worksheet.getCell(`D${totalNumberOfRows + 4}`).style = { font: { bold: false, italic: true }, alignment: { horizontal: 'center', vertical: 'top', wrapText: false } };
        worksheet.getCell(`F${totalNumberOfRows + 3}`).value = 'Người in biểu';
        worksheet.getCell(`F${totalNumberOfRows + 4}`).value = '(Ký, ghi rõ họ tên)';
        worksheet.getCell(`F${totalNumberOfRows + 3}`).style = { font: { bold: true, italic: false }, alignment: { horizontal: 'center', vertical: 'bottom', wrapText: false } };
        worksheet.getCell(`F${totalNumberOfRows + 4}`).style = { font: { bold: false, italic: true }, alignment: { horizontal: 'center', vertical: 'top', wrapText: false } };

        // =====================THỰC HIỆN XUẤT DỮ LIỆU EXCEL=====================
        //Export Link
        var currentTime = year + "_" + month + "_" + date + "_" + hours + "h" + minutes + "m" + seconds + "s";
        var saveasDirect = "Report/" + Name_report + currentTime + ".xlsx";
        SaveAslink = saveasDirect; // Send to client
        var booknameLink = "public/" + saveasDirect;
        // Write book name
        // workbook.xlsx.writeFile(booknameLink);//luu ơ server
        workbook.xlsx.writeBuffer().then((Buffer) => {
            socket.emit(socket_emit, Buffer);
        });
    },
};


