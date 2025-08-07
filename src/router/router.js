import { createRouter, createWebHistory } from "vue-router";
import Home from "./../views/Home.vue";
import Register from "./../views/Register.vue";
import Login from "./../views/Login.vue";
import ChecklistDetail  from "./../views/ChecklistDetail.vue";
import Dashboard from "./../views/Dashboard.vue";
import NotFound from "../views/NotFound.vue";
import NotFoundPages from "../views/NotFoundPages.vue";

import { useStore } from "./../stores/store.js";
import axios from "axios";

async function checkToken(token) {
  try {
    await axios
      .get(
        `https://todo-mongo-api-one.vercel.app/api/auth/verify-token/${token}`
      )
      .then((res) => {
        // console.log(res.data.status);
        router.push(`/verification-reset-password/${token}/reset-password`);
        // this.message = res.data.message;
        // console.log(res.data);
      })
      .catch((err) => {
        router.push(`/verification-reset-password/expired-token`);
        // this.message = err.response.data.message;
        // console.log(err.response.data.message);
      });
  } catch (error) {
    console.log(error.response);
  }
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home | Todo App With Vue 3 and Mongodb",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register | Todo App With Vue 3 and Mongodb",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login | Todo App With Vue 3 and Mongodb",
    },
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      title: "Dashboard | Todo App With Vue 3 and Mongodb",
    },
  },
  {
    path: "/not-found",
    name: "NotFoundPages",
    component: NotFoundPages,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: '/checklist/:id',
    name: 'ChecklistDetail',
    component: ChecklistDetail,
    props: true, // Mengizinkan passing checklistId sebagai prop
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// if not found redirect to 404
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;

  const store = useStore();

  if (
    to.name !== "Login" &&
    to.name !== "Register" &&
    to.name !== "Home" &&
    to.name !== "ForgotPassword" &&
    to.name !== "VerificationResetPassword" &&
    to.name !== "ResetPassword" &&
    to.name !== "ExpiredToken" &&
    to.name !== "NotFound" &&
    to.name !== "NotFoundPages" &&
    store.isUserLoggedIn === false
  ) {
    next({ name: "Login" });
  } else {
    next();
  }

  window.scrollTo(0, 0);
});

router.afterEach((to) => {
  // Mengubah judul head saat rute berubah
  document.title = to.meta.title || "Nama Default";
  // scroll to top
});

export default router;
