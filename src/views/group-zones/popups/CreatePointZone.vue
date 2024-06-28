<template>
  <vs-popup class="holamundo" title="Create Location Zone" :active.sync="popup">
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-input
          label="Name"
          class="w-full"
          name="name"
          v-model="zone.name"
          v-validate="'required'"
        />
      </div>
    </div>

    <div class="vx-row mt-3">
      <div class="vx-col w-full">
        <vs-input
          label="Description"
          class="w-full"
          name="Description"
          v-model="zone.description"
        />
      </div>
    </div>
    <div class="vx-row mt-5">
      <div class="vx-col w-full">
        <vs-button
          :disabled="!isFormValid"
          @click="createLocZone"
          class="unimacs_button"
        >
          Create Location Zone
        </vs-button>

        <vs-button
          class="ml-5 unimacs_cancel_button"
          @click="
            popup = false;
            initValues();
          "
        >
          Cancel
        </vs-button>
      </div>
    </div>
  </vs-popup>
</template>

<script>
export default {
  props: {
    popupActive: {
      type: Boolean,
    },
  },
  computed: {
    isFormValid() {
      return this.zone.name;
    },
  },
  watch: {
    popupActive(val) {
      this.popup = val;
      this.$emit("popup", val);
    },
    popup(val) {
      this.$emit("popup", val);
    },
  },
  data() {
    return {
      zone: {
        name: null,
        description: null,
      },
      popup: false,
    };
  },
  methods: {
    createLocZone() {
      this.$emit("createLocZone", this.zone);
      this.initValues();
    },
    initValues() {
      this.zone = {
        name: null,
        description: null,
      };
    },
  },
  created() {
    this.popup = this.popupActive;
  },
};
</script>

