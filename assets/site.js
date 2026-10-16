/* Renders every page from window.SITE (data.js). You shouldn't need to edit
   this file to change content — edit data.js instead. */
(function () {
  "use strict";

  /* ---------- light / dark theme ---------- */

  const root = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = () => { try { return localStorage.getItem("theme"); } catch (e) { return null; } };
  const ICON = {
    sun: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  };
  function applyTheme(theme) {
    root.dataset.theme = theme;
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    btn.innerHTML = theme === "dark" ? ICON.sun : ICON.moon;
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
  applyTheme(savedTheme() || (darkQuery.matches ? "dark" : "light"));
  darkQuery.addEventListener("change", (e) => { if (!savedTheme()) applyTheme(e.matches ? "dark" : "light"); });

  const app = document.getElementById("app");
  const page = document.body.dataset.page;

  if (typeof window.SITE !== "object") {
    app.innerHTML = `<div class="fatal"><strong>The site data couldn't be loaded.</strong>
      <p>There is probably a typo in <code>data.js</code> (often a missing comma, quote or bracket).
      Open the browser console to see the line number.</p></div>`;
    return;
  }
  const S = window.SITE;
  const warnings = [];

  /* ---------- text helpers ---------- */

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const blank = (v) => v == null || String(v).trim() === "";

  function a(url, label, cls) {
    const ext = /^https?:\/\//.test(url) ? ' target="_blank" rel="noopener"' : "";
    return `<a href="${esc(url)}"${cls ? ` class="${cls}"` : ""}${ext}>${label}</a>`;
  }
  const contactLink = () => a("mailto:" + S.contact.email, esc(S.contact.name));
  // The mailing list may be blank while a new form is being made: then every
  // sign-up link and button is left out.
  const hasList = !blank(S.mailingList);
  const mailingList = (label, cls) => (hasList ? a(S.mailingList, label || "join the mailing list", cls) : "");
  const hearFirst = () => (hasList ? ` To hear first, ${mailingList()}.` : "");
  const TOKENS = Object.assign({}, S.links, { mailingList: hasList ? S.mailingList : "" });

  // Inline formatting: **bold**, _italic_, [text](url), {linkKey}, {contact}
  function inline(text) {
    let s = esc(text);
    s = s.replace(/\{(\w+)\}/g, (m, k) => (k in TOKENS ? TOKENS[k] : m));
    s = s.replace(/\[([^\]]+)\]\(\s*\)/g, "$1");  // link with no URL yet: keep the words
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => a(url.replace(/&amp;/g, "&"), label));
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[\s(])_(\S(?:.*?\S)?)_(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
    return s.replace(/\{contact\}/g, contactLink());
  }
  // Paragraphs separated by blank lines
  function rich(text) {
    return String(text ?? "").trim().split(/\n\s*\n/).filter(Boolean)
      .map((p) => `<p>${inline(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");
  }

  /* ---------- people: names link to their UCL profile ---------- */

  const profiles = {};  // escaped, lower-case name -> profile URL ("" = no profile)
  Object.entries(S.people || {}).forEach(([name, url]) => { if (!blank(name)) profiles[esc(name).toLowerCase()] = url || ""; });
  const linkable = Object.keys(profiles).filter((k) => profiles[k]).sort((x, y) => y.length - x.length);
  const escapeRe = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const peopleRe = linkable.length
    ? new RegExp(`(?<![\\p{L}\\p{N}])(${linkable.map(escapeRe).join("|")})(?![\\p{L}\\p{N}])`, "giu")
    : null;
  // Link every listed name in a chunk of HTML, except text already inside a link or a dropdown.
  function linkPeople(html) {
    if (!peopleRe) return html;
    let skip = 0;
    return html.split(/(<[^>]*>)/).map((part) => {
      if (part[0] === "<") {
        if (/^<(a|select)[\s>]/i.test(part)) skip++;
        else if (/^<\/(a|select)>/i.test(part)) skip--;
        return part;
      }
      return skip ? part : part.replace(peopleRe, (name) => a(profiles[name.toLowerCase()], name));
    }).join("");
  }
  const stripTitle = (name) => String(name).replace(/^(Dr|Prof|Professor|Mr|Mrs|Ms|Miss)\.?\s+/i, "");
  function checkPerson(name, hasOwnUrl) {
    if (blank(name) || hasOwnUrl || esc(stripTitle(name)).toLowerCase() in profiles) return;
    warnings.push(`"${stripTitle(name)}" isn't in people yet. Add their UCL profile link (python tools/find_profile.py "${stripTitle(name)}"), or "" if they don't have one.`);
  }

  /* ---------- dates ---------- */

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function parseDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.getMonth() === +m[2] - 1 ? d : null;
  }
  const fmtShort = (d) => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const fmtFull = (d) => `${fmtShort(d)} ${d.getFullYear()}`;
  const fmtLong = (d) => `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
  function fmtRange(x, y) {
    if (!x) return "";
    if (!y || +x === +y) return `${x.getDate()} ${MONTHS[x.getMonth()]} ${x.getFullYear()}`;
    const sameYear = x.getFullYear() === y.getFullYear();
    return `${x.getDate()} ${MONTHS[x.getMonth()]}${sameYear ? "" : " " + x.getFullYear()} – ${y.getDate()} ${MONTHS[y.getMonth()]} ${y.getFullYear()}`;
  }
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  /* ---------- normalise data ---------- */

  if (/docs\.google\.com\/forms\/d\/[^/]+\/edit/.test(S.mailingList || "")) {
    warnings.push("mailingList is the Google Form's edit link, which only organisers can open. In Google Forms use Send → link icon, and paste that link (https://forms.gle/… or …/viewform) instead.");
  } else if (hasList && !/^https?:\/\//.test(S.mailingList)) {
    warnings.push(`mailingList should start with https:// (it is "${S.mailingList}").`);
  }

  const termById = {};
  (S.terms || []).forEach((t) => { termById[t.id] = t; t.courses = []; });
  const defaults = S.defaults || {};
  const seenIds = {};

  const courses = (S.courses || []).map((c, i) => {
    const label = c.title || `course #${i + 1}`;
    if (!c.id) warnings.push(`"${label}" has no id.`);
    if (seenIds[c.id]) warnings.push(`Two courses share the id "${c.id}".`);
    seenIds[c.id] = true;
    const term = termById[c.term];
    if (!term) warnings.push(`"${label}" has term "${c.term}", which isn't in the terms list.`);

    const course = Object.assign({}, c, {
      format: c.format || defaults.format || "",
      instructors: c.instructors || [],
    });
    course.sessions = (c.sessions || []).map((s, j) => {
      const d = parseDate(s.date);
      if (s.date && !d) warnings.push(`"${label}" session ${j + 1}: "${s.date}" isn't a valid YYYY-MM-DD date.`);
      return Object.assign({}, s, {
        n: j + 1, course, d,
        time: s.time || c.time || "",
        room: s.room || c.room || defaults.room || "",
      });
    });
    const dated = course.sessions.filter((s) => s.d).sort((x, y) => x.d - y.d);
    course.first = dated[0] ? dated[0].d : null;
    course.last = dated.length ? dated[dated.length - 1].d : null;
    course.rooms = [...new Set(course.sessions.map((s) => s.room).filter(Boolean))].join("; ");
    // "Fridays, 13:00–14:00" when every session shares a weekday and time
    const days = new Set(dated.map((s) => s.d.getDay()));
    const times = new Set(course.sessions.map((s) => s.time));
    course.when = days.size === 1 && times.size === 1
      ? [`${DAYS_LONG[dated[0].d.getDay()]}s`, course.sessions[0].time].filter(Boolean).join(", ")
      : (dated.length ? "Various (see sessions)" : "To be announced");
    if (term) term.courses.push(course);
    course.instructors.forEach((p) => checkPerson(p.name, !blank(p.url)));
    return course;
  });
  (S.faculty || []).forEach((f) => checkPerson(f.name, !blank(f.url)));

  const allSessions = courses.flatMap((c) => c.sessions).filter((s) => s.d)
    .sort((x, y) => x.d - y.d || String(x.time).localeCompare(String(y.time)));
  const upcoming = allSessions.filter((s) => s.d >= today);
  const nextSession = upcoming[0];
  const roomText = (r) => (/^tbc$/i.test(r) ? "room TBC" : r);
  const rowClass = (s) => (s === nextSession ? "is-next" : s.d < today ? "is-past" : "");
  const nextLabel = (s) => (s === nextSession ? `<span class="label-next">Next</span>` : "");

  /* ---------- shared chrome ---------- */

  const NAV = [
    ["home", "index.html", "Home"],
    ["courses", "courses.html", "Courses"],
    ["schedule", "schedule.html", "Schedule"],
    ["about", "about.html", "About"],
  ];

  function header() {
    const items = NAV.map(([id, href, label]) =>
      `<li><a href="${href}"${id === page ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
    return `
      <a class="skip" href="#main">Skip to content</a>
      <div class="topbar"><div class="wrap">${a(S.links.department, "UCL Linguistics")}</div></div>
      <header class="masthead"><div class="wrap">
        <a class="site-title" href="index.html">Short Courses in Linguistics <span>${esc(S.academicYear)}</span></a>
        <nav aria-label="Main"><ul>${items}</ul></nav>
        <button class="theme-toggle" type="button"></button>
      </div></header>
      ${S.announcement ? `<div class="notice" role="status"><div class="wrap">${inline(S.announcement)}</div></div>` : ""}`;
  }

  function footer() {
    return `
      <footer class="site-footer"><div class="wrap">
        <span>UCL Linguistics Short Courses ${esc(S.year)} · Contact: ${contactLink()}</span>
        <span>Website: ${a("mailto:" + S.webmaster.email, esc(S.webmaster.name))} · <a href="about.html#credits">Image credits</a></span>
      </div></footer>`;
  }

  /* ---------- reusable bits ---------- */

  const instructorNames = (c) => c.instructors.map((p) => esc(p.name)).join(", ") || "To be announced";
  const topic = (s) => (blank(s.title) ? `<span class="tba">Topic to be announced</span>` : inline(s.title));
  const tbaTerm = (t) => `<p class="muted">Courses for ${esc(t.name)} will be announced here.${hearFirst()}</p>`;

  function sessionTable(sessions) {
    return `
      <div class="table-wrap"><table class="stack">
        <thead><tr><th>Date</th><th>Time</th><th>Course</th><th>Session</th><th>Room</th></tr></thead>
        <tbody>${sessions.map((s) => `
          <tr class="${rowClass(s)}" data-course="${esc(s.course.id)}">
            <td data-label="Date" class="nowrap">${esc(fmtShort(s.d))}${nextLabel(s)}</td>
            <td data-label="Time" class="nowrap">${esc(s.time || "TBC")}</td>
            <td data-label="Course"><a href="courses.html#${esc(s.course.id)}">${esc(s.course.title)}</a></td>
            <td data-label="Session">${s.n}. ${topic(s)}</td>
            <td data-label="Room" class="nowrap">${esc(s.room || "TBC")}</td>
          </tr>`).join("")}
        </tbody>
      </table></div>`;
  }

  function statusLine() {
    if (S.complete) return `The ${esc(S.year)} programme has now finished. Thank you to all our instructors and participants.`;
    if (nextSession && nextSession === allSessions[0]) return `Courses begin on ${esc(fmtLong(nextSession.d))}.`;
    if (nextSession) {
      const s = nextSession;
      return `Next session: ${a("courses.html#" + s.course.id, esc(s.course.title))}, ${esc(fmtLong(s.d))}${s.time ? ", " + esc(s.time) : ""}${s.room ? ", " + esc(roomText(s.room)) : ""}.`;
    }
    return `More courses will be announced soon.${hearFirst()}`;
  }

  /* ---------- pages ---------- */

  function home() {
    const banner = S.images && S.images.banner;
    const hasBanner = banner && !blank(banner.src);

    const terms = (S.terms || []).map((t) => `
      <h3>${esc(t.name)}</h3>
      ${t.courses.length ? `
        ${t.note ? `<p class="muted">${inline(t.note)}</p>` : ""}
        <div class="table-wrap"><table class="stack">
          <thead><tr><th>Course</th><th>When</th><th>Dates</th><th>Room</th></tr></thead>
          <tbody>${t.courses.map((c) => `
            <tr class="${c.last && c.last < today ? "is-past" : ""}">
              <td data-label="Course"><a href="courses.html#${esc(c.id)}">${esc(c.title)}</a><small>${instructorNames(c)}</small></td>
              <td data-label="When" class="nowrap">${esc(c.when)}</td>
              <td data-label="Dates" class="nowrap">${esc(fmtRange(c.first, c.last) || "TBC")}</td>
              <td data-label="Room" class="nowrap">${esc(c.rooms || "TBC")}</td>
            </tr>`).join("")}
          </tbody>
        </table></div>` : tbaTerm(t)}`).join("");

    const soon = S.complete ? [] : upcoming.slice(0, 5);

    return `
      <section class="hero">
        ${hasBanner ? `<img src="${esc(banner.src)}" alt="${esc(banner.alt)}">` : ""}
        <div class="wrap">
          <p class="eyebrow">${esc(S.academicYear)}</p>
          <h1>UCL Linguistics Short Courses</h1>
          <p class="hero-status">${statusLine()}</p>
          <div class="hero-actions">
            <a class="btn btn-light" href="courses.html">Browse courses</a>
            ${mailingList("Join the mailing list", "btn btn-outline")}
          </div>
        </div>
      </section>
      ${hasBanner && banner.credit ? `<p class="credit wrap">${inline(banner.credit)}</p>` : ""}
      <div class="wrap page with-aside">
        <div>
          <div class="lead">${rich(S.about)}</div>

          <h2>Courses</h2>
          ${terms}

          ${soon.length ? `
            <h2>Upcoming sessions</h2>
            ${sessionTable(soon)}
            <p><a href="schedule.html">Full schedule →</a></p>` : ""}
        </div>
        ${aside()}
      </div>`;
  }

  function aside() {
    const prev = (S.previousYears || []).map((p) => `<li>${a(p.url, esc(p.label))}</li>`).join("");
    return `
      <aside>
        <section class="box">
          <h2>At a glance</h2>
          <ul class="plain ticks">${(S.atAGlance || []).map((x) => `<li>${inline(x)}</li>`).join("")}</ul>
        </section>
        <section class="box">
          <h2>Mailing list</h2>
          <p>Course announcements, rooms and materials are sent to the mailing list.</p>
          <p>${hasList ? mailingList("Sign up", "btn") : `<span class="muted">Sign-up for ${esc(S.year)} opens soon.</span>`}</p>
        </section>
        <section class="box">
          <h2>Contact</h2>
          <p>${contactLink()}<br><span class="muted">${esc(S.contact.email)}</span></p>
        </section>
        ${prev ? `<section class="box"><h2>Past programmes</h2><ul class="plain">${prev}</ul></section>` : ""}
      </aside>`;
  }

  function courseSection(c) {
    const info = [
      ["Taught by", instructorNames(c)],
      ["Area", esc(c.area)],
      ["When", esc(c.when)],
      ["Dates", esc(c.first ? fmtRange(c.first, c.last) : "To be announced")],
      ["Room", esc(c.rooms || "TBC")],
      ["Format", esc(c.format)],
      ["Suitable for", inline(c.audience)],
    ].filter(([, v]) => !blank(v));

    const sessions = c.sessions.map((s) => {
      const readings = (s.readings || []).filter((r) => !blank(r));
      const mats = (s.materials || []).filter((m) => m && (m.file || m.url));
      const detail = [
        s.guest ? `<p>Guest speaker: ${inline(s.guest)}</p>` : "",
        blank(s.description) ? "" : rich(s.description),
        readings.length ? `<p><strong>Readings</strong></p><ul class="readings">${readings.map((r) => `<li>${inline(r)}</li>`).join("")}</ul>` : "",
        mats.length ? `<p>${mats.map((m) => {
          const url = m.file || m.url;
          return a(url, esc(m.label || "Materials") + (/\.pdf$/i.test(url) ? " (PDF)" : ""));
        }).join(" · ")}</p>` : "",
      ].join("");
      return `
        <li class="${s.d && s.d < today ? "is-past" : ""}">
          <span class="session-n">${s.n}</span>
          <div>
            <h4>${topic(s)}</h4>
            <p class="when">${s.d ? esc(fmtFull(s.d)) : "Date TBC"}${s.time ? ", " + esc(s.time) : ""}${s.room ? ", " + esc(roomText(s.room)) : ""}${nextLabel(s)}</p>
            ${detail ? `<div class="detail">${detail}</div>` : ""}
          </div>
        </li>`;
    }).join("");

    const people = c.instructors.map((p) => `
      <div class="person">
        <p><strong>${p.url ? a(p.url, esc(p.name)) : esc(p.name)}</strong>${p.role ? `, ${esc(p.role)}` : ""}</p>
        ${p.email ? `<p>${a("mailto:" + p.email, esc(p.email))}</p>` : ""}
        ${blank(p.bio) ? "" : `<div class="detail">${rich(p.bio)}</div>`}
      </div>`).join("");

    return `
      <section class="course" id="${esc(c.id)}">
        <h2>${esc(c.title)}</h2>
        <table class="info"><tbody>${info.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("")}</tbody></table>
        ${blank(c.description) ? `<p class="tba">Course description to be announced.</p>` : rich(c.description)}
        <h3>Sessions</h3>
        ${sessions ? `<ol class="sessions">${sessions}</ol>` : `<p class="tba">Sessions to be announced.</p>`}
        ${people ? `<h3>${c.instructors.length > 1 ? "Instructors" : "Instructor"}</h3>${people}` : ""}
      </section>`;
  }

  function coursesPage() {
    const contents = (S.terms || []).map((t) => `
      <li><span>${esc(t.name)}</span>${t.courses.length
        ? `<ul>${t.courses.map((c) => `<li><a href="#${esc(c.id)}">${esc(c.title)}</a></li>`).join("")}</ul>`
        : ` <span class="muted">to be announced</span>`}</li>`).join("");

    const body = (S.terms || []).map((t) => `
      <h2 class="term-heading" id="${esc(t.id)}">${esc(t.name)}</h2>
      ${t.courses.length ? (t.note ? `<p class="muted">${inline(t.note)}</p>` : "") + t.courses.map(courseSection).join("") : tbaTerm(t)}`).join("");

    return `
      <div class="wrap page-title">
        <h1>Courses ${esc(S.academicYear)}</h1>
        ${S.pageIntros && S.pageIntros.courses ? `<p class="lead">${inline(S.pageIntros.courses)}</p>` : ""}
        <nav class="contents" aria-label="Contents"><h2>Contents</h2><ul class="plain">${contents}</ul></nav>
        ${body}
      </div>`;
  }

  function schedulePage() {
    const options = courses.filter((c) => c.sessions.some((s) => s.d))
      .map((c) => `<option value="${esc(c.id)}">${esc(c.title)}</option>`).join("");

    const terms = (S.terms || []).map((t) => {
      const sessions = allSessions.filter((s) => s.course.term === t.id);
      return `<section class="term" data-term="${esc(t.id)}">
        <h2 class="term-heading">${esc(t.name)}</h2>
        ${sessions.length ? sessionTable(sessions) : tbaTerm(t)}
      </section>`;
    }).join("");

    return `
      <div class="wrap page-title">
        <h1>Schedule ${esc(S.academicYear)}</h1>
        ${S.pageIntros && S.pageIntros.schedule ? `<p class="lead">${inline(S.pageIntros.schedule)}</p>` : ""}
        ${options ? `<div class="filter-bar"><label for="course-filter">Show</label>
          <select id="course-filter"><option value="all">All courses</option>${options}</select></div>` : ""}
        ${terms}
      </div>`;
  }

  function aboutPage() {
    const history = S.images && S.images.history;
    const steps = (S.howItWorks || []).map((st) => `<li><strong>${esc(st.title)}.</strong> ${inline(st.text)}</li>`).join("");
    const faq = (S.faq || []).map((f) => `<h3>${esc(f.q)}</h3>${rich(f.a)}`).join("");
    const faculty = (S.faculty || []).map((f) => `<li>${f.url ? a(f.url, esc(f.name)) : esc(f.name)}, ${esc(f.role)}</li>`).join("");
    const prev = (S.previousYears || []).map((p) => `<li>${a(p.url, esc(p.label))}</li>`).join("");
    const credits = Object.values(S.images || {}).filter((i) => i && i.credit).map((i) => `<li>${inline(i.credit)}</li>`).join("");

    return `
      <div class="wrap page-title">
        <h1>About the programme</h1>
        ${history && !blank(history.src) ? `<figure class="figure"><img src="${esc(history.src)}" alt="${esc(history.alt)}">${history.credit ? `<figcaption>${inline(history.credit)}</figcaption>` : ""}</figure>` : ""}
        ${rich(S.about)}
        ${steps ? `<h2>How to take part</h2><ol>${steps}</ol>` : ""}
        <div class="clear"></div>
        ${faq ? `<h2>Frequently asked questions</h2><div class="faq">${faq}</div>` : ""}
        <h2>Contact</h2>
        <p>For any questions, please email ${contactLink()} (${esc(S.contact.email)}).${hasList ? ` For course announcements, ${mailingList()}.` : ""}</p>
        ${faculty ? `<h2>Faculty support</h2><ul>${faculty}</ul>` : ""}
        ${prev ? `<h2>Past programmes</h2><ul>${prev}<li>${a(S.links.programmeHome, "All programmes")}</li></ul>` : ""}
        ${credits ? `<h2 id="credits">Image credits</h2><ul>${credits}</ul>` : ""}
      </div>`;
  }

  /* ---------- mount ---------- */

  const PAGES = { home, courses: coursesPage, schedule: schedulePage, about: aboutPage };
  const TITLES = { home: "", courses: "Courses", schedule: "Schedule", about: "About" };
  const render = PAGES[page] || home;

  const local = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const warnBox = local && warnings.length
    ? `<div class="dev-warn" role="alert"><strong>data.js check (only shown on your computer):</strong><ul>${warnings.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div>` : "";

  app.innerHTML = `${header()}${warnBox}<main id="main">${linkPeople(render())}</main>${footer()}`;
  document.title = `${TITLES[page] ? TITLES[page] + " · " : ""}UCL Linguistics Short Courses ${S.year}`;
  warnings.forEach((w) => console.warn("data.js:", w));

  // Theme toggle
  applyTheme(root.dataset.theme);
  app.querySelector(".theme-toggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", next); } catch (e) { /* private mode: still switch for this page */ }
    applyTheme(next);
  });

  // Schedule filter
  const filter = document.getElementById("course-filter");
  if (filter) filter.addEventListener("change", () => {
    const f = filter.value;
    app.querySelectorAll("tr[data-course]").forEach((tr) => { tr.hidden = f !== "all" && tr.dataset.course !== f; });
    app.querySelectorAll("section.term").forEach((sec) => {
      sec.hidden = f !== "all" && !sec.querySelector("tr[data-course]:not([hidden])");
    });
  });

  // Content is rendered after load, so jump to #anchor ourselves
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: "instant" });
  }
})();
