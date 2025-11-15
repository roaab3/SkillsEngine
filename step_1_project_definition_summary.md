# Step 1: Project Definition - Summary

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Date:** 2025-01-27  
**Status:** ✅ Complete

---

## 📋 Project Idea

**EduCora AI** is a learning and development platform with 11 microservices. **Skills Engine** is the microservice that acts as the central authority for managing all skill and competency data within the platform. It maintains a hierarchical skill taxonomy, tracks user skill profiles, verifies skills, and enables precise gap analysis. Its core purpose is to provide accurate, structured skill data to other services, supporting personalized learning, career development, and talent management.

---

## 🎯 Problem Statement

Before Skills Engine, skill and competency data across the platform was fragmented, unstructured, and often unreliable. There was no single source of truth for skills, making it difficult to track user proficiency, identify skill gaps, and provide personalized learning paths. Skills Engine solves this by centralizing all skill data, verifying user skills, maintaining a flexible hierarchical taxonomy, and enabling precise gap analysis for career development.

---

## 👥 Target Users

### Direct Users

**Employees:**
- View their own skill profiles
- Track verified competencies
- Identify skill gaps

**Trainers:**
- Same capabilities as employees
- **Additional:** Can upload custom skills/competencies via CSV
- **Note:** Cannot manage the skill taxonomy (that's an admin function)

### Indirect Users

Users accessing Skills Engine data through other services (Directory, EduCore). For example, an employee viewing their skills summary via Directory - data provided by Skills Engine but interface is through another service.

### System Integrations (7 Microservices)

1. **Assessment** - Sends exam results to update verified skills
2. **Course Builder** - Requests skills to map courses or training paths
3. **Content Studio** - Sends competency to Skills Engine and receives all related skills to generate/organize lesson content
4. **Learner AI** - Receives missing skills per user, queries Skills Engine for skills related to competency to build learning plans and recommend courses
5. **RAG/Chatbot** - Extracts skill and competency data for analytics or user queries
6. **Directory** - Retrieves skill and competency summaries for display in user dashboards
7. **Learning Analytics** - Retrieves stored, pre-calculated individual profiles and aggregate team competency status for reporting and insights

---

## 🎯 Business Goals

The Skills Engine microservice establishes a single source of truth for skills and competencies across the EduCora AI platform, ensuring consistent, verified data for all training, assessments, and reporting. It enables accurate tracking of individual and team skill levels, allowing employees and trainers to identify gaps and take targeted development actions. By providing structured skill data to other services like Learner AI, Content Studio, and Course Builder, it supports competency-aligned content, courses, and learning paths, enhancing personalized learning experiences. For organizations, it delivers insights into workforce competencies, improves talent management, and ensures scalable, efficient, and data-driven decision-making for employee growth and upskilling initiatives.

---

## 🌟 Vision & Mission

### Vision

To be the central, authoritative source of skills and competencies within the EduCora AI platform, enabling transparent, data-driven skill development for every employee and supporting organizations in achieving a highly skilled, future-ready workforce.

### Mission

The Skills Engine microservice organizes, verifies, and delivers structured skill and competency data, powering accurate skill tracking, gap analysis, and competency-aligned learning experiences. It ensures that all services within EduCora AI can rely on a consistent, authoritative source of skill information, enabling personalized growth, informed talent management, and measurable learning outcomes.

---

## 📊 Success Metrics

### Performance Metrics
- **API Response Times:** Flexible - API response times appropriate for operation complexity (e.g., simple reads faster, complex gap analysis may take longer)
- **System Uptime:** ≥99.9%

### Business Metrics
- Number of verified skills
- Skill verifications count
- Mapped competencies count

### Quality Metrics
- Data accuracy
- Gap analysis precision
- Consistency across microservices

### Adoption Metrics
- API usage frequency
- Number of integrated microservices
- Employee access to skill profiles

---

## ⚠️ Constraints

### Technical Constraints
- Must integrate seamlessly with existing EduCora AI services
- Support scalable, N-level skill hierarchies

### Business Constraints
- Project timelines
- Budget limitations
- Resource availability

### Regulatory Constraints
- Secure handling of employee data
- Compliance with privacy regulations

### Platform Constraints
- Reliable operation within EduCora AI ecosystem
- Backward compatibility requirements
- Support for asynchronous events

---

## 📁 Project Structure

### Core Domain Folders
- `/frontend` → React UI, interactions, frontend tests
- `/backend` → Node.js + Express APIs, auth, backend tests
- `/database` → PostgreSQL schema, migrations, DB logic

### Supporting System Folders
- `/docs` → Documentation, diagrams, ADRs
- `/tests` → Unit/integration/e2e tests
- `/.github` → CI/CD pipelines (GitHub Actions)
- `/scripts` → Setup, deployment, automation
- `/customize` → Project customization and change logs

---

## 🔄 Next Steps

**Step 2:** Functional & Non-Functional Requirements  
**Participants:** PO, FSD, AI, QA  
**Dependencies:** Step 1 (Complete)

---

**Document Generated:** 2025-01-27  
**Last Updated:** 2025-01-27


