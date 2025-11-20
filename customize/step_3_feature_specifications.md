# Step 3: Feature Architecture - Detailed Specifications

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Date:** 2025-01-27  
**Status:** In Progress

---

## Unified Data Exchange Protocol

**Note:** This section describes the unified communication architecture that will be implemented in Step 6 (Implementation Phase). All API interactions between Skills Engine and other microservices will use this protocol.

### Overview

Skills Engine implements a **Unified Data Exchange Endpoint** as the single gateway for all microservice communications. Instead of exposing multiple endpoints for each microservice, all external microservices communicate through one unified endpoint.

### Unified Endpoint

**Single Public API Route:**
- `POST /api/fill-content-metrics/`

This is the **only public API route** for external microservices. All microservices (Directory MS, Assessment MS, Course Builder MS, Content Studio MS, Learner AI MS, Learning Analytics MS, RAG MS) must call this endpoint and no other.

### Request Format

Every request must follow this mandatory structure:

```json
{
  "requester_service": "string",
  "payload": {},
  "response": {
    "status": "success | error",
    "message": "string",
    "data": {}
  }
}
```

**Fields:**
- `requester_service`: The exact name of the microservice sending the request (e.g., "directory-ms", "assessment-ms", "course-builder-ms")
- `payload`: The input data sent by that microservice (can be empty `{}`)
- `response`: A template defining how the caller wants the response fields to be named and structured

**Rules:**
- Must not add, remove, or rename any fields
- Must follow this structure exactly

### Request Routing Logic

The unified endpoint implements internal routing based on `requester_service`:

1. Endpoint receives the JSON request
2. Reads `requester_service` value
3. Routes to the correct internal handler based on mapping:

| requester_service | Internal Handler Folder |
|-------------------|------------------------|
| directory-ms | `/handlers/directory/` |
| assessment-ms | `/handlers/assessment/` |
| course-builder-ms | `/handlers/courses/` |
| content-studio-ms | `/handlers/content/` |
| learner-ai-ms | `/handlers/learner/` |
| analytics-ms | `/handlers/analytics/` |
| rag-ms | `/handlers/rag/` |

Each handler is responsible only for its specific microservice logic.

### Response Construction

Each handler must return data inside the same response template the caller provided:

```json
{
  "requester_service": "<same as input>",
  "payload": { ...same payload received... },
  "response": {
    "status": "success",
    "message": "string describing the result",
    "data": { ...filled according to caller template... }
  }
}
```

**Rules:**
- Fill only what appears under `response.data` in the template
- Never add extra keys
- Never rename fields
- Never flatten or restructure data unless explicitly defined in handler logic
- If error occurs, return:
  ```json
  {
    "response": {
      "status": "error",
      "message": "description of the error",
      "data": {}
    }
  }
  ```

### Architecture Structure

```
routes/
  └── unified-endpoint.js (only public route)

handlers/
  ├── directory/
  ├── assessment/
  ├── courses/
  ├── content/
  ├── learner/
  ├── analytics/
  └── rag/

services/ (optional)
  └── shared code
```

### Enforcement Rules

1. **No additional API routes** - Only `/api/fill-content-metrics/` exists
2. **Handlers are internal only** - Never expose handlers as public routes
3. **Always route by requester_service** - No special cases
4. **Always return same structure** - With values filled according to template
5. **Clean architecture** - No business logic inside main route
6. **No assumptions** - Use only what was sent in `payload` & `response`

### Implementation Notes

- **Implementation Phase:** This protocol will be implemented in Step 6 (Implementation Phase)
- **Current Documentation:** Features 8.1-8.7 document the specific interactions, but all will use this unified endpoint
- **Backward Compatibility:** The unified endpoint maintains all existing functionality while providing a single entry point

---

## Feature 1: Taxonomy Management

### 1.1 Skill Hierarchy Management

**Goal:** Manage N-level skill hierarchy with self-referencing relationships, supporting unlimited depth. Each Top-Level Skill (L1) maintains cached total MGS count.

**Linked Functional Requirements:**
- FR 5.1.1: Unified Skill Hierarchy
- FR 5.1.2: Atomic Skill Definition

**System Components:**

**Frontend:**
- Skill hierarchy tree view component
- Skill detail modal/form
- Hierarchy navigation (breadcrumbs)
- Admin interface for skill management (if needed)

**Backend:**
- Skill model/entity with self-referencing relationship
- Skill repository with hierarchical queries
- Skill service for CRUD operations
- Hierarchy traversal algorithms
- MGS count calculation service

**Database:**
- `skills` table with:
  - `id` (primary key)
  - `name` (required)
  - `description` (required)
  - `parent_id` (foreign key to skills.id, nullable for L1)
  - `source` (enum/string: manual, trainer_upload, ai_extraction, external_import)
  - `total_mgs_count` (cached for L1 skills)
  - `created_at`, `updated_at`

**UI/UX Design:**
- **Has custom design:** No (standard tree view)
- **Description:** Standard hierarchical tree display with expand/collapse. Admin interface if needed for taxonomy management.

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:** 
  - Recursive hierarchy traversal for building tree structure
  - MGS identification: A skill is considered MGS (Most Granular Skill) if it has no child skills (i.e., no other skills reference it as `parent_id`). The system checks if the skill is a leaf node by querying for skills where `parent_id = current_skill.id`. If no results are found, the skill is identified as MGS.
  - MGS count calculation: Recursively count all leaf nodes (MGS) under each L1 skill
  - Hierarchy validation: Ensure no circular references
  - Level calculation: Calculate depth from root to each node

**Dependencies:**
- None (foundational feature)

**Telemetry:**
- Log skill hierarchy operations (create, update, delete)
- Track MGS count calculation performance
- Monitor hierarchy depth statistics

**Rollout Strategy:**
- MVP: Basic hierarchy CRUD operations
- Phase 2: MGS count caching optimization
- Phase 3: Advanced hierarchy queries and bulk operations

---

### 1.2 Competency Structure Management

**Goal:** Manage two-layer competency structure (Parent Competency → Child Competency). Support competency-to-skill and competency-to-competency relationships.

**Linked Functional Requirements:**
- FR 5.1.3: Competency Structure
- FR 5.1.4: Granular Competency Requirements

**System Components:**

**Frontend:**
- Competency hierarchy view (2-level max)
- Competency detail form
- Skill-to-competency mapping interface
- Competency-to-competency relationship view

**Backend:**
- Competency model/entity
- Competency repository
- Competency service
- MGS aggregation service (flatten hierarchy to get all required MGS)

**Database:**
- `competencies` table with:
  - `id` (primary key)
  - `name` (required)
  - `description`
  - `parent_id` (foreign key to competencies.id, nullable for parent)
  - `source` (enum/string: manual, trainer_upload, ai_extraction, external_import)
- `competency_skills` junction table:
  - `competency_id`
  - `skill_id` (L1 skills)
- `competency_competencies` junction table:
  - `parent_competency_id`
  - `child_competency_id`

**UI/UX Design:**
- **Has custom design:** No (standard form and tree view)
- **Description:** Two-level competency tree with skill mapping interface.

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  - MGS aggregation algorithm: Flatten competency hierarchy to get complete MGS requirement set
  - Traversal logic: Competency → Child Competencies → Skills → Sub-skills → Micro-skills (down to lowest MGS level)
  - For each competency:
    - Start with the competency
    - If it has child competencies (via `competency_competencies`), recursively traverse each child
    - For each competency (parent or child), get linked L1 skills (via `competency_skills`)
    - For each L1 skill, traverse the skill hierarchy: Skill → Sub-skills → Micro-skills → ... (down to the lowest MGS level)
    - Union all MGS sets to get total required MGS
  - Read operations: Supports reading from `competencies`, `competency_skills`, `competency_competencies`, and `skills` tables

**Dependencies:**
- Feature 1.1 (Skill Hierarchy Management)

**Telemetry:**
- Log competency operations
- Track MGS aggregation performance
- Monitor competency-to-skill mapping statistics

**Rollout Strategy:**
- MVP: Basic 2-level competency structure
- Phase 2: MGS aggregation optimization
- Phase 3: Advanced competency relationships

---

### 1.3 Skill Relationship Network

**Goal:** Manage many-to-many relationships between any two skills using a dedicated junction table.

**Linked Functional Requirements:**
- FR 5.1.5: Skill Relationship Network

**System Components:**

**Frontend:**
- Skill relationship graph view (optional)
- Skill relationship management interface (admin)

**Backend:**
- Skill relationship model
- Skill relationship repository
- Relationship service

**Database:**
- `skill_relationships` junction table:
  - `child_id`
  - `skill_id_2`
  - `relationship_type` (e.g., "related", "prerequisite", "similar")

**UI/UX Design:**
- **Has custom design:** No (standard relationship management)

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No (but could be enhanced with AI for relationship discovery)

**Algorithmic Logic:**
- **Has custom algorithm:** No (standard many-to-many relationship)

**Dependencies:**
- Feature 1.1 (Skill Hierarchy Management)

**Telemetry:**
- Log relationship operations
- Track relationship statistics

**Rollout Strategy:**
- MVP: Basic relationship storage
- Phase 2: Relationship graph visualization
- Phase 3: AI-powered relationship discovery

---

### 1.4 MGS Count Calculation & Caching

**Goal:** Calculate and cache total MGS count for L1 skills. Update cache when hierarchy changes.

**Linked Functional Requirements:**
- FR 5.1.1: Unified Skill Hierarchy (MGS count requirement)

**System Components:**

**Frontend:**
- Display cached MGS count in skill detail view

**Backend:**
- MGS count calculation service
- Cache update service
- Background job for cache refresh

**Database:**
- `skills.total_mgs_count` (cached field)
- Cache invalidation triggers

**UI/UX Design:**
- **Has custom design:** No

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  - Recursive traversal from L1 skill to all leaf nodes
  - Count only leaf nodes (skills that have no child skills referencing them as `parent_id`)
  - Cache result in `total_mgs_count` field
  - Invalidate and recalculate when:
    - New MGS added under L1
    - MGS removed
    - Hierarchy structure changes

**Dependencies:**
- Feature 1.1 (Skill Hierarchy Management)

**Telemetry:**
- Track cache hit/miss rates
- Monitor calculation performance
- Log cache invalidation events

**Rollout Strategy:**
- MVP: Basic MGS count calculation
- Phase 2: Caching optimization
- Phase 3: Background cache refresh jobs

---

## Feature 2: User Profile Management

### 2.1 Basic Profile Creation

**Goal:** Create the user profile with the basic data received from Directory MS before any extraction or verification happens.

**Linked Functional Requirements:**
- FR 5.3.1: Profile Initialization
- FR 5.3.3: Initial Status

**System Components:**

**Frontend:**
- Onboarding progress indicator (optional)
- Basic profile card showing data received from Directory

**Backend:**
- Directory event listener / webhook consumer
- Basic profile creation service
- Validation layer for incoming payloads
- User profile repository (CRUD)

**Database:**
- `user_profiles` table:
  - `user_id` (primary key, from Directory MS)
  - `user_name` (from Directory MS)
  - `company_id`
  - `employee_type`
  - `career_path_goal` (JSON)
  - `basic_info` (JSON: name, email, org unit, etc.)
  - `raw_external_data` (JSON blob that will be processed later)
  - `relevance_score` (numeric, initialized to 0)
  - `created_at`

**UI/UX Design:**
- **Has custom design:** No (service-level feature)
- **Description:** Background process triggered automatically on Directory MS events. Optional admin screen can show onboarding status.

**External API Integrations:**
- **Uses external API:** Yes (Directory MS)
- **Integration Points:**
  - Incoming webhook: `/api/integrations/directory/user-created`
  - Response: 202 Accepted once payload stored

**AI Integration:** No

**Algorithmic Logic:**
- Validate event signature and payload schema
- Upsert user profile (idempotent on `user_id`)
- Store raw external attachments (resume URLs, LinkedIn tokens, etc.) inside `raw_external_data`
- Initialize empty `user_competencies` rows with coverage=0, level=UNDEFINED
- Emit internal event `user.profile.basic_created` for downstream processors (triggers Feature 2.2)

**Dependencies:**
- Feature 8.1 (Directory MS Integration)

**Telemetry:**
- Count of profiles created per day
- Validation failure rate
- Time from Directory event to stored profile

**Rollout Strategy:**
- MVP: synchronous creation
- Phase 2: retry & dead-letter queue
- Phase 3: bulk bootstrap for historical users

---

### 2.2 AI Extraction of Raw Data

**Goal:** Receive raw data related to the user as input, run AI extraction to detect competencies and skills, and return JSON output with competencies and skills arrays.

**Linked Functional Requirements:**
- FR 5.3.2: AI-Based Skill Extraction & Normalization
- FR 5.3.10: Initial Raw Skill Storage

**System Components:**

**Backend:**
- Extraction orchestrator (queue worker)
- AI prompt builder (maps raw data into Gemini prompt)
- Gemini API client (Feature 9.3)
- Extraction result parser
- Rejection handler (if AI fails)

**Database:**
- No database operations in this step
- Output is JSON object with `competencies` array and `skills` array
- JSON output is passed to Feature 2.3 (Normalization) for processing and storage

**UI/UX Design:** No (service only)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Gemini 1.5 Flash / Feature 9.3 pipeline
- **Integration Points:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

**AI Integration:**
- **Uses AI:** Yes
- **AI Purpose:** Extract granular skills and competencies from raw user data (resumes, LinkedIn, GitHub, ORCID, Credly, etc.)
- **AI Model:** Gemini 1.5 Flash
- **Prompt Specification:** Stored in `/docs/prompts/skill_extraction_from_profile_prompt.txt`
- **Prompt Template:**
  ```
  You are an AI assistant that extracts professional SKILLS and COMPETENCIES from text.

  Your goal:
  - Read the provided raw text carefully.
  - Identify all SKILLS (technical, soft, or domain-specific).
  - Identify all COMPETENCIES (broader areas of ability or expertise).
  - Do not include company names, locations, or unrelated words.
  - Return the output strictly in valid JSON format with the exact structure below.
  - Do not include explanations or any text outside the JSON.

  Output format:
  {
    "competencies": [],
    "skills": []
  }

  Text:
  """{{raw_text}}"""
  ```
- **Expected Output:** JSON object with `competencies` array and `skills` array, containing extracted items from the raw text

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive raw data input:**
     - Receive raw data related to the user as input (from Feature 2.1 or external source)
     - Raw data includes: claimed skills, job roles, certifications, experiences, etc.
  
  2. **Chunk large documents:**
     - If `raw_external_data` is too large, split it into manageable chunks
     - Maintain chunk order for context
  
  3. **Build structured prompt:**
     - For each chunk, insert the chunk text into the prompt template:
       - `Text: """{raw_text}"""`
     - The prompt instructs Gemini to extract:
       - skills
       - competencies
       - evidence (text snippet supporting extraction)
     - Ensure output is strictly valid JSON
  
  4. **Call Gemini:**
     - Send the structured prompt to Gemini API
     - Parse the returned JSON to extract skills, competencies, and evidence
  
  5. **Return JSON output:**
     - Return structured JSON object with:
       - `competencies`: array of extracted competencies
       - `skills`: array of extracted skills
     - Include evidence and source metadata if available
     - No database operations in this step - output is passed to Feature 2.3 for processing
  
  6. **Emit event for normalization:**
     - Trigger `user.profile.raw_extracted` event with the JSON output
     - This signals downstream services (Feature 2.3) to normalize and process the extracted skills and competencies

**Dependencies:**
- Feature 9.3 (User Data Skill Extraction prompts)
- Feature 1 (taxonomy IDs used later)

**Telemetry:**
- AI latency per request
- Token usage/cost
- Extraction success vs failure

**Rollout Strategy:**
- MVP: sequential extraction per user
- Phase 2: parallel processing & retries
- Phase 3: caching for repeated sources

---

### 2.3 Normalization & Deduplication

**Goal:** Receive JSON output from Feature 2.2, normalize AI outputs, map them to canonical skills/competencies, remove duplicates, and return normalized JSON for profile creation.

**Linked Functional Requirements:**
- FR 5.2.2: AI Normalization
- FR 5.3.2: AI-Based Skill Extraction & Normalization

**System Components:**

**Backend:**
- Normalization engine (string similarity + embeddings)
- Synonym dictionary manager
- Taxonomy lookup service (against Feature 1 tables)
- Conflict resolver (handles duplicates)
- AI prompt builder for normalization

**Database:**
- No database operations in this step
- Output is normalized JSON object with mapped skills and competencies
- Normalized JSON output is passed to Feature 2.4 for profile creation and storage

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Gemini 1.5 Flash API
- **Integration Points:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

**AI Integration:**
- **Uses AI:** Yes
- **AI Purpose:** Normalize extracted skills and competencies, identify synonyms, merge duplicates, and map to internal taxonomy
- **AI Model:** Gemini 1.5 Flash
- **Prompt Specification:** Stored in `/docs/prompts/normalization_prompt.txt`
- **Prompt Template:**
  ```
  You are an AI assistant that normalizes and organizes competencies and skills.

  Input format:
  {
    "competencies": [...],
    "skills": [...]
  }

  Your tasks:

  1. **Normalize all names**:
     - Convert all text to lowercase.
     - Remove leading, trailing, and duplicate spaces.
     - Remove punctuation, emojis, and special symbols (keep only letters, digits, and spaces).
     - Replace dashes (-) and underscores (_) with single spaces.
     - Remove duplicate or repeated words (e.g., "data data analysis" → "data analysis").
     - Convert accented or non-ASCII characters into plain English (e.g., "résumé" → "resume").
     - Prefer full, clear forms of concepts (e.g., "ai" → "artificial intelligence").
     - Return only unique normalized strings.

  2. **Map skills to competencies**:
     - Determine which normalized skills logically belong under each normalized competency.
     - A skill may belong to multiple competencies if appropriate.
     - If a competency has no matching skills, return an empty list.
     - Do not invent new skills or competencies.

  Output format (JSON only):
  {
    "competencies": [...],       // list of normalized competencies
    "skills": [...],             // list of normalized skills
    "mapping": {                 // mapping of competency → skills
      "<competency>": ["skill1", "skill2"],
      ...
    }
  }

  Input:
  {{input_object}}
  ```
- **Expected Output:** Normalized JSON object with:
  - `competencies`: array of normalized competency names
  - `skills`: array of normalized skill names
  - `mapping`: object mapping each competency to its associated skills array

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive JSON input:**
     - Receive JSON output from Feature 2.2 with `competencies` and `skills` arrays
  
  2. **Normalize each item:**
     - For each skill/competency in the input:
       - Clean text (case normalization, punctuation handling)
       - Use AI (Gemini) to normalize names and map skills to competencies using the prompt template
       - Run synonym/embedding match against canonical taxonomy (Feature 1)
       - If match confidence ≥ threshold: map to taxonomy ID
       - If below threshold: flag as `needs_review` for manual/AI discovery (Feature 6.2)
  
  3. **Deduplicate:**
     - Remove duplicate skills/competencies by taxonomy ID
     - Merge synonyms into single canonical entries
  
  4. **Return normalized JSON:**
     - Return normalized JSON object with:
       - `competencies`: array of normalized competency names
       - `skills`: array of normalized skill names
       - `mapping`: object mapping each competency to its associated skills array
       - Items flagged for review (if any, from taxonomy matching)
     - No database operations - output is passed to Feature 2.4 for storage
  
  5. **Emit event for profile creation:**
     - Trigger `user.profile.normalized` event with normalized JSON
     - This signals Feature 2.4 to create the user competency profile

**Dependencies:**
- Feature 1 (taxonomy tables)
- Feature 6.2 (External discovery for unmatched competencies)

**Telemetry:**
- Match rate (% of items matched)
- Average normalization latency
- Count of `needs_review`

**Rollout Strategy:**
- MVP: deterministic string match
- Phase 2: embeddings + AI fallback
- Phase 3: active learning for synonym dictionary

---

### 2.4 Initial Competency Profile Delivery

**Goal:** Receive normalized JSON from Feature 2.3 (containing competencies array and skills array), look up taxonomy IDs, store competencies and skills in the database, then build the initial competency profile payload for Directory MS by matching user skills to competency requirements. All competencies must appear in the output (even with empty skills arrays), and all skills must have status="unverified".

**Linked Functional Requirements:**
- FR 5.3.8: Directory Update after Baseline (initial version)
- FR 5.3.9: Updated Profile Delivery (initial snapshot)

**System Components:**

**Frontend:**
- Initial profile preview (optional admin tool)

**Backend:**
- Initial profile builder function: `buildInitialProfileForDirectory(userId, normalizedData)`
- Taxonomy lookup service (maps normalized names to taxonomy IDs)
- User competency storage service (stores competencies in user_competencies table)
- User skill storage service (stores skills in user_skill table)
- Competency-skill mapper (queries competency_skills junction table)
- Skill matcher (compares user skills with competency requirements)
- Payload constructor (builds final JSON structure)
- Directory MS API client (sends initial payload)

**Database:**
- Read operations on:
  - `competencies` table (lookup competency IDs by normalized names)
  - `skills` table (lookup skill IDs by normalized names)
  - `user_competencies` table (fetch all rows for userId where level="undefined")
  - `user_skill` table (fetch all rows for userId where status="unverified")
  - `competency_skills` junction table (fetch required skillIds for each competency)
- Write operations on:
  - `user_competencies` table (insert extracted competencies with user_id, level="undefined", coverage=0)
  - `user_skill` table (insert extracted skills with user_id, status="unverified")
  - `initial_profile_audit` table (tracks deliveries)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Directory MS API
- **Integration Points:** `POST /api/directory/initial-profile`

**AI Integration:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  
  **Function: `buildInitialProfileForDirectory(userId, normalizedData)`**
  
  **Input:** Normalized JSON from Feature 2.3:
  ```json
  {
    "competencies": ["competency1", "competency2", ...],
    "skills": ["skill1", "skill2", ...],
    "mapping": {
      "competency1": ["skill1", "skill2"],
      ...
    }
  }
  ```
  
  1. **Look up taxonomy IDs for competencies:**
     - For each competency name in `normalizedData.competencies`:
       - Query `competencies` table to find matching competency by normalized name
       - Get `competency_id` from taxonomy
       - If not found: Log for review, skip (or flag for Feature 6.2)
     - Store mapping: `competencyName → competencyId`
  
  2. **Look up taxonomy IDs for skills:**
     - For each skill name in `normalizedData.skills`:
       - Query `skills` table to find matching skill by normalized name
       - Get `skill_id` from taxonomy
       - If not found: Log for review, skip (or flag for Feature 6.2)
     - Store mapping: `skillName → skillId`
  
  3. **Store competencies in user_competencies table:**
     - For each competency with valid taxonomy ID (from step 1):
       - Insert into `user_competencies` table:
         - `user_id`: userId
         - `competency_id`: competency_id from taxonomy
         - `level`: "undefined"
         - `coverage`: 0
         - `created_at`: Current timestamp
  
  4. **Store skills in user_skill table:**
     - For each skill with valid taxonomy ID (from step 2):
       - Insert into `user_skill` table:
         - `user_id`: userId
         - `skill_id`: skill_id from taxonomy (string)
         - `status`: "unverified"
         - `created_at`: Current timestamp
  
  5. **Fetch stored user competencies:**
     - Query `user_competencies` table for all rows where:
       - `user_id` = userId
       - `level` = "undefined"
       - `coverage` = 0
         - `created_at`: Current timestamp
     - Get all competency records for the user
  
  6. **Fetch stored user skills:**
     - Query `user_skill` table for all rows where:
       - `user_id` = userId
       - `status` = "unverified"
     - Extract all `skill_id` values from user's skills
     - Store as set/array for efficient matching: `userSkillIds = [skill_id1, skill_id2, ...]`
  
  7. **For each competency, fetch required skills and match:**
     - For each competency from step 5:
       - Get `competency_id` from the competency record
       - Query `competency_skills` junction table to get all required `skill_id` values for this competency
       - Store as: `requiredSkillIds = [skill_id1, skill_id2, ...]`
       - **Match user skills with required skills:**
         - Compare `userSkillIds` (from step 6) with `requiredSkillIds`
         - Find intersection: `matchingSkillIds = userSkillIds ∩ requiredSkillIds`
         - These are the user's skills that belong to this competency
  
  8. **Build skills array for each competency:**
     - For each `matchingSkillId`:
       - Query `user_skill` table to get the skill record
       - Create skill object:
         - `skillId`: skill_id (string)
         - `status`: "unverified"
     - If no matching skills found: Create empty skills array `[]`
     - **Important:** Competencies with no matching skills must still appear with empty skills array
  
  9. **Construct competency objects:**
     - For each competency:
       - Create competency object:
         - `competencyId`: competency_id (string or number)
         - `level`: "undefined"
         - `coverage`: 0
         - `skills`: array of skill objects (from step 8) or empty array `[]`
  
  10. **Build final payload:**
     - Construct JSON object:
       ```json
       {
         "userId": "string",
         "relevanceScore": 0,
         "competencies": [
           {
             "competencyId": "string",
             "level": "undefined",
             "coverage": 0,
             "skills": [
               {
                 "skillId": "string",
                 "status": "unverified"
               }
             ]
           }
         ]
       }
       ```
     - Include all competencies (even those with empty skills arrays)
     - No extra fields beyond what is described
  
  11. **Send payload to Directory MS:**
     - Send the constructed payload to Directory MS via Feature 8.1
     - Record delivery status + timestamps in `initial_profile_audit` table
  
  12. **Emit event:**
     - Emit `user.profile.initial_delivered` event (triggers Feature 3.1 to create baseline exam request)
  
  **Implementation Notes:**
  - Function must be clean and modular
  - Use efficient data structures (sets/maps) for skill matching
  - Handle edge cases: no competencies, no skills, no matches
  - Ensure all competencies appear in output (even with empty skills)
  - Return only the specified fields (no extra metadata)

**Dependencies:**
- Feature 2.3 (Normalization) - receives normalized JSON as input
- Feature 8.1 (Directory integration)
- Feature 1 (Taxonomy) - for competency and skill ID lookups
- Database tables: `competencies`, `skills`, `user_competencies`, `user_skill`, `competency_skills`

**Telemetry:**
- Delivery success/failure rate
- Time from normalization to delivery
- Payload size statistics

**Rollout Strategy:**
- MVP: synchronous send
- Phase 2: queue + retry
- Phase 3: idempotency keys & auditing dashboard

---

### 2.5 Profile Updates

**Goal:** Update user profiles after skill verification, recalculate proficiency levels, and send updated profiles to Directory MS.

**Linked Functional Requirements:**
- FR 5.3.9: Updated Profile Delivery
- FR 5.3.11: Post-Baseline MGS Storage

**System Components:**

**Frontend:**
- Profile update notifications (optional)
- Real-time profile refresh

**Backend:**
- Profile update service
- Proficiency calculation service (Feature 4)
- Profile formatting service
- API client for Directory MS communication

**Database:**
- Updates to `user_competencies` table:
  - Update `verified_skills` JSON with new verified MGS
  - Update `coverage` percentage
  - Update `level` (if verification passed)
  - Update `updated_at` timestamp

**UI/UX Design:**
- **Has custom design:** No (background process)

**External API Integrations:**
- **Uses external API:** No (sends data to Directory MS)
- **API Name:** Skills Engine → Directory MS API
- **Integration Points:** 
  - POST /api/directory/update-profile (sends update profile)
  - For each competency, includes:
    - Proficiency level (BEGINNER → EXPERT)
    - L1 skills related to that competency that the user owns
  - Also includes: relevance score for Career Path Goal

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  - Triggered after skill verification (Feature 3)
  - Recalculate proficiency levels (Feature 4)
  - Format profile data for each competency:
    - Get proficiency level (BEGINNER → EXPERT) from user_competencies table
    - Find all L1 skills related to this competency (from competency_skills junction table)
    - Read `verified_skills` JSON from user_competencies table
    - Parse the JSON field using `JSON.parse()` to get the array
    - Filter to only L1 skills that the user owns (check if skill_id exists in parsed verified_skills array where verified=true)
    - Include these L1 skills with the competency
  - Get Relevance Score for Career Path Goal:
    - If Relevance Score was recalculated (e.g., after exam_status=PASS): use the newly calculated value from `user_profiles.relevance_score`
    - If Relevance Score was not recalculated (e.g., after exam_status=FAIL): use the previous value from `user_profiles.relevance_score`
  - Structure final profile:
    - Array of competencies, each with:
      - Competency ID and name
      - Proficiency level
      - Array of L1 skills (that user owns) related to this competency
    - Relevance Score for Career Path Goal (always included in the profile)
  - Send formatted profile to Directory MS via API
  - Handle retry logic if Directory MS is unavailable

**Dependencies:**
- Feature 3 (Skill Verification) - triggers updates
- Feature 4 (Proficiency & Level Calculation) - calculates levels
- Feature 8.1 (Directory MS Integration) - API endpoint

**Telemetry:**
- Log profile update events
- Track update frequency
- Monitor Directory MS API call success/failure
- Track profile update performance

**Rollout Strategy:**
- MVP: Basic profile updates after verification
- Phase 2: Optimize update batching
- Phase 3: Add real-time update notifications

---

### 2.6 Profile Retrieval

**Goal:** Retrieve user profiles for display in frontend and provide access to Learning Analytics MS and other services.

**Linked Functional Requirements:**
- FR 5.5.1: User/Team Data Retrieval
- FR 5.5.2: Skills Profile Data Provision

**System Components:**

**Frontend:**
- User profile display component
- Skills profile page
- Profile detail view
- Gap analysis visualization

**Backend:**
- Profile retrieval service
- Profile formatting service
- API endpoints for profile access
- Access control middleware

**Database:**
- Read operations on:
  - `user_profiles`
  - `user_competencies`
  - `user_skills`
  - `competencies`
  - `skills`
  - `competency_skills` (junction table for competency-to-skill relationships)
  - `skill_relationships` (junction table for skill-to-skill relationships)

**UI/UX Design:**
- **Has custom design:** Yes
- **Description:** 
  - User profile dashboard showing:
    - Verified competencies with proficiency levels
    - Skill gaps (from gap analysis)
    - Relevance score for career path
    - Progress visualization
  - Responsive design for mobile/desktop
  - Clear visual hierarchy

**External API Integrations:**
- **Uses external API:** No (provides API for others)

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  - Retrieve user profile data from database
  - Join with taxonomy data (skills, competencies)
  - Format for display:
    - Group by competency
    - Include proficiency levels
    - Include gap analysis results (if available)
    - Include L1 skills owned
    - Include relevance score
  - Apply access control (users can only see their own profile)
  - Cache frequently accessed profiles

**Dependencies:**
- Feature 1 (Taxonomy Management) - for skill/competency data
- Feature 4 (Proficiency & Level Calculation) - for proficiency levels
- Feature 5 (Gap Analysis) - for gap data

**Telemetry:**
- Track profile retrieval frequency
- Monitor API response times
- Track cache hit rates
- Log access patterns

**Rollout Strategy:**
- MVP: Basic profile retrieval and display
- Phase 2: Add caching and performance optimization
- Phase 3: Add advanced filtering and search

---

## Feature 3: Skill Verification

### 3.1 Baseline Exam Request

**Goal:** Send competency map (competency → skills) to Assessment MS to create Primary Assignment (Baseline) test after initial profile creation. The map allows Assessment to group questions by competency and calculate scores per competency.

**Linked Functional Requirements:**
- FR 5.3.4: Primary Assignment Verification Request

**System Components:**

**Backend:**
- Baseline exam request service
- MGS aggregation service
- Assessment MS API client (send request)

**Database:**
- Read operations on:
  - `user_competencies` (to get user's competencies)
  - `competencies` (to get competency details)
  - `competency_skills` (to get L1 skills)
  - `competency_competencies` (to get child competencies)
  - `skills` (to traverse hierarchy and get MGS)

**UI/UX Design:**
- **Has custom design:** No (background process)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Assessment MS API
- **Integration Points:**
  - POST /api/assessment/create-baseline-exam (send competency map for Primary Assignment)
  - Request payload includes: user_id, exam_type, competency_map (competency_id → skills array)

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Trigger baseline exam request:**
     - Triggered after initial competency profile delivery (Feature 2.4)
     - Event: `user.profile.initial_delivered`
  
  2. **Aggregate required MGS per competency:**
     - For each competency in user's profile:
       - Aggregate all required MGS from:
         - Direct L1 skills linked to competency (via `competency_skills`)
         - Child competencies (via `competency_competencies`)
       - Traverse skill hierarchy to get all MGS (leaf nodes)
       - Store MGS list per competency (maintain competency → MGS mapping)
     - Build competency map structure:
       - Key: competency_id
       - Value: array of MGS objects with { skill_id, skill_name }
  
  3. **Send baseline exam request to Assessment MS:**
     - Prepare request payload:
       - `user_id`
       - `exam_type`: "baseline" or "primary_assignment"
       - `competency_map`: object mapping each competency to its required MGS
         - Structure: `{ "<competency_id>": [ { skill_id, skill_name }, ... ], ... }`
         - Each skill includes:
           - `skill_id`: internal reference for storing results
           - `skill_name`: human-readable name for UI and questions
     - Purpose of competency mapping:
       - Allows Assessment to group questions by competency
       - Enables better reporting and calculation of scores per competency
       - Provides Assessment with exact MGS to generate questions for
     - Call Assessment MS API: `POST /api/assessment/create-baseline-exam`
     - Include competency map with all aggregated MGS
     - Wait for confirmation from Assessment MS
     - Log request status (sent, confirmed, failed)

**Dependencies:**
- Feature 2.4 (Initial Competency Profile Delivery) - triggers this feature
- Feature 1.2 (Competency Structure Management) - for MGS aggregation
- Feature 8.2 (Assessment MS Integration) - API endpoint

**Telemetry:**
- Track baseline exam request events
- Monitor MGS aggregation performance
- Track API call success/failure rates
- Log request payload sizes

**Rollout Strategy:**
- MVP: Basic baseline exam request
- Phase 2: Add retry logic for failed requests
- Phase 3: Add request queuing and batch processing

---

### 3.2 Baseline Exam Verification

**Goal:** Handle Primary Assignment (Baseline) test results from Assessment MS, verify MGS that passed, update user profile, and trigger gap analysis.

**Linked Functional Requirements:**
- FR 5.3.5: Granular Verification
- FR 5.3.8: Directory Update after Baseline

**System Components:**

**Backend:**
- Baseline exam handler service
- MGS verification service
- Assessment MS API client (receive results)
- Event handler for Assessment MS exam results

**Database:**
- Updates to `user_competencies.verified_skills` JSON:
  - Update MGS with `verified=true` for passed skills
  - Add `verification_date` for each verified MGS
  - Store skill_id, skill_name, verified status
- Updates to `user_competencies` table:
  - Update `coverage` percentage (Feature 4.1)
  - Update `level` (Feature 4.2)
  - Update `updated_at` timestamp

**UI/UX Design:**
- **Has custom design:** No (background process)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Assessment MS API
- **Integration Points:**
  - POST /api/assessment/baseline-exam-results (endpoint in Skills Engine that receives results from Assessment MS)
  - Assessment MS sends the test results to this endpoint when baseline exam is completed
  - Results payload structure:
    - `exam_type` (string: "baseline")
    - `exam_status` (string: "pass" or "fail")
    - `final_grade` (numeric: score or percentage, e.g., 78)
    - `user_id` (string)
    - `user_name` (string)
    - `skills` (array): list of evaluated skills, each containing:
      - `skill_id` (integer)
      - `skill_name` (string)
      - `verified` (boolean: true/false)
      - `competency_name` (string)

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive baseline exam results:**
     - Receive POST request from Assessment MS when exam is completed
     - Parse exam results payload:
       - `exam_type`: "baseline"
       - `exam_status`: "pass" or "fail"
       - `final_grade`: numeric score or percentage (e.g., 78)
       - `user_id`: user identifier
       - `user_name`: user name
       - `skills`: array of evaluated skills, each containing:
         - `skill_id`: internal skill reference
         - `skill_name`: human-readable skill name
         - `verified`: boolean (true/false)
         - `competency_name`: name of the competency this skill belongs to
  
  2. **Update verified skills:**
     - For each skill in the `skills` array:
       - Identify the competency that this skill relates to (using `competency_name` from the skill object)
       - Locate the corresponding `user_competencies` record for this user and competency
       - Parse the `verified_skills` JSON field using `JSON.parse()` to get the current array
       - If `verified = true`:
         - Check if skill_id already exists in the parsed array
         - If exists: update the skill object with verified=true and verification_date (current timestamp)
         - If not exists: append new skill object with skill_id, skill_name, verified=true, verification_date (current timestamp)
         - Stringify the updated array back to JSON using `JSON.stringify()` and save to database
       - If `verified = false`:
         - Check if skill_id exists in the parsed array
         - If exists: update the skill object with verified=false and clear verification_date
         - If not exists: append new skill object with verified=false
         - Stringify the updated array back to JSON using `JSON.stringify()` and save to database
  
  3. **Trigger downstream processes:**
     - Trigger proficiency recalculation (Feature 4)
     - Trigger gap analysis (Feature 5) - Broad Gap Analysis for baseline
     - Calculate Relevance Score (Feature 4.4)
     - Send updated profile to Directory MS (Feature 2.5)
     - Send gap analysis results to Learner AI (Feature 5)

**Dependencies:**
- Feature 3.1 (Baseline Exam Request) - sends request, triggers this feature when results arrive
- Feature 4 (Proficiency & Level Calculation) - recalculates levels
- Feature 5 (Gap Analysis) - performs broad gap analysis
- Feature 2.5 (Profile Updates) - sends profile to Directory MS
- Feature 8.2 (Assessment MS Integration) - API endpoints

**Telemetry:**
- Log baseline exam events
- Track verification success rates
- Monitor MGS verification counts
- Track time from exam completion to profile update

**Rollout Strategy:**
- MVP: Basic baseline exam handling and MGS verification
- Phase 2: Optimize verification batch processing
- Phase 3: Add retry logic for failed verifications

---

### 3.3 Post-Course Exam Verification

**Goal:** Handle post-course exam results from Assessment MS, update verified MGS, and trigger conditional gap analysis based on exam status.

**Linked Functional Requirements:**
- FR 5.3.6: Post-course Exam Handling

**System Components:**

**Backend:**
- Post-course exam handler service
- MGS verification service (upsert logic)
- Assessment MS API client (receive results)
- Exam status tracking service

**Database:**
- Updates to `user_competencies.verified_skills` JSON:
  - Upsert MGS: update if exists, insert if new
  - Set `verified=true` for passed MGS
  - Add `verification_date`
  - Keep `verified=false` for failed MGS
- Updates to `user_competencies` table:
  - Update `coverage` percentage (always)
  - Update `level` (only if exam_status=PASS)
  - Update `updated_at` timestamp

**UI/UX Design:**
- **Has custom design:** No (background process)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Assessment MS API
- **Integration Points:**
  - POST /api/assessment/post-course-exam-results (endpoint in Skills Engine that receives results from Assessment MS)
  - Assessment MS sends the test results to this endpoint when post-course exam is completed
  - Results payload structure:
    - `exam_type` (string: "post-course")
    - `exam_status` (string: "pass" or "fail")
    - `final_grade` (numeric: score or percentage, e.g., 78)
    - `user_id` (string)
    - `user_name` (string)
    - `course_name` (string)
    - `skills` (array): list of evaluated skills that passed (verified=true only), each containing:
      - `skill_id` (integer)
      - `skill_name` (string)
      - `verified` (boolean: always true)

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive post-course exam results:**
     - Receive POST request from Assessment MS when exam is completed
     - Parse exam results payload:
       - `exam_type`: "post-course"
       - `exam_status`: "pass" or "fail"
       - `final_grade`: numeric score or percentage (e.g., 78)
       - `user_id`: user identifier
       - `user_name`: user name
       - `course_name`: name of the course
       - `skills`: array of evaluated skills that passed (verified=true only), each containing:
         - `skill_id`: internal skill reference
         - `skill_name`: human-readable skill name
         - `verified`: boolean (always true)
  
  2. **Update verified skills:**
     - Access the `user_competencies` table and search for records matching the `user_id`
     - For the found user records, identify which competency matches the `course_name` (check if competency name or description relates to the course)
     - If a matching competency is found:
       - Parse the `verified_skills` JSON field using `JSON.parse()` to get the current array
       - For each skill in the `skills` array (all skills in the array are verified=true):
         - Check if skill_id already exists in the parsed array
         - If exists: update the skill object with verified=true and verification_date (current timestamp)
         - If not exists: append new skill object with skill_id, skill_name, verified=true, verification_date (current timestamp)
       - Stringify the updated array back to JSON using `JSON.stringify()` and save to database
     - If no matching competency is found:
       - Create a new `user_competencies` record for this user
       - Set the competency based on the course (may need to query taxonomy or create new competency)
       - Initialize `verified_skills` JSON as empty array `[]`
       - Parse the empty array (or create new array) using `JSON.parse()` or initialize as empty array
       - For each skill in the `skills` array (all skills in the array are verified=true):
         - Append skill object with skill_id, skill_name, verified=true, verification_date (current timestamp) to the array
       - Stringify the array back to JSON using `JSON.stringify()` and save to database
  
  3. **Recalculate proficiency and relevance:**
     - For the specific competency that matches the course:
       - Always recalculate coverage percentage (Feature 4.1) for this competency
       - Always update proficiency level (Feature 4.2) for this competency:
         - Calculate and update level based on new coverage percentage
         - This happens for both PASS and FAIL exam status
     - Conditionally calculate Relevance Score:
       - If exam_status=PASS: calculate Relevance Score (Feature 4.4) and update `user_profiles.relevance_score`
       - If exam_status=FAIL: skip Relevance Score calculation (keep previous relevance_score value)
  
  4. **Trigger conditional gap analysis:**
     - If exam_status=PASS: Broad Gap Analysis (full career path)
     - If exam_status=FAIL: Narrow Gap Analysis (course-specific competency)
  
  5. **Send updates to downstream services:**
     - **If exam_status=PASS:**
       - Send updated competency profile to Directory MS (Feature 2.5) including:
         - Updated proficiency level for the competency
         - Updated L1 skills for the competency
         - **New relevance_score value** (recalculated after course completion)
     - **If exam_status=FAIL:**
       - Send updated competency profile to Directory MS (Feature 2.5) including:
         - Updated proficiency level for the competency
         - Updated L1 skills for the competency
         - Previous relevance_score value (not recalculated)
     - Send gap analysis results to Learner AI (Feature 5)

**Dependencies:**
- Feature 4 (Proficiency & Level Calculation) - recalculates levels conditionally
- Feature 5 (Gap Analysis) - performs conditional gap analysis
- Feature 2.5 (Profile Updates) - sends profile to Directory MS
- Feature 8.2 (Assessment MS Integration) - API endpoints

**Telemetry:**
- Log post-course exam events
- Track verification success rates by course
- Monitor multiple exam attempts
- Track conditional logic execution (Pass vs Fail paths)

**Rollout Strategy:**
- MVP: Basic post-course exam handling
- Phase 2: Support multiple exam attempts tracking
- Phase 3: Add exam history and retry analytics

---

### 3.4 Verification Status Management

**Goal:** Track and update verification status for MGS in user_competencies JSON, ensuring accurate verification state management.

**Linked Functional Requirements:**
- FR 5.3.5: Granular Verification
- FR 5.3.7: User Skill Storage Format

**System Components:**

**Frontend:**
- Verification status display in user profile
- Verification history view (optional)

**Backend:**
- Verification status service
- JSON update service for verified_skills
- Verification date tracking
- Status validation service

**Database:**
- `user_competencies.verified_skills` JSON structure:
  - Array of objects, each with:
    - `skill_id` (integer)
    - `skill_name` (string)
    - `verified` (boolean: true/false)
    - `verification_date` (timestamp, nullable - only if verified=true)

**UI/UX Design:**
- **Has custom design:** No (standard status display)

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  - Maintain verified_skills JSON array in user_competencies table
  - **All operations on verified_skills JSON:**
    - Always parse the JSON field using `JSON.parse()` before reading or modifying
    - Always stringify the array back to JSON using `JSON.stringify()` before saving to database
  - Upsert logic for MGS verification:
    - Parse `verified_skills` JSON using `JSON.parse()` to get the current array
    - Check if skill_id exists in the parsed array
    - If exists: update verified status and verification_date in the array
    - If not exists: append new MGS object to the array
    - Stringify the updated array using `JSON.stringify()` and save to database
  - Verification date management:
    - Parse `verified_skills` JSON using `JSON.parse()`
    - Set verification_date when verified changes from false to true
    - Keep verification_date when verified=true
    - Clear verification_date when verified=false (optional)
    - Stringify the updated array using `JSON.stringify()` and save to database
  - Status validation:
    - Parse `verified_skills` JSON using `JSON.parse()` before validation
    - Ensure skill_id matches existing skills in taxonomy
    - Validate skill_name consistency
    - Ensure verified=true only if verification_date exists
  - Query operations:
    - Parse `verified_skills` JSON using `JSON.parse()` before querying
    - Get all verified MGS for a competency (filter array where verified=true)
    - Get verification date for specific MGS (find by skill_id in parsed array)
    - Count verified vs unverified MGS (filter and count in parsed array)

**Dependencies:**
- Feature 1.1 (Skill Hierarchy Management) - for skill_id validation
- Feature 3.2 (Baseline Exam Verification) - updates verification status
- Feature 3.3 (Post-Course Exam Verification) - updates verification status

**Telemetry:**
- Track verification status changes
- Monitor JSON update performance
- Log verification date accuracy
- Track verification status query patterns

**Rollout Strategy:**
- MVP: Basic verification status tracking
- Phase 2: Optimize JSON update operations
- Phase 3: Add verification history and audit trail

---

## Feature 4: Proficiency & Level Calculation

### 4.1 Coverage Percentage Calculation

**Goal:** Calculate coverage percentage for each competency based on the ratio of verified MGS to total required MGS.

**Linked Functional Requirements:**
- FR 5.4.2: Competency Level Calculation (MGS Count)

**System Components:**

**Frontend:**
- Coverage percentage display in user profile (optional)

**Backend:**
- Coverage calculation service
- MGS counting service
- Competency aggregation service

**Database:**
- Updates to `user_competencies` table:
  - `coverage` (percentage: 0-100)
  - Read from `verified_skills` JSON to count verified MGS
  - Read from taxonomy to get total required MGS

**UI/UX Design:**
- **Has custom design:** No (calculated value displayed)

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Get verified MGS count:**
     - Read `verified_skills` JSON from `user_competencies` table
     - Parse the JSON field using `JSON.parse()` to get the array
     - Count MGS where `verified = true` in the parsed array
  
  2. **Get total required MGS:**
     - For each competency, aggregate all required MGS from:
       - Direct L1 skills linked to competency (via `competency_skills`)
       - Child competencies (via `competency_competencies`)
     - Traverse skill hierarchy to get all MGS (leaf nodes)
     - Count total unique MGS required
  
  3. **Calculate coverage percentage:**
     - Formula: `Coverage Percentage = (Verified MGS / Total Required MGS) × 100`
     - Handle edge cases:
       - If Total Required MGS = 0: set coverage = 0
       - Round to 2 decimal places
  
  4. **Update database:**
     - Update `user_competencies.coverage` field
     - Store calculated percentage

**Dependencies:**
- Feature 1.2 (Competency Structure Management) - for MGS aggregation
- Feature 3 (Skill Verification) - provides verified MGS count

**Telemetry:**
- Track coverage calculation performance
- Monitor coverage distribution across users
- Log calculation errors

**Rollout Strategy:**
- MVP: Basic coverage calculation
- Phase 2: Optimize MGS aggregation performance
- Phase 3: Add caching for frequently calculated competencies

---

### 4.2 Proficiency Level Mapping

**Goal:** Map coverage percentage to descriptive proficiency levels (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT).

**Linked Functional Requirements:**
- FR 5.4.3: Proficiency Mapping

**System Components:**

**Frontend:**
- Proficiency level badges/indicators in user profile
- Level visualization

**Backend:**
- Proficiency level mapping service
- Level calculation service

**Database:**
- Updates to `user_competencies` table for the specific competency the user owns:
  - `level` (enum: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT, UNDEFINED)

**UI/UX Design:**
- **Has custom design:** Yes
- **Description:** Visual indicators (badges, progress bars) showing proficiency levels with color coding (e.g., BEGINNER=red, EXPERT=green)

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Get coverage percentage:**
     - Read `coverage` from `user_competencies` table for the specific competency (calculated by Feature 4.1)
  
  2. **Map to proficiency level:**
     - **BEGINNER**: 0–30%
     - **INTERMEDIATE**: 31–65%
     - **ADVANCED**: 66–85%
     - **EXPERT**: 86–100%
     - **UNDEFINED**: If coverage not calculated yet
  
  3. **Update database:**
     - Update `user_competencies.level` field for the specific competency the user owns
     - Store mapped proficiency level for this competency

**Dependencies:**
- Feature 4.1 (Coverage Percentage Calculation) - provides coverage value

**Telemetry:**
- Track level distribution across users
- Monitor level changes over time
- Log mapping operations

**Rollout Strategy:**
- MVP: Basic level mapping
- Phase 2: Add level transition tracking
- Phase 3: Add level-based recommendations

---

### 4.3 Level Update Logic

**Goal:** Update proficiency levels after each verification event (both PASS and FAIL), recalculating based on the updated coverage percentage.

**Linked Functional Requirements:**
- FR 5.4.4: Continuous Profile Update

**System Components:**

**Frontend:**
- Level update notifications (optional)

**Backend:**
- Level update service
- Level calculation service (always updates after coverage recalculation)
- Exam status tracking

**Database:**
- Updates to `user_competencies` table:
  - `level` (always updated after coverage recalculation, for both PASS and FAIL)
  - `coverage` (always updated)

**UI/UX Design:**
- **Has custom design:** No (background process)

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive verification event:**
     - Triggered after exam results (Feature 3.2 or 3.3)
     - Receive exam_status (PASS or FAIL)
  
  2. **Always recalculate coverage:**
     - Recalculate coverage percentage (Feature 4.1)
     - Update `user_competencies.coverage` field
     - This happens regardless of exam status
  
  3. **Always update level:**
     - Map coverage to proficiency level (Feature 4.2)
     - Update `user_competencies.level` field
     - This happens for both PASS and FAIL exam status
     - The level is recalculated based on the updated coverage percentage
  
  4. **Handle edge cases:**
     - If no previous level exists: calculate and set level based on coverage percentage
     - If coverage is 0: set level to UNDEFINED or BEGINNER (0%)

**Dependencies:**
- Feature 3 (Skill Verification) - provides exam status
- Feature 4.1 (Coverage Percentage Calculation) - recalculates coverage
- Feature 4.2 (Proficiency Level Mapping) - maps to level

**Telemetry:**
- Track level update frequency
- Monitor level changes for both PASS and FAIL exam status
- Log level recalculation events

**Rollout Strategy:**
- MVP: Basic level updates after each verification event
- Phase 2: Add level change history
- Phase 3: Add predictive level updates

---

### 4.4 Relevance Score Calculation

**Goal:** Calculate Relevance Score for user's Career Path Goal using the same formula as competency coverage percentage.

**Linked Functional Requirements:**
- FR 5.4.5: Relevance Score Calculation

**System Components:**

**Frontend:**
- Relevance score display in user profile
- Career path alignment visualization

**Backend:**
- Relevance score calculation service
- Career path MGS aggregation service
- Profile update service

**Database:**
- Updates to `user_profiles` table:
  - `relevance_score` (percentage: 0-100)

**UI/UX Design:**
- **Has custom design:** Yes
- **Description:** Visual indicator showing alignment with career path goal (percentage, progress bar, color-coded)

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Get Career Path Goal:**
     - Read `career_path` from `user_profiles` table
     - Extract target competencies/skills from career path goal
  
  2. **Aggregate required MGS for Career Path:**
     - For all competencies in career path goal:
       - Aggregate all required MGS (same as Feature 4.1)
       - Get total unique MGS required for career path
  
  3. **Count verified MGS for Career Path:**
     - For all competencies in career path:
       - Read `verified_skills` JSON from `user_competencies` table
       - Parse the JSON field using `JSON.parse()` to get the array
       - Count verified MGS (where verified=true) from the parsed array
       - Sum all verified MGS across career path competencies
  
  4. **Calculate Relevance Score:**
     - Formula: `Relevance Score = (Verified MGS for Career Path / Total Required MGS for Career Path) × 100`
     - Same formula as Coverage Percentage (Feature 4.1)
     - Handle edge cases:
       - If Total Required MGS = 0: set relevance_score = 0
       - Round to 2 decimal places
  
  5. **Update database:**
     - Update `user_profiles.relevance_score` field
     - Store calculated relevance score
  
  6. **Conditional calculation:**
     - Calculate only if exam_status = PASS (for post-course exams)
     - Always calculate for baseline exam

**Dependencies:**
- Feature 2.1 (Basic Profile Creation) - provides career_path
- Feature 4.1 (Coverage Percentage Calculation) - uses same formula
- Feature 3 (Skill Verification) - provides verified MGS

**Telemetry:**
- Track relevance score distribution
- Monitor relevance score changes over time
- Log calculation performance

**Rollout Strategy:**
- MVP: Basic relevance score calculation
- Phase 2: Add career path recommendations based on score
- Phase 3: Add predictive relevance scoring

---

## Feature 5: Gap Analysis

**Goal:** Perform gap analysis (broad and narrow), calculate missing MGS, automatically trigger after exam results, and report results to Learner AI and frontend.

**Linked Functional Requirements:**
- FR 5.5.2: Skills Profile Data Provision
- FR 5.5.3: Automated Trigger
- FR 5.5.4: Conditional Gap Analysis Logic
- FR 5.5.5: Definitive Gap Calculation
- FR 5.5.6: Gap Analysis Data Sent

**System Components:**

**Frontend:**
- Gap analysis visualization component
- Missing skills display
- Gap analysis dashboard
- Skills profile page with gap information

**Backend:**
- Gap analysis service
- Broad gap analysis engine
- Narrow gap analysis engine
- MGS comparison service
- Gap calculation algorithm
- Learner AI API client
- Gap analysis trigger service

**Database:**
- Read operations on:
  - `user_competencies` (to get verified MGS)
  - `user_profiles` (to get career path goal)
  - `competencies` (to get required MGS)
  - `competency_skills` (to get competency-to-skill mappings)
  - `competency_competencies` (to get child competencies)
  - `skills` (to traverse hierarchy and get all required MGS)

**UI/UX Design:**
- **Has custom design:** Yes
- **Description:**
  - Visual representation of skill gaps
  - Missing skills grouped by competency
  - Progress indicators showing gap size
  - Color-coded gaps (e.g., critical gaps in red)
  - Interactive skill gap exploration
  - Career path alignment visualization

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Learner AI MS API
- **Integration Points:**
  - POST /api/learner-ai/gap-analysis-results (send gap analysis results to Learner AI MS)
  - Payload structure:
    - `user_id` (string)
    - `user_name` (string)
    - `company_id` (string)
    - `course_name` (string, nullable - only for narrow analysis)
    - `missing_mgs` (object/map): map of missing MGS grouped by competency, where:
      - Key: `competency_name` (string)
      - Value: array of skills, each containing:
        - `skill_id` (string)
        - `skill_name` (string)
    - `exam_status` (string: "pass" or "fail", only for post-course exams)
    - `analysis_type` (string: "broad" or "narrow")

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Trigger gap analysis:**
     - Automatically triggered after exam results are received (Feature 3.2 or 3.3)
     - Determine analysis type based on exam type and status:
       - **Baseline Exam** → Broad Gap Analysis (full career path)
       - **Post-course PASS** → Broad Gap Analysis (full career path)
       - **Post-course FAIL** → Narrow Gap Analysis (course-specific competency)
  
  2. **Broad Gap Analysis (Career Path Goal):**
     - Get user's career path goal from `user_profiles` table
     - Identify all competencies required for the career path goal
     - For each competency in career path:
       - Aggregate all required MGS:
         - Get L1 skills linked to competency (via `competency_skills`)
         - Get child competencies (via `competency_competencies`)
         - Traverse skill hierarchy to get all MGS (leaf nodes)
         - Union all MGS sets
       - Get verified MGS for this competency:
         - Read `verified_skills` JSON from `user_competencies` table for this competency
         - Parse using `JSON.parse()` to get the array
         - Filter where `verified = true`
       - Calculate missing MGS: Required MGS Set - Verified MGS Set
     - Aggregate all missing MGS across all career path competencies
     - Structure result as MAP: `{ competency_name: [skills_array], ... }` where each skill in the array contains `{ skill_id, skill_name }`
  
  3. **Narrow Gap Analysis (Course-Specific Competency):**
     - Identify the competency that matches the course (from Feature 3.3)
     - Get required MGS for this competency:
       - Get L1 skills linked to competency (via `competency_skills`)
       - Get child competencies (via `competency_competencies`)
       - Traverse skill hierarchy to get all MGS (leaf nodes)
       - Union all MGS sets
     - Get verified MGS for this competency:
       - Read `verified_skills` JSON from `user_competencies` table for this competency
       - Parse using `JSON.parse()` to get the array
       - Filter where `verified = true`
     - Calculate missing MGS: Required MGS Set - Verified MGS Set
     - Structure result as MAP: `{ competency_name: [skills_array] }` where each skill in the array contains `{ skill_id, skill_name }`
  
  4. **Format gap analysis results:**
     - Structure missing MGS as a map (object) where:
       - Key: `competency_name` (string)
       - Value: array of skills, each containing:
         - `skill_id`: internal skill reference
         - `skill_name`: human-readable skill name
     - Group by competency name for better organization
     - Include metadata:
       - Analysis type (broad/narrow)
       - Exam status (if applicable)
       - Timestamp
  
  5. **Send results to Learner AI MS:**
     - Format payload according to API specification
     - Send POST request to Learner AI MS endpoint: `POST /api/learner-ai/gap-analysis-results`
     - Include:
       - `user_id`: user identifier
       - `user_name`: user name (from `user_profiles` table)
       - `company_id`: company identifier (from `user_profiles` table)
       - `course_name`: course name (only for narrow analysis, null for broad analysis)
       - `missing_mgs`: map (object) where key is `competency_name` and value is array of skills with `{ skill_id, skill_name }`
       - `exam_status`: "pass" or "fail" (only for post-course exams)
       - `analysis_type`: "broad" or "narrow"
     - Handle retry logic if Learner AI MS is unavailable
     - Log delivery status
  
  6. **Provide gap analysis to frontend:**
     - Provide API endpoint for frontend to retrieve gap analysis
     - Format results for frontend display (grouped by competency, sorted by priority)
     - Calculate gap analysis on-demand when requested (no persistent storage)

**Dependencies:**
- Feature 3.2 (Baseline Exam Verification) - triggers broad gap analysis
- Feature 3.3 (Post-Course Exam Verification) - triggers conditional gap analysis
- Feature 4.1 (Coverage Percentage Calculation) - uses verified MGS count
- Feature 1.2 (Competency Structure Management) - for MGS aggregation
- Feature 8.5 (Learner AI MS Integration) - API endpoint

**Telemetry:**
- Track gap analysis trigger events
- Monitor gap analysis calculation performance
- Track gap size statistics (average missing MGS per user)
- Log Learner AI MS API call success/failure rates
- Monitor gap analysis frequency per user

**Rollout Strategy:**
- MVP: Basic gap analysis calculation and reporting
- Phase 2: Add gap analysis caching and optimization
- Phase 3: Add gap prioritization and recommendations

---

## Feature 6: Skill Discovery

### 6.1 Internal Skill Lookup

**Goal:** Skills Engine receives requests from external microservices (Content Studio, Course Builder, Learner AI). These microservices send the name of a competency and want to know the skills at the last level (MGS - Most Granular Skills) that relate to the requested competency. Skills Engine performs internal lookup in the database and returns MGS. For Course Builder, if competency not found, the system calls Feature 6.2 (External Competency Discovery) to discover and store the competency, then returns the MGS.

**Linked Functional Requirements:**
- FR 5.6.1: Granular Skill Retrieval (Course Builder)
- FR 5.6.2: Granular Skill Retrieval (Content Studio / Learner AI)

**System Components:**

**Backend:**
- Skill lookup API service
- Competency lookup service
- Taxonomy query service
- API endpoint handlers (REST API)
- Request validation middleware
- Response formatting service

**Database:**
- Read operations on:
  - `competencies` (to lookup competencies by name)
  - `competency_skills` (to get skills linked to competencies)
  - `competency_competencies` (to get child competencies)
  - `skills` (to traverse skill hierarchy and get MGS)

**UI/UX Design:**
- **Has custom design:** No (API-only feature, optional admin interface)

**External API Integrations:**
- **Uses external API:** No (provides API for other microservices, external discovery is handled by Feature 6.2)
- **API Name:** Skills Engine API
- **Integration Points:**
  - Skills Engine receives POST requests from external microservices
  - Requesting microservices: Course Builder MS, Content Studio MS, Learner AI MS
  - Request payload (POST body):
    - `competency_name` (string, required)
  - Response: Skills Engine returns all skills at the last level (MGS - Most Granular Skills) that relate to the requested competency
  - Note: Skills can only be accessed through competency endpoints, not directly. By the route of competency, the system returns all MGS (last level skills) that relate to the requested competency.
  - For Course Builder: If competency not found, the system calls Feature 6.2 (External Competency Discovery) internally to discover and store the competency, then returns the MGS

**AI Integration:**
- **Uses AI:** No (external discovery is handled by Feature 6.2)

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive lookup request via API:**
     - Skills Engine receives POST request from external microservice (Course Builder, Content Studio, or Learner AI)
     - External microservice sends the name of a competency in the POST request body
     - Extract competency name from POST request body (JSON payload)
     - Identify requesting microservice from request headers or authentication
     - Validate request format and parameters (ensure competency_name is provided)
  
  2. **Perform internal lookup:**
     - Query `competencies` table by name (received from external microservice)
     - If competency found:
       - Get linked L1 skills via `competency_skills` junction table
       - Get child competencies via `competency_competencies` junction table
       - For each L1 skill, traverse skill hierarchy down to the last level to get all MGS (leaf nodes - skills with no child skills)
       - Aggregate all MGS (skills at the last level) across all linked skills and child competencies
       - These MGS are the skills at the last level that relate to the requested competency
     - If competency not found:
       - If requesting microservice is Course Builder: call Feature 6.2 (External Competency Discovery) to discover and store the competency, then proceed to step 3
       - If requesting microservice is Content Studio or Learner AI: return empty array
  
  3. **Return lookup results via API:**
     - Format response as JSON
     - Return all skills at the last level (MGS - Most Granular Skills) that relate to the requested competency
     - Include competency information (ID, name, description)
     - Include MGS list (array of objects with skill_id and skill_name) - all skills at the last level that relate to this competency
     - Include metadata (IDs, names, descriptions)
     - For Content Studio and Learner AI: Return HTTP 200 status with results (empty array if competency not found)
     - For Course Builder: Return HTTP 200 status with results (if competency found internally or discovered via Feature 6.2, empty array only if external discovery fails)
     - Handle errors and return appropriate HTTP status codes
     - Send response back to the requesting external microservice

**Dependencies:**
- Feature 1.1 (Skill Hierarchy Management) - for skill hierarchy traversal
- Feature 1.2 (Competency Structure Management) - for competency structure
- Feature 6.2 (External Competency Discovery) - called when Course Builder requests a competency that is not found internally
- Feature 8.3 (Course Builder MS Integration) - API endpoint
- Feature 8.4 (Content Studio MS Integration) - API endpoint
- Feature 8.5 (Learner AI MS Integration) - API endpoint

**Telemetry:**
- Track lookup request frequency by microservice
- Monitor API endpoint usage and performance
- Monitor lookup performance (query time, API response time)
- Track lookup success rate (found vs not found)
- Track calls to Feature 6.2 (External Competency Discovery) for Course Builder
- Track API errors and HTTP status codes

**Rollout Strategy:**
- MVP: Basic exact match lookup with API endpoints (all microservices)
- Phase 2: Integrate Feature 6.2 (External Competency Discovery) for Course Builder when competency not found
- Phase 3: Add lookup caching, API rate limiting, and optimization

---

### 6.2 External Competency Discovery

**Goal:** Internal service that discovers missing competencies from external sources when called by Feature 6.1 (for Course Builder requests only). Performs external search, normalizes discovered data, stores it in the database, and returns the discovered competency with MGS list. This is an internal service function, not a public API endpoint.

**Linked Functional Requirements:**
- FR 5.2.3: On-Demand Skill Discovery
- FR 5.6.1: Granular Skill Retrieval (Course Builder)

**System Components:**

**Frontend:**
- Discovery status indicator (optional)

**Backend:**
- External discovery service (internal service function)
- AI discovery client (Gemini Deep Search)
- Discovery normalization service
- Discovery storage service

**Database:**
- Read operations on:
  - `competencies` (to check for duplicates before storing)
  - `skills` (to check for duplicates before storing)
- Write operations on:
  - `competencies` (to store newly discovered competencies)
  - `skills` (to store newly discovered skills)
  - `competency_skills` (to link competencies to skills)

**UI/UX Design:**
- **Has custom design:** No (background process)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Gemini 1.5 Flash + Deep Search
- **Integration Points:**
  - `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` (for normalization)
  - Gemini Deep Search API (for external discovery)

**AI Integration:**
- **Uses AI:** Yes
- **AI Purpose:** Discover missing competencies and skills from external sources when not found internally
- **AI Model:** Gemini 1.5 Flash + Deep Search
- **Prompt Specification:**
  - Input: missing competency name
  - Instruction: Search for relevant sources, extract hierarchical skills and competencies, return structured data
  - Expected Output: JSON with competency structure and associated skills hierarchy
- **Expected Output:** New competency and skills data, normalized and ready to integrate into the canonical taxonomy

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive discovery request (called by Feature 6.1):**
     - Receive competency name as input parameter (called internally by Feature 6.1)
     - This function is called only when Feature 6.1 determines that:
       - The requesting microservice is Course Builder
       - The competency was not found in the internal database
  
  2. **External discovery:**
     - Call Gemini Deep Search API with competency name
     - Search external sources for competency definition and associated skills
     - Extract hierarchical structure: Competency → Skills → Sub-skills → MGS
     - Return raw discovered data
  
  3. **Normalize discovered data:**
     - Use AI normalization (similar to Feature 2.3) to standardize terminology
     - Map to internal taxonomy structure
     - Check for duplicates against existing taxonomy
     - Resolve conflicts and merge with existing data if needed
  
  4. **Store discovered data:**
     - Insert new competency into `competencies` table
     - Insert new skills into `skills` table with hierarchy
     - Link competency to skills via `competency_skills` junction table
     - Set `source` field to "ai_extraction" or "external_import"
     - Calculate and cache MGS count for L1 skills (Feature 1.4)
  
  5. **Return discovered competency:**
     - Get linked L1 skills via `competency_skills` junction table
     - For each L1 skill, traverse skill hierarchy down to the last level to get all MGS (leaf nodes - skills with no child skills)
     - Aggregate all MGS (skills at the last level) across all linked skills
     - Return newly discovered competency with full MGS list
     - Include metadata about discovery source
     - Return to Feature 6.1, which will format and send the response to Course Builder

**Dependencies:**
- Feature 2.3 (Normalization & Deduplication) - for normalization logic
- Feature 1.1 (Skill Hierarchy Management) - for storing skill hierarchy
- Feature 1.2 (Competency Structure Management) - for storing competency structure
- Feature 1.4 (MGS Count Calculation) - for caching MGS count
- **Note:** This feature is called by Feature 6.1 (Internal Skill Lookup) when Course Builder requests a competency that is not found internally

**Telemetry:**
- Track discovery request frequency (when called by Feature 6.1)
- Track external discovery success rate
- Monitor discovery performance (time to discover and store)
- Log discovered competencies and skills count

**Rollout Strategy:**
- MVP: Basic external discovery with simple normalization
- Phase 2: Add advanced normalization and duplicate detection
- Phase 3: Add discovery caching and optimization

---

### 6.3 Skill Retrieval for Microservices

**Goal:** Provide MGS retrieval for Content Studio and Learner AI (lookup only, no external discovery). This feature is essentially the same as Feature 6.1 but specifically documented for Content Studio and Learner AI use cases where external discovery is not allowed.

**Linked Functional Requirements:**
- FR 5.6.2: Granular Skill Retrieval (Content Studio / Learner AI)

**System Components:**

**Frontend:**
- API documentation (optional)

**Backend:**
- Skill retrieval API service
- Internal lookup service (uses Feature 6.1 logic)
- Access control middleware (restrict to Content Studio and Learner AI)

**Database:**
- Read operations on:
  - `competencies` (to lookup competencies by name)
  - `competency_skills` (to get skills linked to competencies)
  - `competency_competencies` (to get child competencies)
  - `skills` (to traverse skill hierarchy and get MGS)

**UI/UX Design:**
- **Has custom design:** No (API-only feature)

**External API Integrations:**
- **Uses external API:** No (provides API for other microservices, no external discovery allowed)
- **API Name:** Skills Engine API
- **Integration Points:**
  - Skills Engine receives POST requests from external microservices
  - Requesting microservices: Content Studio MS, Learner AI MS
  - Request payload (POST body):
    - `competency_name` (string, required)
  - Response: Skills Engine returns all skills at the last level (MGS - Most Granular Skills) that relate to the requested competency
  - Note: If competency not found, returns empty array (no external discovery)

**AI Integration:**
- **Uses AI:** No (internal lookup only)

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive retrieval request:**
     - Skills Engine receives POST request from external microservice (Content Studio or Learner AI)
     - Extract competency name from POST request body (JSON payload)
     - Verify requesting microservice is Content Studio or Learner AI
     - Validate request format and parameters (ensure competency_name is provided)
  
  2. **Perform internal lookup only:**
     - Query `competencies` table by name
     - If competency found:
       - Get linked L1 skills via `competency_skills` junction table
       - Get child competencies via `competency_competencies` junction table
       - For each L1 skill, traverse skill hierarchy to get all MGS (leaf nodes)
       - Aggregate all MGS across all linked skills and child competencies
     - If competency not found:
       - Return empty array (no external discovery allowed for Content Studio and Learner AI)
  
  3. **Format and return results:**
     - Return MGS list with full details:
       - `skill_id`: internal skill reference (string)
       - `skill_name`: human-readable skill name
       - `competency_id`: competency this skill belongs to
       - `competency_name`: name of the competency
     - Include metadata:
       - Total MGS count
       - Competency information
       - Timestamp
     - Return HTTP 200 status with results (empty array if competency not found)

**Dependencies:**
- Feature 6.1 (Internal Skill Lookup) - uses the same lookup logic
- Feature 1.1 (Skill Hierarchy Management) - for skill hierarchy traversal
- Feature 1.2 (Competency Structure Management) - for competency structure
- Feature 8.4 (Content Studio MS Integration) - API endpoint
- Feature 8.5 (Learner AI MS Integration) - API endpoint

**Telemetry:**
- Track retrieval request frequency by microservice
- Monitor lookup performance
- Track not found errors (competency missing from database)
- Log API usage patterns

**Rollout Strategy:**
- MVP: Basic MGS retrieval API
- Phase 2: Add response caching
- Phase 3: Add batch retrieval support

---

## Feature 7: Trainer Import

### 7.1 CSV Upload Interface

**Goal:** Provide UI interface for Trainer users to upload CSV files containing hierarchical skills and competencies. The upload button is only visible to users with Trainer role (employee_type = "trainer").

**Linked Functional Requirements:**
- FR 5.5.7: Frontend Display & Access Control

**System Components:**

**Frontend:**
- Upload file button (visible only to trainers)
- File selection interface
- Upload progress indicator
- Success/error message display
- CSV format instructions and guidelines

**Backend:**
- File upload API endpoint handler
- Role-based access control middleware
- File validation service (file type, size)
- Upload status tracking

**Database:**
- Read operations on:
  - `user_profiles` (to check user role/employee_type)

**UI/UX Design:**
- **Has custom design:** Yes
- **Description:**
  - Upload button displayed only when user has Trainer role
  - File selection dialog with CSV filter
  - Clear instructions on CSV format requirements
  - Visual feedback during upload (progress bar)
  - Success message after successful upload
  - Error message if upload fails (with specific error details)
  - File size limit indicator
  - Supported format information

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Access control check:**
     - When user accesses Skills Engine dashboard, check user's `employee_type` from `user_profiles` table
     - If `employee_type = "trainer"`: display "Upload File" or "Import Custom Skills" button
     - If `employee_type != "trainer"`: hide upload button
  
  2. **File selection:**
     - User clicks upload button
     - File selection dialog opens with CSV filter
     - User selects CSV file
     - Display file name and size before upload
  
  3. **Initial file validation:**
     - Validate file extension is .csv
     - Validate file size (e.g., max 10MB)
     - If validation fails: display error message and reject file
  
  4. **Upload file:**
     - Send file to backend via POST request (multipart/form-data)
     - Show upload progress indicator
     - Backend receives file and stores temporarily for processing
  
  5. **Trigger processing:**
     - After successful upload, trigger Feature 7.2 (CSV Security Validation)
     - If security validation passes, trigger Feature 7.3 (CSV Processing & Import)
     - Display success message after processing completes
     - Display error message if processing fails

**Dependencies:**
- Feature 7.2 (CSV Security Validation) - triggered after file upload
- Feature 7.3 (CSV Processing & Import) - triggered after security validation passes

**Telemetry:**
- Track upload attempts by trainer users
- Monitor file upload success/failure rates
- Track file sizes uploaded
- Log access control violations (non-trainer attempts)

**Rollout Strategy:**
- MVP: Basic file upload with role-based access control
- Phase 2: Add drag-and-drop support, batch upload
- Phase 3: Add upload history and preview functionality

---

### 7.2 CSV Security Validation

**Goal:** Validate uploaded CSV files for security threats (SQL injection, prompt injection) before processing. Reject files that contain malicious content and trigger security alerts.

**Linked Functional Requirements:**
- FR 5.2.4: Trainer Custom Taxonomy Import

**System Components:**

**Frontend:**
- Security validation status indicator (optional)
- Security error message display

**Backend:**
- Security validation service
- SQL injection detection engine
- Prompt injection detection engine
- Pattern matching service
- Security alert service
- Security logging service

**Database:**
- Write operations on:
  - Security logs table (to log security events)

**UI/UX Design:**
- **Has custom design:** No (background validation process)
- **Description:**
  - Validation happens in background
  - Error message displayed if security threat detected
  - Security alert notification (if configured)

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No (pattern-based detection)

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive file for validation:**
     - Receive uploaded CSV file from Feature 7.1
     - File is stored temporarily for validation
  
  2. **Parse CSV content:**
     - Read CSV file content
     - Extract all text fields from CSV (all cells)
     - Prepare content for pattern matching
  
  3. **SQL injection detection:**
     - Scan all CSV cell values for SQL injection patterns:
       - Common SQL keywords: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `DROP`, `UNION`, `EXEC`, `EXECUTE`
       - SQL operators: `'`, `"`, `;`, `--`, `/*`, `*/`, `xp_`, `sp_`
       - SQL functions: `CONCAT`, `CHAR`, `ASCII`, `SUBSTRING`
       - Pattern combinations: `' OR '1'='1`, `'; DROP TABLE`, `UNION SELECT`
     - If SQL injection pattern detected:
       - Mark file as unsafe
       - Log security event with details (user_id, file name, detected pattern)
       - Trigger security alert
       - Reject file and return error to user
  
  4. **Prompt injection detection:**
     - Scan all CSV cell values for prompt injection patterns:
       - Common prompt injection keywords: `ignore previous`, `forget`, `system`, `admin`, `override`, `bypass`
       - Instruction patterns: `you are`, `act as`, `pretend to be`, `roleplay as`
       - Command patterns: `execute`, `run`, `delete`, `remove`, `clear`
       - Encoding attempts: base64, URL encoding, unicode escapes
       - Pattern combinations: `ignore previous instructions`, `system override`
     - If prompt injection pattern detected:
       - Mark file as unsafe
       - Log security event with details (user_id, file name, detected pattern)
       - Trigger security alert
       - Reject file and return error to user
  
  5. **Additional security checks:**
     - Check for suspicious file size (extremely large files)
     - Check for binary content in CSV (should be text only)
     - Check for excessive special characters
     - If any additional threat detected: reject file
  
  6. **Security logging:**
     - Log all security validation events (pass/fail)
     - For failed validations: log user_id, file name, detected threat type, timestamp
     - Send security alert to admin if threat detected
     - Store security event in security logs table
  
  7. **Return validation result:**
     - If validation passes: proceed to Feature 7.3 (CSV Processing & Import)
     - If validation fails: return error message to user, delete temporary file, do not proceed to processing

**Dependencies:**
- Feature 7.1 (CSV Upload Interface) - provides file for validation
- Feature 7.3 (CSV Processing & Import) - triggered if validation passes

**Telemetry:**
- Track security validation attempts
- Monitor security threat detection rate
- Track types of threats detected (SQL injection vs prompt injection)
- Log security alert frequency
- Monitor false positive rate

**Rollout Strategy:**
- MVP: Basic pattern matching for SQL and prompt injection
- Phase 2: Add machine learning-based detection, improve pattern matching
- Phase 3: Add real-time threat intelligence updates

---

### 7.3 CSV Processing & Import

**Goal:** Parse validated CSV file, extract hierarchical skills and competencies, check for duplicates, and merge into the canonical taxonomy database. Update L1 skills with MGS count.

**Linked Functional Requirements:**
- FR 5.2.4: Trainer Custom Taxonomy Import

**System Components:**

**Frontend:**
- Processing status indicator
- Import results display (success count, errors)
- Preview of imported skills/competencies

**Backend:**
- CSV parsing service
- Hierarchical structure extraction service
- Duplicate detection service
- Taxonomy merge service
- MGS count calculation service (uses Feature 1.4)

**Database:**
- Read operations on:
  - `competencies` (to check for duplicates)
  - `skills` (to check for duplicates)
  - `competency_skills` (to check existing mappings)
- Write operations on:
  - `competencies` (to store new competencies)
  - `skills` (to store new skills with hierarchy)
  - `competency_skills` (to link competencies to skills)
  - `competency_competencies` (to link parent-child competencies)

**UI/UX Design:**
- **Has custom design:** Yes
- **Description:**
  - Processing progress indicator
  - Summary of imported items (competencies, skills)
  - List of duplicates found (if any)
  - Success message with import statistics
  - Error details if import fails

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive validated CSV file:**
     - Receive CSV file that passed security validation (Feature 7.2)
     - File is ready for processing
  
  2. **Parse CSV file:**
     - Read CSV file structure
     - Extract hierarchical structure: Parent → Child relationships
     - Identify competencies and skills from CSV columns/rows
     - Parse competency structure (Parent Competency → Child Competency)
     - Parse skill hierarchy (Skill → Sub-skill → Micro-skill → ...)
     - Extract competency-skill mappings
     - Validate CSV structure (required columns, format)
     - If parsing fails: return error message
  
  3. **Extract hierarchical data:**
     - Build competency hierarchy (max 2 levels: Parent → Child)
     - Build skill hierarchy (N-level depth)
     - Map competencies to skills
     - Store extracted data in memory structure
  
  4. **Duplicate detection:**
     - For each competency:
       - Check if competency exists in `competencies` table (by name)
       - If exists: mark as duplicate, skip or merge based on logic
       - If not exists: mark as new
     - For each skill:
       - Check if skill exists in `skills` table (by name and hierarchy position)
       - If exists: mark as duplicate, skip or merge based on logic
       - If not exists: mark as new
     - Log all duplicates found
  
  5. **Store new data:**
     - For new competencies:
       - Insert into `competencies` table
       - Set `source` field to "trainer_import"
       - Link parent-child relationships via `competency_competencies` table
     - For new skills:
       - Insert into `skills` table with hierarchy (parent-child relationships)
       - Set `source` field to "trainer_import"
       - Link skills to competencies via `competency_skills` table
     - Handle errors during insertion (rollback if critical error)
  
  6. **Update MGS count for L1 skills:**
     - For each new L1 skill (top-level skill):
       - Use Feature 1.4 (MGS Count Calculation) to calculate total MGS count
       - Update `l1_mgs_count` field in `skills` table
     - For existing L1 skills that got new child skills:
       - Recalculate MGS count
       - Update `l1_mgs_count` field
  
  7. **Return import results:**
     - Count of imported competencies
     - Count of imported skills
     - Count of duplicates found (not imported)
     - List of errors (if any)
     - Success message with statistics
     - Return results to frontend for display

**Dependencies:**
- Feature 7.1 (CSV Upload Interface) - provides file
- Feature 7.2 (CSV Security Validation) - validates file before processing
- Feature 1.1 (Skill Hierarchy Management) - for storing skill hierarchy
- Feature 1.2 (Competency Structure Management) - for storing competency structure
- Feature 1.4 (MGS Count Calculation) - for updating MGS count

**Telemetry:**
- Track CSV import attempts
- Monitor import success/failure rates
- Track number of items imported per file
- Monitor duplicate detection rate
- Track processing time
- Log import errors

**Rollout Strategy:**
- MVP: Basic CSV parsing and import
- Phase 2: Add advanced duplicate detection and merge logic
- Phase 3: Add import preview, rollback capability, batch import

---

## Feature 8: External Systems API Integration

**Note:** Skills Engine **provides REST APIs** that **external microservices** (Directory MS, Assessment MS, Course Builder MS, etc.) consume. These external microservices are separate systems that make requests to Skills Engine. Skills Engine acts as the **API provider**.

**Important:** All API interactions described in Features 8.1-8.7 will be implemented through the **Unified Data Exchange Protocol** (see Unified Data Exchange Protocol section above). Instead of separate endpoints for each microservice, all requests will go through the single unified endpoint `POST /api/fill-content-metrics/` with internal routing based on `requester_service`. The specific endpoints mentioned in each feature (8.1-8.7) represent the logical operations, but the physical implementation will use the unified endpoint architecture.

### 8.1 Directory MS Integration

**Goal:** Provide REST API endpoints for Directory MS to send user data to Skills Engine and receive updated user profiles. Skills Engine receives user data (user_id, user_name, company_id, employee_type, career_path, raw_data) and sends back updated profiles (competencies, proficiency levels, L1 skills, relevance_score).

**Linked Functional Requirements:**
- FR 5.3.1: Profile Initialization
- FR 5.3.8: Directory Update after Baseline
- FR 5.3.9: Updated Profile Delivery

**System Components:**

**Backend:**
- Directory MS API endpoint handlers
- Request validation middleware
- Response formatting service
- Directory MS API client (for sending profiles)
- Authentication/authorization middleware

**Database:**
- Read operations on:
  - `user_profiles` (to get user data)
  - `user_competencies` (to get competency profiles)
  - `competencies` (to get competency details)
  - `skills` (to get L1 skills)
- Write operations on:
  - `user_profiles` (to store received user data)
  - `user_competencies` (to store competency profiles)

**UI/UX Design:**
- **Has custom design:** No (API-only feature)

**External API Integrations:**
- **Uses external API:** No (Skills Engine provides API endpoints)
- **API Name:** Skills Engine REST API
- **Integration Points:**
  - **Directory MS → Skills Engine:**
    - `POST /api/directory/user-data` - Directory MS sends new user data
    - Request payload:
      - `user_id` (string, required)
      - `user_name` (string, required)
      - `company_id` (string, required)
      - `employee_type` (string, required: "employee", "trainer", etc.)
      - `career_path` (string, required)
      - `raw_data` (object, required): contains claimed skills, job roles, certifications, experiences
    - Response: Skills Engine acknowledges receipt and triggers profile creation
  - **Skills Engine → Directory MS:**
    - `POST /api/directory/initial-profile` - Skills Engine sends initial unverified profile (Feature 2.4)
    - `POST /api/directory/update-profile` - Skills Engine sends updated profile after verification (Feature 2.5)
    - Payload structure (for both endpoints):
      - `user_id` (string)
      - `user_name` (string)
      - `company_id` (string)
      - `competencies` (array): list of competencies user owns, each containing:
        - `competency_id` (string)
        - `competency_name` (string)
        - `proficiency_level` (string: "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT", "UNDEFINED")
        - `coverage` (number: 0-100)
        - `l1_skills` (array): list of L1 skills directly owned by user for this competency
      - `relevance_score` (number: 0-100, for career path goal)
      - `updated_at` (timestamp)

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive user data from Directory MS:**
     - Skills Engine receives POST request at `/api/directory/user-data`
     - Validate request payload (required fields, data types)
     - Authenticate Directory MS (verify API key/token)
     - Extract user data from request body
     - Trigger Feature 2.1 (Basic Profile Creation) to create user profile
  
  2. **Send initial profile to Directory MS:**
     - After Feature 2.4 (Initial Competency Profile Delivery) completes
     - Format initial profile payload (all skills unverified, level=UNDEFINED, coverage=0)
     - Send POST request to Directory MS at `/api/directory/initial-profile`
     - Handle retry logic if Directory MS is unavailable
     - Log delivery status
  
  3. **Send updated profile to Directory MS:**
     - After Feature 2.5 (Profile Updates) triggers (after verification events)
     - Format updated profile payload with:
       - Updated proficiency levels
       - Updated coverage percentages
       - Verified skills
       - Updated relevance_score
     - Send POST request to Directory MS at `/api/directory/update-profile`
     - Handle retry logic if Directory MS is unavailable
     - Log delivery status

**Dependencies:**
- Feature 2.1 (Basic Profile Creation) - triggered when user data received
- Feature 2.4 (Initial Competency Profile Delivery) - sends initial profile
- Feature 2.5 (Profile Updates) - sends updated profiles

**Telemetry:**
- Track API request frequency from Directory MS
- Monitor API endpoint usage and performance
- Track profile delivery success/failure rates
- Monitor API response times
- Log authentication failures

**Rollout Strategy:**
- MVP: Basic API endpoints with synchronous communication
- Phase 2: Add async communication, retry logic, queue system
- Phase 3: Add webhook support, event-driven architecture

---

### 8.2 Assessment MS Integration

**Goal:** Provide REST API endpoints for Assessment MS to receive MGS lists for exam creation and send exam results back to Skills Engine. Skills Engine sends competency_map with MGS to Assessment MS for baseline and post-course exams, and receives exam results for skill verification.

**Linked Functional Requirements:**
- FR 5.3.4: Primary Assignment Verification Request
- FR 5.3.5: Granular Verification
- FR 5.3.6: Post-course Exam Handling

**System Components:**

**Frontend:**
- API documentation (optional)

**Backend:**
- Assessment MS API endpoint handlers
- Request validation middleware
- Response formatting service
- Assessment MS API client (for sending MGS lists)
- Exam results processing service

**Database:**
- Read operations on:
  - `user_competencies` (to get required MGS)
  - `competencies` (to build competency_map)
  - `competency_skills` (to get skills linked to competencies)
  - `skills` (to traverse hierarchy and get MGS)
- Write operations on:
  - `user_competencies` (to update verified_skills after exam results)

**UI/UX Design:**
- **Has custom design:** No (API-only feature)

**External API Integrations:**
- **Uses external API:** No (Skills Engine provides API endpoints)
- **API Name:** Skills Engine REST API
- **Integration Points:**
  - **Skills Engine → Assessment MS:**
    - `POST /api/assessment/create-baseline-exam` - Skills Engine sends MGS list for baseline exam (Feature 3.1)
    - Request payload:
      - `user_id` (string, required)
      - `user_name` (string, required)
      - `company_id` (string, required)
      - `competency_map` (object, required): map of competency_id → skills array, where each skill contains:
        - `skill_id` (string)
        - `skill_name` (string)
    - Response: Assessment MS acknowledges receipt and creates exam
  - **Assessment MS → Skills Engine:**
    - `POST /api/assessment/baseline-exam-results` - Assessment MS sends baseline exam results (Feature 3.2)
    - `POST /api/assessment/post-course-exam-results` - Assessment MS sends post-course exam results (Feature 3.3)
    - Payload structure (baseline exam results):
      - `exam_type` (string: "baseline")
      - `exam_status` (string: "pass" or "fail")
      - `final_grade` (number)
      - `user_id` (string)
      - `user_name` (string)
      - `skills` (array): list of evaluated skills, each containing:
        - `skill_id` (integer)
        - `skill_name` (string)
        - `verified` (boolean: true/false)
        - `competency_name` (string)
    - Payload structure (post-course exam results):
      - `exam_type` (string: "post-course")
      - `exam_status` (string: "pass" or "fail")
      - `final_grade` (number)
      - `user_id` (string)
      - `user_name` (string)
      - `company_id` (string)
      - `course_name` (string)
      - `skills` (array): list of evaluated skills that passed (verified=true only), each containing:
        - `skill_id` (integer)
        - `skill_name` (string)
        - `verified` (boolean: always true)

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Send MGS list to Assessment MS for baseline exam:**
     - After Feature 3.1 (Baseline Exam Request) triggers
     - Build competency_map from user's required competencies
     - Format request payload with competency_map
     - Send POST request to Assessment MS at `/api/assessment/create-baseline-exam`
     - Handle retry logic if Assessment MS is unavailable
     - Log delivery status
  
  2. **Receive baseline exam results from Assessment MS:**
     - Skills Engine receives POST request at `/api/assessment/baseline-exam-results`
     - Validate request payload
     - Authenticate Assessment MS (verify API key/token)
     - Trigger Feature 3.2 (Baseline Exam Verification) to process results
  
  3. **Receive post-course exam results from Assessment MS:**
     - Skills Engine receives POST request at `/api/assessment/post-course-exam-results`
     - Validate request payload
     - Authenticate Assessment MS (verify API key/token)
     - Trigger Feature 3.3 (Post-Course Exam Verification) to process results

**Dependencies:**
- Feature 3.1 (Baseline Exam Request) - sends MGS list
- Feature 3.2 (Baseline Exam Verification) - processes baseline results
- Feature 3.3 (Post-Course Exam Verification) - processes post-course results

**Telemetry:**
- Track API request frequency to/from Assessment MS
- Monitor exam creation request success/failure rates
- Track exam results processing time
- Monitor API response times
- Log authentication failures

**Rollout Strategy:**
- MVP: Basic API endpoints with synchronous communication
- Phase 2: Add async communication, retry logic
- Phase 3: Add webhook support, event-driven architecture

---

### 8.3 Course Builder MS Integration

**Goal:** Provide REST API endpoint for Course Builder MS to retrieve MGS (Most Granular Skills) for a given competency. If competency not found, Skills Engine performs external discovery (Feature 6.2) and returns the discovered MGS.

**Linked Functional Requirements:**
- FR 5.6.1: Granular Skill Retrieval (Course Builder)

**System Components:**

**Frontend:**
- API documentation (optional)

**Backend:**
- Course Builder MS API endpoint handlers
- Request validation middleware
- Response formatting service
- Internal lookup service (Feature 6.1)
- External discovery service (Feature 6.2)

**Database:**
- Read operations on:
  - `competencies` (to lookup competencies by name)
  - `competency_skills` (to get skills linked to competencies)
  - `competency_competencies` (to get child competencies)
  - `skills` (to traverse hierarchy and get MGS)
- Write operations on (via Feature 6.2):
  - `competencies` (to store discovered competencies)
  - `skills` (to store discovered skills)
  - `competency_skills` (to link competencies to skills)

**UI/UX Design:**
- **Has custom design:** No (API-only feature)

**External API Integrations:**
- **Uses external API:** No (Skills Engine provides API endpoints, external discovery is handled internally by Feature 6.2)
- **API Name:** Skills Engine REST API
- **Integration Points:**
  - **Course Builder MS → Skills Engine:**
    - `POST /api/skills/competency/mgs` - Course Builder MS requests MGS for a competency
    - Request payload:
      - `competency_name` (string, required)
    - Response: Skills Engine returns all MGS (Most Granular Skills) that relate to the requested competency
    - Response structure:
      - `competency_id` (string)
      - `competency_name` (string)
      - `mgs_list` (array): list of MGS, each containing:
        - `skill_id` (string)
        - `skill_name` (string)
      - `discovered` (boolean): true if competency was discovered externally, false if found internally

**AI Integration:**
- **Uses AI:** No (external discovery uses AI via Feature 6.2, but this feature doesn't directly use AI)

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive MGS request from Course Builder MS:**
     - Skills Engine receives POST request at `/api/competency/skills/mgs`
     - Validate request payload (ensure competency_name is provided)
     - Authenticate Course Builder MS (verify API key/token)
     - Extract competency_name from request body
  
  2. **Perform lookup or discovery:**
     - Use Feature 6.1 (Internal Skill Lookup) to search for competency
     - If competency found: return MGS list
     - If competency not found: call Feature 6.2 (External Competency Discovery) to discover and store competency, then return MGS list
  
  3. **Format and return response:**
     - Format response with MGS list
     - Include metadata (competency_id, competency_name, discovered flag)
     - Return HTTP 200 status with results
     - Handle errors and return appropriate HTTP status codes

**Dependencies:**
- Feature 6.1 (Internal Skill Lookup) - for internal lookup
- Feature 6.2 (External Competency Discovery) - for external discovery when competency not found

**Telemetry:**
- Track API request frequency from Course Builder MS
- Monitor lookup vs discovery usage
- Track discovery success rate
- Monitor API response times
- Log authentication failures

**Rollout Strategy:**
- MVP: Basic API endpoint with lookup and discovery
- Phase 2: Add response caching, rate limiting
- Phase 3: Add batch requests, webhook notifications

---

### 8.4 Content Studio MS Integration

**Goal:** Provide REST API endpoint for Content Studio MS to retrieve MGS (Most Granular Skills) for a given competency. Only internal lookup is performed (no external discovery).

**Linked Functional Requirements:**
- FR 5.6.2: Granular Skill Retrieval (Content Studio / Learner AI)

**System Components:**

**Frontend:**
- API documentation (optional)

**Backend:**
- Content Studio MS API endpoint handlers
- Request validation middleware
- Response formatting service
- Internal lookup service (Feature 6.1)

**Database:**
- Read operations on:
  - `competencies` (to lookup competencies by name)
  - `competency_skills` (to get skills linked to competencies)
  - `competency_competencies` (to get child competencies)
  - `skills` (to traverse hierarchy and get MGS)

**UI/UX Design:**
- **Has custom design:** No (API-only feature)

**External API Integrations:**
- **Uses external API:** No (Skills Engine provides API endpoints)
- **API Name:** Skills Engine REST API
- **Integration Points:**
  - **Content Studio MS → Skills Engine:**
    - `POST /api/skills/competency/mgs` - Content Studio MS requests MGS for a competency
    - Request payload:
      - `competency_name` (string, required)
    - Response: Skills Engine returns all MGS (Most Granular Skills) that relate to the requested competency, or empty array if not found
    - Response structure:
      - `competency_id` (string, nullable)
      - `competency_name` (string)
      - `mgs_list` (array): list of MGS, each containing:
        - `skill_id` (string)
        - `skill_name` (string)

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive MGS request from Content Studio MS:**
     - Skills Engine receives POST request at `/api/skills/competency/mgs`
     - Validate request payload (ensure competency_name is provided)
     - Authenticate Content Studio MS (verify API key/token)
     - Extract competency_name from request body
  
  2. **Perform internal lookup only:**
     - Use Feature 6.1 (Internal Skill Lookup) to search for competency
     - If competency found: return MGS list
     - If competency not found: return empty array (no external discovery allowed)
  
  3. **Format and return response:**
     - Format response with MGS list (or empty array)
     - Include metadata (competency_id, competency_name)
     - Return HTTP 200 status with results
     - Handle errors and return appropriate HTTP status codes

**Dependencies:**
- Feature 6.1 (Internal Skill Lookup) - for internal lookup

**Telemetry:**
- Track API request frequency from Content Studio MS
- Monitor lookup success rate
- Track not found errors
- Monitor API response times
- Log authentication failures

**Rollout Strategy:**
- MVP: Basic API endpoint with internal lookup
- Phase 2: Add response caching, rate limiting
- Phase 3: Add batch requests

---

### 8.5 Learner AI MS Integration

**Goal:** Provide REST API endpoints for Learner AI MS to receive gap analysis results and retrieve MGS (Most Granular Skills) for competencies. Skills Engine sends gap analysis results to Learner AI MS and provides MGS lookup (internal only, no external discovery).

**Linked Functional Requirements:**
- FR 5.5.6: Gap Analysis Data Sent
- FR 5.6.2: Granular Skill Retrieval (Content Studio / Learner AI)

**System Components:**

**Frontend:**
- API documentation (optional)

**Backend:**
- Learner AI MS API endpoint handlers
- Request validation middleware
- Response formatting service
- Learner AI MS API client (for sending gap analysis)
- Internal lookup service (Feature 6.1)

**Database:**
- Read operations on:
  - `user_competencies` (to get verified MGS for gap analysis)
  - `user_profiles` (to get career path goal)
  - `competencies` (to get required MGS)
  - `competency_skills` (to get competency-to-skill mappings)
  - `competency_competencies` (to get child competencies)
  - `skills` (to traverse hierarchy and get MGS)

**UI/UX Design:**
- **Has custom design:** No (API-only feature)

**External API Integrations:**
- **Uses external API:** No (Skills Engine provides API endpoints)
- **API Name:** Skills Engine REST API
- **Integration Points:**
  - **Skills Engine → Learner AI MS:**
    - `POST /api/learner-ai/gap-analysis-results` - Skills Engine sends gap analysis results (Feature 5)
    - Request payload:
      - `user_id` (string)
      - `user_name` (string)
      - `company_id` (string)
      - `course_name` (string, nullable - only for narrow analysis)
      - `missing_mgs` (object/map): map of missing MGS grouped by competency, where:
        - Key: `competency_name` (string)
        - Value: array of skills, each containing:
          - `skill_id` (string)
          - `skill_name` (string)
      - `exam_status` (string: "pass" or "fail", only for post-course exams)
      - `analysis_type` (string: "broad" or "narrow")
    - Response: Learner AI MS acknowledges receipt
  - **Learner AI MS → Skills Engine:**
    - `POST /api/skills/competency/mgs` - Learner AI MS requests MGS for a competency
    - Request payload:
      - `competency_name` (string, required)
    - Response: Skills Engine returns all MGS (Most Granular Skills) that relate to the requested competency, or empty array if not found
    - Response structure:
      - `competency_id` (string, nullable)
      - `competency_name` (string)
      - `mgs_list` (array): list of MGS, each containing:
        - `skill_id` (string)
        - `skill_name` (string)

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Send gap analysis results to Learner AI MS:**
     - After Feature 5 (Gap Analysis) completes
     - Format gap analysis payload with missing_mgs map
     - Send POST request to Learner AI MS at `/api/learner-ai/gap-analysis-results`
     - Handle retry logic if Learner AI MS is unavailable
     - Log delivery status
  
  2. **Receive MGS request from Learner AI MS:**
     - Skills Engine receives POST request at `/api/skills/competency/mgs`
     - Validate request payload (ensure competency_name is provided)
     - Authenticate Learner AI MS (verify API key/token)
     - Extract competency_name from request body
  
  3. **Perform internal lookup only:**
     - Use Feature 6.1 (Internal Skill Lookup) to search for competency
     - If competency found: return MGS list
     - If competency not found: return empty array (no external discovery allowed)
  
  4. **Format and return response:**
     - Format response with MGS list (or empty array)
     - Include metadata (competency_id, competency_name)
     - Return HTTP 200 status with results
     - Handle errors and return appropriate HTTP status codes

**Dependencies:**
- Feature 5 (Gap Analysis) - sends gap analysis results
- Feature 6.1 (Internal Skill Lookup) - for MGS lookup

**Telemetry:**
- Track API request frequency to/from Learner AI MS
- Monitor gap analysis delivery success/failure rates
- Track lookup success rate
- Monitor API response times
- Log authentication failures

**Rollout Strategy:**
- MVP: Basic API endpoints with synchronous communication
- Phase 2: Add async communication, retry logic, response caching
- Phase 3: Add webhook support, batch requests

---

### 8.6 Learning Analytics MS Integration

**Goal:** Provide REST API endpoints for Learning Analytics MS to retrieve verified user profiles and aggregated team competency status for reporting and analytics.

**Linked Functional Requirements:**
- FR 5.5.1: User/Team Data Retrieval

**System Components:**

**Frontend:**
- API documentation (optional)

**Backend:**
- Learning Analytics MS API endpoint handlers
- Request validation middleware
- Response formatting service
- User profile aggregation service
- Team data aggregation service

**Database:**
- Read operations on:
  - `user_profiles` (to get user data)
  - `user_competencies` (to get verified user profiles)
  - `competencies` (to get competency details)
  - `skills` (to get skill details)

**UI/UX Design:**
- **Has custom design:** No (API-only feature)

**External API Integrations:**
- **Uses external API:** No (Skills Engine provides API endpoints)
- **API Name:** Skills Engine REST API
- **Integration Points:**
  - **Learning Analytics MS → Skills Engine:**
    - `POST /api/analytics/user-profiles` - Learning Analytics MS requests individual user profiles
    - Request payload:
      - `user_ids` (array of strings, optional - if not provided, returns all users)
      - `company_id` (string, optional - filter by company)
    - Response: Skills Engine returns verified user profiles with:
      - User information (user_id, user_name, company_id)
      - List of competencies with proficiency levels
      - Verified MGS count per competency
      - Coverage percentages
      - Relevance score
    - `POST /api/analytics/team-aggregates` - Learning Analytics MS requests aggregated team data
    - Request payload:
      - `company_id` (string, required)
      - `team_ids` (array of strings, optional - if not provided, returns all teams)
    - Response: Skills Engine returns aggregated team competency status:
      - Average proficiency levels per competency
      - Team gap summary
      - Total verified MGS count
      - Coverage statistics

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive user profiles request from Learning Analytics MS:**
     - Skills Engine receives POST request at `/api/analytics/user-profiles`
     - Validate request payload
     - Authenticate Learning Analytics MS (verify API key/token)
     - Extract filters (user_ids, company_id) from request body
  
  2. **Retrieve user profiles:**
     - Query `user_profiles` and `user_competencies` tables based on filters
     - For each user, aggregate:
       - Competencies with proficiency levels
       - Verified MGS count per competency
       - Coverage percentages
       - Relevance score
     - Format response with user profile data
  
  3. **Receive team aggregates request from Learning Analytics MS:**
     - Skills Engine receives POST request at `/api/analytics/team-aggregates`
     - Validate request payload (ensure company_id is provided)
     - Authenticate Learning Analytics MS (verify API key/token)
     - Extract filters (company_id, team_ids) from request body
  
  4. **Calculate team aggregates:**
     - Query user profiles for specified company/teams
     - Aggregate data across users:
       - Calculate average proficiency levels per competency
       - Calculate team gap summary (missing MGS across team)
       - Calculate total verified MGS count
       - Calculate coverage statistics
     - Format response with aggregated team data
  
  5. **Format and return response:**
     - Format response with requested data
     - Return HTTP 200 status with results
     - Handle errors and return appropriate HTTP status codes

**Dependencies:**
- Feature 2.6 (Profile Retrieval) - for user profile data
- Feature 4 (Proficiency & Level Calculation) - for proficiency levels and coverage

**Telemetry:**
- Track API request frequency from Learning Analytics MS
- Monitor query performance
- Track response times
- Log authentication failures

**Rollout Strategy:**
- MVP: Basic API endpoints with user profiles and team aggregates
- Phase 2: Add advanced filtering, pagination, caching
- Phase 3: Add real-time data streaming, webhook notifications

---

### 8.7 RAG/Chatbot MS Integration

**Goal:** Provide REST API endpoints for RAG/Chatbot MS to retrieve canonical taxonomy structure and verified user profiles for skill-aware guidance and recommendations.

**Linked Functional Requirements:**
- Integration requirement (mentioned in user stories)

**System Components:**

**Frontend:**
- API documentation (optional)

**Backend:**
- RAG MS API endpoint handlers
- Request validation middleware
- Response formatting service
- Taxonomy structure service
- User profile service

**Database:**
- Read operations on:
  - `competencies` (to get competency structure)
  - `skills` (to get skill hierarchy)
  - `competency_skills` (to get competency-to-skill mappings)
  - `competency_competencies` (to get parent-child relationships)
  - `skill_relationships` (to get skill relationships)
  - `user_profiles` (to get user data)
  - `user_competencies` (to get verified user profiles)

**UI/UX Design:**
- **Has custom design:** No (API-only feature)

**External API Integrations:**
- **Uses external API:** No (Skills Engine provides API endpoints)
- **API Name:** Skills Engine REST API
- **Integration Points:**
  - **RAG MS → Skills Engine:**
    - `POST /api/rag/taxonomy` - RAG MS requests canonical taxonomy structure
    - Request payload:
      - `include_relationships` (boolean, optional - default: true)
      - `include_mgs_count` (boolean, optional - default: true)
    - Response: Skills Engine returns complete taxonomy structure:
      - Competencies hierarchy (Parent → Child)
      - Skills hierarchy (N-level depth)
      - Competency-skill mappings
      - Skill relationships (if requested)
      - MGS counts for L1 skills (if requested)
    - `POST /api/rag/user-profile` - RAG MS requests verified user profile
    - Request payload:
      - `user_id` (string, required)
    - Response: Skills Engine returns verified user profile with:
      - User information (user_id, user_name, company_id, career_path)
      - List of competencies with proficiency levels
      - Verified MGS per competency
      - Coverage percentages
      - Relevance score

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive taxonomy request from RAG MS:**
     - Skills Engine receives POST request at `/api/rag/taxonomy`
     - Validate request payload
     - Authenticate RAG MS (verify API key/token)
     - Extract options (include_relationships, include_mgs_count) from request body
  
  2. **Retrieve taxonomy structure:**
     - Query `competencies` table to get all competencies
     - Query `competency_competencies` to get parent-child relationships
     - Query `skills` table to get all skills with hierarchy
     - Query `competency_skills` to get competency-skill mappings
     - If include_relationships: query `skill_relationships` to get skill relationships
     - If include_mgs_count: include `l1_mgs_count` for L1 skills
     - Format response with complete taxonomy structure
  
  3. **Receive user profile request from RAG MS:**
     - Skills Engine receives POST request at `/api/rag/user-profile`
     - Validate request payload (ensure user_id is provided)
     - Authenticate RAG MS (verify API key/token)
     - Extract user_id from request body
  
  4. **Retrieve user profile:**
     - Query `user_profiles` table to get user data
     - Query `user_competencies` table to get competency profiles
     - For each competency, include:
       - Proficiency level
       - Coverage percentage
       - Verified MGS list
     - Calculate relevance score
     - Format response with user profile data
  
  5. **Format and return response:**
     - Format response with requested data
     - Return HTTP 200 status with results
     - Handle errors and return appropriate HTTP status codes

**Dependencies:**
- Feature 1.1 (Skill Hierarchy Management) - for skill hierarchy
- Feature 1.2 (Competency Structure Management) - for competency structure
- Feature 1.3 (Skill Relationship Network) - for skill relationships
- Feature 2.6 (Profile Retrieval) - for user profile data

**Telemetry:**
- Track API request frequency from RAG MS
- Monitor query performance
- Track response times
- Log authentication failures

**Rollout Strategy:**
- MVP: Basic API endpoints with taxonomy and user profiles
- Phase 2: Add caching, optimized queries
- Phase 3: Add incremental updates, webhook notifications

---

## Feature 9: AI-Powered Extraction Features

**Note:** Some AI-powered extraction features are already detailed in other features:
- Feature 9.3 (User Data Skill Extraction) = Feature 2.2 (AI Extraction of Raw Data)
- Feature 9.4 (Normalization & Deduplication) = Feature 2.3 (Normalization & Deduplication)

### 9.1 Source Discovery & Link Storage

**Goal:** Identify official external source URLs for skill and competency extraction using AI. Store discovered URLs in the database and compare against existing sources to identify net-new URLs for extraction.

**Linked Functional Requirements:**
- FR 5.2.1: Initial Import
- FR 5.2.5: Taxonomy Periodic Synchronization

**System Components:**

**Backend:**
- Source discovery service
- AI discovery client (Gemini Flash)
- URL validation service
- Source storage service
- Source comparison service

**Database:**
- Read operations on:
  - `external_sources` table (to check existing URLs)
- Write operations on:
  - `external_sources` table (to store discovered URLs)
  - Fields:
    - `source_id` (primary key, from AI response)
    - `source_name` (string, from AI response)
    - `reference_index_url` (string, unique, from AI response)
    - `reference_type` (string: "Documentation Index", "Learning Path", "Skills Catalog", "Module", from AI response)
    - `hierarchy_support` (string: "Yes", "Partial", "No", from AI response)
    - `provides` (string: "skill", "both", from AI response)
    - `topics_covered` (string, from AI response)
    - `skill_focus` (string, from AI response)
    - `notes` (string, nullable, from AI response)
    - `discovered_at` (timestamp)
    - `last_scanned_at` (timestamp, nullable)
    - `is_active` (boolean, default: true)

**UI/UX Design:**
- **Has custom design:** No (background process, optional admin interface)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Gemini 1.5 Flash
- **Integration Points:**
  - `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
  - Used for discovering authoritative source URLs

**AI Integration:**
- **Uses AI:** Yes
- **AI Purpose:** Identify official external source URLs for skills and competencies
- **AI Model:** Gemini 1.5 Flash
- **Prompt Specification:**
  - **Prompt:**
    ```
    You are an AI assistant tasked with curating a comprehensive dataset of official and authoritative sources that provide technological skills and/or professional competencies in a structured and hierarchical manner.

    GOAL:

    Identify between 40 and 50 official sources that list skills or hierarchical skills/competencies relevant to technological roles.

    Only include sources that can be accessed by scraping (NO API, no programmatic endpoints).

    For each qualifying source, provide a JSON entry following the exact structure below.

    Only include sources that link to structured skill or competency hierarchies, not tutorials, guides, conceptual pages, blogs, or news articles.

    RULES:

    Only include official or authoritative websites, such as:

    MDN, Microsoft Learn, AWS Docs, Google Developers, IBM Skills, Oracle, Cisco, Linux Foundation, ISO, e-CF, SFIA, Red Hat, VMware, SAP, Adobe, TensorFlow, PyTorch, Databricks, etc.

    Exclude any URL that requires API access or returns data only via API.

    Prefer URLs with paths like: /reference, /docs/, /learn/, /skills/, /framework/, /ref/, /spec/

    Skip URLs containing: /guide/, /tutorial/, /overview/, /concepts/, /blog/, /news/

    Only include URLs that clearly provide hierarchical skills or competency → skill mapping.

    Cover a broad range of domains (examples):

    Frontend Development: JavaScript, CSS, HTML

    Backend Development: Python, Java, Node.js, C#

    Full Stack Development

    Data Analyst / Data Scientist: SQL, Python Data, Machine Learning, Spark

    DevOps / Cloud: AWS, Azure, Kubernetes

    AI / Machine Learning

    Cybersecurity

    Networking

    UX / UI Design

    Software Architecture

    Other relevant technological roles or domains that provide hierarchical skills or competencies

    OUTPUT FORMAT:

    Return a valid JSON array with entries structured exactly as follows (note: no access_method field):

    [
      {
        "source_id": "string",                  // Unique ID (e.g., orgname-topic-subpage)
        "source_name": "string",                // Organization / website name
        "reference_index_url": "string",        // URL of this specific page or section
        "reference_type": "Documentation Index | Learning Path | Skills Catalog | Module",
        "hierarchy_support": "Yes | Partial | No",
        "provides": "skill | both",             // Only include skill or both
        "topics_covered": "string",             // Short description of topics / roles
        "skill_focus": "string",                // Specific skills or technology focus
        "notes": "string"                        // Extra info, e.g., parent-child relation
      }
    ]

    Return 40–50 entries total.

    Only include sources accessible via scraping
    ```
  - **Input:** Request to discover authoritative sources for skills and competencies
  - **Expected Output:** JSON array of source objects (40-50 entries), each containing: source_id, source_name, reference_index_url, reference_type, hierarchy_support, provides, topics_covered, skill_focus, notes

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Trigger source discovery:**
     - On system initialization (FR 5.2.1)
     - On periodic synchronization (FR 5.2.5)
     - Can be triggered manually via admin interface
  
  2. **AI-based source discovery:**
     - Call Gemini 1.5 Flash API with the detailed prompt (as specified in AI Integration section)
     - AI generates list of 40-50 source entries for skills and competencies
     - Receive JSON response: array of source objects, each containing:
       - `source_id`: unique identifier
       - `source_name`: organization/website name
       - `reference_index_url`: URL of the specific page/section
       - `reference_type`: type of reference (Documentation Index, Learning Path, Skills Catalog, Module)
       - `hierarchy_support`: Yes/Partial/No
       - `provides`: skill or both
       - `topics_covered`: description of topics/roles
       - `skill_focus`: specific skills or technology focus
       - `notes`: additional information
  
  3. **Validate discovered sources:**
     - Validate URL format for `reference_index_url`
     - Check URL accessibility (HTTP status check)
     - Validate required fields (source_id, source_name, reference_index_url)
     - Filter out invalid or inaccessible URLs
     - Filter out sources with `hierarchy_support = "No"` (only keep "Yes" or "Partial")
  
  4. **Compare with existing sources:**
     - Query `external_sources` table to get existing `reference_index_url` values
     - Compare discovered `reference_index_url` with existing URLs
     - Identify net-new sources (not in database)
     - Mark existing sources as still valid
  
  5. **Store new sources:**
     - Insert net-new sources into `external_sources` table
     - Store all fields from AI response:
       - `source_id` (use as primary key or generate if needed)
       - `source_name`
       - `reference_index_url` (unique)
       - `reference_type`
       - `hierarchy_support`
       - `provides`
       - `topics_covered`
       - `skill_focus`
       - `notes`
     - Set `discovered_at` timestamp
     - Set `is_active = true`
  
  6. **Return discovery results:**
     - Return count of new sources discovered
     - Return list of new sources with metadata (source_name, reference_index_url, reference_type, etc.)
     - Log discovery results

**Dependencies:**
- Feature 9.2 (Web Deep Search & Skill Extraction) - uses discovered URLs for extraction

**Telemetry:**
- Track source discovery frequency
- Monitor discovery success rate
- Track number of new sources discovered per discovery run
- Log AI API call performance
- Monitor URL validation success rate

**Rollout Strategy:**
- MVP: Basic AI discovery with URL storage
- Phase 2: Add URL validation, accessibility checks
- Phase 3: Add periodic auto-discovery, source quality scoring

---

### 9.2 Web Deep Search & Skill Extraction

**Goal:** Scrape and extract hierarchical skills and competencies from external source URLs using AI Deep Search. Extract data in hierarchical format (Competency → Skill → Sub-skill → N-levels) and prepare for validation and normalization.

**Linked Functional Requirements:**
- FR 5.2.1: Initial Import

**System Components:**

**Backend:**
- AI extraction client (Gemini Pro Deep Search)
- URL list preparation service
- Hierarchical structure parser (for AI response)
- Extraction queue service

**Database:**
- Read operations on:
  - `external_sources` table (to get `reference_index_url` values to extract from)

**UI/UX Design:**
- **Has custom design:** No (background process, optional admin interface)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Gemini 1.5 Pro (Deep Search)
- **Integration Points:**
  - Gemini Deep Search API (for deep web scanning and extraction)
  - Web scraping APIs (if needed for content access)

**AI Integration:**
- **Uses AI:** Yes
- **AI Purpose:** Scrape or call APIs on official sources to extract hierarchical skills and competencies
- **AI Model:** Gemini 1.5 Pro (Deep Search)
- **Prompt Specification:**
  - **Prompt:**
    ```
    You are a highly intelligent semantic extraction system designed to identify, verify, and structure professional and technical competencies and skills from documentation.

    Your task is to perform deep semantic extraction for each provided URL separately and return all results together in **one JSON file**, where each URL has its own independent hierarchical structure.

    ---

    Follow these instructions exactly:

    1. Access and analyze the content at each provided URL in depth.

    2. Extract all relevant elements:
       - Competencies and sub-competencies (broader and more specific domains)
       - Skills
       - Subskills
       - Microskills
       - Nanoskills
       - Any further nested skill levels (N-level depth if present)

    2.5. **Competency Hierarchies**
       - Competencies themselves may include sub-competencies.
       - If a competency is conceptually broader (e.g., "Software Development") and contains more specific competencies (e.g., "Frontend Development", "Backend Development"), represent them hierarchically.
       - Apply the same nested-structure logic to sub-competencies, which can include their own skills, subskills, and lower-level skills.

    3. **Semantic Validation (Critical Step)**
       Before adding any extracted term, link, or phrase to the hierarchy:
       - Verify semantically that it represents an actual competency, skill, subskill, or lower-level ability.
       - Do NOT include items that are purely:
         • explanatory text  
         • conceptual notes  
         • examples  
         • "see also" or "related topics" references  
         • general descriptions or documentation sections
       - Include only actionable, measurable, or learnable abilities.
       - When uncertain, analyze the surrounding context:
         • If it *explains or defines* something → ignore it.  
         • If it *describes an ability, operation, or technical construct that can be learned or applied* → include it.

    4. **Hierarchy Rules**
       - Each competency or skill can have any number of nested levels (Competency → Sub-competency → Skill → Subskill → Microskill → Nanoskill → ...).
       - Maintain a consistent parent–child relationship through all levels.
       - Use `"children"` as a generic key for deeper levels beyond "Nanoskill".

    5. **Output Structure**
       - The entire response must be one valid JSON object.
       - Inside, include a list under the key `"sources"`.
       - Each source item must have:
         - `"source_url"` → the original URL
         - `"data"` → the hierarchical structure extracted for that source
       - Do NOT merge data between URLs.

    6. **Output Requirements**
       - Respond **only** with valid JSON (no Markdown, no explanations, no comments).
       - Use the following top-level format:
         {
           "sources": [
             {
               "source_url": "<URL>",
               "data": { ...hierarchical structure... }
             },
             {
               "source_url": "<URL>",
               "data": { ...hierarchical structure... }
             }
           ]
         }

    ---

    **Output Example:**

    {
      "sources": [
        {
          "source_url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
          "data": {
            "Competency": {
              "name": "JavaScript Development",
              "Subcompetencies": [
                {
                  "name": "Language Fundamentals",
                  "Skills": [
                    {
                      "name": "Core Concepts",
                      "Subskills": [
                        {
                          "name": "Syntax",
                          "Microskills": [
                            {
                              "name": "Variables",
                              "Nanoskills": ["Declaration", "Scope", "Hoisting"]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "source_url": "https://learn.microsoft.com/en-us/dotnet/",
          "data": {
            "Competency": {
              "name": ".NET Development",
              "Skills": [
                {
                  "name": "C# Programming",
                  "Subskills": [
                    {
                      "name": "OOP Fundamentals",
                      "Microskills": [
                        {
                          "name": "Encapsulation",
                          "Nanoskills": ["Access modifiers", "Properties"]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      ]
    }

    ---

    Now, extract and structure all hierarchical data from the following URLs:

    <Insert your URLs here, one per line>
    ```
  - **Input:** List of source URLs from Feature 9.1 (reference_index_url values)
  - **Expected Output:** JSON object with `sources` array, where each source contains:
    - `source_url`: the original URL
    - `data`: hierarchical structure with Competency → Sub-competencies → Skills → Subskills → Microskills → Nanoskills → ... (N-level depth)

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Get source URLs from external_sources table:**
     - Query `external_sources` table for active URLs
     - Get `reference_index_url` values from the table
     - Collect list of URLs to extract from (these are the `reference_index_url` values from `external_sources` table)
     - Prepare URLs list for AI prompt (format: one URL per line)
  
  2. **AI-based extraction:**
     - Call Gemini Deep Search API with the detailed prompt (as specified in AI Integration section)
     - **Input to prompt:** Insert the list of URLs (from `external_sources.reference_index_url`) into the prompt at `<Insert your URLs here, one per line>`
     - The prompt receives as input: list of URLs from `external_sources` table
     - AI performs deep semantic extraction for each URL separately
     - AI returns JSON response with `sources` array, where each source contains:
       - `source_url`: the original URL (matches one of the input URLs from `external_sources.reference_index_url`)
       - `data`: hierarchical structure (Competency → Sub-competencies → Skills → Subskills → Microskills → Nanoskills → ...)
  
  3. **Parse AI response:**
     - Parse JSON response to extract `sources` array
     - For each source in the `sources` array:
       - Extract `source_url` and `data`
       - Validate structure (competencies, skills, hierarchy)
       - Build internal representation of hierarchy
  
  4. **Process extracted data:**
     - For each source in the AI response:
       - Extract `source_url` and `data` from AI response
       - Prepare extracted data for validation
       - If extraction fails for any source: log error and skip that source
  
  5. **Trigger validation:**
     - After successful extraction, trigger Feature 9.5 (Validation of Extracted Data) for each extracted source
     - Pass extracted data (source_url and data) directly to validation service
  
  6. **Update source scan status:**
     - For each successfully extracted source, update `external_sources.last_scanned_at` timestamp
     - Mark sources as processed

**Dependencies:**
- Feature 9.1 (Source Discovery & Link Storage) - provides URLs to extract from
- Feature 9.5 (Validation of Extracted Data) - validates extracted data before storage

**Telemetry:**
- Track extraction attempts per source
- Monitor extraction success/failure rates
- Track extraction performance (time per source)
- Log AI API call performance
- Monitor hierarchical structure quality

**Rollout Strategy:**
- MVP: Basic extraction with Gemini Deep Search
- Phase 2: Add retry logic, error handling, batch processing
- Phase 3: Add incremental extraction (only new content), caching

---

### 9.5 Validation of Extracted Data

**Goal:** Ensure the quality, completeness, and correctness of extracted skills and competencies before storage. Validate hierarchical structure, check for missing levels, detect inconsistencies, assign confidence scores, and flag entries that need review. After successful validation, trigger Feature 9.7 to store the validated data in the database.

**Linked Functional Requirements:**
- FR 5.2.1: Initial Import

**System Components:**

**Backend:**
- Data validation service
- AI validation client (Gemini Flash/Pro)
- Validation results parser
- Validation status determiner

**Database:**
- Read operations on:
  - None (receives data directly from Feature 9.2, not from database)
- Write operations on:
  - None (validation results are passed to Feature 9.7 for storage, not stored directly)

**UI/UX Design:**
- **Has custom design:** No (background process, optional admin interface)

**External API Integrations:**
- **Uses external API:** Yes
- **API Name:** Gemini 1.5 Flash / Gemini 1.5 Pro (Deep Search)
- **Integration Points:**
  - `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` (for quick validation)
  - Gemini Deep Search API (for deep validation if needed)

**AI Integration:**
- **Uses AI:** Yes
- **AI Purpose:** Validate completeness, accuracy, and hierarchical correctness of extracted skills and competencies
- **AI Model:** Gemini 1.5 Flash / Gemini 1.5 Pro (Deep Search)
- **Prompt Specification:**
  - **Prompt:**
    ```
    You are a strict JSON validator and semantic verifier for hierarchical competency/skill extraction outputs.

    You will receive exactly one input: a JSON string produced by an extractor.

    Return only one JSON object describing the validation results.

    Do NOT modify the input JSON. Do NOT output markdown or explanations. Only JSON.

    ---

    A. JSON & Top-Level Validation

    Validate that the input is valid JSON.

    If invalid → return { "valid": false, "errors": ["<parse error>"] }.

    Confirm the top-level structure is an object containing a "sources" array.

    If missing → structural error.

    ---

    B. Per-Source Structural Checks

    For each element in sources[i]:

    "source_url" must exist and be a non-empty string.

    "data" must exist and be an object.

    "data" must contain at least one competency root key (case-insensitive):
    - Competency, competency, or skills.

    All hierarchical levels may use:
    - name, Skills, Subskills, Microskills, Nanoskills, children.

    Any other keys (e.g., description, notes, examples, see_also, overview) must be flagged as warnings (extraneous key).

    ---

    C. Hierarchy Rules

    Each item under Skills/Subskills/etc. must be:
    - an object with name, or
    - strings (treated as lowest-level nanoskill).

    No anonymous/empty names.

    Levels deeper than Nanoskills must use the key children.

    If deeper levels use any other key → flag nonstandard_key.

    Ensure no cross-source merging (duplicate identical structures across sources → potential_cross_source_duplicate).

    ---

    D. Semantic Validation (Heuristics)

    For each name:

    If length < 3 → flag too_short_name.

    If contains phrases like:
    - "overview", "introduction", "what is", "example", "see also", "related"
    → flag non_actionable.

    If name is a full sentence (>12 words) → flag likely_description.

    If contains explanatory punctuation (":", long parentheses) → flag likely_description.

    If uncertain → flag uncertain.

    No deletion — only flagging.

    ---

    E. Required Output Format

    Return exactly this structure:

    {
      "valid": boolean,
      "summary": {
        "total_sources": integer,
        "sources_valid": integer,
        "sources_with_errors": integer,
        "warnings_count": integer,
        "semantic_flags_count": integer
      },
      "sources": [
        {
          "source_url": "<url>",
          "structural_errors": ["..."],
          "warnings": ["..."],
          "semantic_flags": [
            {
              "path": "<json-pointer path>",
              "flag": "<flag name>",
              "reason": "<short reason>"
            }
          ],
          "notes": "<optional short note>"
        }
      ],
      "errors": ["<global errors if any>"]
    }

    ---

    Rules:

    valid = true ONLY if:
    - JSON parsed,
    - no structural errors,
    - no semantic_flags of type non_actionable or likely_description.

    Warnings do not invalidate the JSON.

    Output must be valid JSON, no markdown, no comments.

    ---

    F. Final Instruction

    Analyze the provided JSON and output the validation result in the JSON format above.

    Output only the validation result JSON.
    ```
  - **Input:** JSON string from Feature 9.2 (extracted hierarchical data with `sources` array)
  - **Expected Output:** JSON validation result object with:
    - `valid`: boolean (true only if no structural errors and no non_actionable/likely_description flags)
    - `summary`: validation statistics
    - `sources`: array of validation results per source (structural_errors, warnings, semantic_flags)
    - `errors`: global errors if any

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive extracted data:**
     - Receive extracted data from Feature 9.2 (JSON string with `sources` array)
     - Data format: `{ "sources": [{ "source_url": "...", "data": {...} }, ...] }`
  
  2. **AI-based validation:**
     - Call Gemini API with extracted data (JSON string) and validation prompt (as specified in AI Integration section)
     - AI performs strict JSON validation, structural checks, hierarchy rules validation, and semantic validation
     - AI returns validation results JSON with structure:
       - `valid`: boolean
       - `summary`: validation statistics
       - `sources`: array of validation results per source
       - `errors`: global errors if any
  
  3. **Parse validation results:**
     - Parse AI validation response JSON
     - Extract `valid` flag (true only if no structural errors and no non_actionable/likely_description flags)
     - Extract `summary` statistics
     - Extract `sources` array with validation results per source
     - Extract `errors` (global errors if any)
  
  4. **Process validation results per source:**
     - For each source in validation results:
       - Check `structural_errors` array (if any errors exist, source is invalid)
       - Check `warnings` array (warnings don't invalidate, but should be logged)
       - Check `semantic_flags` array:
         - If contains `non_actionable` or `likely_description` flags: source is invalid
         - Other flags (too_short_name, uncertain, etc.) are warnings
       - Determine validation status for this source:
         - If `valid = true` and no structural_errors and no non_actionable/likely_description flags: "validated"
         - If structural_errors exist or non_actionable/likely_description flags: "rejected"
         - If only warnings or minor semantic flags: "needs_review"
  
  5. **Determine overall validation status:**
     - If all sources are "validated": overall status = "validated"
     - If any source is "rejected": overall status = "rejected"
     - If any source is "needs_review": overall status = "needs_review"
  
  6. **Store validation results:**
     - Store validation results (from AI response) for each source
     - Store validation metadata (structural_errors, warnings, semantic_flags) as JSON
     - Log validation summary statistics
  
  7. **Trigger storage for validated data:**
     - If overall validation_status = "validated": Trigger Feature 9.7 (Taxonomy Storage from Web Extraction) with validated JSON data
     - If overall validation_status = "rejected": log rejection reason with details, do not proceed to storage
     - If overall validation_status = "needs_review": flag for admin review, do not proceed automatically to storage

**Dependencies:**
- Feature 9.2 (Web Deep Search & Skill Extraction) - provides extracted data to validate
- Feature 9.7 (Taxonomy Storage from Web Extraction) - triggered after successful validation to store data in database

**Telemetry:**
- Track validation attempts
- Monitor validation success/rejection rates
- Track confidence score distribution
- Monitor validation performance (time per entry)
- Log validation flags and issues frequency

**Rollout Strategy:**
- MVP: Basic AI validation with confidence scoring
- Phase 2: Add advanced validation rules, human review workflow
- Phase 3: Add machine learning-based validation improvements

---

### 9.7 Taxonomy Storage from Web Extraction

**Goal:** Receive validated JSON data from Feature 9.5 and store it in the database according to the schema. Parse hierarchical competencies and skills, detect duplicates, insert new entries, build relationships, and update MGS counts.

**Linked Functional Requirements:**
- FR 5.2.1: Initial Import

**System Components:**

**Backend:**
- Database storage service (for storing validated competencies and skills)
- Duplicate detection service (for checking existing entries)
- Hierarchy parser (for parsing and storing hierarchical relationships)
- Data transformation service (for mapping validated JSON to database schema)

**Database:**
- Read operations on:
  - `competencies` table (to check for duplicates before insertion)
  - `skills` table (to check for duplicates before insertion)
  - `competency_skills` junction table (to check existing competency-skill mappings)
  - `competency_competencies` junction table (to check existing competency relationships)
- Write operations on:
  - `competencies` table (to store validated competencies with: name, description, parent_id, source)
  - `skills` table (to store validated skills with: name, description, parent_id, source, total_mgs_count)
  - `competency_skills` junction table (to link competencies to L1 skills)
  - `competency_competencies` junction table (to store parent-child competency relationships)

**UI/UX Design:**
- **Has custom design:** No (background process, optional admin interface)

**External API Integrations:**
- **Uses external API:** No

**AI Integration:**
- **Uses AI:** No

**Algorithmic Logic:**
- **Has custom algorithm:** Yes
- **Description:**
  1. **Receive validated data:**
     - Receive validated JSON data from Feature 9.5
     - Data format: Validated hierarchical structure with competencies and skills
     - Validation status must be "validated" to proceed
  
  2. **Parse hierarchical data structure:**
     - Parse the validated JSON to extract:
       - Competencies (parent and child)
       - Skills (L1 and nested levels)
       - Competency-skill mappings
       - Competency-competency relationships (parent-child)
  
  3. **Store Competencies:**
     - For each competency in the hierarchy:
       - Check if competency exists in `competencies` table (by name)
       - If exists: Skip or update based on duplicate detection logic
       - If not exists: Insert into `competencies` table with:
         - `name`: Competency name from validated data
         - `description`: Description if available
         - `parent_id`: NULL for parent competencies, or parent competency ID for child competencies
         - `source`: "ai_extraction" or "external_import"
     - Store parent-child competency relationships in `competency_competencies` junction table:
       - For each parent-child relationship:
         - Insert into `competency_competencies` table:
           - `parent_competency_id`: ID of parent competency
           - `child_competency_id`: ID of child competency
  
  4. **Store Skills:**
     - For each skill in the hierarchy:
       - Check if skill exists in `skills` table (by name and hierarchy position)
       - If exists: Skip or update based on duplicate detection logic
       - If not exists: Insert into `skills` table with:
         - `name`: Skill name from validated data
         - `description`: Description if available
         - `parent_id`: NULL for L1 skills, or parent skill ID for nested skills
         - `source`: "ai_extraction" or "external_import"
         - `total_mgs_count`: NULL initially (will be calculated by Feature 1.4)
     - Build skill hierarchy by setting `parent_id` relationships:
       - For each skill, determine its parent skill from the hierarchy
       - Set `parent_id` to the parent skill's ID
  
  5. **Link Competencies to Skills:**
     - For each competency-skill mapping in validated data:
       - Insert into `competency_skills` junction table:
         - `competency_id`: ID of the competency
         - `skill_id`: ID of the L1 skill (top-level skill linked to competency)
     - Only link L1 skills to competencies (not nested skills)
  
  6. **Update MGS count:**
     - For each new L1 skill inserted:
       - Use Feature 1.4 (MGS Count Calculation) to calculate total MGS count
       - Count all leaf nodes (MGS) under the L1 skill
       - Update `total_mgs_count` field in `skills` table
  
  7. **Handle duplicates:**
     - If duplicate competency/skill detected:
       - Log duplicate with details (name, source, existing ID)
       - Skip insertion or merge based on business logic
       - Return summary of inserted vs duplicate items
  
  8. **Return storage results:**
     - Return summary of storage operations:
       - Count of competencies inserted
       - Count of skills inserted
       - Count of duplicates skipped
       - Count of relationships created
       - List of errors (if any)
     - Log storage summary statistics

**Dependencies:**
- Feature 9.5 (Validation of Extracted Data) - provides validated data to store
- Feature 1.1 (Skill Hierarchy Management) - for storing skill hierarchy
- Feature 1.2 (Competency Structure Management) - for storing competency structure
- Feature 1.4 (MGS Count Calculation) - for updating MGS count after storage

**Telemetry:**
- Track database storage operations (competencies inserted, skills inserted, duplicates skipped)
- Monitor storage performance (time per insertion)
- Track MGS count calculation performance
- Log storage errors and rollback events
- Monitor duplicate detection rate
- Track relationship creation statistics

**Rollout Strategy:**
- MVP: Basic storage with duplicate detection
- Phase 2: Add advanced duplicate detection and merge logic, batch insertion optimization
- Phase 3: Add transaction rollback on errors, parallel processing for large datasets

---

**Document Created:** 2025-01-27  
**Last Updated:** 2025-01-27

