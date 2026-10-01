// Fake chrome.* data (made-up sample sites) so the real popup can be rendered for store screenshots.
const f = n => `http://localhost:8765/store/harness/fav/${n}.svg`;
const T = (id, title, fav, active) => ({ id, title, url: "https://example.com/" + id, favIconUrl: f(fav), active: !!active });
const W = [
  { id: 1, tabs: [T(11, "Flutter widget catalogue", "docs", 1), T(12, "State management overview", "docs"), T(13, "Packages for navigation", "code"), T(14, "Layout cheat sheet", "docs"), T(15, "Animations in depth", "docs")] },
  { id: 2, tabs: [T(21, "Sourdough starter guide", "cook", 1), T(22, "Weeknight pasta ideas", "cook"), T(23, "Kitchen scales compared", "shop"), T(24, "Slow cooker chilli", "cook")] },
  { id: 3, tabs: [T(31, "Lisbon in three days", "map", 1), T(32, "Train times Porto to Lisbon", "map"), T(33, "Guesthouses near the old town", "shop"), T(34, "Pastel de nata: where to go", "cook"), T(35, "Tram 28 route map", "map"), T(36, "Weather in October", "news")] },
  { id: 4, tabs: [T(41, "Morning headlines", "news", 1), T(42, "Long read: the future of cities", "news")] },
  { id: 5, tabs: [T(51, "Pull request review", "code", 1), T(52, "CI build status", "code"), T(53, "Release notes draft", "docs")] },
  { id: 6, tabs: [T(61, "Garden shed plans", "shop", 1), T(62, "Timber suppliers nearby", "shop"), T(63, "Roofing felt options", "shop")] }
];
const params = new URLSearchParams(location.search);
const cur = +(params.get("cur") || 1);
const order = (params.get("order") || "1,2,3,4,5,6").split(",").map(Number);
window.chrome = {
  windows: { getCurrent: async () => ({ id: cur }), getAll: async () => W, update: async () => {} },
  tabs: { update: async () => {} },
  storage: { session: { get: async () => ({ order }) } }
};
window.close = () => {};
