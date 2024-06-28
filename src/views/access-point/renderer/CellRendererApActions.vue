<template>
  <div>
    <vs-dropdown vs-trigger-click class="cursor-pointer ml-3" vs-custom-content>
      <div class="p-3 cursor-pointer">
        <span class="mr-2 leading-none"
          ><vs-icon
            style="font-size: 25px"
            icon-pack="material-icons"
            icon="reorder"
        /></span>
      </div>

      <vs-dropdown-menu>
        <vs-dropdown-item
          @click.stop="
            !params.data.disabled || action.action === 'deleteAccessP'
              ? $root.$emit(action.action, params.data)
              : false
          "
          v-for="(action, index) in contextMenus"
          :key="index"
          :class="{
            drop_dsbl:
              params.data.disabled && action.action !== 'deleteAccessP',
          }"
        >
          <span class="flex items-center">
            <span>{{ action.name }}</span>
          </span>
        </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
export default {
  name: "CellRendererApActions",
  data() {
    return {
      contextMenus: [
        { name: "Delete", action: "deleteAccessP" },
        { name: "Edit", action: "updateAccessP" },
      ],
    };
  },
  methods: {
    // editRecord() {
    //   this.$root.$emit("cardholderEdit", this.params);
    // },
    // confirmDeleteRecord() {
    //   this.$root.$emit("cardholderRemove", this.params);
    // },
  },
};
</script>
