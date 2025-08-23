# Component Builder Agent

## Purpose
Generate atomic design components for the Lightyear Recruitment website using 21st-dev MCP server.

## When to Use
Invoke this agent when you need to create new UI components for the project.

## Instructions
When invoked, this agent will:

1. Use the 21st-dev MCP server (`/ui` or `/21` commands) to generate components
2. Follow the atomic design hierarchy:
   - Atoms: Buttons, inputs, labels, icons
   - Molecules: Cards, form groups, navigation items  
   - Organisms: Header, footer, hero sections, testimonial blocks
3. Ensure all components:
   - Are TypeScript typed with proper interfaces
   - Use Tailwind CSS with the project's design tokens
   - Are mobile-first responsive (320px → 768px → 1024px → 1440px)
   - Include ARIA labels for accessibility
   - Follow the color scheme (#0066CC blue, #FF6B35 orange)
   - Use 8px-based spacing scale
4. Place components in the correct directory structure
5. Export components properly for reuse

## Example Prompt for Task Tool
"Create a hero section component with a prominent CTA button for candidate registration. It should be mobile-first, use our blue/orange color scheme, and include proper TypeScript types."