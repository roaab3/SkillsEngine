# Skills Engine - Feature Architecture with AI, External API & Design Mapping

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27  
**Phase:** Step 3 - Feature Architecture

---

## 📋 Table of Contents

1. [System-Level Features](#1-system-level-features)
2. [Component Mapping](#2-component-mapping)
3. [AI Integration Points](#3-ai-integration-points)
4. [External API Integrations](#4-external-api-integrations)
5. [UI/UX Design Requirements](#5-uiux-design-requirements)
6. [Dependencies & Rollout Strategy](#6-dependencies--rollout-strategy)

---

## 1. System-Level Features

### 1.1 Taxonomy Management Feature
**Purpose:** Build and maintain the hierarchical skill taxonomy database

**Key Capabilities:**
- Official sources discovery and validation
- Maintain persistent list of all official sources discovered by AI
- Store sources in official_sources table with metadata
- Enable querying and retrieval of official sources list
- Support periodic re-checking of sources for validity
- Track which sources have been successfully used for data extraction
- AI-guided data extraction and normalization
- Hierarchical schema construction (Skills, Competencies, relationships)
- Leaf node count calculation for L1 skills
- Dynamic taxonomy enrichment via external discovery

**Business Value:** Single source of truth for all skills and competencies

**Related Requirements:** FR-1, FR-1.1.5, FR-5.2

---

### 1.2 User Profile Management Feature
**Purpose:** Create, update, and maintain user skill profiles

**Key Capabilities:**
- Initial profile creation from unstructured data (resumes, LinkedIn, GitHub)
- Profile updates from assessment results (Baseline and Course exams)
- Skill verification tracking (verified=true/false)
- Coverage Percentage calculation per competency
- Proficiency level mapping (BEGINNER → EXPERT)
- Relevance Score calculation for career path goals

**Business Value:** Accurate tracking of individual skill development

**Related Requirements:** FR-2, FR-3

---

### 1.3 Gap Analysis Feature
**Purpose:** Identify missing skills relative to user goals

**Key Capabilities:**
- Narrow Gap Analysis (per competency)
- Broad Gap Analysis (per career path goal)
- Recursive traversal of skill hierarchy
- Structured map generation (Competency → Missing MGS)
- Performance optimization (<1s requirement)

**Business Value:** Enables targeted learning and development planning

**Related Requirements:** FR-4

---

### 1.4 API Gateway Feature
**Purpose:** Expose controlled endpoints for microservice integrations

**Key Capabilities:**
- Competency retrieval for Course Builder (with dynamic enrichment)
- Competency lookup for Content Studio and Learner AI (read-only)
- User profile retrieval for Learning Analytics
- Team aggregation for Learning Analytics
- RAG data access for chatbot queries
- Token-based authentication per microservice

**Business Value:** Enables seamless integration with EduCora AI ecosystem

**Related Requirements:** FR-5, FR-6, FR-9, FR-10

---

### 1.5 CSV Upload Feature
**Purpose:** Allow trainers to upload custom skills/competencies

**Key Capabilities:**
- CSV file parsing and validation
- Hierarchical structure preservation
- AI normalization and duplicate prevention
- Access control (Trainer role only)
- Integration with existing taxonomy

**Business Value:** Supports company-specific skill customization

**Related Requirements:** FR-7

---

### 1.6 Frontend Display Feature
**Purpose:** Present user skill profiles and gap analysis in intuitive UI

**Key Capabilities:**
- Competency cards with proficiency levels and coverage percentages
- Drill-down to verified MGS
- Missing skills display (categorized by competency)
- Relevance Score visualization
- Access control for Trainer-specific features (CSV upload)

**Business Value:** Empowers users to understand and act on their skill development

**Related Requirements:** FR-8

---

### 1.7 Audit & Security Feature
**Purpose:** Maintain data integrity and compliance

**Key Capabilities:**
- Audit trail for all profile verification updates
- Source tracking (Assessment, Certification, Claims/AI)
- Data trust priority enforcement (Assessment > Certification > Claims/AI)
- Secure token management for microservice integrations
- Access control and role-based permissions

**Business Value:** Ensures data reliability and regulatory compliance

**Related Requirements:** NFR-6.3, NFR-6.4

---

## 2. Component Mapping

### 2.1 Frontend Components

#### 2.1.1 User Profile Dashboard
**Location:** `frontend/src/pages/ProfileDashboard.jsx`  
**Purpose:** Main landing page for user skill profiles  
**Features:**
- Competency cards display
- Relevance Score widget
- Navigation to detailed views

**Dependencies:**
- Backend API: `GET /api/user/profile/:userId`
- State management for user data

---

#### 2.1.2 Competency Card Component
**Location:** `frontend/src/components/CompetencyCard.jsx`  
**Purpose:** Display individual competency with metrics  
**Features:**
- Proficiency level badge (BEGINNER/INTERMEDIATE/ADVANCED/EXPERT)
- Coverage Percentage progress bar
- Expandable MGS list
- Verified skills highlighting

**Props:**
- `competencyId`: string
- `competencyName`: string
- `proficiencyLevel`: string
- `coveragePercentage`: number
- `verifiedSkills`: array

---

#### 2.1.3 Gap Analysis View
**Location:** `frontend/src/pages/GapAnalysis.jsx`  
**Purpose:** Display missing skills organized by competency  
**Features:**
- Structured map visualization
- Competency grouping
- Missing MGS list per competency
- Action buttons (e.g., "Find Courses")

**Dependencies:**
- Backend API: `GET /api/user/gap-analysis/:userId`
- Integration with Learner AI for course recommendations

---

#### 2.1.4 CSV Upload Component
**Location:** `frontend/src/components/CSVUpload.jsx`  
**Purpose:** Allow trainers to upload custom skills  
**Features:**
- File upload interface
- CSV format validation
- Upload progress indicator
- Success/error notifications
- Access control check (Trainer role only)

**Dependencies:**
- Backend API: `POST /api/trainer/upload-csv`
- Role-based access control

---

#### 2.1.5 Skills Profile Detail Page
**Location:** `frontend/src/pages/SkillsProfileDetail.jsx`  
**Purpose:** Dedicated page showing comprehensive skill profile  
**Features:**
- All competencies with full details
- Verified MGS drill-down
- Missing skills from Broad Gap Analysis
- Relevance Score display
- Trainer-specific actions (if applicable)

**Dependencies:**
- Backend API: `GET /api/user/profile/:userId/detailed`
- Secure URL generation for sharing

---

### 2.2 Backend Components

#### 2.2.1 Taxonomy Service
**Location:** `backend/src/services/taxonomyService.js`  
**Purpose:** Manage skill taxonomy operations  
**Responsibilities:**
- Official sources discovery
- Persist official sources after AI extraction (receive JSON Array, validate, clean, store)
- Data extraction and normalization
- Schema construction and updates
- Leaf node count calculation
- External knowledge discovery

**Dependencies:**
- Database: Skills, Competencies, junction tables, official_sources table
- AI Service: Gemini API integration
- External sources: Web scraping from official sources

**Key Methods:**
- `initializeTaxonomy()`
- `persistOfficialSources(aiJsonArray)` - Receive JSON from AI, validate, clean, store
- `validateSourceRecord(record)` - Validate single source record (required fields, null checks, unique source_id, URL validation)
- `cleanSourceData(record)` - Clean and normalize source data (trim whitespace, normalize values, remove duplicates)
- `discoverExternalCompetency(competencyName)`
- `normalizeSkillData(rawData)`
- `calculateLeafNodeCount(skillId)`

---

#### 2.2.2 Profile Service
**Location:** `backend/src/services/profileService.js`  
**Purpose:** Manage user profile operations  
**Responsibilities:**
- Profile creation from unstructured data
- Profile updates from assessment results
- Coverage Percentage calculation
- Proficiency level mapping
- Relevance Score calculation

**Dependencies:**
- Database: userCompetency, userSkill tables
- AI Service: Data extraction from resumes/profiles
- Assessment Service: Exam results

**Key Methods:**
- `createUserProfile(userData, rawData)`
- `updateProfileFromAssessment(userId, assessmentResults)`
- `calculateCoveragePercentage(competencyId, userId)`
- `calculateRelevanceScore(userId, careerPathGoal)`

---

#### 2.2.3 Gap Analysis Service
**Location:** `backend/src/services/gapAnalysisService.js`  
**Purpose:** Perform gap analysis operations  
**Responsibilities:**
- Narrow Gap Analysis (per competency)
- Broad Gap Analysis (per career path)
- Recursive hierarchy traversal
- Structured map generation
- Performance optimization

**Dependencies:**
- Database: Skills taxonomy, user profiles
- Profile Service: User verified skills

**Key Methods:**
- `performNarrowGapAnalysis(userId, competencyId)`
- `performBroadGapAnalysis(userId, careerPathGoal)`
- `traverseSkillHierarchy(rootSkillId)`
- `generateStructuredMap(missingSkills)`

**Performance Target:** <1 second for both narrow and broad analysis

---

#### 2.2.4 API Gateway Service
**Location:** `backend/src/services/apiGatewayService.js`  
**Purpose:** Handle microservice API requests  
**Responsibilities:**
- Route requests to appropriate handlers
- Token validation per microservice
- Request/response transformation
- Rate limiting and throttling

**Dependencies:**
- Authentication Service: Token validation
- All other services: Route to appropriate handlers

**Key Methods:**
- `validateMicroserviceToken(token, microserviceId)`
- `routeRequest(endpoint, payload, microserviceId)`

---

#### 2.2.5 AI Service
**Location:** `backend/src/services/aiService.js`  
**Purpose:** Integrate with Google Gemini API  
**Responsibilities:**
- Source discovery (Gemini Flash)
- Deep semantic extraction (Gemini Deep-Search)
- Data validation (Gemini Deep-Search)
- Normalization (Gemini Flash)
- External knowledge discovery (Gemini Deep-Search)
- Profile data extraction (Gemini Deep-Search, Gemini Flash)

**Dependencies:**
- Google Gemini API (Flash and Deep-Search models)
- Configuration: API keys, model selection

**Key Methods:**
- `discoverSources(searchQuery)`
- `extractSkillsFromSource(sourceUrl)`
- `normalizeSkillName(skillName)`
- `discoverExternalCompetency(competencyName)`
- `extractSkillsFromResume(resumeText)`

**Error Handling:**
- Fallback to mock data if API unavailable (per Global API Fallback Rule)
- Rate limiting and retry logic

---

#### 2.2.6 CSV Processing Service
**Location:** `backend/src/services/csvProcessingService.js`  
**Purpose:** Process trainer CSV uploads  
**Responsibilities:**
- CSV file parsing and validation
- Hierarchical structure extraction
- AI normalization
- Duplicate detection
- Database integration

**Dependencies:**
- File upload handler
- AI Service: Normalization
- Taxonomy Service: Integration

**Key Methods:**
- `parseCSVFile(file)`
- `validateHierarchicalStructure(data)`
- `integrateWithTaxonomy(csvData)`

---

#### 2.2.7 Audit Service
**Location:** `backend/src/services/auditService.js`  
**Purpose:** Maintain audit trail for profile updates  
**Responsibilities:**
- Log all verification updates
- Track source, time, and actor
- Store previous state for rollback
- Query audit logs

**Dependencies:**
- Database: audit_log table

**Key Methods:**
- `logVerificationUpdate(updateData)`
- `getAuditTrail(userId, skillId)`
- `getAuditTrailBySource(source)`

---

#### 2.2.8 Authentication Service
**Location:** `backend/src/services/authService.js`  
**Purpose:** Handle authentication and authorization  
**Responsibilities:**
- Microservice token validation
- User role verification
- Access control enforcement

**Dependencies:**
- Token storage/validation mechanism
- User role database

**Key Methods:**
- `validateMicroserviceToken(token, microserviceId)`
- `checkUserRole(userId, requiredRole)`
- `validateAccess(userId, resource, action)`

---

### 2.3 Database Components

#### 2.3.1 Master Taxonomy Tables

**Skills Table** (`skills`)
```sql
- id (UUID, Primary Key)
- name (VARCHAR, NOT NULL)
- description (TEXT)
- level (INTEGER) -- L1, L2, L3, L4/MGS
- parent_skill_id (UUID, Foreign Key -> skills.id)
- leaf_node_count (INTEGER) -- For L1 skills only
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Competencies Table** (`competencies`)
```sql
- id (UUID, Primary Key)
- name (VARCHAR, NOT NULL)
- description (TEXT)
- parent_competency_id (UUID, Foreign Key -> competencies.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Junction Tables:**
- `skill_subSkill` (parent_skill_id, child_skill_id)
- `competency_subCompetency` (parent_competency_id, child_competency_id)
- `competency_requiredSkills` (competency_id, skill_id)

---

#### 2.3.2 User Profile Tables

**User Competency Table** (`userCompetency`)
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id)
- competency_id (UUID, Foreign Key -> competencies.id)
- verifiedSkills (JSON) -- {skillId: {verified: boolean, last_evaluate: timestamp}}
- CoveragePercentage (DECIMAL)
- proficiencyLevel (VARCHAR) -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- RelevanceScore (DECIMAL) -- For career path goals
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_evaluate (TIMESTAMP)
```

**User Skill Table** (`userSkill`)
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id)
- skill_id (UUID, Foreign Key -> skills.id)
- verified (BOOLEAN, DEFAULT false)
- verification_source (VARCHAR) -- Assessment, Certification, Claim/AI
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_evaluate (TIMESTAMP)
```

**Indexes:**
- `userCompetency`: (user_id, competency_id)
- `userSkill`: (user_id, skill_id)
- `skills`: (parent_skill_id)
- `competencies`: (parent_competency_id)

---

#### 2.3.3 Audit & Configuration Tables

**Audit Log Table** (`audit_log`)
```sql
- id (UUID, Primary Key)
- timestamp (TIMESTAMP, NOT NULL)
- source (VARCHAR) -- Assessment Service, Certification, Manual Entry
- actor (VARCHAR) -- Who/what triggered the update
- user_id (UUID, Foreign Key -> users.id)
- skill_id (UUID, Foreign Key -> skills.id)
- competency_id (UUID, Foreign Key -> competencies.id)
- action (VARCHAR) -- Description of change
- previous_status (JSON)
- new_status (JSON)
- exam_type (VARCHAR) -- Baseline, Course
- metadata (JSON) -- Additional context
```

**Official Sources Table** (`official_sources`)
```sql
- id (UUID, Primary Key)
- source_id (VARCHAR, UNIQUE) -- Unique identifier from AI
- source_name (VARCHAR, NOT NULL)
- reference_index_url (VARCHAR, NOT NULL) -- URL to the source
- reference_type (VARCHAR) -- API, Documentation, Standard, etc.
- access_method (VARCHAR) -- API, Web Scraping, etc.
- hierarchy_support (BOOLEAN) -- Whether source supports hierarchical data
- provides (TEXT) -- What the source provides: skills, competencies, etc.
- topics_covered (TEXT) -- Topics/domains covered by source
- skill_focus (VARCHAR) -- Specific skills focus area
- notes (TEXT) -- Additional notes or metadata
- verified (BOOLEAN, DEFAULT false)
- last_checked (TIMESTAMP)
- usage_count (INTEGER, DEFAULT 0) -- Track usage for data extraction
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Microservice Tokens Table** (`microservice_tokens`)
```sql
- id (UUID, Primary Key)
- microservice_id (VARCHAR, UNIQUE) -- Directory, Assessment, etc.
- token_hash (VARCHAR, NOT NULL)
- created_at (TIMESTAMP)
- expires_at (TIMESTAMP)
- is_active (BOOLEAN, DEFAULT true)
```

---

## 3. AI Integration Points

### 3.1 Knowledge Building & Taxonomy Construction

**Integration Point:** `backend/src/services/aiService.js` → Taxonomy Service

**Gemini Models:**
- **Gemini Flash:** Official sources discovery, normalization
- **Gemini Deep-Search:** Deep semantic extraction, validation

**Use Cases:**
1. **Source Discovery (Flash)**
   - Input: Search query for authoritative sources
   - Output: List of verified URLs/APIs
   - Trigger: System initialization, periodic updates

2. **Semantic Extraction (Deep-Search)**
   - Input: Raw content from official sources
   - Output: Structured hierarchical skill data
   - Trigger: After source discovery, during taxonomy updates

3. **Data Validation (Deep-Search)**
   - Input: Extracted skill data
   - Output: Validated, cleaned skill data
   - Trigger: After semantic extraction

4. **Normalization (Flash)**
   - Input: Raw skill names with variations
   - Output: Normalized, canonical skill names
   - Trigger: During taxonomy construction, CSV upload processing

**API Calls:**
```javascript
// Example structure
await geminiFlash.generateContent({
  model: 'gemini-flash',
  prompt: sourceDiscoveryPrompt,
  // ... configuration
});

await geminiDeepSearch.generateContent({
  model: 'gemini-deep-search',
  prompt: extractionPrompt,
  // ... configuration
});
```

---

### 3.2 Data Extraction & Initial Profile Mapping

**Integration Point:** `backend/src/services/aiService.js` → Profile Service

**Gemini Models:**
- **Gemini Deep-Search:** Unstructured data analysis
- **Gemini Flash:** Skill mapping to taxonomy

**Use Cases:**
1. **Resume/Profile Analysis (Deep-Search)**
   - Input: Unstructured text (resume, LinkedIn, GitHub)
   - Output: Identified skills, competencies, experience levels
   - Trigger: User onboarding (FR-2.2)

2. **Skill Mapping (Flash)**
   - Input: Extracted skills from resume
   - Output: Mapped skills to canonical taxonomy (MGS)
   - Trigger: After resume analysis

**API Calls:**
```javascript
// Resume extraction
const extractedSkills = await geminiDeepSearch.extractSkills({
  model: 'gemini-deep-search',
  text: resumeText,
  // ... configuration
});

// Taxonomy mapping
const mappedSkills = await geminiFlash.mapToTaxonomy({
  model: 'gemini-flash',
  skills: extractedSkills,
  taxonomy: canonicalTaxonomy,
  // ... configuration
});
```

---

### 3.3 External Knowledge Discovery

**Integration Point:** `backend/src/services/aiService.js` → Taxonomy Service → API Gateway

**Gemini Models:**
- **Gemini Deep-Search:** Targeted search and structured extraction

**Use Cases:**
1. **Gap Identification**
   - Trigger: Course Builder requests missing competency (FR-5.1.3)
   - Input: Competency name not found in database

2. **Targeted Search (Deep-Search)**
   - Input: Missing competency name
   - Output: Relevant external sources (industry standards, job boards, documentation)
   - Process: Broad internet search, filtering, prioritization

3. **Structured Extraction (Deep-Search)**
   - Input: External source content
   - Output: Structured competency with component MGS
   - Process: Extract definition, structure into MGS, normalize

**API Calls:**
```javascript
// External discovery
const externalData = await geminiDeepSearch.discoverCompetency({
  model: 'gemini-deep-search',
  competencyName: requestedCompetency,
  searchSources: ['industry_standards', 'job_boards', 'documentation'],
  // ... configuration
});

// Normalize and structure
const structuredCompetency = await geminiDeepSearch.extractStructure({
  model: 'gemini-deep-search',
  rawData: externalData,
  // ... configuration
});
```

**Error Handling:**
- Fallback to mock data if API unavailable
- Retry logic with exponential backoff
- Cache discovered competencies to avoid redundant API calls

---

## 4. External API Integrations

### 4.1 Assessment Microservice Integration

**Purpose:** Receive exam results to update verified skills

**Integration Type:** Asynchronous (webhook/event) and Synchronous (API call)

**Endpoints:**
- **Incoming:** `POST /api/webhooks/assessment-results`
  - Receives: Baseline exam results, Course exam results
  - Payload: `{userId, examType, results: [{skillId, status: PASS/FAIL}]}`
  - Authentication: Token-based (Assessment Service token)

**Outgoing:**
- **Baseline Exam Request:** `POST {ASSESSMENT_MS_URL}/api/exams/baseline`
  - Sends: User ID, list of MGS to test
  - Receives: Exam ID, exam URL

**Data Flow:**
1. Skills Engine sends baseline exam request → Assessment Service
2. Assessment Service conducts exam → User completes exam
3. Assessment Service sends results → Skills Engine webhook
4. Skills Engine updates profile → Triggers gap analysis
5. Skills Engine returns updated profile → Directory

**Related Requirements:** FR-3.1, FR-3.6, FR-3.10

---

### 4.2 Course Builder Microservice Integration

**Purpose:** Provide skills for competency mapping, enable dynamic taxonomy enrichment

**Integration Type:** Synchronous API

**Endpoints:**
- **Incoming:** `GET /api/competency/:competencyName/skills`
  - Request from: Course Builder (MS #3)
  - Behavior: Fuzzy match, external discovery if missing, return MGS list
  - Authentication: Token-based (Course Builder token)

**Response:**
```json
{
  "competencyId": "uuid",
  "competencyName": "Cloud Infrastructure",
  "mgs": [
    {"skillId": "uuid", "name": "AWS EC2 Management"},
    {"skillId": "uuid", "name": "Docker Containerization"},
    // ... more MGS
  ],
  "source": "internal" | "external_discovery"
}
```

**Data Flow:**
1. Course Builder requests competency skills → Skills Engine
2. Skills Engine checks internal database
3. If missing: Triggers External Knowledge Discovery (FR-5.2)
4. Skills Engine returns MGS list → Course Builder

**Related Requirements:** FR-5.1, FR-5.2

---

### 4.3 Content Studio Microservice Integration

**Purpose:** Provide skills for lesson content organization

**Integration Type:** Synchronous API

**Endpoints:**
- **Incoming:** `GET /api/competency/:competencyName/skills`
  - Request from: Content Studio (MS #4)
  - Behavior: Lookup only (no external discovery)
  - Authentication: Token-based (Content Studio token)

**Response:** Same as Course Builder, but `source` is always `"internal"`

**Related Requirements:** FR-6.1

---

### 4.4 Learner AI Microservice Integration

**Purpose:** Provide missing skills and competency data for learning plan generation

**Integration Type:** Asynchronous (webhook) and Synchronous API

**Endpoints:**
- **Outgoing (Async):** `POST {LEARNER_AI_MS_URL}/api/webhooks/gap-analysis-results`
  - Sends: Gap analysis results after course exam
  - Payload: `{userId, examStatus, missingSkillsMap, relevanceScore, competencyDetails}`
  - Trigger: After course exam processing (FR-3.14)

- **Incoming (Sync):** `GET /api/competency/:competencyName/skills`
  - Request from: Learner AI (MS #7)
  - Behavior: Lookup only (no external discovery)
  - Authentication: Token-based (Learner AI token)

**Data Flow:**
1. Course exam completed → Skills Engine receives results
2. Skills Engine updates profile → Performs gap analysis
3. Skills Engine sends gap analysis → Learner AI (async)
4. Learner AI queries skills → Skills Engine (sync, if needed)

**Related Requirements:** FR-3.14, FR-6.1

---

### 4.5 Directory Microservice Integration

**Purpose:** Provide user profile data for dashboard display

**Integration Type:** Asynchronous (webhook) and Synchronous API

**Endpoints:**
- **Incoming (Async):** `POST /api/webhooks/user-created`
  - Receives: New user creation event
  - Payload: `{userId, name, companyId, employeeType, careerGoal, rawData}`
  - Authentication: Token-based (Directory token)

- **Outgoing (Sync):** Returns updated profile after baseline exam
  - Returns: `{competencies, initialSkills, testedMGS, coveragePercentage, relevanceScore}`

**Data Flow:**
1. Directory creates user → Sends event to Skills Engine
2. Skills Engine creates profile → Extracts skills from raw data
3. Skills Engine requests baseline exam → Assessment Service
4. Skills Engine receives results → Updates profile
5. Skills Engine returns updated profile → Directory

**Related Requirements:** FR-2.1, FR-3.9

---

### 4.6 Learning Analytics Microservice Integration

**Purpose:** Provide individual and team competency data for reporting

**Integration Type:** Synchronous API

**Endpoints:**
- **Incoming:** `GET /api/analytics/user/:userId/profile`
  - Request from: Learning Analytics (MS #8)
  - Returns: Individual user profile with verified skills, proficiency levels, coverage percentages
  - Authentication: Token-based (Learning Analytics token)

- **Incoming:** `GET /api/analytics/team/:teamId/competencies`
  - Request from: Learning Analytics (MS #8)
  - Returns: Aggregate team competency status
  - Payload: `{teamId, userIds: []}`
  - Response: Aggregated competency data across team members

**Data Flow:**
1. Learning Analytics requests user profile → Skills Engine
2. Skills Engine queries database → Returns profile data
3. Learning Analytics requests team data → Skills Engine
4. Skills Engine aggregates data → Returns team summary

**Related Requirements:** FR-9.1, FR-9.2, FR-9.3

---

### 4.7 RAG/Chatbot Microservice Integration

**Purpose:** Provide taxonomy and user profile data for context-aware responses

**Integration Type:** Synchronous API (query-based)

**Endpoints:**
- **Incoming:** `GET /api/rag/taxonomy`
  - Request from: RAG/Chatbot (MS #7)
  - Returns: Canonical database of Competencies and Skills
  - Authentication: Token-based (RAG/Chatbot token)

- **Incoming:** `GET /api/rag/user/:userId/profile`
  - Request from: RAG/Chatbot (MS #7)
  - Returns: User profile (competencies, verified skills, proficiency levels, coverage percentages, relevance score)
  - Authentication: Token-based (RAG/Chatbot token)

**Data Flow:**
1. User queries chatbot about skills → RAG queries Skills Engine
2. Skills Engine returns taxonomy/user data → RAG generates response
3. RAG provides skill-aware guidance → User

**Related Requirements:** FR-10.1, FR-10.2

---

### 4.8 Authentication & Token Management

**Token Storage:**
- Each microservice has its own token stored in `microservice_tokens` table
- Tokens are hashed and validated on each request
- Token expiration and rotation supported

**Microservices with Tokens:**
1. Directory
2. Assessment
3. Content Studio
4. Course Builder
5. Learner AI
6. Learning Analytics
7. RAG/Chatbot

**Validation Flow:**
```javascript
// Example validation
const isValid = await authService.validateMicroserviceToken(
  request.headers.authorization,
  'course-builder'
);
if (!isValid) {
  return res.status(401).json({ error: 'Invalid token' });
}
```

---

## 5. UI/UX Design Requirements

### 5.1 User Profile Dashboard

**Layout:**
- Header: User name, Relevance Score (prominent display)
- Main content: Grid of Competency Cards
- Sidebar: Navigation, filters (optional)

**Competency Card Design:**
- **Card Header:** Competency name, proficiency level badge
- **Progress Section:** Coverage Percentage with visual progress bar
- **Expandable Section:** "View Details" button → Shows verified MGS list
- **Color Coding:**
  - BEGINNER: Red/Orange (0-30%)
  - INTERMEDIATE: Yellow (31-65%)
  - ADVANCED: Blue (66-85%)
  - EXPERT: Green (86-100%)

**Responsive Design:**
- Mobile: Single column, stacked cards
- Tablet: 2 columns
- Desktop: 3-4 columns

---

### 5.2 Gap Analysis View

**Layout:**
- Header: "Skill Gaps" title, Relevance Score context
- Main content: Categorized missing skills
- Each category: Competency name → List of missing MGS

**Design Elements:**
- **Competency Grouping:** Clear visual separation between competencies
- **Missing Skills List:** Bullet points or checkboxes (for tracking)
- **Action Buttons:** "Find Courses" (links to Learner AI), "View Details"
- **Empty State:** "No gaps found! You're on track." message

**User Experience:**
- Expandable/collapsible competency sections
- Search/filter functionality for missing skills
- Export option (CSV/PDF) for gap analysis report

---

### 5.3 Skills Profile Detail Page

**Layout:**
- Full-page dedicated view
- All competencies with complete details
- Verified MGS drill-down (expandable)
- Missing skills section (from Broad Gap Analysis)
- Relevance Score display

**Design Elements:**
- **Tabbed Interface (Optional):** "Verified Skills" | "Missing Skills" | "Progress"
- **Visualizations:** Charts for coverage trends (if historical data available)
- **Actions:** Share profile (secure URL), export report

**Access Control:**
- "Upload File" button visible only to Trainers
- Role check on both frontend and backend

---

### 5.4 CSV Upload Interface

**Layout:**
- Modal or dedicated page
- File upload area (drag-and-drop or file picker)
- Format instructions and example CSV
- Upload progress indicator
- Success/error notifications

**Design Elements:**
- **File Validation:** Real-time feedback on CSV format
- **Preview:** Show parsed data before upload
- **Error Handling:** Clear error messages for invalid data
- **Success Feedback:** Confirmation with number of skills added

**Access Control:**
- Visible only to users with Trainer role
- Backend validation enforces access control

---

### 5.5 Design System Requirements

**Color Palette:**
- Primary: Brand colors (to be defined)
- Proficiency Levels: Red (BEGINNER) → Orange → Yellow → Blue → Green (EXPERT)
- Neutral: Gray scale for text and backgrounds

**Typography:**
- Headings: Bold, clear hierarchy
- Body: Readable font size (16px minimum)
- Metrics: Large, prominent numbers for scores and percentages

**Components:**
- Buttons: Primary (action), Secondary (navigation), Danger (delete)
- Cards: Elevated with shadow, rounded corners
- Progress Bars: Animated, color-coded
- Badges: Proficiency levels, status indicators

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios meet standards

---

## 6. Dependencies & Rollout Strategy

### 6.1 Technical Dependencies

#### 6.1.1 External Services
- **Google Gemini API:** Required for all AI capabilities
  - Models: Gemini Flash, Gemini Deep-Search
  - API Key: `GEMINI_API_KEY` environment variable
  - Fallback: Mock data if API unavailable

- **PostgreSQL Database:** Required for data persistence
  - Supabase (production) or local PostgreSQL (development)
  - Connection string: `DATABASE_URL` environment variable

- **Microservice APIs:** 7 integrated microservices
  - Assessment, Course Builder, Content Studio, Learner AI, Learning Analytics, Directory, RAG/Chatbot
  - Each requires token configuration
  - URLs: Environment variables per microservice

#### 6.1.2 Internal Dependencies
- **Frontend → Backend:** REST API communication
- **Backend → Database:** PostgreSQL queries via ORM (e.g., Prisma, Sequelize)
- **Backend → AI Service:** Gemini API integration
- **Backend → External APIs:** HTTP clients (axios, fetch)

#### 6.1.3 Infrastructure
- **Deployment Platforms:**
  - Frontend: Vercel
  - Backend: Railway
  - Database: Supabase
- **CI/CD:** GitHub Actions (`.github/workflows/`)
- **Environment Variables:** Secure storage in deployment platforms

---

### 6.2 Feature Dependencies

#### 6.2.1 Core Features (Must Have for MVP)
1. **Taxonomy Management** → Required by all other features
2. **User Profile Management** → Required for gap analysis, frontend display
3. **Gap Analysis** → Required for frontend display, Learner AI integration
4. **API Gateway** → Required for all microservice integrations
5. **Frontend Display** → Required for user-facing features

#### 6.2.2 Secondary Features (Can Be Added Post-MVP)
1. **CSV Upload** → Depends on Taxonomy Management, Authentication
2. **Audit & Security** → Can be added incrementally
3. **Advanced Analytics** → Depends on core features

#### 6.2.3 Integration Dependencies
- **Assessment Integration** → Required for profile updates
- **Directory Integration** → Required for user onboarding
- **Course Builder Integration** → Required for dynamic enrichment
- **Learner AI Integration** → Depends on gap analysis
- **Learning Analytics Integration** → Depends on profile management
- **RAG Integration** → Depends on taxonomy and profile management

---

### 6.3 Rollout Strategy

#### Phase 1: Foundation (Weeks 1-4)
**Goal:** Core taxonomy and profile management

**Deliverables:**
- Database schema implementation
- Taxonomy initialization service
- User profile creation and update services
- Basic API endpoints (internal testing)

**Success Criteria:**
- Taxonomy can be initialized from official sources
- User profiles can be created and updated
- Basic API endpoints functional

---

#### Phase 2: Core Features (Weeks 5-8)
**Goal:** Gap analysis and API gateway

**Deliverables:**
- Gap analysis service (narrow and broad)
- API gateway with token authentication
- Integration with Assessment and Directory microservices
- Basic frontend dashboard

**Success Criteria:**
- Gap analysis completes in <1 second
- API gateway validates tokens correctly
- Assessment results update profiles successfully
- Frontend displays user profiles

---

#### Phase 3: Integrations (Weeks 9-12)
**Goal:** Microservice integrations and external discovery

**Deliverables:**
- Course Builder integration (with external discovery)
- Content Studio and Learner AI integrations
- Learning Analytics integration
- RAG integration
- Enhanced frontend (gap analysis view, detail page)

**Success Criteria:**
- All 7 microservices can communicate with Skills Engine
- External knowledge discovery works for missing competencies
- Frontend displays gap analysis correctly

---

#### Phase 4: Advanced Features (Weeks 13-16)
**Goal:** CSV upload, audit trail, optimizations

**Deliverables:**
- CSV upload functionality (Trainer role)
- Audit trail service
- Performance optimizations
- Security enhancements
- Comprehensive testing

**Success Criteria:**
- Trainers can upload custom skills via CSV
- Audit trail logs all verification updates
- System handles 100,000+ user profiles
- All NFRs met

---

#### Phase 5: Production Readiness (Weeks 17-20)
**Goal:** Deployment, monitoring, documentation

**Deliverables:**
- Production deployment (Vercel, Railway, Supabase)
- Monitoring and logging setup
- Documentation completion
- User training materials
- Performance testing and optimization

**Success Criteria:**
- System deployed and accessible
- Monitoring alerts configured
- Documentation complete
- Performance meets all NFRs

---

### 6.4 Risk Mitigation

**AI API Availability:**
- Risk: Gemini API downtime or rate limits
- Mitigation: Fallback to mock data, caching, retry logic

**Database Performance:**
- Risk: Slow queries with 100,000+ users
- Mitigation: Proper indexing, query optimization, caching

**Microservice Integration:**
- Risk: Token management complexity, API changes
- Mitigation: Centralized token management, versioned APIs, comprehensive error handling

**Data Quality:**
- Risk: Incorrect AI extractions or normalizations
- Mitigation: Validation layers, human review options, confidence scores

---

## 📊 Feature Architecture Summary

| Feature | Frontend Component | Backend Service | Database Tables | AI Integration | External APIs |
|---------|-------------------|----------------|-----------------|----------------|---------------|
| Taxonomy Management | N/A | taxonomyService | skills, competencies, junction tables | Gemini Flash/Deep-Search | Official sources |
| Profile Management | ProfileDashboard | profileService | userCompetency, userSkill | Gemini Deep-Search/Flash | Assessment, Directory |
| Gap Analysis | GapAnalysis | gapAnalysisService | userCompetency, skills | N/A | Learner AI |
| API Gateway | N/A | apiGatewayService | microservice_tokens | N/A | All 7 microservices |
| CSV Upload | CSVUpload | csvProcessingService | skills, competencies | Gemini Flash | N/A |
| Frontend Display | Multiple components | profileService, gapAnalysisService | userCompetency, userSkill | N/A | N/A |
| Audit & Security | N/A | auditService | audit_log | N/A | N/A |

---

## 🔗 Related Documents

- [Functional Requirements](./FUNCTIONAL_REQUIREMENTS.md)
- [User Stories & Business Logic](./USER_STORIES_AND_BUSINESS_LOGIC.md)
- [Non-Functional Requirements](./NON_FUNCTIONAL_REQUIREMENTS.md)
- [AI Capabilities](./AI_CAPABILITIES.md)
- [Setup Guide](../SETUP.md)
- [Deployment Guide](../DEPLOYMENT.md)

---

**Last Updated:** 2025-01-27

