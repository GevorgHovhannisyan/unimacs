<template>
    <div>
      <p class="product-name font-medium truncate" >
        <p
          class="product-name font-medium truncate acu_mode_column"
          :class="{credential: params.data.mode == 'credential',
        locked:  params.data.mode === 'locked',
        unlocked: params.data.mode === 'unlocked',
        }"
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
            if (params.data.mode == "credential") return "rgb(255 255 255)";
          else if (params.data.mode == "locked") return "rgb(193 43 43)";
          else if (params.data.mode == "unlocked") return "rgb(0 251 0)";
          };
        },
        getName() {
          return (params) => {
           if (params.data.mode == "credential") return "Credential";
          else if (params.data.mode == "locked") return "Locked";
          else if (params.data.mode == "unlocked") return "Unlocked";
          else if (params.data.mode == "N/A") return "N/A";
          };
        },
      }
  }
  </script>