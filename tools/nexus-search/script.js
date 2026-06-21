document.addEventListener("DOMContentLoaded", () => {
    const htmlEl = document.documentElement;
    const engineSelect = document.getElementById("search_engine");

    const themeBtn = document.getElementById("theme_toggle");
    const savedTheme = localStorage.getItem("theme") || "light";
    htmlEl.setAttribute("data-theme", savedTheme);
    themeBtn.textContent = savedTheme === "light" ? "🌙" : "☀️";

    themeBtn.addEventListener("click", () => {
        const newTheme = htmlEl.getAttribute("data-theme") === "light" ? "dark" : "light";
        htmlEl.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeBtn.textContent = newTheme === "light" ? "🌙" : "☀️";
    });

    const savedEngine = localStorage.getItem("search_engine_pref");
    if (savedEngine) engineSelect.value = savedEngine;

    engineSelect.addEventListener("change", () => {
        localStorage.setItem("search_engine_pref", engineSelect.value);
    });

    let history = JSON.parse(localStorage.getItem("search_history") || "[]");
    const searchInput = document.getElementById("search_key");
    const dropdown = document.getElementById("history_dropdown");

    const updateHistoryUI = () => {
        dropdown.innerHTML = "";
        if (history.length === 0) return;
        
        history.forEach(k => {
            const li = document.createElement("li");
            li.className = "history-item";
            li.innerHTML = `<span class="history-icon">🕒</span><span>${k}</span>`;
            
            li.addEventListener("mousedown", (e) => {
                e.preventDefault(); 
                searchInput.value = k;
                executeSearch(k);
            });
            dropdown.appendChild(li);
        });
    };
    updateHistoryUI();

    searchInput.addEventListener("focus", () => {
        if (history.length > 0) dropdown.style.display = "block";
    });

    searchInput.addEventListener("blur", () => {
        dropdown.style.display = "none";
    });

    const executeSearch = (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        history = [trimmed, ...history.filter(k => k !== trimmed)].slice(0, 8);
        localStorage.setItem("search_history", JSON.stringify(history));
        updateHistoryUI();
        dropdown.style.display = "none";

        window.open(`https://${engineSelect.value}${encodeURIComponent(trimmed)}`, '_blank');
    };

    document.getElementById("search_button").addEventListener("click", () => executeSearch(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") executeSearch(searchInput.value);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
            e.preventDefault();
            searchInput.focus();
        }
    });

    document.getElementById("advanced_search").addEventListener("click", () => {
        const all = document.getElementById("adv_all").value.trim();
        const exact = document.getElementById("adv_exact").value.trim();
        const any = document.getElementById("adv_any").value.trim();
        const not = document.getElementById("adv_not").value.trim();
        const site = document.getElementById("adv_site").value.trim();

        let query = [];
        if (all) query.push(all);
        
        if (exact) {
            const exactPhrases = exact.split(/[,、]/).map(s => s.trim()).filter(s => s !== "");
            if (exactPhrases.length > 0) {
                query.push(exactPhrases.map(p => `"${p}"`).join(" "));
            }
        }

        if (any) query.push(`(${any.split(/\s+/).join(" OR ")})`);
        if (not) query.push(not.split(/\s+/).map(w => `-${w}`).join(" "));
        if (site) query.push(site.split(/\s+/).map(s => `site:${s}`).join(" OR "));

        executeSearch(query.join(" "));
    });

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const bmGrid = document.getElementById("bookmarks_grid");

    const addModal = document.getElementById("bookmark_modal");
    const bookmarkForm = document.getElementById("bookmark_form");
    const titleInput = document.getElementById("modal_title");
    const urlInput = document.getElementById("modal_url");

    const deleteModal = document.getElementById("delete_modal");
    const deleteTargetName = document.getElementById("delete_target_name");
    let deleteTargetIndex = -1;

    const renderBookmarks = () => {
        bmGrid.innerHTML = "";
        bookmarks.forEach((bm, i) => {
            const el = document.createElement("a");
            el.className = "bookmark-card";
            el.href = bm.url;
            el.target = "_blank";
            el.innerHTML = `<span>${bm.title}</span><button data-index="${i}" title="削除">×</button>`;
            bmGrid.appendChild(el);
        });
    };
    renderBookmarks();

    document.getElementById("add_bookmark_btn").addEventListener("click", () => {
        titleInput.value = ""; 
        urlInput.value = "";
        addModal.showModal(); 
    });

    document.getElementById("modal_cancel").addEventListener("click", () => addModal.close());

    bookmarkForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        let url = urlInput.value.trim();

        if (!title || !url) return;

        url = url.startsWith("http") ? url : `https://${url}`;
        bookmarks.push({ title, url });
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        renderBookmarks();
        addModal.close();
    });

    bmGrid.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            e.preventDefault();
            deleteTargetIndex = e.target.getAttribute("data-index");
            deleteTargetName.textContent = `「${bookmarks[deleteTargetIndex].title}」を削除しますか？`;
            deleteModal.showModal();
        }
    });

    document.getElementById("delete_cancel").addEventListener("click", () => deleteModal.close());

    document.getElementById("delete_execute").addEventListener("click", () => {
        if (deleteTargetIndex > -1) {
            bookmarks.splice(deleteTargetIndex, 1);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            renderBookmarks();
        }
        deleteModal.close();
    });

    const closeOnOutsideClick = (modalElement) => {
        modalElement.addEventListener("click", (e) => {
            const rect = modalElement.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.bottom && rect.left <= e.clientX && e.clientX <= rect.right);
            if (!isInDialog) {
                modalElement.close();
            }
        });
    };
    closeOnOutsideClick(addModal);
    closeOnOutsideClick(deleteModal);
});