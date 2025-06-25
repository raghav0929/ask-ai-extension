if (!document.getElementById("ask-ai-sidebar-container")) {
  const container = document.createElement("div");
  container.id = "ask-ai-sidebar-container";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.right = "0";
  container.style.height = "100%";
  container.style.width = "400px";
  container.style.zIndex = "999999";
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.background = "#111827";
  container.style.boxShadow = "-2px 0 10px rgba(0,0,0,0.3)";
  container.style.transition = "width 0.1s ease-out";

  const closeBtn = document.createElement("div");
  closeBtn.textContent = "✖";
  closeBtn.title = "Close";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.left = "10px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "18px";
  closeBtn.style.color = "#f87171";
  closeBtn.style.zIndex = "1000000";
  closeBtn.style.padding = "5px";

  closeBtn.addEventListener("click", () => {
    document.getElementById("ask-ai-sidebar-container")?.remove();
  });

  const resizer = document.createElement("div");
  resizer.style.width = "6px";
  resizer.style.cursor = "ew-resize";
  resizer.style.background = "#6B7280";
  resizer.style.userSelect = "none";

  const iframe = document.createElement("iframe");
  iframe.id = "ask-ai-sidebar";
  iframe.src = chrome.runtime.getURL("sidebar.html");
  iframe.style.flex = "1";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  container.appendChild(resizer);
  container.appendChild(iframe);
  container.appendChild(closeBtn);
  document.body.appendChild(container);

  let resizing = false;

  const onPointerDown = (e) => {
    resizing = true;
    document.body.style.cursor = "ew-resize";
    resizer.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!resizing) return;
    const screenWidth = window.innerWidth;
    const newWidth = screenWidth - e.clientX;
    const minWidth = 250;
    const maxWidth = 800;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      container.style.width = `${newWidth}px`;
    }
  };

  const onPointerUp = (e) => {
    resizing = false;
    document.body.style.cursor = "default";
    resizer.releasePointerCapture(e.pointerId);
  };

  resizer.addEventListener("pointerdown", onPointerDown);
  resizer.addEventListener("pointermove", onPointerMove);
  resizer.addEventListener("pointerup", onPointerUp);
}

// Chrome messaging to handle content request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "get-page-content") {
    const content = document.body.innerText || "";
    sendResponse({ content });
  }
});