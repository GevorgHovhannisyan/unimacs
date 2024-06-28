<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-input
          label="Name"
          v-model="set_data.name"
          @input="checkLength(set_data.name)"
          class="w-full"
          name="Name"
          v-validate="'required'"
        />
      </div>
      <div class="vx-col w-full mt-2">
        <label for="" class="vs-input--label mt-4">Access point</label>
        <v-select
          v-model="set_data.access_point"
          :options="access_points"
          autocomplete="new-password"
          class="select_padding"
          placeholder="Access point"
          label="name"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
      <div class="vx-col w-full mt-2">
        <vs-input
          v-model="set_data.before_event"
          label="Before the event,s"
          @input="checkNumber(set_data.before_event, 'before_event')"
          class="w-full"
          autocomplete="new-password"
          name="before_event"
        />
      </div>
      <div class="vx-col w-full mt-2">
        <vs-input
          v-model="set_data.after_event"
          label="After the event,s"
          @input="checkNumber(set_data.after_event, 'after_event')"
          class="w-full"
          autocomplete="new-password"
          name="after_event"
        />
      </div>
    </div>
    <div class="vx-row mt-5">
      <div
        class="vx-col w-full mt-3"
        style="display: flex; flex-direction: row-reverse"
      >
        <vs-button
          class="ml-3 unimacs_button"
          @click="$emit('createSet', set_data)"
          :disabled="set_data.before_event == 0 || set_data.after_event == 0 || !set_data.after_event || !set_data.before_event"
        >
          Submit
        </vs-button>
        <vs-button color="danger" @click="$emit('closePopup')">Cancel </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
export default {
  props: {
    access_points: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      connection_types: [
        { id: "Cloud", label: "Cloud" },
        { id: "IP/Domain", label: "IP / Domain" },
      ],
      set_data: {
        name: null,
        access_point: null,
        before_event: 5,
        after_event: 15,
      },
    };
  },
  components: {
    vSelect,
  },
  methods: {
    initValues() {
      this.set_data = {
        name: null,
        access_point: null,
        before_event: 5,
        after_event: 15,
      };
    },
    checkLength(value) {
      this.set_data.name = value.slice(0, 32);
    },
    checkNumber(value, field) {
      this.set_data[field] = +value.replace(/\D/g, "");
      if(this.set_data[field] < 1) this.set_data[field] = 1
      if(this.set_data[field] > 60) this.set_data[field] = 60
    },
  },
};
</script>

<style lang="scss" >
// @import "../style.scss";
</style>
