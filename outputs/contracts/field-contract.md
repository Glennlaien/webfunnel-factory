# Field Contract

## ageGroup
- Page: age_group
- Capability: age_group
- Source: fixed_runtime_trunk
- Value shape: string
- Required for: summary, plan_personalization, paywall_bridge
- Used by: firestore, analytics, summary, planGeneration, paywall

## ageNum
- Page: exact_age
- Capability: exact_age
- Source: fixed_runtime_trunk
- Value shape: number
- Required for: summary, plan_personalization, plan_pacing
- Used by: firestore, analytics, summary, planGeneration

## mainGoal
- Page: fitness_goal_discovery
- Capability: goal_discovery
- Source: capability_plan
- Value shape: string
- Required for: summary, plan_personalization, paywall_bridge
- Used by: firestore, analytics, summary, planGeneration, paywall

## focusAreas
- Page: fitness_body_focus
- Capability: body_focus
- Source: capability_plan
- Value shape: string[]
- Required for: plan_personalization, summary, paywall_bridge
- Used by: firestore, analytics, summary, planGeneration, paywall

## fitnessLevel
- Page: fitness_experience_level
- Capability: experience_level
- Source: capability_plan
- Value shape: string
- Required for: plan_difficulty, summary, paywall_bridge
- Used by: firestore, analytics, summary, planGeneration, paywall

## capabilityLevel
- Page: fitness_training_readiness
- Capability: training_readiness
- Source: capability_plan
- Value shape: string
- Required for: plan_difficulty, plan_generation, risk_reduction
- Used by: firestore, analytics, planGeneration

## activeLevel
- Page: fitness_current_activity
- Capability: current_activity
- Source: capability_plan
- Value shape: string
- Required for: plan_pacing, summary, paywall_bridge
- Used by: firestore, analytics, summary, planGeneration, paywall

## barriers
- Page: fitness_blockers
- Capability: blockers
- Source: capability_plan
- Value shape: string[]
- Required for: objection_handling, paywall_bridge, plan_adherence
- Used by: firestore, analytics, planGeneration, paywall

## limitations
- Page: fitness_limitations
- Capability: limitations
- Source: capability_plan
- Value shape: string[]
- Required for: plan_safety, plan_personalization, trust_building
- Used by: firestore, analytics, planGeneration

## dailyTime
- Page: fitness_time_budget
- Capability: time_budget
- Source: capability_plan
- Value shape: string
- Required for: plan_schedule, paywall_bridge
- Used by: firestore, analytics, planGeneration, paywall

## weeklyFrequency
- Page: fitness_weekly_frequency
- Capability: weekly_frequency
- Source: capability_plan
- Value shape: string
- Required for: plan_schedule, plan_generation
- Used by: firestore, analytics, planGeneration

## preferredTime
- Page: fitness_preferred_time
- Capability: preferred_time
- Source: capability_plan
- Value shape: string
- Required for: plan_schedule, adherence_copy
- Used by: firestore, analytics, planGeneration

## energyLevel
- Page: fitness_energy_level
- Capability: energy_level
- Source: capability_plan
- Value shape: string
- Required for: plan_pacing, difficulty_adjustment
- Used by: firestore, analytics, planGeneration

## motivationReason
- Page: fitness_motivation_reason
- Capability: motivation_reason
- Source: capability_plan
- Value shape: string
- Required for: paywall_bridge, plan_ready_copy
- Used by: firestore, analytics, planGeneration, paywall

## accountabilityStyle
- Page: fitness_support_style
- Capability: support_style
- Source: capability_plan
- Value shape: string
- Required for: plan_tone, retention_copy
- Used by: firestore, analytics, planGeneration

## height
- Page: height
- Capability: height
- Source: fixed_runtime_trunk
- Value shape: height_measurement
- Required for: summary, bmi, plan_personalization
- Used by: firestore, analytics, summary, planGeneration

## currentWeight
- Page: current_weight
- Capability: current_weight
- Source: fixed_runtime_trunk
- Value shape: weight_measurement
- Required for: summary, bmi, plan_personalization, paywall_bridge
- Used by: firestore, analytics, summary, planGeneration, paywall

## targetWeight
- Page: target_weight
- Capability: target_weight
- Source: fixed_runtime_trunk
- Value shape: weight_measurement
- Required for: summary, goal_delta, plan_prediction, paywall_bridge
- Used by: firestore, analytics, summary, planGeneration, paywall

## email
- Page: email
- Capability: email_capture
- Source: fixed_runtime_trunk
- Value shape: email_string
- Required for: lead_capture, account_recovery
- Used by: firestore, analytics

## accountEmail
- Page: account_create
- Capability: account_create
- Source: fixed_runtime_trunk
- Value shape: email_string
- Required for: account_creation
- Used by: firestore, analytics
