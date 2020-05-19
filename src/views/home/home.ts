/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: Qinyin.Web
 * FileName : home.ts
 * Author : liyuhang
 * Date : 2020-02-29 18:41:27
 */

import { Component, Vue } from "vue-property-decorator";
import { Footer, Header } from "@/components/index";

@Component({
  components: {
    Footer,
    Header,
  },
})
export default class Home extends Vue {}
