function fn_home() {
  socket.on('sum_box', function (data) {
    var sum_box = data.totalSL_Box;
    var sum_real = data.totalSL_Real;

    document.getElementById('sum_sl_box').value = sum_box;
    document.getElementById('sum_sl_real').value = sum_real;
  });

  socket.on('sum_case_no', function (data) { 
    document.getElementById('sum_caseNo').value = data;
  });

}


function chart_box(id,title,content,content_,donvi) {
  var lastUpdateTime = 0;
  var updateInterval = 1000; // 1 second
  var lastSumBox = null;
  var lastSumReal = null;

  var chart = new CanvasJS.Chart(id, {
    animationEnabled: true,
    title: {
      text: title,
      fontFamily: "Calibri",
      fontWeight: "bold",
      fontColor: "black",
      fontSize: 25
    },
    data: [{
      type: "pie",
      startAngle: 240,
      yValueFormatString: "##0\" " + donvi + "\"",
      indexLabel: "{label} {y}",
      indexLabelFontFamily: "Calibri",
      indexLabelFontWeight: "bold",
      indexLabelFontColor: "black",
      indexLabelFontSize: 20,
      indexLabelLineHeight: 5, // Giảm khoảng cách giữa các nhãn dữ liệu
      borderThickness: 5, // Tăng độ dày của đường viền
      dataPoints: [
        { y: 0, label: content,  color: "rgba(0, 128, 0, 0.7)", exploded: true },
        { y: 0, label: content_,  color: "rgba(255, 0, 0, 0.7)", exploded: false }
      ]
    }]
  });

  chart.render();

  socket.on('sum_box', function (data) {
    var currentTime = new Date().getTime();
    var sum_box = data.totalSL_Box;
    var sum_real = data.totalSL_Real;

    // Check if data has changed
    if (sum_box !== lastSumBox || sum_real !== lastSumReal) {
      // Update last known data
      lastSumBox = sum_box;
      lastSumReal = sum_real;

      // Throttle updates to once per second
      if (currentTime - lastUpdateTime >= updateInterval) {
        lastUpdateTime = currentTime;

        // Calculate the remaining boxes
        var remaining_boxes = sum_box - sum_real;

        // Update dataPoints directly without re-rendering the entire chart
        chart.options.data[0].dataPoints[0].y = sum_real;
        chart.options.data[0].dataPoints[1].y = remaining_boxes;

        // Render the chart with updated data
        chart.render();
      }
    }
  });
}


function chart_case(id,title,content,content_,donvi) {
  var lastUpdateTime = 0;
  var updateInterval = 1000; // 1 second
  var lastSumBox = null;
  var lastSumReal = null;

  var chart = new CanvasJS.Chart(id, {
    animationEnabled: true,
    title: {
      text: title,
      fontFamily: "Calibri",
      fontWeight: "bold",
      fontColor: "black",
      fontSize: 25
    },
    data: [{
      type: "pie",
      startAngle: 240,
      yValueFormatString: "##0\" " + donvi + "\"",
      indexLabel: "{label} {y}",
      indexLabelFontFamily: "Calibri",
      indexLabelFontWeight: "bold",
      indexLabelFontColor: "black",
      indexLabelFontSize: 20,
      indexLabelLineHeight: 5, // Giảm khoảng cách giữa các nhãn dữ liệu
      borderThickness: 5, // Tăng độ dày của đường viền
      dataPoints: [
        { y: 0, label: content,  color: "rgba(0, 128, 0, 0.7)", exploded: true },
        { y: 0, label: content_,  color: "rgba(255, 0, 0, 0.7)", exploded: false }
      ]
    }]
  });

  chart.render();

  socket.on('sum_box', function (data) {
    var currentTime = new Date().getTime();
    var sum_box = data.totalSL_Box;
    var sum_real = data.totalSL_Real;

    // Check if data has changed
    if (sum_box !== lastSumBox || sum_real !== lastSumReal) {
      // Update last known data
      lastSumBox = sum_box;
      lastSumReal = sum_real;

      // Throttle updates to once per second
      if (currentTime - lastUpdateTime >= updateInterval) {
        lastUpdateTime = currentTime;

        // Calculate the remaining boxes
        var remaining_boxes = sum_box - sum_real;

        // Update dataPoints directly without re-rendering the entire chart
        chart.options.data[0].dataPoints[0].y = sum_real;
        chart.options.data[0].dataPoints[1].y = remaining_boxes;

        // Render the chart with updated data
        chart.render();
      }
    }
  });
}



 




        