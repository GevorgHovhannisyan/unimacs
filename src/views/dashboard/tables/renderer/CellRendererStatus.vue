<template>
  <div>
    <p class="product-name font-medium truncate" >
      <p
        class="product-name font-medium truncate"
        :style="{ color: getStatusColor(params) }"
        >

        {{getName(params)}}
         </p>
    </p>
  </div>
</template>

<script>
export default {
    computed: {
        getStatusColor() {
        return (params) => {
         if (params.data.cloud_status == "offline") return "#ea5455";
        else if (params.data.cloud_status == "online") return "rgb(0 251 0)";
        };
      },
      getName() {
        return (params) => {
         if (params.data.cloud_status == "offline") return "Offline";
        else if (params.data.cloud_status == "online") return "Online";
        };
      },
    }
}
</script>