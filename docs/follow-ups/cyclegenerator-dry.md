# CycleGenerator DRY Refactor Follow-Up

Owner: TBD  
Status: Planned  
Last updated: 2025-08-20

## Background

`src/engines/prompt/generators/CycleGenerator.js` contains a few small duplicated code paths that can be safely refactored into helpers without changing the public API or behavior. TODO annotations were added inline to mark the targets for refactor and to link to this doc.

## Duplicate Areas

- Monotonic timestamp logic
  - Locations: `generate()` and `generateWithParams()`
  - Purpose: Prevent ID collisions under rapid successive generations.

- Fallback stage construction
  - Locations: `generate()` null-stage branch and `catch` error branch
  - Purpose: Create a consistent fallback `stage` object when generation returns null or throws.

- Stage validation/sanitization mapping
  - Location: `validatedStages = stages.map(...)` in `generate()`
  - Purpose: Normalize each stage to ensure required properties and provide defaults.

See inline TODOs:

- `// TODO(cyclegenerator-dry): Extract to _monotonicTimestamp() helper`
- `// TODO(cyclegenerator-dry): DRY ... via _buildFallbackStage(roleKey, ...)`
- `// TODO(cyclegenerator-dry): Extract mapping to _validateStage(stage, index, ...)`

## Goals (No Behavior Change)

- Keep the public class name and API exactly the same.
- Preserve all logging and metadata fields.
- Maintain test behavior and coverage (no snapshot changes expected).

## Proposed Refactor

Introduce private helper methods within `CycleGenerator`:

- `_monotonicTimestamp()`
  - Returns an always-increasing timestamp using existing `this._lastTs` logic.
- `_buildFallbackStage(roleKey, { selectedContext, selectedComplexity, enrichment, timestamp })`
  - Constructs the fallback stage object used in both null and error cases.
- `_validateStage(stage, index, { selectedContext, selectedComplexity, enrichment, timestamp })`
  - Applies normalization currently done in the `validatedStages.map(...)` block.

Wire-up changes:

- Replace duplicated inline blocks with calls to these helpers.
- Keep logger messages and contexts unchanged.

## Componentization Plan (Subcomponents)

Goal: Break `CycleGenerator` into small, testable subcomponents without changing the public API or behavior.

### Proposed Modules (new files)

- `src/engines/prompt/generators/core/TimestampProvider.js`
  - Exposes `next()` with current monotonic timestamp (mirrors `_monotonicTimestamp()`).
- `src/engines/prompt/generators/core/FallbackStageFactory.js`
  - `build(roleKey, { selectedContext, selectedComplexity, enrichment, timestamp })` (mirrors `_buildFallbackStage`).
- `src/engines/prompt/generators/core/StageValidator.js`
  - `validate(stage, index, { selectedContext, selectedComplexity, enrichment, timestamp })` (mirrors `_validateStage`).
- `src/engines/prompt/generators/core/CycleAuditBuilder.js`
  - Builds `cycle.audit` object to centralize audit composition and keep logs consistent.
- `src/engines/prompt/generators/core/StagePipeline.js`
  - Orchestrates per-role stage generation using `StageGenerator` and enrichment, returning `{ stage, logs }`.

Note: `ComplexitySelector` and `ContextEnricher` remain as-is. `StageGenerator` remains the primary stage producer.

### Updated `CycleGenerator` Responsibilities

- Coordinates repositories and delegates:
  - Uses `TimestampProvider` for IDs.
  - Uses `StagePipeline` to generate stages for each role.
  - Uses `FallbackStageFactory` for null/error cases.
  - Uses `StageValidator` for final normalization.
  - Uses `CycleAuditBuilder` for audit metadata.
- Maintains the same constructor signature and exported class API (`generate`, `generateWithParams`).

### File Structure

```plaintext
src/engines/prompt/generators/
  CycleGenerator.js               # thin orchestrator
  core/
    TimestampProvider.js
    FallbackStageFactory.js
    StageValidator.js
    CycleAuditBuilder.js
    StagePipeline.js
```

### Phased Migration

1) Introduce new core modules with unit tests (pure functions/classes, no side effects).
2) Refactor `CycleGenerator` to call the new modules; keep logs/shape identical.
3) Run tests/QA; verify no behavioral changes.
4) Optionally add targeted tests for the pipeline/factory/validator.

### Componentization Acceptance Criteria

- `CycleGenerator` public API unchanged; exports remain the same.
- All existing logs and audit payloads remain byte-for-byte equivalent for the same inputs.
- No new circular dependencies (verify via `bun run qa:circles`).
- Tests, lint, and QA are green.

## Tasks

1) Add helpers at the bottom of the class (or near usage) and migrate call sites.
2) Ensure logs remain identical (messages, keys, and levels).
3) Run tests and QA to confirm no behavioral regressions.

## Test Plan

- `bun test` (all existing unit and integration tests)
- `bun run qa:circles` (ensure no new circulars)
- `bun run qa:deps` (no change expected)
- `bun run lint` (style/formatting)

## Acceptance Criteria

- All tests pass with zero changes to expected outputs.
- Lint and QA remain green.
- Code duplication removed for the three targeted areas.
- No changes to the public API or logs (content/shape) beyond internal function boundaries.

## Risks

- Subtle differences in timestamp or fallback composition could affect tests.
- Logging contexts could accidentally change.

Mitigations:

- Keep logic byte-for-byte equivalent when moving.
- Add focused unit tests for fallback stage helper if needed.

## Effort Estimate

- Small (≤1 hour): Pure refactor, no functional change, tests should remain stable.

## Out of Scope

- Any change to selection algorithms, randomness, or repository interfaces.
- Broader generator architecture changes.
