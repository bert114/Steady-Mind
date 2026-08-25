# Design Critique: Aura Dashboard

**Date:** 2026-08-26  
**Context:** Capacity and recovery check-in dashboard  
**Audience:** A person returning during a busy or depleted day  
**Stage:** Implementation review  
**Evidence:** Active dashboard implementation and styles; rendered visual review pending because no browser page or screenshot was shared

## Overall Impression

The dashboard communicates its purpose clearly: understand capacity and choose a recovery action. The strongest opportunity is hierarchy. Energy appears in several prominent places, while the most actionable content, burnout explanation and recovery, may appear lower on the page.

The visual direction has the beginnings of a distinctive capacity-instrument language: warm paper surfaces, forest ink, restrained semantic colors, and a large energy reading. It currently loses coherence because legacy chart colors, multiple type families, and competing component styles remain in the same experience.

## First Impression

The exact two-second impression is **pending rendered review**. Based on the implementation, the likely first focal points are the “Understand your capacity” headline and the large circular energy display.

That emphasis is only partly correct. Energy is important, but when the user is in YELLOW or RED, risk meaning and the next recovery action should lead. The dashboard should shift its focal point according to state rather than giving every state the same measurement-heavy hierarchy.

## Usability

| Finding                                                                                       | Severity | Recommendation                                                                                                                          |
| --------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Recovery appears only when action is required and follows trends and interactions.            | Moderate | When recovery is needed, elevate the explanation and recovery choice near the burnout status so the next action is immediately visible. |
| Burnout metrics such as “Low streak” and “Drain hits” require interpretation.                 | Moderate | Add supporting text explaining what each signal means and why it affects the current status.                                            |
| Weekly energy uses emoji as the primary mood signal.                                          | Moderate | Pair each emoji with accessible text or a mood label so meaning does not depend on icon recognition.                                    |
| The dashboard actions use shared button styling without a clear primary action hierarchy.     | Minor    | Keep both actions available, but distinguish the routine check-in from the action needed for the current risk state.                    |
| Recovery recommendations are presented after the user has scanned several secondary sections. | Moderate | Move recovery above weekly trends when `isActionRequired` is true, or add a prominent jump link from the risk card.                     |

## Visual Hierarchy

- **Likely focal element:** The large “Understand your capacity” heading followed by the circular energy display.
- **Current reading flow:** Header → summary metrics → burnout status and energy → weekly trends → interactions → recovery.
- **Hierarchy concern:** Energy is repeated in the summary row, large numeric spotlight, and circular battery. Repetition dilutes the user’s attention.
- **Recommended reading flow when stable:** Current energy → patterns → interactions.
- **Recommended reading flow when elevated:** Burnout meaning → next recovery action → current energy → supporting patterns.
- **Emphasis adjustment:** Keep one compact energy summary and one detailed visualization. Use the reclaimed attention for risk explanation and recovery choice.

## Consistency

| Element       | Issue                                                                                                                               | Recommendation                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Typography    | The app mixes `Inter`, system fonts, Avenir, and serif display styles.                                                              | Define one display face, one body face, and one utility style across the dashboard, chart, and modals.            |
| Color         | The main direction is forest and paper, but weekly chart styles retain blue, indigo, and Tailwind-like colors.                      | Replace legacy chart colors with semantic dashboard tokens for ink, muted, success, warning, and risk.            |
| Radius        | Cards, modals, buttons, and chart controls use different radius scales.                                                             | Adopt a small radius scale and apply it consistently by component level.                                          |
| Language      | Interaction logging is partly plain language, while energy logging still uses “Telemetry log,” “State capture,” and “Commit entry.” | Use the same user-facing vocabulary across both logging flows: “Log energy” and “Save check-in.”                  |
| Surfaces      | The dashboard mixes white cards, translucent panels, gradients, and shadows.                                                        | Choose one depth strategy, preferably quiet surface shifts with restrained shadows, and apply it across sections. |
| CSS ownership | Some selectors are duplicated, and `energy.css` contains nested rules inside a regular CSS file.                                    | Consolidate tokens and remove conflicting legacy rules before further visual refinement.                          |

## Accessibility

- **Color contrast:** Several muted sage and gray labels may be too light against paper and white surfaces. Verify normal text and metadata with a contrast checker.
- **Color independence:** Burnout badges and battery states should communicate through text and shape as well as color. The status labels are a good foundation.
- **Touch targets:** Check day controls, close controls, compact buttons, and rating choices against a 44×44px target, with 40px as the minimum fallback.
- **Modal naming:** The modal has `role="dialog"` and `aria-modal`, but no explicit accessible name. Add `aria-labelledby` pointing to the heading.
- **Modal focus:** Verify that focus moves into the modal, Escape closes it, background content is inert, and focus returns to the trigger.
- **Chart meaning:** Mood emoji and battery color need text equivalents. Selected day and today should have a non-color indicator.
- **Keyboard visibility:** Confirm visible focus states for summary actions, day buttons, sliders, recovery choices, and modal controls.
- **Text readability:** Keep body copy at a readable size and use comfortable line height. The expressive display type should not carry essential meaning alone.

## What Works Well

- The headline gives the dashboard a clear user-centered purpose.
- The burnout component now connects status to meaning and a next step.
- Recovery recommendations expose effort level and guidance instead of presenting only a raw form.
- The weekly view provides an interactive day-by-day comparison.
- Empty and loading states exist across major dashboard surfaces.
- Native buttons and form controls provide a solid semantic base for keyboard support.

## Priority Recommendations

1. **Make risk and recovery the conditional focal path.** When YELLOW or RED is active, place the explanation and recovery choice before secondary trend content. This aligns the layout with the user’s immediate decision.
2. **Reduce repeated energy presentation.** Keep one glance metric and one detailed battery visualization. Use the remaining hierarchy for the action the user needs to take.
3. **Unify the design system.** Consolidate typography, semantic colors, spacing, radii, surface depth, and button language across the dashboard, chart, and modals.
4. **Complete modal accessibility.** Add an accessible name, focus management, Escape handling, focus return, and verified hit areas.
5. **Translate supporting metrics.** Explain “low streak,” “drain hits,” and mood values in user language instead of relying on labels or symbols.
6. **Separate state types.** Distinguish “no recommendation needed,” loading, and failure states, and give failure states a retry action.
7. **Perform the rendered review.** Inspect the first viewport at desktop and 390px mobile widths, then test keyboard focus, contrast, and recovery visibility.

## Rendered Review Checklist

The following checks require the running dashboard or screenshots and are not confirmed by source inspection alone:

- Desktop first impression and visual focal point
- 390px mobile wrapping, overflow, and recovery visibility
- Actual contrast of muted labels and semantic status colors
- Whether the seven-day grid remains legible and touchable on mobile
- Whether modal content fits without clipping or awkward scrolling
- Focus order, focus return, Escape dismissal, and background inertness
- Loading, empty, error, and elevated-risk states in the rendered UI

## Conclusion

Aura has a clear product premise and a useful information set. The next design pass should make the dashboard state-aware: measurement leads when the user is steady, while explanation and recovery lead when capacity is under strain. A single visual system and a rendered accessibility pass will turn the promising foundation into a more coherent, dependable tool.
