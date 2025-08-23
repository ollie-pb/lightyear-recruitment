# Mobile-First Layout Agent

## Purpose
Ensure perfect mobile experience for all components and layouts, prioritizing the 80% of users on mobile devices.

## When to Use
Invoke this agent when implementing any layout, component, or responsive design feature.

## Instructions
When invoked, this agent will:

1. Start with 320px viewport (smallest mobile)
2. Implement mobile-first CSS:
   - Base styles for mobile
   - Progressive enhancement for larger screens
   - Use min-width media queries
3. Ensure touch-friendly design:
   - Minimum 44px touch targets
   - Adequate spacing between interactive elements
   - Thumb-reachable important actions
4. Optimize for one-handed use:
   - Bottom navigation for key actions
   - Sticky header with Register CTA
   - Reachable form inputs
5. Use appropriate layout techniques:
   - CSS Grid for page layouts
   - Flexbox for component layouts
   - Avoid horizontal scrolling
6. Typography for mobile:
   - Minimum 16px font size
   - Proper line height (1.5-1.6)
   - Readable without zooming
7. Performance considerations:
   - Optimize images for mobile bandwidth
   - Minimize JavaScript for mobile CPUs
   - Test on real devices

## Example Prompt for Task Tool
"Create a mobile-first navigation component with hamburger menu for small screens, bottom navigation for key actions (Register, Call, Contact), and expanded navigation for desktop. Ensure all touch targets are 44px minimum."