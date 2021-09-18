/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-08-24 16:09:53
 * @LastEditors: ydfk
 * @LastEditTime: 2021-09-18 13:06:07
 */
module.exports = {
  ignores: [(commit) => commit.includes("init")],
  extends: ["gitmoji"],
};
