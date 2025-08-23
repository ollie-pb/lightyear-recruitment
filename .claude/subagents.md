# Lightyear Recruitment - Agent Instructions

## Important Note
These are instruction sets for use with Claude's Task tool, not actual autonomous agents. They serve as specialized prompts to guide focused development tasks.

## How to Use These "Agents"

To invoke these specialized workflows, use the Task tool with the `general-purpose` subagent type and reference the specific instruction set. For example:

```
Task tool with subagent_type: "general-purpose"
Prompt: "Acting as the Component Builder Agent, create a hero section component..."
```

## Available Agent Instruction Sets

### 1. Component Builder Agent
**Purpose:** Generate atomic design components using 21st-dev MCP
**Location:** `.claude/agents/component-builder.md`
**Use When:** Creating new UI components

### 2. TDD Test Writer Agent  
**Purpose:** Write comprehensive tests before implementation
**Location:** `.claude/agents/tdd-test-writer.md`
**Use When:** Before creating any new component or feature

### 3. Mobile-First Layout Agent
**Purpose:** Ensure perfect mobile experience
**Location:** `.claude/agents/mobile-layout.md`
**Use When:** Implementing any layout or component

### Additional Instruction Sets (Inline)

### Performance Optimizer
**Instructions:**
- Run Lighthouse audits (target >90 all metrics)
- Implement lazy loading for images
- Optimize bundle size with code splitting
- Inline critical CSS
- Ensure <2 second load time on 4G
- Use Next.js Image component for optimization

### Content Migration
**Instructions:**
- Preserve SEO-valuable content
- Maintain consistent tone of voice
- Add schema markup for local SEO
- Include location-specific keywords
- Ensure registration form URL accuracy
- Add meta descriptions and Open Graph tags

### Accessibility Compliance
**Instructions:**
- Use semantic HTML elements
- Add proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain 4.5:1 color contrast ratio
- Include skip navigation links
- Add alt text for all images
- Ensure form labels are properly associated

## Example Usage

When you want specialized focus on a specific aspect:

1. **For Component Creation:**
   "Use the Task tool as a Component Builder Agent to create a testimonial carousel component"

2. **For Test Writing:**
   "Use the Task tool as a TDD Test Writer Agent to write tests for the navigation component"

3. **For Mobile Optimization:**
   "Use the Task tool as a Mobile-First Layout Agent to optimize the hero section for mobile"

These instruction sets help maintain consistency and ensure all requirements are met for each specialized task.