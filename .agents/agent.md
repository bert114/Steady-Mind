# Agent Instructions

## Project Context

Aura is a wellness tracking application focused on emotional and social energy. Users log daily energy levels, mood, and interactions, and the system uses that data to show trends, predict burnout risk, and generate boundary-setting guidance.

The app has three main product layers:

1. Manual tracking
2. Analytics and predictions
3. AI-generated coaching

The system also supports biometric imports from wearables.

The application must remain lightweight, mobile-first, maintainable, and safe for sensitive personal data.

---

## Core Coding Principles

When modifying or refactoring code, prioritize:

1. **Readability**
2. **Maintainability**
3. **Simplicity**
4. **Clear separation of responsibilities**
5. **Predictable behavior**
6. **Minimal unnecessary changes**

Refactoring should improve the internal structure of the code without changing its intended behavior unless a behavior change is explicitly requested.

---

## Language Constraints

- Use **modern vanilla JavaScript**.
- **Do NOT use TypeScript.**
- Do not introduce `.ts` or `.tsx` files.
- Do not add TypeScript-specific syntax such as interfaces, type aliases, enums, generics, or access modifiers.
- Prefer standard JavaScript features supported by the project's runtime.
- Use JSDoc only when additional documentation or type hints genuinely improve readability.
- Do not introduce an OOP architecture solely for the purpose of refactoring.

---

## Programming Style

Prefer a **functional and compositional approach**.

Use:

- Pure functions where practical.
- Small functions with one clear responsibility.
- Explicit inputs and outputs.
- Guard clauses and early returns.
- Array methods such as `map`, `filter`, `reduce`, and `find` when they make the intent clearer.
- Plain objects for simple data structures.
- Factory functions when object creation or encapsulation is useful.
- Closures when they simplify state management.

Avoid:

- Deeply nested control flow.
- Large monolithic functions.
- Unnecessary abstraction.
- Global mutable state.
- Hidden side effects.
- Clever code that sacrifices readability.
- Premature optimization.
- Abstractions that exist only to reduce line count.

---

# Refactoring Rules

## 1. Reduce Complexity

Identify and simplify code that is difficult to understand or maintain.

Look specifically for:

- Deeply nested `if` statements.
- Nested loops that can be simplified.
- Large switch statements.
- Excessive conditional branching.
- High cyclomatic complexity.
- Long functions.
- Repeated conditional checks.
- Boolean expressions that are difficult to understand.
- Multiple levels of callbacks or nested promises.
- Functions performing several unrelated operations.

Prefer:

- Guard clauses.
- Early returns.
- Small helper functions.
- Named predicates.
- Extracted business rules.
- Sequential steps with descriptive names.

### Example

Prefer:

```js
function processUser(user) {
  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  return createProfile(user);
}
```

Instead of deeply nested logic:

```js
function processUser(user) {
  if (user) {
    if (user.isActive) {
      return createProfile(user);
    }
  }

  return null;
}
```

The goal is not merely fewer lines. The goal is **less cognitive load**.

---

## 2. Improve Naming

Names must communicate intent.

Replace:

- `data`
- `result`
- `item`
- `obj`
- `value`
- `temp`
- `x`
- `y`
- `res`
- `req`
- `fn`
- `handler`

when a more meaningful name is available.

Prefer names such as:

- `energyEntries`
- `burnoutRisk`
- `userProfile`
- `interactionHistory`
- `validatedInput`
- `calculateBurnoutRisk`

Functions should generally describe an action or operation.

Examples:

```js
calculateBurnoutRisk();
validateEnergyEntry();
createBoundaryRecommendation();
fetchUserInteractions();
normalizeMoodData();
```

Avoid vague names:

```js
process();
handle();
doStuff();
run();
getData();
update();
```

unless the surrounding context makes the intent genuinely obvious.

---

## 3. Single Responsibility Principle

Functions should have one primary reason to change.

If a function:

- validates input,
- fetches data,
- transforms data,
- calculates business rules,
- saves data,
- and formats an API response,

split those responsibilities where doing so improves clarity.

Prefer:

```js
const validatedEntry = validateEnergyEntry(input);
const energyData = normalizeEnergyEntry(validatedEntry);
const savedEntry = await saveEnergyEntry(userId, energyData);
return formatEnergyResponse(savedEntry);
```

over a single function containing every responsibility.

Do not blindly split every few lines into a function. Extract functionality when the new function has a meaningful responsibility and improves comprehension.

---

## 4. Modularity

Extract reusable logic when:

- The same logic appears multiple times.
- A function has multiple distinct responsibilities.
- A business rule deserves a descriptive name.
- A section of logic can be independently tested.
- A complex transformation can be isolated.
- A dependency can be passed explicitly.

Extracted functions should have:

- Clear names.
- Clear inputs.
- Predictable outputs.
- Minimal hidden dependencies.
- Minimal side effects.

Avoid creating unnecessary layers such as:

```text
controller → manager → service → helper → utility → adapter
```

when a simpler structure communicates the architecture better.

---

## 5. Avoid Duplicate Business Logic

Business rules must have a clear source of truth.

Do not duplicate the same logic across:

- Routes.
- Controllers.
- Services.
- UI components.
- Database access code.
- AI prompt preparation.

If the same rule is required in multiple places, extract an appropriate reusable function.

---

## 6. Prefer Guard Clauses

Use guard clauses when they make the main execution path easier to understand.

Prefer:

```js
function generateRecommendation(user) {
  if (!user) {
    return null;
  }

  if (!user.energyData?.length) {
    return createInsufficientDataResponse();
  }

  return buildRecommendation(user.energyData);
}
```

over unnecessary nesting:

```js
function generateRecommendation(user) {
  if (user) {
    if (user.energyData?.length) {
      return buildRecommendation(user.energyData);
    }

    return createInsufficientDataResponse();
  }

  return null;
}
```

---

## 7. Avoid Premature Abstraction

Do not create abstractions simply because code can technically be abstracted.

Before extracting a function or utility, ask:

- Does it have a clear responsibility?
- Does the name improve understanding?
- Is it reusable or independently testable?
- Does extraction reduce complexity?
- Does it make the calling code easier to read?

If not, keep the logic local.

---

# Architecture Rules

## Route Handlers

Keep route handlers thin.

Route handlers should primarily:

1. Validate or receive validated input.
2. Identify the authenticated user.
3. Call the appropriate business logic.
4. Return the appropriate response.

Do not put large business rules directly inside route handlers.

---

## Business Logic

Business logic belongs in focused service functions or domain modules.

Services should:

- Receive explicit inputs.
- Apply business rules.
- Coordinate required operations.
- Return predictable results.
- Avoid unnecessary HTTP-specific concerns.

---

## Validation

Validate:

- Request bodies.
- Route parameters.
- Query parameters.
- External inputs.
- User-provided data.

Reject malformed or missing input early.

Validation logic should be reusable when the same input shape is used in multiple locations.

---

## Data Access

Keep database access separate from business rules when practical.

Do not:

- Expose raw database details unnecessarily.
- Duplicate database queries across multiple modules.
- Bypass user-scoping requirements.
- Rewrite database entities without approval.

---

# Database Rules

- **Never modify the database schema unless explicitly instructed.**
- Always create migrations for approved schema changes.
- Do not rewrite or rename database entities without explicit approval.
- Preserve existing data relationships.
- Keep user-scoped data access enforced.
- Never remove authorization or ownership checks during a refactor.

---

# API Rules

- Keep API response shapes consistent.
- Preserve backward compatibility unless a breaking change is explicitly requested.
- Update request and response validation together.
- Protect user-specific endpoints with authentication and authorization.
- Never expose internal implementation details unnecessarily.
- Return structured errors with stable error codes.
- Add integration tests when API behavior changes.

---

# Error Handling

Handle errors explicitly and predictably.

Rules:

- Never silently swallow backend errors.
- Return structured errors where appropriate.
- Use stable error codes for API consumers.
- Convert third-party failures into safe application-level responses.
- Preserve useful diagnostic information in server logs.
- Do not expose secrets, stack traces, or sensitive internal information to users.
- Handle OpenAI timeouts and rate limits gracefully.
- Preserve existing fallback behavior unless explicitly instructed otherwise.

Prefer clear error handling:

```js
try {
  return await generateCoaching(userData);
} catch (error) {
  logger.error("Coaching generation failed", {
    error,
    requestId,
  });

  return createFallbackCoachingResponse();
}
```

---

# Logging and Privacy

Aura handles sensitive personal information.

Never log:

- API keys.
- Authentication tokens.
- Passwords.
- Webhook secrets.
- Raw personal wellness data.
- Sensitive user conversations.
- Unnecessary personally identifiable information.

Log operational information such as:

- Request IDs.
- Trace IDs.
- Operation names.
- Error types.
- Performance information.
- Safe identifiers when necessary.

Redact sensitive information before logging.

---

# Naming Conventions

Use `camelCase` for:

- Variables.
- Functions.
- Parameters.
- Object properties.

Use descriptive names for:

- Services.
- Modules.
- Route handlers.
- Business functions.
- Data transformations.

Use plural names for collections:

```js
users;
energyEntries;
interactions;
recommendations;
```

Use singular names for individual entities:

```js
user;
energyEntry;
interaction;
recommendation;
```

Avoid abbreviations unless they are universally understood in the project.

---

# Imports

- Prefer absolute imports if the project supports them.
- Group external imports before internal imports.
- Remove unused imports immediately.
- Avoid importing an entire module when a smaller import is sufficient.
- Keep import ordering consistent with the surrounding project.

---

# Refactoring Workflow

When asked to refactor existing code, follow this process.

## Step 1: Understand Existing Behavior

Before changing the implementation:

- Read the entire relevant function/module.
- Identify its inputs and outputs.
- Identify side effects.
- Identify external dependencies.
- Identify existing error behavior.
- Identify authentication and user-scoping behavior.
- Identify existing fallback behavior.
- Identify tests covering the code.

Do not change behavior simply because the existing behavior looks unusual.

---

## Step 2: Identify Complexity

Look for:

- Large functions.
- Deep nesting.
- Repeated logic.
- Unclear names.
- Mixed responsibilities.
- Hidden dependencies.
- Complex conditionals.
- Unnecessary state.
- Duplicate business rules.

Prioritize changes that produce the biggest improvement in readability.

---

## Step 3: Refactor Incrementally

Prefer small, understandable transformations:

1. Improve naming.
2. Add guard clauses.
3. Extract meaningful functions.
4. Remove duplication.
5. Separate responsibilities.
6. Simplify data transformations.
7. Remove unnecessary abstractions.
8. Verify behavior.

Do not rewrite an entire module unnecessarily when a focused refactor is sufficient.

---

## Step 4: Preserve Behavior

Unless explicitly requested, do not change:

- API contracts.
- Database behavior.
- Authentication behavior.
- Authorization behavior.
- User-scoping rules.
- Error semantics.
- Fallback behavior.
- Product functionality.

A refactor should primarily change **how the code is structured**, not **what the application does**.

---

## Step 5: Verify the Result

After refactoring:

- Run relevant tests.
- Check linting if available.
- Check for unused imports and variables.
- Check for accidental behavior changes.
- Check API response compatibility.
- Check authentication and user-scoping paths.
- Check error and fallback paths.

If tests cannot be run, clearly state that limitation.

---

# Testing Expectations

Write or update tests when behavior or implementation boundaries change.

At minimum, consider:

- Happy paths.
- Invalid input.
- Empty data.
- Missing data.
- Authentication failures.
- Authorization failures.
- User-scoping violations.
- Third-party failures.
- OpenAI timeouts.
- OpenAI rate limits.
- Fallback behavior.
- Edge cases introduced by the refactor.

Business logic should be easy to test independently from HTTP and database concerns where practical.

---

# Code Review Checklist

Before considering a refactor complete, verify:

### Readability

- Are functions easy to understand?
- Are names intention-revealing?
- Can the main execution path be followed quickly?
- Has unnecessary nesting been removed?

### Maintainability

- Does each function have a clear responsibility?
- Is business logic centralized?
- Is duplication reduced?
- Are dependencies explicit?

### Architecture

- Are route handlers thin?
- Is business logic separated from infrastructure concerns?
- Are user-scoping and authorization preserved?
- Are existing API contracts preserved?

### JavaScript

- Is the implementation clean modern vanilla JavaScript?
- Is there no TypeScript?
- Are functions and data structures simple?
- Are abstractions justified?

### Safety

- Are sensitive values protected?
- Are secrets excluded from logs?
- Are fallback behaviors preserved?
- Are external AI calls limited to necessary data?

### Verification

- Were relevant tests run?
- Were errors and edge cases considered?
- Were unintended behavior changes avoided?

---

# Pull Request Expectations

Keep changes:

- Small.
- Focused.
- Easy to review.
- Consistent with the existing architecture.

Every refactor should explain:

- What was changed.
- Why it was changed.
- Any behavior that intentionally changed.
- Any assumptions made.
- Any tests that were added or updated.

---

# Refactoring Output Requirements

Whenever an agent is asked to refactor code, the response should include:

1. The refactored code.
2. A brief bulleted summary of the key changes.
3. A short explanation of why those changes improve readability, maintainability, or separation of responsibilities.

The summary should focus on meaningful improvements, for example:

- Reduced nested conditional logic using guard clauses.
- Extracted business logic into focused functions.
- Replaced ambiguous variable names with intention-revealing names.
- Removed duplicated logic.
- Separated validation from business processing.
- Preserved existing API behavior and user-scoping rules.

Do not provide unnecessary commentary or a lengthy explanation unless requested.

---

# AI Constraints

An AI assistant must never:

- Change the authentication provider without confirmation.
- Remove authentication or authorization checks.
- Remove user-scoping or ownership checks.
- Expose raw secrets, API keys, tokens, or webhook secrets.
- Rewrite database entities without approval.
- Modify the database schema without explicit instruction.
- Replace fallback logic with hard failures without approval.
- Send unnecessary personal data to external AI services.
- Introduce new third-party services without approval.
- Add new product features that alter the core product scope without confirmation.
- Introduce TypeScript.
- Convert the application into a class-based architecture.
- Perform large unrelated rewrites during a focused refactor.

---

# Refactoring Philosophy

The best refactor is not necessarily the shortest code.

Optimize for:

> **Code that another developer can understand, modify, test, and debug quickly.**

Prefer boring, explicit, predictable code over clever abstractions.

When choosing between two valid implementations, favor the one with:

- Fewer responsibilities per function.
- Clearer names.
- Less nesting.
- Fewer hidden dependencies.
- Fewer side effects.
- Easier testing.
- Easier future modification.

**Preserve behavior. Improve structure. Reduce complexity. Make intent obvious.**
