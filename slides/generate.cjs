const PptxGenJS = require('C:/Users/yanch/AppData/Roaming/npm/node_modules/pptxgenjs');

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Da House';
pres.title = 'GreenLedger — Earth Day Hackathon 2026';

// ─── Design Tokens ─────────────────────────────────────────────────────────
const BG       = '080E0B';   // Near-black green-tinted background
const CARD     = '0F1C14';   // Slightly lighter card bg
const GREEN    = '00C896';   // Brand accent
const GREEN2   = '00A878';   // Darker green for variation
const WHITE    = 'FFFFFF';
const GRAY     = '9CA3AF';
const DIMGRAY  = '374151';
const BORDER   = '1A3326';
const YELLOW   = 'F9E795';
const CORAL    = 'FF6B6B';

const makeShadow = () => ({ type: 'outer', blur: 10, offset: 3, angle: 135, color: '000000', opacity: 0.35 });

// ─── Helper: slide background ───────────────────────────────────────────────
function darkBg(slide) {
  slide.background = { color: BG };
}

// ─── Helper: green top-bar accent ───────────────────────────────────────────
function accentBar(slide, w = 10) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w, h: 0.055,
    fill: { color: GREEN }, line: { color: GREEN }
  });
}

// ─── Helper: slide number ───────────────────────────────────────────────────
function slideNum(slide, num, total = 14) {
  slide.addText(`${num} / ${total}`, {
    x: 8.8, y: 5.35, w: 1, h: 0.2,
    fontSize: 9, color: DIMGRAY, align: 'right', margin: 0
  });
}

// ─── Helper: green dot bullet rows ─────────────────────────────────────────
function dotRow(slide, x, y, w, text, sub) {
  slide.addShape(pres.shapes.OVAL, {
    x, y: y + 0.05, w: 0.12, h: 0.12,
    fill: { color: GREEN }, line: { color: GREEN }
  });
  slide.addText(text, {
    x: x + 0.2, y, w: w - 0.2, h: 0.25,
    fontSize: 12, color: WHITE, bold: true, margin: 0
  });
  if (sub) {
    slide.addText(sub, {
      x: x + 0.2, y: y + 0.25, w: w - 0.2, h: 0.22,
      fontSize: 10, color: GRAY, margin: 0
    });
  }
}

// ─── Helper: stat callout card ──────────────────────────────────────────────
function statCard(slide, x, y, w, h, number, unit, label, color = GREEN) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: CARD },
    line: { color: BORDER, width: 1 },
    shadow: makeShadow()
  });
  // green left accent
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h,
    fill: { color: color }, line: { color: color }
  });
  slide.addText(number, {
    x: x + 0.15, y: y + 0.12, w: w - 0.2, h: h * 0.55,
    fontSize: 32, color: color, bold: true, align: 'center', valign: 'middle', margin: 0
  });
  if (unit) {
    slide.addText(unit, {
      x: x + 0.15, y: y + h * 0.55, w: w - 0.2, h: 0.28,
      fontSize: 11, color: GRAY, align: 'center', margin: 0
    });
  }
  slide.addText(label, {
    x: x + 0.15, y: y + h * 0.55 + 0.25, w: w - 0.2, h: 0.28,
    fontSize: 10, color: GRAY, align: 'center', margin: 0
  });
}

// ─── Helper: section label ───────────────────────────────────────────────────
function sectionLabel(slide, text, x, y) {
  slide.addText(text, {
    x, y, w: 4, h: 0.22,
    fontSize: 8, color: GREEN, bold: true,
    charSpacing: 3, margin: 0
  });
}

// ─── Helper: card with title ────────────────────────────────────────────────
function featureCard(slide, x, y, w, h, title, body) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: CARD },
    line: { color: BORDER, width: 1 },
    shadow: makeShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h,
    fill: { color: GREEN }, line: { color: GREEN }
  });
  slide.addText(title, {
    x: x + 0.14, y: y + 0.1, w: w - 0.2, h: 0.28,
    fontSize: 12, color: WHITE, bold: true, margin: 0
  });
  slide.addText(body, {
    x: x + 0.14, y: y + 0.38, w: w - 0.2, h: h - 0.48,
    fontSize: 10, color: GRAY, margin: 0, wrap: true
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  // Full-width green bar at bottom
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.2, w: 10, h: 0.425,
    fill: { color: '00271C' }, line: { color: '00271C' }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.2, w: 10, h: 0.055,
    fill: { color: GREEN }, line: { color: GREEN }
  });

  // Decorative circle accent
  s.addShape(pres.shapes.OVAL, {
    x: 7.2, y: -0.8, w: 4.5, h: 4.5,
    fill: { color: '001A10', transparency: 0 },
    line: { color: '00C896', width: 1 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: 7.8, y: -0.3, w: 3, h: 3,
    fill: { color: '002A18', transparency: 0 },
    line: { color: '009970', width: 1 }
  });

  // Tag
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.55, w: 2.1, h: 0.3,
    fill: { color: '00C896', transparency: 75 },
    line: { color: GREEN, width: 1 }
  });
  s.addText('EARTH DAY HACKATHON 2026', {
    x: 0.5, y: 0.55, w: 2.1, h: 0.3,
    fontSize: 7, color: GREEN, bold: true, align: 'center', valign: 'middle',
    charSpacing: 1.5, margin: 0
  });

  // Main title
  s.addText('Green', {
    x: 0.5, y: 1.05, w: 2.5, h: 1.0,
    fontSize: 64, color: GREEN, bold: true, margin: 0
  });
  s.addText('Ledger', {
    x: 2.55, y: 1.05, w: 3, h: 1.0,
    fontSize: 64, color: WHITE, bold: true, margin: 0
  });

  // Tagline
  s.addText('AI-Powered Carbon Intelligence\nfor Malaysian SMEs', {
    x: 0.5, y: 2.1, w: 6, h: 0.8,
    fontSize: 18, color: GRAY, margin: 0, lineSpacingMultiple: 1.3
  });

  // Divider
  s.addShape(pres.shapes.LINE, {
    x: 0.5, y: 3.05, w: 5.5, h: 0,
    line: { color: BORDER, width: 1 }
  });

  // Sub info
  s.addText('Upload a utility bill. Get instant carbon footprint analysis.\nAction-ready recommendations. In seconds.', {
    x: 0.5, y: 3.15, w: 6, h: 0.65,
    fontSize: 12, color: GRAY, margin: 0, lineSpacingMultiple: 1.4
  });

  // Bottom bar text
  s.addText('The Access Group · Kuala Lumpur · 22 April 2026', {
    x: 0.4, y: 5.25, w: 9.2, h: 0.33,
    fontSize: 9, color: '4D9977', align: 'left', valign: 'middle', margin: 0
  });
  s.addText('Team Da House', {
    x: 0.4, y: 5.25, w: 9.2, h: 0.33,
    fontSize: 9, color: GREEN, align: 'right', valign: 'middle', margin: 0, bold: true
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE PROBLEM
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 2);

  sectionLabel(s, 'THE CHALLENGE', 0.5, 0.2);
  s.addText('Malaysian SMEs Are Flying Blind\nOn Carbon', {
    x: 0.5, y: 0.5, w: 5.5, h: 1.0,
    fontSize: 28, color: WHITE, bold: true, margin: 0, lineSpacingMultiple: 1.2
  });

  // Problem cards (left column)
  const problems = [
    ['No Visibility', '98% of Malaysian SMEs have zero carbon tracking — manual spreadsheets, if anything at all.'],
    ['Regulatory Tsunami', 'Malaysia\'s Climate Change Act 2023 + Carbon Tax 2026 + EUDR compliance create urgent new obligations.'],
    ['Real Financial Risk', 'EU buyers now demand supply-chain carbon data. Non-compliant SMEs risk losing export contracts worth RM billions.'],
    ['Too Expensive', 'Enterprise carbon platforms cost RM 3,000–15,000/month. SMEs have RM 0 budget for this.'],
  ];

  problems.forEach(([title, body], i) => {
    featureCard(s, 0.5, 1.65 + i * 0.93, 5.2, 0.85, title, body);
  });

  // Right side — big stat
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 1.0, w: 3.4, h: 4.2,
    fill: { color: CARD }, line: { color: BORDER, width: 1 }, shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 1.0, w: 3.4, h: 0.06,
    fill: { color: CORAL }, line: { color: CORAL }
  });

  s.addText('97%', {
    x: 6.1, y: 1.3, w: 3.4, h: 1.1,
    fontSize: 72, color: CORAL, bold: true, align: 'center', margin: 0
  });
  s.addText('of Malaysian SMEs\nhave NO formal\ncarbon reporting\n— Bursa Malaysia 2023', {
    x: 6.2, y: 2.45, w: 3.2, h: 1.4,
    fontSize: 13, color: GRAY, align: 'center', margin: 0, lineSpacingMultiple: 1.4
  });

  s.addShape(pres.shapes.LINE, {
    x: 6.4, y: 3.95, w: 2.8, h: 0,
    line: { color: BORDER, width: 1 }
  });

  s.addText('SMEs = 98.5% of all\nMalaysian businesses\n→ 1.2 million companies', {
    x: 6.2, y: 4.05, w: 3.2, h: 0.9,
    fontSize: 11, color: GRAY, align: 'center', margin: 0, lineSpacingMultiple: 1.4
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — WHY NOW (REGULATORY DRIVERS)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 3);

  sectionLabel(s, 'WHY NOW', 0.5, 0.2);
  s.addText('The Regulatory Clock Is Ticking', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  const events = [
    { year: '2023', label: 'Malaysia Climate Change Act', desc: 'Mandatory GHG reporting for large emitters; SME framework incoming', color: GREEN },
    { year: '2024', label: 'EU Deforestation Regulation (EUDR)', desc: 'Palm oil, timber, rubber exporters must prove zero deforestation + carbon traceability', color: YELLOW },
    { year: '2026', label: 'Malaysia Carbon Tax', desc: 'Carbon pricing begins — SMEs must quantify emissions to calculate liability', color: CORAL },
    { year: '2027', label: 'EU CBAM Expansion', desc: 'Carbon Border Adjustment Mechanism widens scope; Malaysian exporters face tariffs without data', color: '60A5FA' },
  ];

  // Timeline line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.7, y: 1.45, w: 0.05, h: 3.6,
    fill: { color: BORDER }, line: { color: BORDER }
  });

  events.forEach(({ year, label, desc, color }, i) => {
    const y = 1.4 + i * 0.92;

    // Dot on timeline
    s.addShape(pres.shapes.OVAL, {
      x: 1.6, y: y + 0.15, w: 0.25, h: 0.25,
      fill: { color }, line: { color }
    });

    // Year badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.25, y: y + 0.08, w: 1.2, h: 0.32,
      fill: { color, transparency: 80 }, line: { color, width: 1 }
    });
    s.addText(year, {
      x: 0.25, y: y + 0.08, w: 1.2, h: 0.32,
      fontSize: 14, color, bold: true, align: 'center', valign: 'middle', margin: 0
    });

    // Content
    s.addText(label, {
      x: 2.1, y, w: 7.4, h: 0.3,
      fontSize: 13, color: WHITE, bold: true, margin: 0
    });
    s.addText(desc, {
      x: 2.1, y: y + 0.3, w: 7.4, h: 0.5,
      fontSize: 10, color: GRAY, margin: 0, wrap: true
    });
  });

  // Bottom callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.1, w: 9, h: 0.35,
    fill: { color: '00271C' }, line: { color: GREEN, width: 1 }
  });
  s.addText('GreenLedger is built for this exact moment — affordable carbon intelligence for SMEs starting today.', {
    x: 0.5, y: 5.1, w: 9, h: 0.35,
    fontSize: 10, color: GREEN, bold: true, align: 'center', valign: 'middle', margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — OUR SOLUTION
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 4);

  sectionLabel(s, 'THE SOLUTION', 0.5, 0.2);
  s.addText('GreenLedger', {
    x: 0.5, y: 0.5, w: 5, h: 0.7,
    fontSize: 36, color: GREEN, bold: true, margin: 0
  });
  s.addText('Snap a photo of any utility bill or receipt.\nGet your carbon footprint in seconds.\nKnow exactly where to cut.', {
    x: 0.5, y: 1.25, w: 4.5, h: 0.9,
    fontSize: 14, color: GRAY, margin: 0, lineSpacingMultiple: 1.5
  });

  // Core value props (2x2 grid left side)
  const props = [
    ['Claude Vision AI', 'Reads any bill image — TNB, Tenaga, diesel receipts, water bills — no manual data entry'],
    ['Malaysian Emission Factors', 'Peninsular 0.585 kgCO₂e/kWh (Suruhanjaya Tenaga 2022); Sabah, Sarawak, fuel, water all covered'],
    ['GHG Protocol Compliant', 'Scope 1 / 2 / 3 classification per GHG Protocol — the global standard for corporate carbon accounting'],
    ['Instant Recommendations', 'AI-generated cost & carbon reduction actions with RM savings estimates specific to Malaysian context'],
  ];

  props.forEach(([title, body], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    featureCard(s, 0.5 + col * 2.65, 2.35 + row * 1.1, 2.55, 1.0, title, body);
  });

  // Right panel — "before/after"
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 0.95, w: 3.7, h: 4.35,
    fill: { color: CARD }, line: { color: BORDER, width: 1 }, shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 0.95, w: 3.7, h: 0.055,
    fill: { color: GREEN }, line: { color: GREEN }
  });

  s.addText('Before GreenLedger', {
    x: 5.9, y: 1.05, w: 3.5, h: 0.3,
    fontSize: 11, color: CORAL, bold: true, margin: 0
  });

  const befores = [
    'Hours of manual Excel data entry',
    'Emission factors from Google searches',
    'No breakdown by scope or source',
    'Zero actionable recommendations',
    'Consultant fees: RM 5,000+/report',
  ];
  befores.forEach((b, i) => {
    s.addText(`✗  ${b}`, {
      x: 5.95, y: 1.42 + i * 0.3, w: 3.4, h: 0.27,
      fontSize: 10, color: GRAY, margin: 0
    });
  });

  s.addShape(pres.shapes.LINE, {
    x: 6.0, y: 2.97, w: 3.2, h: 0,
    line: { color: BORDER, width: 1 }
  });

  s.addText('After GreenLedger', {
    x: 5.9, y: 3.07, w: 3.5, h: 0.3,
    fontSize: 11, color: GREEN, bold: true, margin: 0
  });

  const afters = [
    'Upload photo → results in <30 seconds',
    'Malaysia-certified emission factors',
    'Scope 1/2/3 auto-classification',
    'Ranked recommendations with RM savings',
    'Free during beta — RM 0 to start',
  ];
  afters.forEach((a, i) => {
    s.addText(`✓  ${a}`, {
      x: 5.95, y: 3.44 + i * 0.3, w: 3.4, h: 0.27,
      fontSize: 10, color: GREEN, margin: 0
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 5);

  sectionLabel(s, 'HOW IT WORKS', 0.5, 0.2);
  s.addText('3 Steps from Bill to Insight', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  const steps = [
    {
      num: '01',
      title: 'Upload',
      sub: 'Snap & Drop',
      body: 'Take a photo of any Malaysian utility bill — TNB electricity, diesel receipt, water bill, Petronas fuel. Drag & drop or browse. JPEG, PNG, WebP all supported.',
      example: 'e.g. TNB monthly bill image'
    },
    {
      num: '02',
      title: 'Analyse',
      sub: 'Claude Vision AI',
      body: 'Claude Haiku 4.5 Vision reads the bill: extracts vendor, date, all line items, quantities, units. Matches Malaysian emission factors. Classifies GHG scope automatically.',
      example: 'e.g. 161 kWh → 94.2 kg CO₂e'
    },
    {
      num: '03',
      title: 'Act',
      sub: 'Recommendations',
      body: 'Receive ranked AI recommendations with specific CO₂e savings and RM/month cost savings. Compare across receipts. Track total footprint over time.',
      example: 'e.g. Switch to Tariff D → save RM 45/mo'
    },
  ];

  steps.forEach(({ num, title, sub, body, example }, i) => {
    const x = 0.5 + i * 3.1;

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.35, w: 2.9, h: 3.9,
      fill: { color: CARD }, line: { color: BORDER, width: 1 }, shadow: makeShadow()
    });
    // Top green band
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.35, w: 2.9, h: 0.055,
      fill: { color: GREEN }, line: { color: GREEN }
    });

    // Number
    s.addText(num, {
      x: x + 0.15, y: 1.45, w: 0.7, h: 0.6,
      fontSize: 32, color: GREEN, bold: true, margin: 0
    });
    // Title
    s.addText(title, {
      x: x + 0.85, y: 1.55, w: 1.9, h: 0.35,
      fontSize: 18, color: WHITE, bold: true, margin: 0
    });
    s.addText(sub, {
      x: x + 0.85, y: 1.88, w: 1.9, h: 0.25,
      fontSize: 10, color: GREEN, margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: x + 0.15, y: 2.2, w: 2.6, h: 0,
      line: { color: BORDER, width: 1 }
    });

    s.addText(body, {
      x: x + 0.15, y: 2.32, w: 2.6, h: 2.1,
      fontSize: 11, color: GRAY, margin: 0, wrap: true, lineSpacingMultiple: 1.4
    });

    // Example callout
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.1, y: 4.52, w: 2.7, h: 0.55,
      fill: { color: '001A10' }, line: { color: GREEN, width: 1 }
    });
    s.addText(example, {
      x: x + 0.15, y: 4.52, w: 2.6, h: 0.55,
      fontSize: 9.5, color: GREEN, align: 'center', valign: 'middle', margin: 0, italic: true
    });

    // Arrow between cards
    if (i < 2) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 2.9, y: 3.2, w: 0.1, h: 0.25,
        fill: { color: GREEN }, line: { color: GREEN }
      });
      s.addText('→', {
        x: x + 2.88, y: 3.05, w: 0.25, h: 0.3,
        fontSize: 14, color: GREEN, align: 'center', margin: 0, bold: true
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — TECHNOLOGY STACK
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 6);

  sectionLabel(s, 'TECHNOLOGY', 0.5, 0.2);
  s.addText('Built on Best-in-Class AI & Web Stack', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  // Architecture diagram (boxes + arrows)
  const layers = [
    {
      title: 'Frontend',
      items: ['React 18 + Vite', 'React Router v6', 'Lucide React icons', 'CSS glass-card design system'],
      color: '60A5FA',
      x: 0.4
    },
    {
      title: 'Backend API',
      items: ['FastAPI (Python)', 'Async CORS middleware', 'File validation pipeline', 'In-memory session store'],
      color: GREEN,
      x: 3.65
    },
    {
      title: 'AI Engine',
      items: ['Claude Haiku 4.5 Vision', 'Structured JSON extraction', 'GHG recommendations', 'Fallback error handling'],
      color: YELLOW,
      x: 6.9
    },
  ];

  layers.forEach(({ title, items, color, x }) => {
    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.4, w: 2.9, h: 3.7,
      fill: { color: CARD }, line: { color: BORDER, width: 1 }, shadow: makeShadow()
    });
    // Color top
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.4, w: 2.9, h: 0.38,
      fill: { color }, line: { color }
    });
    s.addText(title, {
      x: x + 0.1, y: 1.4, w: 2.7, h: 0.38,
      fontSize: 14, color: BG, bold: true, align: 'center', valign: 'middle', margin: 0
    });

    items.forEach((item, i) => {
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.2, y: 2.0 + i * 0.7 + 0.08, w: 0.1, h: 0.1,
        fill: { color }, line: { color }
      });
      s.addText(item, {
        x: x + 0.38, y: 2.0 + i * 0.7, w: 2.4, h: 0.35,
        fontSize: 11.5, color: WHITE, margin: 0
      });
      if (i < items.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: x + 0.2, y: 2.35 + i * 0.7, w: 2.5, h: 0,
          line: { color: BORDER, width: 0.5 }
        });
      }
    });

    // Arrow (not after last)
    if (x < 6) {
      s.addText('→', {
        x: x + 2.9, y: 2.8, w: 0.25, h: 0.4,
        fontSize: 18, color: DIMGRAY, align: 'center', margin: 0, bold: true
      });
    }
  });

  // Data layer
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.2, w: 9.2, h: 0.3,
    fill: { color: '001A10' }, line: { color: BORDER, width: 1 }
  });
  s.addText('Data Layer: Malaysian Emission Factors JSON  ·  GHG Protocol Scope Classification  ·  localStorage (demo)  ·  Real DB in v2', {
    x: 0.4, y: 5.2, w: 9.2, h: 0.3,
    fontSize: 9, color: GRAY, align: 'center', valign: 'middle', margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — EMISSION FACTORS (DATA FOUNDATION)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 7);

  sectionLabel(s, 'DATA FOUNDATION', 0.5, 0.2);
  s.addText('Malaysia-Certified Emission Factors', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  // Table header
  const cols = [2.8, 2.0, 1.5, 1.4, 1.8];
  const headers = ['Energy Type', 'Region / Subtype', 'Factor', 'Unit', 'Scope'];
  let hx = 0.4;
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: hx, y: 1.35, w: cols[i], h: 0.38,
      fill: { color: GREEN }, line: { color: GREEN }
    });
    s.addText(h, {
      x: hx, y: 1.35, w: cols[i], h: 0.38,
      fontSize: 11, color: BG, bold: true, align: 'center', valign: 'middle', margin: 0
    });
    hx += cols[i];
  });

  const rows = [
    ['Electricity (TNB)', 'Peninsular Malaysia', '0.585', 'kg CO₂e/kWh', 'Scope 2'],
    ['Electricity (SESB)', 'Sabah', '0.840', 'kg CO₂e/kWh', 'Scope 2'],
    ['Electricity (SEB)', 'Sarawak', '0.474', 'kg CO₂e/kWh', 'Scope 2'],
    ['Diesel', 'All Malaysia', '2.680', 'kg CO₂e/litre', 'Scope 1'],
    ['Petrol (RON95/97)', 'All Malaysia', '2.310', 'kg CO₂e/litre', 'Scope 1'],
    ['Water (IWK)', 'All Malaysia', '0.344', 'kg CO₂e/m³', 'Scope 3'],
  ];

  rows.forEach((row, ri) => {
    let rx = 0.4;
    const bg = ri % 2 === 0 ? CARD : '0A1510';
    cols.forEach((cw, ci) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: rx, y: 1.73 + ri * 0.46, w: cw, h: 0.44,
        fill: { color: bg }, line: { color: BORDER, width: 0.5 }
      });
      const isScope = ci === 4;
      const isFactor = ci === 2;
      s.addText(row[ci], {
        x: rx + 0.05, y: 1.73 + ri * 0.46, w: cw - 0.1, h: 0.44,
        fontSize: 11,
        color: isScope ? GREEN : isFactor ? YELLOW : WHITE,
        bold: isFactor,
        align: ci > 1 ? 'center' : 'left',
        valign: 'middle',
        margin: 0
      });
      rx += cw;
    });
  });

  // Sources
  s.addText('Sources: Suruhanjaya Tenaga (Energy Commission) 2022 Grid Emission Factor  ·  IPCC AR6  ·  IWK Annual Report  ·  MYCarbon Guidelines', {
    x: 0.4, y: 5.0, w: 9.2, h: 0.3,
    fontSize: 8.5, color: DIMGRAY, margin: 0, italic: true
  });

  // Right callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.3, w: 9.2, h: 0.2,
    fill: { color: '001A10' }, line: { color: GREEN, width: 1 }
  });
  s.addText('All factors updated annually — GreenLedger always uses the most recent Malaysian regulatory data.', {
    x: 0.4, y: 5.3, w: 9.2, h: 0.2,
    fontSize: 9, color: GREEN, align: 'center', valign: 'middle', margin: 0, bold: true
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — LIVE DEMO RESULTS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 8);

  sectionLabel(s, 'LIVE DEMO', 0.5, 0.2);
  s.addText('Real TNB Bill → Instant Carbon Report', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  // Mock "receipt card"
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.3, w: 4.0, h: 4.0,
    fill: { color: CARD }, line: { color: BORDER, width: 1 }, shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.3, w: 4.0, h: 0.055,
    fill: { color: GREEN }, line: { color: GREEN }
  });

  s.addText('✓  TNB Bhd Processed', {
    x: 0.55, y: 1.4, w: 3.7, h: 0.3,
    fontSize: 11, color: GREEN, bold: true, margin: 0
  });
  s.addText('Jan 2025 · Electricity', {
    x: 0.55, y: 1.7, w: 3.7, h: 0.22,
    fontSize: 9, color: GRAY, margin: 0
  });

  // Table header
  const tHeaders = ['Item', 'Qty', 'Factor', 'CO₂e'];
  const tw = [1.5, 0.7, 1.0, 0.7];
  let tx = 0.45;
  tHeaders.forEach((h, i) => {
    s.addText(h, {
      x: tx, y: 2.0, w: tw[i], h: 0.22,
      fontSize: 8.5, color: DIMGRAY, bold: true,
      align: i === 0 ? 'left' : 'right', margin: 0,
      charSpacing: 1
    });
    tx += tw[i];
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.45, y: 2.22, w: 3.8, h: 0,
    line: { color: BORDER, width: 1 }
  });

  const lineItems = [
    ['TNB Electricity', '161 kWh', '0.5850', '94.2 kg'],
    ['Admin Charge', '1 unit', '—', '—'],
    ['Renewable Energy', '1 unit', '—', '—'],
  ];
  lineItems.forEach((row, ri) => {
    let lx = 0.45;
    row.forEach((cell, ci) => {
      s.addText(cell, {
        x: lx, y: 2.3 + ri * 0.38, w: tw[ci], h: 0.35,
        fontSize: 10, color: ci === 3 && ri === 0 ? GREEN : WHITE,
        bold: ci === 3 && ri === 0,
        align: ci === 0 ? 'left' : 'right', margin: 0
      });
      lx += tw[ci];
    });
  });

  s.addShape(pres.shapes.LINE, {
    x: 0.45, y: 3.46, w: 3.8, h: 0,
    line: { color: BORDER, width: 1 }
  });
  s.addText('Total this receipt', {
    x: 0.55, y: 3.52, w: 2.5, h: 0.3,
    fontSize: 10, color: GRAY, margin: 0
  });
  s.addText('94.2 kg CO₂e', {
    x: 0.55, y: 3.52, w: 3.7, h: 0.3,
    fontSize: 14, color: WHITE, bold: true, align: 'right', margin: 0
  });

  s.addShape(pres.shapes.LINE, {
    x: 0.45, y: 3.9, w: 3.8, h: 0,
    line: { color: BORDER, width: 1 }
  });

  // Scope badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 4.02, w: 0.7, h: 0.24,
    fill: { color: '00271C' }, line: { color: GREEN, width: 1 }
  });
  s.addText('Scope 2', {
    x: 0.55, y: 4.02, w: 0.7, h: 0.24,
    fontSize: 9, color: GREEN, align: 'center', valign: 'middle', margin: 0
  });
  s.addText('Source: ST Grid Factor 2022', {
    x: 1.35, y: 4.04, w: 2.8, h: 0.22,
    fontSize: 8.5, color: DIMGRAY, margin: 0
  });

  // Recommendations
  s.addText('AI RECOMMENDATIONS', {
    x: 0.55, y: 4.35, w: 3.6, h: 0.22,
    fontSize: 8, color: GREEN, bold: true, charSpacing: 2, margin: 0
  });
  const recs = [
    'Install LED lighting → saves 12 kg CO₂e',
    'Apply for Tariff D (commercial) → saves RM 35/mo',
    'Enable TNB green tariff → offset 20% emissions',
  ];
  recs.forEach((r, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.48, y: 4.62 + i * 0.0, w: 0.22, h: 0.22,
      fill: { color: '00271C' }, line: { color: GREEN, width: 1 }
    });
    s.addText(`${i + 1}`, {
      x: 0.48, y: 4.62 + i * 0.26, w: 0.22, h: 0.22,
      fontSize: 9, color: GREEN, bold: true, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(r, {
      x: 0.76, y: 4.62 + i * 0.26, w: 3.5, h: 0.22,
      fontSize: 9, color: GRAY, margin: 0
    });
  });

  // Right side — summary stats
  const stats = [
    { num: '94.2', unit: 'kg CO₂e', label: 'from one electricity bill' },
    { num: '<30', unit: 'seconds', label: 'upload to full report' },
    { num: 'RM 35', unit: '/month', label: 'savings identified' },
  ];
  stats.forEach(({ num, unit, label }, i) => {
    statCard(s, 4.9, 1.3 + i * 1.18, 4.6, 1.08, num, unit, label);
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.9, y: 4.84, w: 4.6, h: 0.62,
    fill: { color: '001A10' }, line: { color: GREEN, width: 1 }, shadow: makeShadow()
  });
  s.addText('Tested with a real February 2025 TNB residential bill\n— all figures reflect actual Claude Vision AI output.', {
    x: 5.05, y: 4.84, w: 4.3, h: 0.62,
    fontSize: 10.5, color: GREEN, align: 'center', valign: 'middle', margin: 0,
    italic: true, lineSpacingMultiple: 1.3
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 9 — MARKET OPPORTUNITY
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 9);

  sectionLabel(s, 'MARKET OPPORTUNITY', 0.5, 0.2);
  s.addText('A Market That Must Comply — Ready to Pay', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  // Big stats row
  const mStats = [
    { num: '1.2M', unit: 'Malaysian SMEs', label: 'total addressable market', color: GREEN },
    { num: 'RM 9B', unit: 'export risk', label: 'palm oil + timber EUDR exposure', color: YELLOW },
    { num: 'USD 8B', unit: 'market size', label: 'global SME carbon software by 2030', color: '60A5FA' },
  ];

  mStats.forEach(({ num, unit, label, color }, i) => {
    statCard(s, 0.4 + i * 3.2, 1.3, 3.0, 1.5, num, unit, label, color);
  });

  // Segments
  s.addText('Target Segments', {
    x: 0.5, y: 3.05, w: 4, h: 0.3,
    fontSize: 14, color: WHITE, bold: true, margin: 0
  });

  const segments = [
    ['Manufacturing SMEs', '~180,000 companies', 'Highest energy bills, most regulatory pressure'],
    ['Palm Oil / Agri SMEs', '~250,000 smallholders', 'EUDR compliance is existential — needs carbon proof'],
    ['F&B / Retail SMEs', '~400,000 companies', 'ESG reporting now required by GLC supply chains'],
  ];

  segments.forEach(([name, size, why], i) => {
    featureCard(s, 0.4, 3.45 + i * 0.68, 5.0, 0.6, `${name} (${size})`, why);
  });

  // Go-to-market funnel
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.7, y: 1.3, w: 3.8, h: 3.85,
    fill: { color: CARD }, line: { color: BORDER, width: 1 }, shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.7, y: 1.3, w: 3.8, h: 0.055,
    fill: { color: GREEN }, line: { color: GREEN }
  });
  s.addText('Go-To-Market', {
    x: 5.8, y: 1.4, w: 3.6, h: 0.35,
    fontSize: 13, color: WHITE, bold: true, margin: 0
  });

  const gtm = [
    ['Phase 1', 'University & Enactus network — 20 pilot SMEs'],
    ['Phase 2', 'MDEC Digital SME programme partnership'],
    ['Phase 3', 'DOSM, MITI regulatory referral channel'],
    ['Phase 4', 'Freemium → RM 99/mo SaaS subscription'],
  ];
  gtm.forEach(([phase, desc], i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.8, y: 1.9 + i * 0.78, w: 0.6, h: 0.28,
      fill: { color: GREEN, transparency: 75 }, line: { color: GREEN, width: 1 }
    });
    s.addText(phase, {
      x: 5.8, y: 1.9 + i * 0.78, w: 0.6, h: 0.28,
      fontSize: 8.5, color: GREEN, bold: true, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(desc, {
      x: 6.5, y: 1.88 + i * 0.78, w: 2.9, h: 0.35,
      fontSize: 10, color: GRAY, margin: 0, wrap: true
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — IMPACT
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 10);

  sectionLabel(s, 'IMPACT', 0.5, 0.2);
  s.addText('What 1,000 SMEs Using GreenLedger Looks Like', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 24, color: WHITE, bold: true, margin: 0
  });

  // Impact math
  const impacts = [
    { num: '1,200', unit: 'tonnes CO₂e', label: 'identified per month\n(avg 1.2t per SME)', color: GREEN },
    { num: 'RM 1.8M', unit: 'per month', label: 'cost savings surfaced\n(avg RM 1,800/SME)', color: YELLOW },
    { num: '100%', unit: 'visibility', label: 'carbon footprint known\nfor first time ever', color: '60A5FA' },
    { num: '3 sec', unit: 'per bill', label: 'vs 3 hours manual entry\n99.9% time saved', color: CORAL },
  ];

  impacts.forEach(({ num, unit, label, color }, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    statCard(s, 0.4 + col * 4.8, 1.4 + row * 2.0, 4.55, 1.75, num, unit, label, color);
  });

  // UN SDG badges
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 5.1, w: 9.2, h: 0.38,
    fill: { color: '001A10' }, line: { color: GREEN, width: 1 }
  });
  s.addText('Aligned with UN SDGs:  13 Climate Action  ·  12 Responsible Consumption  ·  8 Decent Work & Growth  ·  17 Partnerships', {
    x: 0.4, y: 5.1, w: 9.2, h: 0.38,
    fontSize: 10, color: GREEN, align: 'center', valign: 'middle', margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 11 — COMPETITIVE ADVANTAGE
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 11);

  sectionLabel(s, 'COMPETITIVE ADVANTAGE', 0.5, 0.2);
  s.addText('Why GreenLedger Wins in Malaysia', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  // Comparison table
  const compCols = [2.6, 1.8, 1.8, 1.8, 1.8];
  const compHeaders = ['Feature', 'GreenLedger', 'Manual Excel', 'Global Tools\n(e.g. Persefoni)', 'Consultants'];
  const colColors = [DIMGRAY, GREEN, DIMGRAY, DIMGRAY, DIMGRAY];
  let cx = 0.25;
  compHeaders.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 1.35, w: compCols[i], h: 0.48,
      fill: { color: i === 1 ? GREEN : '1A2620' }, line: { color: BORDER, width: 1 }
    });
    s.addText(h, {
      x: cx, y: 1.35, w: compCols[i], h: 0.48,
      fontSize: 10, color: i === 1 ? BG : WHITE, bold: true,
      align: 'center', valign: 'middle', margin: 0
    });
    cx += compCols[i];
  });

  const compRows = [
    ['Malaysian emission factors', '✓', '✗', '✗', 'custom quote'],
    ['AI bill reading (Vision AI)', '✓', '✗', 'limited', '✗'],
    ['Setup time', '<1 min', 'hours', 'weeks', 'months'],
    ['Cost per month', 'Free / RM 99', 'RM 0 (time++)', 'USD 1,000+', 'RM 5,000+'],
    ['GHG Protocol scope', '✓', 'manual', '✓', '✓'],
    ['Recommendations (RM savings)', '✓', '✗', 'generic', '✓ (expensive)'],
    ['Works on phone photo', '✓', '✗', '✗', '✗'],
  ];

  compRows.forEach((row, ri) => {
    let rx = 0.25;
    compCols.forEach((cw, ci) => {
      const bg = ri % 2 === 0 ? CARD : '0A1510';
      s.addShape(pres.shapes.RECTANGLE, {
        x: rx, y: 1.83 + ri * 0.46, w: cw, h: 0.44,
        fill: { color: ci === 1 ? '001A10' : bg }, line: { color: BORDER, width: 0.5 }
      });
      const val = row[ci];
      const isCheck = val === '✓';
      const isCross = val === '✗';
      s.addText(val, {
        x: rx + 0.05, y: 1.83 + ri * 0.46, w: cw - 0.1, h: 0.44,
        fontSize: 10.5,
        color: isCheck ? GREEN : isCross ? CORAL : ci === 1 ? GREEN : WHITE,
        bold: isCheck || isCross || ci === 1,
        align: ci === 0 ? 'left' : 'center',
        valign: 'middle',
        margin: 0
      });
      rx += cw;
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 12 — ROADMAP
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 12);

  sectionLabel(s, 'ROADMAP', 0.5, 0.2);
  s.addText('From Hackathon to Market', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  // Horizontal timeline bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.5, w: 9, h: 0.055,
    fill: { color: BORDER }, line: { color: BORDER }
  });

  const phases = [
    {
      label: 'Phase 1', title: 'MVP\n(Now)', items: ['Receipt upload + Claude Vision', 'Malaysian emission factors', 'Dashboard + history', 'AI recommendations'],
      color: GREEN, done: true
    },
    {
      label: 'Phase 2', title: 'Beta\n(Q3 2026)', items: ['User accounts + multi-company', 'PDF bill support', 'CSV export / ESG report', 'Mobile-optimised UI'],
      color: YELLOW, done: false
    },
    {
      label: 'Phase 3', title: 'Growth\n(Q4 2026)', items: ['Supply chain tracking (EUDR)', 'Scope 3 upstream emissions', 'Carbon credit marketplace link', 'API for SME accounting tools'],
      color: '60A5FA', done: false
    },
    {
      label: 'Phase 4', title: 'Scale\n(2027)', items: ['Bank/insurer integrations', 'Automated regulatory reports', 'Carbon benchmarking by industry', 'Southeast Asia expansion'],
      color: CORAL, done: false
    },
  ];

  phases.forEach(({ label, title, items, color, done }, i) => {
    const x = 0.5 + i * 2.35;

    // Dot on timeline
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.85, y: 2.38, w: 0.28, h: 0.28,
      fill: { color: done ? color : BG }, line: { color, width: done ? 0 : 2 }
    });

    // Phase label
    s.addText(label, {
      x, y: 2.08, w: 2.2, h: 0.25,
      fontSize: 9, color, align: 'center', bold: true, charSpacing: 1, margin: 0
    });

    // Phase card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.78, w: 2.2, h: 2.55,
      fill: { color: done ? '001A10' : CARD },
      line: { color: done ? color : BORDER, width: done ? 1.5 : 1 },
      shadow: makeShadow()
    });

    s.addText(title, {
      x: x + 0.1, y: 2.85, w: 2.0, h: 0.55,
      fontSize: 13, color, bold: true, margin: 0, lineSpacingMultiple: 1.2
    });

    if (done) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 1.55, y: 2.88, w: 0.55, h: 0.22,
        fill: { color: GREEN, transparency: 80 }, line: { color: GREEN, width: 1 }
      });
      s.addText('LIVE', {
        x: x + 1.55, y: 2.88, w: 0.55, h: 0.22,
        fontSize: 8, color: GREEN, bold: true, align: 'center', valign: 'middle', margin: 0
      });
    }

    items.forEach((item, ii) => {
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.12, y: 3.5 + ii * 0.42 + 0.07, w: 0.1, h: 0.1,
        fill: { color }, line: { color }
      });
      s.addText(item, {
        x: x + 0.3, y: 3.5 + ii * 0.42, w: 1.8, h: 0.38,
        fontSize: 10, color: WHITE, margin: 0, wrap: true
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 13 — BUSINESS MODEL
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);
  accentBar(s);
  slideNum(s, 13);

  sectionLabel(s, 'BUSINESS MODEL', 0.5, 0.2);
  s.addText('Accessible Pricing for Every SME', {
    x: 0.5, y: 0.5, w: 9, h: 0.65,
    fontSize: 28, color: WHITE, bold: true, margin: 0
  });

  const tiers = [
    {
      name: 'Starter', price: 'Free', period: 'forever',
      items: ['5 receipts/month', 'Dashboard + history', 'Basic recommendations', 'Email support'],
      cta: 'No credit card needed',
      highlight: false
    },
    {
      name: 'Growth', price: 'RM 99', period: 'per month',
      items: ['Unlimited receipts', 'PDF + OCR support', 'Full ESG export report', 'Priority support'],
      cta: 'Most popular for SMEs',
      highlight: true
    },
    {
      name: 'Enterprise', price: 'Custom', period: 'per company',
      items: ['Multi-company accounts', 'Supply chain scope 3', 'API access + integrations', 'Dedicated account manager'],
      cta: 'For larger businesses',
      highlight: false
    },
  ];

  tiers.forEach(({ name, price, period, items, cta, highlight }, i) => {
    const x = 0.4 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: 3.0, h: 3.95,
      fill: { color: highlight ? '001A10' : CARD },
      line: { color: highlight ? GREEN : BORDER, width: highlight ? 1.5 : 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: 3.0, h: 0.055,
      fill: { color: highlight ? GREEN : BORDER },
      line: { color: highlight ? GREEN : BORDER }
    });

    if (highlight) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 1.5, y: 1.35, w: 1.3, h: 0.28,
        fill: { color: GREEN }, line: { color: GREEN }
      });
      s.addText('RECOMMENDED', {
        x: x + 1.5, y: 1.35, w: 1.3, h: 0.28,
        fontSize: 7.5, color: BG, bold: true, align: 'center', valign: 'middle', margin: 0
      });
    }

    s.addText(name, {
      x: x + 0.15, y: 1.42, w: highlight ? 1.3 : 2.7, h: 0.3,
      fontSize: 14, color: WHITE, bold: true, margin: 0
    });

    s.addText(price, {
      x: x + 0.15, y: 1.85, w: 2.7, h: 0.75,
      fontSize: 36, color: highlight ? GREEN : WHITE, bold: true, margin: 0
    });
    s.addText(period, {
      x: x + 0.15, y: 2.6, w: 2.7, h: 0.28,
      fontSize: 10, color: GRAY, margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: x + 0.15, y: 2.95, w: 2.7, h: 0,
      line: { color: BORDER, width: 1 }
    });

    items.forEach((item, ii) => {
      s.addText(`✓  ${item}`, {
        x: x + 0.15, y: 3.05 + ii * 0.38, w: 2.7, h: 0.35,
        fontSize: 11, color: highlight ? WHITE : GRAY, margin: 0
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.15, y: 4.9, w: 2.7, h: 0.28,
      fill: { color: highlight ? '002A18' : '0D1117' },
      line: { color: highlight ? GREEN : BORDER, width: 1 }
    });
    s.addText(cta, {
      x: x + 0.15, y: 4.9, w: 2.7, h: 0.28,
      fontSize: 9, color: highlight ? GREEN : GRAY, align: 'center', valign: 'middle', margin: 0, italic: true
    });
  });

  s.addText('Revenue model: SaaS subscriptions + white-label licensing to banks, accounting firms, and government agencies', {
    x: 0.4, y: 5.35, w: 9.2, h: 0.22,
    fontSize: 9, color: DIMGRAY, align: 'center', margin: 0, italic: true
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 14 — THANK YOU / CALL TO ACTION
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  darkBg(s);

  // Bottom bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.2, w: 10, h: 0.425,
    fill: { color: '00271C' }, line: { color: '00271C' }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.2, w: 10, h: 0.055,
    fill: { color: GREEN }, line: { color: GREEN }
  });

  // Decorative circles
  s.addShape(pres.shapes.OVAL, {
    x: -1.5, y: 2.5, w: 5, h: 5,
    fill: { color: '001810', transparency: 0 }, line: { color: '00C896', width: 1 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -1.0, w: 4, h: 4,
    fill: { color: '001810', transparency: 0 }, line: { color: '009970', width: 1 }
  });

  s.addText('Thank You', {
    x: 0.5, y: 0.6, w: 9, h: 1.0,
    fontSize: 56, color: WHITE, bold: true, align: 'center', margin: 0
  });
  s.addText('GreenLedger — Measuring Carbon.\nEnabling Action. Building a Sustainable Malaysia.', {
    x: 0.5, y: 1.65, w: 9, h: 0.75,
    fontSize: 15, color: GRAY, align: 'center', margin: 0, lineSpacingMultiple: 1.4
  });

  s.addShape(pres.shapes.LINE, {
    x: 2.5, y: 2.55, w: 5, h: 0,
    line: { color: BORDER, width: 1 }
  });

  // Call to action items
  const ctas = [
    ['Try the Live Demo', 'Upload any utility bill and see carbon analysis in real time'],
    ['Partner with Us', 'Pilot with your SME network — zero cost during beta phase'],
    ['Join Our Mission', 'We are looking for mentors, investors, and early adopters'],
  ];

  ctas.forEach(([title, body], i) => {
    s.addShape(pres.shapes.OVAL, {
      x: 1.4 + i * 2.55, y: 2.85, w: 0.35, h: 0.35,
      fill: { color: GREEN }, line: { color: GREEN }
    });
    s.addText(`${i + 1}`, {
      x: 1.4 + i * 2.55, y: 2.85, w: 0.35, h: 0.35,
      fontSize: 12, color: BG, bold: true, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(title, {
      x: 1.0 + i * 2.55, y: 3.28, w: 2.4, h: 0.32,
      fontSize: 12, color: WHITE, bold: true, align: 'center', margin: 0
    });
    s.addText(body, {
      x: 1.0 + i * 2.55, y: 3.62, w: 2.4, h: 0.5,
      fontSize: 9.5, color: GRAY, align: 'center', margin: 0, wrap: true, lineSpacingMultiple: 1.3
    });
  });

  // Team + branding
  s.addText('Team Da House', {
    x: 0, y: 4.45, w: 10, h: 0.35,
    fontSize: 18, color: GREEN, bold: true, align: 'center', margin: 0
  });
  s.addText('Earth Day Hackathon 2026 · The Access Group · Kuala Lumpur', {
    x: 0, y: 4.82, w: 10, h: 0.28,
    fontSize: 11, color: DIMGRAY, align: 'center', margin: 0
  });

  s.addText('Team Da House · Earth Day Hackathon 2026 · Built with Claude AI + FastAPI + React', {
    x: 0.4, y: 5.25, w: 9.2, h: 0.3,
    fontSize: 10, color: '4D9977', align: 'center', valign: 'middle', margin: 0
  });
}

// ─── Write file ─────────────────────────────────────────────────────────────
pres.writeFile({ fileName: 'c:/Users/yanch/Desktop/Enactus GSIC 2026 competition/greenledger/slides/GreenLedger_Hackathon_2026.pptx' })
  .then(() => console.log('✓ GreenLedger_Hackathon_2026.pptx created'))
  .catch((e) => { console.error('ERROR:', e); process.exit(1); });
