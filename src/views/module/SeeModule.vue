<template>
  <div>
    <vx-card>
      <div slot="no-body" class="tabs-container">
        <div v-if="type == 'list'">
          <div
            v-if="permissions.addItem"
            class="custom btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary hover_class"
            @click="addNewModule"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary addNeww">Add New</span>
          </div>
          <generator-table
            :data="data && data.length ? data : []"
            :headers="headers"
            :editFunction="editFunction"
            :deleteFunction="deleteFunction"
            :values="values"
            :itemsCount="itemsCount"
            :permissionDelete="permissions.destroyItem"
            :permissionEdit="permissions.updateItem"
          ></generator-table>
        </div>
        <div v-if="type == 'tree'">
          <div
            class="custom btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary hover_class"
            @click="addNewModule"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary addNeww">Add New</span>
          </div>
          <sl-vue-tree
            v-model="menuTree"
            @drop="draged"
            ref="sl_vue_collape"
            class="sl_vue_collape"
          >
            <template slot="title" slot-scope="{ node }">
              <button
                @click="deleteTreeFunction(node)"
                v-if="permissions.destroyItem"
                class="actionsIconD hover_class mr-5"
              >
                <img src="/delete.svg" alt title />
              </button>
              <vs-button
                @click="editTreeFunction(node)"
                v-if="permissions.updateItem"
                class="edit_drops hover_class"
              >
                <img src="/edit-tools.svg" alt title />
              </vs-button>

              <span class="nodeTitle">{{
                node.title[defaultLng] ? node.title[defaultLng] : node.title
              }}</span>
            </template>

            <template slot="draginfo">
              <span class="nodeTitle"></span>
            </template>

            <template slot="toggle" slot-scope="{ node }">
              <span class="item-icon">
                <svg
                  v-if="node.isExpanded && node.children.length"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-folder-minus"
                >
                  <path
                    d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                  />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>

                <svg
                  v-if="!node.isExpanded && node.children.length"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-folder-plus"
                >
                  <path
                    d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                  />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>

                <svg
                  v-if="!node.children.length"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-menu"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </span>
            </template>
          </sl-vue-tree>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<style scoped>
</style>

<script>
import SlVueTree from "sl-vue-tree";
import Generator from "./Gen.vue";
import _ from "lodash";

export default {
  components: {
    "generator-table": Generator,
    SlVueTree,
  },
  data() {
    return {
      name: "module",
      routeName: null,
      menuTree: [],
      moduleList: [],
      editPath: null,
      deletedId: null,
      deleteNode: null,
      defaultLng: "en",
      moduleDelId: null,
      modules: [],
      items: [],
      headers: [],
      data: [],
      moduleData: null,
      values: [],
      mod: {},
      itemsCount: 0,
      type: null,
      permissions: {},
      drawDependsPerms: {},
    };
  },
  computed: {},
  methods: {
    draged(draggingNodes, position, event) {
      const dragedItem = this.moduleList.find(
        (menu) =>
          menu.title[this.defaultLng] == draggingNodes[0].title[this.defaultLng] // tree find
      );

      let parent_id;

      if (position.placement == "before" || position.placement == "after") {
        parent_id = this.moduleList.find(
          (menu) =>
            menu.title[this.defaultLng] == position.node.title[this.defaultLng]
        ).parent_id;
      } else {
        parent_id = this.moduleList.find(
          (menu) =>
            menu.title[this.defaultLng] == position.node.title[this.defaultLng]
        ).id;
      }

      const obj = {
        id: dragedItem.id,
        parent_id: parent_id,
      };

      this.$vs.loading({
        type: "corners",
      });

      this.$http
        .put(`${this.$route.params.name}`, obj, {
          headers: { Authorization: localStorage.token },
        })
        .then((response) => {
          const productIndex = this.moduleList.findIndex((p) => p.id == obj.id);
          this.moduleList[productIndex].parent_id = obj.parent_id;
          this.$vs.loading.close();
        })
        .catch((error) => {
          if (error.response.status) {
            if (error.response.status == 401) {
              this.$vs.loading.close();
              this.$router.push("/login").catch(() => {});
            } else if (error.response.status == 400) {
              this.$vs.notify({
                time: 7000,
                color: "danger",
                title: "Something went wrong",
              });
            }
          }
          this.$vs.loading.close();
        });
      setTimeout(() => {
        this.$vs.loading.close();
      }, 500);
    },

    addNewModule() {
      const submenu = this.$route.params.submenu;
      if (submenu) {
        this.$router.push(
          `/create-module/${this.$route.params.name}/${this.$route.params.submenu}`
        );
      } else {
        this.$router.push(`/create-module/${this.$route.params.name}`);
      }
    },
    editTreeFunction(node) {
      const data = this.moduleList.find(
        (item) => item.title[this.defaultLng] == node.title[this.defaultLng] // find tree
      );

      this.editPath = node.path;

      if (this.$route.params.submenu) {
        this.$router.push(
          `/edit-module/${this.$route.params.name}/${this.$route.params.submenu}/${data.id}`
        );
      } else {
        this.$router.push(`/edit-module/${this.$route.params.name}/${data.id}`);
      }
    },
    editFunction(item) {
      if (this.$route.params.submenu) {
        this.$router.push(
          `/edit-module/${this.$route.params.name}/${this.$route.params.submenu}/${item.id}`
        );
      } else {
        this.$router.push(`/edit-module/${this.$route.params.name}/${item.id}`);
      }
    },

    filterItems(findIn, id) {
      return findIn.filter((item) => item.parent_id == id);
    },
    deleteData() {
      const id = this.deletedId;

      const findModule = this.moduleList.find((item) => item.id == id);
      let sendToDelete = [];

      sendToDelete.push(findModule.id);

      if (this.filterItems(this.moduleList, findModule.id).length) {
        this.filterItems(this.moduleList, findModule.id).forEach((level_1) => {
          sendToDelete.push(level_1.id);
          if (this.filterItems(this.moduleList, level_1.id).length) {
            this.filterItems(this.moduleList, level_1.id).forEach((level_2) => {
              sendToDelete.push(level_2.id);
              if (this.filterItems(this.moduleList, level_2.id).length) {
                this.filterItems(this.moduleList, level_2.id).forEach(
                  (level_3) => {
                    sendToDelete.push(level_3.id);
                    if (this.filterItems(this.moduleList, level_3.id).length) {
                      this.filterItems(this.moduleList, level_3.id).forEach(
                        (level_4) => {
                          sendToDelete.push(level_4.id);
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        });
      }

      this.$vs.loading({
        type: "corners",
      });

      for (let i = 0; i < sendToDelete.length; i++) {
        this.$http
          .delete(`${this.$route.params.name}`, {
            headers: { Authorization: localStorage.token },
            data: { id: sendToDelete[i] },
          })
          .then((response) => {
            this.$vs.loading.close();
          })
          .catch((error) => {
            if (error.response.status) {
              if (error.response.status == 401) {
                this.$vs.loading.close();

                this.$router.push("/login").catch(() => {});
              } else if (error.response.status == 400) {
                this.$vs.notify({
                  time: 7000,
                  color: "danger",
                  title: "Something went wrong",
                });
              }
            }
            this.$vs.loading.close();
          });
      }

      this.$vs.loading.close();

      const $slVueTree = this.$refs.sl_vue_collape;

      const paths = $slVueTree
        .getSelected()
        .map((node) => this.deleteNode.path);
      $slVueTree.remove(paths);

      this.$vs.notify({
        time: 7000,
        color: "success",
        title: "Modules have been deleted",
      });
    },
    deleteRecord() {
      const name = this.$route.params.submenu
        ? this.$route.params.submenu
        : this.$route.params.name;
      this.$vs.loading({
        type: "corners",
      });
      this.$http
        .delete(`${name}`, {
          headers: { Authorization: localStorage.token },
          data: { id: this.moduleDelId },
        })
        .then((res) => {
          const moduleIndex = this.data.findIndex(
            (u) => u.id == this.moduleDelId
          );
          this.data.splice(moduleIndex, 1);

          this.$vs.loading.close();

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Module item deleted",
          });
        })
        .catch((error) => {
          if (error.response.status) {
            if (error.response.status == 401) {
              this.$vs.loading.close();

              this.$router.push("/login").catch(() => {});
            } else if (error.response.status == 400) {
              this.$vs.notify({
                time: 7000,
                color: "danger",
                title: "Something went wrong",
              });
            }
          }
          this.$vs.loading.close();
        });
    },

    deleteTreeFunction(data) {
      this.deletedId = this.moduleList.find(
        (item) => item.title[this.defaultLng] == data.title[this.defaultLng]
      ).id;

      this.deleteNode = data;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do you want to delete ${data.title[this.defaultLng]}`,
        accept: this.deleteData,
        acceptText: "Delete",
      });
    },
    deleteFunction(e) {
      this.moduleDelId = e.id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete module item`,
        accept: this.deleteRecord,
        acceptText: "Delete",
      });
    },
    upperCaseToSpace(modelName) {
      let name = "";
      const char = modelName;
      if (char === char.toUpperCase()) {
        name = name + char.toLowerCase();
      } else {
        name = name + char;
      }

      name = name.replace(/([A-Z])/g, " $1").trim();

      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    initValues() {
      const moduleName = this.$route.params.name;
      const subMenuName = this.$route.params.submenu
        ? this.$route.params.submenu
        : null;

      let url = subMenuName ? subMenuName : moduleName;

      let moduleData = JSON.parse(localStorage.modules);

      if (!moduleData[moduleName]["submenu"]) {
        this.type = moduleData[moduleName].type;
        this.moduleData = moduleData[moduleName];
      } else {
        this.type = moduleData[moduleName]["submenu"][subMenuName].type;
        this.moduleData = moduleData[moduleName]["submenu"][subMenuName];
      }

      let data = this.moduleData;
      let headerKeys = [];
      this.headers = [];
      this.modules = [];

      if (data.fields) {
        Object.keys(data.fields).forEach((m) => {
          let obj = data.fields[m];
          obj.name = m;
          this.modules.push(obj);
        });

        const headers = this.modules.filter((mod) => mod.header);

        headers.forEach((head) => {
          this.headers.push(head);
          headerKeys.push({
            type: head.formType,
            name: head.name,
          });
        });
        this.values = headerKeys;

        this.$http
          .get(`${url}?page=0&count=1000`, {
            headers: { Authorization: localStorage.token },
          })
          .then(async (result) => {
            if (data.type != "tree") {
              let datas = {};
              datas = result.data.data;
              this.itemsCount = result.data.count;
              this.data = datas;

              this.$vs.loading.close();
            } else {
              let menuArr = [];
              let list = result.data.data;

              this.moduleList = result.data.data;

              var map = {},
                node,
                roots = [],
                i;
              for (i = 0; i < list.length; i += 1) {
                // list[i].data = list[i];
                map[list[i].id] = i; // initialize the map
                list[i].children = []; // initialize the children
              }

              for (i = 0; i < list.length; i += 1) {
                node = list[i];
                if (node.parent_id) {
                  if (list[map[node.parent_id]]) {
                    list[map[node.parent_id]].children.push(node);
                  }
                } else {
                  roots.push(node);
                }
              }
              this.menuTree = roots;

              this.$vs.loading.close();
            }
          })
          .catch((err) => {
            this.$vs.loading.close();

            if (err.response && err.response.status) {
              if (err.response.status == 401) {
                this.$router.push("/login").catch(() => {});
              } else if (error.response.status == 400) {
                this.$vs.notify({
                  time: 7000,
                  color: "danger",
                  title: "Something went wrong",
                });
              }
            }
          });
      }
    },
    checkFalse(obj) {
      for (var i in obj) {
        if (obj[i] == true) return false;
      }
      return true;
    },
    checkFalses(obj) {
      for (var i in obj) {
        for (var j in obj[i]) {
          if (obj[i][j] == true) return false;
        }
      }
      return true;
    },
  },

  created() {
    let localStr = localStorage.permissions;
    let names = this.$route.params.submenu
      ? this.$route.params.submenu.replace(
          /^./,
          this.$route.params.submenu[0].toUpperCase()
        )
      : this.$route.params.name.replace(
          /^./,
          this.$route.params.name[0].toUpperCase()
        );
    this.permissions = localStr
      ? JSON.parse(localStr)[names].actions
      : this.$store.state.permissions[names].actions;

    if (this.checkFalse(this.permissions)) {
      this.$vs.notify({
        time: 7000,
        color: "danger",
        title: `You haven't access to enter to ${names}`,
      });

      let routes = this.$router.options.routes[0].children;
      let route = routes.filter((r) => r.custom);
      let perms = JSON.parse(localStorage.permissions);

      for (let i = 1; i < route.length; i++) {
        if (!this.checkFalses(perms[route[i].name])) {
          setTimeout(() => {
            this.$router.push(route[i].path).catch(() => {});
          }, 100);
        }
      }

      return false;
    }

    // .replace(/^./, m[0].toUpperCase());
    this.defaultLng = process.env.VUE_APP_LNG;

    this.initValues();

    const name = this.$route.params.submenu
      ? this.$route.params.submenu
      : this.$route.params.name;
    this.routeName = name;

    this.$root.$emit("changeTitle", `Module ${this.upperCaseToSpace(name)}`);
  },
  watch: {
    $route(to, from) {
      const name = this.$route.params.submenu
        ? this.$route.params.submenu
        : this.$route.params.name;
      this.routeName = name;

      this.$root.$emit("changeTitle", `Module ${this.upperCaseToSpace(name)}`);
      this.initValues();
    },
  },
};
</script>


<style  lang="scss" >
@import url("../../../node_modules/sl-vue-tree/dist/sl-vue-tree-dark.css");

.sl-vue-tree-root {
  border: none !important;
  background: none !important;
  margin-top: 1.25rem !important;
}

.sl_vue_collape {
  svg.feather.feather-folder-plus,
  svg.feather.feather-folder-minus {
    color: black;
  }

  .sl-vue-tree-selected > .sl-vue-tree-node-item {
    background: inherit !important;
  }

  .feather.feather-menu,
  .nodeTitle {
    color: black;
  }

  .sl-vue-tree-node-item.sl-vue-tree-cursor-hover.sl-vue-tree-cursor-inside.sl-vue-tree-node-is-folder
    + .sl-vue-tree {
    background: #34343d10 !important;
    border-radius: 20px;
  }
  .sl-vue-tree {
    border-top: 2px solid #dedede;
  }
  .sl-vue-tree-node-item {
    border-radius: 20px;
  }

  .sl-vue-tree-node {
    padding-top: 1.25rem !important;
  }

  .sl-vue-tree-cursor.sl-vue-tree-cursor_before {
    border: 4px solid #d0d0d0;
    position: unset;
  }

  .sl-vue-tree-node-item.sl-vue-tree-cursor-hover.sl-vue-tree-cursor-inside.sl-vue-tree-node-is-folder {
    background: #34343d10;
  }

  .sl-vue-tree-title {
    display: flex;
    align-items: center;
  }

  .sl-vue-tree-title .edit_drops {
    margin-right: 1.25rem !important;
  }

  .sl-vue-tree-toggle {
    margin-right: 1.25rem !important;
  }

  .edit_drops {
    background: none !important;
    padding: 0 !important;

    .vs-button--text {
      cursor: pointer;
      background: #b5f4d2;
      border-radius: 50%;
      padding: 11px;
      border: none;

      img {
        width: 16px;
        display: block;
      }
    }

    &:hover {
      box-shadow: none;
    }
  }

  .hover_class {
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.5;
    }
  }

  .roww {
    display: flex;
    align-items: center;
  }

  .moduleBlock.open-item > .vs-collapse-item--content {
    max-height: unset !important;
  }

  .actionsIconD {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border: none;
    width: 38px;
    height: 38px;
    background: #ff9890;
    border-radius: 50%;
  }

  .actionsIconD img {
    width: 16px;
    display: block;
  }
}

.module_view {
  display: flex;
  width: 100%;
  padding: 0 15px;
  padding-left: 0;
  flex-wrap: wrap;
  .card_block {
    // flex: 0 0 20%;
    // max-width: 20%;
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
    h2 {
      font-size: 18px;
    }
  }
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
  width: 38px;
  height: 38px;
}

.actionsIconD {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  width: 38px;
  height: 38px;
  background: #ff9890;
  border-radius: 50%;
}

.actionsIconE img,
.actionsIconD img {
  width: 16px;
  display: block;
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

.actionBlock {
  display: flex;
  flex-direction: row-reverse;
}
</style>
