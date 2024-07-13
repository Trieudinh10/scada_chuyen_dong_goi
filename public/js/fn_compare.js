//------------------------So sánh
function fn_compare() {
    // Giá trị PLC của part_no và case no
    var value_part_no = document.getElementById('value_com').value; // Lấy giá trị từ thẻ input
    var value_case_no = document.getElementById('value_com_case').value; // Lấy giá trị từ thẻ input
    var value = ["value_part_no","value_case_no"];
    socket.emit('msg_compare', value_part_no);
    // console.log(value_part_no);
  }

  function fn_compare_() {
    socket.on('compare_response', function (data) {
      const resultElement = document.getElementById('result');
      resultElement.value = data;
    //   console.log(data);
  
      // Xóa tất cả các lớp thay đổi màu trước đó
      resultElement.classList.remove('change_green', 'change_red', 'change_yellow');
  
      // Thêm lớp tương ứng dựa trên giá trị của data
      if (data == 'Đủ') {
        resultElement.classList.add('change_green');
      } else if (data == 'Thiếu') {
        resultElement.classList.add('change_red');
      } else if (data == 'Dư') {
        resultElement.classList.add('change_yellow');
      }
    });
  }

  setInterval(fn_compare, 500);

  
  