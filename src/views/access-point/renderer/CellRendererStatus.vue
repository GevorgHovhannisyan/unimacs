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
             if (params.data.status == "no_hardware") return "grey";
        else if (params.data.status == "pending") return "rgb(255 178 0)";
        else if (params.data.status == "active") return "rgb(0 251 0)";
        };
      },
      getDeviceName() {
        return (params) => {
              if (params.data.status == "no_hardware") return "Virtual Device";
        else if (params.data.status == "pending") return "Waiting for config";
        else if (params.data.status == "active") return "Active";
      };
    },
    }
}
</script>