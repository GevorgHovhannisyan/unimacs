<template>
  <div>
    <!-- title="Anti PassBack" -->
    <vx-card class="mt-base card_theme" no-shadow>
      <div class="vx-row">
        <div class="vx-col md:w-full w-full">
          <vs-checkbox
            v-model="antipass_back.antipass_back_inherited"
            class="w-full checkbox_block custom__checkbox"
            >Inherit from group rules</vs-checkbox
          >
        </div>

        <div class="vx-col md:w-full w-full">
          <vs-checkbox
            v-model="antipass_back.enable_antipass_back"
            :disabled="antipass_back.antipass_back_inherited"
            class="w-full checkbox_block custom__checkbox"
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
        this.$store.commit("cardholder/SET_EDIT_ANTIPASS_INFO", {
          ...newValue,
        });
      },
      deep: true,
    },
  },

  created() {
    const apb = this.$store.state.cardholder.edit_cardholder_info;
    this.antipass_back = {
      antipass_back_inherited: apb.antipass_back_inherited,
      enable_antipass_back: apb.enable_antipass_back,
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