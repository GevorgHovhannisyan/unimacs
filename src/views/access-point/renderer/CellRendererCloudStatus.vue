<template>
  <div>
    <p class="product-name font-medium truncate" >
      <p
        class="product-name font-medium truncate"
        :style="{ color: getStatusColor(params) }"
        >
         {{ getDeviceName(params) }}
         </p>
    </p>
  </div>
</template>

<script>
export default {
    computed: {
        getStatusColor() {
        return (params) => {
           if (params.data.cloud_status == "active" || params.data.cloud_status == "online") return "rgb(92 184 92)";
        else if (params.data.cloud_status == "pending") return "rgb(239 197 48)";
        else if (params.data.cloud_status == "no_hardware") return "rgb(162 157 139)";
        else if (params.data.cloud_status == "offline") return "#ea5455";
        };
      },
      getDeviceName() {
        return (params) => {
        if (params.data.cloud_status == "online") return "Online";
        if (params.data.cloud_status == "offline") return "Offline";
        else return params.data.cloud_status;
      };
    },
    }
}
</script>