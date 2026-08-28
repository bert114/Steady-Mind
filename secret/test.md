You are helping me build **Aura**, a personal energy and burnout-awareness app.

Use the PRD below as the source of truth.

## Development Philosophy

Build this project in **fast MVP mode**.

The goal is:

> **Make it exist first. Improve it later.**

Do NOT over-engineer the solution.

Do NOT build unnecessary abstractions, complex architecture, advanced prediction models, or premature optimizations.

Prefer:

- Simple implementation
- Small reusable functions
- Straightforward database queries
- Clear API endpoints
- Minimal dependencies
- Existing project patterns
- Working features over perfect architecture

Do not implement future phases unless I explicitly ask for them.

## Important Rules

1. Work on **one feature at a time**.
2. Before coding, briefly explain what you are about to change.
3. Inspect the existing codebase before creating new files or architecture.
4. Reuse existing components, utilities, database models, and API patterns where possible.
5. Do not rewrite working code unnecessarily.
6. Do not add features that are not in the current task.
7. Keep database data persistent. Do not use static/mock data for implemented features unless explicitly requested.
8. When something is triggered or calculated, derive it from real database data.
9. Keep the UI simple and functional.
10. Avoid adding AI unless the current task explicitly requires AI.
11. Avoid wearable/biometric features unless explicitly requested.
12. Authentication should not block local development. Add/modify authentication only when explicitly requested.
13. After implementation, explain exactly what changed and how I can test it.

## Aura Product

Aura helps users understand their energy, mood, social interactions, burnout risk, and recovery patterns.

The core product loop is:

User tracks energy and mood
→ User logs social interactions
→ Aura calculates burnout risk
→ Aura recommends recovery
→ User completes or skips recovery
→ User rates effectiveness
→ Aura remembers what helps

## PRD

### P0 — Core Product

#### Energy & Mood Tracking

- User can log energy from 0–100
- User can select current mood
- Save energy, mood, and timestamp to database
- Dashboard shows latest energy and mood

#### Social Interaction Tracking

- User can log an interaction
- User can select relationship type
- User can add optional name/label
- User can enter duration
- User can rate drain from 1–10
- Save interaction data to database

#### Burnout Risk

- Calculate burnout risk from recent user data
- Detect repeated high-drain interactions
- Detect multiple low-energy days
- Show green, yellow, or red risk
- Show why the risk was triggered
- Update risk after new logs

### P1 — Recovery

#### Personal Coping Menu

- User can create recovery activities
- User can categorize activities by effort
- User can edit/delete activities
- Save activities to database

#### Recovery Recommendations

- Show 2–3 recovery options when risk is elevated
- User can select an activity
- User can mark it completed
- User can mark it not completed

#### Recovery Feedback

- Ask for effectiveness rating 1–5 after completion
- Save rating
- Calculate average effectiveness per activity
- Show user's best-performing recovery activities
- Prefer better-performing activities in recommendations

### P2 — Dashboard & History

#### Dashboard

- Show current energy
- Show current mood
- Show burnout risk
- Show recent interactions
- Show recommended recovery

#### History

- Show recent energy history
- Show mood history
- Show interaction/drain history
- Show burnout-risk history
- Add simple 7-day charts

#### Basic Analytics

- Show average energy
- Show average mood
- Show average interaction drain
- Show high-drain interaction count
- Show life-giving vs high-drain relationships

### P3 — AI

#### Boundary Support

- User describes a situation
- Generate a boundary message
- Display generated message
- Allow regenerate
- Add fallback template if AI fails

#### Weekly Insights

- Generate simple weekly summary
- Use user's energy, mood, interaction, and recovery data
- Display weekly insight

### P4 — Authentication & Production

#### Authentication

- Add Clerk
- Connect Clerk user to database user
- Protect authenticated API routes
- Ensure users only see their own data

#### Stability

- Fix major bugs
- Add loading states
- Add error states
- Add empty states
- Verify data persists after refresh
- Verify mobile responsiveness

## Current Priority

Only work on the **current feature/task I give you**.

When I say something like:

> "Implement Phase 4"

you should identify the smallest practical implementation for that phase and build it without jumping ahead.

When I say:

> "Create the checklist for X"

do not code. Just give me the checklist.

When I say:

> "Implement X"

inspect the project first, then implement X end-to-end.

## Implementation Standard

For every feature:

Frontend
→ UI
→ API call
→ Backend logic
→ Database persistence
→ Real data returned
→ UI updated

Do not stop at the UI.

Do not create fake success states.

Do not leave static placeholder data where real database data should exist.

## Business Logic

Keep business rules simple and explicit.

For example:

High-drain interaction:
`drainScore >= 7`

Low-energy day:
`energy <= 40`

High burnout risk:

- 3 consecutive high-drain interactions
  OR
- 3 consecutive low-energy days

The exact rules may evolve later.

For recovery effectiveness:

- Only completed activities receive a rating.
- Effectiveness rating is 1–5.
- Average effectiveness is calculated from completed rated attempts.
- Failed/not-completed activities do not affect effectiveness.
- Best-performing activities are based on average effectiveness.
- Do not store derived values such as average rating unless there is a clear reason to do so. Prefer calculating them from stored records.

## Coding Behavior

Before making changes:

1. Inspect the relevant existing files.
2. Identify the smallest set of files that need changes.
3. Explain the implementation briefly.
4. Implement it.
5. Run relevant checks/tests if available.
6. Report what changed.
7. Give me a short manual test scenario.

If you encounter uncertainty, choose the **simplest reasonable implementation** consistent with the PRD and existing codebase.

Do not stop to ask unnecessary questions.

## Most Important Rule

**Do not chase perfection.**

A simple working implementation is better than a sophisticated unfinished implementation.

Build the smallest version that works, verify it, and move on.
