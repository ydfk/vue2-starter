/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : mock.js
 * Author : lyh67
 * Date : 2020-05-19 10:53:19
 */
import Mock from "mockjs";
import { builder, getQueryParameters, getBody } from "./util";

const Random = Mock.Random;
const Domain = process.env.VUE_APP_API_HOST;
console.log(`mockDomain ${Domain}`);

Mock.mock(/\/api\/token/, "get", (option) => {
  const params = getQueryParameters(option);

  if (params.code && params.password && params.code === "admin" && params.password === "1") {
    return builder(true, {
      token: Mock.mock("@guid"),
      tokenExpiration: 18000,
    });
  } else {
    return builder(false, null, "用户名或者密码不正确");
  }
});

Mock.mock(/\/user\/login/, "get", (option) => {
  return builder(true, {
    id: Mock.mock("@guid"),
    name: Random.cname(),
    code: "admin",
  });
});

Mock.mock(/\/demoTable/, "post", (option) => {
  const body = getBody(option);
  const pageResults = [];

  let count = 10;
  if (body.pageCurrent === 2) {
    count = 5;
  }

  for (let index = 0; index < count; index++) {
    pageResults.push({
      id: Mock.mock("@guid"),
      idNo: Random.id(),
      name: Random.cname(),
      mobile: "13312341234",
      email: Random.email(),
      sex: index % 2 === 0 ? "男" : "女",
      city: Random.city(),
      time: Random.datetime(),
      income: Random.float(1000, 99999999999),
      children: [
        {
          id: Mock.mock("@guid"),
          idNo: Random.id(),
          name: Random.cname(),
          mobile: "13312341234",
          email: Random.email(),
          sex: index % 2 === 0 ? "男" : "女",
          city: Random.city(),
          time: Random.datetime(),
          income: Random.float(1000, 99999999999),
          children: [
            {
              id: Mock.mock("@guid"),
              idNo: Random.id(),
              name: Random.cname(),
              mobile: "13312341234",
              email: Random.email(),
              sex: index % 2 === 0 ? "男" : "女",
              city: Random.city(),
              time: Random.datetime(),
              income: Random.float(1000, 99999999999),
            },
            {
              id: Mock.mock("@guid"),
              idNo: Random.id(),
              name: Random.cname(),
              mobile: "13312341234",
              email: Random.email(),
              sex: index % 2 === 0 ? "男" : "女",
              city: Random.city(),
              time: Random.datetime(),
              income: Random.float(1000, 99999999999),
              children: [
                {
                  id: Mock.mock("@guid"),
                  idNo: Random.id(),
                  name: Random.cname(),
                  mobile: "13312341234",
                  email: Random.email(),
                  sex: index % 2 === 0 ? "男" : "女",
                  city: Random.city(),
                  time: Random.datetime(),
                  income: Random.float(1000, 99999999999),
                },
                {
                  id: Mock.mock("@guid"),
                  idNo: Random.id(),
                  name: Random.cname(),
                  mobile: "13312341234",
                  email: Random.email(),
                  sex: index % 2 === 0 ? "男" : "女",
                  city: Random.city(),
                  time: Random.datetime(),
                  income: Random.float(1000, 99999999999),
                },
              ],
            },
          ],
        },
        {
          id: Mock.mock("@guid"),
          idNo: Random.id(),
          name: Random.cname(),
          mobile: "13312341234",
          email: Random.email(),
          sex: index % 2 === 0 ? "男" : "女",
          city: Random.city(),
          time: Random.datetime(),
          income: Random.float(1000, 99999999999),
        },
      ],
    });
  }
  return builder(true, {
    pageResults: pageResults,
    totalCount: 15,
  });
});

export default Mock;
