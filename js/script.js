let token = localStorage.getItem("token");
let userId = localStorage.getItem("user_id");
let currentChatWith = null;

window.onload = () => {
    if (token) {
        showChat();
        loadDialogs();
        startAutoUpdate();
    } else {
        document.getElementById("auth").style.display = "block";
    }
};

// -------------------- AUTH --------------------

function loginUser() {
    let form = new FormData();
    form.append("login", document.getElementById("login").value);
    form.append("password", document.getElementById("password").value);

    fetch("/api/login.php", { method:"POST", body:form })
    .then(r => r.json())
    .then(d => {
        if (d.token) {
            token = d.token;
            userId = d.user_id;
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", userId);
            showChat();
            loadDialogs();
            startAutoUpdate();
        } else {
            document.getElementById("auth-status").innerText = "Ошибка входа";
        }
    });
}

function register() {
    let form = new FormData();
    form.append("login", document.getElementById("login").value);
    form.append("password", document.getElementById("password").value);

    fetch("/api/register.php", { method:"POST", body:form })
    .then(r => r.json())
    .then(d => {
        if (d.status === "ok") {
            document.getElementById("auth-status").innerText = "Регистрация успешна!";
        } else {
            document.getElementById("auth-status").innerText = "Логин занят!";
        }
    });
}

function showChat() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("chat-screen").style.display = "block";
}

// -------------------- ДИАЛОГИ --------------------

function loadDialogs() {
    fetch("/api/list_dialogs.php", {
        headers: { "Authorization": token }
    })
    .then(r => r.json())
    .then(d => {
        let box = document.getElementById("dialogs");
        box.innerHTML = "";
        d.forEach(u => {
            let el = document.createElement("div");
            el.className = "dialog-item";
            el.innerText = u.login;
            el.onclick = () => openChat(u.id);
            box.appendChild(el);
        });
    });
}

// -------------------- ЧАТ --------------------

function openChat(id) {
    currentChatWith = id;
    loadMessages();
}

function loadMessages() {
    if (!currentChatWith) return;

    fetch(`/api/get.php?user_id=${currentChatWith}`, {
        headers: { "Authorization": token }
    })
    .then(r => r.json())
    .then(d => {
        let box = document.getElementById("messages");
        box.innerHTML = "";

        d.messages.forEach(m => {
            let el = document.createElement("div");
            el.className = "msg" + (m.sender_id == userId ? " me" : "");
            el.innerText = m.message;
            box.appendChild(el);
        });

        box.scrollTop = box.scrollHeight;
    });
}

function sendMessage() {
    if (!currentChatWith) return;

    let text = document.getElementById("msg-text").value;
    if (!text.trim()) return;

    let form = new FormData();
    form.append("receiver_id", currentChatWith);
    form.append("message", text);

    fetch("/api/send.php", {
        method:"POST",
        body:form,
        headers: { "Authorization": token }
    });

    document.getElementById("msg-text").value = "";
    setTimeout(loadMessages, 200);
}

// -------------------- AUTO UPDATE --------------------

function startAutoUpdate() {
    setInterval(() => {
        loadMessages();
        loadDialogs();
    }, 2000);
}