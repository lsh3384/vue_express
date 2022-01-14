<template>
  <div>
    <canvas id="chart_co2_tvoc" width="800" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import co2_tvoc_data from "../co2_tvoc_data.js";

export default {
  props: {
    sensor_data: Object,
  },
  name: "chart_co2_tvoc",
  data() {
    return {
      co2_tvoc_data: co2_tvoc_data,
      myChart: null,
    }
  },

  mounted() {
    co2_tvoc_data.data.labels.length;
    const ctx = document.getElementById("chart_co2_tvoc");
    this.myChart = new Chart(ctx, co2_tvoc_data);
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
        var chart_data = co2_tvoc_data.data.datasets[0].data;
        chart_mov(newValue.CO2);
        chart_data = co2_tvoc_data.data.datasets[1].data;
        chart_mov(newValue.TVOC);

        // planetChartData.data.datasets[0].data.push(newValue.tmp);
        console.log("CO2 :", newValue.CO2, "ppm", "TVOC :", newValue.TVOC, "mg/㎥");

        // console.log(planetChartData.data.datasets[0].data);
        // console.log(this.myChart);
        this.myChart.update();
      },
      deep: true,
    }
  }
}
</script>
