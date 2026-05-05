// Initialize empty arrays if local storage is empty
let notices = JSON.parse(localStorage.getItem('ark_notices')) || [];
let events = JSON.parse(localStorage.getItem('ark_events')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderNotices();
    renderEvents();
});

// Tab Switching Logic
function switchTab(tabId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Modal Logic
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    // Clear forms when opening
    if (modalId === 'notice-modal') document.getElementById('notice-form').reset();
    if (modalId === 'event-modal') document.getElementById('event-form').reset();

    document.getElementById(modalId + '-title').innerText = "নতুন এন্ট্রি যোগ করুন";
    document.getElementById(modalId.split('-')[0] + '-id').value = '';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ==========================================
// NOTICE CRUD OPERATIONS
// ==========================================
document.getElementById('notice-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('notice-id').value;
    const notice = {
        id: id ? id : Date.now().toString(),
        date: document.getElementById('notice-date').value,
        category: document.getElementById('notice-category').value,
        title: document.getElementById('notice-title').value,
        desc: document.getElementById('notice-desc').value
    };

    if (id) {
        // Update
        const index = notices.findIndex(n => n.id === id);
        notices[index] = notice;
    } else {
        // Add
        notices.unshift(notice); // Add to top
    }

    localStorage.setItem('ark_notices', JSON.stringify(notices));
    closeModal('notice-modal');
    renderNotices();
});

function renderNotices() {
    const tbody = document.querySelector('#notice-table tbody');
    tbody.innerHTML = '';
    notices.forEach(notice => {
        tbody.innerHTML += `
            <tr>
                <td>${notice.date}</td>
                <td><span style="background:#eee; padding:3px 8px; border-radius:5px; font-size:0.9rem;">${notice.category}</span></td>
                <td><strong>${notice.title}</strong></td>
                <td class="action-btns">
                    <button class="btn-edit" onclick="editNotice('${notice.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="deleteNotice('${notice.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function editNotice(id) {
    const notice = notices.find(n => n.id === id);
    document.getElementById('notice-id').value = notice.id;
    document.getElementById('notice-date').value = notice.date;
    document.getElementById('notice-category').value = notice.category;
    document.getElementById('notice-title').value = notice.title;
    document.getElementById('notice-desc').value = notice.desc;

    document.getElementById('notice-modal-title').innerText = "নোটিশ এডিট করুন";
    document.getElementById('notice-modal').style.display = 'block';
}

function deleteNotice(id) {
    if (confirm('আপনি কি নিশ্চিত যে এই নোটিশটি মুছে ফেলতে চান?')) {
        notices = notices.filter(n => n.id !== id);
        localStorage.setItem('ark_notices', JSON.stringify(notices));
        renderNotices();
    }
}

// ==========================================
// EVENT CRUD OPERATIONS
// ==========================================
document.getElementById('event-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('event-id').value;
    const eventObj = {
        id: id ? id : Date.now().toString(),
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
        title: document.getElementById('event-title').value,
        img: document.getElementById('event-img').value
    };

    if (id) {
        const index = events.findIndex(ev => ev.id === id);
        events[index] = eventObj;
    } else {
        events.unshift(eventObj);
    }

    localStorage.setItem('ark_events', JSON.stringify(events));
    closeModal('event-modal');
    renderEvents();
});

function renderEvents() {
    const tbody = document.querySelector('#event-table tbody');
    tbody.innerHTML = '';
    events.forEach(ev => {
        tbody.innerHTML += `
            <tr>
                <td>${ev.date}</td>
                <td>${ev.time}</td>
                <td><strong>${ev.title}</strong></td>
                <td class="action-btns">
                    <button class="btn-edit" onclick="editEvent('${ev.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" onclick="deleteEvent('${ev.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function editEvent(id) {
    const ev = events.find(e => e.id === id);
    document.getElementById('event-id').value = ev.id;
    document.getElementById('event-date').value = ev.date;
    document.getElementById('event-time').value = ev.time;
    document.getElementById('event-location').value = ev.location;
    document.getElementById('event-title').value = ev.title;
    document.getElementById('event-img').value = ev.img;

    document.getElementById('event-modal-title').innerText = "ইভেন্ট এডিট করুন";
    document.getElementById('event-modal').style.display = 'block';
}

function deleteEvent(id) {
    if (confirm('আপনি কি নিশ্চিত যে এই ইভেন্টটি মুছে ফেলতে চান?')) {
        events = events.filter(e => e.id !== id);
        localStorage.setItem('ark_events', JSON.stringify(events));
        renderEvents();
    }
}