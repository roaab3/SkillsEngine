# Development Session Prompt Template

## Quick Reference Prompt for AI Assistants

Use this prompt when you need to work on or explain the Skills Engine UI improvements:

---

```
I'm working on a Skills Engine application built with Next.js, TypeScript, and Tailwind CSS.

## Current Features Implemented:

### 1. Theme System (Dark/Light Mode)
- React Context API with ThemeContext (`frontend/src/contexts/ThemeContext.tsx`)
- Theme toggle component with sun/moon icons (`frontend/src/components/ThemeToggle.tsx`)
- localStorage persistence for theme preference
- System preference detection on first load
- Tailwind CSS class-based dark mode (`darkMode: 'class'`)
- All components support both themes with `dark:` prefix classes

### 2. Skills Profile Component
- Shows missing skills organized by competency
- Displays skill name and type (L1, L2, L3) only - NO priority levels
- NO recommendations section (skills profile only)
- Skills Overview card with overall gap percentage
- Individual competency cards with missing skills lists
- Empty state when no gaps exist

### 3. Data Structure
- Competencies: Frontend Development (75%), Backend Development (40%)
- Frontend Missing: CSS Grid (L3), TypeScript (L3)
- Backend Missing: Node.js (L2), Express.js (L2), MongoDB (L3), RESTful API Design (L3), Authentication & Authorization (L3)
- Verified Skills: JavaScript, React, HTML/CSS, Git

### 4. Component Data Consistency
- CompetencyCard: Shows skills dynamically based on competency name
- CompetencyDetailModal: Shows same skills with verification status
- SkillGapsPanel: Shows missing skills breakdown
- All components use the same data source (mock data in page.tsx)

## Key Requirements:
- All components MUST support light/dark theme using Tailwind's `dark:` prefix
- Skills have NO priority levels - only name and type
- NO recommendations or learning resources in UI
- Data must be consistent across all components
- Use TypeScript with proper interfaces
- Follow existing code patterns and component structure

## Files to be aware of:
- Theme: `frontend/src/contexts/ThemeContext.tsx`, `frontend/src/components/ThemeToggle.tsx`
- Skills: `frontend/src/components/SkillGapsPanel.tsx`
- Competencies: `frontend/src/components/CompetencyCard.tsx`, `frontend/src/components/CompetencyDetailModal.tsx`
- Data: `frontend/src/app/page.tsx` (mock data)
- Styling: `frontend/src/app/globals.css`, `frontend/tailwind.config.js`

Please help me [DESCRIBE YOUR TASK HERE].
```

---

## Common Tasks - Quick Copy/Paste Prompts

### Adding a New Component with Theme Support
```
Add a new [COMPONENT_NAME] component that:
1. Supports both light and dark themes using Tailwind's dark: prefix
2. Follows the same styling patterns as existing components
3. Uses theme-aware colors: text-gray-900 dark:text-secondary-100
4. Is fully accessible with proper ARIA labels
```

### Updating Skills Data
```
Update the skills data in the mock profile to include:
- [List specific skills]
- Maintain consistency with CompetencyCard and CompetencyDetailModal
- Ensure verified skills match what's shown in competency cards
- Update missing skills to match SkillGapsPanel display
```

### Adding Theme Support to Existing Component
```
Add dark/light mode theme support to [COMPONENT_NAME]:
1. Update all text colors: text-gray-900 dark:text-secondary-100
2. Update backgrounds: bg-white dark:bg-secondary-800
3. Update borders: border-gray-200 dark:border-secondary-700
4. Test both themes work correctly
5. Ensure proper contrast ratios for accessibility
```

### Fixing Data Inconsistency
```
The [COMPONENT_NAME] is showing different data than [OTHER_COMPONENT]:
- Both should show the same competencies/skills
- Check mock data in page.tsx matches component logic
- Ensure competency names are exactly: "Frontend Development" and "Backend Development"
- Verify skill lists match across all views
```

---

## Key Data Points for Reference

### Competency IDs
- Frontend Development: `comp-1`
- Backend Development: `comp-2`

### Skill Types Used
- L1: Basic/Foundation level
- L2: Intermediate level  
- L3: Advanced level

### Progress Percentages
- Frontend Development: 75% (Advanced)
- Backend Development: 40% (Beginner)

### Gap Percentages
- Frontend Development: 25% gap
- Backend Development: 60% gap
- Overall: 42% gap

---

*Last Updated: Current Session*

