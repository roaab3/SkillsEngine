# Step 5 - System Architecture

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27  
**Phase:** Step 5 - System Architecture

**Topic:** Architecture, integration, scalability  
**Participants:** SA, FSD, AI  
**Dependencies:** Steps 1-4

---

## 📋 Template Structure

This document follows the Step 5 template structure:

1. [Architecture Diagram](#1-architecture-diagram)
2. [Service Decisions](#2-service-decisions)
3. [API Patterns](#3-api-patterns)
4. [Storage & Caching](#4-storage--caching)
5. [Scalability & Fault Tolerance](#5-scalability--fault-tolerance)
6. [Security Layers](#6-security-layers)
7. [Integration Points](#7-integration-points)
8. [IaC Setup](#8-iac-setup)

---

## 1. Architecture Diagram

### 1.1 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EduCora AI Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Directory   │  │  Assessment  │  │ Course Builder│    │
│  │  (MS #1)     │  │  (MS #5)     │  │  (MS #3)     │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            │                                │
│                  ┌─────────▼─────────┐                      │
│                  │  Unified Data     │                      │
│                  │  Exchange         │                      │
│                  │  Endpoint         │                      │
│                  │  (Gateway)        │                      │
│                  └─────────┬─────────┘                      │
│                            │                                │
│                  ┌─────────▼─────────┐                      │
│                  │  Skills Engine    │                      │
│                  │  (MS #2)          │                      │
│                  │  ┌─────────────┐ │                      │
│                  │  │ API Layer   │ │                      │
│                  │  │ Service Layer│ │                      │
│                  │  │ Data Layer   │ │                      │
│                  │  └─────────────┘ │                      │
│                  └─────────┬─────────┘                      │
│                            │                                │
│         ┌──────────────────┼──────────────────┐            │
│         │                  │                  │            │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐    │
│  │ Learner AI   │  │  Learning    │  │ RAG/Chatbot  │    │
│  │  (MS #7)     │  │  Analytics   │  │  (MS #9)     │    │
│  └────────────┘  │  (MS #8)     │  └──────────────┘    │
│                └──────────────┘                        │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │         PostgreSQL Database (Skills Engine)       │    │
│  │  - skills, competencies, users, userCompetency     │    │
│  │  - Hash Indexes, B-TREE Indexes, VIEW              │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │         Google Gemini API (AI Services)            │    │
│  │  - Flash (fast operations)                         │    │
│  │  - Deep-Search (complex operations)                │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │         Frontend (React + Tailwind CSS)            │    │
│  │  - Dashboard, Cards, Modals                       │    │
│  │  - Dark Emerald Theme                            │    │
│  └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Skills Engine Microservice                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Frontend Layer (React)                 │   │
│  │  - Dashboard Container                              │   │
│  │  - Competency Cards                                 │   │
│  │  - Skills Gap Sidebar                               │   │
│  │  - Detail Modal                                     │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                       │
│  ┌───────────────────▼─────────────────────────────────┐   │
│  │              API Layer (Controllers)                 │   │
│  │  - REST Endpoints                                   │   │
│  │  - Webhook Handlers                                 │   │
│  │  - Request Validation                               │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                       │
│  ┌───────────────────▼─────────────────────────────────┐   │
│  │              Service Layer                          │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ Taxonomy     │  │ Profile      │               │   │
│  │  │ Service      │  │ Service      │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ Gap Analysis │  │ AI Service   │               │   │
│  │  │ Service      │  │              │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  │  ┌──────────────────────────────────────┐          │   │
│  │  │ Unified Data Exchange Integration     │          │   │
│  │  └──────────────────────────────────────┘          │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                       │
│  ┌───────────────────▼─────────────────────────────────┐   │
│  │              Data Access Layer                      │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ Taxonomy     │  │ Profile      │               │   │
│  │  │ Repository   │  │ Repository   │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  │  ┌──────────────┐                                  │   │
│  │  │ Source       │                                  │   │
│  │  │ Repository   │                                  │   │
│  │  └──────────────┘                                  │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │                                       │
│  ┌───────────────────▼─────────────────────────────────┐   │
│  │              Database Layer (PostgreSQL)             │   │
│  │  - Tables: skills, competencies, users, etc.         │   │
│  │  - VIEW: competency_leaf_skills                      │   │
│  │  - Indexes: Hash (Polynomial Rolling), B-TREE       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              External Services                      │   │
│  │  - Google Gemini API (Flash/Deep-Search)            │   │
│  │  - Unified Data Exchange Endpoint                   │   │
│  │  - Web Scraping Services                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Data Flow Diagram

**User Profile Creation Flow:**
```
Directory → Unified Data Exchange → Skills Engine API
    ↓
ProfileService.createUserProfile()
    ↓
┌─────────────────────────────────────┐
│ 1. Create user in users table       │
│ 2. AIService.extractSkills()        │ → Gemini Deep-Search
│ 3. AIService.normalizeSkills()      │ → Gemini Flash
│ 4. AIService.mapSkillsToCompetencies│ → Gemini Deep-Search
│ 5. Build profile structure          │
│ 6. Store in userCompetency/userSkill│
└─────────────────────────────────────┘
    ↓
Return profile to Directory
```

**Assessment Results Processing Flow:**
```
Assessment → Unified Data Exchange → Skills Engine API
    ↓
ProfileService.updateVerifiedSkills()
    ↓
┌─────────────────────────────────────┐
│ 1. Update verifiedSkills JSON       │
│ 2. Calculate coverage percentage   │
│ 3. Map proficiency level            │
│ 4. Calculate relevance score        │
│ 5. Update users.relevance_score     │
└─────────────────────────────────────┘
    ↓
GapAnalysisService.performGapAnalysis()
    ↓
Send to Learner AI (async)
Return updated profile to Directory
```

### 1.4 Architecture Principles

1. **Microservices Architecture:** Skills Engine is an independent microservice
2. **API-First Design:** All communication via REST APIs
3. **Event-Driven:** Asynchronous processing for non-critical operations
4. **Stateless Services:** Services can scale horizontally
5. **Database per Service:** Skills Engine has its own database
6. **Unified Data Exchange:** All inter-microservice communication through Unified Data Exchange Endpoint
7. **Separation of Concerns:** Clear layer separation (API → Service → Data)
8. **Fail-Safe Design:** Graceful degradation and error handling

---

## 2. Service Decisions

### 2.1 Microservice Boundaries

**Owned by Skills Engine:**
- Skills Taxonomy Database (PostgreSQL)
- User Skill Profiles (users, userCompetency, userSkill tables)
- Gap Analysis Logic (narrow and broad gap analysis)
- AI-driven Skill Extraction & Normalization (Gemini API integration)
- Relevance Score Calculation (stored in users table)
- Official Sources Management (official_sources table)

**Not Owned by Skills Engine:**
- User Authentication (handled by Unified Data Exchange)
- Course Content (Course Builder - MS #3)
- Learning Recommendations (Learner AI - MS #7)
- Assessment Questions (Assessment Service - MS #5)
- User Directory Data (Directory Service - MS #1)
- Learning Analytics (Learning Analytics - MS #8)
- RAG/Chatbot Services (RAG/Chatbot - MS #9)

### 2.2 Service Responsibilities

**Core Responsibilities:**
1. **Taxonomy Management:** Build and maintain skills/competencies database
2. **Profile Management:** Create and update user skill profiles
3. **Gap Analysis:** Identify missing skills for users (narrow and broad)
4. **AI Processing:** Extract, normalize, and map skills using AI (Gemini Flash/Deep-Search)
5. **Data Provision:** Provide taxonomy and profile data to other services
6. **Source Management:** Discover and persist official sources for taxonomy

**Non-Responsibilities:**
- User authentication/authorization (Unified Data Exchange)
- Course creation (Course Builder)
- Assessment generation (Assessment Service)
- Learning path recommendations (Learner AI)
- Analytics and reporting (Learning Analytics)

### 2.3 Technology Stack Decisions

**Backend Runtime:**
- **Decision:** Node.js 18+ (TypeScript) OR Python 3.11+ (FastAPI)
- **Rationale:** 
  - Node.js: Better for real-time operations, large ecosystem
  - Python: Better for AI/ML operations, data processing
  - **Recommendation:** Node.js for consistency with other microservices

**Database:**
- **Decision:** PostgreSQL 15+
- **Rationale:** 
  - ACID compliance for critical data
  - JSON support for flexible schema (verifiedSkills)
  - Excellent indexing support (Hash, B-TREE)
  - VIEW support for optimized queries
  - Recursive CTE support for hierarchical queries

**AI Integration:**
- **Decision:** Google Gemini API (Flash & Deep-Search)
- **Rationale:**
  - Fast response times (Flash for simple operations)
  - Deep reasoning (Deep-Search for complex operations)
  - Cost-effective model selection
  - Good prompt engineering support

**Frontend:**
- **Decision:** React 18+ (TypeScript) + Tailwind CSS
- **Rationale:**
  - Component reusability
  - Strong TypeScript support
  - Tailwind for rapid UI development
  - Dark emerald theme customization

### 2.4 Service Decomposition

**Service Layer Components:**
1. **TaxonomyService:** Manages skills and competencies
2. **ProfileService:** Manages user profiles and skill verification
3. **GapAnalysisService:** Performs gap analysis
4. **AIService:** Handles all AI operations
5. **UnifiedDataExchangeIntegration:** Handles inter-microservice communication

**Data Access Layer:**
1. **TaxonomyRepository:** Database operations for taxonomy
2. **ProfileRepository:** Database operations for user profiles
3. **SourceRepository:** Database operations for official sources

### 2.5 Deployment Decisions

**Container Strategy:**
- **Decision:** Docker containers
- **Rationale:** Consistent deployment across environments

**Orchestration:**
- **Decision:** Kubernetes (production) OR Docker Swarm (alternative)
- **Rationale:** 
  - Kubernetes: Industry standard, better scaling
  - Docker Swarm: Simpler, good for smaller deployments

**Database Deployment:**
- **Decision:** Managed PostgreSQL (Supabase) OR self-hosted
- **Rationale:**
  - Managed: Less operational overhead, automatic backups
  - Self-hosted: More control, potentially lower cost

---

## 3. Component Architecture (Reference)

### 3.1 Application Layers (Reference)

```
┌─────────────────────────────────────────┐
│         Frontend Layer (Optional)       │
│  - React Components                     │
│  - State Management                    │
│  - UI/UX (Dark Emerald Theme)          │
│  - Dashboard, Cards, Modals            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         API Layer (Controllers)         │
│  - REST API Endpoints                   │
│  - Webhook Endpoints                    │
│  - Request Validation                   │
│  - Response Formatting                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Service Layer                   │
│  - TaxonomyService                      │
│  - ProfileService                       │
│  - GapAnalysisService                   │
│  - AIService                            │
│  - UnifiedDataExchangeIntegration       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Data Access Layer               │
│  - TaxonomyRepository                   │
│  - ProfileRepository                    │
│  - SourceRepository                     │
│  - Database Connection Pool             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Database Layer                   │
│  - PostgreSQL Database                  │
│  - Views (competency_leaf_skills)       │
│  - Indexes (Hash, B-TREE)              │
│  - Hash Functions (Polynomial Rolling) │
└─────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         External Services                │
│  - Google Gemini API (Flash/Deep-Search)│
│  - Unified Data Exchange Endpoint       │
│  - Web Scraping Services                │
└─────────────────────────────────────────┘
```

### 3.2 Service Components

#### 3.2.1 TaxonomyService
**Purpose:** Manages skills and competencies taxonomy

**Responsibilities:**
- Retrieve MGS for competencies
- Traverse skill hierarchy recursively
- Normalize competency names (AI-based)
- Trigger external knowledge discovery
- Manage competency-skill relationships

**Key Methods:**
- `getMGSForCompetency(competencyId: string): Promise<Skill[]>`
- `traverseSkillHierarchy(skillId: string): Promise<Skill[]>`
- `normalizeCompetencyName(name: string): Promise<string>`
- `discoverExternalCompetency(name: string): Promise<Competency>`
- `getCompetencyById(competencyId: string): Promise<Competency>`
- `getSkillById(skillId: string): Promise<Skill>`

**Dependencies:**
- TaxonomyRepository
- AIService (for normalization and discovery)
- Database (PostgreSQL)

---

#### 3.2.2 ProfileService
**Purpose:** Manages user profiles and skill verification

**Responsibilities:**
- Create user profiles from raw data
- Update verified skills based on assessment results
- Calculate coverage percentages
- Map proficiency levels
- Calculate relevance scores
- Manage user profile lifecycle

**Key Methods:**
- `createUserProfile(userData: UserData): Promise<UserProfile>`
- `updateVerifiedSkills(userId: string, skills: SkillResult[], examType: ExamType): Promise<void>`
- `calculateCoveragePercentage(userId: string, competencyId: string): Promise<number>`
- `mapProficiencyLevel(coveragePercentage: number): ProficiencyLevel`
- `calculateRelevanceScore(userId: string): Promise<number>`
- `getUserProfile(userId: string): Promise<UserProfile>`
- `updateUserProfile(userId: string, updates: Partial<UserData>): Promise<void>`

**Dependencies:**
- ProfileRepository
- TaxonomyService
- AIService (for skill extraction and normalization)
- Database (PostgreSQL)

---

#### 3.2.3 GapAnalysisService
**Purpose:** Performs gap analysis to identify missing skills

**Responsibilities:**
- Perform narrow gap analysis (course-specific)
- Perform broad gap analysis (career path)
- Compare user profile against required skills
- Generate structured gap maps
- Identify missing MGS per competency

**Key Methods:**
- `performNarrowGapAnalysis(userId: string, courseName: string, examStatus: ExamStatus): Promise<GapAnalysisResult>`
- `performBroadGapAnalysis(userId: string, examStatus: ExamStatus): Promise<GapAnalysisResult>`
- `compareAgainstProfile(requiredMGS: Skill[], userId: string): Promise<MissingSkill[]>`
- `generateGapMap(missingMGS: MissingSkill[]): Promise<StructuredGapMap>`
- `getCourseCoverageMap(courseName: string): Promise<Skill[]>`

**Dependencies:**
- ProfileRepository
- TaxonomyService
- Database (PostgreSQL)

---

#### 3.2.4 AIService
**Purpose:** Handles all AI operations using Google Gemini API

**Responsibilities:**
- Discover official sources for taxonomy
- Extract skills from unstructured data
- Normalize skill and competency names
- Map skills to competencies
- Validate extracted data
- Distinguish explanations from skills
- External knowledge discovery
- Web scraping coordination (for official sources)

**Key Methods:**
- `discoverSources(domain: string): Promise<Source[]>` (Gemini Deep-Search)
- `extractSkillsFromData(rawData: string): Promise<ExtractedSkills>` (Gemini Deep-Search)
- `normalizeSkills(skills: string[]): Promise<NormalizedSkill[]>` (Gemini Flash)
- `normalizeCompetencyName(name: string): Promise<string>` (Gemini Flash - fuzzy matching)
- `mapSkillsToCompetencies(skills: Skill[], competencies: Competency[]): Promise<SkillCompetencyMap>` (Gemini Deep-Search)
- `discoverExternalCompetency(name: string): Promise<Competency>` (Gemini Deep-Search)
- `validateSkillExtraction(jsonOutput: string): Promise<ValidationResult>` (Gemini Deep-Search)
- `distinguishExplanationFromSkill(items: string[]): Promise<Skill[]>` (Gemini Deep-Search)
- `persistOfficialSource(source: OfficialSource): Promise<void>` (after AI discovery)

**Dependencies:**
- Google Gemini API (Flash & Deep-Search)
- Prompt templates (from `/docs/prompts/`)
- External APIs (for source discovery)
- Web scraping service (for data extraction from official sources)

**AI Model Selection Strategy:**
- **Gemini Flash:** 
  - Fast operations (< 2 seconds expected)
  - Normalization (skill/competency name normalization)
  - Simple extraction tasks
  - High-volume, low-complexity operations
  
- **Gemini Deep-Search:**
  - Complex operations (> 2 seconds acceptable)
  - External knowledge discovery
  - Semantic mapping (skills to competencies)
  - Validation and quality checks
  - Distinguishing explanations from skills
  - Source discovery
  - Initial skill extraction from raw data

**Prompt Management:**
- Prompts stored in `/docs/prompts/` directory
- Loaded at service initialization
- Versioned and tracked
- Includes: source_discovery_prompt.txt, semantic_extraction_prompt.txt, skill_validation_prompt.txt, etc.

---

#### 3.2.5 UnifiedDataExchangeIntegration
**Purpose:** Handles communication through Unified Data Exchange Endpoint

**Responsibilities:**
- Receive requests from Unified Data Exchange Endpoint
- Identify calling microservice from request context
- Validate request format and permissions
- Route requests to appropriate services
- Format responses for Unified Data Exchange
- Handle authentication (no separate tokens needed)

**Key Methods:**
- `receiveRequest(request: UnifiedRequest): Promise<UnifiedResponse>`
- `identifyCallingService(request: UnifiedRequest): Microservice`
- `validateRequest(request: UnifiedRequest): Promise<boolean>`
- `routeRequest(request: UnifiedRequest): Promise<Response>`
- `formatResponse(data: any, service: Microservice): UnifiedResponse`

**Request Context:**
- Service identification via `X-Service-Id` header or request metadata
- Supported services: Directory, Assessment, Course Builder, Content Studio, Learner AI, Learning Analytics, RAG/Chatbot
- Authentication handled by Unified Data Exchange Endpoint (no microservice tokens)

**Dependencies:**
- Unified Data Exchange Endpoint
- Service routing logic
- Request/response transformation layer

---

### 3.3 Data Access Layer

#### 3.3.1 Repository Pattern

**TaxonomyRepository:**
- `getCompetencyById(competencyId: string): Promise<Competency>`
- `getSkillById(skillId: string): Promise<Skill>`
- `getL1SkillsForCompetency(competencyId: string): Promise<Skill[]>` (identifies L1 by checking NOT EXISTS child)
- `getChildSkills(parentSkillId: string): Promise<Skill[]>`
- `getMGSForCompetency(competencyId: string): Promise<Skill[]>` (uses VIEW: competency_leaf_skills)
- `getAllMGSForCompetency(competencyId: string): Promise<Skill[]>` (recursive traversal)
- `addCompetency(competency: Competency): Promise<void>`
- `addSkill(skill: Skill): Promise<void>`
- `linkSkillToCompetency(competencyId: string, skillId: string): Promise<void>`
- `getCompetencyByName(competencyName: string): Promise<Competency | null>` (for fuzzy matching)

**ProfileRepository:**
- `getUserById(userId: string): Promise<User>` (uses hash index on user_id)
- `createUser(user: User): Promise<void>`
- `updateUser(userId: string, updates: Partial<User>): Promise<void>`
- `updateRelevanceScore(userId: string, score: number): Promise<void>`
- `getUserCompetencies(userId: string): Promise<UserCompetency[]>` (uses hash index on user_id)
- `getUserCompetency(userId: string, competencyId: string): Promise<UserCompetency>` (uses hash indexes)
- `updateUserCompetency(userId: string, competencyId: string, updates: Partial<UserCompetency>): Promise<void>`
- `getUserSkills(userId: string): Promise<UserSkill[]>` (uses hash index on user_id)
- `updateVerifiedSkills(userId: string, competencyId: string, verifiedSkills: VerifiedSkill[]): Promise<void>`

**SourceRepository:**
- `getOfficialSources(): Promise<OfficialSource[]>`
- `getOfficialSourceById(sourceId: string): Promise<OfficialSource | null>`
- `addOfficialSource(source: OfficialSource): Promise<void>`
- `updateSourceLastChecked(sourceId: string): Promise<void>`
- `getSourcesByType(referenceType: string): Promise<OfficialSource[]>`

#### 3.3.2 Database Optimization Strategy

**Hash Indexes:**
- **Purpose:** O(1) exact lookups for primary keys and frequently queried fields
- **Implementation:** Polynomial Rolling Hash for string keys
  - Formula: `h(s) = (s[0]*p^0 + s[1]*p^1 + ... + s[n-1]*p^(n-1)) mod M`
  - Parameters: `p = 31`, `M = 1,000,000,009`
  - Normalization: `LOWER(TRIM(key))` before hashing
- **Indexed Fields:**
  - `skills.skill_id`, `skills.skill_name`
  - `competencies.competency_id` (via B-TREE, not hash - for LIKE queries)
  - `competency_skill.competency_id`
  - `skill_subSkill.parent_skill_id`, `skill_subSkill.child_skill_id`
  - `users.user_id`
  - `userCompetency.user_id`, `userCompetency.competency_id`
  - `userSkill.user_id`, `userSkill.skill_id`

**B-TREE Indexes:**
- **Purpose:** Range queries, sorting, LIKE operations
- **Indexed Fields:**
  - `competencies.competency_id` (for ordered queries)
  - `competencies.competency_name` (for LIKE searches and fuzzy matching)

**Database VIEW:**
- **competency_leaf_skills:** Pre-computed view for efficient MGS retrieval
  - Returns only leaf skills (MGS) for each competency
  - Includes: `competency_id`, `competency_name`, `skill_id`, `skill_name`
  - Optimized for queries: `WHERE competency_id = ?` and `WHERE competency_name LIKE ?`

---

## 4. Data Flow Architecture (Reference)

### 4.1 User Profile Creation Flow

```
Directory (MS #1)
    │
    │ POST /api/webhooks/user-creation
    ▼
Unified Data Exchange Endpoint
    │
    │ (validates & routes)
    ▼
Skills Engine
    │
    ├─► ProfileService.createUserProfile()
    │   │
    │   ├─► Create user record in `users` table
    │   │
    │   ├─► AIService.extractSkillsFromData()
    │   │   └─► Google Gemini API (Deep-Search)
    │   │
    │   ├─► AIService.normalizeSkills()
    │   │   └─► Google Gemini API (Flash)
    │   │
    │   ├─► AIService.mapSkillsToCompetencies()
    │   │   └─► Google Gemini API (Deep-Search)
    │   │
    │   └─► Build profile structure
    │       └─► Store in `userCompetency` & `userSkill` tables
    │
    └─► Return initial profile to Directory
```

### 4.2 Assessment Results Processing Flow

```
Assessment (MS #5)
    │
    │ POST /api/webhooks/assessment-results
    ▼
Unified Data Exchange Endpoint
    │
    │ (validates & routes)
    ▼
Skills Engine
    │
    ├─► ProfileService.updateVerifiedSkills()
    │   │
    │   ├─► Update `verifiedSkills` JSON in `userCompetency`
    │   │
    │   ├─► ProfileService.calculateCoveragePercentage()
    │   │   └─► Update `coverage_percentage` field
    │   │
    │   ├─► ProfileService.mapProficiencyLevel()
    │   │   └─► Update `proficiency_level` field
    │   │
    │   └─► ProfileService.calculateRelevanceScore()
    │       └─► Update `relevance_score` in `users` table
    │
    ├─► GapAnalysisService.performGapAnalysis()
    │   └─► Generate gap map
    │
    ├─► Send gap analysis to Learner AI (async)
    │
    └─► Return updated profile to Directory
```

### 4.3 Competency Retrieval Flow (Conditional Logic)

```
Course Builder / Content Studio / Learner AI
    │
    │ GET /api/competency/:competencyName/skills?service=...
    ▼
Unified Data Exchange Endpoint
    │
    │ (validates & routes)
    ▼
Skills Engine
    │
    ├─► Identify calling service
    │
    ├─► IF Course Builder (MS #3):
    │   │
    │   ├─► TaxonomyService.normalizeCompetencyName()
    │   │   └─► AI fuzzy matching (Gemini Flash)
    │   │
    │   ├─► IF competency not found:
    │   │   └─► AIService.discoverExternalCompetency()
    │   │       └─► Google Gemini Deep-Search
    │   │
    │   └─► TaxonomyService.getMGSForCompetency()
    │       └─► Use VIEW: competency_leaf_skills
    │
    └─► IF Content Studio / Learner AI:
        │
        └─► TaxonomyService.getMGSForCompetency()
            └─► Use VIEW: competency_leaf_skills
            └─► Return 404 if not found (no discovery)
```

---

## 3. API Patterns

### 3.1 REST API Design Pattern

**Endpoint Structure:**
- `/api/webhooks/*` - Incoming webhooks (async)
- `/api/frontend/*` - Frontend endpoints (sync)
- `/api/trainer/*` - Trainer-specific endpoints (sync)
- `/api/competency/*` - Competency retrieval (sync)
- `/api/skill/*` - Skill retrieval (sync)

**HTTP Methods:**
- `GET` - Retrieve resources
- `POST` - Create resources or trigger actions
- `PUT` - Full update
- `PATCH` - Partial update
- `DELETE` - Remove resources

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  },
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### 3.2 Unified Data Exchange Pattern

**Architecture:**
```
External Microservice
    │
    │ HTTP Request
    ▼
Unified Data Exchange Endpoint
    │
    ├─► Authentication
    ├─► Request Validation
    ├─► Service Identification
    ├─► Rate Limiting
    └─► Routing
    │
    │ (validated request)
    ▼
Skills Engine API
    │
    │ (response)
    ▼
Unified Data Exchange Endpoint
    │
    │ (formatted response)
    ▼
External Microservice
```

**Benefits:**
- Centralized authentication (no separate tokens)
- Consistent request/response format
- Service discovery
- Rate limiting and throttling
- Request logging and monitoring

**Service Identification:**
- Via `X-Service-Id` header or request metadata
- Supported services: Directory, Assessment, Course Builder, Content Studio, Learner AI, Learning Analytics, RAG/Chatbot

### 3.3 Synchronous API Pattern

**Use Cases:**
- Competency retrieval (Course Builder, Content Studio, Learner AI)
- Profile retrieval (Learning Analytics, RAG)
- User profile updates
- Skill/competency lookup

**Characteristics:**
- Immediate response required
- Request-response pattern
- Timeout: 5 seconds
- Retry: Not applicable (synchronous)

**Implementation:**
- REST API endpoints
- JSON request/response
- HTTP status codes for errors
- Conditional logic based on calling service (Course Builder vs. Content Studio/Learner AI)

**Example Endpoints:**
- `GET /api/competency/:competencyName/skills?service=course-builder`
- `GET /api/frontend/profile/:user_id`
- `GET /api/frontend/gap-analysis/:user_id`

### 3.4 Asynchronous API Pattern (Webhooks)

**Use Cases:**
- User creation events (from Directory)
- Assessment results (from Assessment)
- Gap analysis delivery (to Learner AI)

**Characteristics:**
- Non-blocking operations
- Event-driven
- Retry mechanism: 3 attempts with exponential backoff
- Dead letter queue for failed messages

**Implementation:**
- Webhook endpoints (incoming)
- HTTP POST to external services (outgoing)
- Event payload: JSON format

**Example Webhooks:**
- `POST /api/webhooks/user-creation` (incoming from Directory)
- `POST /api/webhooks/assessment-results` (incoming from Assessment)
- Outgoing: `POST {learner-ai-url}/api/webhooks/gap-analysis` (to Learner AI)

### 3.5 API Versioning Strategy

**Decision:** URL-based versioning
- Format: `/api/v1/*`
- Rationale: Clear versioning, easy to deprecate

**Version Management:**
- Current version: v1
- Deprecation: 6 months notice
- Breaking changes: New version required

---

## 5. Scalability & Fault Tolerance

### 5.1 Horizontal Scaling Strategy

**Service Scaling:**
- **Skills Engine:** Stateless, can scale horizontally
- **Scaling Method:** Kubernetes HPA (Horizontal Pod Autoscaler) OR Docker Swarm scaling
- **Load Balancer:** Routes requests to multiple instances
- **Min Instances:** 2 (for high availability)
- **Max Instances:** 10 (based on load)

**Database Scaling:**
- **Primary Database:** Single primary instance
- **Read Replicas:** 2 read replicas for read-heavy operations
- **Connection Distribution:** Read queries to replicas, writes to primary

**Auto-scaling Triggers:**
- CPU usage > 70% (average over 5 minutes)
- Memory usage > 80% (average over 5 minutes)
- Request queue depth > 100
- Response time > 2 seconds (p95)
- **Scale Down:** When metrics drop below thresholds for 10 minutes

### 5.2 Vertical Scaling Strategy

**Database Scaling:**
- Can scale vertically for complex queries
- Recommended: Start with 4 CPU, 16GB RAM
- Scale up based on query performance metrics

**AI Processing Scaling:**
- May need more resources for heavy AI operations
- Consider dedicated instances for AI processing (future)
- Batch processing to optimize AI API usage

### 5.3 Fault Tolerance Patterns

**Circuit Breaker Pattern:**
- **Purpose:** Prevent cascading failures
- **Implementation:** For external API calls (Gemini API, Unified Data Exchange)
- **Thresholds:**
  - Open circuit: 5 failures in 60 seconds
  - Half-open: After 30 seconds
  - Close circuit: 2 successful requests

**Retry Strategy:**
- **Transient Errors:** Automatic retry with exponential backoff
- **Max Retries:** 3 attempts
- **Backoff:** 1s, 2s, 4s
- **Non-retryable:** 4xx errors (except 429)

**Health Checks:**
- **Endpoint:** `/health`
- **Checks:**
  - Database connectivity
  - External API availability (Gemini, Unified Data Exchange)
  - Service readiness
- **Interval:** 30 seconds
- **Timeout:** 5 seconds

**Graceful Degradation:**
- **Database Unavailable:** Return cached data (if available)
- **AI API Unavailable:** Return error with fallback message
- **Unified Data Exchange Unavailable:** Queue requests for later processing

### 5.4 High Availability

**Redundancy:**
- Multiple Skills Engine instances (min 2)
- Database primary + 2 read replicas
- Load balancer with health checks
- Multi-AZ deployment (if using cloud)

**Failover:**
- Automatic failover to healthy instances
- Database failover to replica (automatic or manual)
- Load balancer health checks remove unhealthy instances
- Service discovery updates automatically

**Disaster Recovery:**
- Database backups: Daily automated backups
- Point-in-time recovery: Supported
- Backup retention: 30 days
- Multi-region deployment: Future consideration
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 24 hours

### 5.5 Performance Optimization

**Database Optimization:**
- Hash indexes for exact lookups (O(1))
- B-TREE indexes for range queries
- VIEW for pre-computed MGS lists
- Connection pooling (10-20 connections)
- Query optimization and analysis

**Caching Optimization:**
- In-memory cache for frequently accessed data
- Cache competency MGS lists (TTL: 1 hour)
- Cache user profiles (TTL: 5 minutes)
- Cache invalidation on updates

**AI Processing Optimization:**
- Batch processing for multiple operations
- Async processing for non-critical AI operations
- Model selection (Flash vs Deep-Search) based on complexity
- Request queuing for AI operations

### 5.6 Load Handling

**Expected Load:**
- API requests: 1000 requests/minute (peak)
- Concurrent users: 500
- Database queries: 5000 queries/minute
- AI API calls: 200 calls/minute (peak)

**Capacity Planning:**
- Skills Engine instances: 2-5 (auto-scaling)
- Database: Primary + 2 read replicas
- Connection pool: 20 connections per instance
- Cache: Redis cluster (if using Redis) OR in-memory per instance

**Monitoring & Alerting:**
- **Metrics:**
  - API response times (p50, p95, p99)
  - Database query performance
  - AI API usage and costs
  - Error rates
  - Request throughput
  - Cache hit rates
- **Alerting:**
  - Error rate > 1%
  - Response time > 2 seconds (p95)
  - Database connection pool exhaustion
  - AI API quota exceeded
  - Cache miss rate > 50%

---

## 6. Security Layers

### 6.1 Authentication & Authorization Layer

**Unified Data Exchange Authentication:**
- All requests authenticated by Unified Data Exchange Endpoint
- No separate token management in Skills Engine
- Service identification from request context (`X-Service-Id` header)
- **Benefit:** Centralized authentication, no token management overhead

**Access Control:**
- **Role-based access:** Trainer vs Employee
- **Frontend:** Hide features based on role (CSV upload for Trainers only)
- **Backend:** Validate role on all protected endpoints
- **Implementation:** Role checked via Unified Data Exchange context

**Frontend Authentication:**
- Token-based authentication (handled by Unified Data Exchange)
- Secure token storage (httpOnly cookies preferred)
- Automatic token refresh
- Logout on token expiration

### 6.2 Data Security Layer

**Data Encryption:**
- **In-transit:** TLS 1.3 for all API communication
- **At-rest:** Database encryption (PostgreSQL encryption at rest)
- **Sensitive fields:** Encrypted in database (e.g., `raw_data` field)
- **Key Management:** Use cloud provider key management (AWS KMS, Azure Key Vault, etc.)

**Input Validation:**
- **All input validated and sanitized:**
  - Schema validation (JSON schema, Zod, etc.)
  - Type validation
  - Length validation
  - Format validation
- **SQL injection prevention:**
  - Parameterized queries only
  - No string concatenation in SQL
  - ORM/query builder usage
- **Prompt injection prevention:**
  - CSV upload validation
  - Sanitize user input before sending to AI
  - Input length limits
- **XSS prevention:**
  - Output encoding (React auto-escapes)
  - Content Security Policy (CSP) headers
  - No `dangerouslySetInnerHTML` usage

**Data Privacy:**
- **PII Handling:** Minimal PII storage (user_id, user_name only)
- **GDPR Compliance:** User data deletion support
- **Data Retention:** Configurable retention policies
- **Audit Logging:** Track data access and modifications (future)

### 6.3 API Security Layer

**Rate Limiting:**
- **Per-service rate limits:** Handled by Unified Data Exchange Endpoint
- **Per-user rate limits:** For frontend endpoints
- **Limits:**
  - Frontend: 100 requests/minute per user
  - Microservices: 1000 requests/minute per service
  - AI operations: 50 requests/minute per user
- **Response:** 429 Too Many Requests with retry-after header

**Request Validation:**
- **Schema validation:** All requests validated against schemas
- **Size limits:**
  - Request body: 10MB max
  - CSV upload: 10MB max
  - Query parameters: 2048 characters max
- **Timeout limits:**
  - API requests: 30 seconds
  - AI operations: 60 seconds
  - Database queries: 10 seconds

**CORS Configuration:**
- **Allowed origins:** Configured per environment
- **Methods:** GET, POST, PUT, PATCH, DELETE
- **Headers:** Content-Type, Authorization, X-Service-Id
- **Credentials:** Supported for authenticated requests

### 6.4 Infrastructure Security Layer

**Network Security:**
- **VPC/Private Network:** Services in private network
- **Firewall Rules:** Restrict access to necessary ports only
- **DDoS Protection:** Cloud provider DDoS protection enabled
- **WAF (Web Application Firewall):** Optional, for additional protection

**Container Security:**
- **Image Scanning:** Scan Docker images for vulnerabilities
- **Non-root User:** Containers run as non-root user
- **Secrets Management:** Environment variables for secrets (not in code)
- **Resource Limits:** CPU and memory limits per container

**Database Security:**
- **Network Isolation:** Database in private network
- **Access Control:** IP whitelist for database access
- **Encryption:** TLS for database connections
- **Backup Encryption:** Encrypted backups
- **Audit Logging:** Database access logging (future)

### 6.5 Security Monitoring

**Security Logging:**
- **Authentication failures:** Log all failed authentication attempts
- **Authorization failures:** Log all access denied events
- **Suspicious activity:** Log unusual patterns (multiple failures, etc.)
- **Data access:** Log sensitive data access (future)

**Security Alerts:**
- **Multiple failed logins:** Alert after 5 failures in 5 minutes
- **Unusual API usage:** Alert on spike in requests
- **Database anomalies:** Alert on unusual query patterns
- **Security vulnerabilities:** Alert on detected vulnerabilities

---

## 4. Storage & Caching

### 4.1 Database Storage Strategy

**Primary Database:**
- **Technology:** PostgreSQL 15+
- **Purpose:** Persistent storage for all Skills Engine data
- **Tables:** 9 core tables (skills, competencies, users, userCompetency, userSkill, competency_skill, skill_subSkill, official_sources, competency_subCompetency)
- **VIEW:** competency_leaf_skills (pre-computed MGS list)

**Indexing Strategy:**
- **Hash Indexes:** O(1) exact lookups
  - Polynomial Rolling Hash for string keys
  - Normalization: `LOWER(TRIM(key))` before hashing
  - Used for: skill_id, user_id, competency_id (exact matches)
- **B-TREE Indexes:** Range queries, sorting, LIKE operations
  - Used for: competency_name (fuzzy matching, LIKE searches)

**Connection Pooling:**
- **Size:** 10-20 connections per instance
- **Strategy:** Connection pool per service instance
- **Timeout:** 30 seconds idle timeout

### 4.2 Caching Strategy

**In-Memory Cache:**
- **Technology:** Redis (optional) OR in-memory cache (Node.js/Python)
- **Purpose:** Reduce database load and improve response times

**Cache Layers:**
1. **Competency MGS Lists:**
   - Key: `competency:{competency_id}:mgs`
   - TTL: 1 hour
   - Invalidation: On competency or skill updates

2. **User Profiles:**
   - Key: `user:{user_id}:profile`
   - TTL: 5 minutes
   - Invalidation: On profile updates, assessment results

3. **Competency Lookup:**
   - Key: `competency:{competency_name}:id`
   - TTL: 30 minutes
   - Invalidation: On competency name changes

**Cache Invalidation:**
- Event-driven invalidation on data updates
- Manual invalidation via admin API (if needed)
- TTL-based expiration as fallback

### 4.3 Data Persistence Patterns

**Write Pattern:**
- Transaction-based for multi-step operations
- Optimistic locking for concurrent updates
- Batch operations for bulk inserts (CSV upload)
- JSON field updates for `verifiedSkills` array

**Read Pattern:**
- Direct database queries with indexes
- VIEW for optimized MGS retrieval
- Caching for frequently accessed data
- Read replicas for read-heavy operations (future)

**Backup Strategy:**
- Daily automated backups
- Point-in-time recovery support
- Backup retention: 30 days
- Backup location: Separate storage (S3, etc.)

### 4.4 File Storage (CSV Uploads)

**Storage Decision:**
- **Temporary:** In-memory processing (small files)
- **Large Files:** Temporary file storage (cleaned after processing)
- **No persistent storage:** Files processed and discarded

**File Size Limits:**
- Maximum: 10MB per CSV file
- Validation: Client and server-side

---

## 7. Integration Points

### 7.1 Incoming Integration Points (Webhooks)

**Directory Microservice (MS #1):**
- **Endpoint:** `POST /api/webhooks/user-creation`
- **Purpose:** Receive user creation events
- **Payload:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "company_id": "company_456",
    "employee_type": "employee",
    "path_career": "Full Stack Developer",
    "raw_data": "..."
  }
  ```
- **Processing:** Create user profile, extract skills, normalize, map to competencies
- **Response:** Initial user profile with secure URL

**Assessment Microservice (MS #5):**
- **Endpoint:** `POST /api/webhooks/assessment-results`
- **Purpose:** Receive assessment results (Baseline/Post-Course exams)
- **Payload:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "exam_type": "baseline" | "postCourse",
    "exam_status": "completed",
    "skills": [
      {
        "skill_id": "skill_123",
        "skill_name": "React Hooks",
        "status": "PASS" | "FAIL"
      }
    ],
    "course_name": "..." // only for postCourse
  }
  ```
- **Processing:** Update verified skills, calculate coverage, proficiency, relevance score
- **Response:** Updated profile with gap analysis

### 7.2 Outgoing Integration Points

**Learner AI Microservice (MS #7):**
- **Endpoint:** `POST {learner-ai-url}/api/webhooks/gap-analysis`
- **Purpose:** Send gap analysis results
- **Trigger:** After assessment results processing
- **Payload:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "company": "company_name",
    "exam_status": "completed",
    "exam_type": "baseline" | "postCourse",
    "course_name": "...", // only for narrow gap
    "missing_skills_map": { ... },
    "career_path_goal": "Full Stack Developer",
    "timestamp": "2025-01-27T10:00:00Z"
  }
  ```
- **Retry:** 3 attempts with exponential backoff
- **Async:** Non-blocking, queued for processing

**Directory Microservice (MS #1):**
- **Endpoint:** `PUT {directory-url}/api/users/:user_id/profile`
- **Purpose:** Return updated profile after exam
- **Trigger:** After assessment results processing
- **Payload:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "competencies": [ ... ],
    "relevance_score": 85.25,
    "secure_profile_url": "https://skills-engine.../profile/user_123",
    "timestamp": "2025-01-27T10:00:00Z"
  }
  ```

### 7.3 Synchronous Integration Points

**Course Builder Microservice (MS #3):**
- **Endpoint:** `GET /api/competency/:competencyName/skills?service=course-builder`
- **Purpose:** Retrieve MGS list for competency
- **Logic:** AI normalization + external discovery if missing
- **Response:** Full MGS list with hierarchy

**Content Studio Microservice (MS #4):**
- **Endpoint:** `GET /api/competency/:competencyName/skills?service=content-studio`
- **Purpose:** Retrieve MGS list for competency
- **Logic:** Internal database lookup only (no discovery)
- **Response:** MGS list or 404 if not found

**Learner AI Microservice (MS #7):**
- **Endpoint:** `GET /api/competency/:competencyName/skills?service=learner-ai`
- **Purpose:** Retrieve MGS list for competency
- **Logic:** Internal database lookup only (no discovery)
- **Response:** MGS list or 404 if not found

**Learning Analytics Microservice (MS #8):**
- **Endpoint:** `GET /api/frontend/profile/:user_id`
- **Purpose:** Retrieve user profile for analytics
- **Response:** User profile with competencies and skills

**RAG/Chatbot Microservice (MS #9):**
- **Endpoint:** `GET /api/frontend/profile/:user_id`
- **Purpose:** Retrieve user profile for chatbot context
- **Response:** User profile with competencies and skills

### 7.4 Integration Patterns Summary

**Synchronous (Request-Response):**
- Competency retrieval (Course Builder, Content Studio, Learner AI)
- Profile retrieval (Learning Analytics, RAG)
- Timeout: 5 seconds
- No retry (synchronous)

**Asynchronous (Event-Driven):**
- User creation (from Directory)
- Assessment results (from Assessment)
- Gap analysis delivery (to Learner AI)
- Profile updates (to Directory)
- Retry: 3 attempts with exponential backoff
- Dead letter queue for failures

**Unified Data Exchange:**
- All inter-microservice communication routed through Unified Data Exchange Endpoint
- Centralized authentication
- Service identification via `X-Service-Id` header
- Rate limiting and monitoring

---

## 8. IaC Setup

### 8.1 Infrastructure as Code Strategy

**Deployment Platform Decision:**
- **Backend:** Railway (Managed Container Platform)
- **Frontend:** Vercel (Managed Frontend Platform)
- **Database:** Supabase (Managed PostgreSQL)
- **CI/CD:** GitHub Actions
- **Rationale:** 
  - Railway: Simplified container deployment, automatic scaling, built-in health checks
  - Vercel: Optimized for React/Next.js, edge network, automatic deployments
  - Supabase: Managed PostgreSQL with built-in features, automatic backups
  - GitHub Actions: Integrated with code repository, automated testing and deployment

### 8.2 Infrastructure Components

**Backend Compute Resources (Railway):**
- **Skills Engine Service:**
  - Platform: Railway (managed containers)
  - Build: Docker image via NIXPACKS builder
  - Auto-scaling: Railway handles scaling based on traffic
  - Health Checks: `/health` endpoint (100s timeout)
  - Restart Policy: ON_FAILURE (max 10 retries)
  - Environment: Production and Staging environments

**Frontend Resources (Vercel):**
- **Skills Engine Frontend:**
  - Platform: Vercel (edge network)
  - Framework: React + Vite
  - Build: Automated on git push
  - Edge Functions: Available for API routes if needed
  - CDN: Global edge network for fast delivery

**Database Resources (Supabase):**
- **PostgreSQL Database:**
  - Platform: Supabase (managed PostgreSQL)
  - Version: PostgreSQL 15+
  - Features: 
    - Automatic backups (daily)
    - Point-in-time recovery
    - Connection pooling
    - Row-level security (optional)
  - Scaling: Managed by Supabase (auto-scaling storage)

**Caching Resources (Optional):**
- **In-Memory Cache:**
  - Option 1: Node.js in-memory cache (per instance)
  - Option 2: Supabase connection pooling for query optimization
  - Option 3: Vercel Edge Cache for frontend assets
  - Future: Redis addon on Railway (if needed)

**Load Balancing & Networking:**
- **Railway:** Built-in load balancing and SSL/TLS termination
- **Vercel:** Global edge network with automatic load balancing
- **SSL/TLS:** Managed certificates (automatic renewal)
- **Health Checks:** Railway monitors `/health` endpoint

### 8.3 Container Configuration

**Dockerfile Structure:**
```dockerfile
FROM node:18-alpine OR python:3.11-slim
WORKDIR /app
COPY package*.json ./
RUN npm install OR pip install -r requirements.txt
COPY . .
RUN npm run build OR python -m compileall
EXPOSE 3000
CMD ["npm", "start"] OR ["python", "app.py"]
```

**Docker Compose (Development):**
```yaml
services:
  skills-engine:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - GEMINI_API_KEY=...
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=skills_engine
      - POSTGRES_USER=...
      - POSTGRES_PASSWORD=...
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### 8.4 Railway Configuration

**Backend Configuration (`railway.json`):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "environments": {
    "production": {
      "variables": {
        "NODE_ENV": "production",
        "PORT": "3000"
      }
    },
    "staging": {
      "variables": {
        "NODE_ENV": "staging",
        "PORT": "3000"
      }
    }
  }
}
```

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 8.5 Vercel Configuration

**Frontend Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci --prefer-offline --no-audit",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### 8.6 Environment Configuration

**Backend Environment Variables (Railway):**
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `UNIFIED_DATA_EXCHANGE_URL` - Unified Data Exchange endpoint
- `LOG_LEVEL` - Logging level (ERROR, WARN, INFO, DEBUG)
- `NODE_ENV` - Environment (development, staging, production)
- `PORT` - Service port (default: 3000)
- Microservice tokens (DIRECTORY_SERVICE_TOKEN, ASSESSMENT_SERVICE_TOKEN, etc.)
- Microservice URLs (DIRECTORY_SERVICE_URL, ASSESSMENT_SERVICE_URL, etc.)

**Frontend Environment Variables (Vercel):**
- `NEXT_PUBLIC_API_URL` - Backend API URL (Railway)
- `NEXT_PUBLIC_API_VERSION` - API version (v1)
- `NODE_ENV` - Environment (production)

**Secrets Management:**
- **Railway:** Environment variables in Railway dashboard (encrypted)
- **Vercel:** Environment variables in Vercel dashboard (encrypted)
- **GitHub Actions:** Repository secrets for CI/CD
- **Best Practice:** Never commit secrets to code
- **Rotation:** Manual rotation via platform dashboards

### 8.7 CI/CD Pipeline

**GitHub Actions Workflows:**

1. **CI Workflow** (`.github/workflows/ci.yml`):
   - Runs on push to `main` or `develop` branches
   - Runs on pull requests
   - Tests backend and frontend
   - Runs linters and type checks
   - Security scans

2. **Backend Deployment** (`.github/workflows/deploy-backend.yml`):
   - Deploys backend to Railway
   - Runs on push to `main` branch (backend changes only)
   - Runs database migrations
   - Performs health checks

3. **Frontend Deployment** (`.github/workflows/deploy-frontend.yml`):
   - Deploys frontend to Vercel
   - Runs on push to `main` branch (frontend changes only)

**Deployment Strategy:**
- **Development:** Direct deployment to Railway/Vercel preview environments
- **Staging:** Automatic deployment to staging environment
- **Production:** Automatic deployment to production (with health checks)
- **Rollback:** Manual rollback via Railway/Vercel dashboards

### 8.8 Monitoring & Logging Infrastructure

**Metrics Collection:**
- **Railway:** Built-in metrics dashboard (CPU, memory, request rate, error rate)
- **Vercel:** Built-in analytics (page views, API calls, performance)
- **Custom:** Application-level metrics via logging
- **Alerting:** Railway and Vercel built-in alerting

**Logging:**
- **Railway:** Built-in log streaming and retention
- **Vercel:** Built-in log aggregation
- **Format:** Structured JSON logs
- **Retention:** Platform-dependent (Railway: 7 days, Vercel: varies)

**Tracing:**
- **Application-level:** Request ID tracking in logs
- **Future:** Consider distributed tracing solution if needed

### 8.9 Backup & Disaster Recovery

**Database Backups (Supabase):**
- **Automated:** Daily automated backups
- **Storage:** Managed by Supabase
- **Retention:** 30 days (configurable)
- **Point-in-time Recovery:** Supported
- **Encryption:** Encrypted backups

**Infrastructure Backups:**
- **Configuration:** Version controlled in Git
- **Disaster Recovery:** Infrastructure can be recreated from:
  - Git repository (code and configuration)
  - Railway/Vercel project settings (exportable)
  - Supabase database backups
- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 24 hours

---

## 9. Technology Stack (Reference)

### 9.1 Backend Stack

**Runtime:**
- Node.js 18+ (TypeScript) OR Python 3.11+ (FastAPI)
- Framework: Express.js OR FastAPI

**Database:**
- PostgreSQL 15+
- Connection: pg (Node.js) OR psycopg2 (Python)

**AI Integration:**
- Google Gemini API
- SDK: @google/generative-ai (Node.js) OR google-generativeai (Python)

---

### 9.2 Frontend Stack

**Framework:**
- React 18+ (TypeScript)
- State Management: Redux Toolkit OR Zustand
- UI Library: Tailwind CSS (with custom dark emerald theme)

**Design System:**
- Dark emerald/teal color palette
- Light/dark mode support
- Glassmorphism elements (backdrop blur)
- Neumorphism hints (soft shadows)
- Gradient mastery
- Consistent elevation system

**Key Components:**
- Competency Dashboard (split-screen layout)
- Competency Cards (with hover animations)
- Skills Gap Sidebar (fixed 384px)
- Competency Detail Modal (hierarchical tree)
- CSV Upload Interface (Trainer only)
- Theme Toggle

**Build Tools:**
- Vite OR Next.js
- TypeScript
- ESLint + Prettier
- Tailwind CSS with custom configuration

**Icon Library:**
- Lucide React (or similar modern icon library)

**Animation:**
- CSS transitions and transforms
- Framer Motion (optional, for complex animations)
- Respects `prefers-reduced-motion`

---

### 9.3 Infrastructure

**Containerization:**
- Docker
- Docker Compose (development)

**Orchestration:**
- Kubernetes (production)
- Docker Swarm (alternative)

**CI/CD:**
- GitHub Actions OR GitLab CI
- Automated testing
- Automated deployment

---

## 10. Data Architecture (Reference)

### 10.1 Database Design

**Schema:**
- 9 core tables (see STEP4_TECHNICAL_DESIGN.md Section 1)
- 1 VIEW (competency_leaf_skills)
- Hash indexes for exact lookups
- B-TREE indexes for range queries

**Data Relationships:**
- Hierarchical skills (self-referencing)
- Hierarchical competencies (self-referencing)
- Many-to-many: Competencies ↔ Skills
- One-to-many: Users ↔ User Competencies
- One-to-many: Users ↔ User Skills

---

### 10.2 Data Flow Patterns

**Read Pattern:**
- Direct database queries
- VIEW (`competency_leaf_skills`) for optimized MGS retrieval
- Hash indexes for O(1) exact lookups
- B-TREE indexes for range queries and LIKE operations
- Caching for frequently accessed data (TTL: 1 hour for MGS, 5 minutes for profiles)

**Write Pattern:**
- Transaction-based for multi-step operations
- Optimistic locking for concurrent updates
- Batch operations for bulk inserts (CSV upload)
- JSON field updates for `verifiedSkills` array

**Hierarchical Query Pattern:**
- Recursive CTE for skill hierarchy traversal
- Identifies L1 skills by checking `NOT EXISTS` child relationship
- Identifies MGS by checking `NOT EXISTS` parent relationship
- Uses VIEW for pre-computed leaf skills

**AI Processing Pattern:**
- Async processing for non-critical operations
- Batch processing for multiple skills
- Model selection based on operation complexity
- Retry with exponential backoff for transient failures

---

## 11. Error Handling Architecture (Reference)

### 11.1 Error Classification

**Client Errors (4xx):**
- 400 Bad Request: Invalid input
- 401 Unauthorized: Authentication failed
- 403 Forbidden: Access denied
- 404 Not Found: Resource not found
- 422 Unprocessable Entity: Validation failed

**Server Errors (5xx):**
- 500 Internal Server Error: Unexpected error
- 502 Bad Gateway: External service error
- 503 Service Unavailable: Service overloaded
- 504 Gateway Timeout: Request timeout

---

### 11.2 Error Handling Strategy

**Error Propagation:**
- Errors caught at service layer
- Logged with context
- Formatted for API response
- Never expose internal errors to clients

**Retry Strategy:**
- Automatic retry for transient errors
- Exponential backoff
- Max 3 retries
- Dead letter queue for failed operations

---

## 12. Testing Architecture (Reference)

### 12.1 Testing Layers

**Unit Tests:**
- Service methods
- Repository methods
- Utility functions
- Coverage: > 80%

**Integration Tests:**
- API endpoints
- Database operations
- External API mocks
- End-to-end flows

**Performance Tests:**
- Load testing
- Stress testing
- Database query performance
- AI API response times

---

## 13. Frontend Architecture (Reference)

### 13.1 Component Architecture

**Layout Structure:**
- Split-screen design: Left panel (~70%) + Right panel (384px fixed)
- Fixed header (80px) with backdrop blur
- Responsive grid: 2 columns desktop, 1 column mobile

**Key Components:**
1. **Dashboard Container:**
   - Manages layout and theme state
   - Handles routing (if SPA)
   - Theme provider (light/dark mode)

2. **Competency Card:**
   - Displays competency summary
   - Hover animations (lift + shimmer)
   - Click opens detail modal
   - Props: competency data, proficiency level, coverage percentage

3. **Skills Gap Sidebar:**
   - Sticky header with gradient
   - Scrollable gap cards list
   - Empty state (celebration message)
   - Props: missing skills array

4. **Competency Detail Modal:**
   - Hierarchical tree structure
   - Expandable/collapsible nodes
   - Color-coded levels (Amber, Green, Blue)
   - Legend panel
   - Props: competency ID, full hierarchy data

5. **CSV Upload Component:**
   - Drag-and-drop interface
   - Progress indicator
   - Validation feedback
   - Props: user role, upload handlers

### 13.2 State Management

**Global State:**
- User profile data
- Competencies list
- Skills gap data
- Theme preference (localStorage)
- Loading states
- Error states

**Local State:**
- Expanded/collapsed cards
- Modal open/close
- Upload progress
- Selected file

### 13.3 API Integration

**Endpoints Used:**
- `GET /api/frontend/profile/:user_id` - Dashboard data
- `GET /api/frontend/gap-analysis/:user_id` - Gap analysis
- `POST /api/trainer/csv/upload` - CSV upload
- `GET /api/trainer/csv/status/:upload_id` - Upload status

**Data Fetching:**
- React Query or SWR for data fetching
- Automatic refetch on focus
- Cache invalidation on updates
- Optimistic updates for better UX

### 13.4 Performance Optimization

**Code Splitting:**
- Route-based code splitting
- Lazy load modal component
- Lazy load CSV upload component

**Rendering Optimization:**
- React.memo for expensive components
- useMemo for computed values
- useCallback for event handlers
- Virtual scrolling for long lists (if needed)

**Asset Optimization:**
- Image optimization (WebP format)
- Icon sprites or tree-shaking
- CSS minification
- Bundle size optimization

---

## 14. Security Architecture - Frontend (Reference)

### 14.1 Client-Side Security

**Input Validation:**
- Client-side validation before API calls
- File type validation for CSV upload
- File size limits (enforced client and server)
- XSS prevention (React auto-escapes)

**Authentication:**
- Token-based authentication (handled by Unified Data Exchange)
- Secure token storage (httpOnly cookies preferred)
- Automatic token refresh
- Logout on token expiration

**CSRF Protection:**
- CSRF tokens for state-changing operations
- SameSite cookies
- Origin validation

### 14.2 Data Privacy

**Sensitive Data:**
- No sensitive data in localStorage (except theme preference)
- Clear data on logout
- Secure transmission (HTTPS only)

---

**Last Updated:** 2025-01-27

**Status:** Architecture Design - Complete and ready for implementation

