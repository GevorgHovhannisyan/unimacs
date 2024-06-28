<template>
  <div>
    <div class="vx-card p-6">
      <vs-popup class="holamundo" title="Create Schedule" :active.sync="popupActive">
        <div class="vx-row schedule_popup_inner">
          <div class="vx-col w-full">
            <vs-input label="Name" class="w-full mb-3" name="name" v-model="timeframe.name" v-validate="'required'" />
          </div>
          <div class="vx-col w-full">
            <vs-input v-model="timeframe.description" label="Description" class="w-full mb-3" name="description"
              v-validate="'required'" />
          </div>
          <div class="vx-col w-full mb-3">
            <label for="" class="vs-input--label">Schedule Type</label>
            <v-select v-model="timeframe.type" :options="types" name="status" class="w-full select_padding acu_sel"
              placeholder="Schedule Type" :reduce="type => type.label" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
          </div>
          <div class="vx-col w-full" style="display: flex; flex-direction: row-reverse">
            <vs-button class="mr-5 margin_top unimacs_button" @click.once="createTimeFrame" :key="buttonKey">
              Submit
            </vs-button>
          </div>
        </div>
      </vs-popup>
      <div class="vx-row">
        <div class="vx-col md:w-1/3 bord">
          <div class="tree_block">
            <div class="vs-row new_rr">
              <div>
                <vs-button class="ml-2 create_new unimacs_button unimacs_add_new_btn"
                  @click.prevent="checkScheduleResource" :disabled="!permissions.addItem">
                  <feather-icon icon="PlusIcon" svgClasses="h-4 w-4 mr-1" />Add
                  New
                </vs-button>
              </div>
              <div class="
                  con-input-search
                  vs-table--search
                  cardGroup_search_parents
                ">
                <input type="text" class="input-search vs-table--search-input cardGroup_search" v-model="searchText"
                  @input="treeSearch($event)" /><i class="vs-icon notranslate icon-scale material-icons null">search</i>
              </div>
            </div>

            <div v-if="field.dataSource.length">
              <div class="container-fluid mt-3">
                <ejs-treeview id="schedule_tree_view" :nodeSelected="nodeSelected" :nodeClicked="nodeclicked"
                  :fields="field">
                  <ejs-contextmenu id="schedule_context" target="#schedule_tree_view" :items="contextMenuItems"
                    :beforeOpen="beforeopen" :select="menuclick"></ejs-contextmenu>
                </ejs-treeview>
              </div>
            </div>
          </div>
        </div>
        <div class="vx-col md:w-2/3 inner_page scedule_inn" v-if="currComponent">
          <keep-alive>
            <transition>
              <component :is="currComponent" :propData="editData" @deleteTime="deleteTime($event)"></component>
            </transition>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@grapecity/wijmo.styles/wijmo.css";
import "@grapecity/wijmo.vue2.input";
import "@grapecity/wijmo.vue2.nav";

import moduleSchedule from "@/store/schedule/moduleSchedule.js";

import daily from "./daily/DailyParent";
import dailyInner from "./daily/DailyInner.vue";

import weekly from "./weekly/WeeklyParent.vue";
import weeklyInner from "./weekly/WeeklyInners.vue";

import flexitime from "./flexitime/FlexiParent.vue";
import flexitimeInner from "./flexitime/FlexiInner.vue";

import ordinal from "./ordinal/OrdinalParent.vue";
import ordinalInner from "./ordinal/OrdinalInner.vue";

import specific from "./specefic/SpeceficParent.vue";
import specificInner from "./specefic/SpeceficInners.vue";
import vSelect from "vue-select";

import { scheduleTreeData } from "@/functions/scheduleTreeData";

export default {
  components: {
    daily,
    dailyInner,
    weekly,
    weeklyInner,
    specific,
    specificInner,
    flexitime,
    flexitimeInner,
    vSelect,
    ordinal,
    ordinalInner
  },
  data() {
    return {
      buttonKey: 1,
      items: [],
      menuItems: [
        {
          value: "copy",
          name: "Copy"
        },
        {
          value: "paste",
          name: "Paste"
        }
      ],
      contextMenuItems: [
        { text: "Delete" },
        { text: "Add Day" },
        { text: "Copy" },
        { text: "Paste" }
      ],

      wjTreeViewControl: null,
      tree: [],

      toolbarOptions: ["Search"],
      timeframe: {
        name: null,
        description: null,
        type: null
      },
      editData: {},
      currComponent: null,
      index: 1,
      deleteItemId: null,
      deletedItem: null,
      copyObject: {},
      types: [],
      popupActive: false,
      searchText: "",
      isCheckbox: false,
      weekDays: this.$store.state.weekDays,
      flexitimeId: 1,
      week_data: this.$store.state.week_data,
      features:
        localStorage.features && JSON.parse(localStorage.features).Schedule
          ? JSON.parse(localStorage.features).Schedule
          : null,
      treeItems: [],
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
        htmlAttributes: "hasAttribute"
      },
      savedScheduleList: []
    };
  },
  computed: {
    schedules() {
      return this.$store.state.schedule.schedules;
    },
    permissions() {
      return localStorage.permissions
        ? JSON.parse(localStorage.permissions)[this.$route.name].actions
        : null;
    }
  },
  watch: {
    popupActive(val) {
      console.log("popupActive", val, this.buttonKey);
      if (!val) {
        this.timeframe.name = null;
        this.timeframe.description = null;
        this.timeframe.type = null;
       
      }else{
        this.buttonKey++;
      }
    }
  },
  methods: {
    nodeclicked(args) {
      let treeObj = document.getElementById("schedule_tree_view")
        .ej2_instances[0];
      const item = treeObj.getNode(args.node);
      const treeData = treeObj.getTreeData();
      const findItem = treeData.find(d => d.id == item.id);

      const real_data = this.treeItems.find(d => d.id == item.id);

      if (findItem && findItem.pid) {
        this.currComponent = findItem.type + "Inner";
        this.editData = { ...findItem };
      } else {
        this.currComponent = findItem ? findItem.type : real_data.type;
        this.editData = findItem ? { ...findItem } : { ...real_data };
      }
    },
    beforeopen: function (args) {
      let treevalidate = document.getElementById("schedule_tree_view")
        .ej2_instances[0];
      let contentmenutree = document.getElementById("schedule_context")
        .ej2_instances[0];

      const path = args.event.path || (args.event.composedPath && args.event.composedPath());

      const uid = path[1].getAttribute("data-uid");
      treevalidate.selectedNodes = [uid];

      let targetNodeId = treevalidate.selectedNodes[0];

      const treeData = treevalidate.getTreeData();
      const findItem = treeData.find(d => d.id == targetNodeId);

      const real_data = this.treeItems.find(d => d.id == targetNodeId);

      const type = findItem ? findItem.type : real_data.type;

      switch (type) {
        case "daily":
          if (findItem && findItem.pid) {
            contentmenutree.enableItems(["Copy"], true);
            contentmenutree.enableItems(["Paste"], true);
            contentmenutree.enableItems(["Add Day"], false);
            contentmenutree.enableItems(["Delete"], false);
          } else {
            contentmenutree.enableItems(["Copy"], false);
            contentmenutree.enableItems(["Paste"], false);
            contentmenutree.enableItems(["Add Day"], false);
            contentmenutree.enableItems(["Delete"], true);
          }
          break;
        case "weekly":
          if (findItem && findItem.pid) {
            contentmenutree.enableItems(["Copy"], true);
            contentmenutree.enableItems(["Paste"], true);
            contentmenutree.enableItems(["Add Day"], false);
            contentmenutree.enableItems(["Delete"], false);
          } else {
            contentmenutree.enableItems(["Copy"], false);
            contentmenutree.enableItems(["Paste"], false);
            contentmenutree.enableItems(["Add Day"], false);
            contentmenutree.enableItems(["Delete"], true);
          }
          break;
        case "specific":
          if (findItem && findItem.pid) {
            contentmenutree.enableItems(["Copy"], true);
            contentmenutree.enableItems(["Paste"], true);
            contentmenutree.enableItems(["Add Day"], false);
            contentmenutree.enableItems(["Delete"], true);
          } else {
            contentmenutree.enableItems(["Copy"], false);
            contentmenutree.enableItems(["Paste"], false);
            contentmenutree.enableItems(["Add Day"], true);
            contentmenutree.enableItems(["Delete"], true);
          }
          break;
        case "ordinal":
          if (findItem && findItem.pid) {
            contentmenutree.enableItems(["Copy"], true);
            contentmenutree.enableItems(["Paste"], true);
            contentmenutree.enableItems(["Add Day"], false);
            contentmenutree.enableItems(["Delete"], true);
          } else {
            contentmenutree.enableItems(["Copy"], false);
            contentmenutree.enableItems(["Paste"], false);
            contentmenutree.enableItems(["Add Day"], true);
            contentmenutree.enableItems(["Delete"], true);
          }
          break;
        case "flexitime":
          if (findItem && findItem.pid) {
            contentmenutree.enableItems(["Copy"], true);
            contentmenutree.enableItems(["Paste"], true);
            contentmenutree.enableItems(["Add Day"], false);
            contentmenutree.enableItems(["Delete"], true);
          } else {
            contentmenutree.enableItems(["Copy"], false);
            contentmenutree.enableItems(["Paste"], false);
            contentmenutree.enableItems(["Add Day"], true);
            contentmenutree.enableItems(["Delete"], true);
          }
          break;
        default:
          break;
      }
    },
    nodeSelected(event) {
      const data = event.nodeData;
    },
    menuclick: function (args) {
      let treevalidate = document.getElementById("schedule_tree_view")
        .ej2_instances[0];
      let targetNodeId = treevalidate.selectedNodes[0];
      let treeNodes = treevalidate.getTreeData();
      const findItem = treeNodes.find(d => d.id == targetNodeId);

      const real_data = this.treeItems.find(d => d.id == targetNodeId);

      if (args.item.text == "Copy") {
        let name;

        if (findItem.type == "flexitime") {
          name = findItem.name.split("-", 2)[1];
        } else if (findItem.type == "specific" || findItem.type == "ordinal") {
          name = findItem.name.split(".")[1];
        } else if (findItem.type == "weekly") {
          name = this.week_data[findItem.name];
        } else if (findItem.type == "daily") {
          name = 1;
        } else {
          name = findItem.name;
        }

        this.copyObject.copy_id = findItem.pid;
        this.copyObject.copy_name = name;
      }

      if (args.item.text == "Paste") {
        let name;

        if (findItem.type == "flexitime") {
          name = findItem.name.split("-", 2)[1];
        } else if (findItem.type == "specific" || findItem.type == "ordinal") {
          name = findItem.name.split(".")[1];
        } else if (findItem.type == "weekly") {
          name = this.week_data[findItem.name];
        } else if (findItem.type == "daily") {
          name = 1;
        } else {
          name = findItem.name;
        }

        this.$vs.loading({
          type: "corners"
        });

        this.copyObject.paste_id = findItem.pid;
        this.copyObject.paste_name = name;

        this.$store
          .dispatch("schedule/copyPaste", this.copyObject)
          .then(res => {
            this.$vs.loading.close();
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Timeframe cloned"
            });
            this.$root.$emit("fetchTime");
            this.copyObject.paste_id = null;
            this.copyObject.paste_name = null;
          })
          .catch(err => {
            this.$vs.loading.close();
          });
      }

      if (args.item.text == "Delete") {
        this.deletedItem = findItem;
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirm Delete`,
          text: `Do You want to delete ${findItem ? findItem.name : real_data.name
            } timeline `,
          accept: this.deletedItem.pid
            ? this.deleteNode
            : this.deleteParentNode,
          acceptText: "Delete"
        });
      }
      if (args.item.text == "Add Day") {
        if (findItem.type == "ordinal") {
          const childs = treeNodes.filter(c => c.pid == findItem.id);

          if (childs.length >= 7) {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: `Timeframe limit has been reached`
            });
            return false;
          }
        }

        if (findItem.type == "flexitime") {
          let idOfFlexi = 1;

          const hasChildren = treeNodes.filter(
            t => t.type === "flexitime" && t.pid && t.pid == targetNodeId
          );
          if (hasChildren && hasChildren.length) {
            let highest = hasChildren.sort(
              (a, b) => b.name.split("-", 2)[1] - a.name.split("-", 2)[1]
            )[0];

            if (highest) {
              idOfFlexi = +highest.name.split("-", 2)[1] + 1;
            } else {
              idOfFlexi++;
            }
          }

          let flexDay = {
            id: `${findItem.id}_${idOfFlexi}`,
            name: `flex-${idOfFlexi}`,
            original_name: idOfFlexi,
            type: "flexitime",
            pid: findItem.id
          };

          treevalidate.addNodes([flexDay], findItem.id, null);

          const obj = {
            name: idOfFlexi,
            schedule: findItem.id,
            start: "00:00",
            end: "00:00"
          };

          this.$store
            .dispatch("schedule/createTimeFrame", obj)
            .then(res => { })
            .catch(err => {
              this.$vs.loading.close();
            });

          this.editData = { ...flexDay };
          this.currComponent = "flexitimeInner";
        }

        if (findItem.type == "specific" || findItem.type == "ordinal") {
          let d = new Date(),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

          if (month.length < 2) month = "0" + month;
          if (day.length < 2) day = "0" + day;
          const correctDate = [year, month, day].join("-");
          const hasChildren = treeNodes.filter(
            t =>
              (t.type === "specific" || t.type === "ordinal") &&
              t.pid &&
              t.pid == targetNodeId
          );

          let idCount = 1;
          let high_day = null;

          if (hasChildren && hasChildren.length) {
            const dates = hasChildren.map(
              item => new Date(item.name.split(".", 2)[1])
            );

            const high_date = new Date(Math.max.apply(null, dates));

            high_day = this.$moment(high_date)
              .add(1, "days")
              .format("yyyy-MM-DD");

            let highest = hasChildren.sort(
              (a, b) =>
                +b.name.split(".", 1)[0].slice(1) -
                +a.name.split(".", 1)[0].slice(1)
            )[0];

            if (highest) {
              idCount = +highest.name.split(".", 1)[0].slice(1) + 1;
            } else {
              idCount++;
            }
          }

          let specDay = {
            id: `${findItem.id}_${idCount}`,
            original_name: high_day ? high_day : correctDate,
            name: `D${idCount}.${high_day ? high_day : correctDate}`,
            type: findItem.type,
            pid: findItem.id
          };

          treevalidate.addNodes([specDay], null, null);

          this.editData = { ...specDay };

          this.currComponent = `${findItem.type}Inner`;
        }
      }
    },

    checkScheduleResource() {
      this.$store
        .dispatch("checkResource", { resource: "Schedule" })
        .then(res => {
          if (res.data.success) {
            this.popupActive = true;
          } else {
            this.$vs.notify({
              time: 7000,
              color: "danger",
              title: "Schedule resource limit has been reached"
            });
          }
        });
    },
    treeSearch(event) {
      this.field.dataSource = [];
      this.searchArr = [];

      setTimeout(() => {
        if (this.treeItems.length) {
          // this.searchArr = [];
          let lowSearch = this.searchText.toLowerCase();

          if (lowSearch) {

            const matched = this.saveForSearch.filter(val =>
              val.name.toLowerCase().includes(lowSearch)
            );
            if (matched.length) {
              this.searchArr = JSON.parse(JSON.stringify(matched));
              for (let i = 0; i < matched.length; i++) {
                if (matched[i].type === 'flexitime') {
                  if (matched[i].pid) {
                    const findItem = this.saveForSearch.find(
                      s => +s.id == +matched[i].pid
                    );
                    const findParent = this.searchArr.find(s => s.id == findItem.id)
                    if (!findParent) {
                      this.searchArr.push(findItem);
                    }
                  } else {
                    const timeframes_filtered = []
                    const filterItems = this.saveForSearch.filter(
                      s => +s.pid == +matched[i].id
                    );
                    if (filterItems.length) {
                      for (let i = 0; i < filterItems.length; i++) {
                        const findParent = this.searchArr.find(s => s.id == filterItems[i].id)
                        if (!findParent) {
                          timeframes_filtered.push(filterItems[i])
                        }
                      }
                    }
                    this.searchArr = [...this.searchArr, ...timeframes_filtered];
                  }

                } else {
                  if (matched[i].pid) {
                    const findItem = this.saveForSearch.find(
                      s => +s.id == +matched[i].pid
                    );


                    this.searchArr.push(findItem);
                  } else {
                    const filterItems = this.saveForSearch.filter(
                      s => +s.pid == +matched[i].id
                    );
                    this.searchArr = [...this.searchArr, ...filterItems];
                  }
                }
              }
            }
            if (this.searchArr.length) {
              this.searchArr[0].expanded = true;
            }
            this.field.dataSource = this.searchArr;
          } else {
            this.fetchScheduleTree()
          }
        }
      }, 100);
    },
    sortData(items) {
      let sort = JSON.parse(JSON.stringify(items));

      sort.sort(function (a, b) {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
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
    deleteTime(event) {
      let parent = this.wjTreeViewControl.selectedNode.parentNode;
      let arr = parent
        ? parent.dataItem[this.wjTreeViewControl.childItemsPath]
        : this.wjTreeViewControl.itemsSource;

      let index = arr.indexOf(this.wjTreeViewControl.selectedItem);

      arr.splice(index, 1);

      this.wjTreeViewControl.loadTree();

      this.currComponent = null;
    },
    itemClicked(event) {
      const clickedItem = event.selectedItem;

      if (clickedItem.parentId) {
        this.currComponent = clickedItem.type + "Inner";
        this.editData = { ...clickedItem };
      } else {
        this.currComponent = clickedItem.type;
        this.editData = { ...clickedItem };
      }
    },
    menuItemClick() {
      const selectedItem = this.wjTreeViewControl.selectedNode.dataItem;
      const actionType = this.menu.selectedValue;
      let dayIndex = this.items.findIndex(d => d.id == selectedItem.id);

      if (actionType == "add") {
        if (selectedItem.type == "flexitime") {
          let idOfFlexi = 1;
          if (selectedItem.children && selectedItem.children.length) {
            let highest = selectedItem.children.sort(
              (a, b) => b.name.split("-", 2)[1] - a.name.split("-", 2)[1]
            )[0];

            if (highest) {
              idOfFlexi = +highest.name.split("-", 2)[1] + 1;
            } else {
              idOfFlexi++;
            }
          }

          let flexDay = {
            id: `${selectedItem.id}_${idOfFlexi}`,
            name: `flex-${idOfFlexi}`,
            original_name: idOfFlexi,
            type: "flexitime",
            parentId: selectedItem.id
          };
          let node = this.wjTreeViewControl.selectedNode;
          if (node) {
            let index = node.nodes ? node.nodes.length : 0;
            this.wjTreeViewControl.selectedNode = node.addChildNode(
              index,
              flexDay
            );
          }

          const obj = {
            name: idOfFlexi,
            schedule: selectedItem.id,
            start: "00:00",
            end: "00:00"
          };

          this.$store
            .dispatch("schedule/createTimeFrame", obj)
            .then(res => { })
            .catch(err => {
              this.$vs.loading.close();
            });

          this.editData = { ...flexDay };
          this.currComponent = "flexitimeInner";
        }

        if (selectedItem.type == "specific" || selectedItem.type == "ordinal") {
          let d = new Date(),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

          if (month.length < 2) month = "0" + month;
          if (day.length < 2) day = "0" + day;

          const correctDate = [year, month, day].join("-");

          let idCount = 1;
          let high_day = null;

          if (selectedItem.children && selectedItem.children.length) {
            const dates = selectedItem.children.map(
              item => new Date(item.name.split(".", 2)[1])
            );

            const high_date = new Date(Math.max.apply(null, dates));

            high_day = this.$moment(high_date)
              .add(1, "days")
              .format("yyyy-MM-DD");

            let highest = selectedItem.children.sort(
              (a, b) =>
                +b.name.split(".", 1)[0].slice(1) -
                +a.name.split(".", 1)[0].slice(1)
            )[0];

            if (highest) {
              idCount = +highest.name.split(".", 1)[0].slice(1) + 1;
            } else {
              idCount++;
            }
          }

          let specDay = {
            id: `${selectedItem.id}_${idCount}`,
            original_name: high_day ? high_day : correctDate,
            name: `D${idCount}.${high_day ? high_day : correctDate}`,
            type: selectedItem.type,
            parentId: selectedItem.id
          };
          let node = this.wjTreeViewControl.selectedNode;
          if (node) {
            let index = node.nodes ? node.nodes.length : 0;
            this.wjTreeViewControl.selectedNode = node.addChildNode(
              index,
              specDay
            );
          }
          this.editData = { ...specDay };
          // this.currComponent = "specificInner";
          this.currComponent = `${selectedItem.type}Inner`;
        }
      }
      if (actionType == "delete") {
        this.deletedItem = selectedItem;
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirm Delete`,
          text: `Do You want to delete ${selectedItem.name} timeline `,
          accept: this.deletedItem.parentId
            ? this.deleteNode
            : this.deleteParentNode,
          acceptText: "Delete"
        });
      }
      if (actionType == "copy") {
        let name;

        if (selectedItem.type == "flexitime") {
          name = selectedItem.name.split("-", 2)[1];
        } else if (
          selectedItem.type == "specific" ||
          selectedItem.type == "ordinal"
        ) {
          name = selectedItem.name.split(".")[1];
        } else if (selectedItem.type == "weekly") {
          name = this.week_data[selectedItem.name];
        } else if (selectedItem.type == "daily") {
          name = 1;
        } else {
          name = selectedItem.name;
        }
        this.copyObject.copy_id = selectedItem.parentId;
        this.copyObject.copy_name = name;
      }
      if (actionType == "paste") {
        let name;

        if (selectedItem.type == "flexitime") {
          name = selectedItem.name.split("-", 2)[1];
        } else if (
          selectedItem.type == "specific" ||
          selectedItem.type == "ordinal"
        ) {
          name = selectedItem.name.split(".")[1];
        } else if (selectedItem.type == "weekly") {
          name = this.week_data[selectedItem.name];
        } else if (selectedItem.type == "daily") {
          name = 1;
        } else {
          name = selectedItem.name;
        }

        this.$vs.loading({
          type: "corners"
        });

        this.copyObject.paste_id = selectedItem.parentId;
        this.copyObject.paste_name = name;

        this.$store
          .dispatch("schedule/copyPaste", this.copyObject)
          .then(res => {
            this.$vs.loading.close();
            this.$vs.notify({
              time: 7000,
              color: "success",
              title: "Timeframe cloned"
            });
            this.$root.$emit("fetchTime");

            // this.copyObject = {};

            this.copyObject.paste_id = null;
            this.copyObject.paste_name = null;
          })
          .catch(err => {
            this.$vs.loading.close();
          });
      }
    },
    onCheckedItemsChanged() {
      let items = this.wjTreeViewControl.checkedItems;
    },
    searchFilter() {
      const items = this.field.dataSource.filter(
        item => item.name.indexOf(this.searchText) !== -1
      );
      this.treeData(items);
    },
    initValues() {
      this.timeframe = {
        name: null,
        description: null,
        type: null
      };
    },
    createTimeFrame() {
      const scheduleData = {
        name: this.timeframe.name,
        description: this.timeframe.description,
        type: this.timeframe.type
      };

      if (this.timeframe.type === "ordinal") {
        scheduleData.repeat_month = 1;
      }

      let treevalidate = document.getElementById("schedule_tree_view")
        .ej2_instances[0];

      this.$store
        .dispatch("schedule/createSchedule", scheduleData)
        .then(res => {
          this.treeItems.push(res.data);
          // this.isCheckbox = true;
          let nullable = treevalidate.getNode("nogroup");
          if (nullable) {
            treevalidate.removeNodes(["nogroup"]);
          }
          if (res.data.type == "daily") {
            let dayOption = {
              name: res.data.name,
              id: res.data.id,
              type: res.data.type
            };

            let d1 = {
              name: "Day-1",
              id: `${res.data.id}_Day-1`,
              type: "daily",
              pid: res.data.id
            };

            treevalidate.addNodes([dayOption], null, null);
            treevalidate.addNodes([d1], res.data.id, null);
            // this.savedScheduleList.push(dayOption,d1)

          }
          if (res.data.type == "weekly") {
            let weekOption = {
              name: res.data.name,
              id: res.data.id,
              type: res.data.type
            };
            treevalidate.addNodes([weekOption], null, null);
            this.weekDays.forEach(day => {
              let item = {
                id: `id_${day}`,
                name: day,
                pid: res.data.id,
                type: res.data.type
              };
              treevalidate.addNodes([item], res.data.id, null);
              // this.savedScheduleList.push(item)

            });
          }
          if (
            res.data.type == "specific" ||
            res.data.type == "flexitime" ||
            res.data.type == "ordinal"
          ) {
            let specOption = {
              name: res.data.name,
              id: res.data.id,
              type: res.data.type
            };
            treevalidate.addNodes([specOption], null, null);
            this.savedScheduleList.push(specOption)
          }
          setTimeout(() => {
            treevalidate.selectedNodes = [`${res.data.id}`];

            const treeData = treevalidate.getTreeData();
            const findItem = treeData.find(d => d.id == res.data.id);

            const real_data = this.treeItems.find(d => d.id == res.data.id);

            if (findItem && findItem.pid) {
              this.currComponent = findItem.type + "Inner";
              this.editData = { ...findItem };
            } else {
              this.currComponent = findItem ? findItem.type : real_data.type;
              this.editData = findItem ? { ...findItem } : { ...real_data };
            }
          }, 100);

          this.popupActive = false;
          this.$vs.loading.close();

          this.initValues();
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    },
    checkDateTime(start, end) {
      let regex = new RegExp(":", "g");
      if (
        parseInt(start.replace(regex, ""), 10) <
        parseInt(end.replace(regex, ""), 10) ||
        (start == "00:00" && end == "00:00")
      ) {
        return true;
      } else {
        return false;
      }
    },
    deleteParentNode() {
      let treevalidate = document.getElementById("schedule_tree_view")
        .ej2_instances[0];

      this.$vs.loading({
        type: "corners"
      });
      this.$store
        .dispatch("schedule/deleteSchedule", { id: this.deletedItem.id })
        .then(res => {
          // if (this.wjTreeViewControl.selectedItem) {
          //   let parent = this.wjTreeViewControl.selectedNode.parentNode;
          //   let arr = parent
          //     ? parent.dataItem[this.wjTreeViewControl.childItemsPath]
          //     : this.wjTreeViewControl.itemsSource;
          //   let index = arr.indexOf(this.wjTreeViewControl.selectedItem);
          //   arr.splice(index, 1);
          //   this.wjTreeViewControl.loadTree();
          // }
          this.currComponent = null;

          treevalidate.removeNodes([`${this.deletedItem.id}`]);

          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Schedule deleted"
          });

          this.saveForSearch = JSON.parse(JSON.stringify(this.field.dataSource))
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    },
    deleteNode() {
      // this.$vs.loading({
      //   type: "corners",
      // });
      let treevalidate = document.getElementById("schedule_tree_view")
        .ej2_instances[0];
      let treeNodes = treevalidate.getTreeData();

      const obj = {
        schedule: +this.deletedItem.pid
      };
      let deleted = this.deletedItem;

      if (this.deletedItem.type == "flexitime") {
        const hasChildren = treeNodes.filter(
          t => t.type === "flexitime" && t.pid && t.pid == this.deletedItem.pid
        );
        let highest = hasChildren.sort(
          (a, b) => +b.original_name - +a.original_name
        )[0];
        deleted = highest;
        obj.schedule = +this.deletedItem.pid;
        obj.name = highest.original_name;
      } else {
        obj.name = this.deletedItem.data
          ? this.deletedItem.data.timeframe_name
          : this.deletedItem.original_name;
      }

      this.$vs.loading.close();

      this.deleteFunc(obj, deleted);
    },
    deleteFunc(object, deletedItem) {
      let treevalidate = document.getElementById("schedule_tree_view")
        .ej2_instances[0];
      this.$store
        .dispatch("schedule/fetchTimeFrame", {
          pid: object.schedule,
          name: object.name
        })
        .then(res => {
          if (res.data.length) {
            this.$store
              .dispatch("schedule/deleteTimeFrameByName", object)
              .then(res => {
                treevalidate.removeNodes([deletedItem.id]);

                this.currComponent = null;

                this.$vs.notify({
                  time: 7000,
                  color: "success",
                  title: "Timeframe deleted"
                });
                this.$vs.loading.close();
              })
              .catch(err => {
                this.$vs.loading.close();
              });
          } else {
            treevalidate.removeNodes([deletedItem.id]);
            this.currComponent = null;
          }
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    },
    changeFlexiScheduleName(time, data) {
      let saveData = this.wjTreeViewControl.selectedNode.dataItem;
      saveData.name = `flex-${time[0].name}`;
      saveData.original_name = time[0].name;
      this.wjTreeViewControl.selectedNode.refresh(saveData);
      this.editData = this.wjTreeViewControl.selectedNode.dataItem;
    },
    changeScheduleName() {
      this.field.dataSource = [];

      this.fetchScheduleTree();
    },
    correctExpandedItems(item) {
      let filterArr = [...this.field.dataSource];

      this.field.dataSource = [];

      let findItem = this.savedScheduleList.find(i => i.id == item.id);

      const real_data = this.treeItems.find(d => d.id == item.id);
      findItem.expanded = true;
      findItem.selected = true;
      findItem.name = item.name;

      setTimeout(() => {
        this.field.dataSource = this.savedScheduleList;
      }, 0);

      if (findItem && findItem.pid) {
        this.currComponent = findItem.type + "Inner";
        this.editData = { ...findItem };
      } else {
        this.currComponent = findItem ? findItem.type : real_data.type;

        this.editData = real_data ? { ...real_data } : { ...findItem };
      }

      setTimeout(() => {
        let treevalidate = document.getElementById("schedule_tree_view")
          .ej2_instances[0];

        treevalidate.selectedNodes = [`${item.id}`];
      }, 300);
    },
    updScheduleInfo(payload, type) {
      this.$vs.loading({
        type: "corners"
      });

      this.$store
        .dispatch("schedule/updateScheduleInfo", payload)
        .then(res => {
          this.$vs.loading.close();

          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Schedule updated"
          });
          this.field.dataSource = [];
          this.fetchScheduleTree();
          console.log(123123);
          this.correctExpandedItems(payload);
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    },
    deleteTimeFrame(payload) {
      this.$vs.loading({
        type: "corners"
      });

      this.$store
        .dispatch("schedule/deleteTimeFrame", payload)
        .then(res => {
          this.$vs.loading.close();
          this.$vs.notify({
            time: 7000,
            color: "success",
            title: "Schedule deleted"
          });
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    },
    correctData(array) {
      const list = [...array];

      let map = {},
        node,
        roots = [],
        i;

      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
      }

      for (i = 0; i < list.length; i += 1) {
        node = list[i];

        if (list[i].type == "flexitime" && list[i].parentId) {
          list[i].original_name = list[i].name;
          list[i].name = `flex-${list[i].name}`;
        }

        if (list[i].type == "weekly") {
          this.weekDays.forEach(weekDay => {
            list[i].children.push({
              id: `${list[i].id}_${weekDay}`,
              name: weekDay,
              type: "weekly",
              parentId: list[i].id
            });
          });
        }
        if (node.parentId) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.parentId]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      this.items = roots;
    },
    filteredTree(list, bool) {
      const weeks = [];

      for (let i = 0; i < list.length; i++) {
        if (list[i].type == "flexitime" && list[i].pid) {
          list[i].original_name = list[i].name;
          list[i].name = `flex-${list[i].name}`;
        }

        if (list[i].type == "weekly") {
          list[i].hasChild = true;
          this.weekDays.forEach(weekDay => {
            weeks.push({
              id: `${list[i].id}_${weekDay}`,
              name: weekDay,
              type: "weekly",
              pid: list[i].id
            });
          });
        }
      }
      const arr = list.concat(weeks);

      this.savedScheduleList = arr;


      this.field.dataSource = arr;
      this.saveForSearch = JSON.parse(JSON.stringify(this.field.dataSource));
      const real_data = this.treeItems[0];
      if (bool) {
        setTimeout(() => {
          let treevalidate = document.getElementById("schedule_tree_view")
            .ej2_instances[0];

          treevalidate.selectedNodes = [`${real_data.id}`];
        }, 150);

      }

      if (bool) {
        if (real_data && real_data.pid) {
          this.currComponent = real_data.type + "Inner";
          this.editData = { ...real_data };
        } else {
          this.currComponent = real_data.type;
          this.editData = real_data;
        }
      }
    },
    fetchScheduleTree(bool) {
      this.$store
        .dispatch("schedule/fetchScheduleTree")
        .then(res => {
          this.treeItems = res.data;
          if (res.data.length) {
            // this.isCheckbox = true;

            // this.buildTreeData(res.data);
            const array = scheduleTreeData(res.data);

            if (array.length) {
              this.filteredTree(array, bool);
            }

            const dayType = res.data.filter(
              d => d.type == "daily" && !d.timeframe_name
            );

            if (dayType && dayType.length) {
              dayType.forEach(day => {
                let dayIndex = this.items.findIndex(d => d.id == day.id);
                this.items[dayIndex].children.push({
                  id: `${day.id}_Day-1`,
                  name: "Day-1",
                  parentId: day.id,
                  type: "daily",
                  data: day
                });
              });
            }
          } else {
            // this.isCheckbox = false;
            this.field.dataSource.push({
              name: "No Schedule",
              id: "nogroup"
            });
            this.items = [{ id: null, name: "No schedules" }];
            this.menuItems = [];
          }

          this.$vs.loading.close();
        })
        .catch(err => {
          this.$vs.loading.close();
        });
    }
  },
  created() {
    this.$store.dispatch("pagePermissions", this.permissions).then(res => {
      if (res != true) {
        this.$vs.notify({
          time: 7000,
          color: "danger",
          title: `You haven't access to enter to ${this.$route.name}`
        });
        setTimeout(() => {
          this.$router.push("/error-404").catch(() => { });
        }, 100);
        return false;
      }
    });

    if (this.features) {
      let canCreate = [];
      if (this.features.ScheduleDailyWeeklySpecific) {
        canCreate.push(
          { label: "daily" },
          { label: "weekly" },
          { label: "specific" }
        );
      }
      if (this.features.ScheduleFlexitime) {
        canCreate.push({ label: "flexitime" });
      }
      canCreate.push({ label: "ordinal" });
      this.types = canCreate;
    }

    this.$vs.loading({
      type: "corners"
    });
    if (!moduleSchedule.isRegistered) {
      this.$store.registerModule("schedule", moduleSchedule);
      moduleSchedule.isRegistered = true;
    }

    this.fetchScheduleTree(true);

    this.$store
      .dispatch("schedule/fetchSchedules")
      .then(res => {
        this.schedulesOptions = [];
        if (res.data.length) {
          res.data.forEach(schedule => {
            this.schedulesOptions.push({
              id: schedule.id,
              name: schedule.name
            });
          });
        }
        this.$vs.loading.close();
      })
      .catch(err => {
        this.$vs.loading.close();
      });
  }
};
</script>

<style lang="scss" scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";

.new_rr {
  display: flex;
  flex-wrap: nowrap;
}

.cardGroup_search_parents {
  margin-left: 16px;
  flex: 1;
  max-width: unset;

  input {
    width: 100%;
    padding: 12px 30px;
    font-size: 12px;
  }

  i {
    top: 13px;
  }
}

.tree_block {
  flex: 0 0 40%;

  .search_create {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
  }
}

.table_block {
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

.margin_top {
  margin-top: 30px;
}

#contentmenutree {
  padding: 0px;
  font-size: inherit;
}
</style>
