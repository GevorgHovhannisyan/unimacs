<template>
  <div>
    <table style="width: 100%">
      <tr v-for="(header, index) in table_headers" :key="index">
        <td>{{ header.name }}</td>
        <td v-if="header.key == 'elevator_mode'">
          {{ acuData[header.key] ? "Active" : "Inactive" }}
        </td>
        <td v-else>
          {{ acuData[header.key] ? acuData[header.key] : "" }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    acuData: {
      type: Object,
    },
  },
  data() {
    return {
      table_headers: [
        { name: "Name:", key: "name" },
        { name: "Serial:", key: "serial_number" },
        { name: "Status:", key: "status" },
        { name: "Model:", key: "model" },
        { name: "Shared resource mode:", key: "elevator_mode" },
        { name: "IP Address:", key: "ip_address" },
        { name: "HW ver:", key: "rev" },
        { name: "API ver:", key: "api_ver" },
        // { name: "Embed Access Points:", key: "embed_access_point" },
        // { name: "Inputs:", key: "inouts" },
        // { name: "Outputs:", key: "outputs" },
      ],
    };
  },
  methods: {
    bindAcuData(acu) {},
  },
  created() {
    this.bindAcuData(this.acuData);
  },
};
</script>

<style>
</style>
