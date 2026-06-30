# Design Brief For Workout for Women -Lose Weight

## Product Psychology
The funnel should make users feel that create a personalized home fitness plan around goal, body baseline, and schedule. The user has not seen the real app yet, so the onboarding must build belief through progressive questions, visible personalization, and a clear pre-paywall result sequence. The emotional arc is: quick visual start, easy identity creation, goal commitment, capability baseline, routine realism, body baseline, motivation, summary, plan generation, plan ready, and then paywall.

This product is home fitness for women who want an approachable plan for fitness, body confidence, and consistency. The design must come from that audience and modality, not from generic health, fitness, wellness, military, yoga, or senior category colors. Every page should imply that the final paid plan adapts to age, goal, capability level, schedule, limitations, body metrics, motivation, and target outcome.

The funnel should feel like a mobile app onboarding and personalized plan generator, not a landing page or survey. Questions should be app-like, direct, and easy to answer. Intro pages should act as trust bridges with enough copy to explain why the next section matters without turning into a marketing article.

## Theme Candidate Summary
Three candidates were considered: brand aligned, audience optimized, and differentiated. The selected direction should be justified by product profile and user psychology, not by a fixed category shortcut.

The selected theme is not allowed to rely on "fitness equals red", "wellness equals green", "senior equals teal", or "military equals black". It must be supported by the current product's audience, promise, copy, and image direction.

## Color Rationale
Primary color: #315F4A. Use it for CTA, selected option states, progress emphasis, active unit toggles, plan badges, countdown actions, and paywall purchase actions. Background: #F5F4EF. Surface: #FFFFFF. Text: #25282D. Muted text: #70747C. Accent: #7A624B.

Use red only for validation or risk states. Do not use category-default colors without evidence. The long flow needs a stable visual system that can carry many counted OB questions without fatigue.

## Screen By Screen Composition
Entry page: full-bleed product hero image, brand name, login action, and one strong get-started CTA. It should feel like a product portal. The hero should show the product modality in a clean, credible environment.

Age group page: four image cards with clear age differences and diverse representation. This is the first real answer and must wait for anonymous identity creation before advancing. The images should share one background system and crop so the grid feels deliberate.

Choice pages: use centered title, optional subtitle, clear vertical option rhythm, and stable selected states. Single choice may auto-advance. Multi-choice requires at least one selection and uses a bottom CTA. Icon usage is optional; plain list and image grid variants should not force icons.

Intro pages: one contextual 4:3 image, concise headline, supportive paragraph, bottom CTA. These screens validate why the next section matters and should be inserted between major modules rather than randomly.

Height and weight pages: large centered numeric input, sliding unit switch, real-time conversion, range validation, and supportive cards. Current weight shows BMI interpretation. Target weight shows change direction and feasibility messaging.

Summary page: show BMI range visualization, computed profile rows, body-state image, and a supportive insight card. The page must prove that previous answers affected the result.

Plan generation: simple circular progress, slower final percentages, required yes/no follow-up questions as modal overlays, and rotating proof below. It should feel like the system is finishing personalization, not just loading.

Plan ready: animated weight/progress path with at most five points, month plus year labels when the timeline is long, point labels aligned with the curve, and no decorative clutter.

Paywall: vertical layout only. Include sticky countdown bar, now/goal comparison, personalized plan headline, plan cards from real offers, selected-plan disclosure, full-screen Stripe checkout route, app screenshot carousel, user feedback cards, highlights, guarantee, FAQ, and legal links. Avoid boxes nested inside boxes.

Login, account creation, and profile pages: flat, simple, and consistent with the theme. Payment success should route to account creation only. Homepage login routes to login/profile. Profile displays subscription status and cancellation action with clean rows.

## Image Requirements
Large images are controlled by outputs/assets/image-plan.json. Do not invent extra decorative images in React. Required images: entry hero, age-group option images, intro heroes, summary body-state set, paywall now/goal comparison reusing summary body images, and App Store screenshots for the paywall carousel.

Age group images must be half-body, visibly age differentiated, and racially diverse across the four options. Summary body images must use a 3/4-body crop, preserve the same identity across body-state variants, and avoid shame framing. Intro images must be 4:3 and tied to the specific page message. Plan generation does not need a generated image.

## Interaction And State Requirements
The first real OB answer creates anonymous identity. Do not advance until identity creation succeeds on that first answer. Answers are stored in sessionStorage and Firestore as flat user-answer fields keyed by uid. Starting from the entry page clears the current session and creates a fresh visitor flow. Login is for returning users and should not create anonymous identity.

Progress bars count only OB question/input pages with dataKey. Summary, plan generation, plan ready, paywall, payment success, account creation, login, and profile screens do not count toward OB progress. Browser back should not be hard stage locked; instead invalid actions should be hidden or disabled by phase/state.

Blocking API states use a full-screen loading overlay. Buttons must not show raw loading text like Starting... or Saved chips. Ordinary answer persistence after identity exists should not block navigation unless required.

## Boundaries
Do not use phone mockups on desktop. Desktop should remain a vertical web funnel column on a full canvas, not a side-by-side split. Do not create fake app screenshots when real App Store screenshots are available. Do not hardcode paywall products if resolve/offers returns data. Do not use a product migration string replacement. Do not expose Stripe secret keys or backend secrets.
