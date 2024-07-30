const CACHE_EXPIRATION_MS = 3 * 60 * 60 * 1000;
const LOCAL_STORAGE_KEY = 'cacheTimestamp';

function checkAndUpdateCache() {
    const timestamp = localStorage.getItem(LOCAL_STORAGE_KEY);
    const now = Date.now();

    if (!timestamp || (now - timestamp > CACHE_EXPIRATION_MS)) {
        clearStorageAndCache();
        localStorage.setItem(LOCAL_STORAGE_KEY, now);
    }
}

async function clearStorageAndCache() {
    localStorage.clear();
    console.log("Local storage cleared");

    let cacheKeys = await caches.keys();
    for (let key of cacheKeys) {
        await caches.delete(key);
        console.log(`Cache ${key} cleared`);
    }

    if ("serviceWorker" in navigator) {
        let registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
            await registration.unregister();
            console.log("Service worker unregistered");
        }
    }
    location.reload();
}

// Check cache expiration on page load
checkAndUpdateCache();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("https://surecdn.vercel.app/templates/service-worker.js")
            .then(e => {
                console.log("ServiceWorker registration successful with scope: ", e.scope);
            })
            .catch(e => {
                console.log("ServiceWorker registration failed: ", e);
            });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    let e = document.getElementById("searchInputDesktop"),
        t = document.getElementById("searchInputMobile"),
        s = document.getElementById("searchResultsDesktop"),
        a = document.getElementById("searchResultsMobile");

    function l(e) {
        e.classList.remove("block");
        e.classList.add("hidden");
    }

    async function i() {
        try {
            let e = await fetch("data.json");
            let t = await e.json();
            return t;
        } catch (s) {
            console.error("Error fetching data:", s);
        }
    }

    async function n(e, t) {
        let s = await i();
        if (s) {
            let o = s.filter(t => t.name.toLowerCase().includes(e.toLowerCase()));
            t.innerHTML = "";
            o.forEach(e => {
                let t = document.createElement("a");
                t.href = e.link;
                t.textContent = e.name;
                t.classList.add("block", "px-3", "py-2", "rounded-md", "text-base", "font-medium", "text-white", "hover:text-black");
                t.appendChild(t);
            });
            t.classList.remove("hidden");
            t.classList.add("block");
        } else {
            l(t);
        }
    }

    document.addEventListener("click", function(i) {
        let n = e.contains(i.target) || s.contains(i.target),
            o = t.contains(i.target) || a.contains(i.target);
        if (!n) l(s);
        if (!o) l(a);
    });

    e.addEventListener("input", function() {
        let e = this.value.trim();
        if (e.length > 0) n(e, s);
        else l(s);
    });

    t.addEventListener("input", function() {
        let e = this.value.trim();
        if (e.length > 0) n(e, a);
        else l(a);
    });

    let o = localStorage.getItem("theme");
    if (o) r(o);

    let c = document.getElementById("theme-toggle");

    function r(e) {
        let t = document.body,
            s = document.getElementById("main"),
            a = document.getElementById("footer"),
            l = document.querySelectorAll(".bg-white"),
            i = document.getElementById("theme-toggle");

        if (e === "dark") {
            t.classList.remove("bg-white", "text-black");
            t.classList.add("bg-black", "text-white");
            s.classList.remove("bg-white");
            s.classList.add("bg-black");
            a.classList.add("bg-black");
            a.classList.add("border-zinc-700");
            l.forEach(e => {
                e.classList.remove("bg-white", "text-black");
                e.classList.add("bg-zinc-900", "text-white");
            });
            i.innerHTML = '<ion-icon name="sunny" class="text-2xl"></ion-icon>';
            i.classList.remove("text-black");
            i.classList.add("text-white");
        } else {
            t.classList.remove("bg-black", "text-white");
            t.classList.add("bg-white", "text-black");
            s.classList.remove("bg-black");
            s.classList.add("bg-white");
            a.classList.add("bg-white");
            a.classList.remove("border-zinc-700");
            l.forEach(e => {
                e.classList.remove("bg-zinc-900", "text-white");
                e.classList.add("bg-white", "text-black");
            });
            i.innerHTML = '<ion-icon name="moon" class="text-2xl"></ion-icon>';
            i.classList.remove("text-white");
            i.classList.add("text-black");
        }
    }

    c.addEventListener("click", function() {
        let e = document.body;
        if (e.classList.contains("bg-white")) {
            r("dark");
            localStorage.setItem("theme", "dark");
        } else {
            r("light");
            localStorage.setItem("theme", "light");
        }
        setTimeout(() => {
            location.reload();
        }, 1);
    });
});

const menuButton = document.getElementById('menuButton');
if (menuButton) {
    menuButton.addEventListener('click', function() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (dropdownMenu) {
            if (dropdownMenu.classList.contains('opacity-0')) {
                dropdownMenu.classList.remove('opacity-0', 'max-h-0');
                dropdownMenu.classList.add('opacity-100', 'max-h-screen');
            } else {
                dropdownMenu.classList.remove('opacity-100', 'max-h-screen');
                dropdownMenu.classList.add('opacity-0', 'max-h-0');
            }
        }
    });
}

const clearButton = document.getElementById("clear-data");

clearButton.addEventListener("click", async function() {
    await clearStorageAndCache();
});
