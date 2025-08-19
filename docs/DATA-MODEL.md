# Data Model

This document describes the domain models and repositories that power the prompt engine and UI.

## Overview

All structured data lives under `src/data/`. JSON sources reside in `src/data/sources/` and are loaded by repository classes in `src/data/repositories/`. Repository methods return instances of model classes defined in `src/data/models/`.

- Canonical context JSON: `src/data/sources/contextual-scenarios.json` (deprecated duplicate at `src/data/contextual-scenarios.json` is not used).
- Domain key alignment: model helper keys align with domain keys such as `analytics-data-viz`, `webassembly`, and `go`.

### Rationale

- Supports multi-view learning (akin to 4+1): different roles and lesson formats view the same core concepts from complementary perspectives.
- Enables interleaving: by mixing domains, roles, and concepts, learners repeatedly encounter ideas in varied contexts.
- Encourages spaced practice: cycles are lightweight to generate, so users can revisit topics over time with fresh combinations.

## Models (`src/data/models/`)

- `Concept.js`
  - Fields: `name`, `category`, `complexity`, `roles`, `components`, `keyInsights`
  - Methods:
    - `isRelevantToRole(role)`
    - `matchesComplexity(level)`
    - `getHashtag()` and `getComponentHashtags(limit)`
    - `toJSON()`

- `Context.js`
  - Represents a domain context loaded from `contextual-scenarios.json`.
  - Fields: `name`, `description`, `characteristics`, `constraints`, `stakeholders`, `scenarios`
  - Methods:
    - `getTechnicalChallenges()` — maps domain keys to canonical challenge strings (keys aligned with data, e.g., `analytics-data-viz`, `webassembly`, `go`).

- `Cycle.js`
  - Structure for a full learning cycle: `id`, `timestamp`, `stages`.

- `Stage.js`
  - Structure for a stage in the cycle: `name` (role), `prompt`, `hashtags`, `metadata`.

- `Domain.js`, `Technology.js`
  - Lightweight descriptors for domain/technology metadata.

- `LessonTemplate.js`
  - Structure of a template with placeholders interpolated by `TemplateEngine`.

- `ObliqueStrategy.js`
  - Creative strategy entries used for variation.

## Repositories (`src/data/repositories/`)

- `ConceptRepository.js`
  - Loads from `src/data/sources/core-concepts.json`.
  - Filters by role and complexity, returns `Concept` instances.
  - Utility methods like `selectRelevantConcepts(count, { role, complexity })` and `getStats()`.

- `ScenarioRepository.js`
  - Loads canonical `src/data/sources/contextual-scenarios.json` only.
  - Caches `Context` instances and exposes selection helpers, including weighted domain preferences.

- `TemplateRepository.js`
  - Loads `src/data/sources/lesson-templates.json` and returns template descriptors.

- `StrategyRepository.js`
  - Loads `src/data/sources/oblique-strategies.json`.

- `TechnologyRepository.js`, `DomainRepository.js`
  - Load `technologies.json` and `domains.json` respectively.

## How The Engine Uses The Data

1. `ScenarioRepository` chooses a domain context (weighted toward preferred domains such as entertainment arts, creative coding, analytics/data viz, WebAssembly, Tauri, JS/TS, Go, Rust, payment systems, DevOps, distribution, generative AI, and app development).
2. `ConceptRepository` returns a role- and complexity-appropriate subset of concepts.
3. `TemplateRepository` and `TemplateEngine` interpolate variables to produce the instructional meta‑prompt.
4. `ContextEnricher` adds context characteristics/constraints/stakeholders/scenarios.

## Usage Examples

Select relevant concepts for a given role and complexity, then get helpful hashtags:

```js
import { ConceptRepository } from 'src/data/repositories/ConceptRepository.js'

const conceptRepo = new ConceptRepository()
const concepts = conceptRepo.selectRelevantConcepts(3, {
  role: 'systemDesigner',
  complexity: 'intermediate'
})

const tags = concepts.flatMap(c => [c.getHashtag(), ...c.getComponentHashtags(1)])
```

Pick a domain context (weighted toward preferred domains) and access its guidance:

```js
import { ScenarioRepository } from 'src/data/repositories/ScenarioRepository.js'

const scenarioRepo = new ScenarioRepository()
const ctx = scenarioRepo.selectContext()
const challenges = ctx.getTechnicalChallenges()
const business = ctx.getBusinessContext()
```

## Tests

- Unit tests for repositories and models live under `src/__tests__/data/`.
- Integration tests validate end‑to‑end generation.

## Notes

- Treat `src/data/sources/**` as the single source of truth for JSON.
- Keep domain keys consistent across JSON and model helpers to ensure correct lookups and guidance.
