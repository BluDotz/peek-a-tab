const list = document.getElementById("windows");
const fly = document.getElementById("fly");
const search = document.getElementById("search");

let windows = [];
let currentId;

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

function tabRow(w, t) {
  const row = el("div", "tab" + (t.active ? " active" : ""));
  row.append(favicon(t), el("span", "", t.title || t.url));
  row.addEventListener("click", async () => {
    await chrome.tabs.update(t.id, { active: true });
    await chrome.windows.update(w.id, { focused: true });
    window.close();
  });
  return row;
}

function showTabs(w) {
  fly.replaceChildren(...w.tabs.map(t => tabRow(w, t)));
  fly.scrollTop = 0;
}

function matches(w, q) {
  return w.tabs.some(t => (t.title || "").toLowerCase().includes(q) || (t.url || "").toLowerCase().includes(q));
}

function renderList() {
  const q = search.value.trim().toLowerCase();
  list.replaceChildren();
  for (const w of windows) {
    if (q && !matches(w, q)) continue;
    const active = w.tabs.find(t => t.active) || w.tabs[0];
    const li = el("li", "win" + (w.id === currentId ? " current" : ""));
    const head = el("div", "head");
    head.append(
      favicon(active),
      el("span", "title", active ? active.title : "(empty)"),
      el("span", "count", `${w.tabs.length} tab${w.tabs.length === 1 ? "" : "s"}`)
    );
    li.append(head);
    li.addEventListener("mouseenter", () => showTabs(w));
    li.addEventListener("click", () => {
      chrome.windows.update(w.id, { focused: true });
      window.close();
    });
    list.append(li);
  }
  if (!list.children.length) list.append(el("li", "hint", "No matching windows"));
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

search.addEventListener("input", renderList);
init();
