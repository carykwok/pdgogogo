-- 在 Supabase SQL Editor 中执行这段 SQL

CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('morning', 'midday', 'close')),
  content TEXT NOT NULL,
  report_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 允许匿名读取（supabase 默认需要 RLS policy）
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read" ON reports
  FOR SELECT
  USING (true);

-- 插入一条测试数据
INSERT INTO reports (title, type, content, report_date) VALUES
(
  'A 股收盘总结｜2026 年 5 月 20 日',
  'close',
  E'# A 股收盘总结｜2026 年 5 月 20 日\n\n**1. 今日市场概览**\n\n今日 A 股整体是震荡分化、个股涨多跌少。沪深北三市成交约 3.2 万亿元，比前一交易日放大约 1800 亿元。成交额继续放大，说明市场热度在回升。\n\n**2. 今日最重要的三件事**\n\n**第一，半导体板块全线走强。**\n\n今天半导体设备、材料、设计、制造多个环节同步上涨。背后的逻辑是国产替代加速叠加 AI 算力需求拉动。\n\n**第二，消费电子回暖。**\n\n苹果链和安卓链都有表现，市场在交易换机周期和端侧 AI 带来的增量。\n\n**第三，新能源震荡整理。**\n\n光伏和锂电方向今天表现偏弱，资金在科技和新能源之间做切换。\n\n**3. 风险提示**\n\n第一，高位科技股波动加大。\n第二，成交量能否持续放大需要观察。\n\n**4. 明日关注**\n\n第一，半导体能否延续强势。\n第二，成交额是否继续放大。\n第三，新能源方向是否出现修复。',
  '2026-05-20'
);
