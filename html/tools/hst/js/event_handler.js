document.addEventListener("DOMContentLoaded", pageLoad)

function pageLoad(){
	var search = document.getElementById("search_key");
	search.addEventListener("keydown", enterKeyPress);
	var search_b = document.getElementById("search_button");
	search_b.addEventListener("click", searchButtonPress);
    var advanced_search = document.getElementById("advanced_search");
    advanced_search.addEventListener("click", advancedSearchPress);
}

