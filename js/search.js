export function initSearch(markers, map, inputId = "searchInput", outputId = "searchResult") {

  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);

  if (!input || !output) return;

  input.addEventListener("input", function () {
    const keyword = input.value.toLowerCase().trim();

    if (keyword === "") {
      output.classList.add("hidden");
      return;
    }

    const result = markers.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );

    renderSearchResult(result);
  });

  function renderSearchResult(data) {
    if (data.length === 0) {
      output.innerHTML = `<div class="p-2 text-gray-500">Tidak ditemukan</div>`;
    } else {
      output.innerHTML = data
        .map(
          (item) => `
        <div class="result-item p-2 hover:bg-gray-100 cursor-pointer border-b">
          ${item.name} , ${item.address}
        </div>
      `
        )
        .join("");

      const items = output.querySelectorAll(".result-item");

      items.forEach((el, index) => {
        el.addEventListener("click", () => {
          map.setView(data[index].marker.getLatLng(), 18);
          data[index].marker.openPopup();
          output.classList.add("hidden");
          input.value = data[index].name;
        });
      });
    }

    output.classList.remove("hidden");
  }
}