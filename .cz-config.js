/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-09-18 13:05:46
 * @LastEditors: ydfk
 * @LastEditTime: 2021-09-18 13:05:47
 */
module.exports = {
  // type 类型（定义之后，可通过上下键选择）
  types: [
    { value: ":sparkles: feat", name: "✨ feat: 新功能" },
    { value: ":bug: fix", name: "🐛 fix: 修复bug" },
    { value: ":memo: docs", name: "📝 docs: 文档变更" },
    { value: ":art: style", name: "🎨 style: 代码的样式美化" },
    { value: ":recycle: refactor", name: "♻️ refactor: 重构" },
    { value: ":zap: perf", name: "⚡️ perf: 性能优化" },
    { value: ":white_check_mark: test", name: "✅ test: 测试" },
    { value: ":building_construction: build", name: "🏗️ build: 打包" },
    { value: ":construction_worker: ci", name: "👷 ci: 修改 CI 配置、脚本" },
    { value: ":hammer: chore", name: "🔨 chore: 构建/工程依赖/工具" },
    { value: ":rewind: revert", name: "⏪️ revert: 回退" },
    { value: ":tada: init", name: "🎉 init: 初始化" },
  ],
  // 交互提示信息
  messages: {
    type: "确保本次提交遵循 Angular 规范！\n请选择提交类型(必填): \n",
    scope: "\n选择一个 scope（可选）：",
    // 选择 scope: custom 时会出下面的提示
    customScope: "请输入文件修改范围(可选): \n",
    subject: "请简要描述提交(必填)：\n",
    body: '请输入详细描述(可选)。使用 "|" 换行：\n',
    breaking: "列举非兼容性重大的变更（可选）：\n",
    footer: "列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n",
    confirmCommit: "确认提交？",
  },
  allowCustomScopes: true,
  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ["feat", "fix"],
  // subject 限制长度
  subjectLimit: 108,
  breaklineChar: "|",
};
