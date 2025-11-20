# Step 2: Functional & Non-Functional Requirements Document

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Date:** 2025-01-27  
**Status:** ✅ Complete

---

## Table of Contents

1. [Functional Requirements](#functional-requirements)
2. [User Stories](#user-stories)
3. [Business Logic](#business-logic)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [AI Capabilities](#ai-capabilities)

---

## Functional Requirements

### 5.1 Skills and Competency Taxonomy Structure

#### FR 5.1.1 Unified Skill Hierarchy
Store the entire skill hierarchy in a single canonical skill table using a self-referencing relationship to manage parent-child connections, supporting unlimited N-level depth. Each Top-Level Skill (L1) must maintain a cached attribute for total leaf-node (MGS) count for proficiency and gap calculations.

#### FR 5.1.2 Atomic Skill Definition
Every skill requires a Name and Description. Most Granular Skills (MGS) must track their Primary Verification Source.

#### FR 5.1.3 Competency Structure
Competencies must support a maximum two-layer structure (Parent Competency → Child Competency).

#### FR 5.1.4 Granular Competency Requirements
Each competency defines a Minimum Proficiency Level and required Skills. Competencies can link directly to L1 skills and nested Competencies. The system must aggregate the full set of MGS from the hierarchy to determine the complete requirement set.

#### FR 5.1.5 Skill Relationship Network
Support many-to-many relationships between any two skills using a dedicated junction table.

### 5.2 Data Ingestion and Normalization

#### FR 5.2.1 Initial Import
On system initialization, define official external sources (URLs) and use AI-driven extraction to build the initial Skills Taxonomy Database.

#### FR 5.2.2 AI Normalization
Standardize imported and user-added skills. Check for existing entries to prevent duplication before saving.

#### FR 5.2.3 On-Demand Skill Discovery
When a missing skill/competency is requested, first perform an internal lookup. If not found, query an External Knowledge Discovery AI Tool, normalize the findings, store them in the taxonomy, and return them.

#### FR 5.2.4 Trainer Custom Taxonomy Import
Allow Trainer users to upload a CSV with hierarchical skills/competencies.

#### FR 5.2.5 Taxonomy Periodic Synchronization
On system activation, re-scan official URLs and trigger AI extraction only for net-new skills or competencies.

### 5.3 User Profile Creation and Verification

#### FR 5.3.1 Profile Initialization
Receive user data from Directory MS (#1), including user name, user_id, company_id, employee_type, career path, and raw external data (claimed skills, job roles, certifications, experiences). Validate and store this data in user profile tables.

#### FR 5.3.2 AI-Based Skill Extraction & Normalization
Process stored raw data with AI to extract granular skills and competencies, map them to the internal taxonomy, normalize synonyms/duplicates, and create the initial user skill profile.

#### FR 5.3.3 Initial Status
All normalized skills after mapping are initialized as verified=false.

#### FR 5.3.4 Primary Assignment Verification Request
After profile initialization, send required MGS for the mandatory Primary Assignment test to Assessment MS (#5) to trigger formal skill verification.

#### FR 5.3.5 Granular Verification
Update MGS to verified=true and store verification date upon receiving assessment results exceeding thresholds.

#### FR 5.3.6 Post-course Exam Handling
Support multiple exam attempts; add any newly verified MGS to the user profile and update exam status (Pass/Fail).

#### FR 5.3.7 User Skill Storage Format
Store individual user skill data in UserCompetency as a JSON mapping skill_id, skill_name, verification status, and last update.

#### FR 5.3.8 Directory Update after Baseline
After a Baseline Exam, send a secondary request to Directory MS (#1) including the calculated Relevance Score.

#### FR 5.3.9 Updated Profile Delivery
After any skill verification or profile update, send the updated user profile to Directory MS (#1), including:
- List of Competencies the user possesses
- Proficiency level per Competency (BEGINNER → EXPERT)
- Top-Level (L1) skills directly owned by the user
- Relevance Score for the Career Path Goal

#### FR 5.3.10 Initial Raw Skill Storage
Store all skills extracted from raw external data in UserSkill table without hierarchical relationships; initialize as verified=false.

#### FR 5.3.11 Post-Baseline MGS Storage
After Baseline Exam, store verified MGS in UserCompetency JSON with:
- Competency → MGS mapping
- Proficiency level
- Top-Level (L1) skills directly owned
- Relevance Score

### 5.4 Proficiency and Level Calculation

#### FR 5.4.2 Competency Level Calculation (MGS Count)
Calculate proficiency as the ratio of verified MGS to total required MGS. Intermediate layers are ignored.

**Formula:**
```
Coverage Percentage = (Verified MGS / Total Required MGS) × 100
```

#### FR 5.4.3 Proficiency Mapping
Map coverage percentage to levels:
- **BEGINNER**: 0–30%
- **INTERMEDIATE**: 31–65%
- **ADVANCED**: 66–85%
- **EXPERT**: 86–100%

#### FR 5.4.4 Continuous Profile Update
After receiving a verification Pass, recalculate and update the parent Competency level. Fail does not update proficiency.

#### FR 5.4.5 Relevance Score Calculation
Calculate the Relevance Score for the user's Career Path Goal using the same formula as Coverage Percentage.

### 5.5 Gap Analysis and Reporting

#### FR 5.5.1 User/Team Data Retrieval
Provide Learning Analytics (MS #8) access to verified user profiles and aggregated team competency status.

#### FR 5.5.2 Skills Profile Data Provision
Provide a secure URL to render the Dedicated Skills Profile Page; missing skills derived from Broad Gap Analysis, structured as MAP (Competency ID → missing MGS list).

#### FR 5.5.3 Automated Trigger
Automatically trigger Gap Analysis and profile updates whenever a verification score is received from MS #5.

#### FR 5.5.4 Conditional Gap Analysis Logic
- **Baseline Exam** → Broad Gap Analysis against Career Path Goal
- **Post-course Exam**:
  - **FAIL** → Narrow Gap Analysis for course-specific Competency
  - **PASS** → Broad Gap Analysis against Career Path Goal

#### FR 5.5.5 Definitive Gap Calculation
Missing MGS = Required MGS Set − Verified MGS Set

#### FR 5.5.6 Gap Analysis Data Sent
Send structured gap-analysis results to Learner AI (MS #7) with missing skills, exam status, and related course/competency info (MAP format).

#### FR 5.5.7 Frontend Display & Access Control
Trainer users have access to Upload File button.

### 5.6 General Skill/Competency Retrieval

#### FR 5.6.1 Granular Skill Retrieval (Course Builder)
Retrieve MGS for a given Competency; apply AI normalization and fuzzy-matching. If missing/incomplete, dynamically discover and import skills before returning the full MGS list.

#### FR 5.6.2 Granular Skill Retrieval (Content Studio / Learner AI)
Retrieve MGS for a given Competency from internal database only, without triggering external discovery.

---

## User Stories

### Employee User Stories

**US-1:** As an employee, I want to view my skill profile so that I can see my verified competencies, proficiency levels, and identify skill gaps.

**Acceptance Criteria:**
- Profile displays verified MGS
- Shows proficiency levels (BEGINNER to EXPERT)
- Displays gap analysis results
- Shows relevance score for career path

### Trainer User Stories

**US-2:** As a trainer, I want to upload a CSV file with custom skills and competencies so that I can import domain-specific taxonomies for my training programs.

**Acceptance Criteria:**
- Upload button visible only to trainers
- CSV file validated for security
- Skills normalized and merged into taxonomy
- L1 skills updated with MGS count

**US-15:** As a trainer, I want my uploaded CSV file to be validated for security threats so that the system is protected from injection attacks.

**Acceptance Criteria:**
- File checked for SQL injection
- File checked for prompt injection
- Security alerts triggered if threats detected
- File rejected if unsafe

### Directory Microservice User Stories

**US-3:** As Directory MS, I want to send new user data to Skills Engine so that user profiles can be initialized and skill extraction can begin.

**US-4:** As Directory MS, I want to receive updated user profiles after skill verification so that I can display current skill status to users.

### Assessment Microservice User Stories

**US-5:** As Assessment MS, I want to receive required MGS for baseline exam so that I can create the Primary Assignment test for new users.

**US-6:** As Assessment MS, I want to send exam results to Skills Engine so that user skills can be verified and profiles updated.

### Course Builder Microservice User Stories

**US-7:** As Course Builder MS, I want to retrieve MGS for a competency so that I can map courses to required skills, with automatic discovery of missing skills.

### Content Studio Microservice User Stories

**US-8:** As Content Studio MS, I want to retrieve MGS for a competency from existing database only so that I can organize lesson content without altering the taxonomy.

### Learner AI Microservice User Stories

**US-9:** As Learner AI MS, I want to receive gap analysis results with missing skills so that I can build personalized learning plans and recommend courses.

**US-10:** As Learner AI MS, I want to retrieve MGS for competencies from existing database so that I can query skills related to competencies for learning plan building.

### Learning Analytics Microservice User Stories

**US-11:** As Learning Analytics MS, I want to retrieve verified user profiles and aggregated team competency status so that I can generate reports and insights.

### RAG/Chatbot Microservice User Stories

**US-12:** As RAG MS, I want to receive canonical taxonomy structure and verified user profiles so that I can provide skill-aware guidance and recommendations.

### System User Stories

**US-13:** As the system, I want to initialize the taxonomy from external sources using AI extraction so that I can build the canonical skill database.

**US-14:** As the system, I want to automatically trigger gap analysis after exam results so that users always have current gap information.

---

## Business Logic

### 1. Skill & Competency Normalization
- AI extracts skills/competencies from user raw data
- Skills are normalized to the existing taxonomy using synonym matching and semantic similarity
- Duplicates are removed
- All extracted skills are stored as unverified until validated

### 2. Determining Required MGS
- Each competency defines required Most Granular Skills (MGS)
- The system flattens the full hierarchy (Competency → Skills → MGS) to produce a complete MGS requirement list

### 3. Dynamic Discovery Rules
- **Course Builder**: If a competency does not exist, perform external AI-based discovery and save the new data
- **Content Studio / Learner AI**: If a competency is missing, only internal lookup is allowed (no external discovery)

### 4. Verification Workflow
- Assessment MS sends exam results (Baseline or Post-course)
- Skills that meet the threshold are marked verified=true
- Verified skills update parent skills and update competency proficiency

### 5. Competency Level Calculation
- **Formula**: Coverage = verified_MGS / total_required_MGS
- **Mapping**: Coverage is mapped to 4 levels (BEGINNER → EXPERT)
- Levels update automatically after each verification event

### 6. Relevance Score Logic
- Relevance Score uses the same coverage formula as competency proficiency
- Represents user alignment with their Career Path Goal

### 7. Gap Analysis Rules
- **Trigger**: Triggered whenever new exam results arrive
- **Baseline Exam** → Broad Gap Analysis (full career path)
- **Post-course PASS** → Broad Gap Analysis
- **Post-course FAIL** → Narrow Gap Analysis (only the competency of the course)
- **Calculation**: Gap = Required MGS – Verified MGS, grouped by competency

### 8. Profile Update Logic
After each verification or profile change, the system returns an updated profile to Directory MS including:
- Competencies + proficiency level
- Top-level skills directly owned by the user
- Verified MGS
- Relevance Score

### 9. Storage Rules
- Extracted skills are stored in UserSkill table
- Verified skills and competency-level data are stored in UserCompetency as JSON

---

## Non-Functional Requirements

### Performance
- **API Response Times**:
  - Simple reads: ≤200ms for basic skill/competency lookups
  - Complex operations: Flexible - gap analysis and proficiency calculations may take longer (up to 2-3 seconds for complex hierarchies)
  - AI operations: Timeout after 30 seconds, fallback to mock data if exceeded
- **System Uptime**: ≥99.9% availability
- **Throughput**: Support at least 1000 concurrent API requests
- **Database Performance**: Efficient queries for N-level hierarchical data, use indexing and caching for frequently accessed taxonomies

### Security
- **Data Encryption**: Encrypt sensitive data at rest and in transit (TLS 1.2+)
- **Access Control**: Role-based access control (RBAC) - employees, trainers, admin roles with appropriate permissions
- **Injection Prevention**: Validate and sanitize all inputs, especially CSV uploads - prevent SQL injection and prompt injection attacks
- **API Security**: Authenticate and authorize all API requests, use API keys or OAuth tokens for microservice communication
- **Data Privacy**: Comply with privacy regulations, secure handling of employee skill data, audit logging for sensitive operations

### Scalability
- **Data Volume**: Handle large skill taxonomies (thousands of skills, hundreds of competencies) efficiently
- **Concurrent Users**: Support multiple concurrent microservice requests without degradation
- **Horizontal Scaling**: Design for horizontal scaling - stateless API design, database connection pooling
- **Caching**: Implement caching for frequently accessed taxonomy data and user profiles to reduce database load

### Reliability
- **Error Handling**: Graceful error handling with meaningful error messages, no system crashes from invalid inputs
- **Fallback Mechanisms**: Automatic fallback to mock data if external AI services fail (per global API rollback rule)
- **Data Consistency**: Use database transactions for critical operations (profile updates, skill verification)
- **Backup Recovery**: Regular database backups, ability to recover from data loss
- **Monitoring**: Comprehensive logging and monitoring for system health, error tracking, and performance metrics

### Usability
- **User Interface**: Intuitive UI for employees and trainers, clear navigation, responsive design
- **Error Messages**: Clear, actionable error messages for users
- **API Documentation**: Comprehensive API documentation for microservice integrations
- **Accessibility**: WCAG AA compliance for web interface, keyboard navigation, screen reader support

### Maintainability
- **Code Quality**: Clean, well-documented code following best practices
- **API Versioning**: API versioning to maintain backward compatibility as system evolves
- **Logging**: Structured logging for debugging and auditing
- **Testing**: Comprehensive test coverage (unit, integration, e2e tests)

### Compatibility
- **Platform Integration**: Seamless integration with existing EduCora AI microservices
- **API Standards**: Follow platform's unified API standards and patterns
- **Asynchronous Communication**: Support event-based asynchronous communication with other microservices
- **Backward Compatibility**: Maintain backward compatibility as taxonomy grows and evolves

---

## AI Capabilities

### AI-1: Source Discovery
- **Purpose**: Identify official external sources for skills and competencies
- **Model**: Gemini 1.5 Flash
- **Prompt Specification**: Generate list of authoritative URLs for skills and competencies
- **Expected Output**: List of valid URLs to feed into the extraction workflow
- **Related FR**: FR 5.2.1

### AI-2: Deep Web Scanning / Extraction
- **Purpose**: Scrape or call APIs on official sources to extract hierarchical skills and competencies
- **Model**: Gemini 1.5 Pro (Deep Search)
- **Prompt Specification**: Input: source URLs. Instruction: Extract skills/competencies in a hierarchical format (Competency → Skill → Sub-skill → N-levels)
- **Expected Output**: Verified hierarchical data ready for normalization
- **Related FR**: FR 5.2.1

### AI-3: Skill & Competency Extraction from Raw User Data
- **Purpose**: Process user-provided raw data (resumes, LinkedIn, GitHub, ORCID, Credly) to extract granular skills and associated competencies
- **Model**: Gemini 1.5 Flash
- **Prompt Specification**: Input: raw text data. Instruction: Identify skills, competencies, synonyms, and map to internal taxonomy
- **Expected Output**: List of normalized skills and competencies, ready for storage in user profile
- **Related FR**: FR 5.3.2

### AI-4: Normalization of Skills and Competencies
- **Purpose**: Standardize terminology, merge duplicates, unify synonyms, and ensure consistent hierarchical structure
- **Model**: Gemini 1.5 Flash
- **Prompt Specification**: Input: extracted skills/competencies. Instruction: Normalize terms, detect duplicates, unify hierarchy
- **Expected Output**: Canonical, normalized, hierarchical taxonomy entries
- **Related FR**: FR 5.2.2

### AI-5: Validation of Extracted Data
- **Purpose**: Validate completeness, accuracy, and hierarchical correctness of extracted skills and competencies before storage
- **Model**: Gemini 1.5 Flash / Gemini 1.5 Pro (Deep Search)
- **Prompt Specification**: Input: hierarchical extracted data. Instruction: Check for completeness, missing levels, inconsistencies, duplicates, and assign confidence scores
- **Expected Output**: Flagged entries, confidence scores, verified hierarchical structure ready for storage
- **Related FR**: FR 5.2.1

### AI-6: On-Demand Skill Discovery for Missing Competencies
- **Purpose**: When a competency is requested but not found internally, perform external search to discover missing skills/competencies
- **Model**: Gemini 1.5 Flash + Deep Search
- **Prompt Specification**: Input: missing competency name. Instruction: Search for relevant sources, extract, normalize, and return hierarchical skills
- **Expected Output**: New competency and skills data, normalized and ready to integrate into the canonical taxonomy
- **Related FR**: FR 5.2.3

---

## Notes

- All AI prompt specifications must be stored in `/docs/prompts` folder
- All AI operations must implement fallback to mock data if external services fail (Global API Rollback Rule)
- Mock data is stored in `/backend/mockdata/` as `.json` files aligned with API schemas
- All backend endpoints using external APIs must implement fallback logic (try real API → use mock)
- Log every rollback event in `/customize/change_log.json` with `"change_type": "api_rollback"`

---

**Document Generated:** 2025-01-27  
**Last Updated:** 2025-01-27



