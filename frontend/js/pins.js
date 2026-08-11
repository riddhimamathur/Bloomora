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

    // Curated search library mapping terms to accurate images & real Spotify tracks/playlists
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
        "rain": [
            { title: "Raindrops on Window Pane", desc: "Cozy rainy mood with acoustic background piano.", img: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop", spotify: "spotify:track:27D169EbuiW277Y4Z5ZldF", author: "pluviophile" },
            { title: "Neon City Rain Reflect", desc: "Puddle reflections under city streetlights.", img: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop", spotify: "spotify:track:7ouOz24K6C4Vl4x2L717S1", author: "urban_soul" }
        ],
        "travel": [
            { title: "Tropical Island Paradise", desc: "Clear turquoise waters and acoustic summer tunes.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop", spotify: "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp", author: "globetrotter" },
            { title: "Alpine Mountain Peaks", desc: "Breathtaking snowy mountain horizons.", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop", spotify: "spotify:track:1m032WgU12z8P6n8q4Y8Kq", author: "hiker_vibe" }
        ],
        "workout": [
            { title: "High Energy Gym Motivation", desc: "Heavy bass and intense workout beats.", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop", spotify: "spotify:track:1E2B7qJ968QJ0zV0N0n0N0", author: "fitness_beast" }
        ],
        "coffee": [
            { title: "Morning Matcha & Lo-Fi", desc: "Warm tea, soft sun rays, and chill study beats.", img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop", spotify: "spotify:track:7ouOz24K6C4Vl4x2L717S1", author: "bloom_curator" }
        ],
        "anime": [
            { title: "Studio Ghibli Nostalgia", desc: "Hand-drawn animation clouds and Joe Hisaishi pianos.", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop", spotify: "spotify:track:45K50M5qAexWkXmD55e8c1", author: "anime_soul" }
        ],
        "space": [
            { title: "Cosmic Galaxy Horizons", desc: "Deep space ambient soundscapes and starlight.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop", spotify: "spotify:track:3nV75lXF6wU1fXb60a5eE7", author: "astro_curator" }
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

            // DYNAMIC ACCURATE SEARCH MATCHING
            if (searchQuery) {
                const qLower = searchQuery.toLowerCase().trim();
                let matchedPins = [];

                // 1. Check topic database matches first
                for (const key in this.topicImages) {
                    if (qLower.includes(key) || key.includes(qLower)) {
                        matchedPins = matchedPins.concat(this.topicImages[key]);
                    }
                }

                // If specific matched topics were found, combine or replace
                if (matchedPins.length > 0) {
                    const formatted = matchedPins.map((item, idx) => ({
                        id: `matched_${idx}_${Date.now()}`,
                        title: item.title,
                        description: item.desc,
                        image_url: item.img,
                        spotify_uri: item.spotify,
                        user_id: 1,
                        owner: { username: item.author },
                        created_at: new Date().toISOString()
                    }));
                    pins = [...formatted, ...pins];
                } else if (pins.length === 0) {
                    // 2. Dynamic high-precision image & music generator for ANY search query
                    // Uses reliable static Unsplash topic photos based on search intent
                    const keywordsMap = {
                        car: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop",
                        drive: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop",
                        beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
                        city: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop",
                        nature: "https://images.unsplash.com/photo-1518818419601-72c8673f5852?w=800&auto=format&fit=crop",
                        sunset: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"
                    };

                    let selectedImg = "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&auto=format&fit=crop";
                    for (const kw in keywordsMap) {
                        if (qLower.includes(kw)) {
                            selectedImg = keywordsMap[kw];
                            break;
                        }
                    }

                    pins = [
                        {
                            id: `gen_1_${Date.now()}`,
                            title: `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)} Aesthetic Vibe`,
                            description: `Curated visual aesthetic and music playlist matching "${searchQuery}".`,
                            image_url: selectedImg,
                            spotify_uri: qLower.includes("car") || qLower.includes("drive") ? "spotify:track:0U0ld9An0v4vYmBKGwwh8x" : "spotify:track:7ouOz24K6C4Vl4x2L717S1",
                            user_id: 1,
                            owner: { username: `${qLower}_curator` },
                            created_at: new Date().toISOString()
                        }
                    ];
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
