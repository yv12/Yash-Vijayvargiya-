export type ProjectDiscipline =
  | "GenAI & RAG"
  | "Growth & UI/UX"
  | "OCR"
  | "Workflow Automation & RAG"
  | "GenAI & Event-Driven Automation"
  | "RAG"
  | "Event-Driven Automation(n8n)"
  | string;

export type ProjectDomain =
  | "Fintech"
  | "Quick-Commerce"
  | "Healthcare"
  | "Commercial Finance"
  | "Sales Ops"
  | "Insurance Tech"
  | "HR Ops"
  | string;

export type ProjectProvenance =
  | "NextLeap AI PM Fellowship"
  | "Client Work (Hestabit)"
  | "Independent System";

export interface ProjectTradeoff {
  decision: string;
  chosenApproach: string;
  alternativeRejected: string;
  reason: string;
}

export interface ProjectFAQ {
  question: string;
  answer: string;
}

export interface CaseStudyProject {
  id: string;
  title: string;
  tagline: string;
  discipline: ProjectDiscipline;
  domain: ProjectDomain;
  provenance: ProjectProvenance;
  provenanceType: "fellowship" | "client" | "independent";
  badge: string;
  accentColor: string;
  thumbnail: string;
  blueprintImage?: string;
  stack: string[];
  
  // Optional Interactive Presentation Deck (PPT/PDF)
  presentationDeck?: {
    title: string;
    slideCount: number;
    slides: string[];
    pdfUrl: string;
  };
  
  // Recruiter Card View
  problem: {
    headline: string;
    description: string;
  };
  approach: {
    headline: string;
    framework: string;
  };
  impact: {
    headline: string;
    metrics: string[];
  };

  // Articulated Deep-Dive Dossier View
  deepDive: {
    executiveSummary: string;
    rootCauseDiscovery: string;
    solutionArchitecture: string[];
    tradeoffs?: ProjectTradeoff[];
    faqs?: ProjectFAQ[];
    customWidget?: "blinkit-swipe" | "ocr-preview" | "fraud-gate" | "hdfc-ladder";
  };

  liveLinks: {
    label: string;
    href: string;
    type: "live" | "prototype" | "demo" | "nda";
    trackingSlug?: string;
  }[];
}

export const CASE_STUDIES: CaseStudyProject[] = [
  {
    id: "hdfc-rag",
    title: "HDFC Assistant",
    tagline: "Hallucination-free conversational search across 5 active mutual fund scheme information documents (SIDs).",
    discipline: "GenAI & RAG",
    domain: "Fintech",
    provenance: "NextLeap AI PM Fellowship",
    provenanceType: "fellowship",
    badge: "Live Production Tool",
    accentColor: "#1B3AC7",
    thumbnail: "/decks/hdfc-assistant/slide_1.jpg",
    blueprintImage: "/shots/fundpedia_hdfc.png",
    stack: ["FastAPI", "Qdrant Cloud", "Groq Llama-3.3", "Citation Validator", "Python"],
    presentationDeck: {
      title: "Groww Mutual Fund RAG Assistant Deck",
      slideCount: 11,
      slides: [
        "/decks/hdfc-assistant/slide_1.jpg",
        "/decks/hdfc-assistant/slide_2.jpg",
        "/decks/hdfc-assistant/slide_3.jpg",
        "/decks/hdfc-assistant/slide_4.jpg",
        "/decks/hdfc-assistant/slide_5.jpg",
        "/decks/hdfc-assistant/slide_6.jpg",
        "/decks/hdfc-assistant/slide_7.jpg",
        "/decks/hdfc-assistant/slide_8.jpg",
        "/decks/hdfc-assistant/slide_9.jpg",
        "/decks/hdfc-assistant/slide_10.jpg",
        "/decks/hdfc-assistant/slide_11.jpg",
      ],
      pdfUrl: "/decks/hdfc-assistant.pdf",
    },
    problem: {
      headline: "Preventing Hallucinations in Highly Regulated Financial Products",
      description: "Generic LLMs frequently invent fund returns, exit loads, or expense ratios when prompted by retail investors. In mutual funds, a hallucinated figure is an outright SEBI regulatory compliance violation and legal liability.",
    },
    approach: {
      headline: "Fail-Closed 6-Stage Validation Pipeline",
      framework: "Engineered pre-retrieval PII screening, strict query scope classification, Qdrant hybrid retrieval, and an independent citation verification engine that cross-references generated claims against retrieved source clauses. If unverified, it safely declines rather than guessing.",
    },
    impact: {
      headline: "100% Citation Grounding & Zero Cost Bloat",
      metrics: [
        "100% cited answers against official Scheme Information Documents",
        "Passed 9/9 QA compliance test cases with zero hallucinated figures",
        "Migrated to hosted Qdrant Cloud to operate reliably on free-tier compute",
      ],
    },
    deepDive: {
      executiveSummary: "A mutual fund advisory assistant is fundamentally a compliance system wearing a conversational product costume. In finance, being confidently wrong destroys brand trust and invites regulatory penalties. This project prioritizes strict factual grounding over conversational looseness.",
      rootCauseDiscovery: "Off-the-shelf RAG setups fail in finance because they pass uncalibrated retrieval snippets into a generative prompt without enforcing citation attribution. When documents lack the answer, the model extrapolates. The critical PM decision was implementing a 'fail-closed' policy: silence or graceful referral is infinitely superior to an inaccurate answer.",
      solutionArchitecture: [
        "Stage 1: PII Pre-Screening: Cleans incoming prompts of sensitive investor identifiers before logging or vector search.",
        "Stage 2: Scope & Intent Classifier: Rejects queries outside the 5 covered schemes or queries asking for speculative market advice.",
        "Stage 3: Qdrant Vector Retrieval: Top-K retrieval with dynamic similarity threshold gating.",
        "Stage 4: Citation Extraction & Cross-Verification: Every statement generated must carry an exact section reference from official SID PDFs.",
        "Stage 5: Graceful Fallback: Returns explicit refusal when facts are ambiguous or absent.",
      ],
      tradeoffs: [
        {
          decision: "Vector Database Hosting",
          chosenApproach: "Hosted Qdrant Cloud cluster",
          alternativeRejected: "Local ChromaDB on application instance",
          reason: "Avoided out-of-memory container crashes on free/budget tier while providing instant sub-50ms vector searches.",
        },
        {
          decision: "Answer Generation Policy",
          chosenApproach: "Deterministic Citation-Enforced Prompting",
          alternativeRejected: "Creative open-ended chatbot generation",
          reason: "Zero tolerance for factual drift in regulated asset management products.",
        },
      ],
      faqs: [
        {
          question: "Why build a custom fail-closed validation pipeline instead of using a standard LLM chatbot?",
          answer: "Generic LLMs frequently invent fund returns, exit loads, or expense ratios when prompted by retail investors. In mutual funds, a hallucinated figure is an outright SEBI regulatory compliance violation. We engineered a 5-stage pipeline where every claim is cross-referenced against official Scheme Information Documents (SIDs). If citation verification fails, the system safely declines rather than guessing.",
        },
        {
          question: "How does the verification pipeline work step by step?",
          answer: "1. PII Pre-Screening: Cleans incoming prompts of sensitive investor identifiers before vector search.\n2. Scope & Intent Classifier: Rejects queries outside the 5 covered schemes or speculative market advice.\n3. Qdrant Vector Retrieval: Hybrid top-K retrieval with dynamic similarity threshold gating.\n4. Citation Extraction & Cross-Verification: Every generated statement must carry an exact section reference from official SID PDFs.\n5. Graceful Fallback: Returns explicit refusal when facts are ambiguous or absent.",
        },
        {
          question: "What technical trade-offs did you make during development?",
          answer: "We migrated from local ChromaDB to a hosted Qdrant Cloud cluster to eliminate out-of-memory container crashes on budget compute and achieve sub-50ms search latency. We also chose deterministic citation-enforced prompting over open-ended chatbot generation to guarantee zero factual drift.",
        },
        {
          question: "What was the measured compliance impact?",
          answer: "100% cited answers against official documents, 9 out of 9 QA compliance test cases passed with zero hallucinated figures, and reliable operation on free-tier compute with zero cost bloat.",
        },
      ],
      customWidget: "hdfc-ladder",
    },
    liveLinks: [
      {
        label: "Open Live Assistant",
        href: "https://hdfc-mutual-fund-faq-groww.vercel.app/",
        type: "live",
        trackingSlug: "hdfc",
      },
    ],
  },
  {
    id: "blinkit-discovery",
    title: "Blinkit",
    tagline: "Unlocking cross-category exploration in 10-minute delivery: pairing 156K review NLP clustering with a Tinder-style 3-card swipe deck.",
    discipline: "Growth & UI/UX",
    domain: "Quick-Commerce",
    provenance: "NextLeap AI PM Fellowship",
    provenanceType: "fellowship",
    badge: "Tinder-Style Swipe MVP",
    accentColor: "#D97706",
    thumbnail: "/decks/blinkit/slide_1.jpg",
    blueprintImage: "/shots/discovery_blueprint.jpg",
    stack: ["NLP Graph Clustering", "Louvain Algorithm", "Embeddings", "Groq Llama-3.3", "React"],
    presentationDeck: {
      title: "Blinkit Basket Discovery Engine Deck",
      slideCount: 10,
      slides: [
        "/decks/blinkit/slide_1.jpg",
        "/decks/blinkit/slide_2.jpg",
        "/decks/blinkit/slide_3.jpg",
        "/decks/blinkit/slide_4.jpg",
        "/decks/blinkit/slide_5.jpg",
        "/decks/blinkit/slide_6.jpg",
        "/decks/blinkit/slide_7.jpg",
        "/decks/blinkit/slide_8.jpg",
        "/decks/blinkit/slide_9.jpg",
        "/decks/blinkit/slide_10.jpg",
      ],
      pdfUrl: "/decks/blinkit.pdf",
    },
    problem: {
      headline: "Users Stay Stuck in Repeat Staples (Near-Zero Cross-Category Adoption)",
      description: "Quick-commerce users default exclusively to milk, veggies, and bread. High-margin impulse categories remained largely unexplored, capping average order value (AOV). The team's unverified intuition was that non-staples were perceived as too expensive.",
    },
    approach: {
      headline: "NLP Review Mining & Tinder-Style 3-Card Swipe Engine",
      framework: "Analyzed 156,219 App Store reviews using NLP classification and Louvain graph clustering to isolate real user friction. Proved price was a separate complaint: users relied solely on search because browse feeds were irrelevant. To break the staples loop without slowing down 10-minute delivery urgency, designed a high-velocity Tinder UI/UX swipe deck (Swipe Left: Skip, Swipe Right: Save for later with Hinglish match nudges, Swipe Up: Add to Live Order) placed below search and on the active order tracking screen while the rider is en route.",
    },
    impact: {
      headline: "Built 'A Cross-Category Engine Wearing a Tinder Skin' with 2 Live Prototypes",
      metrics: [
        "Classified 156,219 reviews into 5 actionable thematic clusters to disprove the pricing myth",
        "Adopted Tinder's swipe UI/UX to deliver frictionless, gamified discovery in under 5 seconds",
        "Shipped 2 live production prototypes: Discovery Engine & 3-Card Swipe MVP",
      ],
    },
    deepDive: {
      executiveSummary: "Growth in quick-commerce relies on expanding the basket from low-margin staples to high-margin discovery items. When PMs misdiagnose the barrier as price, companies burn capital on discounts that fail to move long-term habit. This project used quantitative NLP and qualitative interviews to locate the true friction and prototype a gamified Tinder-skin swipe interface that breaks the staples loop.",
      rootCauseDiscovery: "156K reviews revealed that users felt 'browsing is useless and noisy'. As a result, 90%+ of sessions initiated with a direct search bar query, skipping the homepage banners. Users wanted discovery, but only when contextualized to what was already inside their current basket.",
      solutionArchitecture: [
        "Review Ingestion & Cleaning: Stripped operational delivery complaints to isolate core app experience reviews.",
        "Louvain Graph Clustering: Clustered semantic embeddings into thematic communities.",
        "Basket Intent Ladder: Formulates recommendations: Level 1 (basket facts) → Level 2 (inferred intent) → Level 3 (same need, new category).",
        "Tinder-Style Swipe Deck UI/UX: Built 'a cross-category engine wearing a Tinder skin'. Placed in the themed-banner slot below search and on the active order tracking screen: while the rider is on the way, users swipe through curated cards (Left: Skip, Right: Save for later with Hinglish match nudges, Up: Add directly to the live delivery order).",
      ],
      tradeoffs: [
        {
          decision: "Recommendation Format & Interaction",
          chosenApproach: "Tinder-Style 3-Card Swipe Deck with Contextual Inference Bridges",
          alternativeRejected: "Infinite scrolling recommendation carousel or banner ads",
          reason: "Infinite feeds cause decision fatigue in a 10-minute delivery setting. Borrowing Tinder's binary swipe mental model allows users to make split-second discovery decisions without friction while their delivery is already on the road.",
        },
      ],
      faqs: [
        {
          question: "Why borrow Tinder's UI/UX swipe interaction for a grocery app?",
          answer: "Quick-commerce shoppers have extreme urgency; long product carousels create decision fatigue and get skipped. Tinder's swipe interaction provides an intuitive, gamified mental model: Swipe Left to Skip, Swipe Right to Save for Later, and Swipe Up to add directly to an active order while the delivery rider is on the way. It converts idle delivery waiting time into high-intent discovery in under 5 seconds.",
        },
        {
          question: "What was the real user problem and how did you prove it?",
          answer: "Quick-commerce users defaulted exclusively to staples like milk, bread, and veggies, leaving high-margin impulse categories unexplored. The internal team assumption was price resistance. By analyzing 156,219 App Store reviews using NLP classification and Louvain graph clustering, we proved price was a separate complaint: users simply relied solely on search because browse feeds felt noisy and irrelevant.",
        },
        {
          question: "How does the Basket Intent Ladder generate recommendations?",
          answer: "The algorithm follows 3 levels: Level 1 takes current basket facts, Level 2 infers immediate user intent (e.g. evening tea or party snacks), and Level 3 recommends relevant items from complementary categories. It is served through the fast Tinder-style swipe interface fitted for 10-minute order urgency.",
        },
      ],
      customWidget: "blinkit-swipe",
    },
    liveLinks: [
      {
        label: "Open Discovery Engine",
        href: "https://blinkit-ai-discovery-engine-91md.vercel.app/",
        type: "prototype",
        trackingSlug: "blinkit-discovery",
      },
      {
        label: "Open Swipe MVP",
        href: "https://blinkit-iota-ruddy.vercel.app",
        type: "prototype",
        trackingSlug: "blinkit-swipe",
      },
    ],
  },
  {
    id: "myntra-wishlist",
    title: "Myntra",
    tagline: "Unlocking ₹548 Cr intent: converting dormant fashion wishlists into 30-day purchases (W2P-30) via NLP review clustering and proactive re-engagement.",
    discipline: "Growth & UI/UX",
    domain: "E-Commerce",
    provenance: "NextLeap AI PM Fellowship",
    provenanceType: "fellowship",
    badge: "Strategy Deck & Walkthrough",
    accentColor: "#E11D48",
    thumbnail: "/decks/myntra/slide_1.jpg",
    stack: ["NLP Review Clustering", "RICE Prioritization", "W2P-30 Metric Tree", "Figma MVP", "Python"],
    presentationDeck: {
      title: "Myntra Wishlist Conversion Strategy Deck",
      slideCount: 10,
      slides: [
        "/decks/myntra/slide_1.jpg",
        "/decks/myntra/slide_2.jpg",
        "/decks/myntra/slide_3.jpg",
        "/decks/myntra/slide_4.jpg",
        "/decks/myntra/slide_5.jpg",
        "/decks/myntra/slide_6.jpg",
        "/decks/myntra/slide_7.jpg",
        "/decks/myntra/slide_8.jpg",
        "/decks/myntra/slide_9.jpg",
        "/decks/myntra/slide_10.jpg",
      ],
      pdfUrl: "/decks/myntra.pdf",
    },
    problem: {
      headline: "Wishlists Are the Largest Pool of Dormant Intent on Myntra",
      description: "A saved item is the clearest user signal, but 14 of 35 users forget what they saved, and 26 of 35 lose items to elapsed time rather than deciding against them. The wishlist heart icon carried zero badges while the bell and bag did, and buyer reviews settling sizing doubts were buried below the fold.",
    },
    approach: {
      headline: "NLP Review Mining & Two-Step Re-Engagement Engine",
      framework: "Analyzed 63,014 App Store reviews across 4 filtering gates and 3 scoring axes to isolate genuine drop-off signals. Developed a 4-screen MVP pairing a changed-item badge counter with an above-the-fold Instant Reviews verdict that answers the user's specific sizing/color doubts without requiring endless scrolling.",
    },
    impact: {
      headline: "+3pp Lift on Wishlist-to-Purchase (W2P-30) with Return Rate Guardrails",
      metrics: [
        "Mined 63,014 raw reviews down to high-signal conversion bottlenecks",
        "Prioritized via RICE: Changed badge + Instant Reviews scored highest ROI",
        "Targeted +3pp lift on W2P-30 conversion with strict return rate guardrails",
      ],
    },
    deepDive: {
      executiveSummary: "Myntra turned profitable by selling more to existing users. Converting saved intent requires zero customer acquisition cost. This project identified the critical drop-off in W2P-30, proved that user drop-off stems from forgotten items and unanswered quality doubts, and designed a low-lift, high-impact feature release.",
      rootCauseDiscovery: "Two core failures caused intent to rot: (1) Nothing prompted the user to return—the wishlist icon never badged when prices dropped or buyer photos appeared. (2) When users returned by chance, the crucial information (e.g. 189 buyer photos answering sizing/fabric questions) was buried below ads, trust badges, and similar product carousels.",
      solutionArchitecture: [
        "Review Ingestion Pipeline: Filtered 63K reviews through 4 gates to surface real pre-purchase doubts.",
        "Heart Badge Notification: Dynamic count on the wishlist heart icon tracking changed items (price drop, new photos, low stock).",
        "Changed Filter & Chips: Surfaces ranked change reasons so returning users immediately see why to re-evaluate.",
        "Above-the-Fold Instant Reviews: Synthesizes top buyer feedback to answer sizing and fabric quality in under 3 seconds.",
      ],
      tradeoffs: [
        {
          decision: "Core Feature Focus",
          chosenApproach: "Paired Changed Badge with Instant Reviews",
          alternativeRejected: "Price-drop alerts as the sole standalone feature",
          reason: "Bringing users back to an unanswered product question wastes the visit; resolution requires both the nudge and the answer.",
        },
      ],
      faqs: [
        {
          question: "Why focus on the Wishlist instead of top-of-funnel customer acquisition?",
          answer: "Myntra's growth relies on monetizing its existing 200M active users. A saved item is high-intent signal that costs zero acquisition spend. Converting users who already expressed intent delivers direct margin expansion without burning marketing budget.",
        },
        {
          question: "What is the North Star metric for this project?",
          answer: "W2P-30 (Wishlist to Purchase within 30 days): percentage of users buying at least one saved item within 30 days of saving. Success criteria is a +3 percentage point lift with strict guardrails on return rates.",
        },
        {
          question: "How does the badge avoid becoming ignored notification spam?",
          answer: "The badge counts only changed items (price drops, restocked sizes, new verified photos)—never total saved items. It clears upon opening and goes quiet after 4 unopened days to prevent banner blindness.",
        },
      ],
    },
    liveLinks: [
      {
        label: "Open Strategy Deck (PDF)",
        href: "/decks/myntra.pdf",
        type: "prototype",
        trackingSlug: "myntra-deck",
      },
    ],
  },
  {
    id: "handwritten-ocr",
    title: "Paperform Digitisation",
    tagline: "Preserving audit integrity in legacy healthcare and compliance records by automating high-confidence text and routing unreadable signatures.",
    discipline: "OCR",
    domain: "Healthcare",
    provenance: "Client Work (Hestabit)",
    provenanceType: "client",
    badge: "Enterprise NDA Shipped",
    accentColor: "#1F5C58",
    thumbnail: "/shots/ocr_blueprint.jpg",
    stack: ["PaddleOCR", "Confidence Routing", "Human-in-the-Loop", "Python", "Computer Vision"],
    problem: {
      headline: "Silent Failures & Legal Liabilities in Digitizing Legacy Documents",
      description: "Decades of critical handwritten compliance records were being typed manually into spreadsheets. Off-the-shelf OCR either failed silently with confident wrong text or attempted to 'hallucinate' unreadable cursive signatures, corrupting audit trails.",
    },
    approach: {
      headline: "Confidence-Threshold Routing & Image-Preservation Fallback",
      framework: "Benchmarked PaddleOCR against Tesseract on client records; selected PaddleOCR for its granular per-region confidence scoring. Designed a pragmatic product policy: high-confidence text fields auto-populate the database, while low-confidence handwriting and signatures are saved as cropped images inside the digital record for human verification.",
    },
    impact: {
      headline: "~99% Extraction Accuracy & Zero Invented Audit Errors",
      metrics: [
        "~99% extraction accuracy on digitized client compliance records",
        "Zero invented compliance errors by refusing to guess unreadable signatures",
        ">20x speedup compared to manual operator typing",
      ],
    },
    deepDive: {
      executiveSummary: "In enterprise records management, technological imperfection cannot be an excuse for corrupted compliance records. If an OCR system misreads a signature or monetary figure, the organization faces serious legal liability. This solution engineered a human-in-the-loop hybrid architecture.",
      rootCauseDiscovery: "Tesseract OCR produced smooth text output even when accuracy was sub-40%, giving no warning that numbers were invented. In contrast, PaddleOCR provided bounding box confidence scores, allowing the product to establish strict gating logic.",
      solutionArchitecture: [
        "Document Pre-Processing: Deskewing, contrast normalization, and region-of-interest segmentation.",
        "PaddleOCR Regional Extraction: Produces character streams with confidence metadata.",
        "Confidence Decision Router: If confidence > 92%, field commits directly to SQL; if < 92%, field is flagged.",
        "Signature Preservation Module: Cursive signatures are cropped and stored as immutable PNG attachments in the digital row, never transcribed as guessed text.",
      ],
      tradeoffs: [
        {
          decision: "Handling Cursive Signatures",
          chosenApproach: "Store cropped image snippets directly inside the database record",
          alternativeRejected: "Forcing handwriting models to transcribe signatures into ASCII",
          reason: "Signatures are legally binding; transcription destroys forensic integrity, whereas an embedded image preserves proof.",
        },
      ],
      faqs: [
        {
          question: "Why couldn't off-the-shelf OCR tools handle these records?",
          answer: "Legacy court archives suffer from skew, faded carbon copies, stamp overlaps, and cursive ink signatures. Tools like Tesseract output smooth text even when accuracy is under 40%, silently inventing numbers with no error warnings.",
        },
        {
          question: "How does the confidence router and signature preservation work?",
          answer: "PaddleOCR extracts regional character streams with confidence metadata. If character confidence exceeds 92%, it auto-commits to SQL. If below 92%, it routes to a human verification queue. Cursive signatures are cropped and stored as immutable PNG attachments in the digital row, preserving forensic proof rather than guessing illegible script.",
        },
        {
          question: "What operational gain did this deliver?",
          answer: "Over 20x processing speedup compared to manual operator typing, with zero invented audit errors.",
        },
      ],
      customWidget: "ocr-preview",
    },
    liveLinks: [
      {
        label: "Client System Under NDA",
        href: "#",
        type: "nda",
      },
    ],
  },
  {
    id: "fraud-ops",
    title: "Commercial Lending Software Solution",
    tagline: "Intelligent deal matching and automated underwriting hub connecting commercial finance brokers with qualified lenders.",
    discipline: "Workflow Automation & RAG",
    domain: "Commercial Finance",
    provenance: "Client Work (Hestabit)",
    provenanceType: "client",
    badge: "Enterprise Platform",
    accentColor: "#1B3AC7",
    thumbnail: "/shots/fraud_blueprint.jpg",
    stack: ["AI Deal Matching", "FastAPI", "Vector Search", "CRM Integration", "Python"],
    problem: {
      headline: "Manual Lender Sifting & Fragmented Commercial Loan Processing",
      description: "Commercial finance brokers manually sift through hundreds of potential partners, while lenders receive unqualified SME applications, causing weeks of manual underwriting delays, deal leakage, and low approval rates.",
    },
    approach: {
      headline: "AI Deal Matching Engine & Automated Origination Pipeline",
      framework: "Engineered an intelligent operational hub analyzing 200+ deal parameters, lender appetite criteria, and historical placement data to pre-qualify and route high-probability deals directly to underwriters with automated workflows.",
    },
    impact: {
      headline: "65% Faster Processing & 75% Reduction in Manual Tasks",
      metrics: [
        "Reduced average deal turnaround time by 65% with automated intake & pre-qualification",
        "Intelligent matching analyzing 200+ data points across lenders and deal criteria",
        "Cut manual underwriting preparation tasks by up to 75% with automated workflows",
      ],
    },
    deepDive: {
      executiveSummary: "Commercial lending is fundamentally a matching and workflow problem. Instead of brokers manually reading appetite sheets and lenders reviewing unqualified submissions, an AI matching and deal management platform adapts to broker and lender workflows to accelerate loan closures.",
      rootCauseDiscovery: "The primary bottleneck in commercial brokerage wasn't deal volume—it was deal qualification and lender appetite mismatch. Automating criteria matching and underwriting document prep eliminated weeks of back-and-forth.",
      solutionArchitecture: [
        "Deal Intake & Parameter Extraction: Structured ingestion of loan requirements and financial profiles.",
        "200+ Data Point AI Matching Engine: Cross-references deal size, asset class, and credit parameters against live lender appetite.",
        "Automated Origination & Routing: Pre-qualifies and packages files directly to underwriting teams.",
        "Centralized Touchpoint Management: End-to-end tracking from initial enquiry to funding.",
      ],
      tradeoffs: [
        {
          decision: "Matching Strategy",
          chosenApproach: "Multi-Parameter Deterministic Scoring + Semantic Matching",
          alternativeRejected: "Black-box predictive ranking",
          reason: "Brokers and credit underwriters must understand exactly why a deal fits a lender's specific appetite criteria.",
        },
      ],
      faqs: [
        {
          question: "How does the intelligent matching engine work?",
          answer: "It analyzes over 200 deal parameters—such as asset type, LTV, revenue, and credit profile—against active lender appetite sheets and placement history to present the highest-probability lenders instantly.",
        },
        {
          question: "What is the impact on deal turnaround time?",
          answer: "Deal processing time is cut by 65%, while repetitive manual packaging tasks are reduced by up to 75% through automated workflow orchestration.",
        },
      ],
    },
    liveLinks: [
      {
        label: "Client System Under NDA",
        href: "#",
        type: "nda",
        trackingSlug: "commercial-lending",
      },
    ],
  },
  {
    id: "call-audit",
    title: "Call Quality Audit",
    tagline: "Scaling sales audit coverage from 5% to 100% using speech-to-text and a structured 70-point LLM evaluation rubric.",
    discipline: "GenAI & Event-Driven Automation",
    domain: "Sales Ops",
    provenance: "Client Work (Hestabit)",
    provenanceType: "client",
    badge: "Enterprise NDA Shipped",
    accentColor: "#1B3AC7",
    thumbnail: "/shots/call_audit_blueprint.jpg",
    stack: ["Whisper STT", "Prompt Engineering", "Airtable API", "Python", "Analytics"],
    problem: {
      headline: "Severe Blind Spots: Only 5% of Sales Coaching Calls Audited",
      description: "Supervisors spent hours manually listening to call recordings, resulting in <5% audit coverage. Critical script violations, compliance misses, and objection handling weaknesses were caught weeks too late.",
    },
    approach: {
      headline: "Automated Transcription & Rubric-Calibrated LLM Scoring",
      framework: "Engineered an automated ingestion pipeline that transcribes audio recordings via Whisper, slices them into conversational turns, and evaluates each call against a rigorous 70-point rubric with concrete timestamped quotes. Results auto-sync to Airtable manager dashboards.",
    },
    impact: {
      headline: "20x Audit Scale & 80% Manager Time Saved",
      metrics: [
        "100% call audit coverage (expanded from manual 5% baseline)",
        "80% reduction in supervisor time spent on administrative call reviews",
        "Timestamped coaching snippets delivered to sales reps within 10 minutes",
      ],
    },
    deepDive: {
      executiveSummary: "In high-velocity inside sales, team performance hinges on consistent objection handling and compliance. When supervisors can only sample 1 in 20 calls, coaching is reactive and anecdotal. This system turned qualitative audio into structured, actionable coaching data.",
      rootCauseDiscovery: "Previous attempts at call scoring failed because prompts asked generic questions like 'Was the rep polite?'. The solution required translating the client's internal 70-point evaluation manual into deterministic few-shot evaluation prompts that cite exact conversational timestamps.",
      solutionArchitecture: [
        "Audio Buffer & Diarization: Separates sales rep audio track from prospective customer.",
        "Whisper Transcription Engine: Normalizes domain-specific industry jargon.",
        "70-Point Rubric Scorer: Evaluates qualification, rapport, objection handling, and closing.",
        "Airtable Sync & Feedback Loop: Generates structured scorecards for team retrospectives.",
      ],
      tradeoffs: [
        {
          decision: "Scoring Feedback Structure",
          chosenApproach: "Exact Quoted Verbatim Citations",
          alternativeRejected: "Generic numeric score without dialogue quotes",
          reason: "Reps contest scores unless shown the exact dialogue where they missed the objection handling framework.",
        },
      ],
      faqs: [
        {
          question: "Why were supervisors only auditing 5% of sales calls?",
          answer: "Supervisors had to manually listen to 30-minute calls in real time, making full coverage impossible. Script violations and compliance issues were caught weeks late.",
        },
        {
          question: "How does the system evaluate and score conversations?",
          answer: "Audio recordings are processed via Whisper STT, diarized by speaker (sales rep vs prospect), and evaluated against an objective 70-point rubric with concrete timestamped quotes. Structured scorecards auto-sync to manager Airtable dashboards within 10 minutes.",
        },
        {
          question: "Why quote exact dialogue instead of just giving a numerical score?",
          answer: "Sales reps contest numeric scores unless shown the exact dialogue where they missed the objection handling framework. Verbatim timestamped citations make coaching objective and accepted.",
        },
      ],
    },
    liveLinks: [
      {
        label: "Client System Under NDA",
        href: "#",
        type: "nda",
      },
    ],
  },
  {
    id: "insurance-rag",
    title: "Insurance Bot",
    tagline: "Instant policy exclusion and clause search across 110 insurance carriers with strict multi-tenant boundary isolation.",
    discipline: "RAG",
    domain: "Insurance Tech",
    provenance: "Client Work (Hestabit)",
    provenanceType: "client",
    badge: "Enterprise NDA Shipped",
    accentColor: "#1F5C58",
    thumbnail: "/shots/flywheel_blueprint.jpg",
    stack: ["Scoped RAG", "Multi-Tenant Vector DB", "Intent Routing", "FastAPI", "Python"],
    problem: {
      headline: "Long Customer Hold Times (8-12 Mins) Navigating 110 Provider PDFs",
      description: "Support agents had to manually scour hundred-page policy wordings across 110 distinct insurance providers to verify claim coverage, leading to frustrating customer hold times and costly misinterpretation errors.",
    },
    approach: {
      headline: "Provider-Scoped Vector Indexing & Intent Pre-Routing",
      framework: "Constructed an isolated multi-tenant vector architecture where each insurer's policy documents reside in partitioned namespaces. Implemented intent pre-classification so queries search strictly within the customer's active policy without cross-document pollution.",
    },
    impact: {
      headline: "70% Drop in Policy Lookup Time & Zero Provider Cross-Talk",
      metrics: [
        "Reduced agent policy document search time from ~10 mins to under 15 seconds",
        "Covered 110 insurance carriers in a unified retrieval interface",
        "100% provider isolation preventing clause mix-ups between carriers",
      ],
    },
    deepDive: {
      executiveSummary: "Insurance documentation is notoriously dense and terminology differs subtly between providers. An answer that applies to Provider A could be an explicit exclusion under Provider B. Multi-tenant document scoping was mandatory.",
      rootCauseDiscovery: "A global vector search mixes similar clauses across insurers. By requiring the provider metadata tag at query time and routing through an intent classifier, the retrieval space is strictly bounded.",
      solutionArchitecture: [
        "PDF Ingestion & OCR Pre-processing: Parsed dense policy schedules and exclusion tables.",
        "Namespace-Isolated Vector Store: Segregates chunks by carrier ID and policy vintage.",
        "Context Retrieval & Synthesis: Injects exact clause IDs into the prompt context.",
      ],
      tradeoffs: [
        {
          decision: "Vector Store Indexing Strategy",
          chosenApproach: "Strict Partitioned Namespaces per Carrier",
          alternativeRejected: "Single combined vector index with metadata post-filtering",
          reason: "Guarantees zero mathematical chance of cross-carrier clause contamination during nearest neighbor search.",
        },
      ],
      faqs: [
        {
          question: "Why is global RAG dangerous across multiple insurance providers?",
          answer: "Policy wording is dense and terminology differs subtly between insurers. A clause that applies to Carrier A could be an explicit exclusion under Carrier B. A global vector search risks cross-carrier clause contamination.",
        },
        {
          question: "How is strict tenant isolation achieved?",
          answer: "We built partitioned namespaces per carrier in the vector store and added intent pre-routing so queries search strictly within the customer's policy namespace, ensuring zero clause mix-ups across 110 insurance providers.",
        },
        {
          question: "What was the business impact on customer support?",
          answer: "Reduced agent policy search time from 8-12 minutes to under 15 seconds, dramatically lowering call hold times and agent lookup errors.",
        },
      ],
    },
    liveLinks: [
      {
        label: "Client System Under NDA",
        href: "#",
        type: "nda",
      },
    ],
  },
  {
    id: "hr-automation",
    title: "HR Onboarding",
    tagline: "Zero-touch employee onboarding orchestrated across Google Workspace, Slack, and directory APIs via n8n.",
    discipline: "Event-Driven Automation(n8n)",
    domain: "HR Ops",
    provenance: "Client Work (Hestabit)",
    provenanceType: "client",
    badge: "Live Workflow Demo",
    accentColor: "#D97706",
    thumbnail: "/shots/hr_onboarding_n8n.png",
    stack: ["n8n", "Directory APIs", "Webhook Orchestration", "Slack API", "Security RBAC"],
    problem: {
      headline: "Manual 4-Day Onboarding Cycle With Repeated Permission Errors",
      description: "Every new hire required manual coordination across HR, IT, and department leads to set up accounts, email, role permissions, and software licenses, causing multi-day delays before new team members could contribute.",
    },
    approach: {
      headline: "Event-Driven Workflow Automation & Role-Based Provisioning",
      framework: "Mapped the employee lifecycle and designed an automated n8n workflow triggered upon contract signing. Built role-based access rules (RBAC) that automatically provision Google Workspace, assign license tiers, invite to departmental Slack channels, and trigger IT hardware tickets.",
    },
    impact: {
      headline: "Onboarding Time Cut from 4 Days to Under 5 Minutes",
      metrics: [
        "Reduced account provisioning from 3-4 business days to < 5 minutes",
        "Eliminated manual IT support setup tickets for routine access requests",
        "100% compliance with corporate role-based access control (RBAC)",
      ],
    },
    deepDive: {
      executiveSummary: "Internal workflow automation is one of the highest-ROI areas for a Product Manager to tackle. Mismatched permissions and slow onboarding frustrate employees and open security holes. Automating the flow creates an airtight operational rhythm.",
      rootCauseDiscovery: "The bottleneck wasn't executing individual steps; it was the asynchronous human handoffs between HR, IT, and team leads. Replacing email threads with an API webhook trigger eliminated the idle waiting time entirely.",
      solutionArchitecture: [
        "Contract Signature Webhook: Triggers payload ingestion from ATS.",
        "Role Mapping Engine: Maps department and senior title to exact software license bundles.",
        "API Execution Fan-Out: Concurrently creates Google account, Slack account, and internal tool licenses.",
        "Audit Log & Welcome Notification: Logs actions to security audit log and dispatches scheduled welcome email.",
      ],
      tradeoffs: [
        {
          decision: "Orchestration Engine Choice",
          chosenApproach: "Self-Hosted n8n Workflow Engine",
          alternativeRejected: "Custom hardcoded Python scripts or expensive enterprise SaaS",
          reason: "Visual node debugging allows non-engineers to inspect workflow status while keeping data on private infrastructure.",
        },
      ],
      faqs: [
        {
          question: "What was causing the 4-day onboarding delay?",
          answer: "The delay wasn't executing the tasks; it was asynchronous email handoffs between HR, IT, and department leads waiting for manual access approvals.",
        },
        {
          question: "How does zero-touch provisioning work?",
          answer: "An n8n workflow triggers upon contract signing in the ATS, maps the new hire's department and title to role-based software licenses, and concurrently provisions Google Workspace, Slack channels, and internal tools in under 5 minutes with full audit logging.",
        },
      ],
    },
    liveLinks: [
      {
        label: "Open Workflow Demo",
        href: "https://drive.google.com/file/d/1k9Fe7w7n0GxpJY-DF03b-0bcV6VYaxdn/view?usp=drive_link",
        type: "demo",
        trackingSlug: "hr-automation",
      },
    ],
  },
];
