export var pm_data = {
    type: 'line',
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], //x축: 시간 
      datasets: [{
        label: 'PM 1.0', // 선 내용(ex. 온습도, 미세먼지 etc)
        data: [],
        backgroundColor: [
          'rgba(50, 50, 190, 0)'
        ],
        borderColor: [
          'rgba(50, 50, 190, 1)'
        ],
        borderWidth: 2,
        tension: 0.1
      }, {
        label: 'PM 2.5',
        data: [],
        backgroundColor: [
          'rgba(50, 190, 190, 0)'
        ],
        borderColor: [
          'rgba(50, 190, 190, 1)'
        ],
        borderWidth: 2,
        tension: 0.1
      }, {
        label: 'PM 10',
        data: [],
        backgroundColor: [
          'rgba(190, 50, 50, 0)'
        ],
        borderColor: [
          'rgba(190, 50, 50, 1)'
        ],
        borderWidth: 2,
        tension: 0.1
      }],
    },
    options: {
      responsive: false,
      scales : {
        yAxes: [{
           ticks: {
              // steps : 10,
              // stepValue : 10,
              max : 100,
              min: 0
            }
        }]
      }
      // scales: {
      //   y: {
      //     beginAtZero: false,
      //     min: 0,
      //     max: 100
      //   }
      // }
    }
  };
  
  export default pm_data;