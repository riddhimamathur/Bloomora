// ==========================================
// BLOOMORA AUTHENTICATION CONTROLLER
// ==========================================

// Dynamic API URL: Automatically uses live Cloud Backend when hosted online, or localhost when running locally
const API_BASE_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8000"
    : "https://bloomora-api.onrender.com";

window.BloomoraAuth = {
    tokenKey: "bloomora_token",
    userKey: "bloomora_user",

    init() {
        // Initial state sync
        this.updateUI();
        this.verifySession();
    },

    getAuthHeaders() {
        const token = localStorage.getItem(this.tokenKey);
        return token ? { "Authorization": `Bearer ${token}` } : {};
    },

    isLoggedIn() {
        return !!localStorage.getItem(this.tokenKey);
    },

    getCurrentUsername() {
        return localStorage.getItem(this.userKey) || "Guest";
    },

    async register(username, email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Registration failed");
            }
            return data;
        } catch (error) {
            console.error("Auth Register Error:", error);
            throw error;
        }
    },

    async login(username, password) {
        try {
            // FastAPI OAuth2Token request expects urlencoded form body
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await fetch(`${API_BASE_URL}/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Invalid login credentials");
            }

            // Save token and username to local storage
            localStorage.setItem(this.tokenKey, data.access_token);
            
            // Query user profile to store username
            await this.fetchAndStoreProfile();
            this.updateUI();
            return true;
        } catch (error) {
            console.error("Auth Login Error:", error);
            throw error;
        }
    },

    async fetchAndStoreProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: this.getAuthHeaders()
            });
            if (response.ok) {
                const user = await response.json();
                localStorage.setItem(this.userKey, user.username);
                localStorage.setItem("bloomora_user_id", user.id);
            }
        } catch (e) {
            console.error("Failed to fetch user profile", e);
        }
    },

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem("bloomora_user_id");
        this.updateUI();
        window.showToast("Logged out successfully", "success");
        // Reload page or trigger feed redraw
        if (window.BloomoraApp) {
            window.BloomoraApp.onLogout();
        }
    },

    async verifySession() {
        if (!this.isLoggedIn()) return;
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: this.getAuthHeaders()
            });
            if (!response.ok) {
                // Token has expired or is invalid, logout silently
                this.logout();
            } else {
                const user = await response.json();
                localStorage.setItem(this.userKey, user.username);
                localStorage.setItem("bloomora_user_id", user.id);
                this.updateUI();
            }
        } catch (e) {
            console.error("Session verification failed. Offline or server unreachable.", e);
        }
    },

    updateUI() {
        const authNavGroup = document.getElementById("authNavGroup");
        const userNavGroup = document.getElementById("userNavGroup");
        const navUsername = document.getElementById("navUsername");
        const btnCreatePinOpen = document.getElementById("btnCreatePinOpen");
        const commentInput = document.getElementById("commentInput");
        const btnSendComment = document.getElementById("btnSendComment");

        if (this.isLoggedIn()) {
            if (authNavGroup) authNavGroup.classList.add("hidden");
            if (userNavGroup) userNavGroup.classList.remove("hidden");
            if (navUsername) navUsername.textContent = this.getCurrentUsername();
            if (btnCreatePinOpen) btnCreatePinOpen.classList.remove("hidden");
            if (commentInput) {
                commentInput.disabled = false;
                commentInput.placeholder = "Share your vibe...";
            }
            if (btnSendComment) {
                btnSendComment.disabled = false;
                btnSendComment.title = "Send Comment";
            }
        } else {
            if (authNavGroup) authNavGroup.classList.remove("hidden");
            if (userNavGroup) userNavGroup.classList.add("hidden");
            if (btnCreatePinOpen) btnCreatePinOpen.classList.add("hidden");
            if (commentInput) {
                commentInput.disabled = true;
                commentInput.placeholder = "Log in to add comments...";
                commentInput.value = "";
            }
            if (btnSendComment) {
                btnSendComment.disabled = true;
                btnSendComment.title = "Login to comment";
            }
        }
    }
};

// Auto-run on load
document.addEventListener("DOMContentLoaded", () => {
    window.BloomoraAuth.init();
});
