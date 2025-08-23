# Product Requirements Document (PRD)
## Lightyear Recruitment Website Redesign

### Executive Summary
Complete redesign of the Lightyear Recruitment website to maximize candidate registrations and establish trust with potential clients. The solution will be a modern, mobile-first static website built with a component-driven architecture using atomic design principles.

---

## 1. Project Overview

### 1.1 Business Context
Lightyear Recruitment is a family-run recruitment agency specializing in warehouse and logistics sectors across Berkshire and surrounding areas. The current website needs modernization to better convert visitors into registered candidates and showcase professionalism to potential clients.

### 1.2 Goals & Objectives

#### Primary Goal
- **Maximize candidate signups** through improved UX/UI and strategic CTA placement
- Target conversion rate: 15-20% of visitors clicking through to registration form

#### Secondary Goal
- **Build trust with potential employer clients** through professional design and clear value proposition
- Showcase expertise in warehouse/logistics recruitment

### 1.3 Success Metrics
- Increased click-through rate to registration form (target: 3x current rate)
- Reduced bounce rate (target: <40%)
- Improved mobile engagement (target: >60% mobile traffic completing key actions)
- Increased employer inquiry form submissions

---

## 2. User Personas

### 2.1 Primary Persona: Job Seeker "Sarah"
- **Age:** 25-45
- **Tech Savvy:** Moderate (primarily mobile user)
- **Goals:** Find stable warehouse/logistics work quickly
- **Pain Points:** Complex application processes, unclear job opportunities
- **Device:** 80% mobile, 20% desktop

### 2.2 Secondary Persona: Hiring Manager "Michael"
- **Age:** 35-55
- **Tech Savvy:** High
- **Goals:** Find reliable staffing partner for warehouse operations
- **Pain Points:** Unreliable agencies, lack of industry expertise
- **Device:** 60% desktop, 40% mobile

---

## 3. Functional Requirements

### 3.1 Core Features

#### Navigation & Information Architecture
- Sticky header with prominent "Register" CTA
- Mobile hamburger menu with simplified navigation
- Footer with quick links and contact information
- Breadcrumb navigation for deeper pages

#### Homepage
- Hero section with clear value proposition and immediate CTA
- Trust indicators (years of experience, number of placements)
- Service area map/list
- Featured job categories
- Client/candidate testimonials carousel
- Benefits grid (4-6 key differentiators)

#### For Candidates Page
- Streamlined explanation of registration process
- Job categories with icons
- Benefits of working with Lightyear
- Success stories
- Prominent registration CTAs throughout
- FAQ accordion

#### For Employers Page
- Service overview
- Industries served with case studies
- Flexible staffing solutions explained
- Partnership benefits
- Contact form with specific employer fields
- Testimonials from clients

#### About Page
- Company story (family-run, local expertise)
- Team profiles with photos
- Values and approach
- Coverage area with interactive map
- Awards/certifications if applicable

#### Contact Page
- Dual-purpose contact form (candidates vs employers)
- Click-to-call phone number
- Office location with map
- Business hours
- Social media links

### 3.2 Technical Requirements

#### Performance
- Page load time <2 seconds on 4G
- Lighthouse score >90 for all metrics
- Image optimization with lazy loading
- Critical CSS inline

#### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly interface (min 44px touch targets)
- Optimized for both portrait and landscape orientations

#### Browser Support
- Chrome (last 2 versions)
- Safari (last 2 versions)
- Firefox (last 2 versions)
- Edge (last 2 versions)

#### SEO & Analytics
- Schema markup for local business
- Meta descriptions for all pages
- Open Graph tags for social sharing
- Google Analytics 4 integration
- Conversion tracking for registration clicks

---

## 4. Design Requirements

### 4.1 Visual Design Principles
- **Clean & Professional:** Establish trust immediately
- **High Contrast:** Ensure accessibility and readability
- **Consistent:** Unified design language across all pages
- **Action-Oriented:** Clear visual hierarchy leading to CTAs

### 4.2 Atomic Design System

#### Design Tokens
- **Colors:**
  - Primary: Professional blue (#0066CC)
  - Secondary: Energetic orange (#FF6B35)
  - Success: Green (#28A745)
  - Neutral: Grays (#F8F9FA to #212529)
  
- **Typography:**
  - Headings: Inter or similar (sans-serif)
  - Body: System fonts for performance
  - Scale: 1.25 ratio (minor third)

- **Spacing:**
  - Base unit: 8px
  - Scale: 8, 16, 24, 32, 48, 64, 96px

#### Component Library (via 21st-dev)
- **Atoms:** Buttons, inputs, labels, icons
- **Molecules:** Cards, form groups, navigation items
- **Organisms:** Header, footer, hero sections, testimonial blocks
- **Templates:** Page layouts
- **Pages:** Fully composed pages

### 4.3 Interaction Design
- Micro-animations for feedback
- Smooth scroll behavior
- Progressive disclosure for complex information
- Loading states for form submissions
- Success/error messaging

---

## 5. Content Strategy

### 5.1 Tone of Voice
- Professional yet approachable
- Clear and concise
- Action-oriented
- Empathetic to job seekers
- Confident for employers

### 5.2 Key Messaging
- "Family-run with personal touch"
- "Local expertise in warehouse & logistics"
- "Transparent and trustworthy"
- "Quick and easy registration"

### 5.3 Call-to-Actions
- Primary: "Register Now" / "Start Your Journey"
- Secondary: "Find Your Next Role" / "Get Started"
- Employer: "Find Your Team" / "Partner With Us"

---

## 6. Development Approach

### 6.1 Technology Stack
- **Framework:** React/Next.js (for static generation)
- **Styling:** Tailwind CSS with custom design system
- **Components:** 21st-dev for UI components
- **Testing:** Jest + React Testing Library (TDD approach)
- **Build:** Vite or Next.js
- **Deployment:** Vercel/Netlify

### 6.2 Development Phases

#### Phase 1: Foundation (Week 1)
- Set up project structure
- Create atomic design system
- Build component library with 21st-dev
- Set up testing framework

#### Phase 2: Core Components (Week 2)
- Develop reusable components
- Implement responsive layouts
- Create page templates
- Write component tests

#### Phase 3: Page Development (Week 3)
- Build all pages using components
- Implement navigation
- Add animations/interactions
- Integration testing

#### Phase 4: Optimization (Week 4)
- Performance optimization
- SEO implementation
- Accessibility audit
- Cross-browser testing
- Final deployment

### 6.3 Testing Strategy (TDD)
- Unit tests for all components
- Integration tests for user flows
- Visual regression testing
- Accessibility testing (WCAG 2.1 AA)
- Performance testing
- Cross-device testing

---

## 7. Constraints & Assumptions

### Constraints
- No CMS or database (static site only)
- Registration handled by external form
- Limited to existing brand assets initially
- No user authentication required

### Assumptions
- Users have modern browsers
- External registration form remains stable
- Content updates will be infrequent
- Social media links are active

---

## 8. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| External form downtime | High | Add fallback contact method |
| Low mobile performance | High | Aggressive optimization, lazy loading |
| Complex navigation | Medium | User testing, simplified IA |
| Content migration errors | Low | Thorough QA process |

---

## 9. Future Enhancements (Post-MVP)

- Job board integration
- Live chat functionality
- Candidate portal
- Employer dashboard
- Multi-language support
- Advanced analytics dashboard
- A/B testing framework
- Newsletter integration

---

## 10. Acceptance Criteria

### Launch Criteria
- [ ] All pages load in <2 seconds
- [ ] Mobile-first design implemented
- [ ] Registration CTAs prominent on every page
- [ ] Contact forms functional
- [ ] SEO meta tags in place
- [ ] Analytics tracking active
- [ ] Cross-browser testing passed
- [ ] Accessibility audit passed
- [ ] All content migrated accurately
- [ ] 404 page implemented
- [ ] SSL certificate active

### Post-Launch Success Metrics (30 days)
- Registration click-through rate increased by 200%
- Bounce rate reduced by 30%
- Mobile engagement increased by 50%
- At least 10 employer inquiries received