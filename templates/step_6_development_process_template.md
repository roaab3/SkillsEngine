# Step 6: Development Process Template

## Overview
This template defines the development methodology, technical stack, and development workflow. We'll establish TDD practices, CI/CD integration, and team collaboration processes based on the requirements from previous steps.

## Interactive Questions

### Development Methodology
**Question 1:** What development approach do you prefer? Consider Agile, Scrum, Kanban, or other methodologies that fit your team and project.

*[Follow-up: Ask about team size, iteration length, and specific practices like daily standups, sprint planning]*

**Question 2:** How do you want to handle project planning and task management? What tools or processes will you use for tracking progress?

*[Follow-up: Ask about project management tools, task breakdown, and progress reporting]*

**Question 3:** What's your team structure? How many developers, designers, and other roles will be involved?

*[Follow-up: Ask about team expertise, roles and responsibilities, and collaboration patterns]*

### Technical Stack & Framework Selection
**Question 4:** What's your preference for the frontend framework? Consider React, Vue, Angular, or other options based on your team's expertise and project needs.

*[Follow-up: Ask about team experience, project complexity, and specific requirements like SSR or mobile support]*

**Question 5:** What backend technology stack do you prefer? Think about Node.js, Python, Java, or other options for your API and business logic.

*[Follow-up: Ask about team expertise, performance requirements, and integration needs]*

**Question 6:** What database solution fits your needs? Consider SQL vs. NoSQL, cloud vs. self-hosted, and specific requirements like real-time data or analytics.

*[Follow-up: Ask about data relationships, scalability needs, and team expertise]*

### State Management & Architecture
**Question 7:** How will you manage application state? Consider Redux, Context API, Zustand, or other state management solutions.

*[Follow-up: Ask about state complexity, data flow patterns, and team preferences]*

**Question 8:** What's your approach to API design and communication? Consider REST, GraphQL, or other patterns for frontend-backend communication.

*[Follow-up: Ask about API complexity, real-time requirements, and team expertise]*

**Question 9:** How will you handle routing and navigation? What routing solution fits your application structure?

*[Follow-up: Ask about single-page app requirements, nested routes, and navigation complexity]*

### Component Architecture & Structure
**Question 10:** How will you organize your codebase? What folder structure and component organization makes sense for your project?

*[Follow-up: Ask about component reusability, team collaboration, and maintenance requirements]*

**Question 11:** What's your strategy for component design and reusability? How will you create a consistent component library?

*[Follow-up: Ask about design system integration, component documentation, and team standards]*

**Question 12:** How will you handle styling and theming? Consider CSS-in-JS, styled-components, Tailwind, or other styling approaches.

*[Follow-up: Ask about design system requirements, theme customization, and team preferences]*

### Testing Strategy & TDD
**Question 13:** What's your testing philosophy? How important is test coverage, and what types of testing do you prioritize?

*[Follow-up: Ask about unit tests, integration tests, e2e tests, and testing tools]*

**Question 14:** How will you implement Test-Driven Development? What's your process for writing tests before code?

*[Follow-up: Ask about TDD workflow, testing tools, and team training needs]*

**Question 15:** What testing tools and frameworks will you use? Consider Jest, Cypress, Playwright, or other testing solutions.

*[Follow-up: Ask about team expertise, testing requirements, and CI/CD integration]*

### Version Control & Branching
**Question 16:** What branching strategy will you use? Consider Git Flow, trunk-based development, or other approaches.

*[Follow-up: Ask about team size, release frequency, and collaboration patterns]*

**Question 17:** How will you handle code reviews and collaboration? What's your process for reviewing and merging code?

*[Follow-up: Ask about review requirements, approval processes, and quality gates]*

**Question 18:** What's your strategy for managing releases and deployments? How will you handle versioning and rollbacks?

*[Follow-up: Ask about release frequency, deployment strategies, and rollback procedures]*

### CI/CD Integration
**Question 19:** What CI/CD platform will you use? Consider GitHub Actions, Jenkins, GitLab CI, or other solutions.

*[Follow-up: Ask about team expertise, integration requirements, and cost considerations]*

**Question 20:** What automated processes do you want in your CI/CD pipeline? Think about testing, building, deploying, and quality checks.

*[Follow-up: Ask about build processes, deployment environments, and quality gates]*

**Question 21:** How will you handle environment management? What environments do you need, and how will you manage configuration?

*[Follow-up: Ask about development, staging, production environments, and configuration management]*

### Code Quality & Standards
**Question 22:** What code quality standards will you enforce? Consider linting, formatting, and code style requirements.

*[Follow-up: Ask about ESLint, Prettier, and other code quality tools]*

**Question 23:** How will you ensure code consistency across the team? What standards and guidelines will you establish?

*[Follow-up: Ask about coding standards, documentation requirements, and team training]*

**Question 24:** What's your strategy for handling technical debt and code maintenance? How will you balance new features with code quality?

*[Follow-up: Ask about refactoring processes, code review focus, and maintenance schedules]*

## Output Structure

```json
{
  "step": 6,
  "output": {
    "development_methodology": {
      "approach": "string",
      "iteration_length": "string",
      "team_structure": "string",
      "collaboration_tools": ["string"]
    },
    "technical_stack": {
      "frontend": {
        "framework": "string",
        "state_management": "string",
        "routing": "string",
        "styling": "string"
      },
      "backend": {
        "language": "string",
        "framework": "string",
        "api_design": "string",
        "authentication": "string"
      },
      "database": {
        "type": "string",
        "hosting": "string",
        "migration_strategy": "string",
        "backup_policy": "string"
      }
    },
    "architecture": {
      "component_structure": "string",
      "folder_organization": "string",
      "api_architecture": "string",
      "data_flow": "string"
    },
    "testing_strategy": {
      "tdd_approach": "string",
      "test_types": ["string"],
      "testing_tools": ["string"],
      "coverage_requirements": "string"
    },
    "version_control": {
      "branching_strategy": "string",
      "code_review_process": "string",
      "merge_requirements": ["string"],
      "release_management": "string"
    },
    "ci_cd": {
      "platform": "string",
      "pipeline_stages": ["string"],
      "automated_processes": ["string"],
      "quality_gates": ["string"]
    },
    "code_quality": {
      "linting_rules": ["string"],
      "formatting_standards": "string",
      "code_review_checklist": ["string"],
      "technical_debt_management": "string"
    },
    "development_workflow": {
      "daily_processes": ["string"],
      "sprint_planning": "string",
      "retrospectives": "string",
      "continuous_improvement": "string"
    }
  }
}
```

## Completion Criteria
- [ ] Development methodology and team structure defined
- [ ] Technical stack selected for frontend, backend, and database
- [ ] Component architecture and code organization established
- [ ] Testing strategy and TDD approach defined
- [ ] Version control and branching strategy established
- [ ] CI/CD pipeline and automated processes defined
- [ ] Code quality standards and review processes established
- [ ] Development workflow and collaboration processes defined
- [ ] All information validated with user

## Validation Checkpoint
After collecting all information, ask: **"Is this step complete and well-executed? Yes/No. If No, provide feedback for refinement within this step only."**

If "No," ask specific clarifying questions based on the feedback until the user confirms "Yes."

## Notes
- Build on requirements from Steps 1-5
- Focus on practical, implementable development processes
- Consider team expertise and project complexity
- Ensure TDD and CI/CD integration from the start
- Balance development speed with code quality
- Plan for scalability and maintainability
