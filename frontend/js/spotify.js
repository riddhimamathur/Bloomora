// ==========================================
// BLOOMORA SPOTIFY CONTROLLER
// ==========================================

window.BloomoraSpotify = {
    async search(query) {
        if (!query.trim()) return [];
        try {
            const response = await fetch(`${API_BASE_URL}/spotify/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Spotify search failed");
            return await response.json();
        } catch (error) {
            console.error("Spotify Search Error:", error);
            return [];
        }
    },

    getEmbedHTML(spotifyUri) {
        if (!spotifyUri) return "";
        
        // Parse uri: spotify:track:id or spotify:playlist:id
        const parts = spotifyUri.split(":");
        if (parts.length < 3) return "";
        
        const type = parts[1]; // 'track' or 'playlist'
        const id = parts[2];
        
        const src = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
        
        return `
            <iframe 
                class="spotify-embed" 
                src="${src}" 
                width="100%" 
                height="80" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
        `;
    },

    bindSearchInput(inputElement, resultsContainer, onSelectCallback) {
        let debounceTimer;
        
        inputElement.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            const query = inputElement.value.trim();
            
            if (query.length < 2) {
                resultsContainer.classList.add("hidden");
                resultsContainer.innerHTML = "";
                return;
            }
            
            debounceTimer = setTimeout(async () => {
                const results = await this.search(query);
                this.renderResults(results, resultsContainer, onSelectCallback);
            }, 300);
        });

        // Hide results click outside
        document.addEventListener("click", (e) => {
            if (!inputElement.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.classList.add("hidden");
            }
        });
    },

    renderResults(results, container, onSelect) {
        container.innerHTML = "";
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="spotify-search-item" style="cursor: default; justify-content: center; color: var(--text-muted);">
                    <span>No tracks found</span>
                </div>
            `;
            container.classList.remove("hidden");
            return;
        }

        results.forEach(track => {
            const item = document.createElement("div");
            item.className = "spotify-search-item";
            item.innerHTML = `
                <img src="${track.image_url || 'https://via.placeholder.com/40'}" alt="Album Art">
                <div class="spotify-item-details">
                    <span class="spotify-item-name">${track.name}</span>
                    <span class="spotify-item-artist">${track.artist}</span>
                </div>
            `;
            
            item.addEventListener("click", () => {
                onSelect(track);
                container.classList.add("hidden");
            });
            
            container.appendChild(item);
        });

        container.classList.remove("hidden");
    }
};
