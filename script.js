document.addEventListener('DOMContentLoaded', () => {
    const detailsFile = 'schedule_details';
    let details = {};

    // Initialize details object
    const initDetails = () => {
        const storedDetails = localStorage.getItem(detailsFile);
        if (storedDetails) {
            details = JSON.parse(storedDetails);
        } else {
            details = { "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": [] };
        }
    };

    // Save details to localStorage
    const saveDetails = () => {
        const selectedDay = document.getElementById('day').value;
        const subject = document.getElementById('subject').value;
        const code = document.getElementById('code').value;
        const room = document.getElementById('room').value;
        const time = document.getElementById('time').value;
        const professor = document.getElementById('professor').value;

        if (subject && code && room && time && professor) {
            details[selectedDay].push({ subject, code, room, time, professor });
            localStorage.setItem(detailsFile, JSON.stringify(details));
            clearEntries();
        } else {
            alert('Please fill in all fields.');
        }
    };

    // Clear input fields
    const clearEntries = () => {
        document.getElementById('subject').value = '';
        document.getElementById('code').value = '';
        document.getElementById('room').value = '';
        document.getElementById('time').value = '';
        document.getElementById('professor').value = '';
    };

    // Toggle visibility of the day buttons
    const toggleDayButtons = () => {
        const buttonContainer = document.getElementById('button-container');
        
        if (buttonContainer.style.display === 'none' || buttonContainer.style.display === '') {
            showDayButtons();
        } else {
            buttonContainer.style.display = 'none';
        }
    };

    // Show the day buttons
    const showDayButtons = () => {
        const container = document.getElementById('details-container');
        container.innerHTML = '';

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'button-container';
        container.appendChild(buttonContainer);

        Object.keys(details).forEach(day => {
            const button = document.createElement('button');
            button.textContent = day;
            button.className = 'day-button';
            button.addEventListener('click', () => showDayDetails(day));
            buttonContainer.appendChild(button);
        });

        buttonContainer.style.display = 'block';
        container.style.display = 'block';
    };

    // Show details of a selected day
    const showDayDetails = (day) => {
        const container = document.getElementById('details-container');
        container.innerHTML = '';
        container.classList.add('details-overlay');

        const detailsBox = document.createElement('div');
        detailsBox.className = 'details-box';
        container.appendChild(detailsBox);

        const header = document.createElement('h2');
        header.textContent = `${day} Schedule`;
        detailsBox.appendChild(header);

        const dayDetails = details[day];
        if (dayDetails.length > 0) {
            dayDetails.forEach((entry, index) => {
                const detail = document.createElement('div');
                detail.className = 'entry-detail';
                detail.innerHTML = `
                    <p><strong>Subject:</strong> ${entry.subject}</p>
                    <p><strong>Code:</strong> ${entry.code}</p>
                    <p><strong>Room:</strong> ${entry.room}</p>
                    <p><strong>Time:</strong> ${entry.time}</p>
                    <p><strong>Professor:</strong> ${entry.professor}</p>
                    <button class="delete-btn" data-day="${day}" data-index="${index}">Delete</button>
                `;
                detailsBox.appendChild(detail);
            });
        } else {
            const noDetails = document.createElement('p');
            noDetails.textContent = 'No details for this day';
            detailsBox.appendChild(noDetails);
        }

        // Add a close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.classList.add('close-btn');
        closeButton.addEventListener('click', () => {
            container.classList.remove('details-overlay');
            container.innerHTML = '';
            toggleDayButtons(); // Toggle the day buttons visibility again
        });
        detailsBox.appendChild(closeButton);

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const day = e.target.dataset.day;
                const index = e.target.dataset.index;
                if (confirm('Are you sure you want to delete this entry?')) {
                    details[day].splice(index, 1); // Remove the entry
                    localStorage.setItem(detailsFile, JSON.stringify(details)); // Save updated details
                    showDayDetails(day); // Refresh the view
                }
            });
        });
    };

    // Initialize application
    initDetails();
    document.getElementById('save-btn').addEventListener('click', saveDetails);
    document.getElementById('view-btn').addEventListener('click', toggleDayButtons);
});
