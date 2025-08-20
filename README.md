# 🧠 Software Architecture Learning Companion

## Unlock Deeper Understanding in Software Architecture

This application is your personal guide to mastering software architecture concepts through a unique, multi-perspective learning approach.

## What is this app?

At its core, this app generates **multi-stage learning prompts** designed to help you think like a seasoned software architect. Each learning "cycle" consists of four distinct, yet complementary, stages:

1. **Expert Engineer**: Focuses on implementation details, patterns, and technical trade-offs.
2. **System Designer**: Challenges you to consider architecture boundaries, data flow, scalability, and integration.
3. **Leader**: Prompts you to think about socio-technical constraints, communication, alignment, and risk.
4. **Review & Synthesis**: Guides you to integrate all perspectives, surface trade-offs, and consolidate your understanding.

By cycling through these varied viewpoints, you'll build a more robust and adaptable understanding of complex architectural challenges.

## Why does it exist?

Learning software architecture can be challenging. Traditional methods often focus on isolated concepts, making it hard to connect them to real-world scenarios or understand their broader implications. This app addresses that by:

* **Applying Learning Science**: It leverages proven educational principles like interleaving (mixing different but related skills), spaced practice (revisiting concepts over time), and multiple representations (seeing problems from various angles) to enhance long-term retention and transfer of knowledge.
* **Fostering Holistic Thinking**: Instead of just memorizing patterns, you'll learn to reason about software systems from technical, business, and leadership perspectives, preparing you for real-world decision-making.
* **Making Learning Active**: The prompts encourage active problem-solving and reflection, moving beyond passive consumption of information.

## What can you get by using it?

Using this app will help you:

* **Develop a Durable Understanding**: Build knowledge that sticks, allowing you to recall and apply concepts effectively in diverse situations.
* **Improve Critical Thinking**: Learn to analyze architectural problems from multiple angles, identify trade-offs, and make informed decisions.
* **Enhance Problem-Solving Skills**: Practice applying architectural principles to realistic scenarios, tailored to your interests and desired complexity.
* **Tailor Your Learning**: Customize prompts based on specific domains (e.g., fintech, e-commerce) and complexity levels (beginner, intermediate, advanced).

## Getting Started

Ready to dive in? Here's how to get the app up and running quickly.

### Requirements

* Node.js 18+ (recommended) or Bun

### Installation & Running

1. **Install Dependencies**:

    ```bash
    bun install
    ```

2. **Start the Development Server**:

    ```bash
    bun run dev
    ```

    The app will typically open in your browser at `http://localhost:5173`.

### Other Useful Commands

* **Run Tests**:

    ```bash
    bun run test
    ```

* **Lint Source Code**:

    ```bash
    bun run lint
    ```

* **Build for Production**:

    ```bash
    bun run build
    ```

## UI Overview

The application features an intuitive interface:

* **How It Works Landing Page**: Explains the four learning stages and guides you on how to use the tool.
* **Stage Prompt View**: Provides a dedicated editor for each stage, displaying the generated educational prompts.

For a visual tour, check out the screenshots in the `images/` directory.

## For Developers

Interested in the technical details or contributing? You can find more in-depth documentation here:

* **Prompt Engine**: `docs/PROMPT-ENGINE.md`
* **Data Model**: `docs/DATA-MODEL.md`
* **Architecture**: `docs/ARCHITECTURE.md`

This project is built with a modular design and comprehensive test coverage, ensuring maintainability and extensibility.
