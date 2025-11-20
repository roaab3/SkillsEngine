# Step 3: Feature Architecture - Features List

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Date:** 2025-01-27  
**Status:** In Progress

---

## Features Overview

This document contains the complete list of features for the Skills Engine microservice, organized for detailed specification in Step 3.

---

## Feature List (13 Features - API Integration unified)

### 1. Taxonomy Management
- **Status:** Pending Details
- **Goal:** Manage hierarchical skill and competency taxonomy
- **Details:** To be specified

### 2. User Profile Management
- **Status:** Pending Details
- **Goal:** Create and maintain user skill profiles through 6 sub-features:
  - 2.1 Basic Profile Creation
  - 2.2 AI Extraction of Raw Data
  - 2.3 Normalization & Deduplication
  - 2.4 Initial Competency Profile Delivery
  - 2.5 Profile Updates
  - 2.6 Profile Retrieval
- **Details:** To be specified

### 3. Skill Verification
- **Status:** Pending Details
- **Goal:** Verify skills based on assessment results through 4 sub-features:
  - 3.1 Baseline Exam Request
  - 3.2 Baseline Exam Verification
  - 3.3 Post-Course Exam Verification
  - 3.4 Verification Status Management
- **Details:** To be specified

### 4. Proficiency & Level Calculation
- **Status:** Pending Details
- **Goal:** Calculate coverage percentage for each competency, map coverage to 4 proficiency levels (Beginner → Expert), update levels only if verification passes, and recalculate Relevance Score after verification
- **Details:** To be specified

### 5. Gap Analysis
- **Status:** Pending Details
- **Goal:** Perform gap analysis (broad and narrow)
- **Details:** To be specified

### 6. Skill Discovery
- **Status:** Pending Details
- **Goal:** On-demand skill discovery and normalization
- **Details:** To be specified

### 7. Trainer Import
- **Status:** Pending Details
- **Goal:** CSV upload for custom taxonomies
- **Details:** To be specified

### 8. External Systems API Integration
- **Status:** Pending Details
- **Goal:** Provide REST APIs for external microservices (Directory MS, Assessment MS, Course Builder MS, Content Studio MS, Learner AI MS, Learning Analytics MS, RAG/Chatbot MS) to interact with Skills Engine
- **Details:** To be specified

### 9. Source Discovery & Link Storage
- **Status:** Pending Details
- **Goal:** Identify official external source URLs for skill extraction
- **Details:** To be specified

### 10. Web Deep Search & Skill Extraction
- **Status:** Pending Details
- **Goal:** Scrape and extract skills and competencies from external sites
- **Details:** To be specified

### 11. Normalization & Deduplication
- **Status:** Pending Details
- **Goal:** Standardize terminology, merge duplicates, unify hierarchy
- **Details:** To be specified

### 12. Validation of Extracted Data
- **Status:** Pending Details
- **Goal:** Ensure the quality, completeness, and correctness of extracted skills and competencies
- **Details:** To be specified

### 13. On-Demand Discovery for Missing Competencies
- **Status:** Pending Details
- **Goal:** When a requested competency or skill is missing, search external sources to find new data
- **Details:** To be specified

---

## Feature Specification Template

For each feature, the following details will be specified:

1. **Goal:** Main purpose of the feature
2. **Linked Functional Requirements:** Which FRs this feature implements
3. **System Components:**
   - Frontend components
   - Backend components
   - Database components
4. **UI/UX Design:**
   - Has custom design (yes/no)
   - Description
   - Figma link (if available)
5. **External API Integrations:**
   - Uses external API (yes/no)
   - API name
   - Integration points
6. **AI Integration:**
   - Uses AI (yes/no)
   - AI purpose
   - AI model
   - Prompt specification
   - Expected output
7. **Algorithmic Logic:**
   - Has custom algorithm (yes/no)
   - Description
8. **Dependencies:** Other features this depends on
9. **Telemetry:** Analytics, logging requirements
10. **Rollout Strategy:** How this feature will be rolled out

---

## Next Steps

Each feature will be detailed according to the template above, with all specifications documented before proceeding to Step 4 (UX/UI & User Flow Design).

---

**Document Created:** 2025-01-27  
**Last Updated:** 2025-01-27



