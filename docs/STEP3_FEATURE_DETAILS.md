# Step 3 - Feature Details

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27

This document contains detailed information for each feature, answering the Step 3 questions:
- Goal
- Logic
- External API
- AI
- UI/UX
- Dependencies
- Telemetry/Rollout

---

## Feature 1: Quality Sources Discovery

### Goal
**What is the feature's main purpose?**
- Search for and identify quality/authoritative sources (URLs, APIs, documentation) for skills and competencies
- Validate and verify source authenticity
- Store verified sources in the database for future use
- Maintain a persistent list of all official sources discovered by AI
- Enable querying and retrieval of official sources list for future taxonomy updates, validation, and audit purposes
- Support periodic re-checking of sources to ensure they remain valid and accessible
- Track which sources have been successfully used for data extraction
- Establish a foundation of trusted sources for taxonomy building

### Logic
**Any custom algorithm or logic?**
- Source discovery algorithm: Scan documentation sites, API references, and technical standards
- Source validation logic: Check each source against existing database to avoid duplicates
- Verification process: Validate source authenticity and reliability
- Storage logic: Add new sources to official_sources table with metadata:
  - Source URL or API endpoint
  - Source type (API, Documentation, Standard, etc.)
  - Verification status (verified/unverified)
  - Last checked timestamp
  - Source metadata (description, domain, etc.)
- List management logic: Maintain persistent list, enable querying and retrieval
- Re-checking logic: Support periodic re-checking of sources for validity
- Usage tracking: Track which sources have been successfully used for data extraction

### External API
**Uses any third-party APIs?**
- **None directly** - This feature discovers sources but doesn't necessarily call external APIs during discovery
- Sources discovered may include APIs that will be used later for data extraction (Feature 2)
- May use web scraping tools or HTTP clients to verify source accessibility

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** Identify authoritative sources for skills and competencies
- **Model:** Gemini Flash (for fast source discovery)
- **Prompt:** Stored in `/docs/prompts/source_discovery_prompt.txt`
  - The prompt instructs the AI to curate 40-50 official sources that provide hierarchical skills/competencies
  - Covers multiple domains: Frontend, Backend, Full Stack, Data Science, DevOps, AI/ML, Cybersecurity, etc.
  - Requires traversal of internal references and subpages
  - Outputs JSON array with structured source information including: source_id, source_name, reference_index_url, reference_type, access_method, hierarchy_support, provides, topics_covered, skill_focus, notes
- **Expected Output:** 
  - JSON array with 40-50 entries
  - Each entry contains complete source metadata matching the official_sources table schema
  - Structured format ready for validation and persistence (Feature 1a)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend/system initialization feature
- No user-facing UI required
- May have admin dashboard in future for source management (not in MVP)

### Dependencies
**Relies on other features?**
- **None** - This is the first step in taxonomy initialization
- Output feeds into Feature 2 (Data Extraction, Understanding & Hierarchy Construction)
- Database table: `official_sources` must exist

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all discovered sources, validation results, and any errors
- **Analytics:** Track number of sources discovered per domain, source types distribution, sources usage tracking
- **Rollout:** Can run automatically on system initialization, or manually triggered
- **Monitoring:** Track source discovery success rate, validation failures, source re-checking status
- **List Management:** Track queries to official sources list, retrieval frequency, periodic re-checking schedule

---

## Feature 1a: Persist Official Sources After AI Extraction

### Goal
**What is the feature's main purpose?**
- Persist official sources discovered by AI in dedicated database table
- Receive JSON Array from AI containing 40-50 source records
- Store complete source information for future use (dashboards, search, updates, control processes)
- Create reliable and stable data source without dependency on repeated AI runs
- Enable other system modules to use saved sources

### Logic
**Any custom algorithm or logic?**
- **Data Reception:** Receive complete JSON Array from AI as input
- **Basic Validation Algorithm:**
  - Check that all required fields exist
  - Check for null values or missing data
  - Verify that `source_id` is unique (prevent duplicates)
  - Validate URL format and accessibility
- **Data Cleaning Algorithm:**
  - Remove whitespace (trim all string fields)
  - Normalize values (e.g., reference_type, access_method to standard formats)
  - Remove duplicates based on source_id or reference_index_url
- **Storage Logic:** Insert each validated and cleaned source into `official_sources` table
- **Transaction Management:** Ensure atomic operations (all or nothing for batch insert)

### External API
**Uses any third-party APIs?**
- **None** - This is a data persistence feature
- May use HTTP client to validate URL accessibility during validation step

### AI
**Includes AI logic?**
- **No** - This feature receives AI output but does not use AI itself
- **Input:** JSON Array from AI containing source records
- **Output:** Persisted records in database

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend data persistence feature
- No user-facing UI required
- May have admin interface in future to view/manage saved sources (not in MVP)

### Dependencies
**Relies on other features?**
- **Feature 1:** Requires AI to complete source discovery and return JSON Array
- **Database table:** `official_sources` must exist with proper schema
- Output: Saved sources available for Feature 2 (Data Extraction) and other modules

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log validation results, cleaning operations, storage success/failures
- **Analytics:** Track number of sources persisted, validation failure rate, duplicate detection rate
- **Rollout:** Runs immediately after Feature 1 (AI source discovery) completes
- **Monitoring:** Track persistence success rate, validation errors, storage performance

---

## Feature 2: Data Extraction, Understanding & Hierarchy Construction

### Goal
**What is the feature's main purpose?**
- Extract raw data from discovered sources (web scraping)
- Understand technological content contextually using AI
- Identify competencies, skills, and all sub-levels (L1 → L4/MGS)
- Extract relationships between skills and competencies
- Remove unnecessary items and noise
- Build hierarchical structure (Parent → Child relationships)
- Establish skill_subSkill and competency_subCompetency relationships
- Define required Skills for each Competency

### Logic
**Any custom algorithm or logic?**
- **Database access (first step):** Access `official_sources` table to retrieve list of URLs (`reference_index_url` field) that need to be processed
- **URL list preparation:** Extract all URLs from persisted official sources to use as input for AI prompt
- **Web scraping logic:** Retrieve content from official sources via web scraping using URLs from database
- **Hierarchical parsing algorithm:** Identify parent-child relationships in extracted data
- **Relationship mapping:** Map skills to competencies, establish required skills lists
- **Data cleaning logic:** Remove unnecessary items and noise from extracted content
- **Structure validation:** Ensure hierarchical relationships are valid (no circular references, proper nesting)

### External API
**Uses any third-party APIs?**
- **HTTP/Web scraping:** Access discovered sources (URLs from Feature 1) via web scraping
- **No specific third-party service APIs** - uses web scraping on sources discovered in Feature 1

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** 
  - Deep semantic extraction from sources
  - Understand technological content contextually
  - Identify competencies, skills, and hierarchical levels (Competency → Skill → Subskill → Microskill → Nanoskill → ...)
  - Extract relationships between skills and competencies
  - Semantic validation to distinguish actionable skills from explanatory text
- **Model:** Gemini Deep-Search (for deep semantic understanding and extraction)
- **Prompt:** Stored in `/docs/prompts/semantic_extraction_prompt.txt`
  - **Input preparation:** First, retrieve list of URLs from `official_sources` table (`reference_index_url` field)
  - **Prompt input:** The list of URLs from database is passed as input to the AI prompt
  - The prompt instructs the AI to perform deep semantic extraction for each provided URL separately
  - Extracts: Competencies, Sub-competencies, Skills, Subskills, Microskills, Nanoskills, and any further nested levels (N-level depth)
  - Includes semantic validation step to filter out explanatory text, conceptual notes, examples, and include only actionable, measurable abilities
  - Maintains parent-child relationships through all hierarchical levels
  - Outputs JSON with `sources` array, where each source has `source_url` and `data` with hierarchical structure
- **Expected Output:**
  - JSON object with `sources` array
  - Each source contains:
    - `source_url`: Original URL
    - `data`: Hierarchical structure with Competency → Subcompetencies → Skills → Subskills → Microskills → Nanoskills
  - Structure ready for mapping to Skills and Competencies database tables
  - Separate extraction per URL (no merging between sources)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend/system initialization feature
- No user-facing UI required
- May have admin dashboard in future for monitoring extraction progress (not in MVP)

### Dependencies
**Relies on other features?**
- **Feature 1:** Requires discovered sources from Quality Sources Discovery
- **Feature 1a:** Requires official sources to be persisted in `official_sources` table (provides list of URLs via `reference_index_url` field)
- **Database access (first step):** Must query `official_sources` table to retrieve list of URLs before starting extraction
- **Database tables:** `official_sources` must exist with `reference_index_url` populated; `skills`, `competencies`, `skill_subSkill`, `competency_subCompetency`, `competency_requiredSkills` must exist
- Output feeds into Feature 3 (Distinguish Explanation from Skill) and Feature 4 (Unified DB Structure Integration)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log extraction progress, source processing status, errors
- **Analytics:** Track extraction success rate, number of skills/competencies extracted per source, processing time
- **Rollout:** Runs after Feature 1 completes, can be batch processed or streamed
- **Monitoring:** Track extraction errors, source failures, data quality metrics

---

## Feature 3: Distinguish Explanation from Skill

### Goal
**What is the feature's main purpose?**
- Validate that extracted items are actual, measurable skills (not explanations or descriptions)
- Distinguish between "explanations" and actionable skills
- Ensure each item is a real, measurable skill that can be verified through assessment
- Remove explanatory content that is not a skill
- Filter out non-actionable items from the taxonomy

### Logic
**Any custom algorithm or logic?**
- **Validation algorithm:** Check if item is actionable and measurable
- **Filtering logic:** Remove items that are descriptions, explanations, or concepts rather than skills
- **Skill criteria:** Item must be:
  - Actionable (can be performed/demonstrated)
  - Measurable (can be assessed/tested)
  - Specific (not too vague or abstract)
- **Classification logic:** Categorize items as "skill" or "explanation" with confidence scores

### External API
**Uses any third-party APIs?**
- **None** - This is an AI validation step on already extracted data

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** Validate JSON structure and semantically verify hierarchical competency/skill extraction outputs
- **Model:** Gemini Deep-Search (for deep validation and semantic verification)
- **Prompt:** Stored in `/docs/prompts/skill_validation_prompt.txt`
  - The prompt instructs the AI to act as a strict JSON validator and semantic verifier
  - Receives JSON string produced by Feature 2 extractor
  - Performs validation checks:
    - **JSON & Top-Level Validation:** Validates JSON structure, confirms "sources" array exists
    - **Per-Source Structural Checks:** Validates source_url, data object, competency root keys, hierarchical level keys
    - **Hierarchy Rules:** Ensures proper parent-child relationships, validates item structure (object with name or strings), checks for cross-source merging
    - **Semantic Validation:** Flags non-actionable items (overview, introduction, examples), too short names, likely descriptions (full sentences, explanatory punctuation)
  - Returns validation result JSON with: valid status, summary (counts), per-source errors/warnings/semantic flags, global errors
- **Expected Output:**
  - JSON validation result object with:
    - `valid`: boolean (true only if JSON parsed, no structural errors, no non_actionable/likely_description flags)
    - `summary`: total_sources, sources_valid, sources_with_errors, warnings_count, semantic_flags_count
    - `sources`: array with per-source structural_errors, warnings, semantic_flags (with path, flag name, reason)
    - `errors`: global errors if any
  - Does NOT modify input JSON, only flags issues
  - Warnings do not invalidate JSON, but semantic flags (non_actionable, likely_description) do

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend validation feature
- No user-facing UI required
- May have admin review interface in future for manual validation (not in MVP)

### Dependencies
**Relies on other features?**
- **Feature 2:** Requires extracted data from Data Extraction, Understanding & Hierarchy Construction
- Output feeds into Feature 4 (Unified DB Structure Integration)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log validation results, items filtered out, confidence scores
- **Analytics:** Track validation success rate, number of items filtered, average confidence scores
- **Rollout:** Runs after Feature 2 completes, processes extracted items
- **Monitoring:** Track validation errors, low confidence items, filter rate

---

## Feature 4: Unified DB Structure Integration

### Goal
**What is the feature's main purpose?**
- Normalize and unify all extracted and validated data
- Apply AI normalization to unify synonyms, correct errors, prevent duplicates
- Store in master Skills and Competencies tables
- Calculate and store leaf node count for L1 skills
- Commit all data to unified Skills Taxonomy Database
- Create a consistent, normalized taxonomy ready for use

### Logic
**Any custom algorithm or logic?**
- **Normalization algorithm:** Unify synonyms, correct errors, prevent duplicates
  - Example: "JS" → "JavaScript", "Proj Mgmt" → "Project Management"
- **Leaf node count calculation:** Recursively query skill_subSkill table, count all MGS under each L1 skill
- **Deduplication logic:** Identify and merge duplicate skills/competencies
- **Data unification:** Merge overlapping structures from multiple sources
- **Database commit:** Transaction-based commit to ensure data integrity

### External API
**Uses any third-party APIs?**
- **None** - This is a database integration step

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** Normalize terminology and unify naming variations
- **Model:** Gemini Flash (for fast normalization)
- **Prompt:** (To be stored in `/docs/prompts/normalization_prompt.txt`)
  - "Normalize the following skill/competency names. Unify synonyms (e.g., 'JS' → 'JavaScript'), correct errors, and identify duplicates. Return normalized names with mappings from original to normalized form."
- **Expected Output:**
  - Normalized skill/competency names
  - Synonym mappings
  - Duplicate detection results
  - Unified dataset

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend database integration feature
- No user-facing UI required

### Dependencies
**Relies on other features?**
- **Feature 2:** Requires extracted data
- **Feature 3:** Requires validated skills (not explanations)
- **Database tables:** All taxonomy tables must exist and be properly structured
- Output: Complete taxonomy ready for use by all other features

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log normalization results, duplicates found, leaf node counts calculated
- **Analytics:** Track normalization success rate, number of duplicates merged, taxonomy size metrics
- **Rollout:** Runs after Features 2 and 3 complete, final step in taxonomy initialization
- **Monitoring:** Track database commit success, normalization errors, taxonomy completeness

---

## Feature 5: Receive User Creation Request

### Goal
**What is the feature's main purpose?**
- Asynchronously receive user creation request from Directory microservice
- Receive and parse basic user information (name, user ID, company ID, employee type, target career goal)
- Receive raw data from external sources (LinkedIn, GitHub, professional history, etc.)
- **First step:** Create user record in `users` table with basic information
- **Second step:** Prepare data for initial profile creation and skill extraction

### Logic
**Any custom algorithm or logic?**
- **Asynchronous message handling:** Process incoming user creation events from Directory
- **Data parsing:** Extract and validate required fields from request payload
- **Data validation:** Verify user ID uniqueness, validate company ID, check employee type
- **Step 1: Create user record in users table:**
  1. **Insert user record:** Create new record in `users` table with:
     - `user_id` (Primary Key)
     - `user_name`
     - `company_id`
     - `employee_type`
     - `path_career` (Career Path Goal)
     - `raw_data` (store raw data as JSON or text)
     - `relevance_score` (initialize as NULL or 0 - will be calculated later after skills profile is created)
  2. **User table structure:** The `users` table stores basic user information **before** skills and competencies profile is created
  3. **Transaction:** Ensure user record is created successfully before proceeding to profile creation
- **Step 2: Prepare for skills profile creation:**
  1. **After user creation:** Once user record exists in `users` table, proceed to prepare data for skills profile
  2. **Raw data preparation:** Organize unstructured data (resumes, profiles) for AI extraction
  3. **Request queuing:** Queue processing for Feature 6 (Extract Skills from Raw Data) to create skills and competencies profile
  4. **Profile creation flow:** Features 6-9 will create the skills and competencies profile:
     - Feature 6: Extract skills from raw data
     - Feature 7: Normalize extracted skills
     - Feature 8: Map skills to competencies
     - Feature 9: Build user profile structure (userCompetency, userSkill tables)

### External API
**Uses any third-party APIs?**
- **Directory Microservice:** Receives asynchronous user creation requests via API/webhook/event bus
- **No direct third-party APIs** - receives data from Directory that may include external source data

### AI
**Includes AI logic?**
- **No** - This feature only receives and prepares data
- AI extraction happens in Feature 6 (Extract Skills from Raw Data)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend integration feature
- No user-facing UI required
- System-to-system communication only

### Dependencies
**Relies on other features?**
- **Directory Microservice:** Must send user creation requests with required data
- **Event Bus/Message Queue:** If using asynchronous messaging (Kafka, RabbitMQ, etc.)
- **Database tables:** `users` table must exist with fields: `user_id`, `user_name`, `company_id`, `employee_type`, `path_career`, `raw_data`, `relevance_score`
- Output: User record created in `users` table, then feeds into Feature 6 (Extract Skills from Raw Data) to create skills and competencies profile

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all incoming user creation requests, validation results, errors
- **Analytics:** Track request volume, processing time, validation failure rate
- **Rollout:** Must be available before user onboarding can begin
- **Monitoring:** Track request queue depth, processing latency, error rates

---

## Feature 6: Extract Skills from Raw Data (AI)

### Goal
**What is the feature's main purpose?**
- Extract Competencies and Skills from unstructured user data using AI
- Process various data sources: resumes, LinkedIn profiles, GitHub profiles, professional history, job descriptions
- Identify skills and competencies contextually from unstructured text
- Return raw extracted data (skills and competencies as identified, without normalization or mapping)
- Note: Normalization and mapping to canonical taxonomy happen in subsequent features

### Logic
**Any custom algorithm or logic?**
- **Unstructured data parsing:** Process text from resumes, profiles, professional history
- **Contextual analysis:** Understand professional context and experience levels
- **Skill extraction:** Identify all mentioned skills from unstructured text
- **Competency extraction:** Identify competencies mentioned or inferred from context
- **No normalization:** Raw extraction only - normalization happens later
- **No mapping:** Skills and competencies are extracted as-is - mapping to canonical taxonomy happens later

### External API
**Uses any third-party APIs?**
- **Google Gemini API:** For AI-based skill extraction only
- **No other third-party APIs** - no taxonomy database access needed (extraction only)

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** 
  - Analyze unstructured text to identify skills and competencies
  - Extract raw skills and competencies as mentioned in the data (no normalization or mapping)
  - Understand professional context to identify relevant skills
- **Model:** Gemini Deep-Search (for deep analysis of complex skill identification)
- **Prompt:** Stored in `/docs/prompts/skill_extraction_from_profile_prompt.txt`
  - The prompt instructs the AI to extract professional SKILLS and COMPETENCIES from raw text
  - Identifies all SKILLS (technical, soft, or domain-specific) and COMPETENCIES (broader areas of ability or expertise)
  - Filters out company names, locations, or unrelated words
  - Returns output in strict JSON format: `{ "competencies": [], "skills": [] }`
  - No normalization or mapping - raw extraction only, as mentioned in the text
- **Expected Output:**
  - JSON object with:
    - `competencies`: Array of competencies identified from raw data (as mentioned, not normalized)
    - `skills`: Array of skills identified from raw data (as mentioned, not normalized)
  - No company names, locations, or unrelated words
  - No normalization or mapping - raw extraction only
  - Output feeds into Feature 7 (Normalization) and then Feature 8 (Mapping)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend AI processing feature
- No user-facing UI required
- Processing happens automatically after user creation request

### Dependencies
**Relies on other features?**
- **Feature 5:** Requires user record to already exist in `users` table (created before skills extraction)
- **User data:** Requires `raw_data` from `users` table (stored during user creation)
- **No taxonomy dependency** - this feature only extracts, does not map
- Output feeds into Feature 7 (Normalize Extracted Skills & Competencies)
- After normalization and mapping, data feeds into Feature 9 (Build User Profile Structure) and Feature 10 (Prepare Baseline Exam)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log extraction results, confidence scores, raw extracted data
- **Analytics:** Track extraction success rate, number of skills/competencies extracted per user, AI processing time
- **Rollout:** Runs automatically after Feature 5 completes
- **Monitoring:** Track AI API usage, extraction errors, processing latency

---

## Feature 7: Normalize Extracted Skills & Competencies

### Goal
**What is the feature's main purpose?**
- Clean and standardize competency and skill names from Feature 6
- Apply text normalization rules (lowercase, remove spaces/punctuation, etc.)
- Convert accented characters to plain English
- Prefer full, clear forms of concepts
- Remove duplicates and return unique, normalized strings
- Prepare normalized data for mapping to taxonomy (Feature 8)

### Logic
**Any custom algorithm or logic?**
- **Text cleaning algorithm:** Apply normalization rules to clean and standardize text
  - Convert to lowercase
  - Remove leading, trailing, and duplicate spaces
  - Remove punctuation, emojis, and special symbols
  - Replace dashes and underscores with single spaces
  - Remove duplicate or repeated words
- **Character normalization:** Convert accented/non-ASCII characters to plain English
- **Form expansion:** Prefer full, clear forms (e.g., "ai" → "artificial intelligence")
- **Deduplication logic:** Return only unique strings (remove duplicates from arrays)

### External API
**Uses any third-party APIs?**
- **Google Gemini API:** For AI-based normalization
- **No other third-party APIs** - normalization is text processing only

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** Normalize terminology and unify naming variations
- **Model:** Gemini Flash (for fast normalization operations)
- **Prompt:** Stored in `/docs/prompts/normalization_prompt.txt`
  - The prompt instructs the AI to clean and standardize competency and skill names
  - Normalization rules include:
    - Convert to lowercase
    - Remove leading, trailing, and duplicate spaces
    - Remove punctuation, emojis, and special symbols (keep only letters, digits, spaces)
    - Replace dashes and underscores with single spaces
    - Remove duplicate or repeated words
    - Convert accented/non-ASCII characters to plain English
    - Prefer full, clear forms (e.g., "ai" → "artificial intelligence")
    - Return only unique, normalized strings
  - Input format: JSON with `{ "competencies": [], "skills": [] }`
  - Output format: Same JSON structure with normalized values
- **Expected Output:**
  - JSON object with:
    - `competencies`: Array of normalized, unique competency names
    - `skills`: Array of normalized, unique skill names
  - All values cleaned, standardized, and deduplicated
  - Ready for mapping to taxonomy (Feature 8)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend normalization feature
- No user-facing UI required
- Processing happens automatically after Feature 6

### Dependencies
**Relies on other features?**
- **Feature 5:** Requires user record to already exist in `users` table
- **Feature 6:** Requires raw extracted skills and competencies
- **No taxonomy dependency** - normalization happens before mapping
- Output feeds into Feature 8 (Map Skills to Competencies)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log normalization results, synonym mappings, duplicates found
- **Analytics:** Track normalization success rate, number of synonyms unified, duplicate detection rate
- **Rollout:** Runs automatically after Feature 6 completes
- **Monitoring:** Track normalization errors, AI processing time, data quality improvements

---

## Feature 8: Map Skills to Competencies

### Goal
**What is the feature's main purpose?**
- Map normalized skills to competencies using AI semantic understanding
- Organize skills under the correct competencies based on semantic meaning
- Establish relationships between skills and competencies (a skill may belong to multiple competencies)
- Create skill-competency mapping structure for user profile
- Note: This mapping is based on semantic meaning, not taxonomy database lookup

### Logic
**Any custom algorithm or logic?**
- **AI semantic mapping:** Use AI to determine which skills logically belong to each competency
- **Semantic analysis:** Use semantic meaning, not string matching, to establish relationships
- **Multi-competency support:** A skill may belong to multiple competencies if appropriate
- **Validation logic:** Ensure no new skills or competencies are invented, no names are modified
- **Empty list handling:** If a competency has no matching skills, return empty list for it

### External API
**Uses any third-party APIs?**
- **Google Gemini API:** For AI-based semantic mapping
- **No database queries** - mapping is based on semantic understanding, not taxonomy lookup

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** Organize skills under the correct competencies using semantic understanding
- **Model:** Gemini Deep-Search (for deep semantic analysis and relationship understanding)
- **Prompt:** Stored in `/docs/prompts/skill_to_competency_mapping_prompt.txt`
  - The prompt instructs the AI to determine which skills logically belong to each competency
  - Uses semantic meaning, not string matching
  - Allows a skill to belong to multiple competencies if appropriate
  - Does not invent new skills/competencies or modify names
  - Returns empty list for competencies with no matching skills
  - Input format: JSON with `{ "competencies": [], "skills": [] }`
  - Output format: JSON with `{ "mapping": { "<competency>": ["skill1", "skill2"], ... } }`
- **Expected Output:**
  - JSON object with:
    - `mapping`: Object where keys are competency names and values are arrays of skill names
    - Skills organized under their semantically appropriate competencies
    - Skills may appear under multiple competencies if appropriate
    - Empty arrays for competencies with no matching skills

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend mapping feature
- No user-facing UI required
- Processing happens automatically after Feature 7

### Dependencies
**Relies on other features?**
- **Feature 5:** Requires user record to already exist in `users` table
- **Feature 7:** Requires normalized skills and competencies
- **No taxonomy database dependency** - mapping is semantic-based, not database lookup
- Output feeds into Feature 9 (Build User Profile Structure) and Feature 10 (Prepare Baseline Exam)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log mapping results, skills per competency, multi-competency assignments, empty competency lists
- **Analytics:** Track mapping success rate, number of skills mapped per competency, average skills per competency, AI processing time
- **Rollout:** Runs automatically after Feature 7 completes
- **Monitoring:** Track AI API usage, mapping errors, processing latency, semantic mapping quality

---

## Feature 9: Build User Profile Structure

### Goal
**What is the feature's main purpose?**
- Create profile records in database for each derived competency
- Store skills and MGS (Most Granular Skills) in user profile tables
- Initialize all skills as `verified=false`
- Include skill ID, skill name, and update date for each skill
- Build complete hierarchical user profile structure ready for baseline exam

### Logic
**Any custom algorithm or logic?**
- **Profile record creation:** For each competency from mapping, create record in `userCompetency` table
- **Skill storage:** Store each skill and MGS in `userSkill` table
- **Verification initialization:** Set all skills to `verified=false` initially
- **Metadata storage:** Store skill ID, skill name, and update date for each skill
- **Hierarchical structure:** Maintain parent-child relationships between competencies and skills

### External API
**Uses any third-party APIs?**
- **None** - This is a database storage operation
- Uses internal database tables: `userCompetency`, `userSkill`

### AI
**Includes AI logic?**
- **No** - This is a database storage feature
- Uses mapping results from Feature 8 (AI-based) but doesn't use AI itself

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend database operation
- No user-facing UI required
- Processing happens automatically after Feature 8

### Dependencies
**Relies on other features?**
- **Feature 5:** Requires user record to already exist in `users` table (created before skills profile)
- **Feature 8:** Requires skill-competency mapping results
- **Database tables:** 
  - `users` table must exist (user record already created with basic info)
  - `userCompetency`, `userSkill` must exist and be properly structured
- Output: Skills and competencies profile created in `userCompetency` and `userSkill` tables, feeds into Feature 10 (Prepare Baseline Exam) and Feature 11 (Return Initial Profile to Directory)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log profile creation results, number of competencies/skills stored, any database errors
- **Analytics:** Track profile creation success rate, average competencies per user, average skills per competency
- **Rollout:** Runs automatically after Feature 8 completes
- **Monitoring:** Track database write performance, storage errors, profile completeness

---

## Feature 10: Prepare Baseline Exam

### Goal
**What is the feature's main purpose?**
- Prepare Baseline Exam based solely on Most Granular Skills (MGS)
- Retrieve all required MGS from Skills Taxonomy that fall under identified L1 Skills that belong to each competency
- Ensure broad assessment of user's claimed knowledge per competency
- Send synchronous API request to Assessment service to initiate skill verification
- Scope the exam to cover all relevant MGS for user's initial profile, organized by competency

### Logic
**Any custom algorithm or logic?**
- **Inputs:**
  - User competencies (from user profile)
  - Skills taxonomy hierarchy (from Skills Taxonomy database)
- **Process:**
  1. **For each competency → retrieve L1 skills:** Query Skills Taxonomy to get all L1 Skills that belong to each competency in user profile
  2. **For each L1 skill → traverse hierarchy to retrieve all MGS:** Recursively traverse the skill hierarchy from each L1 skill down to all Most Granular Skills (MGS)
  3. **Organize MGS by competency:** Group all retrieved MGS under their corresponding competencies
  4. **Build final MGS exam scope list:** Compile comprehensive list of all MGS to be tested, maintaining competency associations
  5. **Create payload for assessment service:** Format request payload with full MGS list per competency
  6. **Send POST /assessment/initiate (sync):** Send synchronous POST request to Assessment microservice (MS #5)
- **Output:**
  - Full MGS list per competency
  - Payload sent to Assessment Service for exam generation

### External API
**Uses any third-party APIs?**
- **Assessment Microservice (MS #5):** Synchronous POST request to `/assessment/initiate` endpoint
- **Token-based authentication:** Uses Assessment microservice token
- **Request payload:** Includes full MGS list per competency for exam generation
- **Request method:** POST (synchronous)

### AI
**Includes AI logic?**
- **No** - This is a data preparation and API integration feature
- Uses Skills Taxonomy database to retrieve MGS

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API integration feature
- No user-facing UI required
- Processing happens automatically after Feature 9

### Dependencies
**Relies on other features?**
- **Feature 9:** Requires complete user profile structure with skills
- **Feature 4:** Requires complete Skills Taxonomy database to retrieve MGS
- **Database tables:** `skills`, `skill_subSkill` must exist for MGS retrieval
- **Assessment Microservice:** Must be available and accessible
- Output: Baseline exam initiated, user can take exam in Assessment service

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log exam preparation, MGS count, API request status, Assessment service response
- **Analytics:** Track number of MGS per baseline exam, exam preparation success rate, API call latency
- **Rollout:** Runs automatically after Feature 9 completes
- **Monitoring:** Track Assessment service availability, API errors, exam initiation failures

---

## Feature 11: Return Initial Profile to Directory

### Goal
**What is the feature's main purpose?**
- Return initial user profile to Directory microservice after profile creation
- Provide list of all Competencies held by the user based on raw data
- Return L1 Skills associated with each competency that the user possesses
- Include secure URL link to Skills Engine's expanded profile page (Dedicated Skills Profile Page)
- Enable Directory to display summary while allowing users to navigate to full profile

### Logic
**Any custom algorithm or logic?**
- **Profile compilation:** Gather all competencies and associated L1 Skills from user profile
- **Data formatting:** Structure response with competencies and their associated L1 Skills
- **Secure URL generation:** Generate secure, time-limited URL for expanded Skills Engine profile page
- **Response preparation:** Format response payload for Directory microservice
- **Asynchronous return:** Send response back to Directory (asynchronous communication)

### External API
**Uses any third-party APIs?**
- **Directory Microservice (MS #1):** Returns initial profile data to Directory
- **Asynchronous communication:** Response sent back to Directory after profile creation
- **No direct third-party APIs** - internal microservice communication

### AI
**Includes AI logic?**
- **No** - This is a data retrieval and formatting feature
- Uses data from user profile created in previous features

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API integration feature
- No user-facing UI required
- Response data will be displayed in Directory microservice UI

### Dependencies
**Relies on other features?**
- **Feature 9:** Requires complete user profile structure with competencies and skills
- **Directory Microservice:** Must be available to receive the response
- **Secure URL generation:** Requires URL generation mechanism for expanded profile page
- Output: Initial profile available in Directory for user viewing

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log profile return status, response size, URL generation, any errors
- **Analytics:** Track profile return success rate, average competencies per user, response latency
- **Rollout:** Runs automatically after Feature 9 completes (before or after Feature 10)
- **Monitoring:** Track Directory service availability, response delivery failures, URL generation errors

---

## Feature 12: Receive Assessment Results

### Goal
**What is the feature's main purpose?**
- Receive assessment results from Assessment microservice after user completes exam
- Handle two different exam types with different parameter structures:
  - **Baseline Exam:** Receives skills with both PASS and FAIL statuses
  - **Post-Course Exam:** Receives only skills with PASS status, plus course information
- Prepare results for profile update and skill verification based on exam type

### Logic
**Any custom algorithm or logic?**
- **Result reception:** Receive assessment results via API from Assessment service
- **Data structure - Baseline Exam:**
  - Top-level fields:
    - `user_id`: Unique identifier for the user
    - `user_name`: Name of the user
    - `exam_type`: Type of exam (must be "Baseline")
    - `exam_status`: Overall status of the exam result (PASS or FAIL)
  - `skills`: List of skills, where each skill object contains:
    - `skill_id`: Unique identifier for the skill
    - `skill_name`: Name of the skill
    - `status`: Status of this specific skill (can be PASS or FAIL)
- **Data structure - Post-Course Exam:**
  - Top-level fields:
    - `user_id`: Unique identifier for the user
    - `user_name`: Name of the user
    - `exam_type`: Type of exam (must be "Post-Course")
    - `exam_status`: Overall status of the exam result (PASS or FAIL)
    - `course_name`: Name of the course that was completed
  - `skills`: List of skills, where each skill object contains:
    - `skill_id`: Unique identifier for the skill
    - `skill_name`: Name of the skill
    - `status`: Status of this specific skill (ONLY PASS - all skills in list must have status=PASS)
- **Data parsing:** Parse incoming results payload to extract exam-level fields and list of skill assessments
- **Exam type detection:** Identify exam type from `exam_type` field to determine which validation rules to apply
- **Result validation - Baseline Exam:**
  - Validate that all top-level fields exist (user_id, user_name, exam_type, exam_status)
  - Validate that exam_type = "Baseline"
  - Validate that each skill includes all required fields (skill_id, skill_name, status)
  - Validate that skill status can be either PASS or FAIL
- **Result validation - Post-Course Exam:**
  - Validate that all top-level fields exist (user_id, user_name, exam_type, exam_status, course_name)
  - Validate that exam_type = "Post-Course"
  - Validate that each skill includes all required fields (skill_id, skill_name, status)
  - Validate that ALL skills have status = PASS (reject if any skill has status = FAIL)
- **Result categorization:** Categorize results by exam type (Baseline or Post-Course) for different processing flows
- **Result queuing:** Queue results for processing if needed (handle concurrent requests)

### External API
**Uses any third-party APIs?**
- **Assessment Microservice (MS #5):** Receives assessment results via API
- **Asynchronous or synchronous:** May receive via webhook (async) or API callback (sync)
- **No direct third-party APIs** - internal microservice communication

### AI
**Includes AI logic?**
- **No** - This is a data reception and parsing feature
- Results are processed in subsequent features

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API integration feature
- No user-facing UI required
- Processing happens automatically after exam completion

### Dependencies
**Relies on other features?**
- **Assessment Microservice:** Must send assessment results after exam completion
- **Event Bus/Webhook:** If using asynchronous messaging for result delivery
- Output feeds into Feature 13 (Update Verified Skills) and subsequent profile update features

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all received assessment results, parsing results, validation errors
- **Analytics:** Track result reception rate, number of results per exam, exam type distribution
- **Rollout:** Must be available before users can complete exams
- **Monitoring:** Track result delivery failures, parsing errors, validation failures

---

## Feature 13: Update Verified Skills

### Goal
**What is the feature's main purpose?**
- Update user profile with verified skills based on assessment results
- Iterate over list of assessment results and update corresponding skills
- Mark skills as verified (verified=true) if skill status = PASS (each skill's individual status, not exam_status)
- Keep skills as unverified (verified=false) if skill status = FAIL (each skill's individual status, not exam_status)
- Update last_evaluate timestamp for each skill

### Logic
**Any custom algorithm or logic?**
- **Result iteration:** Iterate over list of skills from assessment results
- **Skill lookup:** Find corresponding skill in user profile using skill_id
- **Status update logic (based on individual skill status, NOT exam_status):**
  - For each skill in the results list, check the skill's individual `status` field
  - **If skill's individual `status` = PASS:**
    - Add/update skill entry in `verifiedSkills` JSON field within `userCompetency` table
    - JSON structure for verified skill:
      ```json
      {
        "skill_id": "<skill_id>",
        "skill_name": "<skill_name>",
        "verified": true,
        "lastUpdate": "<timestamp>"
      }
      ```
    - Extract `skill_id` and `skill_name` from assessment results
    - Set `verified=true`
    - Set `lastUpdate` to current timestamp
  - **If skill's individual `status` = FAIL:**
    - Do NOT add to `verifiedSkills` JSON (or remove if already exists)
    - Keep `verified=false` (or set to false if not already set)
  - **Important:** Verification is determined by each skill's individual `status` field, NOT by the top-level `exam_status` field
- **JSON update logic:**
  - If skill is verified (status = PASS): Add new entry or update existing entry in `verifiedSkills` JSON array/object
  - If skill is not verified (status = FAIL): Remove entry from `verifiedSkills` JSON if it exists
- **Batch update:** Process all skills in a single transaction for data consistency

### External API
**Uses any third-party APIs?**
- **None** - This is a database update operation
- Uses internal database tables: `userCompetency`, `userSkill`

### AI
**Includes AI logic?**
- **No** - This is a database update feature
- Uses assessment results from Feature 12

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend database operation
- No user-facing UI required
- Processing happens automatically after Feature 12

### Dependencies
**Relies on other features?**
- **Feature 12:** Requires assessment results with skills list
- **Database tables:** `userCompetency` (with `verifiedSkill` JSON field), `userSkill` must exist
- Output feeds into Feature 14 (Calculate Coverage Percentage) and subsequent profile update features

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all skill updates, verification status changes, update success/failures
- **Analytics:** Track number of skills verified per exam, verification rate, update success rate
- **Rollout:** Runs automatically after Feature 12 completes
- **Monitoring:** Track database update performance, verification errors, transaction failures

---

## Feature 14: Calculate Coverage Percentage

### Goal
**What is the feature's main purpose?**
- Calculate Coverage Percentage for each Competency based on verified skills
- Compute the percentage of verified MGS out of total required MGS for each competency
- Store Coverage Percentage in `CoveragePercentage` field in `userCompetency` table
- Provide quantitative measure of user's progress in each competency

### Logic
**Any custom algorithm or logic?**
- **For each competency in user profile:**
  1. **Count verified MGS:** Count all MGS in `verifiedSkill` JSON field where `verified=true` for this competency
  2. **Get total required MGS:** Query Skills Taxonomy to get total number of required MGS for this competency
  3. **Calculate percentage:** Apply formula: `(Count of verified MGS / Total Required MGS for Competency) × 100`
  4. **Store result:** Save calculated percentage in `CoveragePercentage` field in `userCompetency` table
- **Formula:** 
  ```
  Coverage Percentage = (Count of verified MGS / Total Required MGS for Competency) × 100
  ```
- **Edge case handling:** Handle cases where total required MGS is 0 (avoid division by zero)

### External API
**Uses any third-party APIs?**
- **None** - This is a calculation and database update operation
- Uses internal database tables: `userCompetency`, Skills Taxonomy database

### AI
**Includes AI logic?**
- **No** - This is a mathematical calculation feature
- Uses verified skills data from Feature 13

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend calculation feature
- No user-facing UI required
- Calculated percentages will be displayed in frontend (Feature 34-39)

### Dependencies
**Relies on other features?**
- **Feature 13:** Requires updated verified skills
- **Feature 4:** Requires complete Skills Taxonomy database to get total required MGS
- **Database tables:** `userCompetency` (with `CoveragePercentage` field), Skills Taxonomy tables must exist
- Output feeds into Feature 15 (Map to Proficiency Level) and Feature 16 (Calculate Relevance Score)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all coverage percentage calculations, competency updates, calculation errors
- **Analytics:** Track average coverage percentages, distribution of coverage levels, calculation performance
- **Rollout:** Runs automatically after Feature 13 completes
- **Monitoring:** Track calculation errors, division by zero cases, database update failures

---

## Feature 15: Map to Proficiency Level

### Goal
**What is the feature's main purpose?**
- Map Coverage Percentage to descriptive proficiency level
- Convert numerical coverage percentage (0-100%) into one of four proficiency categories
- Store proficiency level in `proficiencyLevel` field in `userCompetency` table
- Provide human-readable competency proficiency assessment

### Logic
**Any custom algorithm or logic?**
- **For each competency in user profile:**
  1. **Retrieve Coverage Percentage:** Get `CoveragePercentage` value from `userCompetency` table (calculated in Feature 14)
  2. **Mapping algorithm:** Apply mapping rules based on percentage ranges:
     - **BEGINNER:** Coverage Percentage is 0% - 30%
     - **INTERMEDIATE:** Coverage Percentage is 31% - 65%
     - **ADVANCED:** Coverage Percentage is 66% - 85%
     - **EXPERT:** Coverage Percentage is 86% - 100%
  3. **Boundary handling:** 
     - Lower bound is inclusive (e.g., 30% = BEGINNER)
     - Upper bound is inclusive (e.g., 100% = EXPERT)
     - Use >= and <= for range checks
  4. **Store result:** Save mapped proficiency level in `proficiencyLevel` field in `userCompetency` table
- **Mapping rules:**
  ```
  IF CoveragePercentage >= 0 AND CoveragePercentage <= 30:
    proficiencyLevel = "BEGINNER"
  ELSE IF CoveragePercentage >= 31 AND CoveragePercentage <= 65:
    proficiencyLevel = "INTERMEDIATE"
  ELSE IF CoveragePercentage >= 66 AND CoveragePercentage <= 85:
    proficiencyLevel = "ADVANCED"
  ELSE IF CoveragePercentage >= 86 AND CoveragePercentage <= 100:
    proficiencyLevel = "EXPERT"
  ```
- **Edge case handling:** Handle null or missing CoveragePercentage (skip mapping or set to default)

### External API
**Uses any third-party APIs?**
- **None** - This is a mapping and database update operation
- Uses internal database tables: `userCompetency`

### AI
**Includes AI logic?**
- **No** - This is a rule-based mapping feature
- Uses Coverage Percentage from Feature 14

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend mapping feature
- No user-facing UI required
- Proficiency levels will be displayed in frontend (Feature 34-39)

### Dependencies
**Relies on other features?**
- **Feature 14:** Requires Coverage Percentage to be calculated first
- **Database tables:** `userCompetency` (with `CoveragePercentage` and `proficiencyLevel` fields) must exist
- Output feeds into Feature 16 (Calculate Relevance Score) and profile display features

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all proficiency level mappings, competency updates, mapping errors
- **Analytics:** Track distribution of proficiency levels, mapping performance, percentage range distribution
- **Rollout:** Runs automatically after Feature 14 completes
- **Monitoring:** Track mapping errors, null percentage handling, database update failures

---

## Feature 16: Calculate Relevance Score

### Goal
**What is the feature's main purpose?**
- Calculate Relevance Score for user's Career Path Goal
- Measure user's progress toward their overall career path objective
- Calculate percentage of verified MGS out of total required MGS for entire Career Path
- Store Relevance Score in `relevance_score` field in `users` table (user table)

### Logic
**Any custom algorithm or logic?**
- **User identification:**
  1. **Get user data:** Retrieve user data from `users` table using `user_id`
  2. **User table fields:** Access user fields: `user_id`, `user_name`, `company_id`, `employee_type`, `path_career`, `raw_data`
- **Career Path Goal retrieval:**
  1. **Get user's Career Path Goal:** Retrieve user's Career Path Goal from `path_career` field in `users` table
  2. **Identify all competencies in Career Path:** Determine all competencies that are part of the user's Career Path Goal
- **MGS collection for Career Path:**
  1. **Recursive traversal:** For each competency in Career Path, recursively traverse skills hierarchy to collect all required MGS
  2. **Total required MGS:** Count total number of unique MGS required for entire Career Path Goal
  3. **Verified MGS count:** Count number of verified MGS (where `verified=true` in `verifiedSkills` JSON) across all competencies in Career Path
- **Relevance Score calculation:**
  1. **Apply formula:** `Relevance Score = (Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100`
  2. **Result range:** Score will be between 0% and 100%
- **Storage:**
  1. **Store Relevance Score:** Save calculated score in `relevance_score` field in `users` table
  2. **User table structure:** The `users` table contains:
     - `user_id` (Primary Key)
     - `user_name`
     - `company_id`
     - `employee_type`
     - `path_career` (Career Path Goal - used for calculation)
     - `raw_data` (Original raw data from resume/LinkedIn)
     - `relevance_score` (Relevance Score - calculated and stored here)
  3. **Update timestamp:** Update `updated_at` timestamp in `users` table when Relevance Score is updated
- **Formula:**
  ```
  Relevance Score = (Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100
  ```
- **Edge case handling:**
  - Handle cases where Career Path Goal is not set (skip calculation or set to null)
  - Handle cases where total required MGS is 0 (avoid division by zero)
  - Handle cases where no competencies are part of Career Path (return 0 or null)

### External API
**Uses any third-party APIs?**
- **None** - This is a calculation and database operation
- Uses internal database tables: `users` table (for storing Relevance Score and retrieving Career Path Goal), `userCompetency` (for verified skills), Skills Taxonomy tables

### AI
**Includes AI logic?**
- **No** - This is a mathematical calculation feature
- Uses verified skills data from Feature 13 and Career Path Goal from `path_career` field in `users` table

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend calculation feature
- No user-facing UI required
- Relevance Score will be displayed in frontend (Feature 34-39)

### Dependencies
**Relies on other features?**
- **Feature 13:** Requires updated verified skills
- **Feature 4:** Requires complete Skills Taxonomy database to get total required MGS for Career Path
- **User Profile:** Requires user's Career Path Goal to be set in `path_career` field in `users` table
- **Database tables:** 
  - `users` table must exist with fields: `user_id`, `user_name`, `company_id`, `employee_type`, `path_career`, `raw_data`, `relevance_score`
  - `userCompetency` table (with `verifiedSkills` JSON field) for verified skills data
  - Skills Taxonomy tables for MGS collection
- Output: Relevance Score calculated and stored in `users.relevance_score` field, ready for display in frontend and use in Gap Analysis features (Feature 17)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all Relevance Score calculations, Career Path lookups, calculation errors
- **Analytics:** Track average Relevance Scores, distribution of scores, calculation performance
- **Rollout:** Runs automatically after Feature 13 completes (as part of profile update flow)
- **Monitoring:** Track calculation errors, division by zero cases, missing Career Path Goal cases, database update failures

---

## Feature 17: Recursive Hierarchy Traversal (Gap Analysis)

### Goal
**What is the feature's main purpose?**
- Recursively traverse skills hierarchy starting from Career Path Goal or specific Competency
- Collect all required Most Granular Skills (MGS) through recursive traversal
- Build flattened list of all required MGS without duplicates
- Prepare complete requirement list for gap analysis comparison

### Logic
**Any custom algorithm or logic?**
- **Starting point determination:**
  1. **Input:** Receive starting point (Career Path Goal or specific Competency)
  2. **Career Path Goal:** If starting from Career Path Goal, identify all competencies that are part of the career path
  3. **Specific Competency:** If starting from specific Competency, use that competency as root
- **Recursive traversal algorithm:**
  1. **Initialize:** Create empty "total requirement list" to store collected MGS
  2. **For each competency in starting point:**
     - **Get required skills:** Query `competency_requiredSkills` table to get all L1 skills required for this competency
     - **For each L1 skill:**
       - **Recursive traversal function:**
         ```
         function traverseSkill(skill_id):
           - Query skill_subSkill table to get all child skills
           - If skill has children:
             - For each child skill:
               - Recursively call traverseSkill(child_skill_id)
           - Else (no children, this is MGS):
             - Add skill_id to "total requirement list"
             - Mark as MGS
         ```
     - **Handle nested competencies:**
       - If competency has sub-competencies (query `competency_subCompetency` table):
         - For each sub-competency:
           - Recursively expand all components until all descendant MGS are collected
- **MGS identification:**
  - **MGS criteria:** Skill is MGS if:
    - It has no child skills (leaf node in hierarchy)
    - OR it is marked as level L4/MGS in Skills Taxonomy
  - **Add to list:** When MGS is found, add to "total requirement list"
- **Duplicate prevention:**
  - Use Set data structure or unique constraint to prevent duplicate MGS entries
  - Check if skill_id already exists in list before adding
- **Result:**
  - Flattened list of all required MGS for the target (Career Path Goal or specific Competency)
  - No duplicates
  - Ready for comparison against user profile in Feature 18

### External API
**Uses any third-party APIs?**
- **None** - This is a database traversal operation
- Uses internal database tables: `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill`, `competency_subCompetency`

### AI
**Includes AI logic?**
- **No** - This is a recursive traversal algorithm
- Uses Skills Taxonomy database structure

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend traversal feature
- No user-facing UI required
- Results feed into gap analysis features (Feature 18-19)

### Dependencies
**Relies on other features?**
- **Feature 4:** Requires complete Skills Taxonomy database with proper hierarchy structure
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill`, `competency_subCompetency` must exist
- **Input:** Requires starting point (Career Path Goal or specific Competency) from user profile or request
- Output feeds into Feature 18 (Compare Against User Profile) for gap analysis

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log traversal start/end points, number of MGS collected, traversal depth, performance metrics
- **Analytics:** Track traversal performance, average MGS count per competency, traversal time, recursion depth
- **Rollout:** Runs as part of gap analysis flow (after Feature 16 or on-demand)
- **Monitoring:** Track traversal errors, infinite recursion detection, database query performance, memory usage for large hierarchies

---

## Feature 18: Compare Against User Profile (Gap Analysis)

### Goal
**What is the feature's main purpose?**
- Compare flattened list of required MGS (from Feature 17) against user's verified skills profile
- Classify each required MGS as either verified or missing
- Produce final list of missing MGS that user needs to acquire
- Identify skill gaps for learning path recommendations

### Logic
**Any custom algorithm or logic?**
- **Input:** Receive flattened list of all required MGS from Feature 17 (Recursive Hierarchy Traversal)
- **Iteration algorithm:**
  1. **For each MGS in flattened requirement list:**
     - **Lookup in user profile:** Check if MGS exists in user's profile
     - **Check verification status:** Query `userCompetency` table to find competency that contains this MGS
     - **Check verifiedSkills JSON:** Look for MGS in `verifiedSkills` JSON field within `userCompetency` table
- **Classification logic:**
  - **If MGS found in verifiedSkills JSON:**
    - Check `verified` field value
    - **If `verified=true`:** Classify as "Already verified" - user has this skill
    - **If `verified=false`:** Classify as "Missing" - user needs this skill
  - **If MGS not found in user profile:**
    - Classify as "Missing" - user does not have this skill in profile
- **Missing MGS collection:**
  - Create "missing MGS list" to store all MGS that are:
    - Not present in user profile, OR
    - Present but with `verified=false`
  - Store skill_id, skill_name, and associated competency for each missing MGS
- **Result:**
  - Final list of missing MGS that user needs to acquire
  - Each missing MGS includes: skill_id, skill_name, competency_id (or competency name)
  - Ready for aggregation and mapping in Feature 19

### External API
**Uses any third-party APIs?**
- **None** - This is a database comparison operation
- Uses internal database tables: `userCompetency` (with `verifiedSkills` JSON field)

### AI
**Includes AI logic?**
- **No** - This is a data comparison feature
- Uses user profile data and requirement list from Feature 17

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend comparison feature
- No user-facing UI required
- Results feed into gap analysis aggregation (Feature 19) and learning recommendations

### Dependencies
**Relies on other features?**
- **Feature 17:** Requires flattened list of required MGS from Recursive Hierarchy Traversal
- **Feature 13:** Requires updated verified skills in user profile
- **Database tables:** `userCompetency` (with `verifiedSkills` JSON field) must exist
- Output feeds into Feature 19 (Aggregate and Map Missing Skills) for structured gap analysis results

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log comparison operations, number of MGS checked, verification status distribution, missing MGS count
- **Analytics:** Track gap analysis performance, average missing MGS per user, verification rate, comparison time
- **Rollout:** Runs as part of gap analysis flow (after Feature 17)
- **Monitoring:** Track comparison errors, JSON parsing errors, database query performance, missing skill identification accuracy

---

## Feature 19: Generate Structured Gap Map

### Goal
**What is the feature's main purpose?**
- Map each missing MGS back to its closest high-level Competency
- Group missing skills under their corresponding Competencies
- Form structured key-value map for reporting and learning guidance
- Organize gap analysis results by competency for better understanding and action planning

### Logic
**Any custom algorithm or logic?**
- **Input:** Receive list of missing MGS from Feature 18 (Compare Against User Profile)
- **MGS to Competency mapping:**
  1. **For each missing MGS in the list:**
     - **Get MGS details:** Extract skill_id, skill_name from missing MGS
     - **Find parent competency:** Query Skills Taxonomy to find which competency this MGS belongs to
     - **Mapping methods:**
       - Query `competency_requiredSkills` table to find competency that requires this skill
       - Traverse up the skill hierarchy to find associated L1 skill
       - Find competency that has this L1 skill in its required skills list
     - **Handle nested competencies:** If MGS belongs to sub-competency, map to closest high-level parent competency
- **Grouping algorithm:**
  1. **Initialize:** Create empty structured map (dictionary/object)
  2. **For each missing MGS:**
     - **Get competency:** Determine which competency the MGS belongs to
     - **Group by competency:**
       - If competency key already exists in map:
         - Add MGS to existing list for that competency
       - If competency key does not exist:
         - Create new entry with competency as key
         - Initialize list with this MGS
  3. **Structure format:**
     ```
     {
       "Competency Name/ID": [
         {
           "skill_id": "<skill_id>",
           "skill_name": "<skill_name>"
         },
         ...
       ],
       "Another Competency Name/ID": [
         ...
       ]
     }
     ```
- **Result organization:**
  - **Key:** Competency name (or competency ID) - including nested levels if needed
  - **Value:** List of missing MGS objects (each with skill_id, skill_name)
  - **Count tracking:** Maintain count of missing MGS per competency for reporting
- **Output:**
  - Structured key-value map ready for reporting
  - Organized by competency for easy understanding
  - Ready for sending to Learner AI, Course Builder, or UI display

### External API
**Uses any third-party APIs?**
- **None** - This is a data organization and mapping operation
- Uses internal database tables: `competencies`, `competency_requiredSkills`, Skills Taxonomy tables

### AI
**Includes AI logic?**
- **No** - This is a data organization feature
- Uses Skills Taxonomy database structure and missing MGS list from Feature 18

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend data organization feature
- Structured map will be displayed in frontend (Feature 34-39) or sent to other microservices
- Map format supports easy visualization and learning path recommendations

### Dependencies
**Relies on other features?**
- **Feature 18:** Requires list of missing MGS from Compare Against User Profile
- **Feature 4:** Requires complete Skills Taxonomy database to map MGS to competencies
- **Database tables:** `competencies`, `competency_requiredSkills`, Skills Taxonomy tables must exist
- Output feeds into reporting features (Feature 20-21) and learning recommendations

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log mapping operations, competency grouping, map generation, number of competencies with gaps
- **Analytics:** Track average missing MGS per competency, gap distribution across competencies, mapping performance
- **Rollout:** Runs as part of gap analysis flow (after Feature 18)
- **Monitoring:** Track mapping errors, missing competency associations, data structure validation, map generation time

---

## Feature 20: Narrow Gap Analysis

### Goal
**What is the feature's main purpose?**
- Perform gap analysis against specific Competency associated with a course
- Triggered when course exam result is FAIL
- Scope limited to only MGS tested by the specific course
- Identify missing skills within that specific competency for focused remediation

### Logic
**Any custom algorithm or logic?**
- **Trigger condition:**
  1. **Exam result:** Receive course exam result with `exam_status = FAIL`
  2. **Course identification:** Extract `course_name` from exam results
- **Competency lookup process:**
  1. **Match competency by course name:** Use `course_name` to lookup and find the matching Competency name
  2. **Get competency details:** Once competency name is matched:
     - Retrieve Target Competency ID associated with the matched competency name
     - Retrieve Target Competency name (Competency_name)
- **Course Coverage Map generation:**
  1. **Get required MGS for competency:** Retrieve all required MGS for the matched competency
  2. **Build Course Coverage Map:** The required list of MGS for this competency becomes the Course Coverage Map
     - This is the list of MGS that should be tested by this course
     - These are all the MGS within the specific competency scope
- **Scope determination:**
  1. **Use Course Coverage Map:** The dynamically generated Course Coverage Map defines the analysis scope
  2. **Limit scope:** Only analyze MGS that are in the Course Coverage Map (required MGS for the competency)
- **Gap analysis process:**
  1. **Use Course Coverage Map:** The Course Coverage Map contains all required MGS for the competency
     - These are the MGS that should be tested by this course
     - These are the MGS within the specific competency scope
  2. **Compare against user profile:**
     - For each MGS in Course Coverage Map:
       - Check if MGS exists in user's `verifiedSkills` JSON for the target competency
       - Check if `verified=true` or `verified=false`
  3. **Identify missing MGS:**
     - MGS is missing if:
       - Not present in user's `verifiedSkills` JSON for the competency, OR
       - Present but with `verified=false`
  4. **Filter by course scope:**
     - Only include MGS that are in the Course Coverage Map
     - Exclude MGS outside the course scope
- **Result generation:**
  1. **Create missing MGS list:** List of missing MGS within the course scope
  2. **Associate with competency:** All missing MGS belong to the same target competency
  3. **Include course context:** Tag results with course_name, competency_id, and competency_name
  4. **Include user and exam context:** Tag results with user_id, user_name, company (that the user belongs to), and exam_status
- **Output:**
  - List of missing MGS within the specific competency and course scope
  - Each missing MGS includes: skill_id, skill_name, competency_id, competency_name
  - Output includes top-level fields:
    - `course_name`: Name of the course
    - `exam_status`: Status of the exam (FAIL)
    - `company`: Company that the user belongs to
    - `user_name`: Name of the user
    - `user_id`: Unique identifier for the user
  - Ready for structured mapping (Feature 19) and reporting

### External API
**Uses any third-party APIs?**
- **None** - This is a gap analysis operation
- Uses internal database tables: `userCompetency`, Skills Taxonomy tables, Course Coverage Map

### AI
**Includes AI logic?**
- **No** - This is a focused gap analysis feature
- Uses Course Coverage Map and user profile data

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend gap analysis feature
- Results will be displayed in frontend or sent to Learner AI for focused remediation recommendations
- Narrow scope helps users focus on specific course-related gaps

### Dependencies
**Relies on other features?**
- **Feature 12:** Requires course exam results with `exam_status = FAIL` and `course_name`
- **Feature 4:** Requires Course Coverage Map in Skills Taxonomy database
- **Feature 18:** Uses comparison logic from Compare Against User Profile (but with limited scope)
- **Database tables:** `userCompetency`, Skills Taxonomy tables, Course Coverage Map must exist
- Output feeds into Feature 19 (Generate Structured Gap Map) for reporting

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log narrow gap analysis triggers, course identification, scope determination, missing MGS count per course
- **Analytics:** Track narrow gap analysis frequency, average missing MGS per failed course, course-specific gap patterns
- **Rollout:** Runs automatically when course exam fails (after Feature 12)
- **Monitoring:** Track course lookup errors, missing Course Coverage Map, scope filtering accuracy, analysis performance

---

## Feature 21: Broad Gap Analysis

### Goal
**What is the feature's main purpose?**
- Perform gap analysis against full Career Path Goal
- Triggered when baseline exam or course exam result is PASS
- Find all missing MGS across all competencies in the career path
- Provide comprehensive view of skill gaps for entire career path

### Logic
**Any custom algorithm or logic?**
- **Input parameters:**
  1. **User identification:** Receive `user_id` and `user_name` as input parameters
  2. **Purpose:** These parameters identify the specific user whose profile needs to be updated
  3. **User context:** All gap analysis operations are performed for this specific user
- **Trigger condition:**
  1. **Baseline exam:** Receive baseline exam result with `exam_status = PASS`
  2. **Course exam:** Receive course exam result with `exam_status = PASS`
  3. **Both trigger types:** Either exam type with PASS status triggers Broad Gap Analysis
  4. **User context:** Exam results include `user_id` and `user_name` which are used as input parameters
- **Career Path Goal retrieval:**
  1. **Get user's Career Path Goal:** Retrieve user's Career Path Goal from user profile using `user_id`
  2. **Identify all competencies:** Determine all competencies that are part of the Career Path Goal for this specific user
  3. **Scope:** Entire Career Path Goal (all competencies in the career path) for the specified user
- **Recursive traversal (uses Feature 17):**
  1. **Start from Career Path Goal:** Use Career Path Goal as starting point
  2. **Traverse hierarchy:** Recursively traverse skills hierarchy for all competencies in career path
  3. **Collect all required MGS:** Use Feature 17 (Recursive Hierarchy Traversal) to collect all required MGS
  4. **Result:** Flattened list of all required MGS for entire Career Path Goal (no duplicates)
- **Compare against user profile (uses Feature 18):**
  1. **User profile lookup:** Use `user_id` to identify and access the specific user's profile
  2. **Iterate over required MGS:** For each MGS in the flattened requirement list
  3. **Check user profile:** Use Feature 18 (Compare Against User Profile) to check verification status for this specific user
  4. **Classify MGS:** Each MGS is classified as:
     - Already verified (`verified=true`) for this user
     - Missing (`verified=false` or not present in profile) for this user
  5. **Result:** Final list of missing MGS across all competencies in career path for the specified user
- **Relevance Score calculation (uses Feature 16):**
  1. **Calculate during analysis:** Calculate Relevance Score as part of gap analysis for the specific user
  2. **User-specific calculation:** Use `user_id` to calculate Relevance Score for this user's profile
  3. **Formula:** `Relevance Score = (Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100`
  4. **Update score:** Store updated Relevance Score in user profile for the specified user (`user_id`)
- **Result generation:**
  1. **Create missing MGS list:** List of all missing MGS across entire Career Path Goal for the specified user
  2. **Associate with competencies:** Missing MGS are associated with their respective competencies
  3. **Include user context:** Tag results with `user_id` and `user_name` to identify the user
  4. **Include exam and company context:** Tag results with exam_status and company (that the user belongs to)
  5. **Include career path context:** Tag results with Career Path Goal information
- **Output:**
  - Comprehensive list of missing MGS across all competencies in career path for the specified user
  - Each missing MGS includes: skill_id, skill_name, competency_id, competency_name
  - Output includes top-level fields:
    - `exam_status`: Status of the exam (PASS)
    - `company`: Company that the user belongs to
    - `user_name`: Name of the user
    - `user_id`: Unique identifier for the user
  - Ready for structured mapping (Feature 19) and reporting

### External API
**Uses any third-party APIs?**
- **None** - This is a gap analysis operation
- Uses internal database tables: `userCompetency`, Skills Taxonomy tables, user profile tables

### AI
**Includes AI logic?**
- **No** - This is a comprehensive gap analysis feature
- Uses recursive traversal and user profile comparison

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend gap analysis feature
- Results will be displayed in frontend or sent to Learner AI for comprehensive learning path recommendations
- Broad scope provides complete view of career path gaps

### Dependencies
**Relies on other features?**
- **Feature 12:** Requires exam results with `exam_status = PASS` (baseline or course exam)
- **Feature 17:** Uses Recursive Hierarchy Traversal to collect all required MGS for Career Path Goal
- **Feature 18:** Uses Compare Against User Profile to identify missing MGS
- **Feature 16:** Calculates Relevance Score during analysis
- **Feature 4:** Requires complete Skills Taxonomy database
- **User Profile:** Requires user's Career Path Goal to be set
- **Database tables:** `userCompetency`, Skills Taxonomy tables, user profile tables must exist
- Output feeds into Feature 19 (Generate Structured Gap Map) for reporting

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log broad gap analysis triggers, Career Path Goal retrieval, traversal operations, missing MGS count across all competencies
- **Analytics:** Track broad gap analysis frequency, average missing MGS per career path, gap distribution across competencies, Relevance Score trends
- **Rollout:** Runs automatically when baseline exam or course exam passes (after Feature 12)
- **Monitoring:** Track Career Path Goal lookup errors, traversal performance, comparison accuracy, Relevance Score calculation performance

---

## Feature 22: Send Gap Analysis to Learner AI

### Goal
**What is the feature's main purpose?**
- Send structured map of missing skills asynchronously to Learner AI microservice
- Provide gap analysis results for learning path recommendations
- Include comprehensive context: exam status, missing skills map, course/competency details
- Enable Learner AI to generate personalized learning recommendations based on skill gaps

### Logic
**Any custom algorithm or logic?**
- **Input preparation:**
  1. **Receive gap analysis results:** Get structured gap map from Feature 19 (Generate Structured Gap Map)
  2. **Get exam context:** Retrieve exam status, exam type, and related details
  3. **Get user context:** Retrieve user_id, user_name, company, and other user details
  4. **Get course/competency details:** Retrieve course_name (for narrow gap) or Career Path Goal (for broad gap)
- **Payload construction:**
  1. **Build structured payload:**
     ```json
     {
       "user_id": "<user_id>",
       "user_name": "<user_name>",
       "company": "<company>",
       "exam_status": "<PASS or FAIL>",
       "exam_type": "<Baseline or Post-Course>",
       "course_name": "<course_name>", // if narrow gap analysis
       "missing_skills_map": {
         "Competency Name/ID": [
           {
             "skill_id": "<skill_id>",
             "skill_name": "<skill_name>"
           },
           ...
         ],
         "Nested Competency Name/ID": [
           {
             "skill_id": "<skill_id>",
             "skill_name": "<skill_name>"
           },
           ...
         ],
         ...
       },
       // Note: Competencies can include nested competencies (sub-competencies)
       "career_path_goal": "<career_path_goal>", // if broad gap analysis
       "timestamp": "<timestamp>"
     }
     ```
  2. **Include exam status:** Add exam_status (PASS or FAIL) to payload
  3. **Include missing skills map:** Add structured map from Feature 19
  4. **Include course/competency details:**
     - For narrow gap: Include course_name and target competency details
     - For broad gap: Include Career Path Goal and all competency details
- **Asynchronous communication:**
  1. **API endpoint:** Send POST request to Learner AI microservice endpoint
  2. **Asynchronous mode:** Use async messaging (webhook, message queue, or async HTTP)
  3. **No blocking:** Do not wait for response, process continues independently
  4. **Error handling:** Handle delivery failures gracefully (retry logic, dead letter queue)
- **Delivery confirmation:**
  1. **Optional acknowledgment:** May receive acknowledgment from Learner AI (if supported)
  2. **Logging:** Log successful delivery or failure
  3. **Retry mechanism:** Retry failed deliveries with exponential backoff

### External API
**Uses any third-party APIs?**
- **Learner AI Microservice (MS #7):** Sends gap analysis results via asynchronous API
- **Communication method:** Asynchronous (webhook, message queue, or async HTTP POST)
- **Endpoint:** POST request to Learner AI endpoint (e.g., `/learner-ai/gap-analysis` or similar)
- **No direct third-party APIs** - internal microservice communication

### AI
**Includes AI logic?**
- **No** - This is a data transmission feature
- Sends gap analysis results to Learner AI which uses AI for learning recommendations

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API integration feature
- No user-facing UI required
- Processing happens automatically after gap analysis completes
- Learner AI will use the data to provide learning recommendations to users

### Dependencies
**Relies on other features?**
- **Feature 19:** Requires structured gap map from Generate Structured Gap Map
- **Feature 20 or 21:** Requires gap analysis results (Narrow or Broad)
- **Feature 12:** Requires exam results with exam_status and exam_type
- **Learner AI Microservice:** Must be available to receive the asynchronous message
- **Message Queue/Event Bus:** If using message queue for async communication (optional)
- Output: Gap analysis data available in Learner AI for learning path generation

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all gap analysis transmissions, payload construction, delivery success/failures, retry attempts
- **Analytics:** Track transmission success rate, delivery time, payload size, Learner AI response rate
- **Rollout:** Runs automatically after gap analysis completes (after Feature 19)
- **Monitoring:** Track API endpoint availability, delivery failures, retry queue depth, message queue health, Learner AI service availability

---

## Feature 50: Return Updated Profile to Directory (After Exam)

### Goal
**What is the feature's main purpose?**
- Return updated user profile to Directory microservice after exam completion (Baseline or Post-Course)
- Update skills and competency profile in database first, then return updated data
- Include Relevance Score in the response after it's calculated
- Provide comprehensive updated profile data including competencies, skills, coverage percentages, and Relevance Score
- Enable Directory to display updated user profile summary

### Logic
**Any custom algorithm or logic?**
- **Profile update process (prerequisite):**
  1. **After exam completion:** Exam results have been received and processed (Feature 12)
  2. **Update verified skills:** Skills Engine updates verified skills in `userCompetency` table (Feature 13)
  3. **Update competency profile:** 
     - Calculate Coverage Percentage for each competency (Feature 14)
     - Map to Proficiency Level (Feature 15)
     - Update competency records in database
  4. **Calculate Relevance Score:** Calculate Relevance Score for Career Path Goal (Feature 16)
  5. **Store updates:** All profile updates are persisted in database before returning to Directory
- **Data compilation:**
  1. **Retrieve updated profile:** Query updated user profile from database:
     - All competencies for the user
     - L1 Skills only (not MGS)
     - Coverage Percentage for each competency
     - Proficiency Level for each competency
     - Relevance Score (calculated and stored)
  2. **Format competency data:** For each competency, include:
     - Competency ID and name
     - Associated L1 Skills only (no tested_mgs field)
     - Coverage Percentage
     - Proficiency Level
     - Nested competencies (sub-competencies) if they exist, with the same structure
  3. **Include Relevance Score:** Add calculated Relevance Score to response
- **Secure URL generation:**
  1. **Generate secure URL:** Create secure, time-limited URL for Skills Engine's expanded profile page
  2. **Include in response:** Add secure URL to response payload
- **Response preparation:**
  1. **Build response payload:**
     ```json
     {
       "user_id": "<user_id>",
       "user_name": "<user_name>",
       "competencies": [
         {
           "competency_id": "<competency_id>",
           "competency_name": "<competency_name>",
           "l1_skills": [
             {
               "skill_id": "<skill_id>",
               "skill_name": "<skill_name>"
             },
             ...
           ],
           "coverage_percentage": <percentage>,
           "proficiency_level": "<BEGINNER/INTERMEDIATE/ADVANCED/EXPERT>",
           "nested_competencies": [
             {
               "competency_id": "<nested_competency_id>",
               "competency_name": "<nested_competency_name>",
               "l1_skills": [...],
               "coverage_percentage": <percentage>,
               "proficiency_level": "<BEGINNER/INTERMEDIATE/ADVANCED/EXPERT>"
             },
             ...
           ]
         },
         ...
       ],
       // Note: Competencies can include nested competencies (sub-competencies)
       "relevance_score": <score>,
       "secure_profile_url": "<secure_url>",
       "timestamp": "<timestamp>"
     }
     ```
  2. **Include all required fields:** Ensure all data from updated profile is included
- **Asynchronous return:**
  1. **Send to Directory:** Send response back to Directory microservice (asynchronous communication)
  2. **No blocking:** Do not wait for Directory acknowledgment, process continues independently

### External API
**Uses any third-party APIs?**
- **Directory Microservice (MS #1):** Returns updated profile data to Directory
- **Asynchronous communication:** Response sent back to Directory after profile update completes
- **No direct third-party APIs** - internal microservice communication

### AI
**Includes AI logic?**
- **No** - This is a data retrieval, formatting, and transmission feature
- Uses updated profile data from database (updated by Features 13-16)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API integration feature
- No user-facing UI required
- Response data will be displayed in Directory microservice UI
- Secure URL allows users to navigate to full Skills Engine profile page

### Dependencies
**Relies on other features?**
- **Feature 12:** Requires exam results to be received (Baseline or Post-Course)
- **Feature 13:** Requires verified skills to be updated in database
- **Feature 14:** Requires Coverage Percentage to be calculated
- **Feature 15:** Requires Proficiency Level to be mapped
- **Feature 16:** Requires Relevance Score to be calculated and stored
- **Feature 20 or 21:** May trigger gap analysis (but profile return happens regardless)
- **Database tables:** `userCompetency`, `userSkill` must exist with updated data
- **Directory Microservice:** Must be available to receive the response
- Output: Updated profile available in Directory for user dashboard display

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all profile updates sent to Directory, payload construction, delivery success/failures, Relevance Score inclusion
- **Analytics:** Track profile update transmission rate, response size, Directory service response time, Relevance Score distribution
- **Rollout:** Runs automatically after profile update completes (after Features 13-16)
- **Monitoring:** Track Directory service availability, delivery failures, response construction errors, Relevance Score calculation accuracy

---

**Note:** This document will continue with Features 51-55. Each feature will be detailed with the same structure.

**Last Updated:** 2025-01-27

---

## Feature 23: Competency Retrieval API Endpoint (Conditional Logic)

### Goal
**What is the feature's main purpose?**
- Expose synchronous API endpoint to process requests for Competency Name
- **Conditional logic based on calling microservice:** Handle requests differently based on which microservice is calling
- **For Course Builder (MS #3):** Use AI Normalization for fuzzy matching, trigger dynamic discovery if missing
- **For Content Studio (MS #4) or Learner AI (MS #7):** Only perform internal database lookup, no dynamic discovery
- Return full list of underlying Most Granular Skills (MGS) for the requested competency

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create synchronous API endpoint (e.g., `GET /api/competency/:competencyName/skills` or `POST /api/competency/retrieve`)
  2. **Request format:** Accept Competency Name as input parameter
  3. **Synchronous response:** Return response immediately (blocking call)
- **Authentication and authorization:**
  1. **Token validation:** Validate microservice token from request headers
  2. **Token-based authentication:** Check token against stored microservice tokens
  3. **Service identification:** Identify calling microservice from token:
     - Course Builder (MS #3)
     - Content Studio (MS #4)
     - Learner AI (MS #7)
  4. **Authorization check:** Verify that token belongs to one of these services
  5. **Reject if invalid:** Return 401 Unauthorized if token is missing or invalid
- **Conditional processing based on calling service:**
  1. **Extract competency name:** Get Competency Name from request parameters
  2. **Route based on service:**
     - **If Course Builder (MS #3):** Use Course Builder path (Features 24-26)
     - **If Content Studio (MS #4) or Learner AI (MS #7):** Use Lookup-only path (Features 27-29)
- **Course Builder (MS #3) Path:**
  1. **AI Normalization & Fuzzy Matching:** Use Feature 24 (AI Normalization & Fuzzy Matching) to fuzzy-match the requested competency name
  2. **Check if competency found:**
     - If competency found in database: Proceed to retrieve MGS
     - If competency NOT found in database: Proceed to dynamic discovery
  3. **If competency missing/not found:**
     - Trigger Feature 25 (External Knowledge Discovery Trigger) to dynamically discover and import the competency
     - Wait for discovery to complete
     - Store discovered competency in taxonomy database
  4. **Retrieve MGS:** Once competency is confirmed (either found or discovered), use Feature 26 (Return MGS List) to retrieve all underlying MGS
  5. **Return response:** Return full list of MGS associated with the competency
- **Content Studio (MS #4) / Learner AI (MS #7) Path:**
  1. **Internal lookup only:** Use Feature 28 (Internal Database Lookup Only) to perform lookup within existing internal database
  2. **No fuzzy matching:** Do NOT use AI Normalization or fuzzy matching
  3. **No dynamic discovery:** Do NOT trigger External Knowledge Discovery
  4. **If competency found:** Use Feature 29 (Return MGS List) to retrieve and return relevant MGS
  5. **If competency not found:** Return 404 Not Found (do NOT attempt discovery)
  6. **Fast, stable response:** Ensure fast and stable responses using verified internal data only
- **Response format:**
  ```json
  {
    "competency_id": "<competency_id>",
    "competency_name": "<competency_name>",
    "mgs": [
      {
        "skill_id": "<skill_id>",
        "skill_name": "<skill_name>"
      },
      ...
    ]
  }
  ```

### External API
**Uses any third-party APIs?**
- **Course Builder Microservice (MS #3):** Receives synchronous API requests from Course Builder
- **Content Studio Microservice (MS #4):** Receives synchronous API requests from Content Studio
- **Learner AI Microservice (MS #7):** Receives synchronous API requests from Learner AI
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal microservice communication
- May trigger External Knowledge Discovery (Feature 25) which uses Google Gemini API (only for Course Builder path)

### AI
**Includes AI logic?**
- **Conditional AI usage based on calling service:**
  - **For Course Builder (MS #3):** 
    - Uses Feature 24 (AI Normalization & Fuzzy Matching) for competency name matching
    - May trigger Feature 25 (External Knowledge Discovery) which uses AI if competency is missing
  - **For Content Studio (MS #4) / Learner AI (MS #7):**
    - **No AI logic** - lookup-only mode, no fuzzy matching, no discovery

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by Course Builder, Content Studio, or Learner AI microservices programmatically

### Dependencies
**Relies on other features?**
- **Feature 4:** Requires Skills Taxonomy database to be populated
- **For Course Builder (MS #3) path:**
  - **Feature 24:** Uses AI Normalization & Fuzzy Matching for competency name matching
  - **Feature 25:** May trigger External Knowledge Discovery if competency is missing/not found
  - **Feature 26:** Uses Return MGS List to return data to Course Builder
- **For Content Studio (MS #4) / Learner AI (MS #7) path:**
  - **Feature 28:** Uses Internal Database Lookup Only (no fuzzy matching, no discovery)
  - **Feature 29:** Uses Return MGS List to return data to Content Studio/Learner AI
- **Authentication Service:** Requires token validation mechanism for all three microservices (Course Builder, Content Studio, Learner AI)
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill` must exist
- Output: Competency data and MGS list returned to calling microservice (behavior differs based on calling service)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all API requests, token validations, service identification, competency lookups, response times, discovery triggers, path taken (Course Builder vs Lookup-only)
- **Analytics:** 
  - Track API request rate per microservice (Course Builder, Content Studio, Learner AI)
  - Track competency lookup success rate per path
  - Track external discovery trigger rate (Course Builder path only)
  - Track response time distribution per path
  - Track 404 rate for Content Studio/Learner AI (competency not found)
- **Rollout:** Must be available before Course Builder, Content Studio, or Learner AI can request competency data
- **Monitoring:** Track API endpoint availability, authentication failures, database query performance, external discovery performance (Course Builder path), lookup-only performance (Content Studio/Learner AI path), response time SLA per path

---

---

## Feature 24: AI Normalization & Fuzzy Matching (Course Builder)

### Goal
**What is the feature's main purpose?**
- Apply AI normalization to perform fuzzy match of requested competency name from Course Builder
- Match requested competency name to existing competencies in internal database
- Handle variations in naming, spelling, and terminology
- Enable Course Builder to find competencies even with slight name differences

### Logic
**Any custom algorithm or logic?**
- **Input:** Receive requested competency name from Feature 23 (Competency Retrieval API Endpoint)
- **Normalization process:**
  1. **Normalize requested name:** Apply normalization rules to the requested competency name:
     - Convert to lowercase
     - Remove leading, trailing, and duplicate spaces
     - Remove punctuation, emojis, and special symbols (keep only letters, digits, spaces)
     - Replace dashes (-) and underscores (_) with single spaces
     - Remove duplicate or repeated words
     - Convert accented/non-ASCII characters to plain English
     - Prefer full, clear forms (e.g., "ai" → "artificial intelligence")
  2. **Normalize database names:** Apply same normalization rules to all competency names in database
- **Fuzzy matching algorithm:**
  1. **Semantic similarity:** Use AI to determine semantic similarity between normalized requested name and database competency names
  2. **Matching criteria:**
     - Exact match (after normalization)
     - High semantic similarity (same meaning, different wording)
     - Partial match (requested name is subset or superset of database name)
  3. **Score calculation:** Calculate similarity score for each potential match
  4. **Threshold:** Set minimum similarity threshold for accepting a match
  5. **Best match selection:** Select competency with highest similarity score above threshold
- **AI-based matching:**
  1. **Use Gemini Flash:** Fast AI model for semantic matching
  2. **Prompt structure:**
     - Input: Normalized requested competency name and list of normalized database competency names
     - Task: Find best matching competency based on semantic meaning
     - Output: Matched competency ID and name, or null if no good match
  3. **Handle multiple candidates:** If multiple close matches, return best match or ask for clarification
- **Result:**
  1. **If match found:** Return matched competency ID and name
  2. **If no match found:** Return null/not found (triggers Feature 25 - External Knowledge Discovery)
  3. **Confidence score:** Include confidence/similarity score with match result

### External API
**Uses any third-party APIs?**
- **Google Gemini API:** Uses Gemini Flash for fast semantic matching and normalization
- **No other third-party APIs** - matching is AI-based text processing

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** 
  - Normalize competency names for consistent comparison
  - Perform semantic fuzzy matching to find best match
- **Model:** Gemini Flash (for fast normalization and matching operations)
- **Prompt:** May use normalization prompt from `/docs/prompts/normalization_prompt.txt` for normalization step
- **Fuzzy matching prompt:** Custom prompt for semantic matching:
  - Input: Normalized requested competency name, list of normalized database competency names
  - Task: Find best semantic match
  - Output: Matched competency or null
- **Expected Output:**
  - Matched competency ID and name (if match found)
  - Confidence/similarity score
  - Or null/not found (if no good match)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend AI matching feature
- No user-facing UI required
- Processing happens automatically in Feature 23 flow

### Dependencies
**Relies on other features?**
- **Feature 23:** Requires competency name from Competency Retrieval API Endpoint
- **Feature 4:** Requires Skills Taxonomy database with competency names
- **Feature 7:** May reuse normalization logic from Normalize Extracted Skills & Competencies
- **Google Gemini API:** Must be available for AI matching
- Output feeds into Feature 25 (External Knowledge Discovery) if no match found, or Feature 26 (Return MGS List) if match found

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all normalization operations, fuzzy matching attempts, match results, confidence scores
- **Analytics:** Track matching success rate, average confidence scores, normalization performance, no-match rate
- **Rollout:** Runs automatically as part of Feature 23 flow
- **Monitoring:** Track AI API response times, matching accuracy, false positive/negative rates, normalization errors

---

## Feature 25: External Knowledge Discovery Trigger (Course Builder)

### Goal
**What is the feature's main purpose?**
- Trigger External Knowledge Discovery when competency or skills are missing/incomplete in internal database
- Perform broad search across internet to discover new competency and skill data
- Extract and normalize newly discovered findings
- Store discovered data in taxonomy database
- Enable dynamic taxonomy enrichment for Course Builder

### Logic
**Any custom algorithm or logic?**
- **Trigger condition:**
  1. **Input:** Receive request from Feature 23 or Feature 24 after fuzzy matching fails
  2. **Check status:** Competency is missing or incomplete (missing associated MGS)
  3. **Trigger decision:** If competency not found or incomplete, trigger External Knowledge Discovery
- **Internal lookup first:**
  1. **Double-check:** Perform final internal database lookup to confirm competency is truly missing
  2. **Verify completeness:** If competency exists, check if all required MGS are present
  3. **Proceed if needed:** Only trigger discovery if competency is missing or incomplete
- **External Knowledge Discovery process:**
  1. **Broad search:** Use AI (Google Gemini Deep-Search) to perform broad search across internet
  2. **Search strategy:**
     - Search for competency name and related terms
     - Search for official documentation, standards, and authoritative sources
     - Search for skill lists and competency frameworks related to the competency
  3. **Content extraction:** Extract relevant content from discovered sources
  4. **AI extraction:** Use Feature 2 (Data Extraction, Understanding & Hierarchy Construction) logic:
     - Extract competencies, skills, and hierarchical levels
     - Build hierarchical structure
     - Identify relationships
- **Normalization and validation:**
  1. **Normalize findings:** Apply Feature 7 (Normalize Extracted Skills & Competencies) to normalize discovered data
  2. **Validate structure:** Ensure hierarchical relationships are valid
  3. **Deduplication:** Remove duplicates and merge with existing taxonomy
- **Storage process:**
  1. **Store in taxonomy:** Save discovered competency and skills to Skills Taxonomy database
  2. **Preserve hierarchy:** Maintain hierarchical relationships (competency → skills → subskills → MGS)
  3. **Link relationships:** Establish competency_requiredSkills, skill_subSkill relationships
  4. **Transaction management:** Ensure atomic operations (all or nothing)
- **Return discovered data:**
  1. **Prepare response:** Format discovered competency and MGS list
  2. **Return to caller:** Return discovered data to Feature 23 or Feature 26
  3. **Include metadata:** Include source information and discovery timestamp

### External API
**Uses any third-party APIs?**
- **Google Gemini API:** Uses Gemini Deep-Search for broad internet search and content extraction
- **Internet search:** Performs web search across various sources (documentation, standards, frameworks)
- **No other third-party APIs** - discovery uses AI-powered web search

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:**
  - Perform broad internet search for competency and skill information
  - Extract and understand hierarchical skill structures from discovered sources
  - Semantic understanding of competency and skill relationships
- **Model:** Gemini Deep-Search (for deep semantic understanding and comprehensive search)
- **Prompt:** Similar to Feature 2 semantic extraction prompt, adapted for external discovery:
  - Search for competency information across internet
  - Extract hierarchical skill structures
  - Identify official sources and authoritative documentation
  - Build complete competency taxonomy with all MGS
- **Expected Output:**
  - Discovered competency with complete hierarchical structure
  - All associated MGS identified and structured
  - Source information for discovered data
  - Ready for normalization and storage

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend discovery feature
- No user-facing UI required
- Processing happens automatically when competency is missing
- May have admin dashboard in future to monitor discovery operations (not in MVP)

### Dependencies
**Relies on other features?**
- **Feature 23 or 24:** Triggered when competency lookup fails or competency is incomplete
- **Feature 2:** Uses similar extraction logic for discovered content
- **Feature 7:** Requires normalization of discovered data before storage
- **Feature 4:** Requires Skills Taxonomy database structure for storage
- **Google Gemini API:** Must be available for Deep-Search operations
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill` must exist
- Output feeds into Feature 26 (Return MGS List) to return discovered data to Course Builder

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all discovery triggers, search operations, extraction results, storage operations, discovered data sources
- **Analytics:** Track discovery frequency, discovery success rate, average discovery time, number of skills discovered per competency, source quality
- **Rollout:** Runs automatically when competency is missing (triggered by Feature 23/24)
- **Monitoring:** Track AI search performance, extraction accuracy, storage success rate, discovery errors, internet connectivity issues

---

## Feature 26: Return MGS List (Course Builder)

### Goal
**What is the feature's main purpose?**
- Return full list of MGS (Most Granular Skills) associated with a competency to Course Builder
- Execute after competency and all underlying MGS are confirmed (either found in database or discovered externally)
- Provide complete MGS list for Course Builder to use in course creation
- Enable Course Builder to dynamically enrich and complete competency taxonomy

### Logic
**Any custom algorithm or logic?**
- **Prerequisite check:**
  1. **Competency confirmation:** Competency must be confirmed (either found via Feature 24 or discovered via Feature 25)
  2. **MGS completeness:** All underlying MGS must be confirmed and available
  3. **Data readiness:** Competency and MGS data must be stored in taxonomy database
- **MGS retrieval process:**
  1. **Get competency:** Retrieve competency from database (using competency_id from match or discovery)
  2. **Traverse hierarchy:** Use recursive traversal to collect all MGS for the competency:
     - Get all L1 skills required for the competency (from `competency_requiredSkills` table)
     - For each L1 skill, recursively traverse down the hierarchy
     - Collect all MGS (leaf nodes) under each L1 skill
  3. **Flatten list:** Create flattened list of all unique MGS
  4. **Remove duplicates:** Ensure no duplicate MGS in the list
- **Response preparation:**
  1. **Format MGS list:** Structure each MGS with:
     - `skill_id`: Unique identifier for the MGS
     - `skill_name`: Name of the MGS
  2. **Include competency info:** Add competency_id and competency_name to response
- **Response format:**
  ```json
  {
    "competency_id": "<competency_id>",
    "competency_name": "<competency_name>",
    "mgs": [
      {
        "skill_id": "<skill_id>",
        "skill_name": "<skill_name>"
      },
      ...
    ]
  }
  ```
- **Return to Course Builder:**
  1. **Synchronous response:** Return response immediately to Feature 23
  2. **Complete data:** Ensure all MGS are included in response
  3. **Ready for use:** Course Builder can immediately use the MGS list for course creation

### External API
**Uses any third-party APIs?**
- **Course Builder Microservice (MS #3):** Returns MGS list via Feature 23 API endpoint
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal data retrieval and formatting

### AI
**Includes AI logic?**
- **No** - This is a data retrieval and formatting feature
- Uses data from Skills Taxonomy database (populated by Features 2-4 or Feature 25)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend data retrieval feature
- No user-facing UI required
- Response is consumed by Course Builder microservice programmatically

### Dependencies
**Relies on other features?**
- **Feature 23:** Receives request context from Competency Retrieval API Endpoint
- **Feature 24:** Requires competency to be matched (if found in database)
- **Feature 25:** Requires competency to be discovered (if missing from database)
- **Feature 4:** Requires Skills Taxonomy database with complete hierarchy structure
- **Feature 17:** Uses recursive traversal logic to collect all MGS
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill` must exist
- Output: MGS list returned to Course Builder via Feature 23

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all MGS list retrievals, competency lookups, traversal operations, response preparation
- **Analytics:** Track MGS list retrieval rate, average MGS count per competency, response time, source distribution (internal vs external)
- **Rollout:** Runs automatically after competency is confirmed (via Feature 24 or 25)
- **Monitoring:** Track retrieval performance, traversal depth, database query performance, response time SLA

---

## Feature 27: Competency Lookup API Endpoint (Content Studio & Learner AI)

### Goal
**What is the feature's main purpose?**
- **Part of Feature 23:** This feature is used by Feature 23 when the calling service is Content Studio (MS #4) or Learner AI (MS #7)
- Provide lookup-only access to existing competency data in internal database
- Ensure fast, stable responses using verified internal data only
- Do NOT trigger dynamic discovery or import (unlike Course Builder path in Feature 23)

### Logic
**Any custom algorithm or logic?**
- **Note:** This feature is invoked by Feature 23 when the calling service is Content Studio (MS #4) or Learner AI (MS #7)
- **Request processing (called from Feature 23):**
  1. **Receive request context:** Get Competency Name and service identification from Feature 23
  2. **Lookup-only mode:** Perform lookup ONLY in internal database (no external discovery)
  3. **No fuzzy matching:** Use exact or normalized name matching (no AI fuzzy matching)
  4. **No discovery trigger:** Do NOT trigger External Knowledge Discovery if competency not found
  5. **Service context:** Know that request is from Content Studio or Learner AI (not Course Builder)
- **Database lookup:**
  1. **Query database:** Search for competency in `competencies` table
  2. **Exact match:** Try exact name match first
  3. **Normalized match:** If no exact match, try normalized name match (case-insensitive, trimmed)
  4. **Result:** Return competency if found, or return 404 Not Found if not found
- **Response preparation (if found):**
  1. **Retrieve MGS:** Get all MGS associated with the competency (using Feature 17 traversal logic)
  2. **Format response:** Structure response with competency info and MGS list
- **Response format:**
  ```json
  {
    "competency_id": "<competency_id>",
    "competency_name": "<competency_name>",
    "mgs": [
      {
        "skill_id": "<skill_id>",
        "skill_name": "<skill_name>"
      },
      ...
    ]
  }
  ```
- **Error handling:**
  1. **If competency not found:** Return 404 Not Found (do NOT trigger discovery)
  2. **If token invalid:** Return 401 Unauthorized
  3. **If database error:** Return 500 Internal Server Error

### External API
**Uses any third-party APIs?**
- **Note:** This feature is part of Feature 23's conditional logic path
- **Content Studio Microservice (MS #4):** Receives requests via Feature 23 API endpoint
- **Learner AI Microservice (MS #7):** Receives requests via Feature 23 API endpoint
- **Communication method:** Synchronous HTTP (REST API) - handled by Feature 23
- **No direct third-party APIs** - internal database lookup only
- **No external discovery** - lookup-only mode

### AI
**Includes AI logic?**
- **No** - This is a lookup-only feature
- No AI fuzzy matching (unlike Feature 24 for Course Builder)
- No external discovery (unlike Feature 25 for Course Builder)
- Uses only database queries

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend lookup feature (part of Feature 23)
- No user-facing UI required
- Logic is used by Feature 23 when handling requests from Content Studio or Learner AI

### Dependencies
**Relies on other features?**
- **Feature 23:** Invoked by Feature 23 when calling service is Content Studio or Learner AI
- **Feature 4:** Requires Skills Taxonomy database to be populated
- **Feature 17:** Uses recursive traversal logic to collect all MGS (if competency found)
- **Feature 28:** Uses Internal Database Lookup Only logic
- **Feature 29:** Uses Return MGS List to format response
- **Authentication Service:** Token validation handled by Feature 23
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill` must exist
- Output: Competency data returned to Content Studio or Learner AI via Feature 23 (lookup-only, no discovery)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all lookup operations, competency lookups, response times, not-found cases (as part of Feature 23 logging)
- **Analytics:** Track lookup success rate, response time, not-found frequency (tracked per path in Feature 23)
- **Rollout:** Available as part of Feature 23 rollout (lookup-only path for Content Studio/Learner AI)
- **Monitoring:** Track database query performance, response time SLA, 404 rate (monitored as part of Feature 23)

---

## Feature 28: Internal Database Lookup Only

### Goal
**What is the feature's main purpose?**
- **Part of Feature 23:** This feature is used by Feature 23 when the calling service is Content Studio (MS #4) or Learner AI (MS #7)
- Perform lookup only within existing internal database (no external discovery)
- Ensure fast, stable responses using verified internal data only
- Do NOT trigger dynamic discovery or import
- Support Content Studio and Learner AI with reliable, predictable data access

### Logic
**Any custom algorithm or logic?**
- **Lookup mode:**
  1. **Internal-only:** Restrict all queries to internal Skills Taxonomy database
  2. **No external calls:** Do not make any external API calls or internet searches
  3. **No discovery:** Do not trigger Feature 25 (External Knowledge Discovery)
  4. **Fast response:** Use optimized database queries for quick responses
- **Database query optimization:**
  1. **Indexed lookups:** Use database indexes for fast competency name searches
  2. **Cached results:** May cache frequently accessed competency data (optional)
  3. **Query optimization:** Use efficient SQL queries with proper joins
  4. **Connection pooling:** Reuse database connections for performance
- **Error handling:**
  1. **If not found:** Return 404 Not Found immediately (no retry, no discovery)
  2. **If database error:** Return 500 Internal Server Error
  3. **No fallback:** Do not attempt external discovery as fallback
- **Response guarantee:**
  1. **Stable data:** Only return data that exists in verified internal database
  2. **No surprises:** Response time and data structure are predictable
  3. **Consistent behavior:** Same request always returns same result (if data unchanged)

### External API
**Uses any third-party APIs?**
- **Note:** This feature is part of Feature 23's conditional logic path (lookup-only mode)
- **None** - This is an internal database lookup feature
- No external API calls, no internet searches, no discovery operations
- Used by Feature 23 when handling requests from Content Studio or Learner AI

### AI
**Includes AI logic?**
- **No** - This is a database lookup feature
- No AI processing, no fuzzy matching, no external discovery
- Pure database query operations

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend database lookup feature (part of Feature 23)
- No user-facing UI required
- Used internally by Feature 27 and Feature 29 (which are part of Feature 23's lookup-only path)

### Dependencies
**Relies on other features?**
- **Feature 23:** Used by Feature 23 when calling service is Content Studio or Learner AI
- **Feature 4:** Requires Skills Taxonomy database to be populated
- **Feature 27:** Used by Competency Lookup API Endpoint (which is part of Feature 23)
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill` must exist
- Output: Fast, stable competency lookups for Content Studio and Learner AI (via Feature 23)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all database lookups, query performance, cache hits/misses, not-found cases (as part of Feature 23 logging)
- **Analytics:** Track lookup performance, query response times, database load, cache effectiveness (tracked per path in Feature 23)
- **Rollout:** Available as part of Feature 23 rollout (lookup-only path for Content Studio/Learner AI)
- **Monitoring:** Track database query performance, index usage, connection pool health, response time consistency (monitored as part of Feature 23)

---

## Feature 29: Return MGS List (Content Studio & Learner AI)

### Goal
**What is the feature's main purpose?**
- **Part of Feature 23:** This feature is used by Feature 23 when the calling service is Content Studio (MS #4) or Learner AI (MS #7)
- Retrieve and return relevant Most Granular Skills (MGS) for requested competency
- Return MGS list to Content Studio or Learner AI after successful lookup
- Provide complete MGS list from verified internal database only
- Ensure fast, stable responses using internal data

### Logic
**Any custom algorithm or logic?**
- **Prerequisite:**
  1. **Competency found:** Competency must be found in internal database via Feature 28
  2. **Lookup success:** Feature 27 lookup must have succeeded
  3. **Data available:** Competency and MGS data must exist in taxonomy database
- **MGS retrieval process:**
  1. **Get competency:** Retrieve competency from database (using competency_id from lookup)
  2. **Traverse hierarchy:** Use recursive traversal (Feature 17 logic) to collect all MGS:
     - Get all L1 skills required for the competency (from `competency_requiredSkills` table)
     - For each L1 skill, recursively traverse down the hierarchy
     - Collect all MGS (leaf nodes) under each L1 skill
  3. **Flatten list:** Create flattened list of all unique MGS
  4. **Remove duplicates:** Ensure no duplicate MGS in the list
- **Response preparation:**
  1. **Format MGS list:** Structure each MGS with:
     - `skill_id`: Unique identifier for the MGS
     - `skill_name`: Name of the MGS
  2. **Include competency info:** Add competency_id and competency_name to response
- **Response format:**
  ```json
  {
    "competency_id": "<competency_id>",
    "competency_name": "<competency_name>",
    "mgs": [
      {
        "skill_id": "<skill_id>",
        "skill_name": "<skill_name>"
      },
      ...
    ]
  }
  ```
- **Return to caller:**
  1. **Synchronous response:** Return response immediately to Feature 23 (which then returns to Content Studio or Learner AI)
  2. **Complete data:** Ensure all MGS are included in response
  3. **Ready for use:** Content Studio or Learner AI can immediately use the MGS list (via Feature 23)

### External API
**Uses any third-party APIs?**
- **Note:** This feature is part of Feature 23's conditional logic path
- **Content Studio Microservice (MS #4):** Returns MGS list via Feature 23 API endpoint
- **Learner AI Microservice (MS #7):** Returns MGS list via Feature 23 API endpoint
- **Communication method:** Synchronous HTTP (REST API) - handled by Feature 23
- **No direct third-party APIs** - internal data retrieval and formatting

### AI
**Includes AI logic?**
- **No** - This is a data retrieval and formatting feature
- Uses data from Skills Taxonomy database only (no external discovery)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend data retrieval feature (part of Feature 23)
- No user-facing UI required
- Response is consumed by Content Studio or Learner AI microservices programmatically via Feature 23

### Dependencies
**Relies on other features?**
- **Feature 23:** Used by Feature 23 when calling service is Content Studio or Learner AI
- **Feature 27:** Receives request context from Competency Lookup API Endpoint (which is part of Feature 23)
- **Feature 28:** Requires successful internal database lookup
- **Feature 4:** Requires Skills Taxonomy database with complete hierarchy structure
- **Feature 17:** Uses recursive traversal logic to collect all MGS
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill` must exist
- Output: MGS list returned to Content Studio or Learner AI via Feature 23

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all MGS list retrievals, competency lookups, traversal operations, response preparation (as part of Feature 23 logging)
- **Analytics:** Track MGS list retrieval rate, average MGS count per competency, response time, lookup success rate (tracked per path in Feature 23)
- **Rollout:** Available as part of Feature 23 rollout (lookup-only path for Content Studio/Learner AI)
- **Monitoring:** Track retrieval performance, traversal depth, database query performance, response time SLA (monitored as part of Feature 23)

---

## Feature 30: CSV File Upload (Trainer)

### Goal
**What is the feature's main purpose?**
- Provide file upload interface for Trainers to upload CSV files with custom hierarchical skills
- Support drag-and-drop or file picker interface
- Validate CSV format before processing
- Enforce access control to ensure only users with Trainer employee type can upload files

### Logic
**Any custom algorithm or logic?**
- **File upload interface:**
  1. **Upload methods:** Support both drag-and-drop and file picker (browse) interfaces
  2. **File selection:** Allow user to select CSV file from their device
  3. **File validation:** Validate file format before upload (must be .csv extension)
  4. **Size limits:** Enforce maximum file size limit (e.g., 10MB)
  5. **Progress indicator:** Show upload progress to user
- **Access control (frontend and backend):**
  1. **Frontend check:** Hide "Upload File" button if user does not have Trainer employee type
  2. **Backend validation:** Validate user's employee type on server before processing upload
  3. **Token/authentication:** Verify user authentication and role
  4. **Reject if unauthorized:** Return 403 Forbidden if user is not a Trainer
- **CSV format validation:**
  1. **File extension:** Check that file has .csv extension
  2. **File structure:** Validate that file can be parsed as CSV
  3. **Required columns:** Check for required columns in CSV (e.g., Competency, Skill, Subskill, etc.)
  4. **Data validation:** Basic validation of CSV structure before processing
- **Upload process:**
  1. **Receive file:** Accept uploaded CSV file
  2. **Store temporarily:** Store file temporarily for processing
  3. **Queue for processing:** Queue file for processing (Feature 31 - CSV Parsing & Validation)
  4. **Return acknowledgment:** Return success message to user

### External API
**Uses any third-party APIs?**
- **None** - This is a file upload feature
- File upload handled internally

### AI
**Includes AI logic?**
- **No** - This is a file upload and access control feature
- File processing happens in Feature 31

### UI/UX
**Requires unique design or interaction?**
- **Yes** - Requires file upload UI component
- **Design requirements:**
  - "Upload File" button visible only to Trainers (access control)
  - **Instructions and rules display:** When user clicks "Upload File" button, present instructions and rules about CSV upload:
    - CSV format requirements (columns, structure)
    - Hierarchical structure explanation (Competency → Skill → Subskill → Microskill → Nanoskill/MGS)
    - File size limits
    - Required fields
    - Example CSV structure
    - Common errors to avoid
  - Drag-and-drop area with visual feedback (after instructions)
  - File picker button (browse)
  - Upload progress indicator
  - Success/error messages
- **User experience:**
  - Clear instructions and rules displayed before file selection
  - Visual feedback during upload
  - Error messages for invalid files or unauthorized access
  - Instructions can be dismissed or kept visible during upload

### Dependencies
**Relies on other features?**
- **Authentication Service:** Requires user authentication and role validation
- **Access Control:** Requires employee type check (Trainer role)
- **File Storage:** Requires temporary file storage mechanism
- Output feeds into Feature 31 (CSV Parsing & Validation) for file processing

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all file upload attempts, access control checks, file validation results, upload success/failures
- **Analytics:** Track upload frequency, file sizes, upload success rate, access control violations, Trainer usage
- **Rollout:** Must be available for Trainers to upload custom skills
- **Monitoring:** Track upload performance, file storage usage, access control effectiveness, validation errors

---

## Feature 31: CSV Parsing & Validation

### Goal
**What is the feature's main purpose?**
- Parse uploaded CSV file containing custom hierarchical skills
- Validate that CSV contains required database fields
- Validate hierarchical structure of competencies, skills, and MGS
- Perform security validation to prevent SQL injection and prompt injection attacks
- Preserve relationships between Competencies, Skills, and MGS
- Prepare sanitized and validated data for normalization and integration into taxonomy

### Logic
**Any custom algorithm or logic?**
- **CSV parsing:**
  1. **Read CSV file:** Read uploaded CSV file from temporary storage
  2. **Parse rows:** Parse CSV into rows and columns
  3. **Extract headers:** Identify column headers (Competency, Skill, Subskill, Microskill, Nanoskill, etc.)
  4. **Map columns:** Map CSV columns to expected structure
- **Database field validation:**
  1. **Required DB fields:** Verify that CSV contains all required database fields:
     - Competency fields: `competency_id` or `competency_name` (mapped to `competencies` table)
     - Skill fields: `skill_id` or `skill_name` (mapped to `skills` table)
     - Level indicators: Proper level designation (L1, L2, L3, L4/MGS)
  2. **Field mapping:** Map CSV columns to database table columns
  3. **Missing fields:** Identify and report any missing required database fields
- **Hierarchical structure validation:**
  1. **Validate structure:** Ensure CSV represents valid hierarchical structure:
     - Competencies at top level
     - Skills nested under competencies
     - Subskills nested under skills
     - Microskills nested under subskills
     - Nanoskills/MGS at leaf level
  2. **Check relationships:** Validate parent-child relationships are properly represented
  3. **Detect cycles:** Check for circular references in hierarchy
  4. **Validate nesting:** Ensure proper nesting levels (no skipped levels)
- **Security validation (injection prevention):**
  1. **SQL injection prevention:**
     - **Pattern detection:** Scan all CSV cell values for SQL injection patterns:
       - SQL keywords: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `DROP`, `UNION`, `--`, `;`, etc.
       - SQL operators: `'`, `"`, `;`, `--`, `/*`, `*/`, `xp_`, `sp_`, etc.
     - **Character validation:** Check for suspicious characters and patterns
     - **Sanitization:** Remove or escape potentially dangerous SQL characters
     - **Reject if detected:** Reject CSV file if SQL injection patterns are found
  2. **Prompt injection prevention:**
     - **Pattern detection:** Scan all CSV cell values for prompt injection patterns:
       - AI instruction keywords: `ignore`, `forget`, `system`, `assistant`, `user:`, `system:`, etc.
       - Injection attempts: `[INST]`, `</s>`, `<<SYS>>`, `<<USER>>`, etc.
       - Command patterns: `execute`, `run`, `eval`, `exec`, etc.
     - **Context manipulation:** Detect attempts to manipulate AI context or instructions
     - **Sanitization:** Remove or escape potentially dangerous prompt injection patterns
     - **Reject if detected:** Reject CSV file if prompt injection patterns are found
  3. **Input sanitization:**
     - **Whitelist approach:** Only allow safe characters (letters, numbers, spaces, basic punctuation)
     - **Length limits:** Enforce maximum length for each field to prevent buffer overflow
     - **Encoding validation:** Ensure proper character encoding (UTF-8)
     - **Special character handling:** Escape or remove special characters that could be used for injection
- **Data validation:**
  1. **Required fields:** Check that required fields are present (at minimum: Competency, Skill)
  2. **Empty values:** Handle empty cells appropriately
  3. **Data types:** Validate data types where applicable
  4. **Name validation:** Check that competency and skill names are not empty
  5. **Content validation:** After security checks, validate that content is meaningful and valid
- **Relationship preservation:**
  1. **Parent-child mapping:** Map parent-child relationships from CSV structure
  2. **Competency-Skill links:** Identify which skills belong to which competencies
  3. **Skill hierarchy:** Preserve skill → subskill → microskill → nanoskill hierarchy
  4. **Store relationships:** Prepare relationship data for database insertion (after sanitization)
- **Data structure preparation:**
  1. **Organize data:** Structure parsed data into hierarchical format
  2. **Sanitized data:** Use sanitized data (after injection prevention) for further processing
  3. **Prepare for normalization:** Format data for Feature 32 (AI Normalization for Trainer Upload)
  4. **Error collection:** Collect validation errors for reporting
- **Error handling:**
  1. **Validation errors:** Collect all validation errors (structure, security, data)
  2. **Security errors:** Prioritize security errors and reject file immediately if injection detected
  3. **Error reporting:** Return detailed error messages for invalid data
  4. **Partial parsing:** May parse valid rows even if some rows have errors (only if no security issues)

### External API
**Uses any third-party APIs?**
- **None** - This is a CSV parsing and validation feature
- File parsing handled internally

### AI
**Includes AI logic?**
- **No** - This is a parsing and validation feature
- Normalization happens in Feature 32

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend parsing feature
- No user-facing UI required
- Validation errors will be displayed to user after parsing completes

### Dependencies
**Relies on other features?**
- **Feature 30:** Requires uploaded CSV file from CSV File Upload
- **File Storage:** Requires access to temporarily stored CSV file
- Output feeds into Feature 32 (AI Normalization for Trainer Upload) for data normalization

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all CSV parsing operations, validation results, structure validation, relationship mapping, parsing errors, security validation results, injection attempts (SQL injection, prompt injection)
- **Analytics:** Track parsing success rate, average file size, validation error rate, relationship count, parsing performance, security validation performance, injection attempt frequency
- **Security monitoring:** Track SQL injection attempts, prompt injection attempts, rejected files due to security issues, sanitization operations
- **Rollout:** Runs automatically after Feature 30 (file upload)
- **Monitoring:** Track parsing performance, validation accuracy, error types, file format issues, security validation performance, injection detection rate

---

## Feature 32: AI Normalization for Trainer Upload

### Goal
**What is the feature's main purpose?**
- Apply AI normalization to uploaded CSV data from Trainers
- Standardize competency and skill names to prevent duplicates
- Align uploaded data with canonical Skills Taxonomy naming conventions
- Prepare normalized data for integration into taxonomy database

### Logic
**Any custom algorithm or logic?**
- **Input:** Receive parsed CSV data from Feature 31 (CSV Parsing & Validation)
- **Normalization process:**
  1. **Extract names:** Extract all competency and skill names from parsed CSV data
  2. **Prepare for AI:** Format data for AI normalization (JSON structure with competencies and skills arrays)
  3. **Apply normalization rules:** Use AI to normalize names according to rules:
     - Convert to lowercase
     - Remove leading, trailing, and duplicate spaces
     - Remove punctuation, emojis, and special symbols (keep only letters, digits, spaces)
     - Replace dashes (-) and underscores (_) with single spaces
     - Remove duplicate or repeated words
     - Convert accented/non-ASCII characters to plain English
     - Prefer full, clear forms (e.g., "ai" → "artificial intelligence")
     - Return only unique, normalized strings
  4. **Preserve relationships:** Maintain hierarchical relationships during normalization
- **Duplicate detection:**
  1. **Check against taxonomy:** Compare normalized names against existing taxonomy
  2. **Identify duplicates:** Detect if normalized name already exists in database
  3. **Handle duplicates:** Either merge with existing entry or flag for review
  4. **Prevent duplicates:** Ensure no duplicate competencies or skills are added
- **Mapping preservation:**
  1. **Maintain hierarchy:** Preserve parent-child relationships after normalization
  2. **Update references:** Update relationship references to use normalized names
  3. **Structure integrity:** Ensure hierarchical structure remains valid after normalization

### External API
**Uses any third-party APIs?**
- **Google Gemini API:** For AI-based normalization
- **No other third-party APIs** - normalization is text processing only

### AI
**Includes AI logic?**
- **Yes**
- **Purpose:** Normalize terminology and unify naming variations
- **Model:** Gemini Flash (for fast normalization operations)
- **Prompt:** Stored in `/docs/prompts/normalization_prompt.txt`
  - The prompt instructs the AI to clean and standardize competency and skill names
  - Normalization rules include text cleaning, character normalization, form expansion
  - Input format: JSON with `{ "competencies": [], "skills": [] }`
  - Output format: Same JSON structure with normalized values
- **Expected Output:**
  - JSON object with:
    - `competencies`: Array of normalized, unique competency names
    - `skills`: Array of normalized, unique skill names
  - All values cleaned, standardized, and deduplicated
  - Ready for integration into taxonomy (Feature 33)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend normalization feature
- No user-facing UI required
- Processing happens automatically after Feature 31

### Dependencies
**Relies on other features?**
- **Feature 31:** Requires parsed CSV data from CSV Parsing & Validation
- **Feature 4:** Requires Skills Taxonomy database to check for duplicates
- **Google Gemini API:** Must be available for AI normalization
- Output feeds into Feature 33 (Integrate Trainer Data into Taxonomy) for database integration

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all normalization operations, duplicate detections, normalization results, AI API calls
- **Analytics:** Track normalization success rate, number of duplicates found, normalization performance, AI API response times
- **Rollout:** Runs automatically after Feature 31 completes
- **Monitoring:** Track AI API performance, normalization accuracy, duplicate detection accuracy, processing time

---

## Feature 33: Integrate Trainer Data into Taxonomy

### Goal
**What is the feature's main purpose?**
- Integrate normalized CSV data from Trainers into Skills Taxonomy database
- Preserve hierarchical relationships between Competencies, Skills, and MGS
- Store new competencies and skills in taxonomy database
- Make newly added skills and competencies available for Course Builder, Learner AI, and other dependent microservices

### Logic
**Any custom algorithm or logic?**
- **Input:** Receive normalized data from Feature 32 (AI Normalization for Trainer Upload)
- **Database integration process:**
  1. **Check for existing entries:** For each competency and skill, check if it already exists in database
  2. **Handle duplicates:**
     - If entry exists: Skip or merge with existing entry
     - If entry is new: Prepare for insertion
  3. **Insert competencies:** Insert new competencies into `competencies` table
  4. **Insert skills:** Insert new skills into `skills` table with proper level indicators
  5. **Establish relationships:**
     - Insert competency-skill relationships into `competency_requiredSkills` table
     - Insert skill hierarchy relationships into `skill_subSkill` table
     - Insert competency hierarchy relationships into `competency_subCompetency` table (if nested competencies)
- **Hierarchy preservation:**
  1. **Maintain structure:** Preserve all parent-child relationships from CSV
  2. **Link relationships:** Create proper foreign key relationships in database
  3. **Validate integrity:** Ensure referential integrity (all parent IDs exist)
- **Transaction management:**
  1. **Atomic operations:** Use database transactions to ensure all-or-nothing insertion
  2. **Rollback on error:** If any insertion fails, rollback entire transaction
  3. **Commit on success:** Commit all changes only if all insertions succeed
- **Data availability:**
  1. **Immediate availability:** Newly added data becomes available immediately after successful integration
  2. **Service notification:** Newly added skills and competencies become available for:
     - Course Builder (for course creation)
     - Learner AI (for learning recommendations)
     - Other dependent microservices
  3. **Cache invalidation:** Invalidate any caches that may contain taxonomy data

### External API
**Uses any third-party APIs?**
- **None** - This is a database integration feature
- All operations are internal database transactions

### AI
**Includes AI logic?**
- **No** - This is a database integration feature
- Uses normalized data from Feature 32 (which used AI)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend database integration feature
- No user-facing UI required
- Processing happens automatically after Feature 32
- Success/error messages may be displayed to Trainer after integration completes

### Dependencies
**Relies on other features?**
- **Feature 32:** Requires normalized CSV data from AI Normalization for Trainer Upload
- **Feature 4:** Requires Skills Taxonomy database structure to be in place
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill`, `competency_subCompetency` must exist
- Output: New competencies and skills available in taxonomy for all microservices

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all integration operations, insertions, relationship creations, transaction commits/rollbacks, duplicate handling
- **Analytics:** Track integration success rate, number of new competencies/skills added, relationship count, integration performance
- **Rollout:** Runs automatically after Feature 32 completes
- **Monitoring:** Track database insertion performance, transaction success rate, referential integrity errors, integration time

---

## Feature 34: User Profile Dashboard

### Goal
**What is the feature's main purpose?**
- Provide main landing page for user skill profiles
- Display competency cards in grid layout
- Enable navigation to detailed views
- Serve as primary interface for users to view their skill profile

### Logic
**Any custom algorithm or logic?**
- **Page initialization:**
  1. **User identification:** Identify current user from authentication/session
  2. **Data retrieval:** Fetch user's competency profile from database
  3. **Data preparation:** Prepare competency data for display
- **Layout structure:**
  1. **Header section:** Display user name and Relevance Score prominently
  2. **Main content area:** Grid layout for competency cards
  3. **Sidebar (optional):** Navigation, filters, or additional information
  4. **Footer (optional):** Additional links or information
- **Grid layout:**
  1. **Responsive design:**
     - Mobile: Single column, stacked cards
     - Tablet: 2 columns
     - Desktop: 3-4 columns
  2. **Card arrangement:** Arrange competency cards in responsive grid
  3. **Spacing:** Consistent spacing between cards
- **Navigation:**
  1. **Card click:** Enable clicking on competency cards to navigate to detailed view
  2. **Drill-down:** Navigate to Feature 38 (Verified Skills Drill-Down) for detailed MGS view
  3. **Missing skills:** Navigate to Feature 37 (Missing Skills Display) for gap analysis view
- **Data display:**
  1. **Competency cards:** Display each competency using Feature 35 (Competency Cards Display)
  2. **Relevance Score:** Display using Feature 36 (Relevance Score Visualization)
  3. **Real-time updates:** Update display when profile data changes

### External API
**Uses any third-party APIs?**
- **None** - This is a frontend UI feature
- Retrieves data from internal Skills Engine API endpoints

### AI
**Includes AI logic?**
- **No** - This is a UI display feature
- Displays data that may have been processed by AI in previous features

### UI/UX
**Requires unique design or interaction?**
- **Yes** - This is a frontend UI feature
- **Design requirements:**
  - Clean, modern dashboard layout
  - Responsive grid for competency cards
  - Prominent Relevance Score display
  - Clear navigation to detailed views
  - Visual hierarchy and spacing
- **User experience:**
  - Intuitive navigation
  - Fast page load
  - Smooth transitions
  - Clear visual feedback

### Dependencies
**Relies on other features?**
- **Feature 35:** Uses Competency Cards Display component
- **Feature 36:** Uses Relevance Score Visualization component
- **Feature 37:** Links to Missing Skills Display
- **Feature 38:** Links to Verified Skills Drill-Down
- **User Profile Data:** Requires user's competency profile from database
- **Authentication:** Requires user authentication

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log page views, navigation clicks, user interactions, page load times
- **Analytics:** Track dashboard usage, navigation patterns, user engagement, page performance
- **Rollout:** Must be available for users to view their profiles
- **Monitoring:** Track page load performance, user interaction rates, navigation success, UI errors

---

## Feature 35: Competency Cards Display

### Goal
**What is the feature's main purpose?**
- Display individual competency with metrics in card format
- Show proficiency level badge (BEGINNER/INTERMEDIATE/ADVANCED/EXPERT)
- Show Coverage Percentage with visual progress bar
- Provide expandable MGS list for detailed view

### Logic
**Any custom algorithm or logic?**
- **Card structure:**
  1. **Card header:** Display competency name prominently
  2. **Proficiency badge:** Display proficiency level badge with color coding:
     - BEGINNER: Red/Orange (0-30%)
     - INTERMEDIATE: Yellow (31-65%)
     - ADVANCED: Blue (66-85%)
     - EXPERT: Green (86-100%)
  3. **Progress section:** Display Coverage Percentage with visual progress bar
  4. **Expandable section:** "View Details" button to expand MGS list
- **Data display:**
  1. **Competency name:** Display competency name from database
  2. **Proficiency level:** Display proficiency level from Feature 15 (Map to Proficiency Level)
  3. **Coverage Percentage:** Display exact percentage from Feature 14 (Calculate Coverage Percentage)
  4. **Progress bar:** Visual representation of Coverage Percentage (0-100%)
- **Expandable MGS list:**
  1. **Expand/collapse:** Toggle button to show/hide MGS list
  2. **MGS display:** Show list of MGS when expanded:
     - Verified MGS (verified=true) clearly marked
     - Unverified MGS also visible for comparison
  3. **Drill-down:** Link to Feature 38 (Verified Skills Drill-Down) for full details
- **Visual design:**
  1. **Card styling:** Modern card design with shadow, rounded corners
  2. **Color coding:** Proficiency level determines card accent color
  3. **Progress bar:** Animated progress bar showing Coverage Percentage
  4. **Responsive:** Card adapts to different screen sizes

### External API
**Uses any third-party APIs?**
- **None** - This is a frontend UI component
- Receives data from internal Skills Engine API endpoints

### AI
**Includes AI logic?**
- **No** - This is a UI display component
- Displays data that may have been processed by AI in previous features

### UI/UX
**Requires unique design or interaction?**
- **Yes** - This is a frontend UI component
- **Design requirements:**
  - Modern card design with visual hierarchy
  - Color-coded proficiency badges
  - Animated progress bar
  - Expandable/collapsible MGS list
  - Clear visual indicators for verified/unverified skills
- **User experience:**
  - Intuitive expand/collapse interaction
  - Clear visual feedback
  - Smooth animations
  - Accessible design

### Dependencies
**Relies on other features?**
- **Feature 14:** Requires Coverage Percentage calculation
- **Feature 15:** Requires Proficiency Level mapping
- **Feature 38:** Links to Verified Skills Drill-Down for detailed view
- **User Profile Data:** Requires user's competency data from database
- Output: Displays competency card in Feature 34 (User Profile Dashboard)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log card views, expand/collapse interactions, drill-down clicks
- **Analytics:** Track card interaction rates, expand usage, proficiency level distribution
- **Rollout:** Must be available as part of Feature 34 (User Profile Dashboard)
- **Monitoring:** Track component render performance, interaction responsiveness, UI errors

---

## Feature 36: Relevance Score Visualization

### Goal
**What is the feature's main purpose?**
- Display Relevance Score prominently on user profile dashboard
- Show overall progress in single metric
- Update automatically after assessments
- Provide clear visual representation of user's career path progress

### Logic
**Any custom algorithm or logic?**
- **Display location:**
  1. **Header section:** Display Relevance Score prominently in dashboard header
  2. **Visual prominence:** Large, clear display of score
  3. **Context:** Show score with label and description
- **Score display:**
  1. **Numeric value:** Display Relevance Score as percentage (0-100%)
  2. **Visual indicator:** Progress circle or bar showing score
  3. **Color coding:** Color based on score range:
     - Low (0-30%): Red/Orange
     - Medium (31-65%): Yellow
     - High (66-85%): Blue
     - Very High (86-100%): Green
  4. **Label:** "Relevance Score" or "Career Path Progress"
- **Auto-update:**
  1. **Real-time updates:** Update display when Relevance Score changes
  2. **After assessments:** Automatically refresh after Baseline or Post-Course exam results
  3. **Smooth animation:** Animate score changes for better UX
- **Contextual information:**
  1. **Description:** Brief explanation of what Relevance Score represents
  2. **Tooltip (optional):** Additional information on hover
  3. **Trend indicator (optional):** Show if score increased/decreased

### External API
**Uses any third-party APIs?**
- **None** - This is a frontend UI component
- Receives Relevance Score from internal Skills Engine API endpoints

### AI
**Includes AI logic?**
- **No** - This is a UI display component
- Displays Relevance Score calculated by Feature 16 (Calculate Relevance Score)

### UI/UX
**Requires unique design or interaction?**
- **Yes** - This is a frontend UI component
- **Design requirements:**
  - Prominent, large display of score
  - Visual progress indicator (circle or bar)
  - Color-coded based on score
  - Clear labeling and context
  - Smooth animations for updates
- **User experience:**
  - Immediately visible on dashboard
  - Clear understanding of progress
  - Engaging visual feedback
  - Accessible design

### Dependencies
**Relies on other features?**
- **Feature 16:** Requires Relevance Score calculation
- **Feature 34:** Displays in User Profile Dashboard
- **User Profile Data:** Requires user's Relevance Score from database
- Output: Displays Relevance Score prominently in Feature 34 (User Profile Dashboard)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log score views, update events, user interactions
- **Analytics:** Track score distribution, update frequency, user engagement with score
- **Rollout:** Must be available as part of Feature 34 (User Profile Dashboard)
- **Monitoring:** Track component render performance, update responsiveness, UI errors

---

## Feature 37: Missing Skills Display

### Goal
**What is the feature's main purpose?**
- Display missing skills from Broad Gap Analysis
- Present missing skills in categorized format (Structured MAP)
- Group missing MGS under parent Competency
- Provide clear indication of which Competency needs improvement

### Logic
**Any custom algorithm or logic?**
- **Data source:**
  1. **Gap analysis data:** Receive structured gap map from Feature 19 (Generate Structured Gap Map)
  2. **Format:** Structured key-value map where Key = Competency name, Value = List of missing MGS
  3. **Update trigger:** Display updates after Broad Gap Analysis (Feature 21) completes
- **Display structure:**
  1. **Header:** "Skill Gaps" or "Missing Skills" title
  2. **Competency grouping:** Group missing MGS by their parent Competency
  3. **Competency sections:** Each competency gets its own section/card
  4. **MGS list:** Under each competency, display list of missing MGS
- **Visual organization:**
  1. **Competency name:** Display competency name prominently for each group
  2. **Missing MGS count:** Show count of missing MGS per competency
  3. **MGS list:** Display each missing MGS as list item or checkbox
  4. **Visual separation:** Clear visual separation between different competencies
- **User interaction:**
  1. **Expand/collapse:** Allow expanding/collapsing competency sections
  2. **Action buttons:** "Find Courses" button linking to Learner AI for course recommendations
  3. **View details:** Link to detailed gap analysis view
- **Contextual information:**
  1. **Relevance Score context:** Show Relevance Score in context of missing skills
  2. **Progress indication:** Show how many skills are missing vs. total required

### External API
**Uses any third-party APIs?**
- **None** - This is a frontend UI component
- Receives gap analysis data from internal Skills Engine API endpoints
- May link to Learner AI for course recommendations (external navigation)

### AI
**Includes AI logic?**
- **No** - This is a UI display component
- Displays gap analysis results from Features 19 and 21 (which may have used AI)

### UI/UX
**Requires unique design or interaction?**
- **Yes** - This is a frontend UI component
- **Design requirements:**
  - Clear competency grouping
  - Organized MGS lists
  - Visual hierarchy
  - Action buttons for course recommendations
  - Expandable/collapsible sections
- **User experience:**
  - Easy to understand skill gaps
  - Clear indication of which competencies need improvement
  - Actionable (links to find courses)
  - Accessible design

### Dependencies
**Relies on other features?**
- **Feature 19:** Requires structured gap map from Generate Structured Gap Map
- **Feature 21:** Receives gap analysis data from Broad Gap Analysis
- **Feature 34:** Displays in User Profile Dashboard or separate view
- **Learner AI:** Links to Learner AI for course recommendations
- Output: Displays missing skills in Feature 34 (User Profile Dashboard) or dedicated gap analysis view

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log gap analysis views, competency section expansions, "Find Courses" clicks
- **Analytics:** Track gap analysis usage, missing skills distribution, user engagement with gap analysis
- **Rollout:** Must be available as part of Feature 34 (User Profile Dashboard) or separate view
- **Monitoring:** Track component render performance, data loading performance, UI errors

---

## Feature 38: Verified Skills Drill-Down

### Goal
**What is the feature's main purpose?**
- Allow users to expand Competency cards to see detailed MGS
- Display verified MGS clearly marked (verified=true)
- Show unverified MGS also visible for comparison
- Provide detailed view of all skills within a competency

### Logic
**Any custom algorithm or logic?**
- **Drill-down trigger:**
  1. **From competency card:** User clicks "View Details" on competency card (Feature 35)
  2. **Navigation:** Navigate to detailed MGS view for specific competency
  3. **Context:** Maintain context of which competency is being viewed
- **MGS display:**
  1. **Verified MGS:**
     - Clearly marked with checkmark or "Verified" badge
     - Display skill_id, skill_name, lastUpdate
     - Highlighted or styled differently from unverified
  2. **Unverified MGS:**
     - Display all MGS required for competency
     - Show which ones are verified and which are not
     - Visual distinction between verified and unverified
  3. **Complete list:** Show all MGS (both verified and unverified) for full context
- **Visual organization:**
  1. **Competency header:** Display competency name and overall metrics
  2. **MGS list:** Organized list of all MGS
  3. **Verification status:** Clear visual indicators for verified/unverified status
  4. **Grouping (optional):** May group MGS by L1 skill or other hierarchy level
- **Additional information:**
  1. **Coverage summary:** Show Coverage Percentage and proficiency level
  2. **Verification source:** May show source of verification (Assessment, Certification, etc.)
  3. **Last update:** Display lastUpdate date for verified skills

### External API
**Uses any third-party APIs?**
- **None** - This is a frontend UI component
- Receives MGS data from internal Skills Engine API endpoints

### AI
**Includes AI logic?**
- **No** - This is a UI display component
- Displays verified skills data from user profile

### UI/UX
**Requires unique design or interaction?**
- **Yes** - This is a frontend UI component
- **Design requirements:**
  - Clear drill-down navigation
  - Visual distinction between verified and unverified MGS
  - Organized MGS list
  - Clear verification indicators
  - Coverage summary display
- **User experience:**
  - Easy navigation from competency card
  - Clear understanding of verified vs. unverified skills
  - Comprehensive view of all skills
  - Accessible design

### Dependencies
**Relies on other features?**
- **Feature 35:** Links from Competency Cards Display
- **Feature 13:** Requires verified skills data from Update Verified Skills
- **Feature 34:** Part of User Profile Dashboard navigation
- **User Profile Data:** Requires user's verified skills from database
- Output: Displays detailed MGS view for selected competency

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log drill-down views, competency selections, MGS list views
- **Analytics:** Track drill-down usage, verified vs. unverified skill distribution, user engagement
- **Rollout:** Must be available as part of Feature 34 (User Profile Dashboard) navigation
- **Monitoring:** Track component render performance, data loading performance, UI errors

---

## Feature 39: Secure Skills Profile Page & URL Generation

### Goal
**What is the feature's main purpose?**
- Generate secure URL for Dedicated Skills Profile Page
- Provide access to expanded profile view in Skills Engine UI
- Include secure URL in responses to Directory (initial profile, updated profile, retrieval API)
- Allow users to navigate from Directory summary to full Skills Engine profile

### Logic
**Any custom algorithm or logic?**
- **URL generation:**
  1. **Secure token generation:** Generate unique, secure token for each user profile page
  2. **Token format:** Use cryptographically secure random token (e.g., UUID or secure random string)
  3. **Token storage:** Store token in database linked to user_id
  4. **Token expiration (optional):** May set expiration time for security (or use non-expiring tokens)
- **URL structure:**
  1. **Base URL:** Use Skills Engine base URL (e.g., `https://skills-engine.educora.ai`)
  2. **Path:** `/profile/:token` or `/profile/:userId/:token`
  3. **Full URL:** Combine base URL + path to create full secure URL
- **Profile page content:**
  1. **Full profile display:** Display all competencies with full details
  2. **Missing skills:** Display missing skills from Broad Gap Analysis
  3. **Relevance Score:** Display Relevance Score prominently
  4. **All features:** Include all features from User Profile Dashboard (Features 34-38)
- **Security:**
  1. **Token validation:** Validate token on each page access
  2. **User verification:** Verify token belongs to correct user
  3. **Access control:** Ensure only authorized users can access profile via token
  4. **HTTPS:** Use HTTPS for secure transmission
- **URL inclusion in responses:**
  1. **Feature 11 (Return Initial Profile):** Include secure URL in response to Directory
  2. **Feature 50 (Return Updated Profile):** Include secure URL in response to Directory
  3. **Feature 51 (Directory Profile Retrieval API):** Include secure URL in response
  4. **Response format:** Add `profile_url` or `secure_url` field to JSON response

### External API
**Uses any third-party APIs?**
- **None** - This is an internal URL generation and page feature
- URL is included in responses to Directory microservice

### AI
**Includes AI logic?**
- **No** - This is a URL generation and page routing feature
- Profile page displays data that may have been processed by AI

### UI/UX
**Requires unique design or interaction?**
- **Yes** - This is a frontend page feature
- **Design requirements:**
  - Full profile page with all competencies
  - Missing skills display
  - Relevance Score visualization
  - All dashboard features (Features 34-38)
  - Secure, shareable URL
- **User experience:**
  - Accessible via secure URL
  - Full profile view
  - Can be shared or bookmarked
  - Responsive design

### Dependencies
**Relies on other features?**
- **Feature 34:** Uses User Profile Dashboard for page content
- **Feature 11:** Includes secure URL in initial profile response
- **Feature 50:** Includes secure URL in updated profile response
- **Feature 51:** Includes secure URL in profile retrieval response
- **Database:** Requires token storage in database
- **Authentication:** Requires token validation mechanism
- Output: Secure URL included in Directory responses, accessible profile page

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log URL generation, token creation, profile page accesses, token validations
- **Analytics:** Track URL generation frequency, profile page access rate, token usage
- **Rollout:** Must be available before Directory can link to Skills Engine profile
- **Monitoring:** Track URL generation performance, token validation performance, profile page load times, security incidents

---

## Feature 40: Individual User Profile API (Learning Analytics)

### Goal
**What is the feature's main purpose?**
- Expose synchronous API endpoint for Learning Analytics to retrieve individual user profiles
- Provide comprehensive user profile data for reporting and analytics
- Support Learning Analytics microservice with verified skills, proficiency levels, coverage percentages, and Relevance Score

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create synchronous API endpoint (e.g., `GET /api/learning-analytics/user/:userId`)
  2. **Request format:** Accept user_id as path parameter
  3. **Synchronous response:** Return response immediately (blocking call)
- **Authentication and authorization:**
  1. **Token validation:** Validate Learning Analytics token from request headers
  2. **Token-based authentication:** Check token against stored microservice tokens
  3. **Service identification:** Identify calling service as Learning Analytics (MS #8)
  4. **Authorization check:** Verify that token belongs to Learning Analytics
  5. **Reject if invalid:** Return 401 Unauthorized if token is missing or invalid
- **Data retrieval:**
  1. **User identification:** Extract user_id from request parameters
  2. **Profile lookup:** Query user profile from database:
     - User's competencies
     - Verified skills (from `verifiedSkills` JSON field)
     - Coverage Percentage for each competency
     - Proficiency Level for each competency
     - Relevance Score
  3. **Data formatting:** Structure response with all profile data
- **Response format:**
  ```json
  {
    "user_id": "<user_id>",
    "user_name": "<user_name>",
    "relevance_score": <score>,
    "competencies": [
      {
        "competency_id": "<competency_id>",
        "competency_name": "<competency_name>",
        "coverage_percentage": <percentage>,
        "proficiency_level": "<BEGINNER|INTERMEDIATE|ADVANCED|EXPERT>",
        "verified_skills_count": <count>,
        "total_required_mgs": <count>
      },
      ...
    ],
    "last_updated": "<timestamp>"
  }
  ```
- **Error handling:**
  1. **If user not found:** Return 404 Not Found
  2. **If token invalid:** Return 401 Unauthorized
  3. **If database error:** Return 500 Internal Server Error

### External API
**Uses any third-party APIs?**
- **Learning Analytics Microservice (MS #8):** Receives synchronous API requests from Learning Analytics
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal data retrieval

### AI
**Includes AI logic?**
- **No** - This is a data retrieval API endpoint
- Returns data that may have been processed by AI in previous features

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by Learning Analytics microservice programmatically

### Dependencies
**Relies on other features?**
- **Feature 13:** Requires verified skills data from Update Verified Skills
- **Feature 14:** Requires Coverage Percentage calculation
- **Feature 15:** Requires Proficiency Level mapping
- **Feature 16:** Requires Relevance Score calculation
- **Authentication Service:** Requires token validation mechanism for Learning Analytics
- **Database tables:** `userCompetency`, `userSkill` must exist
- Output: User profile data returned to Learning Analytics microservice

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all API requests, token validations, user lookups, response times
- **Analytics:** Track API request rate, lookup success rate, response time, data retrieval performance
- **Rollout:** Must be available before Learning Analytics can retrieve user profiles
- **Monitoring:** Track API endpoint availability, authentication failures, database query performance, response time SLA

---

## Feature 41: Team Aggregation API (Learning Analytics)

### Goal
**What is the feature's main purpose?**
- Expose synchronous API endpoint for Learning Analytics to retrieve aggregate team competency statuses
- Provide aggregated data across multiple users for reporting and analytics
- Support Learning Analytics with team-level insights and statistics

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create synchronous API endpoint (e.g., `GET /api/learning-analytics/team/:teamId` or `POST /api/learning-analytics/team/aggregate`)
  2. **Request format:** Accept team_id or list of user_ids
  3. **Synchronous response:** Return response immediately (blocking call)
- **Authentication and authorization:**
  1. **Token validation:** Validate Learning Analytics token from request headers
  2. **Token-based authentication:** Check token against stored microservice tokens
  3. **Service identification:** Identify calling service as Learning Analytics (MS #8)
  4. **Authorization check:** Verify that token belongs to Learning Analytics
  5. **Reject if invalid:** Return 401 Unauthorized if token is missing or invalid
- **Data aggregation:**
  1. **Team identification:** Extract team_id or list of user_ids from request
  2. **User lookup:** Query all users in team from database
  3. **Aggregate calculations:**
     - Average Coverage Percentage per competency across team
     - Average Relevance Score across team
     - Proficiency level distribution (count of users per level)
     - Skill coverage statistics
  4. **Data formatting:** Structure response with aggregated statistics
- **Response format:**
  ```json
  {
    "team_id": "<team_id>",
    "team_name": "<team_name>",
    "user_count": <count>,
    "average_relevance_score": <score>,
    "competencies": [
      {
        "competency_id": "<competency_id>",
        "competency_name": "<competency_name>",
        "average_coverage_percentage": <percentage>,
        "proficiency_distribution": {
          "BEGINNER": <count>,
          "INTERMEDIATE": <count>,
          "ADVANCED": <count>,
          "EXPERT": <count>
        },
        "users_with_competency": <count>
      },
      ...
    ],
    "aggregated_at": "<timestamp>"
  }
  ```
- **Error handling:**
  1. **If team not found:** Return 404 Not Found
  2. **If token invalid:** Return 401 Unauthorized
  3. **If database error:** Return 500 Internal Server Error

### External API
**Uses any third-party APIs?**
- **Learning Analytics Microservice (MS #8):** Receives synchronous API requests from Learning Analytics
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal data aggregation

### AI
**Includes AI logic?**
- **No** - This is a data aggregation API endpoint
- Returns aggregated data that may have been processed by AI in previous features

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by Learning Analytics microservice programmatically

### Dependencies
**Relies on other features?**
- **Feature 40:** Uses similar data retrieval logic for individual users
- **Feature 14:** Requires Coverage Percentage calculation for aggregation
- **Feature 15:** Requires Proficiency Level mapping for distribution
- **Feature 16:** Requires Relevance Score calculation for average
- **Authentication Service:** Requires token validation mechanism for Learning Analytics
- **Database tables:** `userCompetency`, `userSkill` must exist
- Output: Aggregated team data returned to Learning Analytics microservice

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all API requests, token validations, team lookups, aggregation operations, response times
- **Analytics:** Track API request rate, aggregation performance, team size distribution, response time
- **Rollout:** Must be available before Learning Analytics can retrieve team aggregations
- **Monitoring:** Track API endpoint availability, authentication failures, database query performance, aggregation performance, response time SLA

---

## Feature 42: Taxonomy Data Access API (RAG)

### Goal
**What is the feature's main purpose?**
- Expose synchronous API endpoint for RAG/Chatbot to access canonical taxonomy data
- Provide real-time query support for Competencies and Skills
- Enable RAG system to answer skill-related questions using verified taxonomy data

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create synchronous API endpoint (e.g., `GET /api/rag/taxonomy` or `GET /api/rag/taxonomy/:competencyName`)
  2. **Request format:** Accept competency name or skill name as query parameter (optional)
  3. **Synchronous response:** Return response immediately (blocking call)
- **Authentication and authorization:**
  1. **Token validation:** Validate RAG/Chatbot token from request headers
  2. **Token-based authentication:** Check token against stored microservice tokens
  3. **Service identification:** Identify calling service as RAG/Chatbot (MS #9)
  4. **Authorization check:** Verify that token belongs to RAG/Chatbot
  5. **Reject if invalid:** Return 401 Unauthorized if token is missing or invalid
- **Data retrieval:**
  1. **Query type:** Support different query types:
     - Get all competencies and skills (full taxonomy)
     - Get specific competency with all its skills
     - Search for competency or skill by name
  2. **Database query:** Query Skills Taxonomy database:
     - `competencies` table for competency data
     - `skills` table for skill data
     - `competency_requiredSkills` for relationships
     - `skill_subSkill` for skill hierarchy
  3. **Hierarchy traversal:** Use recursive traversal to build complete hierarchy
  4. **Data formatting:** Structure response with hierarchical taxonomy data
- **Response format:**
  ```json
  {
    "competencies": [
      {
        "competency_id": "<competency_id>",
        "competency_name": "<competency_name>",
        "skills": [
          {
            "skill_id": "<skill_id>",
            "skill_name": "<skill_name>",
            "level": "L1",
            "subskills": [...]
          },
          ...
        ]
      },
      ...
    ]
  }
  ```
- **Error handling:**
  1. **If not found:** Return 404 Not Found for specific queries
  2. **If token invalid:** Return 401 Unauthorized
  3. **If database error:** Return 500 Internal Server Error

### External API
**Uses any third-party APIs?**
- **RAG/Chatbot Microservice (MS #9):** Receives synchronous API requests from RAG/Chatbot
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal taxonomy data retrieval

### AI
**Includes AI logic?**
- **No** - This is a data retrieval API endpoint
- Returns taxonomy data that may have been built using AI in Features 1-4

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by RAG/Chatbot microservice programmatically

### Dependencies
**Relies on other features?**
- **Feature 4:** Requires Skills Taxonomy database to be populated
- **Feature 17:** Uses recursive traversal logic to build hierarchy
- **Authentication Service:** Requires token validation mechanism for RAG/Chatbot
- **Database tables:** `competencies`, `skills`, `competency_requiredSkills`, `skill_subSkill` must exist
- Output: Taxonomy data returned to RAG/Chatbot microservice

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all API requests, token validations, taxonomy queries, response times
- **Analytics:** Track API request rate, query types, response time, taxonomy data size
- **Rollout:** Must be available before RAG/Chatbot can query taxonomy data
- **Monitoring:** Track API endpoint availability, authentication failures, database query performance, response time SLA

---

## Feature 43: User Profile Data Access API (RAG)

### Goal
**What is the feature's main purpose?**
- Expose synchronous API endpoint for RAG/Chatbot to access user profile data
- Provide real-time query support for user skills and competencies
- Enable RAG system to answer user-specific skill questions using verified profile data

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create synchronous API endpoint (e.g., `GET /api/rag/user/:userId/profile`)
  2. **Request format:** Accept user_id as path parameter
  3. **Synchronous response:** Return response immediately (blocking call)
- **Authentication and authorization:**
  1. **Token validation:** Validate RAG/Chatbot token from request headers
  2. **Token-based authentication:** Check token against stored microservice tokens
  3. **Service identification:** Identify calling service as RAG/Chatbot (MS #9)
  4. **Authorization check:** Verify that token belongs to RAG/Chatbot
  5. **Reject if invalid:** Return 401 Unauthorized if token is missing or invalid
- **Data retrieval:**
  1. **User identification:** Extract user_id from request parameters
  2. **Profile lookup:** Query user profile from database:
     - User's competencies
     - Verified skills (from `verifiedSkills` JSON field)
     - Coverage Percentage for each competency
     - Proficiency Level for each competency
     - Relevance Score
  3. **Data formatting:** Structure response with user profile data
- **Response format:**
  ```json
  {
    "user_id": "<user_id>",
    "user_name": "<user_name>",
    "relevance_score": <score>,
    "competencies": [
      {
        "competency_id": "<competency_id>",
        "competency_name": "<competency_name>",
        "coverage_percentage": <percentage>,
        "proficiency_level": "<BEGINNER|INTERMEDIATE|ADVANCED|EXPERT>",
        "verified_skills": [
          {
            "skill_id": "<skill_id>",
            "skill_name": "<skill_name>",
            "verified": true,
            "lastUpdate": "<timestamp>"
          },
          ...
        ]
      },
      ...
    ]
  }
  ```
- **Error handling:**
  1. **If user not found:** Return 404 Not Found
  2. **If token invalid:** Return 401 Unauthorized
  3. **If database error:** Return 500 Internal Server Error

### External API
**Uses any third-party APIs?**
- **RAG/Chatbot Microservice (MS #9):** Receives synchronous API requests from RAG/Chatbot
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal user profile data retrieval

### AI
**Includes AI logic?**
- **No** - This is a data retrieval API endpoint
- Returns user profile data that may have been processed by AI in previous features

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by RAG/Chatbot microservice programmatically

### Dependencies
**Relies on other features?**
- **Feature 13:** Requires verified skills data from Update Verified Skills
- **Feature 14:** Requires Coverage Percentage calculation
- **Feature 15:** Requires Proficiency Level mapping
- **Feature 16:** Requires Relevance Score calculation
- **Authentication Service:** Requires token validation mechanism for RAG/Chatbot
- **Database tables:** `userCompetency`, `userSkill` must exist
- Output: User profile data returned to RAG/Chatbot microservice

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all API requests, token validations, user lookups, response times
- **Analytics:** Track API request rate, lookup success rate, response time, data retrieval performance
- **Rollout:** Must be available before RAG/Chatbot can query user profiles
- **Monitoring:** Track API endpoint availability, authentication failures, database query performance, response time SLA

---

## Feature 44: Receive Baseline Exam Results

### Goal
**What is the feature's main purpose?**
- Receive assessment results for Baseline Exam from Assessment microservice
- Accept results with skill ID, skill name, status (PASS/FAIL), and exam type (Baseline)
- Process incoming exam results for baseline assessment
- Trigger profile update process after receiving results

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create asynchronous API endpoint (e.g., `POST /api/webhooks/assessment-results` or `POST /api/assessment/baseline-results`)
  2. **Request format:** Accept JSON payload with exam results
  3. **Asynchronous processing:** Process results asynchronously (webhook/event-based)
- **Request payload structure (Baseline Exam):**
  ```json
  {
    "exam_type": "baseline",
    "exam_status": "PASS" | "FAIL",
    "user_id": "<user_id>",
    "user_name": "<user_name>",
    "skills": [
      {
        "skill_id": "<skill_id>",
        "skill_name": "<skill_name>",
        "status": "PASS" | "FAIL"
      },
      ...
    ]
  }
  ```
- **Data validation:**
  1. **Required fields:** Validate that all required fields are present
  2. **Exam type:** Verify exam_type is "baseline"
  3. **Skill data:** Validate each skill has skill_id, skill_name, and status
  4. **Status values:** Validate status is either "PASS" or "FAIL"
  5. **User identification:** Verify user_id exists in database
- **Processing trigger:**
  1. **Queue for processing:** Queue results for Feature 45 (Process Baseline Exam Results)
  2. **Acknowledgment:** Return acknowledgment to Assessment microservice
  3. **Error handling:** Return error if validation fails

### External API
**Uses any third-party APIs?**
- **Assessment Microservice (MS #5):** Receives asynchronous API requests/webhooks from Assessment
- **Communication method:** Asynchronous HTTP (webhook/event)
- **No direct third-party APIs** - receives data from Assessment microservice

### AI
**Includes AI logic?**
- **No** - This is a data ingestion feature
- Results are processed by Feature 45

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by Assessment microservice programmatically

### Dependencies
**Relies on other features?**
- **Assessment Microservice:** Requires Assessment to send exam results
- **Feature 45:** Queues results for Process Baseline Exam Results
- **Database:** Requires user to exist in database
- Output: Exam results queued for Feature 45 processing

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all exam result receipts, validation results, queuing operations, errors
- **Analytics:** Track exam result receipt rate, validation success rate, processing queue depth
- **Rollout:** Must be available before Assessment can send baseline exam results
- **Monitoring:** Track API endpoint availability, validation errors, queue performance, processing delays

---

## Feature 45: Process Baseline Exam Results

### Goal
**What is the feature's main purpose?**
- Execute profile update process for Baseline Exam results
- Update verified skills, calculate coverage, map proficiency, calculate relevance score
- Trigger Broad Gap Analysis if exam status is PASS
- Send results to Learner AI and Directory

### Logic
**Any custom algorithm or logic?**
- **Processing flow:**
  1. **Receive results:** Get baseline exam results from Feature 44
  2. **Update verified skills:** Use Feature 13 (Update Verified Skills) to update verified skills based on exam results
  3. **Calculate coverage:** Use Feature 14 (Calculate Coverage Percentage) for each competency
  4. **Map proficiency:** Use Feature 15 (Map to Proficiency Level) for each competency
  5. **Calculate relevance:** Use Feature 16 (Calculate Relevance Score) for Career Path Goal
  6. **Store updates:** Persist all updates to database
- **Gap analysis trigger:**
  1. **If exam_status is PASS:** Trigger Feature 21 (Broad Gap Analysis)
  2. **If exam_status is FAIL:** May trigger gap analysis or wait for retake
- **Send results:**
  1. **To Learner AI:** Use Feature 22 (Send Gap Analysis to Learner AI) if gap analysis was performed
  2. **To Directory:** Use Feature 50 (Return Updated Profile to Directory) to send updated profile
- **Secure URL generation:**
  1. **Generate URL:** Use Feature 39 (Secure Skills Profile Page & URL Generation) to create secure URL
  2. **Include in response:** Add secure URL to Directory response

### External API
**Uses any third-party APIs?**
- **Learner AI Microservice (MS #7):** Sends gap analysis data asynchronously
- **Directory Microservice (MS #1):** Sends updated profile synchronously
- **Communication methods:** Asynchronous (Learner AI) and Synchronous (Directory)

### AI
**Includes AI logic?**
- **No** - This is a data processing and orchestration feature
- Orchestrates Features 13-16, 21, 22, 39, 50

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend processing feature
- No user-facing UI required
- Processing happens automatically after Feature 44

### Dependencies
**Relies on other features?**
- **Feature 44:** Requires baseline exam results
- **Feature 13:** Updates verified skills
- **Feature 14:** Calculates coverage percentage
- **Feature 15:** Maps proficiency level
- **Feature 16:** Calculates relevance score
- **Feature 21:** Triggers broad gap analysis (if PASS)
- **Feature 22:** Sends gap analysis to Learner AI
- **Feature 39:** Generates secure URL
- **Feature 50:** Returns updated profile to Directory
- Output: Profile updated, gap analysis sent, Directory notified

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all processing operations, feature orchestrations, update results, gap analysis triggers
- **Analytics:** Track processing success rate, processing time, gap analysis frequency, update frequency
- **Rollout:** Runs automatically after Feature 44 receives results
- **Monitoring:** Track processing performance, feature execution times, error rates, orchestration success

---

## Feature 46: Receive Course Exam Results

### Goal
**What is the feature's main purpose?**
- Receive assessment results for Course Exam from Assessment microservice
- Accept results with skill ID, skill name, status (PASS only for Post-Course), exam type (Post-Course), and course name
- Process incoming exam results for course assessment
- Trigger profile update process after receiving results

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create asynchronous API endpoint (e.g., `POST /api/webhooks/assessment-results` or `POST /api/assessment/course-results`)
  2. **Request format:** Accept JSON payload with exam results
  3. **Asynchronous processing:** Process results asynchronously (webhook/event-based)
- **Request payload structure (Post-Course Exam):**
  ```json
  {
    "exam_type": "post_course",
    "exam_status": "PASS" | "FAIL",
    "user_id": "<user_id>",
    "user_name": "<user_name>",
    "course_name": "<course_name>",
    "skills": [
      {
        "skill_id": "<skill_id>",
        "skill_name": "<skill_name>",
        "status": "PASS"
      },
      ...
    ]
  }
  ```
- **Data validation:**
  1. **Required fields:** Validate that all required fields are present
  2. **Exam type:** Verify exam_type is "post_course"
  3. **Course name:** Validate course_name is present
  4. **Skill data:** Validate each skill has skill_id, skill_name, and status
  5. **Status values:** For Post-Course exam, only skills with status="PASS" are included
  6. **User identification:** Verify user_id exists in database
- **Processing trigger:**
  1. **Queue for processing:** Queue results for Feature 47 (Process Course Exam Results)
  2. **Acknowledgment:** Return acknowledgment to Assessment microservice
  3. **Error handling:** Return error if validation fails

### External API
**Uses any third-party APIs?**
- **Assessment Microservice (MS #5):** Receives asynchronous API requests/webhooks from Assessment
- **Communication method:** Asynchronous HTTP (webhook/event)
- **No direct third-party APIs** - receives data from Assessment microservice

### AI
**Includes AI logic?**
- **No** - This is a data ingestion feature
- Results are processed by Feature 47

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by Assessment microservice programmatically

### Dependencies
**Relies on other features?**
- **Assessment Microservice:** Requires Assessment to send exam results
- **Feature 47:** Queues results for Process Course Exam Results
- **Database:** Requires user to exist in database
- Output: Exam results queued for Feature 47 processing

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all exam result receipts, validation results, queuing operations, errors
- **Analytics:** Track exam result receipt rate, validation success rate, processing queue depth
- **Rollout:** Must be available before Assessment can send course exam results
- **Monitoring:** Track API endpoint availability, validation errors, queue performance, processing delays

---

## Feature 47: Process Course Exam Results

### Goal
**What is the feature's main purpose?**
- Execute profile update process for Course Exam results
- Update verified skills, calculate coverage, map proficiency, calculate relevance score
- Trigger conditional Gap Analysis (Narrow if FAIL, Broad if PASS)
- Send results to Learner AI and Directory
- Generate secure URL for frontend

### Logic
**Any custom algorithm or logic?**
- **Processing flow:**
  1. **Receive results:** Get course exam results from Feature 46
  2. **Update verified skills:** Use Feature 13 (Update Verified Skills) to update verified skills based on exam results
  3. **Calculate coverage:** Use Feature 14 (Calculate Coverage Percentage) for each competency
  4. **Map proficiency:** Use Feature 15 (Map to Proficiency Level) for each competency
  5. **Calculate relevance:** Use Feature 16 (Calculate Relevance Score) for Career Path Goal
  6. **Store updates:** Persist all updates to database
- **Conditional gap analysis:**
  1. **If exam_status is FAIL:** Trigger Feature 20 (Narrow Gap Analysis) - scope limited to course competency
  2. **If exam_status is PASS:** Trigger Feature 21 (Broad Gap Analysis) - scope is full Career Path Goal
- **Send results:**
  1. **To Learner AI:** Use Feature 22 (Send Gap Analysis to Learner AI) with gap analysis results
  2. **To Directory:** Use Feature 50 (Return Updated Profile to Directory) to send updated profile
- **Secure URL generation:**
  1. **Generate URL:** Use Feature 39 (Secure Skills Profile Page & URL Generation) to create secure URL
  2. **Include in response:** Add secure URL to Directory response

### External API
**Uses any third-party APIs?**
- **Learner AI Microservice (MS #7):** Sends gap analysis data asynchronously
- **Directory Microservice (MS #1):** Sends updated profile synchronously
- **Communication methods:** Asynchronous (Learner AI) and Synchronous (Directory)

### AI
**Includes AI logic?**
- **No** - This is a data processing and orchestration feature
- Orchestrates Features 13-16, 20-22, 39, 50

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend processing feature
- No user-facing UI required
- Processing happens automatically after Feature 46

### Dependencies
**Relies on other features?**
- **Feature 46:** Requires course exam results
- **Feature 13:** Updates verified skills
- **Feature 14:** Calculates coverage percentage
- **Feature 15:** Maps proficiency level
- **Feature 16:** Calculates relevance score
- **Feature 20:** Triggers narrow gap analysis (if FAIL)
- **Feature 21:** Triggers broad gap analysis (if PASS)
- **Feature 22:** Sends gap analysis to Learner AI
- **Feature 39:** Generates secure URL
- **Feature 50:** Returns updated profile to Directory
- Output: Profile updated, gap analysis sent, Directory notified

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all processing operations, feature orchestrations, update results, gap analysis triggers
- **Analytics:** Track processing success rate, processing time, gap analysis frequency (narrow vs broad), update frequency
- **Rollout:** Runs automatically after Feature 46 receives results
- **Monitoring:** Track processing performance, feature execution times, error rates, orchestration success

---

## Feature 48: Receive User Creation Event (Directory)

### Goal
**What is the feature's main purpose?**
- Asynchronously receive user creation event from Directory microservice
- Receive basic user info and raw data (resume, LinkedIn, etc.)
- Trigger user profile creation and initialization process
- Start the user onboarding flow

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create asynchronous API endpoint (e.g., `POST /api/webhooks/user-creation` or `POST /api/directory/user-creation`)
  2. **Request format:** Accept JSON payload with user creation event
  3. **Asynchronous processing:** Process event asynchronously (webhook/event-based)
- **Request payload structure:**
  ```json
  {
    "user_id": "<user_id>",
    "user_name": "<user_name>",
    "company_id": "<company_id>",
    "employee_type": "<employee_type>",
    "path_career": "<career_path_goal>",
    "raw_data": {
      "resume": "<resume_text>",
      "linkedin": "<linkedin_url_or_data>",
      "other_sources": [...]
    }
  }
  ```
- **Data validation:**
  1. **Required fields:** Validate that all required fields are present
  2. **User identification:** Verify user_id is valid and not already exists
  3. **Raw data:** Validate that raw data is present (at least one source)
  4. **Data format:** Validate data format is correct
- **Step 1: Create user record in users table:**
  1. **Insert user record:** Create new record in `users` table with:
     - `user_id` (Primary Key)
     - `user_name`
     - `company_id`
     - `employee_type`
     - `path_career` (Career Path Goal)
     - `raw_data` (store raw data as JSON or text)
     - `relevance_score` (initialize as NULL or 0 - will be calculated later)
  2. **User table structure:** The `users` table stores basic user information before skills profile is created
  3. **Transaction:** Ensure user record is created successfully before proceeding
- **Step 2: Trigger skills and competencies profile creation:**
  1. **After user creation:** Once user record exists in `users` table, proceed to create skills profile
  2. **Queue for processing:** Queue event for Feature 6 (Extract Skills from Raw Data) processing
  3. **Profile creation flow:** Features 6-9 will create the skills and competencies profile:
     - Feature 6: Extract skills from raw data
     - Feature 7: Normalize extracted skills
     - Feature 8: Map skills to competencies
     - Feature 9: Build user profile structure (userCompetency, userSkill tables)
- **Acknowledgment:**
  1. **Return acknowledgment:** Return acknowledgment to Directory microservice after user record is created
  2. **Error handling:** Return error if validation fails or user creation fails

### External API
**Uses any third-party APIs?**
- **Directory Microservice (MS #1):** Receives asynchronous API requests/webhooks from Directory
- **Communication method:** Asynchronous HTTP (webhook/event)
- **No direct third-party APIs** - receives data from Directory microservice

### AI
**Includes AI logic?**
- **No** - This is a data ingestion feature
- Event is processed by Feature 5, which triggers AI extraction (Feature 6)

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by Directory microservice programmatically

### Dependencies
**Relies on other features?**
- **Directory Microservice:** Requires Directory to send user creation events
- **Feature 5:** Queues event for Receive User Creation Request processing (which creates user in `users` table first, then triggers skills profile creation)
- **Database:** Requires `users` table structure to exist with fields: `user_id`, `user_name`, `company_id`, `employee_type`, `path_career`, `raw_data`, `relevance_score`
- Output: User creation event queued for Feature 5 processing (creates user record, then skills profile)

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all user creation event receipts, validation results, queuing operations, errors
- **Analytics:** Track event receipt rate, validation success rate, processing queue depth, user creation frequency
- **Rollout:** Must be available before Directory can send user creation events
- **Monitoring:** Track API endpoint availability, validation errors, queue performance, processing delays

---

## Feature 49: Return Initial Profile (Directory)

### Goal
**What is the feature's main purpose?**
- Return initial profile to Directory after user creation and profile initialization
- Include list of Competencies and L1 Skills associated with each competency
- Include secure URL link to Skills Engine's expanded profile page
- Enable Directory to display summary while allowing users to navigate to full profile

### Logic
**Any custom algorithm or logic?**
- **Profile compilation:**
  1. **Retrieve profile:** Get user's initial profile from database after Feature 9 (Build User Profile Structure)
  2. **Extract competencies:** Get all competencies for the user
  3. **Extract L1 skills:** Get L1 Skills associated with each competency
  4. **Format data:** Structure response with competencies and their associated L1 Skills
- **Secure URL generation:**
  1. **Generate URL:** Use Feature 39 (Secure Skills Profile Page & URL Generation) to create secure URL
  2. **Include in response:** Add secure URL to response payload
- **Response format:**
  ```json
  {
    "user_id": "<user_id>",
    "user_name": "<user_name>",
    "competencies": [
      {
        "competency_id": "<competency_id>",
        "competency_name": "<competency_name>",
        "l1_skills": [
          {
            "skill_id": "<skill_id>",
            "skill_name": "<skill_name>"
          },
          ...
        ]
      },
      ...
    ],
    "secure_url": "<secure_url_to_skills_engine_profile>"
  }
  ```
- **Send to Directory:**
  1. **Synchronous response:** Return response immediately to Directory
  2. **Complete data:** Ensure all competencies and L1 skills are included
  3. **Ready for display:** Directory can immediately display summary

### External API
**Uses any third-party APIs?**
- **Directory Microservice (MS #1):** Returns initial profile via synchronous API call
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal data retrieval and formatting

### AI
**Includes AI logic?**
- **No** - This is a data retrieval and formatting feature
- Uses profile data that was created using AI in Features 6-8

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API response feature
- No user-facing UI required
- Response is consumed by Directory microservice programmatically

### Dependencies
**Relies on other features?**
- **Feature 9:** Requires complete user profile structure with skills
- **Feature 39:** Requires secure URL generation
- **Database tables:** `userCompetency`, `userSkill` must exist
- Output: Initial profile returned to Directory microservice

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all initial profile returns, URL generation, response preparation
- **Analytics:** Track initial profile return rate, response time, profile completeness
- **Rollout:** Runs automatically after Feature 9 completes
- **Monitoring:** Track response preparation performance, URL generation performance, response time SLA

---

## Feature 50: Return Updated Profile (Directory)

### Goal
**What is the feature's main purpose?**
- Return updated profile to Directory after Baseline or Post-Course exam
- Include L1 Skills only (not MGS), Coverage Percentage, Proficiency Level, Relevance Score
- Include secure URL link to Skills Engine's expanded profile page
- Enable Directory to display updated user profile summary

### Logic
**Any custom algorithm or logic?**
- **Profile update process (prerequisite):**
  1. **After exam completion:** Exam results have been received and processed (Feature 12)
  2. **Update verified skills:** Skills Engine updates verified skills in `userCompetency` table (Feature 13)
  3. **Update competency profile:**
     - Calculate Coverage Percentage for each competency (Feature 14)
     - Map to Proficiency Level (Feature 15)
     - Update competency records in database
  4. **Calculate Relevance Score:** Calculate Relevance Score for Career Path Goal (Feature 16)
  5. **Store updates:** All profile updates are persisted in database before returning to Directory
- **Data compilation:**
  1. **Retrieve updated profile:** Query updated user profile from database:
     - All competencies for the user
     - L1 Skills only (not MGS)
     - Coverage Percentage for each competency
     - Proficiency Level for each competency
     - Relevance Score (calculated and stored)
  2. **Format competency data:** For each competency, include:
     - Competency ID and name
     - Associated L1 Skills only (no tested_mgs field)
     - Coverage Percentage
     - Proficiency Level
  3. **Include Relevance Score:** Add calculated Relevance Score to response
- **Secure URL generation:**
  1. **Generate URL:** Use Feature 39 (Secure Skills Profile Page & URL Generation) to create secure URL
  2. **Include in response:** Add secure URL to response payload
- **Response format:**
  ```json
  {
    "user_id": "<user_id>",
    "user_name": "<user_name>",
    "relevance_score": <score>,
    "competencies": [
      {
        "competency_id": "<competency_id>",
        "competency_name": "<competency_name>",
        "coverage_percentage": <percentage>,
        "proficiency_level": "<BEGINNER|INTERMEDIATE|ADVANCED|EXPERT>",
        "l1_skills": [
          {
            "skill_id": "<skill_id>",
            "skill_name": "<skill_name>"
          },
          ...
        ]
      },
      ...
    ],
    "secure_url": "<secure_url_to_skills_engine_profile>"
  }
  ```
- **Send to Directory:**
  1. **Synchronous response:** Return response immediately to Directory
  2. **Complete data:** Ensure all updated data is included
  3. **Ready for display:** Directory can immediately display updated summary

### External API
**Uses any third-party APIs?**
- **Directory Microservice (MS #1):** Returns updated profile via synchronous API call
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal data retrieval and formatting

### AI
**Includes AI logic?**
- **No** - This is a data retrieval and formatting feature
- Uses profile data that was updated after exam results processing

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API response feature
- No user-facing UI required
- Response is consumed by Directory microservice programmatically

### Dependencies
**Relies on other features?**
- **Feature 13:** Requires verified skills data from Update Verified Skills
- **Feature 14:** Requires Coverage Percentage calculation
- **Feature 15:** Requires Proficiency Level mapping
- **Feature 16:** Requires Relevance Score calculation
- **Feature 39:** Requires secure URL generation
- **Database tables:** `userCompetency`, `userSkill` must exist
- Output: Updated profile returned to Directory microservice

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all updated profile returns, URL generation, response preparation
- **Analytics:** Track updated profile return rate, response time, profile update frequency
- **Rollout:** Runs automatically after exam results processing (Feature 45 or 47)
- **Monitoring:** Track response preparation performance, URL generation performance, response time SLA

---

## Feature 51: Directory Profile Retrieval API (Synchronous)

### Goal
**What is the feature's main purpose?**
- Expose synchronous API endpoint for Directory to retrieve user profiles on-demand
- Provide comprehensive user profile data including competencies, verified skills, proficiency levels, Coverage Percentages, and Relevance Score
- Include secure URL link to Skills Engine's expanded profile page
- Enable Directory to retrieve profiles for display in dashboards

### Logic
**Any custom algorithm or logic?**
- **API endpoint setup:**
  1. **Endpoint definition:** Create synchronous API endpoint (e.g., `GET /api/directory/profile/:userId`)
  2. **Request format:** Accept user_id as path parameter
  3. **Synchronous response:** Return response immediately (blocking call)
- **Authentication and authorization:**
  1. **Token validation:** Validate Directory token from request headers
  2. **Token-based authentication:** Check token against stored microservice tokens
  3. **Service identification:** Identify calling service as Directory (MS #1)
  4. **Authorization check:** Verify that token belongs to Directory
  5. **Reject if invalid:** Return 401 Unauthorized if token is missing or invalid
- **Data retrieval:**
  1. **User identification:** Extract user_id from request parameters
  2. **Profile lookup:** Query user profile from database:
     - User's competencies
     - L1 Skills only (not MGS)
     - Coverage Percentage for each competency
     - Proficiency Level for each competency
     - Relevance Score
  3. **Data formatting:** Structure response with all profile data
- **Secure URL generation:**
  1. **Generate URL:** Use Feature 39 (Secure Skills Profile Page & URL Generation) to create secure URL
  2. **Include in response:** Add secure URL to response payload
- **Response format:**
  ```json
  {
    "user_id": "<user_id>",
    "user_name": "<user_name>",
    "relevance_score": <score>,
    "competencies": [
      {
        "competency_id": "<competency_id>",
        "competency_name": "<competency_name>",
        "coverage_percentage": <percentage>,
        "proficiency_level": "<BEGINNER|INTERMEDIATE|ADVANCED|EXPERT>",
        "l1_skills": [
          {
            "skill_id": "<skill_id>",
            "skill_name": "<skill_name>"
          },
          ...
        ]
      },
      ...
    ],
    "secure_url": "<secure_url_to_skills_engine_profile>"
  }
  ```
- **Error handling:**
  1. **If user not found:** Return 404 Not Found
  2. **If token invalid:** Return 401 Unauthorized
  3. **If database error:** Return 500 Internal Server Error

### External API
**Uses any third-party APIs?**
- **Directory Microservice (MS #1):** Receives synchronous API requests from Directory
- **Communication method:** Synchronous HTTP (REST API)
- **No direct third-party APIs** - internal data retrieval

### AI
**Includes AI logic?**
- **No** - This is a data retrieval API endpoint
- Returns profile data that may have been processed by AI in previous features

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend API endpoint
- No user-facing UI required
- API is consumed by Directory microservice programmatically

### Dependencies
**Relies on other features?**
- **Feature 13:** Requires verified skills data from Update Verified Skills
- **Feature 14:** Requires Coverage Percentage calculation
- **Feature 15:** Requires Proficiency Level mapping
- **Feature 16:** Requires Relevance Score calculation
- **Feature 39:** Requires secure URL generation
- **Authentication Service:** Requires token validation mechanism for Directory
- **Database tables:** `userCompetency`, `userSkill` must exist
- Output: User profile data returned to Directory microservice

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all API requests, token validations, user lookups, URL generation, response times
- **Analytics:** Track API request rate, lookup success rate, response time, profile retrieval frequency
- **Rollout:** Must be available before Directory can retrieve user profiles
- **Monitoring:** Track API endpoint availability, authentication failures, database query performance, response time SLA

---

## Feature 52: Audit Trail Logging

### Goal
**What is the feature's main purpose?**
- Maintain audit trail for all profile verification updates
- Track source of verification (Assessment, Certification, Claims/AI)
- Log all changes to user profiles for compliance and debugging
- Provide complete history of skill verification events

### Logic
**Any custom algorithm or logic?**
- **Audit log structure:**
  1. **Log entry fields:**
     - `user_id`: User whose profile was updated
     - `skill_id`: Skill that was verified/updated
     - `skill_name`: Name of the skill
     - `verification_source`: Source of verification (Assessment, Certification, Claims/AI)
     - `verification_status`: Status (verified=true/false)
     - `previous_status`: Previous verification status (if applicable)
     - `timestamp`: When the update occurred
     - `updated_by`: System or service that made the update
  2. **Database table:** Store audit logs in `audit_logs` table
- **Logging triggers:**
  1. **Profile updates:** Log all updates to verified skills (Feature 13)
  2. **Source tracking:** Track which source provided the verification
  3. **Status changes:** Log when verification status changes (true → false or false → true)
  4. **Bulk updates:** Log bulk updates from exam results
- **Data trust priority:**
  1. **Priority hierarchy:** Assessment > Certification > Claims/AI
  2. **Conflict resolution:** If multiple sources conflict, use highest priority source
  3. **Log conflicts:** Log when conflicts occur and how they were resolved
- **Query and retrieval:**
  1. **User history:** Query all audit logs for a specific user
  2. **Skill history:** Query all audit logs for a specific skill
  3. **Time range:** Query audit logs within a time range
  4. **Source filtering:** Filter audit logs by verification source

### External API
**Uses any third-party APIs?**
- **None** - This is an internal logging feature
- All operations are internal database writes

### AI
**Includes AI logic?**
- **No** - This is a logging and audit feature
- Logs data that may have been processed by AI

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend logging feature
- No user-facing UI required
- May have admin dashboard in future to view audit logs (not in MVP)

### Dependencies
**Relies on other features?**
- **Feature 13:** Logs updates from Update Verified Skills
- **Database tables:** `audit_logs` table must exist
- Output: Audit logs stored in database for compliance and debugging

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all audit log writes, conflict resolutions, query operations
- **Analytics:** Track audit log write rate, conflict frequency, source distribution, query performance
- **Rollout:** Runs automatically whenever profile updates occur
- **Monitoring:** Track audit log write performance, database storage usage, query performance

---

## Feature 53: Token-Based Authentication

### Goal
**What is the feature's main purpose?**
- Implement token-based authentication for microservice communication
- Validate tokens from other microservices (Directory, Assessment, Course Builder, etc.)
- Secure API endpoints with token validation
- Manage microservice tokens in database

### Logic
**Any custom algorithm or logic?**
- **Token storage:**
  1. **Database table:** Store tokens in `microservice_tokens` table
  2. **Token fields:**
     - `microservice_name`: Name of the microservice (Directory, Assessment, etc.)
     - `token_hash`: Hashed token value (never store plain text)
     - `created_at`: When token was created
     - `expires_at`: Token expiration time (optional)
     - `is_active`: Whether token is active
  3. **Token hashing:** Hash tokens using secure hashing algorithm (e.g., bcrypt)
- **Token validation:**
  1. **Request header:** Extract token from `Authorization` header
  2. **Token lookup:** Query `microservice_tokens` table for matching token hash
  3. **Validation checks:**
     - Token exists in database
     - Token is active (`is_active=true`)
     - Token is not expired (if expiration is set)
     - Token belongs to correct microservice
  4. **Reject if invalid:** Return 401 Unauthorized if validation fails
- **Microservice identification:**
  1. **Service mapping:** Map token to microservice name
  2. **Authorization:** Verify microservice has permission to access requested endpoint
  3. **Service context:** Pass microservice context to downstream features
- **Token management:**
  1. **Token creation:** Create new tokens for microservices
  2. **Token rotation:** Support token rotation for security
  3. **Token revocation:** Deactivate tokens if compromised

### External API
**Uses any third-party APIs?**
- **None** - This is an internal authentication feature
- All operations are internal database queries and validations

### AI
**Includes AI logic?**
- **No** - This is an authentication and security feature
- No AI processing required

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend authentication feature
- No user-facing UI required
- May have admin dashboard in future to manage tokens (not in MVP)

### Dependencies
**Relies on other features?**
- **All API endpoints:** All features that expose APIs require token validation
- **Database tables:** `microservice_tokens` table must exist
- Output: Secure token-based authentication for all microservice communications

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all token validations, authentication successes/failures, token lookups
- **Analytics:** Track authentication success rate, token usage per microservice, authentication failures
- **Rollout:** Must be available before any microservice can access Skills Engine APIs
- **Monitoring:** Track authentication performance, token validation latency, security incidents

---

## Feature 54: Access Control & Role-Based Permissions

### Goal
**What is the feature's main purpose?**
- Enforce access control based on user roles and employee types
- Restrict features based on user permissions (e.g., Trainer-only CSV upload)
- Validate user permissions on both frontend and backend
- Ensure secure access to sensitive operations

### Logic
**Any custom algorithm or logic?**
- **Role-based access control:**
  1. **User roles:** Define user roles/employee types (Trainer, Employee, Admin, etc.)
  2. **Permission mapping:** Map roles to permissions
  3. **Feature permissions:** Define which features require which permissions
- **Frontend access control:**
  1. **UI visibility:** Hide features from users who don't have permission
  2. **Button visibility:** Hide "Upload File" button if user is not Trainer (Feature 30)
  3. **Route protection:** Protect routes based on user permissions
- **Backend access control:**
  1. **Permission validation:** Validate user permissions on server before processing requests
  2. **Role check:** Check user's employee type/role from database
  3. **Reject if unauthorized:** Return 403 Forbidden if user doesn't have required permission
- **Permission checks:**
  1. **CSV upload:** Only Trainers can upload CSV files (Feature 30)
  2. **Profile access:** Users can only access their own profiles (unless admin)
  3. **Admin operations:** Only admins can perform administrative operations
- **User context:**
  1. **User identification:** Identify user from authentication token/session
  2. **Role retrieval:** Get user's role/employee type from database
  3. **Permission evaluation:** Evaluate if user has required permission

### External API
**Uses any third-party APIs?**
- **None** - This is an internal access control feature
- May integrate with authentication service for user role information

### AI
**Includes AI logic?**
- **No** - This is an access control and security feature
- No AI processing required

### UI/UX
**Requires unique design or interaction?**
- **Yes** - Frontend access control affects UI
- **Design requirements:**
  - Hide features from unauthorized users
  - Show appropriate error messages for unauthorized access
  - Clear indication of user's role/permissions
- **User experience:**
  - Users only see features they can access
  - Clear error messages for unauthorized actions
  - Smooth permission-based navigation

### Dependencies
**Relies on other features?**
- **Feature 30:** Requires access control for CSV upload (Trainer-only)
- **Authentication Service:** Requires user authentication and role information
- **Database tables:** User table with role/employee_type field must exist
- Output: Secure access control for all features based on user roles

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all permission checks, access control decisions, unauthorized access attempts
- **Analytics:** Track permission check rate, unauthorized access frequency, role distribution
- **Rollout:** Must be available before any role-based features can be used
- **Monitoring:** Track access control performance, permission check latency, security incidents

---

## Feature 55: Data Trust Priority Enforcement

### Goal
**What is the feature's main purpose?**
- Enforce data trust priority hierarchy for skill verification
- Resolve conflicts when multiple sources provide different verification status
- Ensure highest priority source always takes precedence
- Maintain data integrity and reliability

### Logic
**Any custom algorithm or logic?**
- **Trust priority hierarchy:**
  1. **Priority order:**
     - **Assessment** (highest priority): Exam results from Assessment microservice
     - **Certification** (medium priority): External certifications
     - **Claims/AI** (lowest priority): User claims or AI-extracted skills
  2. **Priority values:** Assign numeric priority values (e.g., Assessment=3, Certification=2, Claims/AI=1)
- **Conflict resolution:**
  1. **When conflict occurs:** Multiple sources provide different verification status for same skill
  2. **Resolution logic:**
     - Compare priority values of conflicting sources
     - Use verification status from source with highest priority
     - Log conflict and resolution in audit trail (Feature 52)
  3. **Update profile:** Update user profile with highest priority verification status
- **Source tracking:**
  1. **Source metadata:** Store source information with each verified skill
  2. **Source history:** Track which source provided verification (in audit log)
  3. **Source updates:** When higher priority source updates skill, replace lower priority source
- **Verification updates:**
  1. **Assessment update:** If Assessment provides verification, always use it (highest priority)
  2. **Certification update:** If Certification provides verification, use it unless Assessment already verified
  3. **Claims/AI update:** If Claims/AI provides verification, use it only if no higher priority source exists
- **Implementation:**
  1. **Feature 13 integration:** Apply trust priority in Update Verified Skills feature
  2. **Priority check:** Before updating skill, check existing source priority
  3. **Conditional update:** Only update if new source has equal or higher priority

### External API
**Uses any third-party APIs?**
- **None** - This is an internal data integrity feature
- All operations are internal logic and database updates

### AI
**Includes AI logic?**
- **No** - This is a data integrity and conflict resolution feature
- May process data that was extracted by AI, but doesn't use AI itself

### UI/UX
**Requires unique design or interaction?**
- **No** - This is a backend data integrity feature
- No user-facing UI required
- May show source information in profile display (optional)

### Dependencies
**Relies on other features?**
- **Feature 13:** Requires trust priority enforcement in Update Verified Skills
- **Feature 52:** Requires audit trail logging for conflict resolution
- **Database tables:** `userCompetency` with `verifiedSkills` JSON field must support source tracking
- Output: Reliable skill verification with proper priority enforcement

### Telemetry/Rollout
**Needs analytics, logging, or staged rollout?**
- **Logging:** Log all conflict resolutions, priority comparisons, source updates
- **Analytics:** Track conflict frequency, priority distribution, source update patterns
- **Rollout:** Runs automatically whenever skill verification occurs
- **Monitoring:** Track conflict resolution performance, data integrity, priority enforcement accuracy

---

**Note:** All 55 features have been detailed with the same structure (Goal, Logic, External API, AI, UI/UX, Dependencies, Telemetry/Rollout).

**Last Updated:** 2025-01-27
