<template>
  <v-app>
    <AppBar />
    <div style="margin-top: 48px">
      <router-view />
    </div>
  </v-app>
</template>

<script>
import AppBar from "@/components/common/AppBar";

export default {
  name: "App",
  mounted() {
    this.$router.push("/detection");
  },
  components: {
    AppBar
  },

  data: () => ({
    //
  })
};
</script>
