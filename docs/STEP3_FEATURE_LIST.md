# Step 3 - Feature List

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27

---

## 📋 Proposed Feature List

Based on Functional Requirements (FR-1 through FR-10) and User Stories (US-1 through US-13), here are the proposed features:

**Note:** 
- Features 1, 1a, 2-4: Sub-features of Taxonomy Initialization & Management
- Features 5-10: Sub-features of User Profile Creation & Onboarding (Feature 7: Normalization, Feature 8: Mapping)
- Features 11-16: Sub-features of Profile Update & Skill Verification
- Features 17-22: Sub-features of Gap Analysis
- Features 23-26: Sub-features of Competency Retrieval API (Course Builder)
- Features 27-29: Sub-features of Competency Lookup API (Content Studio & Learner AI)
- Features 30-33: Sub-features of CSV Upload (Trainer)
- Features 34-39: Sub-features of Frontend Profile Display
- Features 40-41: Sub-features of Learning Analytics Integration
- Features 42-43: Sub-features of RAG Integration
- Features 44-47: Sub-features of Assessment Integration
- Features 48-51: Sub-features of Directory Integration
- Features 52-55: Sub-features of Audit & Security

**Total: 55 features** (all broken down into specific, actionable capabilities)

### 1. **Quality Sources Discovery**
- Search for quality/authoritative sources (URLs, APIs, documentation)
- Identify and compile list of official sources
- Validate and verify source authenticity
- Store sources in official_sources table
- Maintain persistent list of all official sources discovered by AI
- Support querying and retrieval of official sources list
- Support periodic re-checking of sources for validity
- Track which sources have been successfully used for data extraction
- *Related to: FR-1.1, FLOW-1 (Taxonomy Initialization - Step 1)*

### 1a. **Persist Official Sources After AI Extraction**
- Receive JSON Array from AI containing 40-50 source records
- Each record includes: source_id, source_name, reference_index_url, reference_type, access_method, hierarchy_support, provides, topics_covered, skill_focus, notes
- Perform basic validation (required fields, null checks, unique source_id, URL validation)
- Perform data cleaning (trim whitespace, normalize values, remove duplicates)
- Store each source in official_sources table
- Enable future use for dashboards, search, updates, and control processes
- *Related to: FR-1.1.5*

### 2. **Data Extraction, Understanding & Hierarchy Construction**
- Extract raw data from discovered sources (web scraping)
- AI understands technological content contextually
- Identify competencies, skills, and all sub-levels (L1 → L4/MGS)
- Extract relationships between skills and competencies
- Remove unnecessary items and noise
- Build hierarchical structure (Parent → Child relationships)
- Establish skill_subSkill relationships
- Establish competency_subCompetency relationships
- Define required Skills for each Competency
- *Related to: FR-1.2.1, FR-1.2.2, FR-1.2.3, FR-1.3, FLOW-1 (Taxonomy Initialization - Step 1 & 2)*

### 3. **Distinguish Explanation from Skill**
- AI validation to distinguish between "explanations" and actual "skills"
- Ensure each item is a real, measurable skill
- Remove explanatory content that is not a skill
- Validate that extracted items are actionable skills
- *Related to: FR-1.2.2, FR-1.3.3 (Data Validation)*

### 4. **Unified DB Structure Integration**
- Normalize and unify all extracted data
- Apply AI normalization to unify synonyms, correct errors, prevent duplicates
- Store in master Skills and Competencies tables
- Calculate and store leaf node count for L1 skills
- Commit all data to unified Skills Taxonomy Database
- *Related to: FR-1.2.4, FR-1.3, FR-1.4, FR-1.5, FLOW-1 (Taxonomy Initialization - Step 3 & 4)*

### 5. **Receive User Creation Request**
- Asynchronously receive user creation request from Directory
- Receive basic user information (name, user ID, company ID, employee type, target career goal)
- Receive raw data from external sources (LinkedIn, GitHub, etc.)
- *Related to: FR-2.1, FLOW-2 (User Profile Creation - Step 1)*

### 6. **Extract Skills from Raw Data (AI)**
- AI extraction of Competencies and Skills from unstructured data
- Process resumes, LinkedIn profiles, GitHub profiles
- Identify skills and competencies contextually
- *Related to: FR-2.2.1, FLOW-2 (User Profile Creation - Step 1)*

### 7. **Normalize Extracted Skills & Competencies**
- Normalize extracted skills and competencies from Feature 6
- Unify synonyms, correct errors, and prevent duplicates
- Align raw extracted data with canonical naming conventions
- Prepare normalized data for mapping to taxonomy
- *Related to: FR-2.2.2, FR-2.2.3, FLOW-2 (User Profile Creation - Step 1)*

### 8. **Map Skills to Competencies**
- Map normalized skills to competencies
- Establish relationships between skills and competencies based on taxonomy
- Map extracted skills to canonical Skills Taxonomy database
- Map extracted competencies to canonical Competencies Taxonomy database
- *Related to: FR-2.2.2, FR-2.3, FLOW-2 (User Profile Creation - Step 1)*

### 9. **Build User Profile Structure**
- Create profile record in `userCompetency` table for each derived competency
- Store skills and MGS in `userSkills` table
- Initialize every skill as `verified=false`
- Include skill ID, skill name, and update date for each skill
- *Related to: FR-2.3, FLOW-2 (User Profile Creation - Step 2)*

### 10. **Prepare Baseline Exam**
- Prepare Baseline Exam based solely on MGS
- Retrieve all required MGS from Skills Taxonomy that fall under identified L1 Skills that belong to each competency
- Send API request to Assessment service to initiate skill verification
- *Related to: FR-2.5, FLOW-2 (User Profile Creation - Step 3)*

### 11. **Return Initial Profile to Directory**
- Return list of all Competencies held by user
- Return L1 Skills associated with each competency
- *Related to: FR-2.4, US-11, FLOW-2 (User Profile Creation - Step 4)*

### 12. **Receive Assessment Results**
- Receive assessment results from Assessment microservice
- Each result includes: skill ID, skill name, status (PASS or FAIL), exam type (Baseline or Course)
- Handle both Baseline and Course exam results
- *Related to: FR-3.1, FR-3.6, FR-3.10, US-10, FLOW-3, FLOW-4*

### 13. **Update Verified Skills**
- Iterate over list of assessment results
- Update corresponding skills in `userCompetency` table
- If PASS: set `verified=true` in `verifiedSkill` JSON field
- If FAIL: keep `verified=false`
- Update `last_evaluate` timestamp
- *Related to: FR-3.2, FLOW-3 (Baseline Exam - Step 2), FLOW-4 (Post-Course Exam - Step 2)*

### 14. **Calculate Coverage Percentage**
- Calculate Coverage Percentage for each Competency
- Formula: `(Count of verified MGS / Total Required MGS for Competency) × 100`
- Store in `CoveragePercentage` field
- *Related to: FR-3.3, FLOW-3 (Baseline Exam - Step 3), FLOW-4 (Post-Course Exam - Step 3)*

### 15. **Map to Proficiency Level**
- Map Coverage Percentage to proficiency level:
  - BEGINNER: 0% - 30%
  - INTERMEDIATE: 31% - 65%
  - ADVANCED: 66% - 85%
  - EXPERT: 86% - 100%
- Store proficiency level in `userCompetency` table
- *Related to: FR-3.4, FLOW-3 (Baseline Exam - Step 3), FLOW-4 (Post-Course Exam - Step 3)*

### 16. **Calculate Relevance Score**
- Calculate Relevance Score for Career Path Goal
- Formula: `(Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100`
- *Related to: FR-3.5, US-2, FLOW-3 (Baseline Exam - Step 4), FLOW-4 (Post-Course Exam - Step 4)*

### 17. **Recursive Hierarchy Traversal (Gap Analysis)**
- Start from user's Career Path Goal or specific Competency
- Recursively traverse skills hierarchy to collect all required MGS
- If node is MGS, add to "total requirement list"
- If node is nested Competency, recursively expand until all descendant MGS collected
- Result: flattened list of all required MGS without duplicates
- *Related to: FR-4.1, FLOW-3, FLOW-4*

### 18. **Compare Against User Profile (Gap Analysis)**
- Iterate over flattened list of required MGS
- Check user's profile for each MGS
- Classify each MGS as: verified (`verified=true`) or missing (`verified=false` or not present)
- Produce final list of missing MGS
- *Related to: FR-4.2, FLOW-3, FLOW-4*

### 19. **Generate Structured Gap Map**
- Map each missing MGS back to its closest high-level Competency
- Group missing skills under their corresponding Competencies
- Form structured key-value map: Key = Competency name, Value = List of missing MGS
- *Related to: FR-4.3, US-3, FLOW-3, FLOW-4*

### 20. **Narrow Gap Analysis**
- Triggered on course exam FAIL
- Perform gap analysis against specific Competency associated with course
- Scope: Only MGS tested by the specific course
- *Related to: FR-4.4, FR-3.12.1, FLOW-4 (Post-Course Exam - Step 5)*

### 21. **Broad Gap Analysis**
- Triggered on baseline exam or course exam PASS
- Perform gap analysis against full Career Path Goal
- Find all missing MGS across all competencies in career path
- *Related to: FR-4.5, FR-3.8.1, FR-3.12.2, US-3, FLOW-3 (Baseline Exam - Step 4), FLOW-4 (Post-Course Exam - Step 5)*

### 22. **Send Gap Analysis to Learner AI**
- Send structured map of missing skills asynchronously to Learner AI
- Include: exam status, missing skills map, Relevance Score, relevant course/competency details
- *Related to: FR-3.14, FLOW-4 (Post-Course Exam - Step 7)*

### 23. **Competency Retrieval API Endpoint (Conditional Logic)**
- Synchronous API endpoint to process requests for Competency Name
- Conditional logic based on calling microservice:
  - Course Builder (MS #3): AI Normalization + fuzzy matching, dynamic discovery if missing
  - Content Studio (MS #4) / Learner AI (MS #7): Internal lookup only, no discovery
- Token-based authentication (Course Builder, Content Studio, or Learner AI token)
- *Related to: FR-5.6.1, FR-5.1.1, FR-6.1.1, US-7, US-8, US-9, FLOW-5 (On-Demand Skill Discovery)*

### 24. **AI Normalization & Fuzzy Matching (Course Builder)**
- Apply AI normalization to perform fuzzy match of requested competency name
- Match competency name to internal database
- *Related to: FR-5.1.2, FLOW-5 (On-Demand Skill Discovery - Step 2)*

### 25. **External Knowledge Discovery Trigger (Course Builder)**
- If competency or skills missing/incomplete: trigger External Knowledge Discovery
- Perform broad search across internet
- Extract and normalize new findings
- Store in taxonomy
- *Related to: FR-5.1.3, FR-5.2, FLOW-5 (On-Demand Skill Discovery - Step 2)*

### 26. **Return MGS List (Course Builder)**
- Once competency and all underlying MGS confirmed
- Return full list of MGS associated with competency
- *Related to: FR-5.1.4, FR-5.1.5, US-7, FLOW-5 (On-Demand Skill Discovery - Step 2)*

### 27. **Competency Lookup API Endpoint (Content Studio & Learner AI)**
- Synchronous API endpoint to process requests for Competency Name
- Token-based authentication (Content Studio or Learner AI token)
- *Related to: FR-6.1.1, US-8, US-9, FLOW-5 (On-Demand Skill Discovery - Step 3)*

### 28. **Internal Database Lookup Only**
- Perform lookup only within existing internal database
- Do NOT trigger dynamic discovery or import
- Ensure fast, stable responses using verified internal data only
- *Related to: FR-6.1.2, US-8, US-9, FLOW-5 (On-Demand Skill Discovery - Step 3)*

### 29. **Return MGS List (Content Studio & Learner AI)**
- Retrieve and return relevant Most Granular Skills
- Return MGS list for requested competency
- *Related to: FR-6.1.3, US-8, US-9, FLOW-5 (On-Demand Skill Discovery - Step 3)*

### 30. **CSV File Upload (Trainer)**
- File upload interface (drag-and-drop or file picker)
- CSV format validation
- Access control check (Trainer role only - frontend and backend)
- *Related to: FR-7.1, US-5, FLOW-6.1 (Trainer Upload - Step 1)*

### 31. **CSV Parsing & Validation**
- Parse CSV file
- Validate hierarchical structure
- Preserve relationships between Competencies, Skills, and MGS
- *Related to: FR-7.2, FLOW-6.1 (Trainer Upload - Step 2)*

### 32. **AI Normalization for CSV Data**
- Apply AI normalization to standardize names
- Prevent duplicates
- Unify synonyms and correct errors
- *Related to: FR-7.3, FLOW-6.1 (Trainer Upload - Step 3)*

### 33. **Integrate CSV Data with Taxonomy**
- Integrate data into Skills Taxonomy database
- Newly added skills become available for Course Builder, Learner AI, and other services
- *Related to: FR-7.4, US-5, FLOW-6.1 (Trainer Upload - Step 4)*

### 34. **User Profile Dashboard**
- Main landing page for user skill profiles
- Display competency cards in grid layout
- Navigation to detailed views
- *Related to: FR-8.1.1, US-1, US-6*

### 35. **Competency Cards Display**
- Display individual competency with metrics
- Show proficiency level badge (BEGINNER/INTERMEDIATE/ADVANCED/EXPERT)
- Show Coverage Percentage with visual progress bar
- Expandable MGS list
- *Related to: FR-8.1.3, FR-8.1.4, US-1*

### 36. **Relevance Score Visualization**
- Display Relevance Score prominently
- Show overall progress in single metric
- Update automatically after assessments
- *Related to: FR-8.1.2, US-2*

### 37. **Missing Skills Display**
- Display missing skills from Broad Gap Analysis
- Present in categorized format (Structured MAP)
- Group missing MGS under parent Competency
- Clear indication of which Competency needs improvement
- *Related to: FR-8.3, US-3*

### 38. **Verified Skills Drill-Down**
- Expand Competency cards to see detailed MGS
- Verified MGS clearly marked (verified=true)
- Unverified MGS also visible for comparison
- *Related to: FR-8.2, US-4*

### 39. **Secure Skills Profile Page & URL Generation**
- Generate secure URL for Dedicated Skills Profile Page
- URL provides access to expanded profile view in Skills Engine UI
- Include secure URL in responses to Directory (initial profile, updated profile, retrieval API)
- Purpose: Allow users to navigate from Directory summary to full Skills Engine profile
- Frontend: Display all competencies with full details, missing skills from Broad Gap Analysis, Relevance Score
- Access control: "Upload File" button visible only to Trainers
- *Related to: FR-3.15, FR-8.4*

### 40. **Individual User Profile API (Learning Analytics)**
- Synchronous API endpoint for individual user profile retrieval
- Query `userCompetency` table for specific user
- Return: verified skills, proficiency levels, coverage percentages, Relevance Score
- *Related to: FR-9.1, FR-9.2, US-12, FLOW-6.3 (Learning Analytics Retrieval - Step 2)*

### 41. **Team Aggregation API (Learning Analytics)**
- Synchronous API endpoint for team-level data
- Aggregate competency status across all requested users
- Provide consolidated view of team capabilities
- Support team-level reporting and analysis
- *Related to: FR-9.3, FR-9.4, US-12, FLOW-6.3 (Learning Analytics Retrieval - Step 3)*

### 42. **Taxonomy Data Access API (RAG)**
- Synchronous API endpoint for canonical taxonomy data
- Return database of Competencies and Skills
- Real-time query support
- *Related to: FR-10.1, US-13, FLOW-6.2 (RAG Integration - Step 1)*

### 43. **User Profile Data Access API (RAG)**
- Synchronous API endpoint for user profile data
- Return: Competencies, verified skills, proficiency levels, Coverage Percentages, Relevance Score
- Real-time query support
- *Related to: FR-10.2, US-13, FLOW-6.2 (RAG Integration - Step 2)*

### 44. **Receive Baseline Exam Results**
- Receive assessment results for Baseline Exam
- Each result includes: skill ID, skill name, status (PASS/FAIL), exam type (Baseline)
- *Related to: FR-3.6, US-10, FLOW-3 (Baseline Exam - Step 1)*

### 45. **Process Baseline Exam Results**
- Execute profile update process for Baseline Exam
- Update verified skills, calculate coverage, map proficiency, calculate relevance score
- Trigger Broad Gap Analysis
- Return updated profile to Directory
- *Related to: FR-3.7, FR-3.8, FR-3.9, FLOW-3 (Baseline Exam - Steps 2-5)*

### 46. **Receive Course Exam Results**
- Receive feedback from Assessment service after course exam
- Includes: exam status (PASS/FAIL), list of skills marked as passed
- May include multiple attempts
- *Related to: FR-3.10, US-10, FLOW-4 (Post-Course Exam - Step 1)*

### 47. **Process Course Exam Results**
- Execute profile update process for Course Exam
- Update verified skills, calculate coverage, map proficiency, calculate relevance score
- Trigger conditional Gap Analysis (Narrow if FAIL, Broad if PASS)
- Send results to Learner AI
- Generate secure URL for frontend
- *Related to: FR-3.11, FR-3.12, FR-3.13, FR-3.14, FR-3.15, FLOW-4 (Post-Course Exam - Steps 2-7)*

### 48. **Receive User Creation Event (Directory)**
- Asynchronously receive user creation event from Directory
- Receive basic user info and raw data
- *Related to: FR-2.1, US-11, FLOW-2 (User Profile Creation - Step 1)*

### 49. **Return Initial Profile (Directory)**
- Return initial profile to Directory after user creation
- Include: list of Competencies, L1 Skills associated with each competency
- Include: Secure URL link to Skills Engine's expanded profile page (Dedicated Skills Profile Page)
- Purpose: Directory displays summary, user can navigate to full profile in Skills Engine UI
- *Related to: FR-2.4, US-11, FLOW-2 (User Profile Creation - Step 4)*

### 50. **Return Updated Profile (Directory)**
- Return updated profile to Directory after baseline exam
- Include: Competencies, initial skills, tested MGS with verification status, Coverage Percentage, Relevance Score
- Include: Secure URL link to Skills Engine's expanded profile page (Dedicated Skills Profile Page)
- Purpose: Directory displays summary, user can navigate to full profile in Skills Engine UI
- *Related to: FR-3.9, US-11, FLOW-3 (Baseline Exam - Step 5)*

### 51. **Directory Profile Retrieval API (Synchronous)**
- Synchronous API endpoint for Directory to retrieve user profiles on-demand
- Token-based authentication (Directory token)
- Returns: Competencies, verified skills, proficiency levels, Coverage Percentages, Relevance Score
- Returns: Secure URL link to Skills Engine's expanded profile page (Dedicated Skills Profile Page)
- Purpose: Display comprehensive user profiles in Directory dashboards, with link to full profile
- *Related to: US-11 (Directory Profile Retrieval), FR-3.9, FR-9.1*

### 52. **Audit Trail Logging**
- Log all profile verification updates
- Track: source, time, actor, action, previous state, new state
- Store in audit_log table (immutable, append-only)
- *Related to: NFR-6.3*

### 53. **Token-Based Authentication**
- Validate tokens for each microservice (7 microservices)
- Store and manage tokens in microservice_tokens table
- Support token expiration and rotation
- *Related to: Step 1 constraints (authentication)*

### 54. **Access Control & Role-Based Permissions**
- Enforce access control on frontend and backend
- Trainer role: can upload CSV, view own profile
- Employee role: can view own profile only
- *Related to: FR-7.1, FR-8.4, US-5, US-6*

### 55. **Data Trust Priority Enforcement**
- Enforce priority order: Assessment Scores > Certifications > User Claims/AI Extractions
- When multiple sources provide verification, use highest priority source
- Once Assessment Score verifies skill, cannot be overridden by lower-priority sources
- *Related to: NFR-6.4*

---

## ❓ Confirmation Required

**Would you like to keep, add, remove, or rename any features?**

Please review the list above and let me know:
- ✅ Keep as is
- ➕ Add new features
- ➖ Remove features
- 🔄 Rename features
- 📝 Merge features (if some should be combined)

Once confirmed, I will lock the final list and proceed to detail each feature.

