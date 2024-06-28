<!-- =========================================================================================
    File Name: EmailSidebar.vue
    Description: Email Application Sidebar(Filter) (Inbox)
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="email__email-sidebar h-full">
    <div class="m-6 clearfix">
      <vs-button
        v-if="canCompose"
        class="unimacs_button w-full"
        icon-pack="feather"
        icon="icon-edit"
        @click="activePrompt = true"
        >Compose</vs-button
      >
    </div>

    <!-- compose email -->
    <vs-prompt
      class="email-compose"
      title="New Message"
      accept-text="Send"
      @cancel="clearFields"
      @accept="sendMail"
      @close="clearFields"
      :is-valid="validateForm"
      :active.sync="activePrompt"
    >
      <component
        :is="scrollbarTag"
        class="scroll-area p-4"
        :settings="settings"
        :key="$vs.rtl"
      >
        <form @submit.prevent>
          <vs-input
            name="mailSubject"
            label-placeholder="Subject"
            v-model="mailSubject"
            class="w-full mb-6"
          />

          <v-select
            v-model="mailDepartment"
            :options="departments"
            class="w-full mb-6 select_padding"
            placeholder="Select department"
            :reduce="(type) => type.id"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />

          <!-- 
          <vs-select
            placeholder="Select department"
            label="Department"
            class="mb-6 w-full"
            v-model="mailDepartment"
          >
            <vs-select-item
              :key="index"
              :value="item.id"
              :text="item.name"
              v-for="(item, index) in departments"
            />
          </vs-select> -->

          <vs-textarea   v-model="mailMessage"  label="Message">


          </vs-textarea>
          
          <!-- <quill-editor
            class="vx-col w-full mb-5"
            label="Message"
            name="message"
            v-model="mailMessage"
          ></quill-editor> -->
          <img :src="avatarSrc" class="mr-8 rounded h-24 w-24" />
          <input
            type="file"
            class="hidden"
            name="file"
            ref="update_avatar_input"
            @change="uploadImage($event.target.files[0])"
          />

         
          <vs-button
            v-if="image"
            type="border"
            class="ml-4 mail_image unimacs_cancel_button"
            @click="removeImg"
            >Delete {{ image.name }}</vs-button
          >

          
          <vs-button
            v-if="!image"
            class="compose-mail-attachment mail_image unimacs_button"
            :show-upload-button="false"
            @click="$refs.update_avatar_input.click()"
            >Attachments</vs-button
          >
          
        </form>
        <vs-alert :active="!validateForm" color="danger" icon="new_releases" >
           Fields can not be empty please enter the data
         </vs-alert>
      </component>
    </vs-prompt>

    <component
      :is="scrollbarTag"
      class="email-filter-scroll-area"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="px-6 pb-2 flex flex-col">
        <!-- inbox -->
        <router-link
          tag="span"
          :to="`${baseUrl}/inbox`"
          class="flex justify-between items-center cursor-pointer"
          :class="{ 'text-primary': mailFilter == 'inbox' }"
        >
          <div class="flex items-center mb-2">
            <feather-icon
              icon="MailIcon"
              :svgClasses="[
                { 'text-primary stroke-current': mailFilter == 'inbox' },
                'h-6 w-6',
              ]"
            ></feather-icon>
            <span class="text-lg ml-3">Inbox</span>
          </div>
        </router-link>
      </div>
      <vs-divider></vs-divider>
      <div class="email__labels px-6 py-4">
        <h5 class="mb-8">Departments</h5>
        <div class="email__lables-list">
          <router-link
            tag="span"
            class="email__label flex items-center mb-4 cursor-pointer"
            v-for="(department, index) in departments"
            :key="index"
            :to="`${baseUrl}/${department.id}`"
          >
            <div
              class="ml-1 h-3 w-3 rounded-full mr-4"
              :class="'border-2 border-solid border-' + department.color"
            ></div>
            <span
              class="text-lg"
              :class="{ 'text-primary': mailFilter == department.id }"
              >{{ department.label }}</span
            >
          </router-link>
        </div>
      </div>

      <vs-divider></vs-divider>
      <div class="email__labels px-6 py-4">
        <h5 class="mb-8">Filter by</h5>
        <div class="email__lables-list">
          <router-link
            tag="span"
            class="email__label flex items-center mb-4 cursor-pointer"
            :to="`${baseUrl}/active`"
          >
            <div
              class="ml-1 h-3 w-3 rounded-full mr-4"
              :class="'border-2 border-solid border-success'"
            ></div>
            <span
              class="text-lg"
              :class="{ 'text-primary': mailFilter == 'active' }"
              >Active</span
            >
          </router-link>

          <router-link
            tag="span"
            class="email__label flex items-center mb-4 cursor-pointer"
            :to="`${baseUrl}/closed`"
          >
            <div
              class="ml-1 h-3 w-3 rounded-full mr-4"
              :class="'border-2 border-solid border-danger'"
            ></div>
            <span
              class="text-lg"
              :class="{ 'text-primary': mailFilter == 'closed' }"
              >Closed</span
            >
          </router-link>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { quillEditor } from "vue-quill-editor";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import moduleDepartment from "../../store/department/moduleDepartment.js";
import moduleFile from "@/store/files/moduleFile.js";
import vSelect from "vue-select";

export default {
  props: {
    emailTags: {
      type: Array,
      required: true,
    },
    mailFilter: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activePrompt: false,
      mailSubject: "",
      mailDepartment: null,
      departments: [],
      image: null,
      mailMessage: "",
      avatarSrc: "/ApHandler.png",
      imageTooltip: "No image",
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
    };
  },
  computed: {
    validateForm() {
      return  (this.mailSubject !== "" &&  this.mailDepartment != null &&  this.mailMessage != "");
    },
    baseUrl() {
      const path = this.$route.path;
      return path.slice(0, path.lastIndexOf("/"));
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    canCompose() {
      return localStorage.user ? JSON.parse(localStorage.user).company : null;
    },
    // departments() {
    //   return this.$store.state.department.departments;
    // },
  },
  methods: {
    required(v) { return !!v || "field required"},
    clearFields() {
      this.$nextTick(() => {
        this.mailSubject = "";
        this.mailMessage = "";
        this.avatarSrc = "/ApHandler.png";
        this.imageTooltip = "No Image";
        this.image = null;
        this.mailDepartment = null;
      });
    },
    sendMail() {


      if(! this.mailDepartment){
       return false;
      }else{
        let saveTicket = {
        subject: this.mailSubject,
        message: this.mailMessage,
        department: this.mailDepartment,
        image: this.image ? JSON.stringify(this.image) : null,
      };
      

      this.$store
        .dispatch("email/createTicket", saveTicket)
        .then((res) => {
          console.log("res",res);
          this.clearFields();

              this.$vs.notify({
              color:'success',
              title:'Ticket Created Successfully',
              text:`Your ticket has been created successfully. A member of our support team will be in touch with you shortly. Ticket ID: ${res.data.id}`
              })
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
          this.imageTooltip = res.data.name;
          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    removeImg() {
      this.image = null;
      this.avatarSrc = "/ApHandler.png";
      this.imageTooltip = "No Image";
    },
  },
  created() {
    if (!moduleDepartment.isRegistered) {
      this.$store.registerModule("department", moduleDepartment);
      moduleDepartment.isRegistered = true;
    }

    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    this.departments = [];
    this.$store
      .dispatch("department/fetchDepartments")
      .then((res) => {
        if (res.data.length) {
          res.data.forEach((dep) => {
            this.departments.push({ id: dep.id, label: dep.name });
          });
        }
        this.$vs.loading.close();
      })
      .catch((error) => {
        this.$vs.loading.close();
      });
  },
  components: {
    quillEditor,
    vSelect,
    VuePerfectScrollbar,
  },
};
</script>

