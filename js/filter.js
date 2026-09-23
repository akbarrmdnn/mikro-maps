
export function initFilter(markers, map){

  const buttons = document.querySelectorAll(".filter-btn");


  buttons.forEach(btn => {

      btn.addEventListener("click", () => {

          const category = btn.dataset.category;

          markers.forEach(item => {

              if(category === "Semua" || item.category === category) {
                  item.marker.addTo(map);
              }else{
                  map.removeLayer(item.marker);
              }

          });

      });

  });

}
