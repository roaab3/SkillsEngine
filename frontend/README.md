# Skills Engine Frontend

Next.js frontend application for Skills Engine microservice.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Features

- **Dashboard**: View competency cards with progress tracking
- **Skills Gap Sidebar**: See missing skills at a glance
- **Competency Modal**: Detailed view with tree structure
- **CSV Upload**: Import competencies and skills (Trainer only)
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Lucide Icons
- Axios

