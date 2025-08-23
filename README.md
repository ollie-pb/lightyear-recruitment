# Lightyear Recruitment Website

Modern, mobile-first redesign of the Lightyear Recruitment website focused on maximizing candidate registrations for a family-run recruitment agency specializing in warehouse and logistics sectors.

## 🎯 Project Goals

- **Primary:** Maximize candidate signups (target: 15-20% conversion rate)
- **Secondary:** Build trust with potential employer clients
- **Approach:** Static site with atomic design system, TDD, and DRY principles

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📁 Project Structure

```
/
├── app/                    # Next.js app directory
├── components/            # Atomic design components
│   ├── atoms/            # Basic building blocks
│   ├── molecules/        # Compound components
│   ├── organisms/        # Complex sections
│   └── templates/        # Page layouts
├── lib/                  # Utilities and helpers
├── public/              # Static assets
├── __tests__/           # Test files
└── .claude/             # AI agent instructions
```

## 🛠 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Testing:** Jest + React Testing Library
- **UI Components:** 21st-dev MCP

## 🎨 Design System

- **Colors:** 
  - Primary: #0066CC (Blue)
  - Secondary: #FF6B35 (Orange)
- **Typography:** Inter font family
- **Spacing:** 8px base unit system
- **Breakpoints:** 320px, 768px, 1024px, 1440px

## 📖 Documentation

- [Product Requirements (PRD)](./PRD.md)
- [Site Map](./SITEMAP.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [Claude AI Guide](./CLAUDE.md)

## 🔗 Links

- **Live Site:** [Coming Soon]
- **GitHub:** [https://github.com/ollie-pb/lightyear-recruitment](https://github.com/ollie-pb/lightyear-recruitment)
- **Current Site:** [https://www.lightyear-recruitment.com](https://www.lightyear-recruitment.com)

## 📱 Mobile-First Approach

This project prioritizes mobile users (80% of job seekers) with:
- Touch-friendly interfaces (44px minimum targets)
- Sticky header with prominent CTAs
- Optimized performance for 4G networks
- One-handed navigation patterns

## 🧪 Testing

We follow Test-Driven Development (TDD) with:
- Minimum 80% code coverage
- Component unit tests
- Integration tests for user flows
- Accessibility testing (WCAG 2.1 AA)

## 📝 License

© 2024 Lightyear Recruitment. All rights reserved.