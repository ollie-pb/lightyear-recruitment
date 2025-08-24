# Component Props Reference

## CRITICAL: Components use different prop conventions!

### Button Component
- **Size**: `'small' | 'medium' | 'large'` (semantic)
- **Variant**: `'primary' | 'secondary' | 'outline'`
- **Color**: Not supported (use variant instead)

### Text Component  
- **Size**: `'xs' | 'sm' | 'base' | 'lg' | 'xl'` (Tailwind-style)
- **Color**: `'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'inverse'`
- **Note**: Does NOT support 'primary' or 'secondary'

### Heading Component
- **Size**: `'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'` (Tailwind-style)
- **Color**: `'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error'`
- **Note**: Does NOT support 'primary' or 'secondary'

### Icon Component
- **Size**: `'xs' | 'sm' | 'base' | 'lg' | 'xl'` (Tailwind-style)
- **Color**: `'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'inverse' | 'current'`
- **Note**: Does NOT support 'primary' or 'secondary'

### FormGroup Component
- **Size**: `'sm' | 'base' | 'lg'` (Tailwind-style subset)
- **Type**: `'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select' | 'file'`
- **Note**: Does NOT support 'checkbox' type

### Hero Component
- **Props**: Uses `headline` and `subheadline`, NOT `title` and `subtitle`
- **No `variant` prop exists**

## Common Mistakes to Avoid

1. ❌ Button size="sm" → ✅ Button size="small"
2. ❌ Button size="lg" → ✅ Button size="large"  
3. ❌ Text size="small" → ✅ Text size="sm"
4. ❌ Icon color="primary" → ✅ Icon color="accent"
5. ❌ Text color="primary" → ✅ Text color="accent"
6. ❌ Hero variant="centered" → ✅ Remove variant prop
7. ❌ Hero title="..." → ✅ Hero headline="..."

## Design System Issues

This inconsistency is technical debt that should be addressed:
- Components should use consistent prop naming conventions
- Either all semantic ('small', 'medium', 'large') or all Tailwind ('sm', 'base', 'lg')
- Color props should be unified across all components