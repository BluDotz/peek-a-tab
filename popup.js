const list = document.getElementById("windows");
const fly = document.getElementById("fly");
const search = document.getElementById("search");
const muteAll = document.getElementById("mute-all");

let windows = [];
let currentId;
let selectedId = null; // window whose tabs are shown in the right-hand panel

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function favicon(t) {
  const icon = el("img", "favicon");
  if (t && t.favIconUrl && /^https?:/.test(t.favIconUrl)) icon.src = t.favIconUrl;
  else icon.style.visibility = "hidden";
  icon.addEventListener("error", () => { icon.style.visibility = "hidden"; });
  return icon;
}

const SVG_NS = "http://www.w3.org/2000/svg";

// Speaker icon; with `muted` it gets a slash through it.
function speakerIcon(muted) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("class", "speaker");
  const add = (tag, attrs) => {
    const n = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
  };
  add("path", { d: "M2 6h3l4-3v10l-4-3H2z", fill: "currentColor" });
  if (muted) {
    add("path", { d: "M11 5.5l4 5M15 5.5l-4 5", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", fill: "none" });
  } else {
    add("path", { d: "M11 5.5a3.5 3.5 0 010 5M13 3.5a6.5 6.5 0 010 9", stroke: "currentColor", "stroke-width": "1.5", "stroke-linecap": "round", fill: "none" });
  }
  return svg;
}

const isMuted = t => !!(t.mutedInfo && t.mutedInfo.muted);

function tabRow(w, t) {
  const row = el("div", "tab" + (t.active ? " active" : "") + (t.audible ? " audible" : ""));
  const title = el("span", "", t.title || t.url);
  row.append(favicon(t), title);

  if (t.audible || isMuted(t)) {
    const btn = el("button", "mute" + (isMuted(t) ? " is-muted" : ""));
    btn.title = isMuted(t) ? "Unmute this tab" : "Mute this tab";
    btn.append(speakerIcon(isMuted(t)));
    btn.addEventListener("click", e => {
      e.stopPropagation();
      chrome.tabs.update(t.id, { muted: !isMuted(t) });
    });
    row.append(btn);
  }

  row.addEventListener("click", async () => {
    await chrome.tabs.update(t.id, { active: true });
    await chrome.windows.update(w.id, { focused: true });
    window.close();
  });
  return row;
}

function showTabs(w) {
  selectedId = w.id;
  fly.replaceChildren(...w.tabs.map(t => tabRow(w, t)));
  fly.scrollTop = 0;
}

function matches(w, q) {
  return w.tabs.some(t => (t.title || "").toLowerCase().includes(q) || (t.url || "").toLowerCase().includes(q));
}

function updateMuteAll() {
  const playing = windows.flatMap(w => w.tabs).filter(t => t.audible && !isMuted(t));
  muteAll.hidden = playing.length === 0;
  muteAll.textContent = `Mute all playing (${playing.length})`;
}

function renderList() {
  const q = search.value.trim().toLowerCase();
  list.replaceChildren();
  for (const w of windows) {
    if (q && !matches(w, q)) continue;
    const active = w.tabs.find(t => t.active) || w.tabs[0];
    const playing = w.tabs.some(t => t.audible);
    const li = el("li", "win" + (w.id === currentId ? " current" : "") + (w.id === selectedId ? " sel" : ""));
    const head = el("div", "head");
    head.append(favicon(active), el("span", "title", active ? active.title : "(empty)"));
    if (playing) {
      const badge = el("span", "playing");
      badge.title = "A tab in this window is playing audio";
      badge.append(speakerIcon(false));
      head.append(badge);
    }
    head.append(el("span", "count", `${w.tabs.length} tab${w.tabs.length === 1 ? "" : "s"}`));
    li.append(head);
    li.addEventListener("mouseenter", () => {
      list.querySelector("li.sel")?.classList.remove("sel");
      li.classList.add("sel");
      showTabs(w);
    });
    li.addEventListener("click", () => {
      chrome.windows.update(w.id, { focused: true });
      window.close();
    });
    list.append(li);
  }
  if (!list.children.length) list.append(el("li", "hint", "No matching windows"));
  updateMuteAll();
}

async function init() {
  currentId = (await chrome.windows.getCurrent()).id;
  const all = await chrome.windows.getAll({ populate: true, windowTypes: ["normal"] });
  const { order = [] } = await chrome.storage.session.get("order");
  // Most recently used first; current window always on top; unknown windows keep browser order.
  const rank = w => (w.id === currentId ? -1 : order.includes(w.id) ? order.indexOf(w.id) : order.length);
  windows = all.map((w, i) => ({ w, i })).sort((a, b) => rank(a.w) - rank(b.w) || a.i - b.i).map(x => x.w);
  renderList();
}

// Keep sound and mute state live while the popup is open.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.audible === undefined && !changeInfo.mutedInfo) return;
  for (const w of windows) {
    const t = w.tabs.find(x => x.id === tabId);
    if (!t) continue;
    if (changeInfo.audible !== undefined) t.audible = changeInfo.audible;
    if (changeInfo.mutedInfo) t.mutedInfo = changeInfo.mutedInfo;
    renderList();
    if (w.id === selectedId) {
      const keep = fly.scrollTop;
      showTabs(w);
      fly.scrollTop = keep;
    }
    return;
  }
});

muteAll.addEventListener("click", () => {
  for (const t of windows.flatMap(w => w.tabs)) {
    if (t.audible && !isMuted(t)) chrome.tabs.update(t.id, { muted: true });
  }
});

search.addEventListener("input", renderList);
init();
