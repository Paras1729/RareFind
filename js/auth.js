// Authentication functions for RareFind

document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication
    initAuth();
});

function initAuth() {
    // Set up login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Set up register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Check if user is already logged in
    updateAuthUI();
}

function handleLogin(e) {
    e.preventDefault();
    
    // Get form data
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real app, this would make an API call to verify credentials
    // For the demo, we'll use localStorage to simulate authentication
    
    // Check if the user exists in our "database" (localStorage)
    const users = JSON.parse(localStorage.getItem('rareFind_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store logged in user data (without password)
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        
        localStorage.setItem('rareFind_userData', JSON.stringify(userData));
        
        // Close modal and update UI
        document.getElementById('login-modal').style.display = 'none';
        updateAuthUI();
        
        // Show success message
        alert(`Welcome back, ${user.name}!`);
    } else {
        alert('Invalid email or password');
    }
}

function handleRegistration(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // In a real app, this would make an API call to register the user
    // For the demo, we'll use localStorage to simulate registration
    
    // Check if the email is already registered
    const users = JSON.parse(localStorage.getItem('rareFind_users') || '[]');
    if (users.some(user => user.email === email)) {
        alert('Email already registered');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    // Add to "database"
    users.push(newUser);
    localStorage.setItem('rareFind_users', JSON.stringify(users));
    
    // Log the user in
    const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    };
    
    localStorage.setItem('rareFind_userData', JSON.stringify(userData));
    
    // Close modal and update UI
    document.getElementById('register-modal').style.display = 'none';
    updateAuthUI();
    
    // Show success message
    alert(`Welcome to RareFind, ${newUser.name}!`);
}

function logout() {
    // Remove user data from localStorage
    localStorage.removeItem('rareFind_userData');
    
    // Update UI
    updateAuthUI();
    
    // Show message
    alert('You have been logged out');
}

function updateAuthUI() {
    // Get user data
    const userData = JSON.parse(localStorage.getItem('rareFind_userData'));
    
    // Get elements to update
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userActions = document.querySelector('.user-actions');
    
    if (userData) {
        // User is logged in
        if (loginBtn && registerBtn && userActions) {
            // Hide login and register buttons
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            
            // Create welcome and logout buttons if they don't exist
            if (!document.getElementById('user-welcome')) {
                const welcomeSpan = document.createElement('span');
                welcomeSpan.id = 'user-welcome';
                welcomeSpan.textContent = `Hello, ${userData.name}`;
                welcomeSpan.style.marginRight = '15px';
                
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logout-btn';
                logoutBtn.className = 'btn';
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', logout);
                
                userActions.appendChild(welcomeSpan);
                userActions.appendChild(logoutBtn);
            }
        }
    } else {
        // User is not logged in
        if (loginBtn && registerBtn && userActions) {
            // Show login and register buttons
            loginBtn.style.display = 'inline-block';
            registerBtn.style.display = 'inline-block';
            
            // Remove welcome and logout buttons if they exist
            const welcomeSpan = document.getElementById('user-welcome');
            const logoutBtn = document.getElementById('logout-btn');
            
            if (welcomeSpan) {
                userActions.removeChild(welcomeSpan);
            }
            
            if (logoutBtn) {
                userActions.removeChild(logoutBtn);
            }
        }
    }
}

// Check if a user is logged in
function isAuthenticated() {
    return !!localStorage.getItem('rareFind_userData');
}

// Get current user data
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('rareFind_userData'));
}

// Export authentication functions for use in other modules
window.RareFind = window.RareFind || {};
window.RareFind.Auth = {
    isAuthenticated,
    getCurrentUser,
    logout
}; 