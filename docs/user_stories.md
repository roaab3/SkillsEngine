# User Stories - Skills Engine Microservice

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Date:** 2025-01-27  
**Status:** ✅ Complete

---

## Table of Contents

1. [Employee User Stories](#employee-user-stories)
2. [Trainer User Stories](#trainer-user-stories)
3. [Directory Microservice User Stories](#directory-microservice-user-stories)
4. [Assessment Microservice User Stories](#assessment-microservice-user-stories)
5. [Course Builder Microservice User Stories](#course-builder-microservice-user-stories)
6. [Content Studio Microservice User Stories](#content-studio-microservice-user-stories)
7. [Learner AI Microservice User Stories](#learner-ai-microservice-user-stories)
8. [Learning Analytics Microservice User Stories](#learning-analytics-microservice-user-stories)
9. [RAG/Chatbot Microservice User Stories](#ragchatbot-microservice-user-stories)
10. [System User Stories](#system-user-stories)

---

## Employee User Stories

### US-1: View Skill Profile

**As an** employee,  
**I want to** view my skill profile  
**So that** I can see my verified competencies, proficiency levels, and identify skill gaps.

**Priority:** High  
**Story Points:** 5  
**Flow:** FLOW 2, FLOW 3, FLOW 4

**Acceptance Criteria:**
- ✅ Profile displays verified MGS (Most Granular Skills)
- ✅ Shows proficiency levels (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- ✅ Displays gap analysis results
- ✅ Shows relevance score for career path
- ✅ Profile updates automatically after skill verification
- ✅ UI is responsive and accessible (WCAG AA)

**Technical Notes:**
- Data retrieved from UserCompetency table
- Proficiency levels calculated from coverage percentage
- Gap analysis results from latest exam

**Related Functional Requirements:**
- FR 5.3.9 (Updated Profile Delivery)
- FR 5.5.2 (Skills Profile Data Provision)

---

## Trainer User Stories

### US-2: Upload Custom Skills CSV

**As a** trainer,  
**I want to** upload a CSV file with custom skills and competencies  
**So that** I can import domain-specific taxonomies for my training programs.

**Priority:** High  
**Story Points:** 8  
**Flow:** FLOW 6

**Acceptance Criteria:**
- ✅ Upload button visible only to trainers (role-based access)
- ✅ CSV file validated for security (SQL injection, prompt injection)
- ✅ Skills normalized and merged into taxonomy
- ✅ L1 skills updated with MGS count
- ✅ Success message displayed after successful import
- ✅ Error message displayed if import fails
- ✅ File format validation (CSV structure, required columns)

**Technical Notes:**
- Role check: employee_type = "trainer"
- Security validation before processing
- AI normalization applied to imported data
- Taxonomy merge with duplicate detection

**Related Functional Requirements:**
- FR 5.2.4 (Trainer Custom Taxonomy Import)
- FR 5.5.7 (Frontend Display & Access Control)

---

### US-15: CSV Security Validation

**As a** trainer,  
**I want** my uploaded CSV file to be validated for security threats  
**So that** the system is protected from injection attacks.

**Priority:** Critical  
**Story Points:** 5  
**Flow:** FLOW 6

**Acceptance Criteria:**
- ✅ File checked for SQL injection patterns
- ✅ File checked for prompt injection patterns
- ✅ Security alerts triggered if threats detected
- ✅ File rejected if unsafe
- ✅ Admin notification sent on security threat detection
- ✅ Log entry created for security events

**Technical Notes:**
- Validation happens before file parsing
- Pattern matching for common injection attacks
- Security logging required

**Related Functional Requirements:**
- FR 5.2.4 (Trainer Custom Taxonomy Import)

---

## Directory Microservice User Stories

### US-3: Send New User Data

**As** Directory MS,  
**I want to** send new user data to Skills Engine  
**So that** user profiles can be initialized and skill extraction can begin.

**Priority:** High  
**Story Points:** 8  
**Flow:** FLOW 2

**Acceptance Criteria:**
- ✅ User data validated and stored
- ✅ Raw data stored for AI processing
- ✅ Initial profile returned with unverified skills
- ✅ Relevance score calculated and sent
- ✅ Asynchronous event handling
- ✅ Error handling for invalid data

**Technical Notes:**
- Event: User Joined/Created from Directory MS
- Data includes: user_id, company_id, employee_type, career path, raw external data
- AI extraction triggered automatically

**Related Functional Requirements:**
- FR 5.3.1 (Profile Initialization)
- FR 5.3.2 (AI-Based Skill Extraction & Normalization)
- FR 5.3.3 (Initial Status)

---

### US-4: Receive Updated User Profiles

**As** Directory MS,  
**I want to** receive updated user profiles after skill verification  
**So that** I can display current skill status to users.

**Priority:** High  
**Story Points:** 5  
**Flow:** FLOW 3, FLOW 4

**Acceptance Criteria:**
- ✅ Receives updated competencies list
- ✅ Gets proficiency levels per competency
- ✅ Receives L1 skills owned by user
- ✅ Gets relevance score for career path
- ✅ Data format matches API contract
- ✅ Updates triggered automatically after verification

**Technical Notes:**
- Asynchronous update sent to Directory MS
- Data structure includes all required fields
- Update sent after Baseline and Post-course exams

**Related Functional Requirements:**
- FR 5.3.8 (Directory Update after Baseline)
- FR 5.3.9 (Updated Profile Delivery)

---

## Assessment Microservice User Stories

### US-5: Receive Required MGS for Baseline Exam

**As** Assessment MS,  
**I want to** receive required MGS for baseline exam  
**So that** I can create the Primary Assignment test for new users.

**Priority:** High  
**Story Points:** 5  
**Flow:** FLOW 2

**Acceptance Criteria:**
- ✅ Receives complete aggregated MGS set
- ✅ MGS list includes all required skills for user's competencies
- ✅ Data format is structured and complete
- ✅ Includes skill names and IDs
- ✅ Response time < 500ms

**Technical Notes:**
- MGS aggregation from user's competencies
- Includes nested competency MGS
- Sent after profile initialization

**Related Functional Requirements:**
- FR 5.3.4 (Primary Assignment Verification Request)

---

### US-6: Send Exam Results

**As** Assessment MS,  
**I want to** send exam results to Skills Engine  
**So that** user skills can be verified and profiles updated.

**Priority:** High  
**Story Points:** 8  
**Flow:** FLOW 3, FLOW 4

**Acceptance Criteria:**
- ✅ Sends user_id, exam type, status
- ✅ Includes list of MGS with pass/fail status
- ✅ Results trigger automatic gap analysis
- ✅ Profile updates calculated and sent to Directory
- ✅ Supports both Baseline and Post-course exams
- ✅ Handles multiple exam attempts

**Technical Notes:**
- Asynchronous event: Exam Results Received
- Data includes: user_id, exam_type, exam_status, MGS list with pass/fail
- Triggers verification workflow and gap analysis

**Related Functional Requirements:**
- FR 5.3.5 (Granular Verification)
- FR 5.3.6 (Post-course Exam Handling)
- FR 5.5.3 (Automated Trigger)

---

## Course Builder Microservice User Stories

### US-7: Retrieve MGS with Discovery

**As** Course Builder MS,  
**I want to** retrieve MGS for a competency  
**So that** I can map courses to required skills, with automatic discovery of missing skills.

**Priority:** High  
**Story Points:** 8  
**Flow:** FLOW 5

**Acceptance Criteria:**
- ✅ Receives complete MGS list for competency
- ✅ Missing skills discovered and imported automatically
- ✅ AI normalization applied
- ✅ Returns updated taxonomy data
- ✅ Response includes skill hierarchy
- ✅ Handles competency not found scenario

**Technical Notes:**
- Synchronous API request
- External discovery allowed for Course Builder
- AI normalization and fuzzy matching applied
- New skills stored in taxonomy

**Related Functional Requirements:**
- FR 5.6.1 (Granular Skill Retrieval - Course Builder)
- FR 5.2.3 (On-Demand Skill Discovery)

---

## Content Studio Microservice User Stories

### US-8: Retrieve MGS from Database Only

**As** Content Studio MS,  
**I want to** retrieve MGS for a competency from existing database only  
**So that** I can organize lesson content without altering the taxonomy.

**Priority:** High  
**Story Points:** 3  
**Flow:** FLOW 5

**Acceptance Criteria:**
- ✅ Receives MGS from internal database only
- ✅ No external discovery triggered
- ✅ Fast lookup response (< 200ms)
- ✅ Data format matches requirements
- ✅ Returns empty list if competency not found

**Technical Notes:**
- Synchronous API request
- Lookup only - no external discovery
- Fast response time required

**Related Functional Requirements:**
- FR 5.6.2 (Granular Skill Retrieval - Content Studio / Learner AI)

---

## Learner AI Microservice User Stories

### US-9: Receive Gap Analysis Results

**As** Learner AI MS,  
**I want to** receive gap analysis results with missing skills  
**So that** I can build personalized learning plans and recommend courses.

**Priority:** High  
**Story Points:** 5  
**Flow:** FLOW 3, FLOW 4

**Acceptance Criteria:**
- ✅ Receives structured gap analysis (MAP format)
- ✅ Gets missing MGS list per competency
- ✅ Includes exam status and course info
- ✅ Data triggers learning plan generation
- ✅ Supports both Broad and Narrow gap analysis
- ✅ Includes relevance information

**Technical Notes:**
- Asynchronous event: Gap Analysis Complete
- MAP format: Competency ID → missing MGS list
- Includes exam status (Pass/Fail) and course information

**Related Functional Requirements:**
- FR 5.5.4 (Conditional Gap Analysis Logic)
- FR 5.5.5 (Definitive Gap Calculation)
- FR 5.5.6 (Gap Analysis Data Sent)

---

### US-10: Retrieve MGS for Learning Plans

**As** Learner AI MS,  
**I want to** retrieve MGS for competencies from existing database  
**So that** I can query skills related to competencies for learning plan building.

**Priority:** Medium  
**Story Points:** 3  
**Flow:** FLOW 5

**Acceptance Criteria:**
- ✅ Receives MGS from internal database only
- ✅ No external discovery triggered
- ✅ Fast lookup response (< 200ms)
- ✅ Returns skill hierarchy information

**Technical Notes:**
- Synchronous API request
- Lookup only - no external discovery
- Used for building learning recommendations

**Related Functional Requirements:**
- FR 5.6.2 (Granular Skill Retrieval - Content Studio / Learner AI)

---

## Learning Analytics Microservice User Stories

### US-11: Retrieve User Profiles and Team Data

**As** Learning Analytics MS,  
**I want to** retrieve verified user profiles and aggregated team competency status  
**So that** I can generate reports and insights.

**Priority:** High  
**Story Points:** 8  
**Flow:** FLOW 7

**Acceptance Criteria:**
- ✅ Access to individual verified profiles
- ✅ Gets proficiency levels and coverage percentages
- ✅ Receives aggregate team competency data
- ✅ Data is pre-calculated and accurate
- ✅ Supports filtering and querying
- ✅ Response time appropriate for data volume

**Technical Notes:**
- Synchronous API request
- Individual profiles and aggregate data
- Pre-calculated for performance
- Supports reporting and analytics

**Related Functional Requirements:**
- FR 5.5.1 (User/Team Data Retrieval)

---

## RAG/Chatbot Microservice User Stories

### US-12: Receive Taxonomy and User Profiles

**As** RAG MS,  
**I want to** receive canonical taxonomy structure and verified user profiles  
**So that** I can provide skill-aware guidance and recommendations.

**Priority:** Medium  
**Story Points:** 5  
**Flow:** FLOW 7

**Acceptance Criteria:**
- ✅ Receives taxonomy structure
- ✅ Gets verified user profiles with proficiency levels
- ✅ Data format supports RAG context
- ✅ Secure data sharing
- ✅ Regular updates when taxonomy changes

**Technical Notes:**
- Secure API endpoint for RAG integration
- Taxonomy structure for context
- User profiles for personalized responses

**Related Functional Requirements:**
- Integration with RAG/Chatbot MS

---

## System User Stories

### US-13: Initialize Taxonomy from External Sources

**As** the system,  
**I want to** initialize the taxonomy from external sources using AI extraction  
**So that** I can build the canonical skill database.

**Priority:** High  
**Story Points:** 13  
**Flow:** FLOW 1

**Acceptance Criteria:**
- ✅ External sources identified and validated
- ✅ AI extraction processes all sources
- ✅ Data verified for quality
- ✅ Normalization prevents duplicates
- ✅ Hierarchy constructed with MGS counts
- ✅ Periodic synchronization for net-new skills
- ✅ Error handling and retry logic

**Technical Notes:**
- Triggered on system initialization
- Uses AI-1 (Source Discovery) and AI-2 (Deep Web Scanning)
- Quality validation before storage
- Periodic sync on system activation

**Related Functional Requirements:**
- FR 5.2.1 (Initial Import)
- FR 5.2.5 (Taxonomy Periodic Synchronization)

---

### US-14: Automatically Trigger Gap Analysis

**As** the system,  
**I want to** automatically trigger gap analysis after exam results  
**So that** users always have current gap information.

**Priority:** High  
**Story Points:** 8  
**Flow:** FLOW 3, FLOW 4

**Acceptance Criteria:**
- ✅ Gap analysis triggered automatically
- ✅ Conditional logic applied (Baseline vs Post-course, Pass vs Fail)
- ✅ Results sent to Learner AI
- ✅ Profile updated in Directory
- ✅ No manual intervention required
- ✅ Error handling if gap analysis fails

**Technical Notes:**
- Triggered by exam results event
- Conditional logic:
  - Baseline → Broad Gap Analysis
  - Post-course PASS → Broad Gap Analysis
  - Post-course FAIL → Narrow Gap Analysis
- Automatic workflow execution

**Related Functional Requirements:**
- FR 5.5.3 (Automated Trigger)
- FR 5.5.4 (Conditional Gap Analysis Logic)

---

## User Story Summary

| User Type | Story Count | Total Story Points |
|-----------|------------|-------------------|
| Employee | 1 | 5 |
| Trainer | 2 | 13 |
| Directory MS | 2 | 13 |
| Assessment MS | 2 | 13 |
| Course Builder MS | 1 | 8 |
| Content Studio MS | 1 | 3 |
| Learner AI MS | 2 | 8 |
| Learning Analytics MS | 1 | 8 |
| RAG/Chatbot MS | 1 | 5 |
| System | 2 | 21 |
| **Total** | **15** | **96** |

---

## User Story Mapping to Flows

| Flow | User Stories | Description |
|------|--------------|-------------|
| FLOW 1 | US-13 | Taxonomy Initialization and Construction |
| FLOW 2 | US-1, US-3, US-5 | User Profile Creation and Primary Verification |
| FLOW 3 | US-1, US-4, US-6, US-9, US-14 | Baseline Exam Results Processing |
| FLOW 4 | US-1, US-4, US-6, US-9, US-14 | Post-Course Exam and Conditional Gap Analysis |
| FLOW 5 | US-7, US-8, US-10 | On-Demand Skill Retrieval and Discovery |
| FLOW 6 | US-2, US-15 | Trainer Skill Upload Flow |
| FLOW 7 | US-11, US-12 | Learning Analytics Data Provision & RAG Integration |

---

## Definition of Done

A user story is considered "Done" when:

1. ✅ All acceptance criteria are met
2. ✅ Code is written and reviewed
3. ✅ Unit tests are written and passing
4. ✅ Integration tests are written and passing
5. ✅ API documentation is updated (if applicable)
6. ✅ UI/UX is implemented and tested (if applicable)
7. ✅ Security requirements are met
8. ✅ Performance requirements are met
9. ✅ Code is deployed to staging environment
10. ✅ Product Owner has accepted the story

---

**Document Generated:** 2025-01-27  
**Last Updated:** 2025-01-27



