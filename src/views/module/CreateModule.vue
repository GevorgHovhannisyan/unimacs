<template>
  <div class="modulesPage">
    <!-- <vs-dropdown vs-trigger-click class="cursor-pointer mr-5 mb-5">
      <div
        class="p-3 shadow-drop rounded-lg d-theme-dark-light-bg cursor-pointer flex items-end justify-center text-lg font-medium w-32"
      >
        <span class="mr-2 leading-none">Language</span>
        <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
      </div>

      <vs-dropdown-menu>
        <vs-dropdown-item @click="selectAll">
          <span class="flex items-center">
            <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
            <span>All languagaes</span>
          </span>
        </vs-dropdown-item>

        <vs-dropdown-item
          v-for="language in languages"
          :key="language.id"
          @click="changeLanguage(language.iso)"
        >
          <span class="flex items-center">
            <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
            <span>{{ language.title }}</span>
          </span>
        </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown> -->

    <vs-button type="border" class="mr-4" @click="save">Save</vs-button>

    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6 pb-8">
        <vs-tabs class="tab-action-btn-fill-conatiner">
          <vs-tab label="Content" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <vx-card title class="mt-base" no-shadow >
                <form-generator
                  :schema="arrayOfForm"
                  v-model="formData"
                ></form-generator>
              </vx-card>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
// import modulePage from "@/store/page/modulePage.js";
// import scheme from "../form-generator/page-configs/conf.json";
import FormGenerator from "../form-generator/FormGenerator";
// import VueFormGenerator from "vue-form-generator";

export default {
  components: {
    quillEditor,
    FormGenerator,
  },
  data() {
    return {
      field: null,
      check: true,
      formData: {},
      cansee: false,
      arrayOfForm: [],
      scheme: null,
      all: false,
      languages: this.$store.state.languages,
      lng: localStorage.lng,
      imageSrc: "/no_avatar.svg",
      forGen: "",
      page: {
        title: {
          en: "",
          ru: "",
          am: "",
        },
        slug: {
          en: "",
          ru: "",
          am: "",
        },
        body: {
          en: "",
          ru: "",
          am: "",
        },

        published: {
          en: "",
          ru: "",
          am: "",
        },
        image: null,
        files: null,
        status: false,
      },
    };
  },
  methods: {
    generateUrl() {
      this.page.url = this.page.title;
    },
    inputTitle() {
      this.page.url = this.page.title;
    },
    save() {
      if (this.errors && this.errors.items.length) {
        let errors = [];
        this.errors.items.forEach((err) => {
          errors.push(err.field);
        });

        this.$vs.notify({
time: 7000,
          color: "danger",
          title: `${errors} required`,
        });
        return false;
      } else {
        this.page.name = this.$route.params.name;
        const name = this.$route.params.submenu
          ? this.$route.params.submenu
          : this.$route.params.name;
        let obj = {};
        let newObj = {};
        let checkName = null;

        Object.keys(this.formData).forEach((key) => {
          if (key.split("__").length > 1) {
            let keys = key.split("__");
            if (!checkName) {
              checkName = keys[0];
            }

            if (checkName != keys[0]) {
              newObj = {};
              checkName = keys[0];
            }

            if (checkName == keys[0]) {
              newObj[keys[1]] = this.formData[key];
              obj[keys[0]] = newObj;
            }
          } else {
            obj[key] = this.formData[key];
          }
        });

        this.$vs.loading({
          type: "corners",
        });

        this.$http
          .post(`${name}`, obj, {
            headers: { Authorization: localStorage.token },
          })
          .then((response) => {
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Module created",
            });
            this.$vs.loading.close();

            // this.$router.push("/module");
            this.$router.go(-1);
          })
          .catch((error) => {
            this.$vs.loading.close();
          });
      }
    },
    changeLanguage(lng) {
      this.all = false;
      localStorage.lng = lng;
    },
    selectAll() {
      localStorage.lng = "all";

      this.all = true;
    },
  },
  created() {
    const submenu = this.$route.params.submenu;

    // this.$vs.loading({
    //   type: "corners"
    // });

    // if (!modulePage.isRegistered) {
    //   this.$store.registerModule("page", modulePage);
    //   modulePage.isRegistered = true;
    // }
    let data;

    let result = JSON.parse(localStorage.modules);
    data = result[this.$route.params.name];
    const languages = this.languages;

    if (data.fields) {
      this.field = data.fields;

      Object.keys(data.fields).forEach((key) => {
        if (data.fields[key].multiLng) {
          languages.forEach((lng) => {
            let obj = {};

            obj["type"] = data.fields[key].formType;
            obj[`name`] = `${key}__${lng.iso}`;
            obj["label"] = data.fields[key].label + " " + lng.iso;

            if (data.fields[key].selections) {
              obj["selections"] = data.fields[key].selections;
            }

            if (data.fields[key].hidden) {
              obj["hidden"] = true;
            }

            if (data.fields[key].required) {
              obj["required"] = true;
            }

            if (data.fields[key].readOnly) {
              obj["readOnly"] = true;
            }

            this.arrayOfForm.push(obj);
          });
        } else {
          let obj = {};

          obj["type"] = data.fields[key].formType;
          obj["name"] = key;
          obj["label"] = data.fields[key].label;

          if (data.fields[key].selections) {
            obj["selections"] = data.fields[key].selections;
          }

          if (data.fields[key].readOnly) {
            obj["readOnly"] = true;
          }

          if (data.fields[key].hidden) {
            obj["hidden"] = true;
          }

          if (data.fields[key].required) {
            obj["required"] = true;
          }
          this.arrayOfForm.push(obj);
        }
      });
    } else if (data["submenu"][submenu]) {
      this.field = data["submenu"][submenu].fields;

      Object.keys(data["submenu"][submenu].fields).forEach((key) => {
        if (data["submenu"][submenu].fields[key].multiLng) {
          languages.forEach((lng) => {
            let obj = {};

            obj["type"] = data["submenu"][submenu].fields[key].formType;
            obj[`name`] = `${key}__${lng.iso}`;
            obj["label"] =
              data["submenu"][submenu].fields[key].label + " " + lng.iso;

            if (data["submenu"][submenu].fields[key].selections) {
              obj["selections"] =
                data["submenu"][submenu].fields[key].selections;
            }

            if (data["submenu"][submenu].fields[key].hidden) {
              obj["hidden"] = true;
            }

            if (data["submenu"][submenu].fields[key].required) {
              obj["required"] = true;
            }

            if (data["submenu"][submenu].fields[key].readOnly) {
              obj["readOnly"] = true;
            }

            this.arrayOfForm.push(obj);
          });
        } else {
          let obj = {};

          obj["type"] = data["submenu"][submenu].fields[key].formType;
          obj["name"] = key;
          obj["label"] = data["submenu"][submenu].fields[key].label;

          if (data["submenu"][submenu].fields[key].selections) {
            obj["selections"] = data["submenu"][submenu].fields[key].selections;
          }

          if (data["submenu"][submenu].fields[key].readOnly) {
            obj["readOnly"] = true;
          }

          if (data["submenu"][submenu].fields[key].hidden) {
            obj["hidden"] = true;
          }

          if (data["submenu"][submenu].fields[key].required) {
            obj["required"] = true;
          }
          this.arrayOfForm.push(obj);
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.section_page_published {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section_page_inputs {
  padding: 0 10px 0 15px;
}

.btn_generate {
  width: 25%;
}

.url_block {
  width: 80% !important;
}

.url_block_input {
  .flex-grow {
    display: flex;
    align-items: center;
  }
}

.vx-input-group .vx-input-group-default .vs-input {
  width: 100% !important;
}

.all_meta {
  display: flex;
  justify-content: space-between;

  .mb-base {
    width: 100% !important;
  }
}

.meta_block {
  display: flex;
  justify-content: space-between;

  .mb-base {
    width: 100% !important;
  }
}

.upload_block {
  display: flex;
  flex-wrap: wrap;
}

.file-upload {
  position: relative;
  overflow: hidden;
  margin: 10px;
}

.file-upload {
  position: relative;
  overflow: hidden;
  margin: 10px;
  width: 100%;
  max-width: 150px;
  text-align: center;
  color: #fff;
  font-size: 1.2em;
  background: transparent;
  border: 2px solid #888;
  padding: 0.85em 1em;
  display: inline;
  -ms-transition: all 0.2s ease;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;

  &:hover {
    background: #999;
    -webkit-box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.75);
    -moz-box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.75);
    box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 0.75);
  }
}

.file-upload input.file-input {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  filter: alpha(opacity=0);
  height: 100%;
}

.inner_block {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
  -webkit-transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 25px;
  width: 100%;
  height: 100%;
}

.upload_inner {
  flex: 0 0 20%;
  max-width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 15px;
}

.upload_img {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  padding-bottom: 55.5%;
  position: relative;
  width: 100%;

  img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}

.remove_btn {
  margin-bottom: 25px;
  margin-top: 25px;

  a {
    background: #7367f0;
    color: white;
    padding: 10px 25px;
    border-radius: 5px;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.5;
    }
  }
}

.upload_btn {
  padding: 0 !important;
  border: none !important;

  &:hover {
    background: none !important;
    opacity: 0.5;
  }
}

.create_page {
  .vs-component.vs-con-input-label {
    display: inline-block;
  }

  .vx-row {
    margin: 0;

    img {
      height: 90px !important;
      max-height: 90px;
      max-width: 100% !important;
      width: auto !important;
    }
  }
}

.vs-tabs--content {
  padding: 0 !important;
}

.createPageAvatar {
  height: 90px !important;
  max-height: 90px;
  max-width: 100% !important;
  width: auto !important;
}
</style>
