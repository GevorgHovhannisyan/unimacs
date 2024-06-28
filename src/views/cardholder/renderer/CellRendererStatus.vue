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
          if (params.data.status == "active") return "rgb(0 251 0)";
            else if (params.data.status == "noCredential") return "rgb(251 162 0)";
            else if (params.data.status == "pending") return "rgb(251 162 0)";
            else if (params.data.status == "expired") return "rgb(255 83 18)";
          else return "grey";
        };
      },
          getDeviceName() {
      return (params) => {
            if (params.data.status == "active") return "Active";
            else if (params.data.status == "expired") return "Expired";
            else if (params.data.status == "noCredential") return "No Credential";
            else if (params.data.status == "pending") return "Pending";
          else return "Inactive";
      };
    },
    }
}
</script>
