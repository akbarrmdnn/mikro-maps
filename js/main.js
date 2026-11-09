import { initMap, getIconByCategory } from "./map.js";
import { initSearch } from "./search.js";
import { initFilter } from "./filter.js";
import { renderMainMenu} from "./disimpan.js";

//fungsi buat ambil data dari API
async function loadDataFromAPI() {
  try {
    const res = await fetch ("http://localhost:3000/api/umkm");
    if (!res.ok) throw new Error("Gagal fetch data");
    return await res.json();
  } catch (err){
    console.error("Error fetch: ", err);
    return[];
  }
}

//init app
async function initApp(){
  //loading state
  document.getElementById("map").innerHTML = `
  <div class = "flex items-center justify-center h-screen">
    <p class = "text-gray-500">Memuat Data UMKM</p>
  </div>
  `;

  //ambil data dari api
  const umkmData = await loadDataFromAPI();
  console.log(`Data loaded: ${umkmData.length} UMKM`);

  //kalo data nya kosong
  if (umkmData.length === 0){
    document.getElementById("map").innerHTML= `
     <div class = "flex items-center justify-center h-screen">
       <p class = "text-red-500">Gagal memuat data. Pastikan backend jalan di localhost:3000</p>
     </div>
    `;   
    return;
  }

  //init peta
  const { map, markers } = initMap(umkmData);

  //load umkm dari localstorage(hasil dari partisipasi)
  const userUmkm = JSON.parse(localStorage.getItem("umkmPartisipasi") || "[]");
  userUmkm.forEach((umkm) => {
  const marker = L.marker([umkm.lat, umkm.lng], {
     icon: getIconByCategory(umkm.category)
  })
  .addTo(map)
  .bindPopup(`
    <div class = "p-2">
      <h3 class ="font-bold">${umkm.name}</h3>
      <p class= "text-sm text-gray-500">${umkm.category}</p>
      <p class = "text-xs">📍 ${umkm.address}</p>
      <p class = "text-xs">⭐ ${umkm.rating}/5</p>
    </div>
    `
  );

    markers.push({
     id: umkm.id,
     name: umkm.name,
     address: umkm.address,
     category: umkm.category,
     rating: umkm.rating,
     image: umkm.image,
     lat: umkm.lat,
     lng: umkm.lng,
     marker: marker
   });
 });

  initFilter(markers, map);
  initSearch(markers, map);
  renderMainMenu(markers, map);
}

initApp();
const drawerToggle = document.getElementById("my-drawer-2");
const drawerOverlay = document.querySelector(".drawer-overlay");

if (drawerToggle && drawerOverlay) {
  drawerOverlay.addEventListener("click", () => {
    drawerToggle.checked = false;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      drawerToggle.checked = false;
    }
  });
}



