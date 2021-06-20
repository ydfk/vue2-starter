# TEC 前端通用框架

## (默认登录为 admin 1)

## 包管理

推荐使用 [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

### 安装包

`yarn install` or `npm install`

### 开发环境运行

`yarn serve` or `npm run serve`

### 打包

`yarn build` or `npm run build`

### 检查代码格式

`yarn lint` or `npm run lint`

## 文件夹解释

`api` 中放置各种访问 api 方法

`assets` 各种图片、ico 等，`var.sass`为 sass 定义的公共变量, `mixin.sass`为混入

`commons` 为 model、enum、const 等通用内容

`components` 是组件目录,应与业务无关组件，组件应该使用独立文件夹

`componentsBusiness` 是业务组件目录，组件应该使用独立文件夹

`hooks` 是组合式 api 钩子

`mixins` 是 vue 混入

`router` 是路由

`store` 是 vuex 存储目录

`types` 存放各种 typescript 的 d.ts 文件

`views` 是所有业务页面

## 开发要求

- 所有文件、类的属性、方法、变量一律使用小驼峰命名
- 所有类、枚举、组件引用使用大驼峰
- 常量使用全大写和下划线方式命名
- 业务组件应放到`componentsBusiness`文件夹下并建立文件夹分类
- 业务页面放到 `vies` 文件夹下并建立文件夹分类
- 业务对象类(model)、枚举、常量、通用方法等放到 `commons` 文件夹下并建立文件分类
- 组件和页面的 css、vue、ts 分开三个文件，**禁止在同一文件中出现**
- 所有 api 调用统一写到`apis` 文件夹下
- 每次提交前必须使用`yarn lint`检查代码格式

## 建议开发工具

[webStorm](https://www.jetbrains.com/webstorm/download/#section=windows)

[webstorm 学习版](https://ldqk.org/1191)

[visual Studio Code](https://code.visualstudio.com/download)

## 参考文档

[vue2](https://cn.vuejs.org/v2/guide/)

[composition-api](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E7%BB%84%E5%90%88%E5%BC%8F-api-%E5%9F%BA%E7%A1%80)

[antDesignVue](https://www.antdv.com/docs/vue/introduce-cn/)

[typescript](https://ts.xcatliu.com/)

[typescript 编码规范](https://basarat.gitbook.io/typescript/styleguide)

[clean-code-typescript](https://github.com/beginor/clean-code-typescript)

[es6](https://es6.ruanyifeng.com/)
