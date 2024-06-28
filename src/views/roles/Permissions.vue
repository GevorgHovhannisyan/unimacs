<template>
  <div>
    <form>
      <div class="myRow">
        <div class="name_block">
          <vs-input
            label="Name"
            placeholder="Name"
            name="name"
            v-model="permName"
            v-validate="'required'"
          />
          <span
            class="text-danger text-sm position"
            v-show="errors.has('name')"
            >{{ errors.first("name") }}</span
          >
          <vs-button class="savesBtn unimacs_button" @click.prevent="save"
            >Save</vs-button
          >
        </div>
      </div>

      <div class="myRow">
        <div class="parentDiv">
          <div class="vx-row">
            <div class="flex items-end px-3">
              <span class="font-medium text-lg leading-none roleBlock"
                >Role permissions</span
              >
            </div>
            <vs-divider />
          </div>
          <div class="myRow">
            <div class="vx-col w-full md:w-1/5 mb-base superPermissions">
              <!-- <vs-checkbox v-model="superRole">Super Admin</vs-checkbox> -->
              <v-select
                v-model="superRole"
                :options="roleOptions"
                @input="updateSuper($event)"
                class="mb-5 w-full select_padding"
                name="role"
                placeholder="Role"
                :reduce="(role) => role.id"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
              />
            </div>
          </div>

          <div class="myRow">
            <div class="control_wrapper">
              <ejs-treeview
                v-if="field.dataSource.length"
                id="treeview"
                :fields="field"
                :showCheckBox="true"
              ></ejs-treeview>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import SlVueTree from "sl-vue-tree";
import vSelect from "vue-select";
import { recurseData } from "../../functions/recourceData";

export default {
  components: { SlVueTree, vSelect },
  data() {
    return {
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
      },
      roleOptions: [
        { id: false, label: "Custom" },
        { id: true, label: "Check all" },
      ],
      roles: [],
      permName: "",
      superRole: false,
      id: 1,
      childids: [],
      saveObject: {},
      object: {},
      array2: [],
    };
  },
  methods: {
    updateSuper(event) {
      var treeObj = document.getElementById("treeview").ej2_instances[0];
      if (this.superRole == true) {
        treeObj.checkAll();
      } else {
        treeObj.uncheckAll();
      }
    },
    generateObject(array) {
      const obj = {};
      const arrlngt = array.length;
      for (let i = 0; i < arrlngt; i++) {
        const element = array[i];
        const name = element.original_name;
        let chIds = [];
        if (!this.childids.includes(element.id)) {
          if (element.hasChild) {
            const childs = this.array2.filter(
              (child) => child.pid === element.id
            );
            chIds = childs.map((it) => it.id);
            if (childs) {
              obj[name] = this.generateObject(childs);
            }
          } else {
            obj[element.original_name] = !!element.isChecked;
          }
          this.childids = this.childids.concat(chIds);
        }
      }
      return obj;
    },
    save() {
      var treeObj = document.getElementById("treeview").ej2_instances[0];
      let data = treeObj.getTreeData();
      this.array2 = data;
      this.object = {};
      this.childids = [];
      this.id = 1;
      this.object = this.generateObject(data);
      const send = JSON.stringify(this.object);
      if (this.permName) {
        this.$http
          .post(
            `roles`,
            {
              permissions: send,
              slug: this.permName,
            },
            { headers: { Authorization: localStorage.token } }
          )
          .then((res) => {
            this.$vs.loading.close();
            this.activeLoading = false;
            this.$router.push("/admins").then((res) => {
              this.$store.commit("user/changeUsersTab", 2);
            });
            this.$root.$emit("change_tab_roles");
          });
      } else {
        this.$vs.notify({
time: 7000,
          color: "danger",
          title: "Role name required",
        });
      }
    },
  },
  created() {
    this.$http
      .get(`access`, {
        headers: { Authorization: localStorage.token },
      })
      .then((res) => {
        let data = res.data;
        this.saveObject = res.data;
        this.id = 1;
        this.field.dataSource = recurseData(data, null, []);
      })
      .catch((error) => {
        this.$vs.loading.close();
      });
  },
};
</script>

<style lang="scss" scoped>
@import url("../../../node_modules/sl-vue-tree/dist/sl-vue-tree-dark.css");

@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";

.sl-vue-tree-root {
  border: none !important;
  background: none !important;
  margin-top: 1.25rem !important;
}
.sl_vue_roles {
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

  .sl-vue-tree-title .edit_drop {
    margin-right: 1.25rem !important;
  }

  .sl-vue-tree-toggle {
    margin-right: 1.25rem !important;
  }

  .edit_drop {
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

  // .actionsIconD {
  //   cursor: pointer;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   padding: 6px;
  //   border: none;
  //   width: 38px;
  //   height: 38px;
  //   background: #ff9890;
  //   border-radius: 50%;
  // }

  // .actionsIconD img {
  //   width: 16px !important;
  //   display: block;
  // }
}

.roleBlock {
  font-size: 26px;
  margin-bottom: 0 !important;
  font-weight: 500;
}

.parentDiv {
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  padding: 20px;
  background: white;
  margin: 0 15px;
}

.parentDiv .vx-card__body {
  padding-left: 10px !important;
  padding-right: 10px !important;
  padding-bottom: 0 !important;
}

.checkboxes .vs-component.con-vs-checkbox {
  margin-bottom: 15px !important;
}

.myRow {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 15px;
}

.modules {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  /* padding: 20px; */
  background: white;
}

.modules .checboxx {
  padding: 20px 20px 0 20px;
}

.modules .checkboxes {
  padding: 5px 20px 10px 20px;
}

.moduleBlocks {
  padding: 15px;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 25%;
  flex: 0 0 25%;
  max-width: 25%;
}

.superPermissions {
  margin-bottom: 0 !important;
}

.name_block {
  width: 100%;
  display: flex;
  margin: auto;
}

.savesBtn {
  height: 36px;
  position: relative;
  top: 25px;
  right: 25px;
  // margin-top: -50px;
}

.name_block .vs-component.vs-con-input-label.vs-input.vs-input-primary {
  width: 23%;
  margin: auto;
  margin-bottom: 30px;
}

.position {
  position: absolute;
  left: 40%;
  top: 31%;
}
</style>