# Skills Engine - AI Capabilities

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**AI Technology:** Google Gemini API  
**Models Used:** Gemini Flash, Gemini Deep-Search  
**Date:** 2025-01-27

---

## 📋 Table of Contents

1. [Knowledge Building and Taxonomy Construction](#1-knowledge-building-and-taxonomy-construction)
2. [Data Extraction and Initial Profile Mapping](#2-data-extraction-and-initial-profile-mapping)
3. [External Knowledge Discovery](#3-external-knowledge-discovery)

---

## 1. Knowledge Building and Taxonomy Construction

**Purpose:** AI serves as the core engine of the system's knowledge-building process, automatically building a comprehensive, high-quality skills and competencies database.

**Gemini Models Used:**
- **Gemini Flash:** Fast processing for source discovery and initial extraction
- **Gemini Deep-Search:** Deep semantic analysis and validation

### 1.1 Official Sources Discovery
- **Model:** Gemini Flash
- **How Gemini is Used:** Scans documentation sites, API references, and technical standards to identify authoritative sources
- **Process:**
  - AI identifies and compiles list of URLs and APIs that serve as authoritative references
  - Checks each source against the database
  - Adds new sources to the official sources list
- **Output:** Verified list of authoritative sources for skills and competencies

### 1.2 Deep Semantic Extraction
- **Model:** Gemini Deep-Search
- **How Gemini is Used:** Performs deep semantic extraction from each source
- **Process:**
  - Understands content contextually
  - Identifies competencies, skills, and all sub-levels (L1 → L4/MGS)
  - Converts unstructured content into clean hierarchical structure
  - Extracts relationships between skills and competencies
- **Output:** Structured hierarchical data ready for validation

### 1.3 Data Validation
- **Model:** Gemini Deep-Search
- **How Gemini is Used:** Second AI process validates extracted data
- **Process:**
  - Ensures accuracy of extracted skills
  - Removes irrelevant text and noise
  - Eliminates duplicates across sources
  - Verifies that each item is a real, measurable skill
  - Validates hierarchical relationships
- **Output:** Clean, validated skill and competency data

### 1.4 Normalization and Unification
- **Model:** Gemini Flash
- **How Gemini is Used:** Normalizes terminology and unifies naming variations
- **Process:**
  - Unifies different naming variations (e.g., "JS" → "JavaScript", "Proj Mgmt" → "Project Management")
  - Merges overlapping structures from multiple sources
  - Creates consistent dataset from diverse sources
  - Maps synonyms to canonical skill names
- **Output:** Normalized, consistent skills and competencies database

### 1.5 Benefits
- Automatically builds comprehensive database that would take humans months to assemble manually
- Ensures high-quality, accurate skill taxonomy
- Maintains consistency across multiple sources
- Reduces manual effort and errors

**Related Functional Requirements:** FR-1.1, FR-1.2, FR-1.3, FR-1.4, FR-1.5

---

## 2. Data Extraction and Initial Profile Mapping

**Purpose:** Accelerates user onboarding process by automatically extracting skills from unstructured user data.

**Gemini Models Used:**
- **Gemini Flash:** Fast extraction from resumes and profiles
- **Gemini Deep-Search:** Deep analysis for complex skill identification

### 2.1 Unstructured Data Analysis
- **Model:** Gemini Deep-Search
- **How Gemini is Used:** Analyzes unstructured text to identify skills, competencies, and relevant experience
- **Input Sources:**
  - Professional history (pasted text)
  - Resumes/CVs
  - LinkedIn profiles
  - GitHub profiles
  - Job descriptions
  - Uploaded documents
- **Process:**
  - Parses unstructured text
  - Identifies skill mentions and context
  - Extracts competencies and experience levels
  - Understands professional context

### 2.2 Skill Mapping to Taxonomy
- **Model:** Gemini Flash
- **How Gemini is Used:** Maps identified skills to corresponding Most Granular Skills (MGS) in internal taxonomy
- **Process:**
  - Matches extracted skills to canonical taxonomy
  - Maps to appropriate L1 Skills
  - Identifies corresponding MGS
  - Handles variations and synonyms
- **Output:** Initial skill profile mapped to internal taxonomy

### 2.3 Profile Initialization
- **Result:** Builds user's initial, albeit unverified, skill profile
- **Storage:**
  - L1 Skills saved to `userSkill` table
  - MGS saved to `verifiedSkills` (JSON) field in `userCompetency` table
  - All skills initialized as `verified=false`
- **Next Step:** Baseline Exam preparation based on extracted skills

**Related Functional Requirements:** FR-2.2.1, FR-2.2.2, FR-2.3.1, FR-2.3.2

**Benefits:**
- Speeds up profile creation
- Reduces manual data entry
- Ensures consistent skill naming
- Supports company-specific customization while maintaining alignment with global taxonomy

---

## 3. External Knowledge Discovery

**Purpose:** Ensures taxonomy remains relevant to current industry demands by dynamically discovering missing competencies.

**Gemini Models Used:**
- **Gemini Deep-Search:** Comprehensive search and extraction from external sources

### 3.1 Gap Identification
- **Trigger:** When Skills Engine identifies a gap in its taxonomy
- **Example:** A requested Competency is missing or incomplete
- **Context:** Request from Course Builder (MS #3) for competency not in database

### 3.2 Targeted Search
- **Model:** Gemini Deep-Search
- **How Gemini is Used:** Performs targeted, structured search of external sources
- **Search Sources:**
  - Industry standards
  - Job boards
  - Technical documentation
  - Professional frameworks
  - Educational resources
- **Process:**
  - Uses Gemini for intelligent search
  - Performs broad search across the internet
  - Filters and prioritizes relevant sources

### 3.3 Structured Extraction
- **Model:** Gemini Deep-Search
- **How Gemini is Used:** Extracts definition and structures results into component MGS
- **Process:**
  - Extracts definition of missing Competency
  - Structures results directly into list of component MGS
  - Identifies hierarchical relationships
  - Normalizes extracted data (per FR-7.3)
- **Output:** Structured competency with all underlying MGS

### 3.4 Autonomous Knowledge Growth
- **Process:**
  - Stores discovered data in taxonomy
  - Returns results to Course Builder
  - Enables Skills Engine to autonomously grow and update knowledge base
- **Result:** Taxonomy remains current with industry demands without manual updates

**Related Functional Requirements:** FR-5.2.1, FR-5.2.2, FR-5.2.3, FR-5.2.4, FR-5.2.5

**Benefits:**
- Keeps taxonomy current with industry trends
- Reduces manual maintenance
- Enables dynamic enrichment for Course Builder
- Ensures comprehensive skill coverage

---

## 📊 AI Capabilities Summary

| Capability | Purpose | Gemini Models | Key Benefit |
|------------|---------|---------------|-------------|
| Knowledge Building | Build comprehensive taxonomy | Flash (discovery, normalization), Deep-Search (extraction, validation) | Automated high-quality database construction |
| Data Extraction | Accelerate user onboarding | Deep-Search (analysis), Flash (mapping) | Fast profile creation from resumes/LinkedIn |
| External Discovery | Keep taxonomy current | Deep-Search (search and extraction) | Autonomous knowledge base growth |

---

## 🔧 Implementation Considerations

### Gemini API Integration
- **API Key Management:** Store `GEMINI_API_KEY` securely in environment variables
- **Model Selection:**
  - **Gemini Flash:** Use for fast operations (source discovery, normalization)
  - **Gemini Deep-Search:** Use for complex operations (deep extraction, validation, external discovery)
- **Model Configuration:** Specify model in API calls (`gemini-flash` or `gemini-deep-search`)
- **Rate Limiting:** Implement rate limiting to manage API usage for both models
- **Error Handling:** Fallback to mock data if API unavailable (per Global API Fallback Rule)
- **Cost Optimization:** 
  - Use Flash for high-volume, low-complexity tasks
  - Use Deep-Search for critical, complex operations
  - Cache results where possible

### Performance Optimization
- **Batch Processing:** Process multiple skills in batches for efficiency
- **Async Processing:** Use async processing for long-running AI operations
- **Result Caching:** Cache normalized and validated results

### Data Quality
- **Validation Layers:** Multiple validation steps ensure accuracy
- **Human Review:** Option for human review of AI-extracted data
- **Confidence Scores:** Include confidence scores for AI-extracted skills
- **Version Control:** Track changes to taxonomy from AI discovery

---

## 🔗 Related Documents

- [Functional Requirements](./FUNCTIONAL_REQUIREMENTS.md)
- [User Stories & Business Logic](./USER_STORIES_AND_BUSINESS_LOGIC.md)
- [Non-Functional Requirements](./NON_FUNCTIONAL_REQUIREMENTS.md)
- [Setup Guide](../SETUP.md)

---

## 📝 AI Prompt Specifications

AI prompts should be stored in `/docs/prompts/` directory for:
- Source discovery prompts
- Semantic extraction prompts
- Validation prompts
- Normalization prompts
- External knowledge discovery prompts

---

**Last Updated:** 2025-01-27

