# Domains and Areas of Interest

This living document enumerates the user's preferred domains and technologies to guide context weighting, content generation, and future roadmap.

## Domains and Use-Cases

* Entertainment arts
  * Subdomains
    * Animation & VFX pipelines
    * Audio/video post-production
    * Interactive installations & live shows
  * Workflows
    * Asset ingestion, tagging, and versioning
    * Review/approval loops (dailies)
    * Render farm orchestration & scheduling
  * Challenges
    * Real-time preview performance
    * Large binary asset distribution
    * IP protection, watermarking, rights management
  * Stakeholders
    * Artists, technical directors (TDs), producers
    * Pipeline engineers and IT/infrastructure
    * Legal and rights management
  * Constraints
    * Extremely large assets and long-running jobs
    * Vendor toolchains and licensing restrictions
    * Security, watermarking, and access controls
  * KPIs
    * Render throughput and review turnaround time
    * Asset reuse rate and version accuracy
    * Cost per render minute
  * Related Tech
    * #file-formats #storage #ipc #sql #genai

* Comics
  * Subdomains
    * Digital-first publishing
    * Creator collaboration platforms
    * Archival and remastering
  * Workflows
    * Page layout and lettering toolchains
    * Variant editions and metadata
    * Distribution (web, mobile, print-on-demand)
  * Challenges
    * Color management across devices
    * Back-catalog search and retrieval
    * Royalty tracking and micropayments
  * Stakeholders
    * Creators, editors, and publishers
    * Production managers and archivists
    * Legal/finance for royalties and rights
  * Constraints
    * Color profiles, print/web fidelity, device variability
    * Distribution formats, DRM, and metadata standards
    * Long-tail back-catalog management
  * KPIs
    * Time-to-publish, readership engagement, retention
    * Search success rate and catalog coverage
    * Accurate royalty accounting
  * Related Tech
    * #file-formats #sql #genai

* Graphic applications
  * Subdomains
    * Vector/raster editors
    * Procedural design tools
    * Real-time effects engines
  * Workflows
    * Plugin/extension ecosystems
    * Collaboration and presence
    * Cross-platform packaging
  * Challenges
    * GPU acceleration and memory pressure
    * Undo/redo reliability and CRDTs
    * File format interoperability
  * Stakeholders
    * Designers, illustrators, and creative developers
    * Graphics and platform engineers
    * Product and QA
  * Constraints
    * GPU/CPU budgets, memory limits, platform differences
    * Realtime responsiveness and robust state sync
    * Cross-format import/export compatibility
  * KPIs
    * FPS/frame time, startup time, crash-free sessions
    * Collaboration latency and merge conflict rates
    * File load/save success and fidelity
  * Related Tech
    * #tauri #wasm #rust #ipc

* Creative coding
  * Subdomains
    * Generative art systems
    * Live coding/performative coding
    * Interactive installations
  * Workflows
    * Rapid prototyping playgrounds
    * Shader pipelines (GLSL/WGSL)
    * Asset pipelines for sketches
  * Challenges
    * Real-time performance and jitter
    * Determinism vs. randomness
    * Reproducibility and sharing
  * Stakeholders
    * Creative coders, educators, performers
    * Tool authors and community maintainers
    * Event/show operators
  * Constraints
    * Live performance timing and I/O constraints
    * Simplicity and approachability for learners
    * Portability across OS/hardware
  * KPIs
    * Latency under load, iteration speed
    * Reproducible builds/runs
    * Audience interaction metrics
  * Related Tech
    * #javascript #typescript #wasm #rust #genai

* Coding
  * Subdomains
    * Algorithms and data structures
    * Software craftsmanship and design patterns
    * Testing, debugging, and refactoring
  * Workflows
    * TDD/BDD cycles and red-green-refactor
    * Code review and pair/mob programming
    * Continuous integration checks and pre-commit hooks
  * Challenges
    * Managing complexity and technical debt
    * Performance profiling and optimization
    * Readability, maintainability, and documentation
  * Stakeholders
    * Developers, tech leads, and maintainers
    * QA and release managers
    * Security and compliance reviewers
  * Constraints
    * Legacy code, mixed stacks, size of codebase
    * Team skill distribution and onboarding time
    * Security and compliance standards
  * KPIs
    * Defect rate and mean time to restore (MTTR)
    * Lead time for changes and cycle time
    * Test coverage and review throughput
  * Related Tech
    * #typescript #javascript #golang #rust

* Server-side development
  * Subdomains
    * APIs (REST/GraphQL/gRPC)
    * Event-driven services
    * Batch/ETL processing
  * Workflows
    * CI/CD pipelines and canary deploys
    * Observability (logs, metrics, traces)
    * Infra as code (IaC)
  * Challenges
    * Backwards compatibility and API versioning
    * Data consistency and idempotency
    * Multiregion latency and failover
  * Stakeholders
    * Platform engineers, SREs, product teams
    * Security and data governance
    * Finance for cost oversight
  * Constraints
    * SLAs/SLOs, compliance, and security posture
    * Data regulations and lifecycle policies
    * Cost and capacity constraints
  * KPIs
    * p95/p99 latency, error rates, availability
    * Data consistency metrics and backlog size
    * Cost per request and utilization
  * Related Tech
    * #golang #rust #sql #ipc #gcp

* Scripting and tooling for software engineering
  * Subdomains
    * Developer CLIs and task runners
    * Code generation and scaffolding
    * Static analysis and linting
  * Workflows
    * Local-first automation
    * Monorepo orchestration
    * Release/version management
  * Challenges
    * Cross-OS portability
    * Plugin ecosystems and sandboxing
    * Performance on large repos
  * Stakeholders
    * Developers and build/release engineers
    * Tooling/platform maintainers
    * Security and IT admins
  * Constraints
    * Portability across OS/architectures
    * Performance and resource limits on CI
    * Sandboxing and extension security
  * KPIs
    * Build time, task execution time, cache hit rate
    * Developer adoption and usage frequency
    * Incidents related to tooling
  * Related Tech
    * #golang #typescript #javascript #rust

* Analytics and data visualization
  * Subdomains
    * BI dashboards and reporting
    * Real-time streaming analytics
    * Exploratory/interactive viz
  * Workflows
    * Data modeling and semantic layers
    * Caching and pre-aggregation
    * Notebook-to-prod promotion
  * Challenges
    * Data freshness vs. cost
    * Accessibility and perceptual accuracy
    * Multitenant isolation
  * Stakeholders
    * Analysts, data scientists, and engineers
    * Decision-makers and operations
    * Security and privacy officers
  * Constraints
    * Data volume/velocity, governance, PII handling
    * Visual accessibility and device diversity
    * Cost of compute/storage
  * KPIs
    * Dashboard load time and query latency
    * Data freshness and correctness
    * Adoption and decision cycle time
  * Related Tech
    * #sql #file-formats #gcp #genai

* Computer graphics
  * Subdomains
    * Rendering (rasterization/ray tracing)
    * Geometry processing
    * Materials/shading systems
  * Workflows
    * Asset pipelines and scene graphs
    * GPU/compute scheduling
    * Profiling and frame budgeting
  * Challenges
    * Precision/performance trade-offs
    * Platform driver variability
    * Parallelism and synchronization
  * Stakeholders
    * Graphics engineers and technical artists
    * Engine/tool developers
    * QA/performance teams
  * Constraints
    * Real-time budgets (ms/frame), memory bandwidth
    * Hardware/driver variability and fallbacks
    * Numerical stability and precision
  * KPIs
    * FPS/frame time stability and variance
    * Visual fidelity vs. performance trade-off
    * GPU/CPU utilization
  * Related Tech
    * #rust #wasm

* Payment systems
  * Subdomains
    * Card processing and tokenization
    * Payouts and disbursements
    * Risk/fraud detection
  * Workflows
    * Idempotent transaction flows
    * Reconciliation and settlements
    * Chargeback and dispute handling
  * Challenges
    * Compliance (PCI-DSS, PSD2, SCA)
    * High availability and retries
    * Currency, tax, and FX handling
  * Stakeholders
    * Merchants, finance, and accounting
    * Risk/fraud teams and compliance
    * Customer support
  * Constraints
    * Regulatory and audit requirements
    * Global payments variations and currencies
    * Latency/availability targets
  * KPIs
    * Authorization success rate and approval rate
    * Chargeback rate and fraud losses
    * Settlement time and reconciliation accuracy
  * Related Tech
    * #sql #ipc #golang #rust

* DevOps
  * Subdomains
    * Provisioning and configuration management
    * Observability and SRE practices
    * Platform engineering
  * Workflows
    * GitOps and pipelines
    * Incident response and postmortems
    * Policy as code and guardrails
  * Challenges
    * Safe rollout strategies
    * Cost optimization
    * Secrets and key management
  * Stakeholders
    * SREs, platform and security engineers
    * Product teams and release managers
    * Compliance/audit partners
  * Constraints
    * Change management and policy enforcement
    * Shared platform constraints and quotas
    * Budget caps and cost controls
  * KPIs
    * Deployment frequency and lead time
    * MTTR and change failure rate
    * Cost per environment and utilization
  * Related Tech
    * #gcp #ipc

* Cloud architecture
  * Subdomains
    * Multi-cloud and hybrid cloud
    * Serverless compute and managed services
    * Data platforms (OLTP/OLAP/lakehouse)
  * Workflows
    * Landing zones, guardrails, and baseline networking
    * IaC modules, blueprints, and golden paths
    * Capacity planning and cost governance (FinOps)
  * Challenges
    * Reliability (SLOs, error budgets) and regional failover
    * Security posture management and least-privilege IAM
    * Data residency, sovereignty, and egress costs
  * Stakeholders
    * Cloud architects, platform engineers, security
    * Finance/FinOps
    * Application owners
  * Constraints
    * Multi-region architecture and failover design
    * IAM policies and guardrails
    * Budget and cost governance
  * KPIs
    * Availability SLO attainment and error budget burn
    * RTO/RPO and recovery success rate
    * Cost per workload and egress spend
  * Related Tech
    * #gcp #sql #ipc

* Software distribution
  * Subdomains
    * Package registries and artifact stores
    * Update channels and delivery
    * Licensing and compliance
  * Workflows
    * Release orchestration and signing
    * Delta updates and patching
    * SBOM generation and provenance
  * Challenges
    * Supply-chain security
    * Offline/air-gapped environments
    * Backward/forward compatibility
  * Stakeholders
    * Release managers, platform engineers
    * Security and compliance
    * End users and IT admins
  * Constraints
    * Code signing and provenance requirements
    * Bandwidth/patch size and offline modes
    * Compatibility and rollout windows
  * KPIs
    * Update success rate and rollback frequency
    * Time-to-patch and CVE exposure window
    * Install size and delta efficiency
  * Related Tech
    * #tauri #file-formats

* App development
  * Subdomains
    * Desktop (Tauri/Electron), mobile, and web apps
    * Offline-first and sync engines
    * Accessibility-first design
  * Workflows
    * Design systems and component libraries
    * Feature flagging and experimentation
    * Error reporting and feedback loops
  * Challenges
    * Performance budgets and UX latency
    * Cross-platform consistency
    * Privacy and data governance
  * Stakeholders
    * Product managers, engineers, QA
    * Support and growth/marketing
    * Security/privacy teams
  * Constraints
    * Accessibility, privacy, and regulatory needs
    * Offline-first and sync constraints
    * Device fragmentation and distribution
  * KPIs
    * Crash-free sessions and startup time
    * Retention/engagement and task success
    * Error rate and support volume
  * Related Tech
    * #tauri #javascript #typescript #rust #wasm

## Technologies and Platforms

* JavaScript (JS)
  * Concepts
    * Event loop: tasks, microtasks, async/await
    * Module systems (ESM), bundling, and tree-shaking
    * Multi-runtime usage: browser, server, and desktop (WebView bridges)
  * Hashtags
    * #javascript #async #eventloop #esm #bundling
  * Interfaces & Integration
    * DOM/Web APIs, fetch/HTTP, Streams
    * IPC bridges to native (desktop/mobile)
    * Testing/build pipelines and devtools
  * Quality Attributes
    * Agility and ecosystem breadth
    * Single-threaded concurrency model
    * Portability across environments
  * Applies To Domains
    * App development, Creative coding, Graphic applications

* TypeScript (TS)
  * Concepts
    * Structural typing, generics, discriminated unions
    * Type inference, narrowing, and declaration merging
    * API contracts and schema validation interop
  * Hashtags
    * #typescript #typesafety #generics #dx #apis
  * Interfaces & Integration
    * Type-checker, build tooling, and language services
    * API schema/type generation and validation
    * Monorepo/workspace authoring patterns
  * Quality Attributes
    * Type safety and maintainability
    * Developer experience and refactorability
    * Interop with JS ecosystem
  * Applies To Domains
    * App development, Scripting/tooling, Server-side development

* Go
  * Concepts
    * Goroutines, channels, and CSP patterns
    * Interfaces, composition, and error handling
    * Modules, cross-compilation, and slim containerization
  * Hashtags
    * #golang #concurrency #goroutines #csp #tooling
  * Interfaces & Integration
    * net/http, gRPC, CLI tooling
    * Cross-compilation and container images
    * Observability libraries
  * Quality Attributes
    * Concurrency and simplicity
    * Small static binaries and fast builds
    * Operational predictability
  * Applies To Domains
    * Server-side development, DevOps, Cloud architecture, Payment systems

* Rust
  * Concepts
    * Ownership/borrowing, lifetimes, and zero-cost abstractions
    * Traits, generics, and pattern matching
    * Async executors, FFI boundaries, and safe/unsafe interfaces
  * Hashtags
    * #rust #ownership #lifetimes #traits #async #ffi
  * Interfaces & Integration
    * FFI to C/C++, WebAssembly targets
    * Native plugins and high-performance libraries
    * Async runtimes and networking
  * Quality Attributes
    * Memory safety and performance
    * Predictable latency and low footprint
    * Strong type system for reliability
  * Applies To Domains
    * Computer graphics, App development, Scripting/tooling, WASM workloads

* WebAssembly (WASM)
  * Concepts
    * WASI and sandboxed execution
    * Linear memory, host bindings, and capability security
    * Component model and polyglot modules
  * Hashtags
    * #wasm #wasi #sandboxing #portability #componentmodel
  * Interfaces & Integration
    * WASI host calls and capability-based security
    * Language toolchains and adapters
    * Browser and server runtimes
  * Quality Attributes
    * Portability and isolation
    * Startup speed and predictable performance
    * Polyglot composition
  * Applies To Domains
    * App development, Graphic applications, Creative coding, Analytics

* Tauri
  * Concepts
    * WebView frontends with native command bridges
    * Secure IPC, permission model, updater/distribution
    * Packaging, code signing, and auto-update channels
  * Hashtags
    * #tauri #desktop #ipc #security #distribution
  * Interfaces & Integration
    * Command/IPC bridge to native code
    * Auto-updater and signing pipelines
    * System integration (tray, fs, notifications)
  * Quality Attributes
    * Small footprint and security posture
    * Cross-platform consistency
    * Offline capabilities
  * Applies To Domains
    * App development, Graphic applications, Software distribution

* Generative AI (GenAI)
  * Concepts
    * Prompt engineering and system/content policies
    * Embeddings, vector indexes, and retrieval-augmented generation (RAG)
    * Evaluation, safety, and latency/throughput trade-offs
  * Hashtags
    * #genai #rag #embeddings #prompting #evals #latency
  * Interfaces & Integration
    * Tokenization/embedding, vector DBs, scoring
    * Tool/agent connectors and orchestration
    * Safety/evaluation harnesses
  * Quality Attributes
    * Controllability and safety
    * Latency vs. quality trade-offs
    * Cost awareness
  * Applies To Domains
    * Entertainment arts, Creative coding, Analytics and data visualization

* File Formats & Data Storage
  * Concepts
    * Serialization: JSON, CSV, Parquet, Avro, Protobuf
    * Media: PNG/JPEG/SVG; audio/video containers; color spaces
    * Storage models: object, block, and file; durability and lifecycle
    * Schema evolution, compression, indexing, content-addressed storage
  * Hashtags
    * #file-formats #serialization #storage #compression #schema #indexing #durability
  * Interfaces & Integration
    * File I/O, object storage APIs, streaming read/write
    * Schema registries and metadata catalogs
    * Checksum/signature and provenance
  * Quality Attributes
    * Durability, integrity, and compatibility
    * Efficient compression and indexing
    * Lifecycle and retention controls
  * Applies To Domains
    * Entertainment arts, Comics, Analytics and data visualization, Software distribution

* SQL Databases
  * Concepts
    * Relational modeling, normalization/denormalization
    * ACID transactions, isolation levels, and locking
    * Indexing (B-tree, hash), query planning, cost-based optimization
    * Replication, partitioning/sharding, OLTP vs. OLAP
  * Hashtags
    * #sql #acid #indexes #queryplanner #oltp #olap #replication #sharding
  * Interfaces & Integration
    * SQL drivers, connection pooling, migrations
    * CDC/replication and analytics exports
    * Access control and governance
  * Quality Attributes
    * Consistency and transactional integrity
    * Query performance and scalability
    * Observability and reliability
  * Applies To Domains
    * Payment systems, Analytics and data visualization, Server-side development

* Inter-Process Communication (IPC)
  * Concepts
    * Sync vs. async; request/response vs. pub/sub
    * Transports: TCP/UDP, Unix domain sockets, shared memory
    * RPC over HTTP, bidirectional streaming, backpressure, idempotency
    * Message formats: JSON, Protobuf, Avro; schema compatibility
  * Hashtags
    * #ipc #rpc #pubsub #backpressure #idempotency #streaming #interoperability
  * Interfaces & Integration
    * Socket APIs, RPC frameworks, message brokers
    * Backpressure/signaling and retry policies
    * Observability and tracing propagation
  * Quality Attributes
    * Latency and throughput
    * Reliability and ordering/once-only semantics
    * Interoperability
  * Applies To Domains
    * App development, Server-side development, Cloud architecture, Payment systems

* GCP (Cloud Platform)
  * Concepts
    * Resource hierarchy (org/folder/project) and IAM principles
    * VPC networking, peering, service perimeters, and private connectivity
    * Managed compute, data, and messaging primitives (platform-agnostic patterns)
    * SLOs, reliability, observability, and cost governance (FinOps)
  * Hashtags
    * #gcp #cloud #iam #vpc #reliability #observability #finops
  * Interfaces & Integration
    * IAM policies, service accounts, workload identity
    * Networking constructs and private endpoints
    * Managed services APIs and IaC
  * Quality Attributes
    * Managed reliability and security baselines
    * Global networking and scalability
    * Cost visibility and controls
  * Applies To Domains
    * Cloud architecture, DevOps, Analytics and data visualization, Server-side development

## Notes

* This list informs context weighting in `ScenarioRepository` and concept selection in `ConceptRepository`.
* We will expand each item with example scenarios, typical constraints, stakeholders, KPIs, and learning outcomes.
* PRs should keep this list synchronized with data sources under `src/data/sources/`.
* Schema for export (canonical keys):
  * Domains: `name`, `overview`, `subdomains[]`, `workflows[]`, `challenges[]`, `stakeholders[]`, `constraints[]`, `kpis[]`, `related_tech_tags[]`
  * Technologies: `name`, `concepts[]`, `hashtags[]`, `interfaces[]`, `quality_attributes[]`, `applies_to_domains[]`
