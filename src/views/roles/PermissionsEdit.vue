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
              <v-select
                v-model="superRole"
                :options="roleOptions"
                @input="updateSuper"
                class="select_padding mt-4"
                name="status"
                placeholder="Status"
                :reduce="(status) => status.id"
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
import { TreeViewPlugin } from "@syncfusion/ej2-vue-navigations";
import vSelect from "vue-select";
import { recurseData } from "../../functions/recourceData";

export default {
  data() {
    return {
      field: {
        id: "id",
        dataSource: [],
        parentID: "pid",
        text: "name",
        hasChildren: "hasChild",
      },
      saveObject: {},
      permName: "",
      roles: [],
      superRole: false,
      id: 1,
      roleOptions: [
        { id: false, label: "Custom" },
        { id: true, label: "Check all" },
      ],
      pid: null,
      permissions: {},
      event: false,
      array: [],
      object: {},
      childids: [],
    };
  },
  components: {
    vSelect,
  },
  methods: {
    updateSuper(event) {
      var treeObj = document.getElementById("treeview").ej2_instances[0];
      if (this.superRole) {
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
            const childs = this.array.filter(
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
      this.array = data;
      this.id = 1;
      this.object = {};
      this.childids = [];
      this.object = this.generateObject(data);
      const send = JSON.stringify(this.object);
      if (this.permName) {
        this.$http
          .put(
            `roles`,
            {
              id: this.$route.params.permId,
              permissions: send,
              slug: this.permName,
            },
            { headers: { Authorization: localStorage.token } }
          )
          .then((res) => {
            if (res.data.id == JSON.parse(localStorage.user).role) {
              localStorage.permissions = res.data.permissions;
            }
            this.$vs.loading.close();
            this.activeLoading = false;

            this.$router.push("/admins").then((res) => {
              this.$store.commit("user/changeUsersTab", 2);
            });
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
        this.$http
          .get(`roles/${this.$route.params.permId}`, {
            headers: {
              Authorization: localStorage.token,
            },
          })
          .then((result) => {
            let data = JSON.parse(result.data.permissions);
            this.permName = result.data.slug;

            Object.keys(res.data).forEach((key) => {
              Object.keys(data).forEach((dataKey) => {
                if (!data[key]) {
                  data[key] = res.data[key];
                }
              });
            });

            this.field.dataSource = recurseData(data, null, []);
            this.saveObject = data;
          })
          .catch((err) => {
            this.$vs.loading.close();
          });
      })
      .catch((error) => {
        this.$vs.loading.close();
      });
  },
};
</script>

<style scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
.control_wrapper {
  /* display: block;
  max-width: 350px;
  max-height: 350px;
  margin: auto;
  overflow: auto;
  border: 1px solid #dddddd;
  border-radius: 3px; */
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

.modules {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  /* padding: 20px; */
  background: white;
}

/* .modules .vs-component.con-vs-checkbox.vs-checkbox-primary.vs-checkbox-default {
  padding: 20px 20px 0 20px;
}*/

.modules .checboxx {
  padding: 20px 20px 0 20px;
}

.modules .checkboxes {
  padding: 5px 20px 10px 20px;
}

.checkboxes .vs-component.con-vs-checkbox {
  margin-bottom: 15px !important;
}

.myRow {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  padding: 0 15px;
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

.name_block .vs-component.vs-con-input-label.vs-input.vs-input-primary {
  width: 23%;
  margin: auto;
  margin-bottom: 30px;
}

.savesBtn {
  height: 36px;
  position: relative;
  top: 25px;
  right: 25px;
}

.position {
  position: absolute;
  left: 40%;
  top: 35%;
}
</style>