import { umkmData } from "../data.js";

const STORAGE_KEY = "TempatBerbintang";

let tempatState= {
   nama : "Tempat Berbintang",
   deskripsi : "",
   items: [],
   dibuat: new Date().toISOString(),
   terakhirDiubah: new Date().toISOString(),
};

function loadState(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved){
        try{
            tempatState = {...tempatState, ...JSON.parse(saved)};
        }catch(e) {
            console.error("Gagal load localstorage:", e);
        }
    }
}

function saveState(){
    tempatState.terakhirDiubah= new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tempatState));
}

function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}

function renderTempatList(){
    if (tempatState.items.length === 0 ){
        return `<p class = "text-gray-400 text-sm text-center py-6">Belum ada tempat favorit</p>`;
    }
    return tempatState.items.map((item)=>`
     <div class = "flex justify-between items-center p-3 border-b hover: bg-gray-50">
         <div class= "flex-1">
             <h4 class= "font-semibold text-sm">${escapeHtml(item.name)}</h4>
             <p class= "text-xs text-gray-500">${escapeHtml(item.category)}</p>
             <p class = "text-xs text-gray-400">${escapeHtml(item.address)}</p>
          </div>
          <div class = "flex gap-1">
              <button
                class= "lihat-peta-btn text-blue-500 hover:bg-blue-50 rounded-full p-2"
                data-lat= "${item.lat}"
                data-lng= "${item.lng}"
              <
              </button>
              <i class = "fas fa-map-marker-alt text-sm"></i>
              <button class="hapus-btn text-red-400 hover:bg-red-50 rounded-full p-2" data-id="${item.id}">
               <i class="fas fa-trash text-sm"></i>
              </button> 
          </div>       
     </div>
    `).join("");
}

export function renderBerbintang({sidebarMenu, markers, map}){
    loadState();

    sidebarMenu.innerHTML=`
    <!---header-->
    <li class= "p-3">
       <button id="backBtn" class= "flex items-center text-blue-600 gap-2">
          <i class="fas fa-arrow-left"></i> Kembali
       </button>    
    </li>

    <!---Privacy+ Nama--->
    <li class="p-3">
       <div class= "flex items-center gap-2 mb-3">
         <i class = "fas fa-pen text-gray-400 text-sm"></i>
         <input
         type="text"
         id= "namaBerbintangInput"
         value="${escapeHtml(tempatState.nama)}"
         placeholder= "Tempat Berbintang"
         class="text-xl font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
         />
       </div>
       <div class= "flex items-center gap-2 text-sm text-gray-400">
          <i class= "fas fa-lock"></i>
          <span>Privasi</span>
       </div>
    </li>

    <!---Deskripsi--->
    <li class= "p-3">
      <input
      type="text"
      id= "deskripsiBerbintangInput"
      value="${escapeHtml(tempatState.deskripsi)}"
      placeholder = "Deskripsi Tempat Berbintang"
      class = "text-xl font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
      />
    </li>

    <!---Action Button--->
    <li class = "p-3 flex gap-2">
      <button id= "tambahBtn" class= "flex-1 bg-blue-300 text-blue-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100">
         <i class= "fas fa-plus mr-1"></i>Tambahkan tempat
      </button>
    </li>

    <!-- Search Section (hidden input)-->
    <li id= "berbintangSearchSection" class= "p-3 hidden">
      <div class= "relative">
         <i class = "fas fa-search absolute left-5 top-4 text-gray-400"></i>
         <input
           type= "text"
           id= "searchBerbintangInput"
           placeholder= "Telusuri tempat"
           class = "w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
          />
         <button id="selesaiBtn" class= "absolute right-3 top-3 text-blue-600 text-sm font-medium"></button>
         <div id= "searchBerbintangResult" class= "absolute left-0 top-full mt-3 w-full bg-white shadow-lg rounded-xl max-h-80 overflow-y-auto hidden z-50"></div>
      </div>
    </li>

    <!-- Statistik-->
    <li class= "p-3 text-sm text-gray-400">
        <i class="fas fa-map-marker-alt mr-1"></i>
        ${tempatState.items.length} tempat
    </li>

    <!-- List Tempat-->
    <li class = "p-3">
      <div id= "tempatList" class= "flex flex-col">${renderTempatList()}</div>
    </li>
    `;

    // event listener

    //back
    document.getElementById("backBtn").addEventListener("click", () => {
        import("../disimpan.js").then(({renderDisimpanMenu}) => {
            renderDisimpanMenu({sidebarMenu, markers, map});
        });
    });

    //edit nama
    document.getElementById("namaBerbintangInput").addEventListener("input", (e) => {
        tempatState.nama = e.target.value;
        saveState();
    });

    //deskripsi 
    document.getElementById("deskripsiBerbintangInput").addEventListener("input", (e) => {
        tempatState.deskripsi = e.target.value;
        saveState();
    });

    //tambah tempat
    document.getElementById("tambahBtn").addEventListener("click", () => {
        const section = document.getElementById("berbintangSearchSection");
        section.classList.toggle("hidden");
        if (!section.classList.contains("hidden")) {
          document.getElementById("searchBerbintangInput").focus();
        }
    });

    //sembunyin search bar
    document.getElementById("selesaiBtn").addEventListener("click", () => {
        document.getElementById("searchSection").classList.add("hidden");
    });

    //search tempaat
    const searchInput = document.getElementById("searchBerbintangInput");
    const searchResult = document.getElementById("searchBerbintangResult");

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
        
                const udahAda = tempatState.items.some((item) => item.id === id);
                if (udahAda) {
                  alert("Tempat ini udah ada di daftar");
                  return;
                }
        
                tempatState.items.push({
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
        
                // Update statistik
                const stat = document.querySelector(".text-sm.text-gray-500");
                // simple: re-render aja
                renderBerbintang({ sidebarMenu, markers, map });
            });
        });
    });

    // Hapus item
        function bindHapusButtons() {
          sidebarMenu.querySelectorAll(".hapus-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
              const id = parseInt(btn.dataset.id, 10);
              tempatState.items = tempatState.items.filter((item) => item.id !== id);
              saveState();
              renderBerbintang({ sidebarMenu, markers, map });
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