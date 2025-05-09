// Theme toggle
const themeBtn = document.getElementById('themeToggleBtn');
const htmlEl = document.documentElement;

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Theme selection
const defaultThemeSelect = document.getElementById('defaultTheme');
defaultThemeSelect.value = savedTheme;
defaultThemeSelect.addEventListener('change', (e) => {
    setTheme(e.target.value);
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

// Tool list with favicons
const tools = [
    { name: "YouTube", url: "https://youtube.com" },
    { name: "Reddit", url: "https://reddit.com" },
    { name: "Twitter", url: "https://twitter.com" },
    { name: "Wikipedia", url: "https://wikipedia.org" },
    { name: "StackOverflow", url: "https://stackoverflow.com" }
];

const toolsBar = document.getElementById('toolsBar');
const iconList = document.getElementById('iconList');
let savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || [];

function loadIcons() {
    toolsBar.innerHTML = '';
    savedIcons.forEach(icon => {
        const a = document.createElement('a');
        a.href = icon.url;
        a.className = 'tool-icon';
        a.target = '_blank';
        a.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${new URL(icon.url).hostname}&sz=64" width="32" height="32" alt="${icon.name}" title="${icon.name}">`;
        toolsBar.appendChild(a);
    });
}

loadIcons();

// Accent color picker
const accentPicker = document.getElementById('accentColor');
accentPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
    localStorage.setItem('accentColor', e.target.value);
});

const savedAccentColor = localStorage.getItem('accentColor') || '#888888';
document.documentElement.style.setProperty('--accent-color', savedAccentColor);
accentPicker.value = savedAccentColor;

// Search provider selection
const defaultSearchProviderSelect = document.getElementById('defaultSearchProvider');
defaultSearchProviderSelect.addEventListener('change', (e) => {
    const form = document.querySelector('.search-container');
    const option = Array.from(defaultSearchProviderSelect.options).find(opt => opt.value === e.target.value);
    form.action = option.dataset.url || `https://${e.target.value}.com/search`;
    document.querySelector('.search-bar').placeholder = `Search with ${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}...`;
    localStorage.setItem('defaultSearchProvider', e.target.value);
});

const savedSearchProvider = localStorage.getItem('defaultSearchProvider') || 'duckduckgo';
defaultSearchProviderSelect.value = savedSearchProvider;
defaultSearchProviderSelect.dispatchEvent(new Event('change'));

// Add Icon functionality
const addIconBtn = document.getElementById('addIconBtn');
const addIconForm = document.getElementById('addIconForm');
const siteNameInput = document.getElementById('siteName');
const siteUrlInput = document.getElementById('siteUrl');
const saveIconBtn = document.getElementById('saveIconBtn');

addIconBtn.addEventListener('click', () => {
    addIconForm.style.display = 'block';
});

saveIconBtn.addEventListener('click', () => {
    const name = siteNameInput.value.trim();
    const url = siteUrlInput.value.trim();
    if (name && url) {
        savedIcons.push({ name, url });
        localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
        loadIcons();
        siteNameInput.value = '';
        siteUrlInput.value = '';
        addIconForm.style.display = 'none';
    }
});

// Remove Icons functionality
const removeIconsBtn = document.getElementById('removeIconsBtn');
removeIconsBtn.addEventListener('click', () => {
    savedIcons = [];
    localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
    loadIcons();
});
