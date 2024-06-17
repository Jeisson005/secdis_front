<template>
  <div class="NavigationDrawer">
    <template>
      <v-container class="py-4">
        <p class="text-xl-h4">Menu de herramientas</p>
        <v-card elevation="4" width="400">
          <v-navigation-drawer floating permanent width="400">
            <v-list shaped>
              <v-list-item-group v-model="item" color="#6200EA">
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  @click="toPath(item.path)"
                >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        </v-card>
        <v-row>
          <v-col>
            <p class="text-xl-h5">Detalles de la herramienta</p>
            <v-card
              class="mx-auto"
              color="#6200EA"
              dark
              max-width="400"
              style="height: 50vh"
            >
              <v-card-title>
                <v-icon large left>mdi-lightbulb-on</v-icon>
                <span class="title font-weight-light">{{
                  items[item].title
                }}</span>
              </v-card-title>
              <v-card-text class="headline font-weight-bold px-4">
                {{ text }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-footer padless>
          <v-col class="text-center" cols="12">
            {{ new Date().getFullYear() }} —
            <strong>GAIA Object Detect System</strong>
          </v-col>
        </v-footer>
      </v-container>
    </template>
  </div>
</template>

<script>
export default {
  name: "NavigationDrawer",
  data() {
    return {
      item: 0,
      items: [
        {
          title: "Detección de objetos",
          icon: "mdi-image",
          path: "/detect",
          active: false
        },
        {
          title: "Seguimiento de objetos",
          icon: "mdi-video",
          path: "/track",
          active: false
        },
        {
          title: "Análisis de datos",
          icon: "mdi-google-analytics",
          path: "/analytics",
          active: false
        },
        {
          title: "Créditos",
          icon: "mdi-information",
          path: "/about",
          active: false
        }
      ],
      text: "Esta herramienta tiene la funcionalidad ....",
      path: null
    };
  },
  mounted() {
    this.$router.push("/detect");
  },
  methods: {
    toPath(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style scoped></style>
