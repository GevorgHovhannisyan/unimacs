<template>
  <div>
    <div class="vx-row mt-3 flex items-center">
      <div class="vx-col md:w-1/3 ">
        <vs-input class="w-full" placeholder="Template name" label="Template name" name="name"
          v-model="template.name" />
      </div>

      <div class="vx-col md:w-1/3 ">
        <vs-input class="w-full" placeholder="Template description" label="Template description" name="name"
          v-model="template.description" />
      </div>

      <div class="actions_block  vx-col">
        <vs-button class="mr-6 unimacs_button" style="    margin-top:20px;" @click="saveReport"
          :disabled="!template.name">Submit</vs-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    saveType: {
      type: String,
    },
  },
  data() {
    return {
      template: {
        name: null,
        description: null,
      },
    };
  },
  created() {
    if (this.editedItem.name) this.template.name = this.editedItem.name;
    if (this.editedItem.description)
      this.template.description = this.editedItem.description;
  },
  methods: {
    saveReport() {
      this.$emit("saveReport");
    },
  },
  computed: {
    templates() {
      return this.$store.state.report.edit_template;
    },
    editedItem() {
      return this.$store.state.report.editedReport;
    },
  },
  watch: {
    template: {
      handler: function (data) {
        this.$store.commit("report/EDIT_SET_TEMPLATE", { data });
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.actions_block {
  display: flex;
  justify-content: flex-end;
}
</style>