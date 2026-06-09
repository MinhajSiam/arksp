// ১. Firebase App, Analytics এবং Firestore Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// ২. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyChp3WWYLpdtxEuazuiW7O8z65L1bwlIiQ",
    authDomain: "ark-parishad.firebaseapp.com",
    projectId: "ark-parishad",
    storageBucket: "ark-parishad.firebasestorage.app",
    messagingSenderId: "92118328596",
    appId: "1:92118328596:web:c79c0bb797194a99e14e01",
    measurementId: "G-9BWELYFQ79"
};

// ৩. Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // এই লাইনটি খুবই গুরুত্বপূর্ণ

// Collection References
const noticesCol = collection(db, "notices");
const eventsCol = collection(db, "events");
const membersCol = collection(db, "members");

// Local array for editing data
let localNotices = [];
let localEvents = [];

document.addEventListener('DOMContentLoaded', () => {
    loadNotices();
    loadEvents();
    loadMembers();
});

// ==========================================
// UI, Modal & Mobile Sidebar Functions
// ==========================================
window.toggleSidebar = function () {
    document.querySelector('.sidebar').classList.toggle('active');
}

window.switchTab = function (tabId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    // Auto-close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
}

window.openModal = function (modalId) {
    document.getElementById(modalId).style.display = 'block';
    if (modalId === 'notice-modal') document.getElementById('notice-form').reset();
    if (modalId === 'event-modal') document.getElementById('event-form').reset();
    document.getElementById(modalId + '-title').innerText = "নতুন এন্ট্রি যোগ করুন";
    document.getElementById(modalId.split('-')[0] + '-id').value = '';
}

window.closeModal = function (modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ==========================================
// NOTICES: CRUD Operations
// ==========================================
document.getElementById('notice-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('notice-id').value;
    const noticeData = {
        date: document.getElementById('notice-date').value,
        category: document.getElementById('notice-category').value,
        title: document.getElementById('notice-title').value,
        desc: document.getElementById('notice-desc').value,
        timestamp: new Date() // For sorting
    };

    try {
        if (id) {
            await updateDoc(doc(db, "notices", id), noticeData);
        } else {
            await addDoc(noticesCol, noticeData);
        }
        closeModal('notice-modal');
        loadNotices();
    } catch (error) {
        console.error("Error saving notice: ", error);
        alert("নোটিশ সেভ করতে সমস্যা হয়েছে!");
    }
});

async function loadNotices() {
    const tbody = document.querySelector('#notice-table tbody');
    tbody.innerHTML = '<tr><td colspan="4">লোড হচ্ছে...</td></tr>';

    try {
        const querySnapshot = await getDocs(noticesCol);
        tbody.innerHTML = '';
        localNotices = []; // Reset local array

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Save Firebase ID
            localNotices.push(data);

            tbody.innerHTML += `
                <tr>
                    <td>${data.date}</td>
                    <td><span style="background:#eee; padding:3px 8px; border-radius:5px; font-size:0.9rem;">${data.category}</span></td>
                    <td><strong>${data.title}</strong></td>
                    <td class="action-btns">
                        <button class="btn-edit" onclick="editNotice('${doc.id}')" style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer; margin-right:5px;"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteNotice('${doc.id}')" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading notices: ", error);
    }
}

window.editNotice = function (id) {
    const notice = localNotices.find(n => n.id === id);
    document.getElementById('notice-id').value = notice.id;
    document.getElementById('notice-date').value = notice.date;
    document.getElementById('notice-category').value = notice.category;
    document.getElementById('notice-title').value = notice.title;
    document.getElementById('notice-desc').value = notice.desc;

    document.getElementById('notice-modal-title').innerText = "নোটিশ এডিট করুন";
    document.getElementById('notice-modal').style.display = 'block';
}

window.deleteNotice = async function (id) {
    if (confirm('আপনি কি নিশ্চিত যে এই নোটিশটি মুছে ফেলতে চান?')) {
        await deleteDoc(doc(db, "notices", id));
        loadNotices();
    }
}

// ==========================================
// EVENTS: CRUD Operations
// ==========================================
document.getElementById('event-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('event-id').value;
    const eventData = {
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
        title: document.getElementById('event-title').value,
        img: document.getElementById('event-img').value,
        timestamp: new Date()
    };

    try {
        if (id) {
            await updateDoc(doc(db, "events", id), eventData);
        } else {
            await addDoc(eventsCol, eventData);
        }
        closeModal('event-modal');
        loadEvents();
    } catch (error) {
        console.error("Error saving event: ", error);
        alert("ইভেন্ট সেভ করতে সমস্যা হয়েছে!");
    }
});

async function loadEvents() {
    const tbody = document.querySelector('#event-table tbody');
    tbody.innerHTML = '<tr><td colspan="4">লোড হচ্ছে...</td></tr>';

    try {
        const querySnapshot = await getDocs(eventsCol);
        tbody.innerHTML = '';
        localEvents = []; // Reset local array

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Save Firebase ID
            localEvents.push(data);

            tbody.innerHTML += `
                <tr>
                    <td>${data.date}</td>
                    <td>${data.time}</td>
                    <td><strong>${data.title}</strong></td>
                    <td class="action-btns">
                        <button class="btn-edit" onclick="editEvent('${doc.id}')" style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer; margin-right:5px;"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteEvent('${doc.id}')" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading events: ", error);
    }
}

window.editEvent = function (id) {
    const ev = localEvents.find(e => e.id === id);
    document.getElementById('event-id').value = ev.id;
    document.getElementById('event-date').value = ev.date;
    document.getElementById('event-time').value = ev.time;
    document.getElementById('event-location').value = ev.location;
    document.getElementById('event-title').value = ev.title;
    document.getElementById('event-img').value = ev.img;

    document.getElementById('event-modal-title').innerText = "ইভেন্ট এডিট করুন";
    document.getElementById('event-modal').style.display = 'block';
}

window.deleteEvent = async function (id) {
    if (confirm('আপনি কি নিশ্চিত যে এই ইভেন্টটি মুছে ফেলতে চান?')) {
        await deleteDoc(doc(db, "events", id));
        loadEvents();
    }
}

// ==========================================
// MEMBERS: Fetch & Delete Operations
// ==========================================
async function loadMembers() {
    const tbody = document.querySelector('#member-table tbody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">লোড হচ্ছে...</td></tr>';

    try {
        const querySnapshot = await getDocs(membersCol);
        tbody.innerHTML = '';

        if (querySnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">কোনো নতুন আবেদন পাওয়া যায়নি।</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Timestamp কে সাধারণ তারিখে কনভার্ট করা
            let dateString = "-";
            if (data.appliedAt) {
                const dateObj = data.appliedAt.toDate();
                dateString = dateObj.toLocaleDateString('bn-BD'); // বাংলা ফরম্যাটে তারিখ
            }

            tbody.innerHTML += `
                <tr>
                    <td><strong>${data.name}</strong></td>
                    <td><a href="tel:${data.phone}" style="color:var(--primary-color); text-decoration:none;">${data.phone}</a></td>
                    <td>${data.address}</td>
                    <td><span style="color:#e74c3c; font-weight:bold;">${data.bloodGroup || '-'}</span></td>
                    <td>${dateString}</td>
                    <td class="action-btns">
                        <button class="btn-delete" onclick="deleteMember('${doc.id}')" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading members: ", error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">ডাটা লোড করতে সমস্যা হয়েছে!</td></tr>';
    }
}

window.deleteMember = async function (id) {
    if (confirm('আপনি কি নিশ্চিত যে এই আবেদনটি মুছে ফেলতে চান?')) {
        await deleteDoc(doc(db, "members", id));
        loadMembers(); // মুছে ফেলার পর টেবিল আপডেট করা
    }
}