# Step 3: Functional & Non-Functional Requirements Template

## Overview
This template captures detailed functional and non-functional requirements based on the project definition and roadmap. We'll define specific user stories, acceptance criteria, and system requirements.

## Interactive Questions

### User Stories & Functional Requirements
**Question 1:** Let's start with your primary user. What's the main task or goal they want to accomplish when using your solution? Walk me through their typical workflow.

*[Follow-up: Ask for specific steps, decisions, and outcomes in the workflow]*

**Question 2:** What information does the user need to see or input at each step of their workflow?

*[Follow-up: Ask about data formats, validation rules, and display preferences]*

**Question 3:** What actions can the user take at each step? What should happen when they click buttons, fill forms, or navigate?

*[Follow-up: Ask about error handling, confirmation dialogs, and success feedback]*

**Question 4:** Are there different types of users with different permissions or capabilities? What can each type do?

*[Follow-up: Ask about role-based access, feature restrictions, and user management]*

**Question 5:** What happens when multiple users interact with the system? Are there collaboration features or data sharing?

*[Follow-up: Ask about real-time updates, notifications, and conflict resolution]*

### Business Logic & Workflows
**Question 6:** What business rules or logic should the system enforce? Think about calculations, validations, or automated decisions.

*[Follow-up: Ask for specific formulas, thresholds, or conditions]*

**Question 7:** Are there any automated processes or background tasks that should happen without user intervention?

*[Follow-up: Ask about triggers, schedules, and notification requirements]*

**Question 8:** What integrations with external systems or services are needed? How should data flow between systems?

*[Follow-up: Ask about API requirements, data formats, and error handling for integrations]*

### Non-Functional Requirements
**Question 9:** How many users do you expect to use the system simultaneously? What's your growth projection?

*[Follow-up: Ask about peak usage times, geographic distribution, and scaling expectations]*

**Question 10:** What's your expectation for system performance? How fast should pages load, searches complete, or data process?

*[Follow-up: Ask about specific response times, throughput requirements, and performance benchmarks]*

**Question 11:** How important is system reliability? What's your tolerance for downtime or errors?

*[Follow-up: Ask about uptime requirements, error rates, and recovery time expectations]*

**Question 12:** What security requirements do you have? Consider data protection, user authentication, and access control.

*[Follow-up: Ask about compliance requirements, data sensitivity, and security standards]*

**Question 13:** Are there any compliance or regulatory requirements? Think about data privacy, industry standards, or legal obligations.

*[Follow-up: Ask about specific regulations, audit requirements, and documentation needs]*

### Data & Storage Requirements
**Question 14:** What types of data will the system store and manage? How much data do you expect?

*[Follow-up: Ask about data formats, relationships, and growth projections]*

**Question 15:** How long should data be retained? Are there any data archiving or deletion requirements?

*[Follow-up: Ask about backup requirements, data migration, and compliance retention periods]*

**Question 16:** What reporting or analytics capabilities do you need? What insights should the system provide?

*[Follow-up: Ask about specific metrics, report formats, and dashboard requirements]*

### AI/ML Requirements (if applicable)
**Question 17:** Are there any AI or machine learning capabilities you want to include? What should the system learn or predict?

*[Follow-up: Ask about training data, accuracy requirements, and model performance expectations]*

**Question 18:** How should AI recommendations or predictions be presented to users? What level of explanation or transparency is needed?

*[Follow-up: Ask about user trust, explainability requirements, and feedback mechanisms]*

## Output Structure

```json
{
  "step": 3,
  "output": {
    "functional_requirements": {
      "user_stories": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "user_type": "string",
          "acceptance_criteria": ["string"],
          "priority": "high|medium|low"
        }
      ],
      "business_workflows": [
        {
          "name": "string",
          "description": "string",
          "steps": ["string"],
          "decision_points": ["string"],
          "outputs": ["string"]
        }
      ],
      "business_rules": [
        {
          "rule": "string",
          "condition": "string",
          "action": "string",
          "priority": "high|medium|low"
        }
      ],
      "integrations": [
        {
          "system": "string",
          "purpose": "string",
          "data_flow": "string",
          "frequency": "string"
        }
      ]
    },
    "non_functional_requirements": {
      "performance": {
        "response_time": "string",
        "throughput": "string",
        "concurrent_users": "string",
        "scalability_targets": ["string"]
      },
      "reliability": {
        "uptime_requirement": "string",
        "error_tolerance": "string",
        "recovery_time": "string",
        "backup_requirements": ["string"]
      },
      "security": {
        "authentication": "string",
        "authorization": "string",
        "data_protection": "string",
        "compliance_requirements": ["string"]
      },
      "usability": {
        "accessibility": "string",
        "mobile_support": "string",
        "browser_support": ["string"],
        "user_experience_goals": ["string"]
      }
    },
    "data_requirements": {
      "data_types": ["string"],
      "storage_requirements": "string",
      "retention_policy": "string",
      "backup_strategy": "string",
      "analytics_needs": ["string"]
    },
    "ai_requirements": {
      "ml_capabilities": ["string"],
      "training_data": "string",
      "model_performance": "string",
      "explainability": "string",
      "feedback_mechanisms": ["string"]
    }
  }
}
```

## Completion Criteria
- [ ] User stories defined with clear acceptance criteria
- [ ] Business workflows and rules documented
- [ ] Integration requirements specified
- [ ] Performance and scalability requirements defined
- [ ] Security and compliance requirements established
- [ ] Data requirements and retention policies set
- [ ] AI/ML requirements specified (if applicable)
- [ ] All requirements are specific, measurable, and testable
- [ ] All information validated with user

## Validation Checkpoint
After collecting all information, ask: **"Is this step complete and well-executed? Yes/No. If No, provide feedback for refinement within this step only."**

If "No," ask specific clarifying questions based on the feedback until the user confirms "Yes."

## Notes
- Build on project definition (Step 1) and roadmap (Step 2)
- Focus on specific, measurable requirements
- Consider both current needs and future scalability
- Ensure requirements are testable and verifiable
- Balance user needs with technical feasibility
