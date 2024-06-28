<template>
  <div>
    <div class="card_group_parent">
      <vs-popup class="holamundo" title="Create Cardholder Group" :active.sync="popupActive">
        <div class="vx-row">
          <div class="vx-col w-full">
            <vs-input label="Name" class="w-full" name="Name" v-model="group.name" v-validate="'required'" />
          </div>
        </div>

        <div class="vx-row mt-3">
          <div class="vx-col w-full">
            <vs-input label="Description" class="w-full" name="Description" v-model="group.description" />
          </div>
          <div class="vx-col w-full">
            <vs-checkbox class="mb-4 mt-5" v-model="group.default">Default
            </vs-checkbox>

            <vs-checkbox class="mb-4 mt-5" v-if="parent_name" v-model="group.inherited">Inherited settings from {{
              parent_name }}
            </vs-checkbox>
          </div>
        </div>

        <div class="vx-row mt-5">
          <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse">
            <vs-button @click="createCardholderGroup" :disabled="!group.name" class="ml-3 unimacs_button">
              Submit
            </vs-button>
            <vs-button color="danger" style="ml-5" @click="
              popupActive = false;
            initValues();
            ">Cancel
            </vs-button>
          </div>
        </div>
      </vs-popup>
      <vx-card>
        <div class="tree_block">
          <div class="card_group_blocks">
            <div class="block_account">
              <div class="row_block">
                <!-- <div class="left_block" @click="blur($event)"> -->
                <div class="left_block">
                  <div class="vs-row new_rr">
                    <div>
                      <vs-button class="
                          create_new_group
                          unimacs_button unimacs_add_new_btn
                        " @click="openGroupAdd">
                        <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" />Add New
                      </vs-button>
                    </div>
                    <div class="
                        con-input-search
                        vs-table--search
                        cardGroup_search_parent
                      ">
                      <input type="text" class="
                          input-search
                          vs-table--search-input
                          cardGroup_search
                        " v-model="searchText" @input="treeSearch($event)" /><i class="
                          vs-icon
                          notranslate
                          icon-scale
                          material-icons
                          null
                        ">search</i>
                    </div>
                  </div>
                  <!-- :allowDragAndDrop="true" -->
                  <ejs-treeview id="tree" :nodeClicked="nodeclicked" :fields="field" v-if="field.dataSource.length">
                    <ejs-contextmenu id="contentmenutree" :toolbar="toolbarOptions" target="#tree" :items="menuItems"
                      :beforeOpen="beforeopen" :select="menuclick"></ejs-contextmenu>
                  </ejs-treeview>
                </div>

                <div class="right_block">
                  <div class="inner_block_groups">
                    <div class="vx-col description_block" v-if="canCreate">
                      <keep-alive>
                        <component :is="groupComponent" :features="features" :propsData="propsData"
                          :createData="createData"></component>
                      </keep-alive>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import moduleCardGroup from "@/store/cardholder-group/moduleCardGroup.js";
import updateComponent from "./EditGroup";
import createComponent from "./CreateGroup";
import moduleRight from "@/store/access-right/moduleAccess.js";
import moduleSchedule from "@/store/schedule/moduleSchedule.js";
import { treeData } from "../../functions/treeData";

export default {
  data() {
    return {
      cardholder: [],
      editData: {},
      toolbarOptions: ["Search"],
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
        htmlAttributes: "hasAttribute"
      },
      group: {
        inherited: true
      },

      menuItems: [
        { text: "Create" },
        { text: "Delete" },
        { text: "Expand all" },
        { text: "Collapse all" }
      ],
      currComponent: null,
      popupActive: false,
      canCreate: false,
      propsData: null,
      searchText: "",
      cardholders_list: [],
      parent_name: null,
      createData: null,
      searchArr: []
    };
  },
  components: {
    updateComponent,
    createComponent
  },
  computed: {
    groups() {
      return this.$store.state.cardGroup.groups;
    },
    features() {
      return localStorage.features &&
        JSON.parse(localStorage.features).Cardholder
        ? JSON.parse(localStorage.features).Cardholder
        : null;
    }
  },
  watch: {
    popupActive(val) {
      if (val) {
        var treeObj = document.getElementById("tree").ej2_instances[0];
        if (treeObj.selectedNodes && treeObj.selectedNodes.length) {
          const item = treeObj.getNode(treeObj.selectedNodes[0]);
          this.parent_name = item.text;
        } else {
          this.parent_name = null;
        }
      }
    }
  },
  methods: {
    recurseFindParent(list, id) {
      const findItem = list.find(l => l.id === id);

      if (list.length) {
        let findParent = list.find(l => l.id === findItem.parent_id);

        if (findParent) {
          findParent.expanded = true;
          this.recurseFindParent(list, findParent.id);
        }
      }

      return list;
    },
    updateTreeId(id) {
      this.$store
        .dispatch("cardGroup/fetchCardHolderGroups")
        .then(res => {
          this.$vs.loading({
            type: "corners"
          });
          this.field.dataSource = [];

          if (res.data.length) {
            // res.data.map((item) => {
            //   item.expanded = true;
            // });
            this.$store.dispatch("cardGroup/fetchCardGroup", +id).then(res => {
              this.selectedNodeId = id;
              this.groupComponent = "updateComponent";
              this.propsData = res.data;
              this.propsData.parent_id = res.data.parent_id
                ? res.data.parent_id
                : null;
              this.canCreate = true;
            });

            setTimeout(() => {
              const list = this.sortData(res.data);

              const expandTree = this.recurseFindParent(list, id);
              this.field.dataSource = treeData(list);
              this.$vs.loading.close();
            }, 0);

            setTimeout(() => {
              var treevalidate = document.getElementById("tree")
                .ej2_instances[0];
              treevalidate.selectedNodes = [`${id}`];
            }, 0);
          }
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    },
    recurseTreeSearch(list, matched) {
      const findSameId = this.searchArr.find(s => s.id == matched.id);

      if (!findSameId) {
        this.searchArr.unshift(matched);
      }
      if (matched.parent_id) {
        const findSame = this.searchArr.find(s => s.id == matched.parent_id);

        if (!findSame) {
          const findParent = list.find(l => l.id === matched.parent_id);
          this.recurseTreeSearch(list, findParent);
        }
      }
    },
    treeSearch() {
      if (this.searchText) {
        this.searchArr = [];
        this.field.dataSource = [];
        this.canCreate = false;

        setTimeout(() => {
          if (this.cardholders_list.length) {
            const matched = this.cardholders_list.filter(val =>
              val.name.includes(this.searchText)
            );
            if (matched.length) {
              matched.forEach(item => {
                this.recurseTreeSearch(this.cardholders_list, item);
              });

              const list = this.sortData(this.searchArr);

              this.searchArr.map(i => {
                i.expanded = true;
                return i;
              });

              this.field.dataSource = treeData(list);
            } else {
              this.field.dataSource = [
                {
                  name: "No Cardholders Group",
                  id: "nogroup"
                }
              ];
            }
          }
        }, 100);
      } else {
        this.buildTree();
      }
    },
    blur(blur) {
      const item = blur.target.classList.value;
      if (item == "left_block") {
        var treeObj = document.getElementById("tree").ej2_instances[0];

        treeObj.selectedNodes = [];

        this.canCreate = false;
      }
    },
    initValues() {
      this.group = {};
    },
    getTreeData() {
      var treeObj = document.getElementById("tree").ej2_instances[0];
      return treeObj.getTreeData();
    },
    nodeSelected(event) {
      const data = event.nodeData;
    },
    nodeclicked(args) {
      var treeObj = document.getElementById("tree").ej2_instances[0];
      const item = treeObj.getNode(args.node);
      const findNode = this.groups.find(g => g.id == +item.id);
      this.selectedNodeId = item.id;
      treeObj.selectedNodes = [item.id];

      if (findNode) {
        if (this.selectedNodeId) {
          this.$store
            .dispatch("cardGroup/fetchCardGroup", +item.id)
            .then(res => {
              this.groupComponent = "updateComponent";
              this.propsData = res.data;
              this.propsData.parent_id = item.parentID ? item.parentID : null;
              this.canCreate = true;
            });
        } else {
          this.canCreate = false;
        }
      } else if (item.id == "nogroup") {
      } else {
        this.groupComponent = "createComponent";
        let findGroup = this.cardholder.find(c => c.id == item.id);
        this.propsData = findGroup;

        this.canCreate = true;
      }
    },
    beforeopen: function (args) {
      var treevalidate = document.getElementById("tree").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];
      var targetNode = document.querySelector(
        '[data-uid="' + targetNodeId + '"]'
      );
      var contentmenutree = document.getElementById("contentmenutree")
        .ej2_instances[0];

      if (targetNode.classList.contains("delete")) {
        contentmenutree.enableItems(["Delete"], false);
      } else {
        contentmenutree.enableItems(["Delete"], true);
      }

      if (targetNode.classList.contains("add")) {
        contentmenutree.enableItems(["Add day"], false);
      } else {
        contentmenutree.enableItems(["Add day"], true);
      }
    },
    menuclick: function (args) {
      var treevalidate = document.getElementById("tree").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];

      if (args.item.text == "Delete") {
        if (!this.features || !this.features.CardholderGroupOperation) {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: "You have not access to Cardholder Group Operations"
          });
        } else {
          let deleteItem = treevalidate.getNode(targetNodeId);


          if (deleteItem.text === "All Cardholders") {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "You can't delete default cardholder group"
            });
          } else {
            this.deletedItem = deleteItem;
            this.deleteItemId = targetNodeId;

            this.$vs.dialog({
              type: "confirm",
              color: "danger",
              title: `Confirm Delete`,
              text: `Do You want to delete ${deleteItem.text} cardholder group `,
              accept: this.deleteNode,
              acceptText: "Delete"
            });
          }
        }
      } else if (args.item.text == "Create") {
        this.popupActive = true;
      } else if (args.item.text == "Collapse all") {
        treevalidate.collapseAll();
      } else if (args.item.text == "Expand all") {
        treevalidate.expandAll();
      }
    },
    deleteNode() {
      var treevalidate = document.getElementById("tree").ej2_instances[0];
      let find_item = this.groups.find(g => g.id == this.deletedItem.id);
      if (find_item) {
        this.$vs.loading({
          type: "corners"
        });
        this.$store
          .dispatch("cardGroup/deleteCardGroup", +this.deleteItemId)
          .then(res => {
            this.$vs.loading.close();
            this.canCreate = false;
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Cardholder Group deleted"
            });
            treevalidate.removeNodes([this.deleteItemId]);
          })
          .catch(error => {
            this.$vs.loading.close();
          });
      } else {
        this.canCreate = false;

        treevalidate.removeNodes([this.deleteItemId]);
      }
    },
    nodeDrag: function (args) {
      if (
        args.droppedNode != null &&
        args.droppedNode.getElementsByClassName("folder") &&
        args.droppedNode.getElementsByClassName("folder").length === 0
      ) {
        args.dropIndicator = "e-no-drop";
      }
    },
    dragStop: function (args) {
      if (
        args.droppedNode != null &&
        args.droppedNode.getElementsByClassName("folder") &&
        args.droppedNode.getElementsByClassName("folder").length === 0
      ) {
        args.cancel = true;
      }
    },
    createCardholderGroup() {
      if (this.group.name != "All Cardholders") {
        var treevalidate = document.getElementById("tree").ej2_instances[0];
        var targetNodeId = treevalidate.selectedNodes[0];
        let pid;

        if (!targetNodeId || targetNodeId === "nogroup") {
          targetNodeId = null;
          pid = null;
        }
        const treeData = treevalidate.getTreeData();
        console.log('this.group', this.group);
        console.log('treeData', treeData);

        const findItem = treeData.find(t => t.name === this.group.name);

        if (findItem) {
          this.$vs.notify({
            time: 7000,
            color: "danger",
            title: `Already exists cardholder group with name ${this.group.name}`
          });
        } else {
          const findDefault = this.cardholders_list.find(
            l => l.name === "All Cardholders"
          );

          if (!targetNodeId) {
            pid = findDefault.id;
          } else {
            pid = targetNodeId;
          }
          let groupOption = {
            id: "id_" + this.group.name,
            name: this.group.name,
            description: this.group.description,
            pid: pid
          };
          groupOption.inherited = this.group.inherited;
          groupOption.default = this.group.default;

          this.createData = groupOption;

          treevalidate.addNodes([groupOption], targetNodeId, null);
          var nullable = treevalidate.getNode("nogroup");

          if (nullable) {
            treevalidate.removeNodes(["nogroup"]);
          }

          treevalidate.selectedNodes = [`${groupOption.id}`];
          this.groupComponent = "createComponent";
          this.propsData = groupOption;
          this.canCreate = true;

          this.cardholder.push(groupOption);

          this.initValues();

          this.popupActive = false;
        }
      } else {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "You can't create group with name All Cardholders"
        });
      }
    },
    openGroupAdd() {
      if (!this.features || !this.features.CardholderGroupOperation) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: "You have not access to Cardholder Group Operations"
        });
      } else {
        this.popupActive = true;
      }
    },
    sortData(items) {
      let sort = JSON.parse(JSON.stringify(items));

      sort.sort(function (a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      return sort;
    },
    refreshTree(id) {
      this.field.dataSource = [];
      this.buildTree(id);
    },
    buildTree(id) {
      console.log('id', id);
      this.$store.dispatch("cardGroup/fetchCardHolderGroups").then(res => {
        this.cardholders_list = res.data;
        if (res.data.length) {
          // res.data.map((item) => {
          //   item.expanded = true;
          // });
          const list = this.sortData(res.data);

          if (id) {
            const expandTree = this.recurseFindParent(list, id);
            this.field.dataSource = treeData(expandTree);
          } else {
            this.field.dataSource = treeData(list);
          }

          this.$vs.loading({
            type: "corners"
          });

          setTimeout(() => {
            this.$vs.loading.close();
            var treevalidate = document.getElementById("tree").ej2_instances[0];
            const treeData = treevalidate.getTreeData();
            const noParent = treeData.find(t => !t.pid);
            const item = treevalidate.getNode(`${noParent.id}`);
            if (id) {
              this.selectedNodeId = id;
              treevalidate.selectedNodes = [`${id}`];
            } else {
              this.selectedNodeId = noParent.id;
              treevalidate.selectedNodes = [`${noParent.id}`];
            }

            if (treeData && treeData.length) {
              this.$store
                .dispatch("cardGroup/fetchCardGroup", id ? +id : +noParent.id)
                .then(res => {
                  this.groupComponent = "updateComponent";
                  this.propsData = res.data;
                  this.propsData.parent_id = item.id
                    ? item.id
                    : null;
                  this.canCreate = true;
                });
            }
          }, 250);
        } else {
          this.field.dataSource.push({
            name: "No Cardholders Group",
            id: "nogroup"
          });
        }
      });
    }
  },

  created() {
    this.cardholder = [];
    if (!moduleCardGroup.isRegistered) {
      this.$store.registerModule("cardGroup", moduleCardGroup);
      moduleCardGroup.isRegistered = true;
    }
    if (!moduleRight.isRegistered) {
      this.$store.registerModule("right", moduleRight);
      moduleRight.isRegistered = true;
    }
    if (!moduleSchedule.isRegistered) {
      this.$store.registerModule("schedule", moduleSchedule);
      moduleSchedule.isRegistered = true;
    }

    this.buildTree();
  }
};
</script>

<style lang="scss" scoped>
.block_account {
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  margin: 0 auto;
}

.row_block {
  min-height: 390px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  margin: 0 -15px;
  background-color: white;
  overflow-x: hidden;
  overflow-y: auto;
}

.right_block {
  flex: 0 0 70%;
  max-width: 70%;
  padding: 0 15px;
}

.left_block {
  flex: 0 0 30%;
  max-width: 30%;
  padding: 0 15px;
}

.row_block::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  border-radius: 0;
  background: #e5e5e5;
}

.row_block::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #999999;
}

.new_rr {
  margin-top: 25px;
  display: flex;
  flex-wrap: nowrap;
}

.cardGroup_search_parent {
  margin-left: unset;
  flex: 1;
  max-width: unset;

  input {
    width: 100%;
  }

  i {
    top: 13px;
  }
}

.create_new_group {
  margin-right: 25px;
}

.card_group_parent {
  min-height: 600px;
  padding: 0;
}

.description_block {
  height: 100%;

  .con-vs-tabs .con-slot-tabs {
    overflow: visible !important;
  }

  .con-vs-tabs {
    overflow: visible !important;
  }
}

#tree {
  margin-top: 25px;
  background: #fff;
}

.cardGroup_search {
  padding: 10px 28px;
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.inner_block_groups {
  height: 100%;
  min-height: inherit;
}

@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
</style>
