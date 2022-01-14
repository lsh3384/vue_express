<template>
  <div>
    <canvas id="chart_pm" width="800" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import pm_data from "../pm_data.js";

export default {
  props: {
    sensor_data: Object,
  },
  name: "chart_pm",
  data() {
    return {
      pm_data: pm_data,
      myChart: null,
    }
  },
  mounted() {
    pm_data.data.labels.length;
    const ctx = document.getElementById("chart_pm");
    this.myChart = new Chart(ctx, pm_data);
  },
  watch: {
    sensor_data: {
      // immediate: false,
      handler(newValue) {
        // console.log("sensor_data changed!");
        // console.log(newValue);
        // console.log("------------------------");

        function chart_mov(data) {
          if (chart_data.length === 30) {
            chart_data.shift();
            chart_data.push(data);
          } else {
            chart_data.push(data);
          }
        }
        var chart_data = pm_data.data.datasets[0].data;
        chart_mov(newValue.pm_1_0);
        chart_data = pm_data.data.datasets[1].data;
        chart_mov(newValue.pm_2_5);
        chart_data = pm_data.data.datasets[2].data;
        chart_mov(newValue.pm_10);

        // planetChartData.data.datasets[0].data.push(newValue.tmp);
        console.log(
          "PM 1.0 :",
          newValue.pm_1_0,
          "ppm",
          "PM 2.5 :",
          newValue.pm_2_5,
          "mg/㎥",
          "PM 10 :",
          newValue.pm_10,
          "ppm"
        );

        // console.log(planetChartData.data.datasets[0].data);
        // console.log(this.myChart);
        this.myChart.update();
      },
      deep: true,
    }
  }
}
</script>
