//------------------------So sánh và hiển thị 

function fn_compare_() {
  socket.on('compare_response', function (data) {
    const resultElement = document.getElementById('result');
    const resultElement1 = document.getElementById('number_box');
    const resultElement2 = document.getElementById('number_box_real');

    // Clear any previous content
    resultElement.innerHTML = '';
    resultElement1.innerHTML = '';
    resultElement2.innerHTML = '';

    if (data.length === 0) {
      // Handle empty data case
      resultElement.classList.remove('change_green', 'change_red', 'change_yellow');
      resultElement.value = locale.loading;
      resultElement1.value = locale.loading;
      resultElement2.value = locale.loading;
      return;
    }

    data.forEach(item => {
      // Clear previous color classes
      resultElement.classList.remove('change_green', 'change_red', 'change_yellow');

      // Set the color and text based on comparison result
      if (item.compareResult === 'full') {
        resultElement.classList.add('change_green');
        resultElement.value = locale.full;
      } else if (item.compareResult === 'shortage') {
        resultElement.classList.add('change_red');
        resultElement.value = locale.shortage;
      } else if (item.compareResult === 'over') {
        resultElement.classList.add('change_yellow');
        resultElement.value = locale.over;
      } else {
        resultElement.value = locale.loading;
      }

      // Update the SL_Box and SL_Real values
      resultElement1.value = item.slBox;
      resultElement2.value = item.slReal;
    });
  });
}



  



   
  
  