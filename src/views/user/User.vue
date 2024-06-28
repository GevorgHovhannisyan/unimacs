<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container user_page">
    <vs-popup v-if="permissions.getAllItems" class="holamundo cr_user_popup" title="New user"
      :active.sync="create_user_popup">
      <InviteUser @close="create_user_popup = false" :clearFields="clearFields" />
    </vs-popup>

    <div class="vx-card p-6">
      <div class="flex flex-wrap items-center">
        <!-- ITEMS PER PAGE -->
        <div class="flex-grow"></div>
      </div>

      <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner local_aacounts">
        <vs-tab label="Local accounts" icon-pack="feather" icon="icon-user">
          <div class="local_button">

            <vs-button class="unimacs_button unimacs_add_new_btn custom create_new" v-if="permissions.addItem"
              @click="checkAdminResource">
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" />Add New
            </vs-button>

            <!-- <div class="
                custom
                create_new
                btn-add-new
                p-3
                mb-4
                rounded-lg
                cursor-pointer
                flex
                items-center
                justify-center
                text-lg
                font-medium
                text-base text-primary
                border border-solid border-primary
                hover_class
              " v-if="permissions.addItem" @click="checkAdminResource">
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary addNeww">Add New</span>
            </div> -->
          </div>
          <div class="vx-row local_acc_table">
            <div class="vx-col w-full">
              <MultiTable :items="users" :headers="user_headers" :actions="true" :permissions="permissions"
                :confirmDeleteMany="confirmDeleteManyRecord" @input="checkItem($event)" @setAll="setAllChecked($event)"
                @updateItem="edit($event)" @deleteRecord="confirmDeleteRecord($event)" />
            </div>
          </div>
        </vs-tab>
        <vs-tab label="Accounts Group" icon-pack="material-icons" icon="group" v-if="disableAccGroup">
          <div class="local_accounts flex">
            <users-group> </users-group>
          </div>
        </vs-tab>

        <vs-tab label="Roles" icon-pack="material-icons" icon="lock">
          <roles />
        </vs-tab>
      </vs-tabs>
    </div>
  </div>
</template>

<script>
import moduleUser from "@/store/user/moduleUserManagement.js";
import roles from "../roles/Roles";
import usersGroup from "./UsersGroup";
import MultiTable from "../../components/custom/table/MultipleTable";
import PermissionComp from "../roles/Permissions";
import { pagePermissions } from "@/functions/pagePermissions";
import moduleGroup from "@/store/groups/moduleGroup.js";
import vSelect from "vue-select";
import Treeselect from "@riophae/vue-treeselect";
import moduleFile from "@/store/files/moduleFile.js";
import InviteUser from "./components/InviteUser";
import moduleAccessPointGroup from "@/store/group-zones/moduleAccessPoint.js";

export default {
  components: {
    roles,
    usersGroup,
    MultiTable,
    PermissionComp,
    vSelect,
    Treeselect,
    InviteUser,
  },
  data() {
    return {
      disableAccGroup: true,
      // selectedUsers: [],
      activeTab: 0,
      deletedId: null,
      user_headers: [
        { name: "#", key: "count" },
        { name: "Username", key: "username" },
        { name: "Name", key: "name" },
        { name: "Email", key: "email" },
        { name: "Department", key: "department" },
        { name: "Status", key: "status" },
      ],
      create_user_popup: false,
      currentForm: "add_user",
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
      group_name: null,
      disableSelect: false,
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
        htmlAttributes: "hasAttribute",
      },
      roleOptions: [],
      groupObj: [],
      disableRole: false,
      roleCheck: false,
      saveGroups: [],
      clearFields: true,
    };
  },

  computed: {
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    },
    users() {
      return this.$store.state.user.admins;
    },
    users_tab() {
      return this.$store.state.user.users_tab;
    },
    formTypes() {
      return this.$store.state.formTypes;
    },
    hasCompany() {
      return localStorage.user ? JSON.parse(localStorage.user).company : null;
    },

    selectedUsers() {
      let admins = this.$store.state.user.admins;
      return admins.length ? admins.filter((c) => c.selected) : [];
    },
  },
  methods: {
    checkAdminResource() {
      this.$store
        .dispatch("checkResource", { resource: "Admin" })
        .then((res) => {
          if (res.data.success) {
            this.create_user_popup = true;
          } else {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Admin resource limit has been reached",
            });
          }
        });
    },
    checkItem({ event, item }) {
      this.$store.commit("user/CHECK_ITEM", { event, item });
    },
    setAllChecked(value) {
      this.$store.commit("user/SET_ALL_CHECKED", { event: value });
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.first_name} cardholder`,
        accept: this.deleteUser,
        acceptText: "Delete",
      });
    },

    changeForm(type) {
      this.currentForm = type.key;
    },
    edit(e) {
      this.$router.push(`/edit-user/${e.id}`);
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
    createUser() {
      const find_group = this.saveGroups.find(
        (g) => g.id == this.userData.account_group
      );
      this.userData.role = find_group.role;

      this.$vs.loading({
        type: "corners",
      });

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
    },
    removeAvatar() {
      this.file = null;
      this.userData.avatar = null;
      this.avatarSrc = "/no_avatar.svg";
    },
    confirmDeleteManyRecord() {
      if (!this.selectedUsers.length) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "No selected users",
        });
      } else {
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirm Delete`,
          text: `Do You want to delete users`,
          accept: this.deleteManyUsers,
          acceptText: "Delete",
        });
      }
    },

    deleteManyUsers() {
      this.selectedUsers.forEach((user) => {
        this.$store
          .dispatch("user/removeItem", user.id)
          .then((res) => {
            this.$vs.loading.close();
            this.activeLoading = false;
          })
          .catch((err) => {
            this.$vs.loading.close();

            this.activeLoading = false;
          });
      });
      this.$store.commit("user/SET_ALL_CHECKED", { event: false });
    },
    confirmDeleteRecord(data) {
      this.deletedId = data.id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.username ? data.username : "user"
          } `,
        accept: this.deleteUsers,
        acceptText: "Delete",
      });
    },
    deleteUsers() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("user/removeItem", this.deletedId)
        .then((res) => {
          this.$vs.loading.close();
          this.activeLoading = false;

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "User deleted",
          });
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },

    confirmDeleteMany() {
      this.deletedArray = [];
      let namesArr = [];

      if (this.selectedTranses.length) {
        this.selectedTranses.forEach((slider) => {
          this.deletedArray.push(slider.id);
          namesArr.push(slider.term);
        });
      } else if (!this.selectedTranses.length) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "No seleced translations",
        });

        return false;
      }

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${namesArr} translations`,
        accept: this.deleteUsersMany,
        acceptText: "Delete",
      });
    },
    deleteUsersMany() {
      this.$vs.loading({
        type: "corners",
      });

      this.deletedArray.forEach((trans) => {
        this.$store
          .dispatch("trans/deleteTrans", trans)
          .then((res) => {
            this.$vs.loading.close();
            this.activeLoading = false;

            const index = this.translations.findIndex((u) => u.id == trans);
            this.translations.splice(index, 1);
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Translation deleted",
            });
            // this.deleteTrans(this.deletedArray);
          })
          .catch((err) => {
            this.$vs.loading.close();

            this.activeLoading = false;
          });
      });

      this.deletedArray = [];
    },
    checkNumber(number, obj) {
      if (!obj.valid) {
        this.errors.add({
          field: "phone",
          msg: "Phone number not valid",
        });
      } else {
        const filter = this.errors.items.filter((e) => e.field == "phone");
        filter.forEach((f) =>
          this.errors.items.splice(
            this.errors.items.findIndex((e) => e.field === f.field),
            1
          )
        );
      }
    },
    checkRoleChange() {
      if (this.roleCheck) {
        this.disableSelect = true;
      } else {
        this.userData.role = null;
        this.disableSelect = false;
      }
    },
  },
  watch: {
    activeTab(activeTab) {
      this.$store.commit("user/changeUsersTab", activeTab);
    },
    create_user_popup(val) {
      if (!val) {
        this.clearFields = val;
      }
    },
  },
  created() {
    if (!moduleUser.isRegistered) {
      this.$store.registerModule("user", moduleUser);
      moduleUser.isRegistered = true;
    }

    if (!moduleGroup.isRegistered) {
      this.$store.registerModule("group", moduleGroup);
      moduleGroup.isRegistered = true;
    }

    if (!moduleFile.isRegistered) {
      this.$store.registerModule("file", moduleFile);
      moduleFile.isRegistered = true;
    }

    if (!moduleAccessPointGroup.isRegistered) {
      this.$store.registerModule("accessPointGroup", moduleAccessPointGroup);
      moduleAccessPointGroup.isRegistered = true;
    }

    this.activeTab = 0;

    const perms = localStorage.permissions
      ? JSON.parse(localStorage.permissions).AccountGroup
        ? JSON.parse(localStorage.permissions).AccountGroup.actions
        : null
      : null;

    if (pagePermissions(perms) === true) {
      this.disableAccGroup = true;
    } else {
      this.disableAccGroup = false;
    }

    if (!this.permissions.getAllItems) {
      return this.$router.push("/account").catch(() => { });
    } else {
      this.$store.dispatch("pagePermissions", this.permissions).then((res) => {
        if (res != true) {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: `You haven't access to enter to ${this.$route.name}`,
          });
          setTimeout(() => {
            // this.$router.push(res).catch(() => {});
            this.$router.push("/error-404").catch(() => { });
          }, 100);

          return false;
        } else {
          this.$vs.loading({
            type: "corners",
          });

          this.$store
            .dispatch("user/fetchUsers")
            .then((res) => {
              this.$vs.loading.close();
            })
            .catch((err) => {
              this.$vs.loading.close();

              this.activeLoading = false;
            });
          this.activeTab = this.users_tab;

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
        }
      });
    }
  },
};
</script>

<style lang="scss">
@import url("../../../node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");

.cr_user_popup .vs-popup {
  width: 400px;
  min-height: 300px;
}

.create_popup {
  input {
    width: 100%;
  }

  .vs-popup--content {
    padding: 30px 60px !important;
  }

  .vs-component {
    width: 100%;
  }

  .actions_block_popup {
    display: flex;
    text-align: right;
    flex-direction: row-reverse;
  }

  button {
    margin-bottom: 15px;
    flex: 0 0 30%;
    max-width: 30%;
  }
}

.user_page {
  .con-input-search.vs-table--search {
    margin-right: 150px;
  }

  .local_button {
    display: flex;

    .create_new {
      margin-left: auto;
      position: relative;
      top: 50px;
    }
  }

  .btn-add-new {
    position: absolute;
    top: 28px;
  }

  .header-table {
    // padding-left: 25px;
  }

  .local_accounts {
    flex-wrap: wrap;

    .actions_block {
      flex: 0 0 100%;
      text-align: right;
      margin-top: 20px;

      button {
        margin-left: 10px;
      }
    }
  }

  .local_accounts {
    .custom {
      margin-left: auto !important;
      margin-right: 0 !important;
      margin-bottom: 10px !important;
    }
  }

  .local_accounts>div {
    width: 100%;
    display: flex;
  }

  .hover_class {
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.5;
    }
  }

  // .vs-con-tbody {
  //   background: none;
  //   border: none;
  // }
  // .tr-table-state-null {
  //   box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
  // }
  // .vs-table--tbody-table {
  //   border-collapse: separate;
  //   padding: 0 1rem;
  //   border-spacing: 0 1.3rem;
  // }
  // .tr-values td {
  //   padding: 20px !important;
  // }
}

.data-list-container .custom {
  margin-bottom: 0px !important;
  margin-left: 15px;
  height: 36px;
}
</style>
