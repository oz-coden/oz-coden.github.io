function enterKeyPress(event){
	if (event.key === "Enter"){
        let search_key = document.getElementById("search_key").value;
        if (search_key == "") {
            return;
        }
        
        search_key = encodeURIComponent(search_key)
        
        let engine = document.getElementById('search_engine').value;

		const url = "https://" + engine + search_key;
        window.open(url, '_blank');
	}
}