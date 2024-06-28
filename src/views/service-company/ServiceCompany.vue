<template>
  <div class="data-list-container service_company_page">
    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center">
        <vs-tabs>
          <vs-tab label="Service company information">
            <div class="con-tab-ejemplo">
              <div class="vx-row">
                <div class="vx-col md:w-1/3 w-full">
                  <div class="company_image">
                    <img :src="accountImage" class="mr-8 rounded" />
                  </div>
                  <div class="account_select"></div>
                </div>

                <div class="vx-col md:w-1/2 w-full listing">
                  <h3>Service Company ID {{ companyInfo.id }}</h3>
                  <vs-input
                    class="w-full"
                    label="Company Name"
                    v-validate="'required'"
                    name="company_name"
                    disabled
                    v-model="companyInfo.company_name"
                  />
                  <span
                    class="text-danger text-sm"
                    v-show="errors.has('company_name')"
                    >{{ errors.first("company_name") }}</span
                  >

                  <div class="vx-row mt-4">
                    <div class="vx-col">Contact Person:</div>

                    <div class="vx-col">
                      {{ contact_person }}
                    </div>
                  </div>
                </div>
                <div class="vx-col md:w-1/3 w-full flex">
                  <vs-checkbox :disabled="true" v-model="viber">
                    Viber
                  </vs-checkbox>
                  <vs-checkbox class="ml-2" :disabled="true" v-model="whatsapp">
                    WhatsApp
                  </vs-checkbox>
                  <vs-checkbox class="ml-2" :disabled="true" v-model="telegram">
                    Telegram
                  </vs-checkbox>
                </div>
              </div>

              <div class="vx-row mt-5 border_bottom w-1/2">
                <div class="vx-col">Phone :</div>

                <div class="vx-col">
                  {{ phone_1 }}
                </div>
              </div>

              <div class="vx-row mt-5 border_bottom w-1/2">
                <div class="vx-col">Email :</div>
                <div class="vx-col">
                  {{ email }}
                </div>
              </div>

              <div class="vx-row mt-5 border_bottom w-1/2">
                <div class="vx-col">Address :</div>
                <div class="vx-col">
                  {{ address }}
                </div>
              </div>

              <div class="vx-row mt-5 border_bottom w-1/2">
                <div class="vx-col">Site :</div>
                <div class="vx-col">{{ site }}</div>
              </div>
            </div>
            <div class="vx-row">
              <div class="vx-col w-full agree_check">
                <div class="mt-8 flex flex-wrap items-center"></div>
              </div>
            </div>
          </vs-tab>

          <vs-tab label="Company documents">
            <div class="con-tab-ejemplo">
              <div class="vx-row">
                <div class="vx-col" v-for="(file, index) in files" :key="index">
                  <div
                    class="flex items-start flex-col sm:flex-row company_img_block"
                  >
                    <a :href="file.download_file" target="_blank" download>
                      <img :src="file.image" class="mr-8 rounded h-24 w-24" />
                    </a>
                  </div>
                </div>
              </div>
              <vs-divider />
              <div class="new_images">
                <div
                  class="flex items-start flex-col sm:flex-row"
                  v-if="newFile.length"
                >
                  <div
                    v-for="(file, index) in newFile"
                    :key="index"
                    class="new_images_block"
                  >
                    <img :src="file.image" class="mr-8 rounded h-24 w-24" />
                  </div>
                </div>

                <input
                  type="file"
                  class="hidden"
                  multiple
                  :ref="`update_image`"
                  @change="update_image"
                  accept=".doc,.docx,.xls,.xlsx,.pdf,.zip"
                />
              </div>
            </div>
            <!-- <div class="vx-row">
              <div class="vx-col w-full">
                <div class="mt-8 flex flex-wrap items-center justify-end">
                  <vs-button
                    class="ml-auto mt-2 unimacs_button"
                    @click="createDocument"
                    >Update information</vs-button
                  >
                </div>
              </div>
            </div> -->
          </vs-tab>
        </vs-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import moduleCompany from "@/store/company/moduleCompany.js";
import moduleFile from "@/store/files/moduleFile.js";

export default {
  data() {
    return {
      accountImage: "/no_avatar.svg",
      companyInfo: {},
      image: null,
      phone: null,
      phone2: null,
      files: [],
      newFile: [],
      deletedId: null,
      agreeWith: false,
      companyId: localStorage.user
        ? JSON.parse(localStorage.user).company
        : null,
      viber: false,
      whatsapp: false,
      phone_1: "",
      telegram: false,
      email: "",
      address: "",
      site: "",
      contact_person: "",
    };
  },
  methods: {
    updateInfo() {
      this.$vs.loading({
        type: "corners",
      });
      this.$store
        .dispatch("company/updateCompanyName", {
          company_name: this.companyInfo.company_name,
        })
        .then((res) => {
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Company Name updated",
          });
          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    createDocument() {
      if (this.newFile.length) {
        this.$vs.loading({
          type: "corners",
        });
        this.newFile.forEach((file) => {
          let document = {
            name: file.name,
            date: new Date(),
            company: this.companyInfo.id,
            file: JSON.stringify(file.file),
          };
          this.$store
            .dispatch("company/createDocument", document)
            .then((res) => {
              if (res.data.file) {
                let file = JSON.parse(res.data.file);

                document.image = `/doc.png`;
                document.download_file = `${process.env.VUE_APP_BACK}/${file.path}`;
              }
              document.id = res.data.id;
              this.files.push(document);
              this.$vs.loading.close();
            })
            .catch((err) => {
              this.$vs.loading.close();
            });
        });

        this.$vs.notify({
time: 7000,
          color: "success",
          title: "Company document created",
        });

        this.newFile = [];
      } else {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: "No uploaded documents",
        });
      }
    },
    update_image(event) {
      var input = event.target.files;
      if (input && input.length) {
        this.$vs.loading({
          type: "corners",
        });

        input.forEach((file) => {
          this.$store
            .dispatch("file/companyFileUpload", file)
            .then((res) => {
              let file = {
                name: res.data.name,
                company: this.companyId,
                date: new Date(),
                file: res.data,
                image: `/doc.png`,
                download_file: `${process.env.VUE_APP_BACK}/${res.data.path}`,
              };
              this.newFile.push(file);

              this.$vs.loading.close();
            })
            .catch((error) => {
              this.$vs.loading.close();
            });
        });

        this.$vs.notify({
time: 7000,
          color: "success",
          title: "Document(s) uploaded",
        });
      }
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.name} document`,
        accept: this.removeImage,
        acceptText: "Delete",
      });
    },
    removeNewFiles(event) {
      const fileIndex = this.newFile.findIndex((f) => f.name == event.name);
      this.newFile.splice(fileIndex, 1);
    },
    removeImage() {
      this.$store
        .dispatch("company/deleteDocument", this.deletedId)
        .then((res) => {
          const fileIndex = this.files.findIndex((f) => f.id == this.deletedId);
          this.files.splice(fileIndex, 1);
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
  },
  computed: {
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },
  },
  created() {
    this.$store.dispatch("pagePermissions", this.permissions).then((res) => {
      if (res != true) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: `You haven't access to enter to ${this.$route.name}`,
        });
        setTimeout(() => {
          // this.$router.push(res).catch(() => {});
          this.$router.push('/error-404').catch(() => {});

        }, 100);

        return false;
      }
    });

    this.$vs.loading({
      type: "corners",
    });

    if (!moduleCompany.isRegistered) {
      this.$store.registerModule("company", moduleCompany);
      moduleCompany.isRegistered = true;
    }

    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }
    this.files = [];
    this.$http
      .get(`serviceCompany`, {
        headers: { Authorization: localStorage.token },
      })
      .then((res) => {
        const account = res.data.company_account;
        if (account.viber) {
          this.viber = true;
        } else {
          this.viber = false;
        }
        if (account.whatsapp) {
          this.whatsapp = true;
        } else {
          this.whatsapp = false;
        }
        if (account.telegram) {
          this.telegram = true;
        } else {
          this.telegram = false;
        }

        if (account.phone_1) {
          this.phone_1 = account.phone_1;
        }

        this.email = account.email;
        this.site = account.site;
        this.address = account.address;
        this.contact_person = account.first_name + " " + account.last_name;
        this.companyInfo = res.data;

        if (res.data.company_documents && res.data.company_documents.length) {
          res.data.company_documents.forEach((doc) => {
            if (doc.file) {
              doc.file = JSON.parse(doc.file);
              doc.image = `/doc.png`;
              doc.download_file = `${process.env.VUE_APP_BACK}/${doc.file.path}`;
            }
            this.files.push(doc);
          });
        }
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });
  },
};
</script>

<style lang="scss" scoped>
.company_image {
  width: 140px;
  img {
    width: 100%;
  }
}

.social_flex {
  flex: 0 0 100%;
  display: flex;
  margin: 10px -5px;
}

.border_bottom {
  border-bottom: 1px solid #f2f2f2;
}

.agree_check {
  margin: -5px;
}

.company_img_block {
  display: block !important;
  text-align: center;
  margin-bottom: 20px;
  max-width: 200px;
  border: 2px solid #9288f4;
  border-radius: 5px;
  padding: 10px 5px;
  img {
    margin: 0 !important;
  }
}

.new_images_block {
  text-align: center;
  margin-right: 20px;
  margin-bottom: 20px;
  max-width: 200px;
  border: 2px solid #9288f4;
  border-radius: 5px;
  padding: 10px 15px;
  img {
    margin: 0 !important;
  }
}
</style>
