// Firebase Authentication Module
// Handles Google OAuth and Email/Password authentication

// Firebase app and auth instances (will be initialized after Firebase SDK loads)
let app;
let auth;

// Initialize Firebase when the script loads
function initializeFirebase() {
    try {
        // Initialize Firebase app using compat SDK
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();

        // Set up authentication state listener
        setupAuthStateListener();
        
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        showAuthError('Firebase initialization failed. Please check your configuration.');
    }
}

// Google Sign-In
async function signInWithGoogle() {
    try {
        showAuthLoading(true);
        hideAuthError();
        
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // Optional: Add additional scopes
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        console.log('Google sign-in successful:', user.email);
        closeAuthModal();
        
    } catch (error) {
        console.error('Google sign-in error:', error);
        handleAuthError(error);
    } finally {
        showAuthLoading(false);
    }
}

// Email/Password Sign-In
async function signInWithEmail(email, password) {
    try {
        showAuthLoading(true);
        hideAuthError();
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('Email sign-in successful:', user.email);
        closeAuthModal();
        
    } catch (error) {
        console.error('Email sign-in error:', error);
        handleAuthError(error);
    } finally {
        showAuthLoading(false);
    }
}

// Email/Password Sign-Up
async function signUpWithEmail(email, password) {
    try {
        showAuthLoading(true);
        hideAuthError();
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('Sign-up successful:', user.email);
        closeAuthModal();
        
    } catch (error) {
        console.error('Sign-up error:', error);
        handleAuthError(error);
    } finally {
        showAuthLoading(false);
    }
}

// Password Reset
async function resetPassword(email) {
    try {
        showAuthLoading(true);
        hideAuthError();
        
        await auth.sendPasswordResetEmail(email);
        
        showAuthSuccess('Password reset email sent! Check your inbox.');
        
    } catch (error) {
        console.error('Password reset error:', error);
        handleAuthError(error);
    } finally {
        showAuthLoading(false);
    }
}

// Sign Out
async function signOutUser() {
    try {
        await auth.signOut();
        console.log('User signed out successfully');
    } catch (error) {
        console.error('Sign-out error:', error);
        showAuthError('Failed to sign out. Please try again.');
    }
}

// Authentication State Listener
function setupAuthStateListener() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            displayUserProfile(user);
            hideAuthButton();
        } else {
            // User is signed out
            console.log('User is signed out');
            hideUserProfile();
            showAuthButton();
        }
    });
}

// Display User Profile
function displayUserProfile(user) {
    const userProfileSection = document.getElementById('userProfileSection');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhoto = document.getElementById('userPhoto');
    
    if (userProfileSection) {
        userName.textContent = user.displayName || 'User';
        userEmail.textContent = user.email;
        
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.classList.remove('hidden');
        } else {
            userPhoto.classList.add('hidden');
        }
        
        userProfileSection.classList.remove('hidden');
    }
}

// Hide User Profile
function hideUserProfile() {
    const userProfileSection = document.getElementById('userProfileSection');
    if (userProfileSection) {
        userProfileSection.classList.add('hidden');
    }
}

// Show Authentication Button
function showAuthButton() {
    const authButton = document.getElementById('authButton');
    if (authButton) {
        authButton.classList.remove('hidden');
    }
}

// Hide Authentication Button
function hideAuthButton() {
    const authButton = document.getElementById('authButton');
    if (authButton) {
        authButton.classList.add('hidden');
    }
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Password must be at least 6 characters (Firebase requirement)
    return password.length >= 6;
}

// Error Handling
function handleAuthError(error) {
    let errorMessage = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please sign in instead.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
        case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please sign up.';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
        case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            break;
        case 'auth/popup-closed-by-user':
            errorMessage = 'Sign-in popup was closed. Please try again.';
            break;
        case 'auth/cancelled-popup-request':
            // Multiple popup requests - ignore
            return;
        case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection.';
            break;
        default:
            errorMessage = error.message || errorMessage;
    }
    
    showAuthError(errorMessage);
}

// UI Helper Functions
function showAuthLoading(show) {
    const authLoading = document.getElementById('authLoading');
    if (authLoading) {
        authLoading.classList.toggle('hidden', !show);
    }
}

function showAuthError(message) {
    const authError = document.getElementById('authError');
    if (authError) {
        authError.textContent = message;
        authError.classList.remove('hidden');
    }
}

function hideAuthError() {
    const authError = document.getElementById('authError');
    if (authError) {
        authError.classList.add('hidden');
    }
}

function showAuthSuccess(message) {
    const authSuccess = document.getElementById('authSuccess');
    if (authSuccess) {
        authSuccess.textContent = message;
        authSuccess.classList.remove('hidden');
        setTimeout(() => {
            authSuccess.classList.add('hidden');
        }, 5000);
    }
}

// Modal Functions
function openAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('hidden');
        showSignInForm();
    }
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.add('hidden');
        hideAuthError();
        clearForms();
    }
}

function showSignInForm() {
    document.getElementById('signInForm')?.classList.remove('hidden');
    document.getElementById('signUpForm')?.classList.add('hidden');
    document.getElementById('resetPasswordForm')?.classList.add('hidden');
}

function showSignUpForm() {
    document.getElementById('signInForm')?.classList.add('hidden');
    document.getElementById('signUpForm')?.classList.remove('hidden');
    document.getElementById('resetPasswordForm')?.classList.add('hidden');
}

function showResetPasswordForm() {
    document.getElementById('signInForm')?.classList.add('hidden');
    document.getElementById('signUpForm')?.classList.add('hidden');
    document.getElementById('resetPasswordForm')?.classList.remove('hidden');
}

function clearForms() {
    document.querySelectorAll('input[type="email"], input[type="password"]').forEach(input => {
        input.value = '';
    });
}

// Event Listeners Setup
function setupAuthEventListeners() {
    // Auth button - open modal
    const authButton = document.getElementById('authButton');
    if (authButton) {
        authButton.addEventListener('click', openAuthModal);
    }
    
    // Sign out button
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', signOutUser);
    }
    
    // Close modal button
    const closeModalBtn = document.getElementById('closeAuthModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAuthModal);
    }
    
    // Close modal on backdrop click
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
    
    // Google Sign-In button
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', signInWithGoogle);
    }
    
    // Email Sign-In form
    const signInFormElement = document.getElementById('signInForm');
    if (signInFormElement) {
        signInFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signInEmail').value.trim();
            const password = document.getElementById('signInPassword').value;
            
            if (!validateEmail(email)) {
                showAuthError('Please enter a valid email address.');
                return;
            }
            
            if (!validatePassword(password)) {
                showAuthError('Password must be at least 6 characters.');
                return;
            }
            
            await signInWithEmail(email, password);
        });
    }
    
    // Email Sign-Up form
    const signUpFormElement = document.getElementById('signUpForm');
    if (signUpFormElement) {
        signUpFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signUpEmail').value.trim();
            const password = document.getElementById('signUpPassword').value;
            const confirmPassword = document.getElementById('signUpConfirmPassword').value;
            
            if (!validateEmail(email)) {
                showAuthError('Please enter a valid email address.');
                return;
            }
            
            if (!validatePassword(password)) {
                showAuthError('Password must be at least 6 characters.');
                return;
            }
            
            if (password !== confirmPassword) {
                showAuthError('Passwords do not match.');
                return;
            }
            
            await signUpWithEmail(email, password);
        });
    }
    
    // Password Reset form
    const resetPasswordFormElement = document.getElementById('resetPasswordForm');
    if (resetPasswordFormElement) {
        resetPasswordFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value.trim();
            
            if (!validateEmail(email)) {
                showAuthError('Please enter a valid email address.');
                return;
            }
            
            await resetPassword(email);
        });
    }
    
    // Switch to Sign Up
    const switchToSignUp = document.getElementById('switchToSignUp');
    if (switchToSignUp) {
        switchToSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            showSignUpForm();
        });
    }
    
    // Switch to Sign In
    const switchToSignIn = document.getElementById('switchToSignIn');
    if (switchToSignIn) {
        switchToSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            showSignInForm();
        });
    }
    
    // Switch to Reset Password
    const switchToReset = document.getElementById('switchToReset');
    if (switchToReset) {
        switchToReset.addEventListener('click', (e) => {
            e.preventDefault();
            showResetPasswordForm();
        });
    }
    
    // Back to Sign In from Reset
    const backToSignIn = document.getElementById('backToSignIn');
    if (backToSignIn) {
        backToSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            showSignInForm();
        });
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupAuthEventListeners();
        // Firebase will be initialized after SDK loads (window.onload)
    });
} else {
    setupAuthEventListeners();
}

// Initialize Firebase after all scripts are loaded
window.addEventListener('load', () => {
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        initializeFirebase();
    } else {
        console.error('Firebase SDK or configuration not loaded');
        showAuthError('Authentication system is not properly configured.');
    }
});
