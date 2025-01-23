function advancedSearchPress() {
    let search_key_all_keywords = document.getElementById("search_key_all_keywords").value.trimEnd(" ").trimEnd("　");
    let b_search_key_all_complete = document.getElementById("search_key_all_complete").value.trimEnd(" ").trimEnd("　");
    let b_search_key_any_keywords = document.getElementById("search_key_any_keywords").value.trimEnd(" ").trimEnd("　");
    let b_search_key_not_keywords = document.getElementById("search_key_not_keywords").value.trimEnd(" ").trimEnd("　");
    let b_search_key_site_domain_type = document.getElementById("search_key_site_domain_type").value.trimEnd(" ").trimEnd("　");

    if (search_key_all_keywords == "" && b_search_key_all_complete == "" && b_search_key_any_keywords == "" && b_search_key_not_keywords == "") {
        return;
    }

    let search_key_all_complete = "\"" + b_search_key_all_complete + "\"";

    let search_key_any_keywords = b_search_key_any_keywords.split(" ").join(" OR ").split("　").join(" OR ");

    let search_key_not_keywords = ("-" + b_search_key_not_keywords).split(" ").join(" -").split("　").join(" -");

    let search_key_site_domain_type = "site:" + b_search_key_site_domain_type.replace(" ", " OR site:").replace("　", " OR site:");

    let engine = document.getElementById('search_engine').value;

    let search_key = "";

    if (search_key_all_keywords != "") {
        search_key = search_key + search_key_all_keywords + " ";
    }
    if (b_search_key_all_complete != "") {
        search_key = search_key + search_key_all_complete + " ";
    }
    if (b_search_key_any_keywords != "") {
        search_key = search_key + search_key_any_keywords + " ";
    }
    if (b_search_key_not_keywords != "") {
        search_key = search_key + search_key_not_keywords + " ";
    }
    if (b_search_key_site_domain_type != "") {
        search_key = search_key + search_key_site_domain_type;
    }

    search_key.trimEnd(" ");

    const url = "https://" + engine + encodeURIComponent(search_key);
    window.open(url, '_blank');
}