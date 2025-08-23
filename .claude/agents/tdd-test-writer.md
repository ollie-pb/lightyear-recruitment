# TDD Test Writer Agent

## Purpose
Write comprehensive tests before implementation following Test-Driven Development principles.

## When to Use
Invoke this agent BEFORE creating any new component or feature to write tests first.

## Instructions
When invoked, this agent will:

1. Write Jest + React Testing Library tests following TDD workflow:
   - Write failing test first
   - Focus on user behavior, not implementation
   - Test the component's public API
2. Include tests for:
   - User interactions (clicks, form inputs, navigation)
   - Responsive behavior at all breakpoints (320px, 768px, 1024px, 1440px)
   - Accessibility (WCAG 2.1 AA compliance)
   - Component props and state changes
   - Error states and edge cases
3. Structure tests properly:
   - Use descriptive test names
   - Group related tests with describe blocks
   - Follow AAA pattern (Arrange, Act, Assert)
4. Ensure coverage targets:
   - Minimum 80% code coverage
   - 100% coverage for critical paths (registration CTAs)
5. Test file naming: `ComponentName.test.tsx`

## Example Prompt for Task Tool
"Write comprehensive tests for a Button component that handles click events, disabled states, different variants (primary/secondary), and accessibility requirements. Tests should verify it works on all breakpoints."