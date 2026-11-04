import { umkmData } from "./data.js";
import { initMap, getIconByCategory } from "./map.js";
import { initSearch } from "./search.js";
import { initFilter } from "./filter.js";
import { renderMainMenu, renderDisimpanMenu } from "./disimpan.js";
window.koordinatBaru = {lat: null, lng:null};



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
map.on("click", (e) => {
    //tempat nyimpen kordinat yg di klil user
    window.koordinatBaru= {lat: e.latlng.lat, lng:e.latlng.lng};

    //kasih visual sementara
    if (window.markerSementara){
        map.removeLayer(window.markerSementara);
    }
    window.markerSementara = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: L.divIcon({
            html: '<div style = "background:red;width:30px;height:30px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.5)"></div>',
            iconSize: [30,30],
            iconAnchor: [15,15]
        })
    }).addToMap(map);

});

initFilter(markers, map);
initSearch(markers, map);
renderMainMenu(markers, map);

const drawerToggle = document.getElementById("my-drawer-2");
const drawerOverlay = document.getElementById("drawerOverlay");

// Tutup sidebar ketika area luar sidebar diklik
drawerOverlay.addEventListener("click", () => {
    drawerToggle.checked = false;
});

// Tutup sidebar ketika tombol Escape ditekan
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        drawerToggle.checked = false;
    }
});

renderMainMenu(markers, map)
