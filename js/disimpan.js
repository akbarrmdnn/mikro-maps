import { initSearch } from "./search.js";
import { renderDaftarTerbaru } from "./components/daftarTerbaru.js";
import { renderDaftarTanpaJudul } from "./components/daftarTanpaJudul.js";
import { renderRencanaKunjungan } from "./components/rencanaKunjungan.js";
import { renderBerbintang } from "./components/tempatBerbintang.js";
import { renderFavorit } from "./components/favorit.js";
import { renderTerbaru } from "./components/terbaru.js";
import { renderPartisipasi } from "./components/partisipasi.js";


export function renderMainMenu(markers, map){
  const sidebarMenu = document.getElementById("sidebarMenu"); 
  sidebarMenu.innerHTML=`
<li>
  <a href="#" id="menuDisimpan" class="py-4">
  <i class ="fas fa-bookmark mr-3"></i>Disimpan
  </a>
</li>
<li>
  <a href="#" id="menuTerbaru" class="py-4">
  <i class ="fas fa-history mr-3"></i>Terbaru
  </a>
</li>
<li>
  <a href="#" id="menuPartisipasi" class="py-4">
  <i class ="fas fa-comment-medical  mr-3"></i>Partisipasi
  </a>
</li>
`;
document.getElementById("menuDisimpan")
.addEventListener("click", () => renderDisimpanMenu({sidebarMenu,markers, map}));

document.getElementById("menuTerbaru")
.addEventListener("click", () => renderTerbaru({sidebarMenu, markers, map}));

document.getElementById("menuPartisipasi")
.addEventListener("click", () => renderPartisipasi({sidebarMenu, markers, map}));
}

export function renderDisimpanMenu ({sidebarMenu, markers, map}){
    sidebarMenu.innerHTML = ` 
        <li class= "py-3">
           <div class= "relative">
             <i class = "fas fa-search absolute left-5 top-4 text-black"></i>
              <input 
               type="text" 
               id="sidebarSearchInput"
               placeholder="Telusuri daftar..."
               class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
               autocomplete= "off"
             />
    
              <div id= "sidebarSearchResult" 
               class="absolute left-0 top-full mt-3 w-full bg-white shadow-lg rounded-xl 
                 max-h-80 overflow-y-auto hidden z-50 
                ">
              </div>
            </div> 
        </li>
        <li>
          <a href="#" id="backBtn" class="py-4">
            <i class="fas fa-arrow-left mr-3"></i>Kembali
          </a>
        </li>
        <li>
          <a href="#" id="daftarBtn" class="py-4">
            <i class="fas fa-list-ul mr-3"></i>Daftar terbaru
          </a>
        </li>
        <li>
          <a href="#" id="daftarJudulBtn" class="py-4">
            <i class= "fas fa-flag mr-3 text-green-400"></i>Ingin dikunjungi
          </a>
        </li>
        <li>
          <a href="#" id="rencanaKunjunganBtn" class="py-4">
            <i class="fas fa-suitcase-rolling mr-3 text-blue-500"></i>Rencana Perjalanan
          </a>
        </li>
        <li>
          <a href="#" id="berbintangBtn" class="py-4">
            <i class="fas fa-star mr-3 text-orange-400"></i>Tempat berbintang
          </a>
        </li>
        <li>
          <a href="#" id="favoritBtn" class="py-4">
            <i class="fas fa-heart mr-3 text-red-500"></i>Favorit
          </a>
        </li>
        
      `;
       
      initSearch(markers, map, "sidebarSearchInput", "sidebarSearchResult");

      document.getElementById("backBtn")
      .addEventListener("click", () => renderMainMenu(markers, map));

      document.getElementById("daftarBtn")
      .addEventListener("click", () => renderDaftarTerbaru({sidebarMenu, markers, map}));

      document.getElementById("daftarJudulBtn")
      .addEventListener("click", () => renderDaftarTanpaJudul({sidebarMenu, markers, map}));
      
      document.getElementById("rencanaKunjunganBtn")
      .addEventListener("click", () => renderRencanaKunjungan({sidebarMenu, markers, map}));

      document.getElementById("berbintangBtn")
      .addEventListener("click", () => renderBerbintang({sidebarMenu, markers, map}));

      document.getElementById("favoritBtn")
      .addEventListener("click", () => renderFavorit({sidebarMenu, markers, map}));
     
}
