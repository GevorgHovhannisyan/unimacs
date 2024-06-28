<template>
  <div>
    <div class="vx-row mt-3">
      <div class="vx-col md:w-full">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="interfaces.rs485_port_1"
          >Enable RS485 port 1</vs-checkbox
        >
      </div>
      <div class="vx-col md:w-full">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="interfaces.rs485_port_2"
          >Enable RS485 port 2</vs-checkbox
        >
      </div>
    </div>
  </div>
</template>


<script>
export default {
  watch: {
    interfaces: {
      handler: function (data) {
        this.$store.commit("accessPoint/UPDATE_INTERFACE", data);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    interface() {
      return this.$store.state.accessPoint.edit_acu_data.interface;
    },
  },
  data() {
    return {
      interfaces: {},
    };
  },
  created() {
    this.initInterfaces();
  },
  methods: {
    initInterfaces() {
      if (this.interface) {
        this.interfaces = { ...this.interface };
      }
    },
  },
};
</script>