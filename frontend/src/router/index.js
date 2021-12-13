import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import List from "../views/List";
import Upload from "../views/Upload";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/list",
    name: "List",
    component: List,
  },
  {
    path: "/upload",
    name: "Upload",
    component: Upload,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
