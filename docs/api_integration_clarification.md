# API Integration Clarification

**Project:** Skills Engine Microservice  
**Date:** 2025-01-27

---

## Important Distinction: External Systems Integration vs External APIs

### External Systems Integration (Skills Engine as API Provider)

**Skills Engine provides REST APIs** that **external microservices** consume. These external microservices (Directory MS, Assessment MS, Course Builder MS, etc.) are **separate systems** that make requests to Skills Engine.

**Features 8.1-8.7** are about Skills Engine **providing** APIs to external systems:
- Directory MS (external system)
- Assessment MS (external system)
- Course Builder MS (external system)
- Content Studio MS (external system)
- Learner AI MS (external system)
- Learning Analytics MS (external system)
- RAG/Chatbot MS (external system)

**Direction:** External microservices **call** Skills Engine APIs

**Example:**
```
Course Builder MS (external) → HTTP Request → Skills Engine API → Returns MGS list
```

---

### External APIs (Skills Engine as Consumer)

**Skills Engine consumes external APIs** for AI services and web scraping.

**External APIs used by Skills Engine:**

1. **Google Gemini AI API**
   - Purpose: AI extraction, normalization, validation
   - Models: Gemini 1.5 Flash, Gemini 1.5 Pro
   - Used in: Features 9.1-9.6

2. **Web Scraping APIs** (if needed)
   - Purpose: Extract data from external websites
   - Used in: Feature 9.2 (Web Deep Search & Skill Extraction)

**Direction:** Skills Engine **calls** external APIs

**Example:**
```
Skills Engine → HTTP Request → Gemini API → Returns extracted skills
```

---

## Summary

| Type | Direction | Purpose | Features |
|------|-----------|---------|----------|
| **External Systems Integration** | Skills Engine **provides** APIs | External microservices consume Skills Engine APIs | 8.1-8.7 |
| **External APIs** | Skills Engine **consumes** | AI services (Gemini), web scraping | 9.1-9.6 |

---

## In Feature Specification

When specifying features:

- **Features 8.1-8.7 (External Systems Integration):**
  - **External API:** No (Skills Engine provides APIs, doesn't consume)
  - **API Name:** Skills Engine REST API (provided by Skills Engine)
  - **Integration Points:** REST endpoints that Skills Engine exposes for external systems to consume
  - **External Systems:** Directory MS, Assessment MS, Course Builder MS, etc. (these are external systems that call Skills Engine)

- **Features 9.1-9.6 (AI-Powered Extraction):**
  - **External API:** Yes (Skills Engine consumes external APIs)
  - **API Name:** Google Gemini AI API
  - **Integration Points:** API calls from Skills Engine to Gemini for extraction/normalization

---

**Document Created:** 2025-01-27

