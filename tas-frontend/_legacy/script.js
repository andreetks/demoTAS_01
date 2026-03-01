document.addEventListener('DOMContentLoaded', () => {

    // Login Handling
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate login delay
        const btn = loginForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Cargando...';

        setTimeout(() => {
            btn.innerText = originalText;
            showScreen('dashboard-screen');
        }, 800);
    });

    // Enter key support for chat
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

});

// Navigation Functions
function showScreen(screenId) {
    // Remove active class from currently active screen
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
        // If moving back to dashboard from chat, slide logic is handled by css
        // but we need to manage z-indexes or classes properly
        // For simplicity in this prototype:
        // We set the new screen to active on top.
    }

    // Get all screens and remove active class (except the one we want)
    document.querySelectorAll('.screen').forEach(s => {
        if (s.id !== screenId) {
            s.classList.remove('active');
        }
    });

    // Add active to target
    const target = document.getElementById(screenId);
    target.classList.add('active');
}

function openChat(groupName) {
    document.getElementById('chat-title').innerText = groupName;
    showScreen('chat-screen');

    // Scroll to bottom of chat
    const chatContainer = document.getElementById('chat-messages');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();

    if (text) {
        addMessage(text, 'sent');
        input.value = '';

        // Auto-reply simulation
        setTimeout(() => {
            const replies = [
                "¡Entendido!",
                "Vale, nos vemos.",
                "¿Podrías repetir eso?",
                "👍",
                "De acuerdo."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            addMessage(randomReply, 'received', 'Compañero');
        }, 1500);
    }
}

function addMessage(text, type, senderName = 'Yo') {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    let senderHtml = '';
    let avatarHtml = '';

    if (type === 'received') {
        senderHtml = `<div class="message-sender">${senderName}</div>`;
        avatarHtml = `<div class="message-avatar">${senderName.charAt(0)}</div>`;

        msgDiv.innerHTML = `
            ${avatarHtml}
            <div class="message-bubble">
                ${senderHtml}
                <p>${text}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div class="message-bubble">
                <p>${text}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}
