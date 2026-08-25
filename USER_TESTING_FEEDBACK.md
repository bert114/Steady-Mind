# Aura User Testing Feedback

**Date:** 2026-08-26  
**Source:** P3 acceptance report, active dashboard implementation review, and persona-based UX analysis  
**Scope:** Interaction logging, burnout-risk explanation, recovery recommendations, and recovery rating

## Session Overview

The existing acceptance test verifies that the end-to-end path works technically: a user can log an interaction, reach YELLOW or RED risk, select a recovery activity, submit a rating, and see the result persist after refresh. This feedback focuses on the experience around that path: whether users understand the decision they are making, what the system is asking them to do, and what to do next.

**Overall assessment:** The core workflow is operational, but the interface currently makes users translate internal product language and numeric controls into personal meaning. The largest opportunity is to make the app explain its reasoning in plain language and make each next action obvious.

## Executive Summary

The interaction modal contains the necessary fields, but labels such as “Social telemetry,” “Drain score,” and “Commit entry” feel clinical or technical. A person logging a difficult conversation must also infer how the slider affects burnout risk. The modal should guide the user through a short reflection, show the meaning of the selected score, and confirm the result in terms of the dashboard outcome.

Burnout status currently exposes a title, reasons, and three signal counters. The reasons are useful evidence, but they are presented as raw rules such as “3 consecutive high-drain interactions logged.” Users still need an answer to “What does this mean for me?” and “What should I do now?” Recovery recommendations have the same gap: the server chooses LOW effort for RED and MEDIUM effort for YELLOW, but the UI does not explain that matching or show why one activity is a good next step.

The recovery rating flow works, but a checkbox followed by a 1–5 select is easy to misread as a form field rather than a reflection. The product already has clearer semantic choices in the acceptance flow (“Yes, a lot,” “A little,” “Not really”); the active form should use that language, explain what is saved, and prevent accidental completion or unclear default ratings.

## Task Analysis

### Task 1: Log an interaction

- **Status:** Completed technically; high interpretation cost
- **Primary friction:** The user must choose a relationship, duration, and a -5 to 5 score without guidance about what the score represents.
- **Observed implementation evidence:** `InteractionModal` presents the score as “Drain score” and the submit action as “Commit entry.” Validation and save feedback are handled as a toast after the modal closes.
- **Persona impact:**
  - `boomer-tech-averse`: May not understand “drain score,” the slider scale, or why an interaction is “committed.”
  - `millennial-tech-skeptic`: May question whether the app is judging their relationships or using an opaque wellness formula.
  - `genz-digital-native`: May abandon if the meaning of the slider is not immediately visible.
- **Improvement target:** Make the scale experiential and make the submission outcome visible.

### Task 2: Understand burnout risk

- **Status:** Completed technically; explanation is incomplete
- **Primary friction:** The risk card shows status, energy, low-battery streak, drain hits, and reasons, but not a plain-language interpretation or a recommended response.
- **Observed implementation evidence:** The server returns `riskLevel`, `title`, `reasons`, and `signals`. The UI renders those values directly. RED guidance is not surfaced in the burnout card.
- **Persona impact:** All personas, especially users who see RED for the first time.
- **Improvement target:** Connect evidence to meaning, urgency, and a calm next step without implying diagnosis.

### Task 3: Choose a recovery recommendation

- **Status:** Completed technically; recommendation rationale is hidden
- **Primary friction:** The backend filters activities by effort level, but the recovery UI does not tell the user that RED prioritizes low-effort options or that YELLOW uses medium-effort options. The active UI also asks the user to select from a dropdown labeled “Recommended First” without showing activity details inline.
- **Observed implementation evidence:** `recommendRecoveryAction` selects LOW for RED and MEDIUM for YELLOW; `Recovery` renders a select, completion checkbox, rating select, and generic “Save Activity” action.
- **Persona impact:**
  - `boomer-tech-friendly`: Wants a clear reason and familiar “why this one” explanation.
  - `millennial-tech-skeptic`: Needs to see that the recommendation is based on their data rather than arbitrary personalization.
  - `genalpha-tablet-kid`: A dropdown is less scannable and touch-friendly than visible activity choices.
- **Improvement target:** Present 2–3 visible activity choices with effort, expected time, and a one-line rationale.

### Task 4: Rate a recovery activity

- **Status:** Completed technically; semantic clarity is weak
- **Primary friction:** Completion and rating are separate controls, the rating defaults to `1`, and the numeric values are not translated into words. A user can mark an activity complete without understanding what the rating means.
- **Observed implementation evidence:** `Recovery` reveals an “Effectiveness (1-5)” select only after a checkbox is checked. The stored rating is numeric and the success state is rendered elsewhere after dashboard refresh.
- **Persona impact:** All personas; highest risk for rushed users and users with low confidence in numeric scales.
- **Improvement target:** Use one completion prompt with labeled choices, require an intentional selection, and show the saved reflection immediately.

## Usability Issues

### Critical: Risk state does not provide an actionable explanation

- **Severity:** Major, potentially critical for trust and decision-making
- **Affected personas:** All
- **Evidence:** RED and YELLOW reasons are rule outputs, while the dashboard only presents a status title and metrics. A user can see “High Burnout Risk” without knowing the safest immediate action or whether the state is temporary.
- **Recommendation:** Add a short explanation block:
  - What changed: “Three recent interactions were rated highly draining.”
  - What it means: “Your recent pattern suggests your capacity may be under strain.”
  - What to do: “Choose one low-effort recovery activity now, or log how you feel today.”
  - Add “How this is calculated” disclosure with thresholds and a non-diagnostic disclaimer.

### Major: Interaction logging uses internal language and an opaque scale

- **Severity:** Major
- **Affected personas:** `boomer-tech-averse`, `millennial-tech-skeptic`, `genz-digital-native`
- **Evidence:** “Social telemetry,” “Drain score,” and “Commit entry” do not describe the user’s task. The -5 to 5 slider has no labels for the points between the extremes.
- **Recommendation:** Rename the flow to “Log a conversation” or “Log an interaction.” Rename the field to “How did this interaction affect your energy?” Add endpoint labels such as “Very draining” and “Very energizing,” plus a live phrase for the current value, such as “Somewhat draining.” Replace “Commit entry” with “Save interaction.”

### Major: Recovery choices hide the reason for the recommendation

- **Severity:** Major
- **Affected personas:** All
- **Evidence:** `recommendRecoveryAction` applies risk-based effort filtering, but the UI does not expose `guidance`, `riskLevel`, effort rationale, duration, or activity details. Users see a generic form instead of a recommendation.
- **Recommendation:** Render visible activity cards or radio choices. Each option should show name, effort, expected duration, and a reason. Example: “Low effort because your current risk is high.” Keep the recommended option first, but allow an explicit “Show other options” path.

### Major: Rating flow has an accidental default and weak semantics

- **Severity:** Major
- **Affected personas:** All, especially `genz-digital-native` and `boomer-tech-averse`
- **Evidence:** The rating select uses `payload.rating || 1`, so a completed activity can appear to have a rating of 1 before the user makes a choice. “Effectiveness (1-5)” does not explain what each number means.
- **Recommendation:** Start with no rating selected. Use labeled choices: “Helped a lot (5),” “Helped somewhat (3),” and “Did not help (1),” with optional intermediate values if needed. Make the rating required only when the user marks the activity complete. Confirm with “Saved: Helped somewhat (3/5)” near the activity.

### Minor: Save feedback is disconnected from the action

- **Severity:** Minor
- **Affected personas:** All
- **Evidence:** Interaction save and recovery save rely on toasts and dashboard refreshes. A user may miss the toast or not know which activity was saved.
- **Recommendation:** Keep the toast for global feedback, but also update the submitted row/card inline with a status, timestamp, and saved rating. Preserve the form if the request fails and show a retry action.

### Minor: Empty and loading states do not preserve user direction

- **Severity:** Minor
- **Affected personas:** `boomer-tech-averse`, `genalpha-tablet-kid`
- **Evidence:** Recovery can show “There are no recovery activities to choose from right now,” but does not explain whether this is temporary or what the user can do next.
- **Recommendation:** Distinguish “No recommendation needed” from “Could not load recommendations.” For loading, use a short status message. For failure, offer “Retry” and preserve the last known recommendation when possible.

## Prioritized Recommendations

| Priority | Recommendation                                                                                     | Affected personas                      | Success signal                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| P0       | Add plain-language risk meaning and a concrete next step to YELLOW and RED states.                 | All                                    | Users can explain why their state changed and identify one next action without assistance.             |
| P0       | Replace the recovery checkbox/numeric default flow with an intentional, labeled completion rating. | All                                    | No completed activity is saved without an explicit rating; users can describe what their rating means. |
| P1       | Add labeled interaction-score guidance and replace technical action copy.                          | Tech-averse, skeptical, digital native | Users select a score confidently and understand the save confirmation.                                 |
| P1       | Show recommendation rationale, effort level, and duration beside each visible activity choice.     | All                                    | Users can state why an activity was recommended before selecting it.                                   |
| P1       | Add inline success/error states tied to the submitted interaction or activity.                     | All                                    | Users can identify exactly what was saved without relying on a toast.                                  |
| P2       | Add “How this is calculated” and non-diagnostic context to the burnout card.                       | Skeptical users, first-time users      | Fewer concerns that the app is diagnosing or making an unexplained judgment.                           |
| P2       | Separate empty, loading, and error recovery states with recovery actions.                          | Tech-averse, tablet-first users        | Users know whether to wait, retry, or continue without a recommendation.                               |

## Recommended Acceptance Criteria

### Interaction logging

- The modal uses plain-language labels and has visible endpoint descriptions for the energy-impact scale.
- Every score from -5 to 5 has an understandable live description.
- The save button says “Save interaction” and remains disabled only while saving.
- Success feedback identifies the saved interaction and the resulting risk change, if any.
- Validation errors remain visible in the modal and identify the field requiring attention.

### Burnout-risk explanation

- YELLOW and RED cards display status, evidence, meaning, and one recommended next step.
- RED guidance clearly recommends low-effort recovery without using alarmist language.
- Users can open a concise explanation of the calculation thresholds.
- The copy states that the result is a reflection aid, not a medical diagnosis.

### Recovery recommendations

- Two or three available activities are visible without opening a dropdown.
- Every activity shows effort level and expected duration where available.
- The screen explains why the current risk level favors the shown effort level.
- Selecting an activity makes the chosen state obvious and offers one primary action.

### Recovery rating

- Completion requires an explicit rating; no rating is preselected.
- Rating choices have both words and numeric values.
- The user can submit once, sees an inline saved state, and can still understand the result after refresh.
- Failed saves preserve the selected activity and rating and provide a retry path.

## Follow-up Persona Test Script

1. `boomer-tech-averse`: Log a draining manager interaction and explain the slider before saving. Ask what “High Burnout Risk” means and what action to take.
2. `millennial-tech-skeptic`: Reach RED, inspect the calculation explanation, and decide whether the low-effort recommendation feels justified rather than manipulative.
3. `genz-digital-native`: Complete the full flow quickly on mobile. Check whether the next action, save state, and rating meaning are visible without waiting for a toast.
4. `genalpha-tablet-kid`: Choose a recovery activity by touch and rate it after completion. Check that visible choices are easier than a select menu and that controls have stable tap targets.

## Conclusion

The product has a reliable technical foundation and a verified happy path. The next release should focus on interpretation and agency: explain the risk signal, expose why a recovery activity was chosen, and make the rating a deliberate reflection rather than a hidden numeric form submission.
