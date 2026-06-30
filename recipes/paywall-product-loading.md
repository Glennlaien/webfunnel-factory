# Paywall Product Loading Recipe

Use this recipe for frontend paywall product and price hydration.

## Standard Flow

1. Read `lpid` from the URL query:
   `new URLSearchParams(location.search).get("lpid")`.
2. If the URL has no `lpid`, use the explicit run config field `placementCode`.
3. Call:
   `GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={lpid}`.
4. Read products from `data.products[]`.
5. Flatten prices from `data.products[].prices[]`.
6. Render one plan card per price.
7. Use Billing `price.priceId` as the checkout `priceId`.
8. Prefer backend display fields:
   - plan title: `product.display.name`, then `product.productName`
   - price: `price.display.priceText`, then `price.priceText`
   - billing period: `price.display.billingPeriodText`, then `price.billingPeriodText`
   - badge: `price.display.badgeText`, then `price.badge`, then `product.display.badgeText`
   - discount: `price.display.discountText`, then `price.discountText`
   - trial: `price.display.trialText`, then `price.trialText`
9. If the API fails or returns no prices, keep API-ready mock plans as visible fallback.

## Boundary

`lpid` and `placementCode` are the same frontend concept. They are not `paywallCode`.

The following endpoints are internal or debug tools for frontend funnel purposes:

- `GET /billing/{appCode}/v1/products`
- `GET /billing/{appCode}/v1/paywalls/{paywallCode}/products`
- `GET /billing/{appCode}/v1/paywalls/{paywallCode}/offers`

Do not use those endpoints for ordinary generated frontend paywall product display.
