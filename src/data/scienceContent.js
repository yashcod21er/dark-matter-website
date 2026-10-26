/**
 * Rigorous, educational, and presentation-ready content for the Dark Matter science exhibition.
 * Designed to make complex astrophysics intuitive and easy to explain to professors and academic audiences.
 */

export const HERO_CONTENT = {
  title: "THE INVISIBLE MASS SHAPING REALITY.",
  subtitle: "85% of all matter in the universe produces no light, reflects no photons, and evades direct detection.",
  description:
    "We can measure its gravitational signature in the anomalous rotation speeds of spiral galaxies, the curvature of distant starlight, and the separation of colliding galaxy clusters. Explore the interactive laboratory below.",
  stats: [
    { label: "Cosmic Mass-Energy", value: "26.8%", detail: "Planck Collaboration (2018)" },
    { label: "Total Matter Share", value: "84.6%", detail: "Outweighs visible stars 5.4 to 1" },
    { label: "Electromagnetic Flux", value: "0", detail: "Zero emission across all spectra" },
    { label: "Laboratory Limit", value: "< 10⁻⁴⁷ cm²", detail: "Active constraints (LZ, XENONnT)" },
  ],
};

export const INTRODUCTION_CONTENT = {
  tag: "ASTROPHYSICS FUNDAMENTALS",
  heading: "WE KNOW IT'S THERE.\nWE DON'T KNOW WHAT IT IS.",
  lead: "Look at any photograph of a spiral galaxy. The brilliant disk of stars and glowing gas represents only a tiny luminous ember trapped inside a gargantuan, invisible halo of unseen matter.",
  quickPitch: "Core Idea: Visible stars and gas make up only ~15% of a galaxy's mass. The remaining ~85% is Dark Matter—an unseen gravitational reservoir that prevents galaxies from flying apart.",
  presentationPillars: [
    {
      title: "1. What Dark Matter Does",
      desc: "It exerts gravitational attraction. It anchors fast-orbiting outer stars, bends passing light rays, and acts as the gravitational scaffolding that seeded galaxy formation after the Big Bang.",
    },
    {
      title: "2. What Dark Matter Doesn't Do",
      desc: "It has zero electromagnetic interaction. It does not emit, absorb, or reflect light. It casts no shadow and is completely transparent to radio, optical, X-ray, and gamma-ray telescopes.",
    },
    {
      title: "3. How We Know It's Real",
      desc: "Its existence is confirmed across 4 independent cosmic regimes: stellar kinematics (Rubin), gravitational lensing (Einstein/Zwicky), cluster collisions (Bullet Cluster), and the Cosmic Microwave Background (Planck).",
    },
  ],
  paragraphs: [
    "Dark matter does not interact with the electromagnetic force. Unlike ordinary matter, it cannot emit photons to shed kinetic energy, which is why it remains in a diffuse, spherical halo rather than collapsing into a thin disk.",
    "Ordinary baryonic matter (atoms, stars, planets, and humans) accounts for less than 5% of the total cosmic mass-energy budget. All the visible galaxies across the observable universe are merely a cosmic byproduct.",
    "Crucially: Dark Matter and Dark Energy are completely different phenomena. Dark Matter pulls matter together via gravity, whereas Dark Energy accelerates the expansion of space itself.",
  ],
  regions: [
    {
      id: "visible",
      name: "Visible Matter (Baryonic)",
      short: "The visible stellar disk, molecular gas clouds, and central core.",
      description:
        "Made of ordinary atoms (protons, neutrons, electrons). It loses energy through radiation and collapsed into a flat, rotating spiral disk ~100,000 light-years across. However, it accounts for only ~15% of the total galactic mass.",
      radiusScale: "1x (~100,000 light-years)",
      massShare: "~15% of galactic mass",
      color: "#00f5d4",
    },
    {
      id: "halo",
      name: "Dark Matter Halo",
      short: "A colossal, invisible envelope extending far beyond visible stars.",
      description:
        "Extends 5 to 10 times beyond the optical edge of the galaxy (~1,000,000 light-years). Because dark matter cannot radiate away energy electromagnetically, it does not collapse into a flat disk, remaining in a diffuse spherical cloud that provides ~85% of the galaxy's gravitational pull.",
      radiusScale: "5x–10x (~1,000,000 light-years)",
      massShare: "~85% of galactic mass",
      color: "#9d4edd",
    },
    {
      id: "gravity",
      name: "Gravitational Potential Well",
      short: "The curved geometry of spacetime holding the spinning galaxy together.",
      description:
        "According to General Relativity, mass bends spacetime. The dark matter halo carves a deep gravitational potential well, ensuring outer stars orbiting at ~220 km/s remain gravitationally bound instead of being flung into intergalactic space.",
      radiusScale: "Deep spacetime curvature",
      massShare: "Anchors orbital velocities",
      color: "#38bdf8",
    },
  ],
};

export const COMPOSITION_CONTENT = {
  tag: "THE COSMOLOGICAL BUDGET (ΛCDM MODEL)",
  heading: "WHAT IS THE UNIVERSE MADE OF?",
  lead: "High-precision observations from the Planck satellite, WMAP, and Type Ia supernovae establish the cosmic mass-energy inventory with sub-percent accuracy.",
  note: "Professor Tip: Dark Matter represents ~27% of the total cosmic mass-energy, but accounts for ~85% of all matter. Ordinary baryonic matter is merely the remaining ~15% of all matter.",
  professorComparison: {
    title: "The #1 Question Professors Ask: Dark Matter vs. Dark Energy",
    summary: "They sound similar, but in astrophysics they are dynamical opposites:",
    points: [
      {
        feature: "Dynamic Effect",
        dm: "Attractive gravity (pulls matter together, clumps into structures)",
        de: "Repulsive negative pressure (accelerates metric expansion of space)",
      },
      {
        feature: "Spatial Distribution",
        dm: "Inhomogeneous & clumped (concentrated in halos, galaxies, filaments)",
        de: "Smooth & homogeneous (permeates all of space uniformly)",
      },
      {
        feature: "Cosmic Share",
        dm: "~26.8% of total universe (84.6% of matter)",
        de: "~68.3% of total universe",
      },
      {
        feature: "Physical Candidate",
        dm: "Cold non-baryonic particle (WIMP, axion, etc.)",
        de: "Cosmological Constant (Λ) / vacuum energy density",
      },
    ],
  },
  slices: [
    {
      id: "dark_energy",
      name: "Dark Energy (Λ)",
      percentage: 68.3,
      displayPercent: "68.3%",
      color: "#00bbf9",
      accent: "#38bdf8",
      description:
        "A smooth, pervasive form of energy with negative pressure modeled as the Cosmological Constant (Λ) in Einstein's field equations. It causes the expansion of space to accelerate over cosmic time.",
      role: "Cosmic accelerator — drives the accelerated expansion of the universe.",
      professorTakeaway: "Does not clump into galaxies; acts as a repulsive background energy density.",
    },
    {
      id: "dark_matter",
      name: "Dark Matter (CDM)",
      percentage: 26.8,
      displayPercent: "26.8%",
      color: "#9d4edd",
      accent: "#c77dff",
      description:
        "Cold, non-baryonic matter that interacts via gravity (and possibly the weak nuclear force). It provided the gravitational seeds around which all cosmic structures and galaxies formed after the Big Bang.",
      role: "Cosmic scaffolding — holds galaxies together and forms the cosmic web.",
      professorTakeaway: "Accounts for 84.6% of all matter. Clumps gravitationally into halos.",
    },
    {
      id: "ordinary_matter",
      name: "Ordinary Matter (Baryons)",
      percentage: 4.9,
      displayPercent: "4.9%",
      color: "#f59e0b",
      accent: "#fbbf24",
      description:
        "Everything ever touched, seen, or directly observed in human history: stars, planets, gas clouds, and biological life. Even within this 4.9%, luminous stars make up only ~0.5%; most baryonic matter is warm intergalactic gas.",
      role: "Cosmic visible residue — forms chemistry, periodic table, and stars.",
      professorTakeaway: "Only ~15% of all matter in existence is made of atoms.",
    },
  ],
};

export const EVIDENCE_CONTENT = {
  tag: "THE THREE EXPERIMENTAL PILLARS",
  heading: "HOW DO WE PROVE IT EXISTS?",
  subtitle:
    "We cannot see dark matter with photon detectors, yet its gravitational footprint is confirmed across three independent astrophysical domains.",
  stations: {
    rotation: {
      id: "rotation",
      title: "Galaxy Rotation Curves",
      discoveredBy: "Vera Rubin & Kent Ford (1970s)",
      coreConcept: "Stars at the outer edge of spiral galaxies orbit just as fast as stars near the center, violating Newtonian predictions unless an invisible mass halo is present.",
      summary:
        "In our solar system, Keplerian orbital mechanics dictates that outer planets orbit slower: v = √(GM/r) ∝ 1/√r. Mercury orbits at 47 km/s, while Neptune creeps at 5 km/s. Astronomers expected spiral galaxies to follow the same law once outside the bright core.",
      paradox:
        "Vera Rubin measured Doppler shifts of H-II regions across spiral disks and discovered that outer stars orbit at a flat, constant speed (~220 km/s) all the way to the observable edge.",
      mathProof: {
        formula1: "Newtonian Expectation: v(r) = √(G·M_vis / r) ∝ 1/√r",
        formula2: "Rubin Observation: v(r) ≈ const ⟹ M(r) ∝ r",
        derivation: "Since v² = G·M(r) / r is constant, the enclosed mass M(r) must increase linearly with radius (M ∝ r). Because visible stars stop at the optical disk, an unseen spherical halo with density ρ(r) ∝ 1/r² must envelop the galaxy.",
      },
      conclusion:
        "A colossal halo of non-luminous dark matter extends far beyond the visible stars, supplying the inward gravitational pull needed to anchor high-speed outer stars.",
      professorTip:
        "Tell your professor: 'If only visible matter existed, outer stars would fly off into intergalactic space. The flat curve v ≈ const demands that enclosed mass scales linearly with radius M(r) ∝ r, requiring an unseen halo ~5x the size of the optical disk.'",
      toggleA: "Newtonian Keplerian Model (0% DM)",
      toggleB: "Rubin Observed Flat Model (85% DM)",
    },
    lensing: {
      id: "lensing",
      title: "Gravitational Lensing",
      discoveredBy: "Albert Einstein (1915) & Fritz Zwicky (1937)",
      coreConcept: "Mass curves spacetime, bending light rays like a cosmic lens. Measuring the distorted arc images directly weighs the total mass of the lens without relying on light.",
      summary:
        "According to General Relativity, light rays follow null geodesics in curved spacetime. When light from a remote background galaxy passes near a massive foreground cluster, its trajectory bends by deflection angle α = 4GM / (c²·b).",
      paradox:
        "The observed curvature, multiple mirage images, and Einstein rings require far more gravitational mass than can be accounted for by the visible stars and hot gas in the cluster alone.",
      mathProof: {
        formula1: "Einstein Deflection: α = 4G·M_total / (c²·b)",
        formula2: "Mass Ratio: M_lensing ≈ 5 × M_baryonic",
        derivation: "Gravitational lensing is a purely geometric mass scale. It does not assume hydrostatic equilibrium or stellar mass-to-light ratios. It directly weighs the total gravitational curvature of spacetime.",
      },
      conclusion:
        "By reconstructing mass distributions from distorted optical arcs, astrophysicists prove that invisible mass outweighs visible matter by roughly five to one in every surveyed cluster.",
      professorTip:
        "Tell your professor: 'Gravitational lensing is the gold standard for weighing cosmic structures because photons follow spacetime geometry. The lensing deflection measures total mass directly, proving that 80–90% of cluster mass is completely non-luminous.'",
      toggleA: "Visible Cluster Mass Only (Weak Deflection)",
      toggleB: "Total Inferred Mass (Strong Lensing & Rings)",
    },
    bullet: {
      id: "bullet",
      title: "The Bullet Cluster (1E 0657-558)",
      discoveredBy: "Chandra X-Ray Observatory & Magellan/Hubble (2006)",
      coreConcept: "A high-speed collision between two galaxy clusters physically separated ordinary baryonic gas from dark matter, providing decisive proof that dark matter is a physical substance.",
      summary:
        "Two massive galaxy clusters collided at 10 million km/h. Galaxy clusters contain three components: optical stars (1–2% mass), hot intergalactic plasma gas (10–15% mass), and dark matter (85% mass).",
      paradox:
        "During the collision, the hot gas clouds interacted electromagnetically and experienced fluid friction (ram pressure), stalling in the center (visible in pink X-rays). The collisionless stars in galaxies sailed straight through unhindered.",
      mathProof: {
        formula1: "Baryonic Center: Stalled in center via fluid ram pressure (Pink X-Ray Gas)",
        formula2: "Gravitational Peak: Decoupled and located at outer wings with collisionless Dark Matter (Blue Lensing Map)",
        derivation: "If gravity were merely modified (MOND) with no invisible matter, the gravitational potential peaks would HAVE to sit at the center where 90% of the visible baryonic mass is. Instead, weak lensing maps reveal that the gravitational peaks are spatially decoupled from the gas!",
      },
      conclusion:
        "Weak gravitational lensing maps confirm that the bulk of the mass passed cleanly through the collision alongside the galaxies. This proves dark matter is an actual physical entity with negligible self-interaction, ruling out pure modified gravity models.",
      professorTip:
        "Tell your professor: 'The Bullet Cluster is the smoking gun that rules out pure Modified Newtonian Dynamics (MOND). Because the gravitational potential peaks (weak lensing) are spatially separated from the baryonic mass peaks (hot X-ray gas), the gravitational source MUST be an unseen physical particle that passed through without collision.'",
      steps: [
        { label: "Pre-Collision", desc: "Two galaxy clusters approach each other at high velocity (~4,500 km/s)." },
        { label: "Peak Collision", desc: "Hot plasma gas clouds collide and decelerate via ram pressure; shockwave forms." },
        { label: "Observed Today", desc: "Collisionless dark matter & galaxies pass through, leaving the dragged hot gas trapped in the middle." },
      ],
    },
  },
};

export const COSMIC_WEB_CONTENT = {
  tag: "LARGE-SCALE STRUCTURE FORMATION",
  heading: "THE INVISIBLE SCAFFOLD OF THE COSMOS.",
  lead:
    "On scales of hundreds of millions of light-years, galaxies are not randomly scattered. They form a vast, interconnected filamentary web shaped by dark matter gravity wells.",
  whyDarkMatterNeeded: {
    question: "Why couldn't ordinary matter form galaxies on its own?",
    answer:
      "Before recombination (the first 380,000 years after the Big Bang), ordinary matter was tightly coupled to photons in a hot, pressurized plasma. Whenever ordinary matter tried to collapse under gravity, radiation pressure blew it apart. But Dark Matter does NOT interact with photons! It began clumping gravitationally from the earliest moments, carving out deep potential wells. When the universe cooled and the Cosmic Microwave Background was released, ordinary gas fell into these pre-existing dark matter scaffolding wells, rapidly forming the first stars and galaxies.",
  },
  features: [
    {
      title: "Dark Matter Filaments",
      desc: "Gravitational highways spanning hundreds of millions of light-years along which gas and galaxies stream into supercluster hubs.",
    },
    {
      title: "Supercluster Nodes",
      desc: "Intersections where multiple dark matter filaments meet (e.g., Laniakea, Shapley), forming the most massive gravitationally bound structures in the universe.",
    },
    {
      title: "Cosmic Voids",
      desc: "Colossal under-dense bubbles spanning hundreds of millions of light-years that contain virtually zero dark matter and almost no galaxies.",
    },
  ],
};

export const CANDIDATES_CONTENT = {
  tag: "THEORETICAL PARTICLE PHYSICS",
  heading: "WHAT IS DARK MATTER MADE OF?",
  lead:
    "We know what dark matter does, but its particle identity remains unknown. Particle physicists and cosmologists have proposed three leading theoretical frameworks beyond the Standard Model.",
  disclaimer:
    "Scientific Status: Hypothesized candidates. Extremely constrained by active worldwide experiments, but unconfirmed.",
  list: [
    {
      id: "wimp",
      name: "WIMPs",
      fullName: "Weakly Interacting Massive Particles",
      massRange: "10 to 1,000 GeV (Giga-electronvolts)",
      mechanism: "Heavy particles predicted by Supersymmetry that interact only via gravity and the weak nuclear force.",
      detectionMethod:
        "Deep underground cryogenic tanks filled with liquid xenon (LZ, XENONnT) waiting for a WIMP to hit a xenon nucleus, producing scintillation flashes (S1/S2 signals).",
      pros: "'The WIMP Miracle': Thermal freeze-out in the early universe naturally produces the exact observed relic density of dark matter (~27%).",
      professorSummary: "Heavy, cold particle candidate. Actively constrained down to the 'neutrino fog' floor.",
      status: "Actively Constrained",
      statusColor: "#00f5d4",
      visualMode: "lattice",
    },
    {
      id: "axion",
      name: "Axions",
      fullName: "Ultra-Light Pseudo-Scalar Bosons",
      massRange: "10⁻⁶ to 10⁻³ eV (Micro-electronvolts)",
      mechanism:
        "Extremely light particles originally predicted by Peccei and Quinn to explain why the strong nuclear force does not violate CP symmetry (the Strong CP problem).",
      detectionMethod:
        "Microwave resonant cavities (ADMX) tuned to magnetic fields where the Primakoff effect converts incoming axions into detectable microwave photons.",
      pros: "Solves two major physics problems simultaneously: the Strong CP problem in QCD and the mystery of cosmic dark matter.",
      professorSummary: "Bose-Einstein wave-like dark matter candidate with ultra-low mass.",
      status: "Intense Investigation",
      statusColor: "#c77dff",
      visualMode: "wave",
    },
    {
      id: "other",
      name: "Primordial Black Holes",
      fullName: "Non-Particle Relics & Novel Models",
      massRange: "Asteroid to Planetary Masses (10¹⁷ to 10²⁴ grams)",
      mechanism:
        "Black holes formed directly from high-density gravitational collapse during the first fraction of a second of the universe, before Big Bang nucleosynthesis.",
      detectionMethod:
        "Gravitational microlensing surveys (Subaru Hyper Suprime-Cam) watching for temporary magnification of background stars, and space-based gravitational wave detectors (LISA).",
      pros: "Does NOT require any new elementary particle physics beyond General Relativity.",
      professorSummary: "Gravitational non-baryonic macroscopic candidate from early universe inflation.",
      status: "Broad Exploration",
      statusColor: "#38bdf8",
      visualMode: "singularity",
    },
  ],
};

export const MYSTERIES_CONTENT = {
  tag: "FRONTIERS & FUTURE OBSERVATORIES",
  heading: "THE BIGGEST QUESTIONS REMAIN OPEN.",
  lead:
    "Nearly a century after Fritz Zwicky first coined 'dunkle Materie' in 1933, solving dark matter is recognized as the key to unlocking physics beyond the Standard Model.",
  questions: [
    {
      number: "01",
      question: "Is dark matter a single particle or an entire 'Dark Sector'?",
      context:
        "Just as ordinary matter has quarks, leptons, gluons, and photons, dark matter might not be a single monolithic particle, but a complex family of dark particles governed by their own dark forces.",
      currentEfforts:
        "Next-generation experiments at CERN's High-Luminosity LHC, looking for missing transverse energy and displaced dark photon decays.",
    },
    {
      number: "02",
      question: "Why haven't direct underground detectors seen a signal yet?",
      context:
        "Experiments have pushed detection cross-sections down below 10⁻⁴⁷ cm² without an unambiguous signal, approaching the 'neutrino fog' where solar and atmospheric neutrinos create an irreducible background.",
      currentEfforts:
        "Constructing multi-ton scale liquid noble detectors (DARWIN, XLZD) capable of directional recoil discrimination.",
    },
    {
      number: "03",
      question: "Can new telescopes resolve small-scale structure anomalies?",
      context:
        "Simulations of pure cold collisionless dark matter predict cuspy galaxy cores and thousands of dwarf satellite galaxies, while observations often reveal flatter cores (the core-cusp problem).",
      currentEfforts:
        "Deep sky wide-field surveys with the Vera C. Rubin Observatory (LSST), the ESA Euclid mission, and NASA's Nancy Grace Roman Space Telescope.",
    },
  ],
};

