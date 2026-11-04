import { umkmData } from "../data.js";
import { bagikan } from "../utils/share.js";

const STORAGE_KEY = "RencanaKunjungan";

let rencanaState = {
    nama: "Rencana Perjalan",
    deskripsi: "",
    items: [],
    dibuat: new Date().toISOString(),
    terakhirDiubah: new Date().toISOString(),
};

function loadState (){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved){
       try {
        rencanaState = { ...rencanaState, ...JSON.parse(saved) };
       } catch (e){
        console.error("Gagal load localStorage:",e);
       }
    }
}

function saveState(){
    rencanaState.terakhirDiubah = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rencanaState));
}

function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}

function renderTempatList() {
  if (rencanaState.items.length === 0) {
    return `<p class="text-gray-400 text-sm text-center py-6">Belum ada rencana kunjungan</p>`;
  }
  return rencanaState.items
    .map(
      (item) => `
    <div class="flex justify-between items-center p-3 border-b hover:bg-gray-50">
      <div class="flex-1">
        <h4 class="font-semibold text-sm">${escapeHtml(item.name)}</h4>
        <p class="text-xs text-gray-500">${escapeHtml(item.category)}</p>
        <p class="text-xs text-gray-400">${escapeHtml(item.address)}</p>
      </div>
      <div class="flex gap-1">
        <button
          class="lihat-peta-btn text-blue-500 hover:bg-blue-50 rounded-full p-2"
          data-lat="${item.lat}"
          data-lng="${item.lng}"
        >
          <i class="fas fa-map-marker-alt text-sm"></i>
        </button>
        <button
          class="hapus-btn text-red-400 hover:bg-red-50 rounded-full p-2"
          data-id="${item.id}"
        >
          <i class="fas fa-trash text-sm"></i>
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

export function renderRencanaKunjungan({sidebarMenu, markers, map}){
    loadState();

    sidebarMenu.innerHTML = `
        <!-- Header -->
        <li class="p-3">
          <button id="backBtn" class="flex items-center gap-2 text-blue-600">
            <i class="fas fa-arrow-left"></i> Kembali
          </button>
        </li>
    
        <!-- Nama + Privacy -->
        <li class="p-3">
          <div class="flex items-center gap-2 mb-2">
            <i class="fas fa-pen text-gray-400 text-sm"></i>
            <input
              type="text"
              id="namaRencanaInput"
              value="${escapeHtml(rencanaState.nama)}"
              placeholder="Nama Rencana"
              class="text-xl font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
             />
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <i class="fas fa-lock"></i>
            <span>Privasi</span>
          </div>
        </li>
    
        <!-- Deskripsi -->
        <li class="p-3">
          <input
            type="text"
            id="deskripsiRencanaInput"
            placeholder="Tambahkan deskripsi rencana"
            value="${escapeHtml(rencanaState.deskripsi)}"
            class="w-full text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
          />
        </li>
    
        <!-- Action buttons -->
        <li class="p-3 flex gap-2">
          <button id="bagikanBtn" class="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100">
            <i class="fas fa-share-alt mr-1"></i> Bagikan
          </button>
          <button id="tambahBtn" class="flex-1 bg-blue-50 text-blue-600 p-2 rounded-full text-sm font-medium hover:bg-blue-100">
            <i class="fas fa-plus mr-1"></i> Tambahkan tempat
          </button>
        </li>
    
        <!-- Search section (hidden by default) -->
        <li id="searchSection" class="p-3 hidden">
          <div class="relative">
            <i class="fas fa-search absolute left-5 top-4 text-gray-400"></i>
            <input
              type="text"
              id="searchTempatInput"
              placeholder="Telusuri tempat"
              class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
            />
            <button id="selesaiBtn" class="absolute right-3 top-3 text-blue-600 text-sm font-medium"></button>
            <div id="searchTempatResult" class="absolute left-0 top-full mt-3 w-full bg-white shadow-lg rounded-xl max-h-80 overflow-y-auto hidden z-50"></div>
          </div>
        </li>
    
        <!-- Statistik -->
        <li class="p-3 text-sm text-gray-500">
          <i class="fas fa-map-marker-alt mr-1"></i>
          ${rencanaState.items.length} tempat
        </li>
    
        <!-- List tempat -->
        <li class="p-3">
          <div id="tempatList" class= "flex flex-col">${renderTempatList()}</div>
        </li>
      `;
    
      // ============ EVENT LISTENERS ============
    
      // Back
      document.getElementById("backBtn").addEventListener("click", () => {
        import("../disimpan.js").then(({ renderDisimpanMenu }) => {
          renderDisimpanMenu({sidebarMenu, markers, map});
        });
      });
    
      // Edit nama
      document.getElementById("namaRencanaInput").addEventListener("input", (e) => {
        rencanaState.nama = e.target.value;
        saveState();
      });
    
      // Edit deskripsi
      document.getElementById("deskripsiRencanaInput").addEventListener("input", (e) => {
        rencanaState.deskripsi = e.target.value;
        saveState();
      });
    
      // Bagikan
      document.getElementById("bagikanBtn").addEventListener("click", () => {
        bagikan({
          title: rencanaState.nama,
          text:`Cek daftar "${rencanaState.nama} di mikro maps`
         });
       });

      // Tambahkan tempat munculin search bar
      document.getElementById("tambahBtn").addEventListener("click", () => {
        const section = document.getElementById("searchSection");
        section.classList.toggle("hidden");
        if (!section.classList.contains("hidden")) {
          document.getElementById("searchTempatInput").focus();
        }
      });
    
      // Selesai sembunyiin search bar
      document.getElementById("selesaiBtn").addEventListener("click", () => {
        document.getElementById("searchSection").classList.add("hidden");
      });
    
      // Search tempat
      const searchInput = document.getElementById("searchTempatInput");
      const searchResult = document.getElementById("searchTempatResult");
    
      searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase().trim();
    
        if (!keyword) {
          searchResult.innerHTML = "";
          searchResult.classList.add("hidden");
          return;
        }
    
        const results = umkmData.filter(
          (u) =>
            u.name.toLowerCase().includes(keyword) ||
            u.address.toLowerCase().includes(keyword)
        );
    
        if (results.length === 0) {
          searchResult.innerHTML = `<p class="text-sm text-gray-400 p-2">Tidak ditemukan</p>`;
          searchResult.classList.remove("hidden");
          return;
        }
    
        searchResult.innerHTML = results
          .map(
            (u) => `
          <div class="flex justify-between items-center p-2 hover:bg-gray-50 border-b cursor-pointer tambah-item-btn"
               data-id="${u.id}">
            <div>
              <p class="font-medium text-sm">${escapeHtml(u.name)}</p>
              <p class="text-xs text-gray-500">${escapeHtml(u.address)}</p>
            </div>
            <i class="fas fa-plus text-blue-500"></i>
          </div>
        `
          )
          .join("");
    
        searchResult.classList.remove("hidden");
    
        searchResult.querySelectorAll(".tambah-item-btn").forEach((el) => {
          el.addEventListener("click", () => {
            const id = parseInt(el.dataset.id, 10);
            const umkm = umkmData.find((u) => u.id === id);
            if (!umkm) return;
    
            const udahAda = rencanaState.items.some((item) => item.id === id);
            if (udahAda) {
              alert("Tempat ini udah ada di daftar");
              return;
            }
    
            rencanaState.items.push({
              id: umkm.id,
              name: umkm.name,
              address: umkm.address,
              category: umkm.category,
              lat: umkm.lat,
              lng: umkm.lng,
            });
            saveState();
    
            // Update list + statistik
            document.getElementById("tempatList").innerHTML = renderTempatList();
            bindHapusButtons();
            lihatPeta();
    
            // Update statistik
            const stat = document.querySelector(".text-sm.text-gray-500");
            // simple: re-render aja
            renderRencanaKunjungan({ sidebarMenu, markers, map });
          });
        });
      });
    
      // Hapus item
      function bindHapusButtons() {
        sidebarMenu.querySelectorAll(".hapus-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id, 10);
            rencanaState.items = rencanaState.items.filter((item) => item.id !== id);
            saveState();
            renderRencanaKunjungan({ sidebarMenu, markers, map });
          });
        });
      }
    
    

      //lihat di peta
      function lihatPeta(){
        sidebarMenu.querySelectorAll(".lihat-peta-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const lat = parseFloat(btn.dataset.lat);
            const lng = parseFloat(btn.dataset.lng);
            map.setView([lat, lng], 18);
          });
        });
      }

      bindHapusButtons();
      lihatPeta();
}