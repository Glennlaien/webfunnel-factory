# Billing API 返回结构优化建议

本文档从当前 React Runtime 前端的真实使用角度，检查 Billing API 返回结构是否字段过多、是否存在无效字段、以及哪些字段会让前端和后续 Agent 生成逻辑变复杂。

注意：

- 当前可调用接口的唯一真相源仍然是 `inputs/api-reference.md`。
- 本文档不是新的接口文档，而是给后端的返回结构优化建议。
- 目标是让前端只拿到它真正需要的数据，避免 provider 内部字段、debug 字段、历史字段、营销字段混入前端契约。

## 当前前端真正需要什么

当前 Web2App Runtime 只需要 Billing API 完成这些事情：

- 创建匿名 Firebase 用户，拿到 `uid/customToken`。
- 登录或注册账号，拿到 `uid/customToken`。
- 在 checkout 前绑定/更新当前用户。
- 加载 paywall 商品列表，让用户选择一个 `priceId`。
- 创建 Stripe Embedded Checkout，拿到 `clientSecret`。
- 在 Profile 页面展示当前订阅摘要。
- 用户点击取消订阅时，调用取消接口。

前端不需要：

- provider 内部字段
- debug 字段
- admin 后台字段
- 多语言 localizations
- 历史订阅列表
- entitlement 明细
- 后端拼好的营销文案
- RevenueCat / Stripe / PayPal 的内部映射字段

## 1. 创建匿名用户接口

接口：

```http
POST /billing/{appCode}/v1/users/anonymous
```

当前前端用到的字段：

- `uid`
- `customToken`

前端拿到 `customToken` 后，会调用 Firebase Web SDK 的 `signInWithCustomToken()`，然后再拿 Firebase ID Token 作为后续 Billing API 的 Bearer Token。

建议返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "uid": "firebase_uid",
    "customToken": "firebase_custom_token"
  }
}
```

建议删除或不返回给前端的字段：

- `tokenType`
- `appCode`
- `status`

原因：

- `tokenType` 对这个接口来说永远是隐含的，不需要前端判断。
- `appCode` 已经在请求路径里了。
- `status` 在 Firebase 登录前没有实际使用价值。

## 2. 当前用户绑定接口

接口：

```http
POST /billing/{appCode}/v1/users/current
```

当前前端使用场景：

- 邮箱填写后同步 email。
- checkout 前确保当前用户已经绑定到 Billing 用户。
- 前端不会渲染这个接口的返回内容。

建议返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "uid": "firebase_uid",
    "email": "user@example.com",
    "status": "ACTIVE"
  }
}
```

更极简也可以：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "ok": true
  }
}
```

不建议在这里返回：

- `subscription`
- entitlement 信息
- provider 信息

原因：

`users/current` 的职责应该是“绑定/更新当前用户”，不是“查询订阅”。订阅展示应该统一从 `GET /subscriptions` 获取。

## 3. 登录和匿名用户升级正式账号

接口：

```http
POST /billing/{appCode}/v1/users/login
POST /billing/{appCode}/v1/users/register-from-anonymous
```

当前前端用到的字段：

- `uid`
- `customToken`
- 可选：`email`

建议返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "uid": "firebase_uid",
    "customToken": "firebase_custom_token"
  }
}
```

如果后端希望确认规范化后的邮箱，也可以返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "uid": "firebase_uid",
    "customToken": "firebase_custom_token",
    "email": "user@example.com"
  }
}
```

建议删除或不返回给前端的字段：

- `tokenType`
- `appCode`
- `status`

原因：

前端只需要建立 Firebase Auth 会话，然后进入 Profile。其他字段不会影响页面逻辑。

## 4. Paywall 商品列表接口

接口：

```http
GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={lpid}&discountType={normal|discount|further_discount}
```

当前前端使用方式：

- 从 URL 读取 `lpid`，作为 `placementCode`。
- 请求 `discountType=discount` 显示第一张 paywall。
- 倒计时结束或关闭 checkout 后，请求 `discountType=further_discount` 显示第二张 paywall。
- 同时请求 `discountType=normal`，用于计算原价和折扣展示。
- 用户选择某个 offer 后，前端只把 `offers[].priceId` 传给 checkout。

建议返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "placementCode": "O2MGB",
    "currency": "USD",
    "defaultPriceId": "LAI-PRI-RJ0DL6KKJ9MM",
    "offers": [
      {
        "productId": "LAI-PROD-pfaZI44iJR4m",
        "priceId": "LAI-PRI-RJ0DL6KKJ9MM",
        "title": "4-WEEK PLAN",
        "sortOrder": 1,
        "recommended": true,
        "initialPrice": {
          "amount": 9.99,
          "priceText": "$9.99"
        },
        "renewalPrice": {
          "amount": 39.99,
          "priceText": "$39.99"
        },
        "billingInterval": "week",
        "billingIntervalCount": 4
      }
    ]
  }
}
```

建议不要返回这些字段：

- `providerCode`
- `providerProductId`
- `providerPriceId`
- `localizations`
- `legalText`
- `subtitle`
- `badgeText`
- `savings`
- `trialText`
- `introOfferText`

原因：

当前前端已经有自己的 paywall 设计和文案规则。商品接口只需要告诉前端：

- 有哪些 offer
- 哪个 offer 默认选中
- 每个 offer 的 `priceId`
- 当前首期价格
- 续费价格
- 计费周期

折扣比例、每日价格、原价划线这些都可以由前端根据 `discountType=normal` 和当前 offer 价格计算出来。

如果法律条款必须由后端控制，不建议把整段 `legalText` 塞进每个 offer。可以改成结构化条款，例如：

```json
{
  "terms": {
    "template": "subscription_renewal",
    "initialPeriodText": "4-week discount plan",
    "renewalPeriodText": "every 4 weeks"
  }
}
```

这样前端仍然可以保持统一样式，同时关键条款由后端控制。

## 5. Stripe Embedded Checkout 接口

接口：

```http
POST /billing/{appCode}/v1/checkout/stripe/embedded-session
```

当前前端用到的字段：

- `clientSecret`

可选用于排查或后续验证：

- `sessionId`
- `paymentOrderId`

建议返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "paymentOrderId": 177,
    "sessionId": "cs_test_xxx",
    "clientSecret": "cs_test_xxx_secret_xxx"
  }
}
```

建议不要返回这些字段给当前前端：

- `mode`
- `displayStatus`
- `displayMessage`
- `nextAction`
- `display`

原因：

Stripe Embedded Checkout 的前端核心依赖只有 `clientSecret`。其他字段更像后端状态机或后台调试字段，当前前端不会用它们做页面分支。

## 6. 当前订阅摘要接口

接口：

```http
GET /billing/{appCode}/v1/subscriptions?uid={uid}
```

当前前端使用场景：

- Profile 页面显示订阅状态。
- 显示当前方案名称。
- 显示有效期。
- 点击取消订阅时，需要知道可取消的订阅标识。

建议返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "subscribed": true,
    "status": "ACTIVE",
    "displayStatus": "ACTIVE",
    "title": "Subscription active",
    "description": "Subscription is active.",
    "plan": {
      "name": "1-WEEK TRIAL",
      "productId": "LAI-PROD-HcEIWD33aqXo",
      "priceId": "LAI-PRI-Sly87OplUKuP"
    },
    "billing": {
      "currentPeriodStart": "2026-06-17T10:15:35",
      "currentPeriodEnd": "2026-06-24T10:15:35",
      "validUntil": "2026-06-24T10:15:35"
    },
    "management": {
      "canCancel": true,
      "subscriptionId": "sub_xxx"
    }
  }
}
```

建议不要在前端摘要接口里返回：

- 重复的 provider 订阅行
- `providerCode`
- `providerCustomerId`
- `providerOrderId`
- `providerSessionId`
- `debug`
- 历史 `items[]` 列表

原因：

Profile 页面需要的是“当前用户当前订阅状态”，不是 provider 对账明细。  
如果后端需要保留 provider 细节，建议放到 admin/debug 接口，不要放在用户前端接口里。

特别建议：

`GET /subscriptions` 最好返回 `management.subscriptionId`。

现在前端取消订阅不应该靠 `priceId` 推断订阅。`priceId` 是价格，不是订阅实例。后端应该返回一个明确可用于取消的订阅标识。

## 7. Entitlements 权益接口

接口：

```http
GET /billing/{appCode}/v1/entitlements?uid={uid}
```

当前 Runtime 状态：

- 标准 Profile 页面已经不需要这个接口。
- 只有当某些页面需要判断“用户是否有权限访问付费内容”时才需要。

如果保留，建议返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "entitled": true,
    "codes": ["premium_access"]
  }
}
```

建议不要返回：

- provider 订阅字段
- 商品字段
- 价格字段
- 续费周期字段
- 展示文案

原因：

权益接口只应该回答一个问题：这个用户是否有某个权限。订阅展示应交给 `/subscriptions`。

## 8. 取消订阅接口

当前 Runtime 使用的接口：

```http
POST /billing/{appCode}/v1/subscriptions/cancel
```

建议请求体：

```json
{
  "uid": "firebase_uid",
  "subscriptionId": "sub_xxx"
}
```

建议返回：

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "status": "CANCELLED",
    "displayStatus": "CANCELLED",
    "validUntil": "2026-06-24T10:15:35"
  }
}
```

不建议要求前端传：

- `providerCode`
- `cancelAtPeriodEnd`
- provider subscription id

原因：

取消订阅是用户动作，不是 provider 管理表单。前端应该只告诉后端“哪个用户要取消哪个订阅”，provider 差异和取消策略应该由后端处理。

## 优先级建议

### 最高优先级

1. 精简 `resolve/offers` 返回结构。
2. 精简 `checkout/stripe/embedded-session` 返回结构。
3. `GET /subscriptions` 增加 `management.subscriptionId`，避免前端误用 `priceId` 取消订阅。

### 中优先级

4. 登录、注册、匿名用户接口统一只返回 `uid/customToken`。
5. `users/current` 不再返回 subscription。
6. `entitlements` 收敛为纯权限判断接口。

### 低优先级

7. 从前端响应中移除 `appCode/status/tokenType` 这类重复字段。
8. provider/debug/admin 字段迁移到后台或调试接口，不进入用户前端 API。

## 总结

推荐的整体原则是：

```text
前端接口只返回页面渲染和下一步动作需要的字段。
provider 内部字段、debug 字段、后台字段不要进入用户前端契约。
```

这样做的好处：

- 前端解析更简单。
- React Runtime 代码更稳定。
- 后续 Agent 不容易误判接口职责。
- 不同支付供应商的差异可以留在后端内部处理。
- Web2App funnel 生成流程更容易复用。
