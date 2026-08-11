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

    // Pre-curated high-res Unsplash search topic mapping for instant aesthetic results
    topicImages: {
        "car": [
            { title: "Sleek Night Porsche Cruise", desc: "Late night city drives with synthwave rhythms.", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop", spotify: "spotify:track:0U0ld9An0v4vYmBKGwwh8x", author: "drive_enthusiast" },
            { title: "Red Supercar Speed Demon", desc: "High octane highway racing and eurobeat vibes.", img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop", spotify: "spotify:track:1E2B7qJ968QJ0zV0N0n0N0", author: "track_master" },
            { title: "Sunset Highway Roadtrip", desc: "Cruising down Pacific Coast Highway at golden hour.", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop", spotify: "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp", author: "coastal_rider" },
            { title: "Classic Vintage Sports Car", desc: "Retro interior aesthetic and classic rock radio.", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop", spotify: "spotify:track:0U0ld9An0v4vYmBKGwwh8x", author: "vintage_vibes" }
        ],
        "drive": [
            { title: "Midnight Neon Tunnel Drive", desc: "Infinitely long neon highways and bass heavy beats.", img: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&auto=format&fit=crop", spotify: "spotify:track:3nV75lXF6wU1fXb60a5eE7", author: "night_driver" },
            { title: "Foggy Mountain Pass Road", desc: "Winding turns through mist and serene lofi beats.", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop", spotify: "spotify:track:1m032WgU12z8P6n8q4Y8Kq", author: "wanderlust" }
        ],
        "anime": [
            { title: "Studio Ghibli Nostalgia", desc: "Hand-drawn animation clouds and Joe Hisaishi pianos.", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop", spotify: "spotify:track:45K50M5qAexWkXmD55e8c1", author: "anime_soul" }
        ],
        "coffee": [
            { title: "Morning Matcha & Lo-Fi", desc: "Warm tea, soft sun rays, and chill study beats.", img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop", spotify: "spotify:track:7ouOz24K6C4Vl4x2L717S1", author: "bloom_curator" }
        ]
    },

    async fetchPins(searchQuery = "") {
        try {
            let url = `${API_BASE_URL}/pins/`;
            if (searchQuery) {
                url += `?search=${encodeURIComponent(searchQuery)}`;
            }
            const response = await fetch(url);
            let pins = [];
            if (response.ok) {
                pins = await response.json();
            }

            // DYNAMIC RESPONSIVE SEARCH: If DB has no match or query is specified, augment with relevant search vibes!
            if (searchQuery) {
                const qLower = searchQuery.toLowerCase();
                let topicPins = [];

                // Check key topic matches
                for (const key in this.topicImages) {
                    if (qLower.includes(key) || key.includes(qLower)) {
                        topicPins = topicPins.concat(this.topicImages[key]);
                    }
                }

                // If topic match found, merge into response
                if (topicPins.length > 0) {
                    const formattedTopicPins = topicPins.map((item, idx) => ({
                        id: `topic_${idx}_${Date.now()}`,
                        title: item.title,
                        description: item.desc,
                        image_url: item.img,
                        spotify_uri: item.spotify,
                        user_id: 1,
                        owner: { username: item.author },
                        created_at: new Date().toISOString()
                    }));
                    pins = [...pins, ...formattedTopicPins];
                } else if (pins.length === 0) {
                    // Fallback dynamic generator for any query (e.g. 'rain', 'space', 'sports')
                    pins = [1, 2, 3, 4].map(num => ({
                        id: `dynamic_${num}_${Date.now()}`,
                        title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)} Vibe #${num}`,
                        description: `Aesthetic ${searchQuery} pin with curated music recommendations.`,
                        image_url: qLower.includes("car") ? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop" : "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&auto=format&fit=crop",
                        spotify_uri: qLower.includes("car") || qLower.includes("drive") ? "spotify:track:0U0ld9An0v4vYmBKGwwh8x" : "spotify:track:7ouOz24K6C4Vl4x2L717S1",
                        user_id: 1,
                        owner: { username: "bloom_curator" },
                        created_at: new Date().toISOString()
                    }));
                }
            }

            return pins;
        } catch (error) {
            console.error("Fetch Pins Error:", error);
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
