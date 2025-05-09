// Theme toggle
const themeBtn = document.getElementById('themeToggleBtn');
const htmlEl = document.documentElement;

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
});

// Sidebar toggle
const menuBtn = document.getElementById('menuToggleBtn');
const closeBtn = document.getElementById('closeSidebarBtn');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Sidebar navigation
const navBtns = document.querySelectorAll('.nav-btn');
const toolsSection = document.getElementById('toolsSection');
const settingsSection = document.getElementById('settingsSection');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.section === 'tools') {
            toolsSection.style.display = 'block';
            settingsSection.style.display = 'none';
        } else {
            toolsSection.style.display = 'none';
            settingsSection.style.display = 'block';
        }
    });
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

searchBtn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== searchBtn) {
        dropdown.style.display = 'none';
    }
});

document.querySelectorAll('.search-engine-option').forEach(opt => {
    if (opt.id !== 'addCustom') {
        opt.addEventListener('click', () => {
            const form = document.querySelector('.search-container');
            form.action = opt.dataset.url;
            document.querySelector('.search-bar').placeholder = `Search with ${opt.dataset.engine.charAt(0).toUpperCase() + opt.dataset.engine.slice(1)}...`;
            dropdown.style.display = 'none';
        });
    }
});

// Tool list with circular favicons and "Add" button
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

// Add "Add" button
const addBtn = document.createElement('button');
addBtn.className = 'add-tool';
addBtn.innerHTML = '+';
addBtn.title = 'Add new tool';
toolsBar.appendChild(addBtn);

// Accent color picker
const accentPicker = document.getElementById('accentColor');
accentPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
    localStorage.setItem('accentColor', e.target.value);
});

// Load saved accent color
const savedAccentColor = localStorage.getItem('accentColor') || '#888888';
document.documentElement.style.setProperty('--accent-color', savedAccentColor);
accentPicker.value = savedAccentColor;
