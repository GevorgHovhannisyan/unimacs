<template>
  <div>
    <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer"
      @click.stop="editRecord" />
    <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer"
      @click.stop="confirmDeleteRecord" />
  </div>
</template>

<script>
export default {
  name: 'CellRendererActions',
  methods: {
    editRecord() {
      this.$root.$emit('cardholderEdit', this.params);
      // this.$router.push(`/apps/user/user-edit/${  268}`).catch(() => {})
    },
    confirmDeleteRecord() {
      this.$root.$emit('cardholderRemove', this.params);
      return false;

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirm Delete',
        text: `You are about to delete "${this.params.data.username}"`,
        accept: this.deleteRecord,
        acceptText: 'Delete'
      })
    },
    deleteRecord() {
      /* Below two lines are just for demo purpose */
      this.showDeleteSuccess()

      /* UnComment below lines for enabling true flow if deleting user */
      // this.$store.dispatch("userManagement/removeRecord", this.params.data.id)
      //   .then(()   => { this.showDeleteSuccess() })
      //   .catch(err => { console.error(err)       })
    },
    showDeleteSuccess() {
      this.$vs.notify({
        time: 7000,
        color: 'success',
        title: 'User Deleted',
        text: 'The selected user was successfully deleted'
      })
    }
  }
}
</script>
