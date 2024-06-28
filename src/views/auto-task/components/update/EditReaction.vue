<template>
  <div class="vx-row">
    <div class="vx-col w-full">
      <label class="vs-input--label">Reaction type</label>
      <v-select
        v-model="reactions.reaction_type"
        :options="reaction_types"
        class="select_padding w-full"
        name="status"
        placeholder="Reaction type"
        :reduce="(source) => source.id"
        :dir="$vs.rtl ? 'rtl' : 'ltr'"
      />
    </div>

    <div class="vx-col w-full mt-2">
      <label class="vs-input--label">Access Point</label>
      <v-select
        v-model="reactions.reaction_access_points"
        :options="access_points"
        multiple
        class="select_padding w-full"
        name="status"
        placeholder="Access Point"
        :reduce="(source) => source.id"
        :dir="$vs.rtl ? 'rtl' : 'ltr'"
      />
    </div>

    <div class="vx-col w-full mt-3">
      <CommandsTable
        @changeCommand="changeCommand($event)"
        :headers="command_headers"
        :items="command_list"
        :selected="reactions.reaction"
      />
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import CommandsTable from "./EditCommandsTable";
export default {
  data() {
    return {
      reactions: {
        reaction: null,
        reaction_access_points: [],
        reaction_type: null,
      },
      command_headers: [
        { name: "No", key: "number" },
        { name: "Command list", key: "command_list" },
      ],
      reaction_types: [
        {
          id: "OUTPUT_MANAGEMENT_RELAY_MODULE",
          label: "Output managment relay module",
        },
        {
          id: "MANAGEMENT_OF_OUTPUT_CONTROLLERS",
          label: "Managment of output controllers",
        },
        {
          id: "MANAGEMENT_OF_ACCESS_POINTS",
          label: "Managment of access points",
        },
      ],
    };
  },
  created() {
    const task_data = JSON.parse(JSON.stringify(this.task_data));
    this.reactions.reaction = task_data.reaction;
    if(task_data.reaction_access_points && typeof task_data.reaction_access_points === 'string')  {
        this.reactions.reaction_access_points = JSON.parse(task_data.reaction_access_points);
    } else {
        this.reactions.reaction_access_points = task_data.reaction_access_points;
    }
    this.reactions.reaction_type = task_data.reaction_type;
  },
  methods: {
    changeCommand(command) {
      this.reactions.reaction = command;
    },
  },
  computed: {
     task_data() {
      return this.$store.state.autoTask.edit_auto_task;
    },
    command_list() {
      const commands = [];
      const command_list = this.$store.state.autoTask.commands;

      for (const key in command_list) {
        const name = command_list[key].split("\\").join(" ");
        commands.push({ id: key, name });
      }
      return commands;
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
  },
  watch: {
    reactions: {
      handler: function (reaction_data, oldData) {
        this.$store.commit("autoTask/SET_EDIT_REACTIONS_DATA", { ...reaction_data });
      },
      deep: true,
    },
  },
  components: {
    vSelect,
    CommandsTable,
  },
};
</script>

<style lang="scss">
.reactions_btn {
  display: flex;
  justify-content: flex-start;
}
</style>