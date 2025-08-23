# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Lightyear Recruitment website - a modern, mobile-first redesign focused on maximizing candidate registrations for a family-run recruitment agency specializing in warehouse and logistics sectors in Berkshire, UK.

**Primary Goal:** Maximize candidate signups (target: 15-20% conversion rate)  
**Secondary Goal:** Build trust with potential employer clients  
**Approach:** Static site with atomic design system, TDD, and DRY principles

## Tech Stack & Architecture

- **Framework:** React with Next.js (static site generation)
- **Styling:** Tailwind CSS with custom atomic design system
- **UI Components:** 21st-dev MCP server for component generation
- **Testing:** Jest + React Testing Library (TDD approach mandatory)
- **Build Tool:** Next.js or Vite
- **Deployment:** Vercel/Netlify
- **No Backend:** Static site only - no CMS or database

## Development Commands

```bash
# Project setup (if not initialized)
npx create-next-app@latest lightyear-recruitment --typescript --tailwind --app --no-src-dir

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Preview production build

# Testing (TDD required)
npm test            # Run all tests
npm test:watch      # Run tests in watch mode
npm test:coverage   # Generate coverage report
npm test -- [file]  # Run specific test file

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
npm run type-check  # Run TypeScript compiler check
npm run format      # Format with Prettier

# Component Generation
# Use 21st-dev MCP commands:
# /ui [component description] - Generate new component
# /21 [component description] - Alternative command
```

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── candidates/        # Candidate-focused pages
│   ├── employers/         # Employer-focused pages
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   └── layout.tsx        # Root layout
├── components/            # Atomic design structure
│   ├── atoms/            # Buttons, inputs, labels
│   ├── molecules/        # Cards, form groups
│   ├── organisms/        # Header, footer, hero sections
│   └── templates/        # Page layouts
├── lib/                  # Utilities and helpers
├── styles/              # Global styles and design tokens
├── public/              # Static assets
└── __tests__/           # Test files (mirror src structure)
```

## Design System

### Colors
- **Primary:** #0066CC (Professional Blue)
- **Secondary:** #FF6B35 (Energetic Orange)  
- **Success:** #28A745 (Green)
- **Neutral:** #F8F9FA to #212529 (Gray scale)

### Typography
- **Font:** Inter for headings, system fonts for body
- **Scale:** 1.25 ratio (minor third)

### Spacing
- **Base:** 8px
- **Scale:** 8, 16, 24, 32, 48, 64, 96px

### Breakpoints
- **Mobile:** 320px
- **Tablet:** 768px  
- **Desktop:** 1024px
- **Wide:** 1440px

## Key Pages & Routes

1. **/** - Homepage with hero, benefits, testimonials
2. **/candidates** - Job seeker information and benefits
3. **/employers** - Client services and contact
4. **/about** - Company story and team
5. **/contact** - Dual-purpose contact form
6. **External Registration:** https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO

## Development Guidelines

### Component Development with 21st-dev
- Always use `/ui` or `/21` commands for new components
- Follow atomic design hierarchy
- Ensure all components are responsive (mobile-first)
- Include proper TypeScript types

### TDD Workflow
1. Write test first describing expected behavior
2. Run test to see it fail
3. Implement minimal code to pass
4. Refactor while keeping tests green
5. Ensure >80% code coverage

### Performance Requirements
- Page load <2 seconds on 4G
- Lighthouse score >90 all metrics
- Images lazy loaded and optimized
- Critical CSS inlined

### Accessibility
- WCAG 2.1 AA compliance required
- Minimum 44px touch targets
- Proper semantic HTML
- ARIA labels where needed

## Important Constraints

1. **No Database/CMS** - All content is static
2. **External Registration** - Form hosted on Recruso platform
3. **Mobile-First** - 80% of job seekers use mobile
4. **Static Generation** - Use Next.js SSG, not SSR
5. **DRY Principles** - Maximize component reusability

## Specialized Agent Instructions

The project includes specialized instruction sets for focused development tasks. Use these with the Task tool for consistent execution:

### Available Agent Instructions
- **Component Builder** (`.claude/agents/component-builder.md`) - For creating atomic design components with 21st-dev
- **TDD Test Writer** (`.claude/agents/tdd-test-writer.md`) - For writing tests before implementation
- **Mobile-First Layout** (`.claude/agents/mobile-layout.md`) - For ensuring perfect mobile experience

### Usage Example
```
Use Task tool with general-purpose subagent:
"Acting as the Component Builder Agent, create a hero section component with prominent CTA"
```

See `.claude/subagents.md` for complete usage instructions.

## Common Tasks

### Adding a New Page
1. Create route in `app/` directory
2. Use appropriate template component
3. Write tests for page functionality (use TDD Test Writer agent)
4. Ensure mobile responsiveness (use Mobile-First Layout agent)
5. Add to navigation components

### Creating Components
1. Use `/ui` command with 21st-dev MCP (or Component Builder agent)
2. Place in correct atomic category
3. Write component tests first (TDD)
4. Document props with TypeScript
5. Ensure responsive design

### Optimizing for Conversion
- Multiple registration CTAs per page
- Sticky header with CTA on mobile
- Clear value propositions above fold
- Social proof (testimonials) visible
- Simplified navigation paths

## External Resources

- **Registration Form:** https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO
- **Current Site:** https://www.lightyear-recruitment.com/
- **PRD:** See PRD.md for detailed requirements
- **Sitemap:** See SITEMAP.md for page structure