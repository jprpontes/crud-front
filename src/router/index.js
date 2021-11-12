import { createRouter, createWebHistory } from "vue-router";
import Contacts from "../views/Contacts.vue";

const routes = [
  {
    path: "/",
    name: "Contacts",
    component: Contacts,
  },
  {
    path: "/contatos/novo",
    name: "ContactsNew",
    component: () => import("@/views/ContactsNewEdit.vue"),
  },
  {
    path: "/contatos/:id/alteracao",
    name: "ContactsEdit",
    component: () => import("@/views/ContactsNewEdit.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
