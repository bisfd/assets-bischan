// MIT License

// Copyright (c) 2026 BisChan's Asset Department

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Simple admin panel: fetch users and allow blocking/unblocking.
const statusNode = document.getElementById('admin-status');
const listNode = document.getElementById('users');
const token = localStorage.getItem('bischan_token') || '';

const api = async (path, options = {}) => {
  if (!token) throw new Error('Нужна авторизация. Сначала войдите в приложение.');
  const headers = options.headers || {};
  headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
};

const renderUsers = (users) => {
  if (!users.length) {
    listNode.innerHTML = '<p class="muted">Пользователей пока нет.</p>';
    return;
  }
  listNode.innerHTML = users
    .map(
      (u) => `
        <div class="admin-user">
          <div class="status-dot ${u.online ? 'online' : ''}"></div>
          <div class="admin-meta">
            <div><strong>${u.nickname}</strong> ${u.username ? `<span class="muted">@${u.username}</span>` : ''} ${u.isAdmin ? '<span class="muted">(admin)</span>' : ''}</div>
            <div class="muted">id: ${u.id}</div>
            <div class="muted">${u.online ? 'Онлайн' : `Был(а) в ${new Date(u.lastSeen || Date.now()).toLocaleString()}`}</div>
          </div>
          <div class="admin-actions">
            <button data-id="${u.id}" data-blocked="${u.blocked}">
              ${u.blocked ? 'Разблокировать' : 'Заблокировать'}
            </button>
          </div>
        </div>
      `,
    )
    .join('');

  listNode.querySelectorAll('button').forEach((btn) => {
    btn.onclick = async () => {
      const userId = btn.dataset.id;
      const blocked = btn.dataset.blocked !== 'true';
      try {
        await api('/api/admin/block', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, blocked }),
        });
        await loadUsers();
      } catch (err) {
        alert(err.message);
      }
    };
  });
};

const loadUsers = async () => {
  try {
    statusNode.textContent = 'Загружаем список пользователей...';
    const { users } = await api('/api/admin/users');
    statusNode.textContent = `Пользователей: ${users.length}`;
    renderUsers(users);
  } catch (err) {
    statusNode.textContent = err.message;
  }
};

loadUsers();
