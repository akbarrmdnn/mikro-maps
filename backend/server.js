//import library
import express from "express";
import cors from "cors";
//buat baca file 
import fs from "fs";
//buat handle path
import path from "path";
import { fileURLToPath} from "url";
import { json } from "stream/consumers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//inisialisasi app
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//endpoint tes (server)
app.get("/", (req, res) => {
    res.json({message: "Server Mikro Maps Berhasil Menyala"});
});

app.get("/api/umkm", (req,res) => {
    try{
        const filePath = path.join(__dirname, "data", "umkm.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        res.json(data);
    }catch(err){
        res.status(500).json({error: "Gagal baca data UMKM", detail: err.message});
    }
});

//jalanin server diport 3000
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server jalan di http://localhost:${PORT}`);
});

//endpoint POST: tambah umkm baru
app.post("/api/umkm", (req, res) => {
    try{
        const {name, category, address, lat, lng, rating, image} = req.body;

        //validasi
        if (!name || !category || !address || !lat || !lng){
            return res.status(400).json({error: "semua field wajib di isi"});
        }

        //baca data existing
        const filePath = path.join(__dirname, "data", "umkm.json");
        const umkmList = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        // Bikin UMKM baru
        const newUmkm = {
         id: Date.now(),   // ← ID unik dari timestamp
         name,
         category,
         address,
         lat: parseFloat(lat),
         lng: parseFloat(lng),
         rating: parseFloat(rating) || 4.5,
         image: image || "https://via.placeholder.com/200x150/CCCCCC/FFFFFF?text=Foto+UMKM",
         createdAt: new Date().toISOString()
        };
        
        //tambah ke list
        umkmList.push(newUmkm);

        //tulis balik ke file
        fs.writeFileSync(filePath, JSON.stringify(umkmList, null, 2));

        res.status(201).json({message: "UMKM berhasil di tambahkan", data: newUmkm});
    }catch(err){
        res.status(500).json({error: "Gagal tambah umkm", detail: err.message});
    }
});