<!-- =========================================================================================
    File Name: MailItem.vue
    Description: Mail Item - Displays mail item
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    class="mail__mail-item sm:px-4 px-2 py-6"
    :class="{ 'mail__opened-mail': mail.read }"
  >
    <!-- MAIL ROW 1 : META -->
    <div class="flex items-center ml-1">
      <vs-checkbox
        v-model="isSelectedMail"
        class="vs-checkbox-small ml-0 mr-1"
      ></vs-checkbox>
    </div>
    <div class="flex w-full" @click="$emit('updateOpenMail', mail.id)">
      <vs-avatar
        class="sender__avatar flex-shrink-0 mr-3 border-2 border-solid border-white"
        :src="mail.user.image"
        size="40px"
      ></vs-avatar>

      <div class="flex w-full justify-between items-start">
        <div class="mail__details">
          <div class="ticket_title_block">
            <h5 class="mb-1" :class="{ 'font-semibold': mail.read }">
              {{ mail.user.full_name }}
            </h5>
            <div
              class="todo-tags sm:ml-2 sm:my-0 my-2 flex"
              style="width: 150px !important"
            >
              <vs-chip>
                <div
                  class="h-2 w-2 rounded-full mr-1 height_auto"
                  style="width: 100% !important"
                >
                  <div
                    class="h-2 w-2 rounded-full mr-1"
                    :class="'bg-' + getDepartmentColor(mail.department)"
                  ></div>
                  {{ mail.departments.name }}
                </div>
              </vs-chip>
            </div>
          </div>

          <span v-if="mail.subject">{{ mail.subject }}</span>
          <span v-else>(no subject)</span>
        </div>

        <div class="mail-item__meta flex items-center">
          <div class="email__labels hidden sm:flex items-center">
            <div
              class="h-2 w-2 rounded-full mr-2"
              :class="'bg-' + labelColor(mail)"
            ></div>
          </div>
          <span>
            <span>Create date</span>

            {{ mail.createDate | date }}
            <div class="last_update_block">
              <span>Last update </span>
              <span>{{ mail.updateDate | date }}</span>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mail: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isSelectedMail: this.isSelected,
    };
  },
  watch: {
    isSelected(value) {
      this.isSelectedMail = value;
    },
    isSelectedMail(val) {
      val
        ? this.$emit("addToSelected", this.mail.id)
        : this.$emit("removeSelected", this.mail.id);
    },
  },
  computed: {
    departments() {
      return this.$store.state.department.departments;
    },
    getDepartmentColor() {
      return (id) => {
        return this.departments.length
          ? this.departments.find((d) => d.id == id).color
          : "success";
      };
    },
    labelColor() {
      return (label) => {
        if (label.active) {
          return "success";
        }
        return "danger";
      };
    },
  },

  methods: {
    toggleIsStarred() {
      const payload = { mailId: this.mail.id, value: !this.mail.isStarred };
      this.$store.dispatch("email/toggleIsMailStarred", payload);
    },
  },
};
</script>

<style lang="scss">
.ticket_title_block {
  display: flex;
  .height_auto {
    height: auto !important;
    font-size: 90%;
    display: flex;
    align-items: center;
  }
}
.last_update_block {
  font-size: 90%;
  text-align: right;
}
</style>