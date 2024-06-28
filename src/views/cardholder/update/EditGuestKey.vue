<template>
  <div class="add_gest_page">
    <vx-card class="mt-base card_theme" no-shadow>
      <div class="vx-row">
        <div class="vx-col md:w-full">
          <vs-checkbox
            class="mb-4 custom__checkbox"
            v-model="guest.enable_create_guest"
            >Allow issuing guest keys</vs-checkbox
          >
          <label for="" class="vs-input--label mt-3">License</label>

          <v-select
            v-model="guest.guest_count"
            :options="slots"
            class="select_padding"
            placeholder="License"
            :reduce="(lic) => lic.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import vSelect from "vue-select";

export default {
  data() {
    return {
      guest: {
        enable_create_guest: false,
        guest_count: null,
      },
      slots: [
        { id: 4, label: "4 slots" },
        { id: 5, label: "5 slots" },
        { id: 6, label: "6 slots" },
        { id: 7, label: "7 slots" },
        { id: 8, label: "8 slots" },
      ],
    };
  },
  computed: {
    edit_cardholder() {
      return this.$store.state.cardholder.edit_cardholder_info;
    },
  },
  watch: {
    guest: {
      handler: function (newValue, oldValue) {
        this.$store.commit("cardholder/SET_EDIT_CARDHOLDER_GUEST", newValue);
      },
      deep: true,
    },
  },
  created() {
    if (this.edit_cardholder) {
      this.guest.enable_create_guest = JSON.parse(
        JSON.stringify(this.edit_cardholder.enable_create_guest)
      );
      this.guest.guest_count = JSON.parse(
        JSON.stringify(this.edit_cardholder.guest_count)
      );
    }
  },
  components: {
    vSelect,
  },
};
</script>

<style>
</style>