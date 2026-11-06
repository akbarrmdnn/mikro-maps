//import library
import express from "express";
import cors from "cors";
//buat baca file 
import fs from "fs";
//buat handle path
import path from "path";
import { fileURLToPath} from "url";

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