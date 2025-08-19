# Prompt Engine

This document explains how the prompt generation engine is structured and how to use it programmatically.

## Purpose

Generate a four‑stage educational prompt cycle tailored by role, complexity, domain context, and templates.

Stages:

- Expert Engineer
- System Designer
- Leader
- Review & Synthesis

## Directory Map

- `src/engines/prompt/PromptEngine.js` — Orchestrator and public API
- `src/engines/prompt/generators/CycleGenerator.js` — Builds a full cycle
- `src/engines/prompt/generators/StageGenerator.js` — Builds a single stage
- `src/engines/prompt/templates/TemplateEngine.js` — Template assembly
- `src/engines/prompt/templates/VariableBuilder.js` — Variables for templates
- `src/engines/prompt/selectors/ComplexitySelector.js` — Complexity logic
- `src/engines/prompt/services/ContextEnricher.js` — Adds contextual guidance

## Public API

```js
import { generateCycle, regenerateStage } from 'src/engines/prompt/PromptEngine.js'

// Generate a complete four‑stage cycle
const cycle = generateCycle()

// Regenerate a specific stage by name
const updatedStage = regenerateStage('Leader')
```

Both functions return plain objects suitable for rendering. A cycle contains four `Stage` objects with `prompt`, `hashtags`, and metadata.

### Advanced usage (dependency injection)

```js
import promptEngine, { PromptEngine } from 'src/engines/prompt/PromptEngine.js'

// Use the shared singleton for convenience
const cycle1 = promptEngine.generateCycle()

// Or create your own instance and inject repositories/generators (useful for tests)
const engine = new PromptEngine({
  // conceptRepo, templateRepo, scenarioRepo, strategyRepo,
  // cycleGenerator, stageGenerator – all optional and DI‑friendly
})
const cycle2 = engine.generateCycle()
```

## Generation Flow

1. Select a domain context (weighted by preferences in `ScenarioRepository`).
2. Select relevant concepts for the requested role and complexity (`ConceptRepository`).
3. Build variables via `VariableBuilder` and format a meta‑prompt in `TemplateEngine`.
4. Enrich with contextual guidance (`ContextEnricher`).
5. Produce hashtags and structured stage output.

## Selection Logic

- Domain context source of truth: `src/data/sources/contextual-scenarios.json`.
- Concept selection uses role relevance (`Concept.isRelevantToRole`) and `matchesComplexity` rules.
- Complexity selector can adjust allowances (e.g., allow intermediate for advanced).

## Templates

- Located in `src/data/sources/lesson-templates.json`.
- `TemplateEngine` interpolates variables and assembles final educational instructions, formatting requirements, and deliverables.

## Context Enrichment

`ContextEnricher` takes selected domain information (characteristics, constraints, stakeholders, scenarios) and adds guidance to the final prompt.

## Logging

The engine uses the project logger (`src/utils/logger.js`) for structured logging and debugging.

## Tests

- Unit tests cover engines, repositories, and models under `src/__tests__/`.
- Integration tests validate end‑to‑end prompt generation.
- Run tests:

```bash
bun run test
```
