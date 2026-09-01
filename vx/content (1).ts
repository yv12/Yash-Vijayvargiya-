/**
 * Every word on the site lives here.
 * Edit copy in this file only. Chapters read from it.
 *
 * TODO(yash): fill the fields marked TODO below.
 *   - contact.email
 *   - contact.github
 *   - contact.resumeUrl
 *   - each artifact.image (real screenshots, see /public/shots)
 */

export type Chapter = {
  id: string;
  number: string;
  navLabel: string;
  title: string;
};

export const meta = {
  name: "Yash Vijayvargiya",
  role: "Product-minded analyst trying to bridge business, technology and AI.",
  promise: "Fourteen chapters. Read it end to end, or jump to the work.",
  arc: [
    "Curiosity",
    "Technology",
    "People",
    "Business",
    "Problem framing",
    "AI",
    "Building",
    "Validation",
    "Product",
    "Scale",
  ],
};

export const contact = {
  email: "", // TODO(yash): public email address
  linkedin: "https://linkedin.com/in/yv12",
  github: "", // TODO(yash): GitHub profile URL
  resumeUrl: "", // TODO(yash): hosted resume PDF
  closing:
    "If any of this overlaps with something you are building, I would like to hear about it. I am most useful early, when the problem is still being argued about.",
};

/* ---------------------------------------------------------------- chapters */

export const chapters: Chapter[] = [
  { id: "opening", number: "01", navLabel: "Opening", title: "Opening" },
  { id: "between", number: "02", navLabel: "Between two rooms", title: "I did not want to pick a side" },
  { id: "problem", number: "03", navLabel: "The real problem", title: "The thing asked for is rarely the thing needed" },
  { id: "rag", number: "04", navLabel: "I never said that", title: "The four words that changed how I talk to clients" },
  { id: "speed", number: "05", navLabel: "Speed of decisions", title: "AI did not make me a developer, it made me faster at being wrong" },
  { id: "principles", number: "06", navLabel: "How I think", title: "Three rules I apply before anything gets built" },
  { id: "blinkit", number: "07", navLabel: "Quick commerce", title: "I was sure it was price. It was not price." },
  { id: "ocr", number: "08", navLabel: "Handwriting", title: "When the technology cannot read, the product still has to work" },
  { id: "build", number: "09", navLabel: "Things I build", title: "Things I build" },
  { id: "hdfc", number: "10", navLabel: "Grounded answers", title: "A fund answer that is confidently wrong is worse than no answer" },
  { id: "fraud", number: "11", navLabel: "Promotion gate", title: "The first thing my pipeline did was reject my own model" },
  { id: "systems", number: "12", navLabel: "Behind the screen", title: "I want to know what happens behind the screen" },
  { id: "direction", number: "13", navLabel: "Where this goes", title: "What I want to own next" },
  { id: "closing", number: "14", navLabel: "Say hello", title: "Say hello" },
];

/* ------------------------------------------------------------------ ch. 02 */

export const between = {
  lead: "B.Tech in Computer Science, Sikkim Manipal Institute of Technology, 2019 to 2023.",
  body: [
    "In my final year internship I ended up on calls with clients who had ten or more years of experience. I expected to be out of my depth. What I found was that I could hold the conversation, ask the awkward question, and leave the call with a clearer brief than I went in with.",
    "That was the first signal. I was better in the room than at the terminal, and I did not want to give up the terminal. So I stopped treating it as a choice between technology and business and started looking for the seat that sits between them.",
  ],
  axis: {
    left: "Technology",
    right: "Business",
    marker: "The seat I want",
    note: "Enough engineering to know what is actually hard. Enough business to know what is actually worth doing.",
  },
  /** Four points along the curve in chapter 02. Order matters. */
  path: [
    { place: "Sikkim Manipal", role: "B.Tech, Computer Science", when: "2019 to 2023" },
    { place: "Final year", role: "First client calls", when: "2023" },
    { place: "Intellipaat", role: "Technical buyers", when: "2023" },
    { place: "Hestabit", role: "Business Analyst", when: "2024 onward" },
  ],
  /** Pinned cards. One per stop that has something worth saying. */
  cards: [
    {
      stamp: "Final year",
      title: "The internship that redirected me",
      body: "On calls with clients who had ten or more years on me. I expected to be out of my depth. Instead I left those calls with a clearer brief than I walked in with, and that told me where I was actually useful.",
    },
    {
      stamp: "Intellipaat",
      title: "Selling to people who could not be bluffed",
      body: "Engineers and analysts choosing a data science programme. They could tell inside a minute whether I understood the subject. It taught me to answer the question behind the question.",
    },
    {
      stamp: "Hestabit",
      title: "Business Analyst, roughly eight client projects",
      body: "OCR, RAG assistants, call auditing, risk scoring, workflow automation. All client specific, all under NDA, so they stay anonymised here. The pattern across them is the part worth showing.",
    },
  ],
};

/** Chapter 06. The four lenses a decision has to survive. */
export const lenses = {
  centre: "Worth building",
  items: [
    { name: "User need", note: "Someone actually has this problem" },
    { name: "Business value", note: "It moves a number the business names" },
    { name: "Technical feasibility", note: "It can be built and maintained" },
    { name: "AI fit", note: "A model earns its place, or it does not" },
  ],
  caption:
    "Three out of four is a feature nobody asked for, or a good idea that cannot ship.",
};

/* ------------------------------------------------------------------ ch. 03 */

export const problem = {
  body: [
    "At Intellipaat I sold data science programmes to engineers, analysts and technical professionals. These were people who could tell within a minute whether I understood the subject or was reading a script.",
    "The ones who asked for a specific course usually did not want that course. They wanted a promotion, or a way out of manual reporting, or proof they could keep up with the people being hired around them. Selling them the thing they named would have been the easy sale and the wrong one.",
  ],
  swap: {
    askedLabel: "What was asked for",
    asked: "Which course should I take?",
    actualLabel: "What was actually being solved",
    actual: "Will this move me out of the work I am stuck in?",
    note: "Answer the second question and the first one answers itself.",
  },
  lesson:
    "I stopped saying yes to requests. I started asking what the day looks like now, and what it should look like instead.",
};

/* ------------------------------------------------------------------ ch. 04 */

export const rag = {
  intro:
    "Early at Hestabit, a client wanted insurance information to be easier for people who normally called a human for help. Good problem. I skipped past it.",
  transcript: [
    { who: "Client", line: "Our users call support because they cannot find anything in the policy documents." },
    { who: "Me", line: "So what you need is a RAG chatbot." },
    { who: "Client", line: "I never said that. What is RAG?" },
  ],
  after: [
    "I had answered a question nobody asked, in a language the client did not speak. Worse, an unfamiliar acronym makes a project sound expensive before anyone has scoped it. I had made my own work harder in one sentence.",
    "Now I treat the client as an equal in the room. Understand their problem. Understand the solution they already picture. Find the roadblocks between the two. Only then put options on the table, with the trade offs attached.",
  ],
  order: ["Their problem", "Their picture of the fix", "The roadblocks", "Options with trade offs"],
};

/* ------------------------------------------------------------------ ch. 05 */

export const speed = {
  body: [
    "I already had the technical base. What changed is that a working proof no longer needs a team. Earlier, testing whether an approach held up meant borrowing developers across specialities and waiting.",
    "The real gain is not that I write code faster. It is that the gap between a hunch and evidence got short enough that I can afford to be wrong in public, early, before anyone has spent a quarter on it.",
    "Research changed the same way. I can read a hundred thousand reviews for pattern, then take the pattern into interviews and find out whether people recognise themselves in it. Quantitative finds the shape. Qualitative tells you why the shape is there.",
  ],
  compare: {
    beforeLabel: "Before",
    before: ["Assemble specialists", "Wait for a build slot", "Find out at the end"],
    afterLabel: "Now",
    after: ["Build the thin version myself", "Test it against real inputs", "Find out on day one"],
  },
};

/* ------------------------------------------------------------------ ch. 06 */

export const principles = [
  {
    rule: "Do not assume on behalf of the user.",
    body: "My taste is not evidence. If I cannot point to a review, an interview or a number, it is a guess and I label it as one.",
  },
  {
    rule: "Name the metric that proves the business outcome.",
    body: "Every feature is supposed to move something the business cares about. If nobody can name that number, the feature is decoration.",
  },
  {
    rule: "Validate before investing heavily in building.",
    body: "The cheapest version that can still be wrong in an interesting way comes first. Scale comes after the answer, not before it.",
  },
];

export const questions = {
  featureLabel: "Before a feature",
  feature: ["Why this feature?", "What does it solve?", "For whom?"],
  autoLabel: "Before automating a workflow",
  auto: ["Why does this workflow exist?", "Where is the bottleneck actually coming from?"],
};

/* ------------------------------------------------------------------ ch. 07 */

export const blinkit = {
  context: "Fellowship project. Growth PM brief on a quick commerce app.",
  goal:
    "Increase the share of monthly active customers who buy from at least one new category each month.",
  hypothesis:
    "My starting hypothesis was price. New categories look expensive next to a local shop, so people stay in their staples.",
  method:
    "Rather than argue about it, I built a discovery engine over Play Store reviews. Classification to separate noise from signal, embeddings and graph clustering to group complaints into themes, then a journey stage tag so a theme could be traced to a point in the funnel.",
  pipeline: [
    { label: "Raw reviews", value: "156,219" },
    { label: "Cleaned units", value: "84,111" },
    { label: "App experience", value: "842" },
    { label: "Themes kept", value: "5" },
  ],
  split: [
    { label: "Praise and noise", value: 53525 },
    { label: "Operational", value: 25808 },
    { label: "Pricing and policy", value: 3936 },
    { label: "App experience", value: 842 },
  ],
  insight:
    "Price complaints were real but they sat in their own bucket and did not explain category exploration. The theme that did was discovery. Recommendations surfaced things people had already seen or could not buy, and searches for a product they wanted came back buried under everything else.",
  interviews:
    "Four interviews with the target segment. All four said the recommendations were bad. All four described searching instead of browsing because search was the only surface they trusted. Two independently described the exact failure the engine had ranked fourth.",
  reframe: {
    fromLabel: "Hypothesis",
    from: "People do not explore because new categories cost too much.",
    toLabel: "What the evidence said",
    to: "People do not explore because the products they would have bought are never put in front of them.",
  },
  solution: [
    "So the MVP is a cross category recommendation engine with a swipe surface on top of it. The engine works up a ladder from what is already in the basket: basket facts, then intent and hard constraints, then the same need in a new category, then the same goal through a different need. Confidence decays at every hop, and every card has to carry a one line reason that references a real basket item or it does not ship.",
    "The swipe is the delivery surface, not a gimmick. Skip, save for later, or add it now. Three slots, filled honestly, and fewer than three when there is no honest reason to show a third.",
  ],
  demoLabel: "Try the interaction",
  demoNote: "Three cards. Same logic as the deployed MVP, running locally in this page.",
  cards: [
    {
      product: "Veg protein bars",
      bridge: "Your basket runs on protein, and this is the same need in a category you have not opened.",
      level: "Same need, new category",
    },
    {
      product: "Smart weighing scale",
      bridge: "You buy protein weekly. The goal behind that is measured on something.",
      level: "Same goal, different need",
    },
    {
      product: "Cold pressed peanut butter",
      bridge: "Sits next to your oats and dairy, and stays inside the veg filter your basket implies.",
      level: "Same need, new category",
    },
  ],
  honesty:
    "To be clear about what this is: hypothesis, evidence, insight, and a deployed MVP. There is no post launch result to report, because it has not been launched to real users.",
  links: [
    { label: "Discovery engine", href: "https://blinkit-ai-discovery-engine-91md.vercel.app/" },
    { label: "Swipe MVP", href: "https://blinkit-iota-ruddy.vercel.app" },
  ],
};

/* ------------------------------------------------------------------ ch. 08 */

export const ocr = {
  context: "Client work at Hestabit. An organisation with years of handwritten paper records.",
  body: [
    "The job was to digitise the records. A specialist had been typing them into spreadsheets for years and was never going to finish.",
    "OCR handled most of it. It could not reliably read signatures and a small share of handwritten fields, and no amount of tuning was going to fix a signature. The usual options were both bad: guess and put wrong data into a compliance record, or drop the field and lose it.",
  ],
  decision:
    "Third option. When the model cannot read a region with confidence, capture that region as an image and keep it inside the digitised record. The field stays legible to a human, the record stays complete, and nothing is invented.",
  choice:
    "I also picked PaddleOCR over Tesseract after benchmarking both on the client's own documents, for one reason: PaddleOCR reported confidence per region. Tesseract failed silently with confident wrong text, and silent failure is unusable when a person has to trust the output.",
  outcome:
    "Around 99% extraction accuracy on the output that reached the client, with low confidence fields routed to human review rather than automated away.",
  lesson: "A limitation in the technology is not permission to ship a worse product.",
};

/* ------------------------------------------------------------------ ch. 09 */

export type Artifact = {
  name: string;
  kind: "Professional" | "Fellowship" | "Personal";
  line: string;
  stack: string;
  href?: string;
  image?: string; // TODO(yash): drop screenshots into /public/shots and reference them here
};

export const artifacts: Artifact[] = [
  {
    name: "HDFC mutual fund assistant",
    kind: "Fellowship",
    line: "Answers questions on five schemes, only from the official documents.",
    stack: "FastAPI, Qdrant, Groq, citation validator",
    href: "https://hdfc-mutual-fund-faq-groww.vercel.app/",
  },
  {
    name: "Fraud scoring pipeline",
    kind: "Personal",
    line: "A full model lifecycle with a promotion rule that can say no.",
    stack: "DuckDB, MLflow, FastAPI, Evidently",
    href: "https://fraud-ops-pipeline-production.up.railway.app/",
  },
  {
    name: "Quick commerce discovery engine",
    kind: "Fellowship",
    line: "156,219 reviews clustered into themes tied to a funnel stage.",
    stack: "Embeddings, kNN, Louvain, hybrid classifier",
    href: "https://blinkit-ai-discovery-engine-91md.vercel.app/",
  },
  {
    name: "Cross category swipe MVP",
    kind: "Fellowship",
    line: "A recommendation ladder delivered as three swipeable cards.",
    stack: "React, Groq llama-3.3-70b at runtime",
    href: "https://blinkit-iota-ruddy.vercel.app",
  },
  {
    name: "Call quality audit system",
    kind: "Professional",
    line: "Coaching calls transcribed, scored against a 70 point rubric, reported back to the owner.",
    stack: "Transcript processing, scoring prompts, Airtable",
  },
  {
    name: "Insurance policy assistant",
    kind: "Professional",
    line: "Policy questions answered from one provider's documents at a time, across 110 providers.",
    stack: "RAG, intent classification, retrieval thresholds",
  },
  {
    name: "Handwritten record digitisation",
    kind: "Professional",
    line: "Unreadable regions preserved as images instead of guessed.",
    stack: "PaddleOCR, confidence routing, review queue",
  },
  {
    name: "HR onboarding automation",
    kind: "Professional",
    line: "One trigger sets up a new joiner across every system they need.",
    stack: "n8n, HR and directory integrations",
  },
];

/* ------------------------------------------------------------------ ch. 10 */

export const hdfc = {
  context: "Fellowship project.",
  body: [
    "A chatbot that answers mutual fund questions is a compliance problem wearing a product costume. An invented expense ratio is not a bad user experience, it is a false statement about a regulated financial product.",
    "So the design started from what it is not allowed to do. Answers come only from the official documents. A query classifier catches what is out of scope. A citation validator checks that the answer is actually supported by what was retrieved. A PII scanner runs on the way in.",
  ],
  infra:
    "I also had to make it survive a free tier. Embeddings moved to a hosted inference API and the local vector store moved to Qdrant Cloud, which shrank the backend enough to run on a small instance with an automated ingestion pipeline behind it.",
  href: "https://hdfc-mutual-fund-faq-groww.vercel.app/",
};

/* ------------------------------------------------------------------ ch. 11 */

export const fraud = {
  context: "Personal project, built to understand the lifecycle by operating it.",
  body: [
    "Fraud models decay because fraud adapts. I wanted to feel the operational side of that rather than read about it, so I built the whole loop: a ledger of transactions and predictions, a model registry, a serving layer, and drift monitoring.",
    "The interesting part is the promotion rule. A candidate model scores in shadow next to production. It only replaces production if it beats production on precision and on recall. Not on average, not on one of the two.",
  ],
  gate: {
    label: "Promotion gate",
    conditions: ["Candidate precision > production", "Candidate recall > production"],
    verdictLabel: "First live test",
    verdict: "Rejected",
    verdictNote:
      "The batch contained no fraud cases, so both models scored zero and the rule refused the swap. A pipeline that promotes on a tie is a pipeline that quietly ships a worse model.",
  },
  href: "https://fraud-ops-pipeline-production.up.railway.app/",
};

/* ------------------------------------------------------------------ ch. 12 */

export const systems = {
  body: [
    "I keep pulling at what happens behind the screen. Where the money moves, who is on the hook, which step is slow because of a system and which is slow because of a person.",
    "Card payments are a good example of the habit. One tap on a phone opens a chain across the user, the merchant, the acquiring side and the issuing bank, with fees taken along the way and a fraud model deciding in the middle of it, trained on what fraud looked like last month.",
  ],
  flow: ["User", "Merchant", "Acquirer", "Network", "Issuer"],
  flowNote: "Fees, and a scoring decision, sit between each pair.",
  onboarding: {
    title: "HR onboarding, wired end to end",
    trigger: "Candidate marked hired, contract signed",
    steps: [
      "Employee record created",
      "Accounts provisioned",
      "App access granted by role",
      "Added to the right channels",
      "Welcome email sent",
      "HR and IT confirmed",
    ],
    note: "Built in n8n across recruiting, HR, email, chat and software access.",
  },
  lesson:
    "Understand the workflow first. Then find the bottleneck. Then decide what deserves to be automated. Automating a bad workflow just makes it fail faster.",
};

/* ------------------------------------------------------------------ ch. 13 */

export const direction = {
  body: [
    "I want to own products, not tickets. Decide with evidence and a clear read of the competition, ship, watch what actually happens, and keep the thing strong in its category rather than defending the version that shipped.",
  ],
  loop: ["Build", "Launch", "Learn", "Scale", "Compete", "Improve"],
};

/* ------------------------------------------------------------------- skills */

export const orbit = {
  title: "Everything still in orbit",
  note: "Closer to the middle means I reach for it most. Hover or tap a node to stop the sky and read it.",
  centre: "Me",
  /** Inner ring is what I reach for most. Keep labels short, they sit inside a circle. */
  rings: [
    ["Discovery", "User research", "PRDs", "Metrics", "Stakeholders"],
    ["RAG", "LLM evals", "Prompting", "Guardrails", "Vector DBs", "Model drift"],
    ["Python", "SQL", "FastAPI", "MLflow", "Qdrant", "n8n", "Airtable", "Claude Code"],
  ],
};

export const skills = [
  {
    group: "Product and analysis",
    items: [
      "Product discovery",
      "User research",
      "Requirements gathering",
      "BRD and PRD writing",
      "Roadmapping",
      "Agile and Scrum",
      "A/B testing",
      "Success metrics and KPIs",
      "Data analysis",
      "Stakeholder management",
    ],
  },
  {
    group: "AI product",
    items: [
      "RAG",
      "LLM integration and evaluation",
      "Prompt engineering",
      "AI product strategy",
      "MCP",
      "Multi agent systems",
      "Vector databases",
      "AI guardrails",
      "Hallucination detection",
      "Model monitoring and drift",
    ],
  },
  {
    group: "Tools",
    items: [
      "Python",
      "SQL",
      "MLflow",
      "FastAPI",
      "Qdrant and Chroma",
      "OpenAI",
      "Groq",
      "n8n",
      "Cursor",
      "Antigravity",
      "Claude Code",
      "Airtable",
      "GitHub Actions",
    ],
  },
];
