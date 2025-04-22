// UI functionality for RareFind

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    initUI();
});

function initUI() {
    // Setup smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Setup responsive navigation
    setupResponsiveNav();
    
    // Add placeholder image for auction cards (in a real app, these would be actual images)
    createPlaceholderImage();
}

function setupSmoothScrolling() {
    // Get all links with hash
    const links = document.querySelectorAll('a[href^="#"]');
    
    // Add smooth scroll to each link
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only if the href is not just "#"
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // If mobile nav is open, close it
                    const nav = document.querySelector('nav');
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                    }
                }
            }
        });
    });
}

function setupResponsiveNav() {
    // Handle responsive navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        // Close mobile menu when window is resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    }
}

function createPlaceholderImage() {
    // Create a placeholder image for auction cards using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw placeholder icon
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(125, 75, 50, 50);
    
    // Draw text
    ctx.fillStyle = '#999999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Auction Image', canvas.width / 2, canvas.height / 2 + 45);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // Apply to all auction images that need placeholders
    document.querySelectorAll('.auction-image img').forEach(img => {
        // Check if the image is a placeholder
        if (img.src.includes('placeholder.jpg')) {
            img.src = dataUrl;
        }
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Display notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function updateAuctionCard(auctionId, data) {
    // Find auction card by ID
    const auctionCards = document.querySelectorAll('.auction-card');
    
    // In a real app, each card would have a data attribute with the auction ID
    // For the demo, we're using the index to simulate this
    const auctions = JSON.parse(localStorage.getItem('rareFind_auctions') || '[]');
    const auctionIndex = auctions.findIndex(a => a.id === auctionId);
    
    if (auctionIndex >= 0 && auctionIndex < auctionCards.length) {
        const card = auctionCards[auctionIndex];
        
        // Update card with new data
        if (data.currentBid) {
            const currentBidElement = card.querySelector('.current-bid');
            if (currentBidElement) {
                currentBidElement.textContent = `Current Bid: $${data.currentBid}`;
            }
        }
        
        if (data.bidCount) {
            const bidCountElement = card.querySelector('.bid-count');
            if (bidCountElement) {
                bidCountElement.textContent = `${data.bidCount} bids`;
            }
        }
    }
}

function createAuctionCard(auctionData) {
    // Create new auction card element (in a real app, this would be used for dynamic loading)
    const card = document.createElement('div');
    card.className = 'auction-card';
    
    card.innerHTML = `
        <div class="auction-image">
            <img src="${auctionData.imageUrl || 'assets/images/placeholder.jpg'}" alt="${auctionData.title}">
            <span class="time-left">Loading...</span>
        </div>
        <div class="auction-details">
            <h3>${auctionData.title}</h3>
            <p>${auctionData.description}</p>
            <div class="auction-meta">
                <span class="current-bid">Current Bid: $${auctionData.currentBid}</span>
                <span class="bid-count"><i class="fas fa-gavel"></i> ${auctionData.bidCount} bids</span>
            </div>
            <button class="btn btn-secondary">Place Bid</button>
        </div>
    `;
    
    // Add event listener to bid button
    const bidButton = card.querySelector('.btn-secondary');
    bidButton.addEventListener('click', (e) => {
        const isLoggedIn = window.RareFind.Auth.isAuthenticated();
        
        if (!isLoggedIn) {
            e.preventDefault();
            // Show login modal if not logged in
            showModal('login-modal');
            return;
        }
        
        // Handle bidding (would be more complex in a real app)
        promptForBid(auctionData.id, auctionData.currentBid);
    });
    
    return card;
}

function promptForBid(auctionId, currentBid) {
    // In a real app, this would be a proper modal
    // For the demo, we'll use a prompt
    const minBid = currentBid + 10;
    const bidAmount = prompt(`Current bid is $${currentBid}. Enter your bid (minimum $${minBid}):`);
    
    if (bidAmount === null) {
        // User cancelled
        return;
    }
    
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount < minBid) {
        alert(`Please enter a valid bid of at least $${minBid}`);
        return;
    }
    
    // Place bid
    const result = window.RareFind.Auctions.placeBid(auctionId, amount);
    
    // Show result
    if (result.success) {
        showNotification(result.message, 'success');
        
        // Update UI with new bid information
        const auction = window.RareFind.Auctions.getAuctionById(auctionId);
        if (auction) {
            updateAuctionCard(auctionId, {
                currentBid: auction.currentBid,
                bidCount: auction.bidCount
            });
        }
    } else {
        showNotification(result.message, 'error');
    }
}

// Export UI functions for use in other modules
window.RareFind = window.RareFind || {};
window.RareFind.UI = {
    showModal,
    hideModal,
    showNotification,
    updateAuctionCard,
    createAuctionCard,
    promptForBid
}; 