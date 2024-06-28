<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    id="data-list-list-view"
    class="data-list-container data-list-list-view list_view"
  >
    <!-- <div class="vx-row" style="width: 100%"> -->
    <div class="card_block" v-for="(role, index) in roles" :key="index">
      <div class="card_inner">
        <vx-tooltip
          :text="role.slug"
          position="top"
          v-if="role.slug.length > 15"
        >
          <div class="nameAdminBlock">
            <span class="longName">{{ role.slug }}</span>

            <div class="actionBlock">
              <button
                class="actionsIconE"
                @click="editRecord(role.id)"
                v-if="permissions.updateItem"
              >
                <img src="/edit-tools.svg" alt />
              </button>
              <button
                class="actionsIconD"
                @click="confirmDeleteRecord(role)"
                v-if="permissions.destroyItem"
              >
                <img src="/delete.svg" alt />
              </button>
            </div>
          </div>
        </vx-tooltip>

        <div class="nameAdminBlock" v-else>
          <span class="longName">{{ role.slug }}</span>

          <div class="actionBlock">
            <button
              class="actionsIconE"
              @click="editRecord(role.id)"
              v-if="permissions.updateItem"
            >
              <img src="/edit-tools.svg" alt />
            </button>
            <button
              class="actionsIconD"
              @click="confirmDeleteRecord(role)"
              v-if="permissions.destroyItem"
            >
              <img src="/delete.svg" alt />
            </button>
          </div>
        </div>

        <div class="flex justify-between">
          <div class="flex items-center lastRow">
            <div class="usersDiv">
              <span>Users</span>

              <ul class="users-liked user-list ml-3 sm:ml-6">
                <li v-for="(user, index) in role.admins" :key="index">
                  <vx-tooltip
                    :text="user.last_name?user.first_name + ' ' + user.last_name:user.first_name"
                    position="bottom"
                    v-if="index <= 1"
                  >
                    <vs-avatar
                      :src="user.avatar"
                      size="30px"
                      class="border-2 border-white border-solid -m-1"
                    ></vs-avatar>
                  </vx-tooltip>
                  <div v-else>
                    <p class="plusUsers" v-if="index == role.admins.length - 1">
                      + {{ role.admins.length - 2 }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="switchBlock">
              <span style="padding-bottom: 5px">Status</span>

              <vs-switch
                color="success"
                @input="changeStatus(role)"
                v-model="role.status"
              >
                <span slot="on">Active</span>
                <span slot="off">Inactive</span>
              </vs-switch>
            </div>

            <!-- <small class="ml-2">+{{ post.likes - 5 }} more</small> -->
          </div>
        </div>
      </div>
    </div>

    <div @click="addRole" class="card_block" v-if="permissions.addItem">
      <div class="add_button">
        <span class="plusIcon"></span>
        <h2>ADD NEW ROLE</h2>

        <div>
          <feather-icon
            icon="plus"
            svgClasses="h-5 w-5 hover:text-danger cursor-pointer"
          />
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import moduleUser from "@/store/user/moduleUserManagement.js";
// import { filter } from "vue/types/umd";

export default {
  components: {},
  data() {
    return {
      roles: [],
      switch2: false,
      // permissions: this.$store.state.permissions,
      sidebarData: {},
      roleDelete: null,
      eButton: false,
      dButton: false,
    };
  },
  computed: {
    permissions() {
      return localStorage.permissions &&
        JSON.parse(localStorage.permissions).Role
        ? JSON.parse(localStorage.permissions).Role.actions
        : null;
    },
  },

  methods: {
    changeStatus(role) {
      this.$vs.loading({
        type: "corners",
      });

      this.$http
        .put(
          `roles`,
          {
            id: role.id,
            status: role.status,
          },
          { headers: { Authorization: localStorage.token } }
        )
        .then((res) => {
          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
    addRole() {
      this.$router.push("/permissions");
    },
    editRecord(e) {
      this.$router.push(`/permissions/${e}`);
    },
    confirmDeleteRecord(e) {
      this.roleDelete = e;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${e.slug}`,
        accept: this.deleteRecord,
        acceptText: "Delete",
      });
    },
    deleteRecord() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("user/removeRole", this.roleDelete.id)
        .then((res) => {
          const userIndex = this.roles.findIndex(
            (u) => u.id == this.roleDelete.id
          );
          this.roles.splice(userIndex, 1);

          this.$vs.loading.close();
          this.activeLoading = false;
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Role Deleted",
            text: "The role was successfully deleted",
          });
        })
        .catch((err) => {
          this.$vs.loading.close();
        });
    },
  },
  created() {
    this.$store.dispatch("pagePermissions", this.permissions).then((res) => {
      if (res !== true) {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: `You haven't access to enter to ${this.$route.name}`,
        });
        setTimeout(() => {
          // this.$router.push('/error-404').catch(() => {});
          this.$router.push('/error-404').catch(() => {});

        }, 100);
        return false;
      }
    });

    this.$vs.loading({
      type: "corners",
    });

    if (!moduleUser.isRegistered) {
      this.$store.registerModule("user", moduleUser);
      moduleUser.isRegistered = true;
    }

    setTimeout(() => {
      this.$vs.loading.close();
    }, 200)

    this.$store.dispatch("user/fetchRole").then((res) => {
      this.$vs.loading.close();
      this.activeLoading = false;

      if (res.data.length) {
        res.data
          .forEach((role) => {
            role.admins.forEach((adm) => {
              if (!adm.avatar) {
                adm.avatar = "/no_avatar.svg";
              } else {
                adm.avatar = `${process.env.VUE_APP_BACK}/${adm.avatar.path}`;
              }
            });

            this.roles.push(role);
          })
          .catch((err) => {

            this.$vs.loading.close();
          });
      }
    });
  },
};
</script>

<style lang="scss">
#data-list-list-view .ag-header-container .ag-header-row:last-child {
  display: none;
}

.addNew {
  border: 1px solid #1bc215;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  height: 135px;
}

.plusIcon {
  height: 50px;
  /* width: 24px; */
  display: flex;
  color: black;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 60px;
  padding-bottom: 5px;
}

.plusIcon::before {
  content: "+";
  font-weight: bold;
}

.data-list-list-view {
  display: flex;
}

.cards {
  height: 160px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.14);
  margin-left: 60px;
  margin-bottom: 25px;
}

.cards .vx-card__body {
  display: flex;
  flex-direction: column;
}

.nameAdminBlock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.longName {
  font-size: 110%;
  font-weight: 700;
  padding-right: 8px;
  // width: auto;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 11px;
}

.actionBlock {
  display: flex;
  flex-direction: row-reverse;
}

.actionsIconE {
  cursor: pointer;
  background: #b5f4d2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  margin-left: 15px;
  border: none;
  width: 28px;
  height: 28px;
}

.actionsIconD {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  width: 28px;
  height: 28px;
  background: #ff9890;
  border-radius: 50%;
}

.lastRow {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
}

.usersDiv {
  display: flex;
  flex-direction: column;
}

.usersDiv span {
  padding-bottom: 5px;
  text-align: left;
}

.usersDiv .users-liked.user-list {
  margin: 0 !important;
}

.switchBlock {
  display: flex;
  flex-direction: column;
}

.switchBlock span {
  // padding-bottom: 5px;
  text-align: right;
}

.plusUsers {
  margin-left: 10px;
  font-weight: 600;
}

.actionsIconE img,
.actionsIconD img {
  width: 16px;
  display: block;
}

.list_view {
  display: flex;
  width: 100%;
  padding: 0 15px;
  padding-left: 0;
  flex-wrap: wrap;
  .card_block {
    flex: 0 0 20%;
    max-width: 20%;
    padding: 0 30px;
    padding: 0 15px 0 15px;
    margin-top: 30px;
  }
  .card_inner {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: white;
  }
  .add_button {
    height: 100%;
    border-radius: 8px;
    border: 1px solid #d1d1d1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    cursor: pointer;
    padding: 0;
    h2 {
      font-size: 18px;
      text-align: center;
    }
  }
}
[dir] .usersDiv .users-liked.user-list {
  padding-right: 7px;
}
.list_view .card_block {
  flex: 0 0 25%;
  max-width: 25%;
}
</style>
