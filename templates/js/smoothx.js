document.addEventListener("DOMContentLoaded", () => {
  const CACHE_EXPIRATION_MS = 108e5; // 3 hours
  const LOCAL_STORAGE_KEY = "cacheTimestamp";

  checkAndUpdateCache();
  registerServiceWorker();
  initializeComponents();

  async function checkAndUpdateCache() {
    const cacheTimestamp = localStorage.getItem(LOCAL_STORAGE_KEY);
    const currentTime = Date.now();

    if (!cacheTimestamp || currentTime - cacheTimestamp > CACHE_EXPIRATION_MS) {
      await clearStorageAndCache();
      localStorage.setItem(LOCAL_STORAGE_KEY, currentTime);
    }
  }

  async function clearStorageAndCache() {
    localStorage.clear();
    console.log("Local storage cleared");

    const cacheKeys = await caches.keys();
    for (const cacheKey of cacheKeys) {
      await caches.delete(cacheKey);
      console.log(`Cache ${cacheKey} cleared`);
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log("Service worker unregistered");
      }
    }

    location.reload();
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then(registration => console.log("ServiceWorker registered with scope:", registration.scope))
          .catch(error => console.log("ServiceWorker registration failed:", error));
      });
    }
  }

  function initializeComponents() {
    const components = [
      { type: 'search', inputs: ["searchInputDesktop", "searchInputMobile"], results: ["searchResultsDesktop", "searchResultsMobile"], dataUrl: "data.json" },
      { type: 'themeToggle', toggleId: "theme-toggle" },
      { type: 'menuToggle', buttonId: "menuButton", menuId: "dropdownMenu" },
      { type: 'clearData', buttonId: "clear-data" }
    ];

    components.forEach(component => {
      switch (component.type) {
        case 'search':
          component.inputs.forEach((inputId, index) => createSearchComponent(inputId, component.results[index], component.dataUrl));
          break;
        case 'themeToggle':
          createThemeToggleComponent(component.toggleId);
          break;
        case 'menuToggle':
          createMenuToggleComponent(component.buttonId, component.menuId);
          break;
        case 'clearData':
          initializeClearData(component.buttonId);
          break;
      }
    });
  }

  function createSearchComponent(inputId, resultsId, dataUrl) {
    const searchInput = document.getElementById(inputId);
    const searchResults = document.getElementById(resultsId);

    document.addEventListener("click", event => {
      if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
        toggleElement(searchResults, false);
      }
    });

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      query.length > 0 ? showResults(query, searchResults) : toggleElement(searchResults, false);
    });

    async function fetchData() {
      try {
        const response = await fetch(dataUrl);
        return response.json();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function showResults(query, resultsContainer) {
      const data = await fetchData();
      if (data) {
        const filteredData = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        resultsContainer.innerHTML = filteredData.map(item =>
          `<a href="${item.link}" class="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-black">${item.name}</a>`
        ).join('');
        toggleElement(resultsContainer, true);
      } else {
        toggleElement(resultsContainer, false);
      }
    }
  }

  function createThemeToggleComponent(toggleButtonId) {
    const themeToggleButton = document.getElementById(toggleButtonId);
    const theme = localStorage.getItem("theme");
    if (theme) applyTheme(theme);

    themeToggleButton.addEventListener("click", () => {
      const newTheme = document.body.classList.contains("bg-white") ? "dark" : "light";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      setTimeout(() => location.reload(), 1);
    });

    function applyTheme(theme) {
      const classes = ["bg-white", "bg-black", "text-black", "text-white", "bg-zinc-900", "border-zinc-700"];
      const elements = [document.body, document.getElementById("main"), document.getElementById("footer"), ...document.querySelectorAll(".bg-white")];
      
      elements.forEach(el => {
        if (el) classes.forEach(cls => el.classList.toggle(cls, theme === "dark"));
      });
      
      themeToggleButton.innerHTML = theme === "dark" 
        ? '<ion-icon name="sunny" class="text-2xl"></ion-icon>' 
        : '<ion-icon name="moon" class="text-2xl"></ion-icon>';
    }
  }

  function createMenuToggleComponent(buttonId, menuId) {
    const menuButton = document.getElementById(buttonId);
    const dropdownMenu = document.getElementById(menuId);

    if (menuButton && dropdownMenu) {
      menuButton.addEventListener("click", () => {
        toggleElement(dropdownMenu, !dropdownMenu.classList.contains("opacity-100"));
      });
    }
  }

  function initializeClearData(clearButtonId) {
    const clearButton = document.getElementById(clearButtonId);
    if (clearButton) {
      clearButton.addEventListener("click", async () => {
        await clearStorageAndCache();
      });
    }
  }

  function toggleElement(element, show) {
    element.classList.toggle("block", show);
    element.classList.toggle("hidden", !show);
  }
});
