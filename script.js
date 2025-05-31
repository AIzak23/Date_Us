// Store the date details
let dateDetails = {
    date: '',
    time: '',
    place: '',
    dateType: ''
};

// Handle Modals
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('scale-100');
    }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.querySelector('.modal-content').classList.remove('scale-100');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        // Only proceed to page 2 after clicking Okay on crush modal
        if (modalId === 'crushModal') {
            goToPage(2);
        }
    }, 300);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.querySelector('.modal-content').classList.remove('scale-100');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        
        // Reset all data
        dateDetails = {
            date: '',
            time: '',
            place: '',
            dateType: ''
        };

        // Reset all form inputs
        document.getElementById('dateInput').value = '';
        document.getElementById('timeInput').value = '';

        // Remove all selection highlights
        document.querySelectorAll('.selected-place').forEach(el => {
            el.classList.remove('selected-place');
            el.querySelector('.inset-0').classList.remove('from-pink-500/70');
            el.querySelector('.inset-0').classList.add('from-black/70');
        });

        document.querySelectorAll('.selected-type').forEach(el => {
            el.classList.remove('selected-type');
            el.classList.remove('ring-4', 'ring-pink-500', 'ring-opacity-50');
        });

        // Go back to first page only when Close button is clicked
        goToPage(1);
    }, 300);
}

// Handle the "No" button movement
document.addEventListener('DOMContentLoaded', function() {
    const noBtn = document.getElementById('noBtn');
    
    noBtn.addEventListener('mouseover', function() {
        // Calculate new position
        const maxX = window.innerWidth - this.offsetWidth;
        const maxY = window.innerHeight - this.offsetHeight;
        
        let newX = Math.random() * maxX;
        let newY = Math.random() * maxY;
        
        // Ensure button stays within viewport
        newX = Math.min(Math.max(0, newX), maxX);
        newY = Math.min(Math.max(0, newY), maxY);
        
        // Apply new position
        this.style.position = 'fixed';
        this.style.left = `${newX}px`;
        this.style.top = `${newY}px`;
        this.style.transform = 'translate(0, 0)'; // Reset any existing transform
    });
});

// Navigation between pages
function goToPage(pageNumber, event) {
    if (event) {
        event.preventDefault();
    }

    // Validate required fields before proceeding
    if (pageNumber > 2) {
        if (pageNumber === 3 && (!dateDetails.date || !dateDetails.time)) {
            alert('Please select both date and time!');
            return;
        }
        if (pageNumber === 4 && !dateDetails.place) {
            alert('Please select a place!');
            return;
        }
        if (pageNumber === 5 && !dateDetails.dateType) {
            alert('Please select a date type!');
            return;
        }
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });

    // Show the selected page
    const selectedPage = document.getElementById(`page${pageNumber}`);
    selectedPage.classList.remove('hidden');
    selectedPage.classList.add('active');

    // If it's the confirmation page, update the details
    if (pageNumber === 5) {
        updateConfirmationDetails();
    }
}

// Handle place selection
function selectPlace(place, event) {
    if (event) {
        event.preventDefault();
    }
    
    dateDetails.place = place;
    // Remove highlight from all buttons
    document.querySelectorAll('#page3 button').forEach(btn => {
        if (btn.classList.contains('selected-place')) {
            btn.classList.remove('selected-place');
            btn.querySelector('.inset-0').classList.remove('from-pink-500/70');
            btn.querySelector('.inset-0').classList.add('from-black/70');
        }
    });
    
    // Add highlight to selected button
    const selectedBtn = event ? event.currentTarget : document.querySelector(`button[onclick*="${place}"]`);
    selectedBtn.classList.add('selected-place');
    selectedBtn.querySelector('.inset-0').classList.remove('from-black/70');
    selectedBtn.querySelector('.inset-0').classList.add('from-pink-500/70');
}

// Custom place input
document.addEventListener('DOMContentLoaded', function() {
    const placeInput = document.getElementById('placeInput');
    if (placeInput) {
        placeInput.addEventListener('input', function() {
            dateDetails.place = this.value;
        });
    }
});

// Handle date type selection
function selectDateType(type, event) {
    if (event) {
        event.preventDefault();
    }
    dateDetails.dateType = type;
    document.querySelectorAll('#page4 button').forEach(btn => {
        if (btn.classList.contains('selected-type')) {
            btn.classList.remove('selected-type');
            btn.classList.remove('ring-4', 'ring-pink-500', 'ring-opacity-50');
        }
    });
    
    const selectedBtn = event.currentTarget;
    selectedBtn.classList.add('selected-type');
    selectedBtn.classList.add('ring-4', 'ring-pink-500', 'ring-opacity-50');
}

// Store date and time
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');

    if (dateInput) {
        dateInput.addEventListener('change', function() {
            dateDetails.date = this.value;
        });
    }

    if (timeInput) {
        timeInput.addEventListener('change', function() {
            dateDetails.time = this.value;
        });
    }
});

// Update confirmation details
function updateConfirmationDetails() {
    // Format the date nicely
    const formattedDate = new Date(dateDetails.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    // Format the time nicely
    const formattedTime = new Date(`2000-01-01T${dateDetails.time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    // Update the confirmation page
    document.getElementById('confirmDate').textContent = formattedDate;
    document.getElementById('confirmTime').textContent = formattedTime;
    document.getElementById('confirmPlace').textContent = dateDetails.place;
    document.getElementById('confirmType').textContent = dateDetails.dateType;

    // Update images
    document.getElementById('placeImage').src = `img/places/${dateDetails.place.toLowerCase()}.jpg`;
    document.getElementById('typeImage').src = `img/type/${dateDetails.dateType.toLowerCase().replace(' ', '')}.jpg`;
}

// Handle final confirmation
function confirmDate() {
    // Validate that we have all required details
    if (!dateDetails.date || !dateDetails.time || !dateDetails.place || !dateDetails.dateType) {
        alert('Please make sure all details are filled out!');
        return;
    }

    // Create URL parameters
    const params = new URLSearchParams();
    params.append('date', dateDetails.date);
    params.append('time', dateDetails.time);
    params.append('place', dateDetails.place);
    params.append('dateType', dateDetails.dateType);

    // Force navigation to success.html
    document.location.href = 'success.html?' + params.toString();
}

// Start over function
function startOver() {
    // Ask for confirmation before starting over
    const wantToStartOver = confirm('Are you sure you want to plan a new date? The current confirmation will be cleared.');
    
    if (!wantToStartOver) {
        return; // Stay on success page if user cancels
    }

    // Reset all data
    dateDetails = {
        date: '',
        time: '',
        place: '',
        dateType: ''
    };

    // Reset all form inputs
    document.getElementById('dateInput').value = '';
    document.getElementById('timeInput').value = '';

    // Remove all selection highlights
    document.querySelectorAll('.selected-place').forEach(el => {
        el.classList.remove('selected-place');
        el.querySelector('.inset-0').classList.remove('from-pink-500/70');
        el.querySelector('.inset-0').classList.add('from-black/70');
    });

    document.querySelectorAll('.selected-type').forEach(el => {
        el.classList.remove('selected-type');
        el.classList.remove('ring-4', 'ring-pink-500', 'ring-opacity-50');
    });

    // Go back to first page
    goToPage(1);
} 