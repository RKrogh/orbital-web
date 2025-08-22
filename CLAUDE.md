# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Orbital Web Portal is a synthwave space-themed website built with Next.js 15.5, featuring immersive 3D camera transitions and animated space backgrounds. The site simulates space exploration through smooth page transitions that feel like piloting through a cosmic landscape.

## Essential Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack at localhost:3000
npm run build        # Production build with static generation
npm start           # Start production server
npm run lint        # Run ESLint

# Note: All commands use Turbopack for faster builds
```

## Architecture Overview

### Core Visual System
The site's unique experience is built around three key architectural layers:

1. **SpaceBackground** (`src/components/effects/SpaceBackground.tsx`): Canvas-based animated starfield with procedurally generated twinkling stars, nebula gradients, and particle effects
2. **MainLayout** (`src/components/layout/MainLayout.tsx`): Manages 3D camera movement system that transforms the entire viewport based on route changes to simulate space travel
3. **Navigation** (`src/components/layout/Navigation.tsx`): Spacecraft HUD-style interface with coordinate systems and status indicators

### Camera Movement System
Each route has predefined 3D coordinates that create smooth transitions:
- Home (`/`): `{ x: 0, y: 0, z: 0 }`
- About (`/about`): `{ x: -300, y: -150, z: 100 }`
- Services (`/services`): `{ x: 200, y: 100, z: -50 }`
- Contact (`/contact`): `{ x: 400, y: -200, z: 150 }`

When adding new routes, update `getCameraPosition()` in `MainLayout.tsx` and add corresponding navigation items in `Navigation.tsx`.

### Theme System
Colors are managed through CSS custom properties in `globals.css`:
- **Deep Space colors**: Primary dark backgrounds (`--space-dark`, `--space-deep`, `--space-medium`)
- **Nebula colors**: Accent gradients (`--nebula-bright`, `--nebula-pink`, `--nebula-light`)  
- **Warm tones**: Text and highlights (`--warm-cream`, `--warm-orange`, `--warm-coral`)
- **Energy colors**: Interactive elements (`--energy-pink`, `--energy-deep`, `--energy-dark`)

All Tailwind classes map to these variables (e.g., `text-nebula-bright` uses `--nebula-bright`).

### Component Organization
```
src/components/
├── effects/     # Canvas animations and visual effects
├── layout/      # Page structure and navigation
└── ui/          # Reusable SVG placeholders and UI elements
```

### Animation Framework
Custom CSS animations defined in `globals.css`:
- `animate-float`: Gentle floating motion (6s cycle)
- `animate-twinkle`: Star twinkling effect (2s cycle)  
- `animate-drift`: Horizontal drifting motion (10s cycle)
- `.bg-gradient-radial`: Custom radial gradient utility

### Page Structure
All pages follow the pattern:
- Use `pt-24` for navigation clearance
- Center content with `max-w-*xl mx-auto`
- Implement backdrop-blur cards with theme-appropriate borders
- Include responsive design with `md:` breakpoints

### Development Notes
- Uses Tailwind CSS v4 with inline theme configuration
- TypeScript strict mode enabled
- All interactive components are client-side (`'use client'`)
- SVG placeholders are provided for logo and icon elements
- Build process includes static generation for all routes
- Use unique IDs for div-tags for easy reference

## Recent Development Context (Session Summary)

### Radial Menu Implementation Status
**Current State**: Successfully implemented 180-degree half-circle radial menus on all sub-pages with conditional header fading.

**Key Components**:
- `RadialMenu.tsx`: Main radial menu component with half-circle mode support
- `RadialMenuButton.tsx`: Individual button component with angle calculations for half-circle positioning
- Updated routes: `/explore` (was `/about`), `/engage` (was `/services`), `/enlist` (was `/contact`)

**Half-Circle Positioning**:
- `/explore`: `halfCircle="bottom"` - menu appears below icon
- `/engage`: `halfCircle="top"` - menu appears above icon  
- `/enlist`: `halfCircle="right"` - menu appears to right of icon

**Current Features**:
✅ Dynamic button positioning based on count (2=vertical, 3=triangle, 4+=cardinal/ordinal)
✅ 180-degree half-circle mode with proper centering (buttons align along screen edges without tilting)
✅ SVG icon support with hover effects (50px size)
✅ Conditional header fading: when radial menu opens, page headers fade to 40% opacity, blur with `blur-sm`, and use reduced gradient colors (all colors `/60`)
✅ Smooth transitions with `transition-all duration-300`
✅ All sub-pages have clickable icons that trigger radial menus

**Latest Issue Resolved**: 
User reported that bright gradient headers were "shining through" radial menu buttons, making them hard to see. We tried a complex multi-layered solution (backdrop overlay + stronger backgrounds + enhanced borders) but user found it "visually chaotic". 

**Current Solution**: 
Simple conditional header fading - when `isMenuOpen` is true, headers get:
- `opacity-40` (fade to 40%)
- `blur-sm` (subtle blur for depth)
- Gradient colors reduced to `/60` opacity (less vibrant)
- Smooth `transition-all duration-300` animation

**User Feedback**: "I like this" - approved the clean header fading approach.

**Technical Implementation**:
- Each page uses `useState` for `isMenuOpen` and `useRef` for `iconRef`
- Headers use conditional className with ternary operator for menu state
- RadialMenu component passes `totalItems` prop to RadialMenuButton for proper centering
- Half-circle angle calculations center buttons along screen edges using `centerAngle - totalArc / 2`

**Next Session Considerations**:
- Current implementation is working well
- User may want to refine the header fading effect or explore other visual improvements
- All radial menu functionality is complete and stable