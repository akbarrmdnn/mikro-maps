export function getIconByCategory(category) {
  let color = "#0F2854";
  let icon = "📍";

  if (category === "Makanan") {
    color = "#FFA240";
    icon = "🍴";
  } else if (category === "Minuman") {
    color = "#F5AFAF";
    icon = "🥤";
  } else if (category === "Toko Kelontong") {
    color = "#F4F754";
    icon = "🛒";
  } else if (category === "Jasa") {
    color = "#9B5DE0";
    icon = "🤝";
  } else if (category === "Pakaian") {
    color = "#C40C0C";
    icon = "👚";
  }

  return L.divIcon({
    html: `
      <div style="
        background:${color};
        width:26px;
        height:26px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
      ">
        <span style="font-size:18px;">${icon}</span>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
    className: ""
  });
}

export function initMap(data) {
  const map = L.map("map", { zoomControl: false }).setView([-6.2088, 106.8456], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const markers = [];

  data.forEach((umkm) => {
    const marker = L.marker(
      [umkm.lat, umkm.lng],
      { icon: getIconByCategory(umkm.category) }
    );

    marker.umkmData = umkm;
    marker.addTo(map);
    marker.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${umkm.name}</h3>
        <p class="text-gray-600">${umkm.category}</p>
        <p>${umkm.address}</p>
        <p>⭐ ${umkm.rating}/5</p>
        <img src="${umkm.image}" alt="${umkm.name}" style="width:200px;border-radius:8px;margin-top:8px;">
      </div>
    `);

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

  return { map, markers };
}