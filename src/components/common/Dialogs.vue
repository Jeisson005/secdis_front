<template>
  <v-dialog
    v-model="open"
    transition="dialog-bottom-transition"
    max-width="400"
  >
    <template>
      <v-card>
        <v-toolbar dense flat color="blue darken-1" dark>{{ title }}</v-toolbar>
        <v-card-text>
          <div class="title pt-5">{{ description }}</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            elevation="0"
            color="blue darken-1"
            dark
            small
            @click="closeDialog"
            >Entendido</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: "Dialogs",
  props: ["title", "description", "open"],
  data: () => ({
    dialog: false
  }),
  methods: {
    closeDialog() {
      this.$emit("closeSecondDialog", true);
    }
  }
};
</script>

<style scoped></style>
