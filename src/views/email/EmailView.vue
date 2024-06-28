<!-- =========================================================================================
    File Name: EmailView.vue
    Description: Email Application - Single Email View (Inbox)
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div>
    <vs-prompt
      class="email-compose"
      title="Reply Message"
      accept-text="Send"
      @cancel="clearFields"
      @accept="sendMail"
      @close="clearFields"
      :active.sync="activePrompt"
    >
      <component
        :is="scrollbarTag"
        class="scroll-area p-4"
        :settings="settings"
        :key="$vs.rtl"
      >
        <form @submit.prevent>
          <vs-textarea v-model="mailMessage" />
          <img :src="avatarSrc" class="mr-8 rounded h-24 w-24 image_avatar" />
          <input
            type="file"
            class="hidden"
            name="file"
            ref="update_avatar_input"
            @change="uploadImage($event.target.files[0])"
            multiple
          />
          <vs-button
            color="danger"
            v-if="image"
            type="border"
            class="ml-4 mail_image"
            @click="removeImg"
            >Delete {{ image.name }}</vs-button
          >

          <vs-button
            v-if="!image"
            class="compose-mail-attachment mail_image"
            :show-upload-button="false"
            @click="$refs.update_avatar_input.click()"
            >Attachments</vs-button
          >
        </form>
      </component>
    </vs-prompt>

    <vs-sidebar
      click-not-close
      parent="#email-app"
      :hidden-background="true"
      class="full-vs-sidebar email-view-sidebar items-no-padding"
      v-model="isSidebarActive"
      position-right
    >
      <div class="mail-sidebar-content px-0 sm:pb-6 h-full" v-if="currentMail">
        <div
          class="flex flex-wrap items-center email-header justify-between md:px-8 px-6 sm:pb-2 sm: pt-6 d-theme-dark-bg"
        >
          <div class="flex mb-4 ticket_inner_head">
            <feather-icon
              :icon="$vs.rtl ? 'ArrowRightIcon' : 'ArrowLeftIcon'"
              @click="$emit('closeSidebar')"
              class="cursor-pointer mr-4"
              svg-classes="w-6 h-6"
            ></feather-icon>
            <div class="flex items-center ticket_status_block">
              <h4 v-if="currentMail.subject">{{ currentMail.subject }}</h4>
              <h4 v-else>(no subject)</h4>
              <div @click="changeTicketStatus(currentMail)">
                <vs-chip
                  class="ag-grid-cell-chip status_div"
                  :color="chipColor(currentMail.active)"
                >
                  <span class="colorss status_button">{{
                    currentMail.active ? "Close" : "Closed"
                  }}</span>
                </vs-chip>
              </div>
            </div>
          </div>
          <div class="ml-10 mb-4 mt-1"></div>
        </div>

        <component
          :is="scrollbarTag"
          class="scroll-area-mail-content md:px-8 md:pb-8 pt-4 px-6 pb-6"
          :settings="settings"
          :key="$vs.rtl"
        >
          <!-- LABEL ROW -->
          <div class="vx-row">
            <div class="vx-col w-full">
              <div class="email__labels--single flex ml-10 items-center mt-2">
                <transition-group name="list" tag="div" class="flex">
                  <div
                    v-for="label in currentMail.labels"
                    :key="label"
                    class="open-mail-label flex items-center mr-4"
                  >
                    <div
                      class="h-3 w-3 rounded-full mr-1"
                      :class="'bg-' + labelColor(label)"
                    ></div>
                    <span class="text-sm">{{ label | capitalize }}</span>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
          <!-- /LABEL ROW -->
          <br />

          <div v-if="isSidebarActive">
            <!-- LATEST MESSAGE -->
            <div class="vx-row">
              <div class="vx-col w-full">
                <email-mail-card :mailContent="currentMail" />
              </div>
            </div>

            <div class="vx-row" style="margin-top: 2.2rem">
              <div class="vx-col w-full">
                <vx-card>
                  <div class="vx-row">
                    <div class="vx-col w-full flex justify-between">
                      <span class="text-lg"
                        >Click here to
                        <span
                          class="text-primary font-semibold cursor-pointer"
                          @click="replyTicket"
                          >Reply</span
                        >
                      </span>
                      <feather-icon icon="PaperclipIcon"></feather-icon>
                    </div>
                  </div>
                </vx-card>
              </div>
            </div>
          </div>
        </component>
      </div>
    </vs-sidebar>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import EmailMailCard from "./EmailMailCard.vue";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  props: {
    emailTags: {
      type: Array,
      required: true,
    },
    openMailId: {
      required: true,
      validator: (prop) => typeof prop === "number" || prop === null,
    },
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    mailFilter: {
      type: String,
    },
  },
  data() {
    return {
      mailMessage: "",
      image: null,
      showThread: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.5,
      },
      avatarSrc: "/ApHandler.png",

      activePrompt: false,
      successButton: "success",
    };
  },
  watch: {
    isSidebarActive(value) {
      if (!value) {
        this.$emit("closeSidebar");
        setTimeout(() => {
          this.showThread = false;
        }, 500);
      }
    },
  },
  computed: {
    currentMail() {
      return this.$store.getters["email/getMail"](this.openMailId);
    },
    labelColor() {
      return (label) => {
        const tags = this.$store.state.email.mailTags;
        return tags.find((tag) => {
          return tag.value === label;
        }).color;
      };
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    chipColor() {
      return (value) => {
        if (value === true) return "success";
        else if (value === false) return "danger";
      };
    },
  },
  methods: {
    sendMail() {
      let user = JSON.parse(localStorage.user);
      let saveTicket = {
        ticket_id: this.currentMail.id,
        user_id: user.id,
        text: this.mailMessage,
        user: user,
        image: JSON.stringify(this.image),
      };

      this.$store
        .dispatch("email/replyMessage", saveTicket)
        .then((res) => {
          this.image = null;
          res.data.users = user;
          if (res.data.users.avatar) {
            res.data.users.avatar = JSON.parse(res.data.users.avatar);
            res.data.users.image = `${process.env.VUE_APP_BACK}/${res.data.users.avatar.path}`;
          } else {
            res.data.users.image = "/no_avatar.svg";
          }

          if (res.data.image) {
            res.data.image = JSON.parse(res.data.image);
          }

          this.$root.$emit("replied", res.data);

          this.clearFields();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    toggleIsStarred() {
      const payload = {
        mailId: this.openMailId,
        value: !this.currentMail.isStarred,
      };
      this.$store.dispatch("email/toggleIsMailStarred", payload);
    },
    replyTicket() {
      this.activePrompt = true;
    },
    clearFields() {
      this.$nextTick(() => {
        this.mailMessage = "";
        this.avatarSrc = "/ApHandler.png";
      });
    },
    changeTicketStatus(currMail) {
      if (!currMail.active) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: "Ticket already closed",
        });
      } else {
        let obj = {
          id: currMail.id,
          active: false,
        };

        this.$store
          .dispatch("email/changeStatus", obj)
          .then((res) => {
            this.currentMail.active = false;
            this.successButton = "danger";
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Ticket closed",
            });
          })
          .catch((error) => {
            this.$vs.loading.close();
          });
      }
    },
    uploadImage(image) {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("file/ticketImage", image)
        .then((res) => {
          this.image = { name: res.data.name, path: res.data.path };
          this.avatarSrc = `${process.env.VUE_APP_BACK}/${res.data.path}`;
          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    removeImg() {
      this.image = null;
      this.avatarSrc = "/ApHandler.png";
    },
  },
  components: {
    VuePerfectScrollbar,
    EmailMailCard,
    quillEditor,
  },
  updated() {
    if (!this.currentMail) return;
    if (this.currentMail.unread && this.isSidebarActive)
      this.$store.dispatch("email/setUnread", {
        emailIds: [this.openMailId],
        unread: false,
      });
  },
};
</script>

<style lang="scss">
.status_button {
  cursor: pointer;
  padding: 5px 10px;
  &:hover {
    opacity: 0.7;
    transition: all 0.4s;
    box-shadow: 0px 1px 5px #6a6d7b;
    border-radius: 20px;
  }
}
.mail_image {
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100px;
  }
}
.status_div {
  padding-right: 0px !important;
  min-width: auto !important;
  min-height: auto !important;
  .text-chip {
    margin: 0;
  }
}

.image_avatar {
  min-width: 120px;
}
</style>