# Peek-a-Tab

A small browser extension for Chromium-based browsers (Chrome, Opera, Edge, Brave, Arc).
It shows every browser window with its tab count. Hover a window to see all of its tab
titles in a side panel; click a tab to bring its window to the front with that tab showing.

- Filter windows and tabs by typing in the search box
- Open with the toolbar button or **Option+W** (change it at `chrome://extensions/shortcuts`)
- Windows are listed most recently used first (the current window is always on top)
- Uses the `tabs` permission to read tab titles and URLs, and `storage` to remember window order for the current browser session
- Collects nothing and sends nothing anywhere; all processing happens locally

## Install

**[Get Peek-a-Tab from the Chrome Web Store](https://chromewebstore.google.com/detail/peek-a-tab/npdhpnfmnpaalajejnfjjnbjgidgdoij)**

## Install from source (unpacked)

1. Open `chrome://extensions` (or `opera://extensions`)
2. Turn on **Developer mode**
3. Click **Load unpacked** and choose this folder

## Privacy

Peek-a-Tab reads your open window and tab titles/URLs only to display them in its popup.
No data is stored, collected or transmitted.

## Licence

MIT
