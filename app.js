/* =====================================================================
   Solar EV Charging Station — rendering + routing.
   All content comes from window.SITE (data.js). Classic script, no modules.
   ===================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var fmt = window.fmtINR;

  /* -------------------------------------------------------------------
     EXPLODE CONFIG — the only place explode offsets live.
     Units are SVG user units (the viewBox is 1200 × 700), as [dx, dy].
     A plain [dx, dy] moves the whole part. For parts built from several
     pieces, give an array of [dx, dy], one per piece in the order the
     pieces appear in index.html:
       7  = plinth, extinguisher, bollards
       10 = lightning arrester, earth pit
       12 = highway sign, CCTV pole, payment kiosk
       13 = base slab, transformer
     ------------------------------------------------------------------- */
  var EXPLODE = {
    1:  [0, -120],
    2:  [-30, 10],
    3:  [30, -135],
    4:  [-30, -50],
    5:  [10, -90],
    6:  [20, -60],
    7:  [[20, -8], [30, -10], [50, 0]],
    8:  [40, -80],
    9:  [10, -80],
    10: [[30, -80], [0, 22]],
    11: [-30, -30],
    12: [[-20, -40], [10, -30], [-10, -60]],
    13: [[0, 26], [30, -20]]
  };

  /* ---------- helpers ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }
  function partById(n) { return S.parts.filter(function (p) { return p.id === n; })[0]; }
  function groupById(id) { return S.groups.filter(function (g) { return g.id === id; })[0]; }
  function partBySlug(sl) { return S.parts.filter(function (x) { return x.slug === sl; })[0]; }
  function pname(p) { return p.shortName || p.name; }
  function partHref(p) { return "#/parts/" + p.slug; }
  function num(n) { return Number(n).toLocaleString("en-IN"); }
  function priceBadge() { return '<div class="pill price-badge"><i></i>' + esc(S.pricesAsOf) + "</div>"; }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function groupIndex(id) { return S.groups.map(function (g) { return g.id; }).indexOf(id); }
  function stageLabel(g) { return "Stage " + pad2(groupIndex(g.id) + 1) + ": " + g.name; }
  function stageChip(g, label) { return '<span class="chip stage-' + g.id + '"><i></i>' + esc(label || g.name) + "</span>"; }
  function groupSum(g) { return g.parts.reduce(function (t, n) { return t + partById(n).initialCost; }, 0); }
  function plural(n, w) { return n + " " + w + (n === 1 ? "" : "s"); }
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function scrollToEl(el) { if (el) el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" }); }

  var cleanup = null; // set by a page that needs teardown (resize listeners, etc.)

  /* ---------- nav ---------- */
  function buildPartsMenu() {
    var html = "";
    S.groups.forEach(function (g) {
      html += '<div class="dd-group stage-' + g.id + '" style="--stage:var(--c-' + g.id + ')"><i></i>' + esc(g.name) + "</div>";
      g.parts.forEach(function (n) {
        var p = partById(n);
        html += '<a class="dd-item" href="' + partHref(p) + '" data-slug="' + p.slug + '"><span class="n">' + p.id + "</span><span>" + esc(pname(p)) + "</span></a>";
      });
    });
    $("#parts-menu").innerHTML = html;
  }

  function setupNav() {
    buildPartsMenu();
    $("#parts-count").textContent = S.parts.length;
    $("#hdr-price span").textContent = S.pricesAsOf;
    var btn = $("#parts-btn"), menu = $("#parts-menu");
    function closeParts() { btn.setAttribute("aria-expanded", "false"); menu.hidden = true; }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    });
    document.addEventListener("click", function (e) {
      if (!$("#parts-dd").contains(e.target)) closeParts();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeParts(); }
    });
    window.addEventListener("hashchange", closeParts);
  }

  function markActiveNav(r) {
    var key = r.name === "part" || r.scroll === "parts" ? "parts" : r.name;
    $$(".nav-link, .tabbar a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-route") === key); });
    $$(".dd-item").forEach(function (a) { a.classList.toggle("active", r.name === "part" && a.getAttribute("data-slug") === r.slug); });
  }

  /* ---------- routing ---------- */
  function parseRoute() {
    var h = location.hash.replace(/^#/, "") || "/";
    var m;
    if (h === "/" || h === "") return { name: "home" };
    if (h === "/parts") return { name: "home", scroll: "parts" };
    if ((m = h.match(/^\/parts\/([^/]+)\/?$/))) return { name: "part", slug: decodeURIComponent(m[1]) };
    if (h === "/cost-summary") return { name: "cost-summary" };
    if (h === "/system") return { name: "system" };
    if (h === "/glossary") return { name: "glossary" };
    return { name: "404" };
  }

  function render() {
    if (cleanup) { cleanup(); cleanup = null; }
    var r = parseRoute();
    var main = $("#main");
    var title = S.title;
    var html;
    if (r.name === "home") {
      html = homePage();
    } else if (r.name === "part") {
      var p = S.parts.filter(function (x) { return x.slug === r.slug; })[0];
      if (p) { html = partPage(p); title = p.id + " · " + pname(p); } else { html = notFound(); r.name = "404"; }
    } else if (r.name === "cost-summary") {
      html = costPage(); title = "Cost Summary";
    } else if (r.name === "system") {
      html = systemPage(); title = "System Overview";
    } else if (r.name === "glossary") {
      html = glossaryPage(); title = "Glossary";
    } else {
      html = notFound(); title = "Not found";
    }
    main.innerHTML = '<div class="container page">' + html + "</div>";
    document.title = title + (r.name === "home" ? "" : " — Solar EV Charging Station");
    markActiveNav(r);
    if (r.name === "home") initHome();
    if (r.name === "part") initPart(partBySlug(r.slug));
    if (r.name === "cost-summary") initChart();
    if (r.name === "system") initFlow();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    if (r.scroll === "parts") scrollToEl($("#parts-list"));
  }

  function notFound() {
    return "<h1>Page not found</h1><p>That page does not exist. <a href=\"#/\">Back to Home</a>.</p>";
  }

  /* =====================================================================
     HOME
     ===================================================================== */
  function homePage() {
    var st = S.station;
    // TODO: data.js has no one-line subtitle. This is assembled from headlineStats; replace if you have wording.
    var subtitle = st.headlineStats.slice(0, 3).map(function (s) { return s.value + " " + s.label; }).join(" · ");
    var html = priceBadge() + '<section class="hero"><div><h1>' + esc(S.title) + '</h1><p class="lede">' + esc(subtitle) + "</p></div>" +
      '<div class="hero-actions"><button class="btn" id="explode-btn" aria-pressed="false">Explode</button></div></section>';

    html += '<div class="frame"><div class="frame-strip top"><span>Side elevation · not to scale</span></div>' +
      '<div class="stage-wrap" id="stage-wrap"><div class="canvas" id="svg-host"></div><div class="tip" id="tip" role="tooltip" hidden></div></div>' +
      '<div class="frame-strip bottom"><span>Hover or tap a numbered part</span></div></div>';
    html += '<div class="sel" id="sel" aria-live="polite"></div>';

    html += '<div class="filters" id="filters"><span class="eyebrow">Stages</span>' +
      '<button class="chip stage-all" data-stage="all" aria-pressed="true"><i></i>All <span class="ct">(' + S.parts.length + ")</span></button>" +
      S.groups.map(function (g) {
        return '<button class="chip stage-' + g.id + '" data-stage="' + g.id + '" aria-pressed="false"><i></i>' + esc(g.name) + ' <span class="ct">(' + g.parts.length + ")</span></button>";
      }).join("") + "</div>";

    // supporting line per card: key specs 0, 1, 2 and the 30-year horizon (index 4)
    var supp = [0, 1, 2, 4];
    html += '<div class="metrics home-m section">' + st.headlineStats.map(function (s, i) {
      var sp = s.value.split(" ");
      var g = S.groups[i] && i < 3 ? S.groups[i] : null;
      return '<div class="metric' + (g ? " stage-" + g.id : "") + '"><div class="mh"><span>' + esc(s.label) + "</span>" +
        (g ? stageChip(g) : "") + '</div><div class="mv">' + esc(sp[0]) + (sp[1] ? '<span class="u">' + esc(sp.slice(1).join(" ")) + "</span>" : "") + "</div>" +
        (st.keySpecs[supp[i]] ? '<div class="mf"><div>' + esc(st.keySpecs[supp[i]]) + "</div></div>" : "") + "</div>";
    }).join("") + "</div>";

    html += '<section class="section overview"><div class="card"><h3>Station overview</h3><p style="margin:0">' + esc(st.overview) + "</p></div>" +
      '<div class="card"><h3>Key specs</h3><ul>' + st.keySpecs.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul></div></section>";

    html += '<section class="section" id="parts-list"><div class="parts-head"><h2>The ' + S.parts.length + ' parts</h2>' +
      '<span class="sum">Initial cost total <b>' + fmt(S.costSummary.costByPartsTotals.initial) + "</b></span></div>";
    S.groups.forEach(function (g) {
      html += '<section id="stage-' + g.id + '"><div class="group-head stage-' + g.id + '"><i></i><h3>' + esc(stageLabel(g)) + '</h3><span class="gs">(' +
        plural(g.parts.length, "component") + " · " + fmt(groupSum(g)) + ')</span></div><div class="cards">';
      g.parts.forEach(function (n) {
        var p = partById(n);
        html += '<a class="pcard stage-' + g.id + '" href="' + partHref(p) + '"><div class="top"><span class="n">' + p.id + '</span></div><div class="name">' + esc(pname(p)) + "</div>" +
          '<p class="tt">' + esc(p.tooltip) + '</p><div class="cost"><small>Initial cost</small><span>' + fmt(p.initialCost) + "</span></div></a>";
      });
      html += "</div></section>";
    });
    html += '</section><section class="section"><div class="card note-card"><p>All prices are estimates as of Nov 2026</p><div class="note-actions">' +
      '<a class="btn secondary" href="#/glossary">Glossary</a><a class="btn" href="#/cost-summary">Cost Summary →</a></div></div></section>';
    return html;
  }

  function initHome() {
    var host = $("#svg-host");
    host.appendChild($("#station-svg").content.cloneNode(true));
    var svg = $("svg.station", host);
    var wrap = $("#stage-wrap");
    var tip = $("#tip");
    var btn = $("#explode-btn");
    var exploded = false;
    var lastPointer = "mouse";
    var activePart = null;

    // wire parts to data
    $$(".part", svg).forEach(function (g) {
      var n = Number(g.getAttribute("data-part"));
      var p = partById(n);
      if (!p) return;
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "link");
      g.setAttribute("aria-label", n + ". " + pname(p) + ". " + p.tooltip);
    });

    /* explode / assemble */
    function applyExplode() {
      $$(".part", svg).forEach(function (g) {
        var n = Number(g.getAttribute("data-part"));
        var cfg = EXPLODE[n];
        var pieces = $$(":scope > .piece", g);
        pieces.forEach(function (piece, i) {
          var off = [0, 0];
          if (cfg) off = (typeof cfg[0] === "number") ? cfg : (cfg[i] || cfg[0]);
          piece.style.transform = exploded ? "translate(" + off[0] + "px," + off[1] + "px)" : "";
        });
      });
      btn.textContent = exploded ? "Assemble" : "Explode";
      btn.setAttribute("aria-pressed", String(exploded));
    }
    btn.addEventListener("click", function () { exploded = !exploded; hideTip(); applyExplode(); });

    /* tooltip (mouse / keyboard) and selection card (touch) */
    var sel = $("#sel");
    function partOf(el) { return el.closest ? el.closest(".part") : null; }
    function partFor(g) { return partById(Number(g.getAttribute("data-part"))); }
    function showTip(g, point) {
      var p = partFor(g), grp = groupById(p.group);
      if (activePart && activePart !== g) activePart.classList.remove("is-active");
      activePart = g;
      g.classList.add("is-active");
      tip.className = "tip stage-" + grp.id;
      tip.innerHTML = '<div class="th"><span class="num-chip">' + p.id + "</span>" + esc(pname(p)) + "</div><p>" + esc(p.tooltip) + "</p>" +
        '<div class="tf"><span><small class="small">Initial cost</small><br><span class="mono">' + fmt(p.initialCost) + '</span></span><span class="go">View details →</span></div>';
      tip.hidden = false;
      var wr = wrap.getBoundingClientRect();
      var x, y;
      if (point) { x = point.x - wr.left; y = point.y - wr.top; }
      else { var br = g.getBoundingClientRect(); x = br.left + br.width / 2 - wr.left; y = br.bottom - wr.top; }
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var left = Math.max(4, Math.min(x - tw / 2, wr.width - tw - 4));
      var top = y + 18;
      if (top + th > wr.height) top = Math.max(4, y - th - 14);
      tip.style.left = left + "px";
      tip.style.top = top + "px";
    }
    function showSel(g) {
      var p = partFor(g), grp = groupById(p.group);
      if (activePart && activePart !== g) activePart.classList.remove("is-active");
      activePart = g;
      g.classList.add("is-active");
      sel.innerHTML = '<div class="card stage-' + grp.id + '"><div class="sh"><span class="num-chip">' + p.id + "</span><span>" + esc(pname(p)) + "</span></div>" +
        "<div>" + stageChip(grp) + "</div><p>" + esc(p.tooltip) + '</p><div class="sf"><div><span class="l">Initial cost</span><div class="mono">' + fmt(p.initialCost) +
        '</div></div><a class="btn" href="' + partHref(p) + '">View details →</a></div></div>';
      sel.classList.add("show");
    }
    function hideTip() {
      tip.hidden = true;
      sel.classList.remove("show");
      if (activePart) { activePart.classList.remove("is-active"); activePart = null; }
    }
    function go(g) { var p = partFor(g); if (p) location.hash = "#/parts/" + p.slug; }

    svg.addEventListener("pointerdown", function (e) { lastPointer = e.pointerType || "mouse"; });
    svg.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      var g = partOf(e.target);
      if (g) showTip(g, { x: e.clientX, y: e.clientY });
    });
    svg.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var g = partOf(e.target);
      if (g) showTip(g, { x: e.clientX, y: e.clientY }); else hideTip();
    });
    svg.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hideTip(); });
    svg.addEventListener("click", function (e) {
      var g = partOf(e.target);
      if (!g) return;
      if (lastPointer === "mouse" || e.detail === 0) { go(g); return; }
      showSel(g); // touch / pen: first tap shows a card with a "View details" link
    });
    svg.addEventListener("keydown", function (e) {
      var g = partOf(e.target);
      if (g && g === e.target && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); go(g); }
    });
    svg.addEventListener("focusin", function (e) {
      var g = partOf(e.target);
      if (g && lastPointer === "mouse") showTip(g, null);
    });
    svg.addEventListener("focusout", function () { tip.hidden = true; });
    function outside(e) {
      if (!sel.classList.contains("show")) return;
      if (!sel.contains(e.target) && !partOf(e.target)) hideTip();
    }
    document.addEventListener("pointerdown", outside);
    function onEsc(e) { if (e.key === "Escape") hideTip(); }
    document.addEventListener("keydown", onEsc);

    /* stage filter: highlight that stage's parts and jump to its group */
    var filters = $("#filters");
    var current = "all";
    function setFilter(id) {
      current = id;
      $$(".chip", filters).forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-stage") === id)); });
      var grp = id === "all" ? null : groupById(id);
      svg.classList.toggle("filtering", !!grp);
      $$(".part", svg).forEach(function (g) {
        g.classList.toggle("on", !!grp && grp.parts.indexOf(Number(g.getAttribute("data-part"))) !== -1);
      });
    }
    filters.addEventListener("click", function (e) {
      var c = e.target.closest ? e.target.closest(".chip") : null;
      if (!c) return;
      var id = c.getAttribute("data-stage");
      if (id === current && id !== "all") id = "all";
      setFilter(id);
      if (id !== "all") scrollToEl($("#stage-" + id));
    });

    cleanup = function () {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", onEsc);
    };
  }

  /* =====================================================================
     PART PAGE
     ===================================================================== */
  function drow(label, valueHtml) {
    return "<tr><th scope=\"row\">" + esc(label) + "</th><td>" + valueHtml + "</td></tr>";
  }
  function amberTag(t) { return '<div><span class="tag-amber">' + esc(t) + "</span></div>"; }
  function mval(n) { return '<span class="mono-v">' + fmt(n) + "</span>"; }
  function metric(label, valueHtml, foot, cls) {
    return '<div class="metric' + (cls ? " " + cls : "") + '"><div class="mh"><span>' + esc(label) + '</span></div>' + valueHtml +
      (foot ? '<div class="mf"><div>' + foot + "</div></div>" : "") + "</div>";
  }
  var NOTE_RE = /note|risk/i; // extra rows shown as a callout instead of in the table

  function timelineCard(p) {
    var N = S.horizonYears, ys = p.replacementYears, n = ys.length;
    var pts = [0].concat(ys, [N]);
    var total = p.initialCost + p.totalReplacementCost;
    var html = '<section class="panel timeline-card stage-' + p.group + '"><div class="tl-head"><div><h2>' + N + '-year replacement timeline</h2></div>' +
      '<div class="tl-total">30-year equipment cost<b>' + fmt(total) + "</b></div></div>";
    html += '<div class="tl2" role="img" aria-label="' + (n ? "Replacement in year " + ys.join(", ") + " of " + N : "No replacement within " + N + " years") + '"><div class="tl2-track">';
    for (var i = 0; i < pts.length - 1; i++) {
      html += '<div class="tl2-seg" style="left:' + (pts[i] / N * 100) + "%;width:" + ((pts[i + 1] - pts[i]) / N * 100) + "%;opacity:" + [0.35, 0.6, 0.8, 1][Math.min(i, 3)] + '"></div>';
    }
    html += "</div>";
    pts.forEach(function (y, i) {
      var isRe = i > 0 && i < pts.length - 1;
      html += '<div class="tl2-pt' + (isRe ? " re" : "") + '" style="left:' + (y / N * 100) + '%"><i></i><b>Year ' + y + "</b></div>";
    });
    html += "</div>";

    html += '<div class="cycles">';
    if (!n) {
      html += '<div class="cycle"><div class="eyebrow">Year 0–' + N + "</div><h3>Lasts the full " + N + ' years</h3><p class="small" style="margin:0">No replacement within ' + N + ' years</p>' +
        '<div class="cc"><span>Initial cost</span><span class="mono">' + fmt(p.initialCost) + "</span></div></div>";
    } else {
      html += '<div class="cycle"><div class="eyebrow">Year 0</div><h3>Initial build</h3><div class="cc"><span>Initial cost</span><span class="mono">' + fmt(p.initialCost) + "</span></div></div>";
      ys.forEach(function (y, i) {
        html += '<div class="cycle"><div class="eyebrow">Year ' + y + "</div><h3>Replacement " + (i + 1) + '</h3><div class="cc"><span>Cost each</span><span class="mono">' +
          (p.costEach == null ? "—" : fmt(p.costEach)) + "</span></div></div>";
      });
    }
    html += "</div>";
    if (n) {
      html += '<div class="calc">Initial <b>' + fmt(p.initialCost) + "</b> + " + plural(n, "replacement") + " <b>" + fmt(p.totalReplacementCost) + "</b> = <b>" + fmt(total) + "</b></div>";
    }
    return html + "</section>";
  }

  function partPage(p) {
    var g = groupById(p.group);
    var idx = S.parts.indexOf(p);
    var prev = S.parts[idx - 1], next = S.parts[idx + 1];
    var n = p.replacementYears.length;

    var html = priceBadge() + '<div class="stage-' + p.group + '">';
    html += '<div class="crumbs"><span><a href="#/">Home</a> / <a href="#/parts">Parts</a> / <span class="cur">' + p.id + " · " + esc(pname(p)) + "</span></span>" + stageChip(g) + "</div>";
    html += '<section class="card part-head"><div class="tag-row"><span class="tag-black">Part ' + pad2(p.id) + " / " + S.parts.length + "</span>" + stageChip(g, stageLabel(g)) + "</div>" +
      "<h1>" + p.id + " · " + esc(p.name) + '</h1><p class="sub">' + esc(p.tooltip) + '</p><p class="explain">' + esc(p.explanation) + "</p></section>";

    html += '<div class="metrics">' +
      metric("Initial cost", '<div class="mv">' + fmt(p.initialCost) + "</div>", p.initialCostRange ? "Range: " + esc(p.initialCostRange) : "Year 0") +
      metric("Lifespan", '<div class="mv txt">' + esc(p.lifespan) + "</div>", "") +
      metric("Replacements", '<div class="mv">' + n + "</div>", esc(p.replacements) + (n ? "<br>Year " + p.replacementYears.join(", ") : "")) +
      metric("30-year equipment cost", '<div class="mv">' + fmt(p.initialCost + p.totalReplacementCost) + "</div>", "1 initial + " + plural(n, "replacement")) +
      "</div>";

    var rows = "";
    rows += drow("Specs", esc(p.specs));
    rows += drow("Source company", esc(p.source));
    var ic = mval(p.initialCost);
    if (p.initialCostRange) ic += '<div class="sub">Range: ' + esc(p.initialCostRange) + "</div>";
    if (p.initialCostBreakdown) {
      ic += '<ul class="breakdown">' + p.initialCostBreakdown.map(function (b) {
        return "<li>" + esc(b.item) + "<span>" + fmt(b.cost) + "</span></li>";
      }).join("") + "</ul>";
    }
    rows += drow("Initial cost", ic);
    rows += drow("Lifespan", esc(p.lifespan));
    rows += drow("Replacements", esc(p.replacements));
    // costEach is null for parts with no replacement (parts 1, 2)
    var ce = p.costEach == null ? "—" : mval(p.costEach);
    if (p.costEachNote) ce += amberTag(p.costEachNote);
    rows += drow("Cost each", ce);
    var tr = mval(p.totalReplacementCost);
    if (p.totalReplacementNote) tr += amberTag(p.totalReplacementNote);
    rows += drow("Total replacement cost", tr);
    var callouts = "";
    (p.extra || []).forEach(function (x) {
      var list = Array.isArray(x.value);
      if (NOTE_RE.test(x.label)) {
        callouts += '<div class="callout"><div class="eyebrow">' + esc(x.label) + "</div>" +
          (list ? "<ul>" + x.value.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : "<p>" + esc(x.value) + "</p>") + "</div>";
        return;
      }
      rows += drow(x.label, list ? "<ul>" + x.value.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : esc(x.value));
    });

    html += '<div class="part-grid"><div class="panel"><div class="panel-head">Details</div><table class="detail"><tbody>' + rows + "</tbody></table></div>" +
      '<div class="side"><div class="panel"><div class="panel-head">Location on station</div><div class="mini-wrap" id="mini-host"></div></div>' + callouts + "</div></div>";

    html += timelineCard(p);

    html += '<nav class="pn" aria-label="Previous and next part">';
    function pcard(q, cls, dir) {
      var qg = groupById(q.group);
      return '<a class="pc ' + cls + ' stage-' + q.group + '" href="' + partHref(q) + '"><div class="pm">' + (dir < 0 ? "← " : "") + "<i></i>Part " + pad2(q.id) + " · " + esc(qg.name) + (dir > 0 ? " →" : "") +
        '</div><div class="nm">' + esc(pname(q)) + '</div><div class="pcst">' + fmt(q.initialCost) + " initial cost</div></a>";
    }
    html += prev ? pcard(prev, "prev", -1) : '<div class="spacer"></div>';
    html += '<div class="mid"><a class="btn" href="#/">Back to station</a></div>';
    html += next ? pcard(next, "next", 1) : '<div class="spacer"></div>';
    html += "</nav></div>";
    return html;
  }

  /* small copy of the station drawing, cropped around this part */
  function initPart(p) {
    var host = $("#mini-host");
    if (!host || !p) return;
    host.appendChild($("#station-svg").content.cloneNode(true));
    var svg = $("svg.station", host);
    svg.classList.add("mini");
    svg.setAttribute("aria-hidden", "true");
    svg.removeAttribute("role");
    var g = $('.part[data-part="' + p.id + '"]', svg);
    if (!g) return;
    g.classList.add("on");
    var b = g.getBBox();
    var W = Math.max(b.width + 240, 480), H = W / 1.55;
    if (b.height + 140 > H) { H = b.height + 140; W = H * 1.55; }
    W = Math.min(W, 1230); H = Math.min(H, 720);
    var x = Math.max(-10, Math.min(b.x + b.width / 2 - W / 2, 1220 - W));
    var y = Math.max(-10, Math.min(b.y + b.height / 2 - H / 2, 710 - H));
    svg.setAttribute("viewBox", [x, y, W, H].join(" "));
  }

  /* =====================================================================
     COST SUMMARY
     ===================================================================== */
  function costPage() {
    var cs = S.costSummary, tp = cs.totalPrice, gen = cs.generation;
    var html = priceBadge() + '<div class="page-head"><h1>Cost Summary</h1></div>';

    // 1. Total price
    var segCls = ["var(--seg-1)", "var(--seg-2)", "var(--seg-3)", "var(--seg-4)"];
    html += '<section class="cs-section"><h2>Total Price</h2><div class="metrics">' + tp.rows.map(function (r, i) {
      return '<div class="metric" style="border-top:3px solid ' + segCls[i] + '"><div class="mh"><span>' + esc(r.item) + '</span></div><div class="mv">' + fmt(r.cost) +
        '</div><div class="mf"><div>' + esc(r.share) + " of " + esc(tp.totalLabel.replace(/^about\s+/i, "")) + "</div></div></div>";
    }).join("") + "</div>";
    html += '<div class="stack" role="img" aria-label="Share of total price">' + tp.rows.map(function (r, i) {
      var w = parseFloat(r.share);
      return '<span style="width:' + w + "%;background:" + segCls[i] + '" title="' + esc(r.item) + ": " + esc(r.share) + '">' + (w >= 8 ? esc(r.share) : "") + "</span>";
    }).join("") + "</div>";
    html += '<div class="table-wrap" style="margin-top:16px"><table><thead><tr><th>Item</th><th class="r">Cost</th><th class="r">Share</th></tr></thead><tbody>';
    tp.rows.forEach(function (r, i) {
      html += '<tr><td><i style="display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:8px;background:' + segCls[i] + '"></i>' + esc(r.item) + '</td><td class="r">' + fmt(r.cost) + '</td><td class="r">' + esc(r.share) + "</td></tr>";
    });
    html += '</tbody><tfoot><tr><td>Total (' + esc(tp.totalLabel) + ')</td><td class="r">' + fmt(tp.total) + '</td><td class="r"></td></tr></tfoot></table></div>';
    html += '<p class="small" style="margin-top:12px">' + esc(tp.flatOMAlternative.note) + "</p></section>";

    // 2. Cost by parts
    html += '<section class="cs-section"><h2>Cost by Parts</h2><div class="table-wrap"><table><thead><tr><th>Part</th><th class="hide-m">Stage</th><th class="r">Initial cost</th><th class="r">Total replacement cost</th></tr></thead><tbody>';
    S.parts.forEach(function (p) {
      html += '<tr class="stage-' + p.group + '"><td><a href="' + partHref(p) + '"><span class="pn-badge">' + p.id + "</span>" + esc(pname(p)) + '</a></td><td class="hide-m">' + stageChip(groupById(p.group)) + '</td><td class="r">' + fmt(p.initialCost) + '</td><td class="r">' + fmt(p.totalReplacementCost) + "</td></tr>";
    });
    html += '</tbody><tfoot><tr><td>Total</td><td class="hide-m"></td><td class="r">' + fmt(cs.costByPartsTotals.initial) + '</td><td class="r">' + fmt(cs.costByPartsTotals.replacement) + "</td></tr></tfoot></table></div></section>";

    // 3. Takeaways
    html += '<section class="cs-section"><h2>Takeaways</h2><div class="takeaways">' + cs.takeaways.map(function (t) {
      return '<div class="take">' + esc(t) + "</div>";
    }).join("") + "</div></section>";

    // 4. Generation cost analysis
    html += '<section class="cs-section"><h2>Generation Cost Analysis</h2><p>' + esc(gen.intro) + "</p>";
    var pbLabel = gen.rowLabels.filter(function (r) { return r[0] === "paybackYears"; })[0][1];
    var kwhLabel = gen.rowLabels.filter(function (r) { return r[0] === "costPerKWh"; })[0][1];
    html += '<div class="scen">' + gen.scenarios.map(function (s) {
      return '<div class="metric' + (s.highlight ? " hl" : "") + '"><div class="mh"><span>' + esc(s.name) + '</span></div>' +
        '<div class="mv">' + s.paybackYears + '<span class="u">years</span></div><div class="mf"><div>' + esc(pbLabel) + '<br>' + esc(kwhLabel) + ": " + genCell("costPerKWh", s) + "</div></div></div>";
    }).join("") + "</div>";
    html += '<div class="table-wrap"><table class="gen-table"><thead><tr><th></th>' + gen.scenarios.map(function (s) {
      return '<th class="r' + (s.highlight ? " hl" : "") + '">' + esc(s.name) + "</th>";
    }).join("") + "</tr></thead><tbody>";
    gen.rowLabels.forEach(function (rl) {
      var key = rl[0];
      html += "<tr><td>" + esc(rl[1]) + "</td>" + gen.scenarios.map(function (s) {
        return '<td class="r' + (s.highlight ? " hl" : "") + '">' + genCell(key, s) + "</td>";
      }).join("") + "</tr>";
    });
    html += "</tbody></table></div>";
    html += '<div class="chart-card"><h3>Cumulative revenue vs total price</h3><p class="small">Where each line crosses the dashed line is the payback.</p>' +
      '<div id="chart-host"></div><ul class="chart-legend">' + gen.scenarios.map(function (s) {
        return '<li><i style="background:var(--chart-' + s.id + ')"></i>' + esc(s.name) + ": about " + s.paybackYears + " years</li>";
      }).join("") + "</ul></div></section>";

    // 5. Assumptions, notes
    html += '<section class="cs-section"><h2>Assumptions</h2><ul class="list-block">' + gen.assumptions.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
    html += '<h2 class="sub-h">Notes</h2><ul class="list-block">' + gen.notes.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
    html += '<ul class="list-block sub-h">' + cs.notes.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></section>";
    return html;
  }

  function genCell(key, s) {
    var v = s[key];
    switch (key) {
      case "performanceRatio": return Number(v).toFixed(2);
      case "peakSunHours": return Number(v).toFixed(1);
      case "energy30yr": return num(v) + "<small>" + esc(s.energy30yrLabel) + "</small>";
      case "costPerKWh": return "₹" + Number(v).toFixed(2);
      case "revenueY1": case "revenueY30": case "revenue30yr": return fmt(v);
      case "paybackYears": return "about " + v + " years";
      default: return num(v);
    }
  }

  /* ---------- payback line chart (inline SVG, no library) ---------- */
  function drawChart(host) {
    var gen = S.costSummary.generation;
    var total = S.costSummary.totalPrice.total;
    var years = S.horizonYears;
    var W = Math.max(280, Math.floor(host.clientWidth));
    var narrow = W < 520;
    var H = narrow ? 300 : 380;
    var m = { l: narrow ? 52 : 64, r: narrow ? 12 : 24, t: 16, b: 40 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var maxV = Math.max.apply(null, gen.scenarios.map(function (s) { return s.revenue30yr; }));
    var step = 3e7; // ₹3 crore gridlines
    var top = Math.ceil(maxV / step) * step;
    function X(y) { return m.l + (y / years) * iw; }
    function Y(v) { return m.t + ih - (v / top) * ih; }

    var svg = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="Cumulative revenue over 30 years for low, base and high scenarios against the total price">';
    for (var v = 0; v <= top; v += step) {
      svg += '<line class="grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/>' +
        '<text x="' + (m.l - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + (v === 0 ? "₹0" : "₹" + (v / 1e7) + " cr") + "</text>";
    }
    for (var y = 0; y <= years; y += 5) {
      svg += '<line class="axis" x1="' + X(y) + '" x2="' + X(y) + '" y1="' + (m.t + ih) + '" y2="' + (m.t + ih + 5) + '"/>' +
        '<text x="' + X(y) + '" y="' + (m.t + ih + 20) + '" text-anchor="middle">' + y + "</text>";
    }
    svg += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 4) + '" text-anchor="middle">Year</text>';
    svg += '<line class="axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + (m.t + ih) + '" y2="' + (m.t + ih) + '"/>';

    // total price line
    var ty = Y(total);
    var tlabel = "Total price " + S.costSummary.totalPrice.totalLabel.replace(/^about\s+/i, "");
    svg += '<line class="total-line" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + ty + '" y2="' + ty + '"/>' +
      '<text class="total-label" x="' + (W - m.r - 4) + '" y="' + (ty + 16) + '" text-anchor="end">' + esc(tlabel) + "</text>";

    // revenue lines. Data covers years 1–30; each line starts at (0, 0) so it reads as cumulative.
    ["low", "base", "high"].forEach(function (id) {
      var s = gen.scenarios.filter(function (x) { return x.id === id; })[0];
      var cum = gen.cumulativeRevenue[id];
      var d = "M" + X(0) + " " + Y(0);
      cum.forEach(function (val, i) { d += " L" + X(i + 1).toFixed(1) + " " + Y(val).toFixed(1); });
      svg += '<path class="ln ' + id + '" stroke="var(--chart-' + id + ')" d="' + d + '"><title>' + esc(s.name) + "</title></path>";
      // crossing = payback (linear interpolation between year ends)
      for (var i = 0; i < cum.length; i++) {
        if (cum[i] >= total) {
          var prevV = i ? cum[i - 1] : 0;
          var yr = i + (total - prevV) / (cum[i] - prevV);
          svg += '<line class="drop" stroke="var(--chart-' + id + ')" x1="' + X(yr) + '" x2="' + X(yr) + '" y1="' + ty + '" y2="' + (m.t + ih) + '"/>' +
            '<circle cx="' + X(yr) + '" cy="' + ty + '" r="5" fill="var(--surface)" stroke="var(--chart-' + id + ')" stroke-width="2.5"/>';
          break;
        }
      }
    });
    host.innerHTML = svg + "</svg>";
  }

  function initChart() {
    var host = $("#chart-host");
    var lastW = 0;
    function draw() { var w = host.clientWidth; if (w !== lastW) { lastW = w; drawChart(host); } }
    draw();
    window.addEventListener("resize", draw);
    cleanup = function () { window.removeEventListener("resize", draw); };
  }

  /* =====================================================================
     SYSTEM OVERVIEW
     ===================================================================== */
  // Node positions (top-left) for the two layouts. All edges are axis-aligned.
  var FLOW_LAYOUT = {
    wide: {
      w: 190, h: 56, vw: 1030, vh: 350, wrap: 28,
      pos: { panels: [40, 20], combiner: [290, 20], inverter: [540, 20], battery: [800, 20],
             ev: [40, 150], charger: [290, 150], ltpanel: [540, 150], grid: [800, 150],
             cms: [290, 280], kiosk: [540, 280] }
    },
    narrow: {
      w: 140, h: 60, vw: 340, vh: 440, wrap: 17,
      pos: { panels: [10, 10], combiner: [190, 10],
             battery: [10, 100], inverter: [190, 100],
             grid: [10, 190], ltpanel: [190, 190],
             ev: [10, 280], charger: [190, 280],
             kiosk: [10, 370], cms: [190, 370] }
    }
  };

  function wrapText(s, max) {
    var words = s.split(" "), lines = [], cur = "";
    words.forEach(function (w) {
      if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; } else { cur = cur ? cur + " " + w : w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function drawFlow(host, mode) {
    var L = FLOW_LAYOUT[mode], F = S.systemFlow, pad = 3;
    var byId = {};
    F.nodes.forEach(function (n) { byId[n.id] = n; });
    function rect(id) { var p = L.pos[id]; return { x: p[0], y: p[1], w: L.w, h: L.h }; }

    var svg = '<svg class="flow" viewBox="0 0 ' + L.vw + " " + L.vh + '" role="group" aria-label="System energy and data flow">' +
      '<defs>' + ["power", "data"].map(function (k) {
        return '<marker class="' + k + '" id="arr-' + k + '" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker>';
      }).join("") + "</defs>";

    F.edges.forEach(function (e) {
      var a = rect(e.from), b = rect(e.to), x1, y1, x2, y2;
      if (Math.abs(a.y - b.y) < 2) { // same row
        y1 = y2 = a.y + a.h / 2;
        if (a.x < b.x) { x1 = a.x + a.w + pad; x2 = b.x - pad; } else { x1 = a.x - pad; x2 = b.x + b.w + pad; }
      } else { // same column
        x1 = x2 = a.x + a.w / 2;
        if (a.y < b.y) { y1 = a.y + a.h + pad; y2 = b.y - pad; } else { y1 = a.y - pad; y2 = b.y + b.h + pad; }
      }
      svg += '<line class="edge ' + e.kind + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" marker-end="url(#arr-' + e.kind + ')"' +
        (e.twoWay ? ' marker-start="url(#arr-' + e.kind + ')"' : "") + "/>";
    });

    F.nodes.forEach(function (n) {
      var r = rect(n.id), p = n.part ? partById(n.part) : null;
      var lines = wrapText(n.label, L.wrap);
      var tx = r.x + (p ? 34 : 14);
      var ty0 = r.y + r.h / 2 - ((lines.length - 1) * 8) + 4.5;
      var inner = '<rect class="box" x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="10"/>';
      if (p) {
        inner += '<rect class="bar" x="' + r.x + '" y="' + (r.y + 10) + '" width="5" height="' + (r.h - 20) + '" rx="2.5"/>' +
          '<g class="nb"><circle cx="' + (r.x + 20) + '" cy="' + (r.y + r.h / 2) + '" r="11"/><text x="' + (r.x + 20) + '" y="' + (r.y + r.h / 2 + 4) + '">' + n.part + "</text></g>";
      }
      inner += lines.map(function (ln, i) { return '<text x="' + tx + '" y="' + (ty0 + i * 16) + '">' + esc(ln) + "</text>"; }).join("");
      if (p) {
        svg += '<a class="node stage-' + p.group + '" href="' + partHref(p) + '" aria-label="Part ' + p.id + ": " + esc(n.label) + '">' + inner + "</a>";
      } else {
        svg += '<g class="node nopart">' + inner + "</g>";
      }
    });
    host.classList.toggle("narrow", mode === "narrow");
    host.innerHTML = svg + "</svg>";
  }

  function systemPage() {
    var F = S.systemFlow;
    var html = priceBadge() + "<h1>System Overview</h1>";
    html += '<div class="flow-card"><div id="flow-host"></div>' +
      '<div class="flow-key"><span><svg viewBox="0 0 40 8" aria-hidden="true"><line x1="0" y1="4" x2="40" y2="4" stroke="var(--flow-power)" stroke-width="2.5"/></svg>Power</span>' +
      '<span><svg viewBox="0 0 40 8" aria-hidden="true"><line x1="0" y1="4" x2="40" y2="4" stroke="var(--flow-data)" stroke-width="2.5" stroke-dasharray="7 5"/></svg>Data</span>' +
      "<span>Arrows at both ends: power flows both ways</span></div></div>";
    html += '<section class="section"><h2>Supporting parts</h2><ul class="support">' + F.supporting.map(function (s) {
      var p = partById(s.part);
      return '<li class="stage-' + p.group + '"><a href="' + partHref(p) + '"><span class="n">Part ' + p.id + "</span><span>" + esc(s.text) + "</span></a></li>";
    }).join("") + "</ul></section>";
    return html;
  }

  function initFlow() {
    var host = $("#flow-host");
    var mode = null;
    function pick() {
      var m = host.parentNode.clientWidth < 720 ? "narrow" : "wide";
      if (m !== mode) { mode = m; drawFlow(host, m); }
    }
    pick();
    window.addEventListener("resize", pick);
    cleanup = function () { window.removeEventListener("resize", pick); };
  }

  /* =====================================================================
     GLOSSARY
     ===================================================================== */
  function glossaryPage() {
    return priceBadge() + "<h1>Glossary</h1>" +
      '<div class="table-wrap"><table class="gloss"><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>' +
      S.glossary.map(function (g) { return "<tr><td>" + esc(g[0]) + "</td><td>" + esc(g[1]) + "</td></tr>"; }).join("") +
      "</tbody></table></div>";
  }

  /* ---------- boot ---------- */
  setupNav();
  window.addEventListener("hashchange", render);
  render();
})();
