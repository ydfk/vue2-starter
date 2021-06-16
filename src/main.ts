/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2020-05-13 09:25:27
 * @LastEditors: ydfk
 * @LastEditTime: 2021-06-15 21:28:33
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import moment from "moment";
import "moment/locale/zh-cn";
import VueBus from "vue-bus";
import {
  Button,
  Col,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Skeleton,
  Alert,
  Dropdown,
  Menu,
  Icon,
  Tooltip,
  Switch,
  Tag,
  InputNumber,
  DatePicker,
  TimePicker,
  Calendar,
  Descriptions,
  Badge,
  FormModel,
  Radio,
  Popover,
  Select,
  Statistic,
  Card,
  TreeSelect,
  Cascader,
  Checkbox,
  Tabs,
  Tree,
  Slider,
  Steps,
  Timeline,
  Progress,
  Upload,
  List,
  Avatar,
  Drawer,
  Empty,
  Collapse,
  Result,
  Mentions,
  Divider,
  Popconfirm,
} from "ant-design-vue";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);

Vue.use(VueBus);

Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
Vue.use(Input);
Vue.use(Layout);
Vue.use(Modal);
Vue.use(Skeleton);
Vue.use(Alert);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Menu.Item);
Vue.use(Icon);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.use(Tag);
Vue.use(InputNumber);
Vue.use(DatePicker);
Vue.use(Calendar);
Vue.use(TimePicker);
Vue.use(Descriptions);
Vue.use(Badge);
Vue.use(FormModel);
Vue.use(Radio);
Vue.use(Popover);
Vue.use(Select);
Vue.use(Statistic);
Vue.use(Card);
Vue.use(TreeSelect);
Vue.use(Cascader);
Vue.use(Checkbox);
Vue.use(Tabs);
Vue.use(Tree);
Vue.use(Slider);
Vue.use(Steps);
Vue.use(Timeline);
Vue.use(Progress);
Vue.use(Upload);
Vue.use(List);
Vue.use(Avatar);
Vue.use(Drawer);
Vue.use(Empty);
Vue.use(Collapse);
Vue.use(Result);
Vue.use(Mentions);
Vue.use(Divider);
Vue.use(Popconfirm);

moment.locale("zh-cn");
Vue.config.productionTip = false;

Vue.prototype.$message = message;
message.config({
  top: `50px`,
  duration: 1.5,
  maxCount: 1,
});

process.env.VUE_APP_MOCK && require("../mock/mock.js");

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
