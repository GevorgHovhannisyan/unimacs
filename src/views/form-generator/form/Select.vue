<template>
  <div>
    <vs-select
      style="width: 100%"
      class="selectExample mt-4"
      :label="label"
      :name="name"
      v-model="selected"
      @input="$emit('input', $event)"
    >
      <vs-select-item
        v-for="(item, index) in slection"
        :key="index"
        :text="item.name"
        :value="item.id"
      />
    </vs-select>
  </div>
</template>


<script>
export default {
  name: "selects",
  props: ["list", "name", "label"],
  data() {
    return {
      placeholder: "",
      slection: this.list,
      selected: null,
    };
  },

  created() {
    this.slection = this.list;
  },
};
</script>
