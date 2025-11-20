# Step 4: UX/UI & User Flow Design

**Project:** Skills Engine Microservice  
**Platform:** EduCora AI (11 microservices)  
**Date:** 2025-11-19  
**Status:** Draft

---

## 1. Scope & Objectives

- Translate Step 3 feature specifications into concrete UX flows, screen definitions, and interaction models for Skills Engine internal surfaces.  
- Ensure every UI touchpoint (primarily Trainer-facing and Operations-facing) aligns with linked Functional Requirements (FR 5.x) and Feature dependencies (Features 1–9).  
- Map background automation (AI extraction, initialization workflows, Unified Data Exchange Protocol routing) to observable UI telemetry, so operators can trust and debug the system.  
- Provide a reference for future wireframes/high-fidelity designs by detailing states, components, and data exchanged per step.

---

## 2. Personas & Access Context

**Note:** All users (employees and trainers) access the same Skills Engine Dashboard using the unified endpoint `/api/user/{user_id}/profile`. The system checks the `employee_type` field from the basic profile to conditionally render UI elements. Both user types see the same competency dashboard with cards and modal overlay.

| Persona | Entry Surface | Primary Goals | Permissions |
| --- | --- | --- | --- |
| **Employee / Learner** | Skills Engine Dashboard (same route for all users) | Inspect owned competencies, drill into coverage & gaps, understand missing MGS | Read-only profile + gap data. UI hides trainer-specific features based on `employee_type = "regular"` |
| **Trainer** | Skills Engine Dashboard & Imports (same route, UI adapts based on `employee_type`) | Upload custom taxonomy CSV, review import outcomes, monitor duplicates, review own competencies | Upload CSV, view import history, read competencies. UI shows trainer-specific features (CSV upload button, Trainer Imports nav) based on `employee_type = "trainer"` |
| **RAG / Chatbot MS** | Unified Data Exchange Protocol (`POST /api/fill-content-metrics/`) | Retrieve normalized taxonomy & gap data for conversational experiences | Authenticated API client |
| **Learning Analytics MS** | Unified Data Exchange Protocol (`POST /api/fill-content-metrics/`) | Pull verified profiles, coverage metrics, and gap analyses for analytics workloads | Authenticated API client |
| **Other Microservices (Directory, Assessment, Course Builder, Content Studio, Learner AI)** | Unified Data Exchange Protocol (`POST /api/fill-content-metrics/`) | Programmatic interactions (no UI) | Authenticated API client |

---

## 3. Global UX Principles

- **Unified Profile Access:** All users (employees and trainers) access the same endpoint `/api/user/{user_id}/profile` which returns the complete profile including `basic_profile.employee_type`. The frontend checks this field to conditionally render UI elements—no separate endpoints or routes needed.
- **Role-gated surfaces:** UI controls rendered only when `employee_type` from the basic profile allows them (per Feature 7.1). For example, CSV upload button and Trainer Imports navigation item are shown only when `employee_type === "trainer"`. The underlying API routes (`/api/competencies/import*`) are part of competency management, with access controlled by `employee_type` validation.
- **State transparency:** Every automated pipeline (Features 9.1–9.7, Feature 5) emits visible statuses, timestamps, and last payload summaries.  
- **Single-source-of-truth:** UI reflects canonical tables (skills, competencies, user_profiles) to avoid dual data entry. The unified profile endpoint provides all necessary data in one response.
- **Recovery-first messaging:** Each error modal guides users to the next actionable step (retry upload, download error CSV, trigger external discovery).  
- **Consistency with Unified Protocol:** Terms used in UI mirror API payload keys (e.g., `missing_mgs`, `requester_service`) to reduce cognitive load.
- **Backend-only AI pipelines:** Features 6.1, 8.1, 9.1, 9.2, and 9.5 remain headless; their telemetry is consumed via infrastructure logs/alerting rather than bespoke UI.

---

## 4. Application Shell & Navigation

1. **Header:** System name, environment badge (Dev/Staging/Prod), global search (skills/competencies/users), user avatar menu.  
2. **Left Navigation:**  
   - Dashboard (competency cards for Employees/Trainers + system health)  
   - Taxonomy Workspace  
   - Trainer Imports  
   - User Profiles  
   - Gap Analysis  
3. **Right Utility Rail:** Job queue status, active alerts, quick links to Unified Protocol docs.  
4. **Footer:** Timestamp of last sync, link to audit logs.

---

## 5. Primary User Journeys

### 5.1 Competency & Skill Import Journey (Features 7.1–7.3, 9.7)

- **Entry Point:** 
  - **For Trainers (`employee_type === "trainer"`):** 
    - CSV Upload button appears in Dashboard header (right side, next to theme toggle)
    - "Trainer Imports" navigation item visible in left nav
    - Both elements conditionally rendered based on `basic_profile.employee_type` from API response
  - **For Regular Users (`employee_type === "regular"`):** 
    - CSV Upload button is NOT rendered (hidden from DOM)
    - "Trainer Imports" navigation item is NOT visible
  - The underlying API routes are part of competency management (`/api/competencies/import*`), not separate trainer routes. Backend validates `employee_type = "trainer"` before allowing access.  
- **Screen Sequence:**  
  1. Import Overview (list of previous uploads)  
  2. Upload Modal (drag-and-drop + file picker)  
  3. Validation & Processing Panel (real-time status)  
  4. Results Drawer (summary, duplicates, inserted items)  
- **Flow:**  
  1. Trainer opens modal, reads CSV template guidelines.  
  2. Selects file; client validates type/size before enabling Upload.  
  3. Upon submit, UI shows progress bar tied to backend upload.  
  4. After upload → Feature 7.2 triggers; backend processes the file and returns results directly or provides status updates through the same endpoint.  
  5. Completion view displays metrics: competencies added, skills added, duplicates skipped, errors.  
  6. If duplicates detected, trainer can download a "Conflict Report" CSV.  
  7. Feature 9.7 recalculations update Taxonomy Workspace badges (e.g., "New" tags on competencies).  
- **Edge Cases:** Unauthorized user sees info banner explaining trainer-only access; failed validation surfaces specific threat reason with link to docs.  
- **Data & APIs:** Upload uses `/api/competencies/import` endpoint (part of competency routes, not separate trainer routes). Results are returned directly from the upload endpoint. Backend validates `employee_type = "trainer"` before allowing access.

### 5.2 Employee & Trainer Skill Profile Journey (Features 2.x, 3.x, 4.x, 5, 8.1, 8.2, 8.6)

- **Entry Point:** Both Employees and Trainers land on the Dashboard which lists competency cards for the active user profile; Ops can impersonate via "User Profiles".  
- **Screen Sequence:**  
  1. Competency Card Grid (per competency card shows level, coverage %, mastered/total skills).  
  2. Card Modal overlay (full-screen) with expandable hierarchy tree and MGS gap legend.  
  3. Profile Detail view with tabs: Overview, Raw Data, AI Extraction, Verification History, Gap Analysis.  
  4. Side Panel for Unified Protocol traffic (shows latest Directory/Assessment payloads for Ops/Admin).  
- **Flow:**  
  1. Directory MS sends user data via Unified Protocol → Feature 2.1 writes to DB (status shown as "Profile Created").  
  2. Feature 2.2 AI extraction job status shown under "AI Processing" timeline with prompt version and Gemini model.  
  3. Feature 2.3 normalization results update "Normalized Skills" table; duplicates flagged inline.  
  4. Feature 2.4 receives normalized JSON from Feature 2.3, looks up taxonomy IDs, stores competencies and skills in `user_competencies` and `user_skill` tables, builds initial profile payload, and sends to Directory MS. UI shows "Initial profile stored" and "Profile sent to Directory MS" status with timestamp.  
  5. Feature 3.1 automatically schedules Baseline exam (triggered by Feature 2.4 event); UI shows "Assessment request sent" with timestamp.  
  6. Competency cards automatically refresh with latest coverage %, skill counts, and badges showing missing-MGS counts for each competency.  
  7. Clicking a card opens the modal overlay showing the tree (L0–L4) with color-coded nodes, check/X icons, code/label/percent, and explicit `missing_mgs` list per competency.  
  8. Feature 4.x recalculations update coverage meter; Feature 5 triggers Gap Analysis with accordion cards per competency showing `missing_mgs` map and per-skill gaps mirrored in the modal.  
  9. Export button lets ops download current profile JSON (exact payload shared with Directory MS); employees/trainers can download a PDF summary of the competency tree.  
- **Edge Cases:** Incomplete AI job shows retry CTA; failed exam shows alert linking to relevant competency card; if modal data cannot load, show inline error with retry.  
- **Data & APIs:** Card grid pulls from `user_competencies` table. Gap analysis (`missing_mgs`) is calculated on-the-fly by Feature 5 when needed—not stored in database. Modal tree uses normalized taxonomy JSON plus calculated `missing_mgs` map for the competency.

### 5.3 Gap Analysis & Learning Analytics Handoff (Feature 5, Feature 8.6)

**Important:** Gap analysis is calculated on-the-fly and sent immediately—it is NOT stored in the database. When triggered (after exam results), Feature 5 calculates the gap and sends it directly to Learner AI MS and/or frontend.

- **Entry Point:** "Gap Analysis" nav item filtered by cohort/company.  
- **Screen Sequence:**  
  1. Cohort Selector + KPI tiles (avg coverage, # failing exams).  
  2. Table of users/teams with quick view of missing competencies (calculated in real-time).  
  3. Detail drawer showing map of `competency_name → [missing MGS]`, exam trigger, and next best actions.  
  4. "Send to Learner AI" confirmation modal referencing Unified Protocol payload.  
- **Flow:**  
  1. Automated trigger (after exam results) → Feature 5 calculates gap on-the-fly.  
  2. Gap data sent immediately to:
     - Frontend (for display in UI)
     - Learner AI MS (via Unified Data Exchange Protocol, Feature 8.6)
  3. UI displays calculated gap data in real-time; row expands to show exam context (Baseline/Post-course).  
  4. Operator can filter by exam status, competency, or course (triggers recalculation).  
  5. Manual re-dispatch option recalculates gap and sends payload to Learner AI MS (Feature 8.6).  
- **Edge Cases:** If Learner AI MS rejects payload, row flagged red with response message; operator can download payload JSON. Gap calculation is retried on each request—no cached data.  
- **Data & APIs:** Gap analysis is calculated on-demand from `user_competencies` and competency definitions. Response viewer uses same schema as Unified Protocol to maintain consistency. No database storage of gap results.

### 5.4 System Initialization Workflow (Features 9.1, 9.2, 9.5, 9.7)

**Purpose:** The first step when the Skills Engine service starts is to initialize the database, ensuring it's not empty and updating it with new competencies and skills from discovered URLs. This workflow runs automatically on system startup.

**Entry Point:** Automatic on system startup (no user action required)

**Workflow Sequence:**
1. **Feature 9.1 - Source Discovery & Link Storage:**
   - System automatically discovers URLs for skills/competencies using AI (Gemini 1.5 Flash)
   - Validates and stores new URLs in `external_sources` table
   - Updates URLs table if new sources are found
   - **UI Visibility:** Status badge on Dashboard showing "Initialization: Discovering sources..." with timestamp

2. **Feature 9.2 - Web Deep Search & Skill Extraction:**
   - Reads URLs from `external_sources` table
   - Extracts competencies and skills from URLs using AI (Gemini Deep Search)
   - **UI Visibility:** Status badge updates to "Initialization: Extracting skills from [X] sources..." with progress indicator

3. **Feature 9.5 - Validation of Extracted Data:**
   - Validates extracted competencies and skills
   - Assigns confidence scores
   - **UI Visibility:** Status badge shows "Initialization: Validating extracted data..." with validation count

4. **Feature 9.7 - Taxonomy Storage from Web Extraction:**
   - Stores validated competencies and skills in `competencies` and `skills` tables
   - Checks for duplicates (doesn't store duplicates)
   - Updates database if new competencies/skills are found
   - **UI Visibility:** Status badge shows "Initialization: Storing taxonomy..." with items count

**Completion:**
- **UI Visibility:** Status badge shows "Initialization Complete" with:
  - Total competencies added
  - Total skills added
  - Total URLs processed
  - Completion timestamp
  - Green checkmark icon

**UI Components:**

**Dashboard Status Badge (Operational Status Badges - Section 6.5):**
- **Location:** Top-right corner of Dashboard, below header
- **Design:**
  - Background: Gradient (blue during process, green when complete)
  - Icon: Spinner during process, CheckCircle when complete
  - Text: Current step description
  - Progress bar: Shows percentage if available
  - Timestamp: Last update time
- **States:**
  - **Running:** Blue background, spinner icon, animated progress bar
  - **Complete:** Green background, checkmark icon, summary stats
  - **Failed:** Red background, X icon, error message with retry button

**Initialization Details Panel (Optional - Admin/Ops only):**
- **Access:** Click on status badge to expand details
- **Content:**
  - Timeline of initialization steps
  - URLs discovered count
  - Competencies extracted count
  - Skills extracted count
  - Validation results (passed/failed)
  - Storage results (added/duplicates skipped)
  - Error log (if any)
- **Actions:**
  - "View Logs" button (opens detailed log viewer)
  - "Retry Initialization" button (admin only, re-runs workflow)
  - "Download Report" button (exports initialization summary)

**Periodic Updates:**
- System also runs this workflow periodically (FR 5.2.5) to update database with new competencies/skills
- Status badge updates automatically when periodic sync runs
- Users see notification: "Taxonomy updated: [X] new items added"

**Error Handling:**
- If initialization fails, status badge shows error state
- Error message includes: Failure reason, affected step, timestamp
- "Retry" button available for admin/ops
- Link to detailed error logs

**User Impact:**
- **Regular Users & Trainers:** See status badge but cannot interact (read-only)
- **Admin/Ops:** Can click badge to see details, retry if needed, view logs
- **No User Action Required:** Workflow runs automatically, users just see status

### 5.5 Backend AI Pipelines (Features 6.1, 8.1)

- These services run entirely in the backend and expose no dedicated UI flows.  
- Operational visibility relies on platform logging, alerting, and tracing dashboards owned by DevOps.  
- Any surfaced data inside Skills Engine UI is limited to aggregated status badges (e.g., "API healthy" banner on Dashboard) fed by infrastructure metrics rather than bespoke screens.  
- No user journey is defined in this document for these pipelines.

---

## 6. Screen Specifications

### 6.1 Competency Dashboard & Modal Overlay - Detailed UI Design

This section provides comprehensive visual design specifications for the Competency Dashboard, following a modern dark emerald/teal aesthetic with seamless dark/light mode switching.

#### 6.1.1 Layout Architecture

**Split-Screen Design:**
- **Left Panel (Main Area - ~70% width):**
  - Houses primary competency cards in responsive grid
  - Generous padding for breathing room
  - Scrollable to accommodate multiple competencies
  
- **Right Panel (Skills Gap Sidebar - 384px fixed):**
  - Persistent visibility of action items
  - Independent scroll from main content
  - Always-visible progress tracking
  
- **Fixed Header (Top Bar):**
  - Spans full width with backdrop blur effect
  - Contains branding, CSV upload, and theme toggle
  - Remains visible during scroll (80px height)

#### 6.1.2 Visual Design Language

**Color Philosophy - Light Mode:**
- Background: Subtle gradient from `gray-50` to `gray-100`
- Cards: Pure white with gradient to `gray-50`
- Primary Accent: `emerald-600` (rich, professional green)
- Text Hierarchy: `gray-800` (primary) → `gray-600` (secondary) → `gray-400` (tertiary)
- Borders: Delicate `gray-200`

**Color Philosophy - Dark Mode:**
- Background: Deep `slate-900` (true dark)
- Cards: Gradient from `slate-800` to `slate-900`
- Primary Accent: `teal-500` (vibrant yet soothing)
- Text Hierarchy: `gray-100` (crisp) → `gray-400` (readable) → `gray-500` (subtle)
- Borders: `slate-700`

**Design Principles:**
- **Glassmorphism:** Header uses backdrop blur with transparency
- **Neumorphism Hints:** Soft shadows create tactile depth
- **Gradient Mastery:** Cards use subtle gradients, progress bars have animated fills
- **Consistent Elevation:** Level 0 (background) → Level 1 (cards, shadow-lg) → Level 2 (hover, shadow-2xl) → Level 3 (modals, shadow-3xl)

#### 6.1.3 Component Specifications

**Fixed Header Bar:**
- **Height:** 80px
- **Background:** Semi-transparent with blur
- **Layout:** Flexbox with space-between
- **Left Side:**
  - Title: "Competency Dashboard" (2xl, weight-700, high contrast)
- **Right Side:**
  - **Upload CSV Button (Trainer Only):**
    - **Visibility:** Only rendered when `employee_type === "trainer"` (checked from `basic_profile.employee_type` in API response)
    - **Purpose:** Upload custom skills/competencies CSV file
    - **Design:** Rounded rectangle, emerald/teal accent color
    - **Icon:** Cloud upload icon (Lucide)
    - **Label:** "Upload CSV" or "Import Taxonomy"
    - **Hover:** Scale 1.05x + shadow expansion
    - **Click Action:** Opens upload modal (drag-and-drop + file picker)
    - **Hidden for:** Users with `employee_type === "regular"` (button not rendered in DOM)
  - **Theme Toggle:**
    - Perfect circle, 40px diameter
    - Sun (light) / Moon (dark) icons
    - Smooth rotation and scale animation

**Competency Cards (Main Content Area):**
- **Grid System:** 2 columns desktop, 1 column mobile
- **Gap:** 24px (1.5rem)
- **Padding:** 24px around grid

**Individual Card Structure (Top to Bottom):**
1. **Accent Strip:** 1px height, full-width, competency's primary color
2. **Card Header (Flexbox row):**
   - **Left:** Icon Circle (48px diameter)
     - Background: Competency color at 20% opacity + backdrop blur
     - Icon: 28px, solid color matching competency
   - **Right:** Level Badge (pill shape, uppercase, bold, 0.75rem)
     - **Expert (90%+):** Purple tones
     - **Advanced (75-89%):** Blue tones
     - **Intermediate (60-74%):** Green tones
     - **Beginner (40-59%):** Yellow tones
     - **Novice (<40%):** Red tones
3. **Content Section:**
   - Title: 1.25rem (xl), bold (600-700 weight)
   - Description: 0.875rem (sm), muted color, 1-2 lines
4. **Progress Visualization:**
   - Container: 12px height, rounded-full, muted background, shadow-inner
   - Fill Bar: Dynamic width, competency's primary color
   - Animation: 700ms ease transition + pulsing white overlay gradient
5. **Footer Metrics:**
   - Left: "X/Y skills mastered" (0.875rem)
   - Right: "View details →" (primary accent, arrow shifts on hover)

**Card Interaction States:**
- **Resting:** shadow-lg, border with theme-appropriate color
- **Hover (300ms):**
  - Transform: Lifts up 8px (-translate-y-2)
  - Shadow: Expands to 2xl
  - Shimmer: White/transparent gradient sweeps left-to-right (1000ms)
  - Cursor: Pointer
  - Arrow: Shifts right (2px gap increase)

**Skills Gap Sidebar (Right Panel - 384px fixed):**
- **Background:** Solid white/slate-800 (distinct from main)
- **Border-left:** Separates from main content
- **Shadow:** Strong 2xl shadow

**Sticky Header:**
- **Background Gradient:**
  - Light: `red-50` → `orange-50`
  - Dark: `red-900` → `orange-900`
- **Content:**
  - Icon: AlertCircle in colored circle (24px, red-100/red-800 background)
  - Title: "Skills Gap" (1.5rem/2xl, bold)
  - Subtitle: Count of missing skills (0.875rem, muted)

**Gap Skill Cards:**
- **Number Badge (Left):** Perfect circle (32px), red-500/700 background, white bold number
- **Content Area (Right, flex-1):**
  - **Top Section:**
    - Skill Code: Bold, prominent (e.g., "MGS 4.1.2")
    - Skill Name: Regular weight, slightly smaller
  - **Context Indicators:**
    - Competency Indicator: Colored dot (2×2px) + competency name
    - Category Indicator: Blue dot + category name (e.g., "L3.1: Deploying")
  - **Progress Section (border-top separated):**
    - Label: "Progress" + "0%" (small, semi-bold, red accent)
    - Progress Bar: 6px height, red-950/red-100 background, red-600/500 fill
- **Styling:** Gradient background, red-tinted border, xl rounded corners, 16px padding
- **Hover:** Shadow increases

**Empty State:**
- Icon: Large CheckCircle2 (64px, green)
- Text: "All skills mastered!" (bold, large, green accent)
- Subtext: "Congratulations! 🎉"

#### 6.1.4 Detail Modal (Competency Deep Dive)

**Overlay:**
- Background: Black at 50% opacity
- Position: Fixed full-screen
- Z-index: 50
- Click outside: Closes modal

**Modal Container:**
- Size: Max-width 896px (4xl)
- Height: Max 90vh
- Position: Centered
- Background: White/Slate-800
- Rounded: 2xl corners
- Shadow: 3xl
- Overflow: Auto scroll

**Sticky Modal Header:**
- Position: Sticky top-0
- Padding: 24px
- Z-index: 10
- **Content:**
  - Title Row: Competency name (2xl, bold) + Close button (X icon, 24px, gray, top-right)
  - Metadata: Description (small, muted) + Statistics row (overall percentage, skills fraction)

**Tree Structure (Hierarchical Display):**

**Visual Hierarchy Through Color:**
- **Level 0 (Root - Competency):** Amber backgrounds
  - Light: `amber-100`
  - Dark: `amber-900` with `amber-100` text
- **Level 1 (Main Categories):** Green backgrounds
  - Light: `green-100`
  - Dark: `green-900` with `green-100` text
- **Level 2 (Sub-categories):** Green backgrounds (same as Level 1)
- **Level 3 (Skill Groups):** Blue backgrounds
  - Light: `blue-50`
  - Dark: `blue-900` with `blue-100` text

**Node Structure:**
- **Header Bar:** Rounded-lg, 12px padding, theme-appropriate border, pointer cursor
- **Content Layout (Flexbox):**
  - Left: Chevron icon (Down when expanded, Right when collapsed) + Label text (bold)
  - Right: Percentage value (semi-bold)
- **Children Container:** Margin-left 32px (ml-8), margin-top 16px (mt-4), space-y 16px

**Leaf Nodes (Individual Skills):**
- **Not clickable** (no chevron)
- **Two-tone color system:**
  - **Passed (100%):** Green backgrounds + CheckCircle2 icon
  - **Failed (0%):** Red backgrounds + XCircle icon
- **Structure:**
  - Left: Status icon (18px, green-600/400 or red-600/400) + Skill code (bold, 0.875rem) + Skill name (0.75rem, muted)
  - Right: Percentage (bold, colored to match status)
- **Styling:** Status-appropriate background (green-50/red-50), status-colored border, rounded-lg, 12px padding, shadow-sm

**Interaction States:**
- **Expandable Nodes:**
  - Hover: Shadow increases (md)
  - Click: Chevron rotates, children appear/disappear (300ms smooth transition)
- **Leaf Nodes:** Static (informational only), no hover state

**Legend Panel:**
- Position: Bottom of modal (after all tree content)
- Background: Gray-50/Slate-900
- Padding: 16px
- Rounded: lg corners
- Margin-top: 24px
- **Content:** 2-column grid with small color squares (16×16px) + labels
  - Competency Level (amber square)
  - Category Level (green square)
  - Skill Group (blue square)
  - Mastered indicator (CheckCircle2 icon)
- Typography: 0.75rem (xs), readable, muted but legible

#### 6.1.5 Animation & Motion Design

**Animation Inventory:**

1. **Theme Toggle (300ms):**
   - All colors, backgrounds, borders, shadows animated
   - Easing: ease-in-out
   - Icon: Smooth cross-fade between Sun/Moon

2. **Card Hover (300ms):**
   - Transform: translateY(-8px)
   - Shadow: lg → 2xl
   - Cursor: auto → pointer
   - **Shimmer (1000ms):** Gradient sweep animation, translateX(-100% to 100%)

3. **Progress Bar Fill (700ms):**
   - Width: 0% → actual percentage
   - Easing: ease-out
   - Additional: Pulsing overlay gradient

4. **Modal Appearance:**
   - Overlay: Fade in (opacity 0 → 0.5, 200ms)
   - Modal: Scale up (0.95 → 1) + Fade in (opacity 0 → 1, 300ms)
   - Exit: Reverse animations (250ms)

5. **Tree Node Expand/Collapse:**
   - Chevron: Rotate 0° ↔ 90° (200ms)
   - Children: Height animation (0 → auto) + Opacity fade (0 → 1) + Slight downward slide
   - Stagger: 50ms delay per child

6. **Upload Button Hover:**
   - Scale: 1 → 1.05 (150ms)
   - Shadow: lg → xl (150ms)
   - Icon: Subtle bounce (400ms)

7. **Arrow Icon Movement:**
   - Gap increase: 1 → 2 (200ms, ease-out)
   - Trigger: Card hover

8. **Badge Pulse (Achievement levels):**
   - Subtle scale: 1 → 1.02 → 1
   - Duration: 2000ms (slow, breathing)
   - Repeat: Infinite

#### 6.1.6 Responsive Behavior

**Breakpoint Strategy:**

- **Mobile (< 768px):**
  - Cards: 1 column, full width
  - Sidebar: Hide or convert to bottom drawer
  - Header: Smaller padding, potentially stacked items
  - Font sizes: Slightly reduced
  - Touch targets: Minimum 44px

- **Tablet (768px - 1023px):**
  - Cards: 1-2 columns depending on space
  - Sidebar: Reduced width (320px) or hidden
  - Header: Full controls visible

- **Desktop (≥ 1024px):**
  - Cards: 2 columns (optimal scanning)
  - Sidebar: Full 384px width
  - All features visible
  - Generous spacing

**Adaptive Elements:**
- Grid: `grid-cols-1` (mobile) → `lg:grid-cols-2` (desktop)
- Spacing: Mobile 16px gaps → Desktop 24px gaps
- Typography: Mobile slightly smaller → Desktop full-size
- Sidebar: Mobile hidden/toggle-able → Desktop always visible

#### 6.1.7 Accessibility Features

- **Color Contrast:** WCAG AA Compliant (4.5:1 ratio), Dark mode carefully calibrated
- **Keyboard Navigation:** Logical tab order, visible focus indicators (2px blue outline), Enter/Space activates, Escape closes modal
- **Screen Readers:** Semantic HTML, ARIA labels, Live regions for CSV upload status, Alt text for icons
- **Motor Considerations:** Large touch targets (minimum 40px, 44px recommended), adequate gaps, clear hover states
- **Cognitive Load:** Consistent patterns, clear hierarchy, progress indicators, friendly error messages

#### 6.1.8 Design Patterns Used

- **Card Design Pattern:** Encapsulated information units, consistent structure
- **Progressive Disclosure:** Summary view (cards) → Detail view (modal), Tree nodes expand to reveal
- **Dashboard Layout:** Grid of metrics, at-a-glance overview, drill-down capability
- **Master-Detail:** Left panel (list) + Right panel (focused detail)
- **Status Indicators:** Color-coded badges, progress bars, icons (check/X)
- **Sticky Elements:** Header, modal header, sidebar header
- **Empty States:** Celebration when complete, positive reinforcement

#### 6.1.9 Design Excellence Factors

- **Information Hierarchy:** Clear visual weight, size/color/position communicate importance
- **Consistent Mental Model:** Same interaction patterns throughout
- **Aesthetic-Usability Effect:** Beautiful design perceived as more usable
- **Fitts's Law Applied:** Important buttons large, frequent actions close together
- **Gestalt Principles:** Proximity, similarity, closure, figure-ground
- **Progressive Enhancement:** Works without JavaScript, animations enhance but not required
- **Emotional Design:** Visceral (beautiful colors), Behavioral (intuitive), Reflective (sense of accomplishment)

### 6.2 Competency Dashboard & Modal Overlay (Original Specification)

- **Access:** Visible to Employees and Trainers (read-only); Ops/Admin can impersonate for debugging.  
- **Card Grid Layout:** Responsive grid of cards, each showing competency name, Lucide icon, coverage percentage, mastered vs total skills, and badge for missing MGS count. Cards inherit color tokens from `competency.color` (e.g., `bg-teal-500`, `bg-emerald-600`).  
- **Card Content:**  
  - Title + short description excerpt  
  - Progress ring showing `percentage`  
  - Stats row (`skillsMastered / skillsTotal`, level label)  
  - CTA chip ("View tree")  
- **Modal Behavior:**  
  - Triggered by clicking a competency card.  
  - Opens full-screen overlay (black `bg-opacity-50`) with centered, scrollable modal (`max-w-4xl`, `max-h-[85vh]`).  
  - Sticky header containing competency title, description, coverage %, skills count, Close (X) button.  
  - Tree visualization with expandable chevron nodes for L0–L4 levels; nodes color-coded:  
    - L0 Competency → `amber-100` background, `amber-900` text  
    - L1 Main Category → `green-100` / `green-900`  
    - L2 Sub-category → `green-100` / `green-900`  
    - L3 Skill groups → `blue-50` / `blue-900`  
    - L4 Individual skills → `green-50` if passed, `red-50` if missing  
  - Leaf rows include skill code, name, percentage, and icon: check (green) for mastered, X (red) for missing.  
  - Bottom legend card explains color/token meanings and icon semantics.  
  - Secondary panel lists `missing_mgs` entries translated from Feature 5 (competency_name → [skills]) with quick links that highlight the corresponding nodes in the tree.  
- **Data Structure (TypeScript):**
  ```ts
  type CompetencyTree = {
    id: number;
    title: string;
    percentage: number;
    icon: LucideIcon;
    color: string; // e.g., "bg-teal-500"
    description: string;
    skillsTotal: number;
    skillsMastered: number;
    tree: {
      [l1Key: string]: {
        label: string;
        percent: string;
        children: {
          [l2Key: string]: {
            label: string;
            percent: string;
            children: {
              [l3Key: string]: {
                label: string;
                percent: string;
                skills: Array<{
                  code: string;
                  label: string;
                  percent: string;
                  passed: boolean;
                }>;
              };
            };
          };
        };
      };
    };
  };
  ```
- **Gap Highlighting:** `missing_mgs` data structure (from Feature 5) is surfaced in a "Skill gaps" tab within the modal. The structure follows Feature 5's map format:
  ```ts
  type MissingMGS = {
    [competency_name: string]: Array<{
      skill_id: string;
      skill_name: string;
    }>;
  };
  ```
  - The tab displays missing skills grouped by competency name.
  - Each missing skill shows `skill_id` and `skill_name`.
  - Clicking a missing skill item auto-expands the tree hierarchy down to the corresponding L4 node and highlights it in red.
  - Badge on competency card shows total count of missing MGS for that competency.
- **Empty State:** If the user has no competencies yet, display onboarding message with link to assessments and trainer guidance.

### 6.2 Trainer Import Console

**Access Control:**
- **Visible Only To:** Users with `employee_type === "trainer"` (checked from `basic_profile.employee_type` in API response)
- **Hidden From:** Users with `employee_type === "regular"` (entire screen/route not accessible)
- **Navigation:** "Trainer Imports" item in left nav only appears for trainers
- **Backend Validation:** API endpoint `/api/competencies/import` validates `employee_type = "trainer"` before processing

**Layout:**
- **Two-column layout:**
  - **Left Pane (40% width):** Lists past imports (scrollable table)
  - **Right Pane (60% width):** Shows selected import details (expandable drawer)
- **Upload CTA:** Sits above import table (prominent, emerald/teal accent button)

**Key Components:**

**Upload Section:**
- **Upload CTA Button:**
  - Large, prominent button with cloud upload icon
  - Label: "Upload CSV" or "Import Custom Skills/Competencies"
  - Keyboard shortcut: `Ctrl+U` (or `Cmd+U` on Mac)
  - Click: Opens upload modal (drag-and-drop + file picker)
- **CSV Requirements Accordion:**
  - Expandable section explaining CSV format
  - Links to: CSV template download, column definitions, examples
  - Shows required columns: skill/competency name, description, parent relationships, etc.

**Import History Table (Left Pane):**
- **Columns:**
  - Timestamp (formatted date/time)
  - File Name (truncated if long, full name on hover)
  - Status (color-coded pills):
    - Blue: Uploaded/Scanning/Processing (in progress)
    - Green: Completed (success)
    - Red: Failed (error)
  - Added Items (count: competencies + skills)
  - Duplicates (count, clickable to view)
  - Triggered By (user name/ID)
- **Row Interactions:**
  - Click row: Expands detail pane on right
  - Hover on status: Tooltip with start/end times, processing duration
  - Status pills: Color-coded, clickable for details

**Detail Pane (Right Pane - when row selected):**
- **Tabs:**
  - **Summary:** 
    - Total competencies added
    - Total skills added
    - Duplicates skipped (count)
    - Errors (if any, with details)
    - Processing time
  - **Duplicates:**
    - Table showing duplicate entries found
    - Columns: Original name, Matched existing name, Action taken (skipped/merged)
    - "View Merge Suggestions" button (if applicable)
  - **Logs:**
    - Processing log output
    - Timestamps for each step
    - Error messages (if any)
    - Expandable sections for detailed logs

**Interactions:**
- **Upload Flow:**
  1. Click Upload CTA → Modal opens
  2. Drag-and-drop file or click to browse
  3. File validation (type, size) before enabling Upload button
  4. Upload progress bar (real-time)
  5. Results displayed in detail pane
- **View Duplicates:**
  - Click "View Duplicates" → Opens modal with full duplicate table
  - Shows merge suggestions (if applicable)
  - Download duplicate report as CSV
- **Download Results:**
  - "Download Results" button exports JSON/CSV of import summary
  - Includes: Added items, duplicates, errors, timestamps

**Error Handling:**
- **Inline Banner:** 
  - Red banner for critical errors (validation failed, security threat detected)
  - Amber banner for warnings (partial import, some duplicates)
  - Green banner for success
- **Remediation Steps:**
  - Error messages include actionable steps
  - "Re-upload" button available after fixing issues
  - Link to CSV template and documentation

**Visual Design:**
- **Color Scheme:** Matches dashboard (emerald/teal accents)
- **Status Pills:** 
  - Blue (`blue-500`): In progress
  - Green (`green-500`): Success
  - Red (`red-500`): Failed
- **Spacing:** Consistent 24px padding, 16px gaps
- **Typography:** Clear hierarchy, readable font sizes

**Responsive Behavior:**
- **Desktop:** Two-column layout as described
- **Tablet:** Columns stack vertically, detail pane becomes bottom drawer
- **Mobile:** Single column, full-width table, detail pane as modal overlay

### 6.3 User Profile Detail View

**Layout Architecture:**
- **Header Section (Sticky):**
  - User identity card: Avatar, name, employee_type badge, company
  - High-level metrics row: Coverage % (large, prominent), Verified MGS count, Career Path goal
  - Action buttons: Export Profile JSON, Re-run AI Extraction (with confirmation modal)
  - Background: Semi-transparent with backdrop blur (matches dashboard header style)
  - Height: 120px, padding: 24px

**Tab Navigation:**
- Horizontal tab bar below header (sticky when scrolling)
- Active tab: Underline accent (emerald-600/teal-500), bold text
- Inactive tabs: Muted gray, hover effect
- Tab labels: Overview, Raw Data, AI Extraction, Normalization, Initial Profile Delivery, Verification History, Gap Analysis

**Tab Content Specifications:**

**1. Overview Tab:**
- **Competency Cards Grid:** 3-column responsive grid (same card design as Dashboard)
- **Verified Status Summary:** 
  - Progress ring showing verified vs total skills
  - Color-coded: Green (verified), Yellow (pending), Red (failed)
- **Latest Exams Timeline:**
  - Vertical timeline with exam cards
  - Each card: Exam type, date, status badge, score
  - Hover: Expand to show details

**2. Raw Data Tab:**
- **File List:** 
  - Original text files, attachments, resume URLs
  - Download buttons for each file
  - Preview modal for text files
- **Metadata Section:**
  - Source information, upload dates, file sizes
  - Tags/categories if available

**3. AI Extraction Tab (Feature 2.2):**
- **Extraction Results Display:**
  - JSON viewer component (syntax highlighted, collapsible)
  - Shows extracted competencies and skills arrays
  - Metadata: Prompt version, Gemini model used, extraction timestamp
- **Status Indicators:**
  - Success badge (green) or error badge (red)
  - Processing time displayed
- **Actions:**
  - "Re-run Extraction" button (opens confirmation modal)
  - "Download JSON" button

**4. Normalization & Mapping Tab (Feature 2.3):**
- **Normalized Data Table:**
  - Two-column layout: Competencies | Skills
  - Each row shows: Original name → Normalized name
  - Duplicates flagged with warning icon (yellow)
- **Mapping Visualization:**
  - Tree/graph view showing competency → skills relationships
  - Interactive: Click competency to highlight connected skills
- **Metadata:**
  - Normalization timestamp, AI model used, match confidence scores

**5. Initial Profile Delivery Tab (Feature 2.4):**
- **Storage Summary Cards:**
  - **Competencies Card:**
    - Count: "X competencies stored"
    - Status: Success/Partial/Failed badges
    - Taxonomy mapping: "Y found in taxonomy, Z not found"
  - **Skills Card:**
    - Count: "X skills stored"
    - Status: Success/Partial/Failed badges
    - Taxonomy mapping: "Y found in taxonomy, Z not found"
- **Directory MS Payload Section:**
  - **Status Indicator:**
    - Green checkmark if sent successfully
    - Red X if failed, with error message
    - Timestamp of last send attempt
  - **Payload Preview:**
    - Collapsible JSON viewer showing the exact payload sent
    - Structure: userId, relevanceScore, competencies array
    - Read-only, syntax highlighted
- **Timeline:**
  - Visual timeline showing:
    1. Normalized data received (from Feature 2.3)
    2. Taxonomy lookup started
    3. Competencies stored in user_competencies
    4. Skills stored in user_skill
    5. Payload built
    6. Payload sent to Directory MS
    7. Event emitted (triggers Feature 3.1)
  - Each step shows timestamp and status icon

**6. Verification History Tab:**
- **Assessments Timeline:**
  - Vertical timeline with exam cards
  - Each card shows:
    - Exam type (Baseline/Post-course)
    - Date and time
    - Status badge (Pass/Fail)
    - Score/percentage
    - Skills verified count
  - Click card: Expand to show detailed results
- **Skills Verification List:**
  - Table showing all verified skills
  - Columns: Skill name, Verification date, Exam type, Status
  - Sortable and filterable

**7. Gap Analysis Tab (Feature 5):**
- **Missing MGS Map Display:**
  - Grouped by competency name
  - Each group shows:
    - Competency name (header)
    - List of missing skills (skill_id, skill_name)
    - Count badge
  - Click skill: Highlights in competency tree (if available)
- **Exam Context:**
  - Shows which exam triggered the gap analysis
  - Exam details: Type, date, results
- **Actions:**
  - "Recalculate Gap" button
  - "Send to Learner AI" button (opens confirmation modal)

**Visual Design:**
- **Card Style:** Matches dashboard cards (white/slate-800, rounded-lg, shadow-lg)
- **Spacing:** Consistent 24px padding, 16px gaps
- **Typography:** Clear hierarchy (2xl for headers, base for content, sm for metadata)
- **Colors:** Follows dashboard color scheme (emerald/teal accents)
- **Icons:** Lucide icons, consistent sizing (20px for inline, 24px for buttons)

**Responsive Behavior:**
- **Desktop:** Full tab navigation, all content visible
- **Tablet:** Tabs scrollable if needed, cards stack to 2 columns
- **Mobile:** Tabs become dropdown/accordion, single column layout

**Actions:**
- "Re-run AI Extraction" (with confirmation modal explaining impact)
- "Send Baseline Again" (if allowed, shows eligibility check)
- "Export Profile JSON" (downloads complete profile data)
- "Recalculate Gap Analysis" (triggers Feature 5 recalculation)

**Feedback:**
- Each card includes sync icon showing last update timestamp
- Warnings appear when AI or assessment jobs are pending (amber banner)
- Error states show inline with retry actions
- Success states show green checkmark with timestamp

### 6.4 Gap Analysis Report Panel

- **Structure:** Master-detail list of competencies on left; right pane shows missing skills grouped by `competency_name`.  
- **Features:**  
  - Toggle between Broad vs Narrow gap views  
  - Filters for exam context (Baseline/Post-course FAIL)  
  - "Notify Learner AI" button that opens confirmation modal summarizing payload snippet  
  - Labeling for `missing_mgs` count, proficiency level, recommended next actions  
- **Exports:** PDF and JSON export options referencing same schema as Feature 5 output.

### 6.5 Operational Status Badges (Dashboard Widgets)

- **Purpose:** Provide high-level health summaries for backend-only pipelines and system initialization status.  
- **Widgets:**  
  - **System Initialization Badge (Features 9.1, 9.2, 9.5, 9.7):**
    - **Location:** Top-right corner of Dashboard, prominent position
    - **States:**
      - **Running:** Blue gradient background, spinner icon, animated progress bar
        - Text: "Initializing database..." or current step description
        - Progress: Percentage if available
        - Timestamp: Last update time
      - **Complete:** Green gradient background, CheckCircle icon
        - Text: "Initialization Complete"
        - Summary: "X competencies, Y skills added"
        - Timestamp: Completion time
      - **Failed:** Red gradient background, XCircle icon
        - Text: "Initialization Failed"
        - Error: Brief error message
        - Action: "Retry" button (admin only)
    - **Click Action (Admin/Ops only):**
      - Expands to show detailed initialization panel:
        - Timeline of steps (9.1 → 9.2 → 9.5 → 9.7)
        - URLs discovered count
        - Competencies extracted count
        - Skills extracted count
        - Validation results
        - Storage results (added/duplicates)
        - Error log (if any)
      - Actions: "View Logs", "Retry Initialization", "Download Report"
    - **Periodic Updates:**
      - Badge updates when periodic sync runs (FR 5.2.5)
      - Shows notification: "Taxonomy updated: X new items"
    - **Data Source:** Reads latest timestamp and result from Feature 9.7 storage job
  - **API Health badge (aggregates success/error ratios from Unified Protocol logs).**  
  - **Alert banner placeholder (renders DevOps-provided incident IDs if AI pipelines degrade).**  
- **Interactions:** 
  - System Initialization badge: Clickable for admin/ops to see details
  - Other badges: Static informational components; clicking redirects to external observability tools (Grafana, Kibana, etc.).  
- **Error Handling:** If telemetry is unavailable, badge displays "Status unavailable – check monitoring stack" with link to runbook.

---

## 7. Interaction States & Feedback

- **Loading:** Skeleton screens for tables; job cards show animated shimmer.  
- **Success:** Green toast anchored bottom-right with action (view details).  
- **Warning:** Amber ribbon for soft issues (e.g., partial import) including "View details" link.  
- **Error:** Red modal summarizing failure, includes correlation ID referencing backend logs.  
- **Empty States:** Provide context-specific guidance (e.g., "No imports yet → Download CSV template to start").  
- **Notifications:** WebSocket push for long-running jobs; also log entries in Notification Center.

---

## 8. Accessibility & Responsiveness

- WCAG 2.1 AA contrast ratios, focus outlines, keyboard navigability for all actionable elements.  
- Responsive breakpoints:  
  - ≥1280px: Full dashboard layout  
  - 768–1279px: Collapsible navigation, stacked cards  
  - <768px: Read-only summaries (mutating actions limited to desktop for security).  
- Screen reader labels for status pills (e.g., "Import status: Processing").  
- Downloadable data available in accessible formats (CSV/JSON) with descriptive filenames.

---

## 9. API Endpoints for UI Integration

The Skills Engine frontend consumes the following REST API endpoints (separate from the Unified Data Exchange Protocol used by microservices):

### 9.1 Unified User Profile & Dashboard Endpoint

**Note:** All users (regular employees and trainers) use the same endpoint to access their profile and competency data. The system checks the `employee_type` field from the basic profile to determine UI rendering (e.g., showing/hiding CSV upload button for trainers).

- **GET `/api/user/{user_id}/profile`**  
  Returns complete user profile including:
  - **Basic Profile:** `user_id`, `user_name`, `company_id`, `employee_type`, `career_path_goal`, `basic_info`, `relevance_score`
  - **Competency Profile:** Array of competency cards with summary data (id, title, percentage, skillsTotal, skillsMastered, missingMgsCount)
  - **Skills Profile:** Full hierarchical tree structures for all competencies (L0–L4) including verification status, percentages, and missing MGS lists
  - **Gap Analysis Data:** `missing_mgs` map for all competencies (calculated on-the-fly, not stored in database)
  
  **Important:** Gap analysis is calculated in real-time when the endpoint is called (Feature 5). It is not stored in the database. The calculation is performed based on:
  - Required MGS from competency definitions
  - Verified MGS from user's competency profile
  - Missing MGS = Required MGS - Verified MGS
  
  The calculated gap data is sent immediately to:
  - Frontend (for display in UI)
  - Learner AI MS (via Unified Data Exchange Protocol, Feature 8.6)
  
  Response structure:
  ```json
  {
    "basic_profile": {
      "user_id": "string",
      "user_name": "string",
      "company_id": "string",
      "employee_type": "regular" | "trainer",
      "career_path_goal": {},
      "basic_info": {},
      "relevance_score": number
    },
    "competencies": [
      {
        "id": number,
        "title": "string",
        "percentage": number,
        "skillsTotal": number,
        "skillsMastered": number,
        "missingMgsCount": number
      }
    ],
    "competency_trees": {
      [competency_id]: {
        "tree": { /* L0-L4 hierarchy */ },
        "missing_mgs": {
          "competency_name": [
            { "skill_id": "string", "skill_name": "string" }
          ]
        }
      }
    },
    "gap_analysis": {
      "missing_mgs": {
        "competency_name": [
          { "skill_id": "string", "skill_name": "string" }
        ]
      }
    }
  }
  ```
  
  **UI Behavior:**
  - Frontend checks `basic_profile.employee_type` to conditionally render UI elements
  - If `employee_type === "trainer"`: Show CSV upload button in header (calls `/api/competencies/import`), show Trainer Imports navigation item
  - If `employee_type === "regular"`: Hide trainer-specific features
  - All users see the same competency dashboard with cards and modal overlay
  - **Note:** CSV upload functionality uses competency management routes (`/api/competencies/import*`), not separate trainer routes. Access is controlled by `employee_type` validation on the backend.

- **GET `/api/user-competency/{user_id}/competency/{competency_id}/tree`** (Optional - for lazy loading)  
  Returns full hierarchical tree structure for a specific user competency (L0–L4) including all skills with verification status, percentages, and missing MGS list. Used when user clicks a competency card to open the detail modal.


### 9.2 Competency & Skill Import Endpoint

**Note:** Adding custom skills or competencies via CSV upload is part of the competency/taxonomy management routes, not a separate trainer route. Access is controlled by checking `employee_type === "trainer"` in the user's basic profile.

- **POST `/api/competencies/import`** (multipart/form-data)  
  Uploads CSV file for processing custom skills and competencies. Returns import results directly (competencies added, skills added, duplicates, errors) or processes asynchronously and returns job ID if processing takes time.  
  **Authorization:** Requires `employee_type = "trainer"` in user's basic profile.

### 9.3 Additional Profile Endpoints (Optional - for detailed views)

These endpoints provide additional detail when needed, but the main `/api/user/{user_id}/profile` endpoint (Section 9.1) contains all essential data for the dashboard.

- **GET `/api/user/{user_id}/profile/detailed`**  
  Returns extended user profile including raw data, AI extraction results, verification history, normalization details. Used for the "User Profile Detail View" screen (Section 6.3).

- **GET `/api/user/{user_id}/profile/gap-analysis`** (Optional - for dedicated gap analysis view)  
  Calculates and returns complete gap analysis results (broad/narrow) with `missing_mgs` map on-the-fly. **Note:** Gap analysis is calculated in real-time from `user_competencies` and competency definitions—not retrieved from database storage. Can be used for dedicated Gap Analysis Report Panel (Section 6.4).

- **POST `/api/user/{user_id}/profile/export`**  
  Triggers profile JSON export (returns download URL). Available to all users for exporting their own profile data.

### 9.4 Authentication & Authorization

- All endpoints require authentication token in `Authorization: Bearer <token>` header.
- **Unified Profile Access:** All users (regular employees and trainers) access their own profile via `/api/user/{user_id}/profile` using the same endpoint. The `employee_type` field in the response determines UI rendering, not endpoint access.
- **Role-based UI Rendering:** 
  - Frontend checks `basic_profile.employee_type` from the profile response
  - If `employee_type === "trainer"`: UI shows trainer-specific features (CSV upload button, Trainer Imports navigation)
  - If `employee_type === "regular"`: UI hides trainer-specific features
  - Both user types see the same competency dashboard and modal overlay
- **Competency Import Endpoints:** 
  - Competency import endpoints (`/api/competencies/import*`) require `employee_type = "trainer"` in the user's basic profile
  - Backend validates `employee_type` before allowing access to import endpoints
  - These endpoints are part of the competency/taxonomy management routes, not separate trainer routes
- **User Profile Endpoints:** Require matching `user_id` (users can only access their own profile) or admin privileges for impersonation.
- Failed authorization returns `403 Forbidden` with error message.

---

## 10. Dependencies, Telemetry, and Open Questions

- **Dependencies:**  
  - Feature 1.x taxonomy services supply read APIs for UI tables.  
  - Feature 8.x Unified Data Exchange metrics feed Integrations Monitor widgets.  
  - Feature 9.x pipelines must emit structured events for the Initialization Dashboard.  
- **Telemetry Hooks:** Every major button triggers analytics events (`event_name`, `user_id`, `context_feature`).  
- **Open Questions:**  
  1. Do Trainers need ability to schedule imports or only manual uploads?  
  2. Should Operators approve AI-discovered competencies before exposure to Course Builder?  
  3. Are there compliance requirements for storing AI prompt/response history within UI?

---

**Next Steps:**  
- Validate these flows with stakeholders (Product, Design, Security).  
- Produce low-fidelity wireframes using this document as blueprint.  
- Align backend event schemas so UI telemetry can be implemented without rework.  
- Implement API endpoints listed in Section 9 to support frontend development.  
- Create TypeScript type definitions matching the data structures documented in Section 6.1.


