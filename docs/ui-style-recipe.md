# UI Style Recipe

UI Style Recipe 是 Web2App funnel 的全局视觉配方。

它不是“每个页面单独设计一套样式”，而是为整套 OB / paywall / account flow 提供一个统一的视觉系统。

## 它解决什么问题

之前的问题是：

- 每次产品生成出来都很像。
- 颜色容易默认成绿色、粉色、黑色等模板感配色。
- Stitch/Figma 直接设计再复刻会破坏 runtime 代码包。
- 页面级自由发挥容易导致风格不一致。

UI Style Recipe 的目标是：

```text
Runtime 保持稳定
AI 根据产品选择或生成一套全局视觉配方
页面只选择受控变体
整套 funnel 看起来统一，但不同产品之间能产生差异
```

## 它在流程中的位置

```text
App URL
  -> Product Strategy
  -> Page Map
  -> Copy
  -> UI Style Recipe
  -> Theme / Art Direction / Screen Blueprints
  -> Image Plan
  -> Funnel Config
  -> React Runtime
```

UI Style Recipe 位于产品分析之后、具体 theme 和 screen blueprint 之前。

## 谁负责什么

| 层级 | 负责 |
| --- | --- |
| UI Style Recipe | 整套 funnel 的统一视觉风格 |
| Theme JSON | 把 recipe 转成 runtime 可用的 token |
| Art Direction | 解释为什么这套产品应该这样看起来 |
| Screen Blueprints | 把 recipe 应用到关键页面模板 |
| Funnel Config | 选择页面类型和页面变体 |
| React Runtime | 执行组件逻辑、接口、支付、登录、存储 |

## Recipe 是全局，不是页面级

正确方式：

```json
{
  "recipeId": "hard_training",
  "globalTokens": {
    "primary": "#2D4D3D",
    "background": "#F4F1EC",
    "surface": "#FFFFFF"
  },
  "pageVariants": {
    "single_choice_page": "plain_list",
    "multi_choice_page": "plain_list",
    "summary_page": "metric_report",
    "paywall_page": "long_checkout_landing"
  }
}
```

错误方式：

```json
{
  "age_group": {
    "primary": "pink"
  },
  "summary_page": {
    "primary": "green"
  },
  "paywall_page": {
    "primary": "black"
  }
}
```

页面可以不同，但必须是在同一套风格系统下选择不同组件形态。

## Recipe 控制什么

UI Style Recipe 可以控制：

- 主色
- 背景色
- 文本颜色
- 字体气质
- 字重
- 按钮圆角
- 卡片圆角
- 选项选中态
- 页面间距
- 图片风格
- paywall 模块气质
- desktop 布局方式

它不能控制：

- 支付接口怎么调用
- Firebase 怎么登录
- BMI 怎么计算
- 单位怎么换算
- 是否允许多选空提交
- 页面跳转规则
- Stripe checkout 行为

这些属于 Runtime / Backend Adapter。

## 页面级能控制什么

页面级只能选择受控变体，例如：

| 页面 | 可选变体 |
| --- | --- |
| SingleChoicePage | `plain_list`, `image_grid`, `icon_list` |
| MultiChoicePage | `plain_list`, `image_grid`, `icon_list` |
| IntroPage | `hero_top`, `copy_led`, `proof_led` |
| SummaryPage | `metric_report`, `body_profile_report`, `compact_summary` |
| PlanGenerationPage | `circular_progress`, `proof_led_generation` |
| PaywallPage | `long_checkout_landing`, `result_comparison`, `social_proof_heavy` |

这些变体只改变页面结构和组件使用方式，不改变整套 funnel 的品牌气质。

## 和代码包的关系

代码包是机器。

UI Recipe 是机器的全局皮肤和视觉方向。

Funnel Config 是机器本次要执行的页面配置。

所以后续开发新 app 时，不应该让 Codex 从零写 UI。它应该：

1. 分析产品。
2. 选择或生成 UI Recipe。
3. 生成 theme / art direction / screen blueprints。
4. 生成 funnel config。
5. 让 React Runtime 执行。

## 和设计工具的关系

如果后面重新引入 Figma 或 Stitch，设计工具不应该替代 Runtime。

更合理的用法是：

- UI Recipe 先定义风格方向。
- Figma/Stitch 根据 recipe 画关键页面风格参考。
- React Runtime 学习这种风格和模块层次。
- Runtime 仍然保留原来的业务逻辑、接口和组件能力。

也就是说，设计工具提供视觉参考，不接管业务逻辑。

## 输出文件

机器可读契约：

```text
contracts/ui-style-recipe.contract.json
```

产品运行时输出：

```text
outputs/design/ui-style-recipe.json
outputs/design/theme.json
outputs/design/art-direction.json
outputs/design/screen-blueprints.json
```

中文说明：

```text
docs/ui-style-recipe.md
```

## 判断一个 Recipe 是否合格

一个合格的 UI Style Recipe 应该满足：

- 能解释为什么适合当前产品。
- 有明确受众和产品气质依据。
- 不只是换主色。
- 不会导致页面之间风格割裂。
- 不改变 runtime 业务逻辑。
- 能被 theme、screen blueprint、image plan 继续消费。
- 能让不同产品之间产生可感知差异。
