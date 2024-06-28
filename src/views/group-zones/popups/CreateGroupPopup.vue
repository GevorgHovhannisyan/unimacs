<template>
  <vs-popup
    class="holamundo"
    title="Create Access Point Group"
    :active.sync="popup"
  >
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-input
          label="Name"
          class="w-full"
          name="name"
          v-model="group.name"
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
          v-model="group.description"
        />
      </div>
    </div>
    <div class="vx-row mt-5">
      <div class="vx-col w-full">
        <vs-button
          class="unimacs_button"
          :disabled="!isFormValid"
          @click="createCardholderGroup"
        >
          Create Access Point Group
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
      return this.group.name;
    },
  },
  watch: {
    popupActive(val) {
      this.popup = val;
      this.$emit("popup", val);
    },
    popup(val) {
      this.$emit("popup", val);
      this.initValues();
    },
  },
  data() {
    return {
      group: {
        name: null,
        description: null,
      },
      popup: false,
    };
  },
  methods: {
    createCardholderGroup() {
      this.$emit("createGroup", this.group);
      this.initValues();
    },
    initValues() {
      this.group = {
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

