// ==========================================
// BLOOMORA COMMENTS CONTROLLER
// ==========================================

window.BloomoraComments = {
    async fetchComments(pinId) {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/pin/${pinId}`);
            if (!response.ok) throw new Error("Failed to fetch comments");
            return await response.json();
        } catch (error) {
            console.error("Fetch Comments Error:", error);
            return [];
        }
    },

    async postComment(pinId, content) {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/pin/${pinId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...window.BloomoraAuth.getAuthHeaders()
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Failed to post comment");
            }
            return data;
        } catch (error) {
            console.error("Post Comment Error:", error);
            throw error;
        }
    },

    async deleteComment(commentId) {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: window.BloomoraAuth.getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to delete comment");
            }
            return true;
        } catch (error) {
            console.error("Delete Comment Error:", error);
            throw error;
        }
    },

    renderComments(comments, containerElement, pinOwnerId) {
        containerElement.innerHTML = "";
        
        // Update comments count element if any
        const commentsCountEl = document.getElementById("detailCommentsCount");
        if (commentsCountEl) {
            commentsCountEl.textContent = comments.length;
        }

        if (comments.length === 0) {
            containerElement.innerHTML = `
                <div class="comment-empty-state">
                    <i class="fa-regular fa-comments"></i>
                    <p>No whispers here yet.</p>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Be the first to speak!</span>
                </div>
            `;
            return;
        }

        const currentUserId = parseInt(localStorage.getItem("bloomora_user_id"));
        const isLoggedIn = window.BloomoraAuth.isLoggedIn();

        comments.forEach(comment => {
            const date = new Date(comment.created_at);
            const formattedDate = date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });

            const commentEl = document.createElement("div");
            commentEl.className = "comment-item";

            // Determine if active user has rights to delete this comment (owner of comment OR owner of pin)
            const canDelete = isLoggedIn && (comment.user_id === currentUserId || pinOwnerId === currentUserId);
            
            let deleteBtnHTML = "";
            if (canDelete) {
                deleteBtnHTML = `
                    <button class="btn-delete-comment" data-comment-id="${comment.id}" title="Delete Comment">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;
            }

            commentEl.innerHTML = `
                <div class="comment-avatar">
                    <i class="fa-solid fa-ghost"></i>
                </div>
                <div class="comment-details">
                    <span class="comment-author-name">${comment.owner.username}</span>
                    <span class="comment-text">${comment.content}</span>
                    <span class="comment-date">${formattedDate}</span>
                </div>
                ${deleteBtnHTML}
            `;

            // Bind delete click event
            const delBtn = commentEl.querySelector(".btn-delete-comment");
            if (delBtn) {
                delBtn.addEventListener("click", async () => {
                    if (confirm("Delete this comment?")) {
                        try {
                            await this.deleteComment(comment.id);
                            window.showToast("Comment deleted", "success");
                            // Re-fetch and re-render
                            const updatedComments = await this.fetchComments(comment.pin_id);
                            this.renderComments(updatedComments, containerElement, pinOwnerId);
                        } catch (error) {
                            window.showToast(error.message, "error");
                        }
                    }
                });
            }

            containerElement.appendChild(commentEl);
        });
    }
};
