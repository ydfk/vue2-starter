/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2020-05-13 09:25:27
 * @LastEditors: ydfk
 * @LastEditTime: 2020-05-13 09:36:33
 */
import Vue from "vue";
import VueRouter, { Route, RouterOptions } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { NO_TOKEN, TOKEN_EXPIRE_MSG } from "@/commons/constants";
import store from "@/store/index";
import { A_USER_CHECK } from "@/store/store.types";
import { message } from "ant-design-vue";
import { RouterEnum } from "@/commons/enums";
import { RouterItemModel } from "@/commons/models/baseModel";
import { refreshPageStore, removePageStore } from "@/components/table/pageStorage";

NProgress.configure({ showSpinner: false });
Vue.use(VueRouter);

export const menuRouters: RouterItemModel[] & RouterOptions["routes"] = [
  {
    path: RouterEnum.example,
    name: RouterEnum.example,
    component: () => import("@/views/example/example.vue"),
    meta: {
      title: "示例",
    },
  },
  {
    path: "tableLocal",
    name: "tableLocal",
    component: () => import("@/views/example/TableLocal.vue"),
    meta: {
      title: "本地数据列表",
    },
  },
];

const routes: RouterItemModel[] & RouterOptions["routes"] = [
  {
    path: "/",
    redirect: `/${RouterEnum.login}`,
  },
  {
    path: `/${RouterEnum.login}`,
    name: RouterEnum.login,
    meta: {
      needAuth: false,
    },
    component: () => import("@/views/login/login.vue"),
  },
  {
    path: `/${RouterEnum.error}`,
    name: RouterEnum.error,
    meta: {
      needAuth: false,
    },
    component: () => import("@/views/error/error.vue"),
  },
  {
    path: `/${RouterEnum.home}`,
    name: RouterEnum.home,
    component: () => import("@/views/home/home.vue"),
    children: menuRouters,
  },
];

const router = new VueRouter({
  routes,
});

const pageStore = (to: Route, from: Route) => {
  if (to.path !== from.path) {
    if (to.meta?.keepStore && from.meta?.keepStore && to.meta?.keepStore === from.meta?.keepStore) {
      refreshPageStore(from.meta?.keepStore);
    } else {
      refreshPageStore();
    }

    if (to.query.removeStore) {
      removePageStore(to.query.removeStore);
    }
  }
};

router.beforeEach((to, from, next) => {
  NProgress.start();

  //更新table store 记住的页码
  pageStore(to, from);

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
        next({ name: RouterEnum.login, params: { redirect: to.fullPath } });
      });
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
