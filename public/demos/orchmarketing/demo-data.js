/* OrchMarketing demo data — a fully invented jewellery store and its creative pipeline.
   Everything here is fictional sample content. No real API, no network calls.
   Exposed as window.OMD_DATA so the demo works from file:// with plain <script> tags. */

window.OMD_DATA = {
  store: {
    name: 'Auréa',
    market: 'United Kingdom — everyday fine jewellery, women 25 to 45',
    currency: 'GBP',
    url: 'https://aurea-jewellery.co.uk',
    brandMd:
      '# Auréa\n\n' +
      'Auréa makes **everyday fine jewellery** for people who want one good piece, not ten fast ones. ' +
      'Recycled 14k gold vermeil and freshwater pearls, made in small runs, priced to actually wear daily.\n\n' +
      '- **Audience:** women 25 to 45, design-literate, buy less and keep it\n' +
      '- **Positioning:** the quiet luxury of a piece that lasts, without the boutique markup\n' +
      '- **Tone:** calm, confident, a little understated. Never shouty.\n' +
      '- **Key objection to overcome:** "is gold vermeil real gold, and will it last?" (yes, 2.5 micron, 2-year warranty)',
    designNotes: 'Fonts: a warm grotesque for headlines, clean sans for body. Palette: bone ivory, soft near-black, muted brass accent used sparingly. Warm natural light, gallery-style negative space.',
    products: 8, offers: 5, proposals: 3
  },

  products: [
    { id: 'p1', title: 'Halo Solitaire Necklace', type: 'Necklace', price: 128, variants: 2, images: 3, kind: 'necklace', seed: 3 },
    { id: 'p2', title: 'Petra Signet Ring', type: 'Ring', price: 96, variants: 4, images: 4, kind: 'ring', seed: 7 },
    { id: 'p3', title: 'Aria Huggie Hoops', type: 'Earrings', price: 64, variants: 1, images: 2, kind: 'earring', seed: 1 },
    { id: 'p4', title: 'Celeste Pearl Drop Earrings', type: 'Earrings', price: 88, variants: 1, images: 3, kind: 'earring', seed: 9 },
    { id: 'p5', title: 'Vesper Chain Bracelet', type: 'Bracelet', price: 74, variants: 3, images: 3, kind: 'bracelet', seed: 4 },
    { id: 'p6', title: 'Orla Stacking Ring Set', type: 'Ring', price: 110, variants: 5, images: 5, kind: 'ring', seed: 2 },
    { id: 'p7', title: 'Lumen Pendant Necklace', type: 'Necklace', price: 98, variants: 2, images: 4, kind: 'necklace', seed: 6 },
    { id: 'p8', title: 'Marlowe Cuff Bangle', type: 'Bracelet', price: 142, variants: 2, images: 2, kind: 'bracelet', seed: 8 }
  ],

  offers: [
    { id: 'o1', title: 'First order: 10% off + free UK shipping', mechanic: 'Welcome code via email capture popup', angle: 'Removes both first-purchase objections at once', urgency: 'Code expires 72h after signup', status: 'approved' },
    { id: 'o2', title: 'Second piece -20%', mechanic: 'Automatic cart discount on 2+ items', angle: 'Raises AOV instead of discounting singles', urgency: 'Evergreen', status: 'approved' },
    { id: 'o3', title: 'The Auréa list: early access drops', mechanic: '48h early access to new pieces for subscribers', angle: 'Status and insider identity, no discount needed', urgency: '48h window', status: 'idea' },
    { id: 'o4', title: 'Gift with purchase over £120', mechanic: 'Free travel jewellery pouch at threshold', angle: 'A gift feels generous where a discount feels like negotiation', urgency: 'While stock lasts', status: 'idea' },
    { id: 'o5', title: 'Start of summer: up to 30% off', mechanic: 'Seasonal sale tiered by collection', angle: 'Occasion gives the discount a reason-why', urgency: '10-day window', status: 'idea' }
  ],

  campaigns: [
    {
      id: 'c1', title: 'Is It Real Gold?', format: 'static', status: 'proposed', offerId: null, kind: 'trust',
      hook: 'Answer the one question every buyer silently asks before they add to cart',
      bigIdea: 'A macro of the Halo Solitaire beside a short proof stack: 14k gold vermeil, 2.5 micron, 2-year warranty. Exploits the trust gap that stops people buying gold jewellery online.',
      visualDirection: 'Extreme macro fills 70% of frame on a warm bone background, one hard specular highlight on the pendant. Right rail: three small line-drawn proof badges and a one-line customer quote in italic.',
      copy: { headline: 'Yes, it is real gold.', primary: '14k gold vermeil, 2.5 microns thick, backed by a 2-year warranty. The everyday piece that actually lasts.', cta: 'See the proof' }
    },
    {
      id: 'c2', title: 'The Everyday Edit', format: 'grid', status: 'approved', offerId: 'o2', kind: 'grid',
      hook: 'Six pieces, six prices, one glance',
      bigIdea: 'A clean 3x2 grid of the core range with a was/now badge per cell. Density signals depth of range and makes each piece individually clickable.',
      visualDirection: 'Bone-tinted cells with hairline dividers, each product cutout centred, small price label bottom-corner. Header bar carries the offer line.',
      copy: { headline: 'The everyday edit', primary: 'From £64. Made to wear daily, priced to keep buying.', cta: 'Shop the edit' }
    },
    {
      id: 'c3', title: 'Unboxing POV', format: 'ugc_video', status: 'proposed', offerId: null, kind: 'ugc',
      hook: 'Hands open the Auréa box in the first second. No intro, no logo card.',
      bigIdea: 'A 20-second phone-shot POV unboxing of the Celeste earrings: box, tissue, try-on, price reveal. UGC texture makes the brand feel attainable.',
      visualDirection: 'Vertical 9:16, natural window light, one continuous-take feel. Captions in the brand font, price reveal as a handwritten-style overlay two-thirds through.',
      copy: { headline: 'I did not expect this quality', primary: 'Real gold vermeil, delivered in 3 days. Watch the unboxing.', cta: 'Get yours' }
    }
  ],

  // creatives already generated + approved (shown in Studio and available to the ads builder)
  shots: [
    { id: 's1', campaignId: 'c2', status: 'approved', score: 9, model: 'marketing_studio_image', kind: 'grid', headline: 'The everyday edit', price: 'from £64' },
    { id: 's2', campaignId: 'c2', status: 'approved', score: 8, model: 'nano_banana_2', kind: 'grid', headline: 'Six ways in', price: 'from £64' },
    { id: 's3', campaignId: 'c1', status: 'review', score: 7, model: 'marketing_studio_image', kind: 'trust', headline: 'Yes, it is real gold.', price: '£128' },
    { id: 's4', campaignId: 'c1', status: 'rejected', score: 4, model: 'flux_2', kind: 'trust', headline: 'Real gold', price: '£128' }
  ],

  offerPool: [
    { title: 'Bundle & save: the starter stack', mechanic: 'Necklace + hoops + ring at 15% off the set', angle: 'Sells a look, not an item; strong AOV lift', urgency: 'Evergreen' },
    { title: 'Free engraving this week', mechanic: 'Complimentary engraving on rings and pendants', angle: 'Turns a product into a gift with meaning', urgency: '7-day window' },
    { title: 'Refer a friend: £15 each', mechanic: 'Both sides get £15 off after the friend converts', angle: 'Low-cost acquisition from happy buyers', urgency: 'Evergreen' }
  ],

  campaignPool: [
    {
      title: 'Worn, Not Displayed', format: 'carousel', kind: 'lifestyle',
      hook: 'Card one is a lifestyle shot so good it does not look like an ad',
      bigIdea: 'A 5-card carousel alternating on-body shots with detail macros, ending on the offer. Sells the identity first, the product second.',
      visualDirection: 'On-body editorial shots with a desaturated background, alternating with macro detail crops. Final card is a typographic offer card in the brand accent.',
      copy: { headline: 'Wear it every day', primary: 'Pieces made for the life you already have.', cta: 'Explore the edit' }
    },
    {
      title: 'Receipt of Value', format: 'static', kind: 'receipt',
      hook: 'The ad looks like a receipt for one piece you will keep for years',
      bigIdea: 'A stylised receipt itemising what you actually pay for: recycled gold, 2-year warranty, free returns. Reframes price as value.',
      visualDirection: 'Monospaced receipt type on textured paper, product clipped at the top edge, total line bold in the brass accent.',
      copy: { headline: 'Itemised.', primary: 'What you actually pay for.', cta: 'See the collection' }
    }
  ],

  templates: [
    { id: 't1', name: 'Shop the edit grid', kind: 'grid', input: '2 to 4 product photos, front-facing on ivory' },
    { id: 't2', name: 'Verified authenticity badge', kind: 'trust', input: '1 product photo, cutout on white' },
    { id: 't3', name: 'On-model price tag', kind: 'model', input: '1 lifestyle photo wearing the piece' },
    { id: 't4', name: 'Customer review overlay', kind: 'review', input: '1 product photo, ivory background' },
    { id: 't5', name: 'Flash-sale hero banner', kind: 'flash', input: '1 product cutout, min 2000px' },
    { id: 't6', name: 'Spotlight noir hero', kind: 'noir', input: '1 product cutout on white' }
  ],

  // ads analytics (14-day sample)
  analytics: {
    currency: 'GBP',
    totals: { spend: 3184.40, roas: 2.9, purchases: 168, reach: 84200, impressions: 291500, clicks: 5120, ctr: 1.76, cpm: 10.92 },
    campaigns: [
      { name: 'Auréa · Sales · ASC · evergreen', status: 'ACTIVE', dailyBudget: 60, spend: 1180.20, reach: 41200, clicks: 2210, ctr: 1.9, cpc: 0.53, frequency: 1.8, purchases: 78, roas: 3.6 },
      { name: 'Auréa · Sales · CBO 1-3-1 · everyday edit', status: 'ACTIVE', dailyBudget: 45, spend: 902.60, reach: 24800, clicks: 1490, ctr: 1.6, cpc: 0.61, frequency: 2.1, purchases: 46, roas: 2.5 },
      { name: 'Auréa · Test · ABO creative rail', status: 'ACTIVE', dailyBudget: 30, spend: 640.80, reach: 12100, clicks: 980, ctr: 1.2, cpc: 0.65, frequency: 2.7, purchases: 22, roas: 1.2 },
      { name: 'Auréa · Retargeting · warm 30d', status: 'PAUSED', dailyBudget: 15, spend: 460.80, reach: 6100, clicks: 440, ctr: 3.3, cpc: 1.05, frequency: 3.4, purchases: 22, roas: 5.4 }
    ],
    // 14 daily points: [spend, roas]
    series: [
      [198, 2.6], [212, 2.7], [188, 2.4], [224, 3.1], [231, 2.9], [205, 2.5], [196, 2.3],
      [242, 3.2], [258, 3.0], [221, 2.6], [214, 2.8], [246, 3.3], [268, 3.1], [281, 3.4]
    ]
  },

  fbFormats: [
    { id: 'asc', label: 'Advantage+ Sales — 1 campaign, 10 to 20 creatives', structure: '1 ASC campaign · 1 AI ad set · 10 to 20 ads', hint: "Meta's ML picks audience, placement and budget. The 2026 default for scaling." },
    { id: 'cbo131', label: 'CBO consolidation — 1 campaign · 3 ad sets · 1 ad', structure: '1 CBO campaign · 3 broad ad sets · 1 ad each', hint: 'Few ad sets exit learning faster. CBO shifts budget to the winner.' },
    { id: 'abo', label: 'ABO creative test — equal budgets', structure: '1 ABO campaign · 3 to 5 ad sets · 1 creative each', hint: 'Clean split test: every creative gets guaranteed equal spend.' },
    { id: 'retarget', label: 'Retargeting stack — warm audiences', structure: '1 ABO campaign · 2 to 3 warm ad sets · 2 ads each', hint: 'Proof-led creatives plus an urgency offer for warm traffic.' }
  ],

  // pre-baked plan the builder "generates"
  plan: {
    campaign: { name: 'Auréa · Sales · CBO 1-3-1 · everyday edit', objective: 'OUTCOME_SALES', budget: 45, currency: 'GBP', bid: 'highest_volume' },
    adsets: [
      { name: 'Trust angle · Advantage+ broad', market: 'GB', audience: 'Advantage+ audience, broad', age: '25-45', ad: { name: 'Is It Real Gold · static', shotId: 's3', headline: 'Yes, it is real gold.', primary: '14k gold vermeil, 2.5 microns, 2-year warranty.', cta: 'SHOP_NOW', link: 'https://aurea-jewellery.co.uk/products/halo-solitaire-necklace' } },
      { name: 'Range angle · Advantage+ broad', market: 'GB', audience: 'Advantage+ audience, broad', age: '25-45', ad: { name: 'Everyday Edit · grid', shotId: 's1', headline: 'The everyday edit', primary: 'From £64. Made to wear daily.', cta: 'SHOP_NOW', link: 'https://aurea-jewellery.co.uk/collections/all' } },
      { name: 'Value angle · Advantage+ broad', market: 'GB', audience: 'Advantage+ audience, broad', age: '25-45', ad: { name: 'Everyday Edit v2 · grid', shotId: 's2', headline: 'Six ways in', primary: 'One good piece beats ten fast ones.', cta: 'SHOP_NOW', link: 'https://aurea-jewellery.co.uk/collections/all' } }
    ],
    learning: 'Each ad set needs roughly 50 purchases per week to exit learning. At £45/day split across 3 broad ad sets, expect 4 to 6 days before CBO settles on the winning angle. Do not edit during learning.',
    rules: ['Kill any ad set with CPA above £22 after 3 days at full delivery', 'Scale the winner +20% budget every 3 days while ROAS stays above 2.5', 'Refresh the creative when frequency passes 2.5 and CTR drops'],
    rationale: 'The trust objection is the biggest blocker for gold jewellery, so one ad set leads with proof. The other two split range and value using the approved Everyday Edit creatives. Broad Advantage+ targeting lets the creative do the targeting, which matches how delivery works after detailed targeting was deprecated.'
  },

  // pre-baked analyst report
  report:
    "## Verdict\n" +
    "Spend is efficient at 2.9x blended ROAS over 14 days, but the account is carried by two campaigns. The ABO test rail is burning budget below breakeven and the retargeting set is your best performer sitting paused. Two clear moves this week.\n\n" +
    "## What's working\n" +
    "- **ASC evergreen** is the engine: 3.6x ROAS on £1,180 spend, CTR 1.9%, frequency a healthy 1.8. It has the volume to trust.\n" +
    "- **Retargeting warm 30d** returns 5.4x ROAS, the highest in the account, on only £461 spend. Currently paused.\n" +
    "- The **Everyday Edit** grid creative is doing the heavy lifting inside the CBO set at 2.5x.\n\n" +
    "## What's not\n" +
    "- **ABO creative test** is at 1.2x ROAS on £641 spend, below breakeven. CTR is only 1.2% with frequency already at 2.7, so this reads as weak creative rather than bad audience.\n" +
    "- The rejected trust creative never should have shipped; the approved version scores far better and is not live yet.\n\n" +
    "## Watch list\n" +
    "- Retargeting frequency is 3.4. If you reactivate it, refresh the creative within a week to avoid fatigue.\n" +
    "- CBO set frequency 2.1 and climbing. One more creative angle would relieve it.\n\n" +
    "## Actions\n" +
    "1. **Reactivate the retargeting set** at £15/day. [expected effect: +£800 revenue/week at current ROAS] [confidence: high]\n" +
    "2. **Pause the ABO test rail** and move its £30/day into the ASC campaign. [expected effect: reclaim roughly £200/week of wasted spend] [confidence: high]\n" +
    "3. **Ship the approved Is It Real Gold creative** into the CBO set as the third angle. [expected effect: relieves frequency, tests the trust angle at scale] [confidence: medium]\n\n" +
    "## Data caveats\n" +
    "14-day window, single account. The retargeting read is on low spend (£461), so treat its 5.4x as directional until it runs a full week reactivated."
};
