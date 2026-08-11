// ==========================================
// BLOOMORA PINS CONTROLLER
// ==========================================

window.BloomoraPins = {
    // Preset Unsplash images matching the theme
    presetImages: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&auto=format&fit=crop", // soft flowers
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&auto=format&fit=crop", // lofi coffee cup
        "https://images.unsplash.com/photo-1539625319137-8acb0c08a2b5?w=600&auto=format&fit=crop", // vinyl player
        "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&auto=format&fit=crop", // neon synthwave city
        "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=600&auto=format&fit=crop", // botanical leaves
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop"  // grand piano/music
    ],

    async fetchPins(searchQuery = "") {
        try {
            let url = `${API_BASE_URL}/pins/`;
            if (searchQuery) {
                url += `?search=${encodeURIComponent(searchQuery)}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error("Could not fetch pins");
            return await response.json();
        } catch (error) {
            console.error("Fetch Pins Error:", error);
            window.showToast("Failed to load pinboard", "error");
            return [];
        }
    },

    async createPin(title, description, imageUrl, spotifyUri) {
        try {
            const headers = {
                "Content-Type": "application/json",
                ...window.BloomoraAuth.getAuthHeaders()
            };
            const body = JSON.stringify({ title, description, image_url: imageUrl, spotify_uri: spotifyUri });

            const response = await fetch(`${API_BASE_URL}/pins/`, {
                method: "POST",
                headers,
                body
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Failed to create pin");
            }
            return data;
        } catch (error) {
            console.error("Create Pin Error:", error);
            throw error;
        }
    },

    async deletePin(pinId) {
        try {
            const response = await fetch(`${API_BASE_URL}/pins/${pinId}`, {
                method: "DELETE",
                headers: window.BloomoraAuth.getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to delete pin");
            }
            return true;
        } catch (error) {
            console.error("Delete Pin Error:", error);
            throw error;
        }
    },

    renderPinGrid(pins, gridElement, onCardClick) {
        gridElement.innerHTML = "";

        if (pins.length === 0) {
            gridElement.innerHTML = `
                <div class="feed-loading">
                    <i class="fa-solid fa-cloud-moon-rain" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.1rem; color: var(--text-secondary); font-weight: 500;">No vibes match your search...</p>
                    <span style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Try searching something else or create a new vibe!</span>
                </div>
            `;
            return;
        }

        pins.forEach(pin => {
            const card = document.createElement("div");
            card.className = "pin-card glass";
            
            // Check if there is Spotify attachment metadata to show on the preview card
            let spotifyBadgeHTML = "";
            if (pin.spotify_uri) {
                // Return a small badge indicator on the bottom of the hover card
                spotifyBadgeHTML = `
                    <div class="pin-card-spotify">
                        <i class="fa-brands fa-spotify"></i>
                        <span>Music Attached</span>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="pin-img-wrapper">
                    <img src="${pin.image_url}" alt="${pin.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=Bloomora+Vibe'">
                </div>
                <div class="pin-overlay">
                    <h3 class="pin-card-title">${pin.title}</h3>
                    <p class="pin-card-desc">${pin.description || ""}</p>
                    ${spotifyBadgeHTML}
                    <div class="pin-card-author">
                        <i class="fa-solid fa-user-circle"></i>
                        <span>curated by ${pin.owner.username}</span>
                    </div>
                </div>
            `;

            card.addEventListener("click", () => onCardClick(pin));
            gridElement.appendChild(card);
        });
    }
};
