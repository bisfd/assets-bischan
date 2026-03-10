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

(() => {
  const COOKIE_NAME = 'bischan_theme';
  const ONE_YEAR = 60 * 60 * 24 * 365;
  const root = document.documentElement;

  const getCookie = (name) => {
    const parts = document.cookie.split('; ').map((part) => part.split('='));
    const match = parts.find(([key]) => key === name);
    return match ? decodeURIComponent(match[1]) : '';
  };

  const setCookie = (name, value) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
  };

  const normalizeTheme = (value) =>
    value === 'dark' || value === 'light' ? value : '';
  const resolveTheme = (value) => (value === 'dark' ? 'dark' : 'light');

  const updateToggle = (theme) => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const label = toggle.querySelector('.theme-label');
    const nextLabel = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    if (label) label.textContent = nextLabel;
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  };

  const applyTheme = (theme) => {
    const resolved = resolveTheme(theme);
    root.setAttribute('data-theme', resolved);
    updateToggle(resolved);
  };

  const stored = normalizeTheme(getCookie(COOKIE_NAME));
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    updateToggle(resolveTheme(root.getAttribute('data-theme') || initial));
    toggle.addEventListener('click', () => {
      const current = resolveTheme(root.getAttribute('data-theme'));
      const next = current === 'dark' ? 'light' : 'dark';
      setCookie(COOKIE_NAME, next);
      applyTheme(next);
    });
  });
})();