<template>
  <div>
    <table>
      <tr>
        <td>Access Point name:</td>
        <td>
          {{ apData.name ? apData.name : "" }}
        </td>
      </tr>

      <tr>
        <td>Description:</td>
        <td>
          {{ apData.description ? apData.description : "" }}
        </td>
      </tr>

      <tr>
        <td>Type:</td>
        <td>
          {{ apData.type ? apData.type : "" }}
        </td>
      </tr>

      <tr>
        <td>Location zone:</td>

        <td>
          {{ apData.access_point_zones ? apData.access_point_zones.name : "" }}
        </td>
      </tr>

      <tr>
        <td>Groups:</td>
        <td>
          {{
            apData.access_point_groups ? apData.access_point_groups.name : ""
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    apData: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  tr {
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: left;
    td {
      flex: 0 0 50%;
      text-align: left;
      padding-bottom: 5px;
    }
  }
}
</style>