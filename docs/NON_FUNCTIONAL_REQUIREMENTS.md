# Skills Engine - Non-Functional Requirements

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27

---

## 📋 Table of Contents

1. [Performance Requirements](#1-performance-requirements)
2. [Scalability Requirements](#2-scalability-requirements)
3. [Security & Audit Requirements](#3-security--audit-requirements)
4. [Data Trust Priority](#4-data-trust-priority)

---

## 1. Performance Requirements

### NFR-6.1: Gap Analysis Performance
- **Requirement:** Gap Analysis must complete in **< 1 second**
- **Scope:** Both Narrow Gap Analysis and Broad Gap Analysis
- **Measurement:** End-to-end processing time from request to structured map generation
- **Target:** 95th percentile response time < 1 second

**Related Functional Requirements:**
- FR-4.1 (Recurrent Traversal)
- FR-4.2 (Comparison Against User Profile)
- FR-4.3 (Aggregation and Mapping)
- FR-4.4 (Narrow Gap Analysis)
- FR-4.5 (Broad Gap Analysis)

**Implementation Considerations:**
- Optimize recursive traversal algorithms
- Implement efficient database queries with proper indexing
- Consider caching for frequently accessed skill hierarchies
- Optimize JSON field queries for verifiedSkills

---

## 2. Scalability Requirements

### NFR-6.2: User Profile Scalability
- **Requirement:** Must handle a minimum of **100,000 active user profiles**
- **Scope:** System must support concurrent operations on 100,000+ user profiles
- **Operations Include:**
  - Profile creation and initialization
  - Profile updates (skill verification)
  - Gap analysis calculations
  - API queries and data retrieval

**Related Functional Requirements:**
- FR-2.3 (Profile Building)
- FR-3.2 (Update Verified Skills)
- FR-4.1 through FR-4.5 (Gap Analysis)
- FR-9.1 (Learning Analytics User Data Retrieval)

**Implementation Considerations:**
- Database indexing on user_id, competency_id, skill_id
- Efficient JSON field queries for verifiedSkills
- Horizontal scaling capabilities
- Connection pooling for database access
- Caching strategies for frequently accessed data

---

## 3. Security & Audit Requirements

### NFR-6.3: Audit Trail for Profile Verification Updates
- **Requirement:** Must maintain an audit trail logging the source, time, and actor for all profile verification updates
- **Scope:** All updates to `verifiedSkills` (JSON) field in `userCompetency` table

**Required Audit Information:**
- **Source:** Where the update came from (e.g., "Assessment Service - Baseline Exam", "Assessment Service - Course Exam", "Manual Entry")
- **Time:** Timestamp of the update (ISO 8601 format)
- **Actor:** Who or what triggered the update (e.g., "Assessment Service", "System Admin", "User ID: xxx")
- **Action:** What changed (e.g., "MGS verified=true", "Competency level updated to ADVANCED")
- **Previous State:** Previous verification status (for rollback capability)

**Audit Log Structure:**
```json
{
  "timestamp": "2025-01-27T12:00:00Z",
  "source": "Assessment Service - Baseline Exam",
  "actor": "Assessment Service (MS #5)",
  "user_id": "uuid",
  "action": "MGS verification update",
  "skill_id": "uuid",
  "competency_id": "uuid",
  "previous_status": "verified=false",
  "new_status": "verified=true",
  "exam_type": "Baseline"
}
```

**Related Functional Requirements:**
- FR-3.2 (Update Verified Skills)
- FR-3.11 (Update Profile - Course Exam)
- FR-3.2.5 (Update last_evaluate timestamp)

**Implementation Considerations:**
- Dedicated audit_log table or collection
- Immutable audit records (append-only)
- Secure storage of audit logs
- Compliance with data retention policies
- Query capabilities for audit trail analysis

---

## 4. Data Trust Priority

### NFR-6.4: Verification Data Priority Order
- **Requirement:** Verification data must prioritize in the following order:
  1. **Assessment Scores (Highest Priority)**
  2. **Certifications**
  3. **User Claims/AI Extractions (Lowest Priority)**

**Priority Rules:**
- When multiple sources provide verification for the same skill:
  - Assessment Scores always take precedence
  - If no Assessment Score exists, use Certification
  - If neither Assessment Score nor Certification exists, use User Claims/AI Extractions
- Once an Assessment Score verifies a skill, it cannot be overridden by lower-priority sources
- Lower-priority sources can be used to initialize skills but are replaced when higher-priority data becomes available

**Implementation Logic:**
```
IF Assessment Score exists:
    Use Assessment Score (verified=true/false based on PASS/FAIL)
ELSE IF Certification exists:
    Use Certification (verified=true)
ELSE IF User Claim/AI Extraction exists:
    Use User Claim/AI Extraction (verified=false initially)
ELSE:
    Skill not in profile
```

**Related Functional Requirements:**
- FR-2.2 (Skills & Competencies Extraction from raw data)
- FR-3.2 (Update Verified Skills from Assessment)
- FR-3.11 (Update Profile from Course Exam)

**Implementation Considerations:**
- Store verification source in user profile
- Implement priority comparison logic
- Handle conflicts when higher-priority data arrives
- Maintain audit trail of priority-based decisions

---

## 📊 Summary Matrix

| NFR ID | Category | Requirement | Target/Threshold |
|--------|----------|-------------|------------------|
| NFR-6.1 | Performance | Gap Analysis completion time | < 1 second |
| NFR-6.2 | Scalability | Active user profiles | 100,000+ |
| NFR-6.3 | Security & Audit | Audit trail for verification updates | Complete (source, time, actor) |
| NFR-6.4 | Data Trust | Verification priority order | Assessment > Certification > Claims/AI |

---

## 🔗 Related Documents

- [Functional Requirements](./FUNCTIONAL_REQUIREMENTS.md)
- [User Stories & Business Logic](./USER_STORIES_AND_BUSINESS_LOGIC.md)
- [Project Definition Summary](../step_1_project_definition_summary.md)

---

**Last Updated:** 2025-01-27

