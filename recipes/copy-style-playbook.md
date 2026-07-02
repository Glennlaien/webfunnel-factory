# Copy Style Playbook

This playbook controls Web2App funnel copy. It is not final page copy. It is a reusable writing strategy that the copy planner must apply to each product, audience, and funnel.

## Core Principle

The onboarding should feel like a personalized plan is being built, not like a generic survey. Every screen must do at least one of these jobs:

- collect a useful personalization signal
- reduce doubt or anxiety
- create a small commitment
- explain why the next answer matters
- build trust before the paywall
- make the final plan feel earned

Do not pad the funnel with filler. Long OB works only when each page feels purposeful.

## Global Voice

- Short, direct, warm, and confident.
- Use plain language that sounds like a premium consumer health product.
- Write for the exact audience in `productProfile`, not for generic fitness users.
- Mirror the user's likely self-talk, especially in options.
- Avoid robotic phrasing, database labels, or repeated generic wording.
- Avoid fake certainty, medical diagnosis, guaranteed outcomes, fake social proof, or fake app-store claims.
- Do not mention AI, agents, algorithms, internal fields, or prompt logic.

## BetterMe-Inspired Pattern

Use this as a structural pattern, not copied text:

- one simple idea per screen
- many low-friction micro-questions
- occasional educational or trust-building transition screens
- answer choices that feel personally recognizable
- repeated reassurance that the plan adapts to age, body context, ability, schedule, barriers, and motivation
- result/paywall copy that feels like a reveal of the user's personalized plan

## Question Pages

Question page copy should be easy to answer quickly.

Title:

- Ask one clear question.
- Usually under 12 words.
- Prefer conversational wording.
- Avoid repeating "What is your main goal?" across products.

Subtitle:

- Explain why this answer matters.
- Keep it short.
- Connect the answer to personalization, safety, schedule, motivation, or visible progress.

Options:

- Use natural user-facing language, not internal taxonomy.
- Make options mutually distinct.
- Keep labels short enough for mobile.
- Use audience-specific phrases only when they are believable and respectful.
- For sensitive body or health topics, be direct but not shaming.

Good option style:

- "I want a gentle start"
- "My knees need extra care"
- "I lose motivation after a few days"
- "I want to feel stronger in daily life"

Poor option style:

- "Plan personalization"
- "Adherence barrier"
- "High-intensity transformation"
- "Problem area selection"

## Multi-Choice Pages

Use multi-choice when several answers can be true, such as target zones, barriers, limitations, motivations, or preferred support.

- Subtitle should usually say why selecting multiple answers helps the plan.
- Avoid making all options feel equally generic.
- Selected items should imply the plan will adapt later.

## Intro / Transition Pages

Intro pages are not decoration. They are trust bridges.

Each intro page should include:

- a clear headline
- a supportive paragraph, usually 45-90 words
- one useful idea, not multiple competing ideas
- a reason the next section matters

Common intro page jobs:

- validate the user's situation
- explain why the method fits the audience
- reassure safety or accessibility
- translate previous answers into plan confidence
- create momentum before a more personal question block
- prepare the user for paywall by making personalization feel real

Avoid:

- empty hype
- generic motivational posters
- "you can do it" filler
- unsupported social proof
- long article-like education

## Sensitive Health And Body Copy

For age, weight, body type, BMI, pain, injury, mobility, stress, sleep, or medical-adjacent topics:

- be respectful and non-shaming
- explain why the data helps personalize the plan
- avoid diagnosis
- avoid guaranteed medical improvement
- avoid fearmongering
- use supportive but practical language

Examples:

- "This helps us set a starting pace that feels challenging but safe."
- "We use this to adjust intensity, recovery, and exercise options."
- "Your answer helps us avoid movements that may feel uncomfortable."

## Plan Generation Copy

Plan generation should feel like the system is finishing personalization.

Use:

- short progress status text
- 2-3 short yes/no follow-up questions
- rotating testimonials or proof cards matching the product audience
- a calm sense of analysis and assembly

Follow-up questions should feel like missing personalization details, not passive decoration.

Good follow-up style:

- "Should we keep the first week gentle?"
- "Should we prioritize the areas you selected?"
- "Should your plan fit short sessions?"

Avoid:

- "Saved" chips
- questions that do not require an answer
- long paragraphs
- fake technical language

## Summary And Plan Ready Copy

These screens must prove the onboarding was used.

Summary should:

- reflect body metrics and previous answers
- show a supportive interpretation
- avoid shame
- make the user feel the plan is becoming specific

Plan ready should:

- be concise
- reveal a believable path
- connect target date or progress chart to the user's inputs
- avoid overloading the screen with benefits

## Paywall Copy

The paywall should feel like the natural reveal of a personalized plan, not a sudden sales page.

Recommended order:

- personalized result preview
- body or goal comparison
- concise value headline
- plan/offer cards
- primary CTA
- subscription disclosure
- proof, app screenshots, testimonials, guarantee, FAQ

Paywall headline:

- emphasize the user's personalized plan
- do not overpromise
- connect to the user's goal, body profile, schedule, or starting level

Highlights:

- product-specific
- concrete
- short
- not generic app promises

Testimonials:

- match gender, age, modality, intensity, and life stage
- use names and concerns that fit the product
- avoid fake exact numbers unless provided by real data

FAQ:

- answer real objections for this audience
- include safety, equipment, timing, cancellation, and missed-day concerns when relevant
- do not invent medical or legal guarantees

## Audience Matching Rules

- If `genderFocus` is female, use female names and women-centered language.
- If `genderFocus` is male, use male names and men-centered language.
- If `lifeStage` is senior, prioritize safety, readability, comfort, independence, balance, mobility, and confidence.
- If the product is strength, military, or calisthenics, use discipline and progress language without sounding aggressive.
- If the product is yoga, tai chi, chair, recovery, or low impact, use calm, steady, reassuring language.
- If the product is weight loss or body transformation, balance aspiration with trust and avoid shame.

## Anti-Patterns

Avoid these patterns:

- repeating the same question structure on every screen
- every subtitle saying "This helps personalize your plan"
- options that are too abstract
- intro pages with no real information
- forcing gender identity questions into gender-specific products
- fake user counts or fake ratings
- clinical claims without evidence
- long dense copy on small mobile screens
- sudden hard sell before enough trust has been built

## Output Discipline

When generating copy:

- preserve ids, data keys, page types, and option values
- rewrite only user-facing text
- keep mobile readability in mind
- make the product feel different from other apps
- keep the funnel cohesive from first question to paywall
