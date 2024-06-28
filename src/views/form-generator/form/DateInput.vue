<template>
  <div>
    {{ label }}
    <flat-pickr
      :config="configdateTimePicker"
      v-model="val"
      placeholder="Date/Time"
    />
  </div>
</template>


<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  name: "dateInput",
  props: ["name", "label", "value"],
  data() {
    return {
      val: this.value,

      //   datetime: null,
      configdateTimePicker: {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
      },
    };
  },
  components: {
    flatPickr,
  },
  watch: {
    val(newV, oldV) {
      this.val = newV;
      this.$emit("input", this.val);
    },
  },
};
</script>
