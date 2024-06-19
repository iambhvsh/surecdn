// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('https://cdn.jsdelivr.net/gh/iambhvsh/surecdn/templates/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

document.getElementById('menuButton').addEventListener('click', function() {
  var dropdownMenu = document.getElementById('dropdownMenu');
  if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
    dropdownMenu.style.display = 'block';
  } else {
    dropdownMenu.style.display = 'none';
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const searchInputDesktop = document.getElementById("searchInputDesktop");
  const searchInputMobile = document.getElementById("searchInputMobile");
  const searchResultsDesktop = document.getElementById("searchResultsDesktop");
  const searchResultsMobile = document.getElementById("searchResultsMobile");

  // Show search results
  function showResults(results, resultsContainer) {
    resultsContainer.innerHTML = "";
    results.forEach(result => {
      const anchor = document.createElement("a");
      anchor.href = result.link;
      anchor.textContent = result.name;
      anchor.classList.add("block", "px-3", "py-2", "rounded-md", "text-base", "font-medium", "text-white", "hover:text-black");
      resultsContainer.appendChild(anchor);
    });
    resultsContainer.classList.remove("hidden");
    resultsContainer.classList.add("block");
  }

  // Hide search results
  function hideResults(resultsContainer) {
    resultsContainer.classList.remove("block");
    resultsContainer.classList.add("hidden");
  }

  // Close search results when clicking outside
  document.addEventListener("click", function(event) {
    const isClickInsideDesktop = searchInputDesktop.contains(event.target) || searchResultsDesktop.contains(event.target);
    const isClickInsideMobile = searchInputMobile.contains(event.target) || searchResultsMobile.contains(event.target);

    if (!isClickInsideDesktop) {
      hideResults(searchResultsDesktop);
    }
    if (!isClickInsideMobile) {
      hideResults(searchResultsMobile);
    }
  });

  // Fetch data from JSON file
  async function fetchData() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Filter results based on input
  async function filterResults(query, resultsContainer) {
    const data = await fetchData();
    if (data) {
      const filteredResults = data.filter(result => result.name.toLowerCase().includes(query.toLowerCase()));
      showResults(filteredResults, resultsContainer);
    } else {
      hideResults(resultsContainer);
    }
  }

  // Event listeners for input
  searchInputDesktop.addEventListener("input", function() {
    const query = this.value.trim();
    if (query.length > 0) {
      filterResults(query, searchResultsDesktop);
    } else {
      hideResults(searchResultsDesktop);
    }
  });

  searchInputMobile.addEventListener("input", function() {
    const query = this.value.trim();
    if (query.length > 0) {
      filterResults(query, searchResultsMobile);
    } else {
      hideResults(searchResultsMobile);
    }
  });

  // Check saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  }

  const toggleButton = document.getElementById('theme-toggle');
  toggleButton.addEventListener('click', function() {
    const body = document.body;

    if (body.classList.contains('bg-white')) {
      applyTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      applyTheme('light');
      localStorage.setItem('theme', 'light');
    }

    // Reload page after 3 seconds
    setTimeout(() => {
      location.reload();
    }, 1);
  });

  function applyTheme(theme) {
    const body = document.body;
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');
    const cards = document.querySelectorAll('.bg-white');
    const toggleButton = document.getElementById('theme-toggle');

    if (theme === 'dark') {
      body.classList.remove('bg-white', 'text-black');
      body.classList.add('bg-black', 'text-white');
      main.classList.remove('bg-white');
      main.classList.add('bg-black');
      footer.classList.add('bg-black');
      footer.classList.add('border-zinc-700');
      cards.forEach(card => {
        card.classList.remove('bg-white', 'text-black');
        card.classList.add('bg-zinc-900', 'text-white');
      });
      toggleButton.innerHTML = '<ion-icon name="sunny" class="text-2xl"></ion-icon>';
      toggleButton.classList.remove('text-black');
      toggleButton.classList.add('text-white');
    } else {
      body.classList.remove('bg-black', 'text-white');
      body.classList.add('bg-white', 'text-black');
      main.classList.remove('bg-black');
      main.classList.add('bg-white');
      footer.classList.add('bg-white');
      footer.classList.remove('border-zinc-700');
      cards.forEach(card => {
        card.classList.remove('bg-zinc-900', 'text-white');
        card.classList.add('bg-white', 'text-black');
      });
      toggleButton.innerHTML = '<ion-icon name="moon" class="text-2xl"></ion-icon>';
      toggleButton.classList.remove('text-white');
      toggleButton.classList.add('text-black');
    }
  }
});

// Clear data stored in localStorage and cached by the service worker
const clearButton = document.getElementById('clear-data');
clearButton.addEventListener('click', async function() {
  // Clear localStorage
  localStorage.clear();
  console.log('Local storage cleared');

  // Clear caches
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    await caches.delete(cacheName);
    console.log(`Cache ${cacheName} cleared`);
  }

  // Optionally, unregister the service worker
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
      console.log('Service worker unregistered');
    }
  }
  location.reload();
});
// Console message to clear localStorage
function showConsoleClearMessage() {
  console.log("%cClick here to clear localStorage data", "color: blue; text-decoration: underline; cursor: pointer;");
}

// Add event listener to the console message
function setupConsoleLink() {
  if (window.console && console.log) {
    showConsoleClearMessage();
    console.log = (function(oldLog) {
      return function(message) {
        if (message === "Click here to clear localStorage data") {
          document.getElementById('clear-data').click();
        }
        oldLog.apply(console, arguments);
      };
    })(console.log);
  }
}

setupConsoleLink();
