// Theme toggle
const themeBtn = document.getElementById('themeToggleBtn');
const htmlEl = document.documentElement;

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeBtn.querySelector('i').textContent = theme === 'light' ? 'brightness_6' : 'brightness_4';
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light as per user request
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

// Search engine dropdown on DuckDuckGo logo click
const searchEngineToggle = document.getElementById('searchEngineToggle');
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
            document.querySelector('.search-engine-toggle img').src = option.dataset.icon;
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
    document.querySelector('.search-engine-toggle img').src = `https://www.google.com/s2/favicons?domain=${new URL(selectedEngine.url).hostname}&sz=32`;
}

loadSearchEngines();

searchEngineToggle.addEventListener('click', () => {
    engineDropdown.style.display = engineDropdown.style.display === 'block' ? 'none' : 'block';
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
    const name = customSearchNameInput.value.trim().toLowerCase();
    const url = customSearchUrlInput.value.trim();
    const query = customSearchQueryInput.value.trim() || 'q';
    try {
        new URL(url); // Validate URL
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
        document.querySelector('.search-engine-toggle img').src = `https://www.google.com/s2/favicons?domain=${new URL(engine.url).hostname}&sz=32`;
        localStorage.setItem('defaultSearchEngine', engine.name);
    }
});

// Tool list with favicons
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
            });
            container.appendChild(deleteBtn);
        }
        toolsBar.appendChild(container);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'add-tool';
    addBtn.innerHTML = '+';
    addBtn.addEventListener('click', () => {
        const name = prompt('Enter site name:');
        const url = prompt('Enter site URL:');
        try {
            new URL(url); // Validate URL
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

// History feature
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function loadHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach((item, index) => {
        const div = document.createElement('div');
        div.textContent = item;
        historyList.appendChild(div);
    });
}

function addToHistory(query) {
    if (query && !searchHistory.includes(query)) {
        searchHistory.unshift(query);
        if (searchHistory.length > 5) searchHistory.pop(); // Limit to 5 recent searches
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        loadHistory();
    }
}

document.querySelector('.search-container').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.querySelector('.search-bar').value.trim();
    if (query) {
        addToHistory(query);
        window.location.href = `${e.target.action}?${e.target.querySelector('input').name}=${encodeURIComponent(query)}`;
    }
});

clearHistoryBtn.addEventListener('click', () => {
    searchHistory = [];
    localStorage.removeItem('searchHistory');
    loadHistory();
});

loadHistory();

// Accent color picker
const accentPicker = document.getElementById('accentColor');
accentPicker.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
    localStorage.setItem('accentColor', e.target.value);
});

const savedAccentColor = localStorage.getItem('accentColor') || '#4CAF50';
document.documentElement.style.setProperty('--accent-color', savedAccentColor);
accentPicker.value = savedAccentColor;
