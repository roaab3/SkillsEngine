# Skills Engine Frontend

React.js frontend application for the Skills Engine microservice, providing a user-friendly interface for viewing competencies, skills, and skill gaps.

## Features

- **User Profile Dashboard**: View your competencies and skills in an intuitive card-based layout
- **Competency Cards**: Display competency levels, progress, and associated skills
- **Skill Gap Analysis**: Identify missing skills with priority-based recommendations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **Real-time Updates**: Live data from the Skills Engine backend API

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with custom properties for theming
- **Responsive Grid Layout**

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- Skills Engine backend running on port 3000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3001`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── UserProfile.tsx      # Main user profile page
│   │   ├── CompetencyCard.tsx   # Individual competency cards
│   │   ├── MissingSkills.tsx    # Missing skills section
│   │   └── *.css               # Component-specific styles
│   ├── services/
│   │   └── api.ts              # API service layer
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # Global styles
│   └── index.tsx               # App entry point
├── package.json
└── README.md
```

## Components

### UserProfile
Main dashboard component that displays:
- User information header
- Grid of competency cards
- Missing skills section
- Theme toggle

### CompetencyCard
Individual competency display showing:
- Competency name and level
- Progress bar
- Verified and missing skills
- Statistics (verified/missing/total)

### MissingSkills
Comprehensive view of skills to develop:
- Categorized by skill type
- Priority-based recommendations
- Action buttons for learning paths

## API Integration

The frontend communicates with the Skills Engine backend through REST APIs:

- `GET /api/v1/users/{id}` - User profile
- `GET /api/v1/competencies` - All competencies
- `GET /api/v1/competencies/{id}/skills` - Skills for competency
- `GET /api/v1/skills` - All skills
- `GET /api/v1/gap-analysis/{userId}` - Skill gap analysis

## Styling

The application uses a custom CSS design system with:

- **Dark Emerald Color Palette**: Professional, modern look
- **CSS Custom Properties**: Easy theme switching
- **Responsive Grid**: Mobile-first design
- **Smooth Animations**: Enhanced user experience
- **Accessibility**: WCAG compliant

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Deployment

The frontend can be deployed as a static site to:
- **Netlify**
- **Vercel** 
- **AWS S3 + CloudFront**
- **GitHub Pages**

### Environment Configuration

For production deployment, set the `REACT_APP_API_URL` environment variable to point to your production backend.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write responsive CSS
4. Test on multiple devices
5. Update documentation

## License

MIT License - see LICENSE file for details.