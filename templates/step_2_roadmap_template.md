# Step 2: Roadmap & Milestones Template

## Overview
This template helps create a structured development roadmap with prioritized features, milestones, and risk assessment. We'll build on the project definition from Step 1 to create a phased development plan.

## Interactive Questions

### Feature Discovery
**Question 1:** Based on your project goals, what are the core features that users absolutely need to have? Think about the minimum functionality required for users to get value from your solution.

*[Follow-up: Ask for specific user actions or workflows if features are vague]*

**Question 2:** What additional features would make your solution significantly better or more competitive? These might be nice-to-have but not essential for initial launch.

*[Follow-up: Ask about user feedback or market research that supports these features]*

**Question 3:** Are there any advanced features you envision for the future? Think about capabilities that might be added after the initial launch.

*[Follow-up: Ask about specific use cases or scenarios for these advanced features]*

### Prioritization
**Question 4:** Which features are most critical for your initial launch? Consider what users need to see immediate value.

*[Follow-up: Ask about user pain points that each feature addresses]*

**Question 5:** Which features would have the biggest impact on user satisfaction or business goals?

*[Follow-up: Ask about specific metrics or outcomes each feature should achieve]*

**Question 6:** Are there any features that are technically complex or might take significantly longer to develop?

*[Follow-up: Ask about technical dependencies or integration challenges]*

### Development Phases
**Question 7:** What would you consider a successful "minimum viable product" (MVP)? What's the smallest version that users would find valuable?

*[Follow-up: Ask about specific user scenarios the MVP should support]*

**Question 8:** After the MVP, what would be your next major milestone? What features or improvements would come in the second phase?

*[Follow-up: Ask about timeline expectations and user feedback integration]*

**Question 9:** How do you envision the solution scaling? What capabilities would you need for thousands or millions of users?

*[Follow-up: Ask about specific performance, security, or infrastructure requirements]*

### Risk Assessment
**Question 10:** What are the biggest risks to this project's success? Consider technical challenges, market factors, or resource constraints.

*[Follow-up: Ask about specific mitigation strategies or contingency plans]*

**Question 11:** Are there any external dependencies that could delay or block development? (e.g., third-party services, regulatory approvals, team availability)

*[Follow-up: Ask about backup plans or alternative approaches]*

**Question 12:** What assumptions are you making about user behavior, market demand, or technical feasibility that could prove wrong?

*[Follow-up: Ask about validation strategies or early testing approaches]*

### Timeline & Dependencies
**Question 13:** Are there any features that must be completed before others can begin? What's the logical order of development?

*[Follow-up: Ask about technical dependencies, user workflow dependencies, or business logic dependencies]*

**Question 14:** What's your target timeline for the MVP? Are there any hard deadlines or external factors driving the schedule?

*[Follow-up: Ask about specific dates or milestones if mentioned]*

## Output Structure

```json
{
  "step": 2,
  "output": {
    "feature_list": {
      "core_features": [
        {
          "name": "string",
          "description": "string",
          "user_value": "string",
          "complexity": "low|medium|high"
        }
      ],
      "enhancement_features": [
        {
          "name": "string",
          "description": "string",
          "user_value": "string",
          "complexity": "low|medium|high"
        }
      ],
      "future_features": [
        {
          "name": "string",
          "description": "string",
          "user_value": "string",
          "complexity": "low|medium|high"
        }
      ]
    },
    "prioritization": {
      "mvp_features": ["string"],
      "phase_2_features": ["string"],
      "scalability_features": ["string"],
      "optimization_features": ["string"]
    },
    "roadmap_phases": {
      "mvp": {
        "features": ["string"],
        "timeline": "string",
        "success_criteria": ["string"]
      },
      "phase_2": {
        "features": ["string"],
        "timeline": "string",
        "success_criteria": ["string"]
      },
      "scalability": {
        "features": ["string"],
        "timeline": "string",
        "success_criteria": ["string"]
      },
      "optimization": {
        "features": ["string"],
        "timeline": "string",
        "success_criteria": ["string"]
      }
    },
    "milestones": [
      {
        "name": "string",
        "description": "string",
        "target_date": "string",
        "dependencies": ["string"],
        "success_criteria": ["string"]
      }
    ],
    "risks": [
      {
        "risk": "string",
        "category": "technical|business|schedule|resource",
        "impact": "low|medium|high",
        "probability": "low|medium|high",
        "mitigation": "string"
      }
    ],
    "dependencies": [
      {
        "feature": "string",
        "depends_on": ["string"],
        "type": "technical|business|user_workflow"
      }
    ]
  }
}
```

## Completion Criteria
- [ ] Complete feature list with core, enhancement, and future features
- [ ] Features prioritized by value and effort
- [ ] Clear roadmap phases (MVP → Phase 2 → Scalability → Optimization)
- [ ] Milestones defined with dependencies and success criteria
- [ ] Risks identified and categorized with mitigation strategies
- [ ] Dependencies mapped between features
- [ ] Timeline estimates for each phase
- [ ] All information validated with user

## Validation Checkpoint
After collecting all information, ask: **"Is this step complete and well-executed? Yes/No. If No, provide feedback for refinement within this step only."**

If "No," ask specific clarifying questions based on the feedback until the user confirms "Yes."

## Notes
- Build on the project definition from Step 1
- Focus on user value when prioritizing features
- Consider both technical and business dependencies
- Be realistic about complexity and timeline estimates
- Ensure risk mitigation strategies are actionable
