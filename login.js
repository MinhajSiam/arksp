import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

// আপনার Firebase Config বসান
const firebaseConfig = {
    apiKey: "AIzaSyChp3WWYLpdtxEuazuiW7O8z65L1bwlIiQ",
    authDomain: "ark-parishad.firebaseapp.com",
    projectId: "ark-parishad",
    storageBucket: "ark-parishad.firebasestorage.app",
    messagingSenderId: "92118328596",
    appId: "1:92118328596:web:c79c0bb797194a99e14e01",
    measurementId: "G-9BWELYFQ79"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('login-form').addEventListener('submit', async function (e) {
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
        // লগ-ইন সফল হলে admin.html পেজে নিয়ে যাবে
        window.location.href = "admin.html";
    } catch (error) {
        console.error("Login Error: ", error);
        errorMsg.style.display = "block";
        loginBtn.innerText = "লগ-ইন করুন";
        loginBtn.disabled = false;
    }
});