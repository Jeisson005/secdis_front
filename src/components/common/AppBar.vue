<template>
  <div class="AppBar">
    <v-app-bar
      color="blue darken-1"
      dark
      flat
      fixed
      dense
      style="z-index: 1000"
    >
      <v-toolbar-title
        class="title font-weight-bold"
        style="cursor: pointer"
        @click="toRoute('/detection')"
      >
        SECDIS
        <sub class="font-weight-light caption"
          >Sistema de Evaluación y Clasificación de Distanciamiento Social</sub
        >
      </v-toolbar-title>
      <v-spacer />
      <template v-for="(m, mIndex) in menu">
        <v-btn
          small
          :key="mIndex"
          :text="!m.buttonIcon"
          :icon="m.buttonIcon"
          :to="m.path"
          class="ml-2"
        >
          <v-icon :left="!m.buttonIcon">{{ m.icon }}</v-icon>
          {{ m.name }}
        </v-btn>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "AppBar",
  data: () => ({
    menu: [
      {
        name: "distanciamiento social",
        path: "/detection",
        icon: "mdi-cube-scan"
      },
      {
        name: "Análisis de datos",
        path: "/analytics",
        icon: "mdi-chart-timeline-variant"
      },
      {
        name: "",
        path: "/about",
        icon: "mdi-information",
        buttonIcon: true
      }
    ]
  }),
  methods: {
    toRoute(path) {
      return this.$router.push(path);
    }
  }
};
</script>

<style scoped></style>
