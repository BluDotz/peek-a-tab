// Keeps a most-recently-used list of window ids in session storage
// (cleared when the browser closes, since window ids don't survive a restart).

async function getOrder() {
  const { order = [] } = await chrome.storage.session.get("order");
  return order;
}

async function touch(windowId) {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;
  const order = (await getOrder()).filter(id => id !== windowId);
  order.unshift(windowId);
  await chrome.storage.session.set({ order });
}

chrome.windows.onFocusChanged.addListener(touch);
chrome.windows.onCreated.addListener(w => touch(w.id));

chrome.windows.onRemoved.addListener(async windowId => {
  const order = (await getOrder()).filter(id => id !== windowId);
  await chrome.storage.session.set({ order });
});

// Seed with whichever window is focused when the worker starts.
async function seed() {
  const w = await chrome.windows.getLastFocused().catch(() => null);
  if (w) await touch(w.id);
}
chrome.runtime.onInstalled.addListener(seed);
chrome.runtime.onStartup.addListener(seed);
