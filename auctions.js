// Auctions functionality for RareFind

document.addEventListener('DOMContentLoaded', () => {
    // Initialize auctions
    initAuctions();
});

function initAuctions() {
    // Set up demo auctions if they don't exist
    if (!localStorage.getItem('rareFind_auctions')) {
        setupDemoAuctions();
    }
    
    // Start countdown timers for auctions
    startAuctionCountdowns();
    
    // Set up event listeners for bid buttons (in a real app)
    // This is already handled in app.js for this demo
}

function setupDemoAuctions() {
    // Create some example auctions for the demo
    const demoAuctions = [
        {
            id: '1',
            title: 'Vintage Omega Seamaster',
            description: 'Rare 1960s Omega Seamaster in excellent condition with original box.',
            currentBid: 1250,
            bidCount: 8,
            startingBid: 1000,
            sellerId: 'seller123',
            sellerName: 'VintageWatchCollector',
            endTime: getRandomFutureTime(1, 7), // Random time in the next 1-7 days
            imageUrl: 'assets/images/placeholder.jpg',
            category: 'Watches',
            bids: [
                { id: 'bid1', userId: 'user1', amount: 1000, time: '2025-04-20T10:30:00Z' },
                { id: 'bid2', userId: 'user2', amount: 1100, time: '2025-04-20T14:45:00Z' },
                { id: 'bid3', userId: 'user3', amount: 1250, time: '2025-04-21T09:15:00Z' }
            ]
        },
        {
            id: '2',
            title: 'First Edition Hemingway',
            description: 'First edition of "The Old Man and the Sea" signed by Ernest Hemingway.',
            currentBid: 3500,
            bidCount: 12,
            startingBid: 2500,
            sellerId: 'seller456',
            sellerName: 'RareBookTreasures',
            endTime: getRandomFutureTime(2, 5), // Random time in the next 2-5 days
            imageUrl: 'assets/images/placeholder.jpg',
            category: 'Books',
            bids: [
                { id: 'bid4', userId: 'user4', amount: 2500, time: '2025-04-19T16:20:00Z' },
                { id: 'bid5', userId: 'user5', amount: 3000, time: '2025-04-20T11:30:00Z' },
                { id: 'bid6', userId: 'user2', amount: 3500, time: '2025-04-21T08:45:00Z' }
            ]
        },
        {
            id: '3',
            title: 'Modern Abstract Painting',
            description: 'Original canvas by emerging artist Sofia Chen, "Urban Dreams" series.',
            currentBid: 850,
            bidCount: 5,
            startingBid: 500,
            sellerId: 'seller789',
            sellerName: 'ContemporaryArtGallery',
            endTime: getRandomFutureTime(1, 3), // Random time in the next 1-3 days
            imageUrl: 'assets/images/placeholder.jpg',
            category: 'Art',
            bids: [
                { id: 'bid7', userId: 'user6', amount: 500, time: '2025-04-20T09:10:00Z' },
                { id: 'bid8', userId: 'user7', amount: 650, time: '2025-04-21T15:30:00Z' },
                { id: 'bid9', userId: 'user8', amount: 850, time: '2025-04-21T18:20:00Z' }
            ]
        }
    ];
    
    // Save to localStorage
    localStorage.setItem('rareFind_auctions', JSON.stringify(demoAuctions));
}

function getRandomFutureTime(minDays, maxDays) {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    
    now.setDate(now.getDate() + randomDays);
    now.setHours(randomHours, randomMinutes, 0, 0);
    
    return now.toISOString();
}

function startAuctionCountdowns() {
    // In a real app, this would update the countdowns on the page
    // For the demo, we'll just update the static time displays
    
    // Get all time display elements
    const timeElements = document.querySelectorAll('.time-left');
    
    // Update times every second
    setInterval(() => {
        // Get auctions from "database"
        const auctions = JSON.parse(localStorage.getItem('rareFind_auctions') || '[]');
        
        // Update each time element
        timeElements.forEach((el, index) => {
            if (index < auctions.length) {
                const auction = auctions[index];
                const timeLeft = getTimeLeft(auction.endTime);
                el.textContent = timeLeft;
            }
        });
    }, 1000);
}

function getTimeLeft(endTimeISO) {
    const endTime = new Date(endTimeISO);
    const now = new Date();
    
    // Time difference in milliseconds
    let diff = endTime - now;
    
    // If auction has ended
    if (diff <= 0) {
        return 'Auction ended';
    }
    
    // Calculate days, hours, minutes, seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    
    const seconds = Math.floor(diff / 1000);
    
    // Format the time left
    if (days > 0) {
        return `${days}d ${hours}h left`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m left`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s left`;
    } else {
        return `${seconds}s left`;
    }
}

function getAllAuctions() {
    return JSON.parse(localStorage.getItem('rareFind_auctions') || '[]');
}

function getAuctionById(auctionId) {
    const auctions = getAllAuctions();
    return auctions.find(auction => auction.id === auctionId);
}

function placeBid(auctionId, amount) {
    // Check if user is authenticated
    if (!window.RareFind.Auth.isAuthenticated()) {
        return { success: false, message: 'Please log in to place a bid' };
    }
    
    // Get current user
    const currentUser = window.RareFind.Auth.getCurrentUser();
    
    // Get auction
    const auctions = getAllAuctions();
    const auctionIndex = auctions.findIndex(auction => auction.id === auctionId);
    
    if (auctionIndex === -1) {
        return { success: false, message: 'Auction not found' };
    }
    
    const auction = auctions[auctionIndex];
    
    // Check if auction has ended
    const endTime = new Date(auction.endTime);
    const now = new Date();
    
    if (now > endTime) {
        return { success: false, message: 'This auction has ended' };
    }
    
    // Check if bid is higher than current bid
    if (amount <= auction.currentBid) {
        return { success: false, message: `Your bid must be higher than the current bid of $${auction.currentBid}` };
    }
    
    // Create new bid
    const newBid = {
        id: `bid${Date.now()}`,
        userId: currentUser.id,
        amount: amount,
        time: new Date().toISOString()
    };
    
    // Update auction
    auction.bids.push(newBid);
    auction.currentBid = amount;
    auction.bidCount = auction.bids.length;
    
    // Save updated auctions
    auctions[auctionIndex] = auction;
    localStorage.setItem('rareFind_auctions', JSON.stringify(auctions));
    
    return { success: true, message: `Your bid of $${amount} has been placed!` };
}

function createAuction(auctionData) {
    // In a real app, this would validate the data and make an API call
    // For the demo, we'll just add to localStorage
    
    // Check if user is authenticated
    if (!window.RareFind.Auth.isAuthenticated()) {
        return { success: false, message: 'Please log in to create an auction' };
    }
    
    // Get current user
    const currentUser = window.RareFind.Auth.getCurrentUser();
    
    // Generate new auction ID
    const newId = Date.now().toString();
    
    // Create new auction object
    const newAuction = {
        id: newId,
        title: auctionData.title,
        description: auctionData.description,
        currentBid: auctionData.startingBid,
        bidCount: 0,
        startingBid: auctionData.startingBid,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        endTime: auctionData.endTime,
        imageUrl: auctionData.imageUrl || 'assets/images/placeholder.jpg',
        category: auctionData.category,
        bids: []
    };
    
    // Add to "database"
    const auctions = getAllAuctions();
    auctions.push(newAuction);
    localStorage.setItem('rareFind_auctions', JSON.stringify(auctions));
    
    return { success: true, message: 'Auction created successfully!', auctionId: newId };
}

// Export auction functions for use in other modules
window.RareFind = window.RareFind || {};
window.RareFind.Auctions = {
    getAllAuctions,
    getAuctionById,
    placeBid,
    createAuction
}; 