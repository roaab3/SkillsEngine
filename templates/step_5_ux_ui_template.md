# Step 5: UX/UI & User Flow Design Template

## Overview
This template focuses on user experience design, information architecture, and user interface requirements. We'll create user flows, wireframes, and design specifications based on the requirements from Step 3.

## Interactive Questions

### User Experience & Information Architecture
**Question 1:** Let's start with your primary user's journey. When they first visit your application, what should they see and do? Walk me through their initial experience.

*[Follow-up: Ask about onboarding, first impressions, and key actions users should take]*

**Question 2:** What's the main workflow users will follow to accomplish their primary goal? Describe each step from start to finish.

*[Follow-up: Ask about decision points, information needed at each step, and potential user confusion]*

**Question 3:** Are there different user types or roles that need different interfaces or workflows? How should their experiences differ?

*[Follow-up: Ask about role-specific features, permissions, and customized views]*

### User Interface & Design
**Question 4:** What's your vision for the overall look and feel? Think about modern, professional, playful, or minimalist styles.

*[Follow-up: Ask about specific design preferences, color schemes, and visual hierarchy]*

**Question 5:** What devices will users primarily use to access your application? Consider desktop, mobile, tablet, or specific screen sizes.

*[Follow-up: Ask about responsive design requirements and device-specific features]*

**Question 6:** Are there any existing applications or websites whose design you admire? What specific elements appeal to you?

*[Follow-up: Ask about specific UI patterns, navigation styles, and interaction methods]*

### Navigation & User Flow
**Question 7:** How should users navigate through your application? What's the main menu structure and page organization?

*[Follow-up: Ask about primary navigation, secondary menus, and user flow between sections]*

**Question 8:** What are the key actions users can take on each page? Think about buttons, forms, and interactive elements.

*[Follow-up: Ask about call-to-action buttons, form layouts, and interactive feedback]*

**Question 9:** How should users access their account settings, profile, or administrative functions? What's the user management flow?

*[Follow-up: Ask about user authentication, profile management, and administrative interfaces]*

### Content & Data Display
**Question 10:** What types of content or data will users view most frequently? How should this information be organized and presented?

*[Follow-up: Ask about data tables, charts, lists, and content organization]*

**Question 11:** How should users search for and filter information? What search capabilities and filters do you need?

*[Follow-up: Ask about search functionality, filter options, and result display]*

**Question 12:** What notifications or alerts should users receive? How should these be displayed and managed?

*[Follow-up: Ask about notification types, display methods, and user control over alerts]*

### Accessibility & Usability
**Question 13:** Do you have any specific accessibility requirements? Consider users with disabilities, different languages, or assistive technologies.

*[Follow-up: Ask about screen reader support, keyboard navigation, and language requirements]*

**Question 14:** What's your expectation for user learning curve? How intuitive should the interface be for new users?

*[Follow-up: Ask about help systems, tutorials, and user guidance requirements]*

**Question 15:** How should the application handle errors or edge cases? What feedback should users receive when things go wrong?

*[Follow-up: Ask about error messages, validation feedback, and recovery guidance]*

### Responsive Design & Cross-Device
**Question 16:** How should the application adapt to different screen sizes? What's your priority for mobile vs. desktop experience?

*[Follow-up: Ask about mobile-specific features, touch interactions, and responsive breakpoints]*

**Question 17:** Are there any features that should work differently on mobile vs. desktop? Consider touch gestures, navigation, and content layout.

*[Follow-up: Ask about mobile-specific interactions, navigation patterns, and content prioritization]*

### Design System & Consistency
**Question 18:** What design elements should be consistent across the application? Think about buttons, forms, colors, and typography.

*[Follow-up: Ask about design tokens, component libraries, and style guidelines]*

**Question 19:** How should the application handle different states? Consider loading, success, error, and empty states.

*[Follow-up: Ask about loading indicators, success messages, and empty state designs]*

## Output Structure

```json
{
  "step": 5,
  "output": {
    "user_experience": {
      "user_journeys": [
        {
          "user_type": "string",
          "journey_name": "string",
          "steps": ["string"],
          "pain_points": ["string"],
          "success_criteria": ["string"]
        }
      ],
      "information_architecture": {
        "main_sections": ["string"],
        "navigation_structure": "string",
        "content_hierarchy": "string",
        "user_flows": ["string"]
      }
    },
    "user_interface": {
      "design_vision": {
        "style": "string",
        "color_scheme": "string",
        "typography": "string",
        "visual_hierarchy": "string"
      },
      "layout_requirements": {
        "primary_device": "string",
        "responsive_breakpoints": ["string"],
        "grid_system": "string",
        "component_layout": "string"
      }
    },
    "interaction_design": {
      "navigation": {
        "main_navigation": "string",
        "secondary_navigation": "string",
        "breadcrumbs": "string",
        "user_menu": "string"
      },
      "user_actions": [
        {
          "action": "string",
          "trigger": "string",
          "feedback": "string",
          "validation": "string"
        }
      ]
    },
    "content_display": {
      "data_presentation": {
        "tables": "string",
        "charts": "string",
        "lists": "string",
        "cards": "string"
      },
      "search_filtering": {
        "search_functionality": "string",
        "filter_options": ["string"],
        "result_display": "string",
        "sorting_options": ["string"]
      }
    },
    "accessibility": {
      "requirements": ["string"],
      "screen_reader_support": "string",
      "keyboard_navigation": "string",
      "color_contrast": "string",
      "language_support": ["string"]
    },
    "responsive_design": {
      "mobile_requirements": ["string"],
      "desktop_requirements": ["string"],
      "touch_interactions": ["string"],
      "cross_device_consistency": "string"
    },
    "design_system": {
      "components": ["string"],
      "design_tokens": ["string"],
      "state_handling": ["string"],
      "consistency_rules": ["string"]
    },
    "wireframes": {
      "key_pages": ["string"],
      "user_flows": ["string"],
      "interaction_patterns": ["string"],
      "layout_specifications": ["string"]
    }
  }
}
```

## Completion Criteria
- [ ] User journeys and flows clearly defined
- [ ] Information architecture and navigation structure established
- [ ] UI design vision and style guidelines specified
- [ ] Interaction patterns and user actions defined
- [ ] Content display and data presentation requirements set
- [ ] Accessibility requirements documented
- [ ] Responsive design requirements specified
- [ ] Design system and consistency rules established
- [ ] Wireframes and layout specifications created
- [ ] All information validated with user

## Validation Checkpoint
After collecting all information, ask: **"Is this step complete and well-executed? Yes/No. If No, provide feedback for refinement within this step only."**

If "No," ask specific clarifying questions based on the feedback until the user confirms "Yes."

## Notes
- Build on functional requirements from Step 3
- Focus on user-centered design principles
- Consider both usability and visual appeal
- Ensure accessibility and inclusive design
- Plan for responsive and cross-device experiences
- Balance user needs with technical feasibility
