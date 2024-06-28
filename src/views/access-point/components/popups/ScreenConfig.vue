<template>
  <vs-popup class="holamundo" title="Screen configuration" :active.sync="popup">
    <div class="vx-row">
      <div class="vx-col md:w-full">
        
        <h5>Access Points screen elements</h5>
      </div>
      <div class="vx-col md:w-full mt-5">
        <span>
          <vs-checkbox class="mt-3" v-model="access_p">Access
            Points
            table</vs-checkbox>
        </span>
      </div>
      <div class="vx-col md:w-full mt-5">
        <span>
          <vs-checkbox class="mb-4 mt-5" v-model="acu">ACU
            Table</vs-checkbox>
        </span>
      </div>
      <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse; padding: 0">
        <vs-button class="mt-5 ml-5 unimacs_button" @click="submit">
          Submit
        </vs-button>
        <vs-button class="mt-5 unimacs_cancel_button" @click="popup = false">
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
  watch: {
    popupActive(val) {
      this.popup = val;
      this.$emit("popup", val);
    },
    popup(val) {
      this.$emit("popup", val);
    },
  },
  computed: {},
  data() {
    return {
      popup: false,
      access_p: true,
      acu: true,
    };
  },
  methods: {
    submit() {
      localStorage.setItem('acu_table', this.acu)
      localStorage.setItem('point_table', this.access_p)
      this.$emit("submitScreen");
      this.popup = false;
    }
  },
  created() {
    this.popup = this.popupActive;
    const point_table = localStorage.getItem('point_table')
    const acu_table = localStorage.getItem('acu_table')
    this.access_p = point_table == 'false' ? false : true
    this.acu = acu_table == 'false' ? false : true
  },
  components: {},
};
</script>

