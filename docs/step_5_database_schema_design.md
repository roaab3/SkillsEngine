# Step 5: Database Schema Design

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Date:** 2025-01-27  
**Status:** Draft

---

## 1. Overview

This document defines the complete database schema for the Skills Engine microservice, including all tables, relationships, constraints, indexes, and data types. The schema supports:

- N-level skill hierarchy with unlimited depth
- Two-layer competency structure (Parent → Child)
- User competency and skill profiles
- AI-powered extraction and validation workflows
- External source URL management
- Audit trails and telemetry

**Database Technology:** PostgreSQL (recommended) or MySQL/MariaDB  
**Character Set:** UTF-8  
**Collation:** utf8mb4_unicode_ci (for MySQL) or default (for PostgreSQL)

---

## 2. Schema Conventions

- **Primary Keys:** VARCHAR(255) string identifiers (not auto-incrementing integers)
- **Foreign Keys:** Referential integrity enforced, all use VARCHAR(255) string IDs
- **Timestamps:** `created_at`, `updated_at` (auto-managed)
- **Soft Deletes:** `deleted_at` (nullable timestamp) where applicable
- **JSON Fields:** Stored as JSON/JSONB type
- **Enums:** Stored as VARCHAR with CHECK constraints or ENUM type
- **Indexes:** 
  - **Hash Indexes:** Used for string keys with Polynomial Rolling Hash function
  - **B-TREE Indexes:** Used for ordered queries, comparisons, sorting, and LIKE searches
  - Indexes created on foreign keys, frequently queried columns, and unique constraints

---

## 2.1 Hash Index Strategy

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

**Note:** All indexed keys in this schema are VARCHAR (string type), so all hash indexes use Polynomial Rolling Hash with normalization: `POLYNOMIAL_HASH(LOWER(TRIM(column_name)))`.

---

## 3. Core Taxonomy Tables

### 3.1 `skills` Table

**Purpose:** Stores all skills in the hierarchical taxonomy.

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

**Field Descriptions:**
- `skill_id`: Primary key, VARCHAR(255) string identifier
- `skill_name`: Skill name (required, indexed for lookups)
- `parent_skill_id`: Self-referencing foreign key to parent skill (NULL for L1/top-level skills)
- `description`: Full description of the skill (optional)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp (auto-updated)

**Constraints:**
- `skill_id` is the primary key (string, not auto-incrementing)
- `parent_skill_id` can be NULL (for root/L1 skills) or reference another skill
- Self-referencing relationship allows unlimited hierarchy depth
- Level (L1, L2, L3, L4/MGS) is determined by hierarchy depth, not stored as a field
- Cascade delete: deleting a parent skill deletes all child skills

**Indexes:**
- Primary key on `skill_id`
- Index on `parent_skill_id` for hierarchy traversal queries
- Hash index on `skill_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Hash index on `skill_name` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

### 3.2 `competencies` Table

**Purpose:** Stores all competencies.

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

**Field Descriptions:**
- `competency_id`: Primary key, VARCHAR(255) string identifier
- `competency_name`: Competency name (required, indexed for lookups)
- `description`: Full description of the competency (optional)
- `parent_competency_id`: Foreign key to parent competency (NULL for parent competencies, references another competency for child competencies)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp (auto-updated)

**Constraints:**
- Supports nested competencies (sub-competencies)
- Self-referencing foreign key for parent-child relationships
- Cascade delete: deleting a parent competency deletes all child competencies

**Indexes:**
- Primary key on `competency_id`
- Index on `parent_competency_id` for hierarchy queries
- B-TREE index on `competency_id` for ordered queries, comparisons, and sorting (B+Tree optimized for range queries AND equality)
- B-TREE index on `competency_name` for LIKE searches, sorting, and partial matching (B+Tree supports lexicographical operations and ORDER BY)

---

### 3.3 `competency_skill` Junction Table

**Purpose:** Junction table linking competencies to their required L1 skills.

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

**Field Descriptions:**
- `competency_id`: Foreign key to competencies table (VARCHAR(255))
- `skill_id`: Foreign key to skills table (VARCHAR(255), should reference L1/top-level skills only)
- `created_at`: Record creation timestamp

**Constraints:**
- Composite primary key on (`competency_id`, `skill_id`) ensures no duplicate mappings
- Both foreign keys cascade on delete
- Business logic: Only L1 skills should be linked (enforced in application layer)
- MGS are retrieved via recursive traversal through skill hierarchy

**Indexes:**
- Composite primary key
- Index on `skill_id` for queries: "Which competencies require this skill?"
- Hash index on `competency_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

### 3.4 `skill_subSkill` Junction Table

**Purpose:** Junction table for skill hierarchy (parent-child relationships).

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

**Field Descriptions:**
- `parent_skill_id`: Foreign key to parent skill (VARCHAR(255))
- `child_skill_id`: Foreign key to child skill (VARCHAR(255))
- `created_at`: Record creation timestamp

**Constraints:**
- Composite primary key on (`parent_skill_id`, `child_skill_id`)
- Represents hierarchical relationships between skills
- Used for recursive traversal to find MGS
- Both foreign keys cascade on delete

**Indexes:**
- Composite primary key
- Hash index on `parent_skill_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Hash index on `child_skill_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

### 3.5 `competency_subCompetency` Junction Table

**Purpose:** Junction table for nested competencies (sub-competencies).

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

**Field Descriptions:**
- `parent_competency_id`: Foreign key to parent competency (VARCHAR(255))
- `child_competency_id`: Foreign key to child competency (VARCHAR(255))
- `created_at`: Record creation timestamp

**Constraints:**
- Composite primary key on (`parent_competency_id`, `child_competency_id`)
- Supports nested competency structures
- Used for recursive traversal when building competency hierarchies
- Both foreign keys cascade on delete

**Indexes:**
- Composite primary key
- Index on `parent_competency_id` for queries: "What are the child competencies of this parent?"
- Index on `child_competency_id` for queries: "What is the parent of this child competency?"

---


---

## 4. User Profile Tables

### 4.1 `users` Table

**Purpose:** Stores basic user information.

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

**Field Descriptions:**
- `user_id`: Primary key, string ID from Directory MS
- `user_name`: User's display name
- `company_id`: Company/organization identifier
- `employee_type`: User type (enum: 'regular', 'trainer') - determines UI access
- `path_career`: Career Path Goal for gap analysis (VARCHAR(500))
- `raw_data`: Unstructured data from external sources (TEXT - JSON or text from LinkedIn, GitHub, resume)
- `relevance_score`: Numeric score (0.00 to 100.00) for career path goal, initialized to 0.00, stored at user level
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp (auto-updated)

**Constraints:**
- `user_id` is the primary key (from Directory MS, not auto-generated)
- `relevance_score` must be between 0.00 and 100.00

**Indexes:**
- Primary key on `user_id`
- Hash index on `user_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

### 4.2 `userCompetency` Table

**Purpose:** Stores user competency profiles with verification status.

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

**Field Descriptions:**
- `user_id`: Foreign key to users table (VARCHAR(255))
- `competency_id`: Foreign key to competencies table (VARCHAR(255))
- `coverage_percentage`: Coverage percentage (0.00 to 100.00), calculated based on verified MGS vs required MGS
- `proficiency_level`: Proficiency level (enum: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT), mapped from coverage percentage
- `verifiedSkills`: JSON array of verified skills, structure:
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
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp (auto-updated)

**Constraints:**
- Composite primary key on (`user_id`, `competency_id`) prevents duplicate competency entries per user
- `coverage_percentage` must be between 0.00 and 100.00
- `verifiedSkills` is a JSON array (default empty array `[]`)

**Indexes:**
- Composite primary key on (`user_id`, `competency_id`)
- Hash index on `user_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Hash index on `competency_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

**JSON Field Operations:**
- Always parse JSON using `JSON.parse()` before reading/modifying
- Always stringify using `JSON.stringify()` before saving
- Operations: upsert, update verification status, query verified MGS

---

### 4.3 `userSkill` Table

**Purpose:** Stores individual user skills (optional, for detailed tracking).

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
    INDEX idx_userskill_skill_hash (POLYNOMIAL_HASH(LOWER(TRIM(skill_id))))
);
```

**Field Descriptions:**
- `user_id`: Foreign key to users table (VARCHAR(255))
- `skill_id`: Foreign key to skills table (VARCHAR(255))
- `skill_name`: Skill name (required, stored for quick access)
- `verified`: Verification status (boolean, default: FALSE)
- `source`: Source of the skill (enum: 'assessment', 'certification', 'claim', 'ai')
- `last_update`: Last update timestamp (auto-updated)
- `created_at`: Record creation timestamp

**Constraints:**
- Composite primary key on (`user_id`, `skill_id`) prevents duplicate skill entries per user
- Optional table for detailed skill-level tracking
- Can be used for analytics and reporting
- Skills are stored without hierarchical relationships (as per FR 5.3.10)

**Indexes:**
- Composite primary key on (`user_id`, `skill_id`)
- Hash index on `user_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Hash index on `skill_id` using **Polynomial Rolling Hash** (p=31, M=1,000,000,009)
- Normalization applied: LOWER(TRIM()) before hashing

---

## 5. External Sources & Extraction Tables

### 5.1 `official_sources` Table

**Purpose:** Stores official sources discovered by AI for taxonomy building.

**Schema:**
```sql
CREATE TABLE official_sources (
    source_id VARCHAR(255) PRIMARY KEY,
    source_name VARCHAR(500) NOT NULL,
    reference_index_url VARCHAR(1000) NOT NULL,
    reference_type VARCHAR(100), -- 'API', 'Documentation', 'Standard', etc.
    hierarchy_support BOOLEAN DEFAULT FALSE,
    provides TEXT, -- What the source provides
    topics_covered TEXT, -- Topics covered by this source
    skill_focus TEXT, -- Skills focus area
    notes TEXT,
    last_checked TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_source_id (source_id),
    INDEX idx_last_checked (last_checked)
);
```

**Field Descriptions:**
- `source_id`: Primary key, unique identifier from AI response
- `source_name`: Organization/website name
- `reference_index_url`: URL of the specific page/section (VARCHAR(1000))
- `reference_type`: Type of reference (enum: 'API', 'Documentation', 'Standard', etc.)
- `access_method`: Method to access the source (enum: 'web_scraping', 'api', etc.)
- `hierarchy_support`: Whether source supports hierarchical structure (boolean, default: FALSE)
- `provides`: What the source provides (TEXT)
- `topics_covered`: Topics covered by this source (TEXT)
- `skill_focus`: Skills focus area (TEXT)
- `notes`: Additional information (nullable, TEXT)
- `last_checked`: Last time the source was checked (nullable, TIMESTAMP)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp (auto-updated)

**Constraints:**
- `source_id` is the primary key
- Maintains persistent list of all official sources
- Supports periodic re-checking of sources
- Tracks which sources have been used for data extraction

**Indexes:**
- Primary key on `source_id`
- Index on `reference_type` for filtering by type
- Index on `last_checked` for time-based queries

---

## 6. Relationships Diagram

```
users (1) ──< (N) userCompetency
users (1) ──< (N) userSkill

competencies (1) ──< (N) userCompetency
competencies (1) ──< (N) competencies (parent_competency_id)
competencies (N) ──< (N) skills (via competency_skill)
competencies (N) ──< (N) competencies (via competency_subCompetency)

skills (1) ──< (N) skills (parent_skill_id)
skills (N) ──< (N) skills (via skill_subSkill)
```

---

## 7. Indexes Summary

**Index Types Used:**

1. **Hash Indexes (Polynomial Rolling Hash):**
   - Used for string keys (VARCHAR columns)
   - Hash function: `h(s) = (s[0]*p^0 + s[1]*p^1 + ... + s[n-1]*p^(n-1)) mod M`
   - Parameters: `p = 31`, `M = 1,000,000,009`
   - Normalization: `LOWER(TRIM(column_name))` applied before hashing
   - Used on: `skill_id`, `skill_name`, `competency_id`, `user_id`, and other string primary/foreign keys
   - Optimal for: Equality lookups (O(1) average case)

2. **B-TREE Indexes:**
   - Used for ordered queries, comparisons, sorting, and LIKE searches
   - Used on: `competency_id`, `competency_name` for lexicographical operations
   - Optimal for: Range queries, ORDER BY, LIKE searches, partial matching

3. **Standard Indexes:**
   - Used on foreign keys for join operations
   - Used on frequently queried columns (status, type, timestamps)
   - Composite indexes on junction tables

**Performance-Critical Indexes:**
- All foreign keys are indexed
- Frequently queried columns (name, status, type) are indexed
- Composite indexes on junction tables
- Timestamp indexes for time-based queries
- Hash indexes on string keys for fast equality lookups

**Query Optimization:**
- Hash indexes support fast equality lookups (O(1) average)
- B-TREE indexes support hierarchy traversal queries
- B-TREE indexes support user profile lookups with sorting
- Indexes support competency-skill mapping queries
- Indexes support status-based filtering

**Note:** The `POLYNOMIAL_HASH()` function must be implemented as a database function or computed in the application layer before querying. For databases that don't support custom hash functions, consider using application-level hashing or B-TREE indexes as fallback.

---

## 8. Data Types & Constraints

**String Types:**
- `VARCHAR(255)`: Primary keys and standard identifiers (skill_id, competency_id, user_id)
- `VARCHAR(500)`: Skill names, competency names, user names
- `VARCHAR(100)`: Short enums and codes
- `VARCHAR(1000)`: URLs (reference_index_url)
- `TEXT`: Long descriptions, notes, and unstructured data

**Numeric Types:**
- `VARCHAR(255)`: All primary keys and foreign keys (string identifiers, not auto-incrementing)
- `DECIMAL(5,2)`: Percentages and scores (0.00 to 100.00)

**JSON Types:**
- `JSON` / `JSONB`: Structured data (PostgreSQL JSONB recommended for better performance)

**Timestamp Types:**
- `TIMESTAMP`: All date/time fields with timezone support

**Boolean Types:**
- `BOOLEAN`: True/false flags

---

## 9. Migration Strategy

**Initial Setup:**
1. Create all tables in dependency order (core taxonomy → user profiles → junctions → audit)
2. Create indexes after table creation
3. Create triggers for auto-updating timestamps
4. Insert initial data (if any)

**Future Migrations:**
- Use versioned migration files
- Test migrations on staging before production
- Backup database before migrations
- Document breaking changes

---

## 10. Notes & Considerations

**JSON Field Handling:**
- Always validate JSON structure before insertion
- Use parameterized queries to prevent SQL injection
- Consider JSONB in PostgreSQL for better query performance
- Index JSON fields if frequently queried (PostgreSQL JSONB indexes)
- Always parse JSON using `JSON.parse()` before reading/modifying
- Always stringify using `JSON.stringify()` before saving

**Cascade Deletes:**
- User deletion cascades to userCompetency, userSkill
- Competency/skill deletion cascades to junction tables
- Consider soft deletes for audit trails if needed

**Performance:**
- Monitor query performance, especially hierarchy traversals
- Consider materialized views for complex aggregations
- Cache MGS counts for L1 skills
- Use connection pooling
- Hash indexes provide O(1) average lookup time for equality queries
- B-TREE indexes optimized for range queries and sorting

**Hash Index Implementation:**
- `POLYNOMIAL_HASH()` function must be implemented as database function or computed in application layer
- For databases without custom hash functions, use B-TREE indexes as fallback
- Normalization (LOWER(TRIM())) ensures consistent hashing regardless of case/spacing
- Hash function parameters: `p = 31`, `M = 1,000,000,009`

**Security:**
- Use parameterized queries (prepared statements)
- Validate all inputs
- Implement row-level security if needed
- Encrypt sensitive JSON fields if required

---

**Next Steps:**
- Review schema with team
- Create migration scripts
- Set up database with initial schema
- Create database access layer in application code

