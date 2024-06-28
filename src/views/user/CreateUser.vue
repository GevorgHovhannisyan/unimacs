<!-- =========================================================================================
  File Name: UserView.vue
  Description: User View page
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="page-user-edit">
    <div
      :class="{ activeLoading: activeLoading }"
      @click="openLoading(corners)"
      class="vs-con-loading__container loading-example"
    ></div>
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Account" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <form>
                <vx-card
                  class="mt-base"
                  title="Create User"
                  no-shadow
                >
                  <div class="vx-row">
                    <div class="vx-col w-full">
                      <div class="flex items-start flex-col sm:flex-row">
                        <img
                          :src="avatarSrc"
                          class="mr-8 rounded h-24 w-24 new_user_avatar"
                        />
                        <div>
                          <p class="text-lg font-medium mb-2 mt-4 sm:mt-0">
                            {{ userData.username }}
                          </p>
                          <input
                            type="file"
                            class="hidden"
                            ref="update_avatar_input"
                            @change="update_avatar"
                            accept="image/*"
                          />

                          <vs-button
                            type="border"
                            class="mr-4"
                            @click="$refs.update_avatar_input.click()"
                            >Change Avatar</vs-button
                          >

                          <!-- <vs-button class="mr-4 mb-4">Change Avatar</vs-button> -->
                          <vs-button
                            type="border"
                            @click="removeAvatar"
                            color="danger"
                            v-if="userData.avatar"
                            >Remove Avatar</vs-button
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="vx-row">
                    <div class="vx-col md:w-1/2 w-full">
                      <div class="mt-4">
                        <vs-input
                          class="w-full mt-4"
                          label="First name"
                          v-model="userData.first_name"
                          v-validate="'required'"
                          name="first_name"
                        />
                        <span
                          class="text-danger text-sm"
                          v-show="errors.has('first_name')"
                          >{{ errors.first("first_name") }}</span
                        >

                        <vs-input
                          class="w-full"
                          label="Username"
                          v-model="userData.username"
                          v-validate="'required'"
                          name="username"
                        />
                        <span
                          class="text-danger text-sm"
                          v-show="errors.has('username')"
                          >{{ errors.first("username") }}</span
                        >

                        <vs-input
                          class="w-full mt-4"
                          label="Email"
                          v-model="userData.email"
                          type="email"
                          v-validate="'required|email'"
                          name="email"
                        />
                        <span
                          class="text-danger text-sm"
                          v-show="errors.has('email')"
                          >{{ errors.first("email") }}</span
                        >
                      </div>
                    </div>

                    <div class="vx-col md:w-1/2 w-full">
                      <div class="mt-4">
                        <vs-input
                          class="w-full mt-4"
                          label="Last Name"
                          v-model="userData.last_name"
                          v-validate="'required'"
                          name="last_name"
                        />
                        <span
                          class="text-danger text-sm"
                          v-show="errors.has('last_name')"
                          >{{ errors.first("last_name") }}</span
                        >

                        <v-select
                          v-model="userData.status"
                          :options="statusOptions"
                          class="select_padding mt-5 mb-5"
                          name="status"
                          placeholder="Status"
                          :reduce="(status) => status.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        />

                        <span
                          class="text-danger text-sm"
                          v-show="errors.has('status')"
                          >{{ errors.first("status") }}</span
                        >
                        <label for="" class="vs-input--label">Department</label>
                        <v-select
                          v-model="userData.department"
                          :options="departmentOptions"
                          class="select_padding"
                          name="department"
                          :reduce="(department) => department.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        />
                        <span
                          class="text-danger text-sm"
                          v-show="errors.has('department')"
                          >{{ errors.first("department") }}</span
                        >

                        <span
                          class="text-danger text-sm"
                          v-show="errors.has('department')"
                          >{{ errors.first("department") }}</span
                        >
                      </div>
                    </div>
                  </div>

                  <div class="vx-row mid_row">
                    <div class="vx-col md:w-1/2 w-full" v-if="disableAccGroup">
                      <div class="">
                        <label for="" class="vs-input--label"
                          >Account group</label
                        >

                        <treeselect
                        class="tree__select"
                          :options="groupObj"
                          @input="onChange"
                          v-model="userData.account_group"
                        />
                      </div>
                    </div>
                    <div class="vx-col md:w-1/2 w-full mt-4">
                      <vs-checkbox
                        :disabled="disableRole"
                        v-model="roleCheck"
                        @change="checkChange"
                      >
                        Inherited group assigned role
                      </vs-checkbox>
                    </div>
                    <div class="vx-col md:w-1/2 w-full">
                      <div class="mt-4">
                        <label for="" class="vs-input--label">Role</label>

                        <v-select
                          v-model="userData.role"
                          :options="roleOptions"
                          class="select_padding"
                          name="role"
                          :disabled="disableSelect"
                          placeholder="Role"
                          :reduce="(role) => role.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        />

                        <span
                          class="text-danger text-sm"
                          v-show="errors.has('role')"
                          >{{ errors.first("role") }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="vx-row">
                    <div class="vx-col md:w-1/2 w-full">
                      <vs-input
                        class="w-full mt-4"
                        label="Password"
                        v-model="password"
                        @input="checkPass($event)"
                        type="password"
                        autocomplete="new-password"
                        name="password"
                        ref="password"
                      />
                      <span
                        class="text-danger text-sm"
                        v-show="errors.has('password')"
                        >{{ errors.first("password") }}</span
                      >
                    </div>
                    <div class="vx-col md:w-1/2 w-full">
                      <vs-input
                        class="w-full mt-4"
                        label="Confirm Password"
                        v-model="confirm_password"
                        type="password"
                        v-validate="'required|confirmed:password'"
                        name="confirm_password"
                        data-vv-as="password"
                      />

                      <span
                        class="text-danger text-sm"
                        v-show="errors.has('confirm_password')"
                        >{{ errors.first("confirm_password") }}</span
                      >
                    </div>
                  </div>
                </vx-card>

                <div class="vx-row">
                  <div class="vx-col w-full">
                    <div class="mt-8 flex flex-wrap items-center justify-end">
                      <vs-button class="ml-auto mt-2" @click="addUser"
                        >Create User</vs-button
                      >
                      <vs-button
                        class="mt-2 ml-2 unimacs_cancel_button"
                        @click="cancel"
                        >Cancel</vs-button
                      >
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import moduleUser from "@/store/user/moduleUserManagement.js";
import vSelect from "vue-select";
import moduleDepartment from "@/store/department/moduleDepartment.js";
import { pagePermissions } from "@/functions/pagePermissions";

import moduleFile from "@/store/files/moduleFile.js";
import { Validator } from "vee-validate";
import Treeselect from "@riophae/vue-treeselect";
import moduleGroup from "@/store/groups/moduleGroup.js";

export default {
  components: {
    vSelect,
    Treeselect,
  },
  data() {
    return {
      disableAccGroup: false,
      disableRole: false,
      disableSelect: false,
      roleCheck: false,
      user_data: null,
      editUser: {},
      routes: [],
      selected: [],

      groupObj: [],
      selectedGroup: null,

      departmentOptions: [],
      userId: localStorage.userId,
      status: false,
      statusOptions: [
        { label: "Active", id: true },
        { label: "Inactive", id: false },
      ],
      roleOptions: [],
      activeLoading: false,
      groups: [],
      activeTab: 0,
      rules: [{ required: true }],
      checkedRole: null,
      password: "",
      confirm_password: "",
      avatarSrc: "/no_avatar.svg",
      userData: {
        first_name: null,
        last_name: null,
        account_group: null,
        username: null,
        email: null,
        password: null,
        department: null,
        role: null,
      },
      file: null,
    };
  },
  computed: {
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions).AccountGroup
          ? JSON.parse(localStorage.permissions).AccountGroup.actions
          : null
        : null;
    },
  },
  watch: {
    userData(value) {},
  },
  methods: {
    onChange() {
      if (this.groups.length) {
        let find = this.groups.find((g) => g.id == this.userData.account_group);
        if (find && find.role) {
          this.disableRole = false;
          this.checkedRole = find.role;
        } else if (!find.role) {
          this.disableRole = true;
          this.disableSelect = false;
          this.roleCheck = false;
          this.checkedRole = null;
        }
      }
    },
    checkChange() {
      if (this.roleCheck) {
        this.disableSelect = true;

        this.userData.role = this.checkedRole;
      } else {
        this.disableSelect = false;
      }
    },
    passValidation(string) {
      this.errors.clear();
      if (
        /\d/.test(string) &&
        /[A-Z]/.test(string) &&
        /[a-z]/.test(string) 
        // &&        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string)
      ) {
        this.errors.clear();
        return true;
      } else if (string.length == 0) {
        this.errors.add({
          field: "password",
          msg: "Password field required",
        });
      } else if (string.length < 7) {
        this.errors.add({
          field: "password",
          msg: "Password field must have min 7 character",
        });
      } else if (!/\d/.test(string)) {
        this.errors.add({
          field: "password",
          msg: "Password field must have number",
        });
      } else if (!/[A-Z]/.test(string)) {
        this.errors.add({
          field: "password",
          msg: "Password field must have upper case letter",
        });
      } else if (!/[a-z]/.test(string)) {
        this.errors.add({
          field: "password",
          msg: "Password field must have lower case letter",
        });
      } 

      return false;
    },
    checkPass(event) {
      this.passValidation(event);
    },

    addUser() {
      if (this.passValidation(this.password)) {
        this.$vs.loading({
          type: "corners",
        });
        this.userData.password = this.password;

        this.$store
          .dispatch("user/createUser", this.userData)
          .then((res) => {
            setTimeout(() => {
              this.$vs.loading.close();
              this.activeLoading = false;
              this.$vs.notify({
time: 7000,
                color: "success",
                title: `User created`,
              });

              this.$validator.reset();
              this.$router.push("/admins");
            }, 500);
          })
          .catch((err) => {
            this.$vs.loading.close();

            if (err.response.status == 400) {
              this.activeLoading = false;
              if (err.response.data.err == "email") {
                this.errors.add({
                  scope: null,
                  field: "email",
                  msg: err.response.data.errorMsg,
                });
              } else if (err.response.data.err == "username") {
                this.errors.add({
                  scope: null,
                  field: "username",
                  msg: err.response.data.errorMsg,
                });
              }
            }
          });
      }
    },

    generateArray(groups) {
      var map = {},
        node,
        roots = [],
        i;

      for (i = 0; i < groups.length; i += 1) {
        map[groups[i].id] = i;
        let filter = groups.filter((g) => g.parent_id == groups[i].id);
        if (filter && filter.length) {
          groups[i].children = [];
        }
      }

      for (i = 0; i < groups.length; i += 1) {
        groups[i].label = groups[i].name;
        node = groups[i];
        if (node.parent_id != null) {
          groups[map[node.parent_id]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      this.groupObj = roots;
    },

    removeAvatar() {
      this.file = null;
      this.avatarSrc = "/no_avatar.svg";
    },

    confirmDeleteRecord() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `You are about to delete "${this.user_data.username}"`,
        accept: this.deleteRecord,
        acceptText: "Delete",
      });
    },
    deleteRecord() {
      this.$router.push({ name: "app-user-list" });
      this.showDeleteSuccess();
    },
    showDeleteSuccess() {
      this.$vs.notify({
time: 7000,
        color: "success",
        title: "User Deleted",
        text: "The selected user was successfully deleted",
      });
    },
    update_avatar(event) {
      this.$vs.loading({
        type: "corners",
      });
      var input = event.target.files[0];

      this.$store
        .dispatch("file/userImageSave", input)
        .then((res) => {
          this.avatarSrc = `${process.env.VUE_APP_BACK}/${res.data.path}`;
          this.userData.avatar = JSON.stringify({
            path: res.data.path,
            name: res.data.name,
          });
          this.$vs.loading.close();
        })
        .catch((error) => {
          this.$vs.loading.close();
        });
    },
    cancel() {
      this.$router.push("/admins");
    },
  },

  created() {
    if (this.permissions) {
      if (pagePermissions(this.permissions) === true) {
        this.disableAccGroup = true;
      } else {
        this.disableAccGroup = false;
      }
    }

    const routes = this.$router.options.routes[0].children.filter(
      (route) => route.custom
    );
    this.routes = routes;

    routes.forEach((r) => {
      this.selected[r.name] = [];
    });

    if (!moduleUser.isRegistered) {
      this.$store.registerModule("user", moduleUser);
      moduleUser.isRegistered = true;
    }

    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    if (!moduleDepartment.isRegistered) {
      this.$store.registerModule("department", moduleDepartment);
      moduleDepartment.isRegistered = true;
    }

    if (!moduleGroup.isRegistered) {
      this.$store.registerModule("group", moduleGroup);
      moduleGroup.isRegistered = true;
    }

    this.$store
      .dispatch("group/fetchAccountGroups")
      .then((res) => {
        this.groups = res.data;
        this.generateArray(res.data);
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });

    this.$store
      .dispatch("department/fetchDepartments")
      .then((res) => {
        this.departmentOptions = [
          {
            id: null,
            label: "No department",
          },
        ];
        if (res.data.length) {
          res.data.forEach((el) => {
            this.departmentOptions.push({
              id: el.id,
              label: el.name,
            });
          });
        } else {
          this.departmentOptions = [
            {
              id: null,
              label: "No departments",
            },
          ];
        }

        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });

    const userId = this.$route.params.userId;

    this.$http
      .get(`roles`, {
        headers: { Authorization: localStorage.token },
      })
      .then((res) => {
        res.data.forEach((role) => {
          this.roleOptions.push({
            label: role.slug,
            id: role.id,
          });
        });
      });
  },
};
</script>

<style lang="scss">
@import url("../../../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");
.new_user_avatar {
  object-fit: cover;
}
#avatar-col {
  width: 10rem;
}

.mid_row {
  align-items: center;
  margin-top: 5px;
}

#page-user-view {
  table {
    td {
      vertical-align: top;
      min-width: 140px;
      padding-bottom: 0.8rem;
      word-break: break-all;
    }

    &:not(.permissions-table) {
      td {
        @media screen and (max-width: 370px) {
          display: block;
        }
      }
    }
  }
}

// #account-info-col-1 {
//   // flex-grow: 1;
//   width: 30rem !important;
//   @media screen and (min-width:1200px) {
//     & {
//       flex-grow: unset !important;
//     }
//   }
// }

@media screen and (min-width: 1201px) and (max-width: 1211px),
  only screen and (min-width: 636px) and (max-width: 991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }
}
</style>
