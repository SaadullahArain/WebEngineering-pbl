const sideMenu = document.querySelector("aside");
const themeToggler = document.querySelector(".theme-toggler");
const nextDay = document.getElementById('nextDay');
const prevDay = document.getElementById('prevDay');
const photoUpload = document.getElementById('photo-upload');
const currentDate = document.getElementById('current-date');

if (sideMenu) {
    window.onscroll = () => {
        sideMenu.classList.remove('active');
        if(window.scrollY > 0){
            document.querySelector('header').classList.add('active');
        } else {
            document.querySelector('header').classList.remove('active');
        }
    }
}

// Theme Management
function applyTheme(theme) {
    if (theme === 'dark-theme') {
        document.body.classList.add('dark-theme');
        if (themeToggler) {
            themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
            themeToggler.querySelector('span:nth-child(2)').classList.add('active');
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggler) {
            themeToggler.querySelector('span:nth-child(1)').classList.add('active');
            themeToggler.querySelector('span:nth-child(2)').classList.remove('active');
        }
    }
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    applyTheme(savedTheme);
}

// Theme toggle handler
if (themeToggler) {
    themeToggler.addEventListener('click', function() {
        const newTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Initialize theme immediately and on DOM content loaded
initTheme();
document.addEventListener('DOMContentLoaded', initTheme);

// Profile Image Change Functionality
function handleProfileImageChange() {
    const photoUpload = document.getElementById('photo-upload');
    if (photoUpload) {
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size should be less than 5MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    // Update all profile photos on the page
                    const profilePhotos = document.querySelectorAll('.profile-photo img, .profile-photo-large img');
                    profilePhotos.forEach(photo => {
                        photo.src = e.target.result;
                    });
                    
                    // Save to localStorage
                    localStorage.setItem('profileImage', e.target.result);
                }
                reader.readAsDataURL(file);
            }
        });
    }
}

// Load saved profile image
function loadSavedProfileImage() {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        const profilePhotos = document.querySelectorAll('.profile-photo img, .profile-photo-large img');
        profilePhotos.forEach(photo => {
            photo.src = savedImage;
        });
    }
}

// Initialize profile image functionality
document.addEventListener('DOMContentLoaded', function() {
    handleProfileImageChange();
    loadSavedProfileImage();
});

// Set current date
if (currentDate) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDate.textContent = today.toLocaleDateString('en-US', options);
}

let setData = (day) =>{
    document.querySelector('table tbody').innerHTML = ' '; //To clear out previous table data;  
    let daylist = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    document.querySelector('.timetable-header h2').innerHTML = `${daylist[day]}'s Schedule`;
    switch(day){
        case(0): day = Sunday; break;
        case(1): day = Monday; break;
        case(2): day = Tuesday; break;
        case(3): day = Wednesday; break;
        case(4): day = Thursday; break;
        case(5): day = Friday; break;
        case(6): day = Saturday; break;
    }

    day.forEach(sub => {
        const tr = document.createElement('tr');
        const trContent = `
                            <td>${sub.time}</td>
                            <td>${sub.roomNumber}</td>
                            <td>${sub.subject}</td>
                            <td><span class="badge ${sub.type.toLowerCase()}">${sub.type}</span></td>
                        `
        tr.innerHTML = trContent;
        document.querySelector('table tbody').appendChild(tr)                        
    });
}

let now = new Date();
let today = now.getDay(); // Will return the present day in numerical value;
let day = today; //To prevent the today value from changing;

function timeTableAll(){
    document.getElementById('timetable').classList.toggle('active');
    setData(today);
    document.querySelector('.timetable-header h2').innerHTML = "Today's Schedule";
}
nextDay.onclick = function() {
    day<=5 ? day++ : day=0;  // If else one liner
    setData(day);
}
prevDay.onclick = function() {
    day>=1 ? day-- : day=6;    
    setData(day);
}

setData(day); //To set the data in the table on loading window.
document.querySelector('.timetable-header h2').innerHTML = "Today's Schedule"; //To prevent overwriting the heading on loading;
// Logout functionality
const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'login.html';
    });
}

// Mobile Menu Functionality
const menuToggle = document.querySelector('.menu-toggle');
const aside = document.querySelector('aside');

if (menuToggle && aside) {
    // Prevent default touch behavior
    menuToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });

    // Toggle menu on click/touch
    menuToggle.addEventListener('click', () => {
        aside.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = aside.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!aside.contains(e.target) && !menuToggle.contains(e.target)) {
            aside.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    const asideLinks = aside.querySelectorAll('a');
    asideLinks.forEach(link => {
        link.addEventListener('click', () => {
            aside.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Handle touch events for smooth scrolling
    aside.addEventListener('touchmove', (e) => {
        if (aside.scrollHeight <= aside.clientHeight) {
            e.preventDefault();
        }
    }, { passive: false });
}

