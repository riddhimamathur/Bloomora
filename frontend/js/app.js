// ==========================================
// BLOOMORA MAIN APP CONTROLLER (SPA COORDINATOR)
// ==========================================

window.BloomoraApp = {
    activePin: null,
    searchQuery: "",
    selectedPresetUrl: "",

    init() {
        this.bindGlobalEvents();
        this.bindAuthEvents();
        this.bindCreatePinEvents();
        this.bindDetailEvents();
        this.loadFeed();
    },

    // TOAST NOTIFICATIONS
    showToast(message, type = "success") {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        const icon = type === "success" 
            ? '<i class="fa-solid fa-circle-check"></i>' 
            : '<i class="fa-solid fa-circle-exclamation"></i>';

        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Slide out and remove
        setTimeout(() => {
            toast.classList.add("toast-fadeout");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    },

    // LOAD FEED
    async loadFeed(search = "") {
        const masonry = document.getElementById("pinsMasonry");
        if (!masonry) return;

        // Show loading state
        masonry.innerHTML = `
            <div class="feed-loading">
                <div class="spinner"></div>
                <p>Loading the vibe feed...</p>
            </div>
        `;

        const pins = await window.BloomoraPins.fetchPins(search);
        
        window.BloomoraPins.renderPinGrid(pins, masonry, (pin) => {
            this.openDetailModal(pin);
        });
    },

    // EVENT BINDINGS: Navigation, search, categorizing
    bindGlobalEvents() {
        window.showToast = this.showToast.bind(this);

        // Logo click resets search and reloads feed
        const logo = document.getElementById("headerLogo");
        if (logo) {
            logo.addEventListener("click", () => {
                document.getElementById("searchInput").value = "";
                document.getElementById("clearSearchBtn").style.display = "none";
                this.setActiveCategory("");
                this.loadFeed();
            });
        }

        // Search inputs
        const searchInput = document.getElementById("searchInput");
        const clearBtn = document.getElementById("clearSearchBtn");
        let searchDebounce;

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const val = searchInput.value.trim();
                
                if (val) {
                    clearBtn.style.display = "block";
                } else {
                    clearBtn.style.display = "none";
                }

                clearTimeout(searchDebounce);
                searchDebounce = setTimeout(() => {
                    this.loadFeed(val);
                }, 400);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                searchInput.value = "";
                clearBtn.style.display = "none";
                this.loadFeed();
            });
        }

        // Category Tags
        const tags = document.querySelectorAll(".category-tag");
        tags.forEach(tag => {
            tag.addEventListener("click", () => {
                const query = tag.getAttribute("data-query");
                this.setActiveCategory(query);
                
                // Set query in main search input to make search feedback obvious
                if (searchInput) {
                    searchInput.value = query;
                    clearBtn.style.display = query ? "block" : "none";
                }
                this.loadFeed(query);
            });
        });
    },

    setActiveCategory(query) {
        const tags = document.querySelectorAll(".category-tag");
        tags.forEach(tag => {
            const tagQuery = tag.getAttribute("data-query");
            if (tagQuery === query) {
                tag.classList.add("active");
            } else {
                tag.classList.remove("active");
            }
        });
    },

    onLogout() {
        // Clear forms and reload feed on logout to update access control interfaces
        this.loadFeed();
    },

    // EVENT BINDINGS: Authentication Forms
    bindAuthEvents() {
        const authModal = document.getElementById("authModal");
        const btnAuthOpen = document.getElementById("btnAuthOpen");
        const authModalClose = document.getElementById("authModalClose");
        const tabLoginBtn = document.getElementById("tabLoginBtn");
        const tabSignupBtn = document.getElementById("tabSignupBtn");
        const loginForm = document.getElementById("loginForm");
        const signupForm = document.getElementById("signupForm");
        const btnLogout = document.getElementById("btnLogout");

        if (btnAuthOpen) {
            btnAuthOpen.addEventListener("click", () => {
                authModal.classList.remove("hidden");
                this.toggleAuthTab("login");
            });
        }

        if (authModalClose) {
            authModalClose.addEventListener("click", () => {
                authModal.classList.add("hidden");
            });
        }

        // Modal outer click close
        authModal.addEventListener("click", (e) => {
            if (e.target === authModal) authModal.classList.add("hidden");
        });

        if (tabLoginBtn) {
            tabLoginBtn.addEventListener("click", () => this.toggleAuthTab("login"));
        }
        if (tabSignupBtn) {
            tabSignupBtn.addEventListener("click", () => this.toggleAuthTab("signup"));
        }

        // Login Submit
        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const username = document.getElementById("loginUsername").value.trim();
                const pass = document.getElementById("loginPassword").value;

                try {
                    await window.BloomoraAuth.login(username, pass);
                    this.showToast(`Welcome back, ${window.BloomoraAuth.getCurrentUsername()}!`, "success");
                    authModal.classList.add("hidden");
                    loginForm.reset();
                    this.loadFeed(); // Reload feed to bind deletion tools
                } catch (err) {
                    this.showToast(err.message, "error");
                }
            });
        }

        // Signup Submit
        if (signupForm) {
            signupForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const username = document.getElementById("signupUsername").value.trim();
                const email = document.getElementById("signupEmail").value.trim();
                const pass = document.getElementById("signupPassword").value;

                try {
                    await window.BloomoraAuth.register(username, email, pass);
                    this.showToast("Registration successful! Logging in...", "success");
                    // Automatically log the user in after registration
                    await window.BloomoraAuth.login(username, pass);
                    authModal.classList.add("hidden");
                    signupForm.reset();
                    this.loadFeed();
                } catch (err) {
                    this.showToast(err.message, "error");
                }
            });
        }

        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                window.BloomoraAuth.logout();
            });
        }
    },

    toggleAuthTab(tab) {
        const tabLoginBtn = document.getElementById("tabLoginBtn");
        const tabSignupBtn = document.getElementById("tabSignupBtn");
        const loginForm = document.getElementById("loginForm");
        const signupForm = document.getElementById("signupForm");

        if (tab === "login") {
            tabLoginBtn.classList.add("active");
            tabSignupBtn.classList.remove("active");
            loginForm.classList.remove("hidden");
            signupForm.classList.add("hidden");
        } else {
            tabSignupBtn.classList.add("active");
            tabLoginBtn.classList.remove("active");
            signupForm.classList.remove("hidden");
            loginForm.classList.add("hidden");
        }
    },

    // EVENT BINDINGS: Create Pin Modal
    bindCreatePinEvents() {
        const modal = document.getElementById("createPinModal");
        const btnOpen = document.getElementById("btnCreatePinOpen");
        const btnClose = document.getElementById("createPinModalClose");
        const form = document.getElementById("createPinForm");
        
        // Image inputs
        const imgUrlInput = document.getElementById("pinImageUrl");
        const imgPreview = document.getElementById("imagePreview");
        const imgPlaceholder = document.getElementById("imagePreviewPlaceholder");
        const presetGrid = document.getElementById("presetImagesGrid");

        if (btnOpen) {
            btnOpen.addEventListener("click", () => {
                modal.classList.remove("hidden");
                this.loadPresetImages();
                this.resetCreatePinForm();
            });
        }

        if (btnClose) {
            btnClose.addEventListener("click", () => {
                modal.classList.add("hidden");
            });
        }

        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.add("hidden");
        });

        // Trigger preview on image url change
        if (imgUrlInput) {
            imgUrlInput.addEventListener("input", () => {
                const url = imgUrlInput.value.trim();
                this.updateImagePreview(url);
            });
        }

        // Initialize preset grid
        if (presetGrid) {
            this.loadPresetImages();
        }

        // Connect Spotify searching inside Pin Creator
        const spotifySearch = document.getElementById("spotifySearchInput");
        const spotifyResults = document.getElementById("spotifySearchResults");
        
        window.BloomoraSpotify.bindSearchInput(spotifySearch, spotifyResults, (track) => {
            this.selectSpotifyTrack(track);
        });

        const btnUnselectSpotify = document.getElementById("btnUnselectSpotify");
        if (btnUnselectSpotify) {
            btnUnselectSpotify.addEventListener("click", () => this.unselectSpotifyTrack());
        }

        // Form Submit
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const title = document.getElementById("pinTitle").value.trim();
                const desc = document.getElementById("pinDescription").value.trim();
                const url = document.getElementById("pinImageUrl").value.trim();
                const spotifyUri = document.getElementById("pinSpotifyUri").value;

                try {
                    await window.BloomoraPins.createPin(title, desc, url, spotifyUri);
                    this.showToast("Pin published successfully!", "success");
                    modal.classList.add("hidden");
                    this.loadFeed();
                } catch (err) {
                    this.showToast(err.message, "error");
                }
            });
        }
    },

    loadPresetImages() {
        const grid = document.getElementById("presetImagesGrid");
        if (!grid) return;

        grid.innerHTML = "";
        window.BloomoraPins.presetImages.forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            img.alt = "Preset Vibe";
            img.className = "preset-img-thumb";
            if (url === this.selectedPresetUrl) {
                img.classList.add("selected");
            }

            img.addEventListener("click", () => {
                // Clear previous selections
                document.querySelectorAll(".preset-img-thumb").forEach(el => el.classList.remove("selected"));
                img.classList.add("selected");
                this.selectedPresetUrl = url;

                // Update input and preview
                const input = document.getElementById("pinImageUrl");
                if (input) input.value = url;
                this.updateImagePreview(url);
            });
            grid.appendChild(img);
        });
    },

    updateImagePreview(url) {
        const img = document.getElementById("imagePreview");
        const placeholder = document.getElementById("imagePreviewPlaceholder");
        
        if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
            img.src = url;
            img.classList.remove("hidden");
            placeholder.classList.add("hidden");
        } else {
            img.src = "";
            img.classList.add("hidden");
            placeholder.classList.remove("hidden");
        }
    },

    selectSpotifyTrack(track) {
        const searchInput = document.getElementById("spotifySearchInput");
        const resultsEl = document.getElementById("spotifySearchResults");
        const displayEl = document.getElementById("selectedSpotifyDisplay");
        
        const img = document.getElementById("selectedSpotifyImg");
        const name = document.getElementById("selectedSpotifyName");
        const artist = document.getElementById("selectedSpotifyArtist");
        const uriInput = document.getElementById("pinSpotifyUri");

        // Clear query
        if (searchInput) searchInput.value = "";
        if (resultsEl) resultsEl.classList.add("hidden");

        // Display selection card
        if (displayEl) displayEl.classList.remove("hidden");
        if (img) img.src = track.image_url || "https://via.placeholder.com/40";
        if (name) name.textContent = track.name;
        if (artist) artist.textContent = track.artist;
        if (uriInput) uriInput.value = track.uri;

        // Hide search input to keep clean
        if (searchInput) searchInput.parentElement.classList.add("hidden");
        this.showToast(`Music selected: ${track.name}`, "success");
    },

    unselectSpotifyTrack() {
        const searchInput = document.getElementById("spotifySearchInput");
        const displayEl = document.getElementById("selectedSpotifyDisplay");
        const uriInput = document.getElementById("pinSpotifyUri");

        if (displayEl) displayEl.classList.add("hidden");
        if (uriInput) uriInput.value = "";
        if (searchInput) {
            searchInput.value = "";
            searchInput.parentElement.classList.remove("hidden");
        }
    },

    resetCreatePinForm() {
        const form = document.getElementById("createPinForm");
        if (form) form.reset();
        this.selectedPresetUrl = "";
        this.updateImagePreview("");
        this.unselectSpotifyTrack();
        document.querySelectorAll(".preset-img-thumb").forEach(el => el.classList.remove("selected"));
    },

    // EVENT BINDINGS: Detail Modal (Comment & Player)
    bindDetailEvents() {
        const modal = document.getElementById("detailPinModal");
        const btnClose = document.getElementById("detailPinModalClose");
        const commentForm = document.getElementById("commentForm");
        const btnDeletePin = document.getElementById("btnDeletePin");

        if (btnClose) {
            btnClose.addEventListener("click", () => {
                modal.classList.add("hidden");
                // Stop/remove Spotify widget so sound doesn't bleed after close
                document.getElementById("detailSpotifyContainer").innerHTML = "";
            });
        }

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.add("hidden");
                document.getElementById("detailSpotifyContainer").innerHTML = "";
            }
        });

        // Add Comment Submit
        if (commentForm) {
            commentForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                if (!this.activePin) return;

                const commentInput = document.getElementById("commentInput");
                const text = commentInput.value.trim();

                try {
                    await window.BloomoraComments.postComment(this.activePin.id, text);
                    this.showToast("Vibe shared!", "success");
                    commentInput.value = "";
                    
                    // Refresh comments
                    const comments = await window.BloomoraComments.fetchComments(this.activePin.id);
                    window.BloomoraComments.renderComments(comments, document.getElementById("commentsList"), this.activePin.user_id);
                } catch (err) {
                    this.showToast(err.message, "error");
                }
            });
        }

        // Delete Pin Bind
        if (btnDeletePin) {
            btnDeletePin.addEventListener("click", async () => {
                if (!this.activePin) return;
                
                if (confirm(`Are you sure you want to delete "${this.activePin.title}"?`)) {
                    try {
                        await window.BloomoraPins.deletePin(this.activePin.id);
                        this.showToast("Pin deleted", "success");
                        modal.classList.add("hidden");
                        document.getElementById("detailSpotifyContainer").innerHTML = "";
                        this.loadFeed();
                    } catch (err) {
                        this.showToast(err.message, "error");
                    }
                }
            });
        }
    },

    async openDetailModal(pin) {
        this.activePin = pin;
        
        const modal = document.getElementById("detailPinModal");
        const img = document.getElementById("detailPinImage");
        const title = document.getElementById("detailPinTitle");
        const author = document.getElementById("detailPinAuthor");
        const dateEl = document.getElementById("detailPinDate");
        const desc = document.getElementById("detailPinDesc");
        const spotifyContainer = document.getElementById("detailSpotifyContainer");
        const btnDeletePin = document.getElementById("btnDeletePin");

        // Set static contents
        img.src = pin.image_url;
        title.textContent = pin.title;
        author.textContent = pin.owner.username;
        desc.textContent = pin.description || "No description shared.";

        // Format date
        const date = new Date(pin.created_at);
        dateEl.textContent = date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        // Set up Spotify embed player if present
        spotifyContainer.innerHTML = "";
        if (pin.spotify_uri) {
            spotifyContainer.innerHTML = window.BloomoraSpotify.getEmbedHTML(pin.spotify_uri);
            spotifyContainer.style.display = "block";
        } else {
            spotifyContainer.style.display = "none";
        }

        // Show/hide deletion tool based on authorship
        const currentUserId = parseInt(localStorage.getItem("bloomora_user_id"));
        if (window.BloomoraAuth.isLoggedIn() && pin.user_id === currentUserId) {
            btnDeletePin.classList.remove("hidden");
        } else {
            btnDeletePin.classList.add("hidden");
        }

        // Fetch and load Comments
        const listEl = document.getElementById("commentsList");
        listEl.innerHTML = '<div class="comment-empty-state"><div class="spinner" style="width:20px;height:20px;"></div></div>';
        
        modal.classList.remove("hidden");

        const comments = await window.BloomoraComments.fetchComments(pin.id);
        window.BloomoraComments.renderComments(comments, listEl, pin.user_id);
    }
};

// Initializer
document.addEventListener("DOMContentLoaded", () => {
    window.BloomoraApp.init();
});
