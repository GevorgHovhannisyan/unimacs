<!-- =========================================================================================
  File Name: UserView.vue
  Description: User View page
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="page-user-edit ed_accountt">
    <div :class="{ activeLoading: activeLoading }" @click="openLoading(corners)"
      class="vs-con-loading__container loading-example"></div>
    <vx-card>
      <div slot="no-body" class="tabs-container px-6 pt-6">
        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Account" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <vx-card no-shadow>
                <div class="vx-row">
                  <div class="vx-col w-full md:w-1/3 fd-2 hd-3">
                    <img :src="avatarSrc" class="mr-8 rounded user_avatar" />
                    <div class="edit_user_actions custom">
                      <p class="text-lg font-medium mb-4 mt-4 sm:mt-0">
                        {{ userData.username }}
                      </p>



                      <input type="file" class="hidden" ref="update_avatar_input" @change="update_avatar"
                        accept="image/*" />

                      <div class="user_tools">
                        <feather-icon icon="EditIcon" style="font-size: 25px" @click="$refs.update_avatar_input.click()"
                          class="cursor-pointer" />

                        <feather-icon icon="XSquareIcon" style="font-size: 25px" @click="removeAvatar"
                          class="cursor-pointer ml-1" />
                      </div>
                    </div>
                  </div>
                  <form autocomplete="off" class="vx-col w-full md:w-2/3 fd-10 hd-9">
                    <div class="vx-row">
                      <div class="vx-col lg:w-1/2 fd-4 w-full">
                        <vs-input class="w-full mt-4" label="First name" v-model="userData.first_name"
                          v-validate="'required'" name="first_name" />
                        <span class="text-danger text-sm" v-show="errors.has('first_name')">{{
                            errors.first("first_name")
                        }}</span>
                      </div>
                      <div class="vx-col lg:w-1/2 fd-4 w-full">
                        <vs-input class="w-full mt-4" label="Last Name" v-model="userData.last_name"
                          v-validate="'required'" name="last_name" />
                        <span class="text-danger text-sm" v-show="errors.has('last_name')">{{ errors.first("last_name")
                        }}</span>
                      </div>
                      <div class="vx-col lg:w-1/2 fd-4 w-full">
                        <vs-input class="w-full mt-4" label="Email" v-model="userData.email" type="email"
                          v-validate="'required|email'" name="email" />
                        <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first("email")
                        }}</span>
                      </div>
                      <div class="vx-col lg:w-1/2 fd-4 w-full mt-3" v-if="disableAccGroup">
                        <div class="">
                          <label for="" class="vs-input--label">Account group</label>
                          <treeselect class="tree__select" :options="groupObj" v-model="userData.account_group"
                            @input="onChange" />
                        </div>
                      </div>
                      <div class="vx-col lg:w-1/2 fd-4 w-full mt-3 flex align-center">
                        <vs-checkbox :disabled="disableRole" v-model="roleCheck" @change="checkChange">
                          Inherited group assigned role
                        </vs-checkbox>
                      </div>
                      <div class="vx-col lg:w-1/2 fd-4 w-full mt-3">
                        <label for="" class="vs-input--label">Role</label>
                        <v-select :disabled="disableSelect" v-model="userData.role" :options="roleOptions"
                          class="select_padding" name="role" placeholder="Role" :reduce="(role) => role.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                        <span class="text-danger text-sm" v-show="errors.has('role')">{{ errors.first("role") }}</span>
                      </div>
                      <div class="vx-col lg:w-1/2 fd-4 w-full mt-3">
                        <label for="" class="vs-input--label">Status</label>

                        <v-select v-model="userData.status" :options="statusOptions" class="select_padding"
                          name="status" placeholder="Status" :reduce="(status) => status.id"
                          :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                        <span class="text-danger text-sm" v-show="errors.has('status')">{{ errors.first("status")
                        }}</span>
                      </div>
                      <div class="vx-col lg:w-1/2 fd-4 w-full mt-3" v-if="userInfo && !userInfo.company">
                        <label for="" class="vs-input--label">Department</label>

                        <v-select v-model="userData.department" :options="departmentOptions" class="select_padding"
                          name="department" autocomplete="new-password" placeholder="Department"
                          :reduce="(department) => department.id" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                        <span class="text-danger text-sm" v-show="errors.has('department')">{{
                            errors.first("department")
                        }}</span>
                      </div>
                    </div>
                  </form>
                </div>

                <div class="vx-row">
                  <div class="vx-col w-full">
                    <div class="mt-8 flex flex-wrap items-center justify-end">
                      <!-- <vs-button
                        class="mt-2 ml-auto unimacs_cancel_button"
                        @click="cancel"
                        >Cancel</vs-button
                      > -->
                      <vs-button class="mt-2 ml-3 unimacs_button" @click="savePermissions">Submit</vs-button>
                    </div>
                  </div>
                </div>
              </vx-card>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </vx-card>
  </div>
</template>

<script>
import moduleUser from "@/store/user/moduleUserManagement.js";
import { pagePermissions } from "@/functions/pagePermissions";
import moduleDepartment from "@/store/department/moduleDepartment.js";
import moduleGroup from "@/store/groups/moduleGroup.js";

import vSelect from "vue-select";
import moduleFile from "@/store/files/moduleFile.js";
import Treeselect from "@riophae/vue-treeselect";

export default {
  components: {
    vSelect,
    Treeselect,
  },
  data() {
    return {
      disableAccGroup: true,
      selectedGroup: null,
      groupObj: [],
      disableRole: false,
      disableSelect: false,
      roleCheck: true,
      user_data: null,
      departmentOptions: [
        {
          label: "No Department",
          id: null,
        },
      ],
      checkedRole: null,
      editUser: {},
      routes: [],
      selected: [],
      userId: localStorage.userId,
      status: false,
      statusOptions: [
        { label: "Active", id: "active" },
        { label: "Inactive", id: "inactive" },
      ],
      roleOptions: [],
      activeLoading: false,
      userData: {},
      activeTab: 0,
      password: "",
      confirm_password: "",
      avatarSrc: "/no_avatar.svg",
      file: null,
    };
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
          this.checkedRole = null;

          this.roleCheck = false;
        }
      }
    },
    checkChange() {
      if (this.roleCheck) {
        this.disableSelect = true;
      } else {
        this.disableSelect = false;
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
    cancel() {
      this.$router.push("/admins");
    },
    savePermissions(e) {
      e.preventDefault();

      this.$vs.loading({
        type: "corners",
      });

      if (typeof this.userData.role == "string") {
        let fRole = this.roleOptions.find(
          (role) => role.label == this.userData.role
        );
        this.userData.role = fRole.value;
      }

      this.$store
        .dispatch("user/updateUserRole", this.userData)
        .then((res) => {
          this.$vs.loading.close();

          if (this.userData.id == JSON.parse(localStorage.user).id) {
            this.$root.$emit("changeAvatar", res.data.avatar);
            this.$root.$emit("changeName", res.data);
          }

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Admin was updated",
          });

          this.$router.push("/admins");
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
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
      /* Below two lines are just for demo purpose */
      this.$router.push({ name: "app-user-list" });
      this.showDeleteSuccess();
    },
    removeAvatar() {
      this.avatarSrc = "/no_avatar.svg";
      this.userData.avatar = null;
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
        .dispatch("file/uploadFile", input)
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
    passValidation(string) {
      this.errors.clear();
      if (
        /\d/.test(string) &&
        /[A-Z]/.test(string) &&
        /[a-z]/.test(string)
        //  &&        /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string)
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
    changePass() {
      if (
        this.passValidation(this.password) &&
        this.password == this.confirm_password
      ) {
        const data = {
          id: +this.$route.params.userId,
          password: this.password,
        };

        this.$vs.loading({
          type: "corners",
        });

        this.$store
          .dispatch("user/changeUserPass", data)
          .then((res) => {
            setTimeout(() => {
              this.$vs.loading.close();
              this.activeLoading = false;
              this.$vs.notify({
                time: 7000,
                color: "success",
                title: `Password changed`,
              });
              this.password = "";
              this.confirm_password = "";
              this.$validator.reset();
              setTimeout(() => {
                this.activeTab = 0;
              }, 500);
            }, 1000);
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      } else if (this.password != this.confirm_password) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Password entries do not match",
        });
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "Password entry does not meet criteria",
        });
      }
    },
  },
  computed: {
    groups() {
      return this.$store.state.group.groups;
    },
    userInfo() {
      return localStorage.user ? JSON.parse(localStorage.user) : null;
    },
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions).AccountGroup
          ? JSON.parse(localStorage.permissions).AccountGroup.actions
          : null
        : null;
    },
    normalizer() {
      return (node) => {
        return {
          id: node.key,
          label: node.name,
          children: node.subOptions,
        };
      };
    },
  },

  created() {
    if (pagePermissions(this.permissions) === true) {
      this.disableAccGroup = true;
    } else {
      this.disableAccGroup = false;
    }

    this.$vs.loading({
      type: "corners",
    });

    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    if (!moduleUser.isRegistered) {
      this.$store.registerModule("user", moduleUser);
      moduleUser.isRegistered = true;
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
        this.generateArray(res.data);
        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });

    this.$store
      .dispatch("department/fetchDepartments")
      .then((res) => {
        res.data.forEach((el) => {
          this.departmentOptions.push({
            id: el.id,
            label: el.name,
          });
        });

        this.$vs.loading.close();
      })
      .catch((err) => {
        this.$vs.loading.close();
      });

    const userId = this.$route.params.userId;

    this.$store.dispatch("user/fetchUser", +userId).then((res) => {
      const admin = res.data.admin;

      if (admin.avatar) {
        let path = JSON.parse(admin.avatar);
        this.avatarSrc = `${process.env.VUE_APP_BACK}/${path.path}`;
      }

      this.$http
        .get(`roles`, {
          headers: { Authorization: localStorage.token },
        })
        .then((res) => {
          this.userData = {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            status: admin.status,
            first_name: admin.first_name,
            last_name: admin.last_name,
            avatar: admin.avatar ? admin.avatar : null,
            department: admin.departments ? admin.departments.id : null,
            role: admin.role,
            account_group: admin.account_group,
          };

          res.data.forEach((role) => {
            this.roleOptions.push({
              label: role.slug,
              id: role.id,
            });
          });
        });
    });
  },
};
</script>

<style lang="scss">
@import url("../../../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");

#avatar-col {
  width: 10rem;
}

.mid_row {
  align-items: center;
}

.page-user-edit {
  .user_avatar {
    // width: 120px !important;
    // min-width: 160px !important;
    // min-height: 160px !important;
  }

  .edit_user_actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

      .user_tools {
        width: 100%;
        display: flex;
        // margin-left: 100px;
        justify-content: end;
      }
  }
}

.ed_accountt {
  .edit_user_actions {
    align-self: flex-end;
  }

  .vx-card__body {
    padding: unset !important;
  }

  .vs-tabs--content {
    padding: 10px;
    margin-top: 2.2rem !important;
    padding-top: 0;
  }
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

@media screen and (min-width: 1201px) and (max-width: 1211px),
only screen and (min-width: 636px) and (max-width: 991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }
}
</style>
