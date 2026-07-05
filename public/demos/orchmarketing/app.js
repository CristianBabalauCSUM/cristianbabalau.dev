/* OrchMarketing interactive demo — vanilla JS, no build, no framework, no network.
   Every button simulates the real interaction a customer would have in OrchMarketing:
   generating offers and campaign concepts, producing creatives, moving the kanban,
   pulling ad analytics, building a Meta campaign plan, and running an analyst report.
   All "AI" actions run a short simulated delay against baked-in demo data.

   Embed: include styles.css, demo-data.js and this file, then either drop a
   <div id="orchmarketing-demo"></div> on the page or call OrchMarketingDemo.mount(el). */

(function () {
  var D = window.OMD_DATA;
  var root = null;

  // ---- session state (mutable copies so interactions persist) ----
  var S = {
    mode: 'creative',            // 'creative' | 'ads'
    view: 'dashboard',           // 'dashboard' | 'store'
    tab: 'overview',
    adsTab: 'analytics',
    timeframe: '14d',
    offers: clone(D.offers),
    campaigns: clone(D.campaigns),
    shots: clone(D.shots),
    offerIdx: 0,
    campIdx: 0,
    studioPick: '',
    builderFormat: 'cbo131',
    builderPicks: ['s1', 's2', 's3'],
    plan: null,
    report: null,
    pending: null                // { key, label }
  };

  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function money(n) { return (D.store.currency === 'GBP' ? '£' : D.store.currency + ' ') + n; }

  // ---------------------------------------------------------------- SVG art
  var TINTS = ['#f4efe6', '#f1ece2', '#efeadf', '#f3eee4', '#ece6da', '#f2ede3'];
  var GOLD = '#b0894e';
  var INK = '#3a352c';

  function glyph(kind, cx, cy, s, col) {
    col = col || GOLD;
    var w = 'stroke="' + col + '" fill="none" stroke-width="' + (s * 0.05) + '" stroke-linecap="round"';
    if (kind === 'ring') {
      return '<circle cx="' + cx + '" cy="' + (cy + s * 0.12) + '" r="' + s * 0.42 + '" ' + w + '/>' +
        '<path d="M' + (cx - s * 0.14) + ' ' + (cy - s * 0.34) + ' L' + cx + ' ' + (cy - s * 0.52) + ' L' + (cx + s * 0.14) + ' ' + (cy - s * 0.34) + ' Z" ' + w + '/>';
    }
    if (kind === 'necklace') {
      return '<path d="M' + (cx - s * 0.55) + ' ' + (cy - s * 0.5) + ' Q' + cx + ' ' + (cy + s * 0.35) + ' ' + (cx + s * 0.55) + ' ' + (cy - s * 0.5) + '" ' + w + '/>' +
        '<circle cx="' + cx + '" cy="' + (cy + s * 0.28) + '" r="' + s * 0.13 + '" ' + w + '/>';
    }
    if (kind === 'earring') {
      var e = function (dx) {
        return '<path d="M' + (cx + dx) + ' ' + (cy - s * 0.4) + ' L' + (cx + dx) + ' ' + (cy - s * 0.05) + '" ' + w + '/>' +
          '<circle cx="' + (cx + dx) + '" cy="' + (cy + s * 0.14) + '" r="' + s * 0.15 + '" ' + w + '/>';
      };
      return e(-s * 0.22) + e(s * 0.22);
    }
    if (kind === 'bracelet') {
      return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + s * 0.5 + '" ry="' + s * 0.34 + '" ' + w + '/>' +
        '<circle cx="' + cx + '" cy="' + (cy - s * 0.34) + '" r="' + s * 0.09 + '" ' + w + '/>';
    }
    // generic sparkle
    return '<path d="M' + cx + ' ' + (cy - s * 0.4) + ' L' + (cx + s * 0.1) + ' ' + (cy - s * 0.1) + ' L' + (cx + s * 0.4) + ' ' + cy +
      ' L' + (cx + s * 0.1) + ' ' + (cy + s * 0.1) + ' L' + cx + ' ' + (cy + s * 0.4) + ' L' + (cx - s * 0.1) + ' ' + (cy + s * 0.1) +
      ' L' + (cx - s * 0.4) + ' ' + cy + ' L' + (cx - s * 0.1) + ' ' + (cy - s * 0.1) + ' Z" ' + w + '/>';
  }

  function productArt(kind, seed) {
    var bg = TINTS[seed % TINTS.length];
    return '<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="400" height="500" fill="' + bg + '"/>' +
      '<circle cx="200" cy="230" r="150" fill="#ffffff" opacity="0.35"/>' +
      glyph(kind, 200, 235, 150) +
      '<text x="200" y="452" text-anchor="middle" font-family="' + "'IBM Plex Mono',monospace" + '" font-size="15" letter-spacing="4" fill="' + INK + '" opacity="0.55">AURÉA</text>' +
      '</svg>';
  }

  // ad-creative mockups by concept kind
  function creativeArt(kind, opt) {
    opt = opt || {};
    var head = esc(opt.headline || 'Auréa');
    var price = esc(opt.price || '');
    var dark = (kind === 'ugc' || kind === 'noir');
    var bg = dark ? '#161311' : TINTS[(opt.seed || 2) % TINTS.length];
    var fg = dark ? '#e9dcc2' : INK;
    var gold = dark ? '#d8b877' : GOLD;
    var parts = ['<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="500" fill="' + bg + '"/>'];

    if (kind === 'grid') {
      var cells = [[110, 150, 'necklace'], [290, 150, 'ring'], [110, 320, 'earring'], [290, 320, 'bracelet']];
      parts.push('<rect x="30" y="60" width="340" height="46" fill="none"/>');
      parts.push('<text x="200" y="92" text-anchor="middle" font-family="' + "'Space Grotesk',sans-serif" + '" font-size="24" font-weight="700" fill="' + fg + '">' + head + '</text>');
      cells.forEach(function (c) {
        parts.push('<rect x="' + (c[0] - 78) + '" y="' + (c[1] - 60) + '" width="156" height="150" fill="#ffffff" opacity="0.3" rx="6"/>');
        parts.push(glyph(c[2], c[0], c[1] + 5, 80, gold));
      });
      parts.push('<text x="200" y="470" text-anchor="middle" font-family="' + "'IBM Plex Mono',monospace" + '" font-size="15" fill="' + gold + '">' + (price || 'from £64') + '</text>');
    } else if (kind === 'trust') {
      parts.push('<circle cx="150" cy="235" r="140" fill="#ffffff" opacity="0.35"/>');
      parts.push(glyph('necklace', 150, 235, 150, gold));
      [180, 235, 290].forEach(function (y, i) {
        parts.push('<circle cx="330" cy="' + y + '" r="18" fill="none" stroke="' + gold + '" stroke-width="1.5"/>');
        parts.push('<path d="M322 ' + y + ' l6 6 l10 -12" fill="none" stroke="' + gold + '" stroke-width="1.5"/>');
      });
      parts.push('<text x="40" y="430" font-family="' + "'Space Grotesk',sans-serif" + '" font-size="26" font-weight="700" fill="' + fg + '">' + head + '</text>');
      if (price) parts.push('<text x="40" y="462" font-family="' + "'IBM Plex Mono',monospace" + '" font-size="14" fill="' + gold + '">' + price + '</text>');
    } else if (dark) {
      parts.push('<radialGradient id="sp"><stop offset="0%" stop-color="#3a3128"/><stop offset="100%" stop-color="#161311"/></radialGradient>');
      parts.push('<rect width="400" height="500" fill="url(#sp)"/>');
      parts.push(glyph(opt.glyph || 'earring', 200, 220, 150, gold));
      parts.push('<text x="200" y="410" text-anchor="middle" font-family="' + "'Space Grotesk',sans-serif" + '" font-size="22" font-weight="600" fill="' + gold + '">' + head + '</text>');
      if (price) parts.push('<text x="200" y="442" text-anchor="middle" font-family="' + "'IBM Plex Mono',monospace" + '" font-size="14" fill="' + fg + '">' + price + '</text>');
    } else if (kind === 'receipt') {
      parts.push('<rect x="120" y="60" width="160" height="360" fill="#fbf9f4" stroke="#ddd6c8"/>');
      parts.push('<text x="200" y="98" text-anchor="middle" font-family="' + "'IBM Plex Mono',monospace" + '" font-size="13" letter-spacing="3" fill="' + INK + '">AURÉA</text>');
      for (var i = 0; i < 5; i++) parts.push('<line x1="140" y1="' + (130 + i * 26) + '" x2="260" y2="' + (130 + i * 26) + '" stroke="#e3ddce"/>');
      parts.push('<text x="150" y="300" font-family="' + "'IBM Plex Mono',monospace" + '" font-size="13" fill="' + INK + '">TOTAL</text>');
      parts.push('<text x="250" y="300" text-anchor="end" font-family="' + "'IBM Plex Mono',monospace" + '" font-size="15" font-weight="600" fill="' + gold + '">' + (price || '£128') + '</text>');
      parts.push('<text x="200" y="460" text-anchor="middle" font-family="' + "'Space Grotesk',sans-serif" + '" font-size="17" fill="' + fg + '">' + head + '</text>');
    } else {
      parts.push('<circle cx="200" cy="210" r="140" fill="#ffffff" opacity="0.35"/>');
      parts.push(glyph(opt.glyph || 'ring', 200, 215, 150, gold));
      parts.push('<text x="200" y="400" text-anchor="middle" font-family="' + "'Space Grotesk',sans-serif" + '" font-size="22" font-weight="600" fill="' + fg + '">' + head + '</text>');
      if (price) parts.push('<text x="200" y="434" text-anchor="middle" font-family="' + "'IBM Plex Mono',monospace" + '" font-size="14" fill="' + gold + '">' + price + '</text>');
    }
    parts.push('</svg>');
    return parts.join('');
  }

  function shotArt(shot) {
    var camp = S.campaigns.concat(D.campaigns).find(function (c) { return c.id === shot.campaignId; });
    return creativeArt(shot.kind, { headline: shot.headline, price: shot.price, glyph: camp && camp.kind === 'ugc' ? 'earring' : 'necklace' });
  }

  // ---------------------------------------------------------------- helpers
  function mdToHtml(md) {
    var lines = String(md).split('\n'), html = '', inUl = false;
    var inline = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); };
    lines.forEach(function (raw) {
      var l = raw.replace(/\s+$/, '');
      if (!l) { if (inUl) { html += '</ul>'; inUl = false; } return; }
      if (l.indexOf('## ') === 0) { if (inUl) { html += '</ul>'; inUl = false; } html += '<h2>' + inline(l.slice(3)) + '</h2>'; }
      else if (l.indexOf('# ') === 0) { html += '<h1>' + inline(l.slice(2)) + '</h1>'; }
      else if (l.indexOf('- ') === 0) { if (!inUl) { html += '<ul>'; inUl = true; } html += '<li>' + inline(l.slice(2)) + '</li>'; }
      else if (/^\d+\.\s/.test(l)) { if (!inUl) { html += '<ul>'; inUl = true; } html += '<li>' + inline(l.replace(/^\d+\.\s/, '')) + '</li>'; }
      else { if (inUl) { html += '</ul>'; inUl = false; } html += '<p>' + inline(l) + '</p>'; }
    });
    if (inUl) html += '</ul>';
    return html;
  }

  function toast(msg, kind) {
    var t = document.createElement('div');
    t.className = 'omd-toast' + (kind === 'err' ? ' err' : '');
    t.textContent = msg;
    root.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 300); }, 2600);
  }

  // Simulated "Claude / Higgsfield is working" delay, then mutate + re-render + toast.
  function runSim(key, ms, mutate, msg) {
    if (S.pending) return;
    S.pending = { key: key };
    render();
    setTimeout(function () {
      S.pending = null;
      mutate();
      render();
      if (msg) toast(msg);
    }, ms);
  }

  // ---------------------------------------------------------------- sidebar
  function sidebar() {
    if (S.mode === 'ads') {
      var an = [['analytics', '▦', 'Analytics'], ['builder', '✎', 'Campaign builder'], ['reports', '≡', 'Analyst reports'], ['connection', '⚡', 'Connection']];
      return '<aside class="omd-sidebar">' +
        '<div class="omd-logo"><span class="omd-logo-dot"></span> OrchMarketing <small>/ads manager</small></div>' +
        '<button class="omd-mode-switch" data-a="mode" data-v="creative"><span>◆</span> Creative Ops <span class="arrow">←</span></button>' +
        '<div class="omd-nav-section"><div class="omd-nav-kicker">Meta Ads</div>' +
        an.map(function (n) { return '<button class="omd-nav-item ' + (S.adsTab === n[0] ? 'active' : '') + '" data-a="adstab" data-v="' + n[0] + '"><span class="omd-ico">' + n[1] + '</span> ' + n[2] + '</button>'; }).join('') +
        '</div>' +
        '<div class="omd-sidebar-foot"><div class="omd-pill"><span class="omd-dot on"></span> meta connected</div><div class="omd-pill"><span class="omd-dot on"></span> bridge online</div></div>' +
        '</aside>';
    }
    return '<aside class="omd-sidebar">' +
      '<div class="omd-logo"><span class="omd-logo-dot"></span> OrchMarketing <small>/creative ops</small></div>' +
      '<button class="omd-mode-switch" data-a="mode" data-v="ads"><span>∞</span> Ads Manager <span class="arrow">→</span></button>' +
      '<div class="omd-nav-section"><div class="omd-nav-kicker">Workspace</div>' +
      '<button class="omd-nav-item ' + (S.view === 'dashboard' ? 'active' : '') + '" data-a="dashboard"><span class="omd-ico">▦</span> Dashboard</button>' +
      '</div>' +
      '<div class="omd-nav-section"><div class="omd-nav-kicker">Stores</div>' +
      '<button class="omd-nav-item ' + (S.view === 'store' ? 'active' : '') + '" data-a="open-store"><span class="omd-ico">◆</span> ' + esc(D.store.name) + '</button>' +
      '</div>' +
      '<div class="omd-sidebar-foot"><div class="omd-pill"><span class="omd-dot ' + (S.pending ? 'busy' : 'on') + '"></span> bridge ' + (S.pending ? 'busy' : 'online') + '</div><div>engine: claude-local</div></div>' +
      '</aside>';
  }

  // ---------------------------------------------------------------- creative views
  function dashboard() {
    var cov = D.products.slice(0, 4).map(function (p) { return productArt(p.kind, p.seed); }).join('');
    var proposals = S.campaigns.filter(function (c) { return c.status === 'proposed'; }).length;
    var approved = S.campaigns.filter(function (c) { return c.status === 'approved'; }).length;
    return '<div class="omd-page omd-fade">' +
      '<div class="omd-head"><div><div class="omd-kicker">Workspace</div><h1 class="omd-display">Stores</h1>' +
      '<p class="omd-sub">Each store bundles a brand file, a design style, a product catalogue and its creative pipeline: hooks, campaign proposals, and the production board.</p></div>' +
      '<button class="omd-btn primary" data-a="toast" data-v="In the full app this opens the new-store wizard.">+ New store</button></div>' +
      '<div class="omd-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">' +
      '<div class="omd-card omd-store-card" data-a="open-store"><div class="omd-store-cover">' + cov + '</div>' +
      '<div class="omd-store-body"><h3>' + esc(D.store.name) + '</h3><div class="omd-store-meta">' + esc(D.store.market) + '</div>' +
      '<div class="omd-chips"><span class="omd-chip">' + D.products.length + ' products</span><span class="omd-chip">' + S.offers.length + ' offers</span>' +
      (proposals ? '<span class="omd-chip lime">' + proposals + ' proposals</span>' : '') +
      (approved ? '<span class="omd-chip">' + approved + ' to generate</span>' : '') + '</div></div></div>' +
      '</div></div>';
  }

  function storeView() {
    var tabs = [
      ['overview', 'Overview', null],
      ['products', 'Products', D.products.length],
      ['hooks', 'Hook Lab', S.offers.length],
      ['campaigns', 'Campaigns', S.campaigns.filter(function (c) { return c.status === 'proposed'; }).length],
      ['prompts', 'Premade prompts', D.templates.length],
      ['studio', 'Studio', S.campaigns.filter(function (c) { return c.status === 'approved' || c.status === 'generating'; }).length],
      ['board', 'Board', null]
    ];
    var body = {
      overview: tabOverview, products: tabProducts, hooks: tabHooks,
      campaigns: tabCampaigns, prompts: tabPrompts, studio: tabStudio, board: tabBoard
    }[S.tab]();
    return '<div class="omd-page ' + (S.tab === 'board' ? 'wide' : '') + ' omd-fade">' +
      '<div class="omd-head" style="margin-bottom:16px"><div><div class="omd-kicker">' + esc(D.store.market.split(' ')[0]) + ' · ' + D.store.currency + '</div><h1 class="omd-display">' + esc(D.store.name) + '</h1></div></div>' +
      '<div class="omd-tabs">' + tabs.map(function (t) {
        return '<button class="omd-tab ' + (S.tab === t[0] ? 'active' : '') + '" data-a="tab" data-v="' + t[0] + '">' + t[1] + (t[2] ? '<span class="count">' + t[2] + '</span>' : '') + '</button>';
      }).join('') + '</div>' + body + '</div>';
  }

  function tabOverview() {
    return '<div class="omd-stack">' +
      '<div class="omd-kpis">' +
      kpi(D.products.length, 'products') + kpi(S.offers.length, 'offers') +
      kpi(S.campaigns.filter(function (c) { return c.status === 'proposed'; }).length, 'proposals') +
      kpi(S.campaigns.filter(function (c) { return c.status === 'approved'; }).length, 'to generate') +
      kpi(S.shots.filter(function (s) { return s.status === 'approved'; }).length, 'creatives') + '</div>' +
      '<div class="omd-panel"><h2 class="omd-section">Brand file</h2><div class="omd-md">' + mdToHtml(D.store.brandMd) + '</div></div>' +
      '<div class="omd-panel"><h2 class="omd-section">Design style</h2><p class="omd-sub" style="margin-bottom:0">' + esc(D.store.designNotes) + '</p></div>' +
      '</div>';
    function kpi(v, k) { return '<div class="omd-kpi"><div class="v" style="font-size:24px">' + v + '</div><div class="k">' + k + '</div></div>'; }
  }

  function tabProducts() {
    return '<div class="omd-stack">' +
      '<div class="omd-row omd-spread"><h2 class="omd-section" style="margin:0">Catalogue <span class="omd-mono" style="font-size:12px;color:var(--faint)">' + D.products.length + ' products</span></h2>' +
      '<button class="omd-btn sm" data-a="toast" data-v="Connect Shopify or drop a product CSV in the full app.">⚡ Connect Shopify</button></div>' +
      '<div class="omd-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">' +
      D.products.map(function (p) {
        return '<div class="omd-card omd-prod">' + productArt(p.kind, p.seed) +
          '<div class="omd-prod-body"><h4>' + esc(p.title) + '</h4><div class="omd-prod-price">' + money(p.price) + '</div>' +
          '<div class="omd-prod-sub">' + esc(p.type) + ' · ' + p.variants + ' variant' + (p.variants > 1 ? 's' : '') + ' · ' + p.images + ' img</div></div></div>';
      }).join('') + '</div></div>';
  }

  function tabHooks() {
    var groups = [['idea', 'Ideas'], ['approved', 'Approved'], ['rejected', 'Rejected']];
    var genBtn = S.pending && S.pending.key === 'offers'
      ? '<div class="omd-progress"><span class="omd-pulse"></span>claude is thinking…</div>'
      : '<button class="omd-btn primary" data-a="gen-offers">Generate offers</button>';
    var right = S.offers.length ? groups.map(function (g) {
      var items = S.offers.filter(function (o) { return o.status === g[0]; });
      if (!items.length) return '';
      return '<div><div class="omd-kicker" style="color:' + (g[0] === 'rejected' ? 'var(--faint)' : 'var(--lime)') + '">' + g[1] + ' · ' + items.length + '</div>' +
        '<div class="omd-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">' +
        items.map(offerCard).join('') + '</div></div>';
    }).join('') : '<div class="omd-empty"><div class="big">No offers yet</div>Generate a batch of hooks on the left.</div>';

    return '<div class="omd-split"><div class="omd-stack">' +
      '<div class="omd-panel"><div class="omd-kicker">Hook &amp; offer engine</div>' +
      '<div class="omd-field"><label>What are we pushing? (optional)</label><textarea class="omd-input" rows="3" placeholder="e.g. summer clearance, want urgency without looking desperate"></textarea></div>' +
      '<div class="omd-row omd-spread">' + genBtn + '</div>' +
      '<p class="omd-hint" style="margin-top:12px">Approved offers can be attached to campaign proposals to build creatives around them.</p></div>' +
      '</div><div class="omd-stack">' + right + '</div></div>';
  }
  function offerCard(o) {
    return '<div class="omd-card omd-offer"><h4>' + esc(o.title) + '</h4>' +
      (o.mechanic ? '<p class="mech">' + esc(o.mechanic) + '</p>' : '') +
      (o.angle ? '<p class="angle">' + esc(o.angle) + '</p>' : '') +
      (o.urgency ? '<p class="angle" style="margin-top:4px">⏱ ' + esc(o.urgency) + '</p>' : '') +
      '<div class="omd-offer-foot"><span class="omd-badge ' + (o.status === 'approved' ? 'approved' : o.status === 'rejected' ? 'rejected' : 'proposed') + '">' + o.status + '</span>' +
      '<div class="omd-icon-btns">' +
      (o.status !== 'approved' ? '<button class="omd-icon-btn ok" title="Approve" data-a="offer" data-id="' + o.id + '" data-s="approved">✓</button>' : '') +
      (o.status !== 'rejected' ? '<button class="omd-icon-btn no" title="Reject" data-a="offer" data-id="' + o.id + '" data-s="rejected">✕</button>' : '') +
      '</div></div></div>';
  }

  function tabCampaigns() {
    var genBtn = S.pending && S.pending.key === 'camps'
      ? '<div class="omd-progress"><span class="omd-pulse"></span>claude is proposing concepts…</div>'
      : '<button class="omd-btn primary" data-a="gen-camps">Propose campaigns</button>';
    var proposals = S.campaigns.filter(function (c) { return c.status === 'proposed'; });
    var list = proposals.length ? proposals.map(campCard).join('') :
      '<div class="omd-empty"><div class="big">No proposals waiting</div>Run the campaign engine on the left.</div>';
    return '<div class="omd-split"><div class="omd-stack">' +
      '<div class="omd-panel"><div class="omd-kicker">Campaign proposal engine</div>' +
      '<div class="omd-field"><label>Creative direction (optional)</label><textarea class="omd-input" rows="3" placeholder="e.g. lean into authenticity trust, UGC-first"></textarea></div>' +
      '<div class="omd-row"><div class="omd-field" style="flex:1;margin-bottom:0"><label>Engine</label><select class="omd-input"><option>Claude Code (local desktop)</option></select></div>' +
      '<div class="omd-field" style="flex:1;margin-bottom:0"><label>Model</label><select class="omd-input"><option>claude-sonnet-5</option><option>claude-opus-4-8</option></select></div></div>' +
      '<div class="omd-row omd-spread" style="margin-top:14px">' + genBtn + '</div></div>' +
      '</div><div class="omd-stack">' + list + '</div></div>';
  }
  function campCard(c) {
    var off = S.offers.find(function (o) { return o.id === c.offerId; });
    return '<div class="omd-card omd-camp"><div class="omd-camp-top"><h3>' + esc(c.title) + '</h3>' +
      '<div class="omd-row" style="gap:6px;flex-wrap:nowrap"><span class="omd-badge fmt">' + fmtLabel(c.format) + '</span><span class="omd-badge ' + c.status + '">' + c.status + '</span></div></div>' +
      '<p class="omd-camp-hook">“' + esc(c.hook) + '”</p>' +
      '<div class="omd-camp-sec"><div class="lbl">Big idea</div><p>' + esc(c.bigIdea) + '</p></div>' +
      '<div class="omd-camp-sec"><div class="lbl">Visual direction</div><p>' + esc(c.visualDirection) + '</p></div>' +
      '<div class="omd-camp-sec"><div class="lbl">Copy</div><div class="omd-copyblock"><b>' + esc(c.copy.headline) + '</b><span>' + esc(c.copy.primary) + '</span><div><span class="cta">' + esc(c.copy.cta) + ' →</span></div></div></div>' +
      '<div class="omd-offer-slot">' + (off ? '<span class="attached">◆ ' + esc(off.title) + '</span>' : 'drag an offer here to build the campaign around it') + '</div>' +
      '<div class="omd-camp-actions">' +
      '<button class="omd-btn sm primary" data-a="camp" data-id="' + c.id + '" data-s="approved">✓ Validate</button>' +
      '<button class="omd-btn sm ghost danger" data-a="camp" data-id="' + c.id + '" data-s="rejected">✕ Reject</button></div></div>';
  }
  function fmtLabel(f) { return { static: 'Static', grid: 'Grid', carousel: 'Carousel', ugc_video: 'UGC video', motion: 'Motion', story_sequence: 'Story' }[f] || f; }

  function tabPrompts() {
    return '<div class="omd-stack"><div class="omd-row omd-spread"><div><h2 class="omd-section" style="margin:0">Premade basic prompts <span class="omd-mono" style="font-size:12px;color:var(--faint)">' + D.templates.length + '</span></h2>' +
      '<p class="omd-sub" style="margin-top:4px">Proven prompt templates with a generated example. Quick-generate a creative from any of them.</p></div></div>' +
      '<div class="omd-grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">' +
      D.templates.map(function (t) {
        return '<div class="omd-card"><div class="omd-shot-media">' + creativeArt(t.kind, { headline: D.store.name, price: '' }) + '</div>' +
          '<div class="omd-shot-body"><div class="omd-row omd-spread" style="gap:6px"><h4 style="margin:0;font-size:14px">' + esc(t.name) + '</h4><span class="omd-chip" style="font-size:9px">' + t.kind + '</span></div>' +
          '<p class="omd-shot-eval" title="' + esc(t.input) + '">Expected input: ' + esc(t.input) + '</p>' +
          '<div class="omd-row" style="gap:5px;margin-top:10px"><button class="omd-btn sm primary" data-a="quickgen" data-id="' + t.id + '">⚡ Quick generate</button></div></div></div>';
      }).join('') + '</div></div>';
  }

  function tabStudio() {
    var eligible = S.campaigns.filter(function (c) { return c.status === 'approved' || c.status === 'generating' || c.status === 'done'; });
    var pickOpts = '<option value="">pick a campaign</option>' + eligible.map(function (c) { return '<option value="' + c.id + '"' + (S.studioPick === c.id ? ' selected' : '') + '>' + esc(c.title) + '</option>'; }).join('');
    var genBtn = S.pending && S.pending.key === 'shots'
      ? '<div class="omd-progress"><span class="omd-pulse"></span>higgsfield is producing…</div>'
      : '<button class="omd-btn primary" data-a="gen-shots"' + (S.studioPick ? '' : ' disabled') + '>Generate 2 shots</button>';

    var byCamp = {};
    S.shots.forEach(function (s) { (byCamp[s.campaignId] = byCamp[s.campaignId] || []).push(s); });
    var groups = Object.keys(byCamp).map(function (cid) {
      var camp = S.campaigns.find(function (c) { return c.id === cid; }) || D.campaigns.find(function (c) { return c.id === cid; });
      var appr = byCamp[cid].filter(function (s) { return s.status === 'approved'; }).length;
      return '<div class="omd-panel" style="padding:16px"><div class="omd-row omd-spread" style="margin-bottom:10px"><h3 style="margin:0;font-size:15px">' + esc(camp ? camp.title : 'Campaign') + '</h3><span class="omd-chip lime">' + appr + ' final</span></div>' +
        '<div class="omd-shots">' + byCamp[cid].map(shotCard).join('') + '</div></div>';
    }).join('');

    return '<div class="omd-split"><div class="omd-stack">' +
      '<div class="omd-panel"><div class="omd-kicker">Production run</div>' +
      '<div class="omd-field"><label>Campaign</label><select class="omd-input" data-a="studio-pick">' + pickOpts + '</select></div>' +
      '<div class="omd-field"><label>Price tier</label><div class="omd-row" style="gap:6px"><button class="omd-btn sm ghost">Budget</button><button class="omd-btn sm primary">Standard</button><button class="omd-btn sm ghost">Premium</button></div></div>' +
      '<div class="omd-field" style="margin-bottom:0"><label>Quality</label><select class="omd-input"><option>Standard · 1k</option><option>High · 2k</option><option>Ultra · 4k</option></select></div>' +
      '<div class="omd-row omd-spread" style="margin-top:14px">' + genBtn + '</div>' +
      '<p class="omd-hint" style="margin-top:10px">Claude picks the Higgsfield model, writes each prompt from the visual direction, evaluates every result, and learns from your approvals.</p></div>' +
      '</div><div class="omd-stack">' + (groups || '<div class="omd-empty"><div class="big">Nothing produced yet</div>Pick a campaign and generate.</div>') + '</div></div>';
  }
  function shotCard(s) {
    return '<div class="omd-card omd-shot ' + (s.status === 'rejected' ? 'dim' : '') + '"><div class="omd-shot-media">' + shotArt(s) +
      '<span class="omd-shot-score">' + s.score + '/10</span></div>' +
      '<div class="omd-shot-body"><div class="omd-row omd-spread" style="gap:6px"><span class="omd-chip" style="font-size:9px">' + esc(s.model) + '</span>' +
      '<span class="omd-badge ' + (s.status === 'approved' ? 'approved' : s.status === 'rejected' ? 'rejected' : 'generating') + '">' + s.status + '</span></div>' +
      '<div class="omd-row" style="gap:5px;margin-top:8px">' +
      (s.status !== 'approved' ? '<button class="omd-icon-btn ok" title="Approve" data-a="shot" data-id="' + s.id + '" data-s="approved">✓</button>' : '') +
      (s.status !== 'rejected' ? '<button class="omd-icon-btn no" title="Reject" data-a="shot" data-id="' + s.id + '" data-s="rejected">✕</button>' : '') +
      '</div></div></div>';
  }

  function tabBoard() {
    var cols = [['proposed', 'Proposals', 'var(--muted)'], ['approved', 'To generate', 'var(--lime)'], ['generating', 'Generating', 'var(--amber)'], ['done', 'Done', 'var(--green)'], ['rejected', 'Rejected', 'var(--red)']];
    return '<div class="omd-stack"><p class="omd-sub">Drag proposals across the pipeline. Every move mirrors the real production board.</p>' +
      '<div class="omd-board">' + cols.map(function (col) {
        var items = S.campaigns.filter(function (c) { return c.status === col[0]; });
        return '<div class="omd-kcol" data-col="' + col[0] + '"><div class="omd-kcol-head"><span class="t"><span class="omd-dot" style="background:' + col[2] + '"></span> ' + col[1] + '</span><span class="n">' + items.length + '</span></div>' +
          '<div class="omd-kcol-body">' + (items.map(function (c) {
            return '<div class="omd-kcard" draggable="true" data-id="' + c.id + '"><h5>' + esc(c.title) + '</h5><p class="hook">“' + esc(c.hook) + '”</p>' +
              '<div class="omd-row" style="gap:6px"><span class="omd-chip" style="font-size:9px">' + fmtLabel(c.format) + '</span></div></div>';
          }).join('') || '<div style="color:var(--faint);font-size:12px;text-align:center;padding:20px 0">—</div>') + '</div></div>';
      }).join('') + '</div></div>';
  }

  // ---------------------------------------------------------------- ads views
  function analyticsFor(tf) {
    var a = D.analytics, s = a.series;
    var slice = tf === 'today' ? s.slice(-1) : tf === '7d' ? s.slice(-7) : s;
    var full = s.reduce(function (x, p) { return x + p[0]; }, 0);
    var sum = slice.reduce(function (x, p) { return x + p[0]; }, 0);
    var r = sum / full;
    var roas = slice.reduce(function (x, p) { return x + p[1]; }, 0) / slice.length;
    return {
      series: slice,
      totals: {
        spend: +(a.totals.spend * r).toFixed(2), roas: +roas.toFixed(1),
        purchases: Math.round(a.totals.purchases * r), reach: Math.round(a.totals.reach * r),
        impressions: Math.round(a.totals.impressions * r), clicks: Math.round(a.totals.clicks * r),
        ctr: a.totals.ctr, cpm: a.totals.cpm
      },
      campaigns: a.campaigns.map(function (c) { return Object.assign({}, c, { spend: +(c.spend * r).toFixed(2), reach: Math.round(c.reach * r), clicks: Math.round(c.clicks * r), purchases: Math.round(c.purchases * r) }); })
    };
  }
  function chart(series) {
    var W = 900, H = 150, PAD = 4, n = series.length;
    var maxS = Math.max.apply(null, series.map(function (p) { return p[0]; })), maxR = Math.max.apply(null, series.map(function (p) { return p[1]; }));
    var bw = (W - PAD * 2) / n;
    var bars = series.map(function (p, i) { var h = p[0] / maxS * (H - 24); return '<rect x="' + (PAD + i * bw + 1.5) + '" y="' + (H - h) + '" width="' + Math.max(2, bw - 3) + '" height="' + h + '" rx="2" fill="rgba(90,164,255,.55)"/>'; }).join('');
    var pts = series.map(function (p, i) { return (PAD + i * bw + bw / 2) + ',' + (H - p[1] / maxR * (H - 24)); }).join(' ');
    return '<div class="omd-chart"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' + bars + '<polyline points="' + pts + '" fill="none" stroke="#ffb84d" stroke-width="2" stroke-linejoin="round"/></svg>' +
      '<div class="omd-legend"><span><i style="background:rgba(90,164,255,.55)"></i>daily spend (' + D.analytics.currency + ')</span><span><i style="background:#ffb84d"></i>ROAS</span></div></div>';
  }
  function fmtNum(n) { return n >= 10000 ? (n / 1000).toFixed(1) + 'k' : n.toLocaleString(); }

  function adsAnalytics() {
    var tfs = [['today', 'Today'], ['7d', '7 days'], ['14d', '14 days']];
    var a = analyticsFor(S.timeframe), t = a.totals;
    return '<div class="omd-page wide omd-fade"><div class="omd-head" style="margin-bottom:18px"><div><div class="omd-kicker">Meta Ads</div><h1 class="omd-display">Analytics</h1></div>' +
      '<div class="omd-row" style="gap:6px">' + tfs.map(function (x) { return '<button class="omd-btn sm ' + (S.timeframe === x[0] ? 'primary' : 'ghost') + '" data-a="tf" data-v="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="omd-stack"><div class="omd-kpis">' +
      kp(money(t.spend.toLocaleString()), 'Spend') + kp(t.roas + '×', 'ROAS', t.roas >= 2 ? 'good' : 'bad') +
      kp(fmtNum(t.purchases), 'Purchases') + kp(fmtNum(t.reach), 'Reach') + kp(fmtNum(t.impressions), 'Impressions') +
      kp(fmtNum(t.clicks), 'Clicks') + kp(t.ctr + '%', 'CTR') + kp(money(t.cpm), 'CPM') + '</div>' +
      chart(a.series) +
      '<div class="omd-panel" style="padding:6px 14px 2px;overflow-x:auto"><table class="omd-fbtable"><thead><tr><th>Campaign</th><th>Budget/d</th><th>Spend</th><th>Reach</th><th>Clicks</th><th>CTR</th><th>CPC</th><th>Freq</th><th>Purch</th><th>ROAS</th></tr></thead><tbody>' +
      a.campaigns.slice().sort(function (x, y) { return y.spend - x.spend; }).map(function (c) {
        return '<tr><td title="' + esc(c.name) + '"><span class="omd-cstatus" style="background:' + (c.status === 'ACTIVE' ? 'var(--green)' : 'var(--faint)') + '"></span>' + esc(c.name) + '</td>' +
          '<td>' + c.dailyBudget + '</td><td>' + c.spend.toLocaleString() + '</td><td>' + fmtNum(c.reach) + '</td><td>' + fmtNum(c.clicks) + '</td><td>' + c.ctr + '%</td><td>' + c.cpc + '</td><td>' + c.frequency + '</td><td>' + c.purchases + '</td>' +
          '<td class="' + (c.roas >= 2 ? 'good' : c.roas < 1 ? 'bad' : '') + '">' + c.roas + '×</td></tr>';
      }).join('') + '</tbody></table></div></div></div>';
    function kp(v, k, cls) { return '<div class="omd-kpi"><div class="v ' + (cls || '') + '">' + v + '</div><div class="k">' + k + '</div></div>'; }
  }

  function adsBuilder() {
    var genBtn = S.pending && S.pending.key === 'plan'
      ? '<div class="omd-progress"><span class="omd-pulse"></span>claude is designing the structure…</div>'
      : '<button class="omd-btn primary" data-a="gen-plan">Generate campaign plan</button>';
    var approved = S.shots.filter(function (s) { return s.status === 'approved'; });
    var picks = approved.map(function (s) {
      var sel = S.builderPicks.indexOf(s.id) >= 0;
      return '<div class="omd-thumb ' + (sel ? 'selected' : '') + '" data-a="pick-shot" data-id="' + s.id + '">' + shotArt(s) + (sel ? '<span class="x">✓</span>' : '') + '</div>';
    }).join('') || '<p class="omd-hint">Approve creatives in the Studio first.</p>';

    var planHtml = S.plan ? planCard(S.plan) : '<div class="omd-empty"><div class="big">No campaign plans yet</div>Configure the left panel and generate. Plans appear here as launch-ready structures.</div>';

    return '<div class="omd-page wide omd-fade"><div class="omd-head" style="margin-bottom:18px"><div><div class="omd-kicker">Meta Ads</div><h1 class="omd-display">Campaign builder</h1>' +
      '<p class="omd-sub">Describe the campaign; Claude designs the full structure around your approved creatives, ready to push to Meta.</p></div></div>' +
      '<div class="omd-split" style="grid-template-columns:440px 1fr"><div class="omd-stack"><div class="omd-panel">' +
      '<div class="omd-row"><div class="omd-field" style="flex:1;min-width:150"><label>Store</label><select class="omd-input"><option>' + esc(D.store.name) + '</option></select></div>' +
      '<div class="omd-field" style="flex:1;min-width:170"><label>Facebook Page</label><select class="omd-input"><option>Auréa - Jewellery</option></select></div></div>' +
      '<div class="omd-field"><label>What should this campaign do?</label><textarea class="omd-input" rows="3" placeholder="e.g. push the everyday edit in the UK, lead with the trust angle"></textarea></div>' +
      '<div class="omd-field"><label>Campaign format</label>' + D.fbFormats.map(function (f) {
        return '<button class="omd-fmt ' + (S.builderFormat === f.id ? 'selected' : '') + '" data-a="fmt" data-v="' + f.id + '"><b>' + esc(f.label) + '</b><span>' + esc(f.structure) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="omd-field"><label>Targeting</label><select class="omd-input"><option>Full Advantage+ (Meta decides)</option><option>Claude decides per ad set</option><option>Constraints only</option></select></div>' +
      '<div class="omd-field" style="margin-bottom:0"><label>Daily budget</label><input class="omd-input" value="45"></div></div>' +
      '<div class="omd-panel"><div class="omd-field" style="margin-bottom:8"><label>Creatives in this campaign · ' + S.builderPicks.length + ' selected</label></div>' +
      '<div class="omd-strip">' + picks + '</div>' +
      '<div class="omd-row omd-spread" style="margin-top:14px">' + genBtn + '</div></div></div>' +
      '<div class="omd-stack">' + planHtml + '</div></div></div>';
  }
  function planCard(p) {
    return '<div class="omd-card omd-camp"><div class="omd-camp-top"><h3>' + esc(p.campaign.name) + '</h3>' +
      '<div class="omd-row" style="gap:6px;flex-wrap:nowrap"><span class="omd-badge fmt">CBO</span><span class="omd-badge ' + (S.plan.pushed ? 'done' : 'proposed') + '">' + (S.plan.pushed ? 'pushed' : 'draft') + '</span></div></div>' +
      '<div class="omd-camp-foot" style="margin-top:0;margin-bottom:10px"><span>' + p.campaign.objective + '</span><span>budget ' + money(p.campaign.budget) + '/day</span><span>bid: ' + p.campaign.bid + '</span></div>' +
      p.adsets.map(function (as) {
        var s = S.shots.find(function (x) { return x.id === as.ad.shotId; }) || D.shots.find(function (x) { return x.id === as.ad.shotId; });
        return '<div class="omd-adset"><h5>' + esc(as.name) + '</h5><div class="omd-camp-foot" style="margin-top:2px"><span>' + as.market + '</span><span>' + esc(as.audience) + '</span><span>' + as.age + '</span></div>' +
          '<div class="omd-ad">' + (s ? shotArt(s) : '') + '<div class="copy"><b>' + esc(as.ad.name) + ' · ' + as.ad.cta + '</b><span style="color:var(--text)">' + esc(as.ad.headline) + '</span> ' + esc(as.ad.primary) +
          '<div class="omd-mono" style="font-size:10.5px;color:var(--blue);margin-top:4px;word-break:break-all">' + esc(as.ad.link) + '</div></div></div></div>';
      }).join('') +
      '<div class="omd-camp-sec" style="margin-top:12px"><div class="lbl">Rationale</div><p>' + esc(p.rationale) + '</p></div>' +
      '<div class="omd-camp-sec"><div class="lbl">Learning phase</div><p>' + esc(p.learning) + '</p></div>' +
      '<div class="omd-camp-sec"><div class="lbl">Kill / scale rules</div><ul class="omd-report" style="font-size:13px;padding-left:18px">' + p.rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +
      (S.plan.pushed ? '<div class="omd-ok" style="margin-top:10px">✓ live in Meta (PAUSED) · 3 ads · nothing spends until you activate it</div>' : '') +
      '<div class="omd-camp-actions">' + (S.plan.pushed ? '' :
        (S.pending && S.pending.key === 'push' ? '<div class="omd-progress"><span class="omd-pulse"></span>creating campaign, ad sets, ads…</div>' : '<button class="omd-btn sm primary" data-a="push-plan">▲ Push to Meta (paused)</button>')) +
      '</div></div>';
  }

  function adsReports() {
    var runBtn = S.pending && S.pending.key === 'report'
      ? '<div class="omd-progress"><span class="omd-pulse"></span>Ledger is analyzing the account…</div>'
      : '<button class="omd-btn primary" data-a="run-report">Run analysis</button>';
    var out = S.report ? '<div class="omd-panel"><div class="omd-row omd-spread" style="margin-bottom:12px"><div class="omd-row" style="gap:8px"><strong>Last 14 days</strong><span class="omd-chip">just now</span></div></div>' +
      '<div class="omd-report">' + mdToHtml(S.report) + '</div></div>' :
      '<div class="omd-empty"><div class="big">No reports yet</div>Run the analyst on any timeframe.</div>';
    return '<div class="omd-page omd-fade"><div class="omd-head" style="margin-bottom:18px"><div><div class="omd-kicker">Meta Ads</div><h1 class="omd-display">Analyst reports</h1>' +
      '<p class="omd-sub">One click: Claude reads the account data and writes an evidence-first review of what works, what does not, and what to do next.</p></div></div>' +
      '<div class="omd-panel" style="margin-bottom:18px"><div class="omd-row"><div class="omd-field" style="flex:1;min-width:130;margin-bottom:0"><label>Timeframe</label><select class="omd-input"><option>Last 14 days</option><option>Last 7 days</option><option>Last 30 days</option></select></div>' +
      '<div class="omd-field" style="flex:2;min-width:200;margin-bottom:0"><label>Analyst</label><select class="omd-input"><option>Claude Code (local) — Ledger analyst skill</option></select></div>' +
      '<div class="omd-field" style="margin-bottom:0;align-self:flex-end">' + runBtn + '</div></div></div>' + out + '</div>';
  }

  function adsConnection() {
    return '<div class="omd-page omd-fade" style="max-width:760px"><div class="omd-head" style="margin-bottom:18px"><div><div class="omd-kicker">Meta Ads</div><h1 class="omd-display">Connection</h1>' +
      '<p class="omd-sub">A System User token from Business Manager gives Claude durable access to campaigns and insights. No login flows, no expiring sessions.</p></div></div>' +
      '<div class="omd-stack"><div class="omd-panel"><div class="omd-row" style="gap:10px"><span class="omd-dot on" style="width:9px;height:9px"></span><strong>Connected — Auréa Ad Account</strong><span class="omd-chip">GBP</span></div></div>' +
      '<div class="omd-panel"><h2 class="omd-section">Identity</h2><div class="omd-row"><div class="omd-field" style="flex:1;min-width:200"><label>Facebook Page</label><select class="omd-input"><option>Auréa - Jewellery</option></select></div>' +
      '<div class="omd-field" style="flex:1;min-width:200"><label>Pixel</label><select class="omd-input"><option>Auréa Web</option></select></div></div></div>' +
      '<div class="omd-panel"><h2 class="omd-section">Setup path</h2><div class="omd-stack" style="gap:8px">' +
      ['Create a Meta app of type Business', 'Add the Marketing API product', 'Create a System User and assign your ad account plus page', 'Generate a token with ads_read, ads_management, read_insights', 'Paste the token and ad account ID'].map(function (s, i) {
        return '<div class="omd-row" style="gap:10px"><span class="omd-mono" style="color:var(--lime)">' + (i + 1) + '</span><span style="font-size:13px">' + esc(s) + '</span></div>';
      }).join('') + '</div></div></div></div>';
  }

  // ---------------------------------------------------------------- render + events
  function content() {
    if (S.mode === 'ads') return { analytics: adsAnalytics, builder: adsBuilder, reports: adsReports, connection: adsConnection }[S.adsTab]();
    return S.view === 'dashboard' ? dashboard() : storeView();
  }
  function render() {
    root.innerHTML = '<div class="omd-shell ' + (S.mode === 'ads' ? 'ads' : '') + '" style="position:relative">' +
      '<div class="omd-ribbon">Interactive demo</div>' + sidebar() + '<main class="omd-main">' + content() + '</main></div>';
    if (S.mode === 'creative' && S.view === 'store' && S.tab === 'board') wireBoard();
  }

  function wireBoard() {
    var dragId = null;
    root.querySelectorAll('.omd-kcard').forEach(function (card) {
      card.addEventListener('dragstart', function () { dragId = card.getAttribute('data-id'); card.classList.add('dragging'); });
      card.addEventListener('dragend', function () { card.classList.remove('dragging'); });
    });
    root.querySelectorAll('.omd-kcol').forEach(function (col) {
      col.addEventListener('dragover', function (e) { e.preventDefault(); col.classList.add('over'); });
      col.addEventListener('dragleave', function () { col.classList.remove('over'); });
      col.addEventListener('drop', function (e) {
        e.preventDefault(); col.classList.remove('over');
        var status = col.getAttribute('data-col');
        var c = S.campaigns.find(function (x) { return x.id === dragId; });
        if (c && c.status !== status) { c.status = status; render(); toast('Moved to ' + status); }
      });
    });
  }

  function onClick(e) {
    var btn = e.target.closest('[data-a]');
    if (!btn) return;
    var a = btn.getAttribute('data-a'), v = btn.getAttribute('data-v'), id = btn.getAttribute('data-id');

    if (a === 'mode') { S.mode = v; render(); return; }
    if (a === 'tab') { S.tab = v; render(); return; }
    if (a === 'adstab') { S.adsTab = v; render(); return; }
    if (a === 'dashboard') { S.mode = 'creative'; S.view = 'dashboard'; render(); return; }
    if (a === 'open-store') { S.mode = 'creative'; S.view = 'store'; S.tab = 'overview'; render(); return; }
    if (a === 'toast') { toast(v); return; }
    if (a === 'tf') { S.timeframe = v; render(); return; }
    if (a === 'fmt') { S.builderFormat = v; render(); return; }

    if (a === 'offer') { var o = S.offers.find(function (x) { return x.id === id; }); if (o) { o.status = btn.getAttribute('data-s'); render(); toast('Offer ' + o.status); } return; }
    if (a === 'camp') { var c = S.campaigns.find(function (x) { return x.id === id; }); if (c) { c.status = btn.getAttribute('data-s'); render(); toast(c.status === 'approved' ? 'Approved, moved to To generate' : 'Moved to rejected'); } return; }
    if (a === 'shot') { var sh = S.shots.find(function (x) { return x.id === id; }); if (sh) { sh.status = btn.getAttribute('data-s'); render(); toast('Shot ' + sh.status); } return; }
    if (a === 'studio-pick' || a === 'pick-shot') return; // handled in change/click below

    if (a === 'gen-offers') {
      runSim('offers', 1300, function () {
        var pool = D.offerPool, batch = pool.slice(S.offerIdx, S.offerIdx + 2);
        if (!batch.length) { S.offerIdx = 0; batch = pool.slice(0, 2); }
        batch.forEach(function (b, i) { S.offers.unshift(Object.assign({ id: 'og' + Date.now() + i, status: 'idea' }, b)); });
        S.offerIdx += 2;
      }, batchMsg(2, 'offers'));
      return;
    }
    if (a === 'gen-camps') {
      runSim('camps', 1600, function () {
        var b = D.campaignPool[S.campIdx % D.campaignPool.length]; S.campIdx++;
        S.campaigns.unshift(Object.assign({ id: 'cg' + Date.now(), status: 'proposed', offerId: null }, JSON.parse(JSON.stringify(b))));
      }, '1 new concept from claude-local');
      return;
    }
    if (a === 'gen-shots') {
      if (!S.studioPick) return;
      runSim('shots', 1700, function () {
        var camp = S.campaigns.find(function (x) { return x.id === S.studioPick; }) || D.campaigns.find(function (x) { return x.id === S.studioPick; });
        if (camp && camp.status === 'approved') camp.status = 'generating';
        for (var i = 0; i < 2; i++) S.shots.unshift({ id: 'sg' + Date.now() + i, campaignId: S.studioPick, status: 'review', score: 7 + i, model: i ? 'nano_banana_2' : 'marketing_studio_image', kind: (camp && camp.kind) || 'default', headline: camp ? camp.copy.headline : D.store.name, price: money(D.products[0].price) });
      }, '2 shots ready for review');
      return;
    }
    if (a === 'quickgen') {
      var tpl = D.templates.find(function (t) { return t.id === id; });
      runSim('shots', 1500, function () {
        var cid = S.campaigns[0] ? S.campaigns[0].id : 'c1';
        S.shots.unshift({ id: 'qg' + Date.now(), campaignId: cid, status: 'review', score: 8, model: 'nano_banana_pro', kind: tpl ? tpl.kind : 'default', headline: D.store.name, price: money(D.products[0].price) });
        S.tab = 'studio';
      }, 'Quick creative generated, see the Studio tab');
      return;
    }
    if (a === 'gen-plan') {
      runSim('plan', 1800, function () { S.plan = JSON.parse(JSON.stringify(D.plan)); }, 'Campaign plan ready');
      return;
    }
    if (a === 'push-plan') {
      runSim('push', 2000, function () { if (S.plan) S.plan.pushed = true; }, 'Pushed to Meta, everything PAUSED for your review');
      return;
    }
    if (a === 'run-report') {
      runSim('report', 1900, function () { S.report = D.report; }, 'Report ready');
      return;
    }
  }
  function batchMsg(n, w) { return n + ' new ' + w + ' from claude-local'; }

  function onChange(e) {
    var sel = e.target.closest('[data-a="studio-pick"]');
    if (sel) { S.studioPick = sel.value; render(); return; }
  }
  function onPickShot(e) {
    var t = e.target.closest('[data-a="pick-shot"]');
    if (!t) return;
    var idv = t.getAttribute('data-id');
    var i = S.builderPicks.indexOf(idv);
    if (i >= 0) S.builderPicks.splice(i, 1); else S.builderPicks.push(idv);
    render();
  }

  // ---------------------------------------------------------------- mount
  function mount(el) {
    root = typeof el === 'string' ? document.querySelector(el) : el;
    if (!root) return;
    if (!root.id) root.id = 'orchmarketing-demo';
    root.addEventListener('click', function (e) { onClick(e); onPickShot(e); });
    root.addEventListener('change', onChange);
    render();
  }

  window.OrchMarketingDemo = { mount: mount, reset: function () { S.offers = clone(D.offers); S.campaigns = clone(D.campaigns); S.shots = clone(D.shots); S.plan = null; S.report = null; render(); } };

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('orchmarketing-demo');
    if (el && !el.getAttribute('data-manual')) mount(el);
  });
})();
