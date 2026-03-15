# 🎨 Nursery Brand Theme - Design System

## Color Palette Transformation

### Primary Colors
| Element | Color Name | Hex Code | Usage |
|---------|-----------|----------|-------|
| **Primary** | Deep Forest Green | `#2D473E` | Logo, headers, primary buttons, navigation |
| **Secondary** | Soft Sage Green | `#C5CDC1` | Hover states, badges, accents |
| **Accent** | Warm Cream | `#F7F6F2` | Main background, cards |
| **Text** | Dark Charcoal | `#333333` | Body text, headings |

### Semantic Colors (Earthy Tones)
- **Success**: `#6B8E7F` - Muted teal green
- **Warning**: `#D4A574` - Warm tan/beige
- **Danger**: `#C17767` - Soft terracotta
- **Info**: `#8B9D9A` - Dusty sage

## Typography System

### 1. Logo Font - Heavy Rounded Serif
- **Font**: Playfair Display
- **Weight**: 900 (Black)
- **Style**: High contrast serif with elegant curves
- **Usage**: Logo text only
- **Characteristics**: 
  - Heavy, rounded appearance
  - Teardrop terminals
  - Similar to Cooper Black aesthetic
  - Letter spacing: Tight (-0.025em)

### 2. Heading Font - Geometric Sans-Serif
- **Font**: Montserrat
- **Weights**: 300-800
- **Style**: Modern, clean geometric sans-serif
- **Usage**: All headings (h1-h6), section titles
- **Characteristics**:
  - Low contrast
  - Circular "o" shapes
  - Generous letter spacing (0.025em)
  - Professional and modern

### 3. Body & Navigation - Clean Sans-Serif
- **Font**: Inter
- **Weights**: 300-700
- **Style**: Highly legible modern sans-serif
- **Usage**: Body text, navigation, buttons, forms
- **Characteristics**:
  - Excellent readability
  - Clean and professional
  - Optimized for screens

## Design Aesthetic

### Visual Style
- **Mood**: Calming, premium, earthy
- **Feel**: Modern boutique with traditional warmth
- **Approach**: Soft, cuddly, yet sophisticated

### Key Design Elements

#### 1. Softer Shadows
All shadows use the forest green color with reduced opacity for a natural, gentle feel:
```css
--shadow-md: 0 4px 6px -1px rgba(45, 71, 62, 0.08)
```

#### 2. Warm Backgrounds
- Primary background: Warm cream (#F7F6F2)
- Secondary background: Pure white (#ffffff)
- Creates a soft, inviting canvas

#### 3. Earthy Color Harmony
- Forest green + Sage green = Natural, calming
- Warm cream backgrounds = Cozy, premium
- Dark charcoal text = Excellent readability

#### 4. Typography Pairing
The combination creates a "modern boutique" aesthetic:
- **Bold serif** (Playfair Display) for brand identity
- **Wide-spaced sans-serif** (Montserrat) for subheadings
- **Clean sans-serif** (Inter) for body content

## Component Updates

### Updated Elements
1. **Logo** - Now uses Playfair Display with black weight
2. **Hero Badge** - Sage green background with forest green border
3. **Buttons** - Warm tan accent color (#D4A574) for CTAs
4. **Headings** - Montserrat with generous letter spacing
5. **Shadows** - Softer, natural shadows using forest green
6. **Backgrounds** - Warm cream primary background
7. **OTP Email Template** - Branded password reset email using inline CSS for email client compatibility

## OTP Email Theme Mapping

The forgot-password OTP email follows the same brand language used in the frontend:

- Header gradient uses the primary family: `#2D473E -> #3d5d52`
- Email canvas background uses accent: `#F7F6F2`
- OTP card border and text use dark primary tones for strong visibility
- Supporting highlight strip uses warning accent: `#D4A574`

### Why Inline CSS

Most email clients do not fully support external stylesheets or advanced selectors.
The OTP email uses inline styles to preserve visual consistency across Gmail and other clients.

### OTP Readability Standard

The OTP block is intentionally high contrast:

- Large font size
- Bold weight
- Monospace digits
- Dark text on light background

This ensures the OTP remains readable even in clients that alter colors or fonts.

### Color Usage Guidelines

#### Buttons
- **Primary**: Forest green gradient
- **Secondary**: White with forest green border
- **Accent**: Warm tan (#D4A574) - for main CTAs

#### Text Hierarchy
- **Primary**: Dark charcoal (#333333)
- **Secondary**: Medium gray (#4f4d47)
- **Muted**: Light gray (#8f8d87)
- **Inverse**: Cream (#F7F6F2) on dark backgrounds

#### Backgrounds
- **Page**: Warm cream (#F7F6F2)
- **Cards**: White (#ffffff)
- **Dark sections**: Forest green (#2D473E)

## Accessibility

### Contrast Ratios
- Forest green on cream: ✅ WCAG AA compliant
- Dark charcoal on cream: ✅ WCAG AAA compliant
- White on forest green: ✅ WCAG AA compliant

### Typography Accessibility
- Minimum body text: 16px (1rem)
- Line height: 1.75 for body text
- Letter spacing on headings for improved readability

## Brand Personality

### Keywords
- 🌿 Natural
- 🤱 Nurturing
- ✨ Premium
- 🏡 Cozy
- 🎨 Sophisticated
- 💚 Calming

### Design Philosophy
The nursery brand theme balances:
1. **Traditional warmth** (serif logo, earthy colors)
2. **Modern cleanliness** (geometric sans-serif, ample whitespace)
3. **Premium quality** (sophisticated typography, soft shadows)
4. **Approachability** (warm colors, gentle curves)

## Implementation Notes

### Font Loading
All fonts are loaded from Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
```

### CSS Variables
All colors and typography are defined as CSS custom properties in `variables.css` for easy theming and maintenance.

### Backend Email Template

The themed OTP email HTML is generated in `backend/routes/auth.js` inside the forgot-password mail sender.
When updating theme colors, update both frontend CSS variables and this email template so branding remains consistent.

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback fonts included in font stack
- Progressive enhancement for advanced features

---

**Result**: A sophisticated, earthy nursery brand aesthetic that feels calming, premium, and modern while maintaining warmth and approachability.
