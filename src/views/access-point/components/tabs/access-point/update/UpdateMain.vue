<template>
  <div>
    <div class="vx-row mt-3">
      <div class="vx-col md:w-1/2">
        <!-- style="width: 90%" -->
        <vs-input
          class="w-full"
          label="Name"
          v-validate="'required'"
          name="name"
          v-model="main_info.name"
        />
      </div>
      <div class="vx-col md:w-1/2">
      <label for="" class="vs-input--label">Type</label>
        <v-select
          disabled
          v-model="main_info.type"
          :options="points_types"
          class="select_padding w-full"
          name="type"
          placeholder="Type"
          :reduce="(type) => type.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
    </div>

    <div class="vx-row mt-3">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          label="Description"
          v-validate="'required'"
          name="description"
          v-model="main_info.description"
        />
      </div>
    </div>

    <div class="vx-row mt-3">
      <!-- <div class="vx-col md:w-1/2">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="main_info.status"
          >Active</vs-checkbox
        >
      </div> -->

      <!-- <div class="vx-col md:w-1/2">
        <vs-checkbox class="mb-4 mt-5 custom__checkbox" v-model="main_info.actual_passage"
          >Actual passage</vs-checkbox
        >
      </div> -->
    </div>
  </div>
</template>


<script>
import vSelect from "vue-select";

export default {
  props: {
    propsData: {
      type: Object,
    },
  },
  watch: {
    main_info: {
      handler: function (main_info) {
        this.$store.commit("accessPoint/SET_EDIT_POINT_DATA", {
          name: this.active_point,
          data: main_info,
        });
      },
      deep: true,
    },
    active_point(data) {
      let find;
      if (Number.isInteger(+data)) {
        find = this.access_points.find((a) => a.id == +data);
      } else {
        find = {
          ...this.$store.state.accessPoint.edit_acu_data.new_access_points[
            data
          ],
        };
      }

      this.main_info = { ...find };
    },
  },
  computed: {
    points_types() {
      return this.$store.state.accessPoint.points_types;
    },
    active_point() {
      return this.$store.state.accessPoint.edit_active_point;
    },
    access_points() {
      return this.$store.state.accessPoint.edit_acu_data.access_points;
    },
  },
  data() {
    return {
      main_info: {},
    };
  },
  created() {
    let find;
    if (Number.isInteger(+this.active_point)) {
      find = this.access_points.find((a) => a.id == +this.active_point);
    } else {
      find = {
        ...this.$store.state.accessPoint.edit_acu_data.new_access_points[
          this.active_point
        ],
      };
    }

    this.main_info = { ...find };
  },
  components: {
    vSelect,
  },
};
</script>
