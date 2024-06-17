import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/components/Home";
import SocialDistance from "@/components/modules/SocialDistance";
import TrackObject from "@/components/modules/TrackObject";
import DataAnalytics from "@/components/modules/DataAnalytics";
import About from "@/components/modules/About";
import Sockets from "@/components/Sockets";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/detection",
    name: "Detect Object",
    component: SocialDistance
  },
  {
    path: "/track",
    name: "Track Object",
    component: TrackObject
  },
  {
    path: "/analytics",
    name: "Data Analytics",
    component: DataAnalytics
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/sockets",
    name: "Sockets",
    component: Sockets
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
