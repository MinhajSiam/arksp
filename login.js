// ১. Firebase Import (sendPasswordResetEmail যুক্ত করা হয়েছে)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// ২. আপনার Firebase Config বসান
const firebaseConfig = {
    apiKey: "AIzaSyChp3WWYLpdtxEuazuiW7O8z65L1bwlIiQ",
    authDomain: "ark-parishad.firebaseapp.com",
    projectId: "ark-parishad",
    storageBucket: "ark-parishad.firebasestorage.app",
    messagingSenderId: "92118328596",
    appId: "1:92118328596:web:c79c0bb797194a99e14e01"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginForm = document.getElementById('login-form');
const resetForm = document.getElementById('reset-form');
const formSubtitle = document.getElementById('form-subtitle');
const showResetBtn = document.getElementById('show-reset-btn');
const backToLoginBtn = document.getElementById('back-to-login-btn');

// ==========================================
// ফর্ম টগল (Toggle) করার লজিক
// ==========================================
showResetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    resetForm.style.display = 'block';
    formSubtitle.innerText = "পাসওয়ার্ড পুনরুদ্ধার করুন";
});

backToLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetForm.style.display = 'none';
    loginForm.style.display = 'block';
    formSubtitle.innerText = "লগ-ইন করতে আপনার ইমেইল ও পাসওয়ার্ড দিন";
    document.getElementById('reset-msg').style.display = 'none'; // আগের মেসেজ মুছে দেওয়া
});

// ==========================================
// লগ-ইন লজিক
// ==========================================
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const loginBtn = document.getElementById('login-btn');
    const errorMsg = document.getElementById('error-msg');

    loginBtn.innerText = "অপেক্ষা করুন...";
    loginBtn.disabled = true;
    errorMsg.style.display = "none";

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "admin.html";
    } catch (error) {
        console.error("Login Error: ", error);
        errorMsg.style.display = "block";
        loginBtn.innerText = "লগ-ইন করুন";
        loginBtn.disabled = false;
    }
});

// ==========================================
// পাসওয়ার্ড রিসেট লজিক
// ==========================================
resetForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('reset-email').value;
    const resetBtn = document.getElementById('reset-btn');
    const resetMsg = document.getElementById('reset-msg');

    resetBtn.innerText = "পাঠানো হচ্ছে...";
    resetBtn.disabled = true;
    resetMsg.style.display = "none";

    try {
        await sendPasswordResetEmail(auth, email);
        resetMsg.innerText = "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। দয়া করে ইনবক্স (বা স্প্যাম ফোল্ডার) চেক করুন।";
        resetMsg.style.color = "#0A5C36"; // Green
        resetMsg.style.display = "block";
        document.getElementById('reset-email').value = ''; // ইনপুট ক্লিয়ার করা
    } catch (error) {
        console.error("Reset Error: ", error);
        resetMsg.innerText = "ইমেইল পাঠাতে সমস্যা হয়েছে। সঠিক ইমেইল দিয়েছেন কি না যাচাই করুন।";
        resetMsg.style.color = "#e74c3c"; // Red
        resetMsg.style.display = "block";
    } finally {
        resetBtn.innerText = "রিসেট লিংক পাঠান";
        resetBtn.disabled = false;
    }
});