function advancedSearchPress() {
    let search_key_all_keywords = document.getElementById("search_key_all_keywords").value;
    let search_key_all_complete = document.getElementById("search_key_all_complete").value;
    let search_key_any_keywords = document.getElementById("search_key_any_keywords").value;
    let search_key_not_keywords = document.getElementById("search_key_not_keywords").value;
    let search_key_site_domain_type = document.getElementById("search_key_site_domain_type").value;

    if (search_key_all_keywords == "" && search_key_all_complete == "" && search_key_any_keywords == "" && search_key_not_keywords == "") {
        return;
    }

    search_key_all_complete = "\"" + search_key_all_complete + "\"";

    search_key_any_keywords = search_key_any_keywords.split(" ").join(" OR ").split("　").join(" OR ");

    search_key_not_keywords = ("-" + search_key_not_keywords).split(" ").join(" -").split("　").join(" -");

    search_key_site_domain_type = "site:" + search_key_site_domain_type.replace(" ", "").replace("　", "");

    let engine = document.getElementById('search_engine').value;

    const url = "https://" + engine + encodeURIComponent(search_key_all_keywords + " " + search_key_all_complete + " " + search_key_any_keywords + " " + search_key_not_keywords + " " + search_key_site_domain_type);
    window.open(url, '_blank');
}