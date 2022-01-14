<template>
  <div id="app">
    <chart_tmp_hum :sensor_data="sensor_data" />
    <chart_co2_tvoc :sensor_data="sensor_data" />
        <chart_pm :sensor_data="sensor_data" />
  </div>
</template>

<script>
import chart_tmp_hum from './components/chart_tmp_hum.vue'
import chart_co2_tvoc from './components/chart_co2_tvoc.vue'
import chart_pm from './components/chart_pm.vue'

import { vm } from './main'

export default {
  name: 'App',
  data() {
    return {
      connection: null,
      sensor_data: {
        wearable_band_num: 0,
        tmp: 0,
        hum: 0,
        CO2: 0,
        TVOC: 0,
        pm_1_0: 0,
        pm_2_5: 0,
        pm_10: 0
      },
    }
  },
  methods: {
    sendMessage: function(message) {
      console.log("Hello");
      console.log(this.connection);
      this.connection.send(message);
    },
  },
  components: {
    chart_tmp_hum, 
    chart_co2_tvoc,
    chart_pm
  },
  mounted() {
    console.log("Starting connection to WebSocket Server");
    this.connection = new WebSocket("ws://192.168.1.127:3000");

    this.connection.onmessage = (event) => {
      var svr_data = JSON.parse(event.data);

      vm.$set(this.sensor_data, 'wearable_band_num', svr_data.wearable_band_num);
      vm.$set(this.sensor_data, 'tmp', svr_data.tmp);
      vm.$set(this.sensor_data, 'hum', svr_data.hum);
      vm.$set(this.sensor_data, 'CO2', svr_data.CO2);
      vm.$set(this.sensor_data, 'TVOC', svr_data.TVOC);
      vm.$set(this.sensor_data, 'pm_1_0', svr_data.pm_1_0);
      vm.$set(this.sensor_data, 'pm_2_5', svr_data.pm_2_5);
      vm.$set(this.sensor_data, 'pm_10', svr_data.pm_10);
    }

    this.connection.onopen = (event) => {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
    }
  },
}
</script>