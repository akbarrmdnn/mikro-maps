import { getIconByCategory } from "../map.js";

//helper, biar ga kena XSS/ hack
function escapeHtml (str){
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}

//ngefilter kategori dari data.js
function getKategoriOptions(){
  return[...new Set(umkmData.map(u => u.category))];
}

//tempat penyimpanan data sementara(localstorage)
const STORAGE_KEY = "umkmPartisipasi";

//main function
export function renderPartisipasi({sidebarMenu, markers, map}){
    sidebarMenu.innerHTML=`
    <!-- Kembali -->
    <li class="p-3">
         <button id="backBtn" class="flex items-center gap-2 text-blue-600 text-sm">
             <i class="fas fa-arrow-left"></i> Kembali
         </button>
    </li>

    <!-- tambah umkm -->
    <li class = "p-3">
      <h2 class= "text-xl font-bold">Tambah UMKM</h2>
      <p class = "text-sm text-gray-500">Bantu lengkapi data UMKM</p>
    </li>

    <!-- Nama Umkm-->
    <li class = "p-3">
      <label class = "text-sm font-medium">Nama Umkm</label>
      <input type = "text" id = "namaInput" class = "w-full border rounded px-3 py-1 mt-1">
    </li>

    <!-- Kategori Umkm-->
    <li class = "p-3">
      <label class = "text-sm font-medium">Kategori</label>
      <select id = "kategoriInput" class= "w-full border rounded px-3 py-1 mt-1">
        <option value = "">-- Pilih --</option>
        <option value = "Makanan">Makanan</option>
        <option value = "Minuman">Minuman</option>
        <option value = "Jasa">Jasa</option>
        <option value = "Pakaian">Pakaian</option>
      </select> 
    </li>

    <!-- Alamat-->
    <li class = "p-3">
      <label class = "text-sm font-medium">Alamat</label>
      <input type = "text" id = "alamatInput" class = "w-full border rounded px-3 py-2 mt-1">
    </li>    

    <!-- Rating-->
    <li class = "p-3">
     <label class = "text-sm font-medium">Rating</label>
       <div id="ratingContainer" class="flex gap-1 mt-2 text-2xl">
         <i class="fas fa-star text-gray-300 cursor-pointer rating-star" data-value="1"></i>
         <i class="fas fa-star text-gray-300 cursor-pointer rating-star" data-value="2"></i>
         <i class="fas fa-star text-gray-300 cursor-pointer rating-star" data-value="3"></i>
         <i class="fas fa-star text-gray-300 cursor-pointer rating-star" data-value="4"></i>
         <i class="fas fa-star text-gray-300 cursor-pointer rating-star" data-value="5"></i>
       </div>
       <input type="hidden" id="ratingInput" value="0">
       <p class="text-xs text-gray-500 mt-1">Klik bintang untuk memberi rating</p>
    </li>

    <!-- Deskripsi-->
    <li class = "p-3">
      <label class = "text-sm font-medium">Deskripsi</label>
      <input type = "text" id = "deskripsiInput" class = "w-full border rounded px-3 py-1 mt-1">
    </li>
    
    <!-- Lokasi -->
    <li class = "p-3 bg-blue-50 rounded-lg">
      <label class = "text-sm font-medium">Lokasi</label>
      <p class = "text-xs text-gray-500 mb-2">Klik di peta untuk memilih lokasi</p>
      <div id= "miniMap" class= "w-full h-48 rounded-lg border border-gray-300" style= "z-index: 0;"></div>

      <p id ="infoLokasi" class = "text-xs text-gray-500 mt-2">Belum dipilih. Klik di peta!</p>

      <!-- input hidden -->
      <input type = "hidden" id= "latInput" value= "">
      <input type = "hidden" id= "lngInput" value= "">
    </li>

    <!-- Tombol Submit -->
    <li class="p-3">
      <button id="submitBtn" class="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700">
        Kirim & Tambah ke Peta
      </button>
    </li>
    `;

    //setup peta mini
    const miniMap = L.map('miniMap').setView([-6.2088, 106.8456], 13);

    // openstreet map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
    }).addTo(miniMap);

    let markerLokasi = null;

    //klik peta mini
    miniMap.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        document.getElementById("latInput").value = lat;
        document.getElementById("lngInput").value = lng;
        document.getElementById("infoLokasi").innerText = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
        document.getElementById("infoLokasi").classList.remove("text-gray-500");
        document.getElementById("infoLokasi").classList.add("text-blue-500", "font-medium");

        if(markerLokasi){
            markerLokasi.setLatLng([lat,lng]);
        }else{
            markerLokasi = L.marker([lat,lng]).addTo(miniMap);
        }
    });

    //ukuran peta
    setTimeout(() => miniMap.invalidateSize(), 100);

    //submit 
    document.getElementById("submitBtn").addEventListener("click", async() => {
    const nama = document.getElementById("namaInput").value.trim();
    const kategori = document.getElementById("kategoriInput").value;
    const alamat = document.getElementById("alamatInput").value.trim();
    const deskripsi = document.getElementById("deskripsiInput").value.trim();
    const lat = parseFloat(document.getElementById("latInput").value);
    const lng = parseFloat(document.getElementById("lngInput").value);
    const rating = parseFloat(document.getElementById("ratingInput").value) || 4.5;


    if (!nama) return alert("Nama UMKM wajib diisi!");
    if (!kategori) return alert("Pilih kategori!");
    if (!alamat) return alert("Alamat wajib diisi!");
    if (isNaN(lat) || isNaN(lng)) return alert("Pilih lokasi di peta mini!");

    try {
      const res = await fetch ("http://localhost:3000/api/umkm", {
        method : "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
          name: nama,
          category: kategori,
          address: alamat,
          description: deskripsi,
          lat: lat,
          lng: lng,
          rating: rating
        })
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Gagal tambah umkm");

      console.log("UMKM di tambahkan:", result.data);

      L.marker([lat, lng], {
       icon: getIconByCategory(kategori)
      })    
      .addTo(map)
      .bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${escapeHtml(nama)}</h3>
          <p class="text-sm text-gray-600">${escapeHtml(kategori)}</p>
          <p class="text-xs">📍 ${escapeHtml(alamat)}</p>
          <p class="text-xs">⭐ ${rating}/5</p>
          <p class="text-xs text-blue-500 mt-1">✨ Baru ditambahkan!</p>
        </div>
      `);

     alert("UMKM berhasil ditambahkan ke server");
      
      import("../disimpan.js").then(({ renderMainMenu }) => {
       renderMainMenu(markers, map);
      });
    } catch (err){
        console.error("Error:", err);
         alert("❌ Gagal tambah UMKM: " + err.message);
    }
  });

  //kembali
   document.getElementById("backBtn").addEventListener("click", () => {
    import("../disimpan.js").then(({ renderMainMenu }) => {
      renderMainMenu(markers, map);
    });
  });

    // ============ SETUP BINTANG RATING ============
  const stars = document.querySelectorAll(".rating-star");
  const ratingInput = document.getElementById("ratingInput");

  stars.forEach((star) => {
    // Efek Hover
    star.addEventListener("mouseenter", () => {
      const value = parseInt(star.dataset.value);
      stars.forEach((s, i) => {
        // Pake style.color biar pasti jalan (gak peduli Tailwind)
        s.style.color = i < value ? "#FACC15" : "#D1D5DB"; 
      });
    });

    // Efek Klik
    star.addEventListener("click", () => {
      const value = parseInt(star.dataset.value);
      ratingInput.value = value; // Simpen nilai ke input hidden
    });
  });

  // Reset warna pas mouse keluar dari area bintang
  const ratingContainer = document.getElementById("ratingContainer");
  if (ratingContainer) {
    ratingContainer.addEventListener("mouseleave", () => {
      const currentValue = parseInt(ratingInput.value) || 0;
      stars.forEach((s, i) => {
        s.style.color = i < currentValue ? "#FACC15" : "#D1D5DB";
      });
    });
  }
}