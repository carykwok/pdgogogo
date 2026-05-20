# TODO — pdgogogo 项目待办

## Phase 1：基础设施（本周）

- [ ] 在 Namecheap 购买域名（建议 .com，约 50-80 元/年）
- [ ] 注册 Supabase 账号（免费层够用）
- [ ] 注册 Vercel 账号（GitHub 登录，免费层够用）
- [ ] 域名 DNS 解析到 Vercel

## Phase 2：第一版站点上线（Phase 1 完成后 1 周）

- [ ] 让 AI 生成 Next.js 站点代码（三大报表展示 + 按日期列表）
- [ ] 代码推到 GitHub
- [ ] Vercel 关联 GitHub 仓库，自动部署
- [ ] 浏览器打开域名，确认页面能访问

## Phase 3：内容填充

- [ ] 手动输入 3-5 篇历史报告到 Supabase，验证前端展示正常
- [ ] 跑通"手动粘贴内容 → Supabase → 站点展示"这个闭环

## Phase 4：自动化（Phase 2-3 稳定后）

- [ ] 把三个 Skill 的逻辑转成 Vercel Cron Job
- [ ] 定时生成报告 → 自动存 Supabase → 站点自动更新
- [ ] 加简单监控（生成失败时有提醒）

## Phase 5：体验打磨

- [ ] 移动端适配
- [ ] 加载速度优化
- [ ] 分享卡片（微信/朋友圈分享时预览好看）
- [ ] 订阅推送（可选，后续决策）

## Phase 6：小程序（用户验证后）

- [ ] 注册微信小程序账号
- [ ] 小程序前端开发（Taro + TDesign）
- [ ] 对接已有后端 API
- [ ] 小程序审核 + 上线
