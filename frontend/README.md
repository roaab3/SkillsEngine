# Skills Engine Frontend

Frontend application for Skills Engine built with React, Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with dark emerald theme
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management (if needed)
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── CompetencyCard.tsx
│   │   ├── SkillsGapPanel.tsx
│   │   ├── CompetencyDetailModal.tsx
│   │   ├── CSVUpload.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   └── ProfileDetail.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useUserProfile.ts
│   │   └── useSkillGaps.ts
│   ├── services/        # API client
│   │   └── api.ts
│   ├── contexts/        # React contexts
│   │   └── ThemeContext.tsx
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── cn.ts
│   │   └── proficiencyColors.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Features

- **Competency Dashboard** - View all competencies with cards
- **Skills Gap Analysis** - Display missing skills in sidebar
- **Competency Detail Modal** - Hierarchical skill tree view
- **CSV Upload** - Trainer-only CSV upload functionality
- **Theme Toggle** - Light/dark mode support
- **Responsive Design** - Mobile-friendly layout
- **Dark Emerald Theme** - Custom color palette

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Skills Engine
```

## Design System

The frontend uses a dark emerald theme with:
- Glassmorphism effects (backdrop blur)
- Neumorphism hints (soft shadows)
- Gradient mastery (emerald to teal gradients)
- Consistent elevation system
- Responsive breakpoints

## Components

### Core Components

- **Dashboard** - Main page with competency cards and gap analysis
- **CompetencyCard** - Individual competency display with progress
- **SkillsGapPanel** - Fixed sidebar showing missing skills
- **CompetencyDetailModal** - Modal with hierarchical skill tree
- **CSVUpload** - File upload interface (Trainer only)
- **Header** - Fixed header with navigation and theme toggle

## API Integration

The frontend communicates with the backend API through:
- `api.getUserProfile()` - Fetch user profile
- `api.getGapAnalysis()` - Fetch gap analysis
- `api.getCompetencyDetail()` - Fetch competency details
- `api.uploadCSV()` - Upload CSV file

All API calls use React Query for caching and automatic refetching.

