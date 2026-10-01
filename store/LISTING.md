# Store listing text

## Name
Peek-a-Tab

## Summary (max 132 characters, used by the Chrome Web Store)
View every browser window along with its tab count. Hover to list its tabs; click a tab to jump straight to it.

## Description
Lost a tab somewhere in a sea of windows? Peek-a-Tab shows every browser window in one tidy list, with a tab count for each. Hover over a window to see the titles of all its tabs in a panel beside it, then click any tab to jump straight to it. The window comes to the front with that tab showing.

• See all your windows at a glance, with site icons and tab counts
• Hover a window to list every tab inside it
• Click a tab to bring its window forward and show that tab
• Windows are listed most recently used first, current window on top
• Filter by typing: search works across every window's tab titles and addresses
• Open from the toolbar button or the Option+W shortcut (changeable in your browser's shortcut settings)
• Follows your light or dark theme

Private by design: Peek-a-Tab runs entirely on your device. It collects nothing and sends nothing anywhere. It uses the "tabs" permission only to read tab titles, addresses and icons for display, and "storage" to remember window order for the current browser session.

Free and open source (MIT): https://github.com/BluDotz/peek-a-tab

## Category
Productivity

## Permission justifications (Chrome Web Store asks for these)
- tabs: Needed to read the title, address and icon of each open tab so they can be listed in the popup, and to switch to the tab the user clicks.
- storage: Used to hold a short list of window ids in the order they were last focused (session storage, cleared when the browser closes) so the most recently used window is listed first.
- Background service worker: records window focus order for the above; makes no network requests.

## Privacy policy URL
https://github.com/BluDotz/peek-a-tab/blob/main/PRIVACY.md

## Single purpose statement
Show a list of the user's open browser windows and their tabs, and let the user jump to a chosen window or tab.

## Assets
- Screenshots (1280x800): store/screenshots/
- Small promo tile (440x280): store/promo-tile-440x280.png
- Icon (128x128): icons/icon128.png
