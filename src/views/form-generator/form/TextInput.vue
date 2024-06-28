<template>
  <div v-if="!isHidden">
    <vs-input
      class="w-full mt-4"
      :label="label"
      :name="name"
      :value="val"
      :disabled="disabled"
      v-validate="isRequired ? 'required' : undefined"
      :data-vv-as="name"
      @input="check($event)"
    />
    <!-- $emit('input',$event); -->

    <span class="text-danger text-sm" v-if="errors.first(name)">{{
      errorMsg
    }}</span>
  </div>
</template>
<script>
export default {
  name: "textInput",
  props: [
    "placeholder",
    "label",
    "name",
    "value",
    "readOnly",
    "multiLng",
    "hidden",
    "required",
  ],
  data() {
    return {
      val: this.value,
      disabled: false,
      isHidden: false,
      isRequired: false,
    };
  },
  computed: {
    errorMsg() {
      return `${this.label} is required`;
    },
  },
  methods: {
    check(event) {
      this.val = event;

      if (!event) {
        this.errors.add({
          field: this.val,
          msg: this.errorMsg,
        });
      } else {
        this.errors.items = [];
      }

      this.$emit("input", event);
    },
  },
  created() {
    if (this.hidden) {
      this.isHidden = true;
    }

    if (this.readOnly) {
      this.disabled = true;
    }

    if (this.required) {
      this.isRequired = true;
      if (!this.val) {
        this.errors.add({
          field: this.val,
          msg: this.errorMsg,
        });
      }
    }
  },
};
</script>