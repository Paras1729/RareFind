// Main app.js file for RareFind auction site

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    console.log('RareFind Auction Site Initialized');
    
    // Show featured auctions
    loadFeaturedAuctions();
    
    // Set up mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
    
    // Initialize modals
    initModals();
    
    // Set up auction listeners
    setupAuctionListeners();
});

function initModals() {
    // Login modal
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const switchToRegister = document.getElementById('switch-to-register');
    
    // Register modal
    const registerBtn = document.getElementById('register-btn');
    const registerModal = document.getElementById('register-modal');
    const switchToLogin = document.getElementById('switch-to-login');
    
    // Close modals
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }
    
    // Open register modal
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            registerModal.style.display = 'block';
        });
    }
    
    // Switch between modals
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }
    
    // Close modal functionality
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
}

function setupAuctionListeners() {
    // Get explore auctions button in hero section
    const exploreBtn = document.querySelector('.hero-content .btn-primary');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const auctionsSection = document.getElementById('featured-auctions');
            if (auctionsSection) {
                auctionsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Get all "Place Bid" buttons
    const bidButtons = document.querySelectorAll('.auction-details .btn-secondary');
    bidButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isLoggedIn = checkIfLoggedIn();
            
            if (!isLoggedIn) {
                e.preventDefault();
                // Show login modal if not logged in
                const loginModal = document.getElementById('login-modal');
                loginModal.style.display = 'block';
                return;
            }
            
            // Get auction information
            const auctionCard = btn.closest('.auction-card');
            const auctionTitle = auctionCard.querySelector('h3').textContent;
            const currentBid = auctionCard.querySelector('.current-bid').textContent.replace('Current Bid: ', '');
            
            // If logged in, show bid form (could be a modal in a real app)
            alert(`Place your bid for "${auctionTitle}"\nCurrent bid is ${currentBid}`);
        });
    });
    
    // Get "Create Auction" button
    const createAuctionBtn = document.querySelector('.create-auction .btn-primary');
    if (createAuctionBtn) {
        createAuctionBtn.addEventListener('click', () => {
            const isLoggedIn = checkIfLoggedIn();
            
            if (!isLoggedIn) {
                // Show login modal if not logged in
                const loginModal = document.getElementById('login-modal');
                loginModal.style.display = 'block';
                return;
            }
            
            // If logged in, redirect to create auction page (just an alert in this demo)
            alert('Create a new auction listing (this would be a form in a real app)');
        });
    }
}

// In a real app, this would check localStorage or a backend session
function checkIfLoggedIn() {
    // For demo purposes, check if user data exists in localStorage
    const userData = localStorage.getItem('rareFind_userData');
    return !!userData;
}

// Load featured auctions (in a real app, this would fetch from a backend)
function loadFeaturedAuctions() {
    // In a real app, this would make an API call to get auction data
    console.log('Loading featured auctions...');
    
    // Here we'd normally update the UI with fetched auction data
    // But for this demo, the auctions are hardcoded in the HTML
}

// For the demo, create a placeholder function to handle time countdown
function updateAuctionTimes() {
    // In a real app, this would update the countdown timers for auctions
    // For the demo, we're using static times in the HTML
}

// Export functions for use in other modules
window.RareFind = {
    checkIfLoggedIn,
    loadFeaturedAuctions,
    updateAuctionTimes
}; 