# Step 7: System Architecture - Summary

## Key Participants
- **SA (Solution Architect)**: Overall system architecture and design patterns
- **FSD (Full-Stack Developer)**: Implementation considerations and technical details
- **AI (AI Specialist)**: AI integration and semantic search capabilities

## Architecture Overview
### Onion Architecture Pattern
- **Domain Layer**: Core entities (Skill, Competency, UserSkill) and domain services (GapAnalysis, Verification, Taxonomy)
- **Application Layer**: Business use cases (Profile Initialization, Verification Processing, Gap Analysis)
- **Infrastructure Layer**: Database access, Kafka, OpenAI API, and external integrations
- **Presentation Layer**: REST Controllers and API Gateway

## Tech Stack
- **Backend**: Node.js / Express / TypeScript / PostgreSQL (pgvector) / Kafka / gRPC
- **Frontend**: React + Next.js
- **Deployment**: Railway (backend) / Vercel (frontend)
- **CI/CD**: GitHub Actions

## Microservice Responsibilities
- Manage the Skills & Competency Taxonomy (4 levels – L1–L4)
- Build and maintain User Skill Profiles with verification status
- Compute Competency Levels and Gap Analysis dynamically
- Share skill and profile data with other microservices (Analytics, Assessment, Learner AI, etc.)

## API Patterns
- **Primary Pattern**: REST API for external communication
- **Internal Communication**: gRPC for high-performance internal calls
- **Event-Driven**: Kafka for asynchronous event processing
- **External Integrations**: REST APIs for external service communication

## Storage & Caching
- **Primary Database**: PostgreSQL with pgvector for semantic search
- **Caching Strategy**: Optional Redis cache for taxonomy queries
- **Performance Targets**:
  - pgvector query time: 50–80ms
  - Gap analysis response: <1s
  - Throughput: 200 RPS

## Scalability & Fault Tolerance
- **Scaling Strategy**: Railway auto-scaling for stateless microservices
- **Database Scaling**: Database partitioning + read replicas for 100K users / 50K skills
- **Performance Optimization**: Precomputed competency levels for faster reads
- **Load Balancing**: Railway built-in load balancing

## Security Layers
- **Encryption**: TLS 1.3 + Transparent Data Encryption
- **Authentication**: OAuth 2.0 / JWT for external APIs
- **Internal Security**: mTLS for internal services
- **Data Credibility**: Source hierarchy: Assessment > Certification > AI Extraction
- **GDPR Compliance**: Immutable audit logs, Right to Erasure & Data Export support

## Integration Points
### Kafka Events
- UserCreatedEvent from Directory
- AssessmentResultAvailableEvent
- SkillGapDetectedEvent
- ProfileUpdatedEvent

### REST APIs
- Directory Service integration
- Assessment Service integration
- Course Builder integration
- Learner AI integration
- Learning Analytics integration

### External APIs
- OpenAI API for skill extraction
- External frameworks (SFIA / ESCO) for skill discovery

## Core Workflows
### Workflow 1: Profile Initialization
- **Trigger**: UserCreatedEvent from Directory via Kafka
- **Steps**: Use GPT-4 to parse CV/resume → Map skills to taxonomy using pgvector → Trigger assessment generation
- **Output**: Initial user skill profile with extracted skills

### Workflow 2: Verification & Recalculation
- **Trigger**: AssessmentResultAvailableEvent
- **Steps**: Update verification status → Compute new competency level → Generate Gap Analysis → Publish events
- **Output**: Updated user profile with new competency levels

### Workflow 3: On-Demand Skill Discovery
- **Trigger**: Request from Course Builder
- **Steps**: Semantic skill search using pgvector → Query external frameworks if needed → Normalize via GPT-4
- **Output**: Relevant skill suggestions for learning paths

## Database Design
### Core Tables
- skills / competencies – main entities
- skill_hierarchy / competency_hierarchy – self-referencing parent–child trees (Recursive CTEs)
- user_skill / user_competencies – store verification and competency levels per user
- audit_log – immutable audit trail for GDPR compliance

### Design Principles
- Recursive structure with hierarchical queries
- Precomputed competency levels for performance

## Project Structure
- **Backend**: Organized by Onion layers (domain, application, infrastructure, presentation)
- **Frontend**: Next.js with SSR; displays skill trees, competency cards, and gap reports
- **Testing**: Unit, integration, and end-to-end (Jest)
- **CI/CD**: GitHub Actions → runs tests → deploys to Railway (backend) and Vercel (frontend)

## Infrastructure as Code Setup
- **Backend Deployment**: Railway (Dockerfile + railway.toml)
- **Frontend Deployment**: Vercel (Next.js + vercel.json)
- **CI/CD Pipeline**: GitHub Actions automates build, test, and deployment
- **Database Migrations**: TypeORM with automatic run and rollback support

## Design Assumptions & Trade-offs
- **Precomputed Competency Levels**: Faster reads, slower writes
- **pgvector Semantic Search**: Better skill matching, additional complexity
- **Event-Driven Architecture**: Better scalability, eventual consistency
- **Multi-Tenant Isolation**: Data security, additional query complexity

## Step 7 Status: ✅ COMPLETE
Comprehensive system architecture designed with Onion pattern, microservices, event-driven workflows, and scalable infrastructure. Ready to proceed to Step 8.

