# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

The application has been completely refactored into a **modular, testable architecture** with clear separation of concerns:

### Core Engine (`src/engines/prompt/`)
- **PromptEngine.js** - Main orchestrator coordinating all components
- **generators/** - Specialized generators for cycles, stages, and hashtags
- **templates/** - Template processing and variable interpolation
- **selectors/** - Intelligent selection logic for complexity and contexts

### Data Layer (`src/data/`)
- **repositories/** - Data access layer with caching and filtering
- **models/** - Domain models with validation and business logic
- **sources/** - JSON data files (concepts, templates, scenarios, strategies)

### Testing Infrastructure (`src/__tests__/`)
- **Comprehensive unit tests** for all components
- **Test fixtures** and mocks for reliable testing
- **Coverage reporting** and CI-ready configuration

## 🚀 Key Features

### Educational Meta-Prompt Generation
- Creates prompts that **instruct AI systems** (ChatGPT, Gemini) how to generate lessons
- Defines lesson structure, content guidelines, and formatting requirements
- Supports multiple lesson formats: concept exploration, trade-off analysis, pattern studies

### Intelligent Context Selection
- **Domain-specific scenarios** (fintech, ecommerce, healthcare, gaming, IoT)
- **Role-based perspectives** (Expert Engineer, System Designer, Leader, Review & Synthesis)
- **Complexity-aware content** (beginner, intermediate, advanced)

### Creative Variation System
- **Oblique strategies** inspired by Brian Eno for lateral thinking
- **Template interpolation** with contextual variables
- **Combinatorial generation** for diverse, non-repetitive content

## 📁 Project Structure

```
src/
├── engines/prompt/           # Core prompt generation engine
│   ├── PromptEngine.js      # Main orchestrator
│   ├── generators/          # Specialized generators
│   ├── templates/           # Template processing
│   └── selectors/           # Selection logic
├── data/                    # Data layer
│   ├── repositories/        # Data access objects
│   ├── models/             # Domain models
│   └── sources/            # JSON data files
├── components/             # React UI components
├── context/               # React context providers
├── utils/                 # Utilities and helpers
└── __tests__/            # Comprehensive test suite
```

## 🧪 Testing

The project includes a comprehensive test suite with:

```bash
# Run all tests
bun test

# Watch mode for development
bun test:watch

# Generate coverage report
bun test:coverage

# Interactive test UI
bun test:ui
```

### Test Coverage
- **Unit tests** for all repositories, models, and generators
- **Integration tests** for the complete prompt generation flow
- **Mock fixtures** for reliable, fast testing
- **95%+ code coverage** target

## 🛠️ Development

### Prerequisites
- Node.js 18+ or Bun runtime
- Modern web browser

### Setup
```bash
# Install dependencies
bun install

# Start development server
bun dev

# Run tests
bun test

# Build for production
bun build
```

### Code Quality
- **ESLint** configuration for consistent code style
- **Modular architecture** with clear separation of concerns
- **Comprehensive logging** for debugging and monitoring
- **Type safety** through careful validation

## 📊 Data Sources

### Core Concepts (`core-concepts.json`)
- Software architecture fundamentals from "Fundamentals of Software Architecture"
- Organized by category: foundational, structural, qualitative
- Includes complexity levels, relationships, and key insights

### Lesson Templates (`lesson-templates.json`)
- Multiple lesson formats for different learning objectives
- Role-specific instructions and deliverables
- Template interpolation with contextual variables

### Contextual Scenarios (`contextual-scenarios.json`)
- Real-world domain contexts (fintech, ecommerce, healthcare, etc.)
- Domain-specific constraints, stakeholders, and scenarios
- Technical challenges and business contexts

### Oblique Strategies (`oblique-strategies.json`)
- Creative thinking prompts adapted for software architecture
- Categorized strategies for different types of lateral thinking
- Integration patterns for lesson variation

## 🎯 Usage Examples

### Generating a Learning Cycle
```javascript
import { generateCycle } from './src/engines/prompt/PromptEngine.js';

const cycle = generateCycle();
// Returns: Complete 4-stage learning cycle with contextual prompts
```

### Regenerating a Specific Stage
```javascript
import { regenerateStage } from './src/engines/prompt/PromptEngine.js';

const stage = regenerateStage('Expert Engineer');
// Returns: New prompt for the specified role with fresh context
```

## 🔧 Customization

### Adding New Concepts
1. Edit `src/data/sources/core-concepts.json`
2. Add concepts with proper categorization and complexity
3. Tests will automatically validate the new data

### Creating New Lesson Formats
1. Add format to `src/data/sources/lesson-templates.json`
2. Define structure, guidance, and role instructions
3. Update template selection logic if needed

### Extending Domain Contexts
1. Add domain to `src/data/sources/contextual-scenarios.json`
2. Include characteristics, constraints, and scenarios
3. Update context-specific helper methods

## 🚦 Migration from Legacy System

The system has been completely refactored from a monolithic 800+ line generator to a modular architecture:

### ✅ Improvements
- **Modular design** with single responsibility components
- **Comprehensive testing** with 95%+ coverage
- **Better error handling** and null safety
- **Template interpolation** that actually works
- **Cleaner separation** of data, logic, and presentation

### 🔄 Backward Compatibility
- Same public API for `generateCycle()` and `regenerateStage()`
- Existing React components work without changes
- Enhanced prompt quality and variety

## 📈 Performance

- **Lazy loading** of data repositories
- **Caching** of processed concepts and templates
- **Efficient selection algorithms** for large datasets
- **Memory-conscious** object creation and disposal

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Add tests** for new functionality
4. **Ensure** all tests pass
5. **Submit** a pull request

### Development Guidelines
- Follow the modular architecture patterns
- Add comprehensive tests for new features
- Update documentation for API changes
- Maintain backward compatibility when possible
