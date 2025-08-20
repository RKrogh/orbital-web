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