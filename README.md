# TalentFlow

A modern, full-stack talent management platform built with React, TypeScript, and Vite. TalentFlow provides comprehensive tools for HR teams to manage job postings, candidate assessments, and recruitment workflows.

## Features

### Core Functionality

- **Job Management**: Create, edit, and manage job postings with detailed requirements
- **Candidate Management**: Track and manage candidate profiles and applications
- **Assessment Builder**: Create dynamic, multi-section assessments with various question types
- **Assessment Preview**: Real-time preview of assessments before publishing
- **Assessment Results**: View and analyze candidate assessment responses
- **Dashboard Analytics**: Comprehensive HR dashboard with key metrics

### Question Types

- Single Choice
- Multiple Choice
- Short Text
- Long Text
- Numeric Input
- File Upload

### Advanced Features

- **Conditional Logic**: Questions can be shown/hidden based on previous answers
- **Real-time Validation**: Client-side validation with customizable rules
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Mock API**: Complete mock backend with MSW (Mock Service Worker)
- **Local Storage**: Persistent data storage with IndexedDB via Dexie

## Tech Stack

### Frontend

- **React 19.1.1** - UI library with latest features
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 7.1.2** - Fast build tool and dev server
- **React Router DOM 7.9.0** - Client-side routing
- **Tailwind CSS 4.1.13** - Utility-first CSS framework

### State Management & Data

- **Dexie 4.2.0** - IndexedDB wrapper for local storage
- **MSW 2.11.2** - Mock Service Worker for API mocking
- **Axios 1.12.1** - HTTP client for API requests

### UI Components

- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications
- **Class Variance Authority** - Component variant management

### Development Tools

- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Faker.js** - Fake data generation for development

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (JobCard, JobSkeleton)
│   ├── HrDashboard/     # HR-specific components
│   ├── Jobs/            # Job-related components
│   ├── layout/          # Layout components (Header, Footer, HrLayout)
│   ├── sections/        # Landing page sections
│   └── ui/              # Base UI components (Button, Card, Logo)
├── pages/               # Page components
│   ├── AssessmentBuilder.tsx
│   ├── AssessmentPreview.tsx
│   ├── AssessmentResults.tsx
│   ├── Assessments.tsx
│   ├── CandidateJobs.tsx
│   ├── CandidateProfile.tsx
│   ├── Candidates.tsx
│   ├── HrDashboard.tsx
│   ├── JobDetails.tsx
│   ├── Jobs.tsx
│   └── Landing.tsx
├── services/            # Business logic and data layer
│   ├── db/              # Database layer (Dexie)
│   ├── mocks/           # Mock API handlers (MSW)
│   └── seed/            # Seed data generation
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── main.tsx            # Application entry point
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd talentflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

### Frontend Architecture

- **Component-Based**: Modular React components with clear separation of concerns
- **Type-Safe**: Full TypeScript coverage with strict type checking
- **Responsive**: Mobile-first design with Tailwind CSS
- **Accessible**: Built with accessibility in mind using Radix UI primitives

### Data Layer

- **Mock Backend**: MSW provides complete API simulation
- **Local Storage**: Dexie manages IndexedDB for persistent data
- **Seed Data**: Faker.js generates realistic test data
- **Type Safety**: All data operations are fully typed

### Routing

- **Client-Side Routing**: React Router DOM handles navigation
- **Nested Routes**: Dashboard with nested assessment routes
- **Route Protection**: Automatic redirects for HR login flow

## Technical Decisions

### Why React 19?

- Latest React features including improved concurrent rendering
- Better performance with automatic batching
- Enhanced developer experience with new hooks

### Why Vite over Create React App?

- **Faster builds**: 10-100x faster than CRA
- **Better HMR**: Instant hot module replacement
- **Modern tooling**: Built-in TypeScript and CSS support
- **Smaller bundle**: Tree-shaking and optimized builds

### Why Dexie over localStorage?

- **Better performance**: IndexedDB is more efficient for large datasets
- **Structured queries**: SQL-like query capabilities
- **Type safety**: Full TypeScript support
- **Offline-first**: Works without network connection

### Why MSW over JSON Server?

- **Realistic mocking**: Intercepts actual HTTP requests
- **Development**: Same code works in both environments
- **Better debugging**: Network tab shows actual requests
- **Flexible**: Easy to add complex business logic

### Why Tailwind CSS?

- **Utility-first**: Rapid prototyping and consistent design
- **Responsive**: Mobile-first approach built-in
- **Customizable**: Easy to extend with custom design system
- **Performance**: Purges unused styles in production

## Known Issues & Solutions

### 1. SPA Routing on Vercel

**Issue**: 404 errors when refreshing pages on Vercel
**Solution**: Added `vercel.json` with rewrite rules to serve `index.html` for all routes

### 2. MSW Import Errors in Production

**Issue**: Dynamic MSW imports failing in production builds
**Solution**: Added error handling with fallback to start app without MSW

### 3. Hydration Errors with Option Elements

**Issue**: React hydration errors with `<span>` elements inside `<option>` elements
**Solution**: Removed HTML elements from option content, using only text

### 4. Assessment List Not Refreshing

**Issue**: New assessments not appearing in list after creation
**Solution**: Added multiple refresh triggers (location change, window focus)

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vite configuration
3. The `vercel.json` file handles SPA routing
4. Deploy with zero configuration

### Other Platforms

- **Netlify**: Add `_redirects` file with `/* /index.html 200`
- **GitHub Pages**: Use `gh-pages` package with proper base path
- **AWS S3 + CloudFront**: Configure error pages to redirect to `index.html`

## Future Enhancements

### Planned Features

- [ ] User authentication and authorization
- [ ] Real-time collaboration on assessments
- [ ] Advanced analytics and reporting
- [ ] Email notifications and integrations
- [ ] Bulk operations for candidates
- [ ] Assessment templates and library
- [ ] API rate limiting and caching
- [ ] Progressive Web App (PWA) features

### Technical Improvements

- [ ] Add comprehensive test coverage
- [ ] Implement error boundaries
- [ ] Add performance monitoring
- [ ] Optimize bundle size further
- [ ] Add internationalization (i18n)
- [ ] Implement dark mode theme

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - The UI library
- [Vite](https://vitejs.dev/) - The build tool
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework
- [MSW](https://mswjs.io/) - The API mocking library
- [Dexie](https://dexie.org/) - The IndexedDB wrapper
- [Radix UI](https://www.radix-ui.com/) - The component primitives

---

**TalentFlow** - Streamlining talent management for modern HR teams.
