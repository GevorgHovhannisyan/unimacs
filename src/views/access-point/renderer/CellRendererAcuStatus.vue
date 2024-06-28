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
    getDeviceName() {
      return (params) => {
        if (params.data.acu_status == "offline") return "Offline";
        // else if (params == "pending") return "Waiting for config";
        else if (params.data.acu_status == "online") return "Online";
      };
    },
    getStatusColor() {
      return (params) => {
        if (params.data.acu_status == "offline") return "grey";
        // else if (params == "pending") return "rgb(255 178 0)";
        else if (params.data.acu_status == "online") return "rgb(0 251 0)";
      };
    },
    }
}
</script>