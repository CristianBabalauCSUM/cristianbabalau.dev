/**
 * ---------------------------------------------------------------------------
 * ABOUT PAGE CONTENT
 * Bio paragraphs support **highlight** markers, rendered in the accent green.
 * ---------------------------------------------------------------------------
 */
export const about = {
  /** "$ whoami" subtitle row: full name + handle */
  fullName: "Cristian-Teodor Babalau",
  handle: "@cristian",
  /** Lead sentence; the `em` part renders in the accent color */
  lead: {
    em: "Software engineer",
    rest: " who likes knowing what's under the hood, from BLAS matrix kernels to e-commerce checkout flows.",
  },
  /** Key/value facts table under the lead */
  facts: [
    { label: "name", value: "Cristian-Teodor Babalau" },
    { label: "age", value: "21", comment: "// born 2004" },
    { label: "based in", value: "Maastricht, NL", comment: "// GMT+1" },
    { label: "speaks", value: "Romanian (native), English (fluent)" },
    { label: "status", value: "open to roles & freelance", live: true },
  ] as { label: string; value: string; comment?: string; live?: boolean }[],
  /** Polaroid photo (public/me/portrait.jpg) */
  photo: {
    alt: "Cristian-Teodor Babalau",
    src: "/me/portrait.jpg" as string | undefined,
  },

  /** 01 THE LONGER VERSION, **text** renders as green highlights */
  bio: [
    "I started coding when I was **14**, with a complicated course in **C** I could not manage at that time. So I moved to **Python**, and that's how I got into the **Informatics Olympiads**. By the time I was 17, I was fluent in C, and especially in **competitive coding**: I've won **municipal Olympiads** and scored a **Mention at the National Olympiad**. From there, I went to pursue my passion at university.",
    "Along the way I taught myself the web the practical way: some **PHP** and freelance **WordPress plugins** at first, then an extended **JavaScript** course I paid for with freelance savings. Later I got curious about the world beyond the browser, picking up **back-end** good practices (**Java Spring**, **Express.js**) and even **Arduino** electronics, one of which ended up in daily use at my mother's workplace.",
    "That passion took me to the **University of Maastricht**, where I earned my **BSc in Computer Science** (class of 2026). I got my first taste of production software early, a full-stack internship at **Next Generation Sensors** in my very first year, building RESTful APIs with **Java Spring** on PostgreSQL and shipping a responsive Angular.js front end inside a real Agile team.",
    "In January 2025 I founded **OrchEcomm**, a modular operating system for online stores. It now runs **6 fully working modules with 3 more in beta**, connecting **30 e-commerce businesses** and **50+ suppliers** while orchestrating **3.000+ orders every month**. Although I consider education very important, I've decided that for now I want to focus on developing OrchEcomm and gain as much experience from it as I can.",
    "The researcher in me got its outlet in my BSc thesis: **Temporal Semantic Proximity Analysis (TSPA)**, a method for detecting coordinated information operations on social media. It processes up to **500k tweets per campaign** through multilingual sentence embeddings and Leiden community detection, surfacing coordinated communities with IO purities of up to **100%**, and it taught me that at scale, cosine similarity is a memory problem before it's a math problem.",
  ],

  /** 02 OFF THE CLOCK, photo grid */
  gallery: [
    { alt: "Hugs in the park", caption: "~/me/park-hugs.jpg", src: "/me/park-hugs.jpg" },
    { alt: "Canal walk under the trees", caption: "~/me/canal-walk.jpg", src: "/me/canal-walk.jpg" },
    { alt: "Sunset over the fields", caption: "~/me/sunset-fields.jpg", src: "/me/sunset-fields.jpg" },
    { alt: "Museum run", caption: "~/me/museum-run.jpg", src: "/me/museum-run.jpg" },
    { alt: "Games on the grass with friends", caption: "~/me/grass-games.jpg", src: "/me/grass-games.jpg" },
    { alt: "Sheep neighbours", caption: "~/me/sheep-neighbours.jpg", src: "/me/sheep-neighbours.jpg" },
    { alt: "Projection room", caption: "~/me/projection-room.jpg", src: "/me/projection-room.jpg" },
    { alt: "Lunch stop", caption: "~/me/lunch-stop.jpg", src: "/me/lunch-stop.jpg" },
  ] as { alt: string; caption: string; src?: string }[],

  /** 03 HOW I GOT HERE, timeline (newest first) */
  timeline: [
    {
      year: "2026",
      title: "Graduated: BSc Computer Science",
      text: "Finished my degree at the University of Maastricht with TSPA, a coordinated-information-operations detector that separates IO communities at purities up to 100% across 14 real campaigns.",
    },
    {
      year: "2025",
      title: "Founded OrchEcomm",
      text: "Went self-employed and built a modular e-commerce operating system: 6 working modules (3 more in beta), 30 businesses and 50+ suppliers connected, 3.000+ orders orchestrated every month.",
    },
    {
      year: "2023",
      title: "Moved to Maastricht for CS",
      text: "Started the Bachelor at the University of Maastricht, and landed a full-stack internship at Next Generation Sensors in my very first semester, because why ease into things.",
    },
    {
      year: "late 2022",
      title: "Arduino tracking devices, adopted for real",
      text: "Completed an Arduino project, a series of tracking devices used at my mother's job to follow her workers' routes, all wired into a dashboard. It started as a funny proof-of-knowledge build and became her workplace's first digitalisation tool, giving real transparency over routes and actions.",
    },
    {
      year: "2022",
      title: "Beyond the browser: IOT & back-end",
      text: "Got interested in IOT and coding for the physical world. Started learning good practices in back-end development (Java Spring, Express.js) and got into electronics and the engineering of physical devices with Arduino.",
    },
    {
      year: "2021",
      title: "Fluent in C, deep in competitive coding",
      text: "By 17 the language that once defeated me became my strongest weapon. Won municipal Informatics Olympiads and scored a Mention at the National Olympiad.",
    },
    {
      year: "2019",
      title: "Bought my way deeper into web dev",
      text: "Saved enough from freelance work to buy an extended JavaScript course and get seriously into web development.",
    },
    {
      year: "2019",
      title: "First income: PHP & WordPress",
      text: "Learned basic PHP and started providing a custom WordPress plugin service on the freelance market, my first real money made from code.",
    },
    {
      year: "2019",
      title: "Python & the Informatics Olympiads",
      text: "Moved to Python, and that's how I got into the Informatics Olympiads, my first taste of algorithms as a sport.",
    },
    {
      year: "2018",
      title: "First lines of real code",
      text: "Started coding at 14 with a complicated C course I could not manage at the time. It didn't stick, but the itch did.",
    },
  ],

  /** 05 RIGHT NOW, three "currently" cards */
  currently: [
    {
      label: "▸ BUILDING",
      title: "OrchEcomm's module ecosystem",
      note: "Growing the suite past its 6 live modules, with 3 more in full-scale beta.",
    },
    {
      label: "▸ LEARNING",
      title: "Azure & AI-agent workflows",
      note: "Taking cloud past 'basic knowledge', and optimising my productivity by using AI agents smartly.",
    },
    {
      label: "▸ READING",
      title: "Kafka · Saramago · Remarque · Harari",
      note: "The Trial, Blindness, All Quiet on the Western Front, and A Brief History of Humankind.",
    },
  ],
};
