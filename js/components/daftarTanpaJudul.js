import { umkmData } from "../data.js";

// key untuk localstorage
const STORAGE_KEY = "daftarTanpaJudul"

// data daftar default
let daftarSimpan = {
  id: "daftar_utama",
  nama: "Daftar Tanpa Judul",
  deskripsi: "",
  items: [],
  dibuat: new Date().toISOString,
  terakhirDiubah: new Date().toISOString,
};

// load dari local storage
function loadDariLocalStorage(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try{
      const parsed = JSON.parse(saved);
      daftarSimpan= {...daftarSimpan,...parsed};
      //buat developer 
      console.log("✅ load daftar:", daftarSimpan.nama, '(${daftarSimpan.items.length}:tempat)')
    }catch (e){
      console.log("Gagal load localStorage");
    }
    }else{
      console.log("Belum ada data")
    }
    
  }

//simpan ke local storage
function simpanKeLocalStorage (){
    daftarSimpan.terakhirDiubah = new Date().toISOString;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(daftarSimpan))
    console.log("✅ daftar Tersimpan: ", daftarSimpan.nama);
}

//render
export function renderDaftarTanpaJudul(sidebarMenu, marker, map){
//load data
loadDariLocalStorage();

let html = `
<li class = "py-3 border-b">
  <button id= "backBtn" class= "flex items-center gap-2 text-blue mb-3">
    <i class="fas fa-arrow-left"></i> Kembali ke Disimpan
  </button>

   <!-- edit daftar nama -->
   <div class = "flex items-center gap-2 mb-3">
     <i class="fas fa-pen text-gray-400 text-sm"></i>
      <input type= "text" id= "namaDaftarInput" value= "${escapeHtml(daftarSimpan.nama)}"
      class= "text-xl font-bold bg-transparent border-b border-gray-300 focus: border-blue-500 focus: outline-none w-full">
      <placeholder= "Nama daftar"
    </div>
    
    <!-- edit deskripsi -->
    <div class = "mb-3">
       <textarea id= "deskripsiInput">
        <placeholder= "Tambahkan Deskripsi"
         class= "w-full px-3 py-2 border-rounded-lg focus: outline-none focus: ring-1 focus: ring-blue-400-text-sm"
         rows="2"> value= "${escapeHtml(daftarSimpan.deskripsi)}"
      </textarea>
    </div>

    <!-- stattistik-->
    <div class= "text-sm text-gray-500 mb-3">
      <i class= "fas fa-map-marker-alt mr-1"></i>
      ${daftarSimpan.items.length} tempat
      

`
}
