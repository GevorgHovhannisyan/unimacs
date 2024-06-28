<template>
  <div class="mt-3">
    {{ label }}
    <vs-select
      placeholder="Multiple"
      multiple
      label="Figuras"
      v-model="selected"
      @input="check($event)"
    >
      <vs-select-item
        :key="index"
        :value="item.id"
        :text="item.name"
        v-for="(item, index) in slection"
      />
    </vs-select>

    <br />
  </div>
</template>

<script>
import vSelect from "vue-select";
export default {
  name: "multiSelect",
  props: ["selections", "name", "label", "value"],
  data() {
    return {
      selected: [],
      defaultLng: "en",
      options: [],
      slection: this.selections,
    };
  },
  methods: {
    check(event) {
      this.$emit("input", this.selected);
    },
  },

  created() {
    let arr = [];

    this.defaultLng = process.env.VUE_APP_DEFAULT_LNG;
    if (this.value && Array.isArray(this.value)) {
      this.selected = this.value;
    }

    if (this.slection && !Array.isArray(this.slection)) {
      this.$http
        .get(`${this.slection}`, {
          headers: {
            Authorization: localStorage.token,
          },
        })
        .then((res) => {
          if (res.data.data && res.data.data.length) {
            res.data.data.forEach((element) => {
              if (element.name[this.defaultLng]) {
                arr.push({
                  id: element.id,
                  name: element.name[this.defaultLng],
                });
              } else {
                arr.push({ id: element.id, name: element.name });
              }
            });
          } else if (!this.slection) {
            arr = [{ name: "No Selection", id: null }];
          }

          this.slection = arr;

          //   if (res.data.data && res.data.data.length) {
          //     res.data.data.forEach((element) => {
          //       arr.push({ id: element.id, name: element.name });
          //     });
          //     // this.slection = arr;
          //   }
        });
    }
  },
  components: {
    "v-select": vSelect,
  },
};
</script>