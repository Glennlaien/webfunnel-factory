# Billing Platform Frontend API Reference

本文档只保留前端页面必须直接调用的 API。Webhook、Admin、Outbox、第三方回放、内部调试、兼容接口不放在本文档中。

Base URL:

```text
https://billing-dev.cloud.7mfitness.com
```

接口路径中的 `{appCode}` 是项目编码，例如 `oog126_dev`。

---

## 1. 前端接入流程

```text
1. 进入页面，读取 URL 上的 lpid
2. 调商品接口获取 paywall 商品和 priceId
3. 调匿名用户接口创建 Firebase 用户
4. 前端 Firebase Web SDK 使用 customToken 登录
5. 用 Firebase ID Token 调 /users/current 绑定当前用户
6. 用户选择 priceId
7. 按支付方式调用 Stripe 或 PayPal 订阅接口
8. 支付完成后，轮询/刷新当前订阅摘要和权益接口
9. 用户注册时调用 register-from-anonymous，把匿名 UID 升级为正式账号
10. 如需主动发送注册、支付成功、优惠邮件，调用模板邮件接口
11. 后续登录调用 login
```

前端必须集成 Firebase Web SDK。`POST /users/anonymous` 返回的是 `customToken`，不能直接作为 Billing API 的 Bearer Token 使用。

正确用法:

```js
const anonymous = await createAnonymousUser();
await signInWithCustomToken(auth, anonymous.data.customToken);
const idToken = await auth.currentUser.getIdToken();
```

后续需要认证的 Billing API 使用:

```http
Authorization: Bearer <Firebase ID Token>
```

---

## 2. 认证要求

| 接口 | 是否需要 Bearer Token |
|---|---:|
| `POST /billing/{appCode}/v1/users/anonymous` | 否 |
| `GET /billing/{appCode}/v1/paywalls/resolve/offers` | 否 |
| `POST /billing/{appCode}/v1/users/current` | 是 |
| `POST /billing/{appCode}/v1/users/register-from-anonymous` | 是 |
| `POST /billing/{appCode}/v1/users/login` | 否 |
| `POST /billing/{appCode}/v1/emails/template` | 是 |
| `POST /billing/{appCode}/v1/checkout/stripe/embedded-session` | 是 |
| `POST /billing/{appCode}/v1/checkout/paypal/subscription` | 是 |
| `GET /billing/{appCode}/v1/subscriptions` | 是 |
| `GET /billing/{appCode}/v1/entitlements` | 是 |
| `POST /billing/{appCode}/v1/subscriptions/cancel` | 是 |

Firebase ID Token 中的 UID 必须与请求参数或请求体里的 `uid` 一致。

前端展示“当前订阅卡片”时使用 `GET /billing/{appCode}/v1/subscriptions`。详细状态、历史列表、provider 明细和调试接口不放在本文档中。

---

## 3. 通用响应格式

成功:

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {}
}
```

失败:

```json
{
  "success": false,
  "code": "BAD_REQUEST",
  "message": "请求参数错误。",
  "data": null
}
```

常见 HTTP 状态码:

| HTTP | 含义 |
|---:|---|
| 200 | 成功 |
| 400 | 参数错误、业务规则不满足 |
| 401 | 缺少或无效 Token |
| 403 | Token UID 与请求 UID 不一致，或用户无权访问该 app |
| 429 | 请求过于频繁 |
| 500 | 服务内部错误 |
| 503 | 第三方依赖暂不可用，例如 Firebase 注册失败 |

常见错误码:

| Code | 说明 |
|---|---|
| `BAD_REQUEST` | 请求体格式错误或字段类型不对 |
| `AUTH_REQUIRED` | 缺少 `Authorization` |
| `AUTH_TOKEN_INVALID` | Token 无效 |
| `AUTH_UID_MISMATCH` | Token UID 与请求 UID 不一致 |
| `AUTH_APPCODE_FORBIDDEN` | 用户未绑定当前 app |
| `PROJECT_DISABLED` | 项目已禁用 |
| `RATE_LIMIT_EXCEEDED` | 请求触发限流 |
| `FIREBASE_ANONYMOUS_SIGNUP_ERROR` | 匿名用户创建失败 |

---

## 4. CORS

前端浏览器跨域调用 Billing API 时，后端必须允许前端域名。

开发环境可以放开所有来源；生产环境应该只允许正式前端域名。

前端不要使用 cookie/session 做 Billing API 鉴权，统一使用:

```http
Authorization: Bearer <Firebase ID Token>
```

---

## 5. 匿名用户入口

创建匿名用户。用户首次进入支付流程前调用。

```http
POST /billing/{appCode}/v1/users/anonymous
```

不需要请求体。

示例:

```bash
curl -X POST "https://billing-dev.cloud.7mfitness.com/billing/oog126_dev/v1/users/anonymous"
```

响应:

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

前端拿到 `customToken` 后，必须调用 Firebase Web SDK:

```js
await signInWithCustomToken(auth, customToken);
const idToken = await auth.currentUser.getIdToken();
```

---

## 6. 当前用户绑定

把当前 Firebase 用户绑定到 Billing 用户。匿名登录后、进入支付前建议调用一次。

```http
POST /billing/{appCode}/v1/users/current
```

需要认证:

```http
Authorization: Bearer <Firebase ID Token>
```

请求体:

```json
{
  "uid": "firebase_uid",
  "firebaseUid": "firebase_uid",
  "email": "user@example.com"
}
```

字段说明:

| 字段 | 必填 | 说明 |
|---|---:|---|
| `uid` | 是 | 当前 Firebase UID，必须等于 Token UID |
| `firebaseUid` | 否 | 通常与 `uid` 相同 |
| `email` | 否 | 当前用户邮箱，匿名用户可为空 |

响应:

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

---

## 7. 匿名用户升级正式账号

支付后注册账号时调用。该接口会把匿名 UID 升级为正式邮箱账号，订阅仍然挂在同一个 UID 下。

```http
POST /billing/{appCode}/v1/users/register-from-anonymous
```

需要认证:

```http
Authorization: Bearer <匿名用户 Firebase ID Token>
```

请求体:

```json
{
  "uid": "firebase_uid",
  "email": "user@example.com",
  "password": "12345678"
}
```

响应:

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

前端收到新的 `customToken` 后，应再次用 Firebase Web SDK 登录或刷新当前用户 Token。

---

## 8. 正式账号登录

用户已有账号时调用。

```http
POST /billing/{appCode}/v1/users/login
```

不需要 Bearer Token。

请求体:

```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

响应:

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

前端仍然需要用 `customToken` 调 `signInWithCustomToken()`，然后用 Firebase ID Token 调后续需要认证的接口。

---

## 9. 发送模板邮件

前端需要主动发送业务邮件时调用，例如注册完成邮件、支付成功邮件、限时优惠邮件。

```http
POST /billing/{appCode}/v1/emails/template
```

需要认证:

```http
Authorization: Bearer <Firebase ID Token>
```

请求体:

```json
{
  "uid": "firebase_uid",
  "to": "user@example.com",
  "templateCode": "PAYMENT_SUCCESS",
  "lang": "en",
  "model": {
    "APP_NAME": "Workout For Women",
    "CUSTOMER_NAME": "Swift",
    "PURCHASE_DATE": "Jun 9, 2026",
    "SUBSCRIPTION_PRICE": "USD 9.99",
    "REGISTER_URL": "https://your-frontend-domain.com/?page=register"
  }
}
```

字段说明:

| 字段 | 必填 | 说明 |
|---|---:|---|
| `uid` | 是 | 当前 Firebase UID，必须等于 Token UID |
| `to` | 是 | 收件人邮箱 |
| `templateCode` | 是 | 业务模板编码，后端会按项目配置映射到 Resend 模板 |
| `lang` | 否 | 语言代码，例如 `en`、`es`；无匹配语言模板时使用默认模板 |
| `model` | 是 | 模板变量对象，变量名需要与 Resend 模板中使用的变量一致 |

当前可用 `templateCode`:

| templateCode | 用途 | 配置 key |
|---|---|---|
| `PAYMENT_SUCCESS` | 支付成功/订阅成功邮件 | `paySuccess` |
| `PAY_SUCCESS` | `PAYMENT_SUCCESS` 的兼容写法 | `paySuccess` |
| `CREATE_ACCOUNT` | 注册/创建账号邮件 | `createAccount` |
| `EXCLUSIVE_OFFER_61` | 61% 限时优惠邮件 | `exclusiveOffer61` |
| `PAYMENT_FAILED` | 支付失败邮件 | `paymentFailed` |

响应:

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "queued": 1
  }
}
```

注意:

- 该接口是异步发送：请求成功表示邮件已写入 outbox，不代表邮件已经到达收件箱。
- 实际使用哪个 Resend 模板，由当前 `{appCode}` 的 `email.template_map` 配置决定。
- 自动支付邮件也会走同一套模板配置：Stripe 支付成功会映射到 `paySuccess`，Stripe/PayPal 支付失败会映射到 `paymentFailed`。

---

## 10. 商品/价格展示

前端 paywall 页面只使用这个商品接口。

```http
GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={lpid}&discountType={discountType}
```

不需要认证。

`placementCode` 就是投放链接 URL 上的 `lpid`。

`discountType` 可选，用来决定每个 offer 使用哪一种首期价格:

| discountType | initialPrice | renewalPrice |
| --- | --- | --- |
| `normal` | `bp_price.discount_type = normal` 的价格 | `bp_price.discount_type = normal` 的价格 |
| `discount` | `bp_price.discount_type = discount` 的价格 | `bp_price.discount_type = normal` 的价格 |
| `further_discount` | `bp_price.discount_type = further_discount` 的价格 | `bp_price.discount_type = normal` 的价格 |

不传 `discountType` 时，后端保持兼容旧行为：优先返回 `discount`，其次 `further_discount`，最后 `normal`。

示例投放链接:

```text
https://your-frontend-domain.com/?lpid=O2MGB
```

前端读取:

```js
const lpid = new URLSearchParams(window.location.search).get("lpid");
```

请求:

```bash
curl "https://billing-dev.cloud.7mfitness.com/billing/oog126_dev/v1/paywalls/resolve/offers?placementCode=O2MGB&discountType=discount"
```

响应结构:

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
        "productId": "LAI-PROD-HcEIWD33aqXo",
        "priceId": "LAI-PRI-Sly87OplUKuP",
        "title": "1-WEEK TRIAL",
        "sortOrder": 0,
        "recommended": false,
        "initialPrice": {
          "amount": 4.99,
          "priceText": "$4.99"
        },
        "renewalPrice": {
          "amount": 4.99,
          "priceText": "$4.99"
        },
        "billingInterval": "week",
        "billingIntervalCount": 1
      },
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
      },
      {
        "productId": "LAI-PROD-ph9n89Z2cRXAW",
        "priceId": "LAI-PRI-ZtCoKKv77Hg2",
        "title": "12-WEEK PLAN",
        "sortOrder": 2,
        "recommended": false,
        "initialPrice": {
          "amount": 18.99,
          "priceText": "$18.99"
        },
        "renewalPrice": {
          "amount": 89.99,
          "priceText": "$89.99"
        },
        "billingInterval": "week",
        "billingIntervalCount": 12
      }
    ]
  }
}
```

前端只渲染 `offers[]`，不要再遍历 `products[].prices[]`。

前端下单时只传 `offer.priceId`。不要传 Stripe `price_xxx`、PayPal plan id 或前端 mock price id。

---

## 11. Stripe 订阅支付

创建 Stripe Embedded Checkout Session。

```http
POST /billing/{appCode}/v1/checkout/stripe/embedded-session
```

需要认证:

```http
Authorization: Bearer <Firebase ID Token>
```

请求体:

```json
{
  "uid": "firebase_uid",
  "email": "user@example.com",
  "priceId": "LAI-PRI-xxxxxxxxxxxx",
  "returnUrl": "https://your-frontend-domain.com/?page=payment_success&session_id={CHECKOUT_SESSION_ID}",
  "idempotencyKey": "firebase_uid:LAI-PRI-xxxxxxxxxxxx:client_timestamp",
  "visitor": true
}
```

字段说明:

| 字段 | 必填 | 说明 |
|---|---:|---|
| `uid` | 是 | 当前 Firebase UID，必须等于 Token UID |
| `email` | 否 | 用户邮箱 |
| `priceId` | 是 | 商品接口返回的 `offers[].priceId` |
| `returnUrl` | 是 | Stripe 支付完成后的前端返回地址 |
| `idempotencyKey` | 是 | 幂等键，同一次创建请求保持不变 |
| `visitor` | 是 | 是否匿名/访客购买，布尔值，只能传 `true` 或 `false` |

响应:

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "paymentOrderId": 149,
    "sessionId": "cs_test_xxx",
    "clientSecret": "cs_test_xxx_secret_xxx"
  }
}
```

前端用 `clientSecret` 初始化 Stripe Embedded Checkout。

注意：`visitor` 不是问卷对象。如果传成对象或字符串，后端会返回 `BAD_REQUEST`。

---

## 12. PayPal 订阅支付

创建 PayPal 订阅并返回 PayPal 授权链接。

```http
POST /billing/{appCode}/v1/checkout/paypal/subscription
```

需要认证:

```http
Authorization: Bearer <Firebase ID Token>
```

请求体:

```json
{
  "uid": "firebase_uid",
  "email": "user@example.com",
  "priceId": "LAI-PRI-xxxxxxxxxxxx",
  "returnUrl": "https://your-frontend-domain.com/?page=payment_success",
  "cancelUrl": "https://your-frontend-domain.com/?page=paywall",
  "idempotencyKey": "firebase_uid:LAI-PRI-xxxxxxxxxxxx:client_timestamp",
  "visitor": true
}
```

响应:

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "paymentOrderId": 149,
    "providerSubscriptionId": "I-XXXXXXXXXXXX",
    "approveUrl": "https://www.sandbox.paypal.com/checkoutnow?token=xxxxx",
    "status": "APPROVAL_PENDING",
    "displayStatus": "WAITING_FOR_PAYMENT",
    "displayMessage": "Payment is waiting for confirmation.",
    "nextAction": "REDIRECT_TO_CHECKOUT"
  }
}
```

前端收到 `approveUrl` 后跳转到 PayPal。用户授权后会回到 `returnUrl`，订阅是否真正成功以后端收到 PayPal webhook 并更新状态为准。

---

## 13. 查询当前订阅摘要

支付完成页、账号页、注册后展示当前订阅方案时调用。这个接口返回前端可直接展示的摘要，不返回 provider 明细和历史订阅列表。

前端不要再读取 `data.items`。当前订阅信息直接从 `data.plan` 和 `data.billing` 读取。

```http
GET /billing/{appCode}/v1/subscriptions?uid={uid}
```

需要认证:

```http
Authorization: Bearer <Firebase ID Token>
```

响应:

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
      "autoRenew": true,
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

未订阅时 `subscribed=false`，`status=NONE`，`displayStatus=NO_ACTIVE_SUBSCRIPTION`，`plan` 中的字段为空，`billing` 中的时间字段为 `null`。

---

## 14. 查询当前用户权益

前端判断用户是否可访问付费内容时调用。

```http
GET /billing/{appCode}/v1/entitlements?uid={uid}
```

需要认证:

```http
Authorization: Bearer <Firebase ID Token>
```

响应:

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

前端通常只需要判断 `data.entitled === true`。

---

## 15. 取消当前订阅

用户在 Profile 页面点击取消订阅时调用。前端从第 13 节 `data.management.subscriptionId` 读取 `subscriptionId`。

```http
POST /billing/{appCode}/v1/subscriptions/cancel
```

需要认证:

```http
Authorization: Bearer <Firebase ID Token>
```

请求体:

```json
{
  "uid": "firebase_uid",
  "subscriptionId": "sub_xxx"
}
```

响应:

```json
{
  "success": true,
  "code": "OK",
  "message": "success",
  "data": {
    "status": "CANCEL_SCHEDULED",
    "displayStatus": "CANCELS_AT_PERIOD_END",
    "validUntil": "2026-06-24T10:15:35"
  }
}
```

前端不要传 `providerCode`、`cancelAtPeriodEnd` 或 provider 原生参数；这些由后端根据订阅实例处理。
