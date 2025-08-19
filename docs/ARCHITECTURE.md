# Software Architecture Learning - System Architecture

## Overview

This document describes the modular architecture implemented for the Software Architecture Learning prompt generation system. The system has been completely refactored from a monolithic 800+ line generator into a clean, testable, and maintainable architecture.

## Architecture Principles

### 1. Separation of Concerns
- **Data Layer**: Repositories and models handle data access and validation
- **Business Logic**: Engines and generators contain core prompt generation logic
- **Presentation Layer**: React components handle UI interactions
- **Infrastructure**: Utilities, logging, and configuration

### 2. Dependency Injection
- Components receive dependencies through constructors
- Enables easy testing with mocks and stubs
- Reduces coupling between modules

### 3. Single Responsibility
- Each class has one clear purpose
- Methods are focused and cohesive
- Easy to understand and modify

### 4. Fail-Safe Design
- Comprehensive error handling with fallbacks
- Null-safe operations throughout
- Graceful degradation when data is missing

## System Components

### Core Engine (`src/engines/prompt/`)

#### PromptEngine.js
- **Purpose**: Main orchestrator coordinating all components
- **Responsibilities**: 
  - Initialize repositories and generators
  - Provide public API for cycle and stage generation
  - Coordinate statistics gathering
- **Dependencies**: All repositories and generators

#### Generators (`src/engines/prompt/generators/`)

##### CycleGenerator.js
- **Purpose**: Generate complete learning cycles
- **Responsibilities**:
  - Select context and complexity for entire cycle
  - Coordinate generation of all 4 stages
  - Apply oblique strategies when appropriate
- **Dependencies**: StageGenerator, ComplexitySelector

##### StageGenerator.js
- **Purpose**: Generate individual learning stages
- **Responsibilities**:
  - Generate prompts for specific roles
  - Coordinate concept selection and template processing
  - Handle stage regeneration
- **Dependencies**: HashtagGenerator, TemplateEngine, repositories

##### HashtagGenerator.js
- **Purpose**: Generate contextual hashtags
- **Responsibilities**:
  - Extract hashtags from concepts and contexts
  - Sanitize hashtag format
  - Provide role-specific hashtags
- **Dependencies**: None (pure function)

#### Templates (`src/engines/prompt/templates/`)

##### TemplateEngine.js
- **Purpose**: Process templates and build prompts
- **Responsibilities**:
  - Interpolate template variables
  - Build complete educational prompts
  - Add contextual and formatting guidance
- **Dependencies**: VariableBuilder, TemplateRepository

##### VariableBuilder.js
- **Purpose**: Build template variables for interpolation
- **Responsibilities**:
  - Generate contextual variables
  - Map concepts and contexts to template values
  - Provide intelligent defaults
- **Dependencies**: None (pure function)

#### Selectors (`src/engines/prompt/selectors/`)

##### ComplexitySelector.js
- **Purpose**: Intelligent complexity level selection
- **Responsibilities**:
  - Weighted random selection of complexity
  - Support for biased selection
  - Progression logic
- **Dependencies**: None

### Data Layer (`src/data/`)

#### Repositories (`src/data/repositories/`)

##### ConceptRepository.js
- **Purpose**: Manage concept data access
- **Responsibilities**:
  - Load and cache concept data
  - Filter concepts by category, complexity, role
  - Provide intelligent concept selection
- **Dependencies**: Concept model, core-concepts.json

##### TemplateRepository.js
- **Purpose**: Manage lesson template data
- **Responsibilities**:
  - Load template formats and role instructions
  - Select appropriate lesson formats
  - Provide template statistics
- **Dependencies**: LessonTemplate model, lesson-templates.json

##### ScenarioRepository.js
- **Purpose**: Manage contextual scenario data
- **Responsibilities**:
  - Load domain contexts and scenarios
  - Select contexts with intelligent weighting
  - Provide scenario statistics
- **Dependencies**: Context model, contextual-scenarios.json

##### StrategyRepository.js
- **Purpose**: Manage oblique strategy data
- **Responsibilities**:
  - Load and cache strategies
  - Random strategy selection
  - Category-based filtering
- **Dependencies**: ObliqueStrategy model, oblique-strategies.json

#### Models (`src/data/models/`)

##### Concept.js
- **Purpose**: Represent software architecture concepts
- **Responsibilities**:
  - Validate concept data
  - Provide role relevance checking
  - Generate hashtags and component references
- **Validation**: Name, complexity level, category

##### Context.js
- **Purpose**: Represent domain contexts and scenarios
- **Responsibilities**:
  - Validate context data
  - Generate contextual hashtags
  - Provide business and technical context
- **Validation**: Name, characteristics, constraints

##### LessonTemplate.js
- **Purpose**: Represent lesson templates
- **Responsibilities**:
  - Validate template structure
  - Provide deliverables by role/complexity
  - Format template guidance
- **Validation**: Key, structure array, guidance

##### Stage.js
- **Purpose**: Represent individual learning stages
- **Responsibilities**:
  - Validate stage data
  - Calculate reading time and word count
  - Provide role key mapping
- **Validation**: Stage name, prompt content, complexity

##### Cycle.js
- **Purpose**: Represent complete learning cycles
- **Responsibilities**:
  - Validate cycle structure
  - Aggregate stage statistics
  - Provide cycle summary
- **Validation**: ID, stages array, complexity

##### ObliqueStrategy.js
- **Purpose**: Represent creative thinking strategies
- **Responsibilities**:
  - Validate strategy data
  - Format strategy text
  - Provide integration guidance
- **Validation**: Text content, category

## Data Flow

### Cycle Generation Flow
1. **PromptEngine.generateCycle()** called
2. **CycleGenerator** selects context and complexity
3. **ScenarioRepository** provides domain context
4. **ComplexitySelector** determines difficulty level
5. **StrategyRepository** optionally provides oblique strategy
6. **StageGenerator** creates 4 stages (Expert Engineer, System Designer, Leader, Review & Synthesis)
7. For each stage:
   - **ConceptRepository** selects relevant concepts
   - **TemplateEngine** builds prompt with variable interpolation
   - **HashtagGenerator** creates contextual hashtags
8. **Cycle** model validates and packages result

### Stage Regeneration Flow
1. **PromptEngine.regenerateStage(stageName)** called
2. **StageGenerator** maps stage name to role key
3. Fresh context and complexity selected
4. New concepts selected for role
5. Template processed with new variables
6. **Stage** model validates and returns result

## Error Handling Strategy

### Defensive Programming
- All data access includes null checks
- Fallback values provided at every level
- Try-catch blocks around critical operations

### Graceful Degradation
- System continues working with partial data
- Default values ensure valid output
- Logging captures issues for debugging

### Validation Layers
- Models validate data at construction
- Repositories validate data access
- Generators validate output

## Testing Strategy

### Unit Tests
- Each component tested in isolation
- Mock dependencies for focused testing
- Comprehensive edge case coverage

### Integration Tests
- End-to-end prompt generation flow
- Data loading and processing
- Template interpolation validation

### Test Infrastructure
- Vitest for fast, modern testing
- Mock fixtures for consistent test data
- Coverage reporting and CI integration

## Performance Considerations

### Caching Strategy
- Repositories cache processed data
- Models created once and reused
- Expensive operations memoized

### Memory Management
- Efficient object creation patterns
- Proper cleanup of temporary objects
- Minimal memory footprint

### Selection Algorithms
- Optimized filtering and selection
- Weighted random selection
- Efficient array operations

## Extension Points

### Adding New Concepts
1. Update `core-concepts.json` with new concept data
2. Tests automatically validate structure
3. Repository loads and caches new concepts
4. Available immediately in generation

### Adding New Templates
1. Update `lesson-templates.json` with new format
2. Update template selection logic if needed
3. Add role instructions for new format
4. Test with various concept combinations

### Adding New Domains
1. Update `contextual-scenarios.json` with domain data
2. Add domain-specific helper methods if needed
3. Update context selection weighting
4. Test with various complexity levels

### Adding New Strategies
1. Update `oblique-strategies.json` with strategy data
2. Categorize strategy appropriately
3. Add integration patterns
4. Test with various contexts

## Migration Guide

### From Legacy System
1. Old `advancedPromptGenerator.js` → New modular architecture
2. Same public API maintained for compatibility
3. Enhanced error handling and null safety
4. Template interpolation now works correctly

### Import Updates
- `../utils/advancedPromptGenerator.js` → `../engines/prompt/PromptEngine.js`
- Data files moved to `../data/sources/` directory
- Use migration script: `node scripts/migrate-imports.js`

## Monitoring and Debugging

### Logging Strategy
- Comprehensive logging at all levels
- Performance metrics captured
- Error context preserved
- Debug information available

### Statistics and Metrics
- Repository statistics available
- Generation performance tracked
- Content variety measured
- Usage patterns monitored

This architecture provides a solid foundation for the educational prompt generation system, with clear separation of concerns, comprehensive testing, and excellent maintainability.
