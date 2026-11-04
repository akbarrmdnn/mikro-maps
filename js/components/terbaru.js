import { umkmData } from "../data.js";
import { initSearch } from "../search.js";
import { bagikan } from "../utils/share.js";


function formatRelativeTime(dateStr){
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Tanggal tidak valid";
  const now = new Date();
  const diffMs = now-date;

  //waktu masa depan
  if (diffMs < 0 ) return "Baru akan datang";

  const diffMins = Math.floor(diffMs/60000);
  const diffHours = Math.floor(diffMs/3600000);
  const diffDays = Math.floor(diffMs/86400000);
  if (diffMins < 1) return "Baru Saja";
  if (diffMins < 60) return `${diffMins} Menit lalu`;
  if (diffHours < 24) return `${diffHours} Jam lalu`;
  if (diffDays < 7) return `${diffDays} Hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} Minggu lalu`;
  return `${Math.floor(diffDays/30)} Bulan lalu`;
}

//sortir data dari yang terbaru ke yang terlama
function getSortedUmkm(){
 // Gabungin data seed + data user
  const seed = [...umkmData];
  const fromUser = JSON.parse(localStorage.getItem("umkmPartisipasi") || "[]");
  const all = [...seed, ...fromUser];
  
  // Sort by createdAt desc
  return all.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function renderTerbaruList(sorted) {
  if (sorted.length === 0) {
    return `<p class="text-gray-400 text-sm text-center py-6">Belum ada UMKM</p>`;
  }

  return sorted
    .map(
      (umkm) => `
    <div class="terbaru-item flex gap-3 p-3 bg-gray-100 rounded-xl mb-2 hover:bg-gray-200 cursor-pointer"
         data-lat="${umkm.lat}" data-lng="${umkm.lng}">
      <img src="${umkm.image}" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="${umkm.name}">
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-sm truncate">${umkm.name}</h4>
        <p class="text-xs text-gray-600">⭐ ${umkm.rating} • ${umkm.category}</p>
        <p class="text-xs text-gray-500 truncate">📍 ${umkm.address}</p>
        <p class="text-xs text-gray-400 mt-1">🕐 ${formatRelativeTime(umkm.createdAt)}</p>
      </div>
      <button class="flex-shrink-0 w-6 h-6 border-2 border-gray-400 rounded"></button>
    </div>
  `
    )
    .join("");
}

export function renderTerbaru({ sidebarMenu, markers, map }) {
  const sorted = getSortedUmkm();

  sidebarMenu.innerHTML = `
    <!-- Header: Search -->
    <li class="p-3">
      <div class="relative">
        <i class="fas fa-search absolute left-5 top-4 text-black"></i>
        <input 
          type="text" 
          id="terbaruSearchInput"
          placeholder="Telusuri daftar..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          autocomplete="off"
        />
        <div id= "terbaruSearchResult" 
            class="absolute left-0 top-full mt-3 w-full bg-white shadow-lg rounded-xl 
            max-h-80 overflow-y-auto hidden z-50 
            ">
        </div>
      </div>
    </li>

    <!-- Kembali -->
    <li class="p-2">
      <button id="backBtn" class="flex items-center gap-2 text-blue-600 text-sm">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
    </li>

    <!-- Judul -->
    <li class="p-3 pt-0">
      <h2 class="text-2xl font-medium flex items-center gap-2">
        Terbaru
        <i class="fas fa-info-circle text-gray-400 text-sm"></i>
      </h2>
    </li>

    <!-- Subtitle -->
    <li class="p-3 pt-0">
      <p class="text-sm font-medium text-gray-700">3 hari terakhir (${sorted.length})</p>
    </li>

    <!-- List -->
    <li class="p-3">
      <div id="terbaruList">${renderTerbaruList(sorted)}</div>
    </li>

    <!-- Footer action -->
    <li class="p-3 border-t mt-auto">
      <div class="flex items-center justify-between">
        <div class="flex gap-1">
          <button class="p-2 hover:bg-gray-100 rounded-full">
            <i class="fas fa-bookmark text-gray-600"></i>
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-full">
            <i class="fas fa-link text-gray-600"></i>
          </button>
          <button id = "bagikanBtn" class="p-2 hover:bg-gray-100 rounded-full">
            <i class="fas fa-share-alt text-gray-600"></i>
          </button>
        </div>
        <button class="text-sm text-blue-600 font-medium">Pilih semua</button>
      </div>
    </li>
  `;
   initSearch(markers, map, "terbaruSearchInput", "terbaruSearchResult");
   

  // Back
  document.getElementById("backBtn").addEventListener("click", () => {
    import("../disimpan.js").then(({ renderMainMenu }) => {
      renderMainMenu(markers, map);
    });
  });

  // Klik item
  sidebarMenu.querySelectorAll(".terbaru-item").forEach((el) => {
    el.addEventListener("click", () => {
      const lat = parseFloat(el.dataset.lat);
      const lng = parseFloat(el.dataset.lng);
      map.setView([lat, lng], 18);
    });
  });

  //bagikan
  document.getElementById("bagikanBtn").addEventListener("click", () => {
    const totalUMKM = getSortedUmkm().length;
    bagikan({
      title: "Terbaru - Mikro Maps",
      text: `Cek daftar "${totalUMKM} di mikro maps`
    })
  })
}