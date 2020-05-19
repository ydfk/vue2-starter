/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : mock.js
 * Author : lyh67
 * Date : 2020-05-19 10:53:19
 */
import Mock from "mockjs";
import { builder, getQueryParameters } from "./util";

const Random = Mock.Random;
const Domain = process.env.VUE_APP_API_HOST;
console.log(`mockDomain ${Domain}`);

Mock.mock(/\/api\/token/, "get", (option) => {
  const params = getQueryParameters(option);

  if (params.code && params.password && params.code === "admin" && params.password === "1") {
    return builder(true, {
      token: Mock.mock("@guid"),
      tokenExpiration: 1800,
    });
  } else {
    return builder(false, null, "用户名或者密码不正确");
  }
});

Mock.mock(/\/user\/login/, "get", (option) => {
  return builder(true, {
    id: Mock.mock("@guid"),
    name: "管理员",
    code: "admin",
  });
});

export default Mock;
