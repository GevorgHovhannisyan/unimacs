<template>
  <div>
    <p class="product-name font-medium truncate" >
      <p
         class="product-name font-medium truncate"
         :style="{ color: getStatusColor(params) }"
      >
        {{ getName(params) }}
    </p>
    </p>
  </div>
</template>

<script>
export default {
    computed: {
        getStatusColor() {
        return (params) => {
          if (params.data.enable_antipass_back) return "rgb(0 251 0)";
          else return "grey";
        };
      },
          getName() {
      return (params) => {
            if (params.data.enable_antipass_back) return "Enable";
          else return "Disable";
      };
    },
    }
}
</script>