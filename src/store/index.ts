import Vue from "vue";
import Vuex from "vuex";
import {
  A_LOADED,
  A_LOADING,
  A_USER_CHECK,
  A_USER_SIGN,
  A_USER_SIGNOUT,
  G_LOADING,
  G_TOKEN,
  G_USER,
  G_USER_NAME,
  M_CLEAR_USER,
  M_SET_LOADING,
  M_SET_TOKEN,
  M_SET_USER,
  A_USER_REFRESH,
} from "@/store/store.types";
import persistedState from "vuex-persistedstate";
import { TokenModel, UserModel } from "@/commons/models/loginModel";
import moment from "moment";
import { NO_LOGIN, NO_TOKEN, TOKEN_REFRESH } from "@/commons/constants";
import { apiGetLoginUser, apiRefreshToken } from "@/apis/loginApis";

Vue.use(Vuex);

interface AppState {
  loading: boolean;
  user: UserModel;
  token: string;
  tokenExpire: string;
}

export default new Vuex.Store<AppState>({
  plugins: [persistedState({ storage: window.sessionStorage })],
  state: {
    loading: false,
    user: {
      id: "",
      name: "",
      code: "",
    },
    token: "",
    tokenExpire: "",
  },
  getters: {
    [G_LOADING]: (state: AppState) => state.loading,
    [G_USER_NAME]: (state: AppState) => state.user.name,
    [G_USER]: (state: AppState) => state.user,
    [G_TOKEN]: (state: AppState) => state.token,
  },
  mutations: {
    [M_SET_LOADING]: (state: AppState, loading: boolean) => (state.loading = loading),
    [M_SET_TOKEN](state: AppState, tokenModel: TokenModel) {
      state.token = tokenModel.token;
      state.tokenExpire = moment().add(tokenModel.tokenExpiration, "second").format("YYYY-MM-DDTHH:mm:ss.SSS");
    },
    [M_SET_USER](state: AppState, user: UserModel) {
      Object.keys(user).forEach((key) => {
        if (user[key]) {
          state.user[key] = user[key];
        }
      });
    },
    [M_CLEAR_USER](state: AppState) {
      state.token = "";
      state.tokenExpire = "";
      state.user = {
        code: "",
        id: "",
        name: "",
      };
    },
  },
  actions: {
    [A_LOADING]: ({ commit }) => commit(M_SET_LOADING, true),
    [A_LOADED]: ({ commit }) => commit(M_SET_LOADING, false),
    [A_USER_SIGNOUT]: ({ commit }) => commit(M_CLEAR_USER),
    [A_USER_SIGN]: async ({ commit }, tokenModel: TokenModel) => {
      commit(M_SET_TOKEN, tokenModel);
      const user = await apiGetLoginUser();
      commit(M_SET_USER, user);
    },
    [A_USER_REFRESH]: async ({ dispatch, state }) => {
      await dispatch(A_USER_SIGN, state.token);
    },
    [A_USER_CHECK]: ({ commit, dispatch, state }) =>
      /* eslint-disable */
      new Promise(async (resolve, reject) => {
        if (!state.token) {
          console.log("尚未登录");
          reject(NO_LOGIN);
        } else {
          const expireDate = moment(state.tokenExpire).toDate();
          const curTime = moment().toDate();

          if (curTime > expireDate) {
            console.log("token过期");
            await dispatch(A_USER_SIGNOUT);
            reject(NO_TOKEN);
          } else {
            const refreshDate = moment(expireDate).subtract(TOKEN_REFRESH, "second").toDate();

            if (refreshDate <= curTime) {
              console.log("刷新token");
              // 刷新时间大于现在时间 则刷新token
              const newToken = await apiRefreshToken();
              commit(M_SET_TOKEN, newToken);
              resolve(newToken);
            } else {
              resolve(state.token);
            }
          }
        }
      }),
  },
});
