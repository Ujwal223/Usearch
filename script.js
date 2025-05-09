// Theme toggle
const themeBtn = document.getElementById('themeToggleBtn');
const htmlEl = document.documentElement;

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeBtn.querySelector('i').textContent = theme === 'light' ? 'brightness_6' : 'brightness_4';
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
});

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
const searchEngineToggle = document.getElementById('searchEngineToggle');
const engineDropdown = document.getElementById('engineDropdown');

let searchEngines = [
    { name: "duckduckgo", url: "https://duckduckgo.com/", query: "q" },
    { name: "bing", url: "https://www.bing.com/search", query: "q" },
    { name: "yahoo", url: "https://search.yahoo.com/search", query: "p" }
];

const customEngines = JSON.parse(localStorage.getItem('customEngines')) || [];
searchEngines = [...searchEngines, ...customEngines];

function loadSearchEngines() {
    engineDropdown.innerHTML = '';
    searchEngines.forEach(engine => {
        const option = document.createElement('div');
        option.className = 'search-engine-option';
        option.dataset.engine = engine.name;
        option.dataset.url = engine.url;
        option.dataset.query = engine.query;
        option.dataset.icon = `https://www.google.com/s2/favicons?domain=${new URL(engine.url).hostname}&sz=16`;
        option.innerHTML = `<img src="${option.dataset.icon}" alt="${engine.name}">`;
        engineDropdown.appendChild(option);
        option.addEventListener('click', () => {
            const form = document.querySelector('.search-container');
            form.action = engine.url;
            form.querySelector('input').name = engine.query;
            document.querySelector('.search-bar').placeholder = `Search with ${engine.name.charAt(0).toUpperCase() + engine.name.slice(1)}...`;
            document.querySelector('.search-engine-toggle img').src = option.dataset.icon;
            localStorage.setItem('defaultSearchEngine', engine.name);
            engineDropdown.style.display = 'none';
        });
    });
}

loadSearchEngines();

searchEngineToggle.addEventListener('click', () => {
    engineDropdown.style.display = engineDropdown.style.display === 'block' ? 'none' : 'block';
});

searchBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    document.querySelector('.search-container').submit();
});

document.addEventListener('click', (e) => {
    if (!engineDropdown.contains(e.target) && e.target !== searchEngineToggle) {
        engineDropdown.style.display = 'none';
    }
});

// Custom search engine
const addCustomSearchBtn = document.getElementById('addCustomSearchBtn');
const addCustomSearchForm = document.getElementById('addCustomSearchForm');
const customSearchNameInput = document.getElementById('customSearchName');
const customSearchUrlInput = document.getElementById('customSearchUrl');
const customSearchQueryInput = document.getElementById('customSearchQuery');
const saveCustomSearchBtn = document.getElementById('saveCustomSearchBtn');

addCustomSearchBtn.addEventListener('click', () => {
    addCustomSearchForm.style.display = 'block';
});

saveCustomSearchBtn.addEventListener('click', () => {
    const name = customSearchNameInput.value.trim();
    const url = customSearchUrlInput.value.trim();
    const query = customSearchQueryInput.value.trim();
    if (name && url && query) {
        customEngines.push({ name: name.toLowerCase(), url, query });
        localStorage.setItem('customEngines', JSON.stringify(customEngines));
        searchEngines = [...searchEngines.filter(e => !customEngines.some(ce => ce.name === e.name)), ...customEngines];
        loadSearchEngines();
        addCustomSearchForm.style.display = 'none';
        customSearchNameInput.value = '';
        customSearchUrlInput.value = '';
        customSearchQueryInput.value = '';
    }
});

// Tool list with favicons
const predefinedTools = [
    { name: "YouTube", url: "https://youtube.com" },
    { name: "Reddit", url: "https://reddit.com" },
    { name: "Twitter", url: "https://twitter.com" },
    { name: "Wikipedia", url: "https://wikipedia.org" },
    { name: "StackOverflow", url: "https://stackoverflow.com" },
    { name: "GitHub", url: "https://github.com" },
    { name: "LinkedIn", url: "https://linkedin.com" },
    { name: "Facebook", url: "https://facebook.com" }
];

const toolsBar = document.getElementById('toolsBar');
const iconList = document.getElementById('iconList');
let savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || [];

function loadIcons() {
    toolsBar.innerHTML = '';
    const allIcons = [...predefinedTools.map(tool => ({ ...tool, isPredefined: true })), ...savedIcons.map(icon => ({ ...icon, isPredefined: false }))];
    allIcons.forEach(icon => {
        const container = document.createElement('div');
        container.className = 'icon-container';
        const a = document.createElement('a');
        a.href = icon.url;
        a.className = 'tool-icon';
        a.target = '_blank';
        a.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${new URL(icon.url).hostname}&sz=64" width="32" height="32" alt="${icon.name}" title="${icon.name}">`;
        container.appendChild(a);
        if (!icon.isPredefined) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-icon';
            deleteBtn.innerHTML = 'x';
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                savedIcons = savedIcons.filter(i => i.name !== icon.name || i.url !== icon.url);
                localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
                loadIcons();
                loadIconList();
            });
            container.appendChild(deleteBtn);
            let timer;
            a.addEventListener('touchstart', (e) => {
                timer = setTimeout(() => {
                    const rect = a.getBoundingClientRect();
                    showMenu(rect.left + window.scrollX, rect.bottom + window.scrollY, icon);
                }, 500);
            });
            a.addEventListener('touchend', () => clearTimeout(timer));
            a.addEventListener('touchcancel', () => clearTimeout(timer));
        }
        toolsBar.appendChild(container);
    });

    const addIconLocation = localStorage.getItem('addIconLocation') || 'sidebar';
    if (addIconLocation === 'quickaccess') {
        const addBtn = document.createElement('button');
        addBtn.className = 'add-tool';
        addBtn.innerHTML = '+';
        addBtn.addEventListener('click', () => {
            const name = prompt('Enter site name:');
            const url = prompt('Enter site URL:');
            if (name && url) {
                savedIcons.push({ name, url });
                localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
                loadIcons();
                loadIconList();
            }
        });
        toolsBar.appendChild(addBtn);
    }
}

function showMenu(x, y, icon) {
    const menu = document.createElement('div');
    menu.className = 'icon-menu';
    menu.style.position = 'absolute';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.innerHTML = `
        <button class="menu-btn" data-action="delete">Delete</button>
        <button class="menu-btn" data-action="rename">Rename</button>
        <button class="menu-btn" data-action="change-link">Change Link</button>
    `;
    document.body.appendChild(menu);
    menu.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'delete') {
                savedIcons = savedIcons.filter(i => i.name !== icon.name || i.url !== icon.url);
                localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
                loadIcons();
                loadIconList();
            } else if (action === 'rename') {
                const newName = prompt('Enter new name:', icon.name);
                if (newName) {
                    const index = savedIcons.findIndex(i => i.name === icon.name && i.url === icon.url);
                    savedIcons[index].name = newName;
                    localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
                    loadIcons();
                    loadIconList();
                }
            } else if (action === 'change-link') {
                const newUrl = prompt('Enter new URL:', icon.url);
                if (newUrl) {
                    const index = savedIcons.findIndex(i => i.name === icon.name && i.url === icon.url);
                    savedIcons[index].url = newUrl;
                    localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
                    loadIcons();
                    loadIconList();
                }
            }
            menu.remove();
        });
    });
    document.addEventListener('click', () => menu.remove(), { once: true });
}

loadIcons();

// Add Icon functionality
const addIconBtn = document.getElementById('addIconBtn');
const addIconForm = document.getElementById('addIconForm');
const siteNameInput = document.getElementById('siteName');
const siteUrlInput = document.getElementById('siteUrl');
const saveIconBtn = document.getElementById('saveIconBtn');

function loadIconList() {
    iconList.innerHTML = '';
    savedIcons.forEach(icon => {
        const div = document.createElement('div');
        div.className = 'icon-item';
        div.innerHTML = `
            <span>${icon.name} (${icon.url})</span>
            <button class="delete-icon">x</button>
        `;
        div.querySelector('.delete-icon').addEventListener('click', () => {
            savedIcons = savedIcons.filter(i => i.name !== icon.name || i.url !== icon.url);
            localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
            loadIcons();
            loadIconList();
        });
        iconList.appendChild(div);
    });
}

loadIconList();

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
        loadIconList();
        siteNameInput.value = '';
        siteUrlInput.value = '';
        addIconForm.style.display = 'none';
    }
});

// Add Icon Location
const addIconLocationSelect = document.getElementById('addIconLocation');
const addIconSetting = document.getElementById('addIconSetting');
addIconLocationSelect.value = localStorage.getItem('addIconLocation') || 'sidebar';
addIconLocationSelect.addEventListener('change', (e) => {
    localStorage.setItem('addIconLocation', e.target.value);
    addIconSetting.style.display = e.target.value === 'sidebar' ? 'block' : 'none';
    loadIcons();
});
addIconSetting.style.display = addIconLocationSelect.value === 'sidebar' ? 'block' : 'none';

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
searchEngines.forEach(engine => {
    const option = document.createElement('option');
    option.value = engine.name;
    option.textContent = engine.name.charAt(0).toUpperCase() + engine.name.slice(1);
    defaultSearchProviderSelect.appendChild(option);
});

defaultSearchProviderSelect.addEventListener('change', (e) => {
    const engine = searchEngines.find(se => se.name === e.target.value);
    if (engine) {
        const form = document.querySelector('.search-container');
        form.action = engine.url;
        form.querySelector('input').name = engine.query;
        document.querySelector('.search-bar').placeholder = `Search with ${engine.name.charAt(0).toUpperCase() + engine.name.slice(1)}...`;
        document.querySelector('.search-engine-toggle img').src = `https://www.google.com/s2/favicons?domain=${new URL(engine.url).hostname}&sz=16`;
        localStorage.setItem('defaultSearchEngine', engine.name);
    }
});

const savedSearchEngine = localStorage.getItem('defaultSearchEngine') || 'duckduckgo';
defaultSearchProviderSelect.value = savedSearchEngine;
defaultSearchProviderSelect.dispatchEvent(new Event('change'));
