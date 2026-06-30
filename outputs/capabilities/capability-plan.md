# Capability Plan

1. goal_discovery
- Page type: single_choice_page
- Data key: mainGoal
- Required for: summary, plan_personalization, paywall_bridge
- Reason: Anchor the user's desired transformation so the generated plan and paywall promise feel personal.

2. body_focus
- Page type: multi_choice_page
- Data key: focusAreas
- Required for: plan_personalization, summary, paywall_bridge
- Reason: Identify visible or felt problem areas so the plan can claim relevance before the paywall.

3. goal_trust_bridge
- Page type: intro_page
- Data key: none
- Required for: trust_building, section_transition
- Reason: Pause after early goal answers to convert raw answers into belief that a personalized plan is being built.

4. experience_level
- Page type: single_choice_page
- Data key: fitnessLevel
- Required for: plan_difficulty, summary, paywall_bridge
- Reason: Set starting difficulty and reduce the risk that the generated plan feels too easy or too hard.

5. training_readiness
- Page type: single_choice_page
- Data key: capabilityLevel
- Required for: plan_difficulty, plan_generation, risk_reduction
- Reason: Capture readiness so the plan can start credibly and avoid overpromising intensity.

6. current_activity
- Page type: single_choice_page
- Data key: activeLevel
- Required for: plan_pacing, summary, paywall_bridge
- Reason: Estimate current activity baseline to shape pacing and make the result page feel earned.

7. blockers
- Page type: multi_choice_page
- Data key: barriers
- Required for: objection_handling, paywall_bridge, plan_adherence
- Reason: Collect the objections the paywall and plan-ready pages need to answer before asking for payment.

8. limitations
- Page type: multi_choice_page
- Data key: limitations
- Required for: plan_safety, plan_personalization, trust_building
- Reason: Ask for constraints before body metrics so the product feels careful, not generic.

9. routine_trust_bridge
- Page type: intro_page
- Data key: none
- Required for: trust_building, section_transition
- Reason: Transition from body/training answers into schedule questions without making the flow feel like a survey.

10. time_budget
- Page type: single_choice_page
- Data key: dailyTime
- Required for: plan_schedule, paywall_bridge
- Reason: Make the plan feel immediately usable by matching session length to the user's real day.

11. weekly_frequency
- Page type: single_choice_page
- Data key: weeklyFrequency
- Required for: plan_schedule, plan_generation
- Reason: Turn motivation into a concrete schedule variable that can be shown back in plan-ready copy.

12. preferred_time
- Page type: single_choice_page
- Data key: preferredTime
- Required for: plan_schedule, adherence_copy
- Reason: Collect a lightweight adherence signal so plan copy can feel more concrete.

13. energy_level
- Page type: single_choice_page
- Data key: energyLevel
- Required for: plan_pacing, difficulty_adjustment
- Reason: Use energy level to tune intensity and make the plan feel sensitive to real-life readiness.

14. motivation_reason
- Page type: single_choice_page
- Data key: motivationReason
- Required for: paywall_bridge, plan_ready_copy
- Reason: Capture the emotional payoff that can be echoed before checkout.

15. support_style
- Page type: single_choice_page
- Data key: accountabilityStyle
- Required for: plan_tone, retention_copy
- Reason: Let the plan promise match the user's preferred coaching style.
