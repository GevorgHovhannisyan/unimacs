<template>
  <div>
    <p class="product-name font-medium truncate" >
      <p
        class="product-name font-medium truncate"
        :style="{ color: getStatusColor(params.data.event) }"
        >
        {{params.data.event}}
         </p>
    </p>
  </div>
</template>

<script>
export default {
    computed: {
        getStatusColor() {
        return (value) => {
          if (value == "change") return "rgb(218 181 46)";
          else if (value == "delete") return "rgb(255 0 0)";
          else if (value == "create") return "rgb(100 187 111)";
          else if (value == "login") return "rgb(52 123 195)";
          else if (value == "logout") return "rgb(52 123 195)";
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