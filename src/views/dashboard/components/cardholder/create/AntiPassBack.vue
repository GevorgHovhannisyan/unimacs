<template>
  <div>
    <vx-card class="mt-base card_theme" no-shadow>
      <div class="vx-row">
        <div class="vx-col md:w-full w-full">
          <vs-checkbox
            v-model="antipass_back.antipass_back_inherited"
            :disabled="!group"
            class="w-full checkbox_block"
            >Inherit from group rules</vs-checkbox
          >
        </div>

        <div class="vx-col md:w-full w-full">
          <vs-checkbox
            v-model="antipass_back.enable_antipass_back"
            :disabled="antipass_back.antipass_back_inherited"
            class="w-full checkbox_block"
            >Enable Anti-passback</vs-checkbox
          >
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
export default {
  watch: {
    antipass_back: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_ANTIPASS_INFO", { ...newValue });
      },
      deep: true,
    },
  },
  computed: {
    group() {
      return this.$store.state.cardholder.cardholder_info.cardholder_group;
    },
  },
  created() {
    this.antipass_back = {
      ...this.$store.state.cardholder.cardholder_info.antipass_backs,
    };
  },
  data() {
    return {
      antipass_back: {},
    };
  },
};
</script>

<style lang="scss" scoped>
.checkbox_block {
  flex: 0 0 100%;
  margin-bottom: 15px;
}
</style>