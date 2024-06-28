<template>
  <div class="account_group_page">
    <vs-popup
      class="create_popup"
      title="Create Group"
      :active.sync="popupActive"
    >
      <vs-input
        label="Name"
        placeholder="Name"
        name="name"
        v-model="groupInfo.name"
        v-validate="'required'"
      />
      <vs-input
        class="mt-3 mb-3"
        label="Description"
        placeholder="Description"
        name="description"
        v-model="groupInfo.description"
        v-validate="'required'"
      />
      <div>
        <label for="" class="vs-input--label">Parent ID</label>
        <v-select
          v-model="groupInfo.parent_id"
          :options="pidOptions"
          class="mb-5 w-full select_padding"
          name="parent_id"
          placeholder="Parent ID"
          :reduce="(parent_id) => parent_id.id"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>

      <div class="actions_block_popup">
        <vs-button
          class="unimacs_button"
          :disabled="disableGroupSubmit"
          @click.prevent="createGroup"
          >Submit</vs-button
        >
      </div>
    </vs-popup>

    <div class="tree_block_1 mt-4">
      <div class="vs-row search_create">
        <div class="vx-col w-1/2 new_margin search_blocks">
          <div
            class="con-input-search vs-table--search cardGroup_search_parentss"
          >
            <input
              type="text"
              class="input-search vs-table--search-input cardGroup_searchss"
              v-model="searchText"
              @input="treeSearch($event)"
            /><i class="vs-icon notranslate icon-scale material-icons null"
              >search</i
            >
          </div>
        </div>
        <div class="vx-col new_margin">
          <vs-button
            class="create_new unimacs_button"
            @click.prevent="checkGrouopResource"
            >Create</vs-button
          >
        </div>
        <div class="vx-col new_margin">
          <vs-button
            class="create_new unimacs_cancel_button"
            @click.prevent="confirmDeleteGroups"
            >Delete</vs-button
          >
        </div>
      </div>
      <div>
        <ejs-treeview
          id="treeviews"
          :nodeSelected="nodeSelected"
          v-if="field.dataSource.length"
          :fields="field"
        ></ejs-treeview>

        <div class="no_group_block" v-if="show_error">
          <span class="no_group_text">No Cardholders Group</span>
        </div>
      </div>
    </div>
    <div class="table_blockss mt-2" v-if="componentShow">
      <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
        <vs-tab label="Settings" icon-pack="feather" icon="icon-user">
          <div class="vx-row mt-3" style="margin-bottom: 25px">
            <div class="vx-col md:w-1/2">
              <vs-input
                label="Name"
                class="w-full"
                placeholder="Name"
                name="name"
                v-validate="'required'"
                v-model="groupById.name"
              />
            </div>
            <div class="vx-col md:w-1/2">
              <vs-input
                label="Description"
                class="w-full"
                placeholder="Description"
                name="description"
                v-model="groupById.description"
              />
            </div>
          </div>
          <div class="vx-row table_class">
            <div class="vx-col md:w-2/3">
              <v-select
                v-model="groupById.role"
                :options="roleOptions"
                class="mb-5 w-full select_padding"
                name="role"
                placeholder="Role"
                :reduce="(role) => role.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
            </div>
            <div class="vx-col md:w-1/3">
              <vs-button
                color="primary"
                class="create_new position_button w-full unimacs_button"
                @click.prevent="updateGroup"
                >Submit
              </vs-button>
            </div>
          </div>

          <Table :items="filtered" :headers="group_headers" />
        </vs-tab>
        <vs-tab label="Privilege" icon-pack="feather" icon="icon-user">
        </vs-tab>
      </vs-tabs>
    </div>
  </div>
</template>

<script>
import moduleGroup from "@/store/groups/moduleGroup.js";
import vSelect from "vue-select";
import Table from "../../components/custom/table/Table";

export default {
  data() {
    return {
      canDelete: true,
      popupActive: false,
      activeTab: 0,
      groupById: {},
      roleOptions: [],
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
      },

      pidOptions: [],
      groupInfo: {
        description: "",
        name: "",
        parent_id: null,
      },
      filtered: [],
      itemsPerPage: 15,
      componentShow: false,
      group_headers: [
        { name: "#", key: "count" },
        { name: "Child groups", key: "name" },
        { name: "Users", key: "usercnt" },
      ],
      searchText: null,
      show_error: false,
      searchArr: [],
      disableGroupSubmit: false,
    };
  },
  watch: {
    popupActive(val) {
      if (!val) {
        this.groupInfo.name = null;
        this.groupInfo.description = null;
        this.groupInfo.parent_id = null;
      }
    },
  },
  components: {
    vSelect,
    Table,
  },
  computed: {
    groups() {
      return this.$store.state.group.groups;
    },
    currentPage: {
      get() {
        return 1;
      },
      set(val) {
        if (this.gridApi) this.gridApi.paginationGoToPage(val - 1);
      },
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.filtered.length;
    },
  },
  methods: {
    checkGrouopResource() {
      this.$store
        .dispatch("checkResource", { resource: "AccountGroup" })
        .then((res) => {
          if (res.data.success) {
            this.disableGroupSubmit = false;
            this.popupActive = true;
          } else {
            this.$vs.notify({
time: 7000,
              color: "danger",
              title: "Account Group resource limit has been reached",
            });
          }
        });
    },
    recurseTreeSearch(list, matched) {
      const findSameId = this.searchArr.find((s) => s.id == matched.id);

      if (!findSameId) {
        this.searchArr.unshift(matched);
      }
      if (matched.parent_id) {
        const findSame = this.searchArr.find((s) => s.id == matched.parent_id);

        if (!findSame) {
          const findParent = list.find((l) => l.id === matched.parent_id);
          this.recurseTreeSearch(list, findParent);
        }
      }
    },
    treeSearch(event) {
      if (this.searchText) {
        this.searchArr = [];

        this.field.dataSource = [];

        setTimeout(() => {
          if (this.groups.length) {
            const matched = this.groups.filter((val) =>
              val.name.includes(this.searchText)
            );

            if (matched.length) {
              matched.forEach((item) => {
                this.recurseTreeSearch(this.groups, item);
              });

              this.treeData(this.searchArr);
              this.show_error = false;
            } else {
              this.show_error = true;
            }
          } else {
            this.show_error = true;
          }
        }, 100);
      } else {
        this.fetchUserGroups();
      }
    },
    nodeSelected(event) {
      const data = event.nodeData;
      this.$vs.loading({
        type: "corners",
      });
      this.getGroupById(data.id);
    },
    confirmDeleteGroups() {
      if (this.field.dataSource.length) {
        var treevalidate =
          document.getElementById("treeviews").ej2_instances[0];
        const selectedNodes = treevalidate.selectedNodes[0];

        if (selectedNodes) {
          this.$vs.dialog({
            type: "confirm",
            color: "danger",
            title: `Confirm Delete`,
            text: `Do You want to delete account group`,
            accept: this.deleteGroups,
            acceptText: "Delete",
          });
        } else {
          this.$vs.notify({
time: 7000,
            color: "danger",
            title: "Please check some group ",
          });
        }
      } else {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: "No selected account group",
        });
      }
    },
    deleteGroups() {
      var treevalidate = document.getElementById("treeviews").ej2_instances[0];

      const selectedNodes = treevalidate.selectedNodes[0];

      if (selectedNodes) {
        this.$store
          .dispatch("group/deleteGroups", selectedNodes)
          .then((res) => {
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Account group deleted",
            });

            const index = this.pidOptions.findIndex(
              (p) => p.id == +selectedNodes
            );

            this.pidOptions.splice(index, 1);

            if (!this.pidOptions.length) {
              this.pidOptions = [{ id: null, label: "No group" }];
            }
            treevalidate.removeNodes([selectedNodes]);

            this.componentShow = false;
            if (!this.getTreeData().length) {
              this.canDelete = false;
              this.show_error = true;
            } else {
              const findParent = this.getTreeData().find((l) => !l.parent_id);

              if (findParent) {
                treevalidate.selectedNodes = [findParent.id];
                this.getGroupById(findParent.id);
              }
              this.show_error = false;
              this.canDelete = true;
            }
          })
          .catch((err) => {
            this.$vs.loading.close();

            this.activeLoading = false;
          });
      }
    },
    initValues() {
      this.groupInfo = {
        description: "",
        name: "",
        parent_id: null,
        role: null,
      };
    },
    createGroup() {
      this.disableGroupSubmit = true;
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("group/createGroup", this.groupInfo)
        .then((res) => {
          this.popupActive = false;

          let obj = {};
          obj.id = res.data.id;
          obj.name = res.data.name;
          if (res.data.parent_id) {
            obj.pid = res.data.parent_id;
          }

          var treeObj;
          if (!document.getElementById("treeviews")) {
            this.field.dataSource = [obj];
            this.show_error = false;
            setTimeout(() => {
              treeObj = document.getElementById("treeviews").ej2_instances[0];
              treeObj.selectedNodes = [`${obj.id}`];
            }, 100);
          } else {
            treeObj = document.getElementById("treeviews").ej2_instances[0];
            treeObj.addNodes([obj], null);
          }

          this.pidOptions.push({ id: obj.id, label: obj.name });

          this.initValues();

          treeObj.selectedNodes = [`${obj.id}`];
          this.getGroupById(obj.id);

          this.$vs.loading.close();
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Account Group created",
          });

          this.show_error = false;
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },
    updateGroup() {
      this.$vs.loading({
        type: "corners",
      });

      this.$store
        .dispatch("group/updateGroup", this.groupById)
        .then((res) => {
          this.$vs.loading.close();
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Account Group updated",
          });
          this.field.dataSource = [];
          this.fetchUserGroups();
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },
    searchFilter(search) {
      var fields = this.field.dataSource;
      var result = [];
      var li = document.getElementsByClassName("e-list-item");
      for (var i = 0; i < li.length; i++) {
        if (
          !li[i]
            .getElementsByTagName("span")[2]
            .innerHTML.toLowerCase()
            .includes(search.toLowerCase())
        ) {
          li[i].style.display = "none";
        } else {
          li[i].style.display = "block";
        }
      }
    },
    treeData(array) {
      let filterData = [];
      if (array.length) {
        array.forEach((item) => {
          let obj = {};
          obj.id = item.id;
          obj.name = item.name;

          let filter = array.filter((i) => i.parent_id == item.id);
          if (filter && filter.length) {
            obj.hasChild = true;
          }
          if (item.parent_id) {
            obj.pid = item.parent_id;
          }

          filterData.push(obj);
        });

        this.field.dataSource = filterData;
        this.show_error = false;
      } else {
        this.show_error = true;
      }
    },
    getTreeData() {
      var treevalidate = document.getElementById("treeviews").ej2_instances[0];
      return treevalidate.getTreeData();
    },
    fetchUserGroups() {
      this.$store
        .dispatch("group/fetchAccountGroups")
        .then((res) => {
          this.$vs.loading.close();

          this.treeData(this.groups);
          if (this.groups.length) {
            setTimeout(() => {
              var treevalidate =
                document.getElementById("treeviews").ej2_instances[0];

              const findItem = this.groups.find((g) => !g.parent_id);
              treevalidate.selectedNodes = [`${findItem.id}`];

              this.getGroupById(findItem.id);
            }, 10);
          }

          this.pidOptions = [{ id: null, label: "No group" }];
          if (this.groups.length) {
            this.groups.forEach((item) => {
              this.pidOptions.push({
                id: item.id,
                label: item.name,
              });
            });
          } else {
            this.pidOptions = [{ id: null, label: "No group" }];
          }
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },
    getGroupById(id) {
      this.$store
        .dispatch("group/fetchAccountGroup", id)
        .then((res) => {
          this.groupById = res.data;
          this.filtered = [];

          let filteredData;

          this.$store.dispatch("group/fetchAccountGroups").then((res) => {
            if (res.data.length) {
              filteredData = this.groups.filter((g) => g.parent_id == id);

              filteredData.forEach((data, index) => {
                data.usercnt = data.users.length ? data.users.length : "0";
                data.count = index + 1;
              });
            }

            this.filtered = filteredData;
          });

          this.componentShow = true;

          this.$vs.loading.close();
        })
        .catch((err) => {
          this.$vs.loading.close();

          this.activeLoading = false;
        });
    },
  },
  created() {
    this.$vs.loading({
      type: "corners",
    });

    if (!moduleGroup.isRegistered) {
      this.$store.registerModule("group", moduleGroup);
      moduleGroup.isRegistered = true;
    }

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

    this.fetchUserGroups();
  },
};
</script>


<style lang="scss" scoped>
.account_group_page {
  .con-input-search.vs-table--search {
    margin-right: 0;
  }
  .cardGroup_search_parentss {
    margin-left: unset;
    flex: 1;
    max-width: unset;
    input {
      width: 100%;
    }

    i {
      top: 11px;
    }
  }

  .cardGroup_searchss {
    padding: 10px 28px;
    font-size: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .vs-con-input-label {
    width: auto;
  }
  .position_button {
    position: relative;
    top: -8px;
  }
}
.tree_block_1 {
  // min-height: 350px;
  border-right: 1px solid #0000002e;
  padding-right: 10px;
  margin-right: 10px;
  flex: 0 0 40%;
  .search_create {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    margin-bottom: 15px;
    flex-wrap: inherit;
    margin: 10px -10px;
  }
}

.table_blockss {
  flex: 0 0 60%;
  .header_table {
    background: #f2f2f2;
  }
  table {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    tr {
      &:nth-child(2n) {
        background: #f2f2f2;
      }
      td {
        width: 33.33%;
        padding: 5px;
      }
    }
    th {
      width: 100%;
      td {
        width: 33.33%;
        padding: 5px;
      }
    }
  }
}

.table_class {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group_table .product-name {
  width: 173px;
}

.no_group_text {
  margin-left: 20px;
  font-size: 15px;
  font-weight: 400;
}

.new_margin {
  margin: 0 10px;
}
@media (max-width: 1470px) {
  .search_create {
    width: 100%;
    flex-wrap: wrap !important;
    justify-content: flex-end !important;
  }
  .search_blocks {
    width: 100% !important;
    margin: 0 0 15px !important;
  }
}
</style>