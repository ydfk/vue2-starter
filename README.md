# TEC前端通用框架

---

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

`api` 中放置各种访问api方法

`assets` 各种图片、ico等，`var.sass`为sass定义的公共变量, `mixin.sass`为混入

`commons` 为model、enum、const等通用内容

`components` 是组件目录，组件应该使用独立文件夹

`mixins` 是vue混入

`router` 是路由

`store` 是vuex存储目录

`types` 存放各种typescript的d.ts文件

`views` 是所有业务页面

## 开发要求
* 所有文件、类的属性、方法、变量一律使用小驼峰命名
* 所有类、枚举、组件引用使用大驼峰
* 常量使用全大写和下划线方式命名
* 组件应放到`components`文件夹下并建立文件夹分类
* 业务页面放到 `vies` 文件夹下并建立文件夹分类
* 业务对象类(model)、枚举、常量、通用方法等放到 `commons` 文件夹下并建立文件分类
* 组件和页面的css、vue、ts分开三个文件，**禁止在同一文件中出现**
* 所有api调用统一写到`apis` 文件夹下
* 每次提交前必须使用`yarn lint`检查代码格式
## 其他
建议开发工具 [webStorm](https://www.jetbrains.com/webstorm/download/#section=windows)
