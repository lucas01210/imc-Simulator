# 技术实现计划（Tech Plan）

## 1. 总体架构

目标是把“IMC 引擎逻辑”与“UI 表现”解耦，便于后续扩展与教学内容维护。

推荐分层：

1. **UI 层（Next.js + React）**
   - 页面：首页、品牌选择、游戏回合页、结局页
   - 组件：决策卡板、指标面板、事件时间线、结算弹层
2. **游戏状态与存储层**
   - `gameState.ts`：定义状态类型与初始化
   - `storage.ts`：localStorage 读写（单存档槽）
3. **IMC 引擎层（纯 TS，无 DOM 依赖）**
   - `types.ts`：指标、决策卡、事件结构
   - `decisions.ts`：决策卡配置（数据驱动）
   - `engine.ts`：回合结算算法（输入状态 + 选择 → 输出新状态 + 事件日志）
   - `evaluate.ts`：终局评估与结局类型映射

## 2. 数据结构与状态机

### 2.1 状态（GameState）

建议包含：

- `version`：便于未来迁移
- `brandTypeId`
- `turnIndex`：当前回合（从 0 开始）
- `totalTurns`：总回合数
- `metrics`：指标集合（认知/信任/舆情/销量/预算/协同/长期资产）
- `pendingSelection`：本回合已选择的决策卡 id 列表
- `eventLog`：按回合记录事件（每条事件带教学解释）
- `history`：指标趋势，用于结局分析（可选，MVP 可简化）

### 2.2 状态机（State Machine）

页面交互可抽象为：

- `LOBBY`（选择品牌/新开/继续）
- `SELECTING`（选择决策卡）
- `RESOLVING`（结算动画进行中）
- `SHOWING_RESULT`（展示事件与指标变化）
- `ENDING`（结局页）

UI 通过状态切换控制按钮禁用、动画触发与渲染内容。

## 3. 动画与视觉反馈方案

MVP 动画目标是“足够有反馈但不重资源”：

1. **指标变化**
   - 用 CSS keyframes 实现数字跳动与发光
   - 状态切换时标记 `delta`，渲染 `+x/-x` 标签并自动淡出
2. **决策卡锁定**
   - 选择后卡片翻转（CSS transform 3D 或简化的缩放/滑动）
   - 结算开始时卡片置灰并展示锁定状态
3. **事件时间线**
   - 事件卡以像素滑入动画进入（Framer Motion `AnimatePresence`）
4. **回合结算弹层**
   - 用像素边框组件 `PixelFrame` 包裹结算内容
   - 结算完成时用“轻震动/呼吸发光”提示

优先使用：
- CSS 动画（轻量）
- Framer Motion（弹层、列表出现、状态切换）

## 4. Next.js 与前端工程

1. 使用 Next.js App Router
2. 页面目录建议：
   - `/app/page.tsx`：首页
   - `/app/play/page.tsx`：游戏主界面
   - `/app/ending/page.tsx`：结局展示
3. 静态资源：
   - `/public/sprites/` 放像素头像/图标占位（可先用 CSS 或纯图块）
4. Tailwind：
   - 在 `tailwind.config.ts` 中配置像素风配色与字体/阴影
   - 使用自定义 `theme` 变量让后续风格统一

## 5. 可离线实现（无后端）

- 使用 `localStorage` 保存 `GameState`
- 为避免读取未初始化，提供容错：
  - 状态版本不匹配时执行“重置或迁移”
  - JSON parse 失败则重置并提示

## 6. 测试与质量（MVP 轻量）

- 主要逻辑在 `lib/imc/`：建议写少量单元测试（可选）
- 至少要覆盖：
  - 结算函数在不同选择组合下会产生合理的指标变化方向
  - 舆情阈值下危机事件会触发
  - 预算不足时决策选择校验

MVP 若不做测试，也要在代码结构上保证引擎是可复用、可测试的纯函数。

