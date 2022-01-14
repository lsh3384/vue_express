<template>
  <div>
    <canvas id="chart_tmp_hum" width="800" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import tmp_hum_data from "../tmp_hum_data.js";

export default {
  props: {
    sensor_data: Object,
  },
  name: "chart_tmp_hum",
  data() {
    return {
      tmp_hum_data: tmp_hum_data,
      myChart: null,
    };
  },

  mounted() {
    tmp_hum_data.data.labels.length;
    const ctx = document.getElementById("chart_tmp_hum");
    this.myChart = new Chart(ctx, tmp_hum_data);
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
        var chart_data = tmp_hum_data.data.datasets[0].data;
        chart_mov(newValue.tmp);
        chart_data = tmp_hum_data.data.datasets[1].data;
        chart_mov(newValue.hum);

        console.log("Temperature :", newValue.tmp, "C°,", "Humidity :", newValue.hum, "%");

        this.myChart.update();
      },

      deep: true,
    }
  }
}
</script>