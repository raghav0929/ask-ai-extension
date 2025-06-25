let pageContent = "";
let contentLoaded = false;

// Ask main page for content after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.parent.postMessage("get-page-content", "*");
});

// Receive page content only once
window.addEventListener("message", (event) => {
  if (event.data?.type === "page-content" && !contentLoaded) {
    pageContent = event.data.content;
    contentLoaded = true;
    console.log("✅ Page content loaded");
  }
});

document.getElementById("ask-btn").addEventListener("click", async () => {
  const question = document.getElementById("question").value;
  const responseDiv = document.getElementById("response");

  if (!contentLoaded) {
    responseDiv.textContent = "⏳ Please wait, page content is still loading...";
    return;
  }

  responseDiv.textContent = "🤔 Thinking...";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content: "You are an assistant that summarizes web page content based only on the context provided."
          },
          {
            role: "user",
            content: `Page content:\n${pageContent.slice(0, 6000)}\n\nQuestion:\n${question}`
          }
        ]
      })
    });

    const data = await res.json();
    responseDiv.textContent = data.choices?.[0]?.message?.content || "⚠️ No response from AI.";
  } catch (err) {
    responseDiv.textContent = "❌ Error: " + err.message;
  }
});
