import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import tracking from "tracking";
import VueResource from "vue-resource";
import VueSocketIO from "vue-socket.io";
import vue_moment from "vue-moment";

Vue.config.productionTip = false;
Object.defineProperty(Vue.prototype, "$tracking", { value: tracking });

Vue.use(VueResource);
Vue.use(vue_moment);
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: process.env.VUE_APP_MINERVA_API + "/test",
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
