# AERIS — Midnight Collective Cafe

AERIS is an immersive, high-end, dark-themed promotional website for an artisanal midnight cafe. It features cinematic entry loading screens, smooth momentum-based scrolling, custom GPU-accelerated canvas particle systems, and scroll-pinned product showcase experiences.

---

## ☕ Visual Experience & Core Features

*   **Cinematic Loader**: A custom-designed split-panel loader that slides open from the center upon load to reveal the main landing experience.
*   **Volumetric Cup Reveal**: Smooth loading entrance animation that lifts and fades the centerpiece coffee cup using custom GSAP transitions.
*   **Roast Specifications Dashboard**: An interactive specs panel in the **Alchemy** section showcasing coffee roasting details (roast temp, duration, elevation) alongside an elegant custom SVG roast curve temperature chart.
*   **Signature Artifacts Video Grid**: A masonry-style showcase showcasing high-fidelity video loops of brewing rituals alongside interactive product detail cards.
*   **Responsive Showcase Section**: A pinned horizontal slider showcase that adapts to all device widths:
    *   *Desktop (`lg` and up)*: A clean side-by-side layout with horizontal sliding copy and product image updates.
    *   *Mobile/Tablet (below `lg`)*: An immersive full-bleed overlay layout where text details sit on top of responsive fullscreen background images.
*   **Immersive Sanctuary Card**: The **Haven** section presents an elegant, 3D tilt-interactive card containing address and operational hours. On mobile viewports, the framed cafe layout expands full-bleed to maximize the backdrop immersion.
*   **Mobile-Optimized Navigation Overlay**: A custom touch-friendly hamburger button that slides open a full-screen glassmorphic navigation overlay.
*   **GPU-Accelerated Backdrops**: Smooth 60fps scrolling performance achieved by forcing all heavy CSS background blurs (`blur-[120px]`) and translate parameters into hardware-composited GPU layers.

---

## 🛠️ Technology Stack

*   **HTML5 & CSS3**: Structured semantic markup styled with **Tailwind CSS v4** (CSS-first architecture).
*   **JavaScript (ES6+)**: Core client-side logic and DOM interactions.
*   **GSAP (GreenSock Animation Platform)**: Handles coordinate transforms, stagger delays, entrance animations, and scroll-linked timelines.
*   **ScrollTrigger**: Connects webpage scroll playhead coordinates directly to GSAP transition playheads.
*   **Lenis**: A lightweight smooth scroll library that provides consistent inertia scrolling across devices.
*   **Vite**: Frontend development server and asset compiler.

---

## 📂 Project Structure

```bash
├── dist/                  # Compiled production assets
├── public/                # Static public assets
│   └── favicon.svg        # Combined 'A' & 'R' brand logo favicon
├── src/
│   ├── main.js            # Main application logic & animations
│   └── style.css          # Global styles, Tailwind imports & custom variables
├── index.html             # Core webpage entry structure
├── package.json           # Project dependencies & scripts
└── vite.config.js         # Vite bundler configurations
```

---

## 🚀 Running Locally

Follow these instructions to run the project in your local development environment:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18+ recommended) installed.

### 1. Install Dependencies
Navigate to the project directory and install the required npm packages:
```bash
npm install
```

### 2. Start the Development Server
Launch the local dev server:
```bash
npm run dev
```
The console will output the local network URL (typically `http://localhost:5173`).

### 3. Build for Production
To bundle and optimize all files for production deployment:
```bash
npm run build
```
Vite will compile and output static assets directly to the `/dist` directory.

---

## ☁️ Deployment

This project is pre-configured and fully optimized for **Vercel** out-of-the-box:

*   **Framework Preset**: Vite
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist`
*   **Install Command**: `npm install`
