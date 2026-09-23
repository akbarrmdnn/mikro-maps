import { initSearch } from "../search.js";

export function renderSearchBar(containerId = null){
    const searchHtml = `
        <li class= "py-3">
           <div class= "relative">
             <i class = "fas fa-search absolute left-5 top-4 text-black"></i>
              <input 
               type="text" 
               id="searchInput"
               placeholder="Telusuri daftar..."
               class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
               autocomplete= "off"
             />
    
              <div id= "searchResult" 
               class="absolute left-0 top-full mt-3 w-full bg-white shadow-lg rounded-xl 
                 max-h-80 overflow-y-auto hidden z-50 
                ">
              </div>
            </div> 
        </li>
    `
   
    ;

    if (containerId){
        const container = document.getElementById("containerId")
        if (container) container.innerHTML= searchHtml
    }
    return searchHtml;

}