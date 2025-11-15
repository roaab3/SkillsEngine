# Step 4 - UX/UI & User Flow Design

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI  
**Date:** 2025-01-27  
**Phase:** Step 4 - UX/UI & User Flow Design

**Topic:** User interactions and interface  
**Participants:** UX, PO, FSD  
**Dependencies:** Steps 1-2

---

## 📋 Template Structure

This document follows the Step 4 template structure:

1. [Information Architecture](#1-information-architecture)
2. [User Flows](#2-user-flows)
3. [Wireframes](#3-wireframes)
4. [Design System](#4-design-system)
5. [Responsive Behavior](#5-responsive-behavior)
6. [Accessibility](#6-accessibility)
7. [AI UX Patterns](#7-ai-ux-patterns)

---

## 1. Information Architecture

### 1.1 Layout Architecture

**Split-Screen Design:**

The interface uses a smart two-panel layout that maximizes information density while maintaining clarity:

**Left Panel (Main Area - ~70% width):**
- Houses the primary competency cards in a responsive grid
- Provides breathing room for content with generous padding (24px)
- Scrollable to accommodate multiple competencies
- Grid system: 2 columns on desktop, 1 on mobile

**Right Panel (Skills Gap Sidebar - 384px fixed):**
- Persistent visibility of action items
- Independent scroll from main content
- Always-visible progress tracking
- Fixed width: 384px (w-96)
- Background: Solid white/slate-800 (distinct from main area)

**Fixed Header (Top Bar):**
- Spans full width with backdrop blur effect (glassmorphism)
- Height: 80px (comfortable, not cramped)
- Contains branding, CSV upload, and theme toggle
- Remains visible during scroll for constant access to controls
- Semi-transparent with blur (modern, premium feel)

---

### 1.2 Content Structure

**Main Navigation:**
- Dashboard (Home) - Primary view
- Competency Detail Modal - Drill-down view
- Skills Gap Sidebar - Persistent action items
- CSV Upload (Trainer only) - Header action

**Content Hierarchy:**
```
Competency Dashboard
├── Fixed Header
│   ├── Title: "Competency Dashboard"
│   ├── Upload CSV Button (Trainer only)
│   └── Theme Toggle (Light/Dark)
├── Main Content Area (Left Panel ~70%)
│   └── Competency Cards Grid
│       ├── Card 1 (with accent strip, icon, badge, progress)
│       ├── Card 2
│       └── Card N
└── Skills Gap Sidebar (Right Panel 384px)
    ├── Sticky Header (with gradient background)
    │   ├── Icon + "Skills Gap" Title
    │   └── Missing Skills Count
    └── Gap Skill Cards
        ├── Gap Card 1 (numbered, with context)
        └── Gap Card N
```

**Information Priority:**
1. **Primary:** Competency Status, Skills Gap Count
2. **Secondary:** Coverage Percentage, Verified Skills Count
3. **Tertiary:** Detailed Skill Lists, Hierarchical Tree Structure

---

### 1.3 Navigation Patterns

**Primary Navigation:**
- Click competency card → Opens detail modal
- Click "View details →" on card → Opens detail modal
- Click outside modal → Closes modal
- Theme toggle in header → Switches light/dark mode

**Secondary Navigation:**
- Scroll main content → Independent from sidebar
- Scroll sidebar → Independent from main content
- Expand/collapse tree nodes in modal → Reveals hierarchical structure

**Quick Actions:**
- Upload CSV (from header - Trainer only)
- Toggle theme (from header - all users)
- View competency details (click card - all users)

---

### 1.4 Content Organization

**Decisions Made:**

1. **Content Grouping:**
   - Competencies displayed in a 2-column grid (desktop)
   - All competencies visible at once (no pagination)
   - Nested competencies displayed in hierarchical tree structure within modal

2. **Information Density:**
   - Optimal: 2 columns on desktop, 1 on mobile
   - Progressive disclosure: Summary in cards → Full details in modal
   - Collapsed card shows: Title, icon, badge, progress bar, skills count, "View details" link

3. **Search and Filter:**
   - No search functionality in initial version
   - Filtering by proficiency level: Visual (color-coded badges)
   - Sorting: Not implemented in initial version

---

## 2. User Flows

### 2.1 Initial Dashboard View Flow

**Trigger:** User navigates to Competency Dashboard (via secure URL from Directory or direct access)

**Flow:**
1. User lands on Competency Dashboard
2. System loads user profile data (shows skeleton screens during loading)
3. Dashboard displays:
   - Fixed header with title, upload button (Trainer only), theme toggle
   - Left panel: Grid of Competency Cards (2 columns desktop, 1 mobile)
   - Right panel: Skills Gap Sidebar (384px fixed, shows missing skills)
4. User can:
   - View competency details (click card → opens modal)
   - Toggle theme (light/dark mode)
   - Scroll main content and sidebar independently
   - See skills gap count in sidebar header

**Related Features:** Feature 34, Feature 35, Feature 36, Feature 37

---

### 2.2 Competency Detail Modal Flow

**Trigger:** User clicks on a Competency Card or "View details →" link

**Flow:**
1. Modal overlay appears (black 50% opacity, full screen)
2. Modal container animates in (scale + fade, 300ms)
3. Modal displays:
   - Sticky header with competency name, close button, metadata
   - Hierarchical tree structure:
     - Level 0: Competency root (Amber background)
     - Level 1-2: Categories (Green backgrounds)
     - Level 3: Skill groups (Blue backgrounds)
     - Leaf nodes: Individual skills (Green for passed, Red for failed)
   - Legend panel at bottom (explains color coding)
4. User can:
   - Expand/collapse tree nodes (chevron rotates, children animate in)
   - Scroll modal content (header stays sticky)
   - Click outside modal or X button to close
   - See skill status (passed/failed) with icons and percentages

**Related Features:** Feature 35, Feature 38

---

### 2.3 Skills Gap Sidebar Flow

**Trigger:** User views dashboard (sidebar always visible on desktop)

**Flow:**
1. Sidebar displays sticky header with gradient background
2. Shows count of missing skills
3. Lists gap skill cards (numbered, with context):
   - Skill code and name
   - Parent competency indicator
   - Category indicator
   - Progress bar (currently 0%)
4. User can:
   - Scroll sidebar independently from main content
   - See all missing skills at a glance
   - View empty state if all skills mastered (celebration message)

**Related Features:** Feature 37

---

### 2.4 CSV Upload Flow (Trainer Only)

**Trigger:** Trainer clicks "Upload CSV" button in header

**Flow:**
1. Upload interface appears (modal or inline form)
2. System displays upload instructions and rules
3. Trainer selects CSV file (drag-and-drop or file picker)
4. System validates file format (client-side)
5. System shows upload progress (progress bar with percentage)
6. System processes file (parsing, validation, normalization):
   - Shows "AI is analyzing..." message
   - Displays progress steps (e.g., "Step 1 of 3: Extracting skills...")
7. System displays:
   - Upload status (success/error)
   - Validation results
   - Success/error messages
8. Trainer can check upload status

**Related Features:** Feature 30, Feature 31, Feature 32

---

### 2.5 Theme Toggle Flow

**Trigger:** User clicks theme toggle button in header

**Flow:**
1. User clicks Sun/Moon icon (circular button, 40px)
2. All colors, backgrounds, borders, shadows animate (300ms ease-in-out)
3. Icon cross-fades between Sun (light mode) and Moon (dark mode)
4. Entire interface transforms cohesively
5. Preference saved to localStorage
6. Theme persists across sessions

**Related Features:** Design System

---

## 3. Wireframes

### 3.1 Dashboard Layout (Split-Screen)

**Overall Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Fixed Header (80px, backdrop blur, full width)             │
│ "Competency Dashboard"  [Upload CSV] [Theme Toggle]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Left Panel (~70%)          │  Right Panel (384px fixed)  │
│  ┌─────────────────────┐   │  ┌─────────────────────────┐ │
│  │                     │   │  │ Skills Gap (Sticky)     │ │
│  │  ┌──────┐ ┌──────┐ │   │  │ [Gradient Header]      │ │
│  │  │Card 1│ │Card 2│ │   │  │ Icon + Title + Count    │ │
│  │  └──────┘ └──────┘ │   │  ├─────────────────────────┤ │
│  │                     │   │  │ ┌─────────────────────┐ │ │
│  │  ┌──────┐ ┌──────┐ │   │  │ │ Gap Card #1        │ │ │
│  │  │Card 3│ │Card 4│ │   │  │ │ [Number] [Details]  │ │ │
│  │  └──────┘ └──────┘ │   │  │ └─────────────────────┘ │ │
│  │                     │   │  │ ┌─────────────────────┐ │ │
│  │  (Scrollable)       │   │  │ │ Gap Card #2        │ │ │
│  │                     │   │  │ │ [Number] [Details]  │ │ │
│  │                     │   │  │ └─────────────────────┘ │ │
│  │                     │   │  │ (Scrollable)             │ │
│  └─────────────────────┘   │  └─────────────────────────┘ │
│                             │                              │
└─────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **Fixed Header:**
  - Title: "Competency Dashboard" (left, 2xl, bold)
  - Upload CSV Button (right, emerald/teal accent)
  - Theme Toggle (right, circular, 40px)
  
- **Left Panel (Main Content):**
  - Grid: 2 columns on desktop, 1 on mobile
  - Gap: 24px between cards
  - Padding: 24px around grid
  - Scrollable content area
  
- **Right Panel (Skills Gap Sidebar):**
  - Fixed width: 384px
  - Sticky header with gradient background
  - Scrollable gap cards list
  - Independent scroll from main content

---

### 3.2 Competency Card Component

**Card Structure (Detailed):**
```
┌─────────────────────────────────────────────┐
│ [Accent Strip - 1px, competency color]    │
├─────────────────────────────────────────────┤
│ ┌──────┐  Full Stack Development  [ADVANCED]│
│ │ Icon │  (1.25rem, bold)        (Pill badge)│
│ │Circle│                                      │
│ │48px  │                                      │
│ └──────┘                                      │
│                                               │
│ Description text (0.875rem, muted, 1-2 lines)│
│                                               │
│ Progress Bar:                                │
│ ┌─────────────────────────────────────────┐ │
│ │████████████████░░░░░░░░░░░░░░░░░░░░░░░│ │
│ └─────────────────────────────────────────┘ │
│ 12px height, rounded-full, animated fill     │
│                                               │
│ Footer:                                      │
│ "15/20 skills mastered"  "View details →"   │
│ (0.875rem)              (accent color, bold) │
└─────────────────────────────────────────────┘
```

**Card Anatomy (Top to Bottom):**

1. **Accent Strip (1px height):**
   - Full-width color bar
   - Uses competency's primary color
   - Immediate visual categorization

2. **Card Header (Flexbox row):**
   - **Left: Icon Circle (48px diameter)**
     - Background: Competency color at 20% opacity + backdrop blur
     - Icon: 28px, solid color matching competency
     - Appears to glow from within
   
   - **Right: Level Badge (Pill shape)**
     - Uppercase, bold, 0.75rem
     - Padding: 16px horizontal, 6px vertical
     - Colors by achievement level:
       - Expert (90%+): Purple tones
       - Advanced (75-89%): Blue tones
       - Intermediate (60-74%): Green tones
       - Beginner (40-59%): Yellow tones
       - Novice (<40%): Red tones

3. **Content Section:**
   - **Title:** 1.25rem (xl), bold (600-700 weight)
   - **Description:** 0.875rem (sm), muted color, 1-2 lines

4. **Progress Visualization:**
   - **Container:** 12px height, rounded-full, shadow-inner
   - **Fill Bar:** Dynamic width, competency color, animated (700ms)
   - **Special Effect:** Pulsing white overlay gradient

5. **Footer Metrics:**
   - **Left:** "X/Y skills mastered" (0.875rem)
   - **Right:** "View details →" (accent color, bold, arrow shifts on hover)

**Card Interaction States:**
- **Resting:** Shadow-lg, border, clean appearance
- **Hover (300ms):**
  - Lifts up 8px (translate-y-2)
  - Shadow expands to 2xl
  - Shimmer sweeps left-to-right (1000ms)
  - Cursor: pointer
  - Arrow shifts right (2px gap increase)

---

### 3.3 Skills Gap Sidebar

**Sidebar Structure:**
```
┌─────────────────────────────────┐
│ Sticky Header (Gradient)       │
│ ┌─────┐ Skills Gap             │
│ │Icon │ "12 skills missing"     │
│ └─────┘                         │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐│
│ │ [1] MGS 4.1.2                ││
│ │     Skill Name               ││
│ │     • Competency: Frontend   ││
│ │     • Category: L3.1        ││
│ │     Progress: 0% [████░░░░]  ││
│ └─────────────────────────────┘│
│ ┌─────────────────────────────┐│
│ │ [2] MGS 4.1.3                ││
│ │     Skill Name               ││
│ │     • Competency: Backend    ││
│ │     • Category: L3.2        ││
│ │     Progress: 0% [████░░░░]  ││
│ └─────────────────────────────┘│
│ (Scrollable)                    │
└─────────────────────────────────┘
```

**Sticky Header:**
- **Background Gradient:**
  - Light: Red-50 → Orange-50
  - Dark: Red-900 → Orange-900
- **Content:**
  - Icon (AlertCircle) in colored circle (24px)
  - Title: "Skills Gap" (1.5rem, bold)
  - Subtitle: Count of missing skills (0.875rem, muted)

**Gap Skill Cards:**
- **Number Badge:** Circle (32px), red-500/700, white number
- **Content Area:**
  - Skill Code: Bold, prominent (e.g., "MGS 4.1.2")
  - Skill Name: Regular weight
  - Competency Indicator: Colored dot + name
  - Category Indicator: Blue dot + category name
  - Progress Section: Label + 0% + progress bar (6px height)
- **Styling:**
  - Background: Gradient white→red-50 or slate-700→red-900
  - Border: Red-tinted
  - Rounded: xl corners
  - Padding: 16px

**Empty State:**
- Large CheckCircle2 icon (64px, green)
- "All skills mastered!" (bold, large, green)
- "Congratulations! 🎉" (subtext)

---

### 3.4 Competency Detail Modal

**Modal Structure:**
```
┌─────────────────────────────────────────────────┐
│ Overlay (Black 50% opacity, full screen)      │
│                                                 │
│         ┌─────────────────────────────────┐   │
│         │ Modal Container (max-w-4xl)      │   │
│         │ ┌─────────────────────────────┐ │   │
│         │ │ Sticky Header               │ │   │
│         │ │ Title + Close [X]          │ │   │
│         │ │ Metadata + Stats            │ │   │
│         │ ├─────────────────────────────┤ │   │
│         │ │ Tree Structure (Scrollable) │ │   │
│         │ │                             │ │   │
│         │ │ [Amber] Competency Root     │ │   │
│         │ │   [Green] Category L1      │ │   │
│         │ │     [Green] Category L2     │ │   │
│         │ │       [Blue] Skill Group    │ │   │
│         │ │         [✓] Skill (100%)    │ │   │
│         │ │         [✗] Skill (0%)      │ │   │
│         │ │                             │ │   │
│         │ ├─────────────────────────────┤ │   │
│         │ │ Legend Panel                │ │   │
│         │ │ [Color squares + labels]    │ │   │
│         │ └─────────────────────────────┘ │   │
│         └─────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**Modal Components:**

1. **Overlay:**
   - Black at 50% opacity
   - Fixed full-screen
   - Click outside closes modal

2. **Modal Container:**
   - Max-width: 896px (4xl)
   - Max-height: 90vh
   - Centered both axes
   - Background: White/Slate-800
   - Rounded: 2xl corners
   - Shadow: 3xl
   - Overflow: Auto scroll

3. **Sticky Header:**
   - Position: Sticky top-0
   - Competency name (2xl, bold)
   - Close button (X icon, 24px, top-right)
   - Metadata: Description + statistics

4. **Tree Structure:**
   - **Level 0 (Root - Competency):** Amber backgrounds
   - **Level 1 (Main Categories):** Green backgrounds
   - **Level 2 (Sub-categories):** Green backgrounds
   - **Level 3 (Skill Groups):** Blue backgrounds
   - **Leaf Nodes (Skills):**
     - Passed (100%): Green + CheckCircle2
     - Failed (0%): Red + XCircle

5. **Legend Panel:**
   - Bottom of modal
   - 2-column grid
   - Color squares (16×16px) + labels
   - Explains color coding system

**Layout Structure:**
```
┌─────────────────────────────────────────────────┐
│ Skill Gaps                                      │
│ Relevance Score: 85% | Career: Full Stack Dev  │
├─────────────────────────────────────────────────┤
│                                                 │
│ Frontend Development                            │
│ ┌───────────────────────────────────────────┐ │
│ │ Missing Skills (5):                        │ │
│ │ • React Context API                        │ │
│ │ • Redux State Management                   │ │
│ │ • Next.js Routing                          │ │
│ │ • Webpack Configuration                    │ │
│ │ • TypeScript Advanced Types                │ │
│ │                                             │ │
│ │ [Find Courses →]                           │ │
│ └───────────────────────────────────────────┘ │
│                                                 │
│ Backend Development                             │
│ ┌───────────────────────────────────────────┐ │
│ │ Missing Skills (3):                        │ │
│ │ • GraphQL API Design                       │ │
│ │ • Microservices Architecture               │ │
│ │ • Docker Containerization                  │ │
│ │                                             │ │
│ │ [Find Courses →]                           │ │
│ └───────────────────────────────────────────┘ │
│                                                 │
│ [← Back to Dashboard]                          │
└─────────────────────────────────────────────────┘
```

---

### 3.5 CSV Upload Interface

**Upload Flow:**
- Triggered from header "Upload CSV" button
- Modal or inline form (TBD)
- Drag-and-drop area with visual feedback
- File picker button
- Upload progress indicator
- Status messages (success/error)
- Validation feedback

**Layout Structure:**
```
┌─────────────────────────────────────────────────┐
│ Upload Custom Skills                            │
├─────────────────────────────────────────────────┤
│                                                 │
│ Instructions & Rules:                          │
│ ┌───────────────────────────────────────────┐ │
│ │ • CSV format requirements                 │ │
│ │ • Hierarchical structure explanation       │ │
│ │ • File size limits                        │ │
│ │ • Required fields                         │ │
│ │ • Example CSV structure                   │ │
│ │ • Common errors to avoid                 │ │
│ └───────────────────────────────────────────┘ │
│                                                 │
│ Upload Area:                                    │
│ ┌───────────────────────────────────────────┐ │
│ │                                           │ │
│ │     Drag & Drop CSV File Here            │ │
│ │                                           │ │
│ │              or                           │ │
│ │                                           │ │
│ │        [Browse Files]                     │ │
│ │                                           │ │
│ └───────────────────────────────────────────┘ │
│                                                 │
│ [Upload] [Cancel]                              │
│                                                 │
│ Status: [Processing...] 75%                     │
└─────────────────────────────────────────────────┘
```

---

### 3.6 Questions for UX/PO/FSD:

1. **Layout Preferences:**
   - Should the Relevance Score widget be fixed/sticky or scroll with content?
   - Should competency cards use a masonry layout or fixed grid?
   - Do we need a sidebar navigation or top navigation bar?

2. **Visual Hierarchy:**
   - What should be the most prominent element on the dashboard?
   - How should we visually distinguish between verified and unverified skills?
   - Should proficiency levels use color coding, badges, or both?

3. **Empty States:**
   - How should we display the dashboard when a user has no competencies yet?
   - What should the gap analysis page show when there are no missing skills?
   - Should we show onboarding tooltips for first-time users?

---

## 4. Design System

### 4.1 Color Philosophy

The design employs a **dark emerald/teal color palette** that conveys professionalism, growth, and technology.

**Light Mode:**
- **Background:** Subtle gradient from gray-50 to gray-100
- **Cards:** Pure white with gradient to gray-50
- **Primary Accent:** Emerald-600 (`#059669`) - rich, professional green
- **Text Hierarchy:** 
  - Primary: Gray-800 (`#1F2937`)
  - Secondary: Gray-600 (`#4B5563`)
  - Tertiary: Gray-400 (`#9CA3AF`)
- **Borders:** Gray-200 (`#E5E7EB`) - delicate, defined but not harsh

**Dark Mode:**
- **Background:** Deep slate-900 (`#0F172A`) - true dark, not pure black
- **Cards:** Gradient from slate-800 to slate-900 (`#1E293B` → `#0F172A`)
- **Primary Accent:** Teal-500 (`#14B8A6`) - vibrant yet soothing
- **Text Hierarchy:**
  - Primary: Gray-100 (`#F3F4F6`) - crisp
  - Secondary: Gray-400 (`#9CA3AF`) - readable
  - Tertiary: Gray-500 (`#6B7280`) - subtle
- **Borders:** Slate-700 (`#334155`) - visible structure without harshness

**Proficiency Level Colors:**
- **Expert (90%+):** Purple tones (mastery, wisdom)
- **Advanced (75-89%):** Blue tones (`#3B82F6`) - competence, trust
- **Intermediate (60-74%):** Green tones (`#10B981`) - growth, progress
- **Beginner (40-59%):** Yellow tones (`#F59E0B`) - caution, learning
- **Novice (<40%):** Red tones (`#EF4444`) - attention needed

**Status Colors:**
- **Success:** Green (`#10B981`)
- **Warning:** Yellow (`#F59E0B`)
- **Error:** Red (`#EF4444`)
- **Info:** Blue (`#3B82F6`)

**Skills Gap Colors:**
- **Light Mode:** Red-50 → Orange-50 gradient (warm, attention-grabbing)
- **Dark Mode:** Red-900 → Orange-900 gradient (intense but not harsh)
- **Gap Cards:** Red-tinted borders and backgrounds

---

### 4.2 Typography

**Font Family:**
- Primary: System font stack (San Francisco, Segoe UI, Roboto)
- Monospace: For code/technical terms

**Font Sizes:**
- H1 (Page Title): 32px / 2rem
- H2 (Section Title): 24px / 1.5rem
- H3 (Card Title): 20px / 1.25rem
- Body: 16px / 1rem
- Small: 14px / 0.875rem
- Caption: 12px / 0.75rem

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

### 4.3 Spacing System

**Base Unit:** 8px

**Spacing Scale:**
- XS: 4px (0.5rem)
- SM: 8px (1rem)
- MD: 16px (2rem)
- LG: 24px (3rem)
- XL: 32px (4rem)
- XXL: 48px (6rem)

**Component Spacing:**
- Card padding: 16px (MD)
- Card gap: 24px (LG)
- Section margin: 32px (XL)

---

### 4.4 Icons

**Icon Library:** Lucide React (or similar modern icon library)

**Key Icons:**
- **CheckCircle2:** Verified/mastered skills (green)
- **XCircle:** Failed/missing skills (red)
- **ChevronDown/ChevronRight:** Expand/collapse tree nodes
- **AlertCircle:** Skills gap indicator
- **Upload:** CSV upload button
- **Sun/Moon:** Theme toggle
- **ArrowRight:** "View details" link
- **Circle:** Number badges in gap cards

**Icon Sizes:**
- Small: 16px (inline text)
- Medium: 24px (buttons, headers)
- Large: 48px (card icons)
- Extra Large: 64px (empty states)

---

### 4.5 Design Principles Applied

1. **Glassmorphism Elements:**
   - Header uses backdrop blur with transparency
   - Creates floating, modern appearance
   - Maintains readability over dynamic content

2. **Neumorphism Hints:**
   - Soft shadows create tactile depth
   - Cards appear to lift off the surface
   - Hover states enhance this dimensional effect

3. **Gradient Mastery:**
   - Cards use subtle gradients for visual interest
   - Progress bars have animated gradient fills
   - Shimmer effects add premium polish

4. **Consistent Elevation System:**
   - Level 0: Page background
   - Level 1: Cards (shadow-lg)
   - Level 2: Hover states (shadow-2xl)
   - Level 3: Modal overlays (shadow-3xl)

---

### 4.6 Component Specifications

**Competency Card Component:**
- Props: competencyId, competencyName, proficiencyLevel, coveragePercentage, verifiedSkillsCount, totalMgsCount, verifiedSkills, missingSkills
- States: Collapsed, Expanded, Loading, Error
- Interactions: Click to expand/collapse, hover for tooltip

**Relevance Score Widget:**
- Props: score (0-100), careerPathGoal, lastUpdated
- Visual: Circular or linear progress indicator, large number display
- Animation: Smooth count-up on load, update animation on change

**Gap Analysis Component:**
- Props: userId, gapAnalysisType, missingSkillsMap, careerPathGoal, courseName
- Layout: Accordion-style competency sections, expandable/collapsible

**CSV Upload Component:**
- Props: userId, userRole, onUploadSuccess, onUploadError
- States: Initial, File Selected, Uploading, Processing, Success, Error

---

### 4.6 Questions for UX/PO/FSD:

1. **Brand Alignment:**
   - Should the color palette align with EduCora AI brand colors?
   - Do we have existing design system guidelines to follow?
   - Should we use a specific icon library that's already in use?

2. **Visual Style:**
   - Should we use a flat design or material design approach?
   - Do we need shadows/elevation for cards?
   - Should we use rounded corners or sharp edges?

3. **Component Reusability:**
   - Should components be shared with other microservices?
   - Do we need to match the design of Directory microservice?
   - Should we create a component library for the platform?

---

## 5. Responsive Behavior

### 5.1 Breakpoint Strategy

**Mobile (< 768px):**
- Cards: 1 column, full width
- Sidebar: Hidden or convert to bottom drawer
- Header: Smaller padding, potentially stacked items
- Font sizes: Slightly reduced
- Touch targets: Minimum 44px
- Grid: `grid-cols-1`

**Tablet (768px - 1023px):**
- Cards: 1-2 columns depending on space
- Sidebar: Reduced width (320px) or hidden
- Header: Full controls visible
- Optimal for portrait tablets
- Grid: `grid-cols-1` or `grid-cols-2`

**Desktop (≥ 1024px):**
- Cards: 2 columns (optimal scanning)
- Sidebar: Full 384px width
- All features visible
- Generous spacing (24px gaps)
- Grid: `lg:grid-cols-2`

---

### 5.2 Adaptive Elements

**Grid System:**
- Mobile: `grid-cols-1`
- Desktop: `lg:grid-cols-2`

**Spacing:**
- Mobile: Reduced gaps (16px)
- Desktop: Comfortable gaps (24px)

**Typography:**
- Mobile: Slightly smaller base size
- Desktop: Full-size hierarchy

**Sidebar:**
- Mobile: Hidden or toggle-able drawer
- Desktop: Always visible (384px fixed)

**Header:**
- Mobile: Potentially stacked layout
- Desktop: Horizontal flex layout

---

### 5.5 Questions for UX/PO/FSD:

1. **Device Priority:**
   - What is the primary device users will access this on?
   - Should we prioritize mobile-first or desktop-first design?
   - Do we need to support tablet-specific optimizations?

2. **Touch vs. Mouse:**
   - Should interactions differ between touch and mouse?
   - Do we need different hover states for touch devices?
   - Should we support gesture-based navigation?

3. **Orientation:**
   - Should we support landscape mode on mobile?
   - Do we need different layouts for portrait vs. landscape?
   - Should we lock orientation for certain views?

---

## 6. Accessibility

### 6.1 WCAG Level

**Target:** WCAG 2.1 Level AA

---

### 6.2 Keyboard Navigation

**Enabled:** Yes

**Implementation:**
- All interactive elements keyboard accessible
- Logical tab order
- Focus indicators visible (minimum 2px outline)
- Skip links for main content
- Focus trap in modals
- Keyboard shortcuts for common actions:
  - `Tab` - Navigate forward
  - `Shift+Tab` - Navigate backward
  - `Enter/Space` - Activate button/link
  - `Escape` - Close modal/collapse expanded card
  - `Arrow keys` - Navigate within lists/grids

---

### 6.3 Screen Reader Support

**Enabled:** Yes

**Implementation:**
- Semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`)
- ARIA labels for icons and buttons
- ARIA roles and properties:
  - `role="button"` for clickable elements
  - `aria-expanded` for expandable cards
  - `aria-label` for icon-only buttons
  - `aria-live` for dynamic content updates
- Alt text for images and icons
- Descriptive link text (avoid "click here")
- Form labels associated with inputs
- Error messages associated with form fields

---

### 6.4 Color Contrast

**Requirements:**
- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio
- Focus indicators: Minimum 3:1 ratio

**Verification:**
- All color combinations tested with contrast checker
- Color not used as sole indicator (e.g., verified skills use checkmark + color)

---

### 6.5 Additional Accessibility Features

- **Reduced Motion:** Respect `prefers-reduced-motion` media query
- **Text Scaling:** Support up to 200% zoom without horizontal scrolling
- **Focus Management:** Maintain focus context during navigation
- **Error Prevention:** Confirmation dialogs for destructive actions
- **Time Limits:** No time limits on user interactions

---

### 6.6 Questions for UX/PO/FSD:

1. **Accessibility Priorities:**
   - Are there specific accessibility requirements beyond WCAG AA?
   - Do we need to support specific assistive technologies?
   - Should we provide an accessibility statement/page?

2. **Testing:**
   - Should we conduct user testing with assistive technology users?
   - Do we need automated accessibility testing tools?
   - Should we provide accessibility documentation for developers?

3. **Internationalization:**
   - Do we need to support RTL (right-to-left) languages?
   - Should we support multiple languages from the start?
   - Do we need to consider text expansion for translations?

---

## 7. AI UX Patterns

### 7.1 Loading States

**Pattern:** Skeleton screens with animated shimmer effect

**Implementation:**
- Show placeholder cards while loading profile data
- Maintain layout structure during loading
- Animated shimmer effect to indicate loading
- Progress indicators for:
  - Quick operations (< 2s): Spinner
  - Longer operations (> 2s): Progress bar with percentage
  - Upload operations: Progress bar with file size and percentage

**AI-Specific Loading:**
- When AI is processing (normalization, mapping, extraction):
  - Show "AI is analyzing..." message
  - Display estimated time remaining (if available)
  - Allow cancellation for long-running operations
  - Show progress steps (e.g., "Step 1 of 3: Extracting skills...")

**Skeleton Screen Design:**
- Match actual card structure
- Animated shimmer gradient (transparent → white/5% → transparent)
- Smooth, subtle animation (1000ms loop)

---

### 7.2 Error Handling

**Pattern:** Clear, actionable error messages with recovery options

**Implementation:**
- **Error Types:**
  - Network errors: "Unable to load profile. Please check your connection and try again."
  - Validation errors: "The uploaded file contains invalid data. Please check the format and try again."
  - AI processing errors: "AI processing failed. Please try again or contact support."
  - Permission errors: "You don't have permission to perform this action."

- **Error Display:**
  - Visual error indicators (red border, error icon)
  - Error message in plain language
  - Suggestions for resolution
  - Retry button where applicable
  - Error code for support (if needed)

- **AI-Specific Errors:**
  - If AI normalization fails: "Unable to process skills. Please check the format and try again."
  - If AI extraction fails: "Unable to extract skills from your data. Please verify the input format."
  - If AI mapping fails: "Unable to map skills to competencies. Please try again or upload manually."

---

### 7.3 Animation & Motion Design

**Philosophy:**
Motion is purposeful, not decorative. Every animation serves to:
1. Guide attention
2. Provide feedback
3. Establish hierarchy
4. Create delight

**Animation Inventory:**

1. **Theme Toggle (300ms):**
   - All colors, backgrounds, borders, shadows animate
   - Easing: ease-in-out
   - Icon: Smooth cross-fade between Sun/Moon

2. **Card Hover (300ms):**
   - Transform: translateY(-8px) - lifts off surface
   - Shadow: lg → 2xl - dramatic depth increase
   - Cursor: auto → pointer
   - **Shimmer (1000ms):**
     - Gradient sweep animation
     - Transform: translateX(-100% to 100%)
     - Runs once per hover

3. **Progress Bar Fill (700ms):**
   - Property: width (0% → actual percentage)
   - Easing: ease-out
   - Additional: Pulsing overlay gradient
   - Creates living, breathing progress indicator

4. **Modal Appearance:**
   - Overlay: Fade in (opacity 0 → 0.5, 200ms)
   - Modal: Scale up (0.95 → 1) + Fade in (opacity 0 → 1, 300ms)
   - Exit: Reverse animations (250ms)

5. **Tree Node Expand/Collapse:**
   - Chevron: Rotate 0° ↔ 90° (200ms)
   - Children: Height animation + Opacity fade + Slide down
   - Stagger: 50ms delay per child

6. **Upload Button Hover:**
   - Scale: 1 → 1.05 (150ms)
   - Shadow: lg → xl (150ms)
   - Icon: Subtle bounce (400ms)

7. **Arrow Icon Movement:**
   - Gap increase: 1 → 2 (spacing grows by 0.25rem)
   - Duration: 200ms
   - Easing: ease-out
   - Trigger: Card hover

8. **Badge Pulse (Achievement levels):**
   - Subtle scale: 1 → 1.02 → 1
   - Duration: 2000ms (slow, breathing)
   - Repeat: Infinite
   - Draws eye to status

**Reduced Motion:**
- Respect `prefers-reduced-motion` media query
- Disable animations for users who prefer reduced motion
- Maintain functionality without animations

---

### 7.4 Feedback Mechanisms

**Pattern:** Immediate feedback for user actions with clear success/error states

**Implementation:**
- **Success Feedback:**
  - Toast notifications for successful actions (auto-dismiss after 3-5 seconds)
  - Visual confirmation (checkmark animation)
  - Brief success message
  - Success state in UI (e.g., verified skill checkmark appears)

- **Progress Feedback:**
  - Real-time progress updates for uploads
  - Status messages for AI processing steps
  - Estimated time remaining (when available)
  - Percentage completion for long operations

- **Validation Feedback:**
  - Inline validation for form inputs
  - Real-time feedback during CSV upload
  - Clear indication of what needs to be fixed
  - Highlighting of problematic fields

- **AI-Specific Feedback:**
  - "AI is analyzing your skills..." during extraction
  - "Normalizing skill names..." during normalization
  - "Mapping skills to competencies..." during mapping
  - "Processing complete!" when AI operations finish
  - Show AI confidence scores (if applicable)

---

### 7.4 Questions for UX/PO/FSD:

1. **AI Transparency:**
   - Should we show users when AI is being used?
   - Do we need to display AI confidence scores?
   - Should we allow users to review/edit AI-generated results?

2. **AI Error Recovery:**
   - What should happen if AI processing fails?
   - Should we provide fallback manual options?
   - Do we need to log AI errors for improvement?

3. **AI Feedback Timing:**
   - How quickly should we provide feedback for AI operations?
   - Should we show intermediate results as AI processes?
   - Do we need to support cancellation of AI operations?

4. **User Trust:**
   - How do we build trust in AI-generated results?
   - Should we show the source of AI recommendations?
   - Do we need to explain how AI decisions are made?

---

## Next Steps

**Pending Decisions:**
- [ ] Information Architecture: Content grouping and organization preferences
- [ ] User Flows: Flow variations and error recovery strategies
- [ ] Wireframes: Layout preferences and visual hierarchy
- [ ] Design System: Brand alignment and visual style
- [ ] Responsive Behavior: Device priority and interaction patterns
- [ ] Accessibility: Additional requirements and testing approach
- [ ] AI UX Patterns: Transparency, error recovery, and feedback timing

**Review Required:**
- UX Designer: Wireframes and design system
- Product Owner: User flows and information architecture
- Full Stack Developer: Technical feasibility and implementation approach

---

**Last Updated:** 2025-01-27  
**Status:** In Progress - Awaiting stakeholder input
