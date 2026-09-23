import { umkmData } from "./data.js";
import { initMap } from "./map.js";
import { initSearch } from "./search.js";
import { initFilter } from "./filter.js";
import { renderMainMenu, renderDisimpanMenu } from "./disimpan.js";


const { map, markers } = initMap(umkmData);

initFilter(markers, map);
initSearch(markers, map);

// const sidebarMenu = document.getElementById("sidebarMenu");

// menu render section disimpan
// function renderMainMenu(){
// sidebarMenu.innerHTML=`
// <li>
//   <a href="#" id="menuDisimpan" class="py-4">
//   <i class ="fas fa-bookmark mr-3"></i>Disimpan
//   </a>
// </li>
// <li>
//   <a href="#" id="menuTerbaru" class="py-4">
//   <i class ="fas fa-history mr-3"></i>Terbaru
//   </a>
// </li>
// <li>
//   <a href="#" id="menuPartisipasi" class="py-4">
//   <i class ="fas fa-comment-medical  mr-3"></i>Partisipasi
//   </a>
// </li>
// `;


// document.getElementById("menuDisimpan")
// .addEventListener("click", renderDisimpanMenu);
// }

// function renderDisimpanMenu() {
//   sidebarMenu.innerHTML = ` 
//     <li class= "py-3">
//        <div class= "relative">
//          <i class = "fas fa-search absolute left-5 top-4 text-black"></i>
//           <input 
//            type="text" 
//            id="searchInput"
//            placeholder="Telusuri daftar..."
//            class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
//            autocomplete= "off"
//          />

//           <div id= "searchResult" 
//            class="absolute left-0 top-full mt-3 w-full bg-white shadow-lg rounded-xl 
//              max-h-80 overflow-y-auto hidden z-50 
//             ">
//           </div>
//         </div> 
//     </li>
//     <li>
//       <a href="#" id="backBtn" class="py-4">
//         <i class="fas fa-arrow-left mr-3"></i>Kembali
//       </a>
//     </li>
//     <li>
//       <a href="#" id="daftarBtn" class="py-4">
//         <i class="fas fa-list-ul mr-3"></i>Daftar terbaru
//       </a>
//     </li>
//     <li>
//       <a href="#" id="rencanaBtn" class="py-4">
//         <i class="fas fa-map-marker-alt mr-3 text-blue-500"></i>Rencana kunjungan
//       </a>
//     </li>
//     <li>
//       <a href="#" id="berbintangnBtn" class="py-4">
//         <i class="fas fa-star mr-3 text-orange-400"></i>Tempat berbintang
//       </a>
//     </li>
//     <li>
//       <a href="#" id="favoritBtn" class="py-4">
//         <i class="fas fa-heart mr-3 text-red-500"></i>Favorit
//       </a>
//     </li>

    
//   `;

//    initSearch(markers, map);


//   document.getElementById("backBtn")
//     .addEventListener("click", renderMainMenu);



// }


// ================= INIT ===
renderMainMenu(markers, map)
