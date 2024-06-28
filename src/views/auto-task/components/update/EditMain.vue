<template>
  <div class="vx-row">
    <div class="vx-col w-full">
      <vs-input
        label="Name"
        placeholder="Name"
        v-model="task.name"
        class="w-full"
      />
    </div>

    <div class="vx-col w-full mt-3 auto_task_select">
      <label for="" class="vs-input--label">Task Level</label>
      <v-select
        :options="controllers"
        v-model="task.acu"
        @input="changeAcu"
        placeholder="Controller"
        class="select_padding"
        :reduce="(type) => type.id"
        :dir="$vs.rtl ? 'rtl' : 'ltr'"
      />
    </div>

    <div class="vx-col w-full mt-3">
      <label for="" class="vs-input--label">Select Access Point</label>
      <v-select
        :options="access_points"
        placeholder="Access Point"
        class="select_padding"
        v-model="task.access_point"
        :reduce="(type) => type.id"
        :dir="$vs.rtl ? 'rtl' : 'ltr'"
      />
    </div>
    <div class="vx-col">
      <vs-checkbox class="mt-5" v-model="task.enable">Enable </vs-checkbox>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";

export default {
  data() {
    return {
      task: {
        name: null,
        acu: null,
        access_point: null,
        enable: false,
      },
    };
  },
  computed: {

    controllers() {
      const controller_list = [];
      const controllers = this.$store.state.autoTask.controllers;
      if (controllers.length) {
        controllers.forEach((controller) => {
          controller_list.push({
            id: controller.id,
            label: controller.name,
          });
        });
      }
      return controller_list;
    },
    access_points() {
      const access_points = [];
      const access_point_list = this.$store.state.autoTask.access_points;
      if (access_point_list.length) {
        access_point_list.forEach((access_point) => {
          access_points.push({
            id: access_point.id,
            label: access_point.name,
          });
        });
      }
      return access_points;
    },
    task_data() {
      return this.$store.state.autoTask.edit_auto_task;
    },
  },
  methods: {
    changeAcu() {
      this.$store.commit("autoTask/CLEAR_EDIT_REACTION_POINTS")

      this.task.access_point = null;
      if (this.task.acu) {
        this.$store.dispatch("autoTask/fetchController", this.task.acu);
      }
    },
  },
  created() {
    const task_data = JSON.parse(JSON.stringify(this.task_data));
    if(task_data.acu) {
        this.$store.dispatch("autoTask/fetchController", task_data.acu);
    }
    this.task.name = task_data.name;
    this.task.acu = task_data.acu;
    this.task.access_point = task_data.access_point;
    this.task.enable = task_data.enable;
  },
  watch: {
    task: {
      handler: function (task_data, oldData) {
        this.$store.commit("autoTask/SET_EDIT_TASK_DATA", { ...task_data });
      },
      deep: true,
    },
  },
  components: {
    vSelect,
  },
};
</script>

<style lang="scss">
  .auto_task_select {
    .vs__dropdown-menu {
      position: relative;
    }
  }
</style>