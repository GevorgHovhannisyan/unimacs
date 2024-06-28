<template>
  <div class="group_zone_page">
    <CreateGroupPopup
      :popupActive="createGrPopup"
      @createGroup="createCardholderGroup($event)"
      @popup="createGrPopup = $event"
    />

    <CreatePointZone
      :popupActive="popupActive"
      @createLocZone="createLocZone($event)"
      @popup="popupActive = $event"
    />

    <vx-card class="loc_zone_card">
      <vs-tabs class="tab-action-btn-fill-conatiner" v-model="activeTab">
        <vs-tab label="Location Zone">
          <div class="loc_zone">
            <div class="vx-col">
              <div class="tree_block">
                <div class="block_account mt-5">
                  <div class="row_block zone_row">
                    <div class="left_block" @click="blur($event)">
                      <div class="vs-row new_rr">
                        <div class="add_bloc">
                          <vs-button
                            class="unimacs_button unimacs_add_new_btn"
                            @click.stop="openZoneAdd"
                            v-if="zonePermissions && zonePermissions.addItem"
                          >
                            <feather-icon
                              icon="PlusIcon"
                              svgClasses="h-4 w-4 mr-1"
                            />Add New
                          </vs-button>
                        </div>
                        <div
                          class="
                            con-input-search
                            vs-table--search
                            cardGroup_search_parent
                          "
                        >
                          <input
                            type="text"
                            class="
                              input-search
                              vs-table--search-input
                              cardGroup_search
                            "
                            v-model="searchText"
                            @input="treeSearch($event)"
                          /><i
                            class="
                              vs-icon
                              notranslate
                              icon-scale
                              material-icons
                              null
                            "
                            >search</i
                          >
                        </div>
                      </div>
                      <ejs-treeview
                        id="treeCard"
                        class="mt-6 treeCard"
                        :nodeClicked="nodeclicked"
                        :fields="field"
                        v-if="field.dataSource.length"
                      >
                        <ejs-contextmenu
                          id="contentmenutree"
                          :toolbar="toolbarOptions"
                          target="#treeCard"
                          :items="menuItems"
                          :select="menuclick"
                        ></ejs-contextmenu>
                      </ejs-treeview>
                    </div>
                    <div class="right_block">
                      <div class="inner_block">
                        <div class="vx-col" v-if="canCreate">
                          <keep-alive>
                            <component
                              :is="groupComponent"
                              :propsData="propsData"
                              :permissions="zonePermissions"
                            ></component>
                          </keep-alive>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </vs-tab>
        <vs-tab label="Group List" v-show="show_group">
          <div class="block_account grop_list mt-5">
            <div class="row_block">
              <div class="left_block">
                <div class="vx-col list_tbl_search">
                  <div class="gr_list_actions">
                    <vs-button
                      class="gr_list mr-4 unimacs_button unimacs_add_new_btn"
                      @click="createGrPopup = true"
                      v-if="groupPermissions && groupPermissions.addItem"
                    >
                      <feather-icon
                        icon="PlusIcon"
                        svgClasses="h-4 w-4 mr-1"
                      />Add New
                    </vs-button>

                    <div
                      class="
                        con-input-search
                        vs-table--search
                        cardGroup_search_parentss
                      "
                    >
                      <input
                        type="text"
                        v-model="searchText"
                        @input="rightSearch($event)"
                        class="
                          input-search
                          vs-table--search-input
                          cardGroup_searchss
                        "
                      /><i
                        class="
                          vs-icon
                          notranslate
                          icon-scale
                          material-icons
                          null
                        "
                        >search</i
                      >
                    </div>
                  </div>

                  <TableContext
                    :search="false"
                    :items="filteredGroups"
                    :selectedItem="selectedGroup"
                    @openRule="openRule($event)"
                    @createRule="createRule($event)"
                    @remove="remove($event)"
                    :permissions="groupPermissions"
                  />
                </div>
              </div>

              <div class="right_block">
                <div class="inner_block">
                  <div class="vx-col group_info_bl" v-if="groupInfo">
                    <div class="vx-row mt-5">
                      <div class="vx-col md:w-1/2">
                        <vs-input
                          label="Name"
                          class="w-full"
                          name="name"
                          v-model="pointGroup.name"
                        />
                      </div>

                      <div class="vx-col md:w-1/2">
                        <vs-input
                          label="Description"
                          class="w-full"
                          name="Description"
                          v-model="pointGroup.description"
                        />
                      </div>
                    </div>

                    <Table
                      class="mt-4 miss_ac_tbl"
                      :items="ac_points"
                      :headers="ac_point_headers"
                    />
                    <div
                      class="vx-row"
                      style="display: flex; justify-content: flex-end"
                    >
                      <div>
                        <vs-button
                          class="mt-4 mr-4 unimacs_button"
                          v-if="groupPermissions && groupPermissions.updateItem"
                          @click="updatePointGroup"
                          :disabled="!pointGroup.name"
                          >Submit</vs-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </vs-tab>
      </vs-tabs>
    </vx-card>
  </div>
</template>

<script>
import moduleAccessPointGroup from "@/store/group-zones/moduleAccessPoint.js";
import updateComponent from "./EditZone";
import createComponent from "./CreateZone";
import Table from "../../components/custom/table/Table";

import TableContext from "../../components/custom/table/TableContext";
import CreateGroupPopup from "./popups/CreateGroupPopup";
import CreatePointZone from "./popups/CreatePointZone";
import { treeData } from "../../functions/treeData";
import { pagePermissions } from "../../functions/pagePermissions";
export default {
  data() {
    return {
      activeTab: 0,
      zones: [],
      toolbarOptions: ["Search"],
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
        htmlAttributes: "hasAttribute"
      },
      menuItems: [{ text: "Expand all" }, { text: "Collapse all" }],
      popupActive: false,
      canCreate: false,
      propsData: null,
      selectedNodeId: null,
      createGrPopup: false,
      groupInfo: false,
      pointGroup: {
        name: null,
        description: null
      },
      deletePointGrId: null,
      zoneData: null,
      show_zones: false,
      show_group: false,
      ac_points: [],
      ac_point_headers: [
        { key: "count", name: "#" },
        { key: "name", name: "Name" },
        { key: "acu_name", name: "ACU Name" },
        { key: "type", name: "Type" }
      ],
      searchText: "",
      correctZone: [],
      selectedGroup: null,
      searchArr: [],
      filteredGroups: [],
      searchText: null
    };
  },

  methods: {
    blur(blur) {
      const item = blur.target.classList.value;
      if (item == "left_block") {
        var treeObj = document.getElementById("treeCard").ej2_instances[0];
        treeObj.selectedNodes = [];
        this.canCreate = false;

        this.$store.commit("accessPointGroup/SET_ACTIVE_ZONES", null);
      }
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
    treeSearch(event) {
      if (this.searchText) {
        this.searchArr = [];
        this.canCreate = false;
        this.field.dataSource = [];

        setTimeout(() => {
          if (this.zones.length) {
            const lowerText = this.searchText.toLowerCase();
            const matched = this.zones.filter(val =>
              val.name.toLowerCase().includes(lowerText)
            );

            if (matched.length) {
              matched.forEach(item => {
                this.recurseTreeSearch(this.zones, item);
              });

              this.searchArr.map(i => {
                i.expanded = true;
                return i;
              });

              // const fakeBuild = treeData(this.searchArr);

              // if (fakeBuild.length) {
              //   const filtr = fakeBuild.filter(i => !i.hasChild);

              //   if (filtr.length) {
              //     filtr.forEach(element => {
              //       const findChilds = this.zones.filter(
              //         l => l.parent_id == +element.id
              //       );
              //       if (findChilds.length) {
              //         // level 222
              //         findChilds.forEach(element => {
              //           this.searchArr.push(element);

              //           const findChildsInner = this.zones.filter(
              //             l => l.parent_id == +element.id
              //           );

              //           if (findChildsInner.length) {
              //         // level 333

              //             findChildsInner.forEach(element => {
              //               this.searchArr.push(element);
              //             });
              //           }
              //         });
              //       }
              //     });
              //   }
              // }
              this.field.dataSource = treeData(this.searchArr);
            } else {
              this.field.dataSource = [
                {
                  name: "No Cardholders Group",
                  id: "nogroup"
                }
              ];
            }
          }
        }, 0);
      } else {
        this.initTree();
      }
    },
    createGroupInfo(data) {
      const group_zone = {
        name: data.name,
        description: data.description,
        parent_id: data.pid ? +data.pid : null,
        antipass_backs: {
          type: "disable",
          enable_timer: false,
          time: null,
          time_type: "minutes"
        },
        apb_reset_timer: null,
        people_limits_min: null,
        people_limits_max: null
      };
      this.$vs.loading({
        type: "corners"
      });

      this.$store
        .dispatch("accessPointGroup/createAccessZone", group_zone)
        .then(res => {
          setTimeout(() => {
            this.savedZone(res.data);
            this.$vs.loading.close();
            this.$vs.notify({
time: 7000,
              color: "success",
              title: `Location Zone Created`
            });

            this.popupActive = false;
          }, 300);
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    },
    createLocZone(data) {
      var treevalidate = document.getElementById("treeCard").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];
      let pid;
      if (!targetNodeId || targetNodeId === "nogroup") {
        targetNodeId = null;
        pid = null;
      }

      if (this.zoneItems.length) {
        if (!targetNodeId) {
          const findZone = this.zoneItems.find(z => !z.parent_id);
          pid = findZone.id;
        } else {
          pid = targetNodeId;
        }
      } else {
        pid = null;
      }
      let zoneOption = {
        // id: uid(12),
        name: data.name,
        description: data.description,
        pid: pid
      };

      this.createGroupInfo(zoneOption);

      treevalidate.addNodes([zoneOption], pid, null);

      this.field.dataSource.push(zoneOption);
      this.$store.commit("accessPointGroup/SET_ZONE", zoneOption);

      this.$store.commit("accessPointGroup/SET_ACTIVE_ZONES", zoneOption.id);

      const index = this.zoneItems.findIndex(z => z.id == zoneOption.id);
      this.propsData = JSON.parse(JSON.stringify(this.zoneItems[index]));
      this.propsData.saveItem = true;
      this.groupComponent = "createComponent";

      var nullable = treevalidate.getNode("nogroup");

      if (nullable) {
        treevalidate.removeNodes(["nogroup"]);
      }

      treevalidate.selectedNodes = [zoneOption.id];

      this.canCreate = true;

      this.popupActive = false;
    },
    openRule(data) {
      this.$http
        .get(`accessPointGroup/${data.id}`, {
          headers: { Authorization: localStorage.token }
        })
        .then(res => {
          const access_points = res.data.access_points;
          this.selectedGroup = data.id;
          let ac_points = [];
          if (access_points.length) {
            access_points.forEach((point, index) => {
              ac_points.push({
                count: index + 1,
                name: point.name,
                acu_name: point.acus ? point.acus.name : "",
                type: point.type
              });
            });
          }
          this.ac_points = ac_points;
        });

      this.groupInfo = true;
      this.pointGroup = { ...data };
    },
    createRule(data) {
      this.groupInfo = true;
      this.pointGroup = { ...data };
    },
    remove(data) {
      this.deletePointGrId = data.id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Do You want to delete ${data.name} access point group`,
        accept: this.deletePointGroup,
        acceptText: "Delete"
      });
    },
    deletePointGroup() {
      this.$vs.loading({
        type: "corners"
      });
      this.$store
        .dispatch(
          "accessPointGroup/deleteAccessPointGroup",
          this.deletePointGrId
        )
        .then(res => {
          this.$vs.loading.close();
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Access Point Group Deleted"
          });

          if (this.access_groups.length) {
            this.openRule(this.access_groups[0]);
          } else {
            this.groupInfo = false;
          }
        })
        .catch(error => {
          this.$vs.loading.close();
        });
    },
    updatePointGroup() {
      this.$vs.loading({
        type: "corners"
      });
      this.$store
        .dispatch("accessPointGroup/updateAccessGroup", this.pointGroup)
        .then(res => {
          this.$vs.loading.close();
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Access Point Group Updated"
          });

          this.filteredGroups = JSON.parse(JSON.stringify(this.access_groups));
        })
        .catch(error => {
          this.$vs.loading.close();
        });
    },
    nodeclicked(args) {
      var treeObj = document.getElementById("treeCard").ej2_instances[0];
      const item = treeObj.getNode(args.node);
      const findNode = this.zones.find(g => g.id == +item.id);
      this.$store.commit("accessPointGroup/SET_ACTIVE_ZONES", item.id);
      treeObj.selectedNodes = [item.id];
      this.selectedNodeId = item.id;
      if (Number.isInteger(+item.id)) {
        if (this.selectedNodeId) {
          this.$store
            .dispatch("accessPointGroup/fetchAccessZone", +item.id)
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
        // let findGroup = this.access_zones.find((c) => c.id == item.id);
        const index = this.zoneItems.findIndex(z => z.id == this.activeZone);
        this.propsData = JSON.parse(JSON.stringify(this.zoneItems[index]));

        this.canCreate = true;
      }
    },
    menuclick: function(args) {
      var treevalidate = document.getElementById("treeCard").ej2_instances[0];
      var targetNodeId = treevalidate.selectedNodes[0];
      const treeData = treevalidate.getTreeData();
      // let findItem = this.schedules.find((s) => s.id == targetNodeId);

      if (args.item.text == "Delete") {
        let deleteItem = treevalidate.getNode(targetNodeId);
        this.deletedItem = deleteItem;
        this.deleteItemId = targetNodeId;

        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirm Delete`,
          text: `Do You want to delete ${deleteItem.text} Location Zone `,
          accept: this.deleteNode,
          acceptText: "Delete"
        });
      } else if (args.item.text == "Create") {
        this.popupActive = true;
      } else if (args.item.text == "Collapse all") {
        treevalidate.collapseAll();
      } else if (args.item.text == "Expand all") {
        treevalidate.expandAll();
      }
    },
    deleteNode() {
      var treevalidate = document.getElementById("treeCard").ej2_instances[0];
      let find_item = this.zones.find(g => g.id == this.deletedItem.id);
      if (find_item) {
        this.$vs.loading({
          type: "corners"
        });
        this.$store
          .dispatch("accessPointGroup/deleteZone", +this.deleteItemId)
          .then(res => {
            this.$vs.loading.close();
            this.canCreate = false;
            this.$vs.notify({
time: 7000,
              color: "success",
              title: "Location Zone deleted"
            });
            treevalidate.removeNodes([this.deleteItemId]);
            if (!treevalidate.getTreeData().length) {
              this.field.dataSource = [];
              setTimeout(() => {
                this.field.dataSource = [
                  {
                    name: "No access point zone",
                    id: "nogroup"
                  }
                ];
              }, 100);
            }
            this.$store.commit("accessPointGroup/DEL_ZONE", this.deleteItemId);
          })
          .catch(error => {
            this.$vs.loading.close();
          });
      } else {
        this.canCreate = false;

        treevalidate.removeNodes([this.deleteItemId]);
        this.$store.commit("accessPointGroup/DEL_ZONE", this.deleteItemId);

        if (!treevalidate.getTreeData().length) {
          this.field.dataSource = [];
          setTimeout(() => {
            this.field.dataSource = [
              {
                name: "No access point zone",
                id: "nogroup"
              }
            ];
          }, 100);
        }
      }
    },
    nodeDrag: function(args) {
      if (
        args.droppedNode != null &&
        args.droppedNode.getElementsByClassName("folder") &&
        args.droppedNode.getElementsByClassName("folder").length === 0
      ) {
        args.dropIndicator = "e-no-drop";
      }
    },
    dragStop: function(args) {
      if (
        args.droppedNode != null &&
        args.droppedNode.getElementsByClassName("folder") &&
        args.droppedNode.getElementsByClassName("folder").length === 0
      ) {
        args.cancel = true;
      }
    },
    createCardholderGroup(group) {
      this.$vs.loading({
        type: "corners"
      });

      this.$store
        .dispatch("accessPointGroup/createAccessGroup", group)
        .then(res => {
          this.$vs.loading.close();
          this.createGrPopup = false;
          this.$vs.notify({
time: 7000,
            color: "success",
            title: "Access Point Group Created"
          });
          this.openRule(res.data);
        })
        .catch(error => {
          this.$vs.loading.close();
        });
    },
    changeItemId(item) {
      this.$vs.loading({
        type: "corners"
      });
      let save_data = [...this.field.dataSource];
      // save_data.map((item) => {
      //   item.expanded = true;
      // });

      let new_item = save_data.find(z => z.id == item.id);
      new_item.name = item.name;
      new_item.selected = true;

      this.field.dataSource = [];

      setTimeout(() => {
        this.field.dataSource = save_data;
        this.$vs.loading.close();
      }, 0);
    },
    correctExpandedItems(zones, item) {
      if (zones.length) {
        if (item.parent_id) {
          let findZone = zones.find(z => z.id == +item.parent_id);
          findZone.expanded = true;

          if (findZone.parent_id) {
            this.correctExpandedItems(zones, findZone);
          }
        }
      }
      return zones;
    },
    savedZone(item) {
      this.field.dataSource = [];
      this.$store.dispatch("accessPointGroup/fetchAccessZones").then(res => {
        this.zones = res.data;
        if (res.data.length) {
          this.correctExpandedItems(this.zoneItems, item);

          let sort = JSON.parse(JSON.stringify(this.zoneItems));

          sort.sort(function(a, b) {
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
          this.$vs.loading({
            type: "corners"
          });
          this.field.dataSource = treeData(sort);
          setTimeout(() => {
            this.$vs.loading.close();
          }, 0);

          if (this.field.dataSource.length) {
            setTimeout(() => {
              var treeObj = document.getElementById("treeCard")
                .ej2_instances[0];
              treeObj.selectedNodes = [`${item.id}`];

              this.$store.commit("accessPointGroup/SET_ACTIVE_ZONES", item.id);

              this.$store
                .dispatch("accessPointGroup/fetchAccessZone", +item.id)
                .then(res => {
                  this.groupComponent = "updateComponent";
                  this.propsData = res.data;
                  this.propsData.parent_id = item.parent_id
                    ? item.parent_id
                    : null;
                  this.canCreate = true;
                });
            }, 0);
          }
        } else {
          this.field.dataSource.push({
            name: "No access point zone",
            id: "nogroup"
          });
        }
      });
    },
    rightSearch() {
      var lowSearch = this.searchText.toLowerCase();
      const keys = ["name", "description"];

      const matched = this.access_groups.filter(val =>
        keys.some(key =>
          String(val[key])
            .toLowerCase()
            .includes(lowSearch)
        )
      );
      this.filteredGroups = matched;
    },
    initTree() {
      this.field.dataSource = [];
      this.$store.dispatch("accessPointGroup/fetchAccessZones").then(res => {
        this.zones = res.data;
        if (res.data.length) {
          let sort = JSON.parse(JSON.stringify(this.zoneItems));

          sort.sort(function(a, b) {
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

          this.field.dataSource = treeData(sort);

          if (this.field.dataSource.length) {
            const w_parent = this.field.dataSource.filter(d => !d.pid);
            setTimeout(() => {
              var treeObj = document.getElementById("treeCard")
                .ej2_instances[0];
              const items = treeObj.getTreeData();
              treeObj.selectedNodes = [w_parent[0].id];

              this.$store
                .dispatch("accessPointGroup/fetchAccessZone", +w_parent[0].id)
                .then(res => {
                  this.groupComponent = "updateComponent";
                  this.propsData = res.data;
                  this.propsData.parent_id = w_parent[0].parentID
                    ? w_parent[0].parentID
                    : null;
                  this.canCreate = true;
                });
            }, 0);
          }
        } else {
          this.field.dataSource.push({
            name: "No access point zone",
            id: "nogroup"
          });
        }
      });
    },
    openZoneAdd() {
      var treeObj = document.getElementById("treeCard").ej2_instances[0];
      const items = treeObj.getTreeData();
      const selectedNodes = treeObj.selectedNodes[0];
      if (!items.length == 1) {
        if (items[0].id !== "nogroup") {
          this.$vs.notify({
time: 7000,
            color: "danger",
            title: `Please save your root location zone first`
          });
          return false;
        } else {
          this.popupActive = true;
        }
      } else {
        if (Number.isInteger(+selectedNodes)) {
          this.popupActive = true;
        } else if (
          !selectedNodes ||
          (items.length == 1 && items[0].id === "nogroup")
        ) {
          this.popupActive = true;
        } else if (selectedNodes !== "nogroup") {
          this.$vs.notify({
time: 7000,
            color: "danger",
            title: `Please save location zone first`
          });
        }
      }
    }
  },
  watch: {
    access_groups() {
      this.filteredGroups = JSON.parse(JSON.stringify(this.access_groups));
    },
    activeTab(val) {
      localStorage.setItem("isGroupOrZone", val);

      let sort = JSON.parse(JSON.stringify(this.zoneItems));

      if (sort.length) {
        if (val == 0) {
          this.field.dataSource = [];
          this.$vs.loading({
            type: "corners"
          });

          sort.sort(function(a, b) {
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

          setTimeout(() => {
            this.field.dataSource = treeData(sort);

            this.$vs.loading.close();
          }, 0);
        }
      }
    }
  },
  created() {
    if (!moduleAccessPointGroup.isRegistered) {
      this.$store.registerModule("accessPointGroup", moduleAccessPointGroup);
      moduleAccessPointGroup.isRegistered = true;
    }

    this.access_zones = [];
    const groupPermissions = pagePermissions(this.groupPermissions);
    const zonePermissions = pagePermissions(this.zonePermissions);
    if (this.zonePermissions.addItem) {
      this.menuItems.push({ text: "Create" });
    }
    if (this.zonePermissions.destroyItem) {
      this.menuItems.push({ text: "Delete" });
    }
    this.show_zones = zonePermissions == true ? true : false;
    this.show_group = groupPermissions == true ? true : false;

    if (groupPermissions != true && zonePermissions != true) {
      this.$vs.notify({
time: 7000,
        color: "danger",
        title: `You haven't access to enter to ${this.$route.name}`
      });
      setTimeout(() => {
        this.$router.push(zonePermissions).catch(() => {});
      }, 10);
      return false;
    }
    this.initTree();

    this.$store
      .dispatch("accessPointGroup/fetchAccessPointGroups")
      .then(res => {
        if (this.access_groups.length) {
          this.openRule(this.access_groups[0]);
        }
        this.filteredGroups = JSON.parse(JSON.stringify(this.access_groups));
      });

    if (
      localStorage.getItem("isGroupOrZone") &&
      localStorage.getItem("isGroupOrZone") == 1
    ) {
      this.activeTab = 1;
    }
  },
  computed: {
    access_groups() {
      return this.$store.state.accessPointGroup
        ? this.$store.state.accessPointGroup.groups
        : [];
    },
    access_groups_table() {
      let groups = [];
      this.access_groups.map(r => {
        groups.push({
          id: r.id,
          name: r.name,
          description: r.description
        });
      });

      return groups;
    },
    groupPermissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)["AccessPointGroup"]
          ? JSON.parse(localStorage.permissions)["AccessPointGroup"].actions
          : null
        : null;
    },
    zonePermissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)["AccessPointZone"]
          ? JSON.parse(localStorage.permissions)["AccessPointZone"].actions
          : null
        : null;
    },
    zoneItems() {
      return this.$store.state.accessPointGroup.zones;
    },
    activeZone() {
      return this.$store.state.accessPointGroup.active_zone;
    }
  },
  components: {
    TableContext,
    createComponent,
    updateComponent,
    CreateGroupPopup,
    CreatePointZone,
    Table
  }
};
</script>

<style lang="scss" scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
.zone_row {
  .new_rr {
    margin-top: 10px;
  }
}
.group_zone_page {
  .loc_zone {
    margin-top: 15px;
  }
}

.gr_list {
  position: relative;
  // top: 10px;
  z-index: 1;
}

.grop_list {
  .inner_block {
    height: 100%;
    .group_info_bl {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
  .miss_ac_tbl {
    margin-bottom: auto;
  }
}

.group_zone_page {
  .inner_block {
    padding-bottom: 15px;
    height: 100%;
  }

  .list_menu {
    list-style-type: none;
    margin: 0;
    padding: 25px 10px;
    border-right: 1px solid slategray;
  }

  .list_menu li {
    margin-bottom: 15px;
  }

  .list_menu a {
    text-decoration: blink;
    display: flex;
    align-items: center;
  }

  .list_menu span {
    background: #00acee;
    color: white;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 12px;
    line-height: 1.33em;
    border-radius: 3px;
  }

  .block_account {
    width: 100%;
    padding-right: 15px;
    margin: 0 auto;
  }

  .row_block.zone_row {
    box-shadow: unset;
    padding-left: 0;
    // padding-bottom: 0;
  }

  .row_block {
    display: flex;
    border-radius: 5px;
    padding: 10px;
    margin: 0 -15px;
    background-color: white;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .right_block {
    flex: 0 0 75%;
    max-width: 70%;
    padding: 0 15px;
    margin-top: 5px;
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

  .right_block,
  .left_block {
    min-height: 300px;
  }
}

.miss_ac_tbl {
  .vs-con-tbody.vs-table--tbody {
    max-height: 300px;
  }
}

.new_rr {
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

.cardGroup_search {
  padding: 10px 28px;
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.add_bloc {
  margin-right: 10px;
}
</style>

<style lang="scss">
.list_tbl_search {
  .con-input-search.vs-table--search {
    width: 100%;
    margin: 0 0 0 80px;
    max-width: 100%;
  }

  input {
    width: 100%;
  }
}

.grop_list {
  .access_left_table {
    margin-top: 30px;
  }
  .gr_list_actions {
    display: flex;
    .con-input-search.vs-table--search {
      margin-right: 0;
    }
    .cardGroup_searchss {
      padding: 10px 28px;
      font-size: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    .cardGroup_search_parentss {
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
  }
}

.loc_zone_card {
  .con-tab.vs-tabs--content {
    padding-bottom: 0 !important;
  }
}

.loc_zone_card {
  .vx-card__body {
    padding-bottom: 0 !important;
  }
}
</style>
