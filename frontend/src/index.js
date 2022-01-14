/* 웹소켓 */
const webSocket = new WebSocket("ws://192.168.1.127:3000");

webSocket.onopen = (ws) => {
  webSocket.send(JSON.stringify('Hello from client'));
};

webSocket.onmessage = function (event) {
  config_tmp_hum.data.labels.length;  // 라벨 추가
  config_CO2_TVOC.data.labels.length;
  config_pm.data.labels.length;
  // console.log(config.data.labels);

  var svr_data = JSON.parse(event.data);
  // console.log(svr_data);

  function chart_mov(data) {          
    if (chart_data.length === 30) {
      chart_data.shift();
      chart_data.push(data);
    } else {
      chart_data.push(data);
    }
  }

  var chart_data = config_tmp_hum.data.datasets[0].data;
  chart_mov(svr_data.tmp);
  var chart_data = config_tmp_hum.data.datasets[1].data;
  chart_mov(svr_data.hum);
  var chart_data = config_CO2_TVOC.data.datasets[0].data;
  chart_mov(svr_data.CO2);
  var chart_data = config_CO2_TVOC.data.datasets[1].data;
  chart_mov(svr_data.TVOC);
  var chart_data = config_pm.data.datasets[0].data;
  chart_mov(svr_data.pm_1_0);
  var chart_data = config_pm.data.datasets[1].data;
  chart_mov(svr_data.pm_2_5);
  var chart_data = config_pm.data.datasets[2].data;
  chart_mov(svr_data.pm_10);

  console.log("Temperature :", svr_data.tmp, "C°,", "Humidity :", svr_data.hum, "%");
  console.log("CO2 :", svr_data.CO2, "ppm", "TVOC :", svr_data.TVOC, "mg/㎥");
  console.log("PM 1.0 :", svr_data.pm_1_0, "ppm", "PM 2.5 :", svr_data.pm_2_5, "mg/㎥", "PM 10 :", svr_data.pm_10, "ppm");
}

const interval = setInterval(() => {
  chart_tmp_hum.update();
  chart_CO2_TVOC.update();
  chart_pm.update();
}, 1000);

webSocket.onclose = function () {
  console.log("connection closed");
}

webSocket.onerror = function (event) {
  console.log(event);
}


/* 차트 */
const ctx_tmp_hum = document.getElementById('chart_tmp_hum');
const ctx_CO2_TVOC = document.getElementById('chart_CO2_TVOC');
const ctx_pm = document.getElementById('chart_pm');

var config_tmp_hum = {
  type: 'line',
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], //x축: 시간 
    datasets: [{
      label: 'Temperature C°', // 선 내용(ex. 온습도, 미세먼지 etc)
      data: [],
      backgroundColor: [
        'rgba(200, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 2,
      //tension: 0.5
    }, {
      label: 'Humidity',
      data: [],
      backgroundColor: [
        'rgba(99, 99, 200, 0.2)'
      ],
      borderColor: [
        'rgba(99, 99, 255, 1)'
      ],
      borderWidth: 2,
      //tension: 0.5
    }],
  },
  options: {
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100
      }
    }
  }
};

var config_CO2_TVOC = {
  type: 'line',
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], //x축: 시간 
    datasets: [{
      label: 'CO2',
      data: [],
      backgroundColor: [
        'rgba(220, 50, 220, 0.2)'
      ],
      borderColor: [
        'rgba(220, 50, 220, 1)'
      ],
      borderWidth: 2,
      //tension: 0.5
    }, {
      label: 'TVOC',
      data: [],
      backgroundColor: [
        'rgba(220, 220, 50, 0.2)'
      ],
      borderColor: [
        'rgba(220, 220, 50, 1)'
      ],
      borderWidth: 2,
      //tension: 0.5
    }],
  },
  options: {
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100
      }
    }
  }
};

var config_pm = {
  type: 'line',
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], //x축: 시간 
    datasets: [{
      label: 'PM 1.0',
      data: [],
      backgroundColor: [
        'rgba(50, 50, 220, 0.2)'
      ],
      borderColor: [
        'rgba(50, 50, 220, 1)'
      ],
      borderWidth: 2,
      //tension: 0.5
    }, {
      label: 'PM 2.5',
      data: [],
      backgroundColor: [
        'rgba(50, 220, 50, 0.2)'
      ],
      borderColor: [
        'rgba(50, 220, 50, 1)'
      ],
      borderWidth: 2,
      //tension: 0.5
    }, {
      label: 'PM 10',
      data: [],
      backgroundColor: [
        'rgba(220, 50, 50, 0.2)'
      ],
      borderColor: [
        'rgba(220, 50, 50, 1)'
      ],
      borderWidth: 2,
      //tension: 0.5
    }],
  },
  options: {
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100
      }
    }
  }
};

var chart_tmp_hum = new Chart(ctx_tmp_hum, config_tmp_hum);
var chart_CO2_TVOC = new Chart(ctx_CO2_TVOC, config_CO2_TVOC);
var chart_pm = new Chart(ctx_pm, config_pm);