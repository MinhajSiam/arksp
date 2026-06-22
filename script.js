import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Load Dynamic Data
document.addEventListener('DOMContentLoaded', async () => {

    // --- Load Notices ---
    const noticeWrapper = document.getElementById('dynamic-notices');
    if (noticeWrapper) {
        try {
            const querySnapshot = await getDocs(collection(db, "notices"));
            let noticesHTML = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                noticesHTML += `
                <div class="premium-notice-item">
                    <div class="notice-date-box">
                        <span class="notice-day" style="font-size: 1.2rem;">${data.date}</span>
                    </div>
                    <div class="notice-body">
                        <div class="notice-meta">
                            <span class="notice-category"><i class="fas fa-bullhorn"></i> ${data.category}</span>
                        </div>
                        <h3>${data.title}</h3>
                        <p>${data.desc}</p>
                    </div>
                </div>`;
            });
            noticeWrapper.innerHTML = noticesHTML !== '' ? noticesHTML : '<p style="text-align:center;">কোনো নোটিশ পাওয়া যায়নি।</p>';
        } catch (e) {
            console.log("Error loading notices", e);
        }
    }

    // --- Load Events ---
    const eventGrid = document.getElementById('dynamic-events');
    if (eventGrid) {
        try {
            const querySnapshot = await getDocs(collection(db, "events"));
            let eventsHTML = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Extracting day and month from "২০ মার্চ" (Assuming format has space)
                const dateParts = data.date.split(' ');
                const day = dateParts[0] || '';
                const month = dateParts[1] || '';

                eventsHTML += `
                <div class="premium-event-card">
                    <div class="event-img-box">
                        <img src="${data.img}" alt="Event">
                        <div class="event-date-badge">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                        </div>
                    </div>
                    <div class="event-content">
                        <div class="event-meta">
                            <span><i class="far fa-clock"></i> ${data.time}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${data.location}</span>
                        </div>
                        <h3>${data.title}</h3>
                        <a href="#" class="event-btn">যোগদান করুন <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>`;
            });
            eventGrid.innerHTML = eventsHTML !== '' ? eventsHTML : '<p style="text-align:center; grid-column:1/-1;">কোনো আসন্ন ইভেন্ট নেই।</p>';
        } catch (e) {
            console.log("Error loading events", e);
        }
    }

    // ... (আপনার আগের হ্যামবার্গার ও ইন্টারসেকশন অবজার্ভার কোডগুলো এখানে থাকবে) ...
});
document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    // Toggle menu open/close
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Change hamburger icon to 'X' when open
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // 2. Sticky Header Effect
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Intersection Observer for Scroll Animations
    // Triggers fade-in and slide-up effects when sections enter the viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Select all elements with the 'animate-on-scroll' class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

});

// ==========================================
// Join Us Form Modal Logic
// ==========================================

// Attach functions to window object so HTML inline onclick can access them
window.openJoinModal = function () {
    document.getElementById('join-modal').style.display = 'block';
}

window.closeJoinModal = function () {
    document.getElementById('join-modal').style.display = 'none';
}

// Close modal when clicked outside
window.addEventListener('click', function (event) {
    const modal = document.getElementById('join-modal');
    if (event.target === modal) {
        closeJoinModal();
    }
});

// Handle Form Submission
document.getElementById('join-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerText = "অপেক্ষা করুন...";
    submitBtn.disabled = true;

    const memberData = {
        name: document.getElementById('join-name').value,
        fname: document.getElementById('join-fname').value, // নতুন
        dob: document.getElementById('join-dob').value, // নতুন
        nid: document.getElementById('join-nid').value, // নতুন
        phone: document.getElementById('join-phone').value,
        presentAddress: document.getElementById('join-present-address').value, // আপডেট করা হয়েছে
        permanentAddress: document.getElementById('join-permanent-address').value, // নতুন
        bloodGroup: document.getElementById('join-blood').value,
        appliedAt: new Date()
    };

    try {
        // Save to Firebase 'members' collection
        await addDoc(collection(db, "members"), memberData);

        alert("ধন্যবাদ! আপনার আবেদন সফলভাবে জমা হয়েছে। আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবে।");
        this.reset();
        closeJoinModal();
    } catch (error) {
        console.error("Error submitting form: ", error);
        alert("দুঃখিত, কোনো একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
        submitBtn.innerText = "আবেদন জমা দিন";
        submitBtn.disabled = false;
    }
});