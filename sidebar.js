let pageContent = "";
let contentLoaded = false;

// Ask content script for page content using runtime message
chrome.runtime.sendMessage({ type: "get-page-content" }, (response) => {
  if (response?.content) {
    pageContent = response.content;
    contentLoaded = true;
    console.log("✅ Page content received");
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
            content: `Page content:
${pageContent.slice(0, 6000)}

Question:
${question}`
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