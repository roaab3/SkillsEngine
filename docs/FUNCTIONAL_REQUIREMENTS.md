# Skills Engine - Functional Requirements

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27

---

## 📋 Table of Contents

1. [System Initialization & Skills Taxonomy Building](#1-system-initialization--skills-taxonomy-building)
2. [User Onboarding & Profile Creation](#2-user-onboarding--profile-creation)
3. [Update User Profile](#3-update-user-profile)
4. [Gap Analysis](#4-gap-analysis)
5. [Competency Retrieval for Dynamic Taxonomy Enrichment](#5-competency-retrieval-for-dynamic-taxonomy-enrichment)
6. [Competency Lookup for Verified Skills Access](#6-competency-lookup-for-verified-skills-access)
7. [Trainer CSV Upload](#7-trainer-csv-upload)
8. [Frontend Display Requirements](#8-frontend-display-requirements)
9. [Learning Analytics Integration](#9-learning-analytics-integration)
10. [RAG Integration](#10-rag-integration)

---

## 1. System Initialization & Skills Taxonomy Building

### 1.1 Official Sources Discovery
- **FR-1.1.1:** Upon system initialization, discover and prepare official sources for skills and competencies
- **FR-1.1.2:** AI identifies and compiles a list of URLs and APIs that serve as authoritative references
- **FR-1.1.3:** Check each source against the database and add any new sources to the official sources list
- **FR-1.1.4:** Verify and store all official sources

### 1.1.5 Persist Official Sources After AI Extraction
- **FR-1.1.5.1:** After AI completes discovery and returns list of official sources in JSON format, system must persist these records in dedicated database table
- **FR-1.1.5.2:** Receive JSON Array containing 40-50 records from AI
- **FR-1.1.5.3:** Each record includes the following fields:
  - `source_id` (unique identifier)
  - `source_name` (name of the source)
  - `reference_index_url` (URL to the source)
  - `reference_type` (type: API, Documentation, Standard, etc.)
  - `access_method` (how to access: API, Web Scraping, etc.)
  - `hierarchy_support` (whether source supports hierarchical data)
  - `provides` (what the source provides: skills, competencies, etc.)
  - `topics_covered` (topics/domains covered by source)
  - `skill_focus` (specific skills focus area)
  - `notes` (additional notes or metadata)
- **FR-1.1.5.4:** Perform basic validation:
  - Check that all required fields exist
  - Check for null values or missing data
  - Verify that `source_id` is unique
  - Validate URL format and accessibility
- **FR-1.1.5.5:** Perform data cleaning:
  - Remove whitespace (trim)
  - Normalize values (e.g., reference_type, access_method)
  - Remove duplicates
- **FR-1.1.5.6:** Store each source in `official_sources` table
- **FR-1.1.5.7:** Saved data will be used by other system modules for:
  - Source display (dashboards)
  - Search and update operations
  - Control processes or data completion

### 1.2 AI-Guided Data Extraction
- **FR-1.2.1:** Retrieve raw data via web scraping from official sources
- **FR-1.2.2:** Validate hierarchical structure and content
- **FR-1.2.3:** Remove unnecessary items
- **FR-1.2.4:** Apply AI normalization to unify synonyms, correct errors, and prevent duplicates

### 1.3 Schema Construction
- **FR-1.3.1:** Store skill units in the master Skills table
- **FR-1.3.2:** Store competencies in the master Competencies table
- **FR-1.3.3:** Establish Parent → Child relationships in `skill_subSkill` table
- **FR-1.3.4:** Establish Parent → Child relationships in `competency_subCompetency` table
- **FR-1.3.5:** Define the list of required Skills for each Competency

### 1.4 Leaf Node Count Calculation
- **FR-1.4.1:** Compute and store the leaf node count for each primary/root skill (L1)
- **FR-1.4.2:** Recursively query the `skill_subSkill` table
- **FR-1.4.3:** Count all Most Granular Skills (MGS) under each root skill
- **FR-1.4.4:** Save the result in a dedicated field (e.g., `leaf_node_count`) in the corresponding L1 record

### 1.5 Database Commit
- **FR-1.5.1:** Commit all master and junction tables to the Skills Taxonomy Database
- **FR-1.5.2:** Result: verified, structured, and normalized Skills Taxonomy ready for use

---

## 2. User Onboarding & Profile Creation

### 2.1 User Creation Request
- **FR-2.1.1:** Asynchronously receive user creation request from Directory
- **FR-2.1.2:** Receive basic user information: name, user ID, company ID, employee type, target career goal
- **FR-2.1.3:** Receive raw data collected from external sources (LinkedIn, GitHub, etc.)

### 2.2 Skills & Competencies Extraction
- **FR-2.2.1:** Extract by usin AI Competencies and Skills from raw data
- **FR-2.2.2:** Perform AI-based normalization to align with canonical Skills Taxonomy database
- **FR-2.2.3:** Avoid duplicates during extraction

### 2.3 Profile Building
- **FR-2.3.1:** For each derived competency, create profile record in `userCompetency` table
- **FR-2.3.2:** For each skill and Most Granular Skill (MGS), store in `userSkills` table
- **FR-2.3.3:** Initialize every skill as `verified=false`
- **FR-2.3.4:** Include skill ID, skill name, and update date for each skill

### 2.4 Return Initial Profile
- **FR-2.4.1:** Return to Directory a list of all Competencies held by the user based on raw data
- **FR-2.4.2:** Return L1 Skills associated with each competency that the user possesses
- **FR-2.4.3:** Include secure URL link to Skills Engine's expanded profile page (Dedicated Skills Profile Page)
- **FR-2.4.4:** Purpose: Allow users to navigate from Directory summary to full Skills Engine profile

### 2.5 Baseline Exam Preparation
- **FR-2.5.1:** Prepare the Baseline Exam based solely on the MGS to establish the user's starting point
- **FR-2.5.2:** Send API request to Assessment service (MS #5) to initiate skill verification

---

## 3. Update User Profile

### 3.1 Common Profile Update Process

#### 3.1.1 Receive Assessment Results
- **FR-3.1.1:** Receive assessment results from Assessment microservice
- **FR-3.1.2:** Each question is associated with a specific skill
- **FR-3.1.3:** Each result includes: skill ID, skill name, status (PASS or FAIL), exam type (Baseline or Course)

#### 3.1.2 Update Verified Skills
- **FR-3.2.1:** Iterate over the list of results
- **FR-3.2.2:** Update corresponding skills in `userCompetency` table
- **FR-3.2.3:** If skill status = PASS: change status from `false` to `true` in `verifiedSkill` JSON field
- **FR-3.2.4:** If skill status = FAIL: keep `verified = false`
- **FR-3.2.5:** Update `last_evaluate` timestamp

#### 3.1.3 Calculate Coverage Percentage
- **FR-3.3.1:** Calculate Coverage Percentage for each Competency
- **FR-3.3.2:** Formula: `Coverage Percentage = (Count of verified MGS / Total Required MGS for Competency) × 100`
- **FR-3.3.3:** Store in `CoveragePercentage` field

#### 3.1.4 Map to Proficiency Level
- **FR-3.4.1:** Map Coverage Percentage to one of four proficiency levels:
  - **BEGINNER:** 0% - 30% coverage
  - **INTERMEDIATE:** 31% - 65% coverage
  - **ADVANCED:** 66% - 85% coverage
  - **EXPERT:** 86% - 100% coverage
- **FR-3.4.2:** Store proficiency level in `userCompetency` table

#### 3.1.5 Calculate Relevance Score
- **FR-3.5.1:** Calculate Relevance Score as part of profile update:
  - Formula: `Relevance Score = (Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100`

### 3.2 Baseline Exam Processing Flow

#### 3.2.1 Receive Baseline Exam Results
- **FR-3.6.1:** Receive assessment results from Assessment microservice for Baseline Exam
- **FR-3.6.2:** Each result includes: skill ID, skill name, status (PASS or FAIL), exam type (Baseline)

#### 3.2.2 Update Profile (Common Process)
- **FR-3.7.1:** Execute common profile update process (FR-3.1.2 through FR-3.1.5)

#### 3.2.3 Trigger Broad Gap Analysis
- **FR-3.8.1:** Perform Broad Gap Analysis against Career Path Goal
- **FR-3.8.2:** Relevance Score calculated during Gap Analysis (per FR-3.5.1)

#### 3.2.4 Return Updated Profile
- **FR-3.9.1:** Return updated profile to Directory
- **FR-3.9.2:** Include: Competencies, initial skills, tested MGS with verification status, Coverage Percentage, Relevance Score
- **FR-3.9.3:** Include secure URL link to Skills Engine's expanded profile page (Dedicated Skills Profile Page)
- **FR-3.9.4:** Purpose: Allow users to navigate from Directory summary to full Skills Engine profile

### 3.3 Course Exam Processing Flow

#### 3.3.1 Receive Course Exam Results
- **FR-3.10.1:** Receive feedback from Assessment microservice after course exam
- **FR-3.10.2:** Includes: exam status (PASS or FAIL), list of skills marked as passed
- **FR-3.10.3:** May include multiple attempts

#### 3.3.2 Update Profile (Common Process)
- **FR-3.11.1:** Execute common profile update process (FR-3.1.2 through FR-3.1.5)
- **FR-3.11.2:** For each passed skill:
  - Add skill under corresponding Competency
  - Mark as `verified = true`

#### 3.3.3 Trigger Gap Analysis
- **FR-3.12.1:** If exam status = FAIL:
  - Perform Narrow Gap Analysis against specific Competency associated with course
- **FR-3.12.2:** If exam status = PASS:
  - Perform Broad Gap Analysis against full Career Path Goal

#### 3.3.4 Structure Gap Analysis Results
- **FR-3.13.1:** Collect all required MGS
- **FR-3.13.2:** Compare against user's verified skills
- **FR-3.13.3:** Produce structured map:
  - Key: Competency ID or name
  - Value: List of missing MGS under that Competency

#### 3.3.5 Send to Learner AI
- **FR-3.14.1:** Send structured map asynchronously to Learner AI (MS #7)
- **FR-3.14.2:** Include: exam status, missing skills map, Relevance Score, relevant course or competency details

#### 3.3.6 Provide Frontend URL
- **FR-3.15.1:** Generate secure URL rendering Dedicated Skills Profile Page
- **FR-3.15.2:** Display missing skills derived from Broad Gap Analysis
- **FR-3.15.3:** Display Relevance Score
- **FR-3.15.4:** Enforce access control: "Upload File" button visible only to users with Trainer employee type

#### 3.3.7 Handle Learning Analytics Requests
- **FR-3.16.1:** Process synchronous API requests from Learning Analytics (MS #8)
- **FR-3.16.2:** Retrieve individual verified profiles
- **FR-3.16.3:** Retrieve aggregate team competency statuses for reporting

---

## 4. Gap Analysis

### 4.1 Recurrent Traversal
- **FR-4.1.1:** Start from user's Career Path Goal or specific Competency
- **FR-4.1.2:** Recursively traverse the skills hierarchy to collect all required Most Granular Skills (MGS)
- **FR-4.1.3:** If node is an MGS, add to "total requirement list"
- **FR-4.1.4:** If node is a nested Competency, recursively expand all components until all descendant MGS are collected
- **FR-4.1.5:** Result: flattened list of all required MGS for the target, without duplicates

### 4.2 Comparison Against User Profile
- **FR-4.2.1:** Iterate over the flattened list
- **FR-4.2.2:** Check user's profile for each MGS
- **FR-4.2.3:** Classify each MGS as either:
  - Already verified (`verified=true`)
  - Missing (`verified=false` or not present in profile)
- **FR-4.2.4:** Produce final list of missing MGS

### 4.3 Aggregation and Mapping
- **FR-4.3.1:** Map each missing MGS back to its closest high-level Competency
- **FR-4.3.2:** Group missing skills under their corresponding Competencies
- **FR-4.3.3:** Form structured key-value map:
  - Key: Competency name (including nested levels)
  - Value: List of missing MGS
- **FR-4.3.4:** Ensure both count and organization of missing skills for reporting and learning guidance

### 4.4 Narrow Gap Analysis
- **FR-4.4.1:** Perform Narrow Gap Analysis against specific Competency
- **FR-4.4.2:** Scope: Only the Competency associated with the course/exam
- **FR-4.4.3:** Find missing MGS within that competency only

### 4.5 Broad Gap Analysis
- **FR-4.5.1:** Perform Broad Gap Analysis against full Career Path Goal
- **FR-4.5.2:** Scope: Entire Career Path Goal
- **FR-4.5.3:** Find all missing MGS across all competencies in career path
- **FR-4.5.4:** Calculate Relevance Score during analysis:
  - Formula: `Relevance Score = (Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100`

---

## 5. Competency Retrieval for Dynamic Taxonomy Enrichment

### 5.1 API Endpoint for Course Builder
- **FR-5.1.1:** Expose synchronous API endpoint to process requests for given Competency Name originating from Course Builder (MS #3)
- **FR-5.1.2:** Apply AI normalization to perform fuzzy match of the requested competency name
- **FR-5.1.3:** If competency or its associated skills are missing or incomplete in internal database:
  - Trigger External Knowledge Discovery process (per FR-5.2)
- **FR-5.1.4:** Once competency and all underlying Most Granular Skills (MGS) are confirmed:
  - Return full list of MGS associated with that competency
- **FR-5.1.5:** Ensure Course Builder can enrich and complete competency taxonomy dynamically

### 5.2 External Knowledge Discovery
- **FR-5.2.1:** This process is triggered by the API endpoint (FR-5.1) when a competency is missing or incomplete
- **FR-5.2.2:** When triggered for missing competency:
  - First perform internal lookup
- **FR-5.2.3:** If not found internally:
  - Perform broad search using External Knowledge Discovery AI Tool across the internet
- **FR-5.2.4:** Normalize new findings (per FR-7.3)
- **FR-5.2.5:** Store in taxonomy
- **FR-5.2.6:** Return discovered data to the API endpoint (FR-5.1)
- **FR-5.2.7:** Used by Course Builder for dynamic enrichment (via FR-5.1)
- **FR-5.2.8:** Not used by Content Studio or Learner AI (they use verified internal data only)

---

## 6. Competency Lookup for Verified Skills Access

### 6.1 API Endpoint for Content Studio and Learner AI
- **FR-6.1.1:** Expose synchronous API endpoint to process requests for given Competency Name originating from Content Studio (MS #4) or Learner AI (MS #7)
- **FR-6.1.2:** Perform lookup only within existing internal database
- **FR-6.1.3:** Retrieve and return relevant Most Granular Skills (MGS)
- **FR-6.1.4:** Do NOT trigger dynamic discovery or import
- **FR-6.1.5:** Ensure Content Studio and Learner AI rely only on verified internal data
- **FR-6.1.6:** Provide fast and stable responses using verified internal data only

---

## 7. Trainer CSV Upload

### 7.1 CSV Upload Functionality
- **FR-7.1.1:** Allow users with Trainer employee type to upload CSV file
- **FR-7.1.2:** CSV contains custom skills and competencies organized in hierarchical structure
- **FR-7.1.3:** Enforce access control on frontend: only Trainers can see "Upload File" button
- **FR-7.1.4:** Enforce access control on backend: verify Trainer role before processing

### 7.2 CSV Processing
- **FR-7.2.1:** Parse CSV file upon upload
- **FR-7.2.2:** Integrate data into internal database
- **FR-7.2.3:** Preserve hierarchical relationships between Competencies, Skills, and Most Granular Skills (MGS)

### 7.3 AI Normalization
- **FR-7.3.1:** Apply AI normalization to uploaded data
- **FR-7.3.2:** Standardize names
- **FR-7.3.3:** Prevent duplicates

### 7.4 Data Availability
- **FR-7.4.1:** After processing, newly added skills and competencies become available
- **FR-7.4.2:** Available for use in Course Builder, Learner AI, and other dependent microservices

---

## 8. Frontend Display Requirements

### 8.1 Competency Status Display
- **FR-8.1.1:** Display user's current competency status using both descriptive and quantitative metrics
- **FR-8.1.2:** Each relevant Competency presented as separate card or section
- **FR-8.1.3:** Show descriptive proficiency level: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
- **FR-8.1.4:** Show exact Coverage Percentage (number of verified MGS / total required MGS)

### 8.2 Verified Skills Display
- **FR-8.2.1:** Allow users to drill down within Competency card
- **FR-8.2.2:** Display specific MGS that have been successfully verified (`verified=true`)

### 8.3 Missing Skills Display
- **FR-8.3.1:** Present missing skills derived from Broad Gap Analysis
- **FR-8.3.2:** Use structured MAP provided by Skills Engine
- **FR-8.3.3:** Group missing MGS under their parent Competency
- **FR-8.3.4:** Example: All missing skills related to JavaScript, React, CSS appear under "Frontend Development"
- **FR-8.3.5:** Enable clear, categorized display for understanding learning gaps

### 8.4 User Experience Goals
- **FR-8.4.1:** Enable users to understand their learning gaps
- **FR-8.4.2:** Enable users to prioritize skill acquisition
- **FR-8.4.3:** Enable users to take necessary next steps to improve Relevance Score
- **FR-8.4.4:** Enable users to progress toward career goals

---

## 9. Learning Analytics Integration

### 9.1 User Data Retrieval
- **FR-9.1.1:** Process synchronous API requests from Learning Analytics (MS #8)
- **FR-9.1.2:** When requested for specific user:
  - Query `userCompetency` table
  - Find all records matching provided `id_user`
  - Retrieve full set of Competencies associated with that user

### 9.2 Return User Data
- **FR-9.2.1:** Return relevant Competency data including:
  - Verified skills
  - Proficiency levels
  - Coverage percentages
  - Relevance Score

### 9.3 Team Data Retrieval
- **FR-9.3.1:** For team-level requests:
  - Aggregate competency status across all requested users
  - Provide consolidated view of team capabilities

### 9.4 Data Accuracy
- **FR-9.4.1:** Ensure Learning Analytics receives accurate, up-to-date information
- **FR-9.4.2:** Support individual user reporting
- **FR-9.4.3:** Support team-level reporting and analysis

---

## 10. RAG Integration

### 10.1 Data Sharing
- **FR-10.1.1:** Integrate with RAG microservice (system chatbot)
- **FR-10.1.2:** Share comprehensive information about skills ecosystem
- **FR-10.1.3:** Share user profiles

### 10.2 Shared Data Content
- **FR-10.2.1:** Canonical database of Competencies and Skills maintained by Skills Engine
- **FR-10.2.2:** Individual user profiles including:
  - Competencies
  - Verified skills
  - Proficiency levels
  - Coverage percentages
  - Relevance Score

### 10.3 Integration Requirements
- **FR-10.3.1:** Ensure RAG has access to up-to-date, structured information
- **FR-10.3.2:** Support real-time queries
- **FR-10.3.3:** Enable RAG to provide meaningful, skill-aware interactions
- **FR-10.3.4:** Enable RAG to generate context-aware responses, guidance, and recommendations

### 10.4 Security and Consistency
- **FR-10.4.1:** Perform data sharing in secure manner
- **FR-10.4.2:** Perform data sharing in consistent manner
- **FR-10.4.3:** Support both organizational skill taxonomy and individual user progress queries

---

## 📊 Key Formulas

### Coverage Percentage
```
Coverage Percentage = (Count of verified MGS / Total Required MGS for Competency) × 100
```

### Relevance Score
```
Relevance Score = (Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100
```

### Proficiency Level Mapping
- **BEGINNER:** 0% - 30% coverage
- **INTERMEDIATE:** 31% - 65% coverage
- **ADVANCED:** 66% - 85% coverage
- **EXPERT:** 86% - 100% coverage

---

## 🔗 Related Documents

- [Project Definition Summary](../step_1_project_definition_summary.md)
- [Setup Guide](../SETUP.md)
- [Deployment Guide](../DEPLOYMENT.md)

---

**Last Updated:** 2025-01-27

