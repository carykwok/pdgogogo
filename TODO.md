# TODO — pdgogogo 项目待办

## Phase 1：基础设施 ✅ 完成

- [x] 注册 Vercel 账号（carykwok，GitHub 登录）
- [x] ~~买域名~~ 用 Vercel 免费域名 pdgogogo.vercel.app
- [x] ~~注册 Supabase~~ 改用文件驱动方案（Supabase DNS 不通）

## Phase 2：第一版站点上线 ✅ 完成

- [x] Next.js + shadcn/ui + Tailwind 站点
- [x] 代码推到 GitHub（carykwok/pdgogogo）
- [x] Vercel 部署，pdgogogo.vercel.app 可访问
- [x] 全静态生成（`○` static），秒开

## Phase 3：内容运营 ⏳ 进行中

- [x] 一篇测试报告已上线（2026-05-20 收盘总结）
- [ ] 手动或通过 AI 生成更多报告 → 存为 .md 文件到 content/reports/
- [ ] 跑通"生成内容 → 存 .md → git push → 自动更新"闭环

## Phase 4：数据库方案（可选）

- [ ] 如需接库，用 Vercel Postgres（Neon），一键安装，自动配环境变量
- [ ] 把 reports.ts 从读文件改成读数据库

## Phase 5：自动化

- [ ] 把三个 Codex Skill 的输出自动存为 .md 文件 → git push
- [ ] 或：Vercel Cron Job 定时调 Skill API → 生成内容 → 写入 → 部署

## Phase 6：体验打磨

- [ ] 移动端适配优化
- [ ] 微信/朋友圈分享预览优化（OG 标签）
- [ ] 订阅推送

## Phase 7：小程序

- [ ] 注册微信小程序账号
- [ ] 小程序前端开发
- [ ] 对接已有内容
