// NGO-Connect - Main JavaScript File
console.log('✅ main.js is loading...');
const API_BASE = window.location.origin;

// Global variables
let currentLocation = null;

// Make functions globally available immediately
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.getLocation = getLocation;
window.submitReport = submitReport;

console.log('✅ Functions registered globally');

// Geolocation functionality
function getLocation() {
    console.log('Getting location...');
    const locationInput = document.getElementById('location');
    const latInput = document.getElementById('latitude');
    const longInput = document.getElementById('longitude');

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    locationInput.value = 'Detecting location...';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            latInput.value = lat;
            longInput.value = lng;

            // Reverse geocode to get address
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();
                locationInput.value = data.display_name || `${lat}, ${lng}`;
                currentLocation = {
                    latitude: lat,
                    longitude: lng,
                    address: data.display_name
                };
                console.log('Location detected:', currentLocation);
            } catch (error) {
                console.error('Error reverse geocoding:', error);
                locationInput.value = `${lat}, ${lng}`;
                currentLocation = {
                    latitude: lat,
                    longitude: lng,
                    address: `${lat}, ${lng}`
                };
            }
        },
        (error) => {
            console.error('Error getting location:', error);
            locationInput.value = 'Unable to detect location';

            let errorMsg = 'Unable to get your location. ';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Please allow location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out.';
                    break;
            }
            alert(errorMsg);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// Modal functions
function openReportModal() {
    console.log('✅ Opening report modal...');
    const modal = document.getElementById('reportModal');
    if (!modal) {
        console.error('❌ Report modal not found!');
        return;
    }
    modal.classList.add('active');

    const reportForm = document.getElementById('reportForm');
    const reportSuccess = document.getElementById('reportSuccess');

    if (reportForm) reportForm.style.display = 'block';
    if (reportSuccess) reportSuccess.style.display = 'none';

    // Auto-get location when modal opens
    setTimeout(() => {
        getLocation();
    }, 500);
}

function closeReportModal() {
    console.log('Closing report modal...');
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('active');
    }

    const form = document.querySelector('#reportForm form');
    if (form) {
        form.reset();
    }
    currentLocation = null;
}

function openAuthModal(type) {
    console.log('✅ Opening auth modal:', type);
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authTitle');
    const switchText = document.getElementById('authSwitch');

    if (!modal) {
        console.error('❌ Auth modal not found!');
        return;
    }

    modal.classList.add('active');

    if (type === 'login') {
        if (title) title.textContent = 'Login';
        if (switchText) {
            switchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="openAuthModal(\'signup\'); return false;" class="text-red-600 font-semibold">Sign Up</a>';
        }
    } else if (type === 'signup') {
        if (title) title.textContent = 'Sign Up';
        if (switchText) {
            switchText.innerHTML = 'Already have an account? <a href="#" onclick="openAuthModal(\'login\'); return false;" class="text-red-600 font-semibold">Login</a>';
        }
    } else if (type === 'ngo') {
        if (title) title.textContent = 'NGO Login';
        const userTypeSelect = document.getElementById('userType');
        if (userTypeSelect) userTypeSelect.value = 'animal-ngo';
        if (switchText) {
            switchText.innerHTML = 'Civilian? <a href="#" onclick="openAuthModal(\'login\'); return false;" class="text-red-600 font-semibold">Login here</a>';
        }
    }
}

function closeAuthModal() {
    console.log('Closing auth modal...');
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Submit report form
async function submitReport(event) {
    event.preventDefault();
    console.log('Submitting report...');

    const photo = document.getElementById('animalPhoto').files[0];
    const description = document.getElementById('description').value;
    const animalType = document.getElementById('animalType').value;
    const contact = document.getElementById('contact').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (!latitude || !longitude) {
        alert('Please get your location first by clicking "Get Location" button');
        return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);
    formData.append('animalType', animalType);
    formData.append('contact', contact);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('location', currentLocation.address);

    try {
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // API call to backend
        const response = await fetch(`${API_BASE}/api/reports`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to submit report');
        }

        const data = await response.json();
        console.log('✅ Report submitted successfully:', data);
        localStorage.setItem('lastReportId', data.report.reportId);

        // Show success message
        document.getElementById('reportForm').style.display = 'none';
        document.getElementById('reportSuccess').style.display = 'block';

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        console.error('❌ Error submitting report:', error);
        alert('Failed to submit report. Please check if the backend server is running on http://localhost:5000');

        const submitBtn = event.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Submit Report 🚨';
            submitBtn.disabled = false;
        }
    }
}

// Auth form submission
function setupAuthForm() {
    const authForm = document.getElementById('authForm');
    if (!authForm) return;

    authForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;

        if (userType !== 'animal-ngo') {
            alert('Only NGO login implemented now');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/ngos/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Login failed');
                return;
            }

            // SAVE NGO ID
            localStorage.setItem('ngoId', data.ngo.ngoId);

            // REDIRECT TO DASHBOARD
            window.location.href = 'dashboard-animal-ngo.html';

        } catch (err) {
            alert('Server not running. Start backend first.');
        }
    });
}


// Close modals when clicking outside
window.onclick = function (event) {
    const reportModal = document.getElementById('reportModal');
    const authModal = document.getElementById('authModal');

    if (event.target === reportModal) {
        closeReportModal();
    }
    if (event.target === authModal) {
        closeAuthModal();
    }
}

// Smooth scroll for navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ NGO-Connect initialized');
    console.log('✅ DOM loaded, setting up...');

    setupAuthForm();
    setupSmoothScroll();

    // Verify critical functions are available
    console.log('Functions check:');
    console.log('- openReportModal:', typeof window.openReportModal);
    console.log('- openAuthModal:', typeof window.openAuthModal);
    console.log('- getLocation:', typeof window.getLocation);

    // Check if geolocation is available
    if (!navigator.geolocation) {
        console.warn('⚠️ Geolocation is not supported by this browser');
    }

    console.log('✅ All systems ready!');
});
document.addEventListener('DOMContentLoaded', () => {
    setupAuthForm();
});
async function checkReportStatus() {
    const reportId = localStorage.getItem('reportId');
    if (!reportId) return;

    try {
        const res = await fetch(`${API_BASE}/api/reports/${reportId}`);
        if (!res.ok) return;

        const data = await res.json();

        if (data.report.status === 'assigned') {
            alert(`Your report was accepted by ${data.report.assignedNGOName}`);
            localStorage.removeItem('reportId'); // alert ek hi baar aaye
        }

    } catch (err) {
        console.error('Status check failed', err);
    }
}



console.log('✅ main.js loaded completely');