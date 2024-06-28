<template>
  <div>
    <p class="product-name font-medium truncate" >
      <p
        class="product-name font-medium truncate"
        :style="{ color: getStatusColor(params) }"
        >
        {{params.data.status}}
         <!-- {{ getDeviceName(params) }} -->
         </p>
    </p>
  </div>
</template>

<script>
export default {
    computed: {
        getStatusColor() {
        return (params) => {
         if (params.data.status == "Inactive") return "#ea5455";
        else if (params.data.status == "Active") return "rgb(0 251 0)";
        };
      }
    }
}
</script>