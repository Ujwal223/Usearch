// Theme toggle
const themeBtn = document.getElementById('themeToggleBtn');
const htmlEl = document.documentElement;

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeBtn.querySelector('i').textContent = theme === 'light' ? 'brightness_6' : 'brightness_4';
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
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

// Search engine dropdown on DuckDuckGo logo click
const searchEngineLogo = document.getElementById('searchEngineLogo');
const engineDropdown = document.getElementById('engineDropdown');

let searchEngines = [
    { name: "duckduckgo", url: "https://duckduckgo.com/", query: "q" },
    { name: "bing", url: "https://www.bing.com/search", query: "q" },
    { name: "yahoo", url: "https://search.yahoo.com/search", query: "p" },
    { name: "google", url: "https://www.google.com/search", query: "q" }
];

const customEngines = JSON.parse(localStorage.getItem('customEngines')) || [];
searchEngines = [...searchEngines, ...customEngines];

function loadSearchEngines() {
    engineDropdown.innerHTML = '';
    const defaultSearchProviderSelect = document.getElementById('defaultSearchProvider');
    defaultSearchProviderSelect.innerHTML = '';
    searchEngines.forEach(engine => {
        const option = document.createElement('div');
        option.className = 'search-engine-option';
        option.dataset.engine = engine.name;
        option.dataset.url = engine.url;
        option.dataset.query = engine.query || 'q';
        option.dataset.icon = `https://www.google.com/s2/favicons?domain=${new URL(engine.url).hostname}&sz=32`;
        option.innerHTML = `<img src="${option.dataset.icon}" alt="${engine.name}">`;
        engineDropdown.appendChild(option);
        option.addEventListener('click', () => {
            const form = document.querySelector('.search-container');
            form.action = engine.url;
            form.querySelector('input').name = engine.query || 'q';
            document.querySelector('.search-bar').placeholder = `Search with ${engine.name.charAt(0).toUpperCase() + engine.name.slice(1)}...`;
            document.querySelector('#searchEngineLogo').src = option.dataset.icon;
            localStorage.setItem('defaultSearchEngine', engine.name);
            engineDropdown.style.display = 'none';
            defaultSearchProviderSelect.value = engine.name;
        });

        const selectOption = document.createElement('option');
        selectOption.value = engine.name;
        selectOption.textContent = engine.name.charAt(0).toUpperCase() + engine.name.slice(1);
        defaultSearchProviderSelect.appendChild(selectOption);
    });

    const savedSearchEngine = localStorage.getItem('defaultSearchEngine') || 'duckduckgo';
    defaultSearchProviderSelect.value = savedSearchEngine;
    const selectedEngine = searchEngines.find(engine => engine.name === savedSearchEngine) || searchEngines[0];
    const form = document.querySelector('.search-container');
    form.action = selectedEngine.url;
    form.querySelector('input').name = selectedEngine.query || 'q';
    document.querySelector('.search-bar').placeholder = `Search with ${selectedEngine.name.charAt(0).toUpperCase() + selectedEngine.name.slice(1)}...`;
    document.querySelector('#searchEngineLogo').src = `https://www.google.com/s2/favicons?domain=${new URL(selectedEngine.url).hostname}&sz=32`;
}

loadSearchEngines();

searchEngineLogo.addEventListener('click', (e) => {
    e.preventDefault();
    engineDropdown.style.display = engineDropdown.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
    if (!engineDropdown.contains(e.target) && e.target !== searchEngineLogo) {
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
    const name = customSearchNameInput.value.trim().toLowerCase();
    const url = customSearchUrlInput.value.trim();
    const query = customSearchQueryInput.value.trim() || 'q';
    try {
        new URL(url);
        if (name && url) {
            customEngines.push({ name, url, query });
            localStorage.setItem('customEngines', JSON.stringify(customEngines));
            searchEngines = [...searchEngines.filter(e => !customEngines.some(ce => ce.name === e.name)), ...customEngines];
            loadSearchEngines();
            addCustomSearchForm.style.display = 'none';
            customSearchNameInput.value = '';
            customSearchUrlInput.value = '';
            customSearchQueryInput.value = '';
        } else {
            alert('Please fill in all required fields.');
        }
    } catch (e) {
        alert('Invalid URL. Please enter a valid URL.');
    }
});

// Search provider selection
const defaultSearchProviderSelect = document.getElementById('defaultSearchProvider');
defaultSearchProviderSelect.addEventListener('change', (e) => {
    const engine = searchEngines.find(se => se.name === e.target.value);
    if (engine) {
        const form = document.querySelector('.search-container');
        form.action = engine.url;
        form.querySelector('input').name = engine.query || 'q';
        document.querySelector('.search-bar').placeholder = `Search with ${engine.name.charAt(0).toUpperCase() + engine.name.slice(1)}...`;
        document.querySelector('#searchEngineLogo').src = `https://www.google.com/s2/favicons?domain=${new URL(engine.url).hostname}&sz=32`;
        localStorage.setItem('defaultSearchEngine', engine.name);
    }
});

// Tool list with favicons and context menu for removal
const predefinedTools = [
    { name: "YouTube", url: "https://youtube.com" },
    { name: "Reddit", url: "https://reddit.com" },
    { name: "Twitter", url: "https://twitter.com" },
    { name: "StackOverflow", url: "https://stackoverflow.com" },
    { name: "GitHub", url: "https://github.com" },
    { name: "Facebook", url: "https://facebook.com" }
];

const toolsBar = document.getElementById('toolsBar');
let savedIcons = JSON.parse(localStorage.getItem('savedIcons')) || [];
let predefinedIcons = [...predefinedTools];

function loadIcons() {
    toolsBar.innerHTML = '';
    const allIcons = [...predefinedIcons.map(tool => ({ ...tool, isPredefined: true })), ...savedIcons.map(icon => ({ ...icon, isPredefined: false }))];
    allIcons.forEach(icon => {
        const container = document.createElement('div');
        container.className = 'icon-container';
        const a = document.createElement('a');
        a.href = icon.url;
        a.className = 'tool-icon';
        a.target = '_blank';
        a.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${new URL(icon.url).hostname}&sz=64" width="32" height="32" alt="${icon.name}" title="${icon.name}">`;
        container.appendChild(a);

        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.innerHTML = '<button data-action="remove">Remove</button>';
        document.body.appendChild(contextMenu);

        let timer;
        a.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = a.getBoundingClientRect();
            timer = setTimeout(() => {
                contextMenu.style.display = 'block';
                contextMenu.style.left = `${rect.left + window.scrollX}px`;
                contextMenu.style.top = `${rect.bottom + window.scrollY}px`;
                contextMenu.dataset.target = JSON.stringify(icon);
            }, 500);
        });
        a.addEventListener('touchend', () => clearTimeout(timer));
        a.addEventListener('touchcancel', () => clearTimeout(timer));
        a.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const rect = a.getBoundingClientRect();
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.dataset.target = JSON.stringify(icon);
        });
        a.addEventListener('click', (e) => {
            if (contextMenu.style.display === 'block') {
                e.preventDefault();
            } else if (!e.ctrlKey && !e.metaKey) {
                window.open(a.href, '_blank');
            }
        });

        contextMenu.querySelector('button').addEventListener('click', () => {
            const target = JSON.parse(contextMenu.dataset.target);
            if (target.isPredefined) {
                predefinedIcons = predefinedIcons.filter(i => i.name !== target.name || i.url !== target.url);
            } else {
                savedIcons = savedIcons.filter(i => i.name !== target.name || i.url !== target.url);
                localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
            }
            contextMenu.style.display = 'none';
            loadIcons();
        });

        document.addEventListener('click', (e) => {
            if (!contextMenu.contains(e.target) && e.target !== a) {
                contextMenu.style.display = 'none';
            }
        });

        toolsBar.appendChild(container);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'add-tool';
    addBtn.innerHTML = '+';
    addBtn.addEventListener('click', () => {
        const name = prompt('Enter site name:');
        let url = prompt('Enter site URL:');
        if (!url) return;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        try {
            new URL(url);
            if (name && url) {
                savedIcons.push({ name, url });
                localStorage.setItem('savedIcons', JSON.stringify(savedIcons));
                loadIcons();
            } else {
                alert('Please fill in all required fields.');
            }
        } catch (e) {
            alert('Invalid URL. Please enter a valid URL.');
        }
    });
    toolsBar.appendChild(addBtn);
}

loadIcons();

// Search form submission
document.querySelector('.search-container').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.querySelector('.search-bar').value.trim();
    if (query) {
        window.location.href = `${e.target.action}?${e.target.querySelector('input').name}=${encodeURIComponent(query)}`;
    }
});

// Accent color picker
const accentPicker = document.getElementById('accentColor');
accentPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
    localStorage.setItem('accentColor', e.target.value);
});

const savedAccentColor = localStorage.getItem('accentColor') || '#4CAF50';
document.documentElement.style.setProperty('--accent-color', savedAccentColor);
accentPicker.value = savedAccentColor;
