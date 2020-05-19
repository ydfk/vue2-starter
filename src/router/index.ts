/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2020-05-13 09:25:27
 * @LastEditors: ydfk
 * @LastEditTime: 2020-05-13 09:36:33
 */
import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { NO_TOKEN, ROUTER_HOME, ROUTER_LOGIN, TOKEN_EXPIRE_MSG } from "@/commons/constants";
import store from "@/store/index";
import { A_USER_CHECK } from "@/store/store.types";
import { message } from "ant-design-vue";

NProgress.configure({ showSpinner: false });
Vue.use(VueRouter);

const routes = [
  {
    path: `/`,
    name: ROUTER_LOGIN,
    meta: {
      needAuth: false,
    },
    component: () => import("@/views/login/login.vue"),
  },
  {
    path: `/${ROUTER_HOME}`,
    name: ROUTER_HOME,
    component: () => import("@/views/home/home.vue"),
    children: [],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  NProgress.start();

  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }

  if (!to.meta || Object.keys(to.meta).length === 0 || (to.meta && to.meta.needAuth)) {
    store
      .dispatch(A_USER_CHECK)
      .then(() => {
        next();
      })
      .catch((error) => {
        if (error === NO_TOKEN) {
          console.log(NO_TOKEN);
          message.warn(TOKEN_EXPIRE_MSG);
        }
        next({ name: ROUTER_LOGIN, params: { redirect: to.fullPath } });
      });
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
