<template>
  <div>
    <div class="vx-row mt-3 flex items-center">
      <div class="vx-col md:w-1/3 ">
        <vs-input
          placeholder="Template name"
          label="Template name"
          name="name"
          class="w-full"
          v-model="template.name"
        />
      </div>

      <div class="vx-col md:w-1/3 ">
        <vs-input
          placeholder="Template description"
          label="Template description"
          class="w-full"
          name="name"
          v-model="template.description"
        />
      </div>

      <div class="actions_block  vx-col">
        <vs-button
          class="mr-6  unimacs_button"
          @click="saveReport"
          style="    margin-top:20px;"
          :disabled="!template.name"
          >Submit</vs-button
        >
      </div>


    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      template: {
        name: null,
        description: null,
      },
    };
  },
  created() {
    if (this.templates) {
      this.template = { ...this.templates };
    }

    this.$root.$on("clearReports", () => {
      this.template = {
        name: null,
        description: null,
      };
      this.$store.commit("report/REMOVE_TEMPLATES", {});
    });
  },
  methods: {
    saveReport() {
      this.$emit("saveReport");
    },
  },
  computed: {
    templates() {
      return this.$store.state.report.template;
    },
  },
  watch: {
    template: {
      handler: function (data) {
        this.$store.commit("report/SET_TEMPLATE", { data });
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