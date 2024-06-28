<template>
  <div>
    <div class="vx-row mt-3">
      <div class="vx-col md:w-full">
        <h3>FW ver: 1.0265</h3>
      </div>
    </div>

    <div class="vx-row mt-3">
      <div class="vx-col md:w-1/2">
        <vs-button class="w-full mt-5"> Restart device</vs-button>
      </div>
      <div class="vx-col md:w-1/2 mt-6">
        <span>Restart devic</span>
      </div>
      <div class="vx-col md:w-1/2">
        <vs-button class="w-full mt-5"> Reset partial</vs-button>
      </div>
      <div class="vx-col md:w-1/2 mt-6">
        <span>Resets all except Connection</span>
      </div>

      <div class="vx-col md:w-1/2">
        <vs-button class="w-full mt-5"> Reset full</vs-button>
      </div>
      <div class="vx-col md:w-1/2 mt-6">
        <span>Resets all to factory defaults</span>
      </div>
      <vs-divider />
    </div>
  </div>
</template>


<script>
import vSelect from "vue-select";
export default {
  watch: {
    interfaces() {
      this.$parent.$parent.$parent.acu_data.maintain = this.maintain;
    },
  },
  computed: {
    updateTypes() {
      return this.$store.state.accessPoint.updateTypes;
    },
  },
  data() {
    return {
      maintain: this.$parent.$parent.$parent.acu_data.maintain,
    };
  },
  created() {},
  components: { vSelect },
};
</script>