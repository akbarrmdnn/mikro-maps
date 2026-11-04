import { umkmData } from "../data.js";
import { renderSearchBar } from "./searchBar.js";

export function renderDaftarTerbaru({ sidebarMenu, markers, map }) {   
  const daftarTerbaru = [...umkmData].reverse();
  const searchHtml = renderSearchBar();

  let html = `
    ${searchHtml}
    <li class="p-3">
      <button id="backBtn" class="flex items-center gap-2 text-blue-600 mb-3">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
    </li>
  `;

  daftarTerbaru.forEach((umkm) => {
    html += `
      <li class="p-3 border-b">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="font-semibold">${umkm.name}</h4>
            <p class="text-sm text-gray-600">${umkm.category}</p>
            <p class="text-xs text-gray-400">📍 ${umkm.address}</p>
          </div>
          <button
            class="lihat-peta-btn text-blue-500 text-sm p-2 hover:bg-blue-50 rounded-full"
            data-lat="${umkm.lat}"
            data-lng="${umkm.lng}"
          >
            <i class="fas fa-map-marker-alt"></i>
            
          </button>
        </div>
      </li>
    `;
  });

  sidebarMenu.innerHTML = html;

  // Tombol kembali
  document.getElementById("backBtn").addEventListener("click", () => {
    import("../disimpan.js").then(({ renderDisimpanMenu }) => {
      renderDisimpanMenu({sidebarMenu, markers, map});
    });
  });

  // Tombol lihat di peta
  sidebarMenu.querySelectorAll(".lihat-peta-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lat = parseFloat(btn.dataset.lat);
      const lng = parseFloat(btn.dataset.lng);
      map.setView([lat, lng], 18);
    });
  });
}