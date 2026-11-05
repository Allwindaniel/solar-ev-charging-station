/* =====================================================================
   Solar EV Charging Station — all site content
   Source: solar_charging_station_website_content.pdf +
           solar_charging_station_cost_analysis.pdf (prices as of Nov 2026)

   Every page renders from this file. Do not retype numbers into HTML.
   Costs are plain numbers in rupees; format them with fmtINR().
   Loaded as a classic <script> (not a module) so index.html works
   when opened straight from the folder.
   ===================================================================== */

window.fmtINR = function (n) {
  return "₹" + Number(n).toLocaleString("en-IN");
};

window.SITE = {
  title: "Solar Electric Vehicle (EV) Charging Station",
  pricesAsOf: "Prices as of Nov 2026",
  horizonYears: 30,

  /* ---------- Energy-path stages (part order follows the energy path) ---------- */
  groups: [
    { id: "generation",   name: "Generation",                parts: [1, 2, 3] },
    { id: "conversion",   name: "Conversion and storage",    parts: [4, 5, 6, 7] },
    { id: "distribution", name: "Distribution and delivery", parts: [8, 9] },
    { id: "operations",   name: "Protection and operations", parts: [10, 11, 12] },
    { id: "foundation",   name: "Foundation",                parts: [13] }
  ],

  /* ---------- Total unit (shown on Home, below the illustration) ---------- */
  station: {
    overview:
      "This is a solar-powered direct current (DC) fast-charging station for electric vehicles (EVs), designed for Indian highways. Canopy panels generate 55 kilowatts (kW) of DC power. A hybrid inverter routes that power to a 57.5 kilowatt-hour (kWh) battery, to the grid, or to the 80 kW charger. The battery covers night and low-sun hours, and the grid fills any gap. Remote monitoring, payment, and safety systems let it run unattended.",
    keySpecs: [
      "Solar capacity: 55 kW (100 panels × 550 watts each)",
      "Battery: 57.5 kWh, lithium iron phosphate (LFP)",
      "Charger: 80 kW DC fast charger",
      "Grid-connected, hybrid operation",
      "Analysis horizon: 30 years"
    ],
    headlineStats: [
      { value: "55 kW",        label: "Solar capacity" },
      { value: "57.5 kWh",     label: "LFP battery" },
      { value: "80 kW",        label: "DC fast charger" },
      { value: "₹2.44 crore",  label: "30-year total price" }
    ]
  },

  /* ---------- The 13 parts ---------- */
  parts: [
    {
      id: 1, slug: "solar-panels", group: "generation",
      name: "Solar panels",
      tooltip: "Convert sunlight into direct current (DC) electricity. 100 panels give 55 kilowatts (kW) total.",
      explanation: "The panels are the energy source of the whole station. Each 550-watt panel turns sunlight into DC power through photovoltaic cells. Together they feed the charger directly during the day and fill the battery for later. Without them the station is just a grid charger. Panels are a commodity, since all Tier-1 brands perform almost the same, so a lower-cost brand was chosen.",
      specs: "100 panels × 550 watts (W) each, 55 kilowatts (kW) total",
      source: "Waaree Energies",
      initialCost: 1072500,
      lifespan: "25–30 years",
      replacements: "0 (outlasts the horizon)",
      replacementYears: [],
      costEach: null,
      totalReplacementCost: 0,
      extra: [
        { label: "Routine upkeep", value: "Regular cleaning, since dust on highways cuts output" }
      ]
    },
    {
      id: 2, slug: "canopy", group: "generation",
      name: "Canopy / mounting structure",
      tooltip: "Steel frame that holds the panels and shades the charging bays.",
      explanation: "The canopy carries the panel array at the right tilt and height. It also gives electric vehicle (EV) users shade and rain cover while charging, so one structure does two jobs. It must handle wind loads and years of weather, so it uses standard galvanised steel.",
      specs: "Galvanised steel frame",
      source: "Schletter India",
      initialCost: 480000,
      lifespan: "25+ years",
      replacements: "0",
      replacementYears: [],
      costEach: null,
      totalReplacementCost: 0,
      extra: [
        { label: "Routine upkeep", value: "Periodic bolt and corrosion checks" }
      ]
    },
    {
      id: 3, slug: "panel-cleaning", group: "generation",
      name: "Panel cleaning system",
      tooltip: "Keeps the 100 panels dust-free so output stays high, with no water.",
      explanation: "Highway dust steadily cuts panel output. A small battery-powered robot brushes the panels dry on a schedule, with no water and no staff on site. It suits an unmanned canopy, where climbing up to clean is slow and unsafe. At this size it does not save money, so it is chosen for convenience and safety. If the site is staffed, manual cleaning at about ₹3,000–6,000 a year is the cheaper option.",
      specs: "1 waterless, battery-powered cleaning robot, enough for 100 panels",
      source: "Photom Technology (Ahmedabad). Alternatives: Skilancer Solar, Leapting.",
      initialCost: 145000,
      initialCostRange: "₹1.3–1.6 lakh",
      lifespan: "About 10 years",
      replacements: "2 (years 10 and 20)",
      replacementYears: [10, 20],
      costEach: 145000,
      totalReplacementCost: 290000,
      extra: [
        { label: "Running cost", value: "About ₹20 per cleaning cycle, against ₹100–120 for manual cleaning" },
        { label: "Servicing", value: "An annual maintenance contract runs about 15% of the robot’s cost (₹19,500–24,000 per year). This is covered by the 2% operation and maintenance budget." },
        { label: "Payback", value: "25–38 years, so it is not a cost saver" }
      ]
    },
    {
      id: 4, slug: "dc-combiner", group: "conversion",
      name: "Direct current (DC) combiner box + cabling",
      tooltip: "Merges all panel strings into one direct current (DC) feed and carries it to the inverter.",
      explanation: "Panels are wired in strings. The combiner box merges these strings into a single DC line and carries it to the inverter. It also holds fuses and protection for each string. Cable and connector insulation ages under sun and heat, which is why it needs one mid-life replacement.",
      specs: "String combiner with fuses, direct current (DC) cabling and connectors",
      source: "Polycab India",
      initialCost: 80000,
      lifespan: "About 16 years",
      replacements: "1 (year 16)",
      replacementYears: [16],
      costEach: 80000,
      totalReplacementCost: 80000,
      extra: []
    },
    {
      id: 5, slug: "hybrid-inverter", group: "conversion",
      name: "Hybrid inverter / maximum power point tracking (MPPT), 55 kilowatts (kW)",
      shortName: "Hybrid inverter / MPPT",
      tooltip: "Extracts maximum power from panels and manages flow between solar, battery, and grid.",
      explanation: "The inverter is the brain of the power system. Its maximum power point tracking (MPPT) function keeps the panels at their best operating point as sunlight changes. It also decides in real time where power goes: to the charger, into the battery, or to and from the grid. It runs hot and constantly, so a premium unit with better capacitors, better cooling, and a 10–12 year warranty was chosen.",
      specs: "55 kilowatts (kW), hybrid with maximum power point tracking (MPPT)",
      source: "Delta Electronics India",
      initialCost: 950000,
      lifespan: "About 12 years",
      replacements: "2 (years 12 and 24)",
      replacementYears: [12, 24],
      costEach: 950000,
      totalReplacementCost: 1900000,
      extra: []
    },
    {
      id: 6, slug: "battery", group: "conversion",
      name: "Battery energy storage system (BESS), 57.5 kilowatt-hours (kWh), lithium iron phosphate (LFP)",
      shortName: "Battery energy storage (BESS)",
      tooltip: "Stores solar energy for night and low-sun charging.",
      explanation: "The battery lets the station charge cars when the sun is not shining and smooths out the load on the grid. Lithium iron phosphate (LFP) chemistry is chosen for safety and long cycle life, which suits hot Indian conditions. A premium unit was chosen for its stronger battery management and active thermal management.",
      specs: "57.5 kilowatt-hours (kWh), lithium iron phosphate (LFP) chemistry",
      source: "Amara Raja Energy & Mobility",
      initialCost: 1322500,
      lifespan: "About 14 years",
      replacements: "1 full (year 14)",
      replacementYears: [14],
      costEach: 1322500,
      totalReplacementCost: 1322500,
      extra: [
        { label: "Note", value: "A second swap would land around year 28, too close to the end of the horizon. Budget a partial cell refresh instead. It is not included in the totals." }
      ]
    },
    {
      id: 7, slug: "battery-safety", group: "conversion",
      name: "Battery enclosure and site fire safety",
      shortName: "Battery safety",
      tooltip: "Fire extinguishers, a raised base, and impact protection around the battery cabinet.",
      explanation: "Outdoor battery cabinets of this size normally arrive with their own weatherproof enclosure, cooling, and fire detection built in. This part covers what the site adds around the cabinet: a raised base, extinguishers within reach, and bollards against vehicle impact. It matters most on a highway, where cars park close to the equipment. Check the Amara Raja quote to confirm the enclosure and built-in suppression are included.",
      specs: "2 × 9 kg dry-powder (ABC type) and 2 × 4.5 kg carbon dioxide (CO2) extinguishers, concrete plinth, bollards, signage",
      source: "Local fire-safety supplier for extinguishers, project engineering, procurement and construction (EPC) contractor for civil items",
      initialCost: 92300,
      initialCostRange: "₹67,300–1,19,600",
      initialCostBreakdown: [
        { item: "Extinguishers", cost: 17300 },
        { item: "Plinth, bollards, signage (estimate)", cost: 75000 }
      ],
      lifespan: "Extinguishers about 10 years. Plinth and bollards last the project.",
      replacements: "Extinguishers only, 2 (years 10 and 20)",
      replacementYears: [10, 20],
      costEach: 17300,
      totalReplacementCost: 34600,
      extra: [
        { label: "Refills", value: "About ₹3,500 per year for four units, covered by the operation and maintenance budget" },
        { label: "Risk", value: "If the battery quote is modules only, with no cabinet, an outdoor cabinet with cooling and fire suppression becomes a major extra line. Get a quote." }
      ]
    },
    {
      id: 8, slug: "metering-lt-panel", group: "distribution",
      name: "Metering and low-tension (LT) distribution panel",
      shortName: "Metering & LT panel",
      tooltip: "Measures energy in and out, and distributes alternating current (AC) power between inverter, battery, charger, and grid.",
      explanation: "The revenue meter records grid import and export for billing. Two sub-meters track solar generation and charger energy, so savings can be proven and users billed per kilowatt-hour (kWh). The low-tension (LT) panel holds the main breakers and busbars that connect the inverter, battery, charger, and grid supply. It is the single point where the whole station is switched and isolated.",
      specs: "Current-transformer (CT) operated meter with CTs and moulded case circuit breaker (MCCB), metering box, 2 sub-meters, solar alternating current (AC) distribution box (ACDB) / low-tension (LT) distribution panel",
      source: "Electricity distribution company (DISCOM) approved meter makes (Secure Meters, L&T, HPL, Genus). Panel from a local panel builder with branded circuit breakers.",
      initialCost: 147100,
      initialCostRange: "₹1,15,940–2,65,500",
      initialCostBreakdown: [
        { item: "Meter with current transformers and circuit breaker", cost: 22500 },
        { item: "Meter box", cost: 13600 },
        { item: "Low-tension panel", cost: 100000 },
        { item: "2 sub-meters", cost: 11000 }
      ],
      lifespan: "About 15 years for meters and breakers. The enclosure and busbars outlast the project.",
      replacements: "1 partial (year 15)",
      replacementYears: [15],
      costEach: 73550,
      costEachNote: "about 50% of initial, an assumption",
      totalReplacementCost: 73550,
      extra: [
        { label: "Notes", value: [
          "This assumes metering on the low-tension (LT) side (415 volts). If the distribution company requires high-tension (HT) side metering, get a separate quote.",
          "Some breakers overlap with Part 10, so avoid counting them twice."
        ] }
      ]
    },
    {
      id: 9, slug: "dc-fast-charger", group: "distribution",
      name: "Direct current (DC) fast charger, 80 kilowatts (kW)",
      shortName: "DC fast charger",
      tooltip: "Converts power to direct current (DC) and charges electric vehicles quickly.",
      explanation: "This is the part users actually touch. It takes power from the inverter, battery, or grid and delivers high-power direct current (DC) straight to the car’s battery, bypassing the car’s slower onboard charger. It is the most used and most stressed component, and reliability data shows chargers are where real-world failures occur. A premium model with the best connector engineering, the longest warranty, and a proven service network was chosen.",
      specs: "80 kilowatts (kW), direct current (DC)",
      source: "Servotech Power Systems (premium spec model)",
      initialCost: 1800000,
      lifespan: "About 10 years",
      replacements: "2 (years 10 and 20)",
      replacementYears: [10, 20],
      costEach: 1800000,
      totalReplacementCost: 3600000,
      totalReplacementNote: "largest replacement item",
      extra: []
    },
    {
      id: 10, slug: "protection-safety", group: "operations",
      name: "Protection and safety equipment",
      shortName: "Protection & safety",
      tooltip: "Breakers, surge protection, earthing, and fire safety to prevent faults and hazards.",
      explanation: "This protects people and equipment. Breakers cut off faults, surge protection handles lightning and grid spikes, earthing gives faults a safe path, and fire safety limits damage. It is rarely noticed but essential for a high-power outdoor site open to the public.",
      specs: "Breakers, surge protection, earthing, fire safety",
      source: "Havells India",
      initialCost: 140000,
      lifespan: "About 17 years",
      replacements: "1 (year 17)",
      replacementYears: [17],
      costEach: 140000,
      totalReplacementCost: 140000,
      extra: []
    },
    {
      id: 11, slug: "monitoring-cms", group: "operations",
      name: "Monitoring / charger management system (CMS) + Open Charge Point Protocol (OCPP) gateway",
      shortName: "Monitoring (CMS + OCPP)",
      tooltip: "Software and communication link to monitor and control the charger remotely.",
      explanation: "The charger management system (CMS) lets operators watch the station, spot faults, set pricing, and restart equipment remotely. The Open Charge Point Protocol (OCPP) gateway is the standard communication protocol that connects the charger to the software, so no staff are needed on site. Electronics like this age quickly, so it is replaced often.",
      specs: "Charger management system software, Open Charge Point Protocol gateway",
      source: "Numocity",
      initialCost: 55000,
      lifespan: "About 9 years",
      replacements: "3 (years 9, 18, 27)",
      replacementYears: [9, 18, 27],
      costEach: 55000,
      totalReplacementCost: 165000,
      extra: [
        { label: "Recurring", value: "₹22,000 per year subscription (₹6,60,000 over 30 years)" }
      ]
    },
    {
      id: 12, slug: "payment-cctv-signage", group: "operations",
      name: "Payment kiosk + closed-circuit television (CCTV) + signage",
      shortName: "Payment, CCTV & signage",
      tooltip: "User payment, site security, and directions/branding.",
      explanation: "This is the user-facing layer. The kiosk takes payment, closed-circuit television (CCTV) cameras protect the site and equipment, and signage helps drivers find and use the station from the highway. Outdoor screens and cameras wear out quickly, so it has the shortest lifespan on the list.",
      specs: "Payment kiosk, closed-circuit television cameras, signage",
      source: "Pine Labs + local integrator",
      initialCost: 65000,
      lifespan: "About 8 years",
      replacements: "3 (years 8, 16, 24)",
      replacementYears: [8, 16, 24],
      costEach: 65000,
      totalReplacementCost: 195000,
      extra: []
    },
    {
      id: 13, slug: "civil-grid", group: "foundation",
      name: "Civil work, transformer, grid tie-in",
      shortName: "Civil & grid",
      tooltip: "Foundations, site prep, voltage step-down, and connection to the utility grid.",
      explanation: "This is everything under and around the equipment: foundations, site preparation, the transformer, and the connection to the grid. It also lets the station draw grid power when solar and battery fall short. It is a one-time build that mostly lasts, with only a partial electrical refurbishment later. The cost assumes a straightforward site, so a hard site would cost more.",
      specs: "Foundations, transformer, grid connection",
      source: "Project engineering, procurement and construction (EPC) contractor",
      initialCost: 420000,
      lifespan: "About 22 years",
      replacements: "1 partial refurbishment (year 22)",
      replacementYears: [22],
      costEach: 150000,
      totalReplacementCost: 150000,
      extra: []
    }
  ],

  /* ---------- Cost Summary page (cost analysis PDF, in order) ---------- */
  costSummary: {
    /* Section 1: Total Price.
       Uses O&M at 2% of capex (₹1,35,388) in year 1, rising 5% a year,
       to match the generation analysis and payback figures.
       Shares are of the ₹2,43,75,073 total. */
    totalPrice: {
      rows: [
        { item: "One-time capital expenditure", cost: 6769400, share: "27.8%" },
        { item: "Replacements (30 years)", cost: 7950650, share: "32.6%" },
        { item: "Operation and maintenance (₹1,35,388 in year 1, rising 5% yearly)", cost: 8995023, share: "36.9%" },
        { item: "Charger management system subscription (₹22,000 per year)", cost: 660000, share: "2.7%" }
      ],
      total: 24375073,
      totalLabel: "about ₹2.44 crore",
      flatOMAlternative: {
        note: "If operation and maintenance stayed flat at ₹1,35,388 a year (₹40,61,640 over 30 years), the total would be ₹1,94,41,690 (about ₹1.94 crore).",
        om: 4061640,
        total: 19441690
      }
    },

    /* Section 2: Cost by Parts — render from SITE.parts
       (initialCost + totalReplacementCost), total row:
       initial ₹67,69,400 / replacement ₹79,50,650 */
    costByPartsTotals: { initial: 6769400, replacement: 7950650 },

    takeaways: [
      "Replacements cost more than the original build (₹79.5 lakh vs ₹67.7 lakh).",
      "Charger and inverter make up 69% of replacement cost.",
      "Charger, inverter, and battery make up 86%.",
      "The average cost is about ₹8.1 lakh per year over 30 years (about ₹6.5 lakh if operation and maintenance stayed flat)."
    ],

    /* Section 3: Generation Cost Analysis */
    generation: {
      intro: "This analysis covers a 55 kilowatt solar array at a site with good sunlight on a highway. Daily energy is calculated as: 55 kilowatts × peak sun hours × performance ratio.",
      scenarios: [
        {
          id: "low", name: "Low scenario",
          peakSunHours: 5.0, performanceRatio: 0.75,
          energyPerDayY1: 206, energyY1: 75281, energyY30: 63225,
          energy30yr: 2072524, energy30yrLabel: "20.7 lakh",
          costPerKWh: 11.76,
          revenueY1: 1505625, revenueY30: 5204891, revenue30yr: 104026161,
          paybackYears: 10.9
        },
        {
          id: "base", name: "Base scenario", highlight: true,
          peakSunHours: 5.5, performanceRatio: 0.80,
          energyPerDayY1: 242, energyY1: 88330, energyY30: 74185,
          energy30yr: 2431762, energy30yrLabel: "24.3 lakh",
          costPerKWh: 10.02,
          revenueY1: 1766600, revenueY30: 6107072, revenue30yr: 122057362,
          paybackYears: 9.7
        },
        {
          id: "high", name: "High scenario",
          peakSunHours: 6.0, performanceRatio: 0.85,
          energyPerDayY1: 280, energyY1: 102382, energyY30: 85987,
          energy30yr: 2818633, energy30yrLabel: "28.2 lakh",
          costPerKWh: 8.65,
          revenueY1: 2047650, revenueY30: 7078652, revenue30yr: 141475579,
          paybackYears: 8.6
        }
      ],
      /* Table row labels, in order */
      rowLabels: [
        ["peakSunHours", "Peak sun hours per day"],
        ["performanceRatio", "Performance ratio"],
        ["energyPerDayY1", "Energy per day in year 1 (kilowatt-hours)"],
        ["energyY1", "Energy in year 1 (kilowatt-hours)"],
        ["energyY30", "Energy in year 30 (kilowatt-hours)"],
        ["energy30yr", "30-year energy (kilowatt-hours)"],
        ["costPerKWh", "Cost per kilowatt-hour"],
        ["revenueY1", "Revenue in year 1 at ₹20 per kilowatt-hour"],
        ["revenueY30", "Revenue in year 30 at ₹82.32 per kilowatt-hour"],
        ["revenue30yr", "Total 30-year revenue"],
        ["paybackYears", "Time to recover total investment"]
      ],
      /* Cumulative revenue (₹) at the end of each year 1–30.
         Recomputed from the stated assumptions; it reproduces every
         figure above. Use for the payback chart against the ₹2,43,75,073 line. */
      cumulativeRevenue: {
        low:  [1505625,3163029,4970338,6925691,9027248,11273185,13661692,16190977,18859267,21664801,24605836,27680647,30887520,34224761,37690691,41283644,45001972,48844040,52808231,56892939,61096577,65417570,69854359,74405398,79069157,83844118,88728781,93721656,98821270,104026161],
        base: [1766600,3711288,5831863,8126144,10591972,13227203,16029718,18997413,22128206,25420033,28870848,32478625,36241357,40157053,44223744,48439476,52802313,57310340,61961657,66754382,71686651,76756616,81962448,87302334,92774477,98377099,104108437,109966744,115950290,122057362],
        high: [2047650,4301720,6759659,9418940,12277058,15331531,18579900,22019729,25648603,29464129,33463938,37645679,42007027,46545676,51259340,56145756,61202682,66427895,71819194,77374397,83091345,88967896,95001928,101191341,107534053,114028001,120671142,127461453,134396927,141475579]
      },
      assumptions: [
        "Peak sun hours: 5.0 to 6.0 per day. Most of India receives 4 to 6, and Rajasthan and Gujarat exceed 5.5.",
        "Performance ratio: 0.75 to 0.85. The base case is 0.80, which is slightly low to allow for highway dust.",
        "Panel degradation: 0.6% per year, compounded. Typical Indian panels degrade 0.5% to 0.8% per year.",
        "Cross-check: Utility-scale plants in India typically produce 1,500 to 1,800 kilowatt-hours per kilowatt per year. The base case gives 1,606.",
        "Selling price in year 1: ₹20 per kilowatt-hour, which is ₹5 below the Indian market rate of about ₹25.",
        "Inflation: 5% per year, the same rate used for operation and maintenance costs. The inflation-equivalent selling price in year 30 is ₹82.32 per kilowatt-hour (₹20 compounded at 5% over 29 years).",
        "Price growth: Linear, rising by about ₹2.15 per kilowatt-hour each year from year 1 to year 30.",
        "Investment recovered: The total price of ₹2,43,75,073 from the Total Price section."
      ],
      notes: [
        "The 30-year factor is 27.53 times the year-1 output, because output falls about 16% by year 30.",
        "The cost per kilowatt-hour divides the whole station cost, including the charger, battery, kiosk and civil work, by solar kilowatt-hours only. Those parts also serve grid power, so about ₹10 per kilowatt-hour overstates the true cost of the solar energy itself.",
        "The recovery time compares cumulative sales revenue, with panel degradation applied each year, against the full 30-year total price, which includes replacements, operation and maintenance, and subscription costs. It counts only solar energy sold and ignores interest. Because the whole total price is treated as paid up front for comparison, the real payback would be slightly earlier, since replacements and operating costs are spread across the 30 years."
      ]
    },

    /* Notes from the total unit page — show at the bottom */
    notes: [
      "Operation and maintenance cost at 2% of capital expenditure per year is a planning assumption, not a quote.",
      "Replacement timing for the cleaning robot, metering gear, and extinguishers is an assumption.",
      "A second battery swap around year 28 is not costed. Budget a partial cell refresh instead.",
      "All prices are estimates as of Nov 2026."
    ]
  },

  /* ---------- System Overview (only if time allows) ----------
     Energy flow, put together from the part descriptions. */
  systemFlow: {
    nodes: [
      { id: "panels",   part: 1,  label: "Solar panels (55 kW DC)" },
      { id: "combiner", part: 4,  label: "DC combiner box" },
      { id: "inverter", part: 5,  label: "Hybrid inverter / MPPT" },
      { id: "battery",  part: 6,  label: "Battery (57.5 kWh)" },
      { id: "ltpanel",  part: 8,  label: "Metering & LT panel" },
      { id: "charger",  part: 9,  label: "DC fast charger (80 kW)" },
      { id: "grid",     part: 13, label: "Transformer & grid" },
      { id: "cms",      part: 11, label: "CMS + OCPP gateway" },
      { id: "kiosk",    part: 12, label: "Payment kiosk" },
      { id: "ev",       part: null, label: "Electric vehicle" }
    ],
    edges: [
      { from: "panels",   to: "combiner", kind: "power" },
      { from: "combiner", to: "inverter", kind: "power" },
      { from: "inverter", to: "battery",  kind: "power", twoWay: true },
      { from: "inverter", to: "ltpanel",  kind: "power" },
      { from: "ltpanel",  to: "grid",     kind: "power", twoWay: true },
      { from: "ltpanel",  to: "charger",  kind: "power" },
      { from: "charger",  to: "ev",       kind: "power" },
      { from: "cms",      to: "charger",  kind: "data" },
      { from: "kiosk",    to: "cms",      kind: "data" }
    ],
    supporting: [
      { part: 2,  text: "Canopy holds the panels and shades the bays" },
      { part: 3,  text: "Cleaning robot keeps the panels dust-free" },
      { part: 7,  text: "Battery safety surrounds the battery cabinet" },
      { part: 10, text: "Protection covers the whole site" }
    ]
  },

  /* ---------- Glossary (footer link) ---------- */
  glossary: [
    ["AC", "Alternating current: the type of electricity used by the grid and most equipment"],
    ["ACDB", "Alternating current distribution box: groups and protects the AC circuits"],
    ["BESS", "Battery energy storage system: the battery and its control system"],
    ["Capex", "Capital expenditure: the one-time cost of building the station"],
    ["CCTV", "Closed-circuit television: security cameras"],
    ["CMS", "Charger management system: software to monitor and control chargers"],
    ["CO2", "Carbon dioxide: a gas used in some fire extinguishers"],
    ["CT", "Current transformer: scales a large current down to a safe level for the meter"],
    ["DC", "Direct current: the type of electricity produced by solar panels and batteries"],
    ["DISCOM", "Electricity distribution company: the utility that supplies and meters grid power"],
    ["EPC", "Engineering, procurement and construction: the contractor that builds the site"],
    ["EV", "Electric vehicle"],
    ["HT", "High tension: the high-voltage side of the supply"],
    ["kW", "Kilowatt: a unit of power (1,000 watts)"],
    ["kWh", "Kilowatt-hour: a unit of energy (1 kilowatt used for 1 hour)"],
    ["LFP", "Lithium iron phosphate: a safe, long-life battery chemistry"],
    ["LT", "Low tension: the low-voltage side of the supply (415 volts here)"],
    ["MCCB", "Moulded case circuit breaker: a switch that cuts power during a fault"],
    ["MPPT", "Maximum power point tracking: keeps solar panels at their best operating point"],
    ["O&M", "Operation and maintenance: the yearly running and upkeep cost"],
    ["OCPP", "Open Charge Point Protocol: the open standard that lets chargers talk to management software"],
    ["SVG", "Scalable vector graphic: the image format used for the 2D model"],
    ["W", "Watt: a unit of power"],
    ["ABC type", "Dry-powder extinguisher suited to ordinary materials, flammable liquids, and electrical fires"]
  ]
};
