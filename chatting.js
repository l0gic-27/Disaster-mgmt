document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");

    sendBtn.addEventListener("click", () => {
        sendMessage();
    });

    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === "") return;

        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "user-message");
        messageDiv.textContent = messageText;

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;  // Auto-scroll to the latest message
        messageInput.value = "";
    }
});
