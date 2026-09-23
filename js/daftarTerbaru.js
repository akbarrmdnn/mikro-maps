// views/daftarTerbaru.js
import { renderSearchBar } from "./components/searchBar.js";
import { umkmData } from "./data.js";
import { renderDisimpanMenu } from "./disimpan.js";
import { initSearch } from "./search.js";

export function renderDaftarTerbaru(sidebarMenu, map, markers) {
  const daftarTerbaru = [...umkmData].reverse();
  const searchHtml = renderSearchBar();
  
  let html = `
  ${searchHtml}
    <li class="p-3">
      <button id="backBtn" class="flex items-center gap-2 text-blue-600 mb-3">
        <i class="fas fa-arrow-left"></i> Kembali ke Disimpan
      </button>
    </li>

    
      
 
  `;
  
  
  daftarTerbaru.forEach(umkm => {
    html += `
      <li class="p-3 border-b">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="font-semibold">${umkm.name}</h4>
            <p class="text-sm text-gray-600">${umkm.category}</p>
            <p class="text-xs text-gray-400">📍 ${umkm.address}</p>
          </div>
          <button onclick="window.lihatDiPeta(${umkm.lat}, ${umkm.lng})" 
                  class="text-blue-500 text-sm p-2 hover:bg-blue-50 rounded-full">
            <i class="fas fa-map-marker-alt"></i>
          </button>
        </div>
      </li>
    `;
    
  });
  
  
  sidebarMenu.innerHTML = html;
  
   document.getElementById("backBtn")
  .addEventListener("click", renderDisimpanMenu);
}