# Step 1: Project Definition Template

## Overview
This template guides the definition of your project's core business goals, scope, and vision. We'll collect information through dynamic, adaptive questions to create a clear problem statement and measurable success metrics.

## Interactive Questions

### Initial Context Gathering
**Question 1:** What is the main problem or opportunity you want to address with this project? Please describe it in your own words, focusing on the pain points or needs you've observed.

*[Follow-up based on answer: If the problem is vague, ask for specific examples. If too technical, ask for business impact.]*

### Target Users & Stakeholders
**Question 2:** Who are the primary users of this solution? Think about the people who will directly interact with your product.

*[Follow-up: Ask about user demographics, technical proficiency, and specific roles if not clear]*

**Question 3:** Are there other stakeholders who will be affected by or influence this project? (e.g., decision makers, administrators, external partners)

*[Follow-up: Ask about their relationship to the primary users and their specific needs]*

### Value Proposition
**Question 4:** What makes your solution unique or better than existing alternatives? What's your competitive advantage?

*[Follow-up: If no clear advantage, ask about specific features or benefits that matter most to users]*

### Success Metrics
**Question 5:** How will you know if this project is successful? What specific outcomes or numbers would indicate success?

*[Follow-up: Ask for both quantitative metrics (user count, revenue, performance) and qualitative indicators (user satisfaction, adoption rate)]*

### Constraints & Context
**Question 6:** What are your main constraints for this project? Consider budget, timeline, team size, and any technical limitations.

*[Follow-up: Ask about specific numbers or deadlines if mentioned]*

**Question 7:** What's your target timeline for having a working solution? Are there any critical deadlines or milestones?

*[Follow-up: Ask about MVP vs full solution timeline if not specified]*

### Vision & Mission
**Question 8:** What's your long-term vision for this project? Where do you see it in 6 months, 1 year, or beyond?

*[Follow-up: Ask about growth expectations, scaling needs, and future features]*

## Output Structure

```json
{
  "step": 1,
  "output": {
    "problem_statement": {
      "core_problem": "string",
      "target_users": "string",
      "pain_points": ["string"],
      "current_alternatives": "string"
    },
    "value_proposition": {
      "unique_value": "string",
      "competitive_advantage": "string",
      "key_benefits": ["string"]
    },
    "success_metrics": {
      "quantitative": {
        "user_metrics": ["string"],
        "business_metrics": ["string"],
        "performance_metrics": ["string"]
      },
      "qualitative": ["string"]
    },
    "constraints": {
      "budget": "string",
      "timeline": "string",
      "team_size": "string",
      "technical_limitations": ["string"]
    },
    "vision": {
      "short_term": "string",
      "long_term": "string",
      "growth_expectations": "string"
    },
    "stakeholders": {
      "primary_users": ["string"],
      "secondary_stakeholders": ["string"],
      "decision_makers": ["string"]
    }
  }
}
```

## Completion Criteria
- [ ] Clear problem statement defined with specific pain points
- [ ] Target users and stakeholders identified
- [ ] Value proposition articulated with competitive advantage
- [ ] Measurable success metrics established
- [ ] Constraints and limitations documented
- [ ] Vision and mission clearly defined
- [ ] All information validated with user

## Validation Checkpoint
After collecting all information, ask: **"Is this step complete and well-executed? Yes/No. If No, provide feedback for refinement within this step only."**

If "No," ask specific clarifying questions based on the feedback until the user confirms "Yes."

## Notes
- Ask questions one at a time to maintain focus
- Adapt follow-up questions based on previous answers
- Don't assume technical knowledge from the user
- Focus on business value and user needs
- Ensure all success metrics are measurable and realistic
