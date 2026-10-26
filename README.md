# 🌌 Dark Matter — The Invisible Mass Shaping Reality

> An interactive 3D astrophysics exhibition and scientific laboratory built for exploring the 85% of cosmic matter that emits no light, interacts with zero photons, and holds the universe together.

---

## 🔭 Project Overview

This web application is an educational, interactive exhibition designed to make dark matter physics intuitive, mathematically rigorous, and presentation-ready for academic defense and classroom presentations.

While ordinary baryonic matter (atoms, stars, planets, and humans) accounts for less than 5% of the cosmic energy budget, Dark Matter comprises ~26.8% of the universe and ~84.6% of all physical matter. Through interactive real-time 3D simulations built with Three.js and React Three Fiber, visitors explore empirical proofs and theoretical frameworks across multiple cosmological scales.

---

## 🌟 Interactive Simulation Stations

### 1. Galaxy Rotation Curves (Stellar Kinematics)
- **Scientific Foundation**: Observations by Vera Rubin & Kent Ford (1970s).
- **Interactive Control**: Real-time Dark Matter Halo fraction slider (0% to 100%).
- **Physics**: Demonstrates the departure from Keplerian expectation ($v \propto 1/\sqrt{r}$) to observed flat rotation curves ($v \sim 220\text{ km/s}$), mathematically deriving that mass must scale linearly with radius ($M(r) \propto r$).
- **Features**: Dual orbiting reference telemetry probes (Core Probe Alpha at 1.6 kpc vs. Rim Probe Beta at 5.4 kpc) with differential angular velocity ($\omega(r)$) and vertical galactic disk warp waves.

### 2. Gravitational Lensing & Spacetime Curvature
- **Scientific Foundation**: Einstein's General Relativity & Fritz Zwicky (1937).
- **Interactive Control**: Toggle the unseen cluster mass on and off to observe light deflection in real time.
- **Physics**: Derives the relativistic deflection angle $\alpha = \frac{4GM}{c^2 b}$ and calculates the Einstein Ring radius $\theta_E$.
- **Features**: Dynamic spacetime potential well with living ripple waves, 144 high-speed streaming photons deflecting along geodesics, and 4 Einstein mirage arclets.

### 3. The Bullet Cluster (1E 0657-558 — The Cosmic Smoking Gun)
- **Scientific Foundation**: Chandra X-ray Observatory & Hubble/Magellan weak lensing surveys (Clowe et al. 2006).
- **Interactive Control**: 3-stage temporal scrubber (`T-0: Pre-Collision`, `T+0: Supersonic Impact`, `T+Today: Observed Separation`).
- **Physics**: Refutes Modified Newtonian Dynamics (MOND). In MOND, the gravitational center must align with the viscous X-ray plasma (80% of baryonic mass). Weak lensing proves the center of gravitational mass passed straight through alongside the collisionless dark matter halos.
- **Features**: Supersonic shockwave cone, undulating shock fronts, and separated X-ray gas vs. DM halo centroids.

### 4. Large-Scale Cosmic Web Architecture
- **Scientific Foundation**: Millennium & Illustris cosmological N-body simulations.
- **Interactive Controls**: Individual layer toggles for **Dark Matter Filaments**, **Galaxy Nodes**, and **Cosmic Voids**.
- **Features**: 9,000 filament particles, 350 streaming matter inflow particles along cosmic highways, real supercluster nodes (Laniakea, Shapley, Coma, Perseus, Hercules), and 3D cosmic void bubble volumes (Boötes Void, Local Void, Sculptor Supervoid).
- **Educational Deep Dive**: Explains why ordinary matter could not form galaxies on its own prior to recombination ($z \approx 1100$) due to radiation pressure.

### 5. The Cosmological Mass-Energy Budget (Planck 2018)
- **Interactive 3D Proportional Gyroscope Rings**: Visualizing Dark Energy (68.3%), Dark Matter (26.8%), and Ordinary Baryonic Matter (4.9%).
- **Viva Master Key**: Side-by-side comparison table addressing the #1 student confusion: **Dark Matter vs. Dark Energy**.

### 6. Particle Candidate Matrix
- Comparative evaluation of the leading beyond-Standard-Model candidates:
  - **WIMPs** (Weakly Interacting Massive Particles — SUSY, 10–1000 GeV, liquid xenon detectors)
  - **Axions** (Ultra-light pseudo-scalar bosons, $10^{-6}$ eV, Primakoff effect resonant cavities)
  - **Primordial Black Holes** (Non-particle macroscopic relics from inflation, gravitational microlensing)

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **3D Graphics & Physics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animation**: Framer Motion & CSS Keyframe Physics
- **Audio Synthesizer**: Web Audio API Procedural Celestial Chimes & Pulses
- **Icons**: Lucide React
- **Styling**: Curated Vanilla CSS with glassmorphism, responsive grids, and tailored typography

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yashcod21er/dark-matter-exhibition.git

# Navigate into project directory
cd dark-matter-exhibition

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173/`.

### Production Build

```bash
# Compile and bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🎓 Academic Presentation Mode

Every evidence station and educational module features an interactive **"Explain to Professor"** mode providing:
- 30-second elevator pitches
- Explicit step-by-step mathematical derivations
- Direct answers to common examination and viva defence questions

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
