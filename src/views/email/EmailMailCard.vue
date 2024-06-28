<!-- =========================================================================================
    File Name: EmailMailCard.vue
    Description: Email Application - Single Email Card View
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template >
  <div>
    <vx-card class="px-4">
      <!-- :class="data.staticClass" -->
      <!-- MAIL HEAD -->
      <div class="vx-row">
        <div
          class="vx-col w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid flex justify-between flex items-center"
        >
          <!-- Sender Details -->
          <div class="flex items-center">
            <div>
              <vs-avatar
                class="sender__avatar--single flex-shrink-0 mr-3 border-2 border-solid border-white"
                :src="mailContent.user.image"
                size="65px"
              />
            </div>

            <div class="flex flex-col">
              <h5 class="mb-1">{{ mailContent.user.full_name }}</h5>
              <div class="flex items-center">
                <!-- <span class="text-sm">{{ mailContent.sender }}</span> -->
                <vs-dropdown
                  vs-custom-content
                  vs-trigger-click
                  class="inline-flex cursor-pointer"
                >
                  <feather-icon icon="ChevronDownIcon" class="w-3 h-3" />
                  <vs-dropdown-menu style="z-index: 40001">
                    <div class="p-2">
                      <p class="text-sm mb-1">
                        From:
                        <span class="font-semibold">
                          {{
                            mailContent.user.company_name
                              ? mailContent.user.company_name + " "
                              : " "
                          }}

                          ({{
                            mailContent.user.first_name +
                            ` <${mailContent.user.email}>`
                          }})
                        </span>
                      </p>
                      <p class="text-sm mb-1">
                        To:
                        <span class="font-semibold">
                          {{ mailContent.departments.name }}
                        </span>
                      </p>
                      <p class="text-sm mb-1">
                        Date:
                        <span class="font-semibold">
                          {{
                            $moment(mailContent.createDate).format(
                              "yyyy-MM-DD HH:MM"
                            )
                          }}
                        </span>
                      </p>
                    </div>
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </div>
          </div>
          <!-- /Sender Details -->

          <!-- Mail Time & Date -->
          <div class="flex flex-col justify-end">
            <span class="text-right">{{ mailContent.createDate | date }}</span>
          </div>
        </div>
        <!-- /Mail Time & Date -->
      </div>

      <!-- MAIL CONTENT -->
      <div class="vx-row">
        <div class="vx-col w-full">
          <div
            class="mail__content break-words mt-8 mb-4"
            v-html="mailContent.message"
          ></div>
        </div>
      </div>

      <!-- MAIL ATTACHMENTS -->
      <div class="vx-row" v-if="mailContent.image">
        <div
          class="vx-col w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid mb-6 flex"
        >
          <feather-icon icon="PaperclipIcon" class="mr-2" />
          <span class="block py-4">ATTACHMENTS</span>
        </div>
        <div class="flex">
          <div class="mail__attachment">
            <a
              :href="`${env}/${mailContent.image.path}`"
              download
              target="_blank"
            >
              <vs-chip
                color="primary"
                class="px-4 py-2 mr-3"
                style="cursor: pointer"
                >{{ mailContent.image.name }}</vs-chip
              ></a
            >
          </div>
        </div>
      </div>
    </vx-card>
    <div class="replies" v-if="replies.length">
      <vx-card
        class="px-4"
        style="margin-top: 25px"
        v-for="(reply, index) in replies"
        :key="index"
      >
        <!-- :class="data.staticClass" -->
        <!-- MAIL HEAD -->
        <div class="vx-row">
          <div
            class="vx-col w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid flex justify-between flex items-center"
          >
            <!-- Sender Details -->
            <div class="flex items-center">
              <div>
                <vs-avatar
                  class="sender__avatar--single flex-shrink-0 mr-3 border-2 border-solid border-white"
                  :src="reply.users.image"
                  size="65px"
                />
              </div>

              <div class="flex flex-col">
                <h5 class="mb-1">{{ reply.users.full_name }}</h5>
                <div class="flex items-center">
                  <!-- <span class="text-sm">{{ mailContent.sender }}</span> -->
                  <vs-dropdown
                    vs-custom-content
                    vs-trigger-click
                    class="inline-flex cursor-pointer"
                  >
                    <feather-icon icon="ChevronDownIcon" class="w-3 h-3" />
                    <vs-dropdown-menu style="z-index: 40001">
                      <div class="p-2">
                        <p class="text-sm mb-1">
                          From:
                          <span class="font-semibold">
                            {{ reply.users.full_name }}
                          </span>
                        </p>
                        <p class="text-sm mb-1">
                          To:
                          <span class="font-semibold">
                            {{ mailContent.user.full_name }}
                          </span>
                        </p>
                        <p class="text-sm mb-1">
                          Date:
                          <span class="font-semibold">
                            {{ reply.updateDate | date }}
                          </span>
                        </p>
                      </div>
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
              </div>
            </div>
            <!-- /Sender Details -->

            <!-- Mail Time & Date -->
            <div class="flex flex-col justify-end">
              <span class="text-right">{{ mailContent.time | time }}</span>
              <div class="flex justify-end mt-2">
                <span class="text-right">{{ reply.updateDate | date }}</span>
              </div>
            </div>
          </div>
          <!-- /Mail Time & Date -->
        </div>

        <!-- MAIL CONTENT -->
        <div class="vx-row">
          <div class="vx-col w-full">
            <div
              class="mail__content break-words mt-8 mb-4"
              v-html="reply.text"
            ></div>
          </div>
        </div>

        <!-- MAIL ATTACHMENTS -->
        <div class="vx-row" v-if="reply.image">
          <div
            class="vx-col w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid mb-6 flex"
          >
            <feather-icon icon="PaperclipIcon" class="mr-2" />
            <span class="block py-4">ATTACHMENTS</span>
          </div>
          <div class="flex">
            <div class="mail__attachment">
              <a :href="`${env}/${reply.image.path}`" download target="_blank">
                <vs-chip
                  color="primary"
                  class="px-4 py-2 mr-3"
                  style="cursor: pointer"
                  >{{ reply.image.name }}</vs-chip
                ></a
              >
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mailContent: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      replies: [],
      env: process.env.VUE_APP_BACK,
    };
  },
  created() {
    this.$store
      .dispatch("email/fetchEmail", this.mailContent.id)
      .then((res) => {
        this.replies = [];
        const replies = res.data.ticket_messages.length
          ? res.data.ticket_messages
          : [];

        if (replies.length) {
          replies.forEach((reply) => {
            if (reply.users.avatar) {
              reply.users.avatar = JSON.parse(reply.users.avatar);
              reply.users.image = `${process.env.VUE_APP_BACK}/${reply.users.avatar.path}`;
            } else {
              reply.users.image = "/no_avatar.svg";
            }

            if (reply.image) {
              reply.image = JSON.parse(reply.image);
            }

            this.replies.push(reply);
          });
        }
      })
      .catch((error) => {
        this.$vs.loading.close();
      });

    this.$root.$on("replied", (data) => {
      this.replies.push(data);
    });
  },
};
</script>
