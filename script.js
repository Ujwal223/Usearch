// script.js

// Theme toggle
const themeBtn = document.getElementById('themeToggleBtn');
const htmlEl = document.documentElement;

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
}

const saved = localStorage.getItem('theme') || 'dark';
setTheme(saved);

themeBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
});

// Sidebar toggle
const menuBtn = document.getElementById('menuToggleBtn');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Search engine dropdown
const searchBtn = document.getElementById('searchBtn');
const dropdown = document.getElementById('engineDropdown');
let pressTimer;

searchBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    pressTimer = setTimeout(() => {
        dropdown.style.display = 'block';
    }, 500);
});

searchBtn.addEventListener('touchend', (e) => {
    clearTimeout(pressTimer);
    if (dropdown.style.display !== 'block') {
        document.querySelector('.search-container').submit();
    }
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== searchBtn) {
        dropdown.style.display = 'none';
    }
});

document.querySelectorAll('.search-engine-option').forEach(opt => {
    opt.addEventListener('click', () => {
        const form = document.querySelector('.search-container');
        form.action = opt.dataset.url;
        document.querySelector('.search-bar').placeholder = `Search with ${opt.dataset.engine.charAt(0).toUpperCase() + opt.dataset.engine.slice(1)}...`;
        dropdown.style.display = 'none';
    });
});

// Tool list with actual favicons
const tools = [
    { name: "YouTube", url: "https://youtube.com" },
    { name: "Reddit", url: "https://reddit.com" },
    { name: "Twitter", url: "https://twitter.com" },
    { name: "Wikipedia", url: "https://wikipedia.org" },
    { name: "StackOverflow", url: "https://stackoverflow.com" }
];

const toolsBar = document.getElementById('toolsBar');

tools.forEach(t => {
    const a = document.createElement('a');
    a.href = t.url;
    a.className = 'tool-icon';
    a.target = '_blank';
    const domain = new URL(t.url).hostname;
    a.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" width="24" height="24" alt="${t.name}" title="${t.name}">`;
    toolsBar.appendChild(a);
});

// Accent color picker
const accentPicker = document.getElementById('accentColor');
accentPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
});
