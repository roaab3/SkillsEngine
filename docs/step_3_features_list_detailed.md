# Step 3: Feature Architecture - Detailed Features List

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Date:** 2025-01-27  
**Status:** In Progress

---

## Features Overview

This document contains the detailed breakdown of features for the Skills Engine microservice, organized for detailed specification in Step 3.

---

## Detailed Feature List

### Taxonomy Management Features

#### 1.1 Skill Hierarchy Management
- **Status:** Pending Details
- **Goal:** Manage N-level skill hierarchy with self-referencing relationships
- **Linked FRs:** FR 5.1.1, FR 5.1.2
- **Details:** To be specified

#### 1.2 Competency Structure Management
- **Status:** Pending Details
- **Goal:** Manage two-layer competency structure (Parent → Child)
- **Linked FRs:** FR 5.1.3, FR 5.1.4
- **Details:** To be specified

#### 1.3 Skill Relationship Network
- **Status:** Pending Details
- **Goal:** Manage many-to-many relationships between skills
- **Linked FRs:** FR 5.1.5
- **Details:** To be specified

#### 1.4 MGS Count Calculation & Caching
- **Status:** Pending Details
- **Goal:** Calculate and cache total MGS count for L1 skills
- **Linked FRs:** FR 5.1.1
- **Details:** To be specified

---

### User Profile Management Features

#### 2.1 Basic Profile Creation
- **Status:** Pending Details
- **Goal:** Create the user profile with basic data received from Directory MS
- **Linked FRs:** FR 5.3.1, FR 5.3.3
- **Details:** To be specified

#### 2.2 AI Extraction of Raw Data
- **Status:** Pending Details
- **Goal:** Receive raw data input and use AI to extract competencies and skills
- **Linked FRs:** FR 5.3.2, FR 5.3.10
- **Details:** To be specified

#### 2.3 Normalization & Deduplication
- **Status:** Pending Details
- **Goal:** Normalize and deduplicate extracted skills and competencies before storage
- **Linked FRs:** FR 5.2.2
- **Details:** To be specified

#### 2.4 Initial Competency Profile Delivery
- **Status:** Pending Details
- **Goal:** Create the initial unverified competency profile and send it to Directory MS
- **Linked FRs:** FR 5.3.8, FR 5.3.9
- **Details:** To be specified

#### 2.5 Profile Updates
- **Status:** Pending Details
- **Goal:** Update user profiles after verification, send to Directory MS
- **Linked FRs:** FR 5.3.9, FR 5.3.11
- **Details:** To be specified

#### 2.6 Profile Retrieval
- **Status:** Pending Details
- **Goal:** Retrieve user profiles for display and API access
- **Linked FRs:** FR 5.5.1, FR 5.5.2
- **Details:** To be specified

---

### Skill Verification Features

#### 3.1 Baseline Exam Request
- **Status:** Pending Details
- **Goal:** Send required MGS list to Assessment MS to create Primary Assignment (Baseline) test
- **Linked FRs:** FR 5.3.4
- **Details:** To be specified

#### 3.2 Baseline Exam Verification
- **Status:** Pending Details
- **Goal:** Handle Primary Assignment test results, verify MGS, update profile
- **Linked FRs:** FR 5.3.5, FR 5.3.8
- **Details:** To be specified

#### 3.3 Post-Course Exam Verification
- **Status:** Pending Details
- **Goal:** Handle post-course exam results, update verified skills
- **Linked FRs:** FR 5.3.6
- **Details:** To be specified

#### 3.4 Verification Status Management
- **Status:** Pending Details
- **Goal:** Track and update verification status for MGS
- **Linked FRs:** FR 5.3.5, FR 5.3.7
- **Details:** To be specified

---

### Proficiency & Level Calculation Features

#### 4.1 Coverage Percentage Calculation
- **Status:** Pending Details
- **Goal:** Calculate coverage = verified_MGS / total_required_MGS
- **Linked FRs:** FR 5.4.2
- **Details:** To be specified

#### 4.2 Proficiency Level Mapping
- **Status:** Pending Details
- **Goal:** Map coverage percentage to 4 levels (BEGINNER → EXPERT)
- **Linked FRs:** FR 5.4.3
- **Details:** To be specified

#### 4.3 Level Update Logic
- **Status:** Pending Details
- **Goal:** Update levels only if verification passes
- **Linked FRs:** FR 5.4.4
- **Details:** To be specified

#### 4.4 Relevance Score Calculation
- **Status:** Pending Details
- **Goal:** Calculate Relevance Score for Career Path Goal
- **Linked FRs:** FR 5.4.5
- **Details:** To be specified

---

### 5. Gap Analysis

**Status:** Pending Details  
**Goal:** Perform gap analysis (broad and narrow), calculate missing MGS, automatically trigger after exam results, and report results to Learner AI and frontend

**Components:**
- **Broad Gap Analysis:** Perform gap analysis against full Career Path Goal
- **Narrow Gap Analysis:** Perform gap analysis for specific competency
- **Gap Calculation Logic:** Calculate missing MGS = Required MGS - Verified MGS
- **Automation:** Automatically trigger gap analysis after exam results
- **Reporting:** Send gap analysis results to Learner AI and frontend

**Conditional Logic:**
- **Baseline Exam** → Broad Gap Analysis (full career path)
- **Post-course PASS** → Broad Gap Analysis (full career path)
- **Post-course FAIL** → Narrow Gap Analysis (course-specific competency)

**Linked FRs:** FR 5.5.2, FR 5.5.3, FR 5.5.4, FR 5.5.5, FR 5.5.6

**Details:** To be specified

---

### Skill Discovery Features

#### 6.1 Internal Skill Lookup
- **Status:** Pending Details
- **Goal:** Lookup skills/competencies in internal database
- **Linked FRs:** FR 5.6.1, FR 5.6.2
- **Details:** To be specified

#### 6.2 External Competency Discovery
- **Status:** Pending Details
- **Goal:** First lookup in internal database for requested competency. If not found, then discover missing competencies from external sources (for Course Builder). Normalize and store discovered data.
- **Logic:** Internal lookup → If not found → External discovery → Normalization → Storage
- **Linked FRs:** FR 5.2.3, FR 5.6.1
- **Details:** To be specified

#### 6.3 Skill Retrieval for Microservices
- **Status:** Pending Details
- **Goal:** Provide MGS retrieval for Content Studio and Learner AI (lookup only)
- **Linked FRs:** FR 5.6.2
- **Details:** To be specified

---

### Trainer Import Features

#### 7.1 CSV Upload Interface
- **Status:** Pending Details
- **Goal:** Provide UI for trainers to upload CSV files
- **Linked FRs:** FR 5.5.7
- **Details:** To be specified

#### 7.2 CSV Security Validation
- **Status:** Pending Details
- **Goal:** Validate CSV files for security threats (SQL injection, prompt injection)
- **Linked FRs:** FR 5.2.4
- **Details:** To be specified

#### 7.3 CSV Processing & Import
- **Status:** Pending Details
- **Goal:** Parse CSV, normalize, and merge into taxonomy
- **Linked FRs:** FR 5.2.4
- **Details:** To be specified

---

### External Systems API Integration Features

**Note:** Skills Engine **provides REST APIs** that **external microservices** (Directory MS, Assessment MS, Course Builder MS, etc.) consume. These external microservices are separate systems that make requests to Skills Engine. Skills Engine acts as the **API provider**.

#### 8.1 Directory MS Integration
- **Status:** Pending Details
- **Goal:** Receive user data, send updated profiles
- **API Type:** Skills Engine provides REST API endpoints to external systems
- **Direction:** Directory MS → Skills Engine (user data), Skills Engine → Directory MS (updated profiles)
- **Linked FRs:** FR 5.3.1, FR 5.3.8, FR 5.3.9
- **Details:** To be specified

#### 8.2 Assessment MS Integration
- **Status:** Pending Details
- **Goal:** Send MGS for exams, receive exam results
- **API Type:** Skills Engine provides REST API endpoints to external systems
- **Direction:** Skills Engine → Assessment MS (MGS list), Assessment MS → Skills Engine (exam results)
- **Linked FRs:** FR 5.3.4, FR 5.3.5, FR 5.3.6
- **Details:** To be specified

#### 8.3 Course Builder MS Integration
- **Status:** Pending Details
- **Goal:** Provide MGS retrieval with discovery capability
- **API Type:** Skills Engine provides REST API endpoints to external systems
- **Direction:** Course Builder MS → Skills Engine (request MGS)
- **Linked FRs:** FR 5.6.1
- **Details:** To be specified

#### 8.4 Content Studio MS Integration
- **Status:** Pending Details
- **Goal:** Provide MGS retrieval (lookup only)
- **API Type:** Skills Engine provides REST API endpoints to external systems
- **Direction:** Content Studio MS → Skills Engine (request MGS)
- **Linked FRs:** FR 5.6.2
- **Details:** To be specified

#### 8.5 Learner AI MS Integration
- **Status:** Pending Details
- **Goal:** Send gap analysis results, provide MGS retrieval
- **API Type:** Skills Engine provides REST API endpoints to external systems
- **Direction:** Skills Engine → Learner AI MS (gap analysis), Learner AI MS → Skills Engine (request MGS)
- **Linked FRs:** FR 5.5.6, FR 5.6.2
- **Details:** To be specified

#### 8.6 Learning Analytics MS Integration
- **Status:** Pending Details
- **Goal:** Provide user profiles and aggregated team data
- **API Type:** Skills Engine provides REST API endpoints to external systems
- **Direction:** Learning Analytics MS → Skills Engine (request profiles/data)
- **Linked FRs:** FR 5.5.1
- **Details:** To be specified

#### 8.7 RAG/Chatbot MS Integration
- **Status:** Pending Details
- **Goal:** Share taxonomy structure and user profiles
- **API Type:** Skills Engine provides REST API endpoints to external systems
- **Direction:** RAG MS → Skills Engine (request taxonomy/profiles)
- **Linked FRs:** (Integration requirement)
- **Details:** To be specified

---

### AI-Powered Extraction Features

#### 9.1 Source Discovery & Link Storage
- **Status:** Pending Details
- **Goal:** Identify official external source URLs for skill extraction
- **Linked FRs:** FR 5.2.1, FR 5.2.5
- **AI Model:** Gemini 1.5 Flash
- **Details:** To be specified

#### 9.2 Web Deep Search & Skill Extraction
- **Status:** Pending Details
- **Goal:** Scrape and extract skills and competencies from external sites
- **Linked FRs:** FR 5.2.1
- **AI Model:** Gemini 1.5 Pro (Deep Search)
- **Details:** To be specified

#### 9.3 User Data Skill Extraction
- **Status:** Pending Details
- **Goal:** Extract skills from user raw data (resumes, LinkedIn, etc.)
- **Linked FRs:** FR 5.3.2
- **AI Model:** Gemini 1.5 Flash
- **Details:** To be specified

#### 9.4 Normalization & Deduplication
- **Status:** Pending Details
- **Goal:** Standardize terminology, merge duplicates, unify hierarchy
- **Linked FRs:** FR 5.2.2
- **AI Model:** Gemini 1.5 Flash
- **Details:** To be specified

#### 9.5 Validation of Extracted Data
- **Status:** Pending Details
- **Goal:** Ensure quality, completeness, and correctness of extracted data
- **Linked FRs:** FR 5.2.1
- **AI Model:** Gemini 1.5 Flash / Pro
- **Details:** To be specified

#### 9.6 On-Demand Discovery for Missing Competencies
- **Status:** Pending Details
- **Goal:** Search external sources when competency/skill is missing
- **Linked FRs:** FR 5.2.3
- **AI Model:** Gemini 1.5 Flash + Deep Search
- **Details:** To be specified

---

## Feature Summary

**Total Features:** 39 features (broken down from 13 main features, with Gap Analysis unified)

### By Category:
- **Taxonomy Management:** 4 features
- **User Profile Management:** 6 features
- **Skill Verification:** 4 features
- **Proficiency & Level Calculation:** 4 features
- **Gap Analysis:** 1 feature (unified from 5)
- **Skill Discovery:** 3 features
- **Trainer Import:** 3 features
- **External Systems API Integration:** 7 features
- **AI-Powered Extraction:** 6 features

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


