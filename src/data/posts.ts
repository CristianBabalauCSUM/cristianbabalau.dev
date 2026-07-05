import type { BodyBlock } from "./projects";

/**
 * ---------------------------------------------------------------------------
 * BLOG POSTS, the newest post is rendered as the big "★ FEATURED · LATEST"
 * card on /blog.
 * ---------------------------------------------------------------------------
 */
export type Post = {
  slug: string;
  title: string;
  /** Kebab-ish filename shown inside the terminal preview card */
  fileName: string;
  excerpt: string;
  /** e.g. "JUN 09, 2026" */
  date: string;
  readTime: string;
  tags: string[];
  /** Optional cover image; leave undefined to show a placeholder block */
  cover?: string;
  /** Optional "read more" link rendered at the end of the post */
  readMore?: { label: string; href: string };
  body: BodyBlock[];
};

export const posts: Post[] = [
  {
    slug: "detecting-coordinated-bots-tspa",
    title: "Hunting Coordinated Bots with Temporal Semantic Proximity",
    fileName: "# hunting-coordinated-bots-with-temporal-semantic-proximity",
    excerpt:
      "How my BSc thesis pipeline chews through 500k tweets per campaign to surface accounts that say the same thing at the same time, and why cosine similarity at scale is a memory problem before it's a math problem.",
    date: "JUN 2026",
    readTime: "4 min read",
    cover: "/blog/tspa-cover.jpg",
    tags: [
      "thesis",
      "Python",
      "NLP",
      "graph analysis",
      "influence operations",
    ],
    readMore: {
      label: "read the full thesis project",
      href: "/project/tspa-thesis",
    },
    body: [
      {
        type: "p",
        text: "Influence operations don't announce themselves. They coordinate dozens or hundreds of accounts to push the same narrative, slightly reworded, at roughly the same time. Behavioural detectors catch the clumsy ones (synchronized retweets, identical posting schedules), but accounts paraphrasing a shared script slip right through. My BSc thesis asks: what if we measured *what* accounts say and *when* they say it, together?",
      },
      { type: "h2", text: "The Idea: TSPA" },
      {
        type: "p",
        text: "**Temporal Semantic Proximity Analysis (TSPA)** scores pairs of accounts by the semantic similarity of their posts inside sliding time windows. Two accounts that repeatedly post near-identical *meaning* within the same window accumulate proximity, a content-based signal that complements the behavioural traces most existing detectors rely on. Every post is embedded with **multilingual sentence-transformer embeddings** (768-dimensional MPNet), so paraphrases and even cross-language repeats land close together in vector space.",
      },
      { type: "h2", text: "Making It Scale" },
      {
        type: "p",
        text: "The pipeline processes up to **500k tweets per campaign** across 14 real-world Twitter influence operations. All-pairs cosine similarity over half a million 768-d vectors will happily eat all your RAM, so the core step is a **memory-bounded, row-chunked BLAS matrix multiplication** in NumPy. Together with a thorough complexity-optimization pass, the pipeline went from exponential to logarithmic time. The lesson: at this scale, cosine similarity is a memory-layout problem before it's a math problem.",
      },
      {
        type: "callout",
        text: "If your NumPy job is swapping, no amount of vectorization will save you. Chunk the rows, bound the working set, and let BLAS do what BLAS does.",
      },
      { type: "h2", text: "From Similarity to Communities" },
      {
        type: "p",
        text: "Pairwise proximity scores become weighted user-similarity graphs. On those I run **weighted Leiden community detection** (igraph / leidenalg) and rank accounts by **eigenvector centrality** to surface the coordinated core of each cluster. Everything is explorable in an interactive VIS-Network.js dashboard, cross-referenced with documented examples of prior *Coordinated Infamous Activity*.",
      },
      { type: "h2", text: "Did It Work?" },
      {
        type: "p",
        text: "Benchmarked against behavioural-trace baselines with **ROC-AUC, PR-AUC, and non-parametric significance testing**, TSPA surfaces coordinated communities with purities up to **100%**, and more interestingly, it complements behavioural signals rather than duplicating them. Content and timing catch what schedules alone miss.",
      },
      {
        type: "p",
        text: "Stack for the curious: Python, NumPy, pandas, scikit-learn, SciPy, sentence-transformers, NetworkX, igraph, leidenalg, Jupyter, VIS-Network.js.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
