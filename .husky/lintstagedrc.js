/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-09-18 13:07:52
 * @LastEditors: ydfk
 * @LastEditTime: 2021-09-18 13:07:52
 */
module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "package.json": ["prettier --write"],
  "*.vue": ["stylelint --fix", "eslint --fix", "prettier --write"],
  "*.{scss,sass,less,styl,html}": ["stylelint --fix"],
};
