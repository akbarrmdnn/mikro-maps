import { umkmData } from "../data.js";
import { bagikan } from "../utils/share.js";

const STORAGE_KEY = "Favorit";

let favoritState = {
    nama: "Favorit",
    deskripsi: "",
    items:[],
    dibuat: new Date().toISOString(),
    terakhirDiubah: new Date().toISOString(),
};

function loadState(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved){
        try{
            favoritState = {...favoritState, ... JSON.parse(saved)}
        }catch(e){
            console.error("Gagal load localstorage", e);
        }
    }
}

function saveState(){
    favoritState.terakhirDiubah = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritState));
}

function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}

function renderTempatList (){
     if(favoritState.items.length === 0){
       return `<p class = "text-center text-sm text-gray-400 py-6">Belum ada tempat favorit</p>`
    }
    return favoritState.items.map((item)=>`
          <div class="flex justify-between p-3 border-b hover:bg-gray-50">
             <div class = "flex-1">
                 <h4 class= "font-semibold text-sm">${escapeHtml(item.name)}</h4>
                 <p class= "text-xs text-gray-500">${escapeHtml(item.category)}</p>
                 <p class= "text-xs text-gray-400">${escapeHtml(item.address)}</p>
             </div>
             <div class= "flex gap-1">
               <button
                  class = "lihat-peta-btn text-blue-500 hover:bg-blue-50 rounded-full p-2"
                  data-lat= "${item.lat}"
                  data-lng= "${item.lng}"
                >
                  <i class = "fas fa-map-marker-alt text-sm"></i>
                </button>
                <button class="hapus-btn text-red-400 hover:bg-red-50 rounded-full p-2" data-id="${item.id}">
                 <i class="fas fa-trash text-sm"></i>
                </button>
             </div>         
          </div>
      
    `).join("");
}

export function renderFavorit ({sidebarMenu, markers, map}){
    loadState();

    sidebarMenu.innerHTML = `
    <!--header-->
    <li class = "p-3">
       <button id= "backBtn" class= "flex items-center gap-2 text-blue-600">
          <i class = "fas fa-arrow-left"></i>Kembali 
       </button>
    </li>

    <!-- nama + privacy -->
    <li class="p-3">
        <div class="flex items-center gap-2 mb-2">
             <i class="fas fa-pen text-gray-400 text-sm"></i>
             <input
              type="text"
              id="namaFavoritInput"
              value="${escapeHtml(favoritState.nama)}"
              placeholder="Nama Favorit"
              class="text-xl font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
             />
        </div>
         <div class="flex items-center gap-2 text-sm text-gray-500">
             <i class="fas fa-lock"></i>
             <span>Privasi</span>
        </div>
    </li>

    <!-- deskripsi -->
    <li class="p-3">
        <input
          type="text"
          id="deskripsiFavoritInput"
          placeholder="Tambahkan deskripsi favorit"
          value="${escapeHtml(favoritState.deskripsi)}"
          class="w-full text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
        />
    </li>
 
    <!-- action buttons -->
    <li class="p-3 flex gap-2">
        <button id="bagikanBtn" class="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100">
         <i class="fas fa-share-alt mr-1"></i> Bagikan
        </button>
        <button id="tambahBtn" class="flex-1 bg-blue-50 text-blue-600 p-2 rounded-full text-sm font-medium hover:bg-blue-100">
          <i class="fas fa-plus mr-1"></i> Tambahkan tempat
        </button>
    </li>

    <!-- search section (hidden) -->
    <li id="searchSection" class="p-3 hidden">
      <div class="relative">
         <i class="fas fa-search absolute left-5 top-4 text-gray-400"></i>
            <input
              type="text"
              id="searchFavoritInput"
              placeholder="Telusuri tempat"
              class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
            />
            <button id="selesaiBtn" class="absolute right-1 top-3 text-blue-600 text-sm font-medium"></button>
            <div id="searchFavoritResult" class="absolute left-0 top-full mt-3 w-full bg-white shadow-lg rounded-xl max-h-80 overflow-y-auto hidden z-50"></div>
        </div>
    </li>

    <!-- Statistik -->
    <li class="p-3 text-sm text-gray-500">
          <i class="fas fa-map-marker-alt mr-1"></i>
          ${favoritState.items.length} tempat
    </li>

    <!-- List tempat -->
    <li class="p-3">
     <div id="tempatList" class= "flex flex-col">${renderTempatList()}</div>
    </li>

    `;

    //eventlistener

    //back 
    document.getElementById("backBtn").addEventListener("click", () => {
        import("../disimpan.js").then(({renderDisimpanMenu}) =>{
            renderDisimpanMenu({sidebarMenu, markers, map});
        });
    });

    //edit nama
    document.getElementById("namaFavoritInput").addEventListener("input", (e) =>{
        favoritState.nama = e.target.value;
        saveState();
    });

    //edit deskripsi
    document.getElementById("deskripsiFavoritInput").addEventListener("input", (e) => {
        favoritState.deskripsi = e.target.value;
        saveState();
    });

    //bagikan
    document.getElementById("bagikanBtn").addEventListener("click", () => {
       bagikan({
        title: favoritState.nama,
        text:`Cek daftar "${favoritState.nama} di mikro maps`
       });
    });

    //tambah tempat munculin searchbar
    document.getElementById("tambahBtn").addEventListener("click", () => {
        const section = document.getElementById("searchSection");
        section.classList.toggle("hidden");
        if (!section.classList.contains("hidden")){
            document.getElementById("searchFavoritInput").focus();
        }
    });

    //selesai(sembunyin search bar)
    document.getElementById("selesaiBtn").addEventListener("click", () =>{
        document.getElementById("searchSection").classList.add("hidden");
    });

    //search tempat
    const searchInput = document.getElementById("searchFavoritInput");
    const searchResult = document.getElementById("searchFavoritResult");

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase().trim();

        if (!keyword){
            searchResult.innerHTML = "";
            searchResult.classList.add("hidden");
            return;
        }

        const results = umkmData.filter(
            (u) =>
             u.name.toLowerCase().includes(keyword) ||
             u.address.toLowerCase().includes(keyword)
        );

        if (results.length === 0){
            searchResult.innerHTML = `<p class= "text-sm text-gray-400 p-2">Tidak ditemukan</p>`;
            searchResult.classList.remove("hidden");
            return;
        }

        searchResult.innerHTML = results
         .map(
           (u) =>`
         <div class="flex justify-between items-center p-2 hover:bg-gray-50 border-b cursor-pointer tambah-item-btn"
             data-id="${u.id}">
             <div>
                  <p class="font-medium text-sm">${escapeHtml(u.name)}</p>
                 <p class="text-xs text-gray-400">${escapeHtml(u.address)}</p>
              </div>
              <i class="fas fa-plus text-blue-500"></i>
          </div>
        `
        )
        .join("");

        searchResult.classList.remove("hidden");

        searchResult.querySelectorAll(".tambah-item-btn").forEach((el)=> {
            el.addEventListener("click", () => {
                const id = parseInt(el.dataset.id, 10);
                const umkm = umkmData.find((u) => u.id === id);
                if (!umkm) return;

                const udahAda = favoritState.items.some((item)=> item.id === id);
                if (udahAda){
                    alert ("Tempat ini sudah ada di daftar");
                    return;
                }

                favoritState.items.push({
                    id: umkm.id,
                    name: umkm.name,
                    address: umkm.address,
                    category: umkm.category,
                    lat: umkm.lat,
                    lng: umkm.lng,
                });
                saveState();

                //update list dan statistik
                document.getElementById("tempatList").innerHTML = renderTempatList();
                bindHapusButtons();

                //update statistik
                const stat = document.querySelector(".text-sm.text-gray-500");
                //simple render
                renderFavorit({sidebarMenu, markers, map});

            });
        });
    });

    //hapus item
    function bindHapusButtons() {
        sidebarMenu.querySelectorAll(".hapus-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id, 10);
                favoritState.items = favoritState.items.filter((item) => item.id !== id);
                saveState();
                renderFavorit({ sidebarMenu, markers, map });
            });
        });
    }

    //lihat peta
    function lihatPeta(){
        sidebarMenu.querySelectorAll(".lihat-peta-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const lat = parseFloat(btn.dataset.lat);
                const lng = parseFloat(btn.dataset.lng);
                map.setView([lat, lng], 18);
            })
        })
    }
        
    bindHapusButtons();
    lihatPeta();
}