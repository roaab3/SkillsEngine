# Step 4 - Technical Design

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27  
**Phase:** Step 4 - Technical Design

---

## 📋 Table of Contents

1. [Database Schema](#1-database-schema)
2. [API Endpoints Design](#2-api-endpoints-design)
3. [Component Architecture](#3-component-architecture)
4. [Data Access Layer](#4-data-access-layer)
5. [Algorithms & Queries](#5-algorithms--queries)
6. [Security Implementation](#6-security-implementation)
7. [Integration Patterns](#7-integration-patterns)
8. [Performance Optimization](#8-performance-optimization)
9. [Error Handling & Logging](#9-error-handling--logging)

---

## 1. Database Schema

### 1.1 Overview
Detailed database schema design for Skills Engine microservice, including all tables, relationships, indexes, and constraints.

### 1.1.1 Hash Index Strategy

**Hash Function Selection Based on Data Type:**

1. **For String Keys (VARCHAR, TEXT):**
   - Use **Polynomial Rolling Hash**:
     ```
     h(s) = (s[0]*p^0 + s[1]*p^1 + ... + s[n-1]*p^(n-1)) mod M
     ```
     - `p = 31` (for lowercase/normal text) or `53` (for mixed-case)
     - `M = 1,000,000,009` (large prime)
     - Hash computed on UTF-8 code units
     - Apply normalization (trim + lowercase) before hashing

2. **For Numeric Keys (INT, BIGINT):**
   - Use **Multiplication Hash (Knuth Multiplicative Method)**:
     ```
     h(k) = floor(m * ((k * A) mod 1))
     ```
     - `A = 0.6180339887` (Knuth's constant)
     - `m = table size or slot count`

**Note:** All indexed keys in this schema are VARCHAR (string type), so all hash indexes use Polynomial Rolling Hash.

---

### 1.2 Core Tables

#### 1.2.1 `skills` Table
**Purpose:** Stores all skills in the hierarchical taxonomy

**Schema:**
```sql
CREATE TABLE skills (
    skill_id VARCHAR(255) PRIMARY KEY,
    skill_name VARCHAR(500) NOT NULL,
    parent_skill_id VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    INDEX idx_parent_skill (parent_skill_id),
    INDEX idx_skill_id_hash (POLYNOMIAL_HASH(LOWER(TRIM(skill_id)))),
    INDEX idx_skill_name_hash (POLYNOMIAL_HASH(LOWER(TRIM(skill_name))))
);
```

**Notes:**
- `parent_skill_id` creates hierarchical relationships
- Self-referencing foreign key for parent-child relationships
- Hash indexes on `skill_id` and `skill_name` use **Polynomial Rolling Hash** (string keys: p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing
- Level (L1, L2, L3, L4/MGS) is determined by hierarchy depth, not stored as a field

---

#### 1.2.2 `competencies` Table
**Purpose:** Stores all competencies

**Schema:**
```sql
CREATE TABLE competencies (
    competency_id VARCHAR(255) PRIMARY KEY,
    competency_name VARCHAR(500) NOT NULL,
    description TEXT,
    parent_competency_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE,
    INDEX idx_parent_competency (parent_competency_id),
    INDEX idx_competency_id ON competencies (competency_id),
    INDEX idx_competency_name ON competencies (competency_name)
);
```

**Notes:**
- Supports nested competencies (sub-competencies)
- Self-referencing foreign key for parent-child relationships
- B-TREE index on `competency_id` for ordered queries, comparisons, and sorting (B+Tree optimized for range queries AND equality)
- B-TREE index on `competency_name` for LIKE searches, sorting, and partial matching (B+Tree supports lexicographical operations and ORDER BY)

---

#### 1.2.3 `competency_skill` Table
**Purpose:** Junction table linking competencies to their required L1 skills

**Schema:**
```sql
CREATE TABLE competency_skill (
    competency_id VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (competency_id, skill_id),
    FOREIGN KEY (competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    INDEX idx_skill (skill_id),
    INDEX idx_competency_id_hash (POLYNOMIAL_HASH(LOWER(TRIM(competency_id))))
);
```

**Notes:**
- Links competencies to L1 skills only
- MGS are retrieved via recursive traversal through skill hierarchy
- Hash index on `competency_id` uses **Polynomial Rolling Hash** (string key: p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

#### 1.2.4 `skill_subSkill` Table
**Purpose:** Junction table for skill hierarchy (parent-child relationships)

**Schema:**
```sql
CREATE TABLE skill_subSkill (
    parent_skill_id VARCHAR(255) NOT NULL,
    child_skill_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (parent_skill_id, child_skill_id),
    FOREIGN KEY (parent_skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    FOREIGN KEY (child_skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    INDEX idx_parent_skill_id_hash (POLYNOMIAL_HASH(LOWER(TRIM(parent_skill_id)))),
    INDEX idx_child_skill_id_hash (POLYNOMIAL_HASH(LOWER(TRIM(child_skill_id))))
);
```

**Notes:**
- Represents hierarchical relationships between skills
- Used for recursive traversal to find MGS
- Hash indexes on `parent_skill_id` and `child_skill_id` use **Polynomial Rolling Hash** (string keys: p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

#### 1.2.5 `competency_subCompetency` Table
**Purpose:** Junction table for nested competencies (sub-competencies)

**Schema:**
```sql
CREATE TABLE competency_subCompetency (
    parent_competency_id VARCHAR(255) NOT NULL,
    child_competency_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (parent_competency_id, child_competency_id),
    FOREIGN KEY (parent_competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE,
    FOREIGN KEY (child_competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE,
    INDEX idx_parent (parent_competency_id),
    INDEX idx_child (child_competency_id)
);
```

**Notes:**
- Supports nested competency structures
- Used for recursive traversal when building competency hierarchies

---

#### 1.2.6 `users` Table
**Purpose:** Stores basic user information

**Schema:**
```sql
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    employee_type VARCHAR(100),
    path_career VARCHAR(500), -- Career Path Goal
    raw_data TEXT, -- JSON or text from LinkedIn, GitHub, resume
    relevance_score DECIMAL(5,2) DEFAULT 0.00, -- 0.00 to 100.00
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id_hash (POLYNOMIAL_HASH(LOWER(TRIM(user_id))))
);
```

**Notes:**
- `relevance_score` stored at user level (0.00 to 100.00)
- `path_career` stores Career Path Goal for gap analysis
- `raw_data` stores unstructured data from external sources
- Hash index on `user_id` uses **Polynomial Rolling Hash** (string key: p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

#### 1.2.7 `userCompetency` Table
**Purpose:** Stores user competency profiles with verification status

**Schema:**
```sql
CREATE TABLE userCompetency (
    user_id VARCHAR(255) NOT NULL,
    competency_id VARCHAR(255) NOT NULL,
    coverage_percentage DECIMAL(5,2) DEFAULT 0.00, -- 0.00 to 100.00
    proficiency_level VARCHAR(50), -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    verifiedSkills JSON, -- Array of verified skills: [{"skill_id": "...", "skill_name": "...", "verified": true, "lastUpdate": "..."}]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, competency_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (competency_id) REFERENCES competencies(competency_id) ON DELETE CASCADE,
    INDEX idx_usercompetency_user_hash (POLYNOMIAL_HASH(LOWER(TRIM(user_id)))),
    INDEX idx_usercompetency_competency_hash (POLYNOMIAL_HASH(LOWER(TRIM(competency_id))))
);
```

**Notes:**
- `verifiedSkills` JSON structure:
  ```json
  [
    {
      "skill_id": "skill_123",
      "skill_name": "Python Programming",
      "verified": true,
      "lastUpdate": "2025-01-27T10:00:00Z"
    }
  ]
  ```
- `coverage_percentage` calculated based on verified MGS vs required MGS
- `proficiency_level` mapped from coverage percentage
- Hash indexes on `user_id` and `competency_id` use **Polynomial Rolling Hash** (string keys: p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

#### 1.2.8 `userSkill` Table
**Purpose:** Stores individual user skills (optional, for detailed tracking)

**Schema:**
```sql
CREATE TABLE userSkill (
    user_id VARCHAR(255) NOT NULL,
    skill_id VARCHAR(255) NOT NULL,
    skill_name VARCHAR(500) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    source VARCHAR(100), -- 'assessment', 'certification', 'claim', 'ai'
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    INDEX idx_userskill_user_hash (POLYNOMIAL_HASH(LOWER(TRIM(user_id)))),
    INDEX idx_userskill_skill_hash (POLYNOMIAL_HASH(LOWER(TRIM(skill_id)))),

);
```

**Notes:**
- Optional table for detailed skill-level tracking
- Can be used for analytics and reporting
- Hash indexes on `user_id` and `skill_id` use **Polynomial Rolling Hash** (string keys: p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

#### 1.2.9 `official_sources` Table
**Purpose:** Stores official sources discovered by AI for taxonomy building

**Schema:**
```sql
CREATE TABLE official_sources (
    source_id VARCHAR(255) PRIMARY KEY,
    source_name VARCHAR(500) NOT NULL,
    reference_index_url VARCHAR(1000) NOT NULL,
    reference_type VARCHAR(100), -- 'API', 'Documentation', 'Standard', etc.
    access_method VARCHAR(100), -- 'web_scraping', 'api', etc.
    hierarchy_support BOOLEAN DEFAULT FALSE,
    provides TEXT, -- What the source provides
    topics_covered TEXT, -- Topics covered by this source
    skill_focus TEXT, -- Skills focus area
    notes TEXT,
    last_checked TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reference_type (reference_type),
    INDEX idx_last_checked (last_checked)
);
```

**Notes:**
- Maintains persistent list of all official sources
- Supports periodic re-checking of sources
- Tracks which sources have been used for data extraction

---

### 1.3 Relationships Diagram

```
users
  ├── userCompetency (1:N)
  │     └── competencies (N:1)
  │           ├── competency_skill (1:N)
  │           │     └── skills (N:1)
  │           └── competency_subCompetency (self-referencing)
  └── userSkill (1:N)
        └── skills (N:1)
              └── skill_subSkill (self-referencing)

official_sources (standalone)
```

---

### 1.3.1 Database Views

#### `competency_leaf_skills` View
**Purpose:** Efficiently retrieve leaf skills (MGS - Most Granular Skills) for each competency. This view eliminates the need for recursive queries when fetching MGS for competencies.

**Definition:**
```sql
CREATE VIEW competency_leaf_skills AS
SELECT 
    c.competency_id,
    c.competency_name,
    s.skill_id,
    s.skill_name
FROM competency_skill cs
JOIN competencies c ON cs.competency_id = c.competency_id
JOIN skills s ON cs.skill_id = s.skill_id
LEFT JOIN skill_subSkill ss 
    ON s.skill_id = ss.parent_skill_id
WHERE ss.parent_skill_id IS NULL;
```

**Columns:**
- `competency_id` - ID of the competency
- `competency_name` - Name of the competency
- `skill_id` - ID of the leaf skill (MGS)
- `skill_name` - Name of the leaf skill (MGS)

**Logic:**
- Joins `competency_skill` to map competencies to their L1 skills
- Joins `competencies` to get competency names
- Joins `skills` to get skill names
- Uses LEFT JOIN on `skill_subSkill` to identify skills with no children (leaf skills)
- Filters WHERE `ss.parent_skill_id IS NULL` to return only leaf skills

**Usage Examples:**
```sql
-- Get all leaf skills for a specific competency by ID
SELECT * FROM competency_leaf_skills 
WHERE competency_id = 'comp_123';

-- Get all leaf skills for a specific competency by name
SELECT * FROM competency_leaf_skills 
WHERE competency_name = 'Full Stack Development';

-- Get count of leaf skills per competency
SELECT competency_id, competency_name, COUNT(*) as mgs_count
FROM competency_leaf_skills
GROUP BY competency_id, competency_name;
```

**Performance Benefits:**
- Eliminates need for recursive CTE queries when fetching MGS
- Pre-computed join reduces query complexity
- Can be indexed for faster lookups
- Reusable across multiple features (Feature 10, Feature 17, Feature 20, Feature 21, etc.)

**Notes:**
- This view returns MGS (Most Granular Skills) which are leaf nodes in the skill hierarchy
- Leaf skills are identified by checking if they have no children in `skill_subSkill` table
- The view supports efficient querying by both `competency_id` and `competency_name`
- Used by features that need to retrieve MGS for competencies (Baseline Exam preparation, Gap Analysis, etc.)

---

### 1.4 Indexes Strategy

**Performance Indexes:**
- All foreign keys are indexed
- Frequently queried fields (user_id, competency_id, skill_id) are indexed
- Composite indexes for common query patterns:
  - `(user_id, competency_id)` on `userCompetency`
  - `(parent_skill_id, child_skill_id)` on `skill_subSkill`
  - `(competency_id, skill_id)` on `competency_skill`

**Hash Indexes (Polynomial Rolling Hash):**
All hash indexes use **Polynomial Rolling Hash** with:
- `p = 31` (for lowercase/normal text)
- `M = 1,000,000,009` (large prime)
- Normalization: `LOWER(TRIM())` applied before hashing
- Hash computed on UTF-8 code units

**Hash Index Locations:**
- `skills`: `skill_id`, `skill_name`
- `competency_skill`: `competency_id`
- `skill_subSkill`: `parent_skill_id`, `child_skill_id`
- `users`: `user_id`
- `userCompetency`: `user_id`, `competency_id`
- `userSkill`: `user_id`, `skill_id`

**Query Optimization:**
- Hash indexes provide O(1) average lookup time for exact matches
- B-TREE indexes on `competency_id` and `competency_name` for range queries and LIKE searches
- MGS filtering is done by checking if skill has no children (leaf nodes), not by level field

---

## 2. API Endpoints Design

### 2.1 Overview
RESTful API design for Skills Engine microservice, including all endpoints, request/response formats, authentication, and error handling.

### 2.2 Base URL
```
https://api.educora.ai/skills-engine
```

### 2.3 Authentication
All endpoints use Unified Data Exchange Endpoint for microservice-to-microservice communication.
No separate authentication tokens are required - authentication is handled by the Unified Data Exchange Endpoint.

---

### 2.4 Endpoints

#### 2.4.1 User Profile Endpoints

**POST /api/users**
- **Purpose:** Create new user profile
- **Request Body:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "company_id": "company_456",
    "employee_type": "employee",
    "path_career": "Full Stack Developer",
    "raw_data": "LinkedIn profile data..."
  }
  ```
- **Response:** 201 Created
  ```json
  {
    "user_id": "user_123",
    "status": "created",
    "profile_url": "https://skills-engine.educora.ai/profile/user_123"
  }
  ```

---

**GET /api/users/:user_id/profile**
- **Purpose:** Retrieve user profile
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "company_id": "company_456",
    "competencies": [
      {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "l1_skills": [
          {
            "skill_id": "skill_123",
            "skill_name": "Frontend Development"
          }
        ],
        "coverage_percentage": 75.50,
        "proficiency_level": "ADVANCED"
      }
    ],
    "relevance_score": 85.25,
    "secure_profile_url": "https://skills-engine.educora.ai/profile/user_123"
  }
  ```

---

#### 2.4.2 Webhook Endpoints (Incoming)

**POST /api/webhooks/user-creation**
- **Purpose:** Receive user creation event from Directory microservice (asynchronous)
- **Method:** POST (asynchronous webhook)
- **Request Body:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "company_id": "company_456",
    "employee_type": "employee",
    "path_career": "Full Stack Developer",
    "raw_data": "LinkedIn profile data..."
  }
  ```
- **Response:** 202 Accepted (asynchronous processing)
  ```json
  {
    "status": "received",
    "user_id": "user_123",
    "message": "User creation event queued for processing"
  }
  ```
- **Note:** Triggers Feature 5 (Receive User Creation Request) which creates user record first, then triggers profile creation

---

**POST /api/webhooks/assessment-results**
- **Purpose:** Receive assessment results from Assessment microservice (asynchronous webhook)
- **Method:** POST (asynchronous webhook)
- **Request Body (Baseline Exam):**
  ```json
  {
    "exam_type": "baseline",
    "exam_status": "PASS",
    "user_id": "user_123",
    "user_name": "John Doe",
    "skills": [
      {
        "skill_id": "skill_123",
        "skill_name": "React Hooks",
        "status": "PASS"
      }
    ]
  }
  ```
- **Request Body (Post-Course Exam):**
  ```json
  {
    "exam_type": "post_course",
    "exam_status": "FAIL",
    "user_id": "user_123",
    "user_name": "John Doe",
    "course_name": "Advanced React",
    "skills": [
      {
        "skill_id": "skill_123",
        "skill_name": "React Hooks",
        "status": "PASS"
      }
    ]
  }
  ```
- **Response:** 202 Accepted (asynchronous processing)
  ```json
  {
    "status": "received",
    "exam_type": "baseline",
    "user_id": "user_123",
    "message": "Assessment results queued for processing"
  }
  ```
- **Note:** Handles both baseline and post-course exam results. Routes to Feature 44 (Baseline) or Feature 46 (Post-Course) for processing

---

#### 2.4.3 Assessment Integration Endpoints

**POST /api/assessment/results**
- **Purpose:** Receive assessment results and update user profile (alternative synchronous endpoint)
- **Request Body:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "exam_type": "baseline", // or "post_course"
    "exam_status": "PASS", // or "FAIL"
    "course_name": "Advanced React", // only for post_course
    "skills": [
      {
        "skill_id": "skill_123",
        "skill_name": "React Hooks",
        "status": "PASS" // or "FAIL"
      }
    ]
  }
  ```
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "status": "updated",
    "verified_skills_count": 5,
    "profile_updated": true
  }
  ```

---

#### 2.4.4 Competency Retrieval Endpoints

**GET /api/competency/:competencyName/skills**
- **Purpose:** Retrieve MGS list for a competency (conditional logic based on calling service)
- **Query Parameters:**
  - `service`: Calling microservice name (course_builder, content_studio, learner_ai)
- **Response:** 200 OK
  ```json
  {
    "competency_id": "comp_123",
    "competency_name": "Full Stack Development",
    "mgs": [
      {
        "skill_id": "skill_456",
        "skill_name": "React Hooks"
      }
    ]
  }
  ```
- **Error Responses:**
  - 401 Unauthorized: Request not authenticated by Unified Data Exchange Endpoint
  - 404 Not Found: Competency not found (Content Studio/Learner AI path only)

---

#### 2.4.5 Gap Analysis Endpoints

**POST /api/gap-analysis/narrow**
- **Purpose:** Perform narrow gap analysis for a specific course
- **Request Body:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "course_name": "Advanced React",
    "exam_status": "FAIL"
  }
  ```
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "course_name": "Advanced React",
    "exam_status": "FAIL",
    "company": "company_456",
    "missing_skills_map": {
      "comp_123": {
        "competency_id": "comp_123",
        "competency_name": "Frontend Development",
        "missing_mgs": [
          {
            "skill_id": "skill_789",
            "skill_name": "React Context API"
          }
        ]
      }
    }
  }
  ```

---

**POST /api/gap-analysis/broad**
- **Purpose:** Perform broad gap analysis for career path
- **Request Body:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "exam_status": "PASS"
  }
  ```
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "exam_status": "PASS",
    "company": "company_456",
    "career_path_goal": "Full Stack Developer",
    "missing_skills_map": {
      "comp_123": {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "missing_mgs": [...]
      }
    }
  }
  ```

---

#### 2.4.6 Directory Integration Endpoints

**GET /api/directory/profile/:user_id**
- **Purpose:** Retrieve user profile for Directory microservice
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "competencies": [
      {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "l1_skills": [...],
        "coverage_percentage": 75.50,
        "proficiency_level": "ADVANCED"
      }
    ],
    "relevance_score": 85.25,
    "secure_profile_url": "https://skills-engine.educora.ai/profile/user_123",
    "timestamp": "2025-01-27T10:00:00Z"
  }
  ```

---

**POST /api/directory/profile/update**
- **Purpose:** Receive updated profile from Directory after exam
- **Request Body:** (Same as GET response)
- **Response:** 200 OK
  ```json
  {
    "status": "received",
    "user_id": "user_123"
  }
  ```

---

#### 2.4.7 Learner AI Integration Endpoints

**POST /api/learner-ai/gap-analysis** (Outgoing - Async)
- **Purpose:** Send gap analysis results to Learner AI microservice asynchronously
- **Method:** POST (asynchronous)
- **Request Body:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "company": "company_456",
    "exam_status": "FAIL",
    "exam_type": "Post-Course",
    "course_name": "Advanced React",
    "missing_skills_map": {
      "comp_123": {
        "competency_id": "comp_123",
        "competency_name": "Frontend Development",
        "missing_mgs": [
          {
            "skill_id": "skill_789",
            "skill_name": "React Context API"
          }
        ]
      }
    },
    "career_path_goal": "Full Stack Developer",
    "timestamp": "2025-01-27T10:00:00Z"
  }
  ```
- **Response:** 202 Accepted (asynchronous, no immediate response)
- **Note:** This is an outgoing endpoint - Skills Engine sends data to Learner AI, not receives

---

#### 2.4.8 Learning Analytics Integration Endpoints

**GET /api/learning-analytics/user/:user_id**
- **Purpose:** Retrieve individual user profile for Learning Analytics
- **Method:** GET
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "relevance_score": 85.25,
    "competencies": [
      {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "coverage_percentage": 75.50,
        "proficiency_level": "ADVANCED",
        "verified_skills_count": 15,
        "total_required_mgs": 20
      }
    ],
    "last_updated": "2025-01-27T10:00:00Z"
  }
  ```

---

**GET /api/learning-analytics/team/:team_id**
- **Purpose:** Retrieve aggregate team competency status for Learning Analytics
- **Method:** GET
- **Response:** 200 OK
  ```json
  {
    "team_id": "team_123",
    "team_name": "Engineering Team",
    "user_count": 10,
    "average_relevance_score": 78.50,
    "competencies": [
      {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "average_coverage_percentage": 72.30,
        "proficiency_distribution": {
          "BEGINNER": 1,
          "INTERMEDIATE": 3,
          "ADVANCED": 4,
          "EXPERT": 2
        },
        "users_with_competency": 8
      }
    ],
    "aggregated_at": "2025-01-27T10:00:00Z"
  }
  ```

---

#### 2.4.9 RAG/Chatbot Integration Endpoints

**GET /api/rag/taxonomy**
- **Purpose:** Retrieve canonical taxonomy data (competencies and skills) for RAG/Chatbot
- **Method:** GET
- **Query Parameters (optional):**
  - `competency_name`: Filter by specific competency
  - `skill_name`: Search for specific skill
- **Response:** 200 OK
  ```json
  {
    "competencies": [
      {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "skills": [
          {
            "skill_id": "skill_123",
            "skill_name": "Frontend Development",
            "subskills": [
              {
                "skill_id": "skill_456",
                "skill_name": "React Hooks"
              }
            ]
          }
        ]
      }
    ]
  }
  ```

---

**GET /api/rag/user/:user_id/profile**
- **Purpose:** Retrieve user profile data for RAG/Chatbot context-aware responses
- **Method:** GET
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "competencies": [
      {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "coverage_percentage": 75.50,
        "proficiency_level": "ADVANCED",
        "verified_skills": [
          {
            "skill_id": "skill_123",
            "skill_name": "React Hooks",
            "verified": true
          }
        ]
      }
    ],
    "relevance_score": 85.25
  }
  ```

---

#### 2.4.10 Frontend Endpoints (Internal Skills Engine UI)

**GET /api/frontend/profile/:user_id**
- **Purpose:** Retrieve user profile data for Skills Engine frontend dashboard (Features 34-39)
- **Method:** GET
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "relevance_score": 85.25,
    "competencies": [
      {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "coverage_percentage": 75.50,
        "proficiency_level": "ADVANCED",
        "l1_skills": [
          {
            "skill_id": "skill_123",
            "skill_name": "Frontend Development"
          }
        ],
        "verified_skills_count": 15,
        "total_required_mgs": 20
      }
    ],
    "missing_skills": {
      "comp_123": [
        {
          "skill_id": "skill_789",
          "skill_name": "React Context API"
        }
      ]
    },
    "last_updated": "2025-01-27T10:00:00Z"
  }
  ```
- **Note:** Used by Features 34-39 (User Profile Dashboard, Competency Cards, Relevance Score, Missing Skills, Verified Skills Drill-Down)

---

**GET /api/frontend/profile/:user_id/detail**
- **Purpose:** Retrieve detailed user profile for expanded Skills Engine profile page (Feature 39)
- **Method:** GET
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "relevance_score": 85.25,
    "competencies": [
      {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "coverage_percentage": 75.50,
        "proficiency_level": "ADVANCED",
        "l1_skills": [
          {
            "skill_id": "skill_123",
            "skill_name": "Frontend Development",
            "verified": true,
            "mgs": [
              {
                "skill_id": "skill_456",
                "skill_name": "React Hooks",
                "verified": true
              }
            ]
          }
        ]
      }
    ],
    "missing_skills": {
      "comp_123": [
        {
          "skill_id": "skill_789",
          "skill_name": "React Context API"
        }
      ]
    }
  }
  ```
- **Note:** Used by Feature 39 (Secure Skills Profile Page) - expanded view accessible via secure URL

---

**GET /api/frontend/gap-analysis/:user_id**
- **Purpose:** Retrieve gap analysis results for frontend display
- **Method:** GET
- **Query Parameters:**
  - `type`: `narrow` or `broad` (optional, defaults to `broad`)
  - `course_name`: Required if type is `narrow`
- **Response:** 200 OK
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "gap_analysis_type": "broad",
    "missing_skills_map": {
      "comp_123": {
        "competency_id": "comp_123",
        "competency_name": "Full Stack Development",
        "missing_mgs": [
          {
            "skill_id": "skill_789",
            "skill_name": "React Context API"
          }
        ]
      }
    },
    "career_path_goal": "Full Stack Developer"
  }
  ```
- **Note:** Used by Features 37-38 (Missing Skills Display, Verified Skills Drill-Down)

---

#### 2.4.11 Trainer CSV Upload Endpoints

**POST /api/trainer/csv/upload**
- **Purpose:** Upload CSV file with custom hierarchical skills (Feature 30)
- **Method:** POST (multipart/form-data)
- **Request Body:**
  - `file`: CSV file (multipart/form-data)
  - `user_id`: User ID of trainer (from authentication token)
- **Access Control:** Trainer employee type only (validated on backend)
- **Response:** 202 Accepted
  ```json
  {
    "status": "uploaded",
    "upload_id": "upload_123",
    "message": "CSV file uploaded successfully, queued for processing"
  }
  ```
- **Error Responses:**
  - 403 Forbidden: User is not a Trainer
  - 400 Bad Request: Invalid file format or size
- **Note:** Triggers Feature 31 (CSV Parsing & Validation) for processing

---

**GET /api/trainer/csv/status/:upload_id**
- **Purpose:** Check status of CSV upload processing
- **Method:** GET
- **Response:** 200 OK
  ```json
  {
    "upload_id": "upload_123",
    "status": "processing", // "uploaded", "processing", "completed", "failed"
    "progress": 75,
    "message": "CSV file is being processed",
    "errors": []
  }
  ```
- **Note:** Used to track CSV upload processing status (Features 31-33)

---

#### 2.4.12 Outgoing Endpoints (Skills Engine → Other Microservices)

**POST {ASSESSMENT_MS_URL}/api/exams/baseline** (Outgoing)
- **Purpose:** Request baseline exam initiation from Assessment microservice
- **Method:** POST (synchronous)
- **Request Body:**
  ```json
  {
    "user_id": "user_123",
    "user_name": "John Doe",
    "mgs_list": [
      {
        "skill_id": "skill_123",
        "skill_name": "React Hooks"
      }
    ]
  }
  ```
- **Response:** 200 OK
  ```json
  {
    "exam_id": "exam_123",
    "exam_url": "https://assessment.educora.ai/exam/exam_123",
    "status": "created"
  }
  ```
- **Note:** Skills Engine sends this request after preparing baseline exam (Feature 10)

---

### 2.5 Error Handling

**Standard Error Response Format:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

**Common Error Codes:**
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Request not authenticated by Unified Data Exchange Endpoint
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## 3. Component Architecture

### 3.1 Overview
Component-level architecture design for Skills Engine microservice, including services, controllers, and models.

### 3.2 Backend Services

#### 3.2.1 TaxonomyService
**Purpose:** Manages skills and competencies taxonomy

**Key Methods:**
- `getMGSForCompetency(competencyId)`: Retrieve all MGS for a competency
- `traverseSkillHierarchy(skillId)`: Recursive traversal to find MGS
- `normalizeCompetencyName(name)`: AI-based normalization
- `discoverExternalCompetency(name)`: External knowledge discovery

---

#### 3.2.2 ProfileService
**Purpose:** Manages user profiles

**Key Methods:**
- `createUserProfile(userData)`: Create new user profile
- `updateVerifiedSkills(userId, skills, examType)`: Update verified skills
- `calculateCoveragePercentage(userId, competencyId)`: Calculate coverage
- `mapProficiencyLevel(coveragePercentage)`: Map to proficiency level
- `calculateRelevanceScore(userId)`: Calculate relevance score

---

#### 3.2.3 GapAnalysisService
**Purpose:** Performs gap analysis

**Key Methods:**
- `performNarrowGapAnalysis(userId, courseName)`: Narrow gap analysis
- `performBroadGapAnalysis(userId)`: Broad gap analysis
- `compareAgainstProfile(requiredMGS, userId)`: Compare skills
- `generateGapMap(missingMGS)`: Generate structured gap map

---

#### 3.2.4 AIService
**Purpose:** Handles AI operations

**Key Methods:**
- `discoverSources(domain)`: Discover official sources
- `extractSkillsFromData(rawData)`: Extract skills from unstructured data
- `normalizeSkills(skills)`: Normalize skill names
- `mapSkillsToCompetencies(skills, competencies)`: Map skills to competencies
- `discoverExternalCompetency(name)`: External knowledge discovery

---

#### 3.2.5 Unified Data Exchange Integration
**Purpose:** Handles communication through Unified Data Exchange Endpoint

**Key Methods:**
- `receiveRequest(request)`: Receive requests from Unified Data Exchange Endpoint
- `identifyCallingService(request)`: Identify calling microservice from request context
- `validateRequest(request)`: Validate request format and permissions

---

### 3.3 Data Access Layer

#### 3.3.1 Repository Pattern
Each service uses repository pattern for data access:

- `TaxonomyRepository`: Database operations for taxonomy
- `ProfileRepository`: Database operations for user profiles
- `SourceRepository`: Database operations for official sources

---

## 4. Data Access Layer

### 4.1 Overview
Detailed data access layer design, including query patterns, connection pooling, and transaction management.

### 4.2 Query Patterns

#### 4.2.1 Recursive Traversal Query
**Purpose:** Retrieve all MGS for a competency

**Approach:** Use recursive CTE (Common Table Expression) or application-level recursion

**SQL Pattern (PostgreSQL):**
```sql
WITH RECURSIVE skill_hierarchy AS (
  -- Base case: L1 skills for competency (skills that are required by competency but not children of other skills)
  SELECT s.skill_id, s.skill_name, 1 as depth
  FROM skills s
  JOIN competency_skill cs ON s.skill_id = cs.skill_id
  WHERE cs.competency_id = :competency_id
    AND NOT EXISTS (
      SELECT 1 FROM skill_subSkill ss WHERE ss.child_skill_id = s.skill_id
    )
  
  UNION ALL
  
  -- Recursive case: child skills
  SELECT s.skill_id, s.skill_name, sh.depth + 1
  FROM skills s
  JOIN skill_subSkill ss ON s.skill_id = ss.child_skill_id
  JOIN skill_hierarchy sh ON ss.parent_skill_id = sh.skill_id
  WHERE sh.depth < 10 -- Prevent infinite recursion
)
SELECT skill_id, skill_name
FROM skill_hierarchy
WHERE NOT EXISTS (
  SELECT 1 FROM skill_subSkill WHERE parent_skill_id = skill_hierarchy.skill_id
);
```

**Application-Level Pattern:**
```python
def get_mgs_for_competency(competency_id):
    # Get L1 skills for competency
    l1_skills = get_l1_skills_for_competency(competency_id)
    
    mgs_list = []
    for l1_skill in l1_skills:
        mgs_list.extend(traverse_skill_hierarchy(l1_skill.skill_id))
    
    return deduplicate(mgs_list)

def traverse_skill_hierarchy(skill_id):
    children = get_child_skills(skill_id)
    if not children:
        # This is MGS
        return [get_skill(skill_id)]
    
    mgs_list = []
    for child in children:
        mgs_list.extend(traverse_skill_hierarchy(child.skill_id))
    return mgs_list
```

---

#### 4.2.2 Coverage Percentage Calculation Query
**Purpose:** Calculate coverage percentage for a competency

**SQL Pattern:**
```sql
SELECT 
  uc.user_id,
  uc.competency_id,
  COUNT(DISTINCT CASE WHEN JSON_CONTAINS(uc.verifiedSkills, JSON_OBJECT('skill_id', mgs.skill_id, 'verified', true)) THEN mgs.skill_id END) as verified_mgs_count,
  COUNT(DISTINCT mgs.skill_id) as total_mgs_count,
  (COUNT(DISTINCT CASE WHEN JSON_CONTAINS(uc.verifiedSkills, JSON_OBJECT('skill_id', mgs.skill_id, 'verified', true)) THEN mgs.skill_id END) * 100.0 / COUNT(DISTINCT mgs.skill_id)) as coverage_percentage
FROM userCompetency uc
CROSS JOIN (
  -- Get all MGS for competency (using recursive traversal)
  SELECT skill_id FROM skill_hierarchy WHERE competency_id = uc.competency_id
) mgs
WHERE uc.user_id = :user_id
  AND uc.competency_id = :competency_id
GROUP BY uc.user_id, uc.competency_id;
```

---

### 4.3 Connection Pooling
- Use connection pooling for database connections
- Recommended pool size: 10-20 connections
- Connection timeout: 30 seconds
- Idle timeout: 10 minutes

---

### 4.4 Transaction Management
- Use transactions for multi-step operations (e.g., profile updates)
- Rollback on errors
- Commit only after all operations succeed

---

## 5. Algorithms & Queries

### 5.1 Recursive Hierarchy Traversal
**See Section 4.2.1 for detailed implementation**

---

### 5.2 Relevance Score Calculation
**Formula:**
```
Relevance Score = (Count of verified MGS for Career Path / Total Required MGS for Career Path) × 100
```

**Implementation:**
1. Get user's Career Path Goal from `users.path_career`
2. Identify all competencies for Career Path Goal
3. Get all required MGS for these competencies (using recursive traversal)
4. Count verified MGS from user profile
5. Calculate percentage
6. Store in `users.relevance_score`

---

### 5.3 Proficiency Level Mapping
**Mapping Rules:**
- BEGINNER: 0% - 25%
- INTERMEDIATE: 26% - 50%
- ADVANCED: 51% - 75%
- EXPERT: 76% - 100%

---

### 5.4 Skill Verification Update Logic
**Priority Order (Data Trust Priority):**
1. Assessment (highest priority)
2. Certification
3. Claims/AI (lowest priority)

**Update Logic:**
- If skill already verified by higher priority source, do not overwrite
- If new source has higher priority, update verification status

---

## 6. Security Implementation

### 6.1 Unified Data Exchange Authentication
- All microservice-to-microservice communication goes through Unified Data Exchange Endpoint
- Authentication is handled by the Unified Data Exchange Endpoint
- No separate token management required in Skills Engine
- Request validation is performed by Unified Data Exchange Endpoint before forwarding to Skills Engine

### 6.2 Input Validation
- Validate all input parameters
- Sanitize user input to prevent SQL injection
- Validate JSON structures
- Check for prompt injection in CSV uploads

### 6.3 SQL Injection Prevention
- Use parameterized queries
- Never concatenate user input into SQL queries
- Validate and sanitize all input

### 6.4 Prompt Injection Prevention
- Validate CSV content for prompt injection patterns
- Sanitize text before sending to AI
- Limit AI input size

---

## 7. Integration Patterns

### 7.1 Synchronous Integration
- Used for: Competency retrieval, Profile retrieval
- Method: REST API with immediate response
- Timeout: 5 seconds

### 7.2 Asynchronous Integration
- Used for: User creation events, Profile updates
- Method: Event-driven (message queue)
- Retry: 3 attempts with exponential backoff

---

## 8. Performance Optimization

### 8.1 Caching Strategy
- Cache frequently accessed competency data
- Cache MGS lists for competencies
- TTL: 1 hour
- Invalidate on taxonomy updates

### 8.2 Database Optimization
- Use indexes on frequently queried fields
- Optimize recursive queries
- Use connection pooling
- Monitor query performance

### 8.3 Gap Analysis Optimization
- Target: <1 second for gap analysis
- Use efficient traversal algorithms
- Cache intermediate results
- Parallel processing where possible

---

## 9. Error Handling & Logging

### 9.1 Error Handling
- Catch and log all errors
- Return appropriate HTTP status codes
- Provide meaningful error messages
- Never expose internal errors to clients

### 9.2 Logging
- Log all API requests and responses
- Log all database operations
- Log all AI operations
- Log all profile updates
- Use structured logging (JSON format)

### 9.3 Monitoring
- Monitor API response times
- Monitor database query performance
- Monitor AI API usage and costs
- Monitor error rates
- Set up alerts for critical errors

---

**Last Updated:** 2025-01-27

**Status:** In Progress - This document will be expanded with more detailed technical specifications as development progresses.

