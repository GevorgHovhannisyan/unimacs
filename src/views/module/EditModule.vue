<template>
  <div class="modulesPage">
    <vs-button type="border" class="mr-4" @click="save">Save</vs-button>

    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6 pb-8">
        <vs-tabs class="tab-action-btn-fill-conatiner">
          <vs-tab label="Content" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <vx-card title class="mt-base" no-shadow >
                <form-generator
                  v-if="cansee"
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
import FormGenerator from "../form-generator/FormGenerator";

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
          .put(`${name}`, obj, {
            headers: { Authorization: localStorage.token },
          })
          .then((response) => {
            this.$vs.loading.close();

            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Module updated ",
            });
            let goTo;

            if (this.$route.params.submenu) {
              goTo = `${this.$route.params.name}/${this.$route.params.submenu}`;
            } else {
              goTo = `${this.$route.params.name}`;
            }
            this.$router.push(`/module/${goTo}`);
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
    this.$vs.loading({
      type: "corners",
    });

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
    } else if (data.submenu) {
      let subData = data.submenu[this.$route.params.submenu];
      this.field = subData.fields;

      Object.keys(subData.fields).forEach((key) => {
        if (subData.fields[key].multiLng) {
          languages.forEach((lng) => {
            let obj = {};

            obj["type"] = subData.fields[key].formType;
            obj[`name`] = `${key}__${lng.iso}`;
            obj["label"] = subData.fields[key].label + " " + lng.iso;

            if (subData.fields[key].selections) {
              obj["selections"] = subData.fields[key].selections;
            }

            if (subData.fields[key].readOnly) {
              obj["readOnly"] = true;
            }

            if (subData.fields[key].hidden) {
              obj["hidden"] = true;
            }

            if (subData.fields[key].required) {
              obj["required"] = true;
            }

            this.arrayOfForm.push(obj);
          });
        } else {
          let obj = {};

          obj["type"] = subData.fields[key].formType;
          obj["name"] = key;
          obj["label"] = subData.fields[key].label;

          if (subData.fields[key].selections) {
            obj["selections"] = subData.fields[key].selections;
          }

          if (subData.fields[key].readOnly) {
            obj["readOnly"] = true;
          }

          if (subData.fields[key].hidden) {
            obj["hidden"] = true;
          }

          if (subData.fields[key].required) {
            obj["required"] = true;
          }
          this.arrayOfForm.push(obj);
        }
      });
    }

    const name = this.$route.params.submenu
      ? this.$route.params.submenu
      : this.$route.params.name;

    this.$http
      .get(`${name}/${this.$route.params.id}`, {
        headers: { Authorization: localStorage.token },
      })
      .then((res) => {
        Object.keys(res.data).forEach((key) => {
          let data = res.data[key];
          this.formData[key] = data;

          if (this.field[key] && this.field[key].multiLng) {
            Object.keys(data).forEach((keys) => {
              this.formData[`${key}__${keys}`] = data[keys];
            });
          }
        });
        this.cansee = true;
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });
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
