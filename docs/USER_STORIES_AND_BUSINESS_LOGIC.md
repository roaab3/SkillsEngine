# Skills Engine - User Stories & Business Logic

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27

---

## 📋 Table of Contents

1. [User Stories](#user-stories)
2. [Business Logic Flows](#business-logic-flows)

---

## 👥 User Stories

### Employee Interactions (Viewing & Progress)

#### US-1: View Skills & Proficiency
**As an** Employee  
**I want to** view my complete verified skill profile, organized by Competency  
**So that** I can understand my proficiency level in each domain

**Acceptance Criteria:**
- Frontend displays Proficiency Level (e.g., ADVANCED) for each Competency
- Frontend displays Coverage Percentage (e.g., 70% complete) for each domain
- Skills are organized by Competency in an intuitive format
- Related to: FR-8.1.3, FR-8.1.4

#### US-2: Track Progress
**As an** Employee  
**I want to** see my overall Relevance Score against my Career Path Goal  
**So that** I can understand my overall progress in a single metric

**Acceptance Criteria:**
- Relevance Score is displayed prominently
- Score is calculated based on verified MGS for Career Path
- Score updates automatically after assessments
- Related to: FR-3.5.1, FR-4.5.4

#### US-3: Identify Skill Gaps
**As an** Employee  
**I want to** see a categorized list of missing Most Granular Skills (MGS)  
**So that** I can understand which Competencies need improvement and prioritize my learning

**Acceptance Criteria:**
- Broad Gap Analysis report is displayed
- Missing MGS are presented in categorized format (Structured MAP)
- Skills are grouped under their parent Competency
- Clear indication of which Competency needs improvement
- Related to: FR-8.3.1, FR-8.3.2, FR-8.3.3

#### US-4: Drill Down into Verified Skills
**As an** Employee  
**I want to** drill down within a Competency card to see specific verified MGS  
**So that** I can see exactly which skills I have successfully verified

**Acceptance Criteria:**
- Can expand Competency cards to see detailed MGS
- Verified MGS are clearly marked (verified=true)
- Unverified MGS are also visible for comparison
- Related to: FR-8.2.1, FR-8.2.2

---

### Trainer Interactions (Management & Profile)

#### US-5: Upload Custom Skills
**As a** Trainer  
**I want to** upload custom skill taxonomies using a CSV file  
**So that** I can integrate specialized or internal company skills that may not be in the universal taxonomy

**Acceptance Criteria:**
- CSV upload functionality is available (only to Trainers)
- Hierarchical structure is preserved
- Data undergoes AI normalization
- New skills become available for use in Course Builder and Learner AI
- Access control enforced on both frontend and backend
- Related to: FR-7.1, FR-7.2, FR-7.3

#### US-6: View Personal Profile
**As a** Trainer  
**I want to** view my own comprehensive skill profile  
**So that** I can track my own proficiency and identify my own gaps, just like any employee

**Acceptance Criteria:**
- Same viewing capabilities as Employees
- Can see Proficiency Levels and Coverage Percentages
- Can see Relevance Score
- Can identify skill gaps
- Related to: US-1, US-2, US-3

---

### System Integration User Stories

#### US-7: Course Builder Skill Discovery
**As** Course Builder (MS #3)  
**I want to** request skills for a given Competency Name  
**So that** I can dynamically enrich and complete the competency taxonomy when mapping courses

**Acceptance Criteria:**
- Synchronous API endpoint available
- AI normalization and fuzzy matching applied
- If missing, triggers External Knowledge Discovery
- Returns full list of MGS associated with competency
- Related to: FR-5.1

#### US-8: Content Studio Skill Lookup
**As** Content Studio (MS #4)  
**I want to** request skills for a given Competency Name from verified internal data only  
**So that** I can generate lesson content based on reliable, verified skills

**Acceptance Criteria:**
- Synchronous API endpoint available
- Lookup only within existing internal database
- No dynamic discovery triggered
- Fast, stable responses
- Related to: FR-6.1

#### US-9: Learner AI Skill Lookup
**As** Learner AI (MS #7)  
**I want to** request skills for a given Competency Name from verified internal data only  
**So that** I can build learning plans and recommend courses based on reliable skill data

**Acceptance Criteria:**
- Synchronous API endpoint available
- Lookup only within existing internal database
- No dynamic discovery triggered
- Fast, stable responses
- Related to: FR-6.1

#### US-10: Assessment Results Processing
**As** Assessment (MS #5)  
**I want to** send exam results (Baseline or Course) to Skills Engine  
**So that** user profiles can be updated with verified skills and competency levels recalculated

**Acceptance Criteria:**
- Asynchronous API endpoint for sending results
- Results include: skill ID, skill name, status (PASS/FAIL), exam type
- Skills are updated in user profile
- Competency levels are recalculated
- Gap analysis is triggered
- Related to: FR-3.1, FR-3.2, FR-3.3

#### US-11: Directory Profile Retrieval
**As** Directory (MS #1)  
**I want to** retrieve skill and competency summaries for users  
**So that** I can display comprehensive user profiles in dashboards

**Acceptance Criteria:**
- Synchronous API endpoint available
- Returns Competencies, verified skills, proficiency levels
- Returns Coverage Percentages and Relevance Score
- Returns secure URL link to Skills Engine's expanded profile page
- Users can navigate from Directory summary to full Skills Engine profile
- Related to: FR-3.9, FR-9.1

#### US-12: Learning Analytics Data Retrieval
**As** Learning Analytics (MS #8)  
**I want to** retrieve individual user profiles and aggregate team competency statuses  
**So that** I can generate reports and insights for managers and organizations

**Acceptance Criteria:**
- Synchronous API endpoint available
- Individual user data: verified skills, proficiency levels, coverage percentages, Relevance Score
- Team-level aggregation: consolidated view of team capabilities
- Accurate, up-to-date information
- Related to: FR-9.1, FR-9.2, FR-9.3

#### US-13: RAG Data Access
**As** RAG/Chatbot (MS #7)  
**I want to** access canonical taxonomy and user profiles  
**So that** I can provide skill-aware guidance and context-aware responses

**Acceptance Criteria:**
- Secure data sharing mechanism
- Access to canonical database of Competencies and Skills
- Access to individual user profiles (Competencies, verified skills, proficiency levels, Coverage Percentages, Relevance Score)
- Real-time query support
- Related to: FR-10.1, FR-10.2

---

## 🔄 Business Logic Flows

### 🛠️ Essential Data Structure

**Critical Split User Profile Structure:**
- **L1 Skills:** Stored in separate `userSkill` database table
- **MGS (Most Granular Skills):** Stored in `verifiedSkills` (JSON) field within `userCompetency` database table

---

### FLOW 1: Taxonomy Initialization and Construction

**Trigger:** System initialization  
**Purpose:** Build and maintain the master skill database

#### Steps:
1. **Discovery and Normalization**
   - Identify and compile authoritative sources (URLs/APIs)
   - AI returns JSON Array containing 40-50 source records with complete metadata
   - Persist official sources after AI extraction:
     - Receive JSON Array from AI
     - Perform basic validation (required fields, null checks, unique source_id, URL validation)
     - Perform data cleaning (trim whitespace, normalize values, remove duplicates)
     - Store each source in `official_sources` table with all fields (source_id, source_name, reference_index_url, reference_type, access_method, hierarchy_support, provides, topics_covered, skill_focus, notes)
   - Maintain persistent list of all official sources discovered by AI
   - Enable querying and retrieval of official sources list for future updates and validation
   - Support periodic re-checking of sources to ensure they remain valid
   - Track which sources have been successfully used for data extraction
   - Retrieve raw data via web scraping
   - Apply AI Normalization to unify synonyms, correct errors, prevent duplicates
   - Validate hierarchical structure and content
   - Remove unnecessary items

2. **Schema Construction**
   - Store skill units in master Skills table
   - Store competencies in master Competencies table
   - Define Parent → Child hierarchical relationships in junction tables:
     - `skill_subSkill` table
     - `competency_subCompetency` table
   - Define list of required Skills for each Competency

3. **Leaf Node Calculation**
   - Recursively count all MGS under each primary L1 Skill
   - Use taxonomy structure to traverse hierarchy
   - Save MGS Count (`leaf_node_count`) in the L1 record

4. **Commit**
   - Commit all master and junction tables to Skills Taxonomy Database
   - Result: verified, structured, and normalized Skills Taxonomy ready for use

**Related Requirements:** FR-1.1, FR-1.1.5, FR-1.2, FR-1.3, FR-1.4, FR-1.5

---

### FLOW 2: User Profile Creation and Initialization

**Trigger:** Asynchronously when new user joins via Directory (MS #1)  
**Purpose:** Create initial user profile from raw data and prepare for baseline exam

#### Steps:
1. **Data Ingestion and Extraction**
   - Receive basic user info: name, user ID, company ID, employee type, target career goal
   - Receive Raw Data (e.g., LinkedIn, GitHub)
   - AI extracts initial Competencies, L1 Skills, and inferred MGS from raw data
   - Perform AI-based normalization to align with canonical Skills Taxonomy

2. **Profile Storage and Initialization**
   - **L1 Skills:** Save to `userSkill` table
   - **MGS:** Save to `verifiedSkills` (JSON) field within `userCompetency`
   - Initialize all MGS to `verified=false`
   - Include skill ID, skill name, and update date for each skill

3. **Baseline Exam Scope**
   - Retrieve all required MGS from Skills Taxonomy that fall under identified L1 Skills that belong to each competency
   - Ensures broad assessment of user's claimed knowledge per competency

4. **Assessment Request**
   - Send synchronous API request to Assessment service (MS #5)
   - Include list of all MGS to be tested

5. **Initial Relevance Score**
   - Calculate initial Relevance Score against Target Career Goal
   - Based on currently loaded (unverified) MGS

6. **Return Initial Profile**
   - Return to Directory: list of all Competencies, L1 Skills associated with each competency
   - Include secure URL link to Skills Engine's expanded profile page (Dedicated Skills Profile Page)
   - Purpose: Allow users to navigate from Directory summary to full Skills Engine profile

**Related Requirements:** FR-2.1, FR-2.2, FR-2.3, FR-2.4, FR-2.5

---

### FLOW 3: Baseline Exam Results Processing

**Trigger:** Receives results from Assessment service after Baseline Exam  
**Purpose:** Process initial placement exam results and establish verified skill baseline

#### Steps:
1. **Result Ingestion**
   - Receive Full MGS Status List from Assessment
   - Each result includes: skill ID, skill name, status (PASS/FAIL), exam type (Baseline)

2. **MGS Verification Update**
   - Iterate over list of results
   - For every MGS with status = "PASS":
     - Update corresponding record in `verifiedSkills` (JSON) field within `userCompetency`
     - Set `verified=true`
   - For every MGS with status = "FAIL":
     - Keep `verified=false`
   - Update `last_evaluate` timestamp

3. **Proficiency Calculation**
   - Calculate Coverage Percentage: `(Verified MGS / Total Required MGS) × 100`
   - Map percentage to descriptive Proficiency Level:
     - BEGINNER: 0% - 30%
     - INTERMEDIATE: 31% - 65%
     - ADVANCED: 66% - 85%
     - EXPERT: 86% - 100%
   - Store in `CoveragePercentage` field and proficiency level in `userCompetency` table

4. **Gap Analysis**
   - Perform Broad Gap Analysis against user's Career Path Goal
   - Generate structured map of missing MGS
   - Recalculate Relevance Score based on newly verified skills:
     - Formula: `(Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100`

5. **Reporting and UI**
   - Send updates to Directory:
     - Include updated profile data (Competencies, tested MGS with verification status, Coverage Percentage, Relevance Score)
     - Include secure URL link to Skills Engine's expanded profile page
     - Allow users to navigate from Directory summary to full Skills Engine profile
   - Send updates to Learner AI
   - Update Skills Engine's internal UI:
     - Reflect new scores and verification statuses
     - Show detailed Drill Down view with both `verified=true` and `verified=false` MGS

**Related Requirements:** FR-3.1, FR-3.2, FR-3.3, FR-3.4, FR-3.5, FR-3.6, FR-3.7, FR-3.8, FR-3.9

---

### FLOW 4: Post-Course Exam and Conditional Gap Analysis

**Trigger:** Receives course exam results from Assessment service  
**Purpose:** Process course exam results and adjust gap analysis scope based on success or failure

#### Steps:
1. **Ingestion and Lookup**
   - Receive `course_name` (unique) and MGS List Passed
   - Use `course_name` to look up:
     - Target Competency ID
     - Course Coverage Map from Skills Taxonomy

2. **JSON Update**
   - Identify correct `userCompetency` record
   - Iterate through MGS List Passed
   - For each passed MGS:
     - Add/update in `verifiedSkills` (JSON) field
     - Set `verified=true`
     - Add skill under corresponding Competency

3. **Proficiency Calculation**
   - If `exam_status = "Pass"`:
     - Recalculate Coverage Percentage for associated Competency
     - Recalculate Competency level using Coverage Percentage formula
     - Map to proficiency level (BEGINNER → EXPERT)

4. **Relevance Score Calculation**
   - Calculate Relevance Score as part of profile update:
     - Formula: `(Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100`

5. **Conditional Gap Analysis**
   - **IF PASS:**
     - Trigger Broad Gap Analysis against Career Path Goal
     - Find all missing MGS across all competencies in career path
   - **IF FAIL:**
     - Trigger Narrow Gap Analysis against Course Coverage Map
     - Find missing MGS within that specific Competency only
     - Scope: Only the MGS tested by the specific course

6. **Structure Gap Analysis Results**
   - Collect all required MGS
   - Compare against user's verified skills
   - Produce structured map:
     - Key: Competency ID or name
     - Value: List of missing MGS under that Competency

7. **Reporting**
   - Send structured map of missing skills to Learner AI (asynchronously)
   - Include: exam status, missing skills map, Relevance Score, relevant course or competency details
   - Send profile update to Directory:
     - Include updated profile data
     - Include secure URL link to Skills Engine's expanded profile page
     - Allow users to navigate from Directory summary to full Skills Engine profile
   - Update internal UI
   - Generate secure URL for Dedicated Skills Profile Page

**Related Requirements:** FR-3.10, FR-3.11, FR-3.12, FR-3.13, FR-3.14, FR-3.15, FR-3.16

---

### FLOW 5: On-Demand Skill Discovery

**Trigger:** Synchronous API request from other microservices for Competency Name  
**Purpose:** Handle skill data requests with different behaviors based on calling service

#### Steps:
1. **Request Handling**
   - Receive synchronous API request for Competency Name
   - Identify calling service
   - First perform Lookup in internal DB

2. **Course Builder (MS #3) Path:**
   - Apply AI Normalization (Fuzzy Match) to requested competency name
   - If skill/competency is missing or incomplete:
     - Trigger External Knowledge Discovery AI Tool
     - Perform broad search across the internet
     - Normalize new findings
     - Store in taxonomy
     - Return discovered data
   - Once competency and all underlying MGS are confirmed:
     - Return full list of MGS associated with that competency
   - Enables dynamic enrichment and import of new data

3. **Content Studio (MS #4) / Learner AI (MS #7) Path:**
   - Perform Lookup Only against existing internal DB
   - Retrieve and return relevant MGS
   - Do NOT trigger dynamic discovery or import
   - Ensure fast, stable responses using verified internal data only

**Related Requirements:** FR-5.1, FR-5.2, FR-6.1

---

### FLOW 6: External Data Integration and Support

**Trigger:** Various (Trainer upload, RAG requests, Learning Analytics requests)  
**Purpose:** Handle administrative tasks and system integration

#### Steps:

**6.1 Trainer Upload:**
1. User with Trainer role uploads CSV of custom hierarchical skills
2. Access Control enforced (frontend and backend)
3. Parse CSV file
4. Apply AI Normalization:
   - Standardize names
   - Prevent duplicates
5. Preserve hierarchical relationships between Competencies, Skills, and MGS
6. Integrate data into Skills Taxonomy DB
7. Newly added skills and competencies become available for:
   - Course Builder
   - Learner AI
   - Other dependent microservices

**6.2 RAG Integration:**
1. Skills Engine securely shares data with RAG microservice (chatbot)
2. Shared data includes:
   - Canonical Taxonomy (Competencies and Skills)
   - Verified User Profiles:
     - Competencies
     - Verified skills
     - Proficiency Levels
     - Coverage Percentages
     - Relevance Score
3. Support real-time queries
4. Enable skill-aware guidance and context-aware responses

**6.3 Learning Analytics (MS #8) Retrieval:**
1. Process synchronous API requests from Learning Analytics
2. **For Individual User:**
   - Query `userCompetency` table
   - Find all records matching provided `id_user`
   - Retrieve full set of Competencies
   - Return: verified skills, proficiency levels, coverage percentages, Relevance Score
3. **For Team-Level:**
   - Aggregate competency status across all requested users
   - Provide consolidated view of team capabilities
   - Support team-level reporting and analysis

**Related Requirements:** FR-7.1, FR-7.2, FR-7.3, FR-7.4, FR-9.1, FR-9.2, FR-9.3, FR-9.4, FR-10.1, FR-10.2, FR-10.3, FR-10.4

---

## 📊 Key Data Structures

### User Profile Structure
- **L1 Skills:** Stored in `userSkill` table
- **MGS (Most Granular Skills):** Stored in `verifiedSkills` (JSON) field within `userCompetency` table

### Proficiency Levels
- **BEGINNER:** 0% - 30% coverage
- **INTERMEDIATE:** 31% - 65% coverage
- **ADVANCED:** 66% - 85% coverage
- **EXPERT:** 86% - 100% coverage

### Formulas
- **Coverage Percentage:** `(Count of verified MGS / Total Required MGS for Competency) × 100`
- **Relevance Score:** `(Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100`

---

**Last Updated:** 2025-01-27

