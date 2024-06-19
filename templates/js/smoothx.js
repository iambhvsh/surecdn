"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("https://cdn.jsdelivr.net/gh/iambhvsh/surecdn/templates/service-worker.js").then(e=>{console.log("ServiceWorker registration successful with scope: ",e.scope)}).catch(e=>{console.log("ServiceWorker registration failed: ",e)})}),document.getElementById("menuButton").addEventListener("click",function(){var e=document.getElementById("dropdownMenu");"none"===e.style.display||""===e.style.display?e.style.display="block":e.style.display="none"}),document.addEventListener("DOMContentLoaded",function(){let e=document.getElementById("searchInputDesktop"),t=document.getElementById("searchInputMobile"),s=document.getElementById("searchResultsDesktop"),i=document.getElementById("searchResultsMobile");function a(e){e.classList.remove("block"),e.classList.add("hidden")}async function n(){try{let e=await fetch("data.json"),t=await e.json();return t}catch(s){console.error("Error fetching data:",s)}}async function l(e,t){let s=await n();if(s){var i,l;let c=s.filter(t=>t.name.toLowerCase().includes(e.toLowerCase()));i=c,(l=t).innerHTML="",i.forEach(e=>{let t=document.createElement("a");t.href=e.link,t.textContent=e.name,t.classList.add("block","px-3","py-2","rounded-md","text-base","font-medium","text-white","hover:text-black"),l.appendChild(t)}),l.classList.remove("hidden"),l.classList.add("block")}else a(t)}document.addEventListener("click",function(n){let l=e.contains(n.target)||s.contains(n.target),c=t.contains(n.target)||i.contains(n.target);l||a(s),c||a(i)}),e.addEventListener("input",function(){let e=this.value.trim();e.length>0?l(e,s):a(s)}),t.addEventListener("input",function(){let e=this.value.trim();e.length>0?l(e,i):a(i)});let c=localStorage.getItem("theme");c&&r(c);let o=document.getElementById("theme-toggle");function r(e){let t=document.body,s=document.getElementById("main"),i=document.getElementById("footer"),a=document.querySelectorAll(".bg-white"),n=document.getElementById("theme-toggle");"dark"===e?(t.classList.remove("bg-white","text-black"),t.classList.add("bg-black","text-white"),s.classList.remove("bg-white"),s.classList.add("bg-black"),i.classList.add("bg-black"),i.classList.add("border-zinc-700"),a.forEach(e=>{e.classList.remove("bg-white","text-black"),e.classList.add("bg-zinc-900","text-white")}),n.innerHTML='<ion-icon name="sunny" class="text-2xl"></ion-icon>',n.classList.remove("text-black"),n.classList.add("text-white")):(t.classList.remove("bg-black","text-white"),t.classList.add("bg-white","text-black"),s.classList.remove("bg-black"),s.classList.add("bg-white"),i.classList.add("bg-white"),i.classList.remove("border-zinc-700"),a.forEach(e=>{e.classList.remove("bg-zinc-900","text-white"),e.classList.add("bg-white","text-black")}),n.innerHTML='<ion-icon name="moon" class="text-2xl"></ion-icon>',n.classList.remove("text-white"),n.classList.add("text-black"))}o.addEventListener("click",function(){let e=document.body;e.classList.contains("bg-white")?(r("dark"),localStorage.setItem("theme","dark")):(r("light"),localStorage.setItem("theme","light")),setTimeout(()=>{location.reload()},1)})});
