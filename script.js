const COHERE_API_KEY = "ByDzl9X8lv2br8rlLoOnrJ3Bula3R152iuDY1sVR";
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  const placeholder = document.createElement("div");
  placeholder.classList.add("message", "bot");
  placeholder.innerText = "...";
  chatBox.appendChild(placeholder);

  try {
    const resp = await fetch("https://api.cohere.ai/v2/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-08-2024",  
        messages: [
          { role: "user", content: text }
        ],
      }),
    });

    const data = await resp.json();
    placeholder.remove();

    let botReply = null;
    if (data.message && data.message.content && data.message.content.length > 0) {
      botReply = data.message.content.map(c => c.text).join(" ");
    }

    if (botReply) {
      addMessage(botReply, "bot");
    } else {
      addMessage("⚠️ No valid reply", "bot");
      console.log("Full API response:", data);
    }

  } catch (err) {
    placeholder.remove();
    addMessage("Error: " + err.message, "bot");
  }
}

