# 🧠 Ask AI Chrome Extension

A Chrome extension that adds a sidebar to any webpage so you can ask questions about the page using AI.

## ✨ Features

- Summarize or ask anything about the current page
- Uses `deepseek/deepseek-r1-0528:free` via OpenRouter
- Resizable sidebar
- No backend required — pure frontend

## 🔧 Installation (Developer Mode)

1. Clone the repo
2. Open `chrome://extensions`
3. Enable Developer Mode
4. Click **Load unpacked**
5. Select this folder
6. Visit any website and start using the sidebar!

## 🛡️ API Key

Uses a free OpenRouter key by default. You can update `sidebar.js`:

```js
"Authorization": "Bearer YOUR_API_KEY"
